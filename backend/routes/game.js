const router = require("express").Router();
const ActiveGame = require("../models/ActiveGame");
const GameHistory = require("../models/GameHistory");

router.post("/save", async (req, res) => {
  try {
    const newActiveGame = new ActiveGame({
      opponents: !!req.body.opponents ? req.body.opponents : [],
      user: !!req.body.user ? req.body.user : "",
      type: req.body.type,
      room: req.body.room,
      difficulty: req.body?.difficulty,
      category: req.body?.category,
      questions: req.body?.questions,
    });
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

router.put("/winnerOrMultiplyDetails", async (req, res) => {
  try {
    console.log(req.body);
    const activeGame = await ActiveGame.find({});
    await activeGame[0].updateOne({ $set: req.body });
    res
      .status(200)
      .json(
        req.body.winner
          ? "Active game was updated with winner"
          : "Active game was updated with multiply details for opponent"
      );
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/deleteActiveGame", async (req, res) => {
  try {
    const activeGame = await ActiveGame.find({
      // winer: { $not: { $in: [null, undefined, ""] } },
    });
    activeGame.map(async (game) => {
      if (!!game?.winner) {
        await game.deleteOne();
      }
    });
    // await activeGame[0].deleteOne();
    res.status(200).json("Active game was deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/gameHistory/:name", async (req, res) => {
  try {
    const games = await GameHistory.find({ gameName: req.params.name });
    res.status(200).json(games);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/gameHistory", async (req, res) => {
  try {
    const newGame = new GameHistory({
      opponents: req.body.opponents,
      gameName: req.body.gameName,
      room: req.body.room,
      winner: req.body?.winner,
      points: req.body?.points,
      speed: req.body?.speed,
    });
    const activeGame = await newGame.save();
    res.status(200).json(activeGame);
  } catch (err) {
    res.status(500).json(err);
  }
});
// route for deleting active game after it is finished
module.exports = router;
