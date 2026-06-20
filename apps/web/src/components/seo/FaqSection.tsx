import { ChevronDown } from 'lucide-react';
import type { FaqItem } from '@/lib/seo/jsonld';

interface FaqSectionProps {
  items: FaqItem[];
  title?: string;
  id?: string;
  className?: string;
}

/**
 * Server-rendered FAQ section for content / landing detail pages (GEO).
 *
 * Pair with `faqPage(items)` JSON-LD: pass the SAME `items` array to BOTH
 * `<JsonLd data={faqPage(items)} />` and this component, so the schema text
 * always matches the visible DOM (Google anti-cloaking + clean extraction by
 * answer-engines / AI search — ChatGPT, Claude, Perplexity, Google AI).
 *
 * Native `<details>`/`<summary>` (NOT Radix). Radix sets `hidden=""` on a
 * collapsed panel → crawlers treat the answer as not-rendered (see
 * components/home/FaqAccordion.tsx header). Native `<details>` keeps every
 * answer in the initial server-rendered DOM, works without JS, accessible by
 * default. First item open for an above-the-fold answer.
 *
 * Answers MUST be plain text (they go verbatim into the JSON-LD Answer.text).
 */
export function FaqSection({ items, title = 'Câu hỏi thường gặp', id = 'faq', className }: FaqSectionProps) {
  if (!items.length) return null;
  return (
    <section
      id={id}
      aria-label={title}
      className={['rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm', className ?? ''].join(' ').trim()}
    >
      <h2 className="font-heading text-xl font-semibold text-foreground">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.map((item, i) => (
          <details
            key={i}
            open={i === 0}
            className="group border-b border-border/60 pb-3 last:border-b-0 last:pb-0"
          >
            <summary
              className={[
                'flex cursor-pointer list-none items-center justify-between gap-4 py-1',
                'text-left text-sm font-medium text-foreground transition-colors hover:text-gold',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                '[&::-webkit-details-marker]:hidden',
              ].join(' ')}
            >
              <span>{item.q}</span>
              <ChevronDown
                aria-hidden
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
              />
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
