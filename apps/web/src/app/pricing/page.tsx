/**
 * /pricing — canonical comparison page.
 *
 * Wave 52-A — taxonomy synced with `lib/pricing.ts` + home `PricingTeaser`:
 * 5 tiers: Free · Premium (99k one-time) · Mentor Monthly (199k/mo) ·
 * Mentor Yearly (1.99M/yr · saves 17%) · Lifetime (4.99M one-time).
 * Mentor Monthly is the gold "Phổ biến nhất" tier.
 *
 * CTA wiring maps display IDs → wire IDs accepted by /unlock:
 *   premium → premium · monthly → subscription_monthly ·
 *   yearly → subscription_yearly · lifetime → lifetime_onetime (#267).
 *
 * Reads optional `?session=<reading_id>` — passed through to /unlock so a
 * payment is bound to a specific reading; absent → fallback to /account.
 * Reads optional `?tier=<id>` — used to spotlight the deep-linked tier from
 * the home teaser.
 */

'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, X, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { FaqAccordion, type FaqItem } from '@/components/home/FaqAccordion';
import { useFeatureFlag, FLAGS } from '@/lib/feature-flags';
import { SurveyPrompt } from '@/components/survey/SurveyPrompt';
import { SURVEY_IDS } from '@/lib/survey';
import { PRICING } from '@/lib/pricing';

/**
 * Launch promotion — matches the `hieu_asia.coupons` table seed.
 *
 * Wave 53 P1 (#272) — DISABLED. The banner advertised 30% off but the
 * `/payment/intent` worker still charged the full `TIER_PRICES_VND[tier]`
 * because there was no `coupon_code` field on the intent contract and no
 * server-side validation against the `coupons` table. Showing the banner
 * without the discount applying = customer pays full price + complaints +
 * chargeback fraud risk. Set `code: null` to suppress the banner until the
 * coupon flow ships (see follow-up: wire body.coupon_code → worker validates
 * against `hieu_asia.coupons` from migration 0010 → applies discount to
 * amount_due → re-validates in webhook). Founder can flip back via flag once
 * the wire is in place.
 */
const LAUNCH_PROMO = {
  code: null as string | null,
  percentOff: 30,
  endsAt: '2026-06-30',
} as const;

type Period = 'monthly' | 'annual';
/**
 * Wave 52-A — canonical pricing taxonomy. MUST match `lib/pricing.ts` AND
 * `components/home/PricingTeaser.tsx` so the home → /pricing flow is coherent.
 *
 * Tier IDs are display-only here. CTA wiring maps them to the wire IDs that
 * `/unlock/[session_id]` validates (`premium`, `subscription_monthly`,
 * `subscription_yearly`, `lifetime_onetime`).
 */
type TierId = 'free' | 'premium' | 'monthly' | 'yearly' | 'lifetime';

interface Tier {
  id: TierId;
  name: string;
  /** Monthly price in VND. 0 = free or n/a (one-time tiers). */
  monthly: number;
  /** Annual price in VND. One-time tiers (`isOneTime`) use this as the price. */
  annual: number;
  description: string;
  cta: string;
  highlighted?: boolean;
  badge?: string;
  /** True for one-time payments (no monthly/annual split). */
  isOneTime?: boolean;
}

const TIERS: readonly Tier[] = [
  {
    id: 'free',
    name: 'Free',
    monthly: 0,
    annual: 0,
    description: 'Khám phá nền tảng trước khi quyết định.',
    cta: 'Bắt đầu miễn phí',
  },
  {
    id: 'premium',
    name: 'Premium',
    monthly: 0,
    annual: PRICING.premium.vnd,
    description: 'Một lá số đầy đủ, không tự gia hạn.',
    cta: 'Chọn Premium',
    isOneTime: true,
  },
  {
    id: 'monthly',
    name: 'Mentor Monthly',
    monthly: PRICING.monthly.vnd,
    annual: PRICING.monthly.vnd, // Monthly tier has no annual variant
    description: 'Mentor không giới hạn — phổ biến nhất.',
    cta: 'Chọn gói tháng',
    highlighted: true,
    badge: 'Phổ biến nhất',
  },
  {
    id: 'yearly',
    name: 'Mentor Yearly',
    monthly: 0,
    annual: PRICING.yearly.vnd,
    description: 'Trả 1 lần / năm — rẻ hơn 17% so với gói tháng.',
    cta: 'Chọn gói năm',
    isOneTime: true,
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    monthly: 0,
    annual: PRICING.lifetime.vnd,
    description: 'Một lần thanh toán, dùng trọn đời.',
    cta: 'Chọn Lifetime',
    isOneTime: true,
  },
];

