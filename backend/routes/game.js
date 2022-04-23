const router = require("express").Router();
const ActiveGame = require("../models/ActiveGame");

router.post("/save", async (req, res) => {
  try {
    const newActiveGame = new ActiveGame({
      opponents: reg.body.opponents,
      type: req.body.type,
      room: req.body.room,
    });
    console.log("anytjing");
    const activeGame = await newActiveGame.save();
    res.status(200).json(activeGame);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const activeGame = await ActiveGame.find({});
    res.status(200).json(activeGame);
  } catch (err) {
    res.status(500).json(err);
  }
});

// route for deleting active game after it is finished

module.exports = router;
