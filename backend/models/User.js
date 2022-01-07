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
    gameColor: {
      type: String,
      default: "",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    class: {
      type: String,
    },
  },
  { timestamps: true }
);

UserSchema.plugin(findOrCreate);

const User = mongoose.model("User", UserSchema);

module.exports = User;
