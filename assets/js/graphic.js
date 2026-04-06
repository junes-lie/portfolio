const gridContainer = document.querySelector('#graphic .container');
const gridElement = gridContainer.querySelector('.grid');
const thumbs = gridElement.querySelectorAll('.thumb');

const getAxisByIndex = (index) => {
  return (index % 2 === 0) ? '1, 1, 0' : '1, -1, 0';
};

thumbs.forEach((card, i) => {
  const back = card.querySelector('.back');
  const axis = getAxisByIndex(i);
  back.style.transform = `rotate3d(${axis}, 180deg)`;
});

let mm = gsap.matchMedia();

mm.add({
  isPortrait: '(orientation: portrait)',
  isLandscape: '(orientation: landscape)',
}, (context) => {
  let { isPortrait } = context.conditions;
  const columns = isPortrait ? 2 : 5;
  const vh = window.innerHeight;

  const scrollDist = gridElement.offsetTop + gridElement.offsetHeight - vh;

  const entryDist = isPortrait ? vh * 1.0 : vh * 0.5;
  const stayDist = isPortrait ? vh * 2.0 : vh * 1.0;
  const totalDist = entryDist * 2 + stayDist;

  ScrollTrigger.create({
    trigger: '#graphic',
    start: 'top top',
    end: `+=${entryDist + stayDist}`,
    pin: true,
    anticipatePin: 1,
  });

  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#graphic',
      start: 'top 20%',
      end: `+=${totalDist}`,
      scrub: 1.5,
      onUpdate: (self) => {
        const startProgress = (entryDist * 0.8) / totalDist;
        const endProgress = (entryDist + stayDist + entryDist * 0.2) / totalDist;

        if (self.progress > startProgress && self.progress < endProgress) {
          gridContainer.classList.add('is-aligned');
        } else {
          gridContainer.classList.remove('is-aligned');
        }
      }
    }
  });

  mainTl.addLabel('entry', 0)
        .addLabel('stay', entryDist)
        .addLabel('exit', entryDist + stayDist);

  thumbs.forEach((card, i) => {
    const row = Math.floor(i / columns);
    const col = i % columns;
    const yDir = (row + col) % 2 === 0 ? 1 : -1;
    const exitDistance = (yDir === 1) ? '-=120vh' : '+=120vh';

    mainTl.fromTo(card,
      {
        y: yDir * 120 + 'vh',
        z: 1000,
        opacity: 0,
        scale: 0.3,
      },
      {
        y: 0,
        x: 0,
        z: 0,
        opacity: 1,
        scale: 1,
        duration: entryDist,
        ease: 'expo.out'
      }, `entry+=${i * (entryDist / 30)}`)
    .to(card, {
      y: exitDistance,
      z: -1000,
      opacity: 0,
      scale: 0.3,
      duration: entryDist,
      ease: 'expo.in'
    }, `exit+=${i * (entryDist / 30)}`);
  });

  if (isPortrait) {
    mainTl.to(gridElement, {
      y: -scrollDist,
      duration: stayDist,
      ease: 'none'
    }, 'stay');
  } else {
    mainTl.to({}, { duration: stayDist }, 'stay');
  }

  ScrollTrigger.refresh();
});

thumbs.forEach((card, i) => {
  const inner = card.querySelector('.thumb-inner');
  if (!inner) return;

  const axis = getAxisByIndex(i);
  const flipState = { angle: 0 };

  card.addEventListener('mouseenter', () => {
    if (!gridContainer.classList.contains('is-aligned')) return;

    gsap.to(flipState, {
      angle: 180,
      duration: 0.3,
      onUpdate: () => {
        inner.style.transform = `rotate3d(${axis}, ${flipState.angle}deg)`;
      }
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(flipState, {
      angle: 0,
      duration: 0.3,
      onUpdate: () => {
        inner.style.transform = `rotate3d(${axis}, ${flipState.angle}deg)`;
      }
    });
  });
});
