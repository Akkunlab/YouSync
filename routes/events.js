var express = require('express');
var router = express.Router();
var db = require('../src/server/firebase');

/* GET events page. */
router.get('/:eventName', async function (req, res, next) {
  const eventName = req.params.eventName;
  const eventData = await getEvent(eventName); // Eventを取得
  
  // 指定のeventがない時
  if (!eventData) {
    res.render('404');
    return;
  }

  // 指定のeventがある時
  const data = eventData.data;
  const startDate = data.startDate.toDate();
  const endDate = data.endDate.toDate();
  const state = getEventState(startDate, endDate); // Eventの状態を取得

  const sendData = {
    state,
    startDate,
    endDate,
    des: data.des // Eventの説明
  };

  res.render('event', {
    title: data.name,
    event: JSON.stringify(sendData)
  });
});

/* Eventを取得 */
const getEvent = async eventName => {
  let data = null;
  const eventsRef = db.collection('events');
  const snapshot = await eventsRef.where('name', '==', eventName).get();

  // 指定のEventがない時
  if (snapshot.empty) return data;

  // 指定のEventがある時
  snapshot.forEach(doc => {
    data = { id: doc.id, data: doc.data() };
  });

  return data;
}

/* Eventの状態を取得 */
const getEventState = (start, end) => {
  const now = new Date();

  if (now < start) {
    return 0; // 未開催
  } else if (now < end) {
    return 1; // 開催中
  } else {
    return 2; // 終了
  }
}

module.exports = router;
