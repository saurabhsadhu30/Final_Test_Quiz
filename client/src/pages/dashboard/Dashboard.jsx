import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import classes from "./Dashboard.module.css";
import { getDashboardStats } from "../../requests/dashboard";
import TrendyQuizItem from "../../components/TrendyQuizItem";
import Loader from "../../components/Loader";

function Dashboard() {
  const [loader, setLoader] = useState(true);
  const [stats, setStats] = useState({});

  const { modal } = useSelector((state) => state.quiz);

  useEffect(() => {
    if (!modal) getDashboard();
  }, [modal]);

  async function getDashboard() {
    const { data, error } = await getDashboardStats();
    setLoader(false);

    if (error) {
      toast.error(data);
    } else {
      setStats(data);
    }
  }

  if (loader) {
    return (
      <div className={classes.dashboard}>
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className={classes.dashboard}>
      {/* stats */}

      <div className={classes["stats_container"]}>
        <div className={classes["stats_container-item"]}>
          <div className={classes["stats_wrap"]}>
            <div
              className={`${classes["stats-item"]} ${classes["stats-color-quiz"]}`}
            >
              <span className={classes["stats-heading"]}>
                {stats.totalQuizzes}
              </span>
              <span className={classes["stats-sub-heading"]}>Quiz</span>
            </div>
            <p
              className={`${classes["stats-status"]} ${classes["stats-color-quiz"]}`}
            >
              Created
            </p>
          </div>
        </div>

        <div className={classes["stats_container-item"]}>
          <div className={classes["stats_wrap"]}>
            <div
              className={`${classes["stats-item"]} ${classes["stats-color-questions"]}`}
            >
              <span className={classes["stats-heading"]}>
                {stats.totalQuestions}
              </span>
              <span className={classes["stats-sub-heading"]}>Questions</span>
            </div>
            <p
              className={`${classes["stats-status"]} ${classes["stats-color-questions"]}`}
            >
              Created
            </p>
          </div>
        </div>

        <div className={classes["stats_container-item"]}>
          <div className={classes["stats_wrap"]}>
            <div
              className={`${classes["stats-item"]} ${classes["stats-color-impressions"]}`}
            >
              <span className={classes["stats-heading"]}>
                {stats.totalImpressions < 1000
                  ? stats.totalImpressions
                  : (stats.totalImpressions / 1000).toFixed(1)}
              </span>
              <span className={classes["stats-sub-heading"]}>Total</span>
            </div>
            <p
              className={`${classes["stats-status"]} ${classes["stats-color-impressions"]}`}
            >
              Impressions
            </p>
          </div>
        </div>
      </div>

      {/* trendy quizzes */}
      <div className={classes["trendy_container"]}>
        <h1 className={classes["trendy_heading"]}>Trendy Quizzes</h1>

        {stats.trendyQuizzes?.length > 0 ? (
          <div className={classes.quizzes}>
            {stats?.trendyQuizzes?.map((quiz) => (
              <TrendyQuizItem data={quiz} />
            ))}
          </div>
        ) : (
          <p className="text-xl">No quiz is trendy as of now.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
