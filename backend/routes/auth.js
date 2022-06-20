const router = require("express").Router();
const User = require("../models/User");
const Admin = require("../models/Admin");
const logout = require("express-passport-logout");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newAdmin = new Admin({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    const registeredAdmin = await newAdmin.save();
    res.status(200).json(registeredAdmin);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.post("/registerUser", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      class: req.body?.class,
    });
    const registeredUser = await newUser.save();
    res.status(200).json(registeredUser);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.post("/loginAdmin", async (req, res) => {
  try {
    const admin = await Admin.findOne({ username: req.body.username });
    !admin && res.status(404).send("Admin not found");

    const validPassword = await bcrypt.compare(
      req.body.password,
      admin.password
    );
    !validPassword && res.status(400).send("Wrong password");

    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/userlogin", async (req, res) => {
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header(
  //   "Access-Control-Allow-Headers",
  //   "Origin, X-Requested-With, Content-Type, Accept"
  // );
  try {
    const user = await User.findOne({ username: req.body.username });
    console.log(user);
    !user && res.status(404).send("User not found");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword
      ? res.status(400).send("Wrong password")
      : res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/logout", (req, res) => {
  logout();
  res.redirect(process.env.CLIENT_URL);
});

module.exports = router;
