import * as React from 'react';

/**
 * ToolkitSection — chống undersell: hieu.asia KHÔNG chỉ 4 lăng kính.
 * Showcase cả bộ công cụ (12) nhóm theo: Cổ học Á Đông / Tâm lý hiện đại / Trực giác.
 * "Bốn lăng kính = bức tranh SÂU; cả bộ còn lại = cho mọi tình huống." Editorial, link /cong-cu.
 */
const GROUPS = [
  {
    label: 'Cổ học Á Đông',
    tools: [
      { n: 'Tử Vi', href: '/tu-vi' },
      { n: 'Bát Tự', href: '/bat-tu' },
      { n: 'Thần Số', href: '/than-so-hoc' },
      { n: 'Kinh Dịch', href: '/gieo-que' },
      { n: 'Cân Xương', href: '/can-xuong' },
      { n: 'Thước Lỗ Ban', href: '/thuoc-lo-ban' },
      { n: 'Hợp tuổi', href: '/hop-tuoi' },
      { n: 'Lịch vạn niên', href: '/lich-van-nien' },
    ],
  },
  {
    label: 'Tâm lý hiện đại',
    tools: [
      { n: 'MBTI', href: '/mbti' },
      { n: 'Big Five', href: '/big-five' },
      { n: 'DISC', href: '/disc' },
    ],
  },
  { label: 'Trực giác', tools: [{ n: 'Tarot', href: '/tarot' }] },
];

export function ToolkitSection(): React.JSX.Element {
  return (
    <section aria-label="Cả bộ công cụ" className="bg-muted/20 py-16 sm:py-20">
      <div className="mx-auto max-w-marketing-tight px-6 sm:px-8">
        <p className="font-mono text-editorial-mono uppercase tracking-[0.18em] text-muted-foreground">
          KHÔNG CHỈ BỐN LĂNG KÍNH
        </p>
        <h2 className="mt-3 font-marketing-display text-3xl leading-tight text-foreground sm:text-4xl">
          Cả một <em className="italic text-primary">bộ công cụ</em> — cổ học Á Đông gặp tâm lý hiện đại.
        </h2>
        <p className="mt-3 max-w-[36em] leading-relaxed text-muted-foreground">
          Bốn lăng kính cho bức tranh <strong className="font-medium text-foreground/90">sâu</strong> nhất về bạn.
          Cả bộ công cụ còn lại cho từng tình huống — gieo quẻ, hợp tuổi, ngày tốt, lá Tarot, kiểu tính cách…
        </p>

        <div className="mt-8 space-y-6">
          {GROUPS.map((g) => (
            <div key={g.label}>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary/70">{g.label}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {g.tools.map((t) => (
                  <a
                    key={t.href}
                    href={t.href}
                    className="rounded-full border border-primary/25 px-3.5 py-1.5 text-sm text-foreground transition-colors hover:border-primary hover:bg-primary/5"
                  >
                    {t.n}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <a
          href="/cong-cu"
          className="mt-8 inline-flex font-mono text-sm text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
        >
          Xem tất cả công cụ →
        </a>
      </div>
    </section>
  );
}
