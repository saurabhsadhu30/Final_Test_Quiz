const Question = require("../models/questionModel");
const catchAsync = require("../utils/catchAsync");

exports.createQuestion = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  // const { question, optionType, quizId, options, timer } = req.body;
  const { questions, quizId } = req.body;

  const questionsArr = questions.map((question) => ({
    ...question,
    user: userId,
    quizId,
  }));

  const newQuestions = await Question.create(questionsArr);

  res.status(201).json({
    status: true,
    questions: newQuestions,
    msg: "Questions created successfully",
  });
});

exports.updateQuestion = catchAsync(async (req, res, next) => {
  const { questions, quizId } = req.body;
  const modefiedQuestions = questions.map((data) => ({
    _id: data?._id,
    question: data.question,
    order: data.order,
    options: data.options?.map((option) => ({
      image: option.image,
      isCorrect: option.isCorrect,
      order: option.order,
      text: option.text,
    })),
    optionType: data.optionType,
    timer: data.timer,
  }));

  // update many modefiedQuestions with quizId only

  for (let i = 0; i < modefiedQuestions.length; i++) {
    const data = modefiedQuestions[i];
    // update existing question
    if (data._id) {
      await Question.findByIdAndUpdate(
        data._id,
        {
          ...data,
        },
        { new: true }
      );
    } else {
      await Question.create({
        ...data,
        quizId,
        user: req.user._id,
      });
    }
  }

  res.status(200).json({
    status: true,
    msg: "Question updated successfully",
  });
});

exports.deleteQuestion = catchAsync(async (req, res, next) => {
  const { questionId } = req.params;

  await Question.findByIdAndDelete(questionId);

  res.status(200).json({
    status: true,
    msg: "Question deleted successfully",
  });
});
