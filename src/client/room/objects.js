const objects = {

    createPlayList() {
        let input;
        const list = document.getElementsByClassName('playlist_list')[0];
        list.innerHTML = '';

        for (let i = 0; i < room.playlist.length; i++) {
            input =
                `<li class="playlist_item">
                <div class="playlist_item_number">${i + 1}</div>
                <a class="playlist_item_thumbnail" title="YouTubeで見る" href="https://youtu.be/${room.playlist[i].id}" target="_blank">
                    <img src=${room.playlist[i].thumbnail}>
                </a>
                <div class="playlist_item_caption">
                    <div class="playlist_item_title">${room.playlist[i].title}</div>
                    <div class="playlist_item_channel">${room.playlist[i].channel}</div>
                </div>
                <div class="buttons">
                    <button id="playlist_delete" onclick="button('delete', '${room.playlist[i]}')">
                        <svg width="20" hight="20" viewBox="0 0 512 512"><use xlink:href="/img/graphics.svg#delete"></use></svg>
                    </button>
                </div>
            </li>`;
            list.insertAdjacentHTML('beforeend', input);
        }

        const now = document.getElementsByClassName('playlist_item')[room.playlist_number];
        now.children[0].innerHTML = `<svg width="10" hight="10" viewBox="0 0 448 512"><use xlink:href="/img/graphics.svg#play"></use></svg>`;
        now.children[0].style.fill = '#606060';
        now.style.background = '#d8d8d8';
    }
};

export { objects };
