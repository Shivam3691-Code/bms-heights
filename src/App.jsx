import { useEffect } from 'react';
import Lenis from 'lenis';
import Nav from './components/Nav.jsx';
import { Cursor, ScrollProgress } from './components/Ui.jsx';
import Hero from './sections/Hero.jsx';
import Intro from './sections/Intro.jsx';
import Architecture from './sections/Architecture.jsx';
import Residences from './sections/Residences.jsx';
import FloorPlans from './sections/FloorPlans.jsx';
import Amenities from './sections/Amenities.jsx';
import Finishes from './sections/Finishes.jsx';
import Location from './sections/Location.jsx';
import Gallery from './sections/Gallery.jsx';
import Enquiry from './sections/Enquiry.jsx';
import Footer from './sections/Footer.jsx';
import { gsap, ScrollTrigger, prefersReducedMotion, isFinePointer, isSmallScreen, setLenis } from './lib/motion.js';

function useSmoothScroll() {
  useEffect(() => {
    // Lenis only for fine-pointer desktops without reduced-motion: touch devices keep native scrolling.
    if (prefersReducedMotion() || !isFinePointer()) return;
    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4) });
    setLenis(lenis);
    if (process.env.NODE_ENV === 'development') window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const lock = new MutationObserver(() => {
      const c = document.documentElement.classList;
      if (c.contains('lightbox-open') || c.contains('menu-open')) lenis.stop();
      else lenis.start();
    });
    lock.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      lock.disconnect();
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);
}

function useScrollAnimations() {
  useEffect(() => {
    const reduced = prefersReducedMotion();
    document.documentElement.classList.add('js');
    if (reduced) {
      document.documentElement.classList.add('reduced-motion');
      return;
    }
    const small = isSmallScreen();

    const ctx = gsap.context(() => {
      // Heading line reveals (hero handles its own).
      gsap.utils.toArray('.section [data-line]').forEach((el) => {
        gsap.from(el, {
          yPercent: 110,
          rotate: 2,
          duration: 1.3,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
      });

      // Fade-up reveals, batched for performance.
      ScrollTrigger.batch('.section [data-reveal]', {
        start: 'top 90%',
        once: true,
        onEnter: (els) =>
          gsap.fromTo(els, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
      });

      // Clip-path image reveals with a gentle 3D settle.
      gsap.utils.toArray('[data-clip]').forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: 'inset(14% 10% 14% 10%)', rotateX: small ? 0 : 6, transformPerspective: 1400 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            rotateX: 0,
            duration: 1.6,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          },
        );
      });

      // Scroll parallax — reduced on small screens.
      gsap.utils.toArray('[data-parallax]').forEach((el) => {
        const amount = parseFloat(el.dataset.parallax) * (small ? 0.4 : 1);
        gsap.fromTo(
          el,
          { yPercent: -amount },
          {
            yPercent: amount,
            ease: 'none',
            scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      });
    });

    // Recalculate once fonts / images settle.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);
    return () => {
      window.removeEventListener('load', refresh);
      ctx.revert();
    };
  }, []);
}

export default function App() {
  useSmoothScroll();
  useScrollAnimations();

  return (
    <>
      <ScrollProgress />
      <Cursor />
      <Nav />
      <main id="main">
        <Hero />
        <Intro />
        <Architecture />
        <Residences />
        <FloorPlans />
        <Amenities />
        <Finishes />
        <Location />
        <Gallery />
        <Enquiry />
      </main>
      <Footer />
    </>
  );
}
