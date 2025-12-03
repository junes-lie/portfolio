gsap.registerPlugin(ScrollTrigger, ScrollSmoother, Observer);

// 1. 스크롤 스무더 생성
// (부드러운 움직임을 위해 켜두지만, 사용자의 직접 스크롤은 막을 예정입니다)
smoother = ScrollSmoother.create({
  content: "#layout",
  smooth: 2, // 부드러움 정도 (1초)
  effects: true,
  smoothTouch: 0.1,
});

// 2. [핵심] Observer를 이용한 '엄격한' 원페이지 스크롤 구현
// 보내주신 main.js의 복잡한 로직(휠 감지, 상태 관리)을 이 플러그인이 대신해 줍니다.

let isAnimating = false; // 현재 움직이는 중인지 확인하는 깃발

// 섹션들을 배열로 가져옴
const sections = gsap.utils.toArray('#layout section');

Observer.create({
  target: '#layout',         // 화면 전체 감지
  type: "wheel,touch,pointer", // 휠, 터치, 포인터 모두 감지
  // wheelSpeed: -1,         // 휠 방향 보정
  onDown: () => {         // 아래로 굴렸을 때
    if (!isAnimating) {   // 움직이는 중이 아닐 때만 실행
      gotoSection(currentIndex + 1);
    }
  },
  onUp: () => {           // 위로 굴렸을 때
    if (!isAnimating) {
      gotoSection(currentIndex - 1);
    }
  },
  tolerance: 10,          // 민감도 (조금만 굴려도 반응하게 할지)
  preventDefault: true    // [중요] 기본 스크롤 기능을 아예 꺼버립니다! (Hijacking)
});

// 현재 몇 번째 섹션인지 기억하는 변수
let currentIndex = 0;

// 실제 이동을 담당하는 함수
function gotoSection(index) {
  // 1. 범위 체크 (없는 섹션으로 가려고 하면 무시)
  if (index < 0 || index >= sections.length) return;

  // 2. 애니메이션 시작 깃발 꽂기 (중복 실행 방지)
  isAnimating = true;
  currentIndex = index; // 현재 위치 업데이트

  // 3. 스무더에게 "여기로 이동해!" 명령
  gsap.to(smoother, {
    scrollTop: smoother.offset(sections[index], "top top"),
    duration: 1.2,        // 이동 시간 (취향에 맞게 조절)
    ease: "power2.inOut", // 부드러운 가속도
    onComplete: () => {
      // 4. 도착하면 다시 움직일 수 있게 깃발 뽑기
      isAnimating = false;
    }
  });
}