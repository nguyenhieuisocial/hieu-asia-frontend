'use client';

/**
 * Hạ tầng → Uptime — BetterStack uptime monitors + recent incidents.
 *
 * Data: GET /api/admin-proxy/admin/infra/uptime → worker `handleInfraUptime`
 * (BetterStack /api/v2/monitors + /api/v2/incidents). State handling (loading /
 * not-configured / vendor-error / empty) lives in <InfraPanel>; this page renders
 * the status-count StatCard strip (`query.data.summary`), the monitors table, and
 * a "Sự cố gần đây" list (`query.data.incidents`).
 *
 * `response_time_ms` is null from the monitors LIST endpoint (latency lives at a
 * separate /response-times endpoint), so the "Phản hồi" cell shows "—".
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@hieu-asia/ui';
import {
  getInfraUptime,
  type InfraUptimeItem,
  type InfraUptimeSummary,
  type InfraUptimeIncident,
} from '@/lib/admin-api';
import { getInfraTool } from '@/lib/infra-tools';
import { StatCard } from '@/components/stat-card';
import { InfraPanel, InfraStatusPill } from '@/components/admin/infra/infra-panel';
import { UptimeMonitorDrawer } from '@/components/admin/infra/UptimeMonitorDrawer';
import { AdminTable, type AdminTableColumn } from '@/components/admin/table/AdminTable';

const tool = getInfraTool('uptime')!;

function fmtNum(n: number): string {
  return n.toLocaleString('vi-VN');
}

function fmtMs(ms: number | null | undefined): string {
  if (ms == null) return '—';
  return `${Math.round(ms).toLocaleString('vi-VN')} ms`;
}

function fmtTime(iso: string | null): string {
  if (!iso) return '—';
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return '—';
  return new Date(t).toLocaleString('vi-VN');
}

/** SSL days-until-expiry — red text when ≤14 days, "—" when not applicable. */
function fmtSsl(days: number | null | undefined): React.ReactNode {
  if (days == null) return '—';
  const cls = days <= 14 ? 'text-red-600 dark:text-red-300' : '';
  return <span className={cls}>{`${days.toLocaleString('vi-VN')} ngày`}</span>;
}

/** Map a monitor row to a status pill (paused wins over up/down). */
function monitorPill(m: InfraUptimeItem): { label: string; tone: 'good' | 'bad' | 'warn' | 'neutral' } {
  if (m.paused) return { label: 'tạm dừng', tone: 'neutral' };
  switch (m.status) {
    case 'up':
      return { label: 'đang chạy', tone: 'good' };
    case 'down':
      return { label: 'đang lỗi', tone: 'bad' };
    case 'maintenance':
      return { label: 'bảo trì', tone: 'neutral' };
    case 'validating':
      return { label: 'đang kiểm', tone: 'warn' };
    case 'pending':
      return { label: 'chờ kiểm', tone: 'warn' };
    default:
      return { label: m.status || '—', tone: 'neutral' };
  }
}

function incidentTone(inc: InfraUptimeIncident): 'good' | 'bad' | 'neutral' {
  if (inc.resolved_at) return 'good';
  return 'bad';
}

const MONITOR_COLUMNS: AdminTableColumn<InfraUptimeItem>[] = [
  {
    id: 'name',
    header: 'Tên',
    cell: (m) => (
      <span className="font-medium text-foreground">
        {m.name}
        {m.monitor_type && (
          <span className="ml-2 font-mono text-[10px] uppercase text-muted-foreground">
            {m.monitor_type}
          </span>
        )}
      </span>
    ),
  },
  {
    id: 'status',
    header: 'Trạng thái',
    cell: (m) => {
      const pill = monitorPill(m);
      return <InfraStatusPill label={pill.label} tone={pill.tone} />;
    },
  },
  {
    id: 'url',
    header: 'URL',
    className: 'max-w-[20rem] truncate font-mono text-xs text-muted-foreground',
    cell: (m) =>
      m.url ? (
        <a
          href={m.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="hover:text-gold hover:underline"
        >
          {m.url}
        </a>
      ) : (
        '—'
      ),
  },
  {
    id: 'response',
    header: 'Phản hồi',
    className: 'text-right tabular-nums text-muted-foreground',
    cell: (m) => fmtMs(m.response_time_ms),
  },
  {
    id: 'ssl',
    header: 'SSL',
    className: 'text-right tabular-nums',
    cell: (m) => fmtSsl(m.ssl_expiration),
  },
  {
    id: 'last',
    header: 'Kiểm gần nhất',
    className: 'whitespace-nowrap text-xs text-muted-foreground',
    cell: (m) => fmtTime(m.last_checked_at),
  },
];

export default function InfraUptimePage() {
  const query = useQuery({
    queryKey: ['infra', 'uptime'],
    queryFn: getInfraUptime,
    staleTime: 30_000,
  });

  const [openId, setOpenId] = React.useState<string | null>(null);

  const summary: InfraUptimeSummary | undefined =
    query.data?.ok ? query.data.summary : undefined;
  const incidents: InfraUptimeIncident[] =
    query.data?.ok && Array.isArray(query.data.incidents) ? query.data.incidents : [];

  return (
    <>
    <UptimeMonitorDrawer
      monitorId={openId}
      open={openId !== null}
      onClose={() => setOpenId(null)}
    />
    <InfraPanel<InfraUptimeItem>
      tool={tool}
      query={query}
      emptyTitle="Chưa có monitor nào"
      renderTable={(items) => (
        <div className="space-y-6">
          {summary && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="Tổng" value={fmtNum(summary.total)} />
              <StatCard label="Đang chạy" value={fmtNum(summary.up)} />
              <StatCard
                label="Đang lỗi"
                value={fmtNum(summary.down)}
                className={
                  summary.down > 0
                    ? 'border-red-400/40 bg-red-500/5 hover:border-red-400/60'
                    : undefined
                }
              />
              <StatCard label="Tạm dừng" value={fmtNum(summary.paused)} />
            </div>
          )}

          <AdminTable
            rows={items}
            columns={MONITOR_COLUMNS}
            getRowId={(m) => m.id}
            onRowClick={(m) => setOpenId(m.id)}
            caption="Danh sách monitor uptime"
          />

          <Card>
            <CardContent className="p-4">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Sự cố gần đây
              </p>
              {incidents.length === 0 ? (
                <p className="text-sm text-muted-foreground">Không có sự cố gần đây.</p>
              ) : (
                <ul className="space-y-2">
                  {incidents.map((inc) => (
                    <li
                      key={inc.id}
                      className="flex items-start justify-between gap-4 rounded-md border border-border/60 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">{inc.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Bắt đầu {fmtTime(inc.started_at)}
                          {inc.resolved_at ? ` · Đã xử lý ${fmtTime(inc.resolved_at)}` : ''}
                        </p>
                      </div>
                      <InfraStatusPill
                        label={inc.resolved_at ? 'đã xử lý' : 'đang diễn ra'}
                        tone={incidentTone(inc)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    />
    </>
  );
}
