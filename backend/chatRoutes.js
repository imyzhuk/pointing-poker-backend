const express = require('express');
const router = express.Router();
const Game = require('./game');

module.exports = function (getIoInstance) {
  router.post('/:gameId', async (req, res) => {
    const { message } = req.body;
    try {
      const game = await Game.findOne({ id: req.params.gameId });
      game.chat.push(message);
      await game.save();
      getIoInstance().to(req.params.gameId).emit('messagesChanging', game.chat);
      res.sendStatus(200);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });
  return router;
};
