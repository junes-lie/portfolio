const gallery = document.querySelector('#uxui .gallery');
const items = gallery.querySelectorAll('.gallery-item');
let currentIndex = 0;

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

const galleryAutoPlay = createAutoPlay(() => {
  activateItem((currentIndex + 1) % items.length);
});

items.forEach((item, index) => {
  item.addEventListener('mouseenter', () => {
    activateItem(index);
    galleryAutoPlay.stop();
  });

  item.addEventListener('click', () => {
    activateItem(index);
    galleryAutoPlay.start();
  });
});

gallery.addEventListener('mouseleave', () => {
  galleryAutoPlay.start();
});

galleryAutoPlay.start();
