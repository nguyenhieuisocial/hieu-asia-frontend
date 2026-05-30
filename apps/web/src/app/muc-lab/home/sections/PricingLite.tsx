import * as React from 'react';

/**
 * PricingLite — pricing RÚT GỌN + CTA hành động chính. (research: advisory product không show
 * full pricing table trên homepage.) Nút "Bắt đầu miễn phí" (filled AA) + link phụ "Xem các gói".
 */
export function PricingLite(): React.JSX.Element {
  return (
    <section aria-label="Giá" className="bg-muted/30 py-14 sm:py-16">
      <div className="mx-auto flex max-w-marketing-tight flex-col items-center gap-3 px-6 text-center sm:px-8">
        <p className="font-editorial-display text-2xl text-foreground sm:text-3xl">
          <em className="italic text-primary">Miễn phí</em> để bắt đầu — không cần thẻ.
        </p>
        <p className="text-muted-foreground">Nâng cấp khi bạn muốn đi sâu hơn.</p>
        <a
          href="/onboarding"
          className="mt-3 inline-flex items-center justify-center rounded-md bg-[hsl(var(--primary-cta))] px-8 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Bắt đầu miễn phí →
        </a>
        <a
          href="/pricing"
          className="mt-1 font-mono text-sm text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
        >
          Xem các gói →
        </a>
      </div>
    </section>
  );
}
