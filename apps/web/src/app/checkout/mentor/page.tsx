import Link from 'next/link';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { SubscriptionCheckout } from '@/components/checkout/SubscriptionCheckout';
import { formatVND, PRICING } from '@/lib/pricing';

export const metadata = {
  title: 'Checkout Mentor AI',
  description: 'Hoàn tất đăng ký gói Mentor AI không giới hạn hieu.asia',
  robots: { index: false, follow: false },
};

/**
 * AI Mentor monthly subscription checkout (199.000đ/tháng). Session-less QR
 * checkout: the plan attaches to the logged-in account, no reading required.
 * The 1:1-with-founder human consult is a SEPARATE product at
 * /checkout/founder-1on1 — do not conflate the two.
 */
export default function CheckoutMentorPage() {
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
              <span className="text-muted-foreground">Mentor AI</span>
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
              CHECKOUT · MENTOR AI
            </p>
            <h1 className="mt-2 font-heading text-2xl text-foreground">
              Mentor AI không giới hạn
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {formatVND(PRICING.monthly.vnd)} / tháng — hỏi AI thoải mái về quyết
              định của bạn, kèm đại vận và lưu niên hàng năm. Huỷ bất cứ lúc nào.
            </p>
          </div>

          <SubscriptionCheckout tier="subscription_monthly" />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
