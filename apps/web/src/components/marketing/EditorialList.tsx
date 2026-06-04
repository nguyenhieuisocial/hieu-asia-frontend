import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Wave 62.08 — EditorialList (founder vault 138 spec).
 *
 * Vertical numbered list with italic display headings and bottom rules,
 * replacing the BentoLens 2×2 grid usage on "Bốn ống kính" section. The
 * editorial list pattern (per vault 138) avoids the "feature dump" feel
 * of square cards, leverages Newsreader italic display, and creates a
 * clear reading rhythm with generous vertical spacing.
 *
 * Each item is a 2-column grid:
 *   - Number column (auto): mono 11px uppercase ochre OR serif italic 32px
 *   - Content column (1fr): optional eyebrow, italic display heading
 *     (editorial-h3 Newsreader 400), body (editorial-lede muted), and
 *     optional ochre-underlined href link
 *
 * Items are separated by `border-b border-border/40` with `pb-section`
 * (88px) below + `pt-card` (32px) above for the editorial column rhythm
 * described in vault 138.
 *
 * Tokens (Wave 62.01–62.05b):
 *   font-editorial-display (Newsreader italic-capable) ·
 *   font-mono (JetBrains Mono) · text-editorial-h3 / -lede / -mono ·
 *   text-primary (Ochre day / Gold-soft night) · text-foreground ·
 *   text-muted-foreground · py-card (32) / py-section (88) ·
 *   decoration-primary (link underline)
 */

export type EditorialListItem = {
  /** Optional override; defaults to auto "01" "02" ... based on index. */
  number?: string;
  /** Italic display heading. String renders inside Newsreader italic; pass ReactNode for mixed runs. */
  title: string | ReactNode;
  /** 1–2 sentence body. */
  body: string | ReactNode;
  /** Optional small label above the title (mono uppercase ochre eyebrow). */
  eyebrow?: string;
  /** Optional CTA link rendered inline below body, e.g. "Đọc về Tử Vi →". */
  href?: string;
  /** Optional CTA label override; defaults to "Đọc tiếp →" when `href` set. */
  cta?: string;
  /** Optional Wave 62.09 custom icon (LaSoIcon, BatTuIcon, etc.). When set,
   * REPLACES the number in the first column — keeps the editorial restraint
   * (one focal element per item). Icon inherits text-primary from parent so
   * theme switches automatically. */
  icon?: ReactNode;
};

export type EditorialListProps = {
  items: EditorialListItem[];
  /** Default true — pass false to render content-only without the number column. */
  showNumbers?: boolean;
  /** `mono` = JetBrains Mono 11px ochre; `serif-italic` = Newsreader 32px italic. Default `mono`. */
  numberStyle?: 'mono' | 'serif-italic';
  /** Optional mono uppercase eyebrow above the list (e.g. "BỐN ỐNG KÍNH"). */
  eyebrow?: string;
  /** Optional section H2 above the list. */
  title?: ReactNode;
  /** Section background. Defaults to `background`. */
  bg?: 'background' | 'muted';
};

/** Pad to 2 digits, e.g. 1 → "01", 12 → "12". */
function autoNumber(idx: number): string {
  return String(idx + 1).padStart(2, '0');
}

export function EditorialList({
  items,
  showNumbers = true,
  numberStyle = 'mono',
  eyebrow,
  title,
  bg = 'background',
}: EditorialListProps) {
  // Tailwind JIT requires literal class strings — match BentoLens/BigNumberRow pattern.
  const bgClass = bg === 'muted' ? 'bg-muted/40' : 'bg-background';

  return (
    <section className={`${bgClass} py-14 md:py-16`}>
      <div className="mx-auto max-w-marketing-tight px-6">
        {eyebrow && (
          <p className="mb-6 font-mono text-editorial-mono uppercase tracking-[0.12em] text-primary">
            — {eyebrow}
          </p>
        )}
        {title && (
          <h2 className="mb-10 text-balance font-editorial-display text-editorial-h2 font-normal tracking-tight text-foreground">
            {title}
          </h2>
        )}

        <ol className="list-none">
          {items.map((item, idx) => {
            const numberDisplay = item.number ?? autoNumber(idx);
            const isLast = idx === items.length - 1;
            // Bottom rule + generous spacing between items per vault 138.
            // Last item: no border (closes the column rhythm cleanly).
            const itemSpacing = isLast
              ? 'pt-card'
              : 'pt-card pb-12 border-b border-border/40';

            return (
              <li
                key={idx}
                className={`grid grid-cols-[auto_1fr] gap-x-8 md:gap-x-12 ${itemSpacing}`}
              >
                {item.icon ? (
                  // Wave 62.09 — custom icon takes precedence over number when
                  // set. 32×32 render box (icons are viewBox 48 but we scale down
                  // to keep them flush with the editorial column rhythm).
                  <div
                    aria-hidden="true"
                    className="h-8 w-8 pt-1 text-primary"
                  >
                    {item.icon}
                  </div>
                ) : showNumbers ? (
                  numberStyle === 'serif-italic' ? (
                    <span
                      aria-hidden="true"
                      className="font-editorial-display text-[2rem] italic leading-none text-primary"
                    >
                      {numberDisplay}
                    </span>
                  ) : (
                    <span
                      aria-hidden="true"
                      className="pt-2 font-mono text-editorial-mono uppercase tracking-[0.12em] text-primary"
                    >
                      {numberDisplay}
                    </span>
                  )
                ) : (
                  // Empty placeholder cell preserves grid alignment so the
                  // content column starts at the same x across items.
                  <span aria-hidden="true" className="w-0" />
                )}

                <div className="max-w-marketing-text">
                  {item.eyebrow && (
                    <p className="mb-3 font-mono text-editorial-mono uppercase tracking-[0.12em] text-primary">
                      {item.eyebrow}
                    </p>
                  )}

                  <h3 className="font-editorial-display text-editorial-h3 font-normal italic leading-tight text-foreground">
                    {item.title}
                  </h3>

                  <div className="mt-4 font-sans text-editorial-lede text-muted-foreground">
                    {item.body}
                  </div>

                  {item.href && (
                    <Link
                      href={item.href}
                      className="mt-5 inline-flex items-center gap-1 font-sans text-base text-primary underline decoration-primary underline-offset-4 transition-colors duration-300 ease-editorial hover:decoration-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      {item.cta ?? 'Đọc tiếp'}
                      <span aria-hidden>→</span>
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
