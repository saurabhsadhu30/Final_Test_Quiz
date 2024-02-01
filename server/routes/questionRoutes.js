const { protect } = require("../controllers/authController");
const {
  createQuestion,
  deleteQuestion,
  updateQuestion,
} = require("../controllers/questionController");
const { checkBody, checkQuery } = require("../utils/helpers");

const router = require("express").Router();

router
  .route("/")
  .post(protect, checkBody(["questions", "quizId"]), createQuestion)
  .patch(protect, checkBody(["questions", "quizId"]), updateQuestion);
router.delete(
  "/delete/:questionId",
  protect,
  checkQuery(["questionId"]),
  deleteQuestion
);
module.exports = router;
