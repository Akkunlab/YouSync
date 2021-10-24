const func = {

    change_tab(id) {
        const e = document.getElementsByClassName('tab_content');
        for (let i = 0; i < e.length; i++) e[i].style.display = 'none';
        document.getElementById(id.substring(9)).style.display = 'block';  // 'tab_item_yt_player' > 'yt_player'
    },

    create_playlist() {
        let input;
        const list = document.getElementsByClassName('playlist_list')[0];
        list.innerHTML = "";

        for (let i = 0; i < Room.playlist.length; i++) {
            input =
            `<li class="playlist_item">
                <div class="playlist_item_number">${i+1}</div>
                <a class="playlist_item_thumbnail" title="YouTubeで見る" href="https://youtu.be/${Room.playlist[i].id}" target="_blank">
                    <img src=${Room.playlist[i].thumbnail}>
                </a>
                <div class="playlist_item_caption">
                    <div class="playlist_item_title">${Room.playlist[i].title}</div>
                    <div class="playlist_item_channel">${Room.playlist[i].channel}</div>
                </div>
                <div class="buttons">
                    <button id="playlist_delete" onclick="button('delete', '${Room.playlist[i]}')">
                        <svg width="20" hight="20" viewBox="0 0 512 512"><use xlink:href="/img/graphics.svg#delete"></use></svg>
                    </button>
                </div>
            </li>`;
            list.insertAdjacentHTML('beforeend', input);
        }

        const now = document.getElementsByClassName('playlist_item')[Room.playlist_number];
        now.children[0].innerHTML = `<svg width="10" hight="10" viewBox="0 0 448 512"><use xlink:href="/img/graphics.svg#play"></use></svg>`;
        now.children[0].style.fill = '#606060';
        now.style.background = '#d8d8d8';
    },

    search() {
        const search = document.getElementById('search_input');

        if (search.value) {
            const id = search.value.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);
            if (id) {
                io_set.emit('sync_button', { type: 'add', url: search.value });
                search.value = "";
                search.blur();
            } else {
                alert('***** エラー *****\n無効なURLです\nYouTubeのURLを入力して下さい');
                search.focus();
            }
            setTimeout(() => this.blocker(), 10);
        } else {
            setTimeout(() => search.focus(), 10);
        }
    },

    blocker() {
        document.getElementById('search_check').checked = false;
        document.getElementById('search_input').value = "";
    },

    button_ani(type) {
        const funcs = {

            play() { 
                const e = document.getElementsByClassName('play_pause_svg')[0];
                e.setAttribute('xlink:href', '/img/graphics.svg#pause');
            },

            pause() { 
                const e = document.getElementsByClassName('play_pause_svg')[0];
                e.setAttribute('xlink:href', '/img/graphics.svg#play');
            },

            mute() { 
                const e = document.getElementsByClassName('mute_svg')[0];
                e.insertAdjacentHTML('beforeend', '<use xlink:href="/img/graphics.svg#mute"></use>');
            },

            unMute() {
                const e = document.getElementsByClassName('mute_svg')[0];
                e.innerHTML = '<use xlink:href="/img/graphics.svg#volume_up"></use>';
            }

        }

        funcs[type]();
    }

};