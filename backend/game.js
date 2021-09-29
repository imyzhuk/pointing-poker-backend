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
        userStatus: {
          type: String,
          required: true,
        },
      },
    ],
  },
  settings: {
    type: {
      isChangingCardInRoundEnd: {
        type: Boolean,
        default: false,
      },
      cardsSet: {
        type: String,
        default: 'fibonacci',
      },
      ownCardsSet: {
        type: [{ value: Number, id: String }],
        default: [],
      },
      isAutoEnteringPlayers: {
        type: Boolean,
        default: false,
      },
      isTimerNeeded: {
        type: Boolean,
        default: false,
      },
      roundTime: {
        type: Number,
        required: false,
      },
    },
    default: {},
  },
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
});

module.exports = model('Game', game);
