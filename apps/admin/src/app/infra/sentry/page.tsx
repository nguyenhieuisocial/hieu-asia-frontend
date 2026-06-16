'use client';

/**
 * Hạ tầng → Sentry — top-issues summary + recent unresolved issues.
 *
 * Data: GET /api/admin-proxy/admin/infra/sentry → worker `handleSentry`
 * (sentry.io issues API, is:unresolved, sorted by frequency). State handling
 * lives in <InfraPanel>; this page renders the top-issues StatCard strip
 * (`summary`) and the issues table, deep-linking each row to its permalink.
 */

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@hieu-asia/ui';
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

export default function InfraSentryPage() {
  const query = useQuery({
    queryKey: ['infra', 'sentry'],
    queryFn: getInfraSentry,
    staleTime: 30_000,
  });

  const summary: InfraSentrySummary | undefined =
    query.data?.ok ? query.data.summary : undefined;

  return (
    <InfraPanel<InfraSentryItem>
      tool={tool}
      query={query}
      emptyTitle="Không có lỗi chưa xử lý"
      renderTable={(items) => (
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

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-2.5">Mức</th>
                      <th className="px-4 py-2.5">Lỗi</th>
                      <th className="px-4 py-2.5 text-right">Số lần</th>
                      <th className="px-4 py-2.5 text-right">Người dùng</th>
                      <th className="px-4 py-2.5">Gần nhất</th>
                      <th className="px-4 py-2.5 text-right">Mở</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((i) => (
                      <tr
                        key={i.id}
                        className="border-b border-border/50 last:border-0 hover:bg-gold/5"
                      >
                        <td className="px-4 py-2.5">
                          <InfraStatusPill label={i.level} tone={levelTone(i.level)} />
                        </td>
                        <td className="max-w-[26rem] px-4 py-2.5">
                          <div className="truncate font-medium text-foreground">
                            {i.title}
                          </div>
                          {i.culprit && (
                            <div className="truncate font-mono text-xs text-muted-foreground">
                              {i.culprit}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums">{i.count}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                          {i.userCount}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2.5 text-muted-foreground">
                          {formatRelativeOrEmpty(i.lastSeen) || '—'}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          {i.permalink ? (
                            <a
                              href={i.permalink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-gold hover:underline"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    />
  );
}
