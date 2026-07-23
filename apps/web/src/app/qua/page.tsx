import type { Metadata } from 'next';
import Link from 'next/link';
import { Gift, CalendarCheck, Users, Ticket, ArrowRight } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { StartupPath } from '@/components/home/StartupPath';
import { StreakCard } from '@/components/account/StreakCard';
import { ReferralCard } from '@/components/account/ReferralCard';

/**
 * /qua — "Quà & Lộ trình" rewards hub (Bitget's Rewards Center pattern).
 *
 * Layout (redesign 2026-07): centered hero + a 3-step "Làm → Nhận → Dùng" flow →
 * "3 cách nhận quà" cards (ALWAYS visible, so logged-out visitors don't hit an
 * empty page where the signed-in-only widgets would be) → StartupPath (everyone)
 * → "Phần thưởng của bạn" (StreakCard + ReferralCard, self-fetch, show once
 * signed in) → "Dùng voucher ở đâu" CTA. No new reward economy — reuses streak
 * + referral vouchers.
 */

export const metadata: Metadata = {
  title: 'Quà tặng & lộ trình cá nhân hoá',
  description:
    'Lộ trình khởi đầu miễn phí cùng phần thưởng thật trên hieu.asia: điểm danh mỗi ngày, mời bạn bè và nhận voucher giảm giá cho các gói trả phí.',
  alternates: { canonical: 'https://hieu.asia/qua' },
};

const WAYS = [
  {
    icon: Gift,
    title: 'Hoàn thành lộ trình khởi đầu',
    desc: 'Đi qua các bước miễn phí bên dưới — mỗi bước mở thêm một phần trải nghiệm.',
  },
  {
    icon: CalendarCheck,
    title: 'Điểm danh mỗi ngày',
    desc: 'Ghé đều mỗi ngày để giữ chuỗi và tích điểm đổi voucher.',
  },
  {
    icon: Users,
    title: 'Mời bạn bè',
    desc: 'Chia sẻ link của bạn — bạn và người được mời cùng nhận ưu đãi.',
  },
] as const;

export default function QuaPage() {
  return (
    <>
      <SiteNav />
      <main id="main-content" className="min-h-screen bg-background pt-16 text-foreground">
        {/* Hero — canh giữa + luồng 3 bước */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[360px] bg-[radial-gradient(ellipse_at_top,_rgba(184,146,61,0.14)_0%,_transparent_60%)]"
          />
          <div className="mx-auto max-w-3xl px-4 pt-14 pb-8 text-center sm:px-6 sm:pt-20">
            <span className="font-mono text-[13px] uppercase tracking-[0.12em] text-primary">
              Quà của bạn
            </span>
            <h1 className="mt-3 font-editorial-display text-3xl leading-tight text-foreground sm:text-5xl">
              Làm tới đâu,{' '}
              <span className="bg-gold-gradient bg-clip-text italic text-transparent">
                mở quà tới đó
              </span>
              .
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground sm:text-lg">
              Không điểm ảo, không thưởng giả — mỗi việc bạn làm mở thêm một phần thưởng thật:
              voucher giảm giá cho các gói trả phí.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 font-mono text-xs text-muted-foreground">
              <span className="rounded-full border border-border px-3 py-1">Làm việc</span>
              <ArrowRight className="h-3.5 w-3.5 text-gold/70" aria-hidden="true" />
              <span className="rounded-full border border-border px-3 py-1">Nhận quà</span>
              <ArrowRight className="h-3.5 w-3.5 text-gold/70" aria-hidden="true" />
              <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-gold-700">
                Dùng voucher
              </span>
            </div>
          </div>
        </section>

        {/* 3 cách nhận quà — luôn hiện (kể cả khách chưa đăng nhập) */}
        <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {WAYS.map((w) => {
              const Icon = w.icon;
              return (
                <div
                  key={w.title}
                  className="rounded-2xl border border-border bg-card/40 p-5 transition-colors hover:border-gold/40"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h2 className="mt-4 font-heading text-base font-semibold text-foreground">
                    {w.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{w.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Lộ trình khởi đầu — cho mọi người (chưa cần đăng nhập) */}
        <StartupPath />

        {/* Phần thưởng của bạn — điểm danh + mời bạn (tự hiện khi đã đăng nhập) */}
        <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
          <h2 className="mb-4 font-heading text-xl font-bold text-foreground sm:text-2xl">
            Phần thưởng của bạn
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <StreakCard />
            <ReferralCard />
          </div>
        </section>

        {/* Dùng voucher ở đâu + lối đi tiếp */}
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <Ticket className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
                  Dùng voucher ở đâu?
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Voucher giảm thẳng vào các gói trả phí khi bạn sẵn sàng. Chưa vội — phần lớn công
                  cụ đã miễn phí.
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/cong-cu"
                className="inline-flex items-center gap-1.5 rounded-lg bg-gold-gradient px-5 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.02]"
              >
                Khám phá công cụ →
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-gold"
              >
                Xem các gói &amp; dùng voucher →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
