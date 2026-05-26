'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  cn,
  toast,
} from '@hieu-asia/ui';
import { Receipt, Download, Undo2, Search, DollarSign, Activity, Users } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { ErrorBlock } from '@/components/admin/error-block';
import { KpiCard } from '@/components/admin/kpi-card';
import { LiveBadge } from '@/components/admin/live-badge';

/**
 * Mask an opaque id for display — keep first 4 + last 4, dots in the middle.
 */
function maskId(id: string | null | undefined): string {
  if (!id) return '—';
  if (id.length <= 12) return id;
  return `${id.slice(0, 4)}…${id.slice(-4)}`;
}

/**
 * Attempt to refund a transaction. Worker endpoint /payment/refund/:id is
 * not yet wired (Wave-D backlog). For now we log NotImplemented and toast.
 */
async function refundTransaction(record: { id: string; intent_id?: string | null }) {
  try {
    const r = await fetch(
      `/api/admin-proxy/payment/refund/${encodeURIComponent(record.intent_id ?? record.id)}`,
      {
        method: 'POST',
      },
    );
    if (r.status === 404) {
      return { ok: false, status: 'not_implemented' as const };
    }
    const data = await r.json().catch(() => ({ ok: false, error: `HTTP ${r.status}` }));
    return {
      ok: !!data.ok,
      status: data.ok ? ('done' as const) : ('error' as const),
      error: data.error,
    };
  } catch (e) {
    return { ok: false, status: 'error' as const, error: (e as Error).message };
  }
}

/** One transaction row as returned by Worker `GET /payment/transactions`. */
interface TransactionRecord {
  id: string;
  ts: string;
  type: string;
  intent_id?: string | null;
  user_id?: string | null;
  amount?: number | null;
  metadata?: Record<string, unknown> | null;
}

interface TransactionsEnvelope {
  ok: boolean;
  records?: TransactionRecord[];
  error?: string;
}

async function fetchTransactions(params: {
  limit: number;
  userId: string;
}): Promise<TransactionsEnvelope> {
  const qs = new URLSearchParams();
  qs.set('limit', String(params.limit));
  if (params.userId) qs.set('user_id', params.userId);
  const res = await fetch(`/api/admin/transactions?${qs.toString()}`, {
    method: 'GET',
    headers: { accept: 'application/json' },
    cache: 'no-store',
  });
  const text = await res.text();
  let parsed: TransactionsEnvelope;
  try {
    parsed = JSON.parse(text) as TransactionsEnvelope;
  } catch {
    return { ok: false, error: `Invalid JSON (status ${res.status})` };
  }
  if (!res.ok && parsed.ok !== false) parsed.ok = false;
  return parsed;
}

function fmtTs(ts: string) {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'medium' });
}

function fmtAmount(amount: number | null | undefined) {
  if (amount == null) return '—';
  return new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 2,
  }).format(amount);
}

const LIMIT = 100;

type TypeFilter = '' | 'intent_created' | 'intent_paid' | 'refund' | 'failed';

const TYPE_FILTERS: Array<{ value: TypeFilter; label: string }> = [
  { value: '', label: 'Tất cả' },
  { value: 'intent_created', label: 'Created' },
  { value: 'intent_paid', label: 'Paid' },
  { value: 'refund', label: 'Refund' },
  { value: 'failed', label: 'Failed' },
];

