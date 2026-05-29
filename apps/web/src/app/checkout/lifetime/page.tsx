import { MarketingHero } from '@/components/marketing/MarketingHero';
import { SiteFooter } from '@/components/home/SiteFooter';

export const metadata = {
  title: 'Checkout Lifetime',
  description: 'Hoàn tất đăng ký gói Lifetime hieu.asia',
  robots: { index: false, follow: false },
};

/**
 * Wave 64.1 (audit 2026-05-29): the pricing "Tuỳ chọn nâng cao" card linked to
 * /checkout/lifetime but the route never existed → hard 404 on the highest-value
 * paid CTA. Mirror the premium/mentor "Sắp ra mắt" stub so it degrades gracefully
 * (coming-soon + founder Telegram) instead of 404.
 */
export default function CheckoutLifetimePage() {
  return (
    <>
      <MarketingHero
        eyebrow="CHECKOUT · LIFETIME"
        title={
          <>
            Sắp <em className="italic text-gold-soft">ra mắt Lifetime</em>
            <span className="text-gold-dot drop-shadow-[0_0_16px_rgba(229,198,138,0.18)]">.</span>
          </>
        }
        subtitle="Gói Lifetime — truy cập trọn đời toàn bộ tính năng Mentor, thanh toán một lần duy nhất. Đang hoàn thiện tích hợp thanh toán SePay + Stripe. Vui lòng quay lại sau, hoặc liên hệ trực tiếp founder để đăng ký sớm."
        primaryCta={{ label: 'Quay về bảng giá', href: '/pricing' }}
        secondaryCta={{ label: 'Liên hệ qua Telegram', href: 'https://t.me/nguyenhieuisocial' }}
        trustLine="Câu hỏi · founder phản hồi trong 4 giờ"
      />
      <SiteFooter />
    </>
  );
}
