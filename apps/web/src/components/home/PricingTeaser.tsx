import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@hieu-asia/ui';

/**
 * Compact 3-tier pricing teaser for the home page.
 *
 * Mirrors `/pricing` but trimmed — drops Lifetime row + comparison table.
 * Premium gets the gold spotlight; deep-link to full pricing for nuance.
 */

interface TeaserTier {
  id: 'free' | 'standard' | 'premium';
  name: string;
  price: string;
  cadence: string;
  pitch: string;
  features: readonly string[];
  highlighted?: boolean;
  ctaHref: string;
  ctaLabel: string;
}

const TIERS: readonly TeaserTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 'Miễn phí',
    cadence: '',
    pitch: 'Khám phá nền tảng trước khi cam kết.',
    features: ['Khảo sát đầu vào', '6 công cụ miễn phí', 'Tử Vi rút gọn'],
    ctaHref: '/onboarding',
    ctaLabel: 'Bắt đầu miễn phí',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '199.000₫',
    cadence: '/ tháng',
    pitch: 'Mentor không giới hạn — phổ biến nhất.',
    features: [
      'Lá số đầy đủ + Palm Reading',
      'Mentor AI không giới hạn',
      'Đại vận & lưu niên',
      'PDF Cẩm Nang xuất bản',
    ],
    highlighted: true,
    ctaHref: '/pricing?tier=premium',
    ctaLabel: 'Chọn Premium',
  },
  {
    id: 'standard',
    name: 'Standard',
    price: '99.000₫',
    cadence: 'một lần',
    pitch: 'Một lá số đầy đủ, không tự gia hạn.',
    features: ['1 lá số đầy đủ', '3 câu hỏi Mentor', 'PDF Cẩm Nang'],
    ctaHref: '/pricing?tier=standard',
    ctaLabel: 'Chọn Standard',
  },
];

export function PricingTeaser() {
  return (
    <section
      id="pricing-teaser"
      aria-labelledby="pricing-teaser-heading"
      className="relative border-y border-cream/5 bg-ink py-20 scroll-mt-24 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold/80 sm:text-xs">
            Pricing · hoàn tiền 24h trước-inference
          </p>
          <h2
            id="pricing-teaser-heading"
            className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-cream sm:text-4xl"
          >
            Chọn mức độ{' '}
            <span className="bg-gold-gradient bg-clip-text text-transparent">
              đồng hành phù hợp
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-cream/70 sm:text-lg">
            Khảo sát đầu vào miễn phí. Bạn chỉ thanh toán khi muốn mở khoá luận
            giải đầy đủ hoặc Mentor cá nhân hoá. Hoàn tiền 100% trong 24 giờ
            nếu báo cáo chưa được tạo.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TIERS.map((tier) => (
            <article
              key={tier.id}
              className={[
                'relative flex flex-col rounded-2xl border p-6',
                tier.highlighted
                  ? 'border-gold/60 bg-gradient-to-b from-gold/[0.06] to-transparent shadow-[0_0_60px_-20px_rgba(184,146,61,0.5)] md:-translate-y-2'
                  : 'border-cream/10 bg-ink/40',
              ].join(' ')}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink whitespace-nowrap">
                  Phổ biến nhất
                </span>
              )}
              <h3 className="font-heading text-lg font-semibold text-cream">{tier.name}</h3>
              <p className="mt-1 text-sm text-cream/65">{tier.pitch}</p>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="font-heading text-3xl font-bold text-cream">{tier.price}</span>
                {tier.cadence && (
                  <span className="text-sm text-cream/55">{tier.cadence}</span>
                )}
              </div>
              <ul className="mt-5 flex-1 space-y-2 text-sm">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-cream/80">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={tier.ctaHref} className="mt-6">
                <Button
                  variant={tier.highlighted ? 'default' : 'outline'}
                  className="w-full"
                >
                  {tier.ctaLabel}
                </Button>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1 text-sm text-cream/65 transition-colors hover:text-gold"
          >
            So sánh đầy đủ tính năng
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
