const router = require("express").Router();
const Question = require("../models/Question");

router.get("/:category", async (req, res) => {
  const difficulty = req.body.difficulty;
  try {
    const questions = await Question.find({
      category: req.params.category,
      difficulty: difficulty,
    });
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
