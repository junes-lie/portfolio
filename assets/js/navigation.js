const navTriggers = (isLandscape) => {
  const sections = gsap.utils.toArray('#layout section');
  const nav = document.querySelector('.navigation');
  const navLis = gsap.utils.toArray('.navigation li:not(.progress)');
  const progressEl = document.querySelector('.progress');

  const xValue = remap(30, 50);
  const yValue = remap(-30, -50);

  const spanTween = isLandscape
    ? { x: xValue, opacity: 1 }
    : { y: yValue, opacity: 1 };

  const scaleProp = isLandscape ? 'scaleY' : 'scaleX';
  const origin = isLandscape ? 'center top' : 'left center';
  gsap.set(progressEl, { transformOrigin: origin, [scaleProp]: 0 });

  const n = sections.length;
  const sectionTriggers = [];

  sections.forEach((section, index) => {
    const li = navLis[index];
    const dot = li.querySelector('.dot');
    const span = li.querySelector('span');

    const navAnimation = gsap.timeline()
      .to(dot, { scale: 1.5 })
      .to(span, spanTween, '<');

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      animation: navAnimation,
      toggleActions: 'restart reverse restart reverse'
    });

    sectionTriggers.push(st);

    li.addEventListener('click', () => {
      isManualMove = true;
      sectionMove(section, 'top top');
    });
  });

  ScrollTrigger.create({
    trigger: '#layout',
    start: 'top top',
    end: 'max',
    onUpdate: (self) => {
      const scroll = self.scroll();
      let visual = 0;

      for (let i = n - 1; i >= 0; i--) {
        if (scroll >= sectionTriggers[i].start) {
          if (i === n - 1) {
            visual = 1;
          } else {
            const range = sectionTriggers[i + 1].start - sectionTriggers[i].start;
            const local = (scroll - sectionTriggers[i].start) / range;
            visual = (i + Math.min(local, 1)) / (n - 1);
          }
          break;
        }
      }

      gsap.set(progressEl, { [scaleProp]: gsap.utils.clamp(0, 1, visual) });
    }
  });

  const pubStart = isLandscape ? 'top center' : 'top 0%';
  const pubEnd = isLandscape ? 'bottom center' : 'bottom 0%';
  const triggerSections = ['#planning', '#publishing'];

  triggerSections.forEach((selector) => {
    ScrollTrigger.create({
      trigger: selector,
      start: pubStart,
      end: pubEnd,
      toggleClass: { targets: nav, className: 'is-diff' },
    });
  });
};

gsap.matchMedia().add('(orientation: landscape)', () => {
  navTriggers(true);
});

gsap.matchMedia().add('(orientation: portrait)', () => {
  navTriggers(false);
});
