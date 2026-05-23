/**
 * /admin/affiliates/batches — Wave 43.2 (view + approve) + Wave 45 (build + CSV)
 *
 * Reads hieu_asia.affiliate_payout_batches. Build a new batch via the
 * payouts/build-batch worker endpoint (rail picker + min amount). Approve
 * action flips a pending_approval batch to approved + fire-and-forget
 * dispatch. Manual CSV batches expose a "Download CSV" link.
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

type Rail = 'manual_csv' | 'wise' | 'stripe_connect';

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
  const [buildOpen, setBuildOpen] = React.useState(false);

  const q = useQuery({
    queryKey: ['affiliate-batches'],
    queryFn: fetchBatches,
    refetchInterval: 60_000,
  });

  const approve = useMutation({
    mutationFn: async (id: string) => {
      // Wave 45 — worker handles approve + fire-and-forget dispatch.
      const r = await fetch(`/api/admin/affiliates/payouts/batches/${id}/approve`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
      return d;
    },
    onSuccess: () => {
      toast.success('Đã duyệt batch — dispatch đang chạy');
      qc.invalidateQueries({ queryKey: ['affiliate-batches'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const csv = useMutation({
    mutationFn: async (id: string) => {
      const r = await fetch(`/api/admin/affiliates/payouts/batches/${id}/csv`, {
        method: 'GET',
      });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
      return d as {
        ok: true;
        url: string;
        key: string;
        row_count: number;
        warning?: string | null;
      };
    },
    onSuccess: (d) => {
      toast.success(`CSV ${d.row_count} dòng đã sẵn sàng`);
      // Wave 45.2 P2-5 — surface missing-bank-info warning before download.
      if (d.warning) {
        toast.error(d.warning);
      }
      window.open(d.url, '_blank', 'noopener,noreferrer');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between gap-3">
        <div>
          <Link href="/affiliates" className="text-sm text-muted-foreground hover:text-gold">
            ← Affiliates
          </Link>
          <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Payout batches
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Batch chuẩn bị payout đại trà. Approve để chuyển sang rail xử lý.
          </p>
        </div>
        <Button onClick={() => setBuildOpen(true)}>+ Build new batch</Button>
      </header>

      {buildOpen && (
        <BuildBatchModal
          onClose={() => setBuildOpen(false)}
          onBuilt={() => {
            setBuildOpen(false);
            qc.invalidateQueries({ queryKey: ['affiliate-batches'] });
          }}
        />
      )}

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
                      <div className="flex items-center gap-2">
                        {b.status === 'pending_approval' && (
                          <Button
                            size="sm"
                            disabled={approve.isPending}
                            onClick={() => {
                              if (
                                confirm(
                                  `Duyệt batch ${b.id.slice(0, 8)} (${vnd(b.total_amount_vnd)})?`,
                                )
                              ) {
                                approve.mutate(b.id);
                              }
                            }}
                          >
                            Approve
                          </Button>
                        )}
                        {b.rail === 'manual_csv' &&
                          // Wave 45.2 P3-3 — CSV button only after dispatch
                          // has flipped the batch to in_progress/completed.
                          // 'approved' is a transient pre-dispatch state.
                          ['in_progress', 'completed'].includes(b.status) && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={csv.isPending}
                              onClick={() => csv.mutate(b.id)}
                            >
                              CSV
                            </Button>
                          )}
                        {b.rail !== 'manual_csv' &&
                          ['in_progress', 'completed', 'failed'].includes(b.status) && (
                            <span className="text-xs text-muted-foreground">
                              {b.rail === 'wise' ? 'Wise transfers' : 'Stripe transfers'}
                            </span>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
                {q.data && q.data.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-6 text-center text-muted-foreground">
                      Chưa có batch nào. Bấm <strong>Build new batch</strong> để tạo.
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
      : status === 'completed' || status === 'paid'
        ? 'bg-green-500/20 text-green-300'
        : status === 'in_progress'
          ? 'bg-blue-500/20 text-blue-300'
          : status === 'pending_approval'
            ? 'bg-yellow-500/20 text-yellow-300'
            : status === 'failed' || status === 'rejected'
              ? 'bg-red-500/20 text-red-300'
              : 'bg-muted/40 text-muted-foreground';
  return <span className={`rounded px-2 py-0.5 text-[10px] uppercase ${cls}`}>{status}</span>;
}

// ---------------------------------------------------------------------------
// Build-batch modal — Wave 45.
// ---------------------------------------------------------------------------

function BuildBatchModal({ onClose, onBuilt }: { onClose: () => void; onBuilt: () => void }) {
  const [rail, setRail] = React.useState<Rail>('manual_csv');
  const [minVnd, setMinVnd] = React.useState<string>('100000');
  const [submitting, setSubmitting] = React.useState(false);

  async function submit() {
    setSubmitting(true);
    try {
      const r = await fetch('/api/admin/affiliates/payouts/build-batch', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          rail,
          min_amount_vnd: Number.parseInt(minVnd, 10) || 100_000,
        }),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
      toast.success(
        `Đã tạo batch ${String(d.batch_id).slice(0, 8)} — ${d.affiliate_count} affiliates, ${vnd(
          d.total_amount_vnd,
        )}`,
      );
      onBuilt();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <Card className="w-full max-w-md" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <CardContent className="space-y-4 pt-6">
          <h2 className="font-heading text-xl text-foreground">Build payout batch</h2>
          <div>
            <label className="mb-2 block text-xs uppercase text-muted-foreground">Rail</label>
            <div className="flex flex-wrap gap-2">
              {(['manual_csv', 'wise', 'stripe_connect'] as Rail[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRail(r)}
                  className={
                    'rounded-md border px-3 py-1.5 text-xs uppercase tracking-wider transition-colors ' +
                    (rail === r
                      ? 'border-gold bg-gold/10 text-gold'
                      : 'border-foreground/15 text-foreground/70 hover:bg-foreground/5')
                  }
                >
                  {r === 'manual_csv' ? 'Manual CSV' : r === 'wise' ? 'Wise' : 'Stripe Connect'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase text-muted-foreground">
              Min amount per affiliate (VND)
            </label>
            <input
              type="number"
              min={0}
              step={10000}
              value={minVnd}
              onChange={(e) => setMinVnd(e.target.value)}
              className="w-full rounded border border-foreground/20 bg-background px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Affiliate có tổng commission &lt; mức này sẽ bị skip khỏi batch.
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose} disabled={submitting}>
              Huỷ
            </Button>
            <Button onClick={submit} disabled={submitting}>
              {submitting ? 'Đang build…' : 'Build batch'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
