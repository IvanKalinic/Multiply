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
      battleArray: !!req.body?.battleArray ? req.body?.battleArray : null,
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
    const activeGame = await ActiveGame.find({});
    let gameToBeUpdated = {};

    if (!req.body.winner && !!req.body.type && !!req.body.user) {
      gameToBeUpdated = activeGame.find(
        (game) => game.type === req.body.type && game?.opponents.includes(user)
      );
      if (!!gameToBeUpdated) {
        await gameToBeUpdated.updateOne({ $set: req.body });
        res
          .status(200)
          .json(
            req.body.winner
              ? "Active game was updated with winner"
              : "Active game was updated with multiply details for opponent"
          );
      }
    } else {
      // slučajevi kad nije mulitply -> imamo winnera
      gameToBeUpdated = activeGame.find(
        (game) =>
          !!game?.opponents.length &&
          game.opponents.includes(req.body.winner) &&
          game.type === req.body.type
      );
      if (!!gameToBeUpdated) {
        await gameToBeUpdated.updateOne({ $set: req.body });
        res
          .status(200)
          .json(
            req.body?.winner
              ? "Active game was updated with winner"
              : "Active game was updated with multiply details for opponent"
          );
        return;
      }

      gameToBeUpdated = activeGame.find(
        (game) =>
          !!game?.user &&
          game.user === req.body.winner &&
          game.type === req.body.type
      );
      if (!!gameToBeUpdated) {
        await gameToBeUpdated.updateOne({ $set: req.body });
        res
          .status(200)
          .json(
            req.body.winner
              ? "Active game was updated with winner"
              : "Active game was updated with multiply details for opponent"
          );
      }
    }
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

router.put("/:winner", async (req, res) => {
  try {
    console.log(req.body.type);
    const activeGame = await ActiveGame.find({});
    let gameToBeUpdated = activeGame.find(
      (game) => game.battleArray.length > 0
    );
    console.log(gameToBeUpdated);
    let battleArrayUpdated = gameToBeUpdated.battleArray.map((row) => {
      if (row.type === req.body?.type) {
        return {
          type: row.type,
          winner: req.params.winner,
        };
      } else {
        return row;
      }
    });
    if (!!gameToBeUpdated && !!battleArrayUpdated) {
      await gameToBeUpdated.updateOne({
        $set: {
          battleArray: battleArrayUpdated ?? null,
        },
      });
      res.status(200).json(gameToBeUpdated.battleArray);
    }
  } catch (err) {
    console.log(err);
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
