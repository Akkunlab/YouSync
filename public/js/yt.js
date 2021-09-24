/* 初期化 */
function init_YT() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

/* 動画生成 */
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        width: ctrl.wh('w'),
        height: ctrl.wh('h'),
        videoId: Room.playlist[Room.playlist_number].id,
        playerVars: {
            playsinline: 1,           // インライン再生
            autoplay: 1,              // 自動再生
            loop: 1,                  // ループ有効
            controls: 1,              // コントロールバー非表示
            enablejsapi: 1,           // JavaScript API 有効
            modestbranding: 1,        // yutubeロゴの非表示
            iv_load_policy: 3,        // 動画アノテーションを表示しない
            disablekb: 1,             // キーボード操作OFF
            rel: 1                    // 再生終了時に関連動画を表示しない
        },
        events: {
            'onReady': ctrl.onPlayerReady,
            'onStateChange': ctrl.onPlayerStateChange,
        }
    });
}

/* 関数 */
const ctrl = {
    
    onPlayerReady() {
        ctrl.mute();
        ctrl.volume(player.getVolume());                                                                // 初期音量
        player.pauseVideo();
        document.getElementById('video_title').innerHTML = Room.playlist[Room.playlist_number].title;   // タイトル表示

        clearInterval(time_update);
        var time_update = setInterval(() => {                                                           // 更新
            ctrl.time();
            ctrl.seekbar();
        }, 1000);
    },

    onPlayerStateChange() {
        let stateIns;
    
        switch (player.getPlayerState()) {
            case -1:
                stateIns = '未開始';
                break;
            case 0:
                stateIns = '終了';
                button('next');
                break;
            case 1:
                stateIns = '再生中';
                break;
            case 2:
                stateIns = '停止';
                break;
            case 3:
                stateIns = 'バッファリング中';
                break;
            case 5:
                stateIns = '頭出し済み';
                break;
            default:
                break;
        }

    },

    load(id) {
        document.getElementById('video_title').innerHTML = Room.playlist[Room.playlist_number].title;
        player.loadVideoById(id);
        //this.comments();
    },

    seek(time) {
        player.seekTo(time);
        document.getElementsByClassName('seekbar')[0].value = (player.getCurrentTime() / Room.playlist[Room.playlist_number].duration) * 1e3;
    },

    seekbar() {
        document.getElementsByClassName('seekbar')[0].value = (player.getCurrentTime() / Room.playlist[Room.playlist_number].duration) * 1e3;
    },

    volume(value) {
        player.setVolume(value);
        document.getElementsByClassName('volume')[0].value = value;
    },

    mute() {
        const volume = document.getElementsByClassName('volume')[0];

        if (player.isMuted()) {
            player.unMute();
            volume.value = player.getVolume();
            func.button_ani('unMute');
        } else {
            player.mute();
            volume.value = 0;
            func.button_ani('mute');
        }
    },

    time() {
        document.getElementById('now').innerHTML = ctrl.math_time(player.getCurrentTime());         // 現在時間
        document.getElementById('total').innerHTML = ` / ${ctrl.math_time(Room.playlist[Room.playlist_number].duration)}`;  // 全体時間
    },

    comments() {
        let count = 0;
        const arr = Room.playlist[Room.playlist_number].comments;
        const time = Room.playlist[Room.playlist_number].duration / arr.length * 1000; // 全体時間 / コメント数 * 1000(s > ms変換)

        clearInterval(timer);
        var timer = setInterval(() => {
            count++;
            if (count >= arr.length) clearInterval(timer);
            YT_input_msg(arr[count]);
        }, time);
    },

    math_time(seconds) {
        const hour = ~~(seconds / 60 / 60);
        const min = ~~(seconds / 60) % 60;
        const sec = (`00${~~(seconds % 60)}`).slice(-2);
        let result = `${min}:${sec}`;

        if (hour !== 0) result = `${hour}:${result}`;

        return result;
    },

    wh(type) {
        const r = 1.6; // 比率
        const bar_size = 36; // px
        const comment = document.getElementById('comment');
        let w = window.innerWidth;
        let h = w / 16 * 9;
        
        if (w > 1024) {
            w /= r;
            h /= r;
        } else {
            w = document.body.clientWidth;
        }

        comment.style.width = `${w}px`;
        comment.style.height = `${h - bar_size}px`;
        return type === 'w' ? w : h;
    },

    resize() {
        const r = 1.6; // 比率
        const yt = document.getElementById('yt_player');
        const e = document.getElementsByClassName('tab_content');
        let w = document.body.clientWidth;
        let h = w / 16 * 9;

        if (window.innerWidth > 1024) {
            w /= r;
            h /= r;
            for (let i = 0; i < e.length; i++) e[i].style.display = 'block';
        } else {
            func.change_tab('tab_item_yt_player');
            document.getElementById('tab_item_yt_player').checked = true;
        }
    
        player.setSize(w, h);
        yt.style.width = `${w}px`;
        
        //const bar_size = 36; // px
        //const comment = document.getElementById('YT_comment');
        //comment.style.width = `${w}px`;
        //comment.style.height = `${h - bar_size}px`;
    }

};

/* イベント */

// seekbar
document.getElementsByClassName('seekbar')[0].addEventListener('mouseup', e => {
    const time = Room.playlist[Room.playlist_number].duration * (e.target.value / 1e3);
    player.seekTo(time);
    ctrl.time();
    setTimeout(() => button('seek'), 200);
});

// リサイズ
window.onresize = () => ctrl.resize();

export { init_YT, onYouTubeIframeAPIReady, ctrl };