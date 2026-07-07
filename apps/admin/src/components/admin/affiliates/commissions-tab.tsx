'use client';

/**
 * Wave 60.62.T1.2 — extracted from /affiliates/commissions/page.tsx.
 *
 * Ledger of hieu_asia.affiliate_commissions with state filter + manual
 * clawback (PATCH status='clawed_back'). Preserves Wave 60.62.T1.1 audit
 * breadcrumb on the clawback mutation.
 */

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Card, CardContent, StatusBadge, toast } from '@hieu-asia/ui';
import { EmptyState } from '@/components/admin/empty-state';
import { AdminTable, type AdminTableColumn } from '@/components/admin/table/AdminTable';
import { trackAdminMutation } from '@/lib/admin-breadcrumb';
import { fmtVnd, fmtDateTime } from '@/lib/format';

// Recharts lazy-loaded so it stays out of the initial admin bundle (tasks page
// pattern). ssr:false — admin is auth-gated, not SEO-indexed.
const CommissionCharts = dynamic(
  () => import('@/components/affiliates/CommissionCharts').then((m) => m.CommissionCharts),
  {
    ssr: false,
    loading: () => <div className="h-64 animate-pulse rounded bg-muted/30" aria-hidden />,
  },
);

interface Commission {
  id: string;
  source_user_id: string;
  beneficiary_id: string;
  beneficiary_email: string | null;
  tier_level: number;
  gross_amount_vnd: number;
  commission_vnd: number;
  status: string;
  available_at: string | null;
  cooling_period_days: number | null;
  paid_at: string | null;
  created_at: string;
}

const STATES = ['pending', 'held', 'available', 'paid', 'clawed_back', 'void'] as const;
type StateKey = (typeof STATES)[number];
const DEFAULT_STATES: StateKey[] = ['held', 'available'];

const STATUS_BADGE: Record<
  string,
  { status: 'success' | 'warning' | 'error' | 'info' | 'neutral'; label: string }
> = {
  pending: { status: 'warning', label: 'Chờ xử lý' },
  held: { status: 'warning', label: 'Đang giữ' },
  available: { status: 'success', label: 'Khả dụng' },
  paid: { status: 'success', label: 'Đã trả' },
  clawed_back: { status: 'error', label: 'Thu hồi' },
  void: { status: 'neutral', label: 'Huỷ' },
};

async function fetchCommissions(states: StateKey[]): Promise<Commission[]> {
  const url = `/api/admin/affiliates/commissions?status=${states.join(',')}`;
  const r = await fetch(url, { cache: 'no-store' });
  const d = await r.json();
  if (!r.ok || !d.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
  return d.commissions as Commission[];
}

export function CommissionsTab() {
  const qc = useQueryClient();
  const [states, setStates] = React.useState<StateKey[]>(DEFAULT_STATES);

  const q = useQuery({
    queryKey: ['affiliate-commissions', states],
    queryFn: () => fetchCommissions(states),
    refetchInterval: 60_000,
  });

  const clawback = useMutation({
    mutationFn: async (id: string) => {
      const r = await fetch('/api/admin/affiliates/commissions', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id, status: 'clawed_back' }),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
      return d;
    },
    onSuccess: () => {
      // Wave 60.62.T1.1 — backfill audit breadcrumb. Destructive (financial).
      // No commission id / amount in `data` per PII contract.
      trackAdminMutation('affiliates.commissions.clawback', 'success');
      toast.success('Đã clawback');
      qc.invalidateQueries({ queryKey: ['affiliate-commissions'] });
    },
    onError: (e: Error) => {
      trackAdminMutation('affiliates.commissions.clawback', 'failure', {
        error: e.message.slice(0, 200),
      });
      toast.error(e.message);
    },
  });

  function toggleState(s: StateKey) {
    setStates((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  }

  const columns: AdminTableColumn<Commission>[] = [
    {
      id: 'id',
      header: 'ID',
      cell: (c) => <span className="font-mono text-xs text-muted-foreground">{c.id.slice(0, 8)}</span>,
    },
    {
      id: 'beneficiary',
      header: 'Beneficiary',
      cell: (c) => (
        <span
          className="block max-w-[22ch] truncate text-foreground/85"
          title={c.beneficiary_email ?? undefined}
        >
          {c.beneficiary_email ?? c.beneficiary_id.slice(0, 8)}
        </span>
      ),
    },
    {
      id: 'tier',
      header: 'L',
      className: 'text-right',
      hideOnMobile: true,
      cell: (c) => <span className="font-mono">L{c.tier_level}</span>,
    },
    {
      id: 'gross',
      header: 'Gross',
      className: 'text-right',
      cell: (c) => <span className="font-mono">{fmtVnd(c.gross_amount_vnd)}</span>,
    },
    {
      id: 'commission',
      header: 'Hoa hồng',
      className: 'text-right',
      cell: (c) => <span className="font-mono text-gold">{fmtVnd(c.commission_vnd)}</span>,
    },
    {
      id: 'status',
      header: 'Trạng thái',
      cell: (c) => {
        const b = STATUS_BADGE[c.status] ?? { status: 'neutral' as const, label: c.status };
        return <StatusBadge status={b.status} label={b.label} />;
      },
    },
    {
      id: 'created_at',
      header: 'Ngày tạo',
      hideOnMobile: true,
      cell: (c) => <span className="text-xs text-muted-foreground">{fmtDateTime(c.created_at)}</span>,
    },
    {
      id: 'available_at',
      header: 'Khả dụng lúc',
      hideOnMobile: true,
      cell: (c) => <span className="text-xs text-muted-foreground">{fmtDateTime(c.available_at)}</span>,
    },
    {
      id: 'actions',
      header: '',
      cell: (c) =>
        (c.status === 'held' || c.status === 'available') && (
          <Button
            size="sm"
            variant="ghost"
            disabled={clawback.isPending}
            onClick={() => {
              if (confirm(`Clawback commission ${c.id.slice(0, 8)}?`)) {
                clawback.mutate(c.id);
              }
            }}
            className="border border-red-500/30 text-red-700 dark:text-red-300"
          >
            Clawback
          </Button>
        ),
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        State machine: pending → held → available → paid (hoặc clawed_back / void).
      </p>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-2 pt-6">
          <span className="text-sm text-muted-foreground">Lọc state:</span>
          {STATES.map((s) => (
            <Button
              key={s}
              size="sm"
              variant={states.includes(s) ? 'default' : 'ghost'}
              onClick={() => toggleState(s)}
              className={states.includes(s) ? '' : 'border border-border'}
            >
              {s}
            </Button>
          ))}
          <div className="ml-auto text-sm text-muted-foreground">
            {q.data?.length ?? 0} dòng
          </div>
        </CardContent>
      </Card>

      {!q.isLoading && !q.error && (
        <CommissionCharts rows={q.data ?? []} />
      )}

      <Card>
        <CardContent className="pt-6">
          {q.error ? (
            <p className="text-sm text-red-700 dark:text-red-300">{(q.error as Error).message}</p>
          ) : (
            <AdminTable
              rows={q.data ?? []}
              columns={columns}
              getRowId={(c) => c.id}
              loading={q.isLoading}
              caption="Ledger commission affiliate"
              empty={
                <EmptyState
                  title="Không có commission khớp filter."
                  className="border-none bg-transparent p-0"
                />
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

