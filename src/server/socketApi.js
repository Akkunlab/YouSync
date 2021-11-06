const io = require('socket.io')();
const socketapi = { io };
const db = require('./firebase');

io.on('connection', socket => {

  /* 受信イベント */

  // プレイヤーボタンクリック
  socket.on('playerButton', data => {

    if (data.type === 'previous' || data.type === 'next') { // Playlist番号を更新
      data.playlist_number = getNextPlaylistNumber(data);
      updatePlaylistNumber(data);
      io.sockets.emit('playerButton', data); // 送信
    } else {
      socket.broadcast.emit('playerButton', data); // 送信
    }

    log('socket: playerButton', data); // ログ出力
  });

  // 時刻同期
  socket.on('timeSync', data => {
    data.t2 = Date.now();
    data.t3 = Date.now();
    
    io.to(socket.id).emit('timeSync', data);
    log('socket: timeSync', data); // ログ出力
  });
});

/*　次のPlaylist番号を取得 */
const getNextPlaylistNumber = data => {

  if (data.type === 'previous') {
    if (data.room.playlist_number) data.room.playlist_number--;
  } else if (data.type === 'next') {
    data.room.playlist_number === data.room.playlist_length - 1 ? data.room.playlist_number = 0 : data.room.playlist_number++;
  }
  
  return data.room.playlist_number;
}

/*　Playlist番号を更新 */
const updatePlaylistNumber = async data => {
  const cityRef = db.collection('rooms').doc(data.room.id);
  await cityRef.update({ playlist_number: data.playlist_number });
  log('firestore: updatePlaylistNumber', data.playlist_number); // ログ出力
}

/* ログ出力 */
const log = (type, obj) => {
  console.log(`[${type}]`);
  console.log(JSON.stringify(obj, null, 2));
}

module.exports = socketapi;
