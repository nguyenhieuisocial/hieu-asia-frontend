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
import { ChevronDown, ChevronRight, Send } from 'lucide-react';
import {
  getInfraTelegram,
  postInfraTelegramTest,
  type InfraTelegramItem,
} from '@/lib/admin-api';
import { getInfraTool } from '@/lib/infra-tools';
import { formatRelativeOrEmpty } from '@/lib/format-date';
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

/** Small yes/no capability chip (getMe flags). */
function CapChip({ label, value }: { label: string; value: boolean | null | undefined }) {
  const tone: 'good' | 'neutral' = value ? 'good' : 'neutral';
  const tones: Record<string, string> = {
    good: 'border-jade/30 bg-jade/10 text-jade',
    neutral: 'border-border bg-muted/40 text-muted-foreground',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {label}: {value == null ? '—' : value ? 'có' : 'không'}
    </span>
  );
}

function yesNo(v: boolean | null | undefined): string {
  if (v == null) return '—';
  return v ? 'có' : 'không';
}

/** Expanded per-bot detail panel: webhook error/config, capabilities, commands. */
function BotDetailPanel({ b }: { b: InfraTelegramItem }) {
  const errorAtMs = b.last_error_date != null ? b.last_error_date * 1000 : null;
  const commands = b.commands ?? [];
  const allowed =
    b.allowed_updates && b.allowed_updates.length > 0
      ? b.allowed_updates.join(', ')
      : 'mặc định';
  return (
    <div className="space-y-4 px-4 py-3">
      {/* Webhook error */}
      {errorAtMs != null ? (
        <div className="rounded-md border border-red-400/30 bg-red-500/5 px-3 py-2 text-sm text-red-700 dark:text-red-200">
          Lỗi webhook gần nhất: {formatRelativeOrEmpty(errorAtMs) || '—'}
          {b.last_error_message ? ` — ${b.last_error_message}` : ''}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Không có lỗi webhook gần đây.</p>
      )}

      {/* Webhook config */}
      <div>
        <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Cấu hình webhook
        </p>
        <div className="grid grid-cols-1 gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
          <div className="flex justify-between gap-3 border-b border-border/40 py-1">
            <span className="text-muted-foreground">IP</span>
            <span className="font-mono text-xs text-foreground">{b.ip_address ?? '—'}</span>
          </div>
          <div className="flex justify-between gap-3 border-b border-border/40 py-1">
            <span className="text-muted-foreground">Max connections</span>
            <span className="tabular-nums text-foreground">{b.max_connections ?? '—'}</span>
          </div>
          <div className="flex justify-between gap-3 border-b border-border/40 py-1">
            <span className="text-muted-foreground">Chứng chỉ riêng</span>
            <span className="text-foreground">{yesNo(b.has_custom_certificate)}</span>
          </div>
          <div className="flex justify-between gap-3 border-b border-border/40 py-1">
            <span className="text-muted-foreground">Hàng đợi</span>
            <span className="tabular-nums text-foreground">{b.pending_updates ?? '—'}</span>
          </div>
          <div className="flex justify-between gap-3 border-b border-border/40 py-1 sm:col-span-2">
            <span className="text-muted-foreground">Allowed updates</span>
            <span className="text-right font-mono text-xs text-foreground">{allowed}</span>
          </div>
        </div>
      </div>

      {/* Capabilities (getMe) */}
      <div>
        <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Khả năng của bot
        </p>
        <div className="flex flex-wrap gap-1.5">
          <span className="inline-flex items-center rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-muted-foreground">
            ID: {b.id ?? '—'}
          </span>
          <CapChip label="Vào nhóm" value={b.can_join_groups} />
          <CapChip label="Đọc mọi tin nhóm" value={b.can_read_all_group_messages} />
          <CapChip label="Inline query" value={b.supports_inline_queries} />
        </div>
      </div>

      {/* Slash commands */}
      <div>
        <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Lệnh đã đặt
        </p>
        {commands.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa đặt lệnh nào.</p>
        ) : (
          <ul className="space-y-1">
            {commands.map((c) => (
              <li key={c.command} className="text-sm">
                <span className="font-mono text-gold">/{c.command.replace(/^\//, '')}</span>
                <span className="ml-2 text-muted-foreground">{c.description}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function InfraTelegramPage() {
  const query = useQuery({
    queryKey: ['infra', 'telegram'],
    queryFn: getInfraTelegram,
    staleTime: 30_000,
  });

  const [expanded, setExpanded] = React.useState<string | null>(null);

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
                    <th className="w-8 px-4 py-2.5" />
                    <th className="px-4 py-2.5">Trạng thái</th>
                    <th className="px-4 py-2.5">Bot</th>
                    <th className="px-4 py-2.5">Username</th>
                    <th className="px-4 py-2.5">Webhook</th>
                    <th className="px-4 py-2.5 text-right">Hàng đợi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((b) => {
                    const isOpen = expanded === b.bot;
                    return (
                      <React.Fragment key={b.bot}>
                        <tr
                          onClick={() => setExpanded(isOpen ? null : b.bot)}
                          className="cursor-pointer border-b border-border/50 last:border-0 hover:bg-gold/5"
                        >
                          <td className="px-4 py-2.5 text-muted-foreground">
                            {isOpen ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </td>
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
                        {isOpen && (
                          <tr className="border-b border-border/50 bg-muted/20 last:border-0">
                            <td colSpan={6} className="p-0">
                              <BotDetailPanel b={b} />
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    />
  );
}
