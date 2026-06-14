/**
 * /pricing — Wave 60.56 Phase 3.2 rebuild (Option D "Warm-Dark Editorial").
 *
 * Wave 62.05 — "Như giấy cũ" pricing simplification (vault 138). The 4-tier
 * grid (free + premium + mentor + lifetime, with mentor exposing a yearly
 * toggle) collapses to **3 primary anchors** (free + premium + mentor) +
 * an expandable "Tuỳ chọn nâng cao" section that holds yearly + lifetime.
 * Founder spec: "Pricing 5 bậc gây tê liệt lựa chọn ... quá nhiều SKU cho
 * một quyết định cảm xúc." The advanced tiers stay sellable — they just
 * stop competing for the buyer's attention above the fold.
 *
 * R1 verdict B applied: visual polish + reduce 5→3 anchors.
 *   - MarketingHero replaces the 4× pasted purple-radial hero block (R1 finding).
 *   - PricingTierV2 renders the 3 primary tiers; AdvancedOptions handles the
 *     yearly/lifetime expandable below the grid.
 *   - VN content-typed FAQ with explicit refund answer (canonical policy:
 *     "14 ngày cho mọi gói trả phí; Mentor tính từ kỳ thanh toán đầu tiên").
 *   - All raw `rgba(184,146,61,...)` strings removed (R1 finding).
 *   - `bg-background` on <main> to anchor Option D background tone.
 *
 * Old Wave 52-A 5-tier taxonomy (free/premium/monthly/yearly/lifetime) collapsed
 * to the 3-anchor model (free/premium/mentor); deep-link `?tier=` and `?session=`
 * params + Wave 52 wire-tier mapping are no longer relevant here — the new
 * PricingTierV2 CTAs link directly to `/checkout/{tier}` per the vault 105 §5.2
 * template. Survey + comparison table removed (PricingTierV2 has hybrid built-in).
 */

import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { FaqAccordion, type FaqItem } from '@/components/home/FaqAccordion';
import { MarketingHero } from '@/components/marketing/MarketingHero';
import { PricingTierV2 } from '@/components/marketing/PricingTierV2';
import { OrnamentDivider } from '@/components/marketing/OrnamentDivider';
import { TrustStrip } from '@/components/marketing/TrustStrip';
import {
  PRICING,
  ADVANCED_PRICING,
  formatVND,
  monthlyEquivalent,
  yearlyDiscount,
} from '@/lib/pricing';

