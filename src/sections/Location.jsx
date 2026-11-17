import { useMemo, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { SectionHeading } from '../components/Ui.jsx';
import { LANDMARKS, PROJECT, mapsDirectionsUrl } from '../config/project.js';

const GROUP_ORDER = ['Transit', 'Junctions', 'Retail & leisure', 'Healthcare & education', 'Business', 'Neighbourhood'];

/**
 * Stylised "constellation" map. Landmarks are arranged by category around BMS Heights,
 * deliberately NOT by geography, so no direction or distance is implied.
 */
function Constellation({ groups, hovered, setHovered }) {
  const C = 320;
  const nodes = useMemo(() => {
    const out = [];
    const sector = (Math.PI * 2) / groups.length;
    groups.forEach(([group, items], gi) => {
      const base = gi * sector - Math.PI / 2;
      items.forEach((l, i) => {
        const t = items.length === 1 ? 0.5 : i / (items.length - 1);
        const a = base + sector * (0.15 + t * 0.7);
        const r = i % 2 ? 230 : 180;
        out.push({ ...l, gi, x: C + Math.cos(a) * r, y: C + Math.sin(a) * r, a });
      });
    });
    return out;
  }, [groups]);

  return (
    <svg className="constellation" viewBox="0 0 960 640" role="img" aria-labelledby="map-t map-d">
      <title id="map-t">Stylised landmark map around BMS Heights</title>
      <desc id="map-d">
        Brochure-listed landmarks arranged by category around the project. Positions are illustrative and do not represent
        real direction or distance.
      </desc>
      <g transform="translate(160 0)">
      {[110, 180, 230, 290].map((r) => (
        <circle key={r} cx={C} cy={C} r={r} className="constellation__ring" />
      ))}
      {nodes.map((n) => (
        <line
          key={`l-${n.name}`}
          x1={C}
          y1={C}
          x2={n.x}
          y2={n.y}
          className={`constellation__ray ${hovered === n.name ? 'is-hl' : ''}`}
        />
      ))}
      {nodes.map((n) => {
        const right = Math.cos(n.a) >= 0;
        return (
          <g
            key={n.name}
            className={`constellation__node g-${n.gi} ${hovered === n.name ? 'is-hl' : ''}`}
            onMouseEnter={() => setHovered(n.name)}
            onMouseLeave={() => setHovered(null)}
          >
            <circle cx={n.x} cy={n.y} r={hovered === n.name ? 7 : 4.5} />
            <text x={n.x + (right ? 10 : -10)} y={n.y + 4} textAnchor={right ? 'start' : 'end'}>
              {n.name}
            </text>
          </g>
        );
      })}
      <g className="constellation__home">
        <circle cx={C} cy={C} r="46" className="constellation__pulse" />
        <circle cx={C} cy={C} r="34" />
        <text x={C} y={C - 3} textAnchor="middle">BMS</text>
        <text x={C} y={C + 13} textAnchor="middle">HEIGHTS</text>
      </g>
      </g>
    </svg>
  );
}

export default function Location() {
  const [hovered, setHovered] = useState(null);
  const groups = useMemo(
    () => GROUP_ORDER.map((g) => [g, LANDMARKS.filter((l) => l.group === g)]).filter(([, items]) => items.length),
    [],
  );

  return (
    <section id="location" className="section location" aria-labelledby="loc-title">
      <div className="container">
        <div className="location__head">
          <SectionHeading index="07" eyebrow="Location" id="loc-title" lines={['Connected to', 'what matters.']} />
          <address className="location__address" data-reveal>
            <MapPin size={20} aria-hidden="true" />
            <span>
              <strong>{PROJECT.name}</strong>
              {PROJECT.address.lines.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </span>
          </address>
        </div>

        <div className="location__grid">
          <div className="location__map" data-reveal>
            <Constellation groups={groups} hovered={hovered} setHovered={setHovered} />
            <span className="img-tag">Stylised · not to scale</span>
          </div>

          <div className="location__list" data-reveal>
            {groups.map(([group, items]) => (
              <div key={group} className="landmark-group">
                <h3 className="kicker">{group}</h3>
                <ul>
                  {items.map((l) => (
                    <li
                      key={l.name}
                      className={hovered === l.name ? 'is-hl' : ''}
                      onMouseEnter={() => setHovered(l.name)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      {l.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="fineprint">
              Landmarks as identified on the project location map in the brochure. No distances or travel times are claimed.
            </p>
            <a className="btn btn--dark" href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer">
              <Navigation size={16} aria-hidden="true" /> Get directions on Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
