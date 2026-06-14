'use client';

/**
 * Tìm kiếm Google (SEO) — Google Search Console organic-search analytics.
 *
 * PostHog covers product/web behaviour but NOT organic Google search queries.
 * This page surfaces "which search queries + pages bring traffic" — the missing
 * acquisition lens for an SEO-first product. Data is pulled live through the
 * admin proxy (GET /api/admin-proxy/admin/gsc/search-analytics?days=N).
 *
 * GSC data lags ~2-3 days, so range.end ≈ today-2 — we render the range so the
 * operator knows the freshness. When GSC secrets aren't set the worker returns
 * `not_configured` and we render a setup card; auth/api failures render an
 * ErrorBlock with retry.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, cn } from '@hieu-asia/ui';
import { Search, MousePointerClick, Eye, Percent, CalendarRange } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { KpiCard } from '@/components/admin/kpi-card';
import { EmptyState } from '@/components/admin/empty-state';
import { ErrorBlock } from '@/components/admin/error-block';
import {
  getGscSearchAnalytics,
  type GscResponse,
  type GscRow,
} from '@/lib/gsc-api';

type Range = 7 | 28 | 90;

const RANGE_OPTIONS: { value: Range; label: string }[] = [
  { value: 7, label: '7d' },
  { value: 28, label: '28d' },
  { value: 90, label: '90d' },
];

function fmtInt(v: number): string {
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(v);
}
/** ctr is 0..1 → percentage with 1 decimal. */
function fmtPct(v: number): string {
  return `${(v * 100).toFixed(1)}%`;
}
/** avg rank — 1 decimal, lower = better. */
function fmtPos(v: number): string {
  return v.toFixed(1);
}

