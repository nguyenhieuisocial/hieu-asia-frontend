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
 * 2×2 bento grid of "ống kính" (lenses) — Notion-style cards meet Eastern
 * wisdom motifs. Each card combines a thin-line lucide icon, mono eyebrow
 * (NAME · SUBNAME), italic verb + cream-50 noun heading, body copy, and an
 * optional large VN serif italic watermark anchored bottom-right at low
 * opacity. A small lotus 8-pointed star sits top-right as a unifying
 * cultural mark.
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
}: BentoLensProps) {
  // Tailwind can't statically infer `bg-${bg}` — use a literal mapping so the
  // JIT keeps both classes in the output bundle.
  const bgClass = bg === 'warm-dark-100' ? 'bg-warm-dark-100' : 'bg-warm-dark-50';

  return (
    <section className={`${bgClass} py-24 md:py-32`}>
      <div className="mx-auto max-w-marketing-tight px-6">
        {eyebrow && (
          <p className="mb-6 text-center font-mono text-eyebrow uppercase tracking-[0.12em] text-gold">
            — {eyebrow}
          </p>
        )}
        {title && (
          <h2 className="text-balance text-center font-marketing-display text-section-display text-cream-50">
            {title}
          </h2>
        )}

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {lenses.map((lens) => {
            return (
              <article
                key={lens.id}
                className={`relative overflow-hidden rounded-card-editorial border bg-warm-dark-200 p-12 transition-all duration-300 ease-editorial hover:-translate-y-0.5 hover:border-gold hover:bg-warm-dark-300 ${lens.recommended ? 'border-gold' : 'border-warm-dark-300'}`}
              >
                <LotusIcon className="absolute right-6 top-6 size-6 text-gold opacity-30" />

                {lens.watermark && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-6 right-6 select-none font-marketing-display italic text-warm-dark-300 opacity-50"
                    style={{ fontSize: '140px', lineHeight: 1 }}
                  >
                    {lens.watermark}
                  </span>
                )}

                {lens.icon}

                <p className="relative z-10 mt-8 font-mono text-eyebrow uppercase tracking-wider text-cream-500">
                  {lens.name}
                  {lens.subname && ` · ${lens.subname}`}
                </p>

                <h3 className="relative z-10 mt-4 font-marketing-display text-3xl text-cream-50">
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
