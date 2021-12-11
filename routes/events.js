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

  data.id = eventData.id;

  res.render('event', {
    title: data.name,
    event: JSON.stringify(data)
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

module.exports = router;
