'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import {
  BarChart3,
  TrendingUp,
  Users,
  Activity,
  DollarSign,
} from 'lucide-react';
import { RevenueChart, type RevenueDay } from '@/components/analytics/RevenueChart';
import { VendorCostChart, type VendorCost } from '@/components/analytics/VendorCostChart';
import { FunnelChart, type FunnelStage } from '@/components/analytics/FunnelChart';
import { PageHeader } from '@/components/admin/page-header';
import { KpiCard } from '@/components/admin/kpi-card';
import { LiveBadge } from '@/components/admin/live-badge';
import { ErrorBlock } from '@/components/admin/error-block';
import { EngineMetricsSection } from '@/components/admin/analytics/EngineMetricsSection';

interface AnalyticsResponse {
  ok: boolean;
  days?: number;
  revenue?: { daily: RevenueDay[]; total: number; txn_count: number };
  vendor_cost?: Record<string, { tokens: number; requests: number; cost_usd: number }>;
  vendor_cost_meta?: { configured: boolean; total_cost_usd: number; total_requests: number; note?: string };
  funnel?: Record<string, number>;
  funnel_v2?: {
    stages: Array<{ name: string; count: number; conversion_rate: number }>;
    drop_off_points: string[];
    total_events: number;
    window_days: number;
  };
  sessions?: { total: number; completed: number; conversion_rate: number; error_rate: number };
  sources?: { langfuse: boolean; kv_transactions: boolean; kv_events?: boolean };
  error?: string;
}

type Range = '7' | '30' | '90';

async function fetchAnalytics(days: Range): Promise<AnalyticsResponse> {
  const res = await fetch(`/api/admin/analytics?days=${days}`, { cache: 'no-store' });
  const text = await res.text();
  try {
    return JSON.parse(text) as AnalyticsResponse;
  } catch {
    return { ok: false, error: `Invalid JSON (status ${res.status})` };
  }
}

const FUNNEL_LABELS: Record<string, string> = {
  reading_started: 'Bắt đầu phiên đọc',
  consent_given: 'Đồng ý điều khoản',
  palm_uploaded: 'Upload palm',
  survey_completed: 'Hoàn thành survey',
  report_ready: 'Báo cáo sẵn sàng',
  mentor_started: 'Bắt đầu mentor',
  paid: 'Thanh toán',
};

const FUNNEL_ORDER = ['reading_started', 'consent_given', 'palm_uploaded', 'survey_completed', 'report_ready', 'mentor_started', 'paid'];

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + ' đ';
}

