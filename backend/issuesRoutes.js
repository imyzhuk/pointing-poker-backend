const express = require('express');
const router = express.Router();
const Game = require('./game');

module.exports = function (getIoInstance) {
  router.get('/:gameId', async (req, res) => {
    try {
      const game = await Game.findOne({ id: req.params.gameId });
      res.send(game.tasks);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

  router.get('/:gameId/:taskId', async (req, res) => {
    try {
      const game = await Game.findOne({ id: req.params.gameId });
      const searchedTask = game.tasks.find(
        (task) => task.id === req.params.taskId
      );
      res.send(searchedTask);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

  router.post('/:gameId', async (req, res) => {
    const { task } = req.body;
    try {
      const game = await Game.findOne({ id: req.params.gameId });
      game.tasks.push(task);
      await game.save();
      getIoInstance().to(req.params.gameId).emit('tasksChange', game.tasks);
      res.send({ taskId: task.id });
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });
  router.post('/:gameId/some', async (req, res) => {
    const { tasks } = req.body;
    try {
      const game = await Game.findOne({ id: req.params.gameId });
      tasks.forEach((task) => game.tasks.push(task));
      await game.save();
      getIoInstance().to(req.params.gameId).emit('tasksChange', game.tasks);
      res.sendStatus(200);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

  router.put('/:gameId/:taskId', async (req, res) => {
    const { task } = req.body;
    try {
      const game = await Game.findOne({ id: req.params.gameId });
      const searchedTaskIndex = game.tasks.findIndex(
        (task) => task.id === req.params.taskId
      );
      game.tasks.splice(searchedTaskIndex, 1, task);

      await game.save();
      getIoInstance().to(req.params.gameId).emit('tasksChange', game.tasks);
      res.sendStatus(200);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

  router.delete('/:gameId/:taskId', async (req, res) => {
    const { gameId, taskId } = req.params;
    try {
      await Game.findOneAndUpdate(
        { id: gameId },
        {
          $pull: {
            votes: { taskId },
            tasks: { id: taskId },
          },
        },
        { multi: true }
      );

      const game = await Game.findOne({ id: req.params.gameId });
      getIoInstance().to(req.params.gameId).emit('tasksChange', game.tasks);
      getIoInstance().to(req.params.gameId).emit('votesChange', game.votes);
      res.sendStatus(200);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

  router.put('/:gameId/current/:taskId', async (req, res) => {
    try {
      const game = await Game.findOne({ id: req.params.gameId });
      game.currentTaskId = req.params.taskId;
      await game.save();
      getIoInstance()
        .to(req.params.gameId)
        .emit('currentTaskChange', game.currentTaskId);
      res.sendStatus(200);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });
  return router;
};
