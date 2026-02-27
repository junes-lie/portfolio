/**
 * Graphic Section Animation Module (v2.2)
 * Optimized for Jisun's Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  const gridContainer = document.querySelector("#graphic .container");
  const thumbs = document.querySelectorAll("#graphic .thumb");
  
  if (!gridContainer || thumbs.length === 0) return;

  /**
   * 1. 스마트 대각선 축 매핑 (Diagonal Axis Mapping)
   * 인덱스에 따라 홀수/짝수 카드가 서로 다른 대각선 축을 가집니다.
   * 짝수: 45도 축 (1, 1, 0) / 홀수: -45도 축 (1, -1, 0)
   */
  const getAxisByIndex = (index) => {
    return (index % 2 === 0) ? "1, 1, 0" : "1, -1, 0";
  };

  // 초기 상태 설정: 뒷면(back)이 뒤집힌 상태에서 축 방향에 맞춰 똑바로 보이도록 보정
  thumbs.forEach((card, i) => {
    const back = card.querySelector('.back');
    if (back) {
      const axis = getAxisByIndex(i);
      back.style.transform = `rotate3d(${axis}, 180deg)`;
    }
  });

  /**
   * 2. 메인 조립 애니메이션 (Kinetic Assembly Timeline)
   * 스크롤에 따라 카드가 사방에서 날아와 그리드를 형성합니다.
   */
  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#graphic",
      start: "top top",
      end: "+=2500", // 애니메이션 지속 길이 (250vh 상당)
      scrub: 1.5,
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        // 진행률 40% ~ 60% 구간에서만 테두리 빛(is-aligned) 활성화
        // 이 구간이 카드가 정면을 바라보는 '완성된 상태'입니다.
        if (self.progress > 0.35 && self.progress < 0.65) {
          gridContainer.classList.add('is-aligned');
        } else {
          gridContainer.classList.remove('is-aligned');
        }
      }
    }
  });

  // 카드 날아오기 및 사라지기 로직
  thumbs.forEach((card, i) => {
    // 인덱스에 따라 위/아래 방향 교차 설정
    const yDir = (i % 2 === 0) ? 1 : -1;
    const xDir = (i < 4) ? -1 : 1; // 좌측 열과 우측 열 방향 차별화

    mainTl.fromTo(card, 
      { 
        y: yDir * 600, 
        x: xDir * 200,
        z: 1000, 
        opacity: 0, 
        rotationX: 30,
        rotationY: xDir * 20 
      },
      { 
        y: 0, 
        x: 0,
        z: 0, 
        opacity: 1, 
        rotationX: 0, 
        rotationY: 0,
        duration: 2, 
        ease: "power3.inOut" 
      }, 
      i * 0.1 // 순차적 등장(Stagger)
    )
    .to(card, {
      y: yDir * -600, 
      z: -1000, 
      opacity: 0, 
      rotationX: -30,
      duration: 2, 
      ease: "power3.in"
    }, "+=1.5"); // 중앙에서 머무는 시간 확보
  });

  /**
   * 3. 인터랙티브 3D 플립 (Smart Hover Flip)
   * .is-aligned 클래스가 있을 때만(조립 완료 시) 대각선 플립이 작동합니다.
   */
  thumbs.forEach((card, i) => {
    const inner = card.querySelector('.thumb-inner');
    if (!inner) return;

    const axis = getAxisByIndex(i);
    const flipState = { angle: 0 };

    card.addEventListener('mouseenter', () => {
      // 조립되지 않은 상태에서는 플립 금지
      if (!gridContainer.classList.contains('is-aligned')) return;
      
      gsap.to(flipState, {
        angle: 180,
        duration: 0.7,
        ease: "back.out(1.2)", // 탄성 있는 효과
        onUpdate: () => {
          // 대각선 회전 + 앞으로 살짝 튀어나오는(translate3d) 깊이감 추가
          inner.style.transform = `rotate3d(${axis}, ${flipState.angle}deg) translate3d(0, 0, 80px)`;
        }
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(flipState, {
        angle: 0,
        duration: 0.6,
        ease: "power2.out",
        onUpdate: () => {
          inner.style.transform = `rotate3d(${axis}, ${flipState.angle}deg)`;
        }
      });
    });
  });
});