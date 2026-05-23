import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@hieu-asia/ui';
import { PRICING, formatVND, monthlyEquivalent, yearlyDiscount } from '@/lib/pricing';

/**
 * Compact pricing teaser for the home page.
 *
 * Mirrors `/pricing` (4 visible tiers: Free, Premium one-time, Mentor Monthly,
 * Mentor Yearly) and deep-links to /pricing for Lifetime + full comparison.
 * All numbers come from `lib/pricing.ts` so the homepage can never drift from
 * the canonical pricing.
 */

interface TeaserTier {
  id: 'free' | 'premium' | 'monthly' | 'yearly';
  name: string;
  price: string;
  cadence: string;
  /** Optional secondary line under the price (e.g. monthly equivalent for yearly). */
  subline?: string;
  pitch: string;
  features: readonly string[];
  highlighted?: boolean;
  /** Small recommendation badge shown above the card (overrides default "Phổ biến nhất"). */
  badge?: string;
  ctaHref: string;
  ctaLabel: string;
}

const SAVE_PERCENT = yearlyDiscount();
const YEARLY_PER_MONTH = monthlyEquivalent(PRICING.yearly.vnd);

const TIERS: readonly TeaserTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: PRICING.standard.label,
    cadence: '',
    pitch: 'Khám phá nền tảng trước khi cam kết.',
    features: ['Khảo sát đầu vào', '6 công cụ miễn phí', 'Tử Vi rút gọn'],
    ctaHref: '/onboarding',
    ctaLabel: 'Bắt đầu miễn phí',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: formatVND(PRICING.premium.vnd),
    cadence: 'một lần',
    pitch: 'Một lá số đầy đủ, không tự gia hạn.',
    features: [
      'Lá số 114 sao (Tử Vi) + 4 trụ Bát Tự',
      'Thần Số Học + đại vận 12 tháng',
      '3 câu hỏi Mentor',
      'PDF Cẩm Nang 15–20 trang',
    ],
    ctaHref: '/pricing?tier=premium',
    ctaLabel: 'Chọn Premium',
  },
  {
    id: 'monthly',
    name: 'Mentor Monthly',
    price: formatVND(PRICING.monthly.vnd),
    cadence: '/ tháng',
    pitch: 'Mentor không giới hạn — phổ biến nhất.',
    features: [
      'Lá số đầy đủ + Palm Reading',
      'Mentor AI không giới hạn',
      'Đại vận & lưu niên',
      'PDF Cẩm Nang xuất bản',
    ],
    highlighted: true,
    badge: 'Phổ biến nhất — thử 1 tháng',
    ctaHref: '/pricing?tier=premium&period=monthly',
    ctaLabel: 'Chọn gói tháng',
  },
  {
    id: 'yearly',
    name: 'Mentor Yearly',
    price: formatVND(PRICING.yearly.vnd),
    cadence: '/ năm',
    subline: `~${formatVND(YEARLY_PER_MONTH)} / tháng · tiết kiệm ${SAVE_PERCENT}%`,
    pitch: 'Trả 1 lần, dùng cả năm — rẻ hơn 17%.',
    features: [
      'Mọi tính năng của Monthly',
      `Tiết kiệm ${SAVE_PERCENT}% so với gói tháng`,
      'Tương đương 2 tháng miễn phí',
    ],
    badge: `Tiết kiệm ${SAVE_PERCENT}% · gói khuyến nghị`,
    ctaHref: '/pricing?tier=premium&period=annual',
    ctaLabel: 'Chọn gói năm',
  },
];

export function PricingTeaser() {
  return (
    <section
      id="pricing-teaser"
      aria-labelledby="pricing-teaser-heading"
      className="relative border-y border-border bg-background py-20 scroll-mt-24 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold/80 sm:text-xs">
            Pricing · hoàn tiền 100% trong 24h
          </p>
          <h2
            id="pricing-teaser-heading"
            className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl"
          >
            Chọn mức độ{' '}
            <span className="bg-gold-gradient bg-clip-text text-transparent">
              đồng hành phù hợp
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Khảo sát đầu vào miễn phí. Bạn chỉ thanh toán khi muốn mở khoá luận
            giải đầy đủ hoặc Mentor cá nhân hoá. Hoàn tiền 100% trong 24 giờ
            nếu báo cáo chưa được tạo.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((tier) => (
            <article
              key={tier.id}
              className={[
                'relative flex flex-col rounded-2xl border p-6',
                tier.highlighted
                  ? 'border-gold/60 bg-gradient-to-b from-gold/[0.06] to-transparent shadow-[0_0_60px_-20px_rgba(184,146,61,0.5)] lg:-translate-y-2'
                  : 'border-border bg-card/40',
              ].join(' ')}
            >
              {tier.badge && (
                <span
                  className={[
                    'absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] whitespace-nowrap',
                    tier.highlighted
                      ? 'bg-gold text-ink'
                      : 'border border-gold/40 bg-card text-gold',
                  ].join(' ')}
                >
                  {tier.badge}
                </span>
              )}
              <h3 className="font-heading text-lg font-semibold text-foreground">{tier.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{tier.pitch}</p>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="font-heading text-3xl font-bold text-foreground">{tier.price}</span>
                {tier.cadence && (
                  <span className="text-sm text-muted-foreground">{tier.cadence}</span>
                )}
              </div>
              {tier.subline && (
                <p className="mt-1 text-xs text-muted-foreground">{tier.subline}</p>
              )}
              <ul className="mt-5 flex-1 space-y-2 text-sm">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-foreground/80">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button asChild
                  variant={tier.highlighted ? 'default' : 'outline'}
                  className="w-full"
                ><Link href={tier.ctaHref} className="mt-6">
                
                  {tier.ctaLabel}
                
              </Link></Button>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-gold"
          >
            Xem 5 gói (kèm Lifetime {formatVND(PRICING.lifetime.vnd)}) · So sánh đầy đủ tính năng
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
