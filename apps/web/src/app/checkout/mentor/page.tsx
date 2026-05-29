import { MarketingHero } from '@/components/marketing/MarketingHero';
import { SiteFooter } from '@/components/home/SiteFooter';

export const metadata = {
  title: 'Checkout Mentor AI',
  description: 'Hoàn tất đăng ký gói Mentor AI không giới hạn hieu.asia',
  robots: { index: false, follow: false },
};

/**
 * AI Mentor subscription checkout (199.000đ/tháng) — the /pricing "Mentor"
 * tier ("Dùng Mentor không giới hạn") links here, so the copy MUST describe
 * the unlimited-AI product, not the human session. Payment integration
 * (SePay + Stripe) in progress. The 1:1-with-founder human consult is a
 * SEPARATE product at /checkout/founder-1on1 — do not conflate the two.
 */
export default function CheckoutMentorPage() {
  return (
    <>
      <MarketingHero
        eyebrow="CHECKOUT · MENTOR AI"
        title={
          <>
            Sắp <em className="italic text-gold-soft">ra mắt</em>
            <span className="text-gold-dot drop-shadow-[0_0_16px_rgba(229,198,138,0.18)]">.</span>
          </>
        }
        subtitle="Đang hoàn thiện tích hợp thanh toán SePay + Stripe cho gói Mentor AI không giới hạn — hỏi AI thoải mái về quyết định của bạn, kèm đại vận và lưu niên hàng năm. Vui lòng quay lại sau, hoặc liên hệ trực tiếp founder để đăng ký Mentor sớm."
        primaryCta={{ label: 'Quay về bảng giá', href: '/pricing' }}
        secondaryCta={{ label: 'Liên hệ qua Telegram', href: 'https://t.me/nguyenhieuisocial' }}
        trustLine="Câu hỏi · founder phản hồi trong 4 giờ"
      />
      <SiteFooter />
    </>
  );
}
