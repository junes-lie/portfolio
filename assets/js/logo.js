



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
  document.body.style.overflowY = 'auto';
  document.scrollingElement.scrollTo(0,0);

  const minScreenWidth = 360;
  const maxScreenWidth = 1400;
  const clampedWidth = gsap.utils.clamp(minScreenWidth, maxScreenWidth, window.innerWidth);

  const getScale = gsap.utils.mapRange(
    minScreenWidth,
    maxScreenWidth,
    0.9, //모바일
    0.7 //데탑
  );

  const getYPercent = gsap.utils.mapRange(
    minScreenWidth,
    maxScreenWidth,
    -60, //모바일
    -40 //데탑
  );

  const getBlurValue = gsap.utils.mapRange(
    minScreenWidth,
    maxScreenWidth,
    10, //모바일
    15 //데탑
  );

  const scaleValue = getScale(clampedWidth);
  const yPercentValue = getYPercent(clampedWidth);
  const blurValue = getBlurValue(clampedWidth);
  const dimColor = 'var(--opacity)';


  const tl = gsap.timeline();
  
  tl.set('#load',{zIndex: -1});
  tl.set('.possessive h1', { display:'block', opacity: 0});
  
  tl.to('.loader-text',{autoAlpha: 0});
  tl.to('.background-gradient',{borderRadius: '50%', filter: `blur(${blurValue}rem)`}, "<");
  tl.to('#load .logo .half-circle, #load .logo .wave',{stroke: dimColor}, "<");
  tl.to('#load .logo .brush-head, #load .logo .brush-body',{fill: dimColor, stroke:'none'}, "<");
  tl.to('#load .logo .search',{fill: dimColor}, "<");
  tl.to('.possessive',{scale: scaleValue, yPercent: yPercentValue}, "<")
  .to('.possessive h1',{opacity: 1})

};

function Loading() {
  LogoDraw();
  
  const img = gsap.utils.toArray('img');
  const loader = document.querySelector('.loader-text');

  const updateProgress = (instance)=>{
    loader.textContent = `${Math.round(instance.progressedCount * 100 / img.length)}%`
  };

  imagesLoaded(img)
  .on('progress', updateProgress)
  .on('always', init);
};

Loading();
// window.addEventListener('DOMContentLoaded', Loading);


  
