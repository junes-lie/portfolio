
const topBtn = document.querySelector('.top-btn');
const logoBtn = document.querySelector('.logo-btn');
const linkBtns = document.querySelector('.link-btns');

topBtn.addEventListener('click', () => {
  gsap.to(document.body, {scrollTo: 0, ease: "power1.inOut"});
  // smoother.scrollTo(0, true);
});

logoBtn.addEventListener('click', () => {
  linkBtns.classList.toggle('active');
});
