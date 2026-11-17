import Img from '../components/Img.jsx';
import { SectionHeading, Counter, Tilt } from '../components/Ui.jsx';
import { DEVELOPER_STATS } from '../config/project.js';

export default function Intro() {
  return (
    <section id="about" className="section intro" aria-labelledby="about-title">
      <div className="container intro__grid">
        <div className="intro__visual">
          <Tilt className="intro__frame" max={5}>
            <div className="intro__img-wrap" data-parallax="-8">
              <Img name="facadeWarm" ratio={4 / 5} sizes="(max-width: 900px) 100vw, 45vw" width={1200} />
            </div>
          </Tilt>
          <div className="intro__inset" data-parallax="10">
            <Img name="livingCalm" ratio={1} sizes="(max-width: 900px) 40vw, 18vw" width={800} tag={false} />
          </div>
          <span className="intro__vertical" aria-hidden="true">
            Greater Noida — Uttar Pradesh
          </span>
        </div>

        <div className="intro__copy">
          <SectionHeading index="01" eyebrow="The Project" id="about-title" lines={['More than a home.', 'A better way of living.']} />
          <p className="lead" data-reveal>
            BMS Heights is a residential development by SKD Developers, offering Studio, 1 BHK and 2 BHK apartment options in
            Greater Noida.
          </p>
          <div className="intro__dev" data-reveal>
            <h3 className="kicker">The Developer</h3>
            <p>
              SKD Developers brings over a decade of real estate industry experience and focuses on making property investment
              accessible through tailored property solutions.
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        <dl className="stats" data-reveal-group>
          {DEVELOPER_STATS.map((s) => (
            <div className="stat" key={s.label} data-reveal>
              <dt className="stat__label">{s.label}</dt>
              <dd className="stat__value">
                <Counter value={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
        <p className="fineprint" data-reveal>
          Figures are developer-level claims by SKD Developers across their portfolio and are not specific to BMS Heights.
        </p>
      </div>
    </section>
  );
}
