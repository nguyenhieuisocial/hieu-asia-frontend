'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import {
  BarChart3,
  TrendingUp,
  Users,
  Activity,
  DollarSign,
  Compass,
  Undo2,
  ShoppingCart,
} from 'lucide-react';
import { RevenueChart, type RevenueDay } from '@/components/analytics/RevenueChart';
import { RefundChart, type RefundDay } from '@/components/analytics/RefundChart';
import { AbandonedChart, type AbandonedDay } from '@/components/analytics/AbandonedChart';
import { VendorCostChart, type VendorCost } from '@/components/analytics/VendorCostChart';
import { FunnelChart, type FunnelStage } from '@/components/analytics/FunnelChart';
import { PageHeader } from '@/components/admin/page-header';
import { KpiCard } from '@/components/admin/kpi-card';
import { LiveBadge } from '@/components/admin/live-badge';
import { ErrorBlock } from '@/components/admin/error-block';
import { EmptyState } from '@/components/admin/empty-state';
import { EngineMetricsSection } from '@/components/admin/analytics/EngineMetricsSection';
import { listTransactions } from '@/lib/admin-api';
import type { AdminTransaction } from '@/lib/mock-data';

interface AnalyticsResponse {
  ok: boolean;
  days?: number;
  revenue?: { daily: RevenueDay[]; total: number; txn_count: number };
  vendor_cost?: Record<string, { tokens: number; requests: number; cost_usd: number }>;
  vendor_cost_meta?: { configured: boolean; total_cost_usd: number; total_requests: number; note?: string };
  funnel?: Record<string, number>;
  funnel_v2?: {
    stages: Array<{ name: string; count: number; conversion_rate: number }>;
    drop_off_points: string[];
    total_events: number;
    window_days: number;
  };
  sessions?: { total: number; completed: number; conversion_rate: number; error_rate: number };
  // Money-monitoring trends — both OPTIONAL (absent until the backend ships).
  refunds?: { daily: RefundDay[]; total: number; count: number; ratePct: number };
  abandoned?: {
    daily: AbandonedDay[];
    createdTotal: number;
    paidTotal: number;
    abandonedTotal: number;
    abandonRatePct: number;
    leakageVnd: number;
  };
  sources?: { langfuse: boolean; kv_transactions: boolean; kv_events?: boolean };
  error?: string;
}

type Range = '7' | '30' | '90';

async function fetchAnalytics(days: string): Promise<AnalyticsResponse> {
  const res = await fetch(`/api/admin/analytics?days=${days}`, { cache: 'no-store' });
  const text = await res.text();
  try {
    return JSON.parse(text) as AnalyticsResponse;
  } catch {
    return { ok: false, error: `Invalid JSON (status ${res.status})` };
  }
}

const FUNNEL_LABELS: Record<string, string> = {
  reading_started: 'Bắt đầu phiên đọc',
  consent_given: 'Đồng ý điều khoản',
  palm_uploaded: 'Upload palm',
  survey_completed: 'Hoàn thành survey',
  report_ready: 'Báo cáo sẵn sàng',
  mentor_started: 'Bắt đầu mentor',
  paid: 'Thanh toán',
};

const FUNNEL_ORDER = ['reading_started', 'consent_given', 'palm_uploaded', 'survey_completed', 'report_ready', 'mentor_started', 'paid'];

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + ' đ';
}

// Revenue-by-tier — pure client-side aggregation over the transactions list
// (listTransactions already maps metadata.tier → plan). No new endpoint.
const TIER_LABEL: Record<AdminTransaction['plan'], string> = {
  mentor_month: 'Mentor tháng',
  mentor_year: 'Mentor năm',
  lifetime: 'Trọn đời',
};
const TIER_ORDER: AdminTransaction['plan'][] = ['mentor_month', 'mentor_year', 'lifetime'];

interface TierRow {
  plan: AdminTransaction['plan'];
  count: number;
  total: number;
}

