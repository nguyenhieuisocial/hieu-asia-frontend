import { MarketingHero } from '@/components/marketing/MarketingHero';
import { SiteFooter } from '@/components/home/SiteFooter';

export const metadata = {
  title: 'Checkout Mentor',
  description: 'Hoàn tất đăng ký gói Mentor 1:1 hieu.asia',
};

/**
 * Wave 60.79.T1 (vault 112 P0-08): wrap hero + SiteFooter so the page isn't a
 * half-empty viewport. Mentor-specific copy differentiates from Premium: this
 * is human 1:1 with founder, slot-limited, manual scheduling.
 */
export default function CheckoutMentorPage() {
  return (
    <>
      <MarketingHero
        eyebrow="CHECKOUT · MENTOR"
        title={
          <>
            Sắp <em className="italic text-gold-soft">ra mắt mentor</em>
            <span className="text-gold-dot drop-shadow-[0_0_16px_rgba(229,198,138,0.18)]">.</span>
          </>
        }
        subtitle="Mentor 1:1 với founder — 60 phút đối thoại sâu về quyết định bạn đang cân nhắc, dựa trên lá số của bạn. Slot có giới hạn theo tuần. Vui lòng liên hệ qua Telegram để đặt lịch tư vấn và thanh toán thủ công."
        primaryCta={{ label: 'Quay về bảng giá', href: '/pricing' }}
        secondaryCta={{ label: 'Liên hệ qua Telegram', href: 'https://t.me/nguyenhieuisocial' }}
        trustLine="Slot mentor · founder phản hồi trong 4 giờ"
      />
      <SiteFooter />
    </>
  );
}
