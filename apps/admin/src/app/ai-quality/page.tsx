'use client';

/**
 * AI Quality Dashboard — roadmap §4.2.
 *
 * Surfaces the output-validator counters written by the worker at
 *   GET /admin/ai-quality/summary
 *
 * Three time windows (24h / 7d / 30d), per-endpoint breakdown:
 *   - Pass rate (first attempt vs after-retry vs final fail)
 *   - Retry rate (how often the validator triggered a second LLM call)
 *   - Generic-answer fail-reason histogram (chart_ref / user_context /
 *     concrete_action / caveat)
 *   - Coarse cost-burn estimate (worker constant × call count). Precise
 *     numbers stay on /llm-spend.
 *
 * Storage lives in the api-gateway worker's CACHE KV namespace under the
 * `ai-quality:*` prefix. No new Supabase migration was required.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
} from '@hieu-asia/ui';
import { Shield, AlertTriangle, Repeat, DollarSign } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { KpiCard } from '@/components/admin/kpi-card';
import { EmptyState } from '@/components/admin/empty-state';

type EndpointSlug = 'decisions-brief' | 'mentor-skills-decision';

interface FailReasonCounts {
  chart_ref: number;
  user_context: number;
  concrete_action: number;
  caveat: number;
}

interface EndpointWindowStats {
  total: number;
  pass_first: number;
  fail_first: number;
  pass_retry: number;
  fail_final: number;
  retry_rate: number;
  final_pass_rate: number;
  fail_reasons: FailReasonCounts;
  cost_usd_estimate: number;
}

interface WindowStats {
  window_days: number;
  by_endpoint: Record<EndpointSlug, EndpointWindowStats>;
}

interface AiQualitySummary {
  ok: true;
  generated_at: string;
  windows: {
    last_24h: WindowStats;
    last_7d: WindowStats;
    last_30d: WindowStats;
  };
}

const ENDPOINT_LABEL: Record<EndpointSlug, string> = {
  'decisions-brief': 'Decisions Brief',
  'mentor-skills-decision': 'Mentor · Decision Skill',
};

const REASON_LABEL: Record<keyof FailReasonCounts, string> = {
  chart_ref: 'Thiếu trích dẫn lá số',
  user_context: 'Thiếu bối cảnh người dùng',
  concrete_action: 'Thiếu hành động cụ thể',
  caveat: 'Thiếu caveat / lưu ý',
};

const ENDPOINTS: readonly EndpointSlug[] = [
  'decisions-brief',
  'mentor-skills-decision',
];

async function fetchSummary(): Promise<AiQualitySummary | null> {
  try {
    const r = await fetch('/api/admin-proxy/admin/ai-quality/summary', {
      cache: 'no-store',
      credentials: 'same-origin',
    });
    if (!r.ok) return null;
    const data = (await r.json()) as AiQualitySummary;
    if (!data?.ok) return null;
    return data;
  } catch {
    return null;
  }
}

function fmtPct(v: number): string {
  if (!Number.isFinite(v)) return '—';
  return `${(v * 100).toFixed(1)}%`;
}

function fmtUsd(v: number): string {
  return `$${v.toFixed(2)}`;
}

function sumByEndpoint<K extends keyof EndpointWindowStats>(
  w: WindowStats,
  key: K,
): number {
  let n = 0;
  for (const ep of ENDPOINTS) {
    const v = w.by_endpoint[ep][key];
    if (typeof v === 'number') n += v;
  }
  return n;
}

/** Weighted pass-rate across all endpoints inside a window. */
function windowPassRate(w: WindowStats): number {
  const total = sumByEndpoint(w, 'total');
  if (total === 0) return 0;
  const passed = sumByEndpoint(w, 'pass_first') + sumByEndpoint(w, 'pass_retry');
  return passed / total;
}

/** Weighted retry-rate across all endpoints inside a window. */
function windowRetryRate(w: WindowStats): number {
  const total = sumByEndpoint(w, 'total');
  if (total === 0) return 0;
  return sumByEndpoint(w, 'fail_first') / total;
}

interface BarRowProps {
  label: string;
  value: number;
  max: number;
  hint?: string;
  accent?: 'gold' | 'jade' | 'red' | 'purple';
}

const ACCENT_BAR: Record<NonNullable<BarRowProps['accent']>, string> = {
  gold: 'bg-gradient-to-r from-gold/70 to-gold/30',
  jade: 'bg-gradient-to-r from-jade/70 to-jade/30',
  purple: 'bg-gradient-to-r from-purple/70 to-purple/30',
  red: 'bg-gradient-to-r from-red-500/70 to-red-500/30',
};

