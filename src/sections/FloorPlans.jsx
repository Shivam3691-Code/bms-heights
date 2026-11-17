import { useCallback, useEffect, useRef, useState } from 'react';
import { Maximize, Minimize, ZoomIn, ZoomOut, LocateFixed } from 'lucide-react';
import { SectionHeading } from '../components/Ui.jsx';
import { UnitPlan, TowerPlan } from '../components/PlanDiagrams.jsx';
import { FLOOR_PLAN_SPACES, TOWER_PLANS } from '../config/project.js';
import { gsap, prefersReducedMotion } from '../lib/motion.js';

const PLANS = [
  { id: 'type1', group: 'Apartment', label: '2 BHK Type 01', meta: '1120 Sq. Ft.', render: () => <UnitPlan type="type1" title="2 BHK Type 01" /> },
  { id: 'type2', group: 'Apartment', label: '2 BHK Type 02', meta: '1090 Sq. Ft.', render: () => <UnitPlan type="type2" title="2 BHK Type 02" /> },
  ...TOWER_PLANS.map((t) => ({
    id: t.id,
    group: 'Tower',
    label: t.label,
    meta: `${t.units.length} units per floor plate · ${t.units[0]} – ${t.units[t.units.length - 1]}`,
    render: () => <TowerPlan units={t.units} label={t.label} />,
  })),
];

const MIN = 1;
const MAX = 3;

export default function FloorPlans() {
  const [planId, setPlanId] = useState('type1');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isFull, setIsFull] = useState(false);
  const viewer = useRef(null);
  const canvas = useRef(null);
  const drag = useRef(null);
  const plan = PLANS.find((p) => p.id === planId);

  const clampPan = useCallback((p, z) => {
    const el = viewer.current;
    if (!el) return p;
    const mx = ((z - 1) * el.clientWidth) / 2;
    const my = ((z - 1) * el.clientHeight) / 2;
    return { x: Math.max(-mx, Math.min(mx, p.x)), y: Math.max(-my, Math.min(my, p.y)) };
  }, []);

  const setZoomTo = (z) => {
    const nz = Math.max(MIN, Math.min(MAX, Math.round(z * 100) / 100));
    setZoom(nz);
    setPan((p) => clampPan(p, nz));
  };
  const reset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const choose = (id) => {
    if (id === planId) return;
    setPlanId(id);
    reset();
    if (!prefersReducedMotion() && canvas.current) {
      gsap.fromTo(canvas.current, { autoAlpha: 0, scale: 0.96, rotateX: 8 }, { autoAlpha: 1, scale: 1, rotateX: 0, duration: 0.9, ease: 'expo.out' });
    }
  };

  // Pointer drag to pan when zoomed.
  const onDown = (e) => {
    if (zoom === 1) return;
    drag.current = { x: e.clientX, y: e.clientY, start: pan };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e) => {
    if (!drag.current) return;
    const { x, y, start } = drag.current;
    setPan(clampPan({ x: start.x + (e.clientX - x), y: start.y + (e.clientY - y) }, zoom));
  };
  const onUp = () => (drag.current = null);

  // Ctrl/⌘ + wheel zoom (plain wheel keeps scrolling the page).
  useEffect(() => {
    const el = viewer.current;
    const onWheel = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      setZoom((z) => {
        const nz = Math.max(MIN, Math.min(MAX, z - e.deltaY * 0.01));
        setPan((p) => clampPan(p, nz));
        return nz;
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [clampPan]);

  useEffect(() => {
    const onFs = () => setIsFull(document.fullscreenElement === viewer.current);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  const toggleFull = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (viewer.current.requestFullscreen) await viewer.current.requestFullscreen();
      else setIsFull((v) => !v); // iOS Safari fallback: CSS-based fullscreen
    } catch {
      setIsFull((v) => !v);
    }
  };

  const onKey = (e) => {
    if (e.key === '+' || e.key === '=') setZoomTo(zoom + 0.5);
    else if (e.key === '-') setZoomTo(zoom - 0.5);
    else if (e.key === '0') reset();
    else if (e.key === 'Escape' && isFull && !document.fullscreenElement) setIsFull(false);
    else if (zoom > 1 && e.key.startsWith('Arrow')) {
      e.preventDefault();
      const d = 40;
      const delta = { ArrowLeft: [d, 0], ArrowRight: [-d, 0], ArrowUp: [0, d], ArrowDown: [0, -d] }[e.key];
      setPan((p) => clampPan({ x: p.x + delta[0], y: p.y + delta[1] }, zoom));
    }
  };

  return (
    <section id="floor-plans" className="section plans" aria-labelledby="plans-title">
      <div className="container plans__grid">
        <div className="plans__side">
          <SectionHeading index="04" eyebrow="Floor Plans" id="plans-title" lines={['Space designed', 'around you.']} />

          <div className="plans__list" role="radiogroup" aria-label="Choose a plan" data-reveal>
            {['Apartment', 'Tower'].map((g) => (
              <div key={g} className="plans__group">
                <p className="kicker">{g === 'Apartment' ? 'Apartment plans' : 'Typical tower floor'}</p>
                {PLANS.filter((p) => p.group === g).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={p.id === planId}
                    className={`plan-option ${p.id === planId ? 'is-active' : ''}`}
                    onClick={() => choose(p.id)}
                  >
                    <span className="plan-option__label">{p.label}</span>
                    <span className="plan-option__meta">{p.meta}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="plans__spaces" data-reveal>
            <p className="kicker">Brochure plans include</p>
            <ul>
              {FLOOR_PLAN_SPACES.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="plans__viewer-wrap" data-reveal>
          <div
            ref={viewer}
            className={`plans__viewer ${isFull ? 'is-full' : ''} ${zoom > 1 ? 'is-zoomed' : ''}`}
            tabIndex={0}
            role="group"
            aria-label={`${plan.label} plan viewer. Use plus and minus to zoom, arrow keys to pan.`}
            onKeyDown={onKey}
          >
            <div className="plans__toolbar">
              <span className="plans__badge">2D · Conceptual</span>
              <div className="plans__tools">
                <button type="button" className="icon-btn" onClick={() => setZoomTo(zoom - 0.5)} disabled={zoom <= MIN} aria-label="Zoom out">
                  <ZoomOut size={16} />
                </button>
                <span className="plans__zoom" aria-live="polite">
                  {Math.round(zoom * 100)}%
                </span>
                <button type="button" className="icon-btn" onClick={() => setZoomTo(zoom + 0.5)} disabled={zoom >= MAX} aria-label="Zoom in">
                  <ZoomIn size={16} />
                </button>
                <button type="button" className="icon-btn" onClick={reset} aria-label="Reset view">
                  <LocateFixed size={16} />
                </button>
                <button type="button" className="icon-btn" onClick={toggleFull} aria-label={isFull ? 'Exit fullscreen' : 'View fullscreen'}>
                  {isFull ? <Minimize size={16} /> : <Maximize size={16} />}
                </button>
              </div>
            </div>

            <div className="plans__canvas" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
              <div ref={canvas} className="plans__stage">
                <div
                  className="plans__transform"
                  style={{ transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})` }}
                >
                  {plan.render()}
                </div>
              </div>
            </div>

            <div className="plans__caption">
              <strong>{plan.label}</strong>
              <span>{plan.meta}</span>
            </div>
          </div>
          <p className="fineprint">
            Plans shown are conceptual diagrams prepared for this website. Room positions are indicative only — no dimensions or
            layouts should be relied upon. Refer to the approved brochure and sanctioned drawings.
          </p>
        </div>
      </div>
    </section>
  );
}
