'use client';

import * as React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@hieu-asia/ui';

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
 * Smooth expand via Radix Accordion (already in @hieu-asia/ui).
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
      className={['relative bg-background py-20 sm:py-28', className ?? ''].join(' ').trim()}
    >
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80 sm:text-xs">
            {eyebrow}
          </p>
          <h2
            id={`${id}-heading`}
            className="mt-4 text-balance font-heading text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl"
          >
            {title ?? (
              <>
                Mọi thứ bạn muốn{' '}
                <span className="bg-gold-gradient bg-clip-text text-transparent">hỏi trước</span>
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
          <Accordion type="single" collapsible className="w-full">
            {items.map((item, i) => (
              <AccordionItem key={i} value={`${id}-${i}`}>
                <AccordionTrigger className="text-left text-base font-medium">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
