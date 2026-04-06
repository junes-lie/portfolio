gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

const CONFIG = {
  vp: {
    pc: 1400,
    tablet: 768,
    mobile: 360,
  },
};

const minW = CONFIG.vp.mobile;
const maxW = CONFIG.vp.pc;
const clampedWidth = gsap.utils.clamp(minW, maxW, window.innerWidth);
const remap = (min, max) => gsap.utils.mapRange(minW, maxW, min, max, clampedWidth);

window.isIntroDone = false;

function createAutoPlay(callback, delay = 5000) {
  let timer = null;
  return {
    start() { this.stop(); timer = setInterval(callback, delay); },
    stop() { if (timer) { clearInterval(timer); timer = null; } },
    reset() { this.stop(); this.start(); }
  };
}
