import * as React from 'react';

/**
 * PricingLite — pricing RÚT GỌN trên homepage (research Agent D: advisory product KHÔNG
 * nên show full pricing table trên homepage → transaction-framing quá sớm). 1 dòng + link /pricing.
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
          href="/pricing"
          className="mt-2 font-mono text-sm text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
        >
          Xem các gói →
        </a>
      </div>
    </section>
  );
}
