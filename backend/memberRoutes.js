const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const Game = require("./game");

router.get("/:gameId", async (req, res) => {
  try {
    const game = await Game.findOne({ id: req.params.gameId });
    res.send(game.members);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.get("/:gameId/:userId", async (req, res) => {
  try {
    const game = await Game.findOne({ id: req.params.gameId });
    const searchedMember = game.members.find(
      (members) => members.id === req.params.userId
    );
    res.send(searchedMember);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post("/:gameId", async (req, res) => {
  const { member } = req.body;
  try {
    const game = await Game.findOne({ id: req.params.gameId });
    const userId = uuidv4();
    game.members.push({ ...member, isOwner: false, id: userId });
    await game.save();
    res.send({ userId });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.delete("/:gameId/:userId", async (req, res) => {
  try {
    const game = await Game.findOne({ id: req.params.gameId });
    const searchedMemberIndex = game.members.findIndex(
      (member) => member.id === req.params.userId
    );
    game.members.splice(searchedMemberIndex, 1);
    await game.save();
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});
module.exports = router;
