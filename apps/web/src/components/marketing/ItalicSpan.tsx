import type { ReactNode } from 'react';

/**
 * Wave 60.56 P2.5 — ItalicSpan (Option D "Warm-Dark Editorial" R4 primitive).
 *
 * Signature italic verb wrapper used across marketing display headings
 * (e.g. "Hiểu mình. *Quyết định* mình."). Inherits `text-gold-soft` so the
 * verb visually pops against the cream-50 body of an `<h1>` / `<h2>`.
 *
 * Optional `goldDotAfter` appends the Option D signature period — a
 * `text-gold-dot` glyph with the 16px gold-dot-glow halo defined in
 * `tailwind.config.ts` (`shadow-gold-dot-glow`).
 *
 * Renders as a `<em>` fragment (no wrapping div) so it slots inline into
 * any heading without disrupting flow.
 */
export type ItalicSpanProps = {
  children: ReactNode;
  /** Append a gold-dot period (`.`) with subtle glow halo after the italic span. */
  goldDotAfter?: boolean;
  className?: string;
};

export function ItalicSpan({ children, goldDotAfter, className }: ItalicSpanProps) {
  return (
    <>
      <em className={`italic text-gold-soft ${className ?? ''}`}>{children}</em>
      {goldDotAfter && (
        <span className="text-gold-dot drop-shadow-[0_0_16px_rgba(229,198,138,0.18)]">.</span>
      )}
    </>
  );
}
