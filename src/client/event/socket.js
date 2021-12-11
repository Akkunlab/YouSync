import { config } from './config';
import { events } from './events';

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

export { socketEvents };
