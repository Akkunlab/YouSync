var express = require('express');
var router = express.Router();
var db = require('../src/server/firebase');

/* GET room page. */
router.get('/:roomName', async function (req, res, next) {
  const roomName = req.params.roomName;
  const roomsRef = db.collection('rooms');
  const snapshot = await roomsRef.where('name', '==', roomName).get();
  
  // 指定のRoomがない時
  if (snapshot.empty) res.render('404');

  // 指定のRoomがある時
  let data;
  snapshot.forEach(doc => {
    data = doc.data()
    res.render('room', {
      title: data.name,
      room: JSON.stringify(data)
    });
  });
});

module.exports = router;
