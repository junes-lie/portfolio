/**
 * Graphic Section Animation - Optimized Version
 * 1. Entrance Trigger: 섹션이 화면 아래에서 올라올 때부터 카드 입장 시작 (top 80% -> top top)
 * 2. Main Pin Trigger: 섹션 고정 후 그리드 슬라이딩 및 카드 퇴장
 * 3. Headline/State Trigger: 헤드라인 상태 및 테두리 활성화 전용 트리거
 */

const initGraphicAnimation = () => {
  const graphicSection = document.querySelector("#graphic");
  const gridContainer = document.querySelector("#graphic .container");
  const gridElement = gridContainer?.querySelector(".grid");
  const thumbs = gridElement?.querySelectorAll(".thumb");
  const headline = gridContainer?.querySelector(".headline");

  if (!graphicSection || !gridElement || !thumbs) return;

  const getAxisByIndex = (index) => (index % 2 === 0 ? "1, 1, 0" : "1, -1, 0");

  // 초기 셋팅
  thumbs.forEach((card, i) => {
    const back = card.querySelector('.back');
    const axis = getAxisByIndex(i);
    if (back) back.style.transform = `rotate3d(${axis}, 180deg)`;
  });

  let mm = gsap.matchMedia();

  mm.add({
    isPortrait: "(orientation: portrait)",
    isLandscape: "(orientation: landscape)",
  }, (context) => {
    let { isPortrait } = context.conditions;
    const columns = isPortrait ? 2 : 4;
    const vh = window.innerHeight;
    
    // 모바일 그리드 이동 거리 계산
    const gridTop = gridElement.offsetTop;
    const gridHeight = gridElement.offsetHeight;
    const scrollDist = isPortrait ? (gridTop + gridHeight - vh) : 0;

    // 구간별 거리 설정 (세로 400vh / 가로 200vh 호흡 유지)
    const moveDist = isPortrait ? vh * 2.0 : vh * 1.0; 
    const exitDist = isPortrait ? vh * 1.0 : vh * 0.5;
    const totalDist = moveDist + exitDist;

    /**
     * [STEP 1] Entrance (사전 입장)
     * 트리거 시작지점을 위로 당겨서(top 80%) 섹션이 상단에 닿기 전 미리 입장 완료
     */
    const entranceTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#graphic",
        start: "top 80%", // 시작지점을 당겨서 미리 보이게 함
        end: "top top",
        scrub: 1,
        invalidateOnRefresh: true
      }
    });

    thumbs.forEach((card, i) => {
      const row = Math.floor(i / columns);
      const col = i % columns;
      const yDir = (row + col) % 2 === 0 ? 1 : -1;

      entranceTl.fromTo(card, 
        { y: yDir * 120 + "vh", opacity: 0, scale: 0.5 },
        { 
          y: 0, opacity: 1, scale: 1, 
          ease: "power2.out"
        }, i * 0.05
      );
    });

    /**
     * [STEP 2] Main Pin (고정 및 퇴장)
     * 입장이 완료된(y: 0) 상태에서 시작하여 슬라이딩과 퇴장만 처리
     */
    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#graphic",
        start: "top top",
        end: `+=${totalDist}`,
        scrub: 1.2,
        pin: true,
        anticipatePin: 1
      }
    });

    mainTl.addLabel("move", 0)
          .addLabel("exit", moveDist);

    // 그리드 이동 (Portrait 전용)
    if (isPortrait && scrollDist > 0) {
      mainTl.to(gridElement, {
        y: -scrollDist,
        duration: moveDist,
        ease: "none"
      }, "move");
    } else {
      // 가로 모드는 이동 대신 정지
      mainTl.to({}, { duration: moveDist }, "move");
    }

    // 카드 퇴장
    thumbs.forEach((card, i) => {
      const row = Math.floor(i / columns);
      const col = i % columns;
      const yDir = (row + col) % 2 === 0 ? 1 : -1;
      const exitDistance = (yDir === 1) ? "-=150vh" : "+=150vh";

      mainTl.to(card, {
        y: exitDistance,
        z: -1000, 
        opacity: 0,
        scale: 0.3,
        duration: exitDist, 
        ease: "none"
      }, `exit+=${i * (exitDist / 30)}`);
    });

    /**
     * [STEP 3] Headline & State Trigger (별도 관리)
     * 헤드라인의 색상과 테두리 활성화를 별도 트리거로 분리하여 충돌 방지
     */
    ScrollTrigger.create({
      trigger: "#graphic",
      start: "top top", // 섹션이 고정되는 순간
      end: `top+=${moveDist} top`, // 그리드 이동이 끝나는 지점까지
      onEnter: () => gridContainer.classList.add('is-aligned'),
      onLeave: () => gridContainer.classList.remove('is-aligned'),
      onEnterBack: () => gridContainer.classList.add('is-aligned'),
      onLeaveBack: () => gridContainer.classList.remove('is-aligned'),
    });

    return () => {
      entranceTl.kill();
      mainTl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  });

  // 호버 인터랙션
  thumbs.forEach((card, i) => {
    const inner = card.querySelector('.thumb-inner');
    if (!inner) return;
    const axis = getAxisByIndex(i);
    const flipState = { angle: 0 };

    card.addEventListener('mouseenter', () => {
      if (!gridContainer.classList.contains('is-aligned')) return;
      gsap.to(flipState, {
        angle: 180, duration: 0.3, onUpdate: () => {
          inner.style.transform = `rotate3d(${axis}, ${flipState.angle}deg)`;
        }
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(flipState, {
        angle: 0, duration: 0.3, onUpdate: () => {
          inner.style.transform = `rotate3d(${axis}, ${flipState.angle}deg)`;
        }
      });
    });
  });
};

window.addEventListener("load", initGraphicAnimation);