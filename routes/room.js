var express = require('express');
var router = express.Router();
var json = require('../src/server/room_list.json'); // 部屋リスト

/* GET room page. */
router.get('/:roomId', function (req, res, next) {
  const roomId = req.params.roomId; // 部屋ID

  // 部屋ID判定
  if (json.list[roomId]) {
    res.render('room', {
      title: roomId,
      room: JSON.stringify(json.list[roomId])
    });
  } else {
    res.render('room', { title: '404' });
  }
});

module.exports = router;
