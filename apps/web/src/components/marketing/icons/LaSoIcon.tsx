import * as React from 'react';

/**
 * Lá số 12 cung + sao chủ — Wave 62.09 custom symbol per vault 138 spec.
 * Linework style, viewBox 48×48, stroke 1.2px currentColor.
 * Theme-aware: inherits text-primary (Ochre day / Gold-soft night) from parent.
 *
 * Composition: outer ring (the natal chart wheel), 12 radial dividers
 * (mệnh / phụ mẫu / phúc đức / điền trạch / quan lộc / nô bộc / thiên di /
 * tật ách / tài bạch / tử tức / phu thê / huynh đệ), small dot at the
 * polestar centre (cung Mệnh axis), 4 cardinal sao dots (one per quadrant)
 * hinting at chính tinh placement.
 *
 * Use: replaces Lucide on branded discipline-card surfaces (BentoLens, /about).
 */
export function LaSoIcon({ className }: { className?: string }) {
  // 12 radial divider endpoints at radius 21 (outer ring r=21), centred at (24,24).
  const radials = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * Math.PI * 2) / 12 - Math.PI / 2;
    return {
      x: 24 + Math.cos(angle) * 21,
      y: 24 + Math.sin(angle) * 21,
    };
  });

  // 4 sao dots — one per cardinal quadrant, at radius 11.
  const sao = [
    { x: 24 + Math.cos(-Math.PI / 4) * 11, y: 24 + Math.sin(-Math.PI / 4) * 11 },
    { x: 24 + Math.cos(Math.PI / 4) * 11, y: 24 + Math.sin(Math.PI / 4) * 11 },
    { x: 24 + Math.cos((3 * Math.PI) / 4) * 11, y: 24 + Math.sin((3 * Math.PI) / 4) * 11 },
    { x: 24 + Math.cos((-3 * Math.PI) / 4) * 11, y: 24 + Math.sin((-3 * Math.PI) / 4) * 11 },
  ];

  return (
    <svg
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Lá số 12 cung"
      className={className}
    >
      <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="1.2" fill="none" />
      {radials.map((p, i) => (
        <line
          key={i}
          x1="24"
          y1="24"
          x2={p.x}
          y2={p.y}
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
        />
      ))}
      <circle cx="24" cy="24" r="1.4" fill="currentColor" />
      {sao.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="0.9" fill="currentColor" />
      ))}
    </svg>
  );
}
