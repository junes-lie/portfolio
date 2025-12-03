
const topBtn = document.querySelector('.top-btn');
const logoBtn = document.querySelector('.logo-btn');
const linkBtns = document.querySelector('.link-btns');

topBtn.addEventListener('click', () => {
  isManualMove = true;
  // smoother.scrollTo(0, true);
  sectionMove('#intro', "top top");
});

logoBtn.addEventListener('click', () => {
  linkBtns.classList.toggle('active');
});
