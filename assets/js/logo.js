



const LogoDraw = () =>{

  // 선 그릴 준비
  gsap.utils.toArray('#logo-white .stroke').forEach(path => {
    const length = path.getTotalLength();
    const offset = path.classList.contains('wave2') ? -length : length;
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: offset
    });
  });
  
  const tl = gsap.timeline();
  
  tl.to('#logo-white .half-circle', {
    strokeDashoffset: 0,
    duration: 2,
  }, 0);
  tl.to('#logo-white .wave', {
    strokeDashoffset: 0,
    duration: 1,
  }, 0);
  
  tl.from('#logo-white .up', {
    y: 100,
    autoAlpha: 0,
    duration: 1,
  }, 0);
  
  tl.from('#logo-white .wave1, #logo-white .wave3', {
    x: -5,
    duration: 1,
    ease: "elastic.out(1,0.1)",
  }, 1);
  tl.from('#logo-white .wave2', {
    x: 5,
    duration: 1,
    ease: "elastic.out(1,0.1)"
  },'<');
  
  // tl.to('#logo-white', {
  //   autoAlpha: 0,
  //   duration: 1,
  // }, 2);
  
  // tl.to('#logo-colored', {
  //   autoAlpha: 1,
  //   duration: 1,
  // }, '<');
  
  // tl.to('.background-gradient', {
  //   opacity: 0,
  //   duration: 1,
  // }, '<');
  
  return tl;
}


// const LogoExpand = () =>{

//   // document.body.style.overflow = 'auto';

//   const tl = gsap.timeline()
//   .to('.logo',{scale:50,xPercent:-200})

//   ScrollTrigger.create({
//     trigger: '#intro',
//     start: 'top top',
//     end: '+=3000',
//     animation: tl,
//     pin: true,
//     scrub: 1,
//   })
// }



function init(){
  smoother.paused(false);

  const scaleValue = remap(0.9, 0.7);
  const yPercentValue = remap(-60, -40);
  const blurValue = remap(8, 15);

  const dimColor = 'var(--opacity)';


  const tl = gsap.timeline();
  
  tl.set('#load',{zIndex: -1})
    .set('.possessive h1', { display:'block', opacity: 0})
  
    .to('.loader-text',{autoAlpha: 0})
    .to('.background-gradient',{borderRadius: '50%', filter: `blur(${blurValue}rem)`}, "<")
    .to('#load .logo .half-circle, #load .logo .wave',{stroke: dimColor}, "<")
    .to('#load .logo .brush-head, #load .logo .brush-body',{fill: dimColor, stroke:'none'}, "<")
    .to('#load .logo .search',{fill: dimColor}, "<")
    .to('.possessive',{scale: scaleValue, yPercent: yPercentValue}, "<")
    .to('.possessive h1',{opacity: 1})
    .to('.navigation, .quick-btns', {autoAlpha: 1, duration: 1}, "<");
};

function Loading() {
  gsap.set('.navigation, .quick-btns', {autoAlpha: 0});
  smoother.scrollTo(0, false);
  smoother.paused(true);
  
  let isImageLoaded = false;
  let isLogoFinished = false;

  const checkStart = () => {
    if (isLogoFinished && isImageLoaded) {
      init();
    }
  };

  LogoDraw().eventCallback("onComplete", () =>{
    isLogoFinished = true;
    checkStart();
  });

  const img = gsap.utils.toArray('img');
  const loader = document.querySelector('.loader-text');

  const updateProgress = (instance)=>{
    loader.textContent = `${Math.round(instance.progressedCount * 100 / img.length)}%`
  };

  imagesLoaded(img)
  .on('progress', updateProgress)
  .on('always', () => {
    isImageLoaded = true;
    checkStart();
  });

};

Loading();
