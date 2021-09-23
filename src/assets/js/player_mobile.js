/* 初期化 */
const init = () => {
    const Height = 50;
    const player = document.getElementById("player");
    const playlist = document.getElementById("playlist_content");
    const coordinate = window.innerHeight - player.clientHeight - (Height * 2);

    playlist.style.height = `${coordinate}px`;
}
init(); // 初期化

/* Playlist 移動 */
let isPlaylist = false;
document.getElementById('playlist_toggle').addEventListener('change', () => {
    const playlistHeight = 50;
    const playlist = document.getElementById("playlist");
    const top = document.getElementById('video_detail').getBoundingClientRect().top;
    const coordinate = window.innerHeight - top - playlistHeight;

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
    init(); // 初期化
}
