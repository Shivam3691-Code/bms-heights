import { useRef, useState } from 'react';
import { BedDouble, CookingPot, Bath, ArrowUpDown } from 'lucide-react';
import Img from '../components/Img.jsx';
import { SectionHeading } from '../components/Ui.jsx';
import { FINISHES } from '../config/project.js';
import { gsap, prefersReducedMotion } from '../lib/motion.js';

const ICONS = { bedroom: BedDouble, kitchen: CookingPot, bathroom: Bath, lift: ArrowUpDown };

export default function Finishes() {
  const [active, setActive] = useState('bedroom');
  const stage = useRef(null);
  const current = FINISHES.find((f) => f.id === active);

  const select = (id) => {
    if (id === active) return;
    setActive(id);
    if (prefersReducedMotion()) return;
    requestAnimationFrame(() => {
      const q = gsap.utils.selector(stage.current);
      gsap.fromTo(q('.finishes__img'), { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 1.1, ease: 'expo.inOut' });
      gsap.fromTo(q('.finishes__img img'), { scale: 1.2 }, { scale: 1, duration: 1.6, ease: 'expo.out' });
      gsap.fromTo(q('.finishes__spec li'), { autoAlpha: 0, x: 20 }, { autoAlpha: 1, x: 0, duration: 0.6, stagger: 0.06, delay: 0.3 });
    });
  };

  return (
    <section id="finishes" className="section finishes is-dark" aria-labelledby="fin-title">
      <div className="container">
        <SectionHeading index="06" eyebrow="Specifications" id="fin-title" inverse lines={['The art of', 'better living.']} />

        <div className="finishes__layout" ref={stage}>
          <div className="finishes__nav" role="tablist" aria-label="Specification category" data-reveal>
            {FINISHES.map((f, i) => {
              const Icon = ICONS[f.id];
              return (
                <button
                  key={f.id}
                  id={`fin-tab-${f.id}`}
                  type="button"
                  role="tab"
                  aria-selected={f.id === active}
                  aria-controls="fin-panel"
                  className={`finishes__tab ${f.id === active ? 'is-active' : ''}`}
                  onClick={() => select(f.id)}
                  onMouseEnter={() => window.matchMedia('(hover: hover)').matches && select(f.id)}
                >
                  <span className="finishes__tab-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="finishes__tab-label">{f.title}</span>
                  <Icon size={20} strokeWidth={1.4} aria-hidden="true" />
                </button>
              );
            })}
          </div>

          <div id="fin-panel" role="tabpanel" aria-labelledby={`fin-tab-${active}`} className="finishes__panel">
            <div className="finishes__visual">
              <Img key={current.id} name={current.image} className="finishes__img" ratio={4 / 3} sizes="(max-width: 900px) 100vw, 50vw" width={1400} />
            </div>
            <div className="finishes__spec">
              <h3 className="display display--sm">{current.title}</h3>
              <ul>
                {current.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
