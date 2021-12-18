import { config, user } from './config';
import { events } from './events';
import { objects } from './objects';

/* 基本設定 */
let mData;
const socket = io(`${config.host}/events`);

/* イベント */
const socketEvents = {

  send(eventName, data) { // データ送信
    socket.emit(eventName, data);
    events.log(eventName, data); // ログ出力
  }

};

/* 受信イベント */

// 管理者Data
socket.on('mData', data => {
  mData = data;
  objects.createUnits(mData); // データを表示
  events.log('mData', mData); // ログ出力
});

// 管理者Data追加
socket.on('mDataAdd', data => {
  mData[data.id] = data; // userを追加
  objects.createUnits(mData); // データを表示
  events.log('mDataAdd', mData); // ログ出力
});

// 管理者Data削除
socket.on('mDataDelete', data => {
  delete mData[data.id]; // userを削除
  objects.createUnits(mData); // データを表示
  events.log('mDataDelete', mData); // ログ出力
});

  // 管理システム変更
socket.on('MSChange', data => {
  const func = {

    ms_display_name() { // 表示名を表示
      data.value ? events.showDisplayName(eventData.displayName): events.hiddenDisplayName();
    }

  };

  func[data.id]();
  events.log('MSChange', data); // ログ出力
  console.log(eventData);
});

// 時刻同期
socket.on('timeSync', data => {
  data.t4 = Date.now();
  console.log('data.t4', data.t4);

  user.setDelayTime = ((data.t2 - data.t1) - (data.t4 - data.t3)) / 2; // 遅延時間
  user.setRoundtripTime = (data.t2 - data.t1) + (data.t4 - data.t3);   // 往復時間
});

export { socketEvents };
