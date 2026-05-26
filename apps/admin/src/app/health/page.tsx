'use client';

/**
 * /health — 30-day uptime grid + recent incidents.
 *
 * Wave 60.81.C Tier 3 polish batch 2. Uses AdminTable for the incident
 * log (vault 107 §5.5) and a 30-day square strip for at-a-glance uptime.
 *
 * Data sources (best-effort, with mock fallback):
 *   GET /api/admin-proxy/admin/uptime?days=30   → daily uptime % series
 *   GET /api/admin-proxy/admin/incidents?limit=20 → recent incidents
 *
 * Both endpoints are TODO at the worker level — until they ship we render
 * a deterministic mock (same approach as MockBanner pattern across admin)
 * so the shell + design stays exercised.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from '@hieu-asia/ui';
import { Heart, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { KpiCard } from '@/components/admin/kpi-card';
import { LiveBadge } from '@/components/admin/live-badge';
import { MockBanner } from '@/components/mock-banner';
import { AdminTable, type AdminTableColumn } from '@/components/admin/table/AdminTable';

interface UptimeDay {
  date: string;
  uptime_pct: number;
}

interface Incident {
  id: string;
  ts: string;
  service: string;
  severity: 'minor' | 'major' | 'critical';
  summary: string;
  resolved_at: string | null;
}

// Mock data — Wave 60.81.C scaffold-as-needed. Deterministic so the grid
// renders consistently while worker endpoints are TBD.
const MOCK_UPTIME: UptimeDay[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - (29 - i));
  // Bias to 100% with occasional dips so the grid shows variety.
  const noise = i === 11 ? 92.4 : i === 22 ? 99.1 : 100;
  return { date: d.toISOString().slice(0, 10), uptime_pct: noise };
});

const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'inc-001',
    ts: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11).toISOString(),
    service: 'Worker API',
    severity: 'minor',
    summary: 'Queue depth backlog 12m — cleared after retry sweep',
    resolved_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11 + 1000 * 60 * 18).toISOString(),
  },
  {
    id: 'inc-002',
    ts: new Date(Date.now() - 1000 * 60 * 60 * 24 * 22).toISOString(),
    service: 'Supabase',
    severity: 'minor',
    summary: 'Slow query on /admin/customers — index added',
    resolved_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 22 + 1000 * 60 * 30).toISOString(),
  },
];

const SEV_CLASS: Record<Incident['severity'], string> = {
  minor: 'border-warn-500/30 bg-warn-500/10 text-warn-300',
  major: 'border-red-500/40 bg-red-500/10 text-red-300',
  critical: 'border-red-500/60 bg-red-500/20 text-red-200',
};

function fmtPct(v: number) {
  return v >= 99.95 ? '100%' : `${v.toFixed(2)}%`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function uptimeColor(pct: number): string {
  if (pct >= 99.95) return 'bg-jade-300';
  if (pct >= 99) return 'bg-jade-500';
  if (pct >= 95) return 'bg-warn-500';
  return 'bg-red-500';
}

export default function HealthPage() {
  // Try real endpoints first; fall back to mock when 404.
  const uptime = useQuery({
    queryKey: ['admin', 'uptime-30d'],
    queryFn: async () => {
      try {
        const r = await fetch('/api/admin-proxy/admin/uptime?days=30', { cache: 'no-store' });
        if (!r.ok) return { rows: MOCK_UPTIME, isMock: true };
        const data = (await r.json()) as { rows?: UptimeDay[] };
        return { rows: data.rows ?? MOCK_UPTIME, isMock: !data.rows };
      } catch {
        return { rows: MOCK_UPTIME, isMock: true };
      }
    },
  });

  const incidents = useQuery({
    queryKey: ['admin', 'incidents'],
    queryFn: async () => {
      try {
        const r = await fetch('/api/admin-proxy/admin/incidents?limit=20', { cache: 'no-store' });
        if (!r.ok) return { rows: MOCK_INCIDENTS, isMock: true };
        const data = (await r.json()) as { rows?: Incident[] };
        return { rows: data.rows ?? MOCK_INCIDENTS, isMock: !data.rows };
      } catch {
        return { rows: MOCK_INCIDENTS, isMock: true };
      }
    },
  });

  const rows = uptime.data?.rows ?? [];
  const avg = rows.length > 0 ? rows.reduce((s, d) => s + d.uptime_pct, 0) / rows.length : 0;
  const worst = rows.length > 0 ? Math.min(...rows.map((d) => d.uptime_pct)) : 0;
  const okDays = rows.filter((d) => d.uptime_pct >= 99.95).length;
  const incidentCount = incidents.data?.rows.length ?? 0;

  const incidentCols: AdminTableColumn<Incident>[] = [
    {
      id: 'ts',
      header: 'Thời điểm',
      sortKey: 'ts',
      width: '160px',
      cell: (r) => <span className="font-mono text-xs text-foreground/90">{fmtDate(r.ts)}</span>,
    },
    {
      id: 'service',
      header: 'Dịch vụ',
      sortKey: 'service',
      width: '120px',
      cell: (r) => <span className="text-sm text-foreground">{r.service}</span>,
    },
    {
      id: 'severity',
      header: 'Mức',
      sortKey: 'severity',
      width: '100px',
      cell: (r) => (
        <span
          className={cn(
            'inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider',
            SEV_CLASS[r.severity],
          )}
        >
          {r.severity}
        </span>
      ),
    },
    {
      id: 'summary',
      header: 'Mô tả',
      cell: (r) => <span className="text-sm text-foreground/85">{r.summary}</span>,
    },
    {
      id: 'resolved',
      header: 'Kết thúc',
      width: '120px',
      hideOnMobile: true,
      cell: (r) =>
        r.resolved_at ? (
          <span className="font-mono text-xs text-jade-300">{fmtDate(r.resolved_at)}</span>
        ) : (
          <span className="font-mono text-xs text-warn-300">đang xử lý</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Uptime & sự cố"
        description="Theo dõi tính khả dụng 30 ngày qua và danh sách sự cố gần nhất."
        icon={<Heart className="h-5 w-5" />}
        badge={<LiveBadge />}
      />

      <MockBanner source={{ isMock: uptime.data?.isMock ?? false, reason: 'endpoint TBD' }} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Uptime trung bình"
          value={fmtPct(avg)}
          icon={<CheckCircle2 className="h-4 w-4" />}
          accent="jade"
          hint="30 ngày"
        />
        <KpiCard
          label="Ngày hoàn hảo"
          value={`${okDays}/${rows.length}`}
          icon={<TrendingUp className="h-4 w-4" />}
          accent="gold"
          hint=">=99.95%"
        />
        <KpiCard
          label="Thấp nhất"
          value={fmtPct(worst)}
          icon={<AlertTriangle className="h-4 w-4" />}
          accent={worst < 99 ? 'red' : 'gold'}
          hint="worst day"
        />
        <KpiCard
          label="Sự cố"
          value={incidentCount}
          icon={<AlertTriangle className="h-4 w-4" />}
          accent={incidentCount > 0 ? 'gold' : 'jade'}
          hint="30 ngày"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lưới uptime 30 ngày</CardTitle>
          <CardDescription>
            Mỗi ô = 1 ngày. Xanh = 100% / 99.95%+, xanh đậm = 99%+, vàng = 95%+, đỏ = thấp hơn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-2 sm:grid-cols-[repeat(30,minmax(0,1fr))]">
            {rows.map((d) => (
              <div
                key={d.date}
                title={`${d.date} — ${fmtPct(d.uptime_pct)}`}
                className={cn(
                  'aspect-square rounded-sm transition-all duration-300 ease-editorial hover:scale-110',
                  uptimeColor(d.uptime_pct),
                )}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sự cố gần đây</CardTitle>
          <CardDescription>20 sự cố mới nhất, theo thứ tự ngược thời gian.</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminTable
            rows={incidents.data?.rows ?? []}
            columns={incidentCols}
            loading={incidents.isLoading}
            empty={
              <span className="text-sm text-muted-foreground">
                Không có sự cố trong 30 ngày qua.
              </span>
            }
            caption="Danh sách sự cố gần nhất"
          />
        </CardContent>
      </Card>
    </div>
  );
}
