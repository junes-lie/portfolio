
const plan = document.querySelector('#planning');
const rows = plan.querySelectorAll('.row-btn');
const activeBtns = plan.querySelectorAll('.guard-btn');

rows.forEach(btn => {
  btn.addEventListener('click', function() {
    const item = this.parentElement;
    const area = this.nextElementSibling;
    const isActive = item.classList.contains('is-active');

    document.querySelectorAll('.project').forEach(el => {
      if(el !== item) {
        el.classList.remove('is-active');
        gsap.to(el.querySelector('.expand'), { height: 0 });
      }
    });

    if (!isActive) {
      item.classList.add('is-active');
      gsap.to(area, { 
        height: 'auto', 
        onComplete: () => ScrollTrigger.refresh()
      });
    } else {
      item.classList.remove('is-active');
      gsap.to(area, { 
        height: 0, 
        onComplete: () => ScrollTrigger.refresh()
      });
    }
  });
});

activeBtns.forEach(btn => {

  const guard = btn.parentElement;
  const hint = guard.querySelector('.mouse-wrap');
  
  btn.addEventListener('click', function(e) {
    // e.stopPropagation(); 
    // 아코디언 닫힘 방지
    
    const tl = gsap.timeline();

    tl.to(this, { opacity: 0 })
      .fromTo(hint, { opacity: 0 }, 
                    { opacity: 1 })
      .to(hint, { opacity: 0 }, '<1')
      .to(guard, { opacity: 0 })
      .set(guard, { pointerEvents: "none" });
  });
});

