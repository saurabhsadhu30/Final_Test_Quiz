import { useState, useEffect } from "react";
import { BsPlusLg } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { BiSolidTrash } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";

import Modal from "./Modal";
import classes from "./CreateQuiz.module.css";
import Loader from "./Loader";
import {
  closeQuiz,
  toggleShareModal,
  setData,
} from "../store/slices/quizSlice";
import { createQuestions, updateQuestions } from "../requests/quiz";

const initialQuestionObj = {
  question: "",
  order: 1,
  optionType: "text",
  options: [
    {
      text: "",
      image: "",
      isCorrect: false,
      order: 1,
    },
  ],
  timer: 0,
};

function CreateQuiz() {
  const [updateQuiz, setUpdateQuiz] = useState(false);
  const [quiz, setQuiz] = useState({});
  const [questionObj, setQuestionObj] = useState(initialQuestionObj);
  const [questions, setQuestions] = useState([initialQuestionObj]);
  const [loader, setLoader] = useState(false);

  const { modal, data } = useSelector((state) => state.quiz);
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      setQuiz(data);
      if (data?.questions?.length > 0) {
        setQuestions(data?.questions);
        setQuestionObj(data?.questions[0]);
        setUpdateQuiz(true);
      } else {
        setQuestions([initialQuestionObj]);
        setQuestionObj(initialQuestionObj);
        setUpdateQuiz(false);
      }
    } else {
      setQuiz({});
    }
  }, [data]);

  useEffect(() => {
    const questionIndex = [...questions].findIndex(
      (que) => que.order === questionObj.order
    );

    if (questionIndex >= 0) {
      const prevQuestions = [...questions];
      prevQuestions[questionIndex] = questionObj;

      setQuestions(prevQuestions);
    }
  }, [questionObj]);

  function isValidField() {
    if (!questionObj.question) {
      toast.error("Please Enter Question!");
      return false;
    } else if (
      questionObj.optionType === "text" &&
      questionObj.options.every((option) => option.text === "")
    ) {
      toast.error("Please Enter All Text Options");
      return false;
    } else if (
      questionObj.optionType === "image" &&
      questionObj.options.every((option) => option.image === "")
    ) {
      toast.error("Please Enter All Image Options");
      return false;
    } else if (
      questionObj.optionType === "textImage" &&
      questionObj.options.every(
        (option) => option.image === "" && option.text === ""
      )
    ) {
      toast.error("Please Enter All Text And Image Options");
      return false;
    }

    return true;
  }

  function addQuestion() {
    if (questions.length >= 5) {
      return toast.error("Maximum 5 questions allowed");
    }

    if (!isValidField()) return;

    const newQueObj = { ...initialQuestionObj, order: questions.length + 1 };

    setQuestionObj(newQueObj);
    setQuestions((prev) => [...prev, newQueObj]);
  }

  const removeQuestion = (id) => {
    const newQuestions = questions
      .filter((q) => q.order !== id)
      .map((q, i) => ({ ...q, order: i + 1 }));
    const questionObj = questions[id - 2];

    setQuestions(newQuestions);
    setTimeout(() => {
      setQuestionObj(questionObj);
    }, 100);
  };
  const addOption = () => {
    const options = [...questionObj.options];
    if (options.length >= 4) {
      return toast.error("Maximum 4 options allowed!");
    }

    options.push({
      text: "",
      image: "",
      isCorrect: false,
      order: options.length + 1,
    });

    setQuestionObj((prev) => ({ ...prev, options }));
  };

  const deleteOption = (id) => {
    const options = [
      ...questionObj.options.filter((option) => option.order !== id),
    ];
    setQuestionObj((prev) => ({ ...prev, options }));
  };

  const setCorrectOption = (id) => {
    const options = [...questionObj.options];
    const optionIndex = options.findIndex((opt) => opt.order === id);

    // set every option to incorrect
    for (let i = 0; i < options.length; i++) {
      options[i] = {
        ...options[i],
        isCorrect: false,
      };
    }

    const option = options[optionIndex];
    option.isCorrect = true;
    options[optionIndex] = option;

    setQuestionObj((prev) => ({ ...prev, options }));
  };

  const setTimer = (timer) => {
    setQuestionObj((prev) => ({ ...prev, timer }));
  };

  async function createQuizHandler(e) {
    e.preventDefault();
    if (questions.length === 0) return;

    let isValid = true;

    questions.forEach((data) => {
      if (!data.question) {
        toast.error(`Please Enter Question At Question ${data.order}`);
        isValid = false;
      } else if (
        data.optionType === "text" &&
        data.options.every((option) => option.text === "")
      ) {
        toast.error(`Please Enter All Text Options At Question ${data.order}`);

        isValid = false;
      } else if (
        data.optionType === "image" &&
        data.options.every((option) => option.image === "")
      ) {
        toast.error(`Please Enter All Image Options At Question ${data.order}`);
        isValid = false;
      } else if (
        data.optionType === "textImage" &&
        data.options.every(
          (option) => option.image === "" && option.text === ""
        )
      ) {
        toast.error(
          `Please Enter All Text And Image Options At Question ${data.order}`
        );
        isValid = false;
      }
      if (quiz.type === "qna") {
        // choose correct option
        if (data.options.every((option) => option.isCorrect === false)) {
          toast.error(`Please Choose Correct Option At Question ${data.order}`);
          isValid = false;
        }
      }
    });

    if (!isValid) return;

    const payload = {
      quizId: quiz._id,
      questions,
    };
    setLoader(true);
    const { data, error } = updateQuiz
      ? await updateQuestions(payload)
      : await createQuestions(payload);
    setLoader(false);
    if (error) {
      toast.error(data);
    } else {
      toast.success(`Quiz ${updateQuiz ? "Updated" : "Created"} Successfully!`);
      dispatch(closeQuiz());
      if (data?.quiz) {
        dispatch(setData(data.quiz));
      } else {
        dispatch(setData(quiz));
      }
      dispatch(toggleShareModal(true));
      setQuestionObj(initialQuestionObj);
      setQuestions([initialQuestionObj]);
    }
  }

  return (
    <>
      {/* create quiz */}
      {modal && (
        <Modal className="modal-lg">
          <form onSubmit={createQuizHandler}>
            <div className={classes["quiz_container"]}>
              <div className="flex justify-between items-center">
                {/* total questions */}
                <div className={classes["total_questions"]}>
                  {questions.map((question) => (
                    <div
                      key={question.order}
                      className={classes["question_number"]}
                      onClick={(e) => {
                        if (e.target.id !== "remove") setQuestionObj(question);
                      }}
                    >
                      <span className={classes["question_number_text"]}>
                        {question.order}
                      </span>
                      {question.order > 1 && (
                        <span
                          id="remove"
                          className={classes["delete_question"]}
                          onClick={removeQuestion.bind(null, question.order)}
                        >
                          <RxCross2 className="text-xl" />
                        </span>
                      )}
                    </div>
                  ))}

                  {/* plus */}
                  {questions.length < 5 && (
                    <div
                      className={classes["add_question"]}
                      onClick={addQuestion}
                    >
                      <BsPlusLg className="text-2xl font-bold" />
                    </div>
                  )}
                </div>
                {/* max questions */}

                <div className={classes["max_questions"]}>Max 5 Questions</div>
              </div>

              {/* question input */}
              <input
                type="text"
                placeholder="Question"
                className={classes["question-text"]}
                value={questionObj.question}
                onChange={(e) =>
                  setQuestionObj({ ...questionObj, question: e.target.value })
                }
              />

              {/* option type */}
              <div className={classes["option_type"]}>
                <label>Option Type</label>

                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="text"
                    className={`${classes["input-radio"]} ${
                      questionObj.optionType === "text" &&
                      classes["input-radio-active"]
                    }`}
                    onClick={() => {
                      setQuestionObj((prev) => ({
                        ...prev,
                        optionType: "text",
                        options: [
                          {
                            text: "",
                            image: "",
                            isCorrect: false,
                            order: 1,
                          },
                        ],
                      }));
                    }}
                  />
                  <label htmlFor="text">Text</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="image"
                    className={`${classes["input-radio"]} ${
                      questionObj.optionType === "image" &&
                      classes["input-radio-active"]
                    }`}
                    onClick={() => {
                      setQuestionObj({
                        ...questionObj,
                        optionType: "image",
                        options: [
                          {
                            text: "",
                            image: "",
                            isCorrect: false,
                            order: 1,
                          },
                        ],
                      });
                    }}
                  />
                  <label htmlFor="image">Image URL</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="text-image"
                    className={`${classes["input-radio"]} ${
                      questionObj.optionType === "textImage" &&
                      classes["input-radio-active"]
                    }`}
                    onClick={() => {
                      setQuestionObj({
                        ...questionObj,
                        optionType: "textImage",
                        options: [
                          {
                            text: "",
                            image: "",
                            isCorrect: false,
                            order: 1,
                          },
                        ],
                      });
                    }}
                  />
                  <label htmlFor="text-image">Text & Image URL</label>
                </div>
              </div>

              {/* options */}
              <div className={classes["options_container"]}>
                {/* option */}
                {questionObj.options.map((option) => (
                  <div key={option.order + 400} className={classes["option"]}>
                    {quiz.type === "qna" && (
                      <input
                        type="radio"
                        id="text"
                        className={`${classes["input-radio"]} ${
                          option.isCorrect ? classes["option-radio-active"] : ""
                        }`}
                        onClick={setCorrectOption.bind(null, option.order)}
                      />
                    )}
                    {questionObj.optionType !== "image" && (
                      <input
                        type="text"
                        placeholder="Text"
                        className={`${classes["option-text"]} ${
                          option.isCorrect ? classes["option_correct"] : ""
                        }`}
                        value={option.text}
                        onChange={(e) => {
                          const value = e.target.value;
                          const optIndex = questionObj.options.findIndex(
                            (opt) => opt.order === option.order
                          );
                          const options = [...questionObj.options];
                          const opt = { ...options[optIndex] };
                          opt.text = value;
                          options[optIndex] = opt;
                          setQuestionObj((prev) => ({
                            ...prev,
                            options: options,
                          }));
                        }}
                      />
                    )}
                    {questionObj.optionType !== "text" && (
                      <input
                        type="text"
                        placeholder="Image URL"
                        className={`${classes["option-text"]} ${
                          option.isCorrect ? classes["option_correct"] : ""
                        }`}
                        value={option.image}
                        onChange={(e) => {
                          const value = e.target.value;
                          const optIndex = questionObj.options.findIndex(
                            (opt) => opt.order === option.order
                          );
                          const options = [...questionObj.options];
                          const opt = { ...options[optIndex] };
                          opt.image = value;
                          options[optIndex] = opt;
                          setQuestionObj((prev) => ({
                            ...prev,
                            options: options,
                          }));
                        }}
                      />
                    )}

                    {option.order > 2 && (
                      <div onClick={deleteOption.bind(null, option.order)}>
                        <BiSolidTrash className={classes["delete_icon"]} />
                      </div>
                    )}
                  </div>
                ))}

                {/* add option */}
                {questionObj.options.length < 4 && (
                  <div className={classes["add_option"]}>
                    <button
                      role="button"
                      type="button"
                      className={classes["btn"]}
                      onClick={addOption}
                    >
                      Add Option
                    </button>
                  </div>
                )}
              </div>

              {/* create quiz */}
              <div className={classes["modal-btns"]}>
                <button
                  className={`${classes["btn"]} ${classes["btn-secondary"]}`}
                  role="button"
                  type="button"
                  onClick={() => {
                    dispatch(closeQuiz());
                    dispatch(setData(null));
                  }}
                >
                  Cancel
                </button>
                <button
                  className={`${classes["btn"]} ${classes["btn-primary"]}`}
                >
                  {updateQuiz ? "Update" : "Create"} Quiz {loader && <Loader />}
                </button>
              </div>
            </div>

            {/* timer */}
            {quiz.type === "qna" && (
              <div className={classes["timer"]}>
                <p>Timer</p>
                <button
                  role="button"
                  type="button"
                  className={
                    questionObj.timer === 0 && classes["timer-btn-active"]
                  }
                  onClick={setTimer.bind(null, 0)}
                >
                  OFF
                </button>
                <button
                  role="button"
                  type="button"
                  className={
                    questionObj.timer === 5 && classes["timer-btn-active"]
                  }
                  onClick={setTimer.bind(null, 5)}
                >
                  5sec
                </button>
                <button
                  role="button"
                  type="button"
                  className={
                    questionObj.timer === 10 && classes["timer-btn-active"]
                  }
                  onClick={setTimer.bind(null, 10)}
                >
                  10sec
                </button>
              </div>
            )}
          </form>
        </Modal>
      )}
    </>
  );
}

export default CreateQuiz;
