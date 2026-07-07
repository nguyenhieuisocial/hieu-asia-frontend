'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@hieu-asia/ui';
import {
  getApiBudgets,
  getLlmSpendDaily,
  getLlmSpendKpis,
  getRecentTraces,
  getTopUsers,
  isLlmSpendConfigured,
  isoNDaysAgo,
  isoStartOfMonth,
  isoStartOfToday,
} from '@/lib/llm-spend-api';
import { forecastMonthEndCost } from '@/lib/llm-spend-forecast';
import { getBrowserSupabase } from '@/lib/supabase-browser';
import { KpiRow } from '@/components/llm-spend/KpiRow';
import { DailyCostChart } from '@/components/llm-spend/DailyCostChart';
import { VendorBarChart } from '@/components/llm-spend/VendorBarChart';

// Recharts lazy-loaded so it stays out of the initial bundle (GscTrendChart
// pattern). ssr:false — admin is auth-gated, not SEO-indexed.
const TokenTrendChart = dynamic(
  () => import('@/components/llm-spend/TokenTrendChart').then((m) => m.TokenTrendChart),
  {
    ssr: false,
    loading: () => <div className="h-72 animate-pulse rounded bg-muted/30" aria-hidden />,
  },
);
import { RecentTracesTable } from '@/components/llm-spend/RecentTracesTable';
import { BudgetsManager } from '@/components/llm-spend/BudgetsManager';
import { CostPanel } from '@/components/llm-spend/CostPanel';
import { ReportCostsPanel } from '@/components/llm-spend/ReportCostsPanel';
import { PageHeader } from '@/components/admin/page-header';
import { RoleContextBanner } from '@/components/admin/role-context-banner';
import { LiveBadge } from '@/components/admin/live-badge';
import { EmptyState } from '@/components/admin/empty-state';
import { DollarSign } from 'lucide-react';
import { fmtDateTime } from '@/lib/format';

