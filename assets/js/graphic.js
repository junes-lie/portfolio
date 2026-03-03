  const gridContainer = document.querySelector("#graphic .container");
  const thumbs = document.querySelectorAll("#graphic .thumb");
  const getAxisByIndex = (index) => {
    return (index % 2 === 0) ? "1, 1, 0" : "1, -1, 0";
  };

  thumbs.forEach((card, i) => {
    const back = card.querySelector('.back');
    const axis = getAxisByIndex(i);
    back.style.transform = `rotate3d(${axis}, 180deg)`;
  });

  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#graphic",
      start: "top top",
      end: "+=2000", 
      scrub: 1.2,
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        if (self.progress > 0.3 && self.progress < 0.7) {
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
      { 
        y: yDir * 600, 
        z: 1000, 
        opacity: 0, 
        rotationX: 30,
      },
      { 
        y: 0, 
        x: 0,
        z: 0, 
        opacity: 1, 
        rotationX: 0, 
        duration: 2, 
        ease: "expo.out" 
      }, 
      i * 0.08
    )
    .to(card, {
      y: yDir * -600, 
      z: -1000, 
      opacity: 0, 
      rotationX: -30,
      duration: 2, 
      ease: "expo.in"
    }, 5 + (i * 0.08));
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