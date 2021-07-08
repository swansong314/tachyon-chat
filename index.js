const path = require('path');
const express = require('express');
const cors = require('cors');
const connect = require('./models/dbconnect');
const api = require('./routes/api');
const http = require('http');

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', api);
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);

const { Server } = require('socket.io');
const Chat = require('./models/chat');
const io = new Server(server, {
  cors: {
    origin: '*',
    // methods:
  },
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

io.on('connection', (socket) => {
  console.log('User connected');
  socket.on('joinRoom', (room) => {
    console.log('Joined General Room ');
    socket.join(room);
    // io.to(room).emit('welcomeMessage', 'Welcome to ' + room);
    socket.on('message', (message) => {
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
  });
});

server.listen(PORT, () => console.log('Server up and running on port:' + PORT));
