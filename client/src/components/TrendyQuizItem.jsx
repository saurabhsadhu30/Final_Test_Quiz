import classes from "./TrendyQuizItem.module.css";

function TrendyQuizItem({ data }) {
  return (
    <div className={classes["quiz_box"]}>
      <div className={classes["quiz_box-stats"]}>
        <span className={classes["stats-heading"]}>{data.name}</span>
        <div className="flex items-center text-orange">
          <span className={classes["stats-number"]}>{data.impressions}</span>
        </div>
      </div>
      <p className={classes["quiz_box-created"]}>
        Created on:
        {new Date(data?.createdAt)?.toLocaleDateString("en-us", {
          dateStyle: "medium",
        })}
      </p>
    </div>
  );
}

export default TrendyQuizItem;
