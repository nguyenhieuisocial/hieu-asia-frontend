/**
 * Affiliate-admin API surface — typed fetchers + TanStack Query helpers.
 *
 * Talks to the existing Next.js proxy routes under `/api/admin/affiliates/*`
 * (which forward to api.hieu.asia with X-Admin-Token).
 *
 * New worker endpoints NOT YET WIRED (flagged for next backend wave):
 *   GET  /admin/affiliates/stats            — overview KPIs (computed client-side as fallback)
 *   GET  /admin/affiliates/leaderboard      — top affiliates by GMV (currently sorted client-side)
 *   GET  /admin/affiliates/assets           — marketing assets list with download counts
 *   POST /admin/affiliates/bulk-payout      — mark multiple pending payouts as paid
 *   POST /admin/affiliates/bulk-suspend     — add multiple affiliates to deny list
 */
'use client';

// ----- Domain types -----

export type AffiliateStatus = 'active' | 'banned';

export interface Affiliate {
  id: string;
  code: string;
  display_name: string;
  email: string;
  payout_method: string;
  status: AffiliateStatus;
  created_at: string;
  stats: {
    clicks: number;
    signups: number;
    conversions: number;
    total_earned: number;
    pending_payout: number;
    paid_total: number;
  };
}

export interface PendingPayout {
  id: string;
  affiliate_id: string;
  amount: number;
  requested_at: string;
}

export interface AffiliatesListResponse {
  ok: true;
  affiliates: Affiliate[];
  pending_payouts: PendingPayout[];
}

export interface AffiliateRecord {
  id: string;
  code: string;
  display_name: string;
  email: string;
  payout_method: string;
  payout_destination: string;
  status: AffiliateStatus;
  commission_rate_first_month: number;
  commission_rate_recurring: number;
  created_at: string;
}

export interface AffiliateStats {
  clicks: number;
  signups: number;
  conversions: number;
  total_earned: number;
  pending_payout: number;
  paid_total: number;
  last_updated: string;
}

export interface TrackEvent {
  event: 'click' | 'signup' | 'conversion';
  user_id?: string;
  amount?: number;
  commission?: number;
  ts: string;
  ip?: string;
}

export interface PayoutRecord {
  id: string;
  amount: number;
  method: string;
  destination: string;
  status: 'pending' | 'paid' | 'rejected';
  requested_at: string;
  paid_at?: string;
  rejected_reason?: string;
}

export interface AffiliateDetailResponse {
  ok: true;
  affiliate: AffiliateRecord;
  stats: AffiliateStats;
  payouts: PayoutRecord[];
  recent: TrackEvent[];
}

export interface FraudFlag {
  code: string;
  affiliate_id: string;
  reason: 'ip_duplicate' | 'self_referral' | 'velocity' | 'manual';
  detail: string;
  flagged_at: string;
  cleared_at?: string;
  cleared_by?: string;
}

export interface FraudReportResponse {
  ok: true;
  flags: FraudFlag[];
  active_count: number;
}

// ----- Tier system -----

export type Tier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface TierInfo {
  tier: Tier;
  label: string;
  /** Conversion threshold for *this* tier. */
  threshold: number;
  /** Threshold for the next tier (or null if already top). */
  nextThreshold: number | null;
  /** 0..1 progress to the next tier. */
  progress: number;
  /** Color tone classes for badge background + text. */
  badgeClass: string;
  /** Color for progress bar. */
  barClass: string;
}

const TIER_BANDS: Array<{ tier: Tier; min: number; label: string; badgeClass: string; barClass: string }> = [
  {
    tier: 'bronze',
    min: 0,
    label: 'Bronze',
    badgeClass: 'bg-orange-900/30 text-orange-300 border-orange-600/40',
    barClass: 'bg-orange-500',
  },
  {
    tier: 'silver',
    min: 10,
    label: 'Silver',
    badgeClass: 'bg-cream/10 text-cream/90 border-cream/30',
    barClass: 'bg-cream/70',
  },
  {
    tier: 'gold',
    min: 50,
    label: 'Gold',
    badgeClass: 'bg-gold/20 text-gold border-gold/50',
    barClass: 'bg-gold',
  },
  {
    tier: 'platinum',
    min: 200,
    label: 'Platinum',
    badgeClass:
      'bg-gradient-to-r from-purple-700/40 to-gold/30 text-cream border-purple-400/40',
    barClass: 'bg-purple-400',
  },
];

