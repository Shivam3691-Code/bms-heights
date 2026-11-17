# BMS Heights — website

React + custom CSS + GSAP/ScrollTrigger + Lenis + Three.js (lazy) + Lucide. Bundled with esbuild (no Vite, no Tailwind).

```bash
npm install
npm run dev       # http://localhost:5173 (watch + serve)
npm run build     # production build → dist/
npm run preview   # serve dist/ at http://localhost:4173
```

Deploy by uploading `dist/` to any static host.

## Where to change things

| What | File |
| --- | --- |
| Project facts, contact, phone/WhatsApp, enquiry endpoint, brochure URL, landmarks | `src/config/project.js` |
| Every image (swap stock for official renders) | `src/config/assets.js` + `public/assets/*` |
| Text wordmark (replace with official logo) | `src/components/Logo.jsx` |
| Conceptual floor-plan diagrams | `src/components/PlanDiagrams.jsx` |
| Design tokens (colours, type, spacing) | `src/styles/base.css` |

## Placeholders still to fill
- **Phone & WhatsApp** — `PROJECT.contact.phone` / `whatsapp` are empty; the UI shows "to be announced".
- **Enquiry backend** — set `PROJECT.enquiryEndpoint`; the form POSTs JSON. Until then it validates and offers a pre-filled email, and says plainly that nothing was sent.
- **Brochure PDF** — set `PROJECT.brochureUrl`.
- **Studio / 1 BHK areas** — not supplied; shown as "Area details on request".
- **Social links & Privacy Policy** — placeholders.
- **Map pin** — the directions link uses the address as a text search. Confirm the pin and switch to exact coordinates if preferred.

## Honesty notes
- All photography is Unsplash stock, labelled "Illustrative imagery". None of it shows BMS Heights.
- Floor plans and the 3D massing model are conceptual and labelled that way. They have no dimensions.
- Developer statistics are labelled as SKD Developers portfolio claims.
- Landmarks are shown by category. No distances or travel times are given.
