const gallery = document.querySelector('#uxui .gallery');
const items = gallery.querySelectorAll('.gallery-item');
let currentIndex = 0;
let playTimer = null;
const AUTO_DELAY = 5000;

function activateItem(index) {
  items.forEach((item, i) => {
    if (i === index) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  currentIndex = index;
}

function startAutoPlay() {
  stopAutoPlay();
  playTimer = setInterval(() => {
    let next = (currentIndex + 1) % items.length;
    activateItem(next);
  }, AUTO_DELAY);
}

function stopAutoPlay() {
  if (playTimer) clearInterval(playTimer);
}

items.forEach((item, index) => {
  item.addEventListener('mouseenter', () => {
    activateItem(index);
    stopAutoPlay();
  });
  
  item.addEventListener('click', () => {
    activateItem(index);
    startAutoPlay();
  });
});

gallery.addEventListener('mouseleave', () => {
  startAutoPlay();
});

startAutoPlay();