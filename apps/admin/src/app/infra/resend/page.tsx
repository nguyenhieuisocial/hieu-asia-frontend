'use client';

/**
 * Hạ tầng → Resend — recent emails.
 *
 * Data: GET /api/admin-proxy/admin/infra/resend → worker `handleResend`
 * (api.resend.com/emails). State handling lives in <InfraPanel>; this page
 * declares the email table columns. `last_event` summarises delivery state.
 */

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@hieu-asia/ui';
import { getInfraResend, type InfraResendItem } from '@/lib/admin-api';
import { getInfraTool } from '@/lib/infra-tools';
import { formatDateOrEmpty, formatRelativeOrEmpty } from '@/lib/format-date';
import { InfraPanel, InfraStatusPill } from '@/components/admin/infra/infra-panel';

const tool = getInfraTool('resend')!;

function eventTone(event: string | null): 'good' | 'bad' | 'warn' | 'neutral' {
  switch ((event ?? '').toLowerCase()) {
    case 'delivered':
      return 'good';
    case 'bounced':
    case 'complained':
    case 'failed':
      return 'bad';
    case 'delivery_delayed':
    case 'queued':
      return 'warn';
    default:
      return 'neutral';
  }
}

export default function InfraResendPage() {
  const query = useQuery({
    queryKey: ['infra', 'resend'],
    queryFn: getInfraResend,
    staleTime: 30_000,
  });

  return (
    <InfraPanel<InfraResendItem>
      tool={tool}
      query={query}
      emptyTitle="Chưa có email gần đây"
      renderTable={(items) => (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-2.5">Trạng thái</th>
                    <th className="px-4 py-2.5">Người nhận</th>
                    <th className="px-4 py-2.5">Tiêu đề</th>
                    <th className="px-4 py-2.5">Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((e) => (
                    <tr
                      key={e.id}
                      className="border-b border-border/50 last:border-0 hover:bg-gold/5"
                    >
                      <td className="px-4 py-2.5">
                        <InfraStatusPill
                          label={e.last_event ?? '—'}
                          tone={eventTone(e.last_event)}
                        />
                      </td>
                      <td className="max-w-[18rem] truncate px-4 py-2.5 text-muted-foreground">
                        {e.to ?? '—'}
                      </td>
                      <td className="max-w-[24rem] truncate px-4 py-2.5">
                        {e.subject ?? <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-muted-foreground">
                        {formatDateOrEmpty(e.created_at)}
                        {formatRelativeOrEmpty(e.created_at) && (
                          <span className="ml-1.5 text-xs opacity-70">
                            · {formatRelativeOrEmpty(e.created_at)}
                          </span>
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
