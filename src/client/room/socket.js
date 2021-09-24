import { config } from "./config";
import { controlYT } from "./yt";

/* 基本設定 */
// const ioTime = io(`${config.host}/io_time`);  // 時刻同期
// const ioSet = io(`${config.host}/io_set`);    // 設定

/* イベント */
const socketEvents = {

    send(eventName, data) { // データ送信
        ioSet.emit(eventName, data);
        console.log('[socket] send data');
    }

};

/* 受信イベント */
ioSet.on("playerButton", controlYT.onReceiveButtonEvents); // プレイヤーボタンクリック

export { socketEvents };