/** Aggregate SUCCEEDED transactions by plan → count + total VND per tier. */
function aggregateByTier(txns: AdminTransaction[]): { rows: TierRow[]; total: number } {
  const acc = new Map<AdminTransaction['plan'], TierRow>();
  let total = 0;
  for (const t of txns) {
    if (t.status !== 'succeeded') continue;
    const amount = t.amount_usd ?? 0; // amount_usd holds VND (SePay), despite the name
    total += amount;
    const cur = acc.get(t.plan) ?? { plan: t.plan, count: 0, total: 0 };
    cur.count += 1;
    cur.total += amount;
    acc.set(t.plan, cur);
  }
  const rows = TIER_ORDER.filter((p) => acc.has(p)).map((p) => acc.get(p)!);
  return { rows, total };
}

/**
 * Period-over-period delta tag for a KpiCard. Returns null when there is no
 * prior-period baseline (previous <= 0) so we never render a meaningless
 * "+∞" on a zero base — the card simply shows no arrow.
 */
function makeDelta(
  current: number,
  previous: number,
): { value: string; direction: 'up' | 'down' | 'flat' } | null {
  if (!Number.isFinite(previous) || previous <= 0) return null;
  const pct = ((current - previous) / previous) * 100;
  if (Math.abs(pct) < 1) return { value: '0%', direction: 'flat' };
  return {
    value: `${pct > 0 ? '+' : ''}${pct.toFixed(0)}%`,
    direction: pct > 0 ? 'up' : 'down',
  };
}

