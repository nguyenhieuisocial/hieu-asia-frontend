/**
 * /pricing — redesigned comparison table.
 *
 * 4 tiers: Free · Standard · Premium · Lifetime.
 * Annual / Monthly toggle (annual saves 17%).
 * Mobile: stacked cards. Desktop: table.
 * Premium gets a gold "Phổ biến nhất" ribbon.
 *
 * Reads optional `?session=<reading_id>` — passes through to /unlock so a
 * payment is bound to a specific reading; absent → fallback to dashboard.
 */

'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, X, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { FaqAccordion, type FaqItem } from '@/components/home/FaqAccordion';

/**
 * Launch promotion — matches the `hieu_asia.coupons` table seed.
 * Set `code` to null (or remove the banner) when the campaign ends.
 */
const LAUNCH_PROMO = {
  code: 'LAUNCH50',
  percentOff: 30,
  endsAt: '2026-06-30',
} as const;

type Period = 'monthly' | 'annual';
type TierId = 'free' | 'standard' | 'premium' | 'lifetime';

interface Tier {
  id: TierId;
  name: string;
  /** Monthly price in VND. 0 = free. */
  monthly: number;
  /** Annual price in VND (full year). Lifetime uses this as one-time. */
  annual: number;
  description: string;
  cta: string;
  highlighted?: boolean;
  badge?: string;
  /** If true, `annual` is a one-time payment, not /year. */
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
    id: 'standard',
    name: 'Standard',
    monthly: 0,
    annual: 99_000,
    description: 'Một lá số đầy đủ, không tự gia hạn.',
    cta: 'Chọn Standard',
    isOneTime: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    monthly: 199_000,
    annual: 1_990_000,
    description: 'Mentor không giới hạn — phổ biến nhất.',
    cta: 'Chọn Premium',
    highlighted: true,
    badge: 'Phổ biến nhất',
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    monthly: 0, // Lifetime ignores monthly view
    annual: 4_990_000,
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
    values: { free: true, standard: true, premium: true, lifetime: true },
  },
  {
    label: 'Số lá số được tạo',
    group: 'Cốt lõi',
    values: { free: '1', standard: '1', premium: 'Không giới hạn', lifetime: 'Không giới hạn' },
  },
  {
    label: 'Phân tích Tử Vi 12 cung',
    group: 'Cốt lõi',
    values: { free: 'Rút gọn', standard: true, premium: true, lifetime: true },
  },
  {
    label: 'Bát Tự, MBTI, Thần Số Học',
    group: 'Cốt lõi',
    values: { free: 'Rút gọn', standard: true, premium: true, lifetime: true },
  },
  {
    label: 'Palm Reading (upload ảnh)',
    group: 'Cốt lõi',
    values: { free: false, standard: true, premium: true, lifetime: true },
  },
  // Mentor
  {
    label: 'Số câu hỏi với Mentor',
    group: 'Mentor AI',
    values: { free: '0', standard: '3', premium: 'Không giới hạn', lifetime: 'Không giới hạn' },
  },
  {
    label: 'Cập nhật đại vận & lưu niên',
    group: 'Mentor AI',
    values: { free: false, standard: false, premium: true, lifetime: true },
  },
  // Export
  {
    label: 'Tải PDF Cẩm Nang',
    group: 'Xuất bản',
    values: { free: false, standard: true, premium: true, lifetime: true },
  },
  {
    label: 'Tử Vi hôm nay cá nhân hoá',
    group: 'Xuất bản',
    values: { free: false, standard: false, premium: true, lifetime: true },
  },
  // Family & extras
  {
    label: 'Phân tích người thân',
    group: 'Mở rộng',
    values: { free: false, standard: false, premium: '3 lá số', lifetime: '10 lá số' },
  },
  {
    label: 'Hỗ trợ ưu tiên',
    group: 'Mở rộng',
    values: { free: false, standard: false, premium: true, lifetime: true },
  },
  {
    label: 'Truy cập sớm tính năng mới',
    group: 'Mở rộng',
    values: { free: false, standard: false, premium: true, lifetime: true },
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
    q: 'Gói năm rẻ hơn bao nhiêu so với gói tháng?',
    a: (
      <p>
        Khi chọn gói năm Premium, bạn tiết kiệm 17% so với 12 tháng cộng lại —
        tương đương 2 tháng miễn phí. Cụ thể: 199.000đ × 12 = 2.388.000đ, gói
        năm chỉ 1.990.000đ (tức ~165.833đ / tháng).
      </p>
    ),
  },
  {
    q: 'Sự khác biệt giữa Premium và Lifetime?',
    a: (
      <p>
        Premium là subscription — bạn trả theo tháng hoặc năm. Lifetime là một
        lần thanh toán, dùng mãi mãi, kèm bonus phân tích đến 10 lá số người
        thân.
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

function priceFor(tier: Tier, period: Period): { display: string; cadence: string } {
  if (tier.id === 'free') return { display: 'Miễn phí', cadence: '' };
  if (tier.isOneTime) return { display: formatVND(tier.annual), cadence: 'một lần' };
  if (period === 'monthly') return { display: formatVND(tier.monthly), cadence: '/ tháng' };
  return { display: formatVND(tier.annual), cadence: '/ năm' };
}

/**
 * Compute the annual discount vs. 12× monthly. Returns null for tiers that
 * don't have both monthly + annual pricing (free, one-time).
 *
 * Premium today: monthly 199k × 12 = 2,388k, annual 1,990k → saves 398k ≈ 16.7%
 * → rounds to 17%, equivalent to "2 tháng miễn phí" (2/12 = 16.7%).
 */
function annualDiscount(tier: Tier): { percent: number; monthsFree: number; saved: number } | null {
  if (tier.isOneTime || tier.monthly <= 0 || tier.annual <= 0) return null;
  const twelve = tier.monthly * 12;
  if (twelve <= tier.annual) return null;
  const saved = twelve - tier.annual;
  const percent = Math.round((saved / twelve) * 100);
  const monthsFree = Math.round((saved / tier.monthly) * 10) / 10;
  return { percent, monthsFree, saved };
}

/** Equivalent monthly cost for an annual subscription — for the "~165.833/tháng" hint. */
function monthlyEquivalent(tier: Tier): string | null {
  if (tier.isOneTime || tier.annual <= 0) return null;
  const perMonth = Math.round(tier.annual / 12);
  return `~${new Intl.NumberFormat('vi-VN').format(perMonth)}₫ / tháng`;
}

/**
 * Best annual discount across all subscription tiers — drives the period
 * toggle badge so the copy stays in sync with the underlying numbers.
 */
function bestAnnualDiscountPercent(tiers: readonly Tier[]): number {
  let best = 0;
  for (const t of tiers) {
    const d = annualDiscount(t);
    if (d && d.percent > best) best = d.percent;
  }
  return best;
}

export default function PricingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session') ?? '';
  const [period, setPeriod] = React.useState<Period>('annual');
  const bestDiscount = React.useMemo(() => bestAnnualDiscountPercent(TIERS), []);

  const handleSelect = React.useCallback(
    (tier: TierId) => {
      if (tier === 'free') {
        router.push('/onboarding');
        return;
      }
      if (!sessionId) {
        router.push('/dashboard?need_reading=1');
        return;
      }
      router.push(`/unlock/${encodeURIComponent(sessionId)}?tier=${tier}&period=${period}`);
    },
    [router, sessionId, period],
  );

  return (
    <>
      <SiteNav />
      <main id="main-content" className="min-h-screen bg-ink text-cream pt-16">
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-ink">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,_rgba(59,39,84,0.4)_0%,_transparent_55%)]"
          />
          <div className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-20">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold/80 sm:text-xs">
              Pricing
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight tracking-tight text-cream sm:text-5xl">
              Chọn gói phù hợp{' '}
              <span className="bg-gold-gradient bg-clip-text text-transparent">với bạn</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-cream/75 sm:text-lg">
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

            {/* Period toggle */}
            <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-cream/10 bg-ink/60 p-1">
              <PeriodButton current={period} value="monthly" onClick={setPeriod}>
                Hàng tháng
              </PeriodButton>
              <PeriodButton current={period} value="annual" onClick={setPeriod}>
                Hàng năm{' '}
                {bestDiscount > 0 && (
                  <span className="ml-1 rounded-full bg-gold/20 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-gold">
                    Tiết kiệm {bestDiscount}%
                  </span>
                )}
              </PeriodButton>
            </div>

            {/* Launch promo banner */}
            {LAUNCH_PROMO.code && (
              <div className="mx-auto mt-6 flex max-w-xl items-center justify-center gap-2 rounded-2xl border border-gold/30 bg-gradient-to-r from-gold/[0.08] via-gold/[0.04] to-purple/[0.08] px-4 py-3 text-sm text-cream/90">
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
        <section className="relative bg-ink pb-16 sm:pb-24">
          <div className="mx-auto max-w-6xl px-6">
            {/* Mobile: stacked cards */}
            <div className="space-y-6 md:hidden">
              {TIERS.map((tier) => (
                <TierCard
                  key={tier.id}
                  tier={tier}
                  period={period}
                  onSelect={() => handleSelect(tier.id)}
                />
              ))}
            </div>

            {/* Desktop: comparison table */}
            <div className="hidden md:block">
              <ComparisonTable
                tiers={TIERS}
                period={period}
                onSelect={handleSelect}
              />
            </div>
          </div>
        </section>

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

function PeriodButton({
  current,
  value,
  onClick,
  children,
}: {
  current: Period;
  value: Period;
  onClick: (v: Period) => void;
  children: React.ReactNode;
}) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={[
        'inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'bg-gold text-ink'
          : 'text-cream/70 hover:text-cream',
      ].join(' ')}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

function TierCard({
  tier,
  period,
  onSelect,
}: {
  tier: Tier;
  period: Period;
  onSelect: () => void;
}) {
  const { display, cadence } = priceFor(tier, period);
  const discount = annualDiscount(tier);
  const perMonth = period === 'annual' ? monthlyEquivalent(tier) : null;
  return (
    <article
      className={[
        'relative flex flex-col rounded-2xl border p-6',
        tier.highlighted
          ? 'border-gold/60 bg-gradient-to-b from-gold/[0.06] to-transparent shadow-[0_0_60px_-20px_rgba(184,146,61,0.5)]'
          : 'border-cream/10 bg-ink/40',
      ].join(' ')}
    >
      {tier.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink">
          {tier.badge}
        </span>
      )}
      <h3 className="font-heading text-lg font-semibold text-cream">{tier.name}</h3>
      <p className="mt-1 text-sm text-cream/65">{tier.description}</p>
      <div className="mt-4 flex items-baseline gap-1.5">
        <span className="font-heading text-3xl font-bold text-cream">{display}</span>
        {cadence && <span className="text-sm text-cream/55">{cadence}</span>}
      </div>
      {period === 'annual' && perMonth && (
        <p className="mt-1 text-xs text-cream/50">{perMonth}</p>
      )}
      {period === 'annual' && discount && (
        <p className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
          Tiết kiệm {discount.percent}% · {discount.monthsFree} tháng miễn phí
        </p>
      )}
      <ul className="mt-5 space-y-2 text-sm">
        {FEATURE_ROWS.map((row) => {
          const v = row.values[tier.id];
          if (v === false) return null;
          return (
            <li key={row.label} className="flex items-start gap-2 text-cream/80">
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
  period,
  onSelect,
}: {
  tiers: readonly Tier[];
  period: Period;
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
    <div className="overflow-hidden rounded-2xl border border-cream/10">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 w-1/4 bg-ink/80 p-5 text-sm font-medium text-cream/60 backdrop-blur">
              Tính năng
            </th>
            {tiers.map((tier) => {
              const { display, cadence } = priceFor(tier, period);
              const discount = annualDiscount(tier);
              const perMonth = period === 'annual' ? monthlyEquivalent(tier) : null;
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
                  <div className="font-heading text-lg font-semibold text-cream">
                    {tier.name}
                  </div>
                  <p className="mt-1 text-xs text-cream/60">{tier.description}</p>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="font-heading text-2xl font-bold text-cream">
                      {display}
                    </span>
                    {cadence && (
                      <span className="text-xs text-cream/55">{cadence}</span>
                    )}
                  </div>
                  {period === 'annual' && perMonth && (
                    <p className="mt-1 text-[11px] text-cream/45">{perMonth}</p>
                  )}
                  {period === 'annual' && discount && (
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
              <tr className="border-t border-cream/5">
                <td
                  colSpan={tiers.length + 1}
                  className="bg-ink/60 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.28em] text-gold/70"
                >
                  {groupName}
                </td>
              </tr>
              {rows.map((row) => (
                <tr key={row.label} className="border-t border-cream/5">
                  <td className="sticky left-0 bg-ink/80 p-4 text-sm text-cream/80 backdrop-blur">
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
                          <X className="h-4 w-4 text-cream/25" aria-label="Không" />
                        )}
                        {typeof v === 'string' && (
                          <span className="text-cream/85">{v}</span>
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
