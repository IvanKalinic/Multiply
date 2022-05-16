const router = require("express").Router();
const User = require("../models/User");

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
    const users = await User.find({ class: req.params.class });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:username", async (req, res) => {
  try {
    const user = await User.find({ username: req.params.username });
    console.log(user[0]?.overallPoints + req.body.points);
    console.log(checkLevel(user[0]?.overallPoints + req.body.points));
    await user[0].updateOne({
      $set: {
        overallPoints:
          req.body?.points && user[0]?.overallPoints + req.body.points,
        speed: req.body?.speed && user[0]?.speed + req.body.speed,
        gamesPlayed:
          req.body?.game && user[0]?.gamesPlayed.push(req.body?.game),
        levelNumber: req.body?.levelNumber && req.body.levelNumber,
        level: req.body?.levelName && req.body.levelName,
      },
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
