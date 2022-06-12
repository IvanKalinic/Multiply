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
    console.log(activeGame);
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
      console.log(activeGame);
      console.log(
        activeGame.find(
          (game) =>
            game.type === req.body.type &&
            game?.opponents.includes(req.body.user)
        )
      );
      gameToBeUpdated = activeGame.find(
        (game) =>
          game.type === req.body.type && game?.opponents.includes(req.body.user)
      );

      console.log("afdsads");
      console.log(gameToBeUpdated.category);
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

router.delete("/deleteActiveGame/:username", async (req, res) => {
  try {
    const activeGame = await ActiveGame.find({
      user: req.params.username,
    });
    await activeGame[0].deleteOne();
    res.status(200).json(activeGame);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/activeGame/:username", async (req, res) => {
  try {
    const activeGame = await ActiveGame.find({
      opponents: req.params.username,
    });
    res.status(200).json(activeGame[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/:winner", async (req, res) => {
  try {
    const activeGame = await ActiveGame.find({});
    let gameToBeUpdated = activeGame.find(
      (game) => game.battleArray.length > 0
    );
    res.status(200).json(gameToBeUpdated);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/battleArray/:winner", async (req, res) => {
  try {
    const activeGame = await ActiveGame.find({});
    let gameToBeUpdated = activeGame.find(
      (game) =>
        game.battleArray?.length > 0 &&
        game.opponents?.includes(req.params.winner)
    );
    let battleArrayUpdated = gameToBeUpdated?.battleArray.map((row) => {
      if (row.type === req.body?.type) {
        if (req.body?.type === 3 || req.body?.type === 4) {
          return {
            type: row.type,
            winner: [
              ...row.winner,
              {
                name: req.params.winner,
                win: req.body?.win === false ? false : true,
              },
            ],
          };
        } else {
          return {
            type: row.type,
            winner: req.body?.win !== false ? req.params.winner : "",
          };
        }
      } else {
        console.log("In else");
        return row;
      }
    });
    if (!!gameToBeUpdated && !!battleArrayUpdated) {
      console.log("Gameboard:", req.body.gameBoard);
      await gameToBeUpdated.updateOne({
        $set: {
          battleArray: [...battleArrayUpdated],
          gameBoard: !!req.body?.gameBoard
            ? req.body.gameBoard
            : gameToBeUpdated.gameBoard,
          questions: !!req.body.questions
            ? req.body.questions
            : gameToBeUpdated.questions,
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
