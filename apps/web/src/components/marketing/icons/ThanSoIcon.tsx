import * as React from 'react';

/**
 * Thần số 7 (mạnh) — Wave 62.09 custom symbol per vault 138 spec.
 * Linework style, viewBox 48×48, stroke 1.2px currentColor.
 * Theme-aware: inherits text-primary (Ochre day / Gold-soft night) from parent.
 *
 * Composition: large stylized "7" rendered as two strokes (horizontal cap +
 * descending diagonal). Small dot above the cap. 7 dots arranged in a
 * triangular constellation cluster on the open right side — echoes
 * Pythagorean number archetype + celestial chart motif.
 *
 * Use: replaces Lucide on branded discipline-card surfaces (BentoLens, /about).
 */
export function ThanSoIcon({ className }: { className?: string }) {
  // 7 constellation dots — triangular cluster on right side.
  // Row 1 (top): 1 dot. Row 2: 2 dots. Row 3: 3 dots. Row 4 (bottom): 1 dot.
  const constellation = [
    { x: 36, y: 10 },
    { x: 33, y: 16 },
    { x: 39, y: 16 },
    { x: 30, y: 22 },
    { x: 36, y: 22 },
    { x: 42, y: 22 },
    { x: 36, y: 30 },
  ];

  return (
    <svg
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Thần số bảy"
      className={className}
    >
      {/* Small dot above the 7 cap */}
      <circle cx="12" cy="8" r="0.9" fill="currentColor" />
      {/* Stylized "7" — horizontal cap */}
      <line
        x1="8"
        y1="14"
        x2="22"
        y2="14"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Stylized "7" — descending diagonal */}
      <line
        x1="22"
        y1="14"
        x2="13"
        y2="40"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      {/* 7 constellation dots */}
      {constellation.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="0.9" fill="currentColor" />
      ))}
    </svg>
  );
}
