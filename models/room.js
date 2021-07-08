const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomSchema = new Schema({
  roomName: String,
});

//mongoose.model('modelname', 'schema', 'collection')
module.exports = mongoose.model('room', roomSchema, 'rooms');
