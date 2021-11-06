require('dotenv').config();
const { google } = require('googleapis');

/* YouTube Data API */
const youtube = google.youtube({ version: 'v3', auth: process.env.YOUTUBE_API_KEY });

const yt = {

  /* 動画情報を取得 */
  async getVideoInfo(video) {
    const res = await youtube.videos.list({
      part: 'snippet, contentDetails',
      fields: 'items(snippet(title,thumbnails(standard,high),channelTitle), contentDetails(duration))',
      id: video.myId
    });
    const data = res.data.items[0];
  
    if (!data) return null; // dataがない場合は終了
  
    video.myTitle = data.snippet.title;
    video.myDuration = timeConverter(data.contentDetails.duration);
    video.myChannel = data.snippet.channelTitle;
    video.myThumbnail = data.snippet.thumbnails.standard ? data.snippet.thumbnails.standard.url : data.snippet.thumbnails.high.url;
  
    return video;
  },

  /* 動画のコメントを取得 */
  async getVideoComments(video) {
    const res = await youtube.commentThreads.list({
      part: 'snippet',
      order: 'relevance',
      videoId: video.myId,
      maxResults: 100
    }).catch(err => {
      console.log(err);
    });
  
    if (!res) return null; // resがない場合は終了

    const arr = [];

    // コメントを配列に追加
    for (let i = 0; i < res.data.pageInfo.totalResults; i++) {
      arr.push(res.data.items[i].snippet.topLevelComment.snippet.textOriginal);
    }

    video.myComments = arr;
  
    return video;
  },

};

/* 時間を変換 */
const timeConverter = time => {
  let h = 0, m = 0, s = 0;
  const pattern = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/; 
  const matches = pattern.exec(time);

  if (matches[1]) h = Number(matches[1]); 
  if (matches[2]) m = Number(matches[2]); 
  if (matches[3]) s = Number(matches[3]);

  return h * 3600 + m * 60 + s;
}

module.exports = yt;
