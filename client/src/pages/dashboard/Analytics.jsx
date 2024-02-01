import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { BiSolidTrash, BiSolidEdit } from "react-icons/bi";
import { BsShareFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";

import classes from "./Analytics.module.css";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import { deleteQuiz, getAllQuizzes } from "../../requests/quiz";
import {
  openQuiz,
  toggleShareModal,
  setData,
} from "../../store/slices/quizSlice";

function Analytics() {
  const [loader, setLoader] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [quiz, setQuiz] = useState({});
  const [deleteQuizModal, setDeleteQuizModal] = useState(false);

  const { modal } = useSelector((state) => state.quiz);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!modal) getQuizzes();
  }, [modal]);

  async function getQuizzes() {
    setLoader(true);
    const { data, error } = await getAllQuizzes();
    setLoader(false);
    if (error) {
      toast.error(data);
    } else {
      setQuizzes(data.quizzes);
    }
  }

  async function deleteQuizHandler(e) {
    e.preventDefault();
    setLoader(true);
    const { data, error } = await deleteQuiz(quiz._id);
    if (error) {
      toast.error(data);
    } else {
      toast.success(data.msg);
    }

    setDeleteQuizModal(false);
    await getQuizzes();
    setLoader(false);
  }

  return (
    <>
      <div className={classes.analytics}>
        <h1 className={classes["analytics_heading"]}>Quiz Analysis</h1>

        {loader ? (
          <div>
            <Loader />
          </div>
        ) : (
          <table className={classes["table"]}>
            <thead className={classes["thead"]}>
              <tr className={classes["table_head_row"]}>
                <th>S.No</th>
                <th>Quiz Name</th>
                <th>Created on</th>
                <th>Impressions</th>
                <th>Impressions</th>
                <th>Impressions</th>
              </tr>
            </thead>
            <tbody className={classes["tbody"]}>
              {quizzes.map((quiz, i) => (
                <tr key={quiz._id}>
                  <td>{i + 1}</td>
                  <td>{quiz.name}</td>
                  <td>
                    {new Date(quiz.createdAt).toLocaleDateString("en-us", {
                      dateStyle: "medium",
                    })}
                  </td>
                  <td>{quiz.impressions}</td>
                  <td className="flex items-center justify-center gap-2">
                    <BiSolidEdit
                      className="text-lg icon-edit cursor-pointer"
                      onClick={() => {
                        dispatch(openQuiz());
                        dispatch(setData(quiz));
                        dispatch(toggleShareModal(false));
                      }}
                    />
                    <BiSolidTrash
                      className="text-lg icon-delete cursor-pointer"
                      onClick={() => {
                        setQuiz(quiz);
                        setDeleteQuizModal(true);
                      }}
                    />
                    <BsShareFill
                      className="text-md icon-share cursor-pointer"
                      onClick={() => {
                        dispatch(setData(quiz));
                        dispatch(toggleShareModal(true));
                      }}
                    />
                  </td>
                  <td>
                    <Link
                      to={`/analytics/${quiz.slug}`}
                      className={classes["question_analysis"]}
                    >
                      Question Wise Analysis
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* delete */}
      {deleteQuizModal && (
        <Modal>
          <form onSubmit={deleteQuizHandler}>
            <div className={classes["delete-modal"]}>
              <h5>Are you confirm you want to delete?</h5>

              <div className={classes["delete-modal-btns"]}>
                <button
                  className={`${classes["btn"]} ${classes["btn-primary"]}`}
                >
                  Confirm {loader && <Loader />}
                </button>
                <button
                  className={`${classes["btn"]} ${classes["btn-secondary"]}`}
                  onClick={() => setDeleteQuizModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

export default Analytics;
