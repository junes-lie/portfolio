
const cards = document.querySelectorAll('#publishing .card');
const indicators = document.querySelectorAll('#publishing .indicator');
let activeIndex = 1;
let autoPlayInterval;

function updateCards() {
  const total = cards.length;

  cards.forEach((card, index) => {
    let relativeIndex = (index - activeIndex + total) % total;
    
    if (relativeIndex === 0) {
      card.style.zIndex = '20';
      card.style.opacity = '1';
      card.style.transform = 'translateX(0%) scale(1) rotate(0deg)';
      card.style.filter = 'brightness(100%)';
    } else if (relativeIndex === 1) {
      card.style.zIndex = '10';
      card.style.opacity = '0.8';
      card.style.transform = 'translateX(60%) scale(0.85) rotate(15deg)';
      card.style.filter = 'brightness(70%)';
    } else {
      card.style.zIndex = '10';
      card.style.opacity = '0.8';
      card.style.transform = 'translateX(-60%) scale(0.85) rotate(-15deg)';
      card.style.filter = 'brightness(70%)';
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