import * as React from 'react';

/**
 * Đại vận 10 năm — Wave 62.09 custom symbol per vault 138 spec.
 * Linework style, viewBox 48×48, stroke 1.2px currentColor.
 * Theme-aware: inherits text-primary (Ochre day / Gold-soft night) from parent.
 *
 * Composition: horizontal timeline arrow with 10 tick marks (uneven heights —
 * some prominent for đại vận decade boundaries, smaller for năm). Arrow
 * pointing right = direction of life's unfolding.
 *
 * Use: replaces Lucide on branded discipline-card surfaces (BentoLens, /about).
 */
export function DaiVanIcon({ className }: { className?: string }) {
  // Timeline runs x=6 → x=40, y=28. Arrow head extends to x=44.
  // 10 ticks evenly spaced; prominent at indices 0, 3, 6, 9 (decade markers).
  const ticks = Array.from({ length: 10 }, (_, i) => {
    const x = 6 + i * (34 / 9);
    const prominent = i === 0 || i === 3 || i === 6 || i === 9;
    return { x, prominent };
  });

  return (
    <svg
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Đại vận mười năm"
      className={className}
    >
      {/* Timeline baseline */}
      <line
        x1="4"
        y1="28"
        x2="42"
        y2="28"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      {/* Arrow head — right */}
      <polyline
        points="38,24 42,28 38,32"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* 10 ticks — uneven height */}
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x}
          y1={t.prominent ? 18 : 23}
          x2={t.x}
          y2={28}
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
        />
      ))}
    </svg>
  );
}
