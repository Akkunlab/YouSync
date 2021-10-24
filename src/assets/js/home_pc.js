/* Hamburger menu */
const navInput = document.getElementById('nav_input');
const menu = document.getElementById('menu');
const blocker = document.getElementById('nav_blocker');

document.getElementById('nav_input').addEventListener('change', () => {
  navInput.checked ? menu.classList.remove('hidden') : menu.classList.add('hidden');
});

function initHamburgerMenu() {
  if (1280 < window.innerWidth) {
    navInput.checked = true;
    menu.classList.remove('hidden')
    blocker.style.visibility = 'hidden';
  } else {
    navInput.checked = false;
    blocker.style.visibility = 'unset';
  }
}

initHamburgerMenu();
window.onresize = initHamburgerMenu;
