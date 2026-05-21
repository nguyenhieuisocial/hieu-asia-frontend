'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { StatCard } from '@/components/stat-card';
import { CostChart } from '@/components/cost-chart';
import { getCostByDay, getTopSpenders } from '@/lib/admin-api';
import { MockBanner } from '@/components/mock-banner';

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-cream">Chi phí AI</h1>
        <p className="mt-1 text-sm text-cream/65">
          Tổng hợp từ Langfuse / OpenRouter / Anthropic — gộp theo ngày + theo model.
        </p>
      </div>

      <MockBanner source={cost.data?._source ?? top.data?._source} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Hôm nay" value={fmtUsd(today)} hint="USD" />
        <StatCard label="30 ngày" value={fmtUsd(monthTotal)} hint="tổng cộng" />
        <StatCard label="Trung bình / ngày" value={fmtUsd(avgPerDay)} />
        <StatCard label="Ngày cao nhất" value={fmtUsd(peak)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chi phí theo model — 30 ngày</CardTitle>
          <CardDescription>Stacked bar — vàng đậm = GPT-4o, vàng nhạt = mini, tím = Claude, jade = Gemini.</CardDescription>
        </CardHeader>
        <CardContent>
          {cost.isLoading ? (
            <div className="h-80 animate-pulse rounded bg-cream/5" />
          ) : (
            <CostChart data={data} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top 10 user chi tiêu</CardTitle>
          <CardDescription>Sorted theo total_spend_usd. Click để mở user detail (TODO).</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {(top.data ?? []).map((u, i) => (
              <li
                key={u.id}
                className="flex items-center justify-between rounded-md border border-gold/10 bg-ink/40 px-3 py-2 text-sm"
              >
                <span className="flex items-center gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 font-mono text-xs text-gold">
                    {i + 1}
                  </span>
                  <span className="text-cream">{u.email}</span>
                </span>
                <span className="font-mono text-gold">${u.total_spend_usd.toFixed(2)}</span>
              </li>
            ))}
            {top.isLoading && <li className="text-cream/60">Đang tải…</li>}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
