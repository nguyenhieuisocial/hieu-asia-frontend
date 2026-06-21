/**
 * Pure, deterministic per-customer intelligence (CDP) — health score, churn-risk
 * band, lifecycle segment, and next-best-moment signals, derived ONLY from data
 * already on the customer-detail response (plan, created_at, last_active, session
 * count, total spend, birth date). No traffic needed to ship; becomes more useful
 * as the base grows. Side-effect-free → unit-tested.
 *
 * READ-ONLY: this only SCORES + SUGGESTS. It never sends anything. Acting on a
 * suggestion (email/offer) stays a separate, founder-approved step.
 */

export type Segment = 'new' | 'active_paying' | 'free_engaged' | 'at_risk' | 'dormant' | 'churned';
export type ChurnBand = 'low' | 'medium' | 'high';

export interface CustomerScoreInput {
  plan?: string | null;
  createdAt?: string | null;
  lastActive?: string | null;
  sessionCount: number;
  totalSpendVnd: number;
  birthMonth?: number | null; // 1-12
  birthDay?: number | null; // 1-31
  nowMs: number; // injected for deterministic tests
}

export interface CustomerScore {
  segment: Segment;
  segmentLabel: string;
  healthScore: number; // 0-100
  churnBand: ChurnBand;
  daysSinceActive: number | null;
  daysSinceCreated: number | null;
  isPaying: boolean;
  nextBestMoments: string[];
}

const PAID_PLANS = new Set(['premium', 'sub_monthly', 'sub_yearly', 'lifetime', 'mentor_month', 'mentor_year']);

const SEGMENT_LABEL: Record<Segment, string> = {
  new: 'Khách mới',
  active_paying: 'Đang trả phí & hoạt động',
  free_engaged: 'Miễn phí, gắn kết',
  at_risk: 'Có nguy cơ rời bỏ',
  dormant: 'Ngủ đông',
  churned: 'Đã rời bỏ',
};

function daysBetween(fromMs: number, iso?: string | null): number | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return null;
  return Math.max(0, Math.floor((fromMs - t) / 86_400_000));
}

/** Days until the next occurrence of a month/day birthday (0 = today). */
function daysToNextBirthday(nowMs: number, month?: number | null, day?: number | null): number | null {
  if (!month || !day || month < 1 || month > 12 || day < 1 || day > 31) return null;
  const now = new Date(nowMs);
  const y = now.getUTCFullYear();
  let next = Date.UTC(y, month - 1, day);
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  if (next < today) next = Date.UTC(y + 1, month - 1, day);
  return Math.round((next - today) / 86_400_000);
}

export function scoreCustomer(input: CustomerScoreInput): CustomerScore {
  const isPaying = PAID_PLANS.has(String(input.plan ?? '').toLowerCase());
  const daysSinceActive = daysBetween(input.nowMs, input.lastActive);
  const daysSinceCreated = daysBetween(input.nowMs, input.createdAt);
  const sessions = Math.max(0, input.sessionCount || 0);
  const spend = Math.max(0, input.totalSpendVnd || 0);

  // ── segment ──────────────────────────────────────────────────────────────
  let segment: Segment;
  if (daysSinceCreated !== null && daysSinceCreated <= 7) {
    segment = 'new';
  } else if (isPaying && (daysSinceActive === null || daysSinceActive <= 14)) {
    segment = 'active_paying';
  } else if (isPaying && daysSinceActive !== null && daysSinceActive > 60) {
    segment = 'churned';
  } else if (isPaying) {
    segment = 'at_risk'; // paying but 14–60d inactive
  } else if (sessions >= 2 && daysSinceActive !== null && daysSinceActive <= 30) {
    segment = 'free_engaged';
  } else {
    segment = 'dormant';
  }

  // ── health score (recency 40 + frequency 30 + monetary 30) ────────────────
  let recency = 0;
  if (daysSinceActive !== null) {
    if (daysSinceActive <= 7) recency = 40;
    else if (daysSinceActive <= 14) recency = 30;
    else if (daysSinceActive <= 30) recency = 20;
    else if (daysSinceActive <= 60) recency = 10;
  }
  const frequency = sessions >= 5 ? 30 : sessions >= 3 ? 20 : sessions >= 1 ? 10 : 0;
  const monetary = spend > 0 ? 30 : 0;
  const healthScore = recency + frequency + monetary;
  const churnBand: ChurnBand = healthScore >= 60 ? 'low' : healthScore >= 30 ? 'medium' : 'high';

  // ── next-best-moments (read-only suggestions) ─────────────────────────────
  const nextBestMoments: string[] = [];
  const bday = daysToNextBirthday(input.nowMs, input.birthMonth, input.birthDay);
  if (bday !== null && bday <= 7) {
    nextBestMoments.push(bday === 0 ? 'Sinh nhật hôm nay — gửi lời chúc/ưu đãi' : `Sinh nhật trong ${bday} ngày — gửi lời chúc/ưu đãi`);
  }
  if (isPaying && daysSinceActive !== null && daysSinceActive > 14) {
    nextBestMoments.push(`Trả phí nhưng đã lặng ${daysSinceActive} ngày — nhắc quay lại`);
  }
  if (!isPaying && sessions > 0 && spend === 0) {
    nextBestMoments.push('Đã dùng nhưng chưa mua — mời nâng cấp/ưu đãi');
  }
  if (daysSinceCreated !== null && daysSinceCreated <= 3) {
    nextBestMoments.push('Khách mới — gửi lời chào mừng/onboarding');
  }

  return {
    segment,
    segmentLabel: SEGMENT_LABEL[segment],
    healthScore,
    churnBand,
    daysSinceActive,
    daysSinceCreated,
    isPaying,
    nextBestMoments,
  };
}
