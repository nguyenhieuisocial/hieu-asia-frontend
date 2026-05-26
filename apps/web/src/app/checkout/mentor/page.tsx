import { MarketingHero } from '@/components/marketing/MarketingHero';

export const metadata = {
  title: 'Checkout Mentor · hieu.asia',
  description: 'Hoàn tất đăng ký gói Mentor 1:1 hieu.asia',
};

export default function CheckoutMentorPage() {
  return (
    <MarketingHero
      eyebrow="CHECKOUT · MENTOR"
      title={
        <>
          Sắp <em className="italic text-gold-soft">ra mắt mentor</em>
          <span className="text-gold-dot drop-shadow-[0_0_16px_rgba(229,198,138,0.18)]">.</span>
        </>
      }
      subtitle="Mentor 1:1 với founder đang mở slot có giới hạn. Vui lòng liên hệ trực tiếp qua Telegram để đặt lịch tư vấn và thanh toán thủ công."
      primaryCta={{ label: 'Quay về bảng giá', href: '/pricing' }}
      secondaryCta={{ label: 'Liên hệ qua Telegram', href: 'https://t.me/nguyenhieuisocial' }}
      trustLine="Slot mentor · founder phản hồi trong 4 giờ"
    />
  );
}
