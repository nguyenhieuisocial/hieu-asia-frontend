import { MarketingHero } from '@/components/marketing/MarketingHero';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';

export const metadata = {
  title: 'Tư vấn 1:1 với founder',
  description: 'Đặt lịch buổi đối thoại 1:1 60 phút với founder hieu.asia',
  robots: { index: false, follow: false },
};

/**
 * 1:1 founder session — a SEPARATE premium offering from the AI Mentor
 * subscription (/checkout/mentor). Human 60-min consult, slot-limited,
 * manual scheduling + payment via Telegram. Surfaced from /pricing via a
 * discreet link below the tier grid. (Was previously the copy on
 * /checkout/mentor, which mis-served the AI-Mentor tier funnel.)
 */
export default function CheckoutFounder1on1Page() {
  return (
    <>
      <SiteNav />
      <MarketingHero
        eyebrow="TƯ VẤN 1:1 · FOUNDER"
        title={
          <>
            Đối thoại <em className="italic text-gold-soft">1:1</em>
            <span className="text-gold-dot drop-shadow-[0_0_16px_rgba(229,198,138,0.18)]">.</span>
          </>
        }
        subtitle="Mentor 1:1 với founder — 60 phút đối thoại sâu về quyết định bạn đang cân nhắc, dựa trên lá số của bạn. Slot có giới hạn theo tuần. Liên hệ qua Telegram để đặt lịch tư vấn và thanh toán thủ công."
        primaryCta={{ label: 'Đặt lịch qua Telegram', href: 'https://t.me/nguyenhieuisocial' }}
        secondaryCta={{ label: 'Quay về bảng giá', href: '/pricing' }}
        trustLine="Slot giới hạn · founder phản hồi trong 4 giờ"
      />
      <SiteFooter />
    </>
  );
}
