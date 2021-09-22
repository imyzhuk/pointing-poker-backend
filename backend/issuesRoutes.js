const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const Game = require("./game");

module.exports = function (getIoInstance){
  router.get("/:gameId", async (req, res) => {
    try {
      const game = await Game.findOne({ id: req.params.gameId });
      res.send(game.tasks);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

  router.get("/:gameId/:taskId", async (req, res) => {
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

  router.post("/:gameId", async (req, res) => {
    const { task } = req.body;
    try {
      const game = await Game.findOne({ id: req.params.gameId });
      const taskId = uuidv4();
      game.tasks.push({ ...task, id: taskId });
      await game.save();
      console.log('issue create ', taskId , Date.now());
      getIoInstance().to(req.params.gameId).emit('tasksChange', game.tasks);


      res.send({ taskId });
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

  router.put("/:gameId/:taskId", async (req, res) => {
    const { task } = req.body;
    try {
      const game = await Game.findOne({ id: req.params.gameId });
      let searchedTask = game.tasks.find((task) => task.id === req.params.taskId);
      searchedTask = { ...searchedTask.toObject(), ...task };
      const searchedTaskIndex = game.tasks.findIndex(
        (task) => task.id === req.params.taskId
      );

      game.tasks[searchedTaskIndex] = searchedTask;
      await game.save();
      console.log('issue update ', req.params.taskId , Date.now());
      getIoInstance().to(req.params.gameId).emit('tasksChange', game.tasks);
      res.sendStatus(200);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

  router.delete("/:gameId/:taskId", async (req, res) => {
    try {
      const game = await Game.findOne({ id: req.params.gameId });
      const searchedTaskIndex = game.tasks.findIndex(
        (task) => task.id === req.params.taskId
      );
      game.tasks.splice(searchedTaskIndex, 1);
      await game.save();
      console.log('issue delete ', req.params.taskId , Date.now());
      getIoInstance().to(req.params.gameId).emit('tasksChange', game.tasks);
      res.sendStatus(200);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });
  return router;
}
