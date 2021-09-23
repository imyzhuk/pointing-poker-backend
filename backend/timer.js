const express = require("express");
const router = express.Router();
const Game = require("./game");

module.exports = function (getIoInstance){
  router.post('/:gameId/started', async (req, res) => {
    try {
      console.log('catched started');
      const game = await Game.findOne({ id: req.params.gameId });
      game.roundStatus = 'started';
      await game.save();
      getIoInstance().to(req.params.gameId).emit('roundStatusChange', 'started');
      res.sendStatus(200);
    } catch (e) {
      res.sendStatus(500);
    }
  })
  router.post('/:gameId/stopped', async (req, res) => {
    try {
      const game = await Game.findOne({ id: req.params.gameId });
      game.roundStatus = 'stopped';
      await game.save();
      getIoInstance().to(req.params.gameId).emit('roundStatusChange', 'stopped');
      res.sendStatus(200);
    } catch (e) {
      res.sendStatus(500);
    }
  })
  return router;
}

