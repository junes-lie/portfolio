gsap.registerPlugin(ScrollTrigger,ScrollToPlugin);

const container = document.querySelector('#layout');

const options = {
    damping: 0.1,
    alwaysShowTracks: true,
};

const scrollbar = Scrollbar.init(container, {
  ...options
});


ScrollTrigger.create({
  trigger: '.scroll-content',
  start: 'top top',
  end: 'bottom bottom',
  animation: gsap.from('.progress',{scaleY:0}),
  scrub: true
});