/**
 * Canonical pricing — single source of truth across pages.
 *
 * Mirrors the SQL seed in `hieu_asia.products` / `hieu_asia.subscription_plans`.
 * If you change a number here, update the DB seed in the same PR and reseed.
 *
 * Tiers:
 * - Standard:        Free tier (signup, surveys, free tools).
 * - Premium:         99.000đ one-time → one full reading.
 * - Mentor Monthly:  199.000đ / month → unlimited mentor.
 * - Mentor Yearly:   1.990.000đ / year (~165.833đ/tháng, saves ~17%).
 * - Lifetime:        4.990.000đ one-time → forever access.
 *
 * Wave 62.05 — "Như giấy cũ" decision paralysis fix (vault 138). UI now shows
 * 3 PRIMARY anchors on /pricing + homepage. Yearly + Lifetime are still sold
 * (and SEO offers still list all 4 paid SKUs), but live in an expandable
 * "Tuỳ chọn nâng cao" section on /pricing. The `PRICING` const stays
 * untouched so admin/checkout/post-reading-upsell continue to resolve all
 * tiers by key. The split below is for UI semantics only.
 */

export const PRICING = {
  standard: { vnd: 0, label: 'Miễn phí', cadence: 'one-time' },
  premium: { vnd: 99_000, label: 'Premium', cadence: 'one-time' },
  monthly: { vnd: 199_000, label: 'Mentor Monthly', cadence: 'monthly' },
  yearly: { vnd: 1_990_000, label: 'Mentor Yearly', cadence: 'yearly' },
  lifetime: { vnd: 4_990_000, label: 'Lifetime', cadence: 'one-time' },
} as const;

/**
 * Wave 62.05 — semantic split for the homepage + /pricing primary anchors.
 *
 * `PRIMARY_PRICING` = the 3 tiers we lead with (the only ones shown above the
 * fold). `ADVANCED_PRICING` = the deeper commitments (yearly + lifetime)
 * surfaced only when the buyer expands "Tuỳ chọn nâng cao".
 *
 * Both objects are derived from `PRICING` to keep one source of truth — do
 * NOT inline new numbers here; edit `PRICING` above and the split follows.
 */
export const PRIMARY_PRICING = {
  standard: PRICING.standard,
  premium: PRICING.premium,
  monthly: PRICING.monthly,
} as const;

export const ADVANCED_PRICING = {
  yearly: PRICING.yearly,
  lifetime: PRICING.lifetime,
} as const;

/**
 * Average order value used by the affiliate commission calculator.
 * Anchored to the monthly subscription — the most common conversion path.
 */
export const AOV_VND = PRICING.monthly.vnd;

export function formatVND(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n) + '₫';
}

/** Yearly price ÷ 12, rounded — for the "~165.833₫/tháng" hint. */
export function monthlyEquivalent(yearlyVnd: number): number {
  return Math.round(yearlyVnd / 12);
}

/**
 * Yearly discount vs. 12× monthly, as a whole percent.
 *
 * 199.000 × 12 = 2.388.000; 1.990.000 / 2.388.000 ≈ 0.833 → 17% off.
 */
export function yearlyDiscount(): number {
  const fullYear = PRICING.monthly.vnd * 12;
  return Math.round((1 - PRICING.yearly.vnd / fullYear) * 100);
}
