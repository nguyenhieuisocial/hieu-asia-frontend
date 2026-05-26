import { MarketingHero } from '@/components/marketing/MarketingHero';

export const metadata = {
  title: 'Checkout Premium · hieu.asia',
  description: 'Hoàn tất đăng ký gói Premium hieu.asia',
};

export default function CheckoutPremiumPage() {
  return (
    <MarketingHero
      eyebrow="CHECKOUT · PREMIUM"
      title={
        <>
          Sắp <em className="italic text-gold-soft">ra mắt</em>
          <span className="text-gold-dot drop-shadow-[0_0_16px_rgba(229,198,138,0.18)]">.</span>
        </>
      }
      subtitle="Đang hoàn thiện tích hợp thanh toán SePay + Stripe. Vui lòng quay lại sau, hoặc liên hệ trực tiếp founder để đăng ký Premium sớm."
      primaryCta={{ label: 'Quay về bảng giá', href: '/pricing' }}
      secondaryCta={{ label: 'Liên hệ qua Telegram', href: 'https://t.me/nguyenhieuisocial' }}
      trustLine="Câu hỏi · founder phản hồi trong 4 giờ"
    />
  );
}
