import "../sass/main_m.scss"; // スタイルシートの読込

/* スクロールアニメーション */
let offset = 0;
const scrollAnimation = lastPosition => {
  const header = document.getElementById('header');
  const tab = document.getElementById('tab');
  const height = header.clientHeight;

  if (lastPosition > height) {
    if (lastPosition > offset) {
      header.classList.add('animation');
      tab.classList.add('animation');
    } else {
      header.classList.remove('animation');
      tab.classList.remove('animation');
    }

    offset = lastPosition;
  }
}

/* スクロール時 */
window.onscroll = () => {
  scrollAnimation(window.scrollY);
}
