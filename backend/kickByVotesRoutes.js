const express = require('express');
const Game = require('./game');
const router = express.Router();

module.exports = function (getIoInstance) {
  router.post('/:gameId', async (req, res) => {
    const { playerToKickId, kickProposeById, action, vote } = req.body;
    try {
      const game = await Game.findOne({ id: req.params.gameId });
      if (action !== 'start kicking' && !game.kickVotes.find( el => playerToKickId === el.playerId )){
        res.sendStatus(200)
        return
      }
      if (action === 'start kicking'){
        game.kickVotes = game.kickVotes.filter((el) => el.playerId !== playerToKickId);
      }
      game.kickVotes.push(
        { playerId: playerToKickId, action, vote }
      )
      await game.save();

      if (action === 'start kicking') {
        getIoInstance().to(req.params.gameId).emit('kickPlayer', { playerToKickId, kickProposeById });
      } else {
        const yes = game.kickVotes.filter((el) => playerToKickId === el.playerId && el.vote).length;
        const memberNeeded = Math.ceil(game.members.length / 2);
        if ( yes >= memberNeeded ) {
          const gameUpdated = await Game.findOneAndUpdate(
            { id: req.params.gameId },
            {
              $pull: {
                "votes.$[].score": { playerId:playerToKickId },
                "members": { id: playerToKickId}
              }
            },
            { multi: true, new: true }
          )
          getIoInstance().to(req.params.gameId).emit('membersChange', gameUpdated.members);
          getIoInstance().to(req.params.gameId).emit('roundResultChange', gameUpdated.votes.find(task => task.taskId === game.currentTaskId));

        }
      }
      res.sendStatus(200);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });
  return router
};
