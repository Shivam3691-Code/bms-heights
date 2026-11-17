// Central image registry. Swap any `src` for a local file (e.g. '/assets/architecture/facade.jpg')
// once official BMS Heights imagery is available — every component reads from here.
//
// `illustrative: true` renders a small "Illustrative imagery" tag on the image.
// All current images are licensed stock photography (Unsplash) used as concept visuals —
// they are NOT photographs of BMS Heights.

const unsplash = (id) => `https://images.unsplash.com/photo-${id}`;

export const ASSETS = {
  // Architecture
  heroFacade: {
    src: unsplash('1545324418-cc1a3fa10c00'),
    alt: 'Illustrative modern low-rise residential facade with balconies against a clear sky',
    folder: 'architecture',
    illustrative: true,
  },
  facadeWarm: {
    src: unsplash('1574362848149-11496d93a7c7'),
    alt: 'Illustrative low-rise apartment block with balconies and a green lawn at golden hour',
    folder: 'architecture',
    illustrative: true,
  },
  facadeBalconies: {
    src: unsplash('1460317442991-0ec209397118'),
    alt: 'Illustrative close view of a residential elevation with stacked balconies',
    folder: 'architecture',
    illustrative: true,
  },
  facadeModern: {
    src: unsplash('1600047509807-ba8f99d2cdde'),
    alt: 'Illustrative contemporary elevation with timber cladding and landscaped lawn',
    folder: 'architecture',
    illustrative: true,
  },
  facadeDusk: {
    src: unsplash('1600585154526-990dced4db0d'),
    alt: 'Illustrative dark architectural facade with warm lighting at dusk',
    folder: 'architecture',
    illustrative: true,
  },
  facadeEvening: {
    src: unsplash('1600585154340-be6161a56a0c'),
    alt: 'Illustrative residence glowing with interior light at twilight, framed by a tree',
    folder: 'architecture',
    illustrative: true,
  },

  // Interiors
  livingBright: {
    src: unsplash('1600607687939-ce8a6c25118c'),
    alt: 'Illustrative bright living room with white sofa and timber feature wall',
    folder: 'interiors',
    illustrative: true,
  },
  livingWarm: {
    src: unsplash('1600210492486-724fe5c67fb0'),
    alt: 'Illustrative warm living room with leather seating and gallery wall',
    folder: 'interiors',
    illustrative: true,
  },
  livingCompact: {
    src: unsplash('1493809842364-78817add7ffb'),
    alt: 'Illustrative compact living space with herringbone floor and large window',
    folder: 'interiors',
    illustrative: true,
  },
  livingCalm: {
    src: unsplash('1618221195710-dd6b41faaea6'),
    alt: 'Illustrative calm living room in neutral tones with clerestory window',
    folder: 'interiors',
    illustrative: true,
  },
  bedroom: {
    src: unsplash('1616594039964-ae9021a400a0'),
    alt: 'Illustrative bedroom with upholstered bed, soft lighting and full-height curtains',
    folder: 'interiors',
    illustrative: true,
  },
  bedroomLight: {
    src: unsplash('1595526114035-0d45ed16cfbf'),
    alt: 'Illustrative light-filled bedroom with neutral linen',
    folder: 'interiors',
    illustrative: true,
  },
  kitchen: {
    src: unsplash('1556911220-bff31c812dba'),
    alt: 'Illustrative modular kitchen with stone counter and white cabinetry',
    folder: 'interiors',
    illustrative: true,
  },
  kitchenSink: {
    src: unsplash('1565538810643-b5bdb714032a'),
    alt: 'Illustrative kitchen counter with brass tap and sink',
    folder: 'interiors',
    illustrative: true,
  },
  bathroom: {
    src: unsplash('1584622650111-993a426fbf0a'),
    alt: 'Illustrative bathroom with glass shower, vanity and matt tiles',
    folder: 'interiors',
    illustrative: true,
  },
  bathroomDark: {
    src: unsplash('1600566752355-35792bedcfea'),
    alt: 'Illustrative dark-toned bathroom with freestanding fittings',
    folder: 'interiors',
    illustrative: true,
  },
  lobby: {
    src: unsplash('1497366216548-37526070297c'),
    alt: 'Illustrative clean, well-lit residential corridor',
    folder: 'interiors',
    illustrative: true,
  },

  // Amenities / lifestyle
  garden: {
    src: unsplash('1585320806297-9794b3e4eeae'),
    alt: 'Illustrative landscaped garden path lined with flowering shrubs',
    folder: 'amenities',
    illustrative: true,
  },
  terrace: {
    src: unsplash('1519710164239-da123dc03ef4'),
    alt: 'Illustrative airy sitting nook with plants and natural light',
    folder: 'amenities',
    illustrative: true,
  },
};

const WIDTHS = [480, 800, 1200, 1600, 2400];

/** Build src/srcSet for an asset. Remote (Unsplash) assets get on-the-fly resizing + modern formats. */
export function imageSources(asset, { width = 1600, ratio } = {}) {
  if (!asset) return {};
  const remote = asset.src.startsWith('http');
  if (!remote) return { src: asset.src };
  const build = (w) => {
    const h = ratio ? `&h=${Math.round(w / ratio)}` : '';
    return `${asset.src}?auto=format&fit=crop&w=${w}${h}&q=70`;
  };
  return {
    src: build(width),
    srcSet: WIDTHS.map((w) => `${build(w)} ${w}w`).join(', '),
  };
}
