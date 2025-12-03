const CONFIG = {
  vp: {
    pc: 1400,
    tablet: 768,
    mobile: 360,
  },

  // colors: {
  //   opacity: 'rgba(255, 255, 255, 0.7)' 
  // }
};

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// let smoother = ScrollSmoother.create({
//   content: "#layout",
//   smooth: 2,
//   effects: true,
//   smoothTouch: 0.1,
//   // markers: true,
// });

const minW = CONFIG.vp.mobile;
  const maxW = CONFIG.vp.pc;
  const clampedWidth = gsap.utils.clamp(minW, maxW, window.innerWidth);
  const remap = (min, max) => gsap.utils.mapRange(minW, maxW, min, max, clampedWidth);


