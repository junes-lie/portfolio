



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

function logoFlip() {
  const logo = document.querySelector('.logo');

  let timer;

  const AutoFlip = () => {
    
    timer = setInterval(() => {
      logo.classList.add('flipped');
      
      setTimeout(() => {
        if (!logo.matches(':hover')) {
          logo.classList.remove('flipped');
        }
      }, 5000);
    }, 10000);
  };

  logo.addEventListener('mouseenter', () => {
    clearInterval(timer);
    logo.classList.remove('flipped');
  });

  logo.addEventListener('mouseleave', () => {
    AutoFlip();
  });

  AutoFlip();
}


function init(){
  smoother.paused(false);

  const blurValue = remap(8, 25);
  const dimColor = 'var(--opacity)';

  const tl = gsap.timeline();
  const splitH1 = new SplitText('h1.title',{type:'chars'});
  const splitH2 = new SplitText('h2.title',{type:'chars'});
  
  tl
    .set('#intro .logo', {pointerEvents: 'auto'})
    .set('.title', {height: 'auto', autoAlpha: 1})
    .to('.loader-text',{height: 0, autoAlpha: 0}, "<")
    .to('.loader-wrap',{gap: 0}, "<")
    .to('.possessive-wrap',{height: '25vmin'}, "<")
    .to('.possessive',{width: 'auto', autoAlpha: 1}, "<")
    .to('.bg-grad',{width: '80vmax',height: '80vmax',borderRadius: '50%', filter: `blur(${blurValue}rem)`}, "<")
    .to('#intro .logo .half-circle, #intro .logo .wave',{stroke: dimColor}, "<")
    .to('#intro .logo .brush-head, #intro .logo .brush-body',{fill: dimColor, stroke:'none'}, "<")
    .to('#intro .logo .search',{fill: dimColor}, "<")
    .call(logoFlip)
    
    .to('.navigation, .quick-btns', {autoAlpha: 1, duration: 1}, "<")
    
    .from(splitH2.chars, {
      yPercent: -100,
      autoAlpha: 0,
      stagger: 0.1,
    }, "<")
    .from(splitH1.chars, {
      yPercent: 100,
      autoAlpha: 0,
      stagger: 0.1,
    })
    .to('.mouse-wrap',{autoAlpha: 1})
    
};

function Loading() {
  const tl = gsap.timeline();

  tl.set('.navigation, .quick-btns', {autoAlpha: 0})
    .set('.possessive', {width: 0, autoAlpha: 0})
    .set('.title', {height: 0, autoAlpha: 0})
    .set('.mouse-wrap', {autoAlpha: 0})
    .set('#intro .logo', {pointerEvents: 'none'});
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
