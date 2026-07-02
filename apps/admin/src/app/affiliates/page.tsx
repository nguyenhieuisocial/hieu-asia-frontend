/**
 * /admin/affiliates — Wave 60.62.T1.2 consolidated dashboard.
 *
 * Vault 107 §5.2 — 8 sibling routes folded into one tabbed page. Each tab
 * preserves the original Wave 43.2 / 45 / 46 business logic; legacy URLs
 * (e.g. /affiliates/promoters) still resolve via 308 redirects to
 * /affiliates?tab=promoters so email links and vault docs keep working.
 *
 * Inline tabs (Overview, Payouts, Codes) live in this file because their
 * surface is small. Heavier tabs (Promoters, Commissions, Batches,
 * Referrals, Fraud, Broadcast) live as sibling components under
 * `components/admin/affiliates/`.
 *
 * `?tab=<id>` is the URL contract — `useSearchParams` reads it, the active
 * tab pushes back through `router.replace` (no scroll, no history bloat).
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import {
  Sparkles,
  Users,
  DollarSign,
  Package,
  Layers,
  GitBranch,
  ShieldAlert,
  Megaphone,
  Ticket,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { ProductTabs, type ProductTab } from '@/components/admin/product-tabs';
import { fetchAffiliatesList, fetchFraudReport, vnd } from '@/lib/affiliate-admin-api';
import { PromotersTab } from '@/components/admin/affiliates/promoters-tab';
import { CommissionsTab } from '@/components/admin/affiliates/commissions-tab';
import { BatchesTab } from '@/components/admin/affiliates/batches-tab';
import { ReferralsTab } from '@/components/admin/affiliates/referrals-tab';
import { FraudTab } from '@/components/admin/affiliates/fraud-tab';
import { BroadcastTab } from '@/components/admin/affiliates/broadcast-tab';

// Recharts lazy-loaded for the Payouts tab trend — keeps it out of the
// initial admin bundle (tasks page pattern). ssr:false (auth-gated admin).
const PayoutTrendChart = dynamic(
  () => import('@/components/affiliates/PayoutTrendChart').then((m) => m.PayoutTrendChart),
  {
    ssr: false,
    loading: () => <div className="h-56 animate-pulse rounded bg-muted/30" aria-hidden />,
  },
);

const VALID_TABS = [
  'overview',
  'promoters',
  'commissions',
  'payouts',
  'batches',
  'referrals',
  'fraud',
  'codes',
  'broadcast',
] as const;
type TabId = (typeof VALID_TABS)[number];

function isValidTab(v: string | null): v is TabId {
  return v !== null && (VALID_TABS as readonly string[]).includes(v);
}

export default function AdminAffiliatesPage() {
  // useSearchParams() requires a Suspense boundary (App Router CSR bailout).
  // Local boundary keeps sidebar/topbar mounted while ?tab= resolves.
  return (
    <React.Suspense fallback={<div className="h-72 animate-pulse rounded bg-muted/30" />}>
      <AdminAffiliatesPageInner />
    </React.Suspense>
  );
}

function AdminAffiliatesPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const param = searchParams.get('tab');
  const active: TabId = isValidTab(param) ? param : 'overview';

  const onTabChange = React.useCallback(
    (id: string) => {
      const next = new URLSearchParams(searchParams.toString());
      next.set('tab', id);
      // Drop tab-specific query params when switching tabs so stale
      // `?root=…` or `?batchId=…` don't leak across tabs.
      if (id !== 'referrals') next.delete('root');
      if (id !== 'batches') {
        next.delete('batchId');
        next.delete('id');
      }
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const tabs: ProductTab[] = React.useMemo(
    () => [
      {
        id: 'overview',
        label: 'Tổng quan',
        icon: <Sparkles size={16} />,
        content: <OverviewTab />,
      },
      {
        id: 'promoters',
        label: 'Promoters',
        icon: <Users size={16} />,
        content: <PromotersTab />,
      },
      {
        id: 'commissions',
        label: 'Hoa hồng',
        icon: <DollarSign size={16} />,
        content: <CommissionsTab />,
      },
      {
        id: 'payouts',
        label: 'Đợt chi',
        icon: <Package size={16} />,
        content: <PayoutsInlineTab />,
      },
      {
        id: 'batches',
        label: 'Batches',
        icon: <Layers size={16} />,
        content: <BatchesTab />,
      },
      {
        id: 'referrals',
        label: 'Referrals',
        icon: <GitBranch size={16} />,
        content: <ReferralsTab />,
      },
      {
        id: 'fraud',
        label: 'Fraud',
        icon: <ShieldAlert size={16} />,
        content: <FraudTab />,
      },
      {
        id: 'codes',
        label: 'Codes',
        icon: <Ticket size={16} />,
        content: <CodesInlineTab />,
      },
      {
        id: 'broadcast',
        label: 'Broadcast',
        icon: <Megaphone size={16} />,
        content: <BroadcastTab />,
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Affiliate program"
        description="Wave 60.62 — 8 sub-routes consolidated thành tab. Mọi business logic Wave 43-46 giữ nguyên."
      />
      <ProductTabs tabs={tabs} value={active} onValueChange={onTabChange} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Overview tab — inline. Reuses the original Wave 43.2 KPI tiles + top-5
// leaderboard + recent activity. Renders inside the consolidated page.
// ---------------------------------------------------------------------------

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

interface PayoutRow {
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

async function fetchPendingPayouts(): Promise<PayoutRow[]> {
  const r = await fetch('/api/admin/affiliates/payouts-ledger?status=pending', {
    cache: 'no-store',
  });
  const d = await r.json();
  if (!r.ok || !d.ok) return [];
  return d.payouts as PayoutRow[];
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

function OverviewTab() {
  const promotersQ = useQuery({ queryKey: ['affiliate-promoters'], queryFn: fetchPromoters, staleTime: 60_000 });
  const commissionsQ = useQuery({
    queryKey: ['affiliate-commission-totals'],
    queryFn: fetchCommissionTotals,
    staleTime: 60_000,
  });
  const payoutsQ = useQuery({
    queryKey: ['affiliate-pending-payouts'],
    queryFn: fetchPendingPayouts,
    staleTime: 60_000,
  });
  const activityQ = useQuery({
    queryKey: ['affiliate-activity'],
    queryFn: fetchActivity,
    refetchInterval: 30_000,
  });
  const topQ = useQuery({
    queryKey: ['affiliate-top-5'],
    queryFn: fetchTopAffiliates,
    staleTime: 60_000,
  });
  const listQ = useQuery({ queryKey: ['affiliates-list'], queryFn: fetchAffiliatesList, staleTime: 60_000 });
  const fraudQ = useQuery({ queryKey: ['affiliates-fraud'], queryFn: fetchFraudReport, staleTime: 60_000 });

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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile
          label="Tổng promoter"
          value={totalPromoters.toLocaleString('vi-VN')}
          hint={`${l1Total} L1 · ${l2Total} L2 · ${l3Total} L3`}
        />
        <KpiTile
          label="Commission held + available"
          value={vnd(commissionTotal)}
          hint={`${commissionsQ.data?.length ?? 0} dòng`}
        />
        <KpiTile
          label="Payout pending"
          value={vnd(pendingPayoutTotal)}
          hint={`${payoutsQ.data?.length ?? 0} dòng`}
        />
        <KpiTile
          label="Fraud flag active"
          value={fraudActive.toLocaleString('vi-VN')}
          hint={
            (listQ.data?.affiliates ?? []).filter((a) => a.status === 'banned').length +
            ' affiliate bị ban'
          }
        />
      </div>

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
            <EmptyState
              title="Chưa có affiliate nào"
              description="Khi có affiliate phát sinh hoa hồng, bảng xếp hạng sẽ hiển thị ở đây."
            />
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activityQ.isLoading ? (
            <p className="text-sm text-muted-foreground">Đang tải…</p>
          ) : (activityQ.data ?? []).length === 0 ? (
            <EmptyState
              title="Chưa có hoạt động"
              description="Các thao tác liên quan đến affiliate sẽ xuất hiện ở đây khi phát sinh."
            />
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
                      // Không link: resource_id có thể là payout/commission id —
                      // trỏ bừa sang /affiliates/{id} sẽ 404. Tooltip full id.
                      <span
                        className="font-mono text-xs text-muted-foreground"
                        title={row.resource_id}
                      >
                        {row.resource_id.slice(0, 8)}
                      </span>
                    )}
                    {row.user_id && (
                      <Link
                        href={`/customers/${encodeURIComponent(row.user_id)}`}
                        className="text-xs text-muted-foreground underline decoration-dotted underline-offset-2 hover:text-gold"
                        title="Mở hồ sơ khách hàng"
                      >
                        {row.user_id}
                      </Link>
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

function KpiTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card>
      <CardContent className="space-y-1 pt-4">
        <p className="text-xs uppercase text-muted-foreground">{label}</p>
        <p className="font-heading text-2xl text-gold">{value}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Payouts ledger — Wave 43.2 (view-only). Inline because the surface is
// small (single fetch + filter row + table) and folding it back into the
// parent file keeps the per-file cap of Wave 60.62.T1.2 in budget.
// ---------------------------------------------------------------------------

interface PayoutLedgerRow {
  id: number;
  affiliate_code: string;
  period: string;
  amount_vnd: number;
  paid_at: string | null;
  method: string | null;
  reference: string | null;
  batch_id: string | null;
}

type PayoutStatus = 'all' | 'pending' | 'paid';

async function fetchPayoutsLedger(status: PayoutStatus): Promise<PayoutLedgerRow[]> {
  const qs = status === 'all' ? '' : `?status=${status}`;
  const r = await fetch(`/api/admin/affiliates/payouts-ledger${qs}`, { cache: 'no-store' });
  const d = await r.json();
  if (!r.ok || !d.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
  return d.payouts as PayoutLedgerRow[];
}

function dtSafe(iso: string | null) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

function PayoutsInlineTab() {
  const [status, setStatus] = React.useState<PayoutStatus>('all');

  const q = useQuery({
    queryKey: ['affiliate-payouts-ledger', status],
    queryFn: () => fetchPayoutsLedger(status),
    refetchInterval: 60_000,
  });

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Postgres-side affiliate_payouts. Tạo payout từ batch (Wave 45).
      </p>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-2 pt-6">
          {(['all', 'pending', 'paid'] as const).map((s) => (
            <Button
              key={s}
              size="sm"
              variant={status === s ? 'default' : 'ghost'}
              onClick={() => setStatus(s)}
              className={status === s ? '' : 'border border-border'}
            >
              {s}
            </Button>
          ))}
          <div className="ml-auto text-sm text-muted-foreground">
            {q.data?.length ?? 0} dòng
          </div>
        </CardContent>
      </Card>

      {!q.isLoading && !q.error && (
        <PayoutTrendChart rows={q.data ?? []} />
      )}

      <Card>
        <CardContent className="overflow-x-auto pt-6">
          {q.isLoading ? (
            <p className="text-sm text-muted-foreground">Đang tải…</p>
          ) : q.error ? (
            <p className="text-sm text-red-700 dark:text-red-300">{(q.error as Error).message}</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="pb-2 pr-3">ID</th>
                  <th className="pb-2 pr-3">Code</th>
                  <th className="pb-2 pr-3">Period</th>
                  <th className="pb-2 pr-3 text-right">Số tiền</th>
                  <th className="pb-2 pr-3">Method</th>
                  <th className="pb-2 pr-3">Batch</th>
                  <th className="pb-2 pr-3">Paid at</th>
                  <th className="pb-2">Reference</th>
                </tr>
              </thead>
              <tbody>
                {(q.data ?? []).map((p) => (
                  <tr key={p.id} className="border-b border-border hover:bg-muted/30">
                    <td className="py-2 pr-3 font-mono text-xs text-muted-foreground">
                      {p.id}
                    </td>
                    <td className="py-2 pr-3 font-mono text-gold">{p.affiliate_code}</td>
                    <td className="py-2 pr-3">{p.period}</td>
                    <td className="py-2 pr-3 text-right font-mono text-gold">
                      {vnd(p.amount_vnd)}
                    </td>
                    <td className="py-2 pr-3">{p.method ?? '—'}</td>
                    <td className="py-2 pr-3">
                      {p.batch_id ? (
                        <Link
                          href={`/affiliates?tab=batches&batchId=${p.batch_id}`}
                          className="font-mono text-xs text-gold hover:underline"
                        >
                          {p.batch_id.slice(0, 8)}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-2 pr-3 text-xs text-muted-foreground">
                      {dtSafe(p.paid_at)}
                    </td>
                    <td className="py-2 font-mono text-xs">{p.reference ?? '—'}</td>
                  </tr>
                ))}
                {q.data && q.data.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-muted-foreground">
                      Chưa có payout nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Codes tab — inline link page. Affiliate-tied promo codes share the same
// `hieu_asia.coupons` table as B2C, so this tab just deep-links into the
// /coupons surface. Preserved as a tab so the consolidated nav still
// surfaces the option (otherwise founders forget the feature exists).
// ---------------------------------------------------------------------------

function CodesInlineTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Affiliate-tied promo codes dùng chung bảng <code>hieu_asia.coupons</code> với coupons B2C.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mở trang Coupons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            Promo code gắn affiliate (có <code>tier_filter</code> hoặc affiliate-specific
            discount) hiện được quản lý chung với coupons B2C. Trang Coupons hỗ trợ tạo / sửa
            / vô hiệu hoá / xem usage.
          </p>
          <p className="text-muted-foreground">
            Hướng mở rộng (Wave 44+): tạo riêng tab Affiliate-only ở trang Coupons, hoặc tách
            schema <code>affiliate_codes</code> nếu yêu cầu reporting riêng biệt.
          </p>
          <Link href="/coupons">
            <Button>Mở /coupons</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
