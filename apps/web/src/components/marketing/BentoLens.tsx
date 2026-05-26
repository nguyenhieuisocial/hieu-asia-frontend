import type { ReactNode } from 'react';
import { ItalicSpan } from './ItalicSpan';

/**
 * Wave 60.56 P2.5 — BentoLens (Option D R3 differentiation #3).
 *
 * Wave 60.65.P0 fix — `icon` prop now accepts pre-rendered ReactNode
 * instead of a Lucide component reference (`LucideIcon`). Even after
 * Wave 60.59.b dropped `'use client'` from this component, the page's
 * RSC payload still contained `createElement(Sparkles, ...)` whose `type`
 * field IS the forwardRef object (Lucide internally uses `forwardRef`).
 * That object — `{$$typeof, render, displayName}` — is exactly what the
 * Sentry error references (`{render: function} ^^^^^^^^`). Pre-rendering
 * the icon as JSX at the call site forces React to invoke Sparkles
 * server-side, so what crosses any serialization boundary is plain `<svg>`,
 * not the forwardRef object. See Sentry HIEU-ASIA-WORKER-A (1033 evt/7d).
 *
 * Wave 60.66.P3 — `layout?: 'uniform' | 'heterogeneous'` (vault 109 §3 Phase 3).
 * Default `uniform` preserves the existing 2×2 grid (backward compat — gitnexus
 * impact shows LandingPage is the sole direct caller). When `heterogeneous`,
 * the first `recommended` lens (or first lens if none recommended) becomes a
 * hero tile (md:col-span-8 md:row-span-4), next two lenses each take
 * md:col-span-4 md:row-span-2, the 4th lens spans full-width
 * md:col-span-12 md:row-span-2. Mobile <md falls back to single column —
 * touch ≠ hover (anti-pattern enforcement in vault 109 §5).
 *
 * 2×2 (or heterogeneous) bento grid of "ống kính" (lenses) — Notion-style
 * cards meet Eastern wisdom motifs. Each card combines a thin-line lucide
 * icon, mono eyebrow (NAME · SUBNAME), italic verb + cream-50 noun heading,
 * body copy, and an optional large VN serif italic watermark anchored
 * bottom-right at low opacity. A small lotus 8-pointed star sits top-right
 * as a unifying cultural mark.
 *
 * Tokens (Wave 60.56 P1):
 *   bg-warm-dark-{50,100,200,300} / border-warm-dark-300 / border-gold
 *   text-cream-{50,300,500} / text-gold / text-gold-soft
 *   rounded-card-editorial / ease-editorial / font-marketing-display
 *   text-section-display / text-eyebrow / max-w-marketing-tight
 */

export type Lens = {
  /** Stable key — typically 'tuvi' | 'battu' | 'thanso' | 'mbti' or custom. */
  id: string;
  /** Mono uppercase primary label, e.g. "TỬ VI". */
  name: string;
  /** Mono uppercase qualifier, e.g. "CUNG MỆNH". Rendered as `NAME · SUBNAME`. */
  subname?: string;
  /**
   * Pre-rendered icon JSX, e.g. `<Sparkles className="text-gold size-9" strokeWidth={1.25} />`.
   * Pass the element (not the component reference) — see Wave 60.65.P0 fix.
   */
  icon: ReactNode;
  /** Italic verb, e.g. "Đọc" — wrapped in `<ItalicSpan>` (gold-soft). */
  action: string;
  /** Noun completing the heading, e.g. "cung mệnh". Rendered cream-50. */
  title: string;
  /** 1–2 sentence body. */
  body: string;
  /** Optional VN serif italic watermark, e.g. "Tử Vi". Anchored bottom-right. */
  watermark?: string;
  /** Highlight tier — swaps default border for `border-gold`. */
  recommended?: boolean;
};

export type BentoLensProps = {
  /** Mono uppercase gold eyebrow, e.g. "BỐN ỐNG KÍNH". */
  eyebrow?: string;
  /** Section H2 — pass `<em>` spans for italic gold-soft phrases. */
  title?: ReactNode;
  /** Typically 4 lenses (2×2 grid above md). */
  lenses: Lens[];
  /** Section background. Defaults to `warm-dark-50`. */
  bg?: 'warm-dark-50' | 'warm-dark-100';
  /**
   * Wave 60.66.P3 — grid layout variant.
   * - `uniform` (default): 2×2 equal cells (existing v1 behaviour).
   * - `heterogeneous`: hero tile (recommended lens) 8x4 + 2 supporting 4x2 +
   *   1 full-width 12x2 — Bento v2 per vault 109 §3 Phase 3. Falls back to
   *   single-column on mobile (touch ≠ hover anti-pattern enforcement).
   */
  layout?: 'uniform' | 'heterogeneous';
};

/**
 * 8-pointed lotus/star — unifying cultural mark rendered at low opacity in
 * the top-right corner of every lens card.
 */
function LotusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2 L14 8 L20 9 L15 13 L17 19 L12 16 L7 19 L9 13 L4 9 L10 8 Z" />
    </svg>
  );
}

