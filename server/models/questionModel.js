const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    order: {
      type: Number,
      default: 1,
    },
    question: {
      type: String,
      required: [true, "Question field is required"],
    },
    optionType: {
      type: String,
      enum: ["text", "image", "textImage"],
      default: "text",
    },
    options: [
      {
        text: String,
        image: String,
        isCorrect: Boolean,
        order: Number,
        count: {
          type: Number,
          default: 0,
          select: false,
        },
      },
    ],
    timer: {
      type: Number,
      default: 0,
    },
    attempt: {
      type: Number,
      default: 0,
    },
    correct: {
      type: Number,
      default: 0,
    },
    incorrect: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