const PRICING_FAQ: readonly FaqItem[] = [
  {
    q: 'Có hoàn tiền không?',
    a: (
      <p>
        Có. Nếu báo cáo không như mong đợi, nhắn founder qua Telegram trong
        vòng 14 ngày để được hoàn tiền 100% — không cần lý do. Gói miễn phí
        không áp dụng hoàn tiền. Mỗi yêu cầu được xử lý trong vòng 24 giờ.
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
        Gói <b>Premium</b> mở khoá ngay khi bạn lập lá số: quét mã QR chuyển
        khoản ngân hàng nội địa và báo cáo đầy đủ tự mở sau khi nhận được tiền.
        Các gói thuê bao <b>Mentor</b> (tháng / năm / trọn đời) cũng thanh toán
        bằng mã QR chuyển khoản ngay trên trang đăng ký — bạn chỉ cần đăng nhập
        để gói được gắn vào tài khoản, gói kích hoạt tự động sau khi nhận được
        tiền. Thẻ Visa/Mastercard và Apple Pay dự kiến bổ sung sau.
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

/**
 * Wave 62.05 — Tuỳ chọn nâng cao (Yearly + Lifetime).
 *
 * Native <details>/<summary> so we don't pay client-runtime cost for a
 * section most buyers never open. Two compact paper-corner cards inside;
 * both link to the same /checkout routes the legacy 5th/4th tiers did.
 *
 * Server component — no useState, no Link import needed for plain <a>.
 * Founder spec calls for "editorial corners" (rounded-[2px]) consistent
 * with the new PricingTierV2 card shape.
 */
function AdvancedOptions() {
  return (
    <section className="bg-background pb-12">
      <div className="mx-auto max-w-marketing px-6">
        <details className="group rounded-[2px] border border-border/60 bg-muted/30 transition-colors duration-300 ease-editorial open:border-border">
          <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 font-sans text-sm text-foreground/80 transition-colors hover:text-foreground md:px-8 [&::-webkit-details-marker]:hidden">
            <span className="flex flex-col gap-1">
              <span className="font-mono text-eyebrow uppercase tracking-wider text-primary">
                — Tuỳ chọn nâng cao
              </span>
              <span className="font-editorial-display text-lg font-normal text-foreground">
                Cam kết dài hơn, giá tốt hơn
              </span>
            </span>
            <span
              aria-hidden
              className="font-mono text-xs uppercase tracking-wider text-muted-foreground transition-transform duration-300 ease-editorial group-open:rotate-180"
            >
              ▾
            </span>
          </summary>

          <div className="grid gap-4 px-6 pb-8 md:grid-cols-2 md:px-8">
            {/* Yearly */}
            <article className="flex flex-col rounded-[2px] border border-border/60 bg-background p-6 md:p-8">
              <p className="font-mono text-eyebrow uppercase tracking-wider text-muted-foreground/70">
                MENTOR · NĂM
              </p>
              <h3 className="mt-3 font-editorial-display text-2xl font-normal tracking-tight text-foreground">
                Đồng hành cả năm
              </h3>
              <p className="mt-2 font-sans text-sm text-muted-foreground">
                Mentor không giới hạn — thanh toán một năm, tiết kiệm ~{yearlyDiscount()}% so với theo tháng.
              </p>
              <p className="mt-6 font-editorial-display text-price-amount text-foreground">
                {formatVND(PRICING.yearly.vnd)}{' '}
                <span className="text-muted-foreground/80">/ năm</span>
              </p>
              <p className="mt-1 font-sans text-xs text-muted-foreground/70">
                ≈ {formatVND(monthlyEquivalent(PRICING.yearly.vnd))} / tháng
              </p>
              <a
                href="/checkout/yearly"
                className="mt-6 inline-flex w-full items-center justify-center rounded-pill border border-border px-6 py-3 font-sans text-sm font-medium text-foreground transition-colors duration-300 ease-editorial hover:bg-card"
              >
                Chọn gói năm
              </a>
            </article>

            {/* Lifetime */}
            <article className="flex flex-col rounded-[2px] border border-border/60 bg-background p-6 md:p-8">
              <p className="font-mono text-eyebrow uppercase tracking-wider text-muted-foreground/70">
                LIFETIME · VĨNH VIỄN
              </p>
              <h3 className="mt-3 font-editorial-display text-2xl font-normal tracking-tight text-foreground">
                Trọn đời
              </h3>
              <p className="mt-2 font-sans text-sm text-muted-foreground">
                Một lần thanh toán — mở khóa Mentor mãi mãi, không gia hạn.
              </p>
              <p className="mt-6 font-editorial-display text-price-amount text-foreground">
                {formatVND(ADVANCED_PRICING.lifetime.vnd)}{' '}
                <span className="text-muted-foreground/80">/ một lần</span>
              </p>
              <p className="mt-1 font-sans text-xs text-muted-foreground/70">
                Tương đương ~25 tháng Mentor
              </p>
              <a
                href="/checkout/lifetime"
                className="mt-6 inline-flex w-full items-center justify-center rounded-pill border border-border px-6 py-3 font-sans text-sm font-medium text-foreground transition-colors duration-300 ease-editorial hover:bg-card"
              >
                Mua Lifetime
              </a>
            </article>
          </div>
        </details>
      </div>
    </section>
  );
}

export default function PricingPage() {
  return (
    <>
      <SiteNav />
      <main id="main-content" className="bg-background">
        <MarketingHero
          eyebrow="GÓI THÀNH VIÊN · 2026"
          title={
            <>
              Chọn gói phù hợp với{' '}
              <em className="italic text-primary/80">nhịp sống</em> của bạn
              <span className="text-primary">.</span>
            </>
          }
          subtitle="Bắt đầu miễn phí — chuyển gói khi sẵn sàng. Mọi gói trả phí đều bảo đảm hoàn tiền."
          primaryCta={{ label: 'Bắt đầu miễn phí', href: '/onboarding' }}
          trustLine="14 ngày hoàn tiền · Không cần thẻ trước"
        />

        <OrnamentDivider />

        <PricingTierV2
          eyebrow="GÓI"
          page="/pricing"
          title={
            <>
              Đi <em className="italic text-primary/80">sâu</em> theo nhịp của bạn
              <span className="text-primary">.</span>
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
              // Premium = "mở khoá lá số của bạn". There's no session in scope
              // here, so send the buyer through the natural funnel: lập lá số
              // miễn phí trước → cổng thanh toán QR mở ngay trên trang báo cáo
              // (luồng /unlock đang chạy). Tránh dẫn tới /checkout/premium (stub).
              ctaLabel: 'Lập lá số để mở khoá',
              ctaHref: '/onboarding',
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
              // Wave 62.05 — yearly toggle stripped from the primary card.
              // Yearly + Lifetime live below the grid in <AdvancedOptions/>;
              // putting them back in the card brings the decision-paralysis
              // problem we just fixed. Monthly stays as the single anchor.
              priceMonthly: PRICING.monthly.vnd,
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
          ]}
        />

        {/* Wave 62.05 — "Tuỳ chọn nâng cao" expandable. Yearly + Lifetime
            stay sellable but stop competing with the 3 primary anchors for
            attention. Native <details> = zero JS, accessible by default,
            collapses on mobile so the section adds ~24px when closed. */}
        <AdvancedOptions />

        {/* 1:1 founder session — a SEPARATE product from the AI Mentor
            subscription above (human 60-min consult vs unlimited AI). Surfaced
            discreetly so it's discoverable without competing with the 3
            self-serve tiers. Lives at /checkout/founder-1on1. */}
        <div className="mx-auto mt-6 max-w-marketing px-6 text-center">
          <p className="text-sm text-muted-foreground">
            Muốn đối thoại{' '}
            <strong className="font-medium text-foreground">
              1:1 trực tiếp 60 phút với founder
            </strong>{' '}
            về một quyết định cụ thể?{' '}
            <a
              href="/checkout/founder-1on1"
              className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
            >
              Xem buổi tư vấn riêng →
            </a>
          </p>
        </div>

        {/* Wave 60.79.T2 (vault 112 P1 #6): TrustStrip lifted FROM between
            hero and pricing tiers TO right after the tiers + before FAQ. The
            audit caught the strip sitting ~120px below the hero CTA in a dead
            zone; placing it AFTER conversion-decision-time reframes it as
            reinforcement ("you saw the prices, here's why it's safe") rather
            than pre-CTA filler. */}
        <section className="bg-background pt-4 pb-12">
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
      <StickyMobileCta label="Bắt đầu miễn phí" trackId="pricing" />
    </>
  );
}
