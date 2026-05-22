/**
 * /admin/affiliates — Wave 43.2 dashboard
 *
 * Restructured from a single-page tabbed monolith into a tile-grid that links
 * to per-resource sub-pages:
 *   /affiliates/promoters   — affiliate_network table + reparent
 *   /affiliates/referrals   — relationship tree
 *   /affiliates/commissions — commissions ledger + manual clawback
 *   /affiliates/payouts     — payouts ledger (Postgres-side)
 *   /affiliates/batches     — payout batches approval queue
 *   /affiliates/codes       — affiliate-tied promo codes
 *
 * Existing surfaces still live at:
 *   /affiliates/broadcast — composer
 *   /affiliates/fraud     — fraud report
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import { StatCard } from '@/components/stat-card';
import { fetchAffiliatesList, fetchFraudReport, vnd } from '@/lib/affiliate-admin-api';

interface PromoterRow {
  user_id: string;
  depth: number;
  total_subtree: number;
  l1_count: number;
  l2_count: number;
  l3_count: number;
}

interface Commission {
  id: string;
  commission_vnd: number;
  status: string;
}

interface Payout {
  id: number;
  amount_vnd: number;
  paid_at: string | null;
}

interface AuditRow {
  id: number;
  timestamp: string;
  user_id: string | null;
  action: string;
  resource_id: string | null;
  audit_metadata: Record<string, unknown>;
}

// Wave 48 — top-N row shape from /api/admin/affiliates/leaderboard-top
interface TopRow {
  user_id: string;
  affiliate_code: string;
  email: string | null;
  tier: string | null;
  total_earned_vnd: number;
  total_available_vnd: number;
  total_orders: number;
}

async function fetchPromoters(): Promise<PromoterRow[]> {
  const r = await fetch('/api/admin/affiliates/promoters', { cache: 'no-store' });
  const d = await r.json();
  if (!r.ok || !d.ok) return [];
  return d.promoters as PromoterRow[];
}

async function fetchCommissionTotals(): Promise<Commission[]> {
  const r = await fetch('/api/admin/affiliates/commissions?status=held,available', {
    cache: 'no-store',
  });
  const d = await r.json();
  if (!r.ok || !d.ok) return [];
  return d.commissions as Commission[];
}

async function fetchPendingPayouts(): Promise<Payout[]> {
  const r = await fetch('/api/admin/affiliates/payouts-ledger?status=pending', {
    cache: 'no-store',
  });
  const d = await r.json();
  if (!r.ok || !d.ok) return [];
  return d.payouts as Payout[];
}

async function fetchActivity(): Promise<AuditRow[]> {
  const r = await fetch('/api/admin/affiliates/activity', { cache: 'no-store' });
  const d = await r.json();
  if (!r.ok || !d.ok) return [];
  return d.activity as AuditRow[];
}

async function fetchTopAffiliates(): Promise<TopRow[]> {
  const r = await fetch('/api/admin/affiliates/leaderboard-top?limit=5', {
    cache: 'no-store',
  });
  const d = await r.json();
  if (!r.ok || !d.ok) return [];
  return d.leaderboard as TopRow[];
}

function dt(iso: string) {
  try {
    return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

export default function AdminAffiliatesPage() {
  const promotersQ = useQuery({ queryKey: ['affiliate-promoters'], queryFn: fetchPromoters });
  const commissionsQ = useQuery({
    queryKey: ['affiliate-commission-totals'],
    queryFn: fetchCommissionTotals,
  });
  const payoutsQ = useQuery({
    queryKey: ['affiliate-pending-payouts'],
    queryFn: fetchPendingPayouts,
  });
  const activityQ = useQuery({
    queryKey: ['affiliate-activity'],
    queryFn: fetchActivity,
    refetchInterval: 30_000,
  });
  const topQ = useQuery({
    queryKey: ['affiliate-top-5'],
    queryFn: fetchTopAffiliates,
  });
  // Legacy KV-side aggregates (powers fraud-flagged + ban counts that haven't
  // been migrated yet).
  const listQ = useQuery({ queryKey: ['affiliates-list'], queryFn: fetchAffiliatesList });
  const fraudQ = useQuery({ queryKey: ['affiliates-fraud'], queryFn: fetchFraudReport });

  const totalPromoters = promotersQ.data?.length ?? 0;
  const l1Total = (promotersQ.data ?? []).reduce((s, p) => s + p.l1_count, 0);
  const l2Total = (promotersQ.data ?? []).reduce((s, p) => s + p.l2_count, 0);
  const l3Total = (promotersQ.data ?? []).reduce((s, p) => s + p.l3_count, 0);
  const commissionTotal = (commissionsQ.data ?? []).reduce(
    (s, c) => s + c.commission_vnd,
    0,
  );
  const pendingPayoutTotal = (payoutsQ.data ?? []).reduce((s, p) => s + p.amount_vnd, 0);
  const fraudActive = fraudQ.data?.active_count ?? 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Affiliate program
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Wave 43.2 — bảng điều khiển restructured. Mỗi resource ở 1 sub-page riêng.
          </p>
        </div>
      </header>

      {/* KPI tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Tổng promoter"
          value={totalPromoters.toLocaleString('vi-VN')}
          hint={`${l1Total} L1 · ${l2Total} L2 · ${l3Total} L3`}
        />
        <StatCard
          label="Commission đang held + available"
          value={vnd(commissionTotal)}
          hint={`${commissionsQ.data?.length ?? 0} dòng`}
        />
        <StatCard
          label="Payout pending"
          value={vnd(pendingPayoutTotal)}
          hint={`${payoutsQ.data?.length ?? 0} dòng`}
        />
        <StatCard
          label="Fraud flag active"
          value={fraudActive.toLocaleString('vi-VN')}
          hint={
            (listQ.data?.affiliates ?? []).filter((a) => a.status === 'banned').length +
            ' affiliate bị ban'
          }
        />
      </div>

      {/* Wave 48 — Top 5 affiliates (admin-only view with email) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Top 5 affiliates this period
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              (mv_affiliate_leaderboard · refreshed hourly)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topQ.isLoading ? (
            <p className="text-sm text-muted-foreground">Đang tải…</p>
          ) : (topQ.data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Materialized view chưa có dữ liệu. Cron job{' '}
              <code className="font-mono text-xs">aff-leaderboard-refresh</code> chạy
              mỗi giờ phút 30.
            </p>
          ) : (
            <ol className="space-y-2">
              {(topQ.data ?? []).map((row, idx) => (
                <li
                  key={row.user_id}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-border py-2 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-right font-mono text-sm text-muted-foreground">
                      #{idx + 1}
                    </span>
                    <div className="space-y-0.5">
                      <div className="font-mono text-sm font-medium">
                        {row.affiliate_code}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {row.email ?? row.user_id.slice(0, 8)}
                        {row.tier && (
                          <span className="ml-2 rounded bg-muted/40 px-1.5 py-0.5 text-[10px] uppercase tracking-wider">
                            {row.tier}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-semibold text-gold">
                      {vnd(row.total_earned_vnd)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {row.total_orders.toLocaleString('vi-VN')} đơn ·{' '}
                      {vnd(row.total_available_vnd)} available
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>

      {/* Sub-page quick-links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Per-resource pages</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <QuickLink
            href="/affiliates/promoters"
            title="Promoters"
            desc="affiliate_network · depth · tier · ban / reparent"
          />
          <QuickLink
            href="/affiliates/referrals"
            title="Referrals tree"
            desc="Cây quan hệ ai mời ai (ltree)"
          />
          <QuickLink
            href="/affiliates/commissions"
            title="Commissions"
            desc="Ledger held / available / paid / clawback"
          />
          <QuickLink
            href="/affiliates/payouts"
            title="Payouts ledger"
            desc="Postgres-side payouts (view-only)"
          />
          <QuickLink
            href="/affiliates/batches"
            title="Payout batches"
            desc="Approve queue · rail · approved_by"
          />
          <QuickLink
            href="/affiliates/codes"
            title="Promo codes"
            desc="Affiliate-tied codes (qua /coupons)"
          />
          <QuickLink
            href="/affiliates/broadcast"
            title="Broadcast"
            desc="Gửi thông báo tới affiliates"
          />
          <QuickLink
            href="/affiliates/fraud"
            title="Fraud report"
            desc="Flag IP duplicate / self-referral / velocity"
          />
        </CardContent>
      </Card>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activityQ.isLoading ? (
            <p className="text-sm text-muted-foreground">Đang tải…</p>
          ) : (activityQ.data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Chưa có audit_log entry nào với action LIKE &apos;affiliate%&apos;.
            </p>
          ) : (
            <ul className="space-y-1 text-sm">
              {(activityQ.data ?? []).map((row) => (
                <li
                  key={row.id}
                  className="flex flex-wrap items-center justify-between border-b border-border py-1.5 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded bg-muted/40 px-2 py-0.5 text-xs font-mono">
                      {row.action}
                    </span>
                    {row.resource_id && (
                      <span className="font-mono text-xs text-muted-foreground">
                        {row.resource_id.slice(0, 8)}
                      </span>
                    )}
                    {row.user_id && (
                      <span className="text-xs text-muted-foreground">{row.user_id}</span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{dt(row.timestamp)}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function QuickLink({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link href={href} className="block">
      <Card className="h-full transition hover:border-gold/40 hover:bg-muted/20">
        <CardContent className="space-y-1 pt-4">
          <div className="font-heading text-base text-gold">{title}</div>
          <p className="text-xs text-muted-foreground">{desc}</p>
          <Button size="sm" variant="ghost" className="mt-2 px-0 text-gold">
            Mở →
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
