/**
 * Wave 58 Phase B — Post-reading upsell banner.
 *
 * Renders below the synthesis once a reading completes. Behaviour:
 *
 *   - Subscribers (monthly/yearly/lifetime) → renders the affiliate referral
 *     card instead (keep them engaged in growth, not upsell to themselves).
 *   - Free users → upsell variants gated by PostHog flag UPSELL_POST_READING_V1:
 *     - `control`           → null (baseline conversion measurement)
 *     - `mentor-focus`      → "Mở khoá Mentor chat — Hỏi sâu bất kỳ lúc nào"
 *     - `unlimited-focus`   → "Đọc không giới hạn — 199.000đ/tháng"
 *     - `lifetime-discount` → "Trọn đời 4.990.000đ — Tiết kiệm so với 2 năm"
 *   - Free users at quota-exhausted (had 1 reading, next would 402) → always
 *     show the "Upgrade ngay" panel regardless of flag — they hit a wall.
 *
 * Tracks `upsell_view`, `upsell_clicked` ({cta, tier}), `upsell_dismissed`
 * for funnel analysis. Variant is included on every event.
 *
 * Founder direction (Wave 58): "theo đuổi marketing gói cao hơn" — banner is
 * always-on for free users once any variant rolls out. No "X to dismiss
 * forever" — only "X for this session" via sessionStorage. Next reading the
 * banner returns.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useFeatureFlag, FLAGS } from '@/lib/feature-flags';
import { track } from '@/lib/analytics';
import { formatVND, PRICING } from '@/lib/pricing';
import { trackPixelViewContent } from '@/lib/marketing-pixels';

interface Props {
  /**
   * Coarse upsell variant from the route response (`upsell_variant` field).
   * Wave 58.1 P2-1: replaces the literal plan name to avoid leaking lifetime-
   * tier status to anyone viewing the response (DevTools, shared links, proxy
   * logs) — that would be a phishing seed.
   */
  upsellVariant: 'subscriber' | 'free' | 'free_quota_exhausted';
  /** Stable per-reading id for analytics correlation. */
  runId: string;
  /** Graph kind for analytics dimension. */
  graphKind: 'tu-vi' | 'bat-tu' | 'palm';
}

type Variant = 'control' | 'mentor-focus' | 'unlimited-focus' | 'lifetime-discount';

interface CopyBlock {
  headline: string;
  subtext: string;
  ctaLabel: string;
  ctaHref: string;
  targetTier: 'monthly' | 'yearly' | 'lifetime' | 'premium';
}

function copyForVariant(variant: Variant, quotaExhausted: boolean): CopyBlock | null {
  if (quotaExhausted) {
    // Wall-hit override: always offer the cheapest unlock.
    return {
      headline: 'Bạn đã dùng hết lượt miễn phí trong 30 ngày',
      subtext: `Mua ${PRICING.premium.label} ${formatVND(PRICING.premium.vnd)} để xem thêm 1 lá số, hoặc Mentor Monthly ${formatVND(PRICING.monthly.vnd)} không giới hạn.`,
      ctaLabel: `Mở khoá ngay — ${formatVND(PRICING.premium.vnd)}`,
      ctaHref: '/pricing#premium',
      targetTier: 'premium',
    };
  }
  switch (variant) {
    case 'mentor-focus':
      return {
        headline: 'Mở khoá Mentor chat — Hỏi sâu bất kỳ lúc nào',
        subtext: `Nâng cấp Mentor Monthly ${formatVND(PRICING.monthly.vnd)}/tháng để chat AI 30 câu/ngày + đọc không giới hạn 7 sản phẩm.`,
        ctaLabel: `Dùng thử Monthly — ${formatVND(PRICING.monthly.vnd)}/tháng`,
        ctaHref: '/pricing#monthly',
        targetTier: 'monthly',
      };
    case 'unlimited-focus':
      return {
        headline: 'Đọc không giới hạn — chỉ 199.000đ/tháng',
        subtext: `Bản đọc của bạn hôm nay chỉ là 1/7 sản phẩm. Mở khoá Bát Tự, Palm, MBTI, Hợp Tuổi, Đại vận, Lưu niên trong cùng một gói đăng ký.`,
        ctaLabel: 'Xem tất cả gói',
        ctaHref: '/pricing',
        targetTier: 'monthly',
      };
    case 'lifetime-discount':
      return {
        headline: `Trọn đời ${formatVND(PRICING.lifetime.vnd)} — tiết kiệm so với 2 năm`,
        subtext: 'Không bao giờ phải gia hạn. 7 sản phẩm + Mentor unlimited + ưu tiên model cao cấp. Quà tặng bản thân hoặc người thân.',
        ctaLabel: `Xem Lifetime — ${formatVND(PRICING.lifetime.vnd)}`,
        ctaHref: '/pricing#lifetime',
        targetTier: 'lifetime',
      };
    default:
      return null;
  }
}

const SESSION_DISMISS_KEY = 'hieu:upsell-post-reading:dismissed';

