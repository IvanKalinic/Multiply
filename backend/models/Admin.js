const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const AdminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    subject: {
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

AdminSchema.plugin(findOrCreate);

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
