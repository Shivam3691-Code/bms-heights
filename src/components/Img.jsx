import { useState } from 'react';
import { ASSETS, imageSources } from '../config/assets.js';

/**
 * Responsive, lazy image bound to the central asset registry.
 * The wrapper reserves space via aspect-ratio (no layout shift) and shows a soft
 * ivory placeholder until the image decodes.
 */
export default function Img({
  name,
  ratio,
  sizes = '100vw',
  priority = false,
  className = '',
  imgClassName = '',
  tag = true,
  width = 1600,
  style,
  innerRef,
}) {
  const asset = ASSETS[name];
  const [loaded, setLoaded] = useState(false);
  if (!asset) return <div className={`img-frame img-missing ${className}`} style={style} aria-hidden="true" />;
  const { src, srcSet } = imageSources(asset, { width });

  return (
    <div
      className={`img-frame ${loaded ? 'is-loaded' : ''} ${className}`}
      style={{ ...(ratio ? { aspectRatio: String(ratio) } : null), ...style }}
    >
      <img
        ref={innerRef}
        className={imgClassName}
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={asset.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchpriority={priority ? 'high' : undefined}
        onLoad={() => setLoaded(true)}
        draggable="false"
      />
      {tag && asset.illustrative && <span className="img-tag">Illustrative imagery</span>}
    </div>
  );
}
