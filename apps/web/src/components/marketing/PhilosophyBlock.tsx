import type { ReactNode } from 'react';

/**
 * Wave 60.56 P2.4 — PhilosophyBlock (Raycast-style stance section).
 *
 * R3 differentiation finding #2: VN astrology competitors (tuvi.vn, etc.) ship
 * only readings — they have no philosophy stance. A premium-positioned product
 * needs an explicit "Bạn vẫn là người quyết định" block to signal: this is a
 * lens, not a prophecy. Replaces fake StoryTestimonials (Wave 60.55 R1 finding:
 * trust-negative). Will be wired into / + /about pages by Phase 3.
 *
 * Tokens (Wave 60.56 P1 commit 0b38173):
 *   bg-warm-dark-50 / bg-warm-dark-100
 *   font-marketing-display / text-section-display / text-eyebrow
 *   text-cream-50 / text-cream-300 / text-cream-500
 *   text-gold / max-w-marketing-text
 */
export type PhilosophyBlockProps = {
  /** Mono uppercase gold eyebrow rendered with a leading em-dash, e.g. "TRIẾT LÝ". */
  eyebrow?: string;
  /** H2 ReactNode — pass `<em>` for italic gold-soft spans, `<span class="text-gold-dot">.</span>` for the signature period. */
  title: ReactNode;
  /** Body copy. String = single paragraph; array = multiple paragraphs (each wrapped in `<p>`). */
  body: string | string[];
  /** Optional mono attribution line below body, e.g. "hieu.asia — 2026". */
  citation?: string;
  /** Section bg variant — `warm-dark-100` (default) for primary stance, `warm-dark-50` to blend with hero. */
  bg?: 'warm-dark-50' | 'warm-dark-100';
  /** Text alignment — `center` (default) for stance, `left` for in-context use. */
  align?: 'left' | 'center';
};

const BG_CLASS: Record<NonNullable<PhilosophyBlockProps['bg']>, string> = {
  'warm-dark-50': 'bg-warm-dark-50',
  'warm-dark-100': 'bg-warm-dark-100',
};

const ALIGN_CLASS: Record<NonNullable<PhilosophyBlockProps['align']>, string> = {
  left: 'text-left',
  center: 'text-center',
};

export function PhilosophyBlock({
  eyebrow,
  title,
  body,
  citation,
  bg = 'warm-dark-100',
  align = 'center',
}: PhilosophyBlockProps) {
  const paragraphs = Array.isArray(body) ? body : [body];

  return (
    <section className={`${BG_CLASS[bg]} py-24 md:py-32`}>
      <div className={`mx-auto max-w-marketing-text px-6 ${ALIGN_CLASS[align]}`}>
        {eyebrow && (
          <p className="mb-6 font-mono text-eyebrow uppercase tracking-[0.12em] text-gold">
            — {eyebrow}
          </p>
        )}

        <h2 className="text-balance font-marketing-display text-section-display leading-tight text-cream-50">
          {title}
        </h2>

        <div className="mt-8 space-y-4">
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className="text-pretty font-sans text-lg leading-relaxed text-cream-300"
            >
              {para}
            </p>
          ))}
        </div>

        {citation && (
          <p className="mt-8 font-mono text-xs uppercase tracking-wider text-cream-500">
            {citation}
          </p>
        )}
      </div>
    </section>
  );
}
