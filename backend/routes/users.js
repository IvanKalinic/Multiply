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
    // console.log(req.body.game.points);
    // console.log(user[0].gamesPlayed);
    // console.log(user[0]?.overallPoints + req.body.points);
    // console.log(checkLevel(user[0]?.overallPoints + req.body.points));
    // console.log([...user[0]?.gamesPlayed, req.body?.game]);
    await user[0].updateOne({
      $set: {
        overallPoints: !!req.body?.game?.points
          ? (user[0]?.overallPoints || 0) + req.body.game.points
          : user[0]?.overallPoints || 0,
        speed: !!req.body?.speed
          ? (user[0]?.speed || 0) + req.body.speed
          : user[0]?.speed || 0,
        gamesPlayed: !!req.body?.game
          ? [...user[0]?.gamesPlayed, req.body?.game]
          : user[0]?.gamesPlayed || [],
        gamesWon:
          !!req.body?.game && user[0].username === req.body.game?.winner
            ? [...user[0]?.gamesWon, req.body?.game]
            : user[0]?.gamesWon || [],
        levelNumber: !!req.body?.levelNumber
          ? req.body.levelNumber
          : user[0]?.levelNumber || 1,
        level: !!req.body?.levelName
          ? req.body.levelName
          : user[0]?.level || "Beginner",
      },
    });

    res.status(200).json(user[0]);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
