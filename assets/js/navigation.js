

const navTriggers = (isLandscape) => {
  const sections = gsap.utils.toArray('#layout section');
  // const nav = gsap.utils.toArray('.navigation');
  const nav = document.querySelector('.navigation');
  const navLis = gsap.utils.toArray('.navigation li');
  
  const xValue = remap(30, 50);
  const yValue = remap(-30, -50);

  const spanTween = isLandscape 
    ? { x: xValue, opacity: 1 } 
    : { y: yValue, opacity: 1 }; // color: index === 1 ? 'white' : 'black'

  const progressTween = isLandscape 
    ? { scaleY: 0, transformOrigin: 'center top', ease: 'none' } 
    : { scaleX: 0, transformOrigin: 'left center', ease: 'none' };


  sections.forEach((section, index)=>{

    const li = navLis[index];
    const dot = li.querySelector('.dot');
    const span = li.querySelector('span');
    
    const navAnimation = gsap.timeline()
      .to(dot, { scale: 1.5 })
      .to(span, spanTween, "<");

    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      animation: navAnimation,
      toggleActions: 'restart reverse restart reverse'
    });

    li.addEventListener('click',()=>{
      isManualMove = true;
      // smoother.scrollTo(section, true, "top top");
      sectionMove(section, "top top");
    });
    
  });

  ScrollTrigger.create({
    trigger: '#layout',
    start: 'top top',
    end: 'bottom bottom',
    animation: gsap.from('.progress', progressTween),
    scrub: true,
  });

  const pubStart = isLandscape ? "top center" : "top 0%";
  const pubEnd = isLandscape ? "bottom center" : "bottom 0%";

  ScrollTrigger.create({
    trigger: "#publishing",
    start: pubStart,
    end: pubEnd,
    toggleClass: { targets: nav, className: "is-diff" },
    // markers: true,
  });
}



gsap.matchMedia().add("(orientation: landscape)", () => {
  navTriggers(true); 
});

gsap.matchMedia().add("(orientation: portrait)", () => {
  navTriggers(false);
});



















