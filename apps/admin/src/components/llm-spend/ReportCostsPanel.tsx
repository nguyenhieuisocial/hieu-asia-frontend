'use client';

/**
 * /llm-spend → tab "Chi phí mỗi báo cáo".
 *
 * The first time llm_traces.reading_session_id is surfaced: every full reading
 * fans out into many LLM calls (report + logic + alignment + psychology + …),
 * all tagged with the same reading_session_id. Grouping by it gives report-level
 * P&L — cost, trace count and total wall-latency per generated report — so the
 * founder can see the unit economics of a single sale.
 *
 * Data: GET /admin/ai/report-costs?days=N&limit=M (worker, service-role gated).
 * Returns null on 404 → panel hides gracefully until the backend ships.
 *
 * Data caveat (honest): the report pipeline currently ledgers cost_usd = 0 on
 * its traces, so "Chi phí" shows $0 today while trace-count + total-latency are
 * real. The cost column fills in automatically once the pipeline prices its
 * calls — the surface is correct now.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import { Receipt } from 'lucide-react';
import { EmptyState } from '@/components/admin/empty-state';
import { KpiCard } from '@/components/admin/kpi-card';
import { AdminTable, type AdminTableColumn } from '@/components/admin/table/AdminTable';
import { getReportCosts, type ReportCostRow } from '@/lib/llm-spend-api';

const WINDOWS = [
  { days: 7, label: '7 ngày' },
  { days: 30, label: '30 ngày' },
  { days: 90, label: '90 ngày' },
] as const;

function fmtUsd(v: number): string {
  return `$${v.toFixed(4)}`;
}

function fmtSeconds(ms: number): string {
  if (!Number.isFinite(ms)) return '—';
  return `${(ms / 1000).toFixed(1)} s`;
}

/** Trim "session_" prefix + show first 8 chars of the uuid for readability. */
function shortId(id: string): string {
  const bare = id.replace(/^session_/, '');
  return bare.slice(0, 8);
}

const COLUMNS: AdminTableColumn<ReportCostRow>[] = [
  {
    id: 'report',
    header: 'Báo cáo',
    className: 'font-mono text-xs text-foreground',
    cell: (r) => <span title={r.reading_session_id}>{shortId(r.reading_session_id)}</span>,
  },
  {
    id: 'cost',
    header: 'Chi phí',
    sortKey: 'cost_usd',
    className: 'text-right font-mono text-xs text-gold',
    cell: (r) => fmtUsd(r.cost_usd),
  },
  {
    id: 'traces',
    header: 'Số gọi',
    sortKey: 'trace_count',
    className: 'text-right font-mono text-xs text-muted-foreground',
    cell: (r) => r.trace_count,
  },
  {
    id: 'latency',
    header: 'Tổng độ trễ',
    sortKey: 'total_latency_ms',
    className: 'text-right font-mono text-xs text-purple',
    cell: (r) => fmtSeconds(r.total_latency_ms),
  },
];

export function ReportCostsPanel() {
  const [days, setDays] = React.useState<number>(30);

  const q = useQuery({
    queryKey: ['report-costs', days],
    queryFn: () => getReportCosts(days, 50),
    staleTime: 60_000,
  });

  const reports = q.data?.reports ?? [];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-gold" />
              Chi phí mỗi báo cáo
            </CardTitle>
            <CardDescription>
              Gom <code className="font-mono">llm_traces</code> theo{' '}
              <code className="font-mono">reading_session_id</code> — kinh tế đơn vị (P&amp;L) của
              từng báo cáo: chi phí, số lần gọi LLM và tổng độ trễ.
            </CardDescription>
          </div>
          <div className="flex gap-1">
            {WINDOWS.map((w) => (
              <Button
                key={w.days}
                variant={days === w.days ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDays(w.days)}
              >
                {w.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!q.isLoading && !q.data ? (
          <EmptyState
            title="Chưa có dữ liệu chi phí báo cáo"
            description="Endpoint /admin/ai/report-costs chưa được triển khai, hoặc chưa có báo cáo nào trong khoảng thời gian này."
          />
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <KpiCard label="Số báo cáo" value={q.data?.report_count ?? 0} />
              <KpiCard label="Chi phí TB / báo cáo" value={fmtUsd(q.data?.avg_cost_usd ?? 0)} />
              <KpiCard label="Chi phí trung vị" value={fmtUsd(q.data?.median_cost_usd ?? 0)} />
            </div>

            <AdminTable
              rows={reports}
              columns={COLUMNS}
              getRowId={(r) => r.reading_session_id}
              loading={q.isLoading}
              empty={
                <EmptyState
                  title="Chưa có báo cáo nào"
                  description={`Không có báo cáo nào được tạo trong ${days} ngày qua.`}
                />
              }
              caption="Chi phí mỗi báo cáo"
            />

            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Lưu ý: pipeline báo cáo hiện chưa ghi nhận <code className="font-mono">cost_usd</code> trên
              từng trace, nên cột Chi phí có thể bằng $0 — số lần gọi và tổng độ trễ vẫn là số thật.
              Cột chi phí sẽ tự điền khi pipeline bắt đầu tính giá mỗi cuộc gọi.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
