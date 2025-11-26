
const topBtn = document.querySelector('.top-btn');
const logoBtn = document.querySelector('.logo-btn');
const linkBtns = document.querySelector('.link-btns');

topBtn.addEventListener('click', () => {
  smoother.scrollTo(0, false);
});

logoBtn.addEventListener('click', () => {
  linkBtns.classList.toggle('active');
});
