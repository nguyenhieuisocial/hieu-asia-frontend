'use client';

/**
 * Hạ tầng → Aikido — open security issues (severity, type).
 *
 * Data: GET /api/admin-proxy/admin/infra/aikido → worker `handleAikido`
 * (Aikido public API, filter_status=open, sorted by severity). State handling
 * (loading / not-configured / error / empty) lives in <InfraPanel>.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@hieu-asia/ui';
import { getInfraAikido, type InfraAikidoItem, type InfraAikidoSummary } from '@/lib/admin-api';
import { getInfraTool } from '@/lib/infra-tools';
import { StatCard } from '@/components/stat-card';
import { InfraPanel, InfraStatusPill } from '@/components/admin/infra/infra-panel';
import { AdminTable, type AdminTableColumn } from '@/components/admin/table/AdminTable';

const tool = getInfraTool('aikido')!;

function sevTone(s: string): 'good' | 'bad' | 'warn' | 'neutral' {
  switch (s.toLowerCase()) {
    case 'critical':
      return 'bad';
    case 'high':
      return 'bad';
    case 'medium':
      return 'warn';
    case 'low':
      return 'neutral';
    default:
      return 'neutral';
  }
}
const fmtNum = (n: number) => n.toLocaleString('vi-VN');

const ISSUE_COLUMNS: AdminTableColumn<InfraAikidoItem>[] = [
  {
    id: 'severity',
    header: 'Mức',
    cell: (i) => <InfraStatusPill label={i.severity} tone={sevTone(i.severity)} />,
  },
  {
    id: 'title',
    header: 'Lỗ hổng',
    className: 'max-w-[30rem]',
    cell: (i) => <span className="truncate font-medium text-foreground">{i.title}</span>,
  },
  {
    id: 'type',
    header: 'Loại',
    className: 'font-mono text-xs text-muted-foreground',
    cell: (i) => i.type,
  },
  {
    id: 'score',
    header: 'Điểm',
    className: 'text-right tabular-nums text-muted-foreground',
    cell: (i) => i.severity_score || '—',
  },
];

export default function InfraAikidoPage() {
  const query = useQuery({
    queryKey: ['infra', 'aikido'],
    queryFn: getInfraAikido,
    staleTime: 60_000,
  });
  const [sevFilter, setSevFilter] = React.useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const summary: InfraAikidoSummary | undefined = query.data?.ok ? query.data.summary : undefined;

  return (
    <InfraPanel<InfraAikidoItem>
      tool={tool}
      query={query}
      emptyTitle="Không có lỗ hổng đang mở 🎉"
      renderTable={(items) => {
        const filtered = items.filter((i) => sevFilter === 'all' || i.severity.toLowerCase() === sevFilter);
        return (
          <div className="space-y-6">
            {summary && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {summary.open_count != null && <StatCard label="Đang mở" value={fmtNum(summary.open_count)} />}
                {summary.critical_count != null && (
                  <StatCard
                    label="Nghiêm trọng (critical)"
                    value={fmtNum(summary.critical_count)}
                    className={summary.critical_count > 0 ? 'border-red-400/40 bg-red-500/5' : undefined}
                  />
                )}
                {summary.high_count != null && (
                  <StatCard
                    label="Cao (high)"
                    value={fmtNum(summary.high_count)}
                    className={summary.high_count > 0 ? 'border-amber-400/40 bg-amber-500/5' : undefined}
                  />
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="font-mono uppercase tracking-wide text-muted-foreground">Mức:</span>
              {(['all', 'critical', 'high', 'medium', 'low'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setSevFilter(v)}
                  className={
                    'rounded px-2 py-0.5 font-mono uppercase tracking-wide transition-colors ' +
                    (sevFilter === v ? 'bg-gold/15 text-gold' : 'text-muted-foreground hover:text-foreground')
                  }
                >
                  {v === 'all' ? 'Tất cả' : v}
                </button>
              ))}
              <span className="text-muted-foreground">{filtered.length}/{items.length}</span>
            </div>

            <Card>
              <CardContent className="p-0">
                <AdminTable
                  rows={filtered}
                  columns={ISSUE_COLUMNS}
                  getRowId={(i) => i.id}
                  caption="Danh sách lỗ hổng bảo mật"
                />
              </CardContent>
            </Card>
          </div>
        );
      }}
    />
  );
}
