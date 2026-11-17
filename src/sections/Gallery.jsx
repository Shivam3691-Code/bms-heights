import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, Plus } from 'lucide-react';
import Img from '../components/Img.jsx';
import { SectionHeading } from '../components/Ui.jsx';
import { UnitPlan, TowerPlan } from '../components/PlanDiagrams.jsx';
import { ASSETS } from '../config/assets.js';
import { TOWER_PLANS } from '../config/project.js';
import { gsap, prefersReducedMotion } from '../lib/motion.js';

const ITEMS = [
  { cat: 'Architecture', img: 'facadeEvening', caption: 'Exterior concept at twilight', size: 'tall' },
  { cat: 'Interiors', img: 'livingBright', caption: 'Living room inspiration', size: 'wide' },
  { cat: 'Interiors', img: 'bedroom', caption: 'Bedroom inspiration' },
  { cat: 'Architecture', img: 'heroFacade', caption: 'Low-rise residential concept' },
  { cat: 'Interiors', img: 'kitchenSink', caption: 'Kitchen inspiration', size: 'tall' },
  { cat: 'Floor plans', plan: 'type1', caption: '2 BHK Type 01 · 1120 Sq. Ft. — conceptual' },
  { cat: 'Interiors', img: 'bathroomDark', caption: 'Bathroom inspiration' },
  { cat: 'Lifestyle', img: 'garden', caption: 'Green spaces inspiration', size: 'wide' },
  { cat: 'Interiors', img: 'bedroomLight', caption: 'Bedroom inspiration' },
  { cat: 'Architecture', img: 'facadeDusk', caption: 'Facade detail concept', size: 'tall' },
  { cat: 'Floor plans', plan: 'type2', caption: '2 BHK Type 02 · 1090 Sq. Ft. — conceptual' },
  { cat: 'Interiors', img: 'kitchen', caption: 'Modular kitchen inspiration' },
  { cat: 'Lifestyle', img: 'terrace', caption: 'Quiet corners inspiration' },
  { cat: 'Interiors', img: 'livingWarm', caption: 'Living room inspiration', size: 'wide' },
  { cat: 'Floor plans', tower: 0, caption: 'Tower A typical floor — conceptual' },
  { cat: 'Interiors', img: 'bathroom', caption: 'Bathroom inspiration' },
];
const CATS = ['All', 'Architecture', 'Interiors', 'Floor plans', 'Lifestyle'];

function Visual({ item, big = false }) {
  if (item.plan) return <div className="plan-card plan-card--tile"><UnitPlan type={item.plan} title={item.caption} /></div>;
  if (item.tower !== undefined) {
    const t = TOWER_PLANS[item.tower];
    return <div className="plan-card plan-card--tile"><TowerPlan units={t.units} label={t.label} /></div>;
  }
  return (
    <Img
      name={item.img}
      sizes={big ? '90vw' : '(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 33vw'}
      width={big ? 2000 : 900}
      tag={!big}
    />
  );
}

export default function Gallery() {
  const [cat, setCat] = useState('All');
  const [open, setOpen] = useState(-1);
  const grid = useRef(null);
  const closeBtn = useRef(null);
  const lastFocus = useRef(null);
  const items = cat === 'All' ? ITEMS : ITEMS.filter((i) => i.cat === cat);

  const filter = (c) => {
    setCat(c);
    if (prefersReducedMotion()) return;
    requestAnimationFrame(() =>
      gsap.fromTo(grid.current.children, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.04, ease: 'expo.out' }),
    );
  };

  const show = (i) => {
    lastFocus.current = document.activeElement;
    setOpen(i);
  };
  const close = useCallback(() => {
    setOpen(-1);
    lastFocus.current?.focus?.();
  }, []);
  const step = useCallback((d) => setOpen((o) => (o + d + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (open < 0) return;
    document.documentElement.classList.add('lightbox-open');
    closeBtn.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'Tab') {
        // Simple focus trap inside the dialog.
        const f = [...document.querySelectorAll('.lightbox button')];
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.classList.remove('lightbox-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close, step]);

  const current = items[open];

  return (
    <section id="gallery" className="section gallery" aria-labelledby="gal-title">
      <div className="container">
        <div className="gallery__head">
          <SectionHeading index="08" eyebrow="Gallery" id="gal-title" lines={['A closer look at', 'BMS Heights.']} />
          <div className="chips" role="group" aria-label="Filter gallery" data-reveal>
            {CATS.map((c) => (
              <button key={c} type="button" className={`chip ${c === cat ? 'is-active' : ''}`} aria-pressed={c === cat} onClick={() => filter(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <p className="fineprint gallery__note" data-reveal>
          Photography shown is illustrative concept and inspiration imagery, not photographs of BMS Heights. Floor plans are
          conceptual diagrams.
        </p>

        <ul className="masonry" ref={grid}>
          {items.map((item, i) => (
            <li key={`${cat}-${i}`} className={`masonry__item ${item.size ? `masonry__item--${item.size}` : ''}`} data-reveal>
              <button type="button" className="tile" onClick={() => show(i)} data-cursor="view" aria-label={`Open: ${item.caption}`}>
                <Visual item={item} />
                <span className="tile__overlay" aria-hidden="true">
                  <span className="tile__cat">{item.cat}</span>
                  <span className="tile__cap">{item.caption}</span>
                  <Plus size={18} className="tile__plus" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {current && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={current.caption} onClick={(e) => e.target === e.currentTarget && close()}>
          <button ref={closeBtn} type="button" className="lightbox__close icon-btn" onClick={close} aria-label="Close gallery">
            <X size={20} />
          </button>
          <button type="button" className="lightbox__nav lightbox__nav--prev icon-btn" onClick={() => step(-1)} aria-label="Previous image">
            <ChevronLeft size={22} />
          </button>
          <figure className="lightbox__figure" key={open}>
            <div className="lightbox__media">
              <Visual item={current} big />
            </div>
            <figcaption>
              <span className="tile__cat">{current.cat}</span> {current.caption}
              {current.img && ASSETS[current.img]?.illustrative && <em> · Illustrative imagery</em>}
              <span className="lightbox__count">
                {open + 1} / {items.length}
              </span>
            </figcaption>
          </figure>
          <button type="button" className="lightbox__nav lightbox__nav--next icon-btn" onClick={() => step(1)} aria-label="Next image">
            <ChevronRight size={22} />
          </button>
        </div>
      )}
    </section>
  );
}
