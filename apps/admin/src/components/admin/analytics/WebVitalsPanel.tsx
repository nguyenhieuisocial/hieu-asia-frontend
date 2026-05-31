/**
 * Wave 61.09 — Core Web Vitals admin dashboard.
 *
 * Reads $web_vitals (LCP/CLS/INP/FCP/TTFB) from PostHog over the last 7 days
 * and renders a per-metric × device matrix with p50/p75/p95 + sample size.
 * The CWV rule of thumb is "p75 must pass" — UI colour-codes the p75 cell
 * green/amber/red against the Google CWV thresholds.
 *
 * Server component. POSTHOG_PERSONAL_API_KEY is server-side only. Page
 * never crashes on PostHog downtime (helper returns null → em-dash row).
 */

import { Gauge } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import {
  fetchWebVitals,
  isPostHogServerConfigured,
  type WebVitalMetric,
  type WebVitalSampleRow,
} from '@/lib/posthog-server';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export const metadata = {
  title: 'Web Vitals · hieu.asia admin',
  description: 'Core Web Vitals (LCP/CLS/INP) p50/p75/p95 last 7 days',
};

/**
 * CWV thresholds per Google web.dev — good / needs-improvement / poor.
 * Source: https://web.dev/articles/lcp etc.
 *   LCP: <2500ms good, <4000ms NI, >=4000ms poor
 *   INP: <200ms good, <500ms NI, >=500ms poor
 *   CLS: <0.1 good, <0.25 NI, >=0.25 poor   (value*1000 in our HogQL)
 *   FCP: <1800ms good, <3000ms NI
 *   TTFB: <800ms good, <1800ms NI
 */
const THRESHOLDS: Record<
  WebVitalMetric,
  { good: number; ni: number; unit: string }
> = {
  LCP: { good: 2500, ni: 4000, unit: 'ms' },
  INP: { good: 200, ni: 500, unit: 'ms' },
  CLS: { good: 0.1, ni: 0.25, unit: '' },
  FCP: { good: 1800, ni: 3000, unit: 'ms' },
  TTFB: { good: 800, ni: 1800, unit: 'ms' },
};

const METRIC_ORDER: WebVitalMetric[] = ['LCP', 'INP', 'CLS', 'FCP', 'TTFB'];
const DEVICE_ORDER = ['Mobile', 'Desktop', 'Tablet', 'Unknown'] as const;

function fmtValue(metric: WebVitalMetric, v: number): string {
  const t = THRESHOLDS[metric];
  if (metric === 'CLS') return v.toFixed(3);
  if (t.unit === 'ms') return `${Math.round(v)} ${t.unit}`;
  return `${v.toFixed(0)}`;
}

function cellColor(metric: WebVitalMetric, v: number): string {
  const t = THRESHOLDS[metric];
  if (v < t.good) return 'text-emerald-500';
  if (v < t.ni) return 'text-amber-500';
  return 'text-red-500';
}

function indexBy(
  rows: WebVitalSampleRow[],
): Map<string, WebVitalSampleRow> {
  const m = new Map<string, WebVitalSampleRow>();
  for (const r of rows) m.set(`${r.metric}::${r.device}`, r);
  return m;
}

export default async function WebVitalsPage() {
  const configured = isPostHogServerConfigured();
  const rows = configured ? await fetchWebVitals() : null;
  const lookup = rows ? indexBy(rows) : new Map();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <PageHeader
        icon={<Gauge className="h-5 w-5" aria-hidden />}
        title="Core Web Vitals"
        description="Đo LCP / INP / CLS / FCP / TTFB từ $web_vitals event trên PostHog (web-vitals package). P75 là ngưỡng Google rank — phải pass cho mobile để hieu.asia còn được SEO tốt."
      />

      {!configured && (
        <div className="mt-8 rounded-card-editorial border border-amber-500/40 bg-amber-500/5 p-6 text-sm text-foreground">
          <p>
            <strong>POSTHOG_PERSONAL_API_KEY</strong> chưa được cấu hình.
          </p>
        </div>
      )}

      {configured && (rows === null || rows.length === 0) && (
        <div className="mt-8 rounded-card-editorial border border-border bg-card p-6 text-sm text-muted-foreground">
          <p>
            {rows === null
              ? 'Lỗi tạm thời khi gọi PostHog HogQL. Thử lại sau.'
              : 'Chưa có đủ dữ liệu $web_vitals trong 7 ngày (cần ≥ 5 sample/metric/device).'}
          </p>
        </div>
      )}

      {configured && rows && rows.length > 0 && (
        <div className="mt-8 space-y-8">
          {METRIC_ORDER.map((metric) => {
            const t = THRESHOLDS[metric];
            const present = DEVICE_ORDER.filter((d) =>
              lookup.has(`${metric}::${d}`),
            );
            if (present.length === 0) return null;
            return (
              <section key={metric}>
                <header className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-heading text-xl text-foreground">
                    {metric}
                  </h2>
                  <p className="font-mono text-xs text-muted-foreground">
                    good &lt; {fmtValue(metric, t.good)} · NI &lt;{' '}
                    {fmtValue(metric, t.ni)} · poor ≥ {fmtValue(metric, t.ni)}
                  </p>
                </header>
                <div className="overflow-hidden rounded-card-editorial border border-border bg-card">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border bg-muted/40 text-left">
                      <tr>
                        <th className="px-4 py-3 font-medium text-muted-foreground">
                          Device
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                          p50
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                          p75 (CWV)
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                          p95
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                          Samples
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {present.map((d) => {
                        const r = lookup.get(`${metric}::${d}`);
                        if (!r) return null;
                        return (
                          <tr
                            key={d}
                            className="border-b border-border/40 last:border-0"
                          >
                            <td className="px-4 py-3 font-mono text-foreground">
                              {d}
                            </td>
                            <td className="px-4 py-3 text-right font-mono text-foreground">
                              {fmtValue(metric, r.p50)}
                            </td>
                            <td
                              className={`px-4 py-3 text-right font-mono font-semibold ${cellColor(metric, r.p75)}`}
                            >
                              {fmtValue(metric, r.p75)}
                            </td>
                            <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                              {fmtValue(metric, r.p95)}
                            </td>
                            <td className="px-4 py-3 text-right text-muted-foreground">
                              {r.samples.toLocaleString('vi-VN')}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })}
        </div>
      )}

      <p className="mt-8 text-xs text-muted-foreground">
        Source: $web_vitals events (apps/web/src/lib/web-vitals.ts) →
        PostHog HogQL. Device split = $device_type auto-capture. P75 cell
        coloured theo ngưỡng web.dev — xanh = good, vàng = needs-improvement,
        đỏ = poor.
      </p>
    </main>
  );
}
