
const plan = document.querySelector('#planning');
const btns = plan.querySelectorAll('.row-btn');
// const fullscreenBtns = plan.querySelectorAll('.fullscreen-btn');
const activeBtns = plan.querySelectorAll('.guard-btn');

// 1. ScrollTrigger Pushing Pin
// let mm = gsap.matchMedia();
// mm.add("(max-width: 1024px)", () => {
//   document.querySelectorAll('.process-group').forEach((group) => {
//     const header = group.querySelector('.category-header');
//     const list = group.querySelector('.project-index-list');
//     ScrollTrigger.create({
//       trigger: list,
//       start: "top top",
//       end: () => `bottom ${header.offsetHeight}px`, 
//       pin: header,
//       pinSpacing: false,
//       anticipatePin: 1,
//       markers: true,
//     });
//   });
// });

// 2. 아코디언 로직 (상태 리셋 포함)
btns.forEach(btn => {
  btn.addEventListener('click', function() {
    const currentItem = this.closest('.project-item');
    const content = this.nextElementSibling;
    if(!content || !content.classList.contains('expand-area')) return;

    const inner = content.querySelector('.expand-inner-integrated');
    const isActive = currentItem.classList.contains('is-active');

    document.querySelectorAll('.project-item').forEach(item => {
      if (item !== currentItem) {
        item.classList.remove('is-active');
        const otherArea = item.querySelector('.expand-area');
        if(otherArea) {
          gsap.to(otherArea, { height: 0, duration: 0.6, ease: 'expo.inOut' });
          const otherInner = otherArea.querySelector('.expand-inner-integrated');
          if(otherInner) gsap.to(otherInner, { opacity: 0, y: 20, duration: 0.4 });
          
          const otherGuard = otherArea.querySelector('.scroll-guard');
          if(otherGuard) {
            otherGuard.classList.remove('is-inactive', 'is-exploring');
            gsap.set(otherGuard, { opacity: 1 });
            gsap.set(otherGuard.querySelector('.mouse-wrap'), { opacity: 0, y: 20 });
          }
        }
      }
    });

    if (!isActive) {
      currentItem.classList.add('is-active');
      gsap.to(content, { height: 'auto', duration: 0.8, ease: 'expo.out', onUpdate: () => ScrollTrigger.refresh() });
      gsap.to(inner, { opacity: 1, y: 0, duration: 0.6, delay: 0.3 });
      
      setTimeout(() => {
        const isMobile = window.innerWidth <= 1024;
        const stickyHeader = currentItem.closest('.process-group').querySelector('.category-header');
        const headerOffset = isMobile ? (stickyHeader ? stickyHeader.offsetHeight : 100) : 120;
        const elementPosition = currentItem.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: elementPosition - headerOffset, behavior: 'smooth' });
      }, 450);
    } else {
      currentItem.classList.remove('is-active');
      gsap.to(content, { height: 0, duration: 0.6, ease: 'expo.inOut', onUpdate: () => ScrollTrigger.refresh() });
      gsap.to(inner, { opacity: 0, y: 20, duration: 0.4 });
    }
  });
});

// 3. [v83 핵심] 버튼 클릭 기반 시퀀스 로직
activeBtns.forEach(abtn => {
  abtn.addEventListener('click', function(e) {
    e.stopPropagation(); // 부모 가드로의 이벤트 전파 방지
    
    const guard = this.closest('.scroll-guard');
    if (guard.classList.contains('is-exploring')) return;

    const hint = guard.querySelector('.mouse-wrap');
    
    // [Sequence Start]
    guard.classList.add('is-exploring'); // 버튼 페이드아웃 실행

    // 힌트(mouse-wrap) 등장
    gsap.fromTo(hint, { opacity: 0 }, { 
      opacity: 1, 
      // y: 0, 
      duration: 0.7, 
      // ease: 'power3.out',
      onComplete: () => {
        // 2.2초 대기 후 전체 가드 소멸
        gsap.to(hint, { 
          opacity: 0, 
          // y: -20, 
          duration: 0.8, 
          delay: 2,
          // ease: 'power3.in' 
        });

        gsap.to(guard, { 
          opacity: 0, 
          duration: 0.8, 
          delay: 2.2, 
          ease: 'power3.inOut',
          onComplete: () => {
            guard.classList.add('is-inactive');
          }
        });
      }
    });
  });
});

// 4. 전체화면 제어
// fullscreenBtns.forEach(btn => {
//   btn.addEventListener('click', function() {
//     const wrapper = this.closest('.expand-inner-integrated');
//     if (!document.fullscreenElement) {
//       if (wrapper.requestFullscreen) wrapper.requestFullscreen();
//       else if (wrapper.webkitRequestFullscreen) wrapper.webkitRequestFullscreen();
//     } else {
//       if (document.exitFullscreen) document.exitFullscreen();
//     }
//   });
// });