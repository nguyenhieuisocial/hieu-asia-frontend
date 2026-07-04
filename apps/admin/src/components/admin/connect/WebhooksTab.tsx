'use client';

/**
 * Wave 60.81.D — Webhook deliveries tab for /connect.
 *
 * Queries gateway /admin/integrations/webhooks (which doesn't exist yet —
 * UI shows a "chưa wire" note when the proxy 404s, same pattern as the
 * old /connect health-check section). When the worker route lands the
 * UI will populate automatically.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import { ErrorBlock } from '@/components/admin/error-block';
import { EmptyState } from '@/components/admin/empty-state';
import {
  AdminTable,
  type AdminTableColumn,
} from '@/components/admin/table/AdminTable';

interface WebhookDelivery {
  id: string;
  vendor: string;
  event: string;
  status: 'ok' | 'failed' | 'retry';
  http_code: number | null;
  attempted_at: string;
}

interface WebhooksResp {
  ok?: boolean;
  deliveries?: WebhookDelivery[];
  error?: string;
  note?: string;
}

async function fetchDeliveries(): Promise<WebhooksResp> {
  const r = await fetch('/api/admin/integrations/webhooks', {
    cache: 'no-store',
  });
  if (r.status === 404) {
    return { ok: false, note: 'Webhook log chưa wire ở worker.' };
  }
  const text = await r.text();
  try {
    return JSON.parse(text) as WebhooksResp;
  } catch {
    return { ok: false, error: `Invalid JSON (status ${r.status})` };
  }
}

const COLUMNS: AdminTableColumn<WebhookDelivery>[] = [
  {
    id: 'attempted_at',
    header: 'Khi',
    sortKey: 'attempted_at',
    width: '160px',
    cell: (r) => (
      <span className="font-mono text-xs text-muted-foreground">
        {r.attempted_at}
      </span>
    ),
  },
  {
    id: 'vendor',
    header: 'Nhà cung cấp',
    sortKey: 'vendor',
    width: '140px',
    cell: (r) => <span className="text-foreground/85">{r.vendor}</span>,
  },
  {
    id: 'event',
    header: 'Sự kiện',
    cell: (r) => (
      <span className="font-mono text-xs text-muted-foreground">{r.event}</span>
    ),
  },
  {
    id: 'status',
    header: 'Trạng thái',
    sortKey: 'status',
    width: '100px',
    cell: (r) => {
      const cls =
        r.status === 'ok'
          ? 'text-jade-700 dark:text-jade-50 bg-jade/10 border-jade/30'
          : r.status === 'retry'
            ? 'text-amber-700 dark:text-amber-200 bg-amber-500/10 border-amber-500/30'
            : 'text-red-700 dark:text-red-200 bg-red-500/10 border-red-500/30';
      return (
        <span
          className={`inline-flex rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${cls}`}
        >
          {r.status}
        </span>
      );
    },
  },
  {
    id: 'http_code',
    header: 'HTTP',
    width: '70px',
    hideOnMobile: true,
    className: 'text-right tabular-nums',
    cell: (r) => (
      <span className="font-mono text-xs text-muted-foreground">
        {r.http_code ?? '—'}
      </span>
    ),
  },
];

export function WebhooksTab() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'connect', 'webhooks'],
    queryFn: fetchDeliveries,
    staleTime: 60_000,
  });

  const rows = React.useMemo(
    () => (Array.isArray(data?.deliveries) ? data.deliveries : []),
    [data?.deliveries],
  );

  const showError = !!error || (data?.ok === false && !data?.note);
  const errorMsg = (error as Error | undefined)?.message ?? data?.error;

  const onRetry = React.useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Webhook deliveries</CardTitle>
        <CardDescription>
          Lịch sử các webhook delivery từ vendor (SePay, Stripe, Resend…).
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showError && (
          <div className="mb-4">
            <ErrorBlock
              compact
              message={errorMsg ?? 'Không tải được webhook log.'}
              onRetry={onRetry}
            />
          </div>
        )}
        {data?.note && !showError && (
          <div className="mb-4 rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-muted-foreground">
            {data.note}
          </div>
        )}
        <AdminTable<WebhookDelivery>
          rows={rows}
          columns={COLUMNS}
          loading={isLoading}
          caption="Webhook deliveries"
          empty={
            <EmptyState
              title="Chưa có webhook delivery"
              description="Khi vendor gửi webhook đầu tiên, dòng sẽ hiện ở đây."
              className="border-0 bg-transparent"
            />
          }
        />
      </CardContent>
    </Card>
  );
}
