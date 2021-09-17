const { Schema, model } = require('mongoose');

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
  tasks: [],
});

module.exports = model('Game', game);
