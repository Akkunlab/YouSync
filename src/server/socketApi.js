const io = require('socket.io')();
const socketapi = { io };
const config = require('./config');
const db = require('./firebase');
const yt = require('./youtubeApi');
const Video = require('./videoClass');
const User = require('./userClass');

/* rooms */
const rooms = io.of('/rooms').on('connection', socket => {

  /* 受信イベント */

  // プレイヤーボタンクリック
  socket.on('playerButton', data => {

    if (data.type === 'previous' || data.type === 'next') { // Playlist番号を更新
      data.playlist_number = getNextPlaylistNumber(data);
      rooms.emit('playerButton', data); // 送信
      updatePlaylistNumber(data); // DBを更新
    } else {
      socket.broadcast.emit('playerButton', data); // 送信
    }

    log('socket: playerButton', data); // ログ出力
  });

  // 検索
  socket.on('search', async data => {
    const url = data.value.match(config.youtubeURL);

    if (!url) return; // URLが不正な場合

    const id = url[1];
    const video = new Video(id);
    const videoInfo = await yt.getVideoInfo(video); // 動画情報を取得

    rooms.emit('search', videoInfo); // 送信
    updatePlaylist(data.roomId, videoInfo) // DBを更新
    log('socket: search', data); // ログ出力
  });

  // 時刻同期
  socket.on('timeSync', data => {
    data.t2 = Date.now();
    data.t3 = Date.now();
    
    rooms.to(socket.id).emit('timeSync', data);
    log('socket: timeSync', data); // ログ出力
  });

  /* events: 受信イベント */
  socket.on('test', data => {
    log('socket: test', data); // ログ出力
  });
});

/* events */
const eventsList = {};
const events = io.of('/events').on('connection', socket => {
  let eventName; // event名

  /* 受信イベント */

  // 入室
  socket.on('join', data => {
    eventName = data.name;
    const user = new User(socket.id); // インスタンスを作成

    if (!eventsList[eventName]) eventsList[eventName] = {}; // Objectがない場合はObjectを作成

    eventsList[eventName][user.myId] = user; // userを追加
    log('socket: join', data); // ログ出力
    console.log(eventsList[eventName]); // ログ出力
  });

  // 管理者入室
  socket.on('mJoin', data => {
    eventName = data.name;
    const user = new User(socket.id); // インスタンスを作成

    if (!eventsList[eventName]) eventsList[eventName] = {}; // Objectがない場合はObjectを作成

    eventsList[eventName][user.myId] = user; // userを追加
    eventsList[eventName].managerId = user.myId; // managerを追加
    log('socket: join', data); // ログ出力
    console.log(eventsList[eventName]); // ログ出力
  });

  // 退出
  socket.on('disconnect', () => {
    if (!eventsList[eventName]) return; // 入室0人の場合
    if (!(socket.id in eventsList[eventName])) return; // 未入室の場合
    
    // managerの場合は削除
    if (eventsList[eventName].managerId) {
      if (eventsList[eventName].managerId === socket.id) {
        delete eventsList[eventName].managerId;
      }
    }

    delete eventsList[eventName][socket.id]; // userを削除
    console.log(eventsList[eventName]); // ログ出力
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
  const roomRef = db.collection('rooms').doc(data.room.id);
  await roomRef.update({ playlist_number: data.playlist_number });
  log('firestore: updatePlaylistNumber', data.playlist_number); // ログ出力
}

/*　Playlistを更新 */
const updatePlaylist = async (roomId, videoInfo) => {
  const data = {
    channel: videoInfo.myChannel,
    createdAt: videoInfo.myCreatedAt,
    duration: videoInfo.myDuration,
    id: videoInfo.myId,
    thumbnail: videoInfo.myThumbnail,
    title: videoInfo.myTitle
  };

  await db.collection('rooms').doc(roomId).collection('playlist').add(data);
  log('firestore: updatePlaylist', data); // ログ出力
}

/* ログ出力 */
const log = (type, obj) => {
  console.log(`[${type}]`);
  console.log(JSON.stringify(obj, null, 2));
}

module.exports = socketapi;
