'use client';

/**
 * Hạ tầng → Sentry — top-issues summary + recent unresolved issues.
 *
 * Data: GET /api/admin-proxy/admin/infra/sentry → worker `handleSentry`
 * (sentry.io issues API, is:unresolved, sorted by frequency). State handling
 * lives in <InfraPanel>; this page renders the top-issues StatCard strip
 * (`summary`) and the issues table, deep-linking each row to its permalink.
 */

import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ExternalLink } from 'lucide-react';
import {
  getInfraSentry,
  type InfraSentryItem,
  type InfraSentrySummary,
} from '@/lib/admin-api';
import { getInfraTool } from '@/lib/infra-tools';
import { formatRelativeOrEmpty } from '@/lib/format-date';
import { StatCard } from '@/components/stat-card';
import { InfraPanel, InfraStatusPill } from '@/components/admin/infra/infra-panel';
import { SentryIssueDrawer } from '@/components/admin/infra/SentryIssueDrawer';
import { MiniSparkline } from '@/components/admin/infra/MiniSparkline';
import { AdminTable, type AdminTableColumn } from '@/components/admin/table/AdminTable';

const tool = getInfraTool('sentry')!;

function levelTone(level: string): 'good' | 'bad' | 'warn' | 'neutral' {
  switch (level.toLowerCase()) {
    case 'fatal':
    case 'error':
      return 'bad';
    case 'warning':
      return 'warn';
    case 'info':
    case 'debug':
      return 'neutral';
    default:
      return 'neutral';
  }
}

function fmtNum(n: number): string {
  return n.toLocaleString('vi-VN');
}

const ISSUE_COLUMNS: AdminTableColumn<InfraSentryItem>[] = [
  {
    id: 'level',
    header: 'Mức',
    cell: (i) => <InfraStatusPill label={i.level} tone={levelTone(i.level)} />,
  },
  {
    id: 'title',
    header: 'Lỗi',
    className: 'max-w-[26rem]',
    cell: (i) => (
      <>
        <div className="flex items-center gap-1.5">
          <span className="truncate font-medium text-foreground">{i.title}</span>
          {i.is_new_24h && (
            <span className="shrink-0 rounded bg-jade/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-jade-700 dark:text-jade-50">
              mới 24h
            </span>
          )}
        </div>
        {i.culprit && (
          <div className="truncate font-mono text-xs text-muted-foreground">{i.culprit}</div>
        )}
      </>
    ),
  },
  {
    id: 'count',
    header: 'Số lần',
    className: 'text-right tabular-nums',
    cell: (i) => i.count,
  },
  {
    id: 'userCount',
    header: 'Người dùng',
    className: 'text-right tabular-nums text-muted-foreground',
    cell: (i) => i.userCount,
  },
  {
    id: 'spark',
    header: '24h',
    cell: (i) =>
      i.spark_24h && i.spark_24h.length > 1 ? (
        <MiniSparkline data={i.spark_24h} ariaLabel="Lưu lượng lỗi 24h" />
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    id: 'lastSeen',
    header: 'Gần nhất',
    className: 'whitespace-nowrap text-muted-foreground',
    cell: (i) => formatRelativeOrEmpty(i.lastSeen) || '—',
  },
  {
    id: 'open',
    header: 'Mở',
    className: 'text-right',
    cell: (i) =>
      i.permalink ? (
        <a
          href={i.permalink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-gold hover:underline"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
];

export default function InfraSentryPage() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['infra', 'sentry'],
    queryFn: getInfraSentry,
    staleTime: 30_000,
  });

  const [openId, setOpenId] = React.useState<string | null>(null);
  // Client-side segment over the already-loaded rows (no refetch).
  const [levelFilter, setLevelFilter] = React.useState<'all' | 'fatal' | 'error' | 'warning'>(
    'all',
  );
  const [ageFilter, setAgeFilter] = React.useState<'all' | 'new' | 'recurring'>('all');

  const summary: InfraSentrySummary | undefined =
    query.data?.ok ? query.data.summary : undefined;

  return (
    <>
    <SentryIssueDrawer
      issueId={openId}
      open={openId !== null}
      onClose={() => setOpenId(null)}
      onResolved={() => queryClient.invalidateQueries({ queryKey: ['infra', 'sentry'] })}
    />
    <InfraPanel<InfraSentryItem>
      tool={tool}
      query={query}
      emptyTitle="Không có lỗi chưa xử lý"
      renderTable={(items) => {
        const filtered = items.filter((i) => {
          const lvl = (i.level ?? '').toLowerCase();
          if (levelFilter !== 'all' && lvl !== levelFilter) return false;
          if (ageFilter === 'new' && !i.is_new_24h) return false;
          if (ageFilter === 'recurring' && i.is_new_24h) return false;
          return true;
        });
        return (
        <div className="space-y-6">
          {summary && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {summary.errors_24h != null && (
                <StatCard label="Lỗi 24h" value={fmtNum(summary.errors_24h)} />
              )}
              {summary.unresolved_count != null && (
                <StatCard label="Chưa xử lý" value={fmtNum(summary.unresolved_count)} />
              )}
              {summary.fatal_count != null && (
                <StatCard
                  label="Nghiêm trọng (fatal)"
                  value={fmtNum(summary.fatal_count)}
                  className={
                    summary.fatal_count > 0
                      ? 'border-red-400/40 bg-red-500/5 hover:border-red-400/60'
                      : undefined
                  }
                />
              )}
              {summary.top_issue != null && (
                <StatCard
                  label="Lỗi nhiều nhất"
                  value={
                    <span className="block truncate text-base font-semibold sm:text-lg">
                      {summary.top_issue.title}
                    </span>
                  }
                  hint={`${fmtNum(summary.top_issue.count)} lần`}
                />
              )}
            </div>
          )}

          {/* Client-side segment over the loaded rows */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-mono uppercase tracking-wide text-muted-foreground">Mức:</span>
              {(['all', 'fatal', 'error', 'warning'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setLevelFilter(v)}
                  className={
                    'rounded px-2 py-0.5 font-mono uppercase tracking-wide transition-colors ' +
                    (levelFilter === v
                      ? 'bg-gold/15 text-gold'
                      : 'text-muted-foreground hover:text-foreground')
                  }
                >
                  {v === 'all' ? 'Tất cả' : v}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono uppercase tracking-wide text-muted-foreground">Tuổi:</span>
              {(
                [
                  ['all', 'Tất cả'],
                  ['new', 'Mới 24h'],
                  ['recurring', 'Lặp lại'],
                ] as const
              ).map(([v, label]) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setAgeFilter(v)}
                  className={
                    'rounded px-2 py-0.5 font-mono uppercase tracking-wide transition-colors ' +
                    (ageFilter === v
                      ? 'bg-gold/15 text-gold'
                      : 'text-muted-foreground hover:text-foreground')
                  }
                >
                  {label}
                </button>
              ))}
            </div>
            <span className="text-muted-foreground">
              {filtered.length}/{items.length} lỗi
            </span>
          </div>

          <AdminTable
            rows={filtered}
            columns={ISSUE_COLUMNS}
            getRowId={(i) => i.id}
            onRowClick={(i) => setOpenId(i.id)}
            caption="Danh sách lỗi Sentry chưa xử lý"
          />
        </div>
        );
      }}
    />
    </>
  );
}
