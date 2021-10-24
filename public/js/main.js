'use strict';

/* 基本設定 */
let Room;
let player;
let user = {};

/* クラス */

/* Socket.io */
const host = 'http://localhost:3000';   // ホスト名
const io_time = io(`${host}/io_time`);  // 時刻同期
const io_set = io(`${host}/io_set`);    // 設定


/* 初期化 */
const init = (() => {

    // 1_path確認
    io_set.emit('path', location.pathname.replace('/', ''));
    io_set.on("path", data => {
        if (data) {
            Room = data;
            init_YT();
            console.log(Room);
        } else {
            location.href = host;
        }
    });

    // 2_デバイス確認
    if (navigator.userAgent.match(/(iPhone|iPad|iPod|Android|Mobile)/i)) {
        document.getElementById('pop_input').blur();                              // 初期画面フォーカス外す
        document.getElementsByClassName('volume')[0].style.display = 'none';      // ボリュームバー非表示
        document.getElementsByClassName('video_time')[0].style.display = 'none';  // 動画時間非表示
    }

    // 初期ポップアップ
    document.getElementById('pop_button').addEventListener('click', pop);
    function pop() {
        const e = document.getElementById('pop');
        const Name = document.set_user_name.pop_input.value;
        const RoomName = location.pathname.replace('/', '');
        const duration = 3000;

        if (!Name) return;
        if (!navigator.userAgent.match(/(iPhone|iPad|iPod|Android|Mobile)/i)) ctrl.mute();  // PCのみ
        player.playVideo();
        e.removeEventListener('click', pop, true);
        io_set.emit('set_user_data', { Name, RoomName });
        setTimeout(() => e.remove(), duration);
        setTimeout(() => {
            //Room.player_status == 'play' ? player.playVideo() : func.button_ani('pause'); // 現在の状態
            if (Room.player_status == 'pause') {                                            // 現在の状態
                player.pauseVideo();
                func.button_ani('pause');
            }
        }, 2000);
        anime({
            targets: e,
            top: -screen.height,
            easing: 'easeOutCubic',
            duration: duration,
            delay: 200
        });
        
    };

})();


/*  YouTubePlayer同期 */
io_set.on('sync_player_get', () => {
    const time = player.getCurrentTime() + (user.roundtriptime / 1000);
    io_set.emit('sync_player', time);   
});
io_set.on('sync_player_set', data => {
    data += user.roundtriptime / 1000;
    player.playVideo();
    player.seekTo(data);
});


/* 部屋同期 */
io_set.on('sync_room', data => {
    Room = data;
    func.create_playlist();
});


/* ボタン同期 */
function button(type) {
    const delay = 0;                                                                        // 遅延
    const time = Date.now() + delay;                                                        // 現在時刻 + 遅延
    const video_time = player.getCurrentTime();                                             // 動画の現在時間
    if (type === 'play_pause') {
        type = player.getPlayerState() === 1 ? 'pause' : 'play';
        func.button_ani(type);
    }
    io_set.emit('sync_button', { type, time, video_time });                                 // 'sync_button'送信
}

io_set.on('sync_button', data => {
    data.video_time += user.roundtriptime / 1000;
    player.seekTo(data.video_time);
    switch (data.type) {
        case 'play': player.playVideo(); break;
        case 'pause': player.pauseVideo(); break;
        case 'seek': ctrl.seek(data.video_time - 0.3000); break;
        case 'previous': ctrl.load(Room.playlist[Room.playlist_number].id); break;
        case 'next': ctrl.load(Room.playlist[Room.playlist_number].id); break;
    }
});


/* 時刻同期 */
//setTimeout(function send_time() {
    io_time.emit('sync_time_1', Date.now());
    /*setTimeout(send_time, 1000);
}, 0);*/

io_time.on("sync_time_2", time => {
    time.t4 = Date.now();
    user.delaytime = -(() => ((time.t2 - time.t1) - (time.t4 - time.t3)) / 2)();                      // 遅延時間
    user.roundtriptime = (() => (time.t2 - time.t1) + (time.t4 - time.t3))();                         // 往復時間
    if (navigator.userAgent.match(/(iPhone|iPad|iPod|Android|Mobile)/i)) user.roundtriptime += 200;   // モバイル時 (+200ms)
});


/* チャット機能 */
function chat_send_msg() {
    const msg = document.chat_send.chat_msg.value;
    if (msg) {
        io_set.emit('message', { msg });
        document.chat_send.chat_msg.value = '';
    }
}

io_set.on("message", data => {
    chat_input_msg(data.name, data.msg);
    YT_input_msg(data.msg);
});

function chat_input_msg(name, msg) {
    const input = `<div class="user_msg"><span class="msg_name">${name}</span><span class="msg_msg">${msg}</span></div>`;
    const chat_main = document.getElementsByClassName('chat_main')[0];
    document.getElementById('chat_logs').insertAdjacentHTML('beforeend', input);
    chat_main.scrollTo(0, chat_main.scrollHeight);
};

function YT_input_msg(msg) {
    const comment = document.getElementById('comment');
    const input = `<span class="comment_item">${msg}</span>`;
    const duration = 4e3;
    
    comment.insertAdjacentHTML('beforeend', input);
    setTimeout(() => comment.children[0].remove(), duration);
};


/* アニメーション */
/*document.body.addEventListener("click", drop);
function drop(e) {
    const x = e.pageX;
    const y = e.pageY;
    const sizuku = document.createElement("div");

    sizuku.style.top = y + "px";
    sizuku.style.left = x + "px";
    document.body.appendChild(sizuku);
    sizuku.className = "sizuku";

    sizuku.addEventListener("animationend", function() {
        this.parentNode.removeChild(this);
    }, false);
}*/