/** Top-queries / top-pages table. Truncates long keys with a title tooltip. */
function GscTable({ title, rows }: { title: string; rows: GscRow[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {rows.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-muted-foreground">
            Chưa có dữ liệu trong khoảng thời gian này.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 border-b border-border/60 bg-card text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 font-medium">{title.includes('khoá') ? 'Từ khoá' : 'Trang'}</th>
                  <th className="px-4 py-2.5 text-right font-medium">Clicks</th>
                  <th className="px-4 py-2.5 text-right font-medium">Impressions</th>
                  <th className="px-4 py-2.5 text-right font-medium">CTR</th>
                  <th className="px-4 py-2.5 text-right font-medium">Vị trí TB</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.key}
                    className="border-b border-border/40 transition-colors last:border-0 hover:bg-muted/[0.04]"
                  >
                    <td className="max-w-xs px-4 py-2.5">
                      <span className="block truncate text-foreground/85" title={r.key}>
                        {r.key}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-foreground">{fmtInt(r.clicks)}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-foreground/70">{fmtInt(r.impressions)}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-foreground/70">{fmtPct(r.ctr)}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-foreground/70">{fmtPos(r.position)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function SeoPage() {
  const [days, setDays] = React.useState<Range>(28);

  const q = useQuery<GscResponse, Error>({
    queryKey: ['admin', 'gsc', 'search-analytics', days],
    queryFn: () => getGscSearchAnalytics(days),
    staleTime: 5 * 60_000,
    placeholderData: (prev) => prev,
  });

  const rangeSelector = (
    <div className="inline-flex rounded-md border border-gold/20 bg-card/60 p-0.5">
      {RANGE_OPTIONS.map((r) => (
        <button
          key={r.value}
          type="button"
          onClick={() => setDays(r.value)}
          className={cn(
            'rounded px-3 py-1 text-xs transition-colors',
            days === r.value ? 'bg-gold/20 text-gold' : 'text-muted-foreground hover:bg-gold/5',
          )}
        >
          {r.label}
        </button>
      ))}
    </div>
  );

  const header = (
    <PageHeader
      title="Tìm kiếm Google (SEO)"
      description="Truy vấn & trang mang traffic tự nhiên từ Google — kéo trực tiếp từ Google Search Console. Dữ liệu GSC trễ ~2-3 ngày."
      icon={<Search className="h-5 w-5" />}
      actions={rangeSelector}
    />
  );

  // not_configured → setup card. The worker returns ok:false either as the
  // resolved data or (defensively) embedded in a thrown error message.
  const data = q.data;
  const notConfigured =
    (data && data.ok === false && data.error === 'not_configured') ||
    (q.error?.message?.includes('not_configured') ?? false);

  if (notConfigured) {
    const hint =
      data && data.ok === false ? data.hint : undefined;
    return (
      <div className="space-y-6">
        {header}
        <EmptyState
          title="Chưa kết nối Google Search Console"
          description={
            <>
              Để xem từ khoá tìm kiếm, cần thêm 2 secret trên Worker:{' '}
              <code className="font-mono text-gold">GSC_SA_KEY</code> (JSON key của một Google
              service-account) và <code className="font-mono text-gold">GSC_SITE_URL</code> (vd{' '}
              <code className="font-mono text-gold">sc-domain:hieu.asia</code>). Sau đó thêm email
              của service-account đó làm user trong Google Search Console (quyền đọc).{' '}
              <a href="/secrets" className="text-gold hover:underline">
                Mở trang Secrets →
              </a>
              {hint ? <span className="mt-2 block text-xs text-muted-foreground">{hint}</span> : null}
            </>
          }
        />
      </div>
    );
  }

  // auth_failed / gsc_api_error → ErrorBlock with hint/detail + retry.
  const structuredError = data && data.ok === false ? data : undefined;
  const showError = !!q.error || !!structuredError;
  if (showError && !q.isLoading) {
    const message =
      structuredError?.hint ??
      structuredError?.detail ??
      (structuredError?.error === 'auth_failed'
        ? 'Xác thực với Google thất bại — kiểm tra GSC_SA_KEY.'
        : structuredError?.error === 'gsc_api_error'
          ? 'Google Search Console API trả về lỗi.'
          : q.error?.message) ??
      'Không tải được dữ liệu Search Console.';
    return (
      <div className="space-y-6">
        {header}
        <ErrorBlock
          title="Không tải được Search Console"
          message={message}
          onRetry={() => q.refetch()}
        />
      </div>
    );
  }

  const ok = data && data.ok ? data : undefined;
  const totals = ok?.totals ?? { clicks: 0, impressions: 0 };
  const avgCtr = totals.impressions > 0 ? totals.clicks / totals.impressions : 0;
  const rangeLabel = ok?.range ? `${ok.range.start} → ${ok.range.end}` : '—';

  return (
    <div className="space-y-6">
      {header}

      {ok?.site && (
        <p className="text-sm text-muted-foreground">
          Property: <code className="font-mono text-foreground/85">{ok.site}</code>
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Tổng clicks"
          value={q.isLoading ? '…' : fmtInt(totals.clicks)}
          icon={<MousePointerClick className="h-4 w-4" />}
          accent="gold"
        />
        <KpiCard
          label="Tổng impressions"
          value={q.isLoading ? '…' : fmtInt(totals.impressions)}
          icon={<Eye className="h-4 w-4" />}
          accent="jade"
        />
        <KpiCard
          label="CTR trung bình"
          value={q.isLoading ? '…' : fmtPct(avgCtr)}
          hint="clicks / impressions"
          icon={<Percent className="h-4 w-4" />}
          accent="purple"
        />
        <KpiCard
          label="Khoảng ngày"
          value={q.isLoading ? '…' : rangeLabel}
          hint="GSC trễ ~2-3 ngày"
          icon={<CalendarRange className="h-4 w-4" />}
        />
      </div>

      {q.isLoading ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">Đang tải…</CardContent>
        </Card>
      ) : ok && totals.impressions === 0 ? (
        <EmptyState
          title="Chưa có dữ liệu tìm kiếm"
          description="Google Search Console chưa ghi nhận click/impression nào trong khoảng này. Khi site có lượt hiển thị trên Google, từ khoá sẽ xuất hiện tại đây."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <GscTable title="Từ khoá hàng đầu" rows={ok?.queries ?? []} />
          <GscTable title="Trang hàng đầu" rows={ok?.pages ?? []} />
        </div>
      )}
    </div>
  );
}