interface FeatureRow {
  label: string;
  group: string;
  values: Record<TierId, true | false | string>;
}

const FEATURE_ROWS: readonly FeatureRow[] = [
  // Core
  {
    label: 'Khảo sát đầu vào',
    group: 'Cốt lõi',
    values: { free: true, premium: true, monthly: true, yearly: true, lifetime: true },
  },
  {
    label: 'Số lá số được tạo',
    group: 'Cốt lõi',
    values: { free: '1', premium: '1', monthly: 'Không giới hạn', yearly: 'Không giới hạn', lifetime: 'Không giới hạn' },
  },
  {
    label: 'Phân tích Tử Vi 12 cung',
    group: 'Cốt lõi',
    values: { free: 'Rút gọn', premium: true, monthly: true, yearly: true, lifetime: true },
  },
  {
    label: 'Bát Tự, MBTI, Thần Số Học',
    group: 'Cốt lõi',
    values: { free: 'Rút gọn', premium: true, monthly: true, yearly: true, lifetime: true },
  },
  {
    label: 'Palm Reading (upload ảnh)',
    group: 'Cốt lõi',
    values: { free: false, premium: true, monthly: true, yearly: true, lifetime: true },
  },
  // Mentor
  {
    label: 'Số câu hỏi với Mentor',
    group: 'Mentor AI',
    values: { free: '0', premium: '3', monthly: 'Không giới hạn', yearly: 'Không giới hạn', lifetime: 'Không giới hạn' },
  },
  {
    label: 'Cập nhật đại vận & lưu niên',
    group: 'Mentor AI',
    values: { free: false, premium: false, monthly: true, yearly: true, lifetime: true },
  },
  // Export
  {
    label: 'Tải PDF Cẩm Nang',
    group: 'Xuất bản',
    values: { free: false, premium: true, monthly: true, yearly: true, lifetime: true },
  },
  {
    label: 'Tử Vi hôm nay cá nhân hoá',
    group: 'Xuất bản',
    values: { free: false, premium: false, monthly: true, yearly: true, lifetime: true },
  },
  // Family & extras
  {
    label: 'Phân tích người thân',
    group: 'Mở rộng',
    values: { free: false, premium: false, monthly: '3 lá số', yearly: '3 lá số', lifetime: '10 lá số' },
  },
  {
    label: 'Hỗ trợ ưu tiên',
    group: 'Mở rộng',
    values: { free: false, premium: false, monthly: true, yearly: true, lifetime: true },
  },
  {
    label: 'Truy cập sớm tính năng mới',
    group: 'Mở rộng',
    values: { free: false, premium: false, monthly: true, yearly: true, lifetime: true },
  },
];

