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

  router.get('/:gameId', async (req, res) => {
    try {
      const voting = await Voting.findOne({ gameId: req.params.gameId });
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

      getIoInstance().to(req.params.gameId).emit('roundResultChange', votesByDefiniteTask);
      res.send(votesByDefiniteTask);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

  return router;
};
