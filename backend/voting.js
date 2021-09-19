const { Schema, model } = require("mongoose");

const voting = new Schema({
  gameId: {
    type: String,
    required: true,
  },
  votes: {
    type: [
      {
        userId: {
          type: String,
          required: true,
        },
        taskId: {
          type: String,
          required: true,
        },
        mark: {
          type: String,
          required: true,
        },
      },
    ],
    default: [],
  },
});

module.exports = model("Voting", voting);
