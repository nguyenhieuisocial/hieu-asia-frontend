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
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, cn } from '@hieu-asia/ui';
import {
  Search,
  MousePointerClick,
  Eye,
  Percent,
  CalendarRange,
  Gauge,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { AhrefsPanel } from '@/components/admin/seo/AhrefsPanel';
import { KpiCard, type KpiCardProps } from '@/components/admin/kpi-card';
import { EmptyState } from '@/components/admin/empty-state';
import { ErrorBlock } from '@/components/admin/error-block';
import { AdminTable, type AdminTableColumn } from '@/components/admin/table/AdminTable';
import {
  getGscSearchAnalytics,
  type GscResponse,
  type GscRow,
  type GscMetrics,
  type GscMovingQuery,
} from '@/lib/gsc-api';

// Recharts (~150KB gzipped) lazy-loaded so it stays out of the initial bundle;
// the trend card hydrates after the KPI row paints. ssr:false — admin is
// auth-gated and not SEO-indexed (mirrors ReadingsChart on the dashboard).
const GscTrendChart = dynamic(
  () => import('@/components/admin/seo/GscTrendChart').then((m) => m.GscTrendChart),
  {
    ssr: false,
    loading: () => <div className="h-72 animate-pulse rounded bg-muted/30" aria-hidden />,
  },
);

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

type Delta = NonNullable<KpiCardProps['delta']>;

/**
 * Period-over-period delta for a "higher = better" metric (clicks, impressions,
 * CTR). Returns a percentage tag with green-up / red-down semantics. `null` when
 * there's no comparable prior value.
 */
function pctDelta(current: number, prev: number): Delta | null {
  if (prev === 0) {
    if (current === 0) return null;
    return { value: 'mới', direction: 'up' };
  }
  const ratio = ((current - prev) / Math.abs(prev)) * 100;
  if (Math.abs(ratio) < 0.1) return { value: '0%', direction: 'flat' };
  const sign = ratio > 0 ? '+' : '';
  return {
    value: `${sign}${ratio.toFixed(1)}%`,
    direction: ratio > 0 ? 'up' : 'down',
  };
}

/**
 * Delta for avg position, where LOWER is better. We invert the colour semantics
 * so an improvement (rank drops) shows green; the value carries an explicit ▲/▼
 * rank glyph so the direction stays unambiguous despite the inverted colour.
 */
function positionDelta(current: number, prev: number): Delta | null {
  const diff = current - prev; // negative = improved (moved up the page)
  if (Math.abs(diff) < 0.05) return { value: '±0', direction: 'flat' };
  const improved = diff < 0;
  return {
    // ▲ = climbed toward #1 (good); ▼ = slipped down. Magnitude in ranks.
    value: `${improved ? '▲' : '▼'} ${Math.abs(diff).toFixed(1)}`,
    direction: improved ? 'up' : 'down',
  };
}

/** Top-queries / top-pages table. Truncates long keys with a title tooltip. */
function GscTable({ title, rows }: { title: string; rows: GscRow[] }) {
  const columns: AdminTableColumn<GscRow>[] = [
    {
      id: 'key',
      header: title.includes('khoá') ? 'Từ khoá' : 'Trang',
      className: 'max-w-xs',
      cell: (r) => (
        <span className="block truncate text-foreground/85" title={r.key}>
          {r.key}
        </span>
      ),
    },
    {
      id: 'clicks',
      header: 'Clicks',
      className: 'text-right font-mono text-foreground',
      cell: (r) => fmtInt(r.clicks),
    },
    {
      id: 'impressions',
      header: 'Impressions',
      className: 'text-right font-mono text-foreground/70',
      cell: (r) => fmtInt(r.impressions),
    },
    {
      id: 'ctr',
      header: 'CTR',
      className: 'text-right font-mono text-foreground/70',
      cell: (r) => fmtPct(r.ctr),
    },
    {
      id: 'position',
      header: 'Vị trí TB',
      className: 'text-right font-mono text-foreground/70',
      cell: (r) => fmtPos(r.position),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <AdminTable
          rows={rows}
          columns={columns}
          getRowId={(r) => r.key}
          empty={
            <p className="text-sm text-muted-foreground">
              Chưa có dữ liệu trong khoảng thời gian này.
            </p>
          }
          caption={title}
        />
      </CardContent>
    </Card>
  );
}

/**
 * Rising / falling queries — compact list of queries whose impressions moved
 * most vs the prior equal-length window. `variant` flips the glyph + colour.
 */
function MovingQueries({
  title,
  rows,
  variant,
}: {
  title: string;
  rows: GscMovingQuery[];
  variant: 'rising' | 'falling';
}) {
  const isRising = variant === 'rising';
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          {isRising ? (
            <TrendingUp className="h-4 w-4 text-jade" aria-hidden />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" aria-hidden />
          )}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border/40">
          {rows.map((r) => (
            <li key={r.key} className="flex items-center justify-between gap-3 px-4 py-2.5">
              <span className="min-w-0 flex-1 truncate text-sm text-foreground/85" title={r.key}>
                {r.key}
              </span>
              <span
                className={cn(
                  'shrink-0 font-mono text-xs tabular-nums',
                  isRising ? 'text-jade-700 dark:text-jade-50' : 'text-red-700 dark:text-red-300',
                )}
              >
                {isRising ? '▲' : '▼'} {fmtInt(Math.abs(r.deltaImpressions))}
              </span>
            </li>
          ))}
        </ul>
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

  // Period-over-period — all optional; deltas only render when prev+current
  // are both present (backend may not yet emit them → cards render as today).
  const current: GscMetrics | undefined = ok?.current;
  const prev = ok?.prev;
  const hasDelta = !!current && !!prev;
  const clicksDelta = hasDelta ? pctDelta(current.clicks, prev.clicks) : undefined;
  const imprDelta = hasDelta ? pctDelta(current.impressions, prev.impressions) : undefined;
  const ctrDelta = hasDelta ? pctDelta(current.ctr, prev.ctr) : undefined;
  const posDelta = hasDelta ? positionDelta(current.position, prev.position) : undefined;

  const daily = ok?.daily ?? [];
  const rising = ok?.risingQueries ?? [];
  const falling = ok?.fallingQueries ?? [];
  const showTrend = !q.isLoading && daily.length > 1;
  const showMovers = !q.isLoading && (rising.length > 0 || falling.length > 0);

  return (
    <div className="space-y-6">
      {header}

      <AhrefsPanel />

      {ok?.site && (
        <p className="text-sm text-muted-foreground">
          Property: <code className="font-mono text-foreground/85">{ok.site}</code>
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KpiCard
          label="Tổng clicks"
          value={q.isLoading ? '…' : fmtInt(totals.clicks)}
          delta={clicksDelta}
          icon={<MousePointerClick className="h-4 w-4" />}
          accent="gold"
        />
        <KpiCard
          label="Tổng impressions"
          value={q.isLoading ? '…' : fmtInt(totals.impressions)}
          delta={imprDelta}
          icon={<Eye className="h-4 w-4" />}
          accent="jade"
        />
        <KpiCard
          label="CTR trung bình"
          value={q.isLoading ? '…' : fmtPct(avgCtr)}
          hint="clicks / impressions"
          delta={ctrDelta}
          icon={<Percent className="h-4 w-4" />}
          accent="purple"
        />
        {/* Avg position — lower = better, so positionDelta inverts colour
            semantics (green = climbed toward #1). Only shown once the backend
            emits `current.position`; otherwise we keep the original 4 cards. */}
        {current ? (
          <KpiCard
            label="Vị trí TB"
            value={q.isLoading ? '…' : fmtPos(current.position)}
            hint="thấp hơn = tốt hơn"
            delta={posDelta}
            icon={<Gauge className="h-4 w-4" />}
            accent="jade"
          />
        ) : null}
        <KpiCard
          label="Khoảng ngày"
          value={q.isLoading ? '…' : rangeLabel}
          hint="GSC trễ ~2-3 ngày"
          icon={<CalendarRange className="h-4 w-4" />}
        />
      </div>

      {showTrend && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Xu hướng tìm kiếm theo ngày</CardTitle>
          </CardHeader>
          <CardContent>
            <GscTrendChart data={daily} />
          </CardContent>
        </Card>
      )}

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

      {showMovers && (
        <div className="grid gap-4 lg:grid-cols-2">
          {rising.length > 0 && (
            <MovingQueries title="Từ khoá đang lên" rows={rising} variant="rising" />
          )}
          {falling.length > 0 && (
            <MovingQueries title="Từ khoá đang xuống" rows={falling} variant="falling" />
          )}
        </div>
      )}
    </div>
  );
}
