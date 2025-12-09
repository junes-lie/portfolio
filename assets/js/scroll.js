
let smoother = ScrollSmoother.create({
  content: "#layout",
  smooth: 2,
  effects: true,
  smoothTouch: 0.1,
  // markers: true,
});

const fullMoveSections = gsap.utils.toArray('[data-full-move="true"]');
let isManualMove = false;

function sectionMove(section, position) {
  smoother.paused(true);
  const sectionPos = smoother.offset(section, position);

  gsap.to(smoother, {
    scrollTop: sectionPos,
    ease: "power1.inOut",
    overwrite: true,
    onComplete: () => {
      isManualMove = false;
      smoother.paused(false);
    }
  });
}

fullMoveSections.forEach(section => {
  const prevSection = section.previousElementSibling;
  const nextSection = section.nextElementSibling;
  
  ScrollTrigger.create({
    trigger: section,
    id: `${section.id}-entry`,
    start: "top 80%",
    end: "bottom 20%",
    // markers: true,
    onEnter:() => {
      if (isManualMove) return;
      sectionMove(section, "top top");
    },
    onEnterBack:() => {
      if (isManualMove) return;
      sectionMove(section, "bottom bottom");
    }
  });

  ScrollTrigger.create({
    trigger: section,
    id: `${section.id}-exit`,
    start: "top 20%",
    end: "bottom 80%",
    // markers: true,
    onLeave:() => {
      if (isManualMove) return;
      sectionMove(nextSection, "top top");
    },
    onLeaveBack:() => {
      if (isManualMove) return;
      sectionMove(prevSection, "bottom bottom");
    }
  });

});
