import { config } from "./config";
import { controlYT } from "./yt";

/* 基本設定 */
const socket = io(config.host);

/* イベント */
const socketEvents = {

    send(eventName, data) { // データ送信
        socket.emit(eventName, data);
        console.log(`[socket: ${eventName}] send ${data}`); // ログ出力
    }

};

/* 受信イベント */

// プレイヤーボタンクリック
socket.on("playerButton", data => {
    controlYT.onReceiveButtonEvents(data);
    console.log(`[socket: playerButton] get ${data}`); // ログ出力
});

export { socketEvents };