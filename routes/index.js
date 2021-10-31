var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  const userAgent = req.headers['user-agent']; // UserAgentの取得

  // モバイルの場合
  if (userAgent.match(/(iPhone|iPad|iPod|Android|Mobile)/i)) {
    res.render('index_m');
  } else {
    res.render('index');
  }
});

module.exports = router;
