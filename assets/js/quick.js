
const topBtn = document.querySelector('.top-btn');
const logoBtn = document.querySelector('.logo-btn');
const linkBtns = document.querySelector('.link-btns');

topBtn.addEventListener('click', () => {
  // console.log('click');
  // gsap.to(layout, {scrollTo: 0, ease: "power1.inOut"});
  // scrollbar.scrollTo(0,0,600);
  gsap.to(scrollbar,{
    scrollTo: 0, 
    ease: "power1.inOut"
  });

  // smoother.scrollTo(0, true);
  // document.scrollingElement.scrollTo(0,0);
  // document.scrollingElement.scrollTo({
  // top: 0,
  // behavior: 'smooth'
// });
});

logoBtn.addEventListener('click', () => {
  linkBtns.classList.toggle('active');
});
