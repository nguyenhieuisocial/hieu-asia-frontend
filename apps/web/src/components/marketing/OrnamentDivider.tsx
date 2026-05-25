/**
 * Wave 60.35 — editorial ornament divider for marketing sections.
 *
 * Vietnamese ledger / woodcut visual idiom: a thin gold rule — diamond
 * glyph — thin gold rule. Provides a typographic anchor between sections
 * without the heavy weight of a `<hr>` or full-width border.
 *
 * Pure CSS, no icon library dependency. Uses semantic brand-gold tokens
 * from `@hieu-asia/ui` preset so light/dark mode adapt automatically.
 *
 * Aesthetic: refined minimalism (vault 71 Brand Kit "đen than / vàng
 * đồng / tím trầm"). One signature visual moment per page — the
 * ornament — instead of distributed decoration.
 */

interface OrnamentDividerProps {
  /** Override centering or vertical spacing from caller. */
  className?: string;
  /** Custom glyph (default ◆). Use ❖ for sections with more weight, * for
   *  lighter rhythm. Keep monochrome to preserve gold accent. */
  glyph?: string;
}

export function OrnamentDivider({ className, glyph = '◆' }: OrnamentDividerProps) {
  return (
    <div
      className={['mx-auto flex max-w-md items-center gap-4', className ?? ''].join(' ')}
      role="separator"
      aria-hidden="true"
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/30 to-gold/60" />
      <span className="text-sm leading-none text-gold/70">{glyph}</span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/30 to-gold/60" />
    </div>
  );
}
