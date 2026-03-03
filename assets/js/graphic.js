  const gridContainer = document.querySelector("#graphic .container");
  const gridElement = gridContainer.querySelector(".grid");
  const thumbs = gridElement.querySelectorAll(".thumb");

  const getAxisByIndex = (index) => {
    return (index % 2 === 0) ? "1, 1, 0" : "1, -1, 0";
  };

  thumbs.forEach((card, i) => {
    const back = card.querySelector('.back');
    const axis = getAxisByIndex(i);
    back.style.transform = `rotate3d(${axis}, 180deg)`;
  });

  let mm = gsap.matchMedia();
  // const isPortrait = window.matchMedia("(orientation: portrait)").matches;
  // return isPortrait ? card.dataset.bgMo : card.dataset.bgPc;
  mm.add({
    isPortrait: "(orientation: portrait)",
    isLandscape: "(orientation: landscape)",
  }, (context)=>{
    let { isPortrait } = context.conditions;
    const columns = isPortrait ? 2 : 4;
    const vh = window.innerHeight;
    
    const scrollDist = gridElement.offsetTop + gridElement.offsetHeight - vh;

    const entryDist = isPortrait ? vh * 1.0 : vh * 0.5;
    const stayDist = isPortrait ? vh * 2.0 : vh * 1.0;
    const totalDist = entryDist * 2 + stayDist;

    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#graphic",
        start: "top top",
        end: `+=${totalDist}`,
        scrub: 1.5,
        pin: true,
        anticipatePin: 1,
        // markers: true,
        onUpdate: (self) => {

          const startProgress = entryDist / totalDist;
          const endProgress = (entryDist + stayDist) / totalDist;

          if (self.progress > startProgress && self.progress < endProgress) {
            gridContainer.classList.add('is-aligned');
          } else {
            gridContainer.classList.remove('is-aligned');
          }
        }
      }
    });

    mainTl.addLabel("entry", 0)
          .addLabel("stay", entryDist)
          .addLabel("exit", entryDist + stayDist);


    thumbs.forEach((card, i) => {
      // const yDir = (i % 2 === 0) ? 1 : -1;

      const row = Math.floor(i / columns);
      const col = i % columns;
      const yDir = (row + col) % 2 === 0 ? 1 : -1;
      const exitDistance = (yDir === 1) ? "-=120vh" : "+=120vh";

      gsap.fromTo(card, 
        { 
          y: yDir * 120 + "vh", // 화면 밖 시작
          opacity: 0, 
          scale: 0.4 
        },
        { 
          y: yDir * 40 + "vh",  // 상단 도달 시 40vh 지점까지 도착
          opacity: 0.6,
          scale: 0.7,
          scrollTrigger: {
            trigger: "#graphic",
            start: "top bottom", // 섹션이 바닥에서 보일 때부터
            end: "top top",      // 상단에 닿을 때까지
            scrub: 1,
            markers: true,
          }
        }
      );



      mainTl.fromTo(card, 
        { 
          // start: "top 20%",
          // markers: true,
          // y: yDir * 600,
          y: yDir * 120 + "vh",
          // z: 1000, 
          opacity: 0,
          scale: 0.3,
        },
        { 
          y: 0, 
          x: 0,
          // z: 0, 
          opacity: 1, 
          scale: 1,
          duration: entryDist, 
          ease: "expo.out" 
        }, `entry+=${i * (entryDist / 25)}`
      )
      .to(card, {
        // y: yDir * -600, 
        y: exitDistance,
        // z: -1000, 
        opacity: 0,
        scale: 0.3,
        duration: entryDist, 
        ease: "expo.in"
      }, `exit+=${i * (entryDist / 25)}`);
    });

    // mainTl.to(isPortrait ? gridElement : {}, {
    //   y: -scrollDist,
    //   duration: stayDist,
    //   ease: "none"
    // }, "stay");

    if (isPortrait) {
      mainTl.to(gridElement, {
        y: -scrollDist,
        duration: stayDist,
        ease: "none"
      }, "stay");
    } else {
      mainTl.to({}, { duration: stayDist }, "stay");
    }

  });

  thumbs.forEach((card, i) => {
    const inner = card.querySelector('.thumb-inner');
    if (!inner) return;

    const axis = getAxisByIndex(i);
    const flipState = { angle: 0 };

    card.addEventListener('mouseenter', () => {
      if (!gridContainer.classList.contains('is-aligned')) return;
      
      gsap.to(flipState, {
        angle: 180,
        duration: 0.3,
        // ease: "power3.out",
        onUpdate: () => {
          inner.style.transform = `rotate3d(${axis}, ${flipState.angle}deg)`;
        }
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(flipState, {
        angle: 0,
        duration: 0.3,
        // ease: "power3.out",
        onUpdate: () => {
          inner.style.transform = `rotate3d(${axis}, ${flipState.angle}deg)`;
        }
      });
    });
  });