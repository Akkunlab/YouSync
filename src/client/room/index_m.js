import { events } from "./events";
import { objects } from "./objects";
import { initYT } from "./yt";
import "../sass/room_m.scss"; // スタイルシートの読込

/* view初期化 */
const initViews = () => {
  const Height = 50;
  const player = document.getElementById('player');
  const playlist = document.getElementById('playlist_content');
  const coordinate = window.innerHeight - player.clientHeight - Height;

  playlist.style.height = `${coordinate}px`;
}

/* Playlist 移動 */
let isPlaylist = false;
document.getElementById('playlist_toggle').addEventListener('change', () => {
  const playlist = document.getElementById('playlist');
  const top = document.getElementById('video_detail').getBoundingClientRect().top;
  const coordinate = window.innerHeight - top;
  
  document.getElementById('bar').classList.toggle('is-hidden'); // barを非表示
  playlist.style.cssText = isPlaylist ? 'transform: translateY(0);' : `transform: translateY(-${coordinate}px);`;
  isPlaylist = !isPlaylist;
});

/* PlayerSeekBar 動作 */
const seekbar = document.getElementById('seekbar');
const onChangeSeekBar = () => {
  const value = seekbar.value;
  const trueColor = '#f00';
  const falseColor = '#444';

  seekbar.style.cssText = `background: linear-gradient(to right, ${trueColor} 0%, ${trueColor} ${value}%, ${falseColor} ${value}%, ${falseColor} 100%);`
}
seekbar.addEventListener('change', onChangeSeekBar, false);
seekbar.addEventListener('input', onChangeSeekBar, false);

/* リサイズ時 */
window.onresize = () => {
  initViews(); // 初期化
}

/* 初期化 */
const init = (() => {
  console.log(room); // 部屋情報
  objects.createPlayList(); // プレイリスト作成
  events.checkDevice(); // デバイス確認
  events.initTimeSync(); // 時刻同期
  initYT(); // YouTube Player初期化
  initViews(); // view初期化

  // 全体イベント
  const seekbar = document.getElementById('seekbar');

  document.getElementById('previous').addEventListener('click', events.onClickPlayerButton);
  document.getElementById('play_pause').addEventListener('click', events.onClickPlayerButton);
  document.getElementById('next').addEventListener('click', events.onClickPlayerButton);
  seekbar.addEventListener('change', events.onChangeSeekBar, false);
  seekbar.addEventListener('input', events.onChangeSeekBar, false);
})();
