'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { DollarSign, Activity, TrendingUp, Calendar } from 'lucide-react';
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

export default function AdminCostPage() {
  const cost = useQuery({ queryKey: ['admin', 'cost-by-day'], queryFn: () => getCostByDay(30) });
  const top = useQuery({ queryKey: ['admin', 'top-spenders'], queryFn: () => getTopSpenders(10) });

  const data = cost.data ?? [];
  const today = data.at(-1)?.total_usd ?? 0;
  const monthTotal = data.reduce((a, d) => a + d.total_usd, 0);
  const avgPerDay = data.length > 0 ? monthTotal / data.length : 0;
  const peak = data.length > 0 ? Math.max(...data.map((d) => d.total_usd)) : 0;
  const spark = data.slice(-14).map((d) => d.total_usd);
  const hasData = monthTotal > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chi phí AI"
        description={<>Tổng hợp từ <code className="font-mono text-cream/75">llm_trace_daily</code> — gộp theo ngày + theo model.</>}
        icon={<DollarSign className="h-5 w-5" />}
        badge={hasData ? <LiveBadge /> : null}
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
          label="30 ngày"
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
          <CardTitle>Chi phí theo model — 30 ngày</CardTitle>
          <CardDescription>
            Stacked bar — vàng đậm = GPT-4o, vàng nhạt = mini, tím = Claude, jade = Gemini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cost.isLoading ? (
            <div className="h-80 animate-pulse rounded bg-cream/5" />
          ) : !hasData ? (
            <EmptyState
              title="Chưa có LLM trace"
              description={
                <>
                  Bắt đầu chạy hệ thống AI để track spend. Mỗi cuộc gọi LLM được ledger ngay khi xảy ra
                  vào bảng <code className="font-mono text-gold">hieu_asia.llm_traces</code>.
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
          <CardDescription>Sorted theo total_spend_usd (30 ngày gần nhất).</CardDescription>
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
                  className="flex items-center justify-between rounded-md border border-gold/10 bg-ink/40 px-3 py-2 text-sm transition-colors hover:border-gold/25"
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={
                        'inline-flex h-7 w-7 items-center justify-center rounded-full font-mono text-xs ' +
                        (i === 0
                          ? 'bg-gradient-to-br from-gold to-gold-600 text-ink shadow-md'
                          : i === 1
                            ? 'bg-cream/15 text-cream'
                            : i === 2
                              ? 'bg-gold/15 text-gold'
                              : 'bg-ink/60 text-cream/70')
                      }
                    >
                      {i + 1}
                    </span>
                    <span className="font-mono text-xs text-cream">{u.email}</span>
                  </span>
                  <span className="font-mono text-gold">${u.total_spend_usd.toFixed(2)}</span>
                </li>
              ))}
              {top.isLoading && <li className="text-cream/60">Đang tải…</li>}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
