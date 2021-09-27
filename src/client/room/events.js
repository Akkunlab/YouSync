import { user, player } from "./config";
import { socketEvents } from "./socket";

/* イベント */
const events = {

  checkDevice() { // デバイスチェック
    if (navigator.userAgent.match(/(iPhone|iPad|iPod|Android|Mobile)/i)) { // モバイル
      document.getElementById('pop_input').blur();                              // 初期画面フォーカス外す
      document.getElementsByClassName('volume')[0].style.display = 'none';      // ボリュームバー非表示
      document.getElementsByClassName('video_time')[0].style.display = 'none';  // 動画時間非表示
      user.device = 'mobile';
    } else { // PC
      user.device = 'pc';
    }
  },

  onClickPlayerButton(event) { // プレイヤーの操作
    const data = {
      type: event.currentTarget.id, // ボタンの種類
      currentTime: player.getCurrentTime() // 現在時間
    };

    if (data.type === 'play_pause') data.type = player.getPlayerState() === 1 ? 'pause' : 'play'; // 再生，一時停止判断
    
    socketEvents.send('playerButton', data); // 送信
  }

};

export { events };