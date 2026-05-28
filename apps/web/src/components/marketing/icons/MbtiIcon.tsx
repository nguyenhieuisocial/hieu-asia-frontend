import * as React from 'react';

/**
 * MBTI 16 kiểu · 4 chiều — Wave 62.09 custom symbol per vault 138 spec.
 * Linework style, viewBox 48×48, stroke 1.2px currentColor.
 * Theme-aware: inherits text-primary (Ochre day / Gold-soft night) from parent.
 *
 * Composition: 4×4 grid of small dots (16 dots = 16 personality types).
 * 2 dots filled (larger radius) representing "your type" placement —
 * the moment a user's 4-axis answer lands them at one cell.
 *
 * Use: replaces Lucide on branded discipline-card surfaces (BentoLens, /about).
 */
export function MbtiIcon({ className }: { className?: string }) {
  // 4×4 grid centred in viewBox. Cell pitch 8px, starting x=12, y=12 → x=36, y=36.
  // Highlighted positions: (col=2, row=1) and (col=1, row=2).
  const dots: Array<{ x: number; y: number; highlighted: boolean }> = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const highlighted = (col === 2 && row === 1) || (col === 1 && row === 2);
      dots.push({
        x: 12 + col * 8,
        y: 12 + row * 8,
        highlighted,
      });
    }
  }

  return (
    <svg
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="MBTI mười sáu kiểu bốn chiều"
      className={className}
    >
      {dots.map((d, i) =>
        d.highlighted ? (
          <circle key={i} cx={d.x} cy={d.y} r="1.8" fill="currentColor" />
        ) : (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r="0.9"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="none"
          />
        ),
      )}
    </svg>
  );
}
