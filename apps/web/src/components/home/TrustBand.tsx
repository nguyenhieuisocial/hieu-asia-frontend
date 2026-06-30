import Link from 'next/link';
import { ShieldCheck, ScrollText, Lock, ArrowRight } from 'lucide-react';
import { CountUp } from '@/components/fx/CountUp';

/**
 * TrustBand — surfaces hieu.asia's REAL proof/credibility high on the homepage
 * (Bitget's prominent trust-signal pattern: Proof-of-Reserves / regulation /
 * "800+ assets"). hieu.asia's honest equivalents already exist but were buried:
 * the "Bằng Chứng" backtest moat, deterministic engine accuracy, source
 * transparency, and NĐ13 data security.
 *
 * Hard rule: every claim here is verifiable. No fabricated user counts / reviews.
 */

const PILLARS = [
  {
    icon: ScrollText,
    title: 'Tính thật, không tra bảng',
    // body split around the genuine "121 sao" count so the number can count up
    // on scroll (CountUp). Copy is unchanged when reassembled.
    bodyBefore: 'Tử Vi Bắc phái · ',
    count: 121,
    bodyAfter: ' sao (chính tinh & phụ tinh), an sao bằng thuật toán — không bịa.',
    href: '/methodology',
  },
  {
    icon: ShieldCheck,
    title: 'Minh bạch nguồn',
    body: 'Mỗi báo cáo dẫn cổ thư + nút “Vì sao?” chỉ rõ cung · sao · đại vận.',
    href: '/methodology',
  },
  {
    icon: Lock,
    title: 'Riêng tư & hợp pháp',
    body: 'Mã hoá AES-256 · không bán dữ liệu · tuân thủ Nghị định 13/2023.',
    href: '/privacy',
  },
] as const;

export function TrustBand() {
  return (
    <section
      aria-label="Vì sao tin được hieu.asia"
      className="border-b border-primary/15 bg-muted/30"
    >
      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-9">
        {/* Bằng Chứng — the differentiating proof, given top billing */}
        <Link
          href="/bang-chung"
          className="group mb-6 flex flex-col items-start gap-2 rounded-2xl border border-primary/20 bg-card/70 p-5 transition hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 active:scale-[0.99] sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-primary">
              Bằng Chứng
            </span>
            <p className="mt-1 font-marketing-display text-xl leading-snug text-foreground sm:text-2xl">
              Kiểm chứng lá số bằng <span className="italic">quá khứ thật của bạn</span>.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Nhập một sự kiện đã xảy ra — xem lá số năm đó đã “ghi dấu” đúng tới đâu (khoe cả chỗ trật).
            </p>
          </div>
          <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.12em] text-primary transition-colors group-hover:text-foreground">
            Tự kiểm chứng
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        {/* Three honest credibility pillars */}
        <div className="grid gap-px overflow-hidden rounded-2xl border border-primary/15 bg-primary/10 sm:grid-cols-3">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <Link
                key={p.title}
                href={p.href}
                className="rv-up group flex flex-col gap-2 bg-card/60 p-5 transition-colors hover:bg-card"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="w-fit rounded-lg bg-primary/10 p-1.5">
                  <Icon className="h-6 w-6 text-primary" aria-hidden />
                </span>
                <h3 className="font-marketing-display text-base leading-snug text-foreground">
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {'count' in p ? (
                    <>
                      {p.bodyBefore}
                      <CountUp value={p.count} />
                      {p.bodyAfter}
                    </>
                  ) : (
                    p.body
                  )}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
