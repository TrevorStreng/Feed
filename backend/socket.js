const { createServer } = require('http');
const express = require('express');
const socketIo = require('socket.io');

const wsApp = express();
const wsServer = createServer(wsApp);
// console.log(process.env.FRONTEND_URL);
const io = socketIo(wsServer, {
  cors: {
    // origin: process.env.FRONTEND_URL,
    origin: 'http://localhost:3000',
    // methods: ['GET', 'POST', 'PATCH', 'HEAD'],
    // credentials: true,
  },
});

io.on('new-post', (socket) => {
  console.log('A user is connected');
  const originUrl = socket.handshake.headers.origin;
  console.log(
    `A user is connected (ID: ${socket.id}) from origin: ${originUrl}`
  );
});

module.exports = { wsServer, io };