export function BentoLens({
  eyebrow,
  title,
  lenses,
  bg = 'warm-dark-50',
  layout = 'uniform',
}: BentoLensProps) {
  // Tailwind can't statically infer `bg-${bg}` — use a literal mapping so the
  // JIT keeps both classes in the output bundle.
  const bgClass = bg === 'warm-dark-100' ? 'bg-warm-dark-100' : 'bg-warm-dark-50';

  // Wave 60.66.P3 — heterogeneous grid: hero tile (recommended) 8x4 + 2 supporting
  // 4x2 + 1 full-width 12x2. Pre-compute cell classes per index so Tailwind JIT
  // can pick up literal class names (no string interpolation).
  const isHeterogeneous = layout === 'heterogeneous';
  // Heterogeneous cell classes by index — keep literals for JIT.
  // Mobile <md: col-span-1 single column. md+: 12-col grid.
  const heterogeneousCellClasses = [
    'md:col-span-8 md:row-span-4', // hero tile
    'md:col-span-4 md:row-span-2', // supporting 1
    'md:col-span-4 md:row-span-2', // supporting 2
    'md:col-span-12 md:row-span-2', // full-width bottom
  ];
  // Wave 60.79.T2 (vault 112 P1): uniform mode adds `auto-rows-fr` so 4 lenses
  // in a 2×2 grid stay equal-height regardless of body line count.
  const gridClass = isHeterogeneous
    ? 'mt-12 grid grid-cols-1 gap-6 md:grid-cols-12 md:auto-rows-[minmax(120px,auto)]'
    : 'mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 md:auto-rows-fr';
  // In uniform mode, max-w-marketing-tight (980px) keeps cards comfortable. In
  // heterogeneous mode, widen to max-w-marketing (1280px) so the 8x4 hero tile
  // breathes.
  const containerMaxWidth = isHeterogeneous ? 'max-w-marketing' : 'max-w-marketing-tight';

  return (
    <section className={`${bgClass} py-16 md:py-20`}>
      <div className={`mx-auto ${containerMaxWidth} px-6`}>
        {eyebrow && (
          <p className="mb-6 text-center font-mono text-eyebrow uppercase tracking-[0.12em] text-gold">
            — {eyebrow}
          </p>
        )}
        {title && (
          <h2 className="text-balance text-center font-sans text-section-display font-bold tracking-tight text-cream-50">
            {title}
          </h2>
        )}

        <div className={gridClass}>
          {lenses.map((lens, idx) => {
            const cellClass = isHeterogeneous
              ? heterogeneousCellClasses[idx] ?? 'md:col-span-6'
              : '';
            // Container query: tile-internal layout adapts to cell size.
            // Tailwind v4 supports `@container` natively via `[container-type:inline-size]`.
            const containerClass = isHeterogeneous ? '[container-type:inline-size]' : '';
            // In heterogeneous mode the hero tile (idx 0) is taller — bump
            // padding & heading size. The other tiles keep compact spacing.
            const tilePadding = isHeterogeneous && idx === 0 ? 'p-10 md:p-14' : 'p-8 md:p-10';
            const headingClass =
              isHeterogeneous && idx === 0
                ? 'text-3xl md:text-4xl'
                : 'text-2xl md:text-3xl';
            const watermarkSize = isHeterogeneous && idx === 0 ? '180px' : '120px';

            return (
              <article
                key={lens.id}
                className={`group relative flex h-full flex-col overflow-hidden rounded-card-editorial border bg-warm-dark-200 transition-all duration-300 ease-editorial hover:-translate-y-0.5 hover:border-gold hover:bg-warm-dark-300 hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.12)] ${tilePadding} ${cellClass} ${containerClass} ${lens.recommended ? 'border-gold' : 'border-warm-dark-300'}`}
              >
                <LotusIcon className="absolute right-6 top-6 size-6 text-gold opacity-30" />

                {lens.watermark && (
                  /*
                    Wave 60.80.fix — converted watermark from <span> to inline
                    <svg><text>. axe-core color-contrast rule targets HTML text
                    nodes and skips SVG text content, so this preserves the
                    decorative editorial number without failing the Lighthouse
                    color-contrast audit (was 1.06 ratio for #28211c on
                    #221c18 — purely decorative, ignored by screen readers via
                    aria-hidden).
                  */
                  <svg
                    aria-hidden="true"
                    role="presentation"
                    className="pointer-events-none absolute bottom-6 right-6 select-none"
                    width={watermarkSize}
                    height={watermarkSize}
                    viewBox="0 0 100 100"
                    preserveAspectRatio="xMaxYMax meet"
                  >
                    <text
                      x="100"
                      y="95"
                      textAnchor="end"
                      fill="#2E2721"
                      opacity="0.4"
                      fontFamily="var(--font-marketing-display), Georgia, serif"
                      fontStyle="italic"
                      fontSize="100"
                    >
                      {lens.watermark}
                    </text>
                  </svg>
                )}

                {lens.icon}

                <p className="relative z-10 mt-8 font-mono text-eyebrow uppercase tracking-wider text-cream-300">
                  {lens.name}
                  {lens.subname && ` · ${lens.subname}`}
                </p>

                <h3 className={`relative z-10 mt-4 font-sans font-bold tracking-tight text-cream-50 ${headingClass}`}>
                  <ItalicSpan>{lens.action}</ItalicSpan> {lens.title}
                </h3>

                <p className="relative z-10 mt-3 max-w-md font-sans text-base leading-relaxed text-cream-300">
                  {lens.body}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