export function getTier(conversions: number): TierInfo {
  let band = TIER_BANDS[0]!;
  let bandIdx = 0;
  for (let i = 0; i < TIER_BANDS.length; i++) {
    const b = TIER_BANDS[i]!;
    if (conversions >= b.min) {
      band = b;
      bandIdx = i;
    }
  }
  const next = TIER_BANDS[bandIdx + 1];
  const span = next ? next.min - band.min : 0;
  const within = conversions - band.min;
  const progress = next && span > 0 ? Math.min(1, within / span) : 1;
  return {
    tier: band.tier,
    label: band.label,
    threshold: band.min,
    nextThreshold: next ? next.min : null,
    progress,
    badgeClass: band.badgeClass,
    barClass: band.barClass,
  };
}

// ----- KPI computation (client-side fallback) -----

export interface AffiliateKpis {
  total_affiliates: number;
  active_this_month: number;
  total_commission_paid_mtd: number;
  pending_commission: number;
  conversion_rate: number;
  total_clicks: number;
  total_conversions: number;
  /** When backend ships /admin/affiliates/stats this becomes false. */
  computed_client_side: boolean;
}

export function computeKpis(list: AffiliatesListResponse): AffiliateKpis {
  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();

  let clicks = 0;
  let convs = 0;
  let paidMtd = 0;
  let pending = 0;
  let activeMonth = 0;

  for (const a of list.affiliates) {
    clicks += a.stats.clicks;
    convs += a.stats.conversions;
    paidMtd += a.stats.paid_total; // worker-side already filters MTD if endpoint matures
    pending += a.stats.pending_payout;
    if (a.status === 'active' && a.stats.conversions > 0 && a.created_at <= monthStart) {
      activeMonth += 1;
    } else if (a.status === 'active' && a.created_at > monthStart) {
      activeMonth += 1;
    }
  }

  return {
    total_affiliates: list.affiliates.length,
    active_this_month: activeMonth,
    total_commission_paid_mtd: paidMtd,
    pending_commission: pending,
    conversion_rate: clicks > 0 ? convs / clicks : 0,
    total_clicks: clicks,
    total_conversions: convs,
    computed_client_side: true,
  };
}

// ----- Marketing assets (static catalog) -----

export interface MarketingAsset {
  id: string;
  title: string;
  kind: 'banner' | 'video' | 'copy' | 'landing' | 'social';
  url: string;
  preview?: string;
  size?: string;
  /** Best-effort — backend may not track yet. */
  download_count?: number;
}

// 11 assets matching the existing `/affiliate/assets` catalog at the worker.
export const MARKETING_ASSETS: MarketingAsset[] = [
  {
    id: 'banner-728x90',
    title: 'Banner ngang 728×90',
    kind: 'banner',
    url: '/affiliate-assets/banner-728x90.png',
    size: '728×90',
    download_count: 0,
  },
  {
    id: 'banner-300x250',
    title: 'Banner vuông 300×250',
    kind: 'banner',
    url: '/affiliate-assets/banner-300x250.png',
    size: '300×250',
    download_count: 0,
  },
  {
    id: 'banner-160x600',
    title: 'Banner dọc 160×600',
    kind: 'banner',
    url: '/affiliate-assets/banner-160x600.png',
    size: '160×600',
    download_count: 0,
  },
  {
    id: 'social-fb-1200x630',
    title: 'Facebook share 1200×630',
    kind: 'social',
    url: '/affiliate-assets/social-fb-1200x630.png',
    size: '1200×630',
    download_count: 0,
  },
  {
    id: 'social-ig-1080x1080',
    title: 'Instagram vuông 1080×1080',
    kind: 'social',
    url: '/affiliate-assets/social-ig-1080x1080.png',
    size: '1080×1080',
    download_count: 0,
  },
  {
    id: 'social-tiktok-1080x1920',
    title: 'TikTok story 1080×1920',
    kind: 'social',
    url: '/affiliate-assets/social-tiktok-1080x1920.png',
    size: '1080×1920',
    download_count: 0,
  },
  {
    id: 'video-30s',
    title: 'Video giới thiệu 30s',
    kind: 'video',
    url: '/affiliate-assets/intro-30s.mp4',
    size: '30s',
    download_count: 0,
  },
  {
    id: 'video-15s',
    title: 'Video teaser 15s',
    kind: 'video',
    url: '/affiliate-assets/teaser-15s.mp4',
    size: '15s',
    download_count: 0,
  },
  {
    id: 'copy-pack',
    title: 'Copy pack — VN/EN headlines',
    kind: 'copy',
    url: '/affiliate-assets/copy-pack.pdf',
    size: 'PDF',
    download_count: 0,
  },
  {
    id: 'landing-page-template',
    title: 'Landing page template (HTML)',
    kind: 'landing',
    url: '/affiliate-assets/landing-template.zip',
    size: 'ZIP',
    download_count: 0,
  },
  {
    id: 'email-template',
    title: 'Email outreach template',
    kind: 'copy',
    url: '/affiliate-assets/email-template.html',
    size: 'HTML',
    download_count: 0,
  },
];

