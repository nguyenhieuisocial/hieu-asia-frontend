'use client';

/**
 * Wave 60.62.T1.2 — extracted from /affiliates/batches/page.tsx.
 *
 * Wave 43.2 (view + approve) + Wave 45 (build + CSV). Reads
 * hieu_asia.affiliate_payout_batches. Build a new batch via the
 * payouts/build-batch worker endpoint (rail picker + min amount). Approve
 * flips a pending_approval batch to approved + fire-and-forget dispatch.
 * Manual CSV batches expose a "Download CSV" button.
 *
 * URL state: respects `?batchId=<id>` highlight (renamed from the legacy
 * `?id=<id>` to avoid clashing with the parent `?tab=batches` query).
 */

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Card, CardContent, StatusBadge, toast } from '@hieu-asia/ui';
import { EmptyState } from '@/components/admin/empty-state';
import { AdminTable, type AdminTableColumn } from '@/components/admin/table/AdminTable';
import { fmtVnd, fmtDateTime } from '@/lib/format';

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

const STATUS_BADGE: Record<
  string,
  { status: 'success' | 'warning' | 'error' | 'info' | 'neutral'; label: string }
> = {
  pending_approval: { status: 'warning', label: 'Chờ duyệt' },
  approved: { status: 'success', label: 'Đã duyệt' },
  in_progress: { status: 'info', label: 'Đang chi' },
  completed: { status: 'success', label: 'Hoàn tất' },
  paid: { status: 'success', label: 'Đã trả' },
  failed: { status: 'error', label: 'Thất bại' },
  rejected: { status: 'error', label: 'Từ chối' },
};

