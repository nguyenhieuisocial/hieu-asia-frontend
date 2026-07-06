import * as React from 'react';
import { ChevronDown } from 'lucide-react';

export interface FaqItem {
  q: string;
  a: React.ReactNode;
}

interface FaqAccordionProps {
  items: readonly FaqItem[];
  id?: string;
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  className?: string;
}

/**
 * Reusable FAQ accordion — used on /, /pricing, /features.
 *
 * Wave 60.95.b P1 (vault 130 P1-8 + ChatGPT 5.5 audit):
 * Switched from Radix Accordion → native <details>/<summary>.
 *
 * Why: Radix renders <AccordionContent> with `hidden=""` when closed.
 * Crawlers and some assistive tech treat `hidden` as not-rendered,
 * so FAQ answer copy was effectively invisible for SEO + a11y audits.
 *
 * Native <details>:
 *   - Answer content is always in initial server-rendered DOM (no `hidden`).
 *   - Works without JS (progressive enhancement).
 *   - Accessible by default (browser-native disclosure semantics).
 *   - Animatable via CSS (we keep the chevron rotate animation).
 *   - First item opens by default for SEO above-the-fold answer.
 */
export function FaqAccordion({
  items,
  id = 'faq',
  eyebrow = 'Câu hỏi thường gặp',
  title,
  subtitle,
  className,
}: FaqAccordionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      // Wave 60.79.T1 (vault 112 P0-09): tighten from sm:py-28 → md:py-24 so
      // section padding cascade doesn't pile up 200+px gaps between H2s.
      className={['relative bg-background py-16 md:py-20', className ?? ''].join(' ').trim()}
    >
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-primary/90 sm:text-xs">
            {eyebrow}
          </p>
          <h2
            id={`${id}-heading`}
            className="mt-4 text-balance font-heading text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl"
          >
            {title ?? (
              <>
                Mọi thứ bạn muốn{' '}
                <span className="text-primary">hỏi trước</span>
              </>
            )}
          </h2>
          {subtitle && (
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">{subtitle}</p>
          )}
        </div>

        <div
          /* Wave 60.35.a then 60.37 HIGH-5 (sub-agent A): `bg-card/60` read
             as a pure white callout panel on cream in light mode — too
             different from the rest of the page sections. Soften to /40
             on mobile (less prominent), keep /60 from sm+ where the card
             needs to anchor the FAQ as a distinct region. */
          className="mt-12 rounded-2xl border border-border bg-card/40 sm:bg-card/60 px-6"
        >
          {items.map((item, i) => (
            // Wave 60.95.m P2-a11y (Sub-agent Y audit closeout):
            // Native <details>/<summary> handles disclosure state announcement
            // automatically via the browser's built-in disclosure-widget role.
            // The chevron rotation below is purely visual (CSS `group-open:rotate-180`)
            // and the icon is `aria-hidden="true"` so SR users hear only the
            // summary text + native expanded/collapsed state — no double-narration.
            //
            // We intentionally do NOT add aria-expanded on <summary>. Doing so
            // would (a) duplicate the native state, (b) require client JS to
            // sync with the `toggle` event (drops progressive enhancement), and
            // (c) conflict with the ARIA-in-HTML spec which discourages
            // overriding implicit roles/states on native disclosure elements.
            <details
              key={i}
              // First item open by default so an answer is visible above-the-fold
              // for first-time visitors + helps SEO "visible content" heuristics.
              open={i === 0}
              className="faq-item group border-b border-primary/15 last:border-b-0"
            >
              <summary
                className={[
                  'flex cursor-pointer list-none items-center justify-between gap-4 py-4',
                  'text-left text-base font-medium text-foreground transition-colors',
                  'hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  '[&::-webkit-details-marker]:hidden',
                ].join(' ')}
              >
                <span>{item.q}</span>
                <ChevronDown
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-open:rotate-180"
                />
              </summary>
              <div className="faq-answer pb-4 pt-0 text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
