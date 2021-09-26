const express = require('express');
const router = express.Router();
const Game = require('./game');

router.post('/:gameId', async (req, res) => {
  const {
    settings: { isOwnerAPlayer, ...restSettings },
  } = req.body;
  try {
    const game = await Game.findOne({ id: req.params.gameId });
    game.members[0]['userRole'] = isOwnerAPlayer ? 'player' : 'observer';
    game.settings = restSettings;
    await game.save();
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.get('/:gameId', async (req, res) => {
  try {
    const game = await Game.findOne({ id: req.params.gameId });
    res.sendStatus(game.settings);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = router;
