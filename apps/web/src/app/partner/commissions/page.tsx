'use client';

/**
 * /partner/commissions — own commission ledger.
 *
 * Wave 44. State machine: pending → held → available → paid; clawed_back / void.
 * Aggregate strip across states + filterable table.
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Skeleton, StatusBadge } from '@hieu-asia/ui';
import { PartnerShell, partnerFetch } from '@/components/partner/PartnerShell';

interface CommissionRow {
  id: string;
  order_id: string | null;
  tier_level: number;
  gross_amount_vnd: number;
  commission_vnd: number;
  status: string;
  created_at: string;
  available_at: string | null;
}

interface CommissionResp {
  ok: true;
  commissions: CommissionRow[];
  aggregates: Record<string, { count: number; vnd: number }>;
}

const STATES = ['pending', 'held', 'available', 'paid', 'clawed_back', 'void'] as const;

function vnd(n: number) {
  return n.toLocaleString('vi-VN') + 'đ';
}

function dt(iso: string | null) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short' });
  } catch {
    return iso;
  }
}

function statusTone(s: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
  if (s === 'paid') return 'success';
  if (s === 'available') return 'info';
  if (s === 'held') return 'warning';
  if (s === 'clawed_back' || s === 'void') return 'error';
  return 'neutral';
}

export default function PartnerCommissionsPage() {
  return <PartnerShell>{() => <CommissionsView />}</PartnerShell>;
}

function CommissionsView() {
  const [data, setData] = React.useState<CommissionResp | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [statusFilter, setStatusFilter] = React.useState<string>('');

  React.useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(null);
    async function load() {
      try {
        const url = statusFilter
          ? `/api/partner/commissions?status=${statusFilter}`
          : '/api/partner/commissions';
        const r = await partnerFetch<CommissionResp>(url);
        if (!cancelled) setData(r);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [statusFilter]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Tổng quan trạng thái</CardTitle>
        </CardHeader>
        <CardContent>
          {!data ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {STATES.map((s) => {
                const agg = data.aggregates[s] ?? { count: 0, vnd: 0 };
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatusFilter(statusFilter === s ? '' : s)}
                    className={
                      'rounded-lg border px-3 py-2 text-left text-xs transition-colors ' +
                      (statusFilter === s
                        ? 'border-gold bg-gold/10'
                        : 'border-foreground/10 hover:bg-foreground/5')
                    }
                  >
                    <div className="uppercase tracking-wider text-foreground/60">{s}</div>
                    <div className="mt-1 font-mono text-base text-foreground">
                      {vnd(agg.vnd)}
                    </div>
                    <div className="text-[10px] text-foreground/50">{agg.count} entries</div>
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Sổ hoa hồng {statusFilter ? <span className="text-gold">({statusFilter})</span> : null}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-sm text-red-500">Lỗi: {error}</p>
          ) : !data ? (
            <Skeleton className="h-64 w-full" />
          ) : data.commissions.length === 0 ? (
            <p className="py-8 text-center text-sm text-foreground/70">
              Chưa có commission nào.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-foreground/10 text-left text-xs uppercase tracking-wider text-foreground/60">
                  <tr>
                    <th className="py-2 pr-3">Order</th>
                    <th className="py-2 pr-3">Tier</th>
                    <th className="py-2 pr-3">Gross</th>
                    <th className="py-2 pr-3">Commission</th>
                    <th className="py-2 pr-3">Trạng thái</th>
                    <th className="py-2 pr-3">Ngày tạo</th>
                    <th className="py-2 pr-3">Available từ</th>
                  </tr>
                </thead>
                <tbody>
                  {data.commissions.map((c) => (
                    <tr key={c.id} className="border-b border-foreground/5">
                      <td className="py-2 pr-3 font-mono text-xs text-foreground/70">
                        {c.order_id ? c.order_id.slice(0, 8) + '…' : '—'}
                      </td>
                      <td className="py-2 pr-3">L{c.tier_level}</td>
                      <td className="py-2 pr-3 text-foreground/80">{vnd(c.gross_amount_vnd)}</td>
                      <td className="py-2 pr-3 font-medium">{vnd(c.commission_vnd)}</td>
                      <td className="py-2 pr-3">
                        <StatusBadge status={statusTone(c.status)} label={c.status} />
                      </td>
                      <td className="py-2 pr-3 text-foreground/70">{dt(c.created_at)}</td>
                      <td className="py-2 pr-3 text-foreground/70">{dt(c.available_at)}</td>
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
