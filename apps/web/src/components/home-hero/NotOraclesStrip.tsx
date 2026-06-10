import * as React from 'react';

/**
 * NotOraclesStrip -- editorial decoder strip immediately below hero.
 */
const PILLS = ['Không bói toán', 'AI giải mã rõ ràng', 'Quyết định là của bạn'];

export function NotOraclesStrip(): React.JSX.Element {
  return (
    <section aria-label="Định vị" className="mx-auto max-w-marketing-tight px-6 pb-12 pt-2 sm:px-8">
      <p className="rv-up max-w-[30em] font-editorial-display text-2xl leading-snug text-foreground sm:text-[1.6rem]">
        Không đoán số. Không &ldquo;vận hạn&rdquo;. hieu.asia{' '}
        <em className="italic text-primary">giải mã bối cảnh</em> từ năm lăng kính để{' '}
        <em className="italic text-primary">bạn tự quyết</em>.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {PILLS.map((p, i) => (
          <span
            key={p}
            className="rv-up rounded-full border border-primary/25 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground"
            style={{ animationDelay: `${120 + i * 80}ms` }}
          >
            {p}
          </span>
        ))}
      </div>
    </section>
  );
}
