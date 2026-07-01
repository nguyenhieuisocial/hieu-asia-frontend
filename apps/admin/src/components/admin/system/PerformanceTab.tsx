'use client';

/**
 * Admin /metrics — request-volume dashboard.
 *
 * Consumes worker `GET /admin/metrics` (see backend/.../admin/metrics.ts):
 *   {
 *     ok, date, generated_at,
 *     totals: { requests, errors, error_rate },
 *     top_endpoints: [{ endpoint, count, p50_ms, p95_ms, errors, error_rate }],
 *     top_user_agents: [{ bucket, count }],
 *     isolate_flushes_today,
 *   }
 *
 * Wave 24: latency p50/p95 + per-endpoint error rate are now backed by the
 * worker (Wave 20/21 ring-buffer + per-slug 5xx counter). Percentiles render
 * "—" only when sample count < 10 (worker returns null).
 *
 * Header banner reads `/health` for worker_version + uptime via the same
 * admin-proxy so this page stays auth-gated end-to-end.
 *
 * Manual "Refresh" only — no auto-polling.
 */

import * as React from 'react';
import dynamic from 'next/dynamic';
import { Button, Card, CardContent, CardHeader, CardTitle, cn } from '@hieu-asia/ui';
import { RefreshCw } from 'lucide-react';
import { EmptyState } from '@/components/admin/empty-state';
import { ErrorBlock } from '@/components/admin/error-block';
import { AdminTable, type AdminTableColumn } from '@/components/admin/table/AdminTable';
import { adminFetch } from '@/lib/admin-fetch';
import type { MetricsTrendPoint } from './MetricsTrendChart';

// Recharts (~150KB) lazy-loaded so it stays out of the initial bundle (same
// pattern as GscTrendChart on /seo). ssr:false — admin is auth-gated, not
// SEO-indexed.
const MetricsTrendChart = dynamic(
  () => import('./MetricsTrendChart').then((m) => m.MetricsTrendChart),
  {
    ssr: false,
    loading: () => <div className="h-72 animate-pulse rounded bg-muted/30" aria-hidden />,
  },
);

interface MetricsTrendResponse {
  ok: boolean;
  days?: number;
  generated_at?: string;
  series?: MetricsTrendPoint[];
}

type TrendDays = 7 | 30;

interface MetricsSummary {
  ok: true;
  date: string;
  generated_at: string;
  totals: { requests: number; errors: number; error_rate: number };
  top_endpoints: Array<{
    endpoint: string;
    count: number;
    p50_ms: number | null;
    p95_ms: number | null;
    errors: number;
    error_rate: number;
  }>;
  top_user_agents: Array<{ bucket: string; count: number }>;
  isolate_flushes_today?: number;
}

interface HealthInfo {
  version?: string;
  commit?: string;
  uptime?: number;
}

function fmtDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'medium' });
  } catch {
    return iso;
  }
}

function fmtPct(n: number) {
  return `${(n * 100).toFixed(2)}%`;
}

function fmtNum(n: number) {
  return n.toLocaleString('vi-VN');
}

// Color thresholds: green < 500ms, gold 500-1500ms, red > 1500ms.
function latencyClass(ms: number | null): string {
  if (ms === null) return 'text-muted-foreground';
  if (ms < 500) return 'text-jade-700 dark:text-jade-50';
  if (ms <= 1500) return 'text-gold';
  return 'text-red-700 dark:text-red-300';
}

// Color thresholds: green = 0, gold 0 < x < 2%, red >= 2%.
function errorRateClass(rate: number): string {
  if (rate <= 0) return 'text-jade-700 dark:text-jade-50';
  if (rate < 0.02) return 'text-gold';
  return 'text-red-700 dark:text-red-300';
}

type EndpointRow = MetricsSummary['top_endpoints'][number];
type UserAgentRow = MetricsSummary['top_user_agents'][number];

