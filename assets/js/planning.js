
const plan = document.querySelector('#planning');
const process = plan.querySelectorAll('.process');
const rows = plan.querySelectorAll('.row-btn');
const activeBtns = plan.querySelectorAll('.guard-btn');
const vh10 = window.innerHeight * 0.1;

process.forEach((process) => {
  const header = process.querySelector('hgroup');

  ScrollTrigger.create({
    trigger: process,
    start: () => `top ${vh10}px `,
    end: () => `bottom ${header.offsetHeight + vh10}px`, 
    pin: header,
    pinSpacing: false,
    anticipatePin: 1,
    // markers: true,
  });
});

const closeExpand = (project) => {
  const expand = project.querySelector('.expand');
  const guard = project.querySelector('.scroll-guard');
  const btn = guard.querySelector('.guard-btn');
  const hint = guard.querySelector('.mouse-wrap');
  
  project.classList.remove('is-active');
  gsap.to(expand, { 
    height: 0, 
    onComplete: () => {
      ScrollTrigger.refresh();

      guard.classList.remove('is-unlocked');
      gsap.set([guard, btn], { opacity: 1, pointerEvents: "auto" });
      gsap.set(hint, { opacity: 0 });

    }
  });
}


rows.forEach(btn => {
  btn.addEventListener('click', function() {
    const project = this.parentElement;
    const expand = this.nextElementSibling;
    const header = this.closest('.process').querySelector('hgroup');
    const isActive = project.classList.contains('is-active');

    // 클릭한 플젝 이외의 뿐만아니라 모든 플젝.active 지우기
    document.querySelectorAll('.project').forEach(p => {
      if(p !== project) {
        closeExpand(p);
      }
    });

    if (!isActive) {
      project.classList.add('is-active');
      gsap.to(expand, { 
        height: 'auto', 
        onComplete: () => {
          ScrollTrigger.refresh();

          const isPortrait = window.matchMedia("(orientation: portrait)").matches;
          if (isPortrait) {

            const viewTop = this.getBoundingClientRect().top;
            const totalOffset = vh10 + header.offsetHeight;

            const isAlreadyInGoodView = viewTop > totalOffset && viewTop < window.innerHeight * 0.4;
            if (!isAlreadyInGoodView) {

              const elementAbsoluteTop = viewTop + window.pageYOffset;
              gsap.to(window, {
                scrollTo: { 
                  y: elementAbsoluteTop - totalOffset, 
                  autoKill: true 
                },
              });
            }
          }
        }

      });

    } else {
      closeExpand(project);
    }
  });
});

activeBtns.forEach(btn => {

  const guard = btn.parentElement;
  const hint = guard.querySelector('.mouse-wrap');
  
  btn.addEventListener('click', function(e) {
    // e.stopPropagation(); 
    // 아코디언 닫힘 방지

    guard.classList.add('is-unlocked');

    const tl = gsap.timeline();

    tl.to(this, { opacity: 0, pointerEvents: "none" })
      .fromTo(hint, { opacity: 0 }, 
                    { opacity: 1 })
      .to(hint, { opacity: 0 }, '<1')
      .to(guard, { opacity: 0 })
      .set(guard, { pointerEvents: "none" });
  });
});

