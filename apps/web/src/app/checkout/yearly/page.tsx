import Link from 'next/link';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { SubscriptionCheckout } from '@/components/checkout/SubscriptionCheckout';
import { formatVND, monthlyEquivalent, yearlyDiscount, PRICING } from '@/lib/pricing';

export const metadata = {
  title: 'Checkout Mentor năm',
  description: 'Hoàn tất đăng ký gói Mentor theo năm hieu.asia',
  robots: { index: false, follow: false },
};

/**
 * AI Mentor yearly subscription checkout (1.990.000đ/năm). Session-less QR
 * checkout: the plan attaches to the logged-in account, no reading required.
 */
export default function CheckoutYearlyPage() {
  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-background pt-24 text-foreground">
        <div className="container mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <header className="mb-6 flex items-center justify-between">
            <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
              <Link href="/" className="hover:text-gold">Trang chủ</Link>
              <span className="mx-1.5">/</span>
              <Link href="/pricing" className="hover:text-gold">Pricing</Link>
              <span className="mx-1.5">/</span>
              <span className="text-muted-foreground">Mentor năm</span>
            </nav>
            <Link
              href="/pricing"
              className="text-sm text-muted-foreground transition hover:text-gold"
            >
              ← Đổi gói
            </Link>
          </header>

          <div className="mb-6">
            <p className="font-mono text-xs uppercase tracking-wider text-primary">
              CHECKOUT · MENTOR NĂM
            </p>
            <h1 className="mt-2 font-heading text-2xl text-foreground">
              Mentor — đồng hành cả năm
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {formatVND(PRICING.yearly.vnd)} / năm (≈{' '}
              {formatVND(monthlyEquivalent(PRICING.yearly.vnd))} / tháng) — tiết
              kiệm ~{yearlyDiscount()}% so với theo tháng. Mentor AI không giới hạn,
              đại vận & lưu niên cả năm.
            </p>
          </div>

          <SubscriptionCheckout tier="subscription_yearly" />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
