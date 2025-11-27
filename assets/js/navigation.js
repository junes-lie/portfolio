const sections = gsap.utils.toArray('#layout section');
const navLis = gsap.utils.toArray('.navigation li');

sections.forEach((section, index)=>{

  const li = navLis[index];
  const dot = li.querySelector('.dot');
  const span = li.querySelector('span');
  const xValue = remap(40, 55);

  let navAnimation = gsap.timeline()
  .to(dot, {scale:1.8})
  .to(span, {
    opacity: 1,
    x: xValue,
    // color: index === 1 ? 'white' : 'black'
  }, 0);

  ScrollTrigger.create({
    trigger: section,
    start: 'top center',
    end: 'bottom center',
    animation: navAnimation,
    toggleActions: 'restart reverse restart reverse'
  });

  li.addEventListener('click',()=>{

    smoother.scrollTo(section, true, "top top");

  })

})


ScrollTrigger.create({
  trigger: '#layout',
  start: 'top top',
  end: 'bottom bottom',
  animation: gsap.from('.progress',{scaleY: 0, transformOrigin: 'center top', ease: 'none'}),
  scrub: true,
});

