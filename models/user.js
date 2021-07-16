const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
});

//mongoose.model('modelname', 'schema', 'collection')
module.exports = mongoose.model('user', userSchema, 'users');