export default function AnalyticsPage() {
  const [days, setDays] = React.useState<Range>('30');
  const { data, isLoading, refetch, isFetching, error } = useQuery({
    queryKey: ['admin', 'analytics', days],
    queryFn: () => fetchAnalytics(days),
  });

  const showError = !!error || data?.ok === false;
  const errorMsg = (error as Error | undefined)?.message ?? data?.error;

  const revenue = data?.revenue ?? { daily: [], total: 0, txn_count: 0 };
  const vendorCost: VendorCost[] = Object.entries(data?.vendor_cost ?? {}).map(([vendor, v]) => ({
    vendor,
    cost_usd: v.cost_usd,
    tokens: v.tokens,
    requests: v.requests,
  }));
  const funnel: FunnelStage[] = FUNNEL_ORDER.flatMap(k => {
    const count = data?.funnel?.[k];
    if (count === undefined) return [];
    return [{ key: k, label: FUNNEL_LABELS[k] ?? k, count }];
  });
  const sessions = data?.sessions ?? { total: 0, completed: 0, conversion_rate: 0, error_rate: 0 };
  const totalLLMCost = vendorCost.reduce((s, v) => s + v.cost_usd, 0);
  const avgCost = sessions.total > 0 ? totalLLMCost / sessions.total : 0;
  // Vendor cost here comes from Langfuse, which is usually NOT wired (keys live
  // off the worker). The real, realtime LLM cost truth is /llm-spend (Supabase
  // llm_traces). When Langfuse is unconfigured, rendering "$0.000" reads as
  // "AI is free" — so show a pointer to /llm-spend instead of a misleading zero.
  const costUnavailable = !!data && data.vendor_cost_meta?.configured === false;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description={`Doanh thu, vendor cost và onboarding funnel — ${days} ngày gần nhất.`}
        icon={<BarChart3 className="h-5 w-5" />}
        badge={data && !isLoading ? <LiveBadge /> : null}
        actions={
          <>
            <div className="inline-flex rounded-md border border-gold/20 bg-card/60 p-0.5">
              {(['7', '30', '90'] as Range[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setDays(r)}
                  className={`rounded px-3 py-1 text-xs transition-colors ${
                    days === r ? 'bg-gold/20 text-gold' : 'text-muted-foreground hover:bg-gold/5'
                  }`}
                >
                  {r}d
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? 'Đang tải…' : 'Làm mới'}
            </Button>
          </>
        }
      />

      {showError && (
        <ErrorBlock
          compact
          message={errorMsg ?? 'Không tải được analytics.'}
          onRetry={() => refetch()}
        />
      )}
      {sessions.error_rate > 0.02 && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-100">
          Tỉ lệ lỗi hôm nay cao: {(sessions.error_rate * 100).toFixed(1)}% (5xx / tổng
          request). Kiểm tra trang Trạng thái hệ thống.
        </div>
      )}
      {data?.sources && !data.sources.langfuse && (
        <div className="rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-muted-foreground">
          Langfuse chưa wire — chi phí LLM thật xem ở /llm-spend. Đặt LANGFUSE_PUBLIC_KEY/SECRET_KEY để bật nguồn này.
        </div>
      )}
      {data?.funnel_v2 && data.funnel_v2.total_events === 0 && (
        <div className="rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-muted-foreground">
          Funnel data trống — chưa có events trong {days} ngày. Verify NEXT_PUBLIC_PLAUSIBLE_DOMAIN
          và user activity, hoặc đợi traffic.
        </div>
      )}
      {data?.funnel_v2 && data.funnel_v2.drop_off_points.length > 0 && (
        <div className="rounded-md border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
          Drop-off &gt;30% phát hiện tại:{' '}
          {data.funnel_v2.drop_off_points
            .map(p => FUNNEL_LABELS[p] ?? p)
            .join(', ')}
          .
        </div>
      )}
      {data?.vendor_cost_meta?.note && (
        <div className="rounded-md border border-gold/20 bg-card/60 px-3 py-2 text-xs text-muted-foreground">
          {data.vendor_cost_meta.note}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label={`Doanh thu (${days}d)`}
          value={fmtCurrency(revenue.total)}
          icon={<DollarSign className="h-4 w-4" />}
          accent="gold"
          hint={`${revenue.txn_count} giao dịch`}
        />
        <KpiCard
          label={`Phiên (${days}d)`}
          value={sessions.total.toLocaleString('vi-VN')}
          icon={<Users className="h-4 w-4" />}
          accent="purple"
          hint={`${sessions.completed} hoàn thành`}
        />
        <KpiCard
          label="Conversion"
          value={(sessions.conversion_rate * 100).toFixed(1) + '%'}
          icon={<TrendingUp className="h-4 w-4" />}
          accent="jade"
          hint="paid / started"
        />
        <KpiCard
          label="Avg LLM cost/phiên"
          value={costUnavailable ? '—' : `$${avgCost.toFixed(3)}`}
          icon={<Activity className="h-4 w-4" />}
          accent="gold"
          hint={costUnavailable ? 'Chi phí thật ở /llm-spend' : `tổng $${totalLLMCost.toFixed(2)}`}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Doanh thu theo ngày</CardTitle>
          <CardDescription>Tổng amount của intent_paid mỗi ngày.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Đang tải…</p>
          ) : (
            <RevenueChart data={revenue.daily} />
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Chi phí theo vendor</CardTitle>
            <CardDescription>Phân bổ LLM cost (USD).</CardDescription>
          </CardHeader>
          <CardContent>
            {costUnavailable ? (
              <div className="flex flex-col items-start gap-2 py-6 text-sm text-muted-foreground">
                <p>
                  Nguồn Langfuse chưa cấu hình nên chi phí ở đây trống. Chi phí LLM
                  thật (realtime, theo từng request) sống ở trang riêng.
                </p>
                <Link
                  href="/llm-spend"
                  className="inline-flex items-center gap-1 rounded-md border border-gold/30 bg-gold/5 px-3 py-1.5 text-xs text-gold transition-colors hover:bg-gold/10"
                >
                  Mở Chi phí LLM →
                </Link>
              </div>
            ) : (
              <VendorCostChart data={vendorCost} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Onboarding funnel</CardTitle>
            <CardDescription>Drop-off mỗi bước từ start → paid.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Đang tải…</p>
            ) : (
              <FunnelChart stages={funnel} />
            )}
          </CardContent>
        </Card>
      </div>

      <EngineMetricsSection />
    </div>
  );
}
