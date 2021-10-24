const io = require('socket.io')();
const socketapi = { io };

io.on('connection', socket => {

  /* 受信イベント */

  // プレイヤーボタンクリック
  socket.on("playerButton", data => {
    socket.broadcast.emit('playerButton', data); 
    console.log(`[socket: playerButton] get ${data}`); // ログ出力
  });

  // 時刻同期
  socket.on("timeSync", data => {
    data.t2 = Date.now();
    data.t3 = Date.now();
    
    io.to(socket.id).emit('timeSync', data);
    console.log(`[socket: playerButton] get ${data}`); // ログ出力
  });
});

module.exports = socketapi;