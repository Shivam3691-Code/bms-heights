import { useRef, useState } from 'react';
import { ArrowRight, Download, Ruler } from 'lucide-react';
import Img from '../components/Img.jsx';
import { SectionHeading, Tilt } from '../components/Ui.jsx';
import { UnitPlan } from '../components/PlanDiagrams.jsx';
import { RESIDENCES, PROJECT } from '../config/project.js';
import { gsap, prefersReducedMotion, scrollToId } from '../lib/motion.js';

// Map a residence variant to the enquiry form's preference value.
const PREF = { studio: 'Studio', '1bhk': '1 BHK', '2bhk-t1': '2 BHK Type 1', '2bhk-t2': '2 BHK Type 2' };

export function enquireAbout(variantId) {
  window.dispatchEvent(new CustomEvent('bms:prefill', { detail: { preference: PREF[variantId] || '' } }));
  scrollToId('contact');
}

export default function Residences() {
  const [typeId, setTypeId] = useState('2bhk');
  const [variantIdx, setVariantIdx] = useState(0);
  const stage = useRef(null);
  const type = RESIDENCES.find((r) => r.id === typeId);
  const variant = type.variants[variantIdx] || type.variants[0];

  const animateSwap = () => {
    if (prefersReducedMotion() || !stage.current) return;
    gsap.fromTo(
      stage.current.querySelectorAll('[data-swap]'),
      { autoAlpha: 0, y: 24, rotateX: -6 },
      { autoAlpha: 1, y: 0, rotateX: 0, duration: 0.8, ease: 'expo.out', stagger: 0.06 },
    );
  };

  const selectType = (id) => {
    if (id === typeId) return;
    setTypeId(id);
    setVariantIdx(0);
    requestAnimationFrame(animateSwap);
  };

  const onTabKey = (e, i) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + RESIDENCES.length) % RESIDENCES.length;
    selectType(RESIDENCES[next].id);
    document.getElementById(`res-tab-${RESIDENCES[next].id}`)?.focus();
  };

  return (
    <section id="residences" className="section residences" aria-labelledby="res-title">
      <div className="container">
        <div className="residences__head">
          <SectionHeading index="03" eyebrow="The Residences" id="res-title" lines={['Find your', 'perfect space.']} />
          <div role="tablist" aria-label="Apartment type" className="tabs" data-reveal>
            {RESIDENCES.map((r, i) => (
              <button
                key={r.id}
                id={`res-tab-${r.id}`}
                role="tab"
                type="button"
                aria-selected={r.id === typeId}
                aria-controls="res-panel"
                tabIndex={r.id === typeId ? 0 : -1}
                className={`tab ${r.id === typeId ? 'is-active' : ''}`}
                onClick={() => selectType(r.id)}
                onKeyDown={(e) => onTabKey(e, i)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div id="res-panel" role="tabpanel" aria-labelledby={`res-tab-${typeId}`} className="residences__panel" ref={stage}>
          <Tilt className="residences__visual" max={4}>
            <div data-swap key={`${typeId}-${variant.id}`} className="residences__visual-inner">
              {variant.plan ? (
                <div className="plan-card">
                  <UnitPlan type={variant.plan} title={variant.name} />
                </div>
              ) : (
                <Img name={type.image} ratio={4 / 3} sizes="(max-width: 900px) 100vw, 58vw" width={1600} />
              )}
            </div>
          </Tilt>

          <div className="residences__info">
            <p className="eyebrow" data-swap>
              Collection
            </p>
            <h3 className="display display--sm" data-swap>
              {type.title}
            </h3>
            <p className="residences__summary" data-swap>
              {type.summary}
            </p>

            {type.variants.length > 1 && (
              <div className="chips" role="group" aria-label="Configuration" data-swap>
                {type.variants.map((v, i) => (
                  <button
                    key={v.id}
                    type="button"
                    className={`chip ${i === variantIdx ? 'is-active' : ''}`}
                    aria-pressed={i === variantIdx}
                    onClick={() => {
                      setVariantIdx(i);
                      requestAnimationFrame(animateSwap);
                    }}
                  >
                    {v.name.replace('2 BHK ', '')}
                  </button>
                ))}
              </div>
            )}

            <div className="area" data-swap>
              <Ruler size={18} aria-hidden="true" />
              <div>
                <span className="area__label">{variant.name}</span>
                {variant.area ? (
                  <span className="area__value">
                    {variant.area} <small>Sq. Ft.</small>
                  </span>
                ) : (
                  <span className="area__value area__value--na">Area details on request</span>
                )}
              </div>
            </div>

            {variant.plan && (
              <p className="fineprint" data-swap>
                Diagram shows conceptual zoning of the spaces listed in the brochure. It is not to scale and not an approved plan.
              </p>
            )}

            <div className="residences__ctas" data-swap>
              <button type="button" className="btn btn--dark" onClick={() => enquireAbout(variant.id)}>
                Enquire about this apartment <ArrowRight size={16} aria-hidden="true" />
              </button>
              {PROJECT.brochureUrl ? (
                <a className="btn btn--line" href={PROJECT.brochureUrl} download>
                  <Download size={16} aria-hidden="true" /> Download brochure
                </a>
              ) : (
                <button type="button" className="btn btn--line" aria-disabled="true" title="Brochure will be available soon">
                  <Download size={16} aria-hidden="true" /> Brochure — coming soon
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
