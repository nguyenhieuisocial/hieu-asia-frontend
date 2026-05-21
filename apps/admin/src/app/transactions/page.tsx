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
} from '@hieu-asia/ui';

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

export default function AdminTransactionsPage() {
  const [userIdInput, setUserIdInput] = React.useState('');
  const [userIdFilter, setUserIdFilter] = React.useState('');

  // Debounce userId filter (300ms).
  React.useEffect(() => {
    const handle = window.setTimeout(() => {
      setUserIdFilter(userIdInput.trim());
    }, 300);
    return () => window.clearTimeout(handle);
  }, [userIdInput]);

  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: ['admin', 'transactions', { limit: LIMIT, userId: userIdFilter }],
    queryFn: () => fetchTransactions({ limit: LIMIT, userId: userIdFilter }),
  });

  const records: TransactionRecord[] = data?.records ?? [];
  const showError = !!error || data?.ok === false;
  const errorMsg = (error as Error | undefined)?.message ?? data?.error;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-cream">
            Giao dịch
          </h1>
          <p className="mt-1 text-sm text-cream/65">
            Lịch sử thanh toán raw từ Worker `/payment/transactions`.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? 'Đang tải…' : 'Làm mới'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
          <CardDescription>
            Lọc theo user_id (debounce 300ms). Limit cố định {LIMIT} bản ghi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <label htmlFor="filter-user-id" className="block text-xs text-cream/60">
            user_id
          </label>
          <input
            id="filter-user-id"
            type="text"
            value={userIdInput}
            onChange={(e) => setUserIdInput(e.target.value)}
            placeholder="vd: 7f3a-..."
            className="mt-1.5 w-full max-w-sm rounded-md border border-gold/20 bg-ink/60 px-3 py-2 font-mono text-sm text-cream placeholder:text-cream/30 focus:border-[#B8923D] focus:outline-none"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách giao dịch</CardTitle>
          <CardDescription>
            Hiển thị {records.length} / tối đa {LIMIT}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showError && (
            <div className="mb-4 rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {errorMsg ?? 'Không tải được dữ liệu giao dịch.'}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-800 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-cream/55">
                  <th className="px-3 py-2 font-medium">Thời gian</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Intent ID</th>
                  <th className="px-3 py-2 font-medium">User ID</th>
                  <th className="px-3 py-2 text-right font-medium">Amount</th>
                  <th className="px-3 py-2 font-medium">Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {isLoading && (
                  <tr>
                    <td colSpan={6} className="px-3 py-6 text-center text-cream/55">
                      Đang tải…
                    </td>
                  </tr>
                )}

                {!isLoading && records.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-6 text-center text-cream/55">
                      Chưa có giao dịch nào.
                    </td>
                  </tr>
                )}

                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-gold/[0.03]">
                    <td className="whitespace-nowrap px-3 py-2 text-cream/85">
                      {fmtTs(r.ts)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2">
                      <span className="rounded border border-[#B8923D]/30 bg-[#B8923D]/10 px-2 py-0.5 font-mono text-xs text-[#B8923D]">
                        {r.type}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-cream/70">
                      {r.intent_id ?? '—'}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-cream/70">
                      {r.user_id ?? '—'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-cream/85">
                      {fmtAmount(r.amount)}
                    </td>
                    <td className="max-w-md px-3 py-2 align-top">
                      {r.metadata ? (
                        <pre className="max-h-32 overflow-auto whitespace-pre-wrap break-all rounded bg-ink/60 px-2 py-1 font-mono text-[11px] leading-snug text-cream/65">
                          {JSON.stringify(r.metadata, null, 2)}
                        </pre>
                      ) : (
                        <span className="text-cream/40">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
