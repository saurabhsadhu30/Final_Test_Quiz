const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Quiz = require("../models/quizModel");
const Question = require("../models/questionModel");

exports.createQuiz = catchAsync(async (req, res, next) => {
  const { name, type } = req.body;

  const quiz = await Quiz.create({
    name,
    type,
    user: req.user._id,
  });

  res.status(201).json({
    status: true,
    quiz,
  });
});

exports.getAllQuizzes = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const quizzes = await Quiz.find({ user: userId })
    .populate({
      path: "questions",
      select: "-__v",
      options: { sort: { order: 1 } },
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: true,
    quizzes,
  });
});

exports.getQuiz = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const quiz = await Quiz.findOne({ slug }).populate({
    path: "questions",
    select: "-__v +options.count",
    options: { sort: { order: 1 } },
  });

  res.status(200).json({
    status: true,
    quiz,
  });
});

exports.getPublicQuiz = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const quiz = await Quiz.findOne({ slug }).populate({
    path: "questions",
    select: "-options.isCorrect",
    options: { sort: { order: 1 } },
  });

  if (!quiz)
    return next(
      new AppError("Quiz might be deleted, please try new quiz", 400)
    );

  await Quiz.findByIdAndUpdate(quiz._id, { $inc: { impressions: 1 } });

  res.status(200).json({
    status: true,
    quiz,
  });
});

exports.checkAttemptQuiz = catchAsync(async (req, res, next) => {
  const { chooseOptions, quizId } = req.body;

  const quiz = await Quiz.findById(quizId);
  if (!quiz)
    return next(
      new AppError("Quiz might be deleted, please try new quiz", 400)
    );

  let score = 0;

  for (let i = 0; i < chooseOptions.length; i++) {
    const option = chooseOptions[i];

    const question = await Question.findById(option.questionId);
    if (!question) continue;
    const correctAnswer = question.options.find(
      (opt) => opt.isCorrect === true
    );

    // correct answer
    if (quiz.type === "qna") {
      if (option._id?.toString() === correctAnswer._id?.toString()) {
        await Question.findByIdAndUpdate(option.questionId, {
          $inc: { correct: 1, attempt: 1 },
        });
        score++;
      } else {
        await Question.findByIdAndUpdate(option.questionId, {
          $inc: { incorrect: 1, attempt: 1 },
        });
      }
    } else {
      await Question.findOneAndUpdate(
        {
          _id: option.questionId,
          "options._id": option._id,
        },
        {
          $inc: { "options.$.count": 1 }, // Increment the count field by 1
        },
        { new: true }
      );
    }
  }

  res.status(200).json({
    status: true,
    score,
  });
});

exports.deleteQuiz = catchAsync(async (req, res, next) => {
  const { quizId } = req.params;

  await Quiz.findByIdAndDelete(quizId);
  await Question.deleteMany({ quizId });

  res.status(200).json({
    status: true,
    msg: "Quiz deleted successfully",
  });
});
