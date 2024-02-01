import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { removeUser } from "../store/slices/authSlice";
import { openQuiz, toggleShareModal, setData } from "../store/slices/quizSlice";
import { createQuiz } from "../requests/quiz";
import classes from "./Sidebar.module.css";
import Modal from "./Modal";
import Loader from "./Loader";
import CreateQuiz from "./CreateQuiz";

function Sidebar() {
  const [tab, setTab] = useState("dashboard");
  const [quizNameInput, setQuizNameInput] = useState({ value: "", error: "" });
  const [quizType, setQuizType] = useState("qna");
  const [loader, setLoader] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const { data, shareQuizModal } = useSelector((state) => state.quiz);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/analytics") {
      setTab("analytics");
    } else {
      setTab("dashboard");
    }
  }, []);

  function logout() {
    localStorage.removeItem("user");
    Cookies.remove("token");
    toast.success("Logged Out Successfully!");
    dispatch(removeUser());
    navigate("/");
  }

  function changeTab(newTab) {
    setTab(newTab);
  }

  function closeQuizModal() {
    setQuizNameInput({ value: "", error: "" });
    setQuizType("qna");
    setOpenModal(false);
  }

  async function createQuizHandler(e) {
    e.preventDefault();

    if (!quizNameInput.value) {
      setQuizNameInput({ ...quizNameInput, error: "Quiz name is required" });
      return;
    }

    const payload = {
      name: quizNameInput.value,
      type: quizType,
    };

    setLoader(true);
    const { data, error } = await createQuiz(payload);
    if (error) {
      toast.error(data);
    } else {
      dispatch(openQuiz());
      dispatch(setData(data.quiz));
    }

    setLoader(false);
    closeQuizModal();
  }

  async function shareQuizHandler(e) {
    e.preventDefault();

    await navigator.clipboard.writeText(data.url);

    toast.success("url is copied to clipboard!");

    setTimeout(() => {
      dispatch(toggleShareModal(false));
      dispatch(setData(null));
    }, 1000);
  }

  return (
    <>
      <aside className={classes.sidebar}>
        <Link to="/dashboard" className={classes.brand}>
          QUIZZIE
        </Link>

        <ul className={classes["sidebar_links-container"]}>
          <li
            className={`${classes["sidebar_links-item"]} ${
              tab === "dashboard" && classes["sidebar-link-active"]
            }`}
          >
            <Link
              to="/dashboard"
              className={classes["sidebar_link"]}
              onClick={changeTab.bind(null, "dashboard")}
            >
              Dashboard
            </Link>
          </li>
          <li
            className={`${classes["sidebar_links-item"]} ${
              tab === "analytics" && classes["sidebar-link-active"]
            }`}
          >
            <Link
              to="/analytics"
              className={classes["sidebar_link"]}
              onClick={changeTab.bind(null, "analytics")}
            >
              Analytics
            </Link>
          </li>
          <li
            className={`${classes["sidebar_links-item"]} ${
              tab === "quiz" && classes["sidebar-link-active"]
            }`}
          >
            <button
              className={classes["sidebar_link"]}
              onClick={() => {
                changeTab("quiz");
                setOpenModal(true);
                dispatch(setData(null));
              }}
            >
              Create Quiz
            </button>
          </li>
        </ul>

        <div>
          <div className={classes.logout_container}></div>
          <button className={classes.logout} onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      {/* quiz type modal */}
      {openModal && (
        <Modal>
          <form onSubmit={createQuizHandler}>
            <div className={classes["create-quiz-modal"]}>
              {/* input */}
              <input
                type="text"
                placeholder="Quiz name"
                className={`${classes["quiz-name"]} ${
                  quizNameInput.error ? "input-error" : ""
                }`}
                value={
                  quizNameInput.error
                    ? quizNameInput.error
                    : quizNameInput.value
                }
                onChange={(e) =>
                  setQuizNameInput({
                    value: e.target.value,
                    error: "",
                  })
                }
                onFocus={() => {
                  setQuizNameInput({ ...quizNameInput, error: "" });
                }}
              />

              {/* type */}
              <div className={classes["quiz-type"]}>
                <label>Quiz Type</label>
                <button
                  role="button"
                  type="button"
                  className={quizType === "qna" && classes["quiz-type-active"]}
                  onClick={() => setQuizType("qna")}
                >
                  Q & A
                </button>
                <button
                  role="button"
                  type="button"
                  className={quizType === "poll" && classes["quiz-type-active"]}
                  onClick={() => setQuizType("poll")}
                >
                  Poll Type
                </button>
              </div>

              {/* btns */}
              <div className={classes["modal-btns"]}>
                <button
                  className={`${classes["btn"]} ${classes["btn-secondary"]}`}
                  role="button"
                  type="button"
                  onClick={closeQuizModal}
                >
                  Cancel
                </button>
                <button
                  className={`${classes["btn"]} ${classes["btn-primary"]}`}
                >
                  Continue {loader && <Loader />}
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* create quiz modal */}
      <CreateQuiz />

      {/* share quiz */}
      {shareQuizModal && (
        <Modal>
          <form onSubmit={shareQuizHandler}>
            <div className={classes["share-modal"]}>
              <h5>Congrats Your Quiz Is Published!</h5>

              <p>{data.url}</p>

              <div className={`${classes["modal-btns"]} justify-center mt-3`}>
                <button
                  className={`${classes["btn"]} ${classes["btn-primary"]}`}
                >
                  Share
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

export default Sidebar;
