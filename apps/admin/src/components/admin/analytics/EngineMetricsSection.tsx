'use client';

/**
 * Engine telemetry section for /analytics — reads the worker's Analytics Engine
 * dataset (`hieu_asia_requests`) via /api/admin/engine/metrics. This is the REAL
 * per-request cost / latency / error source: every request (admin, bot, cron,
 * tool, LLM) lands there, unlike the LLM-only llm_traces ledger.
 *
 * Self-contained (own query) so the parent page stays simple. Degrades
 * gracefully: when the worker lacks a CF Analytics:Read token it returns
 * configured:false and we show a one-line "how to enable" note instead of
 * faking numbers.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { Cpu, Activity, AlertTriangle, Timer } from 'lucide-react';
import { KpiCard } from '@/components/admin/kpi-card';

interface EngineMetrics {
  ok: boolean;
  configured?: boolean;
  window_hours?: number;
  totals?: { requests: number; cost_usd: number; error_rate: number; avg_ms: number };
  by_vendor?: Array<{
    vendor: string;
    requests: number;
    cost_usd: number;
    tokens: number;
    avg_ms: number;
    errors: number;
  }>;
  top_endpoints?: Array<{ path: string; requests: number; avg_ms: number }>;
  error?: string;
}

async function fetchEngine(hours: number): Promise<EngineMetrics> {
  const res = await fetch(`/api/admin/engine/metrics?hours=${hours}`, { cache: 'no-store' });
  const text = await res.text();
  try {
    return JSON.parse(text) as EngineMetrics;
  } catch {
    return { ok: false, error: `Invalid JSON (status ${res.status})` };
  }
}

function fmt(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n);
}

export function EngineMetricsSection() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'engine', 24],
    queryFn: () => fetchEngine(24),
    staleTime: 60_000,
  });

  const notConfigured = data && data.ok === false && data.configured === false;
  const errored = data && data.ok === false && data.configured !== false;
  const t = data?.totals;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-gold/80" />
          Engine — telemetry thật theo request (24h)
        </CardTitle>
        <CardDescription>
          Mọi request (admin · bot · cron · tool · LLM) qua Analytics Engine — lưu lượng, độ
          trễ và lỗi THẬT theo từng endpoint, có dữ liệu ngay cả khi traffic thấp. (Chi phí
          LLM theo vendor chưa tag per-request ở tầng này — xem <code>/llm-spend</code> cho
          chi phí thật.)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Đang tải…</p>
        ) : notConfigured ? (
          <div className="rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-muted-foreground">
            Chưa bật. Cần 1 token Cloudflare scope <strong>Account Analytics:Read</strong> đặt làm
            secret <code>CF_ANALYTICS_TOKEN</code> trên worker. Khi có, mục này hiện chi phí/độ
            trễ/lỗi thật theo từng request + vendor + endpoint.
          </div>
        ) : errored ? (
          <div className="rounded-md border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
            {data?.error ?? 'Không tải được engine metrics.'}
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <KpiCard
                label="Tổng request"
                value={fmt(t?.requests ?? 0)}
                icon={<Activity className="h-4 w-4" />}
                accent="purple"
              />
              <KpiCard
                label="Tỉ lệ lỗi"
                value={`${((t?.error_rate ?? 0) * 100).toFixed(2)}%`}
                icon={<AlertTriangle className="h-4 w-4" />}
                accent={t && t.error_rate > 0.02 ? 'gold' : 'jade'}
                hint="5xx / tổng request"
              />
              <KpiCard
                label="Độ trễ TB"
                value={`${fmt(t?.avg_ms ?? 0)} ms`}
                icon={<Timer className="h-4 w-4" />}
                accent="jade"
              />
            </div>

            {data?.by_vendor && data.by_vendor.length > 0 && (
              <div className="overflow-x-auto rounded-md border border-gold/15">
                <table className="w-full text-sm">
                  <thead className="border-b border-gold/15 text-left text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 font-medium">Vendor</th>
                      <th className="px-3 py-2 text-right font-medium">Requests</th>
                      <th className="px-3 py-2 text-right font-medium">Chi phí</th>
                      <th className="px-3 py-2 text-right font-medium">Độ trễ TB</th>
                      <th className="px-3 py-2 text-right font-medium">Lỗi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.by_vendor.map((v) => (
                      <tr key={v.vendor} className="border-b border-gold/10 last:border-0">
                        <td className="px-3 py-2 font-mono text-foreground">{v.vendor}</td>
                        <td className="px-3 py-2 text-right">{fmt(v.requests)}</td>
                        <td className="px-3 py-2 text-right font-mono">
                          {v.cost_usd > 0 ? `$${v.cost_usd.toFixed(4)}` : '—'}
                        </td>
                        <td className="px-3 py-2 text-right">{fmt(v.avg_ms)} ms</td>
                        <td className="px-3 py-2 text-right">
                          {v.errors > 0 ? (
                            <span className="text-amber-300">{fmt(v.errors)}</span>
                          ) : (
                            '0'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {data?.top_endpoints && data.top_endpoints.length > 0 && (
              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Top endpoints
                </p>
                <div className="space-y-1">
                  {data.top_endpoints.map((e, i) => (
                    <div
                      key={`${e.path}-${i}`}
                      className="flex items-center justify-between gap-3 border-b border-gold/10 py-1.5 text-sm last:border-0"
                    >
                      <code className="truncate text-foreground">{e.path}</code>
                      <span className="shrink-0 text-muted-foreground">
                        {fmt(e.requests)} · {fmt(e.avg_ms)} ms
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
