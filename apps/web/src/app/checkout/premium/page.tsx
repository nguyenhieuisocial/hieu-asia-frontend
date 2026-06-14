import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Checkout Premium',
  description: 'Mở khoá gói Premium hieu.asia',
  robots: { index: false, follow: false },
};

/**
 * Premium ("mở khoá 1 lá số") is LIVE — it unlocks via the QR checkout on the
 * report page (luồng /unlock + FeaturePaywall, POST /api/payment/intent). There
 * is no session in scope at /checkout/premium, so instead of a "Sắp ra mắt"
 * dead-end we send the buyer through the natural funnel: lập lá số miễn phí
 * trước → cổng thanh toán mở ngay trên trang báo cáo. Keeps the money path
 * honest and actionable for anyone who lands here directly (SEO, bookmark).
 */
export default function CheckoutPremiumPage() {
  redirect('/onboarding');
}
