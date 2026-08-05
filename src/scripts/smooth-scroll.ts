import Lenis from "lenis";
import "lenis/dist/lenis.css";

export function initSmoothScroll() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const lenis = new Lenis({
    duration: 1.05,
    smoothWheel: true,
    touchMultiplier: 1.1,
  });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}
