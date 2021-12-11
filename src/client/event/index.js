import { events } from "./events";
import "../sass/event.scss"; // スタイルシートの読込

/* 初期化 */
const init = (() => {
  console.log(eventData); // Event情報
  events.init() // 初期化

  // 全体イベント
  document.getElementById('entry_enter').addEventListener('click', events.initEnter);
  document.getElementById('entry_management').addEventListener('click', events.initManagement);
})();
