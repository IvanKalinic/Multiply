const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const GroupSchema = new mongoose.Schema(
  {
    groupname: {
      type: String,
      required: true,
    },
    gameColor: {
      type: String,
      default: "",
    },
    members: {
      type: Array,
      default: [],
    },
    profilePicture: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

GroupSchema.plugin(findOrCreate);

const Group = mongoose.model("User", GroupSchema);

module.exports = Group;
