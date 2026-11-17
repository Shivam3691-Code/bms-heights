import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export const isSmallScreen = () => typeof window !== 'undefined' && window.innerWidth < 768;

// Shared smooth-scroll handle (Lenis instance or null) so nav links can use it.
let lenisRef = null;
export const setLenis = (l) => {
  lenisRef = l;
};

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisRef) lenisRef.scrollTo(el, { offset: id === 'home' ? 0 : -10, duration: 1.4 });
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  // Move focus for keyboard / screen-reader users without a second jump.
  el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}
