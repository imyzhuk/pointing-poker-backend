const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Game = require('./game');

module.exports = function (getIoInstance) {
  router.get('/:gameId', async (req, res) => {
    try {
      const game = await Game.findOne({ id: req.params.gameId });
      res.send(game.members);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

  router.get('/:gameId/:userId', async (req, res) => {
    try {
      const game = await Game.findOne({ id: req.params.gameId });
      const searchedMember = game.members.find(
        (members) => members.id === req.params.userId
      );
      res.send(searchedMember);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

  router.post('/:gameId', async (req, res) => {
    const { member } = req.body;
    try {
      const game = await Game.findOne({ id: req.params.gameId });
      const userStatus = game.settings.isAutoEnteringPlayers
        ? 'admitted'
        : game.status === 'created'
        ? 'admitted'
        : 'pending';

      const userId = uuidv4();
      game.members.push({ ...member, isOwner: false, id: userId, userStatus });
      await game.save();
      getIoInstance().to(req.params.gameId).emit('membersChange', game.members);
      res.send({ userId });
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

  router.delete('/:gameId/:userId', async (req, res) => {
    try {
      console.log('delete user');
      const game = await Game.findOne({ id: req.params.gameId });
      const searchedMemberIndex = game.members.findIndex(
        (member) => member.id === req.params.userId
      );
      game.members.splice(searchedMemberIndex, 1);
      await game.save();
      getIoInstance().to(req.params.gameId).emit('membersChange', game.members);
      res.sendStatus(200);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

  router.patch('/:gameId/:userId', async (req, res) => {
    try {
      const memberProperties = [
        'firstName',
        'lastName',
        'jobPosition',
        'imagePath',
        'isOwner',
        'userRole',
        'userStatus',
      ];

      const game = await Game.findOne({ id: req.params.gameId });

      const searchedMemberIndex = game.members.findIndex(
        (member) => member.id === req.params.userId
      );

      memberProperties.forEach((prop) => {
        if (req.body[prop]) {
          game.members[searchedMemberIndex][prop] = req.body[prop];
        }
      });

      await game.save();
      getIoInstance().to(req.params.gameId).emit('membersChange', game.members);
      res.sendStatus(200);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });
  return router;
};
