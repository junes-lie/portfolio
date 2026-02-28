

const gridContainer = document.querySelector("#graphic .container");
const thumbs = gridContainer.querySelectorAll(".thumb");

const getAxisByIndex = (index) => {
  return (index % 2 === 0) ? "1, 1, 0" : "1, -1, 0";
};

thumbs.forEach((card, i) => {
  const back = card.querySelector('.back');
  const axis = getAxisByIndex(i);
  // 뒷면 초기 보정: 축 방향에 따라 뒤집혔을 때 똑바로 보이도록 설정
  back.style.transform = `rotate3d(${axis}, 180deg)`;
});

const mainTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#graphic",
    start: "top top",
    // end: "+=3500",
    // scrub: 1.2,
    markers: true,
    pin: true,
    onUpdate: (self) => {
      if (self.progress > 0.42 && self.progress < 0.58) {
        gridContainer.classList.add('is-aligned');
      } else {
        gridContainer.classList.remove('is-aligned');
      }
    }
  }
});

thumbs.forEach((card, i) => {
  const yDir = (i % 2 === 0) ? 1 : -1;
  mainTl.fromTo(card, 
    { y: yDir * 800, z: 1200, opacity: 0, rotationX: 45 },
    { y: 0, z: 0, opacity: 1, rotationX: 0, duration: 2.2, ease: "expo.inOut" }, 
    i * 0.08
  )
  .to(card, {
    y: yDir * -800, z: -1200, opacity: 0, rotationX: -45,
    duration: 2.2, ease: "expo.in"
  }, 2.5 + (i * 0.08));
});

thumbs.forEach((card, i) => {
  const inner = card.querySelector('.thumb-inner');
  const axis = getAxisByIndex(i); // 인덱스 기반으로 축 정보 획득
  const flipState = { angle: 0 };

  card.addEventListener('mouseenter', () => {
    if (!gridContainer.classList.contains('is-aligned')) return;
    
    gsap.to(flipState, {
      angle: 180,
      duration: 0.8,
      ease: "power2.inOut",
      onUpdate: () => {
        inner.style.transform = `rotate3d(${axis}, ${flipState.angle}deg) translate3d(0, -15px, 60px)`;
      }
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(flipState, {
      angle: 0,
      duration: 0.8,
      ease: "power2.inOut",
      onUpdate: () => {
        inner.style.transform = `rotate3d(${axis}, ${flipState.angle}deg)`;
      }
    });
  });
});
