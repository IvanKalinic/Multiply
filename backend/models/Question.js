const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const QuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    correctAnswer: {
      type: String,
      required: true,
      default: "",
    },
    wrongAnswer: {
      type: Array,
      required: true,
      default: [],
    },
    category: {
      type: String,
    },
    difficulty: {
      type: String,
    },
  },
  { timestamps: true }
);

QuestionSchema.plugin(findOrCreate);

const Question = mongoose.model("Question", QuestionSchema);

module.exports = Question;
