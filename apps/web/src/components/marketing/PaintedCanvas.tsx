import type { ReactNode } from 'react';

/**
 * Wave 60.66.P2 — PaintedCanvas (Option E "Editorial Live" atmosphere layer).
 *
 * Reusable background composition for marketing surfaces. Composes:
 *   1. Base solid `bg-background` (Wave 60.56 P1 token).
 *   2. Inline SVG `<feTurbulence baseFrequency="0.012" numOctaves="2">` paper-
 *      grain noise (5% opacity) — paint-light, mobile-safe (R6 finding: octaves
 *      >2 tanks paint perf on mid Android).
 *   3. CSS radial-gradient: `gold-soft #D4B373` 8% opacity, off-center top-right
 *      (30%/20% anchor) — Anthropic-style asymmetric warmth.
 *   4. CSS linear-gradient: `warm-dark-200 → warm-dark-100` vertical tonal fade.
 *   5. Optional italic-serif watermark behind content (lotus mark variant TBD;
 *      "Tử Vi" wordmark used by hero — passed via `<MarketingHero watermark>`).
 *
 * Server component — no hooks, no client-side JS. All atmosphere is pure CSS +
 * inline SVG. Strict token discipline: ONLY warm-dark / cream / gold tokens.
 *
 * Performance budget: 0 extra JS bundle (server-only). SVG noise inlined ~600B
 * raw; gzip ~300B. Worth the depth.
 */
export type PaintedCanvasProps = {
  children: ReactNode;
  /** Tonal intensity. `soft` (default) = 8% gold; `rich` = 14% gold for stronger warmth. */
  tone?: 'soft' | 'rich';
  /** Optional decorative SVG watermark variant. `lotus` reserved for future Wave 60.56.R6 motif. */
  watermark?: 'lotus' | 'none';
  /** className passthrough for outer wrapper (e.g. min-height, padding). */
  className?: string;
};

export function PaintedCanvas({
  children,
  tone = 'soft',
  watermark = 'none',
  className,
}: PaintedCanvasProps) {
  const goldOpacity = tone === 'rich' ? '0.14' : '0.08';

  return (
    <div
      className={`relative isolate overflow-hidden bg-background ${className ?? ''}`}
    >
      {/* Layer 1: Linear vertical fade warm-dark-200 → warm-dark-100 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(36, 30, 26, 0.55) 0%, rgba(27, 23, 20, 0.0) 60%)',
        }}
      />

      {/* Layer 2: Radial gold-soft glow, off-center top-right (30% / 20%) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 70% 20%, rgba(212, 179, 115, ${goldOpacity}) 0%, transparent 65%)`,
        }}
      />

      {/* Layer 3: SVG paper-grain noise via feTurbulence — keep numOctaves=2 */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.05] mix-blend-overlay"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="painted-noise-v1">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#painted-noise-v1)" />
      </svg>

      {/* Layer 4: Optional lotus watermark (reserved for future motif). */}
      {watermark === 'lotus' && (
        <svg
          aria-hidden
          className="pointer-events-none absolute -right-12 bottom-0 z-0 h-[480px] w-[480px] text-ink/30"
          viewBox="0 0 200 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
        >
          {/* Simple geometric lotus glyph — 8 petals around center dot. */}
          <circle cx="100" cy="100" r="3" fill="currentColor" />
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 360) / 8;
            return (
              <ellipse
                key={i}
                cx="100"
                cy="60"
                rx="14"
                ry="42"
                transform={`rotate(${angle} 100 100)`}
              />
            );
          })}
        </svg>
      )}

      {/* Content layer */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
