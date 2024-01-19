const { createServer } = require('http');
const express = require('express');
const socketIo = require('socket.io');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const wsApp = express();
const wsServer = createServer(wsApp);
const io = socketIo(wsServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
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
