import { config, user } from './config';
import { controlYT } from './yt';
import { events } from './events';
import { objects } from './objects';

/* 基本設定 */
const socket = io(config.host);

/* イベント */
const socketEvents = {

  send(eventName, data) { // データ送信
    socket.emit(eventName, data);
    events.log(eventName, data) // ログ出力
  }

};

/* 受信イベント */

// プレイヤーボタンクリック
socket.on('playerButton', data => {
  controlYT.onReceiveButtonEvents(data);
  events.log('playerButton', data) // ログ出力
});

// 検索
socket.on('search', data => {
  room.playlist.push(data); // room情報を更新
  objects.createPlayList(); // プレイリスト作成
  events.log('Update', data) // ログ出力
});

// 時刻同期
socket.on('timeSync', data => {
  data.t4 = Date.now();

  user.setDelayTime = ((data.t2 - data.t1) - (data.t4 - data.t3)) / 2; // 遅延時間
  user.setRoundtripTime = (data.t2 - data.t1) + (data.t4 - data.t3);   // 往復時間
});

export { socketEvents };
