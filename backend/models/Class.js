const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const ClassSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    members: {
      type: Array,
      default: [],
    },
    school: {
      type: String,
      default: "",
    },
    profilePicture: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

ClassSchema.plugin(findOrCreate);

const Class = mongoose.model("User", ClassSchema);

module.exports = Class;
