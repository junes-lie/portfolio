const plan = document.querySelector('#planning');
const processes = plan.querySelectorAll('.process');
const rows = plan.querySelectorAll('.row-btn');
const activeBtns = plan.querySelectorAll('.guard-btn');
const fullscreenBtns = plan.querySelectorAll('.fullscreen-btn');
const vh10 = window.innerHeight * 0.1;

processes.forEach((item, index) => {
  item.querySelector('hgroup span').textContent = `${String(index + 1).padStart(2, '0')}.`;
});

processes.forEach((item) => {
  const header = item.querySelector('hgroup');

  ScrollTrigger.create({
    trigger: item,
    start: () => `top ${vh10}px `,
    end: () => `bottom ${header.offsetHeight + vh10}px`,
    pin: header,
    pinSpacing: false,
    anticipatePin: 1,
  });
});

const fold = (project, onDone) => {
  const spread = project.querySelector('.spread');
  const guard = project.querySelector('.scroll-guard');
  const btn = guard.querySelector('.guard-btn');
  const hint = guard.querySelector('.mouse-wrap');

  project.classList.remove('is-active');
  guard.classList.remove('is-unlocked');

  gsap.set(hint, { opacity: 0 });
  gsap.set([guard, btn], { opacity: 1, pointerEvents: 'auto' });
  gsap.to(spread, {
    height: 0,
    // duration: 0.2,
    onComplete: () => {
      if (onDone) onDone();
    }
  });
};

rows.forEach((btn) => {
  btn.addEventListener('click', function () {
    const project = this.parentElement;
    const spread = this.nextElementSibling;
    const isActive = project.classList.contains('is-active');

    isManualMove = true;

    document.querySelectorAll('.project').forEach((p) => {
      if (p !== project) {
        fold(p);
      }
    });

    if (!isActive) {
      project.classList.add('is-active');
      const hint = project.querySelector('.scroll-guard .mouse-wrap');
      gsap.set(hint, { opacity: 0 });
      gsap.to(spread, {
        height: 'auto',
        // duration: 0.2,
        onComplete: () => {
          requestAnimationFrame(() => { isManualMove = false; });
        }
      });
    } else {
      fold(project, () => { isManualMove = false; });
    }
  });
});

activeBtns.forEach((btn) => {
  const guard = btn.parentElement;
  const hint = guard.querySelector('.mouse-wrap');

  btn.addEventListener('click', function () {
    guard.classList.add('is-unlocked');

    const tl = gsap.timeline();

    tl.to(this, { opacity: 0, pointerEvents: 'none' })
      .fromTo(hint, { opacity: 0 },
                    { opacity: 1 })
      .to(hint, { opacity: 0 }, '<1')
      .to(guard, { opacity: 0 })
      .set(guard, { pointerEvents: 'none' });
  });
});

fullscreenBtns.forEach((btn) => {
  btn.addEventListener('click', function () {
    const wrapper = this.closest('.spread-inner');

    if (!document.fullscreenElement) {
      if (wrapper.requestFullscreen) wrapper.requestFullscreen();
      else if (wrapper.webkitRequestFullscreen) wrapper.webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
  });
});

document.addEventListener('fullscreenchange', () => {
  const isFS = !!document.fullscreenElement;

  fullscreenBtns.forEach((btn) => {
    btn.classList.toggle('is-fullscreen', isFS);
  });
});
