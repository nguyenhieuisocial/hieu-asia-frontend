import * as React from 'react';

/**
 * Methodology — "show your work": differentiator anti-bói-toán mạnh nhất (research).
 * Không list lại 4 hệ (EditorialList đã làm) mà kể chuyện HỢP NHẤT: 4 lớp → 1 lời khuyên.
 * Dùng con số cụ thể (precision framing kiểu Co-Star/The Pattern). Editorial, no sparkle icon.
 */
const LENSES = [
  { n: '01', name: 'Tử Vi', give: 'bản đồ ưu thế & thời vận', meta: 'lá số 12 cung · 14 chính tinh' },
  { n: '02', name: 'Bát Tự', give: 'nhịp thịnh–suy theo thời gian', meta: 'Tứ Trụ can-chi · ngũ hành' },
  { n: '03', name: 'Thần Số', give: 'động lực gốc & bài học đời', meta: 'con số đường đời' },
  { n: '04', name: 'MBTI', give: 'cách bạn tiếp nhận & ra quyết định', meta: '16 kiểu · 4 trục Jung' },
];

export function Methodology(): React.JSX.Element {
  return (
    <section aria-label="Cách hieu.asia đọc bạn" className="bg-muted/30 py-16 sm:py-20">
      <div className="mx-auto max-w-marketing-tight px-6 sm:px-8">
        <p className="font-mono text-editorial-mono uppercase tracking-[0.18em] text-muted-foreground">
          CÁCH HIEU.ASIA ĐỌC BẠN
        </p>
        <h2 className="mt-3 font-marketing-display text-3xl leading-tight text-foreground sm:text-4xl">
          Bốn lăng kính, <em className="italic text-primary">một bức tranh</em>.
        </h2>
        <p className="mt-3 max-w-[34em] leading-relaxed text-muted-foreground">
          Mỗi hệ nhìn bạn từ một phía. AI đọc cả bốn rồi hợp thành một khuyến nghị bạn dùng được —
          không phải lời tiên tri.
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
          <span className="text-primary">→</span> AI hợp nhất bốn lớp thành{' '}
          <em className="italic text-primary">một lời khuyên thực tế</em>, có thể hành động.
        </p>
      </div>
    </section>
  );
}
