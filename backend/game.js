const { Schema, model } = require('mongoose');

const cardSchema = new Schema({
  value: {
    type: String,
    required: true,
  },
  imagePath: {
    type: String,
    required: false,
  },
});

const scoreSchema = new Schema({
  playerId: {
    type: String,
    required: true,
  },
  card: cardSchema,
});

const voteSchema = new Schema({
  taskId: {
    type: String,
    required: true,
  },
  score: [ scoreSchema ],
});

const kickVoteSchema = new Schema({
    playerId:
      {
        type: String,
        required: true,
      },
    action:
      {
        type: String,
        required: true,
      },
    vote: {
      type: Boolean,
      default: true
    },
  }
)

const gameSchema = new Schema({
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
        id: {
          type: String,
          required: true,
        },
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: false,
        },
        jobPosition: {
          type: String,
          required: false,
        },
        imagePath: {
          type: String,
          default: '',
        },
        isOwner: {
          type: Boolean,
          required: true,
        },
        userRole: {
          type: String,
          required: true,
        },
      },
    ],
  },
  settings: {},
  tasks: {
    type: [
      {
        id: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        link: {
          type: String,
          required: false,
        },
        priority: {
          type: String,
          default: 'low',
        },
      },
    ],
    default: [],
  },
  currentTaskId: {
    type: String,
    required: false,
  },
  roundStatus: {
    type: String,
    default: 'pending',
  },
  votes: [ voteSchema || [] ],
  chat: {
    type: [
      {
        userId: {
          type: String,
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
      },
    ],
    default: [],
  },
  kickVotes: [kickVoteSchema || []],
});

module.exports = model('Game', gameSchema);
