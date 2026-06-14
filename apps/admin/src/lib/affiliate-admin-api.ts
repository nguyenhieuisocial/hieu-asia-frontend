/**
 * Affiliate-admin API surface — typed fetchers + TanStack Query helpers.
 *
 * Talks to the existing Next.js proxy routes under `/api/admin/affiliates/*`
 * (which forward to api.hieu.asia with X-Admin-Token).
 *
 * Worker endpoints NOT YET WIRED (flagged for a future backend wave):
 *   GET  /admin/affiliates/stats            — overview KPIs (currently computed client-side)
 *   GET  /admin/affiliates/assets           — marketing assets list with download counts
 *   POST /admin/affiliates/bulk-payout      — mark multiple pending payouts as paid
 *   POST /admin/affiliates/bulk-suspend     — add multiple affiliates to deny list
 * (The leaderboard IS shipped — top affiliates come from the dedicated
 *  `leaderboard-top` route, not sorted client-side.)
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

export async function fetchFraudReport(): Promise<FraudReportResponse> {
  const r = await fetch('/api/admin/affiliates/fraud-report', { cache: 'no-store' });
  return jsonOk<FraudReportResponse>(r);
}

// ----- Formatting helpers -----

export function vnd(n: number): string {
  return n.toLocaleString('vi-VN') + 'đ';
}
