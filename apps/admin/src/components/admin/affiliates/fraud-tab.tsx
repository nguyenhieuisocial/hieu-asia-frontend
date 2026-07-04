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
import { Button, Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { EmptyState } from '@/components/admin/empty-state';
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

const REASON_TONE: Record<FraudFlag['reason'], string> = {
  ip_duplicate: 'bg-orange-500/15 text-orange-700 dark:text-orange-300',
  self_referral: 'bg-red-500/20 text-red-700 dark:text-red-300',
  velocity: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-300',
  manual: 'bg-muted/40 text-muted-foreground',
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
      alert((e as Error).message);
    } finally {
      setClearing(null);
    }
  }

  const active = data?.flags.filter((f) => !f.cleared_at) ?? [];
  const cleared = data?.flags.filter((f) => f.cleared_at) ?? [];

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
                  key={f.code}
                  className="rounded border border-red-500/30 bg-red-500/5 p-3 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/affiliates/${f.affiliate_id}`}
                      className="font-mono text-gold hover:underline"
                    >
                      {f.code}
                    </Link>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] uppercase ${REASON_TONE[f.reason]}`}
                    >
                      {REASON_LABEL[f.reason]}
                    </span>
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
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="pb-2 pr-3">Mã</th>
                    <th className="pb-2 pr-3">Lý do</th>
                    <th className="pb-2 pr-3">Chi tiết</th>
                    <th className="pb-2 pr-3">Gắn cờ lúc</th>
                    <th className="pb-2 pr-3">Gỡ cờ lúc</th>
                    <th className="pb-2">Bởi</th>
                  </tr>
                </thead>
                <tbody>
                  {cleared.map((f) => (
                    <tr key={f.code} className="border-b border-border">
                      <td className="py-1.5 pr-3 font-mono text-gold">{f.code}</td>
                      <td className="py-1.5 pr-3">{REASON_LABEL[f.reason]}</td>
                      <td className="py-1.5 pr-3 text-muted-foreground">{f.detail}</td>
                      <td className="py-1.5 pr-3 text-muted-foreground">{fmtDateTime(f.flagged_at)}</td>
                      <td className="py-1.5 pr-3 text-muted-foreground">
                        {f.cleared_at ? fmtDateTime(f.cleared_at) : '—'}
                      </td>
                      <td className="py-1.5 text-muted-foreground">{f.cleared_by ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
