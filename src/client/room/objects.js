const objects = {

  createPlayList() {
    let input;
    const list = document.getElementsByClassName('playlist_list')[0];
    list.innerHTML = '';

    for (let i = 0; i < room.playlist.length; i++) {
      input =
      `<li class="playlist_item">
        <a class="playlist_video_link" href="https://youtu.be/${room.playlist[i].id}" title="YouTubeで見る" target="_blank">
          <div class="playlist_video_thumbnail">
            <img class="playlist_video_thumbnail_img" src=${room.playlist[i].thumbnail}>
          </div>
          <div class="playlist_video_title">
            <span class="playlist_video_title_text">${room.playlist[i].title}</span>
            <span class="playlist_video_title_channel">${room.playlist[i].channel}</span>
          </div>
          <div class="playlist_video_duration">
            <span class="playlist_video_duration_text">0:00</span>
          </div>
        </a>
      </li>`;

      list.insertAdjacentHTML('beforeend', input);
    }

    // const now = document.getElementsByClassName('playlist_item')[room.playlist_number];
    // now.children[0].innerHTML = `<svg width="10" hight="10" viewBox="0 0 448 512"><use xlink:href="/img/graphics.svg#play"></use></svg>`;
    // now.children[0].style.fill = '#606060';
    // now.style.background = '#d8d8d8';
  }
};

export { objects };
