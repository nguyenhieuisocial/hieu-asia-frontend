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
import { Button, Card, CardContent, toast } from '@hieu-asia/ui';
import { trackAdminMutation } from '@/lib/admin-breadcrumb';

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
        <CardContent className="overflow-x-auto pt-6">
          {q.isLoading ? (
            <p className="text-sm text-muted-foreground">Đang tải…</p>
          ) : q.error ? (
            <p className="text-sm text-red-700 dark:text-red-300">{(q.error as Error).message}</p>
          ) : (
            <table className="w-full min-w-[760px] text-sm">
              <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="pb-2 pr-3">ID</th>
                  <th className="pb-2 pr-3">Beneficiary</th>
                  <th className="pb-2 pr-3 text-right">L</th>
                  <th className="pb-2 pr-3 text-right">Gross</th>
                  <th className="pb-2 pr-3 text-right">Commission</th>
                  <th className="pb-2 pr-3">Status</th>
                  <th className="pb-2 pr-3">Created</th>
                  <th className="pb-2 pr-3">Available</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {(q.data ?? []).map((c) => (
                  <tr key={c.id} className="border-b border-border hover:bg-muted/30">
                    <td className="py-2 pr-3 font-mono text-xs text-muted-foreground">
                      {c.id.slice(0, 8)}
                    </td>
                    <td className="py-2 pr-3 text-foreground/85">
                      {c.beneficiary_email ?? c.beneficiary_id.slice(0, 8)}
                    </td>
                    <td className="py-2 pr-3 text-right font-mono">L{c.tier_level}</td>
                    <td className="py-2 pr-3 text-right font-mono">
                      {vnd(c.gross_amount_vnd)}
                    </td>
                    <td className="py-2 pr-3 text-right font-mono text-gold">
                      {vnd(c.commission_vnd)}
                    </td>
                    <td className="py-2 pr-3">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-2 pr-3 text-xs text-muted-foreground">
                      {dt(c.created_at)}
                    </td>
                    <td className="py-2 pr-3 text-xs text-muted-foreground">
                      {dt(c.available_at)}
                    </td>
                    <td className="py-2">
                      {(c.status === 'held' || c.status === 'available') && (
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
                      )}
                    </td>
                  </tr>
                ))}
                {q.data && q.data.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-6 text-center text-muted-foreground">
                      Không có commission khớp filter.
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
    status === 'available'
      ? 'bg-jade/20 text-jade-700 dark:text-jade-50'
      : status === 'paid'
        ? 'bg-green-500/20 text-green-700 dark:text-green-300'
        : status === 'held' || status === 'pending'
          ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
          : status === 'clawed_back'
            ? 'bg-red-500/20 text-red-700 dark:text-red-300'
            : 'bg-muted/40 text-muted-foreground';
  return (
    <span className={`rounded px-2 py-0.5 text-[10px] uppercase ${cls}`}>{status}</span>
  );
}
