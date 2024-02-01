import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import classes from "./QuizAnalysis.module.css";
import QuestionReport from "../../components/QuestionReport";
import { getQuiz } from "../../requests/quiz";
import Loader from "../../components/Loader";

function QuizAnalysis() {
  const [loader, setLoader] = useState(true);
  const [quiz, setQuiz] = useState();

  const location = useLocation();

  useEffect(() => {
    fetchQuiz();
  }, []);

  async function fetchQuiz() {
    const quizId = location.pathname.split("/")[2];
    const { data, error } = await getQuiz(quizId);
    setLoader(false);
    if (error) {
      toast.error(data);
    } else {
      setQuiz(data.quiz);
    }
  }

  if (loader) {
    return (
      <div className={classes["question_container"]}>
        <div className=" flex justify-center items-center">
          <Loader />
        </div>
        ;
      </div>
    );
  }

  return (
    <div className={classes["question_container"]}>
      {/* header */}
      <div className="flex justify-between items-baseline">
        <h1 className={classes["question-heading"]}>
          {quiz.name} Question Analysis
        </h1>
        <div className={classes["question_create-container"]}>
          <p>
            Created on:{" "}
            {new Date(quiz.createdAt).toLocaleDateString("en-us", {
              dateStyle: "medium",
            })}
          </p>
          <p>Impressions: {quiz.impressions}</p>
        </div>
      </div>

      {/* questions */}
      <div className={classes["question-report-container"]}>
        {quiz.questions?.map((que) => (
          <QuestionReport
            key={que._id}
            data={{
              type: quiz.type,
              question: que.question,
              options: que.options,
              order: que.order,
              stats: {
                attemptQuestion: que.attempt,
                answerCorrectly: que.correct,
                answerIncorrectly: que.incorrect,
              },
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default QuizAnalysis;
