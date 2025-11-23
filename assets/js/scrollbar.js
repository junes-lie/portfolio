gsap.registerPlugin(ScrollTrigger);

const layout = document.querySelector('#layout');
const scrollbar = Scrollbar.init(layout, {
  damping: 0.03,
});

ScrollTrigger.scrollerProxy(layout, {
  scrollTop(value) {
    if (arguments.length) {
      scrollbar.scrollTop = value; // setter
    }
    return scrollbar.scrollTop; // getter
  },
});

scrollbar.addListener(ScrollTrigger.update);
ScrollTrigger.defaults({ scroller: layout });


function markers(){
  if (document.querySelector('.gsap-marker-scroller-start')) {
    const markers = gsap.utils.toArray('[class *= "gsap-marker"]');

    scrollbar.addListener(({ offset }) => {
      gsap.set(markers, { marginTop: -offset.y });
    });
  }
}






















markers();
