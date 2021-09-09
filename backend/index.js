const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");
const Game = require("./game");

const app = express();
const port = process.env.PORT || 3001;

app.use(cookieParser("secret key"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

app.post("/api/games", async (req, res) => {
  try {
    const owner = req.body.owner;
    const userId = uuidv4();
    const gameId = uuidv4();
    const game = await new Game({
      id: gameId,
      status: "created",
      members: [{ ...owner, role: "observer", isOwner: true, id: userId }],
      task: [],
      settings: {},
    });
    await game.save();
    res.cookie("gameId", gameId, {
      maxAge: 3600 * 2,
    });
    res.cookie("userId", userId, {
      maxAge: 3600 * 2,
    });

    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(500);
  }
});

app.get("/api/games/:id", async (req, res) => {
  try {
    const game = await Game.findOne({ id: req.params.id });
    console.log(game);
    if (game) {
      res.cookie("gameId", game.id, {
        maxAge: 3600 * 2,
      });
      res.send(game);
    } else {
      res.sendStatus(500);
    }
  } catch {
    res.sendStatus(500);
  }
});

app.put("/api/games/status", async (req, res) => {
  try {
    const game = await Game.findOne({ id: req.cookies.gameId });
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

app.post("/api/members", async (req, res) => {
  try {
    const game = await Game.find({ id: req.cookies.gameId });
    const userId = uuidv4();
    game.members.push({ ...req.body.member, isOwner: false, id: userId });
    await game.save();
    res.cookie("userId", userId);
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
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
