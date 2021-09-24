const express = require('express');
const router = express.Router();
const Game = require('./game');

module.exports = function(getIoInstance) {
  router.post('/:gameId', async (req, res) => {
    const { playerId, taskId, card } = req.body;
    try {
      const game = await Game.findOne({ id: req.params.gameId });
      const vote = { playerId, card };
      const task = game.votes.find(vote => vote.taskId === taskId);

      if (task) {
        const playerVote = task.score.find(task => task.playerId === playerId);

        if (playerVote) playerVote.card = card;
        else task.score.push(vote);
      } else {
        game.votes.push({
          taskId, score: vote
        });
      }

      await game.save();
      getIoInstance().to(req.params.gameId).emit('roundResultChange', task);
      res.sendStatus(200);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

  router.delete('/:gameId/:playerId', async (req, res) => {
    const { gameId, playerId } = req.params;
    try {
      await Game.findOneAndUpdate(
        { id: gameId },
        {
          $pull: {
            "votes.$[].score": { playerId }
          },
        },
        { multi: true }
      )

      const game = await Game.findOne({ id: gameId });
      getIoInstance().to(req.params.gameId).emit('roundResultChange', game.votes.find(task => task.taskId === game.currentTaskId));
      res.sendStatus(200);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

  router.get('/:gameId', async (req, res) => {
    try {
      const game = await Game.findOne({ id: req.params.gameId });
      res.send(game.votes);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

  router.get('/:gameId/tasks/:taskId', async (req, res) => {
    try {
      const game = await Game.findOne({ id: req.params.gameId });
      const votesByDefiniteTask = game.votes.find((task) => task.taskId === req.params.taskId);
      getIoInstance().to(req.params.gameId).emit('roundResultChange', votesByDefiniteTask);
      res.send(votesByDefiniteTask);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

  return router;
};
