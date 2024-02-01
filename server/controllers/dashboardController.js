const catchAsync = require("../utils/catchAsync");
const Quiz = require("../models/quizModel");
const Question = require("../models/questionModel");

exports.dashboard = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const quizzes = await Quiz.find({ user: userId });
  const trendyQuizzes = await Quiz.find({
    user: userId,
    impressions: {
      $gt: 10,
    },
  }).lean();
  const totalQuestions = await Question.find({ user: userId }).countDocuments();
  let totalImpressions = 0;

  quizzes.forEach((quiz) => {
    totalImpressions += quiz.impressions;
  });

  res.status(200).json({
    status: true,
    totalQuizzes: quizzes.length,
    totalQuestions,
    totalImpressions,
    trendyQuizzes,
  });
});
