const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:class", async (req, res) => {
  try {
    const users = await User.find({ class: req.params });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
