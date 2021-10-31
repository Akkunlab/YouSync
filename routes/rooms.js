var express = require('express');
var router = express.Router();
var db = require('../src/server/firebase');

/* GET room page. */
router.get('/:roomName', async function (req, res, next) {
  const roomName = req.params.roomName;
  const roomData = await getRoom(roomName); // Roomを取得
  const userAgent = req.headers['user-agent']; // UserAgentの取得
  
  // 指定のRoomがない時
  if (!roomData) {
    res.render('404');
    return;
  }

  // 指定のRoomがある時
  const data = roomData.data;
  const playlist = await getPlaylist(roomData.id); // Playlistを取得

  data.playlist = playlist;

  // モバイルの場合
  if (userAgent.match(/(iPhone|iPad|iPod|Android|Mobile)/i)) {
    res.render('room_m', {
      title: data.name,
      room: JSON.stringify(data)
    });
  } else {
    res.render('room', {
      title: data.name,
      room: JSON.stringify(data)
    });
  }
});

/* Roomを取得 */
const getRoom = async roomName => {
  let data = null;
  const roomsRef = db.collection('rooms');
  const snapshot = await roomsRef.where('name', '==', roomName).get();

  // 指定のRoomがない時
  if (snapshot.empty) return data;

  // 指定のRoomがある時
  snapshot.forEach(doc => {
    data = { id: doc.id, data: doc.data() };
  });

  return data;
}

/* Playlistを取得 */
const getPlaylist = async docId => {
  const dataArray = [];
  const roomsRef = db.collection('rooms').doc(docId).collection('playlist');
  const snapshot = await roomsRef.orderBy('createdAt').get();

  // 指定のPlaylistがない時
  if (snapshot.empty) return dataArray;

  // 指定のPlaylistがある時
  snapshot.forEach(doc => dataArray.push(doc.data()));

  return dataArray;
}

module.exports = router;