function BarRow({ label, value, max, hint, accent = 'gold' }: BarRowProps) {
  const pct = max > 0 ? Math.max(0.02, value / max) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-foreground/85">{label}</span>
        <span className="font-mono text-muted-foreground">
          {value}
          {hint && <span className="ml-2 text-muted-foreground">{hint}</span>}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-card/60">
        <div
          className={cn('h-full rounded-full', ACCENT_BAR[accent])}
          style={{ width: `${(pct * 100).toFixed(1)}%` }}
        />
      </div>
    </div>
  );
}

interface PassFailBarProps {
  passFirst: number;
  passRetry: number;
  failFinal: number;
  total: number;
}

function PassFailBar({ passFirst, passRetry, failFinal, total }: PassFailBarProps) {
  if (total === 0) {
    return (
      <div className="h-3 w-full rounded-full bg-card/60" aria-label="no data" />
    );
  }
  const pf = (passFirst / total) * 100;
  const pr = (passRetry / total) * 100;
  const ff = (failFinal / total) * 100;
  return (
    <div className="flex h-3 w-full overflow-hidden rounded-full bg-card/60">
      <div
        className="h-full bg-jade/70"
        style={{ width: `${pf.toFixed(2)}%` }}
        title={`Pass on first try: ${pf.toFixed(1)}%`}
      />
      <div
        className="h-full bg-gold/70"
        style={{ width: `${pr.toFixed(2)}%` }}
        title={`Pass after retry: ${pr.toFixed(1)}%`}
      />
      <div
        className="h-full bg-red-500/70"
        style={{ width: `${ff.toFixed(2)}%` }}
        title={`Failed final: ${ff.toFixed(1)}%`}
      />
    </div>
  );
}

