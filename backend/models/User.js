const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      default: "",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    class: {
      type: String,
    },
    score: {
      type: Number,
    },
    // if score/5 >= 1 -> medium score/5 >=2 hard
    difficulty: {
      type: String,
    },
  },
  { timestamps: true }
);

UserSchema.plugin(findOrCreate);

const User = mongoose.model("User", UserSchema);

module.exports = User;
