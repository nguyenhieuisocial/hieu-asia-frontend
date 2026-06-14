import Link from 'next/link';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { SubscriptionCheckout } from '@/components/checkout/SubscriptionCheckout';
import { formatVND, ADVANCED_PRICING } from '@/lib/pricing';

export const metadata = {
  title: 'Checkout Lifetime',
  description: 'Hoàn tất đăng ký gói Lifetime hieu.asia',
  robots: { index: false, follow: false },
};

/**
 * Lifetime one-time checkout (4.990.000đ). Session-less QR checkout: the plan
 * attaches to the logged-in account forever, no reading required.
 */
export default function CheckoutLifetimePage() {
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
              <span className="text-muted-foreground">Lifetime</span>
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
              CHECKOUT · LIFETIME
            </p>
            <h1 className="mt-2 font-heading text-2xl text-foreground">
              Lifetime — trọn đời
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {formatVND(ADVANCED_PRICING.lifetime.vnd)} / một lần — mở khóa toàn
              bộ tính năng Mentor mãi mãi, không gia hạn.
            </p>
          </div>

          <SubscriptionCheckout tier="lifetime_onetime" />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
