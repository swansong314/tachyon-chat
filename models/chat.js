const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chatSchema = new Schema(
  {
    text: {
      type: String,
    },
    sender: {
      type: String,
    },
    time: {
      type: String,
    },
    room: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('chat', chatSchema, 'chats');
