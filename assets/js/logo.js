



const LogoMove = () =>{

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
  
  tl.to('#logo-white', {
    autoAlpha: 0,
    duration: 1,
  }, 2);
  
  tl.to('#logo-colored', {
    autoAlpha: 1,
    duration: 1,
  }, '<');
  
  tl.to('.background-gradient', {
    opacity: 0,
    duration: 1,
  }, '<');
  
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
  

LogoMove();

// function init(){
//   LogoMove()
//   LogoExpand()
// }

// init();