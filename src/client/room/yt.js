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
    const playerRatio = 1.685; // プレイヤー比
    const width = window.innerWidth > 1024 ? window.innerWidth / playerRatio : window.innerWidth;
    const height = (width / aspectRatio[0]) * aspectRatio[1];

    return type === 'width' ? width : height;
  },

  onReady(event) { // プレイヤー準備時
    controlYT.load(null, event);
    controlYT.setVolume(event.target.getVolume()); // 初期音量設定
    event.target.mute(); // ミュート
    event.target.playVideo(); // 動画再生
    timeUpdater = setInterval(controlYT.onTimeUpdate, 1000); // 1秒ごとに更新
  },

  onTimeUpdate() { // 時間更新時
    const currentTime = player.getCurrentTime(); // 現在時間
    const duration = room.playlist[room.playlist_number].duration; // 全体時間

    events.onChangeSeekBar((currentTime / duration) * 1e3); // シークバー動作
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

          // 統計情報を更新
          const deviceDelayTimeDiv = document.getElementById('statistics_device_delay_time');
          deviceDelayTimeDiv.textContent = user.getDeviceDelayTime;
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
      case 'play':
        player.playVideo();
        deviceDelayTime.time = performance.now();
        deviceDelayTime.start = true;
        break;
      case 'pause': player.pauseVideo(); break;  // 一時停止
    }

    // events.timeSync() // 時刻同期
  },

  onReceiveButtonEvents(data) { // プレイヤーのボタン操作イベント受信時
    const oneWayTime = events.getCorrectionTime(Date.now()) - data.timestamp.t1; // 片道時間
    const seekTime = data.currentTime + (oneWayTime + user.getDeviceDelayTime) * 1e-3;

    player.seekTo(seekTime); // 再生位置を移動

    switch (data.type) {
      case 'play': player.playVideo(); break; // 再生
      case 'pause': player.pauseVideo(); break; // 一時停止
      case 'previous':
      case 'next':
        room.playlist_number = data.playlist_number // room情報を更新
        controlYT.load(room.playlist[room.playlist_number].id) // 動画をロード
    }

    // 統計情報を更新
    const oneWayTimeDiv = document.getElementById('statistics_one_way_time');
    oneWayTimeDiv.textContent = oneWayTime;
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

  load(id) { // 動画をロード

    if (id) player.loadVideoById(id);
    
    // 動画タイトル表示
    const videoTitleElements = document.getElementsByClassName('video_title_text');

    for (let i = 0; i < videoTitleElements.length; i++) {
      videoTitleElements[i].textContent = room.playlist[room.playlist_number].title;
    }

    document.getElementById('video_channel').textContent = room.playlist[room.playlist_number].channel; // 動画チャンネル表示

    // タイマーを初期化
    if (timeUpdater) {
      clearInterval(timeUpdater);
      timeUpdater = setInterval(controlYT.onTimeUpdate, 1000); // 1秒ごとに更新
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
