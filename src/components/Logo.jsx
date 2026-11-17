// Text wordmark. This is a typographic treatment, not the official BMS Heights logo —
// drop the official file into /public/assets/logo and swap it in here when available.
export default function Logo({ inverse = false, compact = false }) {
  return (
    <span className={`wordmark ${inverse ? 'wordmark--inverse' : ''} ${compact ? 'wordmark--compact' : ''}`}>
      <span className="wordmark__name">
        BMS<span className="wordmark__rule" aria-hidden="true" />Heights
      </span>
      {!compact && <span className="wordmark__by">by SKD Developers</span>}
    </span>
  );
}
