const express = require('express');
var app = express();
var http = require('http').createServer(app);
const path = require('path');
var io = require('socket.io')(http, {
  cors: {
    origin: "http://127.0.0.1:5501",     //需要按情况修改
    methods: ["GET", "POST"]
  }
});




// Routing
app.use(express.static(path.join(__dirname, 'public')));

// Chatroom

let numUsers = 0;
app.get('/', function (req, res) {
  res.send('<h1>Hello world</h1>');
});
io.on('connection', function (socket) {
  console.log('client ' + socket.id + ' connected');
  socket.on('player', function (data) {
    data.socketid = socket.id;
    socket.broadcast.emit('player', data);
  });

  let addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });
  socket.on('disconnect', function () {

    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
    console.log('client ' + socket.id + ' disconnected');
    socket.broadcast.emit('offline', {socketid: socket.id});
  })

});

http.listen(3000, function () {
  console.log('listening on *:3000');
});



