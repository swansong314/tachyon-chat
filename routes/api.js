const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user');
const Chat = require('../models/chat');
const Room = require('../models/room');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { usersOnline } = require('../users');

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized Request');
  }
  let token = req.headers.authorization.split(' ')[1];
  if (token == 'null') {
    return res.status(401).send('Unauthorized Request');
  }
  let payload = jwt.verify(token, 'VeryBigSecret');
  if (!payload) {
    return res.status(401).send('Unauthorized Request');
  }
  req.userId = payload.subject;
  next();
}

router.get('/', (req, res) => {
  res.send('api');
});

router.post('/register', (req, res) => {
  const userData = req.body;
  const user = new User(userData);
  user.save((err, registeredUser) => {
    if (err) {
      console.error(err);
    } else {
      const payload = { subject: registeredUser._id };
      const token = jwt.sign(payload, 'VeryBigSecret');
      res.status(200).send({ token });
    }
  });
});

router.post('/login', (req, res) => {
  const userData = req.body;
  User.findOne({ username: userData.username }, (error, user) => {
    if (error) {
      console.error(error);
    } else {
      if (!user) {
        res.status(401).send('Invalid password or username.');
      } else {
        if (user.password != userData.password) {
          res.status(401).send('Invalid password or username.');
        } else {
          const payload = { subject: user._id };
          const token = jwt.sign(payload, 'VeryBigSecret');
          res.status(200).send({ token });
        }
      }
    }
  });
});

router.post('/chats', verifyToken, (req, res) => {
  // res.json('Request for Chats');
  const room = req.body.room;
  console.log(room);
  Chat.find({ room: room }, (error, chats) => {
    if (error) {
      console.error(error);
    } else {
      res.status = 200;
      res.json(chats);
    }
  });
});

router.post('/privatechats', verifyToken, (req, res) => {
  // res.json('Request for Chats');
  const currentUser = req.body.currentUser;
  const fromUser = req.body.fromUser;
  console.log(currentUser, fromUser);
  Chat.find({ sender: fromUser, room: currentUser }, (error, chats) => {
    if (error) {
      console.error(error);
    } else {
      res.status = 200;
      res.json(chats);
    }
  });
});

router.get('/rooms', verifyToken, (req, res) => {
  Room.find({}, (error, rooms) => {
    if (error) {
      console.log(error);
    } else {
      res.status = 200;
      res.json(rooms);
    }
  });
  // res.send('List of Rooms');
});

router.get('/users', (req, res) => {
  res.status = 200;
  res.json(usersOnline);
});
module.exports = router;
