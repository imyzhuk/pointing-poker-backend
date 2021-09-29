const express = require('express');
const router = express.Router();
const Game = require('./game');

module.exports = function (getIoInstance) {
  router.post('/:gameId', async (req, res) => {
    const { settings } = req.body;
    try {
      const game = await Game.findOne({ id: req.params.gameId });
      game.settings = settings;
      await game.save();
      getIoInstance()
        .to(req.params.gameId)
        .emit('createSettings', game.settings);
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

  return router;
};
