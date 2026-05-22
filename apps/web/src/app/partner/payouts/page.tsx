'use client';

/**
 * /partner/payouts — own payout history.
 *
 * Wave 44. RLS scopes to user's affiliate_code. Filter: pending vs paid.
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Skeleton, StatusBadge } from '@hieu-asia/ui';
import { PartnerShell, partnerFetch } from '@/components/partner/PartnerShell';

interface PayoutRow {
  id: string;
  affiliate_code: string;
  amount_vnd: number;
  method: string | null;
  destination: string | null;
  status: string;
  reference: string | null;
  batch_id: string | null;
  paid_at: string | null;
  requested_at: string;
}

interface PayoutsResp {
  ok: true;
  payouts: PayoutRow[];
}

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

function payoutTone(p: PayoutRow): 'success' | 'warning' | 'neutral' {
  if (p.paid_at) return 'success';
  if (p.status === 'pending') return 'warning';
  return 'neutral';
}

export default function PartnerPayoutsPage() {
  return <PartnerShell>{() => <PayoutsView />}</PartnerShell>;
}

function PayoutsView() {
  const [data, setData] = React.useState<PayoutsResp | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<'all' | 'pending' | 'paid'>('all');

  React.useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(null);
    async function load() {
      try {
        const url = filter === 'all' ? '/api/partner/payouts' : `/api/partner/payouts?status=${filter}`;
        const r = await partnerFetch<PayoutsResp>(url);
        if (!cancelled) setData(r);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [filter]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lịch sử payout</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          {(['all', 'pending', 'paid'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={
                'rounded-md border px-3 py-1.5 text-xs transition-colors ' +
                (filter === f
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-foreground/15 text-foreground/70 hover:bg-foreground/5')
              }
            >
              {f === 'all' ? 'Tất cả' : f === 'pending' ? 'Đang chờ' : 'Đã thanh toán'}
            </button>
          ))}
        </div>

        {error ? (
          <p className="text-sm text-red-500">Lỗi: {error}</p>
        ) : !data ? (
          <Skeleton className="h-64 w-full" />
        ) : data.payouts.length === 0 ? (
          <p className="py-8 text-center text-sm text-foreground/70">Chưa có payout nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-foreground/10 text-left text-xs uppercase tracking-wider text-foreground/60">
                <tr>
                  <th className="py-2 pr-3">Số tiền</th>
                  <th className="py-2 pr-3">Phương thức</th>
                  <th className="py-2 pr-3">Batch</th>
                  <th className="py-2 pr-3">Trạng thái</th>
                  <th className="py-2 pr-3">Yêu cầu</th>
                  <th className="py-2 pr-3">Thanh toán</th>
                  <th className="py-2 pr-3">Tham chiếu</th>
                </tr>
              </thead>
              <tbody>
                {data.payouts.map((p) => (
                  <tr key={p.id} className="border-b border-foreground/5">
                    <td className="py-2 pr-3 font-medium">{vnd(p.amount_vnd)}</td>
                    <td className="py-2 pr-3 text-foreground/80">{p.method ?? '—'}</td>
                    <td className="py-2 pr-3 font-mono text-xs text-foreground/70">
                      {p.batch_id ? p.batch_id.slice(0, 8) + '…' : '—'}
                    </td>
                    <td className="py-2 pr-3">
                      <StatusBadge
                        status={payoutTone(p)}
                        label={p.paid_at ? 'paid' : p.status}
                      />
                    </td>
                    <td className="py-2 pr-3 text-foreground/70">{dt(p.requested_at)}</td>
                    <td className="py-2 pr-3 text-foreground/70">{dt(p.paid_at)}</td>
                    <td className="py-2 pr-3 font-mono text-xs text-foreground/70">
                      {p.reference ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
