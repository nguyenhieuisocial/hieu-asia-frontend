'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
} from '@hieu-asia/ui';
import { DollarSign, Activity, TrendingUp, Calendar, Download } from 'lucide-react';
import { CostChart } from '@/components/cost-chart';
import { getCostByDay, getTopSpenders } from '@/lib/admin-api';
import { MockBanner } from '@/components/mock-banner';
import { PageHeader } from '@/components/admin/page-header';
import { KpiCard } from '@/components/admin/kpi-card';
import { EmptyState } from '@/components/admin/empty-state';
import { LiveBadge } from '@/components/admin/live-badge';

function fmtUsd(v: number) {
  return `$${v.toFixed(2)}`;
}

type Range = 7 | 14 | 30 | 90;

const RANGE_OPTIONS: { value: Range; label: string }[] = [
  { value: 7, label: '7d' },
  { value: 14, label: '14d' },
  { value: 30, label: '30d' },
  { value: 90, label: '90d' },
];

function downloadCsv(filename: string, rows: Array<Record<string, string | number>>) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]!);
  const body = rows
    .map((r) =>
      headers
        .map((h) => `"${String(r[h] ?? '').replace(/"/g, '""')}"`)
        .join(','),
    )
    .join('\n');
  const csv = `${headers.join(',')}\n${body}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminCostPage() {
  const [days, setDays] = React.useState<Range>(30);

  const cost = useQuery({
    queryKey: ['admin', 'cost-by-day', days],
    queryFn: () => getCostByDay(days),
  });
  const top = useQuery({ queryKey: ['admin', 'top-spenders'], queryFn: () => getTopSpenders(10) });

  const data = cost.data ?? [];
  const today = data.at(-1)?.total_usd ?? 0;
  const monthTotal = data.reduce((a, d) => a + d.total_usd, 0);
  const avgPerDay = data.length > 0 ? monthTotal / data.length : 0;
  const peak = data.length > 0 ? Math.max(...data.map((d) => d.total_usd)) : 0;
  const spark = data.slice(-14).map((d) => d.total_usd);
  const hasData = monthTotal > 0;

  const exportCsv = () => {
    downloadCsv(
      `hieu-asia-cost-${days}d-${new Date().toISOString().slice(0, 10)}.csv`,
      data.map((d) => ({
        date: d.date,
        total_usd: d.total_usd.toFixed(6),
      })),
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chi phí AI"
        description={
          <>
            Tổng hợp từ <code className="font-mono text-foreground/85">llm_trace_daily</code> — gộp
            theo ngày + theo model.
          </>
        }
        icon={<DollarSign className="h-5 w-5" />}
        badge={hasData ? <LiveBadge /> : null}
        actions={
          <>
            <div className="inline-flex rounded-md border border-gold/20 bg-card/60 p-0.5">
              {RANGE_OPTIONS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setDays(r.value)}
                  className={cn(
                    'rounded px-3 py-1 text-xs transition-colors',
                    days === r.value
                      ? 'bg-gold/20 text-gold'
                      : 'text-muted-foreground hover:bg-gold/5',
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={exportCsv}
              disabled={data.length === 0}
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Xuất CSV
            </Button>
          </>
        }
      />

      <MockBanner source={cost.data?._source ?? top.data?._source} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Hôm nay"
          value={fmtUsd(today)}
          icon={<Calendar className="h-4 w-4" />}
          accent="gold"
          sparkline={spark}
          hint="USD"
        />
        <KpiCard
          label={`${days} ngày`}
          value={fmtUsd(monthTotal)}
          icon={<DollarSign className="h-4 w-4" />}
          accent="jade"
          hint="tổng cộng"
        />
        <KpiCard
          label="Trung bình / ngày"
          value={fmtUsd(avgPerDay)}
          icon={<Activity className="h-4 w-4" />}
          accent="purple"
        />
        <KpiCard
          label="Ngày cao nhất"
          value={fmtUsd(peak)}
          icon={<TrendingUp className="h-4 w-4" />}
          accent="gold"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chi phí theo model — {days} ngày</CardTitle>
          <CardDescription>
            Stacked bar — vàng đậm = GPT-4o, vàng nhạt = mini, tím = Claude, jade = Gemini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cost.isLoading ? (
            <div className="h-80 animate-pulse rounded bg-muted/30" />
          ) : !hasData ? (
            <EmptyState
              title="Chưa có LLM trace"
              description={
                <>
                  Bắt đầu chạy hệ thống AI để track spend. Mỗi cuộc gọi LLM được ledger ngay khi
                  xảy ra vào bảng{' '}
                  <code className="font-mono text-gold">hieu_asia.llm_traces</code>.
                </>
              }
              className="border-0 bg-transparent"
            />
          ) : (
            <CostChart data={data} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top 10 user chi tiêu</CardTitle>
          <CardDescription>Sorted theo total_spend_usd ({days} ngày gần nhất).</CardDescription>
        </CardHeader>
        <CardContent>
          {(top.data ?? []).length === 0 && !top.isLoading ? (
            <EmptyState
              title="Chưa có user spend"
              description="Khi có LLM call, top spenders sẽ xếp hạng tại đây."
              className="border-0 bg-transparent"
            />
          ) : (
            <ol className="space-y-2">
              {(top.data ?? []).map((u, i) => (
                <li
                  key={u.id || u.email || i}
                  className="flex items-center justify-between rounded-md border border-gold/10 bg-card/60 px-3 py-2 text-sm transition-colors hover:border-gold/25"
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        'inline-flex h-7 w-7 items-center justify-center rounded-full font-mono text-xs',
                        i === 0
                          ? 'bg-gradient-to-br from-gold to-gold-600 text-ink shadow-md'
                          : i === 1
                            ? 'bg-muted/40 text-foreground'
                            : i === 2
                              ? 'bg-gold/15 text-gold'
                              : 'bg-card/60 text-muted-foreground',
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className="font-mono text-xs text-foreground">{u.email}</span>
                  </span>
                  <span className="font-mono text-gold">${u.total_spend_usd.toFixed(2)}</span>
                </li>
              ))}
              {top.isLoading && <li className="text-muted-foreground">Đang tải…</li>}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