const PRICING_FAQ: readonly FaqItem[] = [
  {
    q: 'Tôi có hoàn tiền được không?',
    a: (
      <p>
        Hoàn tiền 100% trong 24 giờ nếu báo cáo chưa được tạo. Sau khi báo cáo
        đã được tạo, chúng tôi vẫn xem xét hoàn tiền trong 14 ngày nếu có lỗi
        kỹ thuật hoặc trải nghiệm không đúng mô tả. Mỗi yêu cầu được phản hồi
        trong 3 ngày làm việc.
      </p>
    ),
  },
  {
    q: 'Mentor Yearly rẻ hơn bao nhiêu so với Mentor Monthly?',
    a: (
      <p>
        Khi chọn Mentor Yearly, bạn tiết kiệm 17% so với 12 tháng cộng lại —
        tương đương 2 tháng miễn phí. Cụ thể: 199.000đ × 12 = 2.388.000đ, gói
        năm chỉ 1.990.000đ (tức ~165.833đ / tháng).
      </p>
    ),
  },
  {
    q: 'Sự khác biệt giữa Premium, Mentor và Lifetime?',
    a: (
      <p>
        Premium 99.000đ là một lá số đầy đủ trả một lần (không tự gia hạn).
        Mentor Monthly / Mentor Yearly là subscription cho Mentor AI không
        giới hạn và đại vận / lưu niên. Lifetime là một lần thanh toán,
        dùng mãi mãi, kèm bonus phân tích đến 10 lá số người thân.
      </p>
    ),
  },
  {
    q: 'Có thể nâng cấp / hạ cấp gói không?',
    a: (
      <p>
        Có. Khi nâng cấp, chúng tôi tính prorate phần còn lại của kỳ hiện tại.
        Khi hạ cấp, thay đổi áp dụng từ kỳ thanh toán kế tiếp.
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
];

function formatVND(amount: number): string {
  if (amount === 0) return 'Miễn phí';
  return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
}

function priceFor(tier: Tier, _period: Period): { display: string; cadence: string } {
  if (tier.id === 'free') return { display: 'Miễn phí', cadence: '' };
  // Wave 52-A — Mentor Monthly / Mentor Yearly are now sibling tiers
  // (matching the home teaser). Yearly / Premium / Lifetime are all
  // one-time-style cadences; Monthly is the lone /tháng subscription card.
  if (tier.id === 'monthly') return { display: formatVND(tier.monthly), cadence: '/ tháng' };
  if (tier.id === 'yearly') return { display: formatVND(tier.annual), cadence: '/ năm' };
  if (tier.isOneTime) return { display: formatVND(tier.annual), cadence: 'một lần' };
  return { display: formatVND(tier.annual), cadence: '' };
}

/**
 * Wave 52-A — Mentor Yearly discount vs 12× Mentor Monthly. Only meaningful
 * for the `yearly` tier card now that subscriptions are split into siblings.
 *
 * 199.000 × 12 = 2.388.000; 1.990.000 / 2.388.000 ≈ 0.833 → 17% off
 * → "2 tháng miễn phí" (2/12 ≈ 16.7%).
 */
function annualDiscount(tier: Tier): { percent: number; monthsFree: number; saved: number } | null {
  if (tier.id !== 'yearly') return null;
  const twelve = PRICING.monthly.vnd * 12;
  if (twelve <= tier.annual) return null;
  const saved = twelve - tier.annual;
  const percent = Math.round((saved / twelve) * 100);
  const monthsFree = Math.round((saved / PRICING.monthly.vnd) * 10) / 10;
  return { percent, monthsFree, saved };
}

/** Equivalent monthly cost for Mentor Yearly — drives the "~165.833₫/tháng" hint. */
function monthlyEquivalent(tier: Tier): string | null {
  if (tier.id !== 'yearly' || tier.annual <= 0) return null;
  const perMonth = Math.round(tier.annual / 12);
  return `~${new Intl.NumberFormat('vi-VN').format(perMonth)}₫ / tháng`;
}

/**
 * Wave 52-A — map a display TierId to the wire tier accepted by
 * `/unlock/[session_id]/page.tsx` (`premium`, `subscription_monthly`,
 * `subscription_yearly`, `lifetime_onetime`).
 *
 * Wave 52 follow-up (#267) — Lifetime now wires to `lifetime_onetime`
 * (worker `TIER_PRICES_VND` accepts this id at 4.99M VND).
 */
function toWireTier(tier: TierId): string | null {
  switch (tier) {
    case 'premium':
      return 'premium';
    case 'monthly':
      return 'subscription_monthly';
    case 'yearly':
      return 'subscription_yearly';
    case 'lifetime':
      return 'lifetime_onetime';
    default:
      return null;
  }
}

export default function PricingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session') ?? '';
  // Wave 52-A — accept `?tier=` deep link from the home teaser (`premium`,
  // `monthly`, `yearly`, `lifetime`, `free`). Used only to scroll the matched
  // card into view; no taxonomy logic depends on it.
  const intentTier = searchParams?.get('tier') ?? '';
  // Wave 52 follow-up (Agent A Q3): legacy `?period=monthly|annual` query
  // params from pre-Wave-52-A marketing links are silently IGNORED here.
  // The Monthly/Yearly period toggle was removed when Mentor became its own
  // tier per the canonical taxonomy in `lib/pricing.ts`. Old links still
  // resolve to /pricing — they just stop affecting layout. Acceptable no-op
  // per spec; tracked in vault 94 §Wave 52.
  // Default to TRUE so the campaign banner still shows when PostHog is down /
  // blocked. Set the PostHog flag to `false` to kill the banner remotely.
  const showLaunchBanner = useFeatureFlag<boolean>(
    FLAGS.PRICING_LAUNCH_BANNER,
    true,
  );

  // Wave 39 W-B — `pricing_display_variant` controls the desktop layout.
  // `comparison-table` (default) → side-by-side feature matrix.
  // `tier-cards`                 → stacked cards on every viewport.
  // Mobile always renders cards regardless.
  const pricingVariant = useFeatureFlag<string>(
    FLAGS.PRICING_DISPLAY_VARIANT,
    'tier-cards',
  );

  // Wave 39 W-B — pricing intent survey: arm a 30s dwell timer. If the user
  // hits a Buy CTA within 30s the timer is cancelled (no survey). If they
  // hang on /pricing longer than 30s without buying, the prompt fires.
  const [intentArmed, setIntentArmed] = React.useState(true);

  const handleSelect = React.useCallback(
    (tier: TierId) => {
      // Wave 39 W-B — clicking any tier CTA disarms the pricing-intent survey
      // (we only want to ask people who hesitated, not converters).
      setIntentArmed(false);
      if (tier === 'free') {
        router.push('/onboarding');
        return;
      }
      if (!sessionId) {
        router.push('/account?need_reading=1');
        return;
      }
      const wireTier = toWireTier(tier);
      if (!wireTier) {
        router.push('/account?need_reading=1');
        return;
      }
      router.push(`/unlock/${encodeURIComponent(sessionId)}?tier=${wireTier}`);
    },
    [router, sessionId],
  );

  return (
    <>
      <SiteNav />
      <main id="main-content" className="min-h-screen bg-background text-foreground pt-16">
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-background">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,_rgba(59,39,84,0.4)_0%,_transparent_55%)]"
          />
          <div className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-20">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold/80 sm:text-xs">
              Pricing
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
              Chọn gói phù hợp{' '}
              <span className="bg-gold-gradient bg-clip-text text-transparent">với bạn</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Khảo sát đầu vào luôn miễn phí. Hoàn tiền 100% trong 24 giờ nếu báo
              cáo chưa được tạo; sau đó vẫn xem xét hoàn tiền 14 ngày khi có lỗi
              kỹ thuật hoặc trải nghiệm không đúng mô tả.
            </p>
            {!sessionId && (
              <p className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/5 px-4 py-1.5 text-xs text-gold/90">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Hoàn tiền 24h trước-inference · Bảo vệ thanh toán
              </p>
            )}

            {/*
              Wave 52-A — period toggle removed: Mentor Monthly and Mentor
              Yearly are now sibling cards (one per cadence) so the toggle was
              redundant. The taxonomy now matches the home teaser exactly.
            */}

            {/* Launch promo banner — gated by `pricing-launch50-banner` flag */}
            {LAUNCH_PROMO.code && showLaunchBanner && (
              <div className="mx-auto mt-6 flex max-w-xl items-center justify-center gap-2 rounded-2xl border border-gold/30 bg-gradient-to-r from-gold/[0.08] via-gold/[0.04] to-purple/[0.08] px-4 py-3 text-sm text-foreground/90">
                <Sparkles className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                <p>
                  Ưu đãi ra mắt — nhập code{' '}
                  <code className="rounded bg-gold/15 px-1.5 py-0.5 font-mono text-xs text-gold">
                    {LAUNCH_PROMO.code}
                  </code>{' '}
                  giảm <b>{LAUNCH_PROMO.percentOff}%</b> mọi gói trả phí
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Mobile cards / Desktop table */}
        <section className="relative bg-background pb-16 sm:pb-24">
          <div className="mx-auto max-w-6xl px-6">
            {/* Mobile: stacked cards */}
            <div className="space-y-6 md:hidden">
              {TIERS.map((tier) => (
                <TierCard
                  key={tier.id}
                  tier={tier}
                  highlight={intentTier === tier.id}
                  onSelect={() => handleSelect(tier.id)}
                />
              ))}
            </div>

            {/* Desktop: comparison table (default) or stacked cards
                 — variant `tier-cards` falls back to the mobile layout
                 on all viewports for A/B testing layout preference. */}
            <div className="hidden md:block">
              {pricingVariant === 'comparison-table' ? (
                <ComparisonTable
                  tiers={TIERS}
                  onSelect={handleSelect}
                />
              ) : (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
                  {TIERS.map((tier) => (
                    <TierCard
                      key={tier.id}
                      tier={tier}
                      highlight={intentTier === tier.id}
                      onSelect={() => handleSelect(tier.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <FaqAccordion
          items={PRICING_FAQ}
          id="pricing-faq"
          eyebrow="FAQ Pricing"
          title="Câu hỏi về thanh toán"
        />

        {/*
          Wave 39 W-B — pricing intent survey. Arms when the user lands on
          /pricing; disarmed when they click any tier CTA. Fires after a 30s
          dwell so we only ask people who hesitated.
        */}
        <SurveyPrompt
          surveyId={SURVEY_IDS.PRICING_INTENT}
          armed={intentArmed}
          delayMs={30_000}
        />
      </main>
      <SiteFooter />
    </>
  );
}

function TierCard({
  tier,
  highlight,
  onSelect,
}: {
  tier: Tier;
  /** When true, draw extra gold ring — used to spotlight the tier deep-linked from `?tier=`. */
  highlight?: boolean;
  onSelect: () => void;
}) {
  const { display, cadence } = priceFor(tier, 'annual');
  const discount = annualDiscount(tier);
  const perMonth = monthlyEquivalent(tier);
  return (
    <article
      className={[
        'relative flex flex-col rounded-2xl border p-6',
        tier.highlighted
          ? 'border-gold/60 bg-gradient-to-b from-gold/[0.06] to-transparent shadow-[0_0_60px_-20px_rgba(184,146,61,0.5)]'
          : 'border-border bg-card/40',
        highlight && !tier.highlighted ? 'ring-2 ring-gold/40' : '',
      ].join(' ')}
    >
      {tier.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink">
          {tier.badge}
        </span>
      )}
      <h3 className="font-heading text-lg font-semibold text-foreground">{tier.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{tier.description}</p>
      <div className="mt-4 flex items-baseline gap-1.5">
        <span className="font-heading text-3xl font-bold text-foreground">{display}</span>
        {cadence && <span className="text-sm text-muted-foreground">{cadence}</span>}
      </div>
      {perMonth && (
        <p className="mt-1 text-xs text-muted-foreground">{perMonth}</p>
      )}
      {discount && (
        <p className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
          Tiết kiệm {discount.percent}% · {discount.monthsFree} tháng miễn phí
        </p>
      )}
      <ul className="mt-5 space-y-2 text-sm">
        {FEATURE_ROWS.map((row) => {
          const v = row.values[tier.id];
          if (v === false) return null;
          return (
            <li key={row.label} className="flex items-start gap-2 text-foreground/85">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              <span>
                {row.label}
                {typeof v === 'string' && (
                  <span className="ml-1.5 text-gold/80">— {v}</span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
      <Button onClick={onSelect} className="mt-6 w-full">
        {tier.cta}
      </Button>
    </article>
  );
}

function ComparisonTable({
  tiers,
  onSelect,
}: {
  tiers: readonly Tier[];
  onSelect: (id: TierId) => void;
}) {
  const groups = React.useMemo(() => {
    const map = new Map<string, FeatureRow[]>();
    for (const r of FEATURE_ROWS) {
      const arr = map.get(r.group) ?? [];
      arr.push(r);
      map.set(r.group, arr);
    }
    return Array.from(map.entries());
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 w-1/4 bg-card/80 p-5 text-sm font-medium text-muted-foreground backdrop-blur">
              Tính năng
            </th>
            {tiers.map((tier) => {
              const { display, cadence } = priceFor(tier, 'annual');
              const discount = annualDiscount(tier);
              const perMonth = monthlyEquivalent(tier);
              return (
                <th
                  key={tier.id}
                  className={[
                    'relative p-5 align-top',
                    tier.highlighted ? 'bg-gold/[0.06]' : '',
                  ].join(' ')}
                >
                  {tier.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink whitespace-nowrap">
                      {tier.badge}
                    </span>
                  )}
                  <div className="font-heading text-lg font-semibold text-foreground">
                    {tier.name}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{tier.description}</p>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="font-heading text-2xl font-bold text-foreground">
                      {display}
                    </span>
                    {cadence && (
                      <span className="text-xs text-muted-foreground">{cadence}</span>
                    )}
                  </div>
                  {perMonth && (
                    <p className="mt-1 text-[11px] text-muted-foreground">{perMonth}</p>
                  )}
                  {discount && (
                    <p className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                      −{discount.percent}% · {discount.monthsFree} tháng miễn phí
                    </p>
                  )}
                  <Button
                    onClick={() => onSelect(tier.id)}
                    size="sm"
                    variant={tier.highlighted ? 'default' : 'outline'}
                    className="mt-4 w-full"
                  >
                    {tier.cta}
                  </Button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {groups.map(([groupName, rows]) => (
            <React.Fragment key={groupName}>
              <tr className="border-t border-border">
                <td
                  colSpan={tiers.length + 1}
                  className="bg-card/60 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.28em] text-gold/85"
                >
                  {groupName}
                </td>
              </tr>
              {rows.map((row) => (
                <tr key={row.label} className="border-t border-border">
                  <td className="sticky left-0 bg-card/80 p-4 text-sm text-foreground/85 backdrop-blur">
                    {row.label}
                  </td>
                  {tiers.map((tier) => {
                    const v = row.values[tier.id];
                    return (
                      <td
                        key={tier.id}
                        className={[
                          'p-4 text-sm',
                          tier.highlighted ? 'bg-gold/[0.04]' : '',
                        ].join(' ')}
                      >
                        {v === true && (
                          <Check className="h-4 w-4 text-gold" aria-label="Có" />
                        )}
                        {v === false && (
                          <X className="h-4 w-4 text-foreground/25" aria-label="Không" />
                        )}
                        {typeof v === 'string' && (
                          <span className="text-foreground/85">{v}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
