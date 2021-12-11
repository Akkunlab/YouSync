import { config } from './config';
import { events } from './events';

/* 基本設定 */
const socket = io(`${config.host}/events`);

/* イベント */
const socketEvents = {

  send(eventName, data) { // データ送信
    socket.emit(eventName, data);
    events.log(eventName, data) // ログ出力
  }

};

/* 受信イベント */

// 管理者Data
socket.on('mData', data => {
  events.log('mData', data) // ログ出力
});

// 管理者Data追加
socket.on('mDataAdd', data => {
  events.log('mDataAdd', data) // ログ出力
});

// 管理者Data削除
socket.on('mDataDelete', data => {
  events.log('mDataDelete', data) // ログ出力
});

export { socketEvents };
