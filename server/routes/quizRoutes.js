const { protect } = require("../controllers/authController");
const {
  createQuiz,
  getAllQuizzes,
  deleteQuiz,
  getQuiz,
  getPublicQuiz,
  checkAttemptQuiz,
} = require("../controllers/quizController");
const { checkBody, checkParams } = require("../utils/helpers");

const router = require("express").Router();

router
  .route("/")
  .post(protect, checkBody(["name", "type"]), createQuiz)
  .get(protect, getAllQuizzes);
router.post(
  "/attempt",
  // checkBody(["chooseOptions", "quizId"]),
  checkAttemptQuiz
);
router.get("/:slug", protect, getQuiz);
router.get("/public/:slug", getPublicQuiz);
router.delete("/:quizId", protect, checkParams(["quizId"]), deleteQuiz);

module.exports = router;
