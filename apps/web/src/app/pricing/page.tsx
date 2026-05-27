/**
 * /pricing — Wave 60.56 Phase 3.2 rebuild (Option D "Warm-Dark Editorial").
 *
 * R1 verdict B applied: visual polish + reduce 5→3 anchors.
 *   - MarketingHero replaces the 4× pasted purple-radial hero block (R1 finding).
 *   - PricingTierV2 replaces the 5-tier Stripe-template row (3 tiers + Monthly/
 *     Yearly toggle + "KHUYÊN DÙNG" gold badge + 30-day refund slot).
 *   - VN content-typed FAQ with explicit refund answer (Q3 founder approval:
 *     "3 ngày tháng / 30 ngày năm").
 *   - All raw `rgba(184,146,61,...)` strings removed (R1 finding).
 *   - `bg-warm-dark-50` on <main> to anchor Option D background tone.
 *
 * Old Wave 52-A 5-tier taxonomy (free/premium/monthly/yearly/lifetime) collapsed
 * to the 3-anchor model (free/premium/mentor); deep-link `?tier=` and `?session=`
 * params + Wave 52 wire-tier mapping are no longer relevant here — the new
 * PricingTierV2 CTAs link directly to `/checkout/{tier}` per the vault 105 §5.2
 * template. Survey + comparison table removed (PricingTierV2 has hybrid built-in).
 */

import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { FaqAccordion, type FaqItem } from '@/components/home/FaqAccordion';
import { MarketingHero } from '@/components/marketing/MarketingHero';
import { PricingTierV2 } from '@/components/marketing/PricingTierV2';
import { OrnamentDivider } from '@/components/marketing/OrnamentDivider';
import { TrustStrip } from '@/components/marketing/TrustStrip';
import { PRICING } from '@/lib/pricing';

const PRICING_FAQ: readonly FaqItem[] = [
  {
    q: 'Có hoàn tiền không?',
    a: (
      <p>
        Có. Gói tháng: 3 ngày đầu hoàn 100%. Gói năm: 30 ngày đầu hoàn 100%.
        Không cần lý do — gửi email là được xử lý trong vòng 3 ngày làm việc.
      </p>
    ),
  },
  {
    q: 'Mentor có gì khác so với Premium?',
    a: (
      <p>
        <b>Premium 99.000đ một lần</b> cho bạn một lá số Tử Vi đầy đủ, PDF báo
        cáo và 3 câu hỏi với AI Mentor — phù hợp khi bạn cần báo cáo trọn vẹn
        một lần. <b>Mentor 199.000đ/tháng</b> (hoặc 1.990.000đ/năm) mở khóa AI
        Mentor không giới hạn, đại vận và lưu niên hàng năm — phù hợp khi bạn
        muốn đồng hành dài hạn.
      </p>
    ),
  },
  {
    q: 'Có thể chuyển gói không?',
    a: (
      <p>
        Có. Khi nâng cấp, chúng tôi tính prorate phần còn lại của kỳ hiện tại
        — bạn chỉ trả phần chênh. Khi hạ cấp, thay đổi áp dụng từ kỳ thanh toán
        kế tiếp; phần đã trả của kỳ hiện tại không bị mất.
      </p>
    ),
  },
  {
    q: 'Phương thức thanh toán nào được hỗ trợ?',
    a: (
      <p>
        Hiện tại: chuyển khoản ngân hàng nội địa Việt Nam (xác nhận tự động sau
        5-10 giây). Sắp tới: thẻ Visa/Mastercard và Apple Pay.
      </p>
    ),
  },
  {
    q: 'Dữ liệu cá nhân của tôi được bảo vệ thế nào?',
    a: (
      <p>
        Lá số và nhật ký nội tâm được mã hoá khi lưu trữ. Chúng tôi không bán
        dữ liệu, không dùng để huấn luyện mô hình của bên thứ ba, và bạn có
        thể xoá toàn bộ tài khoản bất cứ lúc nào — dữ liệu bị xoá vĩnh viễn
        trong vòng 30 ngày.
      </p>
    ),
  },
];

