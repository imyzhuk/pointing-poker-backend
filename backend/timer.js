const express = require("express");
const router = express.Router();
const Game = require("./game");

module.exports = function(getIoInstance) {
  router.post('/:gameId', async (req, res) => {
    const { roundStatus } = req.body
    try {
      const game = await Game.findOne({ id: req.params.gameId });
      game.roundStatus = roundStatus;
      await game.save();
      getIoInstance().to(req.params.gameId).emit('roundStatusChange', roundStatus);
      res.sendStatus(200);
    } catch (e) {
      res.sendStatus(500);
    }
  })

  return router;
}

