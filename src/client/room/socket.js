import { config } from "./config";
import { controlYT } from "./yt";

/* 基本設定 */
const socket = io(config.host);

/* イベント */
const socketEvents = {

    send(eventName, data) { // データ送信
        socket.emit(eventName, data);
        console.log(`[socket: ${eventName}] send ${data}`);
    }

};

/* 受信イベント */
socket.on("playerButton", controlYT.onReceiveButtonEvents); // プレイヤーボタンクリック

export { socketEvents };