import * as React from 'react';
import { TOOLKIT_GROUPS } from '@/lib/site-registry';

/**
 * ToolkitSection — chống undersell: hieu.asia KHÔNG chỉ năm lăng kính.
 * Showcase cả bộ công cụ nhóm theo: Cổ học Á Đông / Tâm lý hiện đại / Trực giác.
 * Dữ liệu từ site-registry (lib/site-registry) — 1 nguồn sự thật. Editorial, link /cong-cu.
 */
const GROUPS = TOOLKIT_GROUPS;

export function ToolkitSection(): React.JSX.Element {
  return (
    <section aria-label="Cả bộ công cụ" className="bg-muted/20 py-12 sm:py-14">
      <div className="mx-auto max-w-marketing-tight px-6 sm:px-8">
        <p className="rv-fade font-mono text-editorial-mono uppercase tracking-[0.12em] text-muted-foreground">
          KHÔNG CHỈ NĂM LĂNG KÍNH
        </p>
        <h2 className="rv-up mt-3 font-editorial-display text-3xl leading-tight text-foreground sm:text-4xl" style={{ animationDelay: '80ms' }}>
          Cả một <em className="italic text-primary">bộ công cụ</em> — cổ học Á Đông gặp tâm lý hiện đại.
        </h2>
        <p className="rv-up mt-3 max-w-[36em] leading-relaxed text-muted-foreground" style={{ animationDelay: '160ms' }}>
          Năm lăng kính cho bức tranh <strong className="font-medium text-foreground/90">sâu</strong> nhất về bạn.
          Cả bộ công cụ còn lại cho từng tình huống — gieo quẻ, hợp tuổi, ngày tốt, lá Tarot, kiểu tính cách…
        </p>

        <div className="mt-8 space-y-6">
          {GROUPS.map((g, gi) => (
            <div key={g.label} className="rv-up" style={{ animationDelay: `${gi * 80}ms` }}>
              <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-primary/70">{g.label}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {g.tools.map((t) => (
                  <span key={t.href} className="inline-flex items-center gap-1">
                    <a
                      href={t.href}
                      className="rounded-full border border-primary/40 bg-primary/5 px-3.5 py-1.5 text-sm text-foreground transition-colors hover:border-primary hover:bg-primary/5"
                    >
                      {t.n}
                    </a>
                    {t.learn && (
                      <a
                        href={t.learn}
                        // a11y (WCAG 2.5.3 Label-in-Name): nhãn phải CHỨA chữ
                        // hiển thị "học" để điều khiển bằng giọng nói hoạt động.
                        aria-label={`Học về ${t.n}`}
                        className="-my-1 inline-flex items-center px-1 py-1.5 font-mono text-[12px] uppercase tracking-[0.08em] text-primary underline underline-offset-2 transition-colors hover:text-primary"
                      >
                        học
                      </a>
                    )}
                  </span>
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
