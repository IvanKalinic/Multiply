const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Admin = require("../models/Admin");

router.post("/register", async (req, res) => {
  console.log(req.body);
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.admin.password, salt);
    const newAdmin = new Admin({
      username: req.body.admin.username,
      email: req.body.admin.email,
      password: hashedPassword,
    });
    const registeredAdmin = await newAdmin.save();
    res.status(200).json(registeredAdmin);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.post("/loginAdmin", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  try {
    const admin = await Admin.findOne({ email: req.body.admin.username });
    !admin && res.status(404).send("Admin not found");

    const validPassword = await bcrypt.compare(
      req.body.admin.password,
      admin.password
    );
    !validPassword && res.status(400).send("Wrong password");

    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/loginUser", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  try {
    const user = await User.findOne({ email: req.body.user.username });
    !user && res.status(404).send("User not found");

    const validPassword = await bcrypt.compare(
      req.body.user.password,
      user.password
    );
    !validPassword && res.status(400).send("Wrong password");

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
