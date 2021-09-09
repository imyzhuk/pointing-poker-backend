const { Schema, model } = require("mongoose");

const game = new Schema({
  id: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  members: {
    type: [
      {
        id: String,
        firstName: String,
        lastName: String,
        jobPosition: String,
        imagePath: String,
        isOwner: Boolean,
        role: String,
      },
    ],
  },
  settings: {},
  tasks: [],
});

module.exports = model("Game", game);
