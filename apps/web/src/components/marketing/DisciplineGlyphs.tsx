/**
 * Wave 60.95.n P2 — Custom 4-discipline monochrome glyphs (vault 130 #20).
 *
 * Replaces generic Lucide icons (Sparkles/Calendar/Hash/Brain) used in
 * BentoLens on home with discipline-specific semantic glyphs:
 *
 *   - TuViGlyph   — 5-point central star + 12 palace dots in a circle.
 *                   Tử Vi (紫微) = Purple Star astrology, 12 palaces around
 *                   the polestar of fate.
 *   - BatTuGlyph  — 4 vertical pillars with 2 small marks each (8 characters
 *                   total). Bát Tự (八字) = Four Pillars of Destiny / 8
 *                   characters: year, month, day, hour × heavenly stem &
 *                   earthly branch.
 *   - ThanSoGlyph — 3×3 sacred-number grid with center node accent.
 *                   Thần Số (Pythagorean numerology) = digits 1–9 mapped to
 *                   life-path archetypes; the center is the soul-urge focus.
 *   - MbtiGlyph   — 2×2 quadrant with one diagonal cell filled. MBTI = 4
 *                   binary axes (E/I, N/S, T/F, J/P) producing 16 types;
 *                   the filled cell signifies the user's quadrant.
 *
 * All glyphs share:
 *   - 24×24 viewBox (Lucide compatible, scales 12 → 48px cleanly)
 *   - currentColor stroke + fill (inherits text-gold / text-cream from parent)
 *   - strokeWidth 1.25 to match existing Lucide call site (BentoLens)
 *   - aria-hidden="true" (decorative — adjacent text labels carry meaning)
 *   - SSR-safe pure-JSX (no client effects, no Motion)
 *
 * Sizing: pass via Tailwind `className="size-9"` like Lucide — width/height
 * inherit from CSS via `width="1em" height="1em"` so size-class wins.
 */

import type { SVGProps } from 'react';

type GlyphProps = Omit<SVGProps<SVGSVGElement>, 'children' | 'viewBox' | 'fill' | 'stroke'>;

function GlyphBase({ children, ...rest }: GlyphProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      width="1em"
      height="1em"
      aria-hidden="true"
      role="presentation"
      {...rest}
    >
      {children}
    </svg>
  );
}

/**
 * Tử Vi — 5-point star centered with 12 small palace dots arranged on a
 * circle (radius ~9). Conceptually: the polestar at the seat of fate
 * surrounded by the 12 palaces (mệnh / huynh đệ / phu thê / …).
 */
export function TuViGlyph(props: GlyphProps) {
  // 12 palace dots on a circle of radius 9 centered at (12,12).
  // Each dot at angle = 30° × i, starting from top (-90°).
  const palaceDots = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const cx = 12 + 9 * Math.cos(angle);
    const cy = 12 + 9 * Math.sin(angle);
    return <circle key={i} cx={cx.toFixed(2)} cy={cy.toFixed(2)} r="0.6" fill="currentColor" />;
  });

  return (
    <GlyphBase {...props}>
      {/* 12 palace dots */}
      {palaceDots}
      {/* Central 5-point star (polestar) — viewBox-relative path centered at (12,12) */}
      <path d="M12 7 L13.2 10.5 L17 10.5 L13.9 12.7 L15.1 16.2 L12 14 L8.9 16.2 L10.1 12.7 L7 10.5 L10.8 10.5 Z" />
    </GlyphBase>
  );
}

/**
 * Bát Tự — 4 vertical pillars (year / month / day / hour) each crowned with
 * 2 small marks (heavenly stem + earthly branch = 2 characters per pillar,
 * 8 total = "Bát Tự"). Slight height variation (taller middle) to read as
 * a balanced column set rather than a barcode.
 */
export function BatTuGlyph(props: GlyphProps) {
  // 4 pillars at x = 5, 9.5, 14, 18.5 (gap 4.5)
  // Heights: year (5-19), month (4-20), day (4-20), hour (5-19) — center taller
  const pillars = [
    { x: 5, top: 5, bottom: 19 },
    { x: 9.5, top: 4, bottom: 20 },
    { x: 14, top: 4, bottom: 20 },
    { x: 18.5, top: 5, bottom: 19 },
  ];
  return (
    <GlyphBase {...props}>
      {pillars.map((p, i) => (
        <g key={i}>
          {/* Pillar */}
          <line x1={p.x} y1={p.top} x2={p.x} y2={p.bottom} />
          {/* 2 character marks above each pillar — heavenly stem (top) + earthly branch (just below) */}
          <circle cx={p.x} cy={p.top - 1.5} r="0.5" fill="currentColor" />
          <circle cx={p.x} cy={p.top - 0.2} r="0.5" fill="currentColor" />
        </g>
      ))}
    </GlyphBase>
  );
}

/**
 * Thần Số — 3×3 Pythagorean grid (digits 1–9 in Lo Shu / Pythagorean
 * numerology layout). Center dot is enlarged to signify the soul-urge /
 * life-path focus. Outer 8 dots represent peripheral life-area numbers.
 */
export function ThanSoGlyph(props: GlyphProps) {
  // 3×3 grid centered around (12,12), spacing 5 units
  const positions: Array<[number, number]> = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      positions.push([7 + col * 5, 7 + row * 5]);
    }
  }
  return (
    <GlyphBase {...props}>
      {/* Outer grid box (subtle frame) */}
      <rect x="5" y="5" width="14" height="14" rx="0.5" />
      {positions.map(([cx, cy], i) => {
        const isCenter = i === 4;
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={isCenter ? 1.2 : 0.7}
            fill="currentColor"
            stroke="none"
          />
        );
      })}
    </GlyphBase>
  );
}

/**
 * MBTI — 2×2 quadrant (4 binary axes: E/I × N/S × T/F × J/P). The
 * top-right cell is filled to suggest the user's specific quadrant; the
 * other 3 cells are outlined. The diagonal fill creates visual asymmetry
 * that reads as "your type" without prescribing which type.
 */
export function MbtiGlyph(props: GlyphProps) {
  return (
    <GlyphBase {...props}>
      {/* Outer frame */}
      <rect x="5" y="5" width="14" height="14" rx="0.5" />
      {/* Center cross dividing into 2×2 */}
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
      {/* Top-right cell filled (the user's quadrant) */}
      <rect x="12.5" y="5.5" width="6" height="6" fill="currentColor" stroke="none" />
    </GlyphBase>
  );
}

/**
 * Convenience map — pass a discipline id and get the glyph component.
 * Useful for dynamic call sites that select glyph by data id.
 */
export const DISCIPLINE_GLYPHS = {
  tuvi: TuViGlyph,
  battu: BatTuGlyph,
  thanso: ThanSoGlyph,
  mbti: MbtiGlyph,
} as const;

export type DisciplineId = keyof typeof DISCIPLINE_GLYPHS;
