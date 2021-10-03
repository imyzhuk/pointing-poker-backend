const express = require('express');
const Game = require('./game');
const router = express.Router();

module.exports = function (getIoInstance) {
  router.post('/:gameId', async (req, res) => {
    const { playerToKickId, kickProposeById, action, vote } = req.body;
    try {
      const game = await Game.findOne({ id: req.params.gameId });
      if (action !== 'start kicking' && !game.kickVotes.find( el => playerToKickId === el.playerId )){
        console.log('this vote was finished', playerToKickId)
        res.sendStatus(200)
        return
      }
      if (action === 'start kicking'){
        game.kickVotes = game.kickVotes.filter((el) => el.playerId !== playerToKickId);
      }
      game.kickVotes.push(
        { playerId: playerToKickId, action, vote }
      )
      if (action === 'start kicking') {
        getIoInstance().to(req.params.gameId).emit('kickPlayer', { playerToKickId, kickProposeById });
        console.log('init voting', playerToKickId)
      } else {
        const yes = game.kickVotes.filter((el) => playerToKickId === el.playerId && el.vote).length;
        const no = game.kickVotes.filter((el) => playerToKickId === el.playerId && !el.vote).length;
        const memberNeeded = Math.ceil(game.members.length / 2);
        console.log(yes, no, memberNeeded)
        if ( yes >= memberNeeded ) {
          const memberToKick = game.members.findIndex(
            (member) => member.id === playerToKickId
          );
          game.members.splice(memberToKick, 1);
          getIoInstance().to(req.params.gameId).emit('membersChange', game.members);
        }
        console.log((yes >= memberNeeded) , (no >= memberNeeded) , (yes + no === game.members.length));
        if ((yes >= memberNeeded) || (no >= memberNeeded) || (yes + no === game.members.length)){
          console.log(game.kickVotes.length);
          console.log(game.kickVotes.map(v => `${v.playerId} - ${v.vote}`));
          game.kickVotes = game.kickVotes.filter((el) => el.playerId !== playerToKickId);
          console.log(game.kickVotes.length);
        }
      }
      await game.save();
      res.sendStatus(200);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });
  return router
};
