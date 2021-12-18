import { events } from './events';
import '../sass/event.scss'; // スタイルシートの読込

/* 初期化 */
const init = (() => {
  console.log(eventData); // Event情報
  events.init(); // 初期化
  events.initTimeSync(); // 時刻同期

  // 全体イベント
  document.getElementById('entry_enter').addEventListener('click', events.onClickEntry);
  document.getElementById('modal_button').addEventListener('click', events.initEnter);
  document.getElementById('entry_management').addEventListener('click', events.initManagement);
  document.getElementById('blocker').addEventListener('click', events.onClickBlocker); // Blockerクリックイベント
  document.getElementById('modal_close').addEventListener('click', events.onClickBlocker); // モーダル閉クリックイベント
  document.getElementById('ms_display_name').addEventListener('click', events.onChangeMS);
})();
