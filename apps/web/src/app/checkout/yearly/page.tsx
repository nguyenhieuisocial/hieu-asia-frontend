import { MarketingHero } from '@/components/marketing/MarketingHero';
import { SiteFooter } from '@/components/home/SiteFooter';

export const metadata = {
  title: 'Checkout Mentor năm',
  description: 'Hoàn tất đăng ký gói Mentor theo năm hieu.asia',
  robots: { index: false, follow: false },
};

/**
 * Wave 64.1 (audit 2026-05-29): the pricing "Tuỳ chọn nâng cao" card linked to
 * /checkout/yearly but the route never existed → hard 404 on a paid CTA. Mirror
 * the premium/mentor "Sắp ra mắt" stub so the deeper-commitment CTA degrades
 * gracefully (coming-soon + founder Telegram) instead of 404.
 */
export default function CheckoutYearlyPage() {
  return (
    <>
      <MarketingHero
        eyebrow="CHECKOUT · MENTOR NĂM"
        title={
          <>
            Sắp <em className="italic text-gold-soft">ra mắt gói năm</em>
            <span className="text-gold-dot drop-shadow-[0_0_16px_rgba(229,198,138,0.18)]">.</span>
          </>
        }
        subtitle="Gói Mentor thanh toán theo năm — tiết kiệm đáng kể so với theo tháng, Mentor AI không giới hạn cùng đại vận & lưu niên cả năm. Đang hoàn thiện tích hợp thanh toán SePay + Stripe. Vui lòng quay lại sau, hoặc liên hệ trực tiếp founder để đăng ký sớm."
        primaryCta={{ label: 'Quay về bảng giá', href: '/pricing' }}
        secondaryCta={{ label: 'Liên hệ qua Telegram', href: 'https://t.me/nguyenhieuisocial' }}
        trustLine="Câu hỏi · founder phản hồi trong 4 giờ"
      />
      <SiteFooter />
    </>
  );
}
