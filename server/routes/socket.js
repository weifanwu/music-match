const fetch = require('node-fetch'); 
var express = require('express');
const router = express.Router();
const server = require('http').createServer();


const io = require('socket.io')(server, {
    cors: {
        origin: ["http://localhost:5173/"]
    }
});

require('dotenv').config();

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

module.exports = router;
