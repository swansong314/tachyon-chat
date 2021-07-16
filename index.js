const path = require('path');
const express = require('express');
const cors = require('cors');
const connect = require('./models/dbconnect');
const api = require('./routes/api');
const http = require('http');
const { usersOnline, addUser, getUsers, removeUser } = require('./users');
const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', api);
// app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);

const { Server } = require('socket.io');
const Chat = require('./models/chat');
const io = new Server(server, {
  cors: {
    origin: '*',
    // methods:
  },
});

//set static folder
app.use(express.static(path.join(__dirname, 'public')));


io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error('invalid username'));
  }
  socket.username = username;
  // console.log(socket);
  next();
});

io.on('connection', (socket) => {
  // fs.readFile('image.png', function (err, data) {
  //   socket.emit('imageConversionByClient', { image: true, buffer: data });
  //   socket.emit(
  //     'imageConversionByServer',
  //     'data:image/png;base64,' + data.toString('base64')
  //   );
  // });

  socket.on('newUser', (user) => {
    // let newUser = { userID: socket.id, username: user.username };
    // addUser(newUser);
    // console.log(usersOnline);
    console.log(user);
    const users = [];
    for (let [id, socket] of io.of('/').sockets) {
      users.push({
        userID: id,
        username: socket.username,
      });
    }
    console.log(users);
    io.emit('updateUserList', users);
  });

  socket.on('joinRoom', (room) => {
    // console.log('Joined General Room ');
    socket.join(room);
    console.log(socket.rooms);
    // io.to(room).emit('welcomeMessage', 'Welcome to ' + room);

    socket.on('message', (message) => {
      console.log(socket.rooms);
      console.log(message);
      let newMessage = new Chat({
        text: message.text,
        sender: message.sender,
        time: message.time,
        room: message.room,
      });
      newMessage.save((error, message) => {
        if (error) console.error(error);
      });
      socket.to(room).emit('messageBroadcast', message);
    });

    socket.on('leaveRoom', (room) => {
      socket.leave(room);
      socket.removeAllListeners('message');
    });
  });

  socket.on('privateMessage', ({ content, to }) => {
    console.log(content);
    console.log(to);
    let newMessage = new Chat({
      text: content.text,
      sender: content.sender,
      time: content.time,
      room: content.room,
    });
    newMessage.save((error, message) => {
      if (error) console.error(error);
    });
    socket.to(to).emit('privateMessage', content);
  });

  socket.on('disconnect', () => {
    const users = [];
    for (let [id, socket] of io.of('/').sockets) {
      users.push({
        userID: id,
        username: socket.username,
      });
    }
    console.log(users);
    io.emit('updateUserList', users);
    console.log('User disconnected');
  });
});

server.listen(PORT, () => console.log('Server up and running on port:' + PORT));
