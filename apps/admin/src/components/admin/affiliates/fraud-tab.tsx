'use client';

/**
 * Wave 60.62.T1.2 — extracted from /affiliates/fraud/page.tsx.
 *
 * Admin fraud report. Lists active flags + history of cleared. Admin can
 * clear individual flags via /api/admin/affiliates/{code}/clear-flag.
 */

import * as React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button, Card, CardContent, CardHeader, CardTitle, StatusBadge, toast } from '@hieu-asia/ui';
import { EmptyState } from '@/components/admin/empty-state';
import { AdminTable, type AdminTableColumn } from '@/components/admin/table/AdminTable';
import { fmtDateTime } from '@/lib/format';

// Recharts lazy-loaded — out of the initial admin bundle (tasks page pattern).
const FraudReasonChart = dynamic(
  () => import('@/components/affiliates/FraudReasonChart').then((m) => m.FraudReasonChart),
  {
    ssr: false,
    loading: () => <div className="h-56 animate-pulse rounded bg-muted/30" aria-hidden />,
  },
);

interface FraudFlag {
  code: string;
  affiliate_id: string;
  reason: 'ip_duplicate' | 'self_referral' | 'velocity' | 'manual';
  detail: string;
  flagged_at: string;
  cleared_at?: string;
  cleared_by?: string;
}

interface Resp {
  ok: true;
  flags: FraudFlag[];
  active_count: number;
}

const REASON_LABEL: Record<FraudFlag['reason'], string> = {
  ip_duplicate: 'Trùng IP',
  self_referral: 'Self-referral',
  velocity: 'Velocity',
  manual: 'Admin manual',
};

const REASON_STATUS: Record<
  FraudFlag['reason'],
  'success' | 'warning' | 'error' | 'info' | 'neutral'
> = {
  ip_duplicate: 'warning',
  self_referral: 'error',
  velocity: 'warning',
  manual: 'neutral',
};

export function FraudTab() {
  const [data, setData] = React.useState<Resp | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [clearing, setClearing] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setError(null);
    try {
      const r = await fetch('/api/admin/affiliates/fraud-report', { cache: 'no-store' });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
      setData(d);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  async function clearFlag(code: string) {
    if (!confirm(`Clear flag cho ${code}?`)) return;
    setClearing(code);
    try {
      const r = await fetch(`/api/admin/affiliates/${code}/clear-flag`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ cleared_by: 'admin-ui' }),
      });
      const d = await r.json();
      if (!d.ok) throw new Error(d.error ?? 'Clear flag thất bại');
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setClearing(null);
    }
  }

  const active = data?.flags.filter((f) => !f.cleared_at) ?? [];
  const cleared = data?.flags.filter((f) => f.cleared_at) ?? [];

  const clearedColumns: AdminTableColumn<FraudFlag>[] = [
    { id: 'code', header: 'Mã', cell: (f) => <span className="font-mono text-gold">{f.code}</span> },
    { id: 'reason', header: 'Lý do', cell: (f) => REASON_LABEL[f.reason] },
    {
      id: 'detail',
      header: 'Chi tiết',
      cell: (f) => <span className="text-muted-foreground">{f.detail}</span>,
    },
    {
      id: 'flagged_at',
      header: 'Gắn cờ lúc',
      cell: (f) => <span className="text-muted-foreground">{fmtDateTime(f.flagged_at)}</span>,
    },
    {
      id: 'cleared_at',
      header: 'Gỡ cờ lúc',
      cell: (f) => (
        <span className="text-muted-foreground">
          {f.cleared_at ? fmtDateTime(f.cleared_at) : '—'}
        </span>
      ),
    },
    {
      id: 'cleared_by',
      header: 'Bởi',
      cell: (f) => <span className="text-muted-foreground">{f.cleared_by ?? '—'}</span>,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {data
            ? `${data.active_count} flag đang active · ${cleared.length} đã clear`
            : 'Đang tải…'}
        </p>
        <Button onClick={load}>Làm mới</Button>
      </div>

      {error && <p className="text-sm text-red-700 dark:text-red-300">{error}</p>}

      {data && data.flags.length > 0 && <FraudReasonChart flags={data.flags} />}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Đang active ({active.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {active.length === 0 ? (
            <EmptyState compact title="Không có flag nào." />
          ) : (
            <div className="space-y-2">
              {active.map((f) => (
                <div
                  key={`${f.code}-${f.flagged_at}`}
                  className="rounded border border-red-500/30 bg-red-500/5 p-3 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/affiliates/${f.affiliate_id}`}
                      className="font-mono text-gold hover:underline"
                    >
                      {f.code}
                    </Link>
                    <StatusBadge status={REASON_STATUS[f.reason]} label={REASON_LABEL[f.reason]} />
                  </div>
                  <div className="mt-1 text-foreground/85">{f.detail}</div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Gắn cờ: {fmtDateTime(f.flagged_at)}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="border border-border"
                      onClick={() => clearFlag(f.code)}
                      disabled={clearing === f.code}
                    >
                      {clearing === f.code ? 'Đang clear…' : 'Clear flag'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Đã clear ({cleared.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {cleared.length === 0 ? (
            <EmptyState compact title="Chưa có flag nào được clear." />
          ) : (
            <AdminTable
              rows={cleared}
              columns={clearedColumns}
              getRowId={(f) => `${f.code}-${f.flagged_at}`}
              caption="Lịch sử flag đã clear"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
