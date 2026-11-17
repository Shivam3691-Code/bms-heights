import { useEffect, useRef } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import Img from '../components/Img.jsx';
import { gsap, prefersReducedMotion, scrollToId } from '../lib/motion.js';
import { PROJECT } from '../config/project.js';

export default function Hero() {
  const root = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      root.current.classList.add('is-static');
      return;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from('.hero__media', { clipPath: 'inset(12% 8% 12% 8%)', duration: 1.8 })
        .from('.hero__media img', { scale: 1.35, duration: 2.6 }, 0)
        .from('.hero [data-line]', { yPercent: 110, duration: 1.4, stagger: 0.12 }, 0.5)
        .from('.hero__fade', { autoAlpha: 0, y: 24, duration: 1.2, stagger: 0.08 }, 0.9)
        .from('.hero__rule', { scaleX: 0, duration: 1.4 }, 0.8);

      // Slow continuous zoom + scroll parallax for depth.
      gsap.to('.hero__media img', { scale: 1.08, duration: 18, ease: 'none', repeat: -1, yoyo: true, delay: 2.6 });
      gsap.to('.hero__parallax', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.hero__content', {
        yPercent: -30,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: '70% top', scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="home" className="hero" ref={root} aria-labelledby="hero-title">
      <div className="hero__media">
        <div className="hero__parallax">
          <Img name="heroFacade" priority sizes="100vw" width={2400} className="hero__img" tag={false} />
        </div>
        <div className="hero__shade" aria-hidden="true" />
      </div>

      <div className="hero__content container">
        <p className="hero__eyebrow hero__fade">
          <span className="hero__rule" aria-hidden="true" />
          {PROJECT.developer} presents
        </p>
        <h1 id="hero-title" className="hero__title">
          <span className="line">
            <span className="line__inner" data-line>
              BMS
            </span>
          </span>
          <span className="line">
            <span className="line__inner hero__title-gold" data-line>
              Heights
            </span>
          </span>
        </h1>
        <p className="hero__tagline">
          <span className="line">
            <span className="line__inner" data-line>
              A new perspective of luxury living
            </span>
          </span>
        </p>
        <div className="hero__meta hero__fade">
          <span>Studio</span>
          <span aria-hidden="true">·</span>
          <span>1 BHK</span>
          <span aria-hidden="true">·</span>
          <span>2 BHK Apartments</span>
          <span className="hero__city">Greater Noida</span>
        </div>
        <div className="hero__ctas hero__fade">
          <a
            href="#residences"
            className="btn btn--gold"
            onClick={(e) => {
              e.preventDefault();
              scrollToId('residences');
            }}
          >
            Explore Residences <ArrowRight size={16} aria-hidden="true" />
          </a>
          <a
            href="#contact"
            className="btn btn--ghost-light"
            onClick={(e) => {
              e.preventDefault();
              scrollToId('contact');
            }}
          >
            Enquire Now
          </a>
        </div>
      </div>

      <div className="hero__foot container hero__fade">
        <span className="hero__note">Illustrative architectural imagery</span>
        <a
          href="#about"
          className="scroll-cue"
          onClick={(e) => {
            e.preventDefault();
            scrollToId('about');
          }}
        >
          <span className="scroll-cue__track" aria-hidden="true">
            <span className="scroll-cue__dot" />
          </span>
          Scroll to discover <ArrowDown size={14} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
