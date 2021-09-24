const io = require('socket.io')();
const socketapi = { io };

io.on('connection', socket => {

  /* 受信イベント */

  // プレイヤーボタンクリック
  socket.on("playerButton", data => {
    socket.emit("playerButton", data);
    console.log(data); // ログ出力
  });
});

module.exports = socketapi;