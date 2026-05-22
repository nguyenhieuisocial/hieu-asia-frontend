'use client';

/**
 * Admin /metrics — request-volume dashboard.
 *
 * Consumes worker `GET /admin/metrics` (see backend/.../admin/metrics.ts):
 *   {
 *     ok, date, generated_at,
 *     totals: { requests, errors, error_rate },
 *     top_endpoints: [{ endpoint, count }],
 *     top_user_agents: [{ bucket, count }],
 *   }
 *
 * Worker counter pipeline only tracks daily counts per endpoint slug — there
 * is no p50/p95/per-endpoint error breakdown in storage today. Columns
 * surfaced match what's actually available; latency placeholders show "—".
 *
 * Header banner reads `/health` for worker_version + uptime via the same
 * admin-proxy so this page stays auth-gated end-to-end.
 *
 * Manual "Refresh" only — no auto-polling.
 */

import * as React from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { Activity, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';

interface MetricsSummary {
  ok: true;
  date: string;
  generated_at: string;
  totals: { requests: number; errors: number; error_rate: number };
  top_endpoints: Array<{ endpoint: string; count: number }>;
  top_user_agents: Array<{ bucket: string; count: number }>;
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

export default function AdminMetricsPage() {
  const [data, setData] = React.useState<MetricsSummary | null>(null);
  const [health, setHealth] = React.useState<HealthInfo | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [metricsRes, healthRes] = await Promise.all([
        fetch('/api/admin-proxy/admin/metrics', { cache: 'no-store' }),
        fetch('/api/admin-proxy/health', { cache: 'no-store' }),
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
      <PageHeader
        title="Metrics"
        description={
          <>
            Số liệu request volume từ Cloudflare Worker (KV counter, cập nhật mỗi
            request, TTL 90 ngày). Latency p50/p95 chưa được worker ghi nhận —
            sẽ bổ sung khi pipeline có Analytics Engine.
          </>
        }
        icon={<Activity className="h-5 w-5" />}
        actions={
          <Button size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
        }
      />

      {/* Worker version / health banner */}
      <div className="flex flex-wrap items-center gap-3 rounded-md border border-gold/15 bg-ink/40 px-4 py-2.5 text-xs">
        <span className="flex items-center gap-2 text-cream/70">
          <span className="font-mono text-[10px] uppercase tracking-widest text-cream/45">
            Worker
          </span>
          <span className="font-mono text-cream">
            {health?.version ? `v${health.version}` : '—'}
          </span>
          {health?.commit && (
            <span className="font-mono text-cream/55">· {health.commit.slice(0, 7)}</span>
          )}
        </span>
        <span className="flex items-center gap-2 text-cream/70">
          <span className="font-mono text-[10px] uppercase tracking-widest text-cream/45">
            Snapshot
          </span>
          <span className="font-mono text-cream">
            {data ? fmtDateTime(data.generated_at) : '—'}
          </span>
        </span>
        {data?.date && (
          <span className="flex items-center gap-2 text-cream/70">
            <span className="font-mono text-[10px] uppercase tracking-widest text-cream/45">
              Ngày
            </span>
            <span className="font-mono text-cream">{data.date}</span>
          </span>
        )}
        <span className="ml-auto flex items-center gap-2 text-cream/70">
          <span className="font-mono text-[10px] uppercase tracking-widest text-cream/45">
            Tỷ lệ lỗi (5xx) hôm nay
          </span>
          <span
            className={`font-mono ${errorRate >= 0.05 ? 'text-red-300' : errorRate > 0 ? 'text-gold' : 'text-jade-50'}`}
          >
            {data ? `${fmtPct(errorRate)} (${fmtNum(totalErrors)}/${fmtNum(totalRequests)})` : '—'}
          </span>
        </span>
      </div>

      {error && (
        <p className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          Không tải được dữ liệu: {error}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top endpoint (theo lượt gọi hôm nay)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && !data ? (
            <div className="space-y-2 py-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-cream/5" />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <EmptyState
              title="Chưa có metric hôm nay"
              description="Worker chưa ghi nhận request nào cho ngày hiện tại. Counter reset theo UTC mỗi ngày."
              className="border-0 bg-transparent"
            />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gold/15 bg-ink/40">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold/15 text-left">
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-gold/80">
                      Endpoint
                    </th>
                    <th className="px-4 py-3 text-right font-mono text-xs uppercase tracking-wider text-gold/80">
                      Số lượt
                    </th>
                    <th className="px-4 py-3 text-right font-mono text-xs uppercase tracking-wider text-gold/80">
                      p50 (ms)
                    </th>
                    <th className="px-4 py-3 text-right font-mono text-xs uppercase tracking-wider text-gold/80">
                      p95 (ms)
                    </th>
                    <th className="px-4 py-3 text-right font-mono text-xs uppercase tracking-wider text-gold/80">
                      Lỗi
                    </th>
                    <th className="px-4 py-3 text-right font-mono text-xs uppercase tracking-wider text-gold/80">
                      Tỷ lệ lỗi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr
                      key={r.endpoint}
                      className="border-b border-gold/10 last:border-0 hover:bg-gold/[0.03]"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-cream">{r.endpoint}</td>
                      <td className="px-4 py-3 text-right font-mono text-cream/90">
                        {fmtNum(r.count)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-cream/40">—</td>
                      <td className="px-4 py-3 text-right font-mono text-cream/40">—</td>
                      <td className="px-4 py-3 text-right font-mono text-cream/40">—</td>
                      <td className="px-4 py-3 text-right font-mono text-cream/40">—</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="border-t border-gold/10 px-4 py-2 font-mono text-[10px] text-cream/45">
                Worker chỉ lưu đếm/ngày; latency &amp; lỗi-theo-endpoint sẽ hiển thị
                khi backend bổ sung Analytics Engine.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {data && data.top_user_agents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top user-agent buckets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-gold/15 bg-ink/40">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold/15 text-left">
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-gold/80">
                      Bucket
                    </th>
                    <th className="px-4 py-3 text-right font-mono text-xs uppercase tracking-wider text-gold/80">
                      Số lượt
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.top_user_agents.map((u) => (
                    <tr
                      key={u.bucket}
                      className="border-b border-gold/10 last:border-0 hover:bg-gold/[0.03]"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-cream">{u.bucket}</td>
                      <td className="px-4 py-3 text-right font-mono text-cream/90">
                        {fmtNum(u.count)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