export default function AiQualityPage() {
  const q = useQuery({
    queryKey: ['admin', 'ai-quality', 'summary'],
    queryFn: fetchSummary,
    refetchInterval: 60_000,
  });

  const summary = q.data ?? null;
  const w24 = summary?.windows.last_24h ?? null;
  const w7 = summary?.windows.last_7d ?? null;
  const w30 = summary?.windows.last_30d ?? null;

  const hasAnyData = (summary && sumByEndpoint(summary.windows.last_30d, 'total') > 0) ?? false;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chất lượng AI"
        description={
          <>
            Đếm số lần output-validator đi qua / thất bại trên Decision Brief +
            Decision Mentor. Đọc từ KV{' '}
            <code className="font-mono text-gold">ai-quality:*</code> của worker
            api-gateway. Tỷ lệ pass thấp = prompt cần chỉnh; retry-rate cao =
            đang tốn LLM gọi 2 lần.
          </>
        }
        icon={<Shield className="h-5 w-5" />}
      />

      {q.isLoading && (
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-xl border border-gold/10 bg-muted/30"
            />
          ))}
        </div>
      )}

      {!q.isLoading && !summary && (
        <EmptyState
          title="Không lấy được summary"
          description={
            <>
              Worker <code className="font-mono">/admin/ai-quality/summary</code>{' '}
              không trả lời. Kiểm tra X-Admin-Token hoặc gateway.
            </>
          }
        />
      )}

      {summary && (
        <>
          {/* Three KPI cards — pass rate per window. */}
          <div className="grid gap-4 sm:grid-cols-3">
            <KpiCard
              label="Pass rate · 24h"
              value={fmtPct(windowPassRate(w24!))}
              icon={<Shield className="h-4 w-4" />}
              accent={windowPassRate(w24!) >= 0.9 ? 'jade' : 'red'}
              hint={`${sumByEndpoint(w24!, 'total')} calls`}
            />
            <KpiCard
              label="Pass rate · 7 ngày"
              value={fmtPct(windowPassRate(w7!))}
              icon={<Shield className="h-4 w-4" />}
              accent={windowPassRate(w7!) >= 0.9 ? 'jade' : 'gold'}
              hint={`${sumByEndpoint(w7!, 'total')} calls`}
            />
            <KpiCard
              label="Pass rate · 30 ngày"
              value={fmtPct(windowPassRate(w30!))}
              icon={<Shield className="h-4 w-4" />}
              accent="purple"
              hint={`${sumByEndpoint(w30!, 'total')} calls`}
            />
          </div>

          {/* Secondary KPI row — retry rate + cost burn (30d). */}
          <div className="grid gap-4 sm:grid-cols-2">
            <KpiCard
              label="Retry rate · 30 ngày"
              value={fmtPct(windowRetryRate(w30!))}
              icon={<Repeat className="h-4 w-4" />}
              accent={windowRetryRate(w30!) >= 0.15 ? 'red' : 'gold'}
              hint={`${sumByEndpoint(w30!, 'fail_first')} retries`}
            />
            <KpiCard
              label="Cost burn (ước tính) · 30 ngày"
              value={fmtUsd(
                ENDPOINTS.reduce(
                  (acc, ep) => acc + w30!.by_endpoint[ep].cost_usd_estimate,
                  0,
                ),
              )}
              icon={<DollarSign className="h-4 w-4" />}
              accent="gold"
              hint="số chính xác xem /llm-spend"
            />
          </div>

          {/* Pass / Retry / Fail stacked bars per endpoint (7d). */}
          <Card>
            <CardHeader>
              <CardTitle>Pass · Retry · Fail — 7 ngày</CardTitle>
              <CardDescription>
                Jade = pass lần 1, vàng = pass sau retry, đỏ = fail-final (422
                trả về client).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {ENDPOINTS.map((ep) => {
                  const s = w7!.by_endpoint[ep];
                  return (
                    <div key={ep} className="space-y-2">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="font-heading text-sm text-foreground">
                          {ENDPOINT_LABEL[ep]}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {s.total} calls · pass {fmtPct(s.final_pass_rate)} ·
                          retry {fmtPct(s.retry_rate)}
                        </span>
                      </div>
                      <PassFailBar
                        passFirst={s.pass_first}
                        passRetry={s.pass_retry}
                        failFinal={s.fail_final}
                        total={s.total}
                      />
                      <div className="grid grid-cols-3 text-[10px] font-mono text-muted-foreground">
                        <span>pass-first {s.pass_first}</span>
                        <span>pass-retry {s.pass_retry}</span>
                        <span className="text-right">fail-final {s.fail_final}</span>
                      </div>
                    </div>
                  );
                })}
                {!hasAnyData && (
                  <p className="text-sm text-muted-foreground">
                    Chưa có call nào trong 30 ngày qua. Counters bắt đầu đếm sau
                    khi worker được deploy với wiring mới.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Fail-reason breakdown (30d). */}
          <Card>
            <CardHeader>
              <CardTitle>Lý do fail — 30 ngày</CardTitle>
              <CardDescription>
                Trong số các call fail (lần 1 hoặc lần cuối), lý do nào hay xảy
                ra. Một call có thể trigger nhiều lý do cùng lúc.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                {ENDPOINTS.map((ep) => {
                  const r = w30!.by_endpoint[ep].fail_reasons;
                  const max = Math.max(
                    r.chart_ref,
                    r.user_context,
                    r.concrete_action,
                    r.caveat,
                    1,
                  );
                  return (
                    <div key={ep} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-3.5 w-3.5 text-gold/70" />
                        <span className="font-heading text-sm text-foreground">
                          {ENDPOINT_LABEL[ep]}
                        </span>
                      </div>
                      {(Object.keys(REASON_LABEL) as Array<
                        keyof FailReasonCounts
                      >).map((key) => (
                        <BarRow
                          key={key}
                          label={REASON_LABEL[key]}
                          value={r[key]}
                          max={max}
                          accent="red"
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Cost burn table per endpoint (30d). */}
          <Card>
            <CardHeader>
              <CardTitle>Cost burn theo endpoint — 30 ngày</CardTitle>
              <CardDescription>
                Ước tính = số call × giá trung bình mỗi lượt gọi (constant trong
                worker). Số chính xác lấy từ <code className="font-mono text-gold">llm_traces</code>
                {' '}— xem trang Chi phí LLM.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold/15 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    <th className="py-2">Endpoint</th>
                    <th className="py-2 text-right">Calls</th>
                    <th className="py-2 text-right">Pass</th>
                    <th className="py-2 text-right">Retry</th>
                    <th className="py-2 text-right">Burn (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {ENDPOINTS.map((ep) => {
                    const s = w30!.by_endpoint[ep];
                    return (
                      <tr
                        key={ep}
                        className="border-b border-gold/5 hover:bg-gold/5"
                      >
                        <td className="py-2 text-foreground">{ENDPOINT_LABEL[ep]}</td>
                        <td className="py-2 text-right font-mono text-foreground/85">
                          {s.total}
                        </td>
                        <td className="py-2 text-right font-mono">
                          <span
                            className={cn(
                              s.final_pass_rate >= 0.9
                                ? 'text-jade-50'
                                : s.final_pass_rate >= 0.7
                                  ? 'text-gold'
                                  : 'text-red-300',
                            )}
                          >
                            {fmtPct(s.final_pass_rate)}
                          </span>
                        </td>
                        <td className="py-2 text-right font-mono text-muted-foreground">
                          {fmtPct(s.retry_rate)}
                        </td>
                        <td className="py-2 text-right font-mono text-gold">
                          {fmtUsd(s.cost_usd_estimate)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Cập nhật: {new Date(summary.generated_at).toLocaleString('vi-VN')}
          </p>
        </>
      )}
    </div>
  );
}
