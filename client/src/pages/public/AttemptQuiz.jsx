import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

import classes from "./AttemptQuiz.module.css";
import { checkAttemptQuiz, getPublicQuiz } from "../../requests/quiz";
import Loader from "../../components/Loader";

function AttemptQuiz() {
  const location = useLocation();

  const [loader, setLoader] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState(0);
  const [finish, setFinish] = useState(false);
  const [quizType, setQuizType] = useState("qna");
  const [chooseOptions, setChooseOptions] = useState([]);
  const [chooseOption, setChooseOption] = useState({});
  const [timer, setTimer] = useState(0);
  const [quiz, setQuiz] = useState({});
  const [score, setScore] = useState(0);

  const intervalRef = useRef();

  useEffect(() => {
    if (timer > 0) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev - 1 === 0) {
            setTimeout(() => {
              quizSubmitHandler();
            }, 500);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [timer]);

  useEffect(() => {
    fetchPublicQuiz();
  }, []);

  useEffect(() => {
    if (finish) {
      finishQuiz();
    }
  }, [finish]);

  async function finishQuiz() {
    const payload = {
      chooseOptions,
      quizId: quiz._id,
    };
    setLoader(true);
    const { data, error } = await checkAttemptQuiz(payload);
    setLoader(false);

    if (error) {
      toast.error(data);
    } else {
      setScore(data.score);
    }
  }

  async function fetchPublicQuiz() {
    const slug = location.pathname.split("/")[3];
    const { data, error } = await getPublicQuiz(slug);
    setLoader(false);
    if (error) {
      toast.error(data);
    } else {
      setQuestions(data.quiz?.questions);
      setTimer(data.quiz?.questions?.[0]?.timer);
      setQuizType(data.quiz?.type);
      setQuiz(data.quiz);
    }
  }

  function quizSubmitHandler() {
    clearInterval(intervalRef.current);

    if (question + 1 < questions.length) {
      setQuestion((prev) => prev + 1);
      setTimer(questions[question + 1]?.timer);
    } else {
      // submit quiz
      setFinish(true);
      setLoader(true);
    }
    setChooseOptions((prev) => [...prev, chooseOption]);
    setChooseOption({});
  }

  const questionObj = questions[question];

  if (loader || !questionObj) {
    return (
      <main className={classes["main_container"]}>
        <Loader />
      </main>
    );
  }

  return (
    <main className={classes["main_container"]}>
      <section className={classes["section"]}>
        {!finish ? (
          <>
            <div className="flex justify-between">
              <span className={classes["question-number"]}>
                0{question + 1}/0{questions.length}
              </span>
              {!!questionObj?.timer && (
                <span className={classes["question-timer"]}>
                  00:
                  {timer < 10 ? "0" + timer : timer}s
                </span>
              )}
            </div>

            <div className={classes["question"]}>
              <p>{questionObj.question}</p>
            </div>

            {/* options */}
            <div className={classes["option_container"]}>
              {/* option */}
              {questionObj?.options?.map((option) => (
                <div
                  key={option?.order}
                  className={`${classes["option"]} ${
                    chooseOption?.order === option?.order
                      ? classes["option-active"]
                      : ""
                  }`}
                  onClick={() =>
                    setChooseOption({
                      ...option,
                      questionId: questionObj._id,
                    })
                  }
                >
                  {questionObj?.optionType !== "image" && <p>{option?.text}</p>}
                  {questionObj?.optionType !== "text" && (
                    <img
                      src={option?.image}
                      alt="img"
                      className={`${classes["option_img"]} ${
                        questionObj?.optionType === "textImage" &&
                        classes["option_img_text"]
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* submit/next */}
            <div className={classes["submit"]} onClick={quizSubmitHandler}>
              <button>
                {question + 1 < questions.length ? "Next" : "Submit"}
              </button>
            </div>
          </>
        ) : (
          <>
            {quizType === "qna" ? (
              <div className={classes["quiz_completed"]}>
                <p>Congrats Quiz is Completed</p>
                <img alt="trophy" src="/victory.png" />
                <p>
                  You score is{" "}
                  <span>
                    {score < 10 ? "0" + score : score}/
                    {questions.length < 10
                      ? "0" + questions.length
                      : questions.length}
                  </span>
                </p>
              </div>
            ) : (
              <div className={classes["poll_completed"]}>
                <p>Thank you for participating in the poll</p>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default AttemptQuiz;
