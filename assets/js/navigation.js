gsap.registerPlugin(ScrollTrigger,ScrollToPlugin);

// scrollbar.js에서 이미 작성함
// const container = document.querySelector('#layout');

// const options = {
//     damping: 0.1,
//     alwaysShowTracks: true,
// };

// const scrollbar = Scrollbar.init(container, {
//   ...options
// });


ScrollTrigger.create({
  trigger: '.scroll-content',
  start: 'top top',
  end: 'bottom bottom',
  animation: gsap.from('.progress',{scaleY:0}),
  scrub: true
});


// 클릭시 섹션이동
// gsap.utils.toArray('.nav li').forEach((li,index)=>{
    
//   li.addEventListener('click',()=>{
    
//     let sectionTop = ScrollTrigger.getAll()[index].start;
//     scrollbar.scrollTo(0, sectionTop ,600);

//   })

// })