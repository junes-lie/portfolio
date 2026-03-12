
const plan = document.querySelector('#planning');
// const rows = plan.querySelectorAll('.row-btn');
const activeBtns = plan.querySelectorAll('.guard-btn');

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