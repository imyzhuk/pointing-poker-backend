const express = require('express');
const router = express.Router();
const Voting = require('./voting');

module.exports = function(getIoInstance) {
  router.post('/:gameId', async (req, res) => {
    const { playerId, taskId, card } = req.body;
    try {
      const voting = await Voting.findOne({ gameId: req.params.gameId });
      const vote = { playerId, card };
      const existingTask = voting.tasks.find(task => task.taskId === taskId);

      if (existingTask) {
        const playerVote = existingTask.score.find(task => task.playerId === playerId);

        if (playerVote) playerVote.card = card;
        else existingTask.score.push(vote);
      } else {
        voting.tasks.push({
          taskId, score: vote
        });
      }

      await voting.save();
      res.sendStatus(200);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

  router.delete('/:gameId/:playerId', async (req, res) => {
    const { gameId, playerId } = req.params;
    try {
      const voting = await Voting.findOne({ gameId });

      voting.tasks.forEach(task => {
        task.score = task.score.filter(score => score.playerId !== playerId)
      })

      await voting.save();
      res.sendStatus(200);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

  router.get('/:gameId', async (req, res) => {
    try {
      const voting = await Voting.findOne({ gameId: req.params.gameId });
      getIoInstance().to(req.params.gameId).emit('roundResultChange', voting.tasks);
      res.send(voting.tasks);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

  router.get('/:gameId/tasks/:taskId', async (req, res) => {
    try {
      const voting = await Voting.findOne({ gameId: req.params.gameId });
      const votesByDefiniteTask = voting.tasks.find(
        (task) => task.taskId === req.params.taskId
      );

      res.send(votesByDefiniteTask);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

  return router;
};
