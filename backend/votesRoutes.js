const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const Voting = require("./voting");

router.post("/:gameId", async (req, res) => {
  const { vote } = req.body;
  try {
    const voting = await Voting.findOne({ gameId: req.params.gameId });
    voting.votes.push(vote);
    await voting.save();

    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.put("/:gameId", async (req, res) => {
  const {
    vote: { userId, taskId, mark },
  } = req.body;
  try {
    const voting = await Voting.findOne({ gameId: req.params.gameId });
    const searchedVote = voting.votes.find(
      (vote) => vote.userId === userId && vote.taskId === taskId
    );

    searchedVote["mark"] = mark;
    await voting.save();
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.get("/:gameId", async (req, res) => {
  try {
    const voting = await Voting.findOne({ gameId: req.params.gameId });
    res.send(voting.votes);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});
router.get("/:gameId/tasks/:taskId", async (req, res) => {
  try {
    const voting = await Voting.findOne({ gameId: req.params.gameId });
    const votesByDefiniteTask = voting.votes.filter(
      (vote) => vote.taskId === req.params.taskId
    );
    res.send(votesByDefiniteTask);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = router;
