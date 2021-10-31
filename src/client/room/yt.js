import { user } from './config';
import { events } from "./events";

/* 基本設定 */
let player;
let timeUpdater; // 時間カウント用タイマー
let deviceDelayTime = { time: 0, start: false }; // 端末遅延時間計測

/* 初期化 */
const initYT = () => {
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

/* iframe生成 */
window['onYouTubeIframeAPIReady'] = () => {
  player = new YT.Player('player', {
    height: controlYT.setSize('height'),
    width: controlYT.setSize('width'),
    videoId: room.playlist[room.playlist_number].id,
    playerVars: {
      start: room.video_start_time, // 再生開始時間
      playsinline: 1,               // インライン再生
      autoplay: 1,                  // 自動再生
      controls: 1,                  // コントロール表示
      enablejsapi: 1,               // JavaScript API 有効
      modestbranding: 1,            // yutubeロゴの非表示
      iv_load_policy: 3,            // 動画アノテーションを表示しない
      rel: 0                        // 再生終了時に関連動画を表示しない
    },
    events: {
      'onReady': controlYT.onReady,
      'onStateChange': controlYT.onStateChange
    }
  });
};

/* コントロール関数 */
const controlYT = {

  setSize(type) { // プレイヤーサイズ設定
    const aspectRatio = [16, 9]; // アスペクト比
    const playerRatio = 1.6; // プレイヤー比
    const width = window.innerWidth > 1024 ? window.innerWidth / playerRatio : window.innerWidth;
    const height = (width / aspectRatio[0]) * aspectRatio[1];

    return type === 'width' ? width : height;
  },

  onReady(event) { // プレイヤー準備時
    document.getElementById('video_title').textContent = room.playlist[room.playlist_number].title; // 動画タイトル表示
    document.getElementById('video_channel').textContent = room.playlist[room.playlist_number].channel; // 動画チャンネル表示
    controlYT.setVolume(event.target.getVolume()); // 初期音量設定
    event.target.mute(); // ミュート
    event.target.playVideo(); // 動画再生
    timeUpdater = setInterval(() => controlYT.onTimeUpdate(event), 1000); // 1秒ごとに更新
  },

  onTimeUpdate(event) { // 時間更新時
    const currentTime = event.target.getCurrentTime(); // 現在時間
    const duration = room.playlist[room.playlist_number].duration; // 全体時間

    document.getElementById('seekbar').value = (currentTime / duration) * 1e3; // シークバー動作
    document.getElementById('video_time_current').textContent = controlYT.getTime(currentTime);         
    document.getElementById('video_time_duration').textContent = controlYT.getTime(duration);
  },

  onStateChange(event) { // プレイヤー変更時
    let stateIns; // 動画ステータス

    switch (event.data) {
      case -1: stateIns = '未開始'; break;
      case 0:
        stateIns = '終了';
        clearInterval(timeUpdater);
        break;
      case 1:
        stateIns = '再生中';

        if (deviceDelayTime.start) {
          user.setDeviceDelayTime = performance.now() - deviceDelayTime.time;
          deviceDelayTime.start = false;
        }

        break;
      case 2:
        stateIns = '停止';
        break;
      case  3: stateIns = 'バッファリング中'; break;
      case  5: stateIns = '頭出し済み'; break;
      default: break;
    }
  },

  onClickButtonEvents(data) { // プレイヤーのボタン操作時
    switch (data.type) {
      case 'play': player.playVideo(); break;    // 再生
      case 'pause': player.pauseVideo(); break;  // 一時停止
    }

    events.timeSync() // 時刻同期
  },

  onReceiveButtonEvents(data) { // プレイヤーのボタン操作イベント受信時
    data.timestamp.t2 = events.getCorrectionTime(Date.now()); // 現在時刻

    const seekTime = data.currentTime + (data.timestamp.t2 - data.timestamp.t1 + user.getDeviceDelayTime) * 1e-3;
    player.seekTo(seekTime); // 再生位置を移動

    switch (data.type) {
      case 'play': // 再生
        player.playVideo();
        deviceDelayTime.time = performance.now();
        deviceDelayTime.start = true;
        break;
      case 'pause': player.pauseVideo(); break;  // 一時停止
    }
  },

  setVolume(value) { // プレイヤーの音量設定
    if (isNaN(value)) value = value.currentTarget.value;

    player.setVolume(value);
    document.getElementById('volume').value = value;
  },

  setMute() { // プレイヤーのミュート設定
    const volume = document.getElementById('volume');

    if (player.isMuted()) {
      player.unMute();
      volume.value = player.getVolume();
    } else {
      player.mute();
      volume.value = 0;
    }
  },

  getTime(seconds) { // 時間の表記変換
    const hour = ~~(seconds / 60 / 60);
    const min = ~~(seconds / 60) % 60;
    const sec = (`00${~~(seconds % 60)}`).slice(-2);
    let time = `${min}:${sec}`;

    if (hour !== 0) time = `${hour}:${time}`;

    return time;
  }

};

/* リサイズ */
window.onresize = () => {
  player.setSize(
    controlYT.setSize('width'),
    controlYT.setSize('height')
  );
}

export { initYT, controlYT, player };
