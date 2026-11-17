// CONCEPTUAL plan diagrams. These are schematic zoning illustrations generated in code,
// not approved architectural drawings. They carry no dimensions, scale or exact layout.
// Replace with official plan artwork via /public/assets/floor-plans when available.
import { useId } from 'react';

const ZONES = {
  type1: [
    { x: 40, y: 40, w: 240, h: 200, label: 'Bedroom 1', kind: 'bed' },
    { x: 280, y: 40, w: 120, h: 100, label: 'Toilet', kind: 'wet' },
    { x: 400, y: 40, w: 260, h: 200, label: 'Bedroom 2', kind: 'bed' },
    { x: 280, y: 140, w: 120, h: 100, label: 'Circulation', kind: 'circ' },
    { x: 40, y: 240, w: 400, h: 240, label: 'Living & Dining', kind: 'live' },
    { x: 440, y: 240, w: 220, h: 150, label: 'Kitchen', kind: 'kit' },
    { x: 440, y: 390, w: 110, h: 90, label: 'Toilet', kind: 'wet' },
    { x: 550, y: 390, w: 110, h: 90, label: 'Utility / OTS', kind: 'util' },
    { x: 40, y: 480, w: 400, h: 70, label: 'Balcony', kind: 'balc' },
    { x: 660, y: 40, w: 60, h: 200, label: 'Balcony', kind: 'balc', vertical: true },
  ],
  type2: [
    { x: 40, y: 40, w: 300, h: 230, label: 'Living & Dining', kind: 'live' },
    { x: 340, y: 40, w: 160, h: 140, label: 'Kitchen', kind: 'kit' },
    { x: 500, y: 40, w: 160, h: 140, label: 'Bedroom 2', kind: 'bed' },
    { x: 340, y: 180, w: 90, h: 90, label: 'Utility / OTS', kind: 'util' },
    { x: 430, y: 180, w: 230, h: 90, label: 'Circulation', kind: 'circ' },
    { x: 40, y: 270, w: 260, h: 210, label: 'Bedroom 1', kind: 'bed' },
    { x: 300, y: 270, w: 120, h: 105, label: 'Toilet', kind: 'wet' },
    { x: 300, y: 375, w: 120, h: 105, label: 'Toilet', kind: 'wet' },
    { x: 420, y: 270, w: 240, h: 210, label: 'Cabinets & Dressing', kind: 'circ' },
    { x: 40, y: 480, w: 620, h: 70, label: 'Balcony', kind: 'balc' },
  ],
};

export function UnitPlan({ type = 'type1', title, highlight }) {
  const zones = ZONES[type] || ZONES.type1;
  const uid = useId().replace(/:/g, '');
  return (
    <svg className="plan-svg" viewBox="0 0 760 620" role="img" aria-labelledby={`plan-${uid}-t plan-${uid}-d`}>
      <title id={`plan-${uid}-t`}>{title} — conceptual zoning diagram</title>
      <desc id={`plan-${uid}-d`}>
        Schematic illustration of the spaces in this apartment type: bedrooms, living and dining, kitchen, toilets,
        balconies, utility / OTS and circulation. Not to scale and not an approved architectural plan.
      </desc>
      <defs>
        <pattern id={`hatch-${uid}`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" className="plan-hatch" />
        </pattern>
      </defs>
      <rect x="20" y="20" width="720" height="550" className="plan-outline" />
      {zones.map((z, i) => (
        <g key={i} className={`plan-zone plan-zone--${z.kind} ${highlight === z.kind ? 'is-hl' : ''}`}>
          <rect x={z.x} y={z.y} width={z.w} height={z.h} />
          {z.kind === 'balc' && <rect x={z.x} y={z.y} width={z.w} height={z.h} fill={`url(#hatch-${uid})`} />}
          <text
            x={z.x + z.w / 2}
            y={z.y + z.h / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            transform={z.vertical ? `rotate(-90 ${z.x + z.w / 2} ${z.y + z.h / 2})` : undefined}
          >
            {z.label}
          </text>
        </g>
      ))}
      <text x="380" y="602" textAnchor="middle" className="plan-note">
        CONCEPTUAL ZONING — NOT TO SCALE — NOT AN APPROVED PLAN
      </text>
    </svg>
  );
}

export function TowerPlan({ units, label }) {
  const six = units.length === 6;
  const W = 760;
  const H = 520;
  const core = { x: W / 2 - 70, y: H / 2 - 60, w: 140, h: 120 };
  const cols = six ? 3 : 2;
  const uw = six ? 200 : 260;
  const uh = 150;
  const gapX = six ? 30 : 160;
  const startX = (W - (cols * uw + (cols - 1) * gapX)) / 2;
  const rows = [40, H - 40 - uh];
  const cells = units.map((u, i) => {
    const r = Math.floor(i / cols);
    const c = i % cols;
    return { u, x: startX + c * (uw + gapX), y: rows[r], w: uw, h: uh };
  });

  return (
    <svg className="plan-svg plan-svg--tower" viewBox={`0 0 ${W} ${H + 40}`} role="img" aria-label={`${label} typical floor — conceptual diagram showing units ${units.join(', ')} around a central core`}>
      <rect x="20" y="20" width={W - 40} height={H - 40} className="plan-outline" />
      <rect x="40" y={H / 2 - 22} width={W - 80} height="44" className="plan-corridor" />
      <rect x={core.x} y={core.y} width={core.w} height={core.h} className="plan-core" />
      <text x={W / 2} y={H / 2 - 8} textAnchor="middle" className="plan-core-label">LIFT</text>
      <text x={W / 2} y={H / 2 + 14} textAnchor="middle" className="plan-core-label">& STAIRS</text>
      {cells.map((c) => (
        <g key={c.u} className="plan-unit">
          <rect x={c.x} y={c.y} width={c.w} height={c.h} />
          <text x={c.x + c.w / 2} y={c.y + c.h / 2} textAnchor="middle" dominantBaseline="middle">
            {c.u}
          </text>
        </g>
      ))}
      <text x={W / 2} y={H + 26} textAnchor="middle" className="plan-note">
        CONCEPTUAL — UNIT COUNT PER BROCHURE · LAYOUT NOT TO SCALE
      </text>
    </svg>
  );
}
