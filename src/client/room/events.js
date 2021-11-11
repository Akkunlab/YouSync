import { config, user } from "./config";
import { socketEvents } from "./socket";
import { controlYT, player } from "./yt";

/* イベント */
const events = {

  checkDevice() { // デバイスチェック
    if (navigator.userAgent.match(/(iPhone|iPad|iPod|Android|Mobile)/i)) { // モバイル
      document.getElementById('volume').style.display = 'none'; // ボリュームバー非表示
      document.getElementById('video_time_display').style.display = 'none'; // 動画時間非表示
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

    // 再生，一時停止判断
    if (data.type === 'play_pause') data.type = player.getPlayerState() === 1 ? 'pause' : 'play';

    // 前へ，次への場合
    if (data.type === 'previous' || data.type === 'next') {
      data.room = {
        id: room.id,
        playlist_number: room.playlist_number,
        playlist_length: room.playlist.length
      };
    }

    controlYT.onClickButtonEvents(data); // 自分のPlayerを操作
    socketEvents.send('playerButton', data); // 送信
  },

  getCorrectionTime(time) { // 補正した時間を取得
    return time + user.getDelayTime;
  },

  onChangeSeekBar(setValue) { // seekbar移動
    const seekbar = document.getElementById('seekbar');

    if (!isNaN(setValue)) seekbar.value = setValue; // setValueが数値なら値を設定

    const value = seekbar.value / 10;
    const trueColor = '#f00';
    const falseColor = '#444';

    seekbar.style.cssText = `background: linear-gradient(to right, ${trueColor} 0%, ${trueColor} ${value}%, ${falseColor} ${value}%, ${falseColor} 100%);`
  },

  onSubmitSearch() { // search_formを送信
    const input = document.getElementById('search_input');
    const url = input.value.match(config.youtubeURL);

    // 何も入力がない場合
    if (!input.value) {
      input.focus();
      return;
    }

    // URLが不正な場合
    if (!url) {
      alert('***** エラー *****\n無効なURLです\nYouTubeのURLを入力して下さい');
      input.focus();
      return;
    }

    // URLが正しい場合
    socketEvents.send('search', { roomId: room.id, value: input.value }); // 送信
    input.value = '';
    input.blur();
  },

  onShowStatistics() { // 統計情報を表示
    const statistics = document.getElementById('statistics');
    statistics.style.display = statistics.style.display === 'none' ? 'block' : 'none';
  },

  log(type, obj) { // ログ出力
    console.log(`[${type}]`);
    console.log(JSON.stringify(obj, null, 2));
  }

};

export { events };
