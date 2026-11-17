import { useEffect, useRef, useState } from 'react';
import { Move3d, Pause, Play, RotateCcw, RotateCw } from 'lucide-react';
import Img from '../components/Img.jsx';
import { SectionHeading } from '../components/Ui.jsx';
import { prefersReducedMotion } from '../lib/motion.js';

function MassingStudy() {
  const wrap = useRef(null);
  const canvas = useRef(null);
  const api = useRef(null);
  const [state, setState] = useState('idle'); // idle | loading | ready | error
  const [spinning, setSpinning] = useState(() => !prefersReducedMotion());

  useEffect(() => {
    let disposed = false;
    // Load Three.js only when the block is about to be seen; render only while visible.
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !api.current && state === 'idle') {
          setState('loading');
          try {
            const { createMassingScene } = await import('../components/massingScene.js');
            if (disposed) return;
            api.current = createMassingScene(canvas.current, {
              reducedMotion: prefersReducedMotion(),
              onFirstFrame: () => setState('ready'),
            });
          } catch (err) {
            console.warn('3D massing study unavailable:', err);
            setState('error');
          }
        }
        api.current?.setVisible(entry.isIntersecting);
      },
      { rootMargin: '200px 0px' },
    );
    io.observe(wrap.current);
    return () => {
      disposed = true;
      io.disconnect();
      api.current?.dispose();
      api.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    const next = !spinning;
    setSpinning(next);
    api.current?.setAutoRotate(next);
  };

  return (
    <div className={`massing massing--${state}`} ref={wrap}>
      <div className="massing__copy" data-reveal>
        <p className="eyebrow">
          <Move3d size={14} aria-hidden="true" /> Interactive study
        </p>
        <h3 className="display display--sm">Low-height. Low-density. Open to the sky.</h3>
        <p>
          Drag to orbit an abstract massing study inspired by the project&rsquo;s low-rise, low-density planning — blocks
          arranged around shared green space, with terrace gardens above and stilt level below.
        </p>
        <p className="fineprint">
          Conceptual 3D visualisation for illustration only. Not the approved design, site plan, tower count or floor count of
          BMS Heights.
        </p>
      </div>
      <div className="massing__stage">
        <canvas
          ref={canvas}
          className="massing__canvas"
          aria-label="Interactive conceptual 3D massing model. Drag to rotate."
          role="img"
        />
        {state !== 'ready' && (
          <div className="massing__placeholder" aria-hidden="true">
            {state === 'error' ? 'Interactive model unavailable on this device' : 'Preparing model…'}
          </div>
        )}
        <div className="massing__controls">
          <button type="button" className="icon-btn" onClick={() => api.current?.nudge(1)} aria-label="Rotate left">
            <RotateCcw size={16} />
          </button>
          <button type="button" className="icon-btn" onClick={toggle} aria-label={spinning ? 'Pause rotation' : 'Play rotation'}>
            {spinning ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button type="button" className="icon-btn" onClick={() => api.current?.nudge(-1)} aria-label="Rotate right">
            <RotateCw size={16} />
          </button>
        </div>
        <span className="img-tag">Conceptual 3D study</span>
      </div>
    </div>
  );
}

export default function Architecture() {
  return (
    <section id="architecture" className="section arch" aria-labelledby="arch-title">
      <div className="container">
        <SectionHeading index="02" eyebrow="Architecture" id="arch-title" lines={['Architecture that', 'speaks for itself.']} />
      </div>

      <figure className="arch__wide" data-clip>
        <div className="arch__wide-inner" data-parallax="-12">
          <Img name="facadeModern" sizes="100vw" width={2400} />
        </div>
        <figcaption className="caption container">
          <span className="caption__num">I.</span> Premium elevation — clean planes, warm materials, generous glazing.
        </figcaption>
      </figure>

      <div className="container arch__layer">
        <div className="arch__layer-a" data-clip>
          <div data-parallax="-6">
            <Img name="facadeBalconies" ratio={3 / 4} sizes="(max-width: 900px) 100vw, 40vw" width={1200} />
          </div>
          <p className="caption">
            <span className="caption__num">II.</span> Balconies that draw the outdoors in.
          </p>
        </div>
        <div className="arch__layer-text" data-reveal>
          <p className="pull">
            A spacious floor with vast open area. Low-height residences that let light, air and greenery lead.
          </p>
        </div>
        <div className="arch__layer-b" data-clip>
          <div data-parallax="8">
            <Img name="facadeDusk" ratio={4 / 5} sizes="(max-width: 900px) 100vw, 32vw" width={1000} />
          </div>
          <p className="caption">
            <span className="caption__num">III.</span> Evening light on a premium facade.
          </p>
        </div>
      </div>

      <div className="container">
        <MassingStudy />
      </div>
    </section>
  );
}
