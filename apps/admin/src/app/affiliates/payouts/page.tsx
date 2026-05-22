/**
 * /admin/affiliates/payouts — Wave 43.2 (view-only)
 *
 * Reads hieu_asia.affiliate_payouts. Creation lands in Wave 45.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, CardContent } from '@hieu-asia/ui';

interface Payout {
  id: number;
  affiliate_code: string;
  period: string;
  amount_vnd: number;
  paid_at: string | null;
  method: string | null;
  reference: string | null;
  batch_id: string | null;
}

type StatusFilter = 'all' | 'pending' | 'paid';

function vnd(n: number) {
  return n.toLocaleString('vi-VN') + 'đ';
}
function dt(iso: string | null) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

async function fetchPayouts(status: StatusFilter): Promise<Payout[]> {
  const qs = status === 'all' ? '' : `?status=${status}`;
  const r = await fetch(`/api/admin/affiliates/payouts-ledger${qs}`, { cache: 'no-store' });
  const d = await r.json();
  if (!r.ok || !d.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
  return d.payouts as Payout[];
}

export default function AdminPayoutsLedgerPage() {
  const [status, setStatus] = React.useState<StatusFilter>('all');

  const q = useQuery({
    queryKey: ['affiliate-payouts-ledger', status],
    queryFn: () => fetchPayouts(status),
    refetchInterval: 60_000,
  });

  return (
    <div className="space-y-4">
      <header>
        <Link href="/affiliates" className="text-sm text-muted-foreground hover:text-gold">
          ← Affiliates
        </Link>
        <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          Payouts ledger
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Postgres-side affiliate_payouts. Tạo payout từ batch (Wave 45).
        </p>
      </header>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-2 pt-6">
          {(['all', 'pending', 'paid'] as const).map((s) => (
            <Button
              key={s}
              size="sm"
              variant={status === s ? 'default' : 'ghost'}
              onClick={() => setStatus(s)}
              className={status === s ? '' : 'border border-border'}
            >
              {s}
            </Button>
          ))}
          <div className="ml-auto text-sm text-muted-foreground">
            {q.data?.length ?? 0} dòng
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="overflow-x-auto pt-6">
          {q.isLoading ? (
            <p className="text-sm text-muted-foreground">Đang tải…</p>
          ) : q.error ? (
            <p className="text-sm text-red-300">{(q.error as Error).message}</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="pb-2 pr-3">ID</th>
                  <th className="pb-2 pr-3">Code</th>
                  <th className="pb-2 pr-3">Period</th>
                  <th className="pb-2 pr-3 text-right">Số tiền</th>
                  <th className="pb-2 pr-3">Method</th>
                  <th className="pb-2 pr-3">Batch</th>
                  <th className="pb-2 pr-3">Paid at</th>
                  <th className="pb-2">Reference</th>
                </tr>
              </thead>
              <tbody>
                {(q.data ?? []).map((p) => (
                  <tr key={p.id} className="border-b border-border hover:bg-muted/30">
                    <td className="py-2 pr-3 font-mono text-xs text-muted-foreground">{p.id}</td>
                    <td className="py-2 pr-3 font-mono text-gold">{p.affiliate_code}</td>
                    <td className="py-2 pr-3">{p.period}</td>
                    <td className="py-2 pr-3 text-right font-mono text-gold">
                      {vnd(p.amount_vnd)}
                    </td>
                    <td className="py-2 pr-3">{p.method ?? '—'}</td>
                    <td className="py-2 pr-3">
                      {p.batch_id ? (
                        <Link
                          href={`/affiliates/batches?id=${p.batch_id}`}
                          className="font-mono text-xs text-gold hover:underline"
                        >
                          {p.batch_id.slice(0, 8)}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-2 pr-3 text-xs text-muted-foreground">{dt(p.paid_at)}</td>
                    <td className="py-2 font-mono text-xs">{p.reference ?? '—'}</td>
                  </tr>
                ))}
                {q.data && q.data.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-muted-foreground">
                      Chưa có payout nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
