/**
 * Wave 60.66.P5 — SectionDivider (Option E "Editorial Live" decorative role #3).
 *
 * Inter-section rule with two variants: an 8-point lotus motif (cultural mark
 * echoing the BentoLens LotusIcon) or a section-sign `§` glyph in Instrument
 * Serif italic. Server component — no client hooks, no Motion. The lotus
 * variant SVG mirrors `<LotusIcon>` in BentoLens.tsx exactly so the motif
 * stays consistent across the home page.
 *
 * One of three preserved decorative roles for `font-marketing-display` post
 * Wave 60.66.P5 sweep (numerals in BigNumberRow/PricingTierV2 + PullQuote body
 * + § glyph here).
 *
 * Tokens (Wave 60.56 P1, no new colors): text-gold / text-gold/40 / text-gold/15
 * / max-w-marketing / font-marketing-display.
 */

export type SectionDividerProps = {
  /** Variant: `lotus` (default) shows 8-point motif; `glyph` shows `§` italic. */
  variant?: 'lotus' | 'glyph';
  /** Optional className passthrough (e.g. to override vertical padding). */
  className?: string;
};

/** 8-point lotus mark — mirrors `<LotusIcon>` in BentoLens.tsx. */
function LotusGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 2 L14 8 L20 9 L15 13 L17 19 L12 16 L7 19 L9 13 L4 9 L10 8 Z" />
    </svg>
  );
}

export function SectionDivider({
  variant = 'lotus',
  className,
}: SectionDividerProps) {
  return (
    <div
      role="separator"
      aria-hidden
      className={[
        'mx-auto flex max-w-marketing items-center gap-4 px-6 py-12',
        className ?? '',
      ].join(' ')}
    >
      <span className="h-px flex-1 bg-gold/15" />
      {variant === 'lotus' ? (
        <LotusGlyph className="size-9 text-gold/40" />
      ) : (
        <span className="font-marketing-display text-2xl italic text-gold/50">
          §
        </span>
      )}
      <span className="h-px flex-1 bg-gold/15" />
    </div>
  );
}
