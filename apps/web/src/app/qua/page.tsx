import type { Metadata } from 'next';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { StartupPath } from '@/components/home/StartupPath';
import { StreakCard } from '@/components/account/StreakCard';
import { ReferralCard } from '@/components/account/ReferralCard';

/**
 * /qua — "Quà & Lộ trình" rewards hub (Bitget's Rewards Center pattern,
 * surfaced as a single destination). Composes the existing pieces so they live
 * in one discoverable place: the onboarding path (StartupPath, for everyone)
 * plus the real rewards (StreakCard + ReferralCard — self-fetch, show once
 * signed in; they're the same components /account renders, so they style for
 * the light theme). No new reward economy — reuses streak + referral vouchers.
 */

export const metadata: Metadata = {
  title: 'Quà tặng & lộ trình cá nhân hoá',
  description:
    'Lộ trình khởi đầu miễn phí cùng phần thưởng thật trên hieu.asia: điểm danh mỗi ngày, mời bạn bè và nhận voucher giảm giá cho các gói trả phí.',
  alternates: { canonical: 'https://hieu.asia/qua' },
};

export default function QuaPage() {
  return (
    <>
      <SiteNav />
      <main id="main-content" className="min-h-screen bg-background pt-16 text-foreground">
        <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-16">
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-primary">
            Quà của bạn
          </span>
          <h1 className="mt-2 font-marketing-display text-3xl leading-tight text-foreground sm:text-4xl">
            Quà &amp; lộ trình — <span className="italic">làm tới đâu, mở tới đó</span>.
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Đi qua các bước miễn phí, điểm danh mỗi ngày, mời bạn — mỗi việc mở thêm một phần
            thưởng thật. Không điểm ảo, không thưởng giả.
          </p>
        </section>

        {/* Lộ trình khởi đầu — cho mọi người (chưa cần đăng nhập) */}
        <StartupPath />

        {/* Phần thưởng đang có — điểm danh + mời bạn (tự hiện khi đã đăng nhập) */}
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <StreakCard />
            <ReferralCard />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
