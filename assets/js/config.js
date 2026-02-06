gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

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



const minW = CONFIG.vp.mobile;
const maxW = CONFIG.vp.pc;
const clampedWidth = gsap.utils.clamp(minW, maxW, window.innerWidth);
const remap = (min, max) => gsap.utils.mapRange(minW, maxW, min, max, clampedWidth);


