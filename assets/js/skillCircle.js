
const circles = gsap.utils.toArray(".circle .fg");

circles.forEach(circle => {
  
  const percent = circle.getAttribute("data-percent");
  const circumference = 251.2;
  const offset = circumference - (circumference * percent) / 100;

  gsap.to(circle, {
    strokeDashoffset: offset,
    duration: 1.5,
    ease: "power2.out",
    
    scrollTrigger: {
      trigger: "#profile",
      start: "top 80%",
      toggleActions: "play none none none"
    }
  });
});