require('dotenv').config();
var { google } = require('googleapis');
var json = require('./room_list.json'); // 部屋リスト

/* YouTube Data API */
const youtube = google.youtube({ version: 'v3', auth: process.env.YT_API_KEY });

(function initVideo() {
  let i, j;
  const data = Object.keys(json.list);
  const init_video = (i, j) => {
      let video = new Video(json.list[i].playlist[j]);
      getInfo(video).then(() => json.list[i].playlist[j] = video);
  }
  for (i = 0; i < data.length; i++) {
      for (j = 0; j < json.list[data[i]].playlist.length; j++) {
          init_video(data[i], j);
      }
  }
})();

setTimeout(() => {
  console.log(JSON.stringify(json.list, null, 2));
}, 3000);

function getInfo(video) {
  return new Promise((resolve, reject) => {
    youtube.videos.list({
      part: 'snippet, contentDetails',
      fields: 'items(snippet(title,thumbnails(standard,high),channelTitle), contentDetails(duration))',
      id: video.myId
    }, (err, res) => {
      res = res.data.items[0];
      if (!res) return;
      video.myTitle = res.snippet.title;
      video.myDuration = timeConverter(res.contentDetails.duration);
      video.myChannel = res.snippet.channelTitle;
      res = res.snippet.thumbnails;
      video.myThumbnail = res.standard ? res.standard.url : res.high.url;
    });
  
    youtube.commentThreads.list({
      part: 'snippet',
      order: 'relevance',
      videoId: video.myId,
      maxResults: 100
    }, (err, res) => {
      if (!res) return;
      const arr = [];
      for (let i = 0; i < res.data.pageInfo.totalResults; i++) {
          arr.push(res.data.items[i].snippet.topLevelComment.snippet.textOriginal);
      }
      //video.myComments = arr;
      resolve();
    });
  });
}

function timeConverter(time) {
  let h = 0, m = 0, s = 0;
  const pattern = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/; 
  const matches = pattern.exec(time);
  if (matches[1]) h = Number(matches[1]); 
  if (matches[2]) m = Number(matches[2]); 
  if (matches[3]) s = Number(matches[3]);
  return h * 3600 + m * 60 + s;
}