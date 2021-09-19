 const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const Game = require('./game');
const Voting = require('./voting');
const imageRoutes = require('./imageRoutes');
const votesRoutes = require('./votesRoutes');

let io;
const getIoInstance = () => {
  return io
}
const issuesRoutes = require('./issuesRoutes')(getIoInstance);
const memberRoutes = require('./memberRoutes')(getIoInstance);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use('/api/upload', imageRoutes);
app.use('/api/issues', issuesRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/votes', votesRoutes);


const httpServer = require('http').createServer(app);
const options = { cors: {
    origins: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  } };
const { Server } = require('socket.io');
io = new Server(httpServer, options);
io.on('connection', (socket) => {
  socket.on('create', function(room) {
    socket.join(room);
  });
    socket.on('disconnect', function() {
    console.log('User Disconnected');
  });
});

app.post('/api/games', async (req, res) => {
  try {
    const { owner } = req.body;
    const userId = uuidv4();
    const gameId = uuidv4();
    const game = await new Game({
      id: gameId,
      status: 'created',
      members: [{ ...owner, isOwner: true, id: userId }],
      task: [],
      settings: {},
    });
    await game.save();
    const voting = await new Voting({
      gameId,
    });
    await voting.save();
    res.send({ userId, gameId });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

app.get('/api/games/:gameId', async (req, res) => {
  try {
    const game = await Game.findOne({ id: req.params.gameId });
    game ? res.send(game) : res.sendStatus(500);
  } catch {
    res.sendStatus(500);
  }
});

app.put('/api/status/:gameId', async (req, res) => {
  try {
    const game = await Game.findOne({ id: req.params.gameId });
    game.status = req.body.status;
    await game.save();
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
});

app.get('/api/games', async (req, res) => {
  const games = await Game.find({});
  res.send(games);
});

const start = async (server) => {
  try {
    await mongoose.connect(
      'mongodb+srv://reactTeam:1q2w3e4r@poker.sh3rq.mongodb.net/poker',
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      }
    );
    server.listen(PORT, function() {
      console.log('Server listening on port %d in %s mode', this.address().port, app.settings.env);
    });
  } catch (error) {
    console.log(error);
  }
}

start(httpServer);