export default function AdminTransactionsPage() {
  const [userIdInput, setUserIdInput] = React.useState('');
  const [userIdFilter, setUserIdFilter] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<TypeFilter>('');
  const searchRef = React.useRef<HTMLInputElement>(null);

  // Debounce userId filter (300ms).
  React.useEffect(() => {
    const handle = window.setTimeout(() => {
      setUserIdFilter(userIdInput.trim());
    }, 300);
    return () => window.clearTimeout(handle);
  }, [userIdInput]);

  // `/` focuses search.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: ['admin', 'transactions', { limit: LIMIT, userId: userIdFilter }],
    queryFn: () => fetchTransactions({ limit: LIMIT, userId: userIdFilter }),
  });

  const allRecords: TransactionRecord[] = React.useMemo(() => data?.records ?? [], [data?.records]);
  const records = React.useMemo(() => {
    if (!typeFilter) return allRecords;
    return allRecords.filter((r) => r.type === typeFilter);
  }, [allRecords, typeFilter]);

  const showError = !!error || data?.ok === false;
  const errorMsg = (error as Error | undefined)?.message ?? data?.error;

  // KPIs
  const totalAmount = records.reduce((s, r) => s + (r.amount ?? 0), 0);
  const paidCount = allRecords.filter((r) => r.type === 'intent_paid').length;
  const refundCount = allRecords.filter((r) => r.type === 'refund').length;
  const uniqueUsers = new Set(allRecords.map((r) => r.user_id).filter(Boolean)).size;

  const handleRefund = async (r: TransactionRecord) => {
    if (!confirm(`Refund giao dịch ${maskId(r.intent_id ?? r.id)}?`)) return;
    const result = await refundTransaction(r);
    if (result.status === 'not_implemented') {
      console.warn('[refund] NotImplemented — worker endpoint /payment/refund chưa wire', r);
      toast.error('Refund chưa wire', {
        description: 'Worker endpoint /payment/refund chưa sẵn sàng. Đã log NotImplemented.',
      });
    } else if (result.ok) {
      toast.success('Đã refund', { description: maskId(r.intent_id ?? r.id) });
      refetch();
    } else {
      toast.error('Refund thất bại', { description: result.error ?? 'unknown' });
    }
  };

  const exportCsv = () => {
    if (records.length === 0) return;
    const rows = [
      ['Thời gian', 'Type', 'Intent ID', 'User ID', 'Amount', 'Metadata'].join(','),
      ...records.map((r) =>
        [
          r.ts,
          r.type,
          r.intent_id ?? '',
          r.user_id ?? '',
          r.amount ?? '',
          JSON.stringify(r.metadata ?? {}).replace(/,/g, ';'),
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(','),
      ),
    ].join('\n');
    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Giao dịch"
        description={
          <>
            Lịch sử thanh toán raw từ Worker{' '}
            <code className="font-mono text-foreground/85">/payment/transactions</code>.
          </>
        }
        icon={<Receipt className="h-5 w-5" />}
        badge={allRecords.length > 0 ? <LiveBadge /> : null}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={exportCsv} disabled={records.length === 0}>
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Xuất CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? 'Đang tải…' : 'Làm mới'}
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Bản ghi"
          value={allRecords.length}
          icon={<Activity className="h-4 w-4" />}
          accent="gold"
          hint={`tối đa ${LIMIT}`}
        />
        <KpiCard
          label="Paid"
          value={paidCount}
          icon={<DollarSign className="h-4 w-4" />}
          accent="jade"
          hint="intent_paid"
        />
        <KpiCard
          label="Refund"
          value={refundCount}
          icon={<Undo2 className="h-4 w-4" />}
          accent={refundCount > 0 ? 'red' : 'jade'}
          hint="lifetime"
        />
        <KpiCard
          label="Unique user"
          value={uniqueUsers}
          icon={<Users className="h-4 w-4" />}
          accent="purple"
          hint="có giao dịch"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bộ lọc</CardTitle>
          <div className="mt-2 flex flex-col gap-3">
            <div className="relative max-w-md">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                ref={searchRef}
                id="filter-user-id"
                type="text"
                value={userIdInput}
                onChange={(e) => setUserIdInput(e.target.value)}
                placeholder="user_id…   (phím /)"
                className="pl-9 font-mono"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TYPE_FILTERS.map((f) => {
                const active = typeFilter === f.value;
                return (
                  <button
                    key={f.value || 'all'}
                    type="button"
                    onClick={() => setTypeFilter(f.value)}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                      active
                        ? 'border-gold/60 bg-gold/15 text-gold'
                        : 'border-border bg-card/60 text-muted-foreground hover:border-gold/30 hover:text-foreground',
                    )}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
        </CardHeader>
        <CardContent />
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách giao dịch</CardTitle>
          <CardDescription>
            Hiển thị {records.length} / {allRecords.length} (tối đa {LIMIT}).
            {typeFilter && (
              <span className="ml-1 font-mono text-[10px] text-gold">
                · filter: {typeFilter}
              </span>
            )}
            {totalAmount > 0 && (
              <span className="ml-2 text-foreground/85">
                · Tổng: <span className="font-mono text-gold">{fmtAmount(totalAmount)}</span>
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showError && (
            <div className="mb-4">
              <ErrorBlock
                compact
                message={errorMsg ?? 'Không tải được dữ liệu giao dịch.'}
                onRetry={() => refetch()}
              />
            </div>
          )}

          <div className="overflow-x-auto rounded-lg border border-gold/15 bg-card/60">
            <table className="min-w-full divide-y divide-zinc-800 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-gold/80">
                  <th className="px-3 py-2 font-medium">Thời gian</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Intent ID</th>
                  <th className="px-3 py-2 font-medium">User ID</th>
                  <th className="px-3 py-2 text-right font-medium">Amount</th>
                  <th className="px-3 py-2 font-medium">Metadata</th>
                  <th className="px-3 py-2 text-right font-medium">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {isLoading && (
                  <tr>
                    <td colSpan={7} className="px-3 py-6 text-center text-muted-foreground">
                      Đang tải…
                    </td>
                  </tr>
                )}

                {!isLoading && records.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-2">
                      <EmptyState
                        title={
                          allRecords.length === 0
                            ? 'Chưa có giao dịch nào'
                            : 'Không có giao dịch khớp filter'
                        }
                        description={
                          allRecords.length === 0
                            ? 'Mọi event payment (intent_created, intent_paid, refund) ghi tại Worker sẽ hiện ở đây real-time.'
                            : 'Thử "Tất cả" hoặc bỏ user_id filter.'
                        }
                        className="my-2 border-0 bg-transparent"
                      />
                    </td>
                  </tr>
                )}

                {records.map((r) => {
                  const canRefund = r.type === 'intent_paid';
                  return (
                    <tr key={r.id} className="hover:bg-gold/[0.03]">
                      <td className="whitespace-nowrap px-3 py-2 text-foreground/85">{fmtTs(r.ts)}</td>
                      <td className="whitespace-nowrap px-3 py-2">
                        <span
                          className={`rounded border px-2 py-0.5 font-mono text-xs ${
                            r.type === 'intent_paid'
                              ? 'border-jade/40 bg-jade/10 text-jade'
                              : r.type === 'refund'
                              ? 'border-red-400/40 bg-red-500/10 text-red-200'
                              : 'border-gold/30 bg-gold/10 text-gold'
                          }`}
                        >
                          {r.type}
                        </span>
                      </td>
                      <td
                        className="cursor-pointer px-3 py-2 font-mono text-xs text-muted-foreground hover:text-gold"
                        title={r.intent_id ?? undefined}
                        onClick={() => {
                          if (r.intent_id) {
                            navigator.clipboard.writeText(r.intent_id).catch(() => {});
                            toast.success('Đã copy intent ID');
                          }
                        }}
                      >
                        {maskId(r.intent_id)}
                      </td>
                      <td
                        className="cursor-pointer px-3 py-2 font-mono text-xs text-muted-foreground hover:text-gold"
                        title={r.user_id ?? undefined}
                        onClick={() => {
                          if (r.user_id) {
                            navigator.clipboard.writeText(r.user_id).catch(() => {});
                            toast.success('Đã copy user ID');
                          }
                        }}
                      >
                        {maskId(r.user_id)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-foreground/85">
                        {fmtAmount(r.amount)}
                      </td>
                      <td className="max-w-md px-3 py-2 align-top">
                        {r.metadata ? (
                          <pre className="max-h-32 overflow-auto whitespace-pre-wrap break-all rounded bg-card/60 px-2 py-1 font-mono text-[11px] leading-snug text-muted-foreground">
                            {JSON.stringify(r.metadata, null, 2)}
                          </pre>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-right">
                        {canRefund ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRefund(r)}
                            className="border-red-400/30 text-red-300 hover:bg-red-500/10"
                          >
                            <Undo2 className="mr-1 h-3 w-3" />
                            Refund
                          </Button>
                        ) : (
                          <span className="text-foreground/30">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
