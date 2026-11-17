import {
  Trees,
  Flower2,
  Landmark,
  Baby,
  Armchair,
  ShieldCheck,
  Car,
  Maximize2,
  Building2,
  Store,
  Gem,
  Building,
  MapPin,
} from 'lucide-react';
import Img from '../components/Img.jsx';
import { SectionHeading, Tilt } from '../components/Ui.jsx';
import { AMENITIES } from '../config/project.js';

const ICONS = { Trees, Flower2, Landmark, Baby, Armchair, ShieldCheck, Car, Maximize2, Building2, Store, Gem, Building, MapPin };

export default function Amenities() {
  const featured = AMENITIES.filter((a) => a.feature);
  const rest = AMENITIES.filter((a) => !a.feature);

  return (
    <section id="amenities" className="section amenities" aria-labelledby="amen-title">
      <div className="container">
        <div className="amenities__head">
          <SectionHeading index="05" eyebrow="Lifestyle & Amenities" id="amen-title" lines={['Everyday living,', 'beautifully elevated.']} />
          <p className="lead amenities__lead" data-reveal>
            Thirteen considered features from the project brochure — from shared green spaces and a terrace garden to
            three-tier, round-the-clock security.
          </p>
        </div>

        <div className="amenities__featured">
          {featured.map((a, i) => {
            const Icon = ICONS[a.icon];
            return (
              <Tilt key={a.title} as="article" className={`feature-card feature-card--${i}`} data-clip>
                <div className="feature-card__media" data-parallax={i ? '6' : '-6'}>
                  <Img name={a.image} ratio={i ? 4 / 5 : 16 / 11} sizes="(max-width: 900px) 100vw, 50vw" width={1400} />
                </div>
                <div className="feature-card__body">
                  <Icon size={22} aria-hidden="true" />
                  <h3>{a.title}</h3>
                </div>
              </Tilt>
            );
          })}
        </div>

        <ul className="amenity-grid" data-reveal-group>
          {rest.map((a, i) => {
            const Icon = ICONS[a.icon];
            return (
              <li key={a.title} className="amenity" data-reveal>
                <span className="amenity__num">{String(i + 3).padStart(2, '0')}</span>
                <Icon className="amenity__icon" size={26} strokeWidth={1.3} aria-hidden="true" />
                <h3 className="amenity__title">{a.title}</h3>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
