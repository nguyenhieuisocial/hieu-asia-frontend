/**
 * Wave 61.10 — Sticky CTA conversion dashboard.
 *
 * Closes the loop on Wave 60.97.B-H (27-route StickyMobileCta rollout). Reads
 * per-trackId aggregates of `sticky_cta_shown` / `sticky_cta_clicked` /
 * `sticky_cta_dismissed` events from PostHog over 30 days and renders CTR +
 * dismissal rate so founder sees which routes the bar earns its keep.
 *
 * Mobile-first rationale: the bar is `md:hidden` so 100% of impressions are
 * mobile/tablet — these numbers ARE the mobile conversion impact of the
 * sticky-CTA experiment.
 */

import { MousePointerClick } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import {
  fetchStickyCtaFunnel,
  isPostHogServerConfigured,
} from '@/lib/posthog-server';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export const metadata = {
  title: 'Sticky CTA · hieu.asia admin',
  description: 'Per-trackId mobile sticky CTA CTR + dismissal — 30d window',
};

function pct(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}

function ctrColor(rate: number): string {
  if (rate >= 0.1) return 'text-emerald-500';
  if (rate >= 0.04) return 'text-amber-500';
  return 'text-red-500';
}

export default async function StickyCtaPage() {
  const configured = isPostHogServerConfigured();
  const rows = configured ? await fetchStickyCtaFunnel() : null;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <PageHeader
        icon={<MousePointerClick className="h-5 w-5" aria-hidden />}
        title="Sticky CTA — mobile conversion"
        description="Per-route CTR + dismissal rate cho thanh sticky CTA mobile (md:hidden, 100% impression là mobile/tablet). Cửa sổ 30 ngày. CTR mục tiêu ≥ 4% per route — > 10% là excellent."
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
              : 'Chưa có sticky_cta_shown event nào trong 30 ngày (hoặc rollout chưa chạy).'}
          </p>
        </div>
      )}

      {configured && rows && rows.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-card-editorial border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  Route (track_id)
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Shown
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Clicked
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Dismissed
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  CTR
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Dismiss rate
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.track_id}
                  className="border-b border-border/40 last:border-0"
                >
                  <td className="px-4 py-3 font-mono text-foreground">
                    {r.track_id}
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">
                    {r.shown.toLocaleString('vi-VN')}
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">
                    {r.clicked.toLocaleString('vi-VN')}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {r.dismissed.toLocaleString('vi-VN')}
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-mono font-semibold ${ctrColor(r.ctr)}`}
                  >
                    {pct(r.ctr)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                    {pct(r.dr)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-8 text-xs text-muted-foreground">
        Source: <code className="font-mono">sticky_cta_shown</code>,{' '}
        <code className="font-mono">sticky_cta_clicked</code>,{' '}
        <code className="font-mono">sticky_cta_dismissed</code> from{' '}
        <code className="font-mono">apps/web/src/components/marketing/StickyMobileCta.tsx</code>.
        CTR thresholds: xanh ≥ 10% (excellent), vàng 4-10% (acceptable), đỏ &lt;
        4% (consider muting the bar or rewriting the label on that route).
      </p>
    </main>
  );
}
