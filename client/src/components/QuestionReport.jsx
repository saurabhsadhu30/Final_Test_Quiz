import classes from "./QuestionReport.module.css";

function QuestionReport({ data }) {
  return (
    <div className={classes["question-report-container"]}>
      <p className={classes["question"]}>
        Q.{data.order} {data.question}
      </p>

      <div className={`${classes["report-container"]} grid-col-3`}>
        {data.type === "qna" ? (
          <>
            <div className={classes["report-box"]}>
              <span className={classes["report-heading"]}>
                {data.stats.attemptQuestion}
              </span>
              <span className={classes["report-sub-heading"]}>
                People attempt the question
              </span>
            </div>

            <div className={classes["report-box"]}>
              <span className={classes["report-heading"]}>
                {data.stats.answerCorrectly}
              </span>
              <span className={classes["report-sub-heading"]}>
                People answered correctly
              </span>
            </div>

            <div className={classes["report-box"]}>
              <span className={classes["report-heading"]}>
                {data.stats.answerIncorrectly}
              </span>
              <span className={classes["report-sub-heading"]}>
                People answered incorrectly
              </span>
            </div>
          </>
        ) : (
          <>
            {data?.options.map((opt, i) => (
              <div key={i} className={classes["poll-box"]}>
                <span className={classes["report-heading"]}>{opt?.count}</span>
                <span className={classes["report-sub-heading"]}>
                  Option {i + 1}
                </span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default QuestionReport;