export default function LlmSpendPage() {
  const qc = useQueryClient();
  const [vendorFilter, setVendorFilter] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState('');
  // Null on the server so SSR markup is deterministic; the real timestamp is
  // filled in after mount (effect below). Rendering `new Date()` during SSR vs
  // hydration produced a React #418 text-mismatch (toLocaleString includes
  // seconds → server and client strings differ).
  const [lastRefresh, setLastRefresh] = React.useState<Date | null>(null);

  const configured = isLlmSpendConfigured();

  const daily = useQuery({
    queryKey: ['llm-spend', 'daily', 30],
    queryFn: () => getLlmSpendDaily(30),
    enabled: configured,
    staleTime: 60_000,
  });
  const kpiToday = useQuery({
    queryKey: ['llm-spend', 'kpi', 'today'],
    queryFn: () => getLlmSpendKpis({ since: isoStartOfToday() }),
    enabled: configured,
    staleTime: 60_000,
  });
  const kpi7 = useQuery({
    queryKey: ['llm-spend', 'kpi', '7d'],
    queryFn: () => getLlmSpendKpis({ since: isoNDaysAgo(7) }),
    enabled: configured,
    staleTime: 60_000,
  });
  const kpi30 = useQuery({
    queryKey: ['llm-spend', 'kpi', '30d'],
    queryFn: () => getLlmSpendKpis({ since: isoNDaysAgo(30) }),
    enabled: configured,
    staleTime: 60_000,
  });
  const kpiMtd = useQuery({
    queryKey: ['llm-spend', 'kpi', 'mtd'],
    queryFn: () => getLlmSpendKpis({ since: isoStartOfMonth() }),
    enabled: configured,
    staleTime: 60_000,
  });
  const traces = useQuery({
    queryKey: ['llm-spend', 'traces', vendorFilter, roleFilter],
    queryFn: () =>
      getRecentTraces({
        limit: 50,
        vendor: vendorFilter || undefined,
        role: roleFilter || undefined,
      }),
    enabled: configured,
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  });
  const topUsers = useQuery({
    queryKey: ['llm-spend', 'top-users'],
    queryFn: () => getTopUsers(30, 20),
    enabled: configured,
    staleTime: 60_000,
  });
  const budgets = useQuery({
    queryKey: ['llm-spend', 'budgets'],
    queryFn: () => getApiBudgets(),
    enabled: configured,
    staleTime: 60_000,
  });

  const refreshAll = React.useCallback(() => {
    qc.invalidateQueries({ queryKey: ['llm-spend'] });
    setLastRefresh(new Date());
  }, [qc]);

  // Seed the "last refresh" clock after mount (see state declaration above).
  React.useEffect(() => {
    setLastRefresh(new Date());
  }, []);

  // Tầng 2 — deep-link: seed the traces role filter from ?role= khi mở trang,
  // để /llm-spend?role=<role> (từ Vai trò 360) LỌC luôn bảng chi tiết chứ không
  // chỉ hiện banner. Đọc qua window (client-only) nên không phải bọc cả trang
  // trong Suspense. Chạy 1 lần lúc mount; sau đó dropdown của bảng vẫn đổi được.
  React.useEffect(() => {
    const r = new URLSearchParams(window.location.search).get('role');
    if (r) setRoleFilter(r);
  }, []);

  // Realtime: refetch KPIs / traces on new INSERT into llm_traces.
  React.useEffect(() => {
    if (!configured) return;
    const supa = getBrowserSupabase();
    if (!supa) return;
    const channel = supa
      .channel('llm_traces_inserts')
      .on(
        'postgres_changes' as never,
        { event: 'INSERT', schema: 'hieu_asia', table: 'llm_traces' },
        () => {
          qc.invalidateQueries({ queryKey: ['llm-spend', 'kpi'] });
          qc.invalidateQueries({ queryKey: ['llm-spend', 'traces'] });
        },
      )
      .subscribe();
    return () => {
      supa.removeChannel(channel);
    };
  }, [configured, qc]);

  // Find monthly budget for global (user_id IS NULL, period=monthly) — if any.
  const monthlyBudget = React.useMemo(() => {
    const rows = budgets.data ?? [];
    const global = rows.find((b) => !b.user_id && !b.team_id && b.period === 'monthly');
    return global?.limit_usd ?? null;
  }, [budgets.data]);

  // Month-end cost forecast from the already-fetched daily series (no extra
  // fetch). Null while loading/empty so the KPI card shows "—".
  const forecast = React.useMemo(() => {
    const rows = daily.data;
    if (!rows || rows.length === 0) return null;
    return forecastMonthEndCost(
      rows.map((r) => ({ day: r.day, cost_usd: r.cost_usd })),
    );
  }, [daily.data]);

  const anyFetching =
    daily.isFetching ||
    kpiToday.isFetching ||
    kpi7.isFetching ||
    kpi30.isFetching ||
    kpiMtd.isFetching ||
    traces.isFetching ||
    topUsers.isFetching ||
    budgets.isFetching;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chi phí LLM theo thời gian thực"
        description={
          <>
            Mọi cuộc gọi LLM đều được ledger ngay khi xảy ra. Đọc trực tiếp từ{' '}
            <code className="font-mono text-gold">hieu_asia.llm_traces</code>.
            <br />
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Cập nhật lần cuối: {lastRefresh ? fmtDateTime(lastRefresh) : '—'}
            </span>
          </>
        }
        icon={<DollarSign className="h-5 w-5" />}
        badge={<LiveBadge />}
        actions={
          <Button variant="outline" size="sm" onClick={refreshAll} disabled={anyFetching}>
            {anyFetching ? 'Đang tải…' : 'Làm mới ngay'}
          </Button>
        }
      />

      <React.Suspense fallback={null}>
        <RoleContextBanner />
      </React.Suspense>

      {!configured && (
        // Wave 60.83 — replace raw amber-* with Wave 60.81.B WarnToken semantic
        // (warn-500/40 + warn-300 text). Matches the same warn banner pattern
        // used in /admin home + /feature-flags + /migrations.
        <div className="rounded-md border border-warn-500/40 bg-warn-500/10 px-3 py-2 text-sm text-warn-300 transition-all duration-300 ease-editorial">
          Thiếu <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> hoặc{' '}
          <code className="font-mono">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>.
          Dashboard hiện hiển thị 0 — set env trên Vercel để bật.
        </div>
      )}

      <KpiRow
        today={kpiToday.data?.cost_usd ?? 0}
        last7={kpi7.data?.cost_usd ?? 0}
        last30={kpi30.data?.cost_usd ?? 0}
        mtd={kpiMtd.data?.cost_usd ?? 0}
        monthlyBudget={monthlyBudget}
        forecast={forecast}
      />

      <Card>
        <CardHeader>
          <CardTitle>Chi phí theo ngày — 30 ngày</CardTitle>
          <CardDescription>Stacked area, mỗi vendor một màu (vàng = anthropic, tím = workers-ai, …).</CardDescription>
        </CardHeader>
        <CardContent>
          {daily.isLoading ? (
            <div className="h-80 animate-pulse rounded bg-muted/30" />
          ) : (
            <DailyCostChart data={daily.data ?? []} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lưu lượng token (input/output theo ngày)</CardTitle>
          <CardDescription>
            Tổng token vào/ra mỗi ngày, cộng dồn qua mọi vendor — 30 ngày.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {daily.isLoading ? (
            <div className="h-72 animate-pulse rounded bg-muted/30" />
          ) : (
            <TokenTrendChart data={daily.data ?? []} />
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="vendor">
        <TabsList>
          <TabsTrigger value="vendor">Vendor breakdown</TabsTrigger>
          <TabsTrigger value="cost">Chi phí theo ngày</TabsTrigger>
          <TabsTrigger value="users">Top users</TabsTrigger>
          <TabsTrigger value="report-costs">Chi phí / báo cáo</TabsTrigger>
          <TabsTrigger value="traces">Recent traces</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
        </TabsList>

        <TabsContent value="vendor">
          <Card>
            <CardHeader>
              <CardTitle>Chi phí theo vendor — 30 ngày</CardTitle>
              <CardDescription>Tổng USD cộng dồn từ MV <code className="font-mono">llm_trace_daily</code>.</CardDescription>
            </CardHeader>
            <CardContent>
              {daily.isLoading ? (
                <div className="h-64 animate-pulse rounded bg-muted/30" />
              ) : (
                <VendorBarChart data={daily.data ?? []} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Top 20 user — 30 ngày</CardTitle>
              <CardDescription>Sắp xếp theo tổng chi phí. user_id = (anonymous) cho calls không có user.</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-1.5">
                {(topUsers.data ?? []).map((u, i) => (
                  <li
                    key={u.user_id}
                    // Wave 60.83 — ease-editorial hover per Wave 60.81.B Tier 3 pattern.
                    className="flex items-center justify-between rounded-md border border-gold/10 bg-card/60 px-3 py-2 text-sm transition-all duration-300 ease-editorial hover:border-gold/30"
                  >
                    <span className="flex items-center gap-3">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 font-mono text-xs text-gold">
                        {i + 1}
                      </span>
                      <span className="font-mono text-xs text-foreground">{u.user_id}</span>
                    </span>
                    <span className="flex items-center gap-4 font-mono text-xs">
                      <span className="text-muted-foreground">{u.call_count} calls</span>
                      <span className="text-muted-foreground">{u.avg_latency_ms.toFixed(0)}ms avg</span>
                      <span className="text-gold">${u.cost_usd.toFixed(4)}</span>
                    </span>
                  </li>
                ))}
                {topUsers.isLoading && <li className="text-muted-foreground">Đang tải…</li>}
                {!topUsers.isLoading && (topUsers.data ?? []).length === 0 && (
                  <li>
                    <EmptyState compact title="Chưa có dữ liệu user." />
                  </li>
                )}
              </ol>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="report-costs">
          <ReportCostsPanel />
        </TabsContent>

        <TabsContent value="traces">
          <Card>
            <CardHeader>
              <CardTitle>50 trace gần nhất</CardTitle>
              <CardDescription>Realtime — tự động refetch khi có INSERT vào <code className="font-mono">llm_traces</code>.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentTracesTable
                rows={traces.data ?? []}
                isLoading={traces.isLoading}
                vendorFilter={vendorFilter}
                onVendorFilterChange={setVendorFilter}
                roleFilter={roleFilter}
                onRoleFilterChange={setRoleFilter}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budgets">
          <Card>
            <CardHeader>
              <CardTitle>Budgets</CardTitle>
              <CardDescription>Per-user / global limits. RPC <code className="font-mono">check_and_charge_budget</code> sẽ chặn calls khi vượt.</CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetsManager rows={budgets.data ?? []} isLoading={budgets.isLoading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cost">
          <CostPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
