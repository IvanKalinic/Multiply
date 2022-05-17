const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const GameHistorySchema = new mongoose.Schema(
  {
    opponents: {
      type: Array,
      required: true,
    },
    gameName: {
      type: String,
    },
    room: {
      type: String,
    },
    winner: {
      type: String,
    },
    points: {
      type: Number,
    },
  },
  { timestamps: true }
);

GameHistorySchema.plugin(findOrCreate);

const GameHistory = mongoose.model("GameHistory", GameHistorySchema);

module.exports = GameHistory;
