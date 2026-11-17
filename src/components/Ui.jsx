import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, isFinePointer, prefersReducedMotion } from '../lib/motion.js';

/** Eyebrow + large serif heading. Lines are split manually so each can be revealed. */
export function SectionHeading({ index, eyebrow, lines, as: Tag = 'h2', align = 'left', inverse = false, id }) {
  return (
    <div className={`section-heading section-heading--${align} ${inverse ? 'is-inverse' : ''}`}>
      <p className="eyebrow" data-reveal>
        {index && <span className="eyebrow__index">{index}</span>}
        {eyebrow}
      </p>
      <Tag className="display" id={id}>
        {lines.map((line, i) => (
          <span className="line" key={i}>
            <span className="line__inner" data-line>
              {line}
            </span>
          </span>
        ))}
      </Tag>
    </div>
  );
}

/** Thin gold reading-progress bar. */
export function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        if (ref.current) ref.current.style.transform = `scaleX(${self.progress})`;
      },
    });
    return () => st.kill();
  }, []);
  return <div className="scroll-progress" ref={ref} aria-hidden="true" />;
}

/** Desktop-only cursor follower that expands over interactive elements. */
export function Cursor() {
  const dot = useRef(null);
  const [enabled] = useState(() => isFinePointer() && !prefersReducedMotion());

  useEffect(() => {
    if (!enabled) return;
    const el = dot.current;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' });
    const move = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      el.classList.add('is-visible');
      const t = e.target.closest?.('a, button, [data-cursor], input, select, textarea, label');
      el.classList.toggle('is-hover', !!t);
      el.classList.toggle('is-view', !!e.target.closest?.('[data-cursor="view"]'));
    };
    const leave = () => el.classList.remove('is-visible');
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    document.documentElement.classList.add('has-cursor');
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      document.documentElement.classList.remove('has-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div className="cursor" ref={dot} aria-hidden="true">
      <span>View</span>
    </div>
  );
}

/** Number that counts up the first time it enters view. */
export function Counter({ value, suffix = '' }) {
  const ref = useRef(null);
  const fmt = (n) => Math.round(n).toLocaleString('en-IN');

  useEffect(() => {
    const el = ref.current;
    if (prefersReducedMotion()) {
      el.textContent = fmt(value) + suffix;
      return;
    }
    const obj = { n: 0 };
    const tween = gsap.to(obj, {
      n: value,
      duration: 2.2,
      ease: 'power3.out',
      paused: true,
      onUpdate: () => (el.textContent = fmt(obj.n) + suffix),
    });
    const st = ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => tween.play() });
    return () => {
      st.kill();
      tween.kill();
    };
  }, [value, suffix]);

  // Server/no-JS friendly final value as accessible label.
  return (
    <span className="counter" aria-label={`${fmt(value)}${suffix}`}>
      <span ref={ref} aria-hidden="true">
        0{suffix}
      </span>
    </span>
  );
}

/** CSS-perspective tilt card. Pointer-driven on desktop only. */
export function Tilt({ children, className = '', max = 6, as: Tag = 'div', ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return;
    const el = ref.current;
    let raf = 0;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--ry', `${px * max}deg`);
        el.style.setProperty('--rx', `${-py * max}deg`);
        el.style.setProperty('--mx', `${(px + 0.5) * 100}%`);
        el.style.setProperty('--my', `${(py + 0.5) * 100}%`);
      });
    };
    const reset = () => {
      cancelAnimationFrame(raf);
      el.style.setProperty('--ry', '0deg');
      el.style.setProperty('--rx', '0deg');
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', reset);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', reset);
      cancelAnimationFrame(raf);
    };
  }, [max]);
  return (
    <Tag ref={ref} className={`tilt ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
