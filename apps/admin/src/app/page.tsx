'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { Users, Sparkles, MessageSquare, DollarSign, Gauge } from 'lucide-react';
import { StatCard } from '@/components/stat-card';
import { ReadingsChart } from '@/components/cost-chart';
import { MockBanner } from '@/components/mock-banner';
import { getKpis, getReadingsPerDay } from '@/lib/admin-api';

function fmtUsd(v: number) {
  return `$${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export default function AdminOverviewPage() {
  const kpis = useQuery({ queryKey: ['admin', 'kpis'], queryFn: getKpis });
  const readings = useQuery({ queryKey: ['admin', 'readings-per-day'], queryFn: () => getReadingsPerDay(30) });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-cream">Tổng quan</h1>
        <p className="mt-1 text-sm text-cream/65">
          Theo dõi nhanh số liệu vận hành ngày + tháng. KPI lấy từ
          <code className="mx-1 font-mono text-cream/75">/admin/analytics</code>
          (fallback mock khi gateway không trả lời).
        </p>
      </div>

      <MockBanner source={kpis.data?._source ?? readings.data?._source} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Tổng người dùng"
          value={kpis.data?.total_users.toLocaleString('vi-VN') ?? '—'}
          delta={{ value: '+12 / 7d', direction: 'up' }}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          label="Báo cáo hôm nay"
          value={kpis.data?.readings_today ?? '—'}
          delta={{ value: '+3 vs hôm qua', direction: 'up' }}
          icon={<Sparkles className="h-4 w-4" />}
        />
        <StatCard
          label="Mentor đang chat"
          value={kpis.data?.active_mentor_sessions ?? '—'}
          hint="đang xử lý"
          icon={<MessageSquare className="h-4 w-4" />}
        />
        <StatCard
          label="Doanh thu 7 ngày"
          value={kpis.data ? fmtUsd(kpis.data.weekly_revenue_usd) : '—'}
          delta={{ value: '+8.4%', direction: 'up' }}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          label="Điểm eval TB"
          value={kpis.data?.eval_avg_score.toFixed(2) ?? '—'}
          hint="trên 5"
          icon={<Gauge className="h-4 w-4" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Báo cáo 30 ngày qua</CardTitle>
          <CardDescription>Số lượng phiên phân tích theo ngày — vàng = tổng, đỏ = lỗi.</CardDescription>
        </CardHeader>
        <CardContent>
          {readings.isLoading ? (
            <div className="h-72 animate-pulse rounded bg-cream/5" />
          ) : (
            <ReadingsChart data={readings.data ?? []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