export function PostReadingUpsell({ upsellVariant, runId, graphKind }: Props) {
  const isSubscriber = upsellVariant === 'subscriber';
  const quotaExhausted = upsellVariant === 'free_quota_exhausted';
  const variant = useFeatureFlag<Variant>(FLAGS.UPSELL_POST_READING_V1, 'control');
  const [dismissed, setDismissed] = React.useState(false);

  // Hydrate dismissal from sessionStorage so navigating away + back doesn't
  // re-show within the same tab session.
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(SESSION_DISMISS_KEY) === '1') setDismissed(true);
  }, []);

  const copy = isSubscriber ? null : copyForVariant(variant, quotaExhausted);

  // Fire `upsell_view` once per mount when something will actually render.
  // Wave 58 — ALSO fire Meta CAPI ViewContent (mirrors to server CAPI for
  // retargeting; FB iOS14 blocks ~30% client pixel hits so server mirror is
  // critical). Reading completion is the highest-intent signal we have.
  const viewedRef = React.useRef(false);
  React.useEffect(() => {
    if (viewedRef.current) return;
    if (dismissed) return;
    if (isSubscriber) {
      viewedRef.current = true;
      track('upsell_view', {
        variant: 'affiliate-referral',
        upsell_variant: upsellVariant,
        graph_kind: graphKind,
        run_id: runId,
      });
      // Don't fire ViewContent for subs — they're not in the upsell funnel.
      return;
    }
    if (!copy) return; // control variant + not quota-exhausted = nothing to show
    viewedRef.current = true;
    track('upsell_view', {
      variant,
      target_tier: copy.targetTier,
      upsell_variant: upsellVariant,
      quota_exhausted: quotaExhausted,
      graph_kind: graphKind,
      run_id: runId,
    });
    // Pixel + CAPI mirror. `value` = the target tier price (in 1000s of VND
    // converted to USD-equivalent ~$8/$40/$200 for $-based bidding).
    const tierVnd =
      copy.targetTier === 'premium'
        ? PRICING.premium.vnd
        : copy.targetTier === 'monthly'
          ? PRICING.monthly.vnd
          : copy.targetTier === 'yearly'
            ? PRICING.yearly.vnd
            : PRICING.lifetime.vnd;
    trackPixelViewContent(
      {
        content_name: `reading-${graphKind}-${copy.targetTier}-upsell`,
        value: Math.round((tierVnd / 24_500) * 100) / 100, // VND→USD est for ad bidding
        currency: 'USD',
      },
      { eventId: `vc-${runId}` }, // idempotency for CAPI dedup with client pixel
    );
  }, [dismissed, isSubscriber, copy, variant, upsellVariant, quotaExhausted, graphKind, runId]);

  if (dismissed) return null;

  const handleClick = (label: string, href: string) => {
    track('upsell_clicked', {
      variant: isSubscriber ? 'affiliate-referral' : variant,
      target_tier: copy?.targetTier ?? 'affiliate',
      cta_label: label,
      cta_href: href,
      upsell_variant: upsellVariant,
      graph_kind: graphKind,
      run_id: runId,
    });
  };

  const handleDismiss = () => {
    track('upsell_dismissed', {
      variant: isSubscriber ? 'affiliate-referral' : variant,
      upsell_variant: upsellVariant,
      graph_kind: graphKind,
      run_id: runId,
    });
    if (typeof window !== 'undefined') sessionStorage.setItem(SESSION_DISMISS_KEY, '1');
    setDismissed(true);
  };

  // ─── Subscriber render: affiliate referral ──────────────────────────────
  if (isSubscriber) {
    return (
      <aside
        className="mt-8 rounded-xl border border-amber-400/40 bg-gradient-to-br from-amber-50 to-yellow-50 p-5 dark:border-amber-500/30 dark:from-amber-950/30 dark:to-yellow-950/20"
        role="complementary"
        aria-label="Mời bạn bè"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-amber-900 dark:text-amber-200">
              Cảm ơn bạn đã đồng hành 💛
            </h3>
            <p className="mt-1 text-sm text-amber-800/90 dark:text-amber-200/80">
              Mời bạn bè khám phá hieu.asia — bạn nhận 30% hoa hồng cho mỗi giao dịch của họ.
            </p>
            <Link
              href="/affiliate/dashboard"
              onClick={() => handleClick('Lấy link giới thiệu', '/affiliate/dashboard')}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 transition-colors"
            >
              Lấy link giới thiệu →
            </Link>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Đóng"
            className="text-amber-700/60 hover:text-amber-900 dark:text-amber-300/60 dark:hover:text-amber-100"
          >
            ✕
          </button>
        </div>
      </aside>
    );
  }

  // ─── Free user render: upsell ───────────────────────────────────────────
  if (!copy) return null;

  return (
    <aside
      className={`mt-8 rounded-xl border p-5 ${
        quotaExhausted
          ? 'border-rose-400/50 bg-gradient-to-br from-rose-50 to-orange-50 dark:border-rose-500/40 dark:from-rose-950/30 dark:to-orange-950/20'
          : 'border-violet-400/40 bg-gradient-to-br from-violet-50 to-indigo-50 dark:border-violet-500/30 dark:from-violet-950/30 dark:to-indigo-950/20'
      }`}
      role="complementary"
      aria-label="Nâng cấp gói"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3
            className={`text-base font-semibold ${
              quotaExhausted ? 'text-rose-900 dark:text-rose-200' : 'text-violet-900 dark:text-violet-200'
            }`}
          >
            {copy.headline}
          </h3>
          <p
            className={`mt-1 text-sm ${
              quotaExhausted
                ? 'text-rose-800/90 dark:text-rose-200/80'
                : 'text-violet-800/90 dark:text-violet-200/80'
            }`}
          >
            {copy.subtext}
          </p>
          <Link
            href={copy.ctaHref}
            onClick={() => handleClick(copy.ctaLabel, copy.ctaHref)}
            className={`mt-3 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
              quotaExhausted
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-violet-600 hover:bg-violet-700'
            }`}
          >
            {copy.ctaLabel} →
          </Link>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Đóng"
          className={`opacity-60 hover:opacity-100 transition-opacity ${
            quotaExhausted ? 'text-rose-700' : 'text-violet-700'
          }`}
        >
          ✕
        </button>
      </div>
    </aside>
  );
}
