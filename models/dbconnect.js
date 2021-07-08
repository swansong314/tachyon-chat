const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const altUrl =
  'mongodb://user-proto-msg-1:HfViMPSIgsrHQDQy@proto-messages-shard-00-00.3hq7o.mongodb.net:27017,proto-messages-shard-00-01.3hq7o.mongodb.net:27017,proto-messages-shard-00-02.3hq7o.mongodb.net:27017/chat-app?ssl=true&replicaSet=atlas-t9kpx2-shard-0&authSource=admin&retryWrites=true&w=majority';

const connect = mongoose.connect(
  altUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.error('Error: ' + err);
    } else {
      console.log('Connected to database.');
    }
  }
);

module.exports = connect;
