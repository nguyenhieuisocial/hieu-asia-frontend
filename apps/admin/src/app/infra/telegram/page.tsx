'use client';

/**
 * Hạ tầng → Telegram — per-bot webhook status.
 *
 * Data: GET /api/admin-proxy/admin/infra/telegram → worker `handleTelegram`
 * (getWebhookInfo per bot). State handling lives in <InfraPanel>; this page
 * declares the per-bot columns (bot, username, trạng thái, webhook, hàng đợi).
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, CardContent, toast } from '@hieu-asia/ui';
import { Send } from 'lucide-react';
import {
  getInfraTelegram,
  postInfraTelegramTest,
  type InfraTelegramItem,
} from '@/lib/admin-api';
import { getInfraTool } from '@/lib/infra-tools';
import { InfraPanel, InfraStatusPill } from '@/components/admin/infra/infra-panel';

const tool = getInfraTool('telegram')!;

/** Header action: send a test message via Telegram, toast the result. */
function SendTestMessageButton() {
  const [pending, setPending] = React.useState(false);
  const click = React.useCallback(async () => {
    if (pending) return;
    if (!window.confirm('Gửi một tin thử tới nhóm chat admin cố định?')) return;
    setPending(true);
    const res = await postInfraTelegramTest();
    setPending(false);
    if (res.ok) {
      const chat = typeof res.sent_to_chat === 'string' ? res.sent_to_chat : null;
      toast.success(chat ? `Đã gửi tới ${chat}` : 'Đã gửi tin thử.');
      return;
    }
    toast.error(res.error ?? 'Không gửi được tin thử.');
  }, [pending]);
  return (
    <Button variant="outline" size="sm" onClick={click} disabled={pending}>
      <Send className="mr-1.5 h-3.5 w-3.5" />
      {pending ? 'Đang gửi…' : 'Gửi tin thử'}
    </Button>
  );
}

function statusTone(status: string | null): 'good' | 'bad' | 'warn' | 'neutral' {
  switch ((status ?? '').toLowerCase()) {
    case 'ok':
    case 'active':
    case 'online':
      return 'good';
    case 'error':
    case 'down':
    case 'offline':
      return 'bad';
    case 'pending':
      return 'warn';
    default:
      return 'neutral';
  }
}

export default function InfraTelegramPage() {
  const query = useQuery({
    queryKey: ['infra', 'telegram'],
    queryFn: getInfraTelegram,
    staleTime: 30_000,
  });

  return (
    <InfraPanel<InfraTelegramItem>
      tool={tool}
      query={query}
      emptyTitle="Chưa có bot nào"
      headerActions={<SendTestMessageButton />}
      renderTable={(items) => (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-2.5">Trạng thái</th>
                    <th className="px-4 py-2.5">Bot</th>
                    <th className="px-4 py-2.5">Username</th>
                    <th className="px-4 py-2.5">Webhook</th>
                    <th className="px-4 py-2.5 text-right">Hàng đợi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((b) => (
                    <tr
                      key={b.bot}
                      className="border-b border-border/50 last:border-0 hover:bg-gold/5"
                    >
                      <td className="px-4 py-2.5">
                        <InfraStatusPill
                          label={b.status ?? '—'}
                          tone={statusTone(b.status)}
                        />
                      </td>
                      <td className="px-4 py-2.5 font-medium text-foreground">
                        {b.bot}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-muted-foreground">
                        {b.username ? `@${b.username.replace(/^@/, '')}` : '—'}
                      </td>
                      <td className="max-w-[24rem] truncate px-4 py-2.5 font-mono text-xs text-muted-foreground">
                        {b.webhook_url ?? '—'}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                        {b.pending_updates ?? '—'}
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
