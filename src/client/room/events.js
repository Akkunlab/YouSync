import { config, user } from "./config";
import { socketEvents } from "./socket";
import { controlYT, player } from "./yt";

/* イベント */
const events = {

  checkDevice() { // デバイスチェック
    if (navigator.userAgent.match(/(iPhone|iPad|iPod|Android|Mobile)/i)) { // モバイル
      document.getElementsByClassName('volume')[0].style.display = 'none';      // ボリュームバー非表示
      document.getElementsByClassName('video_time')[0].style.display = 'none';  // 動画時間非表示
      user.setDevice = 'mobile';
    } else { // PC
      user.setDevice = 'pc';
    }
  },

  initTimeSync() { // 時刻同期初期化
    const interval = config.timeSyncInterval;

    setTimeout(function run() {
      events.timeSync()
      setTimeout(run, interval);
    }, 100);
  },

  timeSync() { // 時刻同期
    const data = { t1: Date.now() };
    socketEvents.send('timeSync', data); // 送信
  },

  onClickPlayerButton(event) { // プレイヤーの操作
    const data = {
      type: event.currentTarget.id,                    // ボタンの種類
      currentTime: player.getCurrentTime(),            // 現在時間
      timestamp: { t1: events.getCorrectionTime(Date.now()) } // 現在時刻
    };

    if (data.type === 'play_pause') data.type = player.getPlayerState() === 1 ? 'pause' : 'play'; // 再生，一時停止判断

    controlYT.onClickButtonEvents(data); // 自分のPlayerを操作
    socketEvents.send('playerButton', data); // 送信
  },

  getCorrectionTime(time) { // 補正した時間を取得
    return time + user.getDelayTime;
  }

};

export { events };
