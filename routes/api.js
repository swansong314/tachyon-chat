const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user');
const Chat = require('../models/chat');
const Room = require('../models/room');
const jwt = require('jsonwebtoken');
const router = express.Router();

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

router.post('/chats', (req, res) => {
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

router.get('/rooms', (req, res) => {
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

module.exports = router;
