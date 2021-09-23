const { Schema, model } = require("mongoose");

const cardSchema = new Schema({
  value: {
    type: String,
    required: true
  },
  imagePath: {
    type: String,
    required: false
  }
})

const scoreSchema = new Schema({
  playerId: {
    type: String,
    required: true,
  },
  card: cardSchema
})

const taskSchema = new Schema({
  taskId: {
    type: String,
    required: true,
  },
  score: [scoreSchema]
})

const votingSchema = new Schema({
  gameId: {
    type: String,
    required: true,
  },
  tasks: {
    type: [taskSchema],
    default: [],
  },
});

module.exports = model("Voting", votingSchema);
