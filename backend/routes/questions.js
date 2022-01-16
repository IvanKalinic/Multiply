const router = require("express").Router();
const Question = require("../models/Question");

router.get("/:category/:difficulty", async (req, res) => {
  try {
    const questions = await Question.find({
      category: req.params.category,
      difficulty: req.params.difficulty,
    });
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/add", async (req, res) => {
  try {
    const questions = req.body;
    const newQuestions = questions.map((question) => {
      return {
        insertOne: {
          document: question,
        },
      };
    });
    Question.collection
      .bulkWrite(newQuestions)
      .then((saved) =>
        res
          .status(200)
          .json("succesfully saved movies" + saved.getRawResponse())
      )
      .catch((error) => console.log(error));
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

module.exports = router;
