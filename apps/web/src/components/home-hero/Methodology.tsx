import * as React from 'react';
import { LENSES as CATALOG } from '@/lib/catalog/lenses';

/**
 * Methodology — "show your work": differentiator anti-bói-toán mạnh nhất (research).
 * Kể chuyện HỢP NHẤT: N lớp → 1 lời khuyên, con số cụ thể (precision framing). Editorial.
 * Lăng kính lấy từ catalog (lib/catalog/lenses) — 1 nguồn sự thật.
 */
const LENSES = CATALOG.map((l, i) => ({
  n: String(i + 1).padStart(2, '0'),
  name: l.name,
  give: l.give,
  meta: l.meta,
}));

export function Methodology(): React.JSX.Element {
  return (
    <section aria-label="Cách hieu.asia giải mã bạn" className="bg-muted/30 py-16 sm:py-20">
      <div className="mx-auto max-w-marketing-tight px-6 sm:px-8">
        <p className="font-mono text-editorial-mono uppercase tracking-[0.18em] text-muted-foreground">
          CÁCH HIEU.ASIA GIẢI MÃ
        </p>
        <h2 className="mt-3 font-marketing-display text-3xl leading-tight text-foreground sm:text-4xl">
          Năm lăng kính, <em className="italic text-primary">một bức tranh</em>.
        </h2>
        <p className="mt-3 max-w-[34em] leading-relaxed text-muted-foreground">
          Mỗi hệ nhìn bạn từ một phía. AI đọc cả năm rồi hợp thành một góc nhìn bạn dùng được — để
          tự quyết, không phụ thuộc phán đoán bên ngoài.
        </p>

        <ol className="mt-8 flex flex-col border-y border-primary/10 divide-y divide-primary/10">
          {LENSES.map((l) => (
            <li key={l.n} className="flex items-baseline gap-4 py-4">
              <span className="font-mono text-sm text-primary/70">{l.n}</span>
              <span className="min-w-[5em] font-editorial-display text-xl italic text-foreground">{l.name}</span>
              <span className="flex-1 text-foreground/85">{l.give}</span>
              <span className="hidden font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground sm:block">
                {l.meta}
              </span>
            </li>
          ))}
        </ol>

        <p className="mt-8 max-w-[32em] font-editorial-display text-xl leading-snug text-foreground sm:text-2xl">
          <span className="text-primary">→</span> AI hợp nhất năm lớp thành{' '}
          <em className="italic text-primary">một lời khuyên thực tế</em>, có thể hành động.
        </p>
      </div>
    </section>
  );
}
