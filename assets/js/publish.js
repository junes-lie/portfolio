const section = document.querySelector('#publishing');
const sectionBg = section.querySelector('.section-bg');
const cards = section.querySelectorAll('.card');
const indicators = section.querySelectorAll('.indicator');
let activeIndex = 0;
let autoPlayInterval;

function getTargetSrc(card) {
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;
  return isPortrait ? card.dataset.bgMo : card.dataset.bgPc;
}

function updateCards() {
  const total = cards.length;

  cards.forEach((card, index) => {
    let relativeIndex = (index - activeIndex + total) % total;
    
    if (relativeIndex === 0) {
      card.classList.add('active');
      card.style.zIndex = '20';
      card.style.opacity = '1';
      card.style.transform = 'translateX(0%) scale(1) rotate(0deg)';
      card.style.filter = 'brightness(100%)';

      const finalSrc = getTargetSrc(card);
      sectionBg.style.backgroundImage = `url('${finalSrc}')`;
      
    } else if (relativeIndex === 1) {
      card.classList.remove('active');
      card.style.zIndex = '10';
      card.style.opacity = '0.8';
      card.style.transform = 'translateX(90%) translateY(10%) scale(0.85) rotate(15deg)';
      card.style.filter = 'brightness(50%)';
    } else {
      card.classList.remove('active');
      card.style.zIndex = '10';
      card.style.opacity = '0.8';
      card.style.transform = 'translateX(-90%) translateY(10%) scale(0.85) rotate(-15deg)';
      card.style.filter = 'brightness(50%)';
    }
  });

  indicators.forEach((dot, idx) => {
    if (idx === activeIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

indicators.forEach(indicator => {
  indicator.addEventListener('click', (e) => {
    e.preventDefault();
    activeIndex = parseInt(indicator.getAttribute('data-slide'));
    updateCards();
    resetInterval();
  });
});

function startInterval() {
  autoPlayInterval = setInterval(() => {
    activeIndex = (activeIndex + 1) % cards.length;
    updateCards();
  }, 5000);
}

function resetInterval() {
  clearInterval(autoPlayInterval);
  startInterval();
}

updateCards();
startInterval();