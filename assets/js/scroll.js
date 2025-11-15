// jQuery
// $(document).ready(function(){

document.addEventListener('DOMContentLoaded', function () {

  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Observer);

  const sections = gsap.utils.toArray('section');
  const horizontalSection = document.querySelector('#publishing');
  const animationWrap = document.querySelector('.card-wrap');
  const panels = gsap.utils.toArray('.card');

  let currentIndex = 0;
  let isAnimating = false; 
  let isHorizontallyPinned = false; 
  let currentPanelIndex = 0;
  let isPanelAnimating = false; 

  // --- 1. 가로 섹션 고정(pin) 로직 ---
  // 'pin'만 담당하고 '상태 스위치' 역할만 하도록 분리
  ScrollTrigger.create({
    trigger: horizontalSection,
    pin: true,
    start: "top top",
    // animationWrap의 총 너비에서 마지막 패널의 중앙정렬 패딩(15vw)을 뺀 만큼만 이동
    // end: () => "+=" + (animationWrap.scrollWidth - window.innerWidth + (window.innerWidth * 0.15)),

    // [최적화 1] 'end' 값을 (패널 개수 * 창 높이)로 변경하여 
    // 매직 넘버를 제거하고 더 견고하게 만듭니다.
    // 핀 지속시간이 스크롤 스냅 속도에 영향을 주지 않습니다 (Observer가 제어).
    end: () => "+=" + (panels.length * window.innerHeight),

    // --- (수정) 상태 관리 스위치 (isHorizontallyPinned) ---
    // onComplete 로직과 충돌을 피하기 위해 상태만 변경
    onEnter: () => { 
      isHorizontallyPinned = true; 
    },
    onLeave: () => { 
      isHorizontallyPinned = false; 
    },
    onEnterBack: () => { 
      isHorizontallyPinned = true; 
    },
    onLeaveBack: () => { 
      isHorizontallyPinned = false; 
    }
  });


  // --- 2. 세로 스냅 스크롤 로직 ---
  function goToSection(index) {
    if (index < 0 || index >= sections.length || isAnimating) return;

    isAnimating = true; 
    let oldIndex = currentIndex; // --- FIX: 이전 인덱스를 onComplete에서 사용하기 위해 저장

    gsap.to(window, {
      scrollTo: { y: sections[index], autoKill: false },
      duration: 1.0, 
      ease: "power2.inOut",
      onComplete: () => {
        currentIndex = index; // --- FIX: 새 인덱스를 여기서 설정
        isAnimating = false; 
        
        // --- (수정) 세로 -> 가로 진입 시, 방향에 따라 가로 스냅 즉시 실행 ---
        if (sections[currentIndex] === horizontalSection) {
          // 가로 섹션으로 진입한 경우
          
          if (oldIndex < currentIndex) { 
            // 정방향 (예: 0 -> 1)
            currentPanelIndex = 0;
            goToPanel(0); // 첫 패널로 스냅
          } else if (oldIndex > currentIndex) { 
            // 역방향 (예: 2 -> 1)
            currentPanelIndex = panels.length - 1;
            goToPanel(panels.length - 1); // 마지막 패널로 스냅
          }
        }
          // --- (수정 끝) ---
      }
    });
  }

  // --- 3. (수정) 가로 컨테이너 스냅 로직 ---
  function goToPanel(index) {
    if (isPanelAnimating || isAnimating) return;

    // --- 경계 처리 (가로 -> 세로) ---
    if (index < 0) {
      goToSection(currentIndex - 1); 
      return;
    }
    if (index >= panels.length) {
      goToSection(currentIndex + 1); 
      return;
    }

    // --- (응용) 컨테이너 중앙 정렬 계산 ---
    isPanelAnimating = true;
    currentPanelIndex = index;

    const targetPanel = panels[index];
    // animationWrap의 시작점(0)부터 타겟 패널의 시작점까지의 거리
    // const panelOffsetLeft = targetPanel.offsetLeft;
    // 타겟 패널의 너비
    // const panelWidth = targetPanel.offsetWidth;
    // 윈도우 너비
    const windowWidth = window.innerWidth;

    // 타겟 패널이 중앙에 오도록 x값을 계산
    // = -(패널의 offset) + (윈도우 너비 - 패널 너비) / 2
    // const targetX = -(panelOffsetLeft - (windowWidth - panelWidth) / 2);

    // 1. 타겟 패널의 중심 x좌표 (card-wrap 기준)
    const panelCenter = targetPanel.offsetLeft + targetPanel.offsetWidth / 2;
    // 2. card-wrap이 이동해야 할 x값
    // (화면의 중앙) - (타겟 패널의 중심)
    const targetX = (windowWidth / 2) - panelCenter;

    gsap.to(animationWrap, {
      x: targetX,
      duration: 0.8, 
      ease: "power2.inOut",
      onComplete: () => {
        isPanelAnimating = false;
      }
    });
  }


  // --- 4. 휠/터치 이벤트 통합 제어 (Observer) ---
  Observer.create({
    target: window, 
    type: "wheel,touch", 
    
    onWheel: (self) => {
      if (isAnimating || isPanelAnimating) {
        self.event.preventDefault(); 
        return;
      }
      
      if (isHorizontallyPinned) {
        // --- 가로 스냅 구간 ---
        self.event.preventDefault(); 
        handleScrollDirection(self.deltaY);
      } else {
        // --- 세로 스냅 구간 ---
        self.event.preventDefault(); 
        handleScrollDirection(self.deltaY);
      }
    },
    
    onTouchStart: (self) => {
      // [최적화 3] 오타 수정 (isAnimating || isAnimating -> isAnimating || isPanelAnimating)
      if (isAnimating || isPanelAnimating) {
        self.event.preventDefault(); 
      }
    },

    onTouchMove: (self) => {
      // 애니메이션 중이 아닐 때만 스크롤(화면 밀림) 방지
      if ((!isHorizontallyPinned && !isAnimating) || (isHorizontallyPinned && !isPanelAnimating)) {
        self.event.preventDefault();
      }
    },

    onTouchEnd: (self) => {
      if (isAnimating || isPanelAnimating) return;
      
      // 스와이프 감지 (너무 짧은 스와이프 무시)
      const swipeThreshold = 50; 
      if (Math.abs(self.deltaY) < swipeThreshold) return; 

      handleScrollDirection(self.deltaY);
    },
    
    // preventDefault: false // Observer가 이벤트를 막지 않도록 함 (내부에서 수동 제어)
    // 참고: onWheel/onTouchMove에서 e.preventDefault()를 호출하므로 이 옵션은 큰 의미가 없습니다.
  });

  function handleScrollDirection(delta) {
    if (isHorizontallyPinned) {
      // 가로 구간
      if (delta > 0) { // Scoll Down or Swipe Up
        goToPanel(currentPanelIndex + 1); 
      } else { // Scroll Up or Swipe Down
        goToPanel(currentPanelIndex - 1); 
      }
    } else {
      // 세로 구간
      if (delta > 0) { // Scoll Down or Swipe Up
        goToSection(currentIndex + 1);
      } else { // Scroll Up or Swipe Down
        goToSection(currentIndex - 1);
      }
    }
  }

  gsap.set(window, { scrollTo: { y: 0 } });
  ScrollTrigger.refresh();
  
});