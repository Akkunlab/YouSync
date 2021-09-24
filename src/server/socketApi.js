const io = require('socket.io')();
const socketapi = { io };

io.on('connection', socket => {
  console.log('A user connected');
});

module.exports = socketapi;