const ENDPOINT_COLUMNS: AdminTableColumn<EndpointRow>[] = [
  {
    id: 'endpoint',
    header: 'Endpoint',
    className: 'font-mono text-xs text-foreground',
    cell: (r) => r.endpoint,
  },
  {
    id: 'count',
    header: 'Số lượt',
    className: 'text-right font-mono text-foreground/90',
    cell: (r) => fmtNum(r.count),
  },
  {
    id: 'p50',
    header: 'p50 (ms)',
    className: 'text-right',
    cell: (r) => (
      <span className={`font-mono ${latencyClass(r.p50_ms)}`}>
        {r.p50_ms === null ? '—' : fmtNum(Math.round(r.p50_ms))}
      </span>
    ),
  },
  {
    id: 'p95',
    header: 'p95 (ms)',
    className: 'text-right',
    cell: (r) => (
      <span className={`font-mono ${latencyClass(r.p95_ms)}`}>
        {r.p95_ms === null ? '—' : fmtNum(Math.round(r.p95_ms))}
      </span>
    ),
  },
  {
    id: 'errors',
    header: 'Lỗi',
    className: 'text-right font-mono text-foreground/90',
    cell: (r) => fmtNum(r.errors),
  },
  {
    id: 'error_rate',
    header: 'Tỷ lệ lỗi',
    className: 'text-right',
    cell: (r) => (
      <span className={`font-mono ${errorRateClass(r.error_rate)}`}>{fmtPct(r.error_rate)}</span>
    ),
  },
];

const USER_AGENT_COLUMNS: AdminTableColumn<UserAgentRow>[] = [
  {
    id: 'bucket',
    header: 'Bucket',
    className: 'font-mono text-xs text-foreground',
    cell: (u) => u.bucket,
  },
  {
    id: 'count',
    header: 'Số lượt',
    className: 'text-right font-mono text-foreground/90',
    cell: (u) => fmtNum(u.count),
  },
];

