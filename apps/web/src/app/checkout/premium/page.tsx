import { MarketingHero } from '@/components/marketing/MarketingHero';
import { SiteFooter } from '@/components/home/SiteFooter';

export const metadata = {
  title: 'Checkout Premium',
  description: 'Hoàn tất đăng ký gói Premium hieu.asia',
  robots: { index: false, follow: false },
};

/**
 * Wave 60.79.T1 (vault 112 P0-08): wrap hero in fragment + SiteFooter so the
 * "Sắp ra mắt" page isn't a half-empty viewport. Premium-specific copy nudges
 * founder Telegram with concrete promise ("phản hồi trong 4 giờ").
 */
export default function CheckoutPremiumPage() {
  return (
    <>
      <MarketingHero
        eyebrow="CHECKOUT · PREMIUM"
        title={
          <>
            Sắp <em className="italic text-gold-soft">ra mắt</em>
            <span className="text-gold-dot drop-shadow-[0_0_16px_rgba(229,198,138,0.18)]">.</span>
          </>
        }
        subtitle="Đang hoàn thiện tích hợp thanh toán SePay + Stripe cho gói Premium (báo cáo PDF, Tử Vi hôm nay, Đại vận lưu niên). Vui lòng quay lại sau, hoặc liên hệ trực tiếp founder để đăng ký Premium sớm."
        primaryCta={{ label: 'Quay về bảng giá', href: '/pricing' }}
        secondaryCta={{ label: 'Liên hệ qua Telegram', href: 'https://t.me/nguyenhieuisocial' }}
        trustLine="Câu hỏi · founder phản hồi trong 4 giờ"
      />
      <SiteFooter />
    </>
  );
}
