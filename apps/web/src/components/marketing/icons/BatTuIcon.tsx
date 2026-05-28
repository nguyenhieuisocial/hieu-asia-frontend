import * as React from 'react';

/**
 * Bát Tự 4 trụ · 8 chữ — Wave 62.09 custom symbol per vault 138 spec.
 * Linework style, viewBox 48×48, stroke 1.2px currentColor.
 * Theme-aware: inherits text-primary (Ochre day / Gold-soft night) from parent.
 *
 * Composition: 4 vertical "trụ" (Niên / Nguyệt / Nhật / Thời) as columns,
 * each with a horizontal divider midway through (top half = thiên can,
 * bottom half = địa chi schematic). 8 small ink dots above hover-line
 * represent the 8 chữ — bát = eight, tự = characters.
 *
 * Use: replaces Lucide on branded discipline-card surfaces (BentoLens, /about).
 */
export function BatTuIcon({ className }: { className?: string }) {
  // 4 pillars at x = 9, 19, 29, 39. Pillar height 8 → 38 (y).
  const pillarsX = [9, 19, 29, 39];
  // 8 dots above pillars: 2 dots per pillar slot, x clustered around each pillar.
  const dots = pillarsX.flatMap((x) => [
    { x: x - 2.5, y: 5.5 },
    { x: x + 2.5, y: 5.5 },
  ]);

  return (
    <svg
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Bát Tự bốn trụ tám chữ"
      className={className}
    >
      {/* 8 chữ — small dots above */}
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="0.9" fill="currentColor" />
      ))}
      {/* 4 trụ — vertical columns */}
      {pillarsX.map((x, i) => (
        <line
          key={`p-${i}`}
          x1={x}
          y1="10"
          x2={x}
          y2="42"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
        />
      ))}
      {/* Horizontal divider midway through each pillar — can / chi split */}
      {pillarsX.map((x, i) => (
        <line
          key={`d-${i}`}
          x1={x - 3}
          y1="26"
          x2={x + 3}
          y2="26"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
        />
      ))}
    </svg>
  );
}