async function fetchBatches(): Promise<Batch[]> {
  const r = await fetch('/api/admin/affiliates/batches', { cache: 'no-store' });
  const d = await r.json();
  if (!r.ok || !d.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
  return d.batches as Batch[];
}

export function BatchesTab() {
  const qc = useQueryClient();
  const search = useSearchParams();
  // Wave 60.62.T1.2 — `batchId` (not `id`) to coexist with `?tab=batches`.
  // Legacy `?id=<uuid>` still honored for backward compatibility.
  const highlight = search.get('batchId') ?? search.get('id');
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
        signal: AbortSignal.timeout(15000),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
      return d;
    },
    onSuccess: () => {
      toast.success('Đã duyệt batch — dispatch đang chạy');
      qc.invalidateQueries({ queryKey: ['affiliate-batches'] });
    },
    onError: (e: Error) =>
      toast.error(e.name === 'TimeoutError' ? 'Quá lâu, thử lại' : e.message),
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
        total_net_vnd?: number;
      };
    },
    onSuccess: (d) => {
      toast.success(
        `CSV ${d.row_count} dòng đã sẵn sàng${
          typeof d.total_net_vnd === 'number' ? ` · tổng chi (sau thuế) ${fmtVnd(d.total_net_vnd)}` : ''
        }`,
      );
      // Wave 45.2 P2-5 — surface missing-bank-info warning before download.
      if (d.warning) {
        toast.warning(d.warning);
      }
      window.open(d.url, '_blank', 'noopener,noreferrer');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // RECORD-ONLY: after the founder has done the bank transfers off-platform,
  // mark the whole manual_csv batch paid. Moves no money.
  const markPaid = useMutation({
    mutationFn: async (id: string) => {
      const r = await fetch(`/api/admin/affiliates/payouts/batches/${id}/mark-paid`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        signal: AbortSignal.timeout(15000),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
      return d as { ok: true; marked_payouts: number };
    },
    onSuccess: (d) => {
      toast.success(`Đã ghi nhận đã trả — ${d.marked_payouts} người`);
      qc.invalidateQueries({ queryKey: ['affiliate-batches'] });
    },
    onError: (e: Error) =>
      toast.error(e.name === 'TimeoutError' ? 'Quá lâu, thử lại' : e.message),
  });

  const columns: AdminTableColumn<Batch>[] = [
    { id: 'id', header: 'ID', cell: (b) => <span className="font-mono text-xs">{b.id.slice(0, 8)}</span> },
    {
      id: 'status',
      header: 'Trạng thái',
      cell: (b) => {
        const s = STATUS_BADGE[b.status] ?? { status: 'neutral' as const, label: b.status };
        return <StatusBadge status={s.status} label={s.label} />;
      },
    },
    { id: 'rail', header: 'Rail', cell: (b) => b.rail ?? '—' },
    {
      id: 'total',
      header: 'Tổng',
      className: 'text-right',
      cell: (b) => <span className="font-mono text-gold">{fmtVnd(b.total_amount_vnd)}</span>,
    },
    {
      id: 'affiliates',
      header: 'Affiliates',
      className: 'text-right',
      cell: (b) => <span className="font-mono">{b.affiliate_count}</span>,
    },
    {
      id: 'approved_by',
      header: 'Người duyệt',
      hideOnMobile: true,
      cell: (b) => <span className="text-xs">{b.approved_by ?? '—'}</span>,
    },
    {
      id: 'approved_at',
      header: 'Duyệt lúc',
      hideOnMobile: true,
      cell: (b) => <span className="text-xs text-muted-foreground">{fmtDateTime(b.approved_at)}</span>,
    },
    {
      id: 'paid_at',
      header: 'Trả lúc',
      hideOnMobile: true,
      cell: (b) => <span className="text-xs text-muted-foreground">{fmtDateTime(b.paid_at)}</span>,
    },
    {
      id: 'actions',
      header: '',
      cell: (b) => (
        <div className="flex items-center gap-2">
          {b.status === 'pending_approval' && (
            <Button
              size="sm"
              disabled={approve.isPending}
              onClick={() => {
                if (confirm(`Duyệt batch ${b.id.slice(0, 8)} (${fmtVnd(b.total_amount_vnd)})?`)) {
                  approve.mutate(b.id);
                }
              }}
            >
              Approve
            </Button>
          )}
          {b.rail === 'manual_csv' &&
            // Wave 45.2 P3-3 — CSV button only after dispatch has flipped the
            // batch to in_progress/completed. 'approved' is a transient state.
            ['in_progress', 'completed'].includes(b.status) && (
              <Button size="sm" variant="outline" disabled={csv.isPending} onClick={() => csv.mutate(b.id)}>
                CSV
              </Button>
            )}
          {b.rail === 'manual_csv' && b.status === 'in_progress' && (
            <Button
              size="sm"
              variant="outline"
              disabled={markPaid.isPending}
              onClick={() => {
                if (
                  confirm(
                    `Xác nhận: bạn ĐÃ chuyển khoản xong cho batch ${b.id.slice(0, 8)} (${fmtVnd(
                      b.total_amount_vnd,
                    )})? Thao tác này chỉ GHI NHẬN, không tự chuyển tiền.`,
                  )
                ) {
                  markPaid.mutate(b.id);
                }
              }}
            >
              Ghi nhận đã trả
            </Button>
          )}
          {b.rail !== 'manual_csv' &&
            ['in_progress', 'completed', 'failed'].includes(b.status) && (
              <span className="text-xs text-muted-foreground">
                {b.rail === 'wise' ? 'Wise transfers' : 'Stripe transfers'}
              </span>
            )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Batch chuẩn bị payout đại trà. Approve để chuyển sang rail xử lý.
        </p>
        <Button onClick={() => setBuildOpen(true)}>+ Build new batch</Button>
      </div>

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
        <CardContent className="pt-6">
          {q.error ? (
            <p className="text-sm text-red-700 dark:text-red-300">{(q.error as Error).message}</p>
          ) : (
            <AdminTable
              rows={q.data ?? []}
              columns={columns}
              getRowId={(b) => b.id}
              loading={q.isLoading}
              rowClassName={(b) => (highlight === b.id ? 'bg-gold/5' : undefined)}
              caption="Danh sách batch payout"
              empty={
                <EmptyState
                  title="Chưa có batch nào"
                  description={
                    <>
                      Bấm <strong>Build new batch</strong> để tạo.
                    </>
                  }
                  className="border-none bg-transparent p-0"
                />
              }
            />
          )}
        </CardContent>
      </Card>

      <WithholdingStatementOpener />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Internal TNCN withholding statement — per-payout "bảng kê tạm tính" for the
// accountant. Payout ids come from the batch CSV. NOT an official certificate.
// ---------------------------------------------------------------------------
function WithholdingStatementOpener() {
  const [payoutId, setPayoutId] = React.useState('');
  const id = payoutId.trim();
  const valid = /^\d+$/.test(id);
  const open = (fmt: 'pdf' | 'html') => {
    if (!valid) return;
    window.open(
      `/api/admin/affiliates/payouts/${id}/withholding-statement?format=${fmt}`,
      '_blank',
      'noopener,noreferrer',
    );
  };
  return (
    <Card>
      <CardContent className="space-y-2 pt-6">
        <p className="text-sm font-medium text-foreground">Bảng kê khấu trừ thuế TNCN (nội bộ)</p>
        <p className="text-xs text-muted-foreground">
          Tài liệu nội bộ cho kế toán, theo từng mã chi trả (payout id — lấy trong file CSV của batch).
          KHÔNG phải chứng từ khấu trừ thuế điện tử chính thức; MST/CCCD đã được che.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={payoutId}
            onChange={(e) => setPayoutId(e.target.value)}
            placeholder="Mã chi trả (vd 12)"
            className="w-44 rounded border border-foreground/20 bg-background px-3 py-2 text-sm"
          />
          <Button size="sm" variant="outline" disabled={!valid} onClick={() => open('pdf')}>
            Tải PDF
          </Button>
          <Button size="sm" variant="outline" disabled={!valid} onClick={() => open('html')}>
            Xem
          </Button>
        </div>
      </CardContent>
    </Card>
  );
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
      // A min of 0 (include all affiliates) must NOT coerce to 100k — use a
      // NaN-check so only an empty/invalid field falls back to the default.
      const n = Number.parseInt(minVnd, 10);
      const r = await fetch('/api/admin/affiliates/payouts/build-batch', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          rail,
          min_amount_vnd: Number.isFinite(n) ? n : 100_000,
        }),
        signal: AbortSignal.timeout(20000),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
      toast.success(
        `Đã tạo batch ${String(d.batch_id).slice(0, 8)} — ${d.affiliate_count} affiliates, ${fmtVnd(
          d.total_amount_vnd,
        )}`,
      );
      onBuilt();
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.name === 'TimeoutError'
            ? 'Quá lâu, thử lại'
            : e.message
          : String(e),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 p-4"
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