export function PerformanceTab() {
  const [data, setData] = React.useState<MetricsSummary | null>(null);
  const [health, setHealth] = React.useState<HealthInfo | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Request/error trend — its own window (7/30d) + fetch lifecycle, decoupled
  // from the today-only summary above so the toggle re-fetches independently.
  const [trendDays, setTrendDays] = React.useState<TrendDays>(30);
  const [trend, setTrend] = React.useState<MetricsTrendPoint[] | null>(null);
  const [trendError, setTrendError] = React.useState(false);

  const loadTrend = React.useCallback(async (days: TrendDays) => {
    setTrendError(false);
    try {
      const res = await adminFetch(`/api/admin-proxy/admin/metrics/trend?days=${days}`, {
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) throw new Error(`Trend HTTP ${res.status}`);
      const json = (await res.json()) as MetricsTrendResponse;
      if (json.ok === false || !Array.isArray(json.series)) {
        throw new Error('Phản hồi xu hướng không hợp lệ');
      }
      setTrend(json.series);
    } catch {
      // Graceful degrade — render an inline muted message, never crash the tab.
      setTrend([]);
      setTrendError(true);
    }
  }, []);

  React.useEffect(() => {
    loadTrend(trendDays);
  }, [loadTrend, trendDays]);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [metricsRes, healthRes] = await Promise.all([
        adminFetch('/api/admin-proxy/admin/metrics'),
        adminFetch('/api/admin-proxy/health'),
      ]);
      if (!metricsRes.ok) {
        throw new Error(`Metrics HTTP ${metricsRes.status}`);
      }
      const metricsJson = (await metricsRes.json()) as MetricsSummary & { error?: string };
      if (!metricsJson.ok) {
        throw new Error(metricsJson.error ?? 'Phản hồi không hợp lệ từ worker');
      }
      setData(metricsJson);
      if (healthRes.ok) {
        setHealth((await healthRes.json()) as HealthInfo);
      } else {
        setHealth(null);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  // Derive per-endpoint rows from `top_endpoints`. Latency + per-endpoint error
  // columns render "—" because the worker's counter pipeline doesn't track
  // them yet (see metrics.ts: `recordMetric` only bumps daily counters).
  const rows = data?.top_endpoints ?? [];
  const totalRequests = data?.totals.requests ?? 0;
  const totalErrors = data?.totals.errors ?? 0;
  const errorRate = data?.totals.error_rate ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Số liệu request volume từ Cloudflare Worker (KV counter, cập nhật mỗi request,
          TTL 90 ngày). Latency p50/p95 lấy từ ring buffer 500 mẫu/endpoint; cần ≥ 10 mẫu
          để hiển thị.
        </p>
        <Button size="sm" onClick={load} disabled={loading} className="shrink-0">
          <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>
      </div>

      {/* Worker version / health banner */}
      <div className="flex flex-wrap items-center gap-3 rounded-md border border-gold/15 bg-card/60 px-4 py-2.5 text-xs">
        <span className="flex items-center gap-2 text-muted-foreground">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Worker
          </span>
          <span className="font-mono text-foreground">
            {health?.version ? `v${health.version}` : '—'}
          </span>
          {health?.commit && (
            <span className="font-mono text-muted-foreground">· {health.commit.slice(0, 7)}</span>
          )}
        </span>
        <span className="flex items-center gap-2 text-muted-foreground">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Snapshot
          </span>
          <span className="font-mono text-foreground">
            {data ? fmtDateTime(data.generated_at) : '—'}
          </span>
        </span>
        {data?.date && (
          <span className="flex items-center gap-2 text-muted-foreground">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Ngày
            </span>
            <span className="font-mono text-foreground">{data.date}</span>
          </span>
        )}
        <span className="ml-auto flex items-center gap-2 text-muted-foreground">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Tỷ lệ lỗi (5xx) hôm nay
          </span>
          <span
            className={`font-mono ${errorRate >= 0.05 ? 'text-red-700 dark:text-red-300' : errorRate > 0 ? 'text-gold' : 'text-jade-700 dark:text-jade-50'}`}
          >
            {data ? `${fmtPct(errorRate)} (${fmtNum(totalErrors)}/${fmtNum(totalRequests)})` : '—'}
          </span>
        </span>
      </div>

      {error && (
        <ErrorBlock
          compact
          message={`Không tải được dữ liệu: ${error}`}
          onRetry={load}
        />
      )}

      {/* Request/error trend — reads the worker's 90-day KV counters. */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Xu hướng lưu lượng &amp; lỗi</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                Số request &amp; lỗi 5xx theo ngày — đọc từ KV counter 90 ngày.
              </p>
            </div>
            <div className="inline-flex rounded-md border border-gold/20 bg-card/60 p-0.5">
              {([7, 30] as TrendDays[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setTrendDays(d)}
                  className={cn(
                    'rounded px-3 py-1 text-xs transition-colors',
                    trendDays === d ? 'bg-gold/20 text-gold' : 'text-muted-foreground hover:bg-gold/5',
                  )}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {trend === null ? (
            <div className="h-72 animate-pulse rounded bg-muted/30" aria-hidden />
          ) : trendError || trend.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Chưa có dữ liệu xu hướng
            </p>
          ) : (
            <MetricsTrendChart data={trend} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top endpoint (theo lượt gọi hôm nay)</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminTable
            rows={rows}
            columns={ENDPOINT_COLUMNS}
            getRowId={(r) => r.endpoint}
            loading={loading && !data}
            empty={
              <EmptyState
                title="Chưa có metric hôm nay"
                description="Worker chưa ghi nhận request nào cho ngày hiện tại. Counter reset theo UTC mỗi ngày."
                className="border-0 bg-transparent"
              />
            }
            caption="Top endpoint theo lượt gọi hôm nay"
          />
          {typeof data?.isolate_flushes_today === 'number' && (
            <p className="mt-2 px-1 font-mono text-[10px] text-muted-foreground">
              {fmtNum(data.isolate_flushes_today)} isolate flushes today
            </p>
          )}
        </CardContent>
      </Card>

      {data && data.top_user_agents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top user-agent buckets</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminTable
              rows={data.top_user_agents}
              columns={USER_AGENT_COLUMNS}
              getRowId={(u) => u.bucket}
              caption="Top user-agent buckets"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
