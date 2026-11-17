// Single source of truth for BMS Heights project facts.
// Everything here comes from the supplied project brief. Fields left empty are
// intentionally unknown — the UI shows "Details on request" instead of inventing values.

export const PROJECT = {
  name: 'BMS Heights',
  developer: 'SKD Developers',
  tagline: 'A New Perspective of Luxury Living',
  typologies: ['Studio', '1 BHK', '2 BHK'],
  city: 'Greater Noida',
  address: {
    lines: ['Tilapta Goal Chakkar, DSC Road,', 'Near Paramount Golf Foreste,', 'Greater Noida, Uttar Pradesh, India.'],
    // Used as a text query for Google Maps — no coordinates are assumed.
    mapsQuery: 'Tilapta Gol Chakkar, DSC Road, Greater Noida, Uttar Pradesh, India',
  },
  contact: {
    email: 'contact@skdeveloper.in',
    website: 'skdeveloper.in',
    websiteUrl: 'https://skdeveloper.in',
    phone: '', // Not supplied — add the official sales number here.
    whatsapp: '', // Not supplied — digits only with country code, e.g. 91XXXXXXXXXX.
  },
  // Set this to a real endpoint (e.g. https://api.example.com/enquiries) to enable live submission.
  enquiryEndpoint: '',
  brochureUrl: '', // Not supplied — add a PDF path in /public/assets to enable the download button.
  social: [
    { label: 'Instagram', href: '' },
    { label: 'Facebook', href: '' },
    { label: 'YouTube', href: '' },
    { label: 'LinkedIn', href: '' },
  ],
};

export const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  PROJECT.address.mapsQuery,
)}`;

// Developer-level claims (SKD Developers), not BMS Heights achievements.
export const DEVELOPER_STATS = [
  { value: 50, suffix: '+', label: 'Projects delivered in Delhi NCR' },
  { value: 15000, suffix: '+', label: 'Units delivered' },
  { value: 105000, suffix: '+', label: 'Happy customers' },
];

export const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'residences', label: 'Residences' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'location', label: 'Location' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'contact', label: 'Contact' },
];

// Residential collection. `area` is null where the brief gives no figure.
export const RESIDENCES = [
  {
    id: 'studio',
    label: 'Studio',
    title: 'Studio Apartments',
    summary: 'A compact, efficient home for individuals and first-time buyers — one open, light-filled space.',
    variants: [{ id: 'studio', name: 'Studio Apartment', area: null }],
    image: 'livingCompact',
  },
  {
    id: '1bhk',
    label: '1 BHK',
    title: '1 BHK Apartments',
    summary: 'A private bedroom with a separate living area — balanced proportions for couples and young families.',
    variants: [{ id: '1bhk', name: '1 BHK Apartment', area: null }],
    image: 'livingWarm',
  },
  {
    id: '2bhk',
    label: '2 BHK',
    title: '2 BHK Apartments',
    summary: 'Two bedrooms, living and dining, kitchen, two toilets, balconies and a utility / OTS space.',
    variants: [
      { id: '2bhk-t1', name: '2 BHK Type 01', area: 1120, plan: 'type1' },
      { id: '2bhk-t2', name: '2 BHK Type 02', area: 1090, plan: 'type2' },
    ],
    image: 'livingBright',
  },
];

export const FLOOR_PLAN_SPACES = [
  'Bedrooms',
  'Living & dining',
  'Kitchen',
  'Toilets',
  'Balconies',
  'Utility / OTS',
  'Cabinets & circulation',
];

export const TOWER_PLANS = [
  { id: 'tower-a', label: 'Tower A', units: ['UN-01', 'UN-02', 'UN-03', 'UN-04', 'UN-05', 'UN-06'] },
  { id: 'tower-bcde', label: 'Towers B, C, D, E', units: ['UN-01', 'UN-02', 'UN-03', 'UN-04'] },
];

export const AMENITIES = [
  { title: 'Green Area', icon: 'Trees', image: 'garden', feature: true },
  { title: 'Common Terrace Garden', icon: 'Flower2', image: 'terrace', feature: true },
  { title: 'Temple', icon: 'Landmark' },
  { title: "Children's Rides", icon: 'Baby' },
  { title: 'Senior Citizen Sitting Area', icon: 'Armchair' },
  { title: '3-Tier 24×7 Security', icon: 'ShieldCheck' },
  { title: 'Stilt Parking / Banquet', icon: 'Car' },
  { title: 'Spacious Floor with Vast Open Area', icon: 'Maximize2' },
  { title: 'Low-Height, Low-Density Residences', icon: 'Building2' },
  { title: 'Hi-Street Commercial', icon: 'Store' },
  { title: 'Luxury Finishes', icon: 'Gem' },
  { title: 'Premium Elevation', icon: 'Building' },
  { title: 'Privileged Location', icon: 'MapPin' },
];

export const FINISHES = [
  {
    id: 'bedroom',
    title: 'Bedroom',
    image: 'bedroom',
    items: ['High-class vitrified tiles', 'Designer sliding windows', 'Designer wooden doors', 'Modular switches'],
  },
  {
    id: 'kitchen',
    title: 'Kitchen',
    image: 'kitchen',
    items: ['Polished Indian granite', 'Wooden modular kitchen work', 'PVC or acrylic mica finish', 'Double sink'],
  },
  {
    id: 'bathroom',
    title: 'Bathroom',
    image: 'bathroom',
    items: [
      'Branded bathroom fittings',
      'Matt-finished / anti-skid tiles',
      'Glazed / matt-finished wall tiles',
      'Branded WC',
      'Branded wash basin',
    ],
  },
  { id: 'lift', title: 'Lift', image: 'lobby', items: ['Branded lift'] },
];

// Brochure-listed landmarks, grouped for display. No distances or travel times are implied.
export const LANDMARKS = [
  { name: 'Noida Sector 52 Metro Station', group: 'Transit' },
  { name: '4 Murti Chowk', group: 'Junctions' },
  { name: 'Ek Murti Chowk', group: 'Junctions' },
  { name: 'Gaur City Mall', group: 'Retail & leisure' },
  { name: 'Galaxy Blue Sapphire Mall', group: 'Retail & leisure' },
  { name: 'French Apartment', group: 'Neighbourhood' },
  { name: 'ATS Homekraft', group: 'Neighbourhood' },
  { name: 'CSC County', group: 'Neighbourhood' },
  { name: 'Godrej Majesty', group: 'Neighbourhood' },
  { name: 'Yatharth Super Speciality Hospital', group: 'Healthcare & education' },
  { name: 'Sparsh Global School', group: 'Healthcare & education' },
  { name: 'Eco Tech III', group: 'Business' },
  { name: 'The Wedding Dot', group: 'Retail & leisure' },
  { name: 'Tilapta Gol Chakkar', group: 'Junctions' },
  { name: 'Concor Complex', group: 'Business' },
  { name: 'Crown Plaza Greater Noida', group: 'Retail & leisure' },
  { name: 'Surajpur', group: 'Neighbourhood' },
  { name: 'Ecotech II', group: 'Business' },
  { name: 'ZETA 1', group: 'Neighbourhood' },
  { name: 'Yamuna Express Way', group: 'Transit' },
  { name: 'Alpha 1 Metro', group: 'Transit' },
  { name: 'Delta 1 Metro', group: 'Transit' },
  { name: 'GNIDA Metro', group: 'Transit' },
];

