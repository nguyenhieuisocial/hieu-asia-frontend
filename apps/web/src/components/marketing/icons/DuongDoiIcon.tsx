import * as React from 'react';

/**
 * Đường đời (life path) — Wave 62.09 custom symbol per vault 138 spec.
 * Linework style, viewBox 48×48, stroke 1.2px currentColor.
 * Theme-aware: inherits text-primary (Ochre day / Gold-soft night) from parent.
 *
 * Composition: single curving path from bottom-left to top-right (cubic
 * bezier — life's non-linear arc), with 3 small "checkpoint" circles along
 * the way (đầu / giữa / cuối — phases of the journey).
 *
 * Use: replaces Lucide on branded discipline-card surfaces (BentoLens, /about).
 */
export function DuongDoiIcon({ className }: { className?: string }) {
  // Curve: M 6,42  C 14,38  18,12  42,6
  // Checkpoints lie roughly on the curve:
  //   t≈0.25 → (~14, ~30)
  //   t≈0.55 → (~24, ~20)
  //   t≈0.85 → (~36, ~10)
  const checkpoints = [
    { x: 14, y: 30 },
    { x: 24, y: 20 },
    { x: 36, y: 10 },
  ];

  return (
    <svg
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Đường đời"
      className={className}
    >
      {/* Life path curve — single stroke */}
      <path
        d="M 6 42 C 14 38, 18 12, 42 6"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      {/* 3 checkpoint circles */}
      {checkpoints.map((c, i) => (
        <circle
          key={i}
          cx={c.x}
          cy={c.y}
          r="1.8"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
        />
      ))}
    </svg>
  );
}