export default function PricingPage() {
  return (
    <>
      <SiteNav />
      <main id="main-content" className="bg-warm-dark-50">
        <MarketingHero
          eyebrow="GÓI THÀNH VIÊN · 2026"
          title={
            <>
              Chọn gói phù hợp với{' '}
              <em className="italic text-gold-soft">nhịp sống</em> của bạn
              <span className="text-gold-dot">.</span>
            </>
          }
          subtitle="Bắt đầu miễn phí — chuyển gói khi sẵn sàng. Mọi gói trả phí đều bảo đảm hoàn tiền."
          primaryCta={{ label: 'Bắt đầu miễn phí', href: '/onboarding' }}
          trustLine="30 ngày hoàn tiền · Không cần thẻ trước"
        />

        <OrnamentDivider />

        <PricingTierV2
          eyebrow="GÓI"
          page="/pricing"
          title={
            <>
              Đi <em className="italic text-gold-soft">sâu</em> theo nhịp của bạn
              <span className="text-gold-dot">.</span>
            </>
          }
          tiers={[
            {
              id: 'free',
              name: 'MIỄN PHÍ',
              nameDisplay: 'Khởi đầu',
              description: 'Khảo sát đầu vào và 6 công cụ tra cứu — không cần thẻ.',
              priceMonthly: PRICING.standard.vnd,
              bestFor:
                'bạn muốn thử công cụ và xem tổng quan trước khi quyết định.',
              features: [
                'Khảo sát đầu vào',
                '6 công cụ tra cứu cơ bản',
                'Tử Vi · Bát Tự · MBTI · Thần Số',
                'Lưu hồ sơ cá nhân',
              ],
              ctaLabel: 'Bắt đầu miễn phí',
              ctaHref: '/onboarding',
            },
            {
              id: 'premium',
              name: 'PREMIUM · 1 LÁ SỐ',
              nameDisplay: 'Đối thoại',
              description: 'Một lá số đầy đủ kèm PDF và 3 câu hỏi Mentor AI.',
              priceMonthly: PRICING.premium.vnd,
              // Wave 60.95.a — Premium is one-time (vault 81 V1 postmortem +
              // canonical PRICING). Was previously mis-rendered as a 199.000₫/
              // tháng subscription which caused the homepage ↔ /pricing
              // mismatch flagged in the founder audit.
              priceUnit: 'một lần',
              bestFor:
                'bạn muốn báo cáo đầy đủ một lần + PDF để giữ lại.',
              features: [
                'Một lá số Tử Vi đầy đủ',
                'PDF báo cáo có thể tải về',
                '3 câu hỏi với AI Mentor',
                'Lưu trữ vĩnh viễn trong tài khoản',
              ],
              ctaLabel: 'Mở khóa 1 lá số',
              ctaHref: '/checkout/premium',
              primary: true,
              recommended: true,
              refundDays: 14,
            },
            {
              id: 'mentor',
              name: 'MENTOR · KHÔNG GIỚI HẠN',
              nameDisplay: 'Đồng hành',
              description:
                'Mentor AI không giới hạn, đại vận và lưu niên hàng năm.',
              priceMonthly: PRICING.monthly.vnd,
              priceYearly: PRICING.yearly.vnd,
              yearlyDiscount: 'Tiết kiệm ~17%',
              bestFor:
                'bạn thường xuyên hỏi về quyết định, công việc, quan hệ, kế hoạch năm.',
              features: [
                'Mentor AI không giới hạn câu hỏi',
                'Đại vận và lưu niên hàng năm',
                'Tất cả 4 ống kính sâu',
                'Huỷ bất cứ lúc nào',
              ],
              ctaLabel: 'Dùng Mentor không giới hạn',
              ctaHref: '/checkout/mentor',
              refundDays: 14,
            },
            {
              id: 'lifetime',
              name: 'LIFETIME · VĨNH VIỄN',
              nameDisplay: 'Trọn đời',
              description:
                'Mở khóa Mentor không giới hạn — vĩnh viễn, không phí định kỳ.',
              priceMonthly: PRICING.lifetime.vnd,
              priceUnit: 'một lần',
              bestFor:
                'bạn muốn truy cập mọi tính năng dài hạn không lo phí định kỳ.',
              features: [
                'Toàn bộ tính năng Mentor không giới hạn',
                'Truy cập trọn đời, không gia hạn',
                'Ưu tiên hỗ trợ trong 24 giờ',
                'Cập nhật tính năng mới miễn phí',
              ],
              ctaLabel: 'Mua Lifetime',
              ctaHref: '/checkout/lifetime',
              refundDays: 14,
            },
          ]}
        />

        {/* Wave 60.79.T2 (vault 112 P1 #6): TrustStrip lifted FROM between
            hero and pricing tiers TO right after the tiers + before FAQ. The
            audit caught the strip sitting ~120px below the hero CTA in a dead
            zone; placing it AFTER conversion-decision-time reframes it as
            reinforcement ("you saw the prices, here's why it's safe") rather
            than pre-CTA filler. */}
        <section className="bg-warm-dark-50 pt-4 pb-12">
          <div className="mx-auto max-w-marketing px-6">
            <TrustStrip />
          </div>
        </section>

        <OrnamentDivider />

        <FaqAccordion
          items={PRICING_FAQ}
          id="pricing-faq"
          eyebrow="FAQ Pricing"
          title="Câu hỏi về thanh toán"
        />
      </main>
      <SiteFooter />
    </>
  );
}
