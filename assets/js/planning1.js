const btns = document.querySelectorAll('.index-row-btn');
const guards = document.querySelectorAll('.scroll-guard');
const fullscreenBtns = document.querySelectorAll('.btn-fullscreen');

// 1. 아코디언 로직
btns.forEach(btn => {
  btn.addEventListener('click', function() {
    const content = this.nextElementSibling;
    const inner = content.querySelector('.expand-inner-integrated');
    const isActive = this.classList.contains('is-active');

    btns.forEach(b => {
      if (b !== this) {
        b.classList.remove('is-active');
        b.setAttribute('aria-expanded', 'false');
        gsap.to(b.nextElementSibling, { height: 0, duration: 0.6, ease: 'expo.inOut' });
        gsap.to(b.nextElementSibling.querySelector('.expand-inner-integrated'), { opacity: 0, y: 30, duration: 0.4 });
        const guard = b.nextElementSibling.querySelector('.scroll-guard');
        const hint = b.nextElementSibling.querySelector('.scroll-hint');
        if(guard) guard.classList.remove('is-inactive');
        if(hint) gsap.set(hint, { opacity: 0 });
      }
    });

    if (!isActive) {
      this.classList.add('is-active');
      this.setAttribute('aria-expanded', 'true');
      gsap.to(content, { height: 'auto', duration: 0.8, ease: 'expo.out' });
      gsap.to(inner, { opacity: 1, y: 0, duration: 0.6, delay: 0.3 });
      
      setTimeout(() => {
        const isMobile = window.innerWidth <= 1024;
        const stickyHeader = this.closest('.process-group').querySelector('.category-header');
        const headerOffset = isMobile ? (stickyHeader ? stickyHeader.offsetHeight : 0) : 120;
        const elementPosition = this.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: elementPosition - headerOffset, behavior: 'smooth' });
      }, 450);
    } else {
      this.classList.remove('is-active');
      this.setAttribute('aria-expanded', 'false');
      gsap.to(content, { height: 0, duration: 0.6, ease: 'expo.inOut' });
      gsap.to(inner, { opacity: 0, y: 30, duration: 0.4 });
    }
  });
});

// 2. 가드 해제 및 스크롤 힌트
guards.forEach(guard => {
  guard.addEventListener('click', function() {
    const wrapper = this.closest('.expand-inner-integrated');
    const hint = wrapper.querySelector('.scroll-hint');
    const iframe = wrapper.querySelector('.figma-frame');
    if(iframe.tagName === 'IFRAME' && iframe.src.includes('about:blank')) {
      iframe.src = iframe.getAttribute('data-src');
    }
    this.classList.add('is-inactive');
    gsap.fromTo(hint, { opacity: 0, y: 10 }, { 
      opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
      onComplete: () => { gsap.to(hint, { opacity: 0, y: -10, duration: 0.8, delay: 2.5, ease: 'power2.in' }); }
    });
  });
});

// 3. 전체화면 제어
fullscreenBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    const wrapper = this.closest('.expand-inner-integrated');
    if (!document.fullscreenElement) {
      if (wrapper.requestFullscreen) wrapper.requestFullscreen();
      else if (wrapper.webkitRequestFullscreen) wrapper.webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  });
});
