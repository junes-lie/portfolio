const navTriggers = (isLandscape) => {
  const sections = gsap.utils.toArray('#layout section');
  const nav = document.querySelector('.navigation');
  const navLis = gsap.utils.toArray('.navigation li:not(.progress)');
  const progressEl = nav.querySelector('.progress');

  const scaleProp = isLandscape ? 'scaleY' : 'scaleX';
  gsap.set(progressEl, {
    transformOrigin: isLandscape ? 'center top' : 'left center',
    [scaleProp]: 0,
  });

  const diffIds = new Set(
    isLandscape
      ? ['planning', 'publishing']
      : ['planning', 'publishing', 'graphic']
  );
  const n = sections.length;
  const vh = window.innerHeight;

  const sectionTriggers = sections.map((section, i) => {
    navLis[i].addEventListener('click', () => {
      isManualMove = true;
      sectionMove(section, 'top top');
    });
    return ScrollTrigger.create({ trigger: section, start: 'top center' });
  });

  let prevIndex = -1;

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
            visual = (i + Math.min((scroll - sectionTriggers[i].start) / range, 1)) / (n - 1);
          }
          break;
        }
      }

      if (activeIndex !== prevIndex) {
        if (prevIndex >= 0) navLis[prevIndex].classList.remove('is-active');
        navLis[activeIndex].classList.add('is-active');
        prevIndex = activeIndex;

        const id = sections[activeIndex].id;
        nav.classList.toggle('is-diff', diffIds.has(id));
      }

      nav.classList.toggle('is-in-planning', scroll >= sectionTriggers[n - 1].start + vh / 2);
      gsap.set(progressEl, { [scaleProp]: gsap.utils.clamp(0, 1, visual) });
    },
  });
};

gsap.matchMedia().add('(orientation: landscape)', () => {
  navTriggers(true);
});

gsap.matchMedia().add('(orientation: portrait)', () => {
  navTriggers(false);
});
