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

module.exports = router;
