const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const ActiveGameSchema = new mongoose.Schema(
  {
    opponents: {
      type: Array,
      required: true,
    },
    type: {
      type: Number,
      enum: [1, 2],
      default: 1,
    },
    room: {
      type: String,
    },
    winner: {
      type: String,
    },
    //multiply
    category: {
      type: String,
      required: false,
    },
    difficulty: {
      type: String,
      required: false,
    },
    gameBoard: {
      type: Array,
      required: false,
    },
    questions: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true }
);

ActiveGameSchema.plugin(findOrCreate);

const ActiveGame = mongoose.model("ActiveGame", ActiveGameSchema);

module.exports = ActiveGame;
