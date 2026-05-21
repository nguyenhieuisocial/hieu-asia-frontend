/**
 * /admin/affiliates — fully-featured affiliate program control panel.
 *
 * Tabs: Overview · Leaderboard · Pending payouts · Fraud report · Marketing assets · Broadcast
 * Plus: KPI cards, tier badges, realtime ticker, detail drawer, CSV export, bulk actions.
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
  Checkbox,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  toast,
} from '@hieu-asia/ui';
import {
  analyseFraud,
  approvePayout,
  computeKpis,
  downloadCsv,
  dt,
  dtFull,
  fetchAffiliatesList,
  fetchFraudReport,
  getTier,
  MARKETING_ASSETS,
  suspendAffiliate,
  vnd,
  type Affiliate,
} from '@/lib/affiliate-admin-api';
import { TierBadge } from '@/components/affiliates/tier-badge';
import { AffiliateDrawer } from '@/components/affiliates/affiliate-drawer';
import { PaymentTicker } from '@/components/affiliates/payment-ticker';
import { StatCard } from '@/components/stat-card';

type SortKey = 'earnings' | 'clicks' | 'conversions' | 'created';
type StatusFilter = 'all' | 'active' | 'banned';
type TabKey = 'overview' | 'leaderboard' | 'payouts' | 'fraud' | 'assets' | 'broadcast';

export default function AdminAffiliatesPage() {
  const [tab, setTab] = React.useState<TabKey>('overview');
  const [drawerId, setDrawerId] = React.useState<string | null>(null);

  const listQuery = useQuery({
    queryKey: ['affiliates-list'],
    queryFn: fetchAffiliatesList,
    refetchInterval: 60_000,
  });
  const fraudQuery = useQuery({
    queryKey: ['affiliates-fraud'],
    queryFn: fetchFraudReport,
    refetchInterval: 120_000,
    enabled: tab === 'fraud' || tab === 'overview',
  });

  const list = listQuery.data;
  const kpis = React.useMemo(() => (list ? computeKpis(list) : null), [list]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-cream">Affiliate program</h1>
          <p className="mt-1 text-sm text-cream/60">
            Bảng điều khiển realtime: KPIs, leaderboard, payouts, fraud, assets, broadcast.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            className="border border-cream/20"
            onClick={() => listQuery.refetch()}
          >
            Làm mới
          </Button>
        </div>
      </header>

      {kpis?.computed_client_side && (
        <p className="rounded border border-yellow-500/30 bg-yellow-500/5 px-3 py-2 text-xs text-yellow-200">
          KPIs đang tính client-side. Cần endpoint{' '}
          <code className="font-mono">GET /admin/affiliates/stats</code> ở worker để chính xác hơn.
        </p>
      )}

      {/* KPI cards — always visible on top */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Tổng affiliate"
          value={kpis ? kpis.total_affiliates.toLocaleString('vi-VN') : '—'}
          hint={kpis ? `${kpis.active_this_month} active tháng này` : undefined}
        />
        <StatCard
          label="Conversions"
          value={kpis ? kpis.total_conversions.toLocaleString('vi-VN') : '—'}
          hint={kpis ? `${kpis.total_clicks.toLocaleString('vi-VN')} clicks` : undefined}
        />
        <StatCard
          label="Conv. rate"
          value={kpis ? (kpis.conversion_rate * 100).toFixed(2) + '%' : '—'}
          delta={
            kpis
              ? {
                  value: kpis.conversion_rate > 0.05 ? 'healthy' : 'low',
                  direction: kpis.conversion_rate > 0.05 ? 'up' : 'flat',
                }
              : undefined
          }
        />
        <StatCard
          label="Đã trả MTD"
          value={kpis ? vnd(kpis.total_commission_paid_mtd) : '—'}
          hint={kpis ? `Pending ${vnd(kpis.pending_commission)}` : undefined}
        />
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
        <TabsList className="flex flex-wrap gap-1 h-auto">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="payouts">
            Payouts
            {list && list.pending_payouts.length > 0 && (
              <span className="ml-1.5 rounded-full bg-gold/20 px-1.5 py-0.5 text-[10px] text-gold">
                {list.pending_payouts.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="fraud">
            Fraud
            {fraudQuery.data && fraudQuery.data.active_count > 0 && (
              <span className="ml-1.5 rounded-full bg-red-500/20 px-1.5 py-0.5 text-[10px] text-red-300">
                {fraudQuery.data.active_count}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <OverviewTab
            listQuery={listQuery}
            fraudCount={fraudQuery.data?.active_count ?? 0}
            onOpenDrawer={setDrawerId}
          />
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <LeaderboardTab listQuery={listQuery} onOpenDrawer={setDrawerId} />
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4">
          <PayoutsTab listQuery={listQuery} onOpenDrawer={setDrawerId} />
        </TabsContent>

        <TabsContent value="fraud" className="space-y-4">
          <FraudTab fraudQuery={fraudQuery} listQuery={listQuery} />
        </TabsContent>

        <TabsContent value="assets" className="space-y-4">
          <AssetsTab />
        </TabsContent>

        <TabsContent value="broadcast" className="space-y-4">
          <BroadcastTab />
        </TabsContent>
      </Tabs>

      <AffiliateDrawer
        affiliateId={drawerId}
        onClose={() => setDrawerId(null)}
        onChange={() => listQuery.refetch()}
      />

      <PaymentTicker />
    </div>
  );
}

// ============== Overview ==============

function OverviewTab({
  listQuery,
  fraudCount,
  onOpenDrawer,
}: {
  listQuery: ReturnType<typeof useQuery<Awaited<ReturnType<typeof fetchAffiliatesList>>>>;
  fraudCount: number;
  onOpenDrawer: (id: string) => void;
}) {
  const list = listQuery.data;
  if (listQuery.isLoading) return <p className="text-sm text-cream/60">Đang tải…</p>;
  if (listQuery.error)
    return <p className="text-sm text-red-300">{(listQuery.error as Error).message}</p>;
  if (!list) return null;

  const tiered = list.affiliates.map((a) => ({ ...a, tier: getTier(a.stats.conversions) }));
  const byTier = {
    platinum: tiered.filter((a) => a.tier.tier === 'platinum').length,
    gold: tiered.filter((a) => a.tier.tier === 'gold').length,
    silver: tiered.filter((a) => a.tier.tier === 'silver').length,
    bronze: tiered.filter((a) => a.tier.tier === 'bronze').length,
  };
  const topMovers = [...list.affiliates]
    .sort((a, b) => b.stats.total_earned - a.stats.total_earned)
    .slice(0, 5);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Phân phối tier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3 text-center">
            <TierStat tier="platinum" count={byTier.platinum} />
            <TierStat tier="gold" count={byTier.gold} />
            <TierStat tier="silver" count={byTier.silver} />
            <TierStat tier="bronze" count={byTier.bronze} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cảnh báo nhanh</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Alert
            tone={list.pending_payouts.length > 0 ? 'warn' : 'ok'}
            text={
              list.pending_payouts.length > 0
                ? `${list.pending_payouts.length} yêu cầu rút đang chờ duyệt (${vnd(
                    list.pending_payouts.reduce((s, p) => s + p.amount, 0),
                  )})`
                : 'Không có payout pending.'
            }
          />
          <Alert
            tone={fraudCount > 0 ? 'danger' : 'ok'}
            text={fraudCount > 0 ? `${fraudCount} flag fraud đang active` : 'Không có flag fraud.'}
          />
          <Alert
            tone="ok"
            text={`${list.affiliates.filter((a) => a.status === 'banned').length} affiliate đang bị ban.`}
          />
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Top 5 earners</CardTitle>
          <Link href="#" onClick={(e) => { e.preventDefault(); }}>
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                downloadCsv(
                  'top-earners.csv',
                  topMovers.map((a) => ({
                    code: a.code,
                    name: a.display_name,
                    earned: a.stats.total_earned,
                    conversions: a.stats.conversions,
                  })),
                )
              }
            >
              CSV
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <tbody>
              {topMovers.map((a) => (
                <tr
                  key={a.id}
                  className="cursor-pointer border-b border-cream/5 hover:bg-cream/5"
                  onClick={() => onOpenDrawer(a.id)}
                >
                  <td className="py-2 font-mono text-gold">{a.code}</td>
                  <td className="py-2 text-cream/80">{a.display_name}</td>
                  <td className="py-2">
                    <TierBadge conversions={a.stats.conversions} />
                  </td>
                  <td className="py-2 text-right font-mono text-gold">{vnd(a.stats.total_earned)}</td>
                </tr>
              ))}
              {topMovers.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-cream/50">
                    Chưa có affiliate.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function TierStat({
  tier,
  count,
}: {
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  count: number;
}) {
  const info = getTier(
    tier === 'platinum' ? 200 : tier === 'gold' ? 50 : tier === 'silver' ? 10 : 0,
  );
  return (
    <div className="rounded border border-cream/10 bg-ink/40 p-2">
      <TierBadge conversions={info.threshold} />
      <div className="mt-1 font-heading text-xl text-cream">{count}</div>
    </div>
  );
}

function Alert({ tone, text }: { tone: 'ok' | 'warn' | 'danger'; text: string }) {
  const cls =
    tone === 'danger'
      ? 'border-red-500/30 bg-red-500/5 text-red-200'
      : tone === 'warn'
        ? 'border-gold/30 bg-gold/5 text-gold'
        : 'border-jade/30 bg-jade/5 text-jade-50';
  return <div className={`rounded border px-2 py-1.5 text-xs ${cls}`}>{text}</div>;
}

// ============== Leaderboard ==============

function LeaderboardTab({
  listQuery,
  onOpenDrawer,
}: {
  listQuery: ReturnType<typeof useQuery<Awaited<ReturnType<typeof fetchAffiliatesList>>>>;
  onOpenDrawer: (id: string) => void;
}) {
  const [search, setSearch] = React.useState('');
  const [sort, setSort] = React.useState<SortKey>('earnings');
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>('all');
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [busy, setBusy] = React.useState(false);

  const list = listQuery.data;
  const filtered = React.useMemo(() => {
    if (!list) return [];
    let rows = list.affiliates;
    if (statusFilter !== 'all') rows = rows.filter((a) => a.status === statusFilter);
    const q = search.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (a) =>
          a.code.toLowerCase().includes(q) ||
          a.display_name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q),
      );
    }
    return [...rows].sort((a, b) => {
      if (sort === 'earnings') return b.stats.total_earned - a.stats.total_earned;
      if (sort === 'clicks') return b.stats.clicks - a.stats.clicks;
      if (sort === 'conversions') return b.stats.conversions - a.stats.conversions;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [list, search, sort, statusFilter]);

  const allOnPageSelected =
    filtered.length > 0 && filtered.every((a) => selected.has(a.id));

  function toggle(id: string) {
    setSelected((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((cur) => {
      if (filtered.every((a) => cur.has(a.id))) {
        const next = new Set(cur);
        for (const a of filtered) next.delete(a.id);
        return next;
      }
      const next = new Set(cur);
      for (const a of filtered) next.add(a.id);
      return next;
    });
  }

  function exportLeaderboard() {
    downloadCsv(
      `affiliate-leaderboard-${new Date().toISOString().slice(0, 10)}.csv`,
      filtered.map((a, idx) => ({
        rank: idx + 1,
        code: a.code,
        name: a.display_name,
        email: a.email,
        tier: getTier(a.stats.conversions).label,
        clicks: a.stats.clicks,
        conversions: a.stats.conversions,
        total_earned: a.stats.total_earned,
        pending: a.stats.pending_payout,
        paid: a.stats.paid_total,
        status: a.status,
        created_at: a.created_at,
      })),
    );
  }

  async function bulkSuspend(banned: boolean) {
    if (selected.size === 0) return;
    if (!confirm(`${banned ? 'Suspend' : 'Unsuspend'} ${selected.size} affiliate?`)) return;
    setBusy(true);
    let ok = 0;
    let fail = 0;
    try {
      await Promise.all(
        Array.from(selected).map(async (id) => {
          try {
            await suspendAffiliate(id, banned);
            ok += 1;
          } catch {
            fail += 1;
          }
        }),
      );
      toast.success(`${banned ? 'Suspended' : 'Unsuspended'} ${ok}${fail ? ` · ${fail} lỗi` : ''}`);
      setSelected(new Set());
      listQuery.refetch();
    } finally {
      setBusy(false);
    }
  }

  function bulkMessage() {
    if (selected.size === 0) return;
    const codes = filtered.filter((a) => selected.has(a.id)).map((a) => a.code).join(',');
    window.location.href = `/affiliates/broadcast?codes=${encodeURIComponent(codes)}`;
  }

  return (
    <>
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 pt-6">
          <Input
            placeholder="Tìm mã, tên, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded border border-cream/20 bg-ink p-2 text-sm text-cream"
          >
            <option value="earnings">Sort: Earnings</option>
            <option value="clicks">Sort: Clicks</option>
            <option value="conversions">Sort: Conversions</option>
            <option value="created">Sort: Mới nhất</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="rounded border border-cream/20 bg-ink p-2 text-sm text-cream"
          >
            <option value="all">Status: tất cả</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>
          <Button variant="ghost" className="border border-cream/20" onClick={exportLeaderboard}>
            Export CSV
          </Button>
          <div className="ml-auto text-sm text-cream/60">
            {filtered.length} / {list?.affiliates.length ?? 0}
          </div>
        </CardContent>
      </Card>

      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded border border-gold/30 bg-gold/5 p-3 text-sm">
          <span className="font-semibold text-gold">{selected.size} đã chọn</span>
          <Button size="sm" variant="ghost" onClick={bulkMessage} disabled={busy}>
            Gửi message
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => bulkSuspend(true)}
            disabled={busy}
            className="border border-red-500/30 text-red-300"
          >
            Suspend
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => bulkSuspend(false)}
            disabled={busy}
          >
            Unsuspend
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
            Bỏ chọn
          </Button>
        </div>
      )}

      <Card>
        <CardContent className="overflow-x-auto pt-6">
          <table className="w-full text-sm">
            <thead className="border-b border-cream/10 text-left text-xs uppercase text-cream/60">
              <tr>
                <th className="pb-2 pr-2 w-8">
                  <Checkbox checked={allOnPageSelected} onChange={toggleAll} />
                </th>
                <th className="pb-2 pr-3">#</th>
                <th className="pb-2 pr-3">Mã</th>
                <th className="pb-2 pr-3">Tên</th>
                <th className="pb-2 pr-3">Tier</th>
                <th className="pb-2 pr-3 text-right">Clicks</th>
                <th className="pb-2 pr-3 text-right">Conv.</th>
                <th className="pb-2 pr-3 text-right">Earned</th>
                <th className="pb-2 pr-3">Status</th>
                <th className="pb-2">Tạo</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, idx) => (
                <AffiliateRow
                  key={a.id}
                  affiliate={a}
                  rank={idx + 1}
                  selected={selected.has(a.id)}
                  onToggle={() => toggle(a.id)}
                  onOpen={() => onOpenDrawer(a.id)}
                />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-6 text-center text-cream/50">
                    Không có kết quả nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </>
  );
}

function AffiliateRow({
  affiliate,
  rank,
  selected,
  onToggle,
  onOpen,
}: {
  affiliate: Affiliate;
  rank: number;
  selected: boolean;
  onToggle: () => void;
  onOpen: () => void;
}) {
  return (
    <tr className="border-b border-cream/5 hover:bg-cream/5">
      <td className="py-2 pr-2" onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={selected} onChange={onToggle} />
      </td>
      <td className="py-2 pr-3 font-mono text-xs text-cream/50">{rank}</td>
      <td className="py-2 pr-3 font-mono">
        <button onClick={onOpen} className="text-gold hover:underline">
          {affiliate.code}
        </button>
      </td>
      <td className="py-2 pr-3">{affiliate.display_name}</td>
      <td className="py-2 pr-3">
        <TierBadge conversions={affiliate.stats.conversions} withProgress />
      </td>
      <td className="py-2 pr-3 text-right font-mono">{affiliate.stats.clicks}</td>
      <td className="py-2 pr-3 text-right font-mono">{affiliate.stats.conversions}</td>
      <td className="py-2 pr-3 text-right font-mono text-gold">
        {vnd(affiliate.stats.total_earned)}
      </td>
      <td className="py-2 pr-3">
        {affiliate.status === 'active' ? (
          <span className="text-green-400">Active</span>
        ) : (
          <span className="text-red-400">Banned</span>
        )}
      </td>
      <td className="py-2 text-cream/60">{dt(affiliate.created_at)}</td>
    </tr>
  );
}

// ============== Payouts ==============

function PayoutsTab({
  listQuery,
  onOpenDrawer,
}: {
  listQuery: ReturnType<typeof useQuery<Awaited<ReturnType<typeof fetchAffiliatesList>>>>;
  onOpenDrawer: (id: string) => void;
}) {
  const list = listQuery.data;
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [busy, setBusy] = React.useState(false);

  const payouts = list?.pending_payouts ?? [];

  const total = payouts.reduce((s, p) => s + p.amount, 0);

  function toggle(id: string) {
    setSelected((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function toggleAll() {
    setSelected((cur) =>
      payouts.every((p) => cur.has(p.id)) ? new Set() : new Set(payouts.map((p) => p.id)),
    );
  }
  function exportCsv() {
    downloadCsv(
      `pending-payouts-${new Date().toISOString().slice(0, 10)}.csv`,
      payouts.map((p) => ({
        id: p.id,
        affiliate_id: p.affiliate_id,
        amount: p.amount,
        requested_at: p.requested_at,
      })),
    );
  }

  async function bulkMarkPaid() {
    if (selected.size === 0) return;
    if (!confirm(`Mark as paid cho ${selected.size} payout?`)) return;
    setBusy(true);
    let ok = 0;
    let fail = 0;
    try {
      await Promise.all(
        Array.from(selected).map(async (payoutId) => {
          const p = payouts.find((x) => x.id === payoutId);
          if (!p) return;
          try {
            await approvePayout(p.affiliate_id, p.id);
            ok += 1;
          } catch {
            fail += 1;
          }
        }),
      );
      toast.success(`Marked paid ${ok}${fail ? ` · ${fail} lỗi` : ''}`);
      setSelected(new Set());
      listQuery.refetch();
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Card className="border-gold/30 bg-gold/5">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
          <div>
            <div className="font-heading text-2xl text-gold">{vnd(total)}</div>
            <div className="text-xs text-cream/60">
              {payouts.length} yêu cầu đang chờ
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" className="border border-cream/20" onClick={exportCsv}>
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded border border-gold/30 bg-gold/5 p-3 text-sm">
          <span className="font-semibold text-gold">{selected.size} đã chọn</span>
          <Button size="sm" disabled={busy} onClick={bulkMarkPaid}>
            Mark as paid (bulk)
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
            Bỏ chọn
          </Button>
        </div>
      )}

      <Card>
        <CardContent className="overflow-x-auto pt-6">
          {payouts.length === 0 ? (
            <p className="text-sm text-cream/50">Không có payout pending.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-cream/10 text-left text-xs uppercase text-cream/60">
                <tr>
                  <th className="pb-2 pr-2 w-8">
                    <Checkbox
                      checked={payouts.length > 0 && payouts.every((p) => selected.has(p.id))}
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="pb-2 pr-3">Payout ID</th>
                  <th className="pb-2 pr-3">Affiliate</th>
                  <th className="pb-2 pr-3 text-right">Số tiền</th>
                  <th className="pb-2 pr-3">Yêu cầu lúc</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p) => {
                  const aff = list?.affiliates.find((a) => a.id === p.affiliate_id);
                  return (
                    <tr key={p.id} className="border-b border-cream/5 hover:bg-cream/5">
                      <td className="py-2 pr-2">
                        <Checkbox checked={selected.has(p.id)} onChange={() => toggle(p.id)} />
                      </td>
                      <td className="py-2 pr-3 font-mono text-xs text-cream/60">{p.id}</td>
                      <td className="py-2 pr-3">
                        <button
                          onClick={() => onOpenDrawer(p.affiliate_id)}
                          className="font-mono text-gold hover:underline"
                        >
                          {aff?.code ?? p.affiliate_id.slice(0, 8)}
                        </button>{' '}
                        {aff && <span className="text-cream/70">— {aff.display_name}</span>}
                      </td>
                      <td className="py-2 pr-3 text-right font-mono text-gold">{vnd(p.amount)}</td>
                      <td className="py-2 pr-3 text-cream/60">{dtFull(p.requested_at)}</td>
                      <td className="py-2">
                        <Button
                          size="sm"
                          disabled={busy}
                          onClick={async () => {
                            setBusy(true);
                            try {
                              await approvePayout(p.affiliate_id, p.id);
                              toast.success(`Đã đánh dấu trả ${vnd(p.amount)}`);
                              listQuery.refetch();
                            } catch (e) {
                              toast.error((e as Error).message);
                            } finally {
                              setBusy(false);
                            }
                          }}
                        >
                          Mark paid
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </>
  );
}

// ============== Fraud ==============

function FraudTab({
  fraudQuery,
  listQuery,
}: {
  fraudQuery: ReturnType<typeof useQuery<Awaited<ReturnType<typeof fetchFraudReport>>>>;
  listQuery: ReturnType<typeof useQuery<Awaited<ReturnType<typeof fetchAffiliatesList>>>>;
}) {
  if (fraudQuery.isLoading) return <p className="text-sm text-cream/60">Đang tải fraud report…</p>;
  if (fraudQuery.error)
    return <p className="text-sm text-red-300">{(fraudQuery.error as Error).message}</p>;
  const data = fraudQuery.data;
  if (!data) return null;

  const insights = analyseFraud(data.flags, listQuery.data?.affiliates ?? []);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <FraudStat label="IP duplicate" count={insights.by_reason.ip_duplicate.length} tone="orange" />
        <FraudStat label="Self-referral" count={insights.by_reason.self_referral.length} tone="red" />
        <FraudStat label="Velocity" count={insights.by_reason.velocity.length} tone="yellow" />
        <FraudStat label="Manual" count={insights.by_reason.manual.length} tone="neutral" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Ratio anomalies — conv/click {'>'} 40% ({insights.ratio_anomalies.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {insights.ratio_anomalies.length === 0 ? (
            <p className="text-sm text-cream/50">Không phát hiện anomaly nào.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-cream/10 text-left text-xs uppercase text-cream/60">
                <tr>
                  <th className="pb-2 pr-3">Mã</th>
                  <th className="pb-2 pr-3 text-right">Clicks</th>
                  <th className="pb-2 pr-3 text-right">Conv.</th>
                  <th className="pb-2 pr-3 text-right">Ratio</th>
                </tr>
              </thead>
              <tbody>
                {insights.ratio_anomalies.map((r) => (
                  <tr key={r.code} className="border-b border-cream/5">
                    <td className="py-1.5 pr-3 font-mono text-gold">{r.code}</td>
                    <td className="py-1.5 pr-3 text-right">{r.clicks}</td>
                    <td className="py-1.5 pr-3 text-right">{r.convs}</td>
                    <td className="py-1.5 pr-3 text-right font-mono text-red-300">
                      {(r.ratio * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Flag đang active ({data.active_count})</CardTitle>
          <Link href="/affiliates/fraud">
            <Button size="sm" variant="ghost" className="border border-cream/20">
              Trang fraud đầy đủ
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {data.flags.filter((f) => !f.cleared_at).length === 0 ? (
            <p className="text-sm text-cream/50">Không có flag active.</p>
          ) : (
            <div className="space-y-2">
              {data.flags
                .filter((f) => !f.cleared_at)
                .slice(0, 10)
                .map((f) => (
                  <div
                    key={f.code}
                    className="rounded border border-red-500/30 bg-red-500/5 p-3 text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/affiliates/${f.affiliate_id}`}
                        className="font-mono text-gold hover:underline"
                      >
                        {f.code}
                      </Link>
                      <span className="rounded bg-red-500/15 px-2 py-0.5 text-[10px] uppercase text-red-300">
                        {f.reason}
                      </span>
                    </div>
                    <div className="mt-1 text-cream/80">{f.detail}</div>
                    <div className="mt-1 text-xs text-cream/50">Flagged: {dtFull(f.flagged_at)}</div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function FraudStat({
  label,
  count,
  tone,
}: {
  label: string;
  count: number;
  tone: 'orange' | 'red' | 'yellow' | 'neutral';
}) {
  const toneCls =
    tone === 'red'
      ? 'border-red-500/30 bg-red-500/5'
      : tone === 'orange'
        ? 'border-orange-500/30 bg-orange-500/5'
        : tone === 'yellow'
          ? 'border-yellow-500/30 bg-yellow-500/5'
          : 'border-cream/20 bg-cream/5';
  return (
    <div className={`rounded border p-3 ${toneCls}`}>
      <div className="text-xs uppercase tracking-wider text-cream/60">{label}</div>
      <div className="mt-1 font-heading text-2xl">{count}</div>
    </div>
  );
}

// ============== Assets ==============

function AssetsTab() {
  const [filter, setFilter] = React.useState<string>('all');
  const filtered = filter === 'all'
    ? MARKETING_ASSETS
    : MARKETING_ASSETS.filter((a) => a.kind === filter);

  return (
    <>
      <Card>
        <CardContent className="flex flex-wrap items-center gap-2 pt-6">
          <span className="text-sm text-cream/60">Lọc:</span>
          {(['all', 'banner', 'social', 'video', 'copy', 'landing'] as const).map((k) => (
            <Button
              key={k}
              size="sm"
              variant={filter === k ? 'default' : 'ghost'}
              onClick={() => setFilter(k)}
              className={filter === k ? '' : 'border border-cream/20'}
            >
              {k}
            </Button>
          ))}
          <div className="ml-auto text-sm text-cream/60">
            {filtered.length} / {MARKETING_ASSETS.length}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((asset) => (
          <Card key={asset.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-sm">{asset.title}</CardTitle>
              <p className="text-xs text-cream/55">
                {asset.kind} · {asset.size}
              </p>
            </CardHeader>
            <CardContent className="mt-auto space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-cream/60 text-xs">Downloads:</span>
                <span className="font-mono text-gold">{asset.download_count ?? 0}</span>
              </div>
              <code className="block truncate rounded bg-ink/60 px-2 py-1 text-[10px] text-cream/70">
                {asset.url}
              </code>
              <div className="flex gap-2">
                <a
                  href={asset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button size="sm" variant="ghost" className="w-full border border-cream/20">
                    Mở
                  </Button>
                </a>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + asset.url);
                    toast.success('Đã copy URL');
                  }}
                >
                  Copy URL
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-xs text-cream/50">
        Download counters cần endpoint{' '}
        <code className="font-mono">GET /admin/affiliates/assets</code> ở worker (chưa có).
      </p>
    </>
  );
}

// ============== Broadcast ==============

function BroadcastTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Broadcast tới affiliates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="text-cream/70">
          Soạn thông báo gửi tới tất cả (hoặc active-only) affiliate qua in-app /
          email / Telegram. Trang đầy đủ có composer + lịch sử broadcast.
        </p>
        <Link href="/affiliates/broadcast">
          <Button>Mở composer</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
