const io = require('socket.io')();
const socketapi = { io };

io.on('connection', socket => {

  /* 受信イベント */

  // プレイヤーボタンクリック
  socket.on("playerButton", data => {
    io.emit("playerButton", data);
    console.log(`[socket: playerButton] get ${data}`); // ログ出力
  });
});

module.exports = socketapi;