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
        Premium cho bạn bốn ống kính đầy đủ (Tử Vi · Bát Tự · MBTI · Thần Số Học)
        không giới hạn, nhật ký nội tâm có A.I phản chiếu, và xuất PDF chia sẻ.
        Mentor là Premium <b>cộng thêm</b> một buổi 1-1 video 60 phút với chuyên
        gia mỗi quý, hỗ trợ ưu tiên trong 4 giờ, và bản luận giải năm in thành
        sách giấy gửi tận nhà.
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
              description: 'Một lát cắt đầu — đủ để cảm nhận giọng nói.',
              priceMonthly: 0,
              features: [
                '1 ống kính / tháng',
                'Luận giải tóm tắt',
                'Lưu 30 ngày gần nhất',
              ],
              ctaLabel: 'Bắt đầu miễn phí',
              ctaHref: '/onboarding',
            },
            {
              id: 'premium',
              name: 'PREMIUM',
              nameDisplay: 'Đối thoại',
              description: 'Bốn ống kính đầy đủ — đi sâu, đi đều, đi dài.',
              priceMonthly: 199000,
              priceYearly: 1990000,
              yearlyDiscount: 'Tiết kiệm 20%',
              features: [
                '4 ống kính, không giới hạn',
                'Luận giải sâu, có ngữ cảnh',
                'Nhật ký nội tâm có A.I phản chiếu',
                'Xuất PDF chia sẻ',
              ],
              ctaLabel: 'Chọn Premium',
              ctaHref: '/checkout/premium',
              primary: true,
              recommended: true,
              refundDays: 30,
            },
            {
              id: 'mentor',
              name: 'MENTOR',
              nameDisplay: 'Đồng hành',
              description:
                'Premium + một cuộc hẹn 1-1 với chuyên gia mỗi quý.',
              priceMonthly: 499000,
              features: [
                'Toàn bộ tính năng Premium',
                '1 buổi 1-1 video / quý (60 phút)',
                'Ưu tiên hỗ trợ trong 4 giờ',
                'Bản luận giải năm dạng sách in',
              ],
              ctaLabel: 'Chọn Mentor',
              ctaHref: '/checkout/mentor',
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
