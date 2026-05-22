/**
 * /admin/affiliates/batches — Wave 43.2 (view + approve)
 *
 * Reads hieu_asia.affiliate_payout_batches. Approve action flips a
 * pending_approval batch to approved + sets approved_by/approved_at.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Card, CardContent, toast } from '@hieu-asia/ui';

interface Batch {
  id: string;
  status: string;
  rail: string | null;
  total_amount_vnd: number;
  affiliate_count: number;
  approved_by: string | null;
  approved_at: string | null;
  paid_at: string | null;
  notes: string | null;
  created_at: string;
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

async function fetchBatches(): Promise<Batch[]> {
  const r = await fetch('/api/admin/affiliates/batches', { cache: 'no-store' });
  const d = await r.json();
  if (!r.ok || !d.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
  return d.batches as Batch[];
}

export default function AdminBatchesPage() {
  const qc = useQueryClient();
  const search = useSearchParams();
  const highlight = search.get('id');

  const q = useQuery({
    queryKey: ['affiliate-batches'],
    queryFn: fetchBatches,
    refetchInterval: 60_000,
  });

  const approve = useMutation({
    mutationFn: async (id: string) => {
      const r = await fetch('/api/admin/affiliates/batches', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id, status: 'approved' }),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
      return d;
    },
    onSuccess: () => {
      toast.success('Đã duyệt batch');
      qc.invalidateQueries({ queryKey: ['affiliate-batches'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <header>
        <Link href="/affiliates" className="text-sm text-muted-foreground hover:text-gold">
          ← Affiliates
        </Link>
        <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          Payout batches
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Batch chuẩn bị payout đại trà. Approve để chuyển sang rail xử lý.
        </p>
      </header>

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
                  <th className="pb-2 pr-3">Status</th>
                  <th className="pb-2 pr-3">Rail</th>
                  <th className="pb-2 pr-3 text-right">Total</th>
                  <th className="pb-2 pr-3 text-right">Affiliates</th>
                  <th className="pb-2 pr-3">Approved by</th>
                  <th className="pb-2 pr-3">Approved at</th>
                  <th className="pb-2 pr-3">Paid at</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {(q.data ?? []).map((b) => (
                  <tr
                    key={b.id}
                    className={`border-b border-border hover:bg-muted/30 ${
                      highlight === b.id ? 'bg-gold/5' : ''
                    }`}
                  >
                    <td className="py-2 pr-3 font-mono text-xs">{b.id.slice(0, 8)}</td>
                    <td className="py-2 pr-3">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="py-2 pr-3">{b.rail ?? '—'}</td>
                    <td className="py-2 pr-3 text-right font-mono text-gold">
                      {vnd(b.total_amount_vnd)}
                    </td>
                    <td className="py-2 pr-3 text-right font-mono">{b.affiliate_count}</td>
                    <td className="py-2 pr-3 text-xs">{b.approved_by ?? '—'}</td>
                    <td className="py-2 pr-3 text-xs text-muted-foreground">
                      {dt(b.approved_at)}
                    </td>
                    <td className="py-2 pr-3 text-xs text-muted-foreground">{dt(b.paid_at)}</td>
                    <td className="py-2">
                      {b.status === 'pending_approval' && (
                        <Button
                          size="sm"
                          disabled={approve.isPending}
                          onClick={() => {
                            if (confirm(`Duyệt batch ${b.id.slice(0, 8)} (${vnd(b.total_amount_vnd)})?`)) {
                              approve.mutate(b.id);
                            }
                          }}
                        >
                          Approve
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {q.data && q.data.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-6 text-center text-muted-foreground">
                      Chưa có batch nào.
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

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === 'approved'
      ? 'bg-jade/20 text-jade-50'
      : status === 'paid'
        ? 'bg-green-500/20 text-green-300'
        : status === 'pending_approval'
          ? 'bg-yellow-500/20 text-yellow-300'
          : status === 'rejected'
            ? 'bg-red-500/20 text-red-300'
            : 'bg-muted/40 text-muted-foreground';
  return (
    <span className={`rounded px-2 py-0.5 text-[10px] uppercase ${cls}`}>{status}</span>
  );
}
