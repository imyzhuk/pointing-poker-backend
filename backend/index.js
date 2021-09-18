const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const Game = require("./game");
const imageRoutes = require("./imageRoutes");
const issuesRoutes = require("./issuesRoutes");
const memberRoutes = require("./memberRoutes");

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use("/api/upload", imageRoutes);
app.use("/api/issues", issuesRoutes);
app.use("/api/members", memberRoutes);

app.post("/api/games", async (req, res) => {
  try {
    const { owner } = req.body;
    const userId = uuidv4();
    const gameId = uuidv4();
    const game = await new Game({
      id: gameId,
      status: "created",
      members: [{ ...owner, isOwner: true, id: userId }],
      task: [],
      settings: {},
    });
    await game.save();
    res.send({ userId, gameId });
  } catch (e) {
    res.sendStatus(500);
  }
});

app.get("/api/games/:gameId", async (req, res) => {
  try {
    const game = await Game.findOne({ id: req.params.gameId });
    game ? res.send(game) : res.sendStatus(500);
  } catch {
    res.sendStatus(500);
  }
});

app.put("/api/games/status/:gameId", async (req, res) => {
  try {
    const game = await Game.findOne({ id: req.params.gameId });
    game.status = "started";
    await game.save();
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
});

app.get("/api/games", async (req, res) => {
  const games = await Game.find({});
  res.send(games);
});

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://reactTeam:1q2w3e4r@poker.sh3rq.mongodb.net/poker",
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      }
    );

    app.listen(port, () => {
      console.log("...Server started");
    });
  } catch (error) {
    console.log(error);
  }
};

start();
