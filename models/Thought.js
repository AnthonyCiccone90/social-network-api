const mongoose = require('mongoose');
const { Schema } = mongoose;
const reactionSchema = require('./Reaction');

const thoughtSchema = new Schema({
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => new Date(timestamp).toLocaleString(),
    },
    username: {
      type: String,
      ref: 'User',
      required: true,
    },
    reactions: [
      {
        reactionText: String,
        username: String,
      }
    ],
  });
  
const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;




