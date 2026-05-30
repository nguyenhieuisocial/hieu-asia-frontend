import * as React from 'react';

/**
 * NotOraclesStrip — dải định vị ngay dưới hero: "editorial decoder, không oracle".
 * Nâng disclaimer chip thành tuyên ngôn tự tin (kiểu The Pattern "we do not make predictions").
 */
export function NotOraclesStrip(): React.JSX.Element {
  const PILLS = ['Không bói toán', 'AI giải mã rõ ràng', 'Quyết định là của bạn'];
  return (
    <section aria-label="Định vị" className="mx-auto max-w-marketing-tight px-6 pb-12 pt-2 sm:px-8">
      <p className="max-w-[30em] font-editorial-display text-2xl leading-snug text-foreground sm:text-[1.6rem]">
        Không đoán số. Không “vận hạn”. hieu.asia{' '}
        <em className="italic text-primary">giải mã bối cảnh</em> từ bốn lăng kính để{' '}
        <em className="italic text-primary">bạn tự quyết</em>.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {PILLS.map((p) => (
          <span
            key={p}
            className="rounded-full border border-primary/25 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground"
          >
            {p}
          </span>
        ))}
      </div>
    </section>
  );
}
