const mongoose = require("mongoose");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");

const quizSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Quiz must have a name"],
    },
    type: {
      type: String,
      required: [true, "Quiz must have a type"],
      enum: ["qna", "poll"],
    },
    url: {
      type: String,
    },
    impressions: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    slug: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

quizSchema.virtual("questions", {
  ref: "Question",
  foreignField: "quizId",
  localField: "_id",
});

quizSchema.pre("save", function (next) {
  if (!this.isModified("name")) return next();
  const slug = `${this.name}-${uuidv4()}`;
  this.slug = slugify(slug, { lower: true });
  this.url = `${process.env.FRONTEND_DOMAIN}/public/quiz/${this.slug}`;
  next();
});

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;