export default function AnalyticsPage() {
  const [days, setDays] = React.useState<Range>('30');
  const { data, isLoading, refetch, isFetching, error } = useQuery({
    queryKey: ['admin', 'analytics', days],
    queryFn: () => fetchAnalytics(days),
    staleTime: 60_000,          // keep cached 60s — no loading flash on revisit
    placeholderData: (prev) => prev, // show old data while refetching days switch
  });
  // Period-over-period baseline: fetch a double-length window, then subtract the
  // current window to isolate the *previous* period's totals (revenue/sessions
  // are additive, so prev = total(2N) − total(N)). Uses the existing endpoint
  // as-is — no backend change, lights up the moment this ships.
  const { data: dataDouble } = useQuery({
    queryKey: ['admin', 'analytics-2x', days],
    queryFn: () => fetchAnalytics(String(Number(days) * 2)),
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  });

  // Revenue-by-tier: reuse the existing transactions list (succeeded SePay
  // payments) and aggregate by plan client-side. Independent of the analytics
  // window — it's a lifetime breakdown of paid revenue per tier.
  const txnQuery = useQuery({
    queryKey: ['admin', 'transactions', 'by-tier'],
    queryFn: () => listTransactions({ page_size: 500 }),
    staleTime: 60_000,
  });
  const tierBreakdown = React.useMemo(
    () => aggregateByTier(txnQuery.data?.rows ?? []),
    [txnQuery.data?.rows],
  );

  const showError = !!error || data?.ok === false;
  const errorMsg = (error as Error | undefined)?.message ?? data?.error;

  const revenue = data?.revenue ?? { daily: [], total: 0, txn_count: 0 };
  const vendorCost: VendorCost[] = Object.entries(data?.vendor_cost ?? {}).map(([vendor, v]) => ({
    vendor,
    cost_usd: v.cost_usd,
    tokens: v.tokens,
    requests: v.requests,
  }));
  const funnel: FunnelStage[] = FUNNEL_ORDER.flatMap(k => {
    const count = data?.funnel?.[k];
    if (count === undefined) return [];
    return [{ key: k, label: FUNNEL_LABELS[k] ?? k, count }];
  });
  const sessions = data?.sessions ?? { total: 0, completed: 0, conversion_rate: 0, error_rate: 0 };
  // Money-monitoring trends — render the cards/charts only when the backend
  // actually returned the fields (older worker builds omit them entirely).
  const refunds = data?.refunds;
  const abandoned = data?.abandoned;
  const totalLLMCost = vendorCost.reduce((s, v) => s + v.cost_usd, 0);
  const avgCost = sessions.total > 0 ? totalLLMCost / sessions.total : 0;
  // Vendor cost here comes from Langfuse, which is usually NOT wired (keys live
  // off the worker). The real, realtime LLM cost truth is /llm-spend (Supabase
  // llm_traces). When Langfuse is unconfigured, rendering "$0.000" reads as
  // "AI is free" — so show a pointer to /llm-spend instead of a misleading zero.
  const costUnavailable = !!data && data.vendor_cost_meta?.configured === false;

  // Previous-period figures, isolated from the double-length window above.
  // Only computed when the comparison fetch succeeded; otherwise deltas stay
  // null and the cards render exactly as before (safe on first paint / errors).
  const cmp = data?.ok && dataDouble?.ok ? dataDouble : undefined;
  const prevRevenue = cmp ? Math.max(0, (cmp.revenue?.total ?? 0) - revenue.total) : null;
  const prevSessions = cmp ? Math.max(0, (cmp.sessions?.total ?? 0) - sessions.total) : null;
  const prevPaid = cmp ? Math.max(0, (cmp.revenue?.txn_count ?? 0) - revenue.txn_count) : null;
  const prevConversion =
    prevSessions && prevSessions > 0 && prevPaid !== null ? prevPaid / prevSessions : null;
  const revenueDelta = prevRevenue !== null ? makeDelta(revenue.total, prevRevenue) : null;
  const sessionsDelta = prevSessions !== null ? makeDelta(sessions.total, prevSessions) : null;
  const conversionDelta =
    prevConversion !== null ? makeDelta(sessions.conversion_rate, prevConversion) : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description={`Doanh thu, vendor cost và onboarding funnel — ${days} ngày gần nhất. Mũi tên ↑/↓ so với ${days} ngày liền trước.`}
        icon={<BarChart3 className="h-5 w-5" />}
        badge={data && !isLoading ? <LiveBadge /> : null}
        actions={
          <>
            <div className="inline-flex rounded-md border border-gold/20 bg-card/60 p-0.5">
              {(['7', '30', '90'] as Range[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setDays(r)}
                  className={`rounded px-3 py-1 text-xs transition-colors ${
                    days === r ? 'bg-gold/20 text-gold' : 'text-muted-foreground hover:bg-gold/5'
                  }`}
                >
                  {r}d
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? 'Đang tải…' : 'Làm mới'}
            </Button>
          </>
        }
      />

      {/* Signpost: the acquisition/channel data the founder usually hunts for
          (traffic theo kênh & nguồn, doanh thu theo kênh, funnel) lives on the
          PostHog hub under tab=cohorts. This page is revenue + funnel only —
          just point there, don't duplicate. */}
      <Link
        href="/posthog?tab=cohorts"
        className="group flex items-center justify-between gap-3 rounded-md border border-gold/30 bg-gold/5 px-4 py-3 text-sm transition-colors hover:bg-gold/10"
      >
        <span className="flex items-center gap-2 text-foreground">
          <Compass className="h-4 w-4 text-gold" aria-hidden />
          <span>
            <strong className="font-medium">Xem traffic theo kênh &amp; nguồn</strong>
            <span className="ml-1.5 text-muted-foreground">
              — khách đến từ đâu (UTM, referrer), doanh thu theo kênh, funnel chuyển đổi
            </span>
          </span>
        </span>
        <span className="shrink-0 text-gold transition-transform group-hover:translate-x-0.5">→</span>
      </Link>

      {showError && (
        <ErrorBlock
          compact
          message={errorMsg ?? 'Không tải được analytics.'}
          onRetry={() => refetch()}
        />
      )}
      {sessions.error_rate > 0.02 && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-700 dark:text-red-200">
          Tỉ lệ lỗi hôm nay cao: {(sessions.error_rate * 100).toFixed(1)}% (5xx / tổng
          request). Kiểm tra trang Trạng thái hệ thống.
        </div>
      )}
      {data?.sources && !data.sources.langfuse && (
        <div className="rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-muted-foreground">
          Langfuse chưa wire — chi phí LLM thật xem ở /llm-spend. Đặt LANGFUSE_PUBLIC_KEY/SECRET_KEY để bật nguồn này.
        </div>
      )}
      {data?.funnel_v2 && data.funnel_v2.total_events === 0 && (
        <div className="rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-muted-foreground">
          Funnel data trống — chưa có events trong {days} ngày. Verify NEXT_PUBLIC_PLAUSIBLE_DOMAIN
          và user activity, hoặc đợi traffic.
        </div>
      )}
      {data?.funnel_v2 && data.funnel_v2.drop_off_points.length > 0 && (
        <div className="rounded-md border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-200">
          Drop-off &gt;30% phát hiện tại:{' '}
          {data.funnel_v2.drop_off_points
            .map(p => FUNNEL_LABELS[p] ?? p)
            .join(', ')}
          .
        </div>
      )}
      {data?.vendor_cost_meta?.note && (
        <div className="rounded-md border border-gold/20 bg-card/60 px-3 py-2 text-xs text-muted-foreground">
          {data.vendor_cost_meta.note}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label={`Doanh thu (${days}d)`}
          value={fmtCurrency(revenue.total)}
          icon={<DollarSign className="h-4 w-4" />}
          accent="gold"
          delta={revenueDelta}
          hint={`${revenue.txn_count} giao dịch`}
        />
        <KpiCard
          label={`Phiên (${days}d)`}
          value={sessions.total.toLocaleString('vi-VN')}
          icon={<Users className="h-4 w-4" />}
          accent="purple"
          delta={sessionsDelta}
          hint={`${sessions.completed} hoàn thành`}
        />
        <KpiCard
          label="Conversion"
          value={(sessions.conversion_rate * 100).toFixed(1) + '%'}
          icon={<TrendingUp className="h-4 w-4" />}
          accent="jade"
          delta={conversionDelta}
          hint="paid / started"
        />
        <KpiCard
          label="Avg LLM cost/phiên"
          value={costUnavailable ? '—' : `$${avgCost.toFixed(3)}`}
          icon={<Activity className="h-4 w-4" />}
          accent="gold"
          hint={costUnavailable ? 'Chi phí thật ở /llm-spend' : `tổng $${totalLLMCost.toFixed(2)}`}
        />
        {refunds && (
          <KpiCard
            label={`Tỉ lệ hoàn tiền (${days}d)`}
            value={refunds.ratePct.toFixed(1) + '%'}
            icon={<Undo2 className="h-4 w-4" />}
            accent="gold"
            hint={`${fmtCurrency(refunds.total)} · ${refunds.count} lệnh`}
          />
        )}
        {abandoned && (
          <KpiCard
            label={`Bỏ giỏ thanh toán (${days}d)`}
            value={abandoned.abandonRatePct.toFixed(1) + '%'}
            icon={<ShoppingCart className="h-4 w-4" />}
            accent="purple"
            hint={`${abandoned.abandonedTotal}/${abandoned.createdTotal} đơn · rò rỉ ${fmtCurrency(abandoned.leakageVnd)}`}
          />
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Doanh thu theo ngày</CardTitle>
          <CardDescription>Tổng amount của intent_paid mỗi ngày.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Đang tải…</p>
          ) : (
            <RevenueChart data={revenue.daily} />
          )}
        </CardContent>
      </Card>

      {(refunds || abandoned) && (
        <div className="grid gap-4 lg:grid-cols-2">
          {refunds && (
            <Card>
              <CardHeader>
                <CardTitle>Hoàn tiền theo ngày</CardTitle>
                <CardDescription>
                  Tổng tiền hoàn (lệnh đã hoàn tất) mỗi ngày. Tỉ lệ hoàn{' '}
                  {refunds.ratePct.toFixed(1)}% trên doanh thu {days} ngày.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">Đang tải…</p>
                ) : refunds.count === 0 ? (
                  <EmptyState
                    title="Chưa có hoàn tiền"
                    description={`Không có lệnh hoàn nào hoàn tất trong ${days} ngày — tốt.`}
                    className="border-0 bg-transparent py-8"
                  />
                ) : (
                  <RefundChart data={refunds.daily} />
                )}
              </CardContent>
            </Card>
          )}
          {abandoned && (
            <Card>
              <CardHeader>
                <CardTitle>Bỏ giỏ thanh toán</CardTitle>
                <CardDescription>
                  Số đơn bắt đầu thanh toán so với đã trả mỗi ngày. Bỏ giỏ{' '}
                  {abandoned.abandonRatePct.toFixed(1)}% · ước tính rò rỉ{' '}
                  {fmtCurrency(abandoned.leakageVnd)}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">Đang tải…</p>
                ) : abandoned.createdTotal === 0 ? (
                  <EmptyState
                    title="Chưa có đơn thanh toán"
                    description={`Không có đơn nào được tạo trong ${days} ngày.`}
                    className="border-0 bg-transparent py-8"
                  />
                ) : (
                  <AbandonedChart data={abandoned.daily} />
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Doanh thu theo gói</CardTitle>
          <CardDescription>
            Tổng giao dịch thành công theo từng gói (lifetime — toàn bộ lịch sử).
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {txnQuery.isLoading ? (
            <p className="px-6 py-8 text-center text-sm text-muted-foreground">Đang tải…</p>
          ) : tierBreakdown.rows.length === 0 ? (
            <EmptyState
              title="Chưa có doanh thu theo gói"
              description="Khi có giao dịch thành công, phân bổ theo gói sẽ hiện ở đây."
              className="border-0 bg-transparent py-8"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border/60 text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="px-6 py-2.5 font-medium">Gói</th>
                    <th className="px-6 py-2.5 text-right font-medium">Số giao dịch</th>
                    <th className="px-6 py-2.5 text-right font-medium">Doanh thu</th>
                    <th className="px-6 py-2.5 text-right font-medium">% tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {tierBreakdown.rows.map((r) => {
                    const pct =
                      tierBreakdown.total > 0
                        ? (r.total / tierBreakdown.total) * 100
                        : 0;
                    return (
                      <tr
                        key={r.plan}
                        className="border-b border-border/40 transition-colors last:border-0 hover:bg-muted/[0.04]"
                      >
                        <td className="px-6 py-2.5 text-foreground/85">{TIER_LABEL[r.plan]}</td>
                        <td className="px-6 py-2.5 text-right font-mono text-foreground/70 tabular-nums">
                          {r.count.toLocaleString('vi-VN')}
                        </td>
                        <td className="px-6 py-2.5 text-right font-mono text-foreground tabular-nums">
                          {fmtCurrency(r.total)}
                        </td>
                        <td className="px-6 py-2.5 text-right font-mono text-foreground/70 tabular-nums">
                          {pct.toFixed(0)}%
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="border-t border-border/60 font-medium">
                    <td className="px-6 py-2.5 text-foreground">Tổng</td>
                    <td className="px-6 py-2.5 text-right font-mono text-foreground tabular-nums">
                      {tierBreakdown.rows
                        .reduce((s, r) => s + r.count, 0)
                        .toLocaleString('vi-VN')}
                    </td>
                    <td className="px-6 py-2.5 text-right font-mono text-foreground tabular-nums">
                      {fmtCurrency(tierBreakdown.total)}
                    </td>
                    <td className="px-6 py-2.5 text-right font-mono text-foreground/70 tabular-nums">
                      100%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Chi phí theo vendor</CardTitle>
            <CardDescription>Phân bổ LLM cost (USD).</CardDescription>
          </CardHeader>
          <CardContent>
            {costUnavailable ? (
              <div className="flex flex-col items-start gap-2 py-6 text-sm text-muted-foreground">
                <p>
                  Nguồn Langfuse chưa cấu hình nên chi phí ở đây trống. Chi phí LLM
                  thật (realtime, theo từng request) sống ở trang riêng.
                </p>
                <Link
                  href="/llm-spend"
                  className="inline-flex items-center gap-1 rounded-md border border-gold/30 bg-gold/5 px-3 py-1.5 text-xs text-gold transition-colors hover:bg-gold/10"
                >
                  Mở Chi phí LLM →
                </Link>
              </div>
            ) : (
              <VendorCostChart data={vendorCost} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Onboarding funnel</CardTitle>
            <CardDescription>Drop-off mỗi bước từ start → paid.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Đang tải…</p>
            ) : (
              <FunnelChart stages={funnel} />
            )}
          </CardContent>
        </Card>
      </div>

      <EngineMetricsSection />
    </div>
  );
}
