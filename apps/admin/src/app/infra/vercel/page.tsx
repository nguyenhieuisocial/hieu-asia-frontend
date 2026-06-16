'use client';

/**
 * Hạ tầng → Vercel — recent deployments of web/admin.
 *
 * Data: GET /api/admin-proxy/admin/infra/vercel → worker `handleVercel`
 * (api.vercel.com/v6/deployments). All state handling lives in <InfraPanel>;
 * this page only declares the deployment table columns.
 *
 * TEMPLATE for follow-up tools: copy this file, swap `getInfraVercel` +
 * `getInfraTool('vercel')` for your tool's wrapper/slug, and rewrite the
 * `renderTable` columns. Nothing else changes.
 */

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@hieu-asia/ui';
import { ExternalLink } from 'lucide-react';
import { getInfraVercel, type InfraVercelItem } from '@/lib/admin-api';
import { getInfraTool } from '@/lib/infra-tools';
import { formatDateOrEmpty, formatRelativeOrEmpty } from '@/lib/format-date';
import { InfraPanel, InfraStatusPill } from '@/components/admin/infra/infra-panel';

const tool = getInfraTool('vercel')!;

function stateTone(state: string | null): 'good' | 'bad' | 'warn' | 'neutral' {
  switch ((state ?? '').toUpperCase()) {
    case 'READY':
      return 'good';
    case 'ERROR':
    case 'CANCELED':
      return 'bad';
    case 'BUILDING':
    case 'QUEUED':
    case 'INITIALIZING':
      return 'warn';
    default:
      return 'neutral';
  }
}

export default function InfraVercelPage() {
  const query = useQuery({
    queryKey: ['infra', 'vercel'],
    queryFn: getInfraVercel,
    staleTime: 30_000,
  });

  return (
    <InfraPanel<InfraVercelItem>
      tool={tool}
      query={query}
      emptyTitle="Chưa có deploy gần đây"
      renderTable={(items) => (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-2.5">Trạng thái</th>
                    <th className="px-4 py-2.5">Môi trường</th>
                    <th className="px-4 py-2.5">Commit</th>
                    <th className="px-4 py-2.5">Thời gian</th>
                    <th className="px-4 py-2.5 text-right">Mở</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((d) => (
                    <tr
                      key={d.uid}
                      className="border-b border-border/50 last:border-0 hover:bg-gold/5"
                    >
                      <td className="px-4 py-2.5">
                        <InfraStatusPill
                          label={d.state ?? '—'}
                          tone={stateTone(d.state)}
                        />
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {d.target ?? '—'}
                      </td>
                      <td className="max-w-[28rem] truncate px-4 py-2.5">
                        {d.commit_message ?? <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-muted-foreground">
                        {formatDateOrEmpty(d.created)}
                        {formatRelativeOrEmpty(d.created) && (
                          <span className="ml-1.5 text-xs opacity-70">
                            · {formatRelativeOrEmpty(d.created)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        {d.url ? (
                          <a
                            href={d.url}
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
      )}
    />
  );
}
