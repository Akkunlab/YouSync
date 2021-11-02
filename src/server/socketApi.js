const io = require('socket.io')();
const socketapi = { io };

io.on('connection', socket => {

  /* 受信イベント */

  // プレイヤーボタンクリック
  socket.on('playerButton', data => {
    socket.broadcast.emit('playerButton', data); 
    log('playerButton', data); // ログ出力
  });

  // 時刻同期
  socket.on('timeSync', data => {
    data.t2 = Date.now();
    data.t3 = Date.now();
    
    io.to(socket.id).emit('timeSync', data);
    log('timeSync', data); // ログ出力
  });
});

/* ログ出力 */
const log = (type, obj) => {
  console.log(`[socket: ${type}]`);
  console.log(JSON.stringify(obj, null, 2));
}

module.exports = socketapi;
