import { events } from "./events";
import { objects } from "./objects";
import { initYT, controlYT } from "./yt";

/* 初期化 */
const init = (() => {
  console.log(room); // 部屋情報
  objects.createPlayList(); // プレイリスト作成
  events.checkDevice(); // デバイス確認
  initYT(); // YouTube Player初期化

  // // イベント
  document.getElementById('previous').addEventListener('click', events.onClickPlayerButton);
  document.getElementById('play_pause').addEventListener('click', events.onClickPlayerButton);
  document.getElementById('next').addEventListener('click', events.onClickPlayerButton);
  document.getElementById('mute').addEventListener('click', controlYT.setMute);
  document.getElementById('volume').addEventListener('click', controlYT.setVolume);
})();