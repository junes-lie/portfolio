const navTriggers = (isLandscape) => {
  const sections = gsap.utils.toArray('#layout section');
  const nav = document.querySelector('.navigation');
  const navLis = gsap.utils.toArray('.navigation li:not(.progress)');
  const progressEl = document.querySelector('.progress');

  const scaleProp = isLandscape ? 'scaleY' : 'scaleX';
  const origin = isLandscape ? 'center top' : 'left center';
  gsap.set(progressEl, { transformOrigin: origin, [scaleProp]: 0 });

  const diffIds = isLandscape
    ? ['planning', 'publishing']
    : ['planning', 'publishing', 'graphic'];
  const n = sections.length;
  const sectionTriggers = [];

  sections.forEach((section, index) => {
    const li = navLis[index];

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top center',
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
      let activeIndex = 0;

      for (let i = n - 1; i >= 0; i--) {
        if (scroll >= sectionTriggers[i].start) {
          activeIndex = i;
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

      navLis.forEach((li, i) => li.classList.toggle('is-active', i === activeIndex));
      const activeId = sections[activeIndex]?.id;
      nav.classList.toggle('is-diff', diffIds.includes(activeId));
      gsap.set(progressEl, { [scaleProp]: gsap.utils.clamp(0, 1, visual) });
    }
  });

};

gsap.matchMedia().add('(orientation: landscape)', () => {
  navTriggers(true);
});

gsap.matchMedia().add('(orientation: portrait)', () => {
  navTriggers(false);
});