// ----- Fetchers (used by Tanstack Query) -----

async function jsonOk<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok || !data.ok) {
    throw new Error(data.error ?? `HTTP ${res.status}`);
  }
  return data as T;
}

export async function fetchAffiliatesList(): Promise<AffiliatesListResponse> {
  const r = await fetch('/api/admin/affiliates', { cache: 'no-store' });
  return jsonOk<AffiliatesListResponse>(r);
}

export async function fetchAffiliateDetail(id: string): Promise<AffiliateDetailResponse> {
  const r = await fetch(`/api/admin/affiliates/${encodeURIComponent(id)}`, { cache: 'no-store' });
  return jsonOk<AffiliateDetailResponse>(r);
}

export async function fetchFraudReport(): Promise<FraudReportResponse> {
  const r = await fetch('/api/admin/affiliates/fraud-report', { cache: 'no-store' });
  return jsonOk<FraudReportResponse>(r);
}

export async function approvePayout(affiliateId: string, payoutId: string): Promise<void> {
  await fetch(`/api/admin/affiliates/${affiliateId}/approve-payout`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ payout_id: payoutId }),
  });
}

export async function suspendAffiliate(affiliateId: string, banned: boolean): Promise<void> {
  await fetch(`/api/admin/affiliates/${affiliateId}/ban`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ banned }),
  });
}

// ----- Fraud analysis (client-side aggregation) -----

export interface FraudInsights {
  /** Affiliates whose conv/click ratio is anomalously high (likely fake clicks suppressed). */
  ratio_anomalies: Array<{ code: string; ratio: number; clicks: number; convs: number }>;
  /** Active fraud flags grouped by reason. */
  by_reason: Record<FraudFlag['reason'], FraudFlag[]>;
  total_flags: number;
}

export function analyseFraud(flags: FraudFlag[], affiliates: Affiliate[]): FraudInsights {
  const active = flags.filter((f) => !f.cleared_at);
  const by_reason: FraudInsights['by_reason'] = {
    ip_duplicate: [],
    self_referral: [],
    velocity: [],
    manual: [],
  };
  for (const f of active) by_reason[f.reason].push(f);

  const ratios = affiliates
    .filter((a) => a.stats.clicks >= 50)
    .map((a) => ({
      code: a.code,
      clicks: a.stats.clicks,
      convs: a.stats.conversions,
      ratio: a.stats.clicks > 0 ? a.stats.conversions / a.stats.clicks : 0,
    }))
    .filter((r) => r.ratio > 0.4) // unrealistically high conv-rate
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, 20);

  return { ratio_anomalies: ratios, by_reason, total_flags: active.length };
}

// ----- CSV export (client-side blob) -----

export function downloadCsv(filename: string, rows: Array<Record<string, unknown>>): void {
  if (rows.length === 0) {
    // still emit a header-only file so the user gets feedback.
    const blob = new Blob(['(empty)\n'], { type: 'text/csv;charset=utf-8' });
    triggerDownload(blob, filename);
    return;
  }
  const headers = Object.keys(rows[0] ?? {});
  const escape = (v: unknown) => {
    if (v == null) return '';
    const s = String(v);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const csv = [
    headers.join(','),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(',')),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  triggerDownload(blob, filename);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ----- Formatting helpers -----

export function vnd(n: number): string {
  return n.toLocaleString('vi-VN') + 'đ';
}

export function dt(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('vi-VN');
  } catch {
    return iso;
  }
}

export function dtFull(iso: string): string {
  try {
    return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}
