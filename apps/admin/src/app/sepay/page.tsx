'use client';

/**
 * SePay đối soát — đọc giao dịch ngân hàng THẬT từ Worker `/admin/sepay/*`
 * (pull SePay User API). Khác trang "Giao dịch" (`/payment/transactions`,
 * audit nội bộ): đây là tiền vào tài khoản thật, dùng để đối soát đơn.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  cn,
} from '@hieu-asia/ui';
import { Landmark, Download, Search, Activity, DollarSign, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { ErrorBlock } from '@/components/admin/error-block';
import { KpiCard } from '@/components/admin/kpi-card';
import { LiveBadge } from '@/components/admin/live-badge';

interface SepayTransaction {
  id: string;
  transaction_date: string;
  account_number: string | null;
  amount_in: string;
  amount_out: string;
  accumulated: string;
  transaction_content: string | null;
  reference_number: string | null;
  bank_brand_name: string | null;
  sub_account: string | null;
  code: string | null;
}

interface ListEnvelope {
  ok: boolean;
  count?: number;
  transactions?: SepayTransaction[];
  error?: string;
}

interface Filters {
  account_number: string;
  amount_in: string;
  reference_number: string;
  date_min: string;
  date_max: string;
}

const EMPTY_FILTERS: Filters = {
  account_number: '',
  amount_in: '',
  reference_number: '',
  date_min: '',
  date_max: '',
};

const LIMIT = 100;

async function fetchSepayList(filters: Filters): Promise<ListEnvelope> {
  const qs = new URLSearchParams();
  qs.set('limit', String(LIMIT));
  if (filters.account_number) qs.set('account_number', filters.account_number);
  if (filters.amount_in) qs.set('amount_in', filters.amount_in);
  if (filters.reference_number) qs.set('reference_number', filters.reference_number);
  if (filters.date_min) qs.set('date_min', filters.date_min);
  if (filters.date_max) qs.set('date_max', filters.date_max);
  const res = await fetch(`/api/admin-proxy/admin/sepay/transactions?${qs.toString()}`, {
    method: 'GET',
    headers: { accept: 'application/json' },
    cache: 'no-store',
  });
  const text = await res.text();
  try {
    const parsed = JSON.parse(text) as ListEnvelope;
    if (!res.ok && parsed.ok !== false) parsed.ok = false;
    return parsed;
  } catch {
    return { ok: false, error: `Invalid JSON (HTTP ${res.status})` };
  }
}

function fmtTs(ts: string) {
  const d = new Date(ts.replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'medium' });
}

function fmtVnd(amount: number) {
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(amount);
}

export default function AdminSepayPage() {
  const [draft, setDraft] = React.useState<Filters>(EMPTY_FILTERS);
  const [filters, setFilters] = React.useState<Filters>(EMPTY_FILTERS);
  // Client-side reconcile highlight: nội dung chứa chuỗi này (vd "HIEUASIA …").
  const [contentMatch, setContentMatch] = React.useState('');

  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: ['admin', 'sepay', filters],
    queryFn: () => fetchSepayList(filters),
    refetchInterval: 30_000,
  });

  const txns: SepayTransaction[] = React.useMemo(() => data?.transactions ?? [], [data?.transactions]);
  const showError = !!error || data?.ok === false;
  const errorMsg =
    (error as Error | undefined)?.message ??
    (data?.error === 'sepay_api_error'
      ? 'Lỗi gọi SePay API (kiểm tra SEPAY_API_TOKEN trên Worker).'
      : data?.error);

  // KPIs (trên tập đang hiển thị)
  const totalIn = txns.reduce((s, t) => s + parseFloat(t.amount_in || '0'), 0);
  const incomingCount = txns.filter((t) => parseFloat(t.amount_in || '0') > 0).length;
  const accounts = new Set(txns.map((t) => t.account_number).filter(Boolean)).size;

  const needle = contentMatch.trim().toUpperCase();
  const isMatch = (t: SepayTransaction) =>
    needle.length > 0 && (t.transaction_content ?? '').toUpperCase().includes(needle);

  const applyFilters = () => setFilters(draft);
  const resetFilters = () => {
    setDraft(EMPTY_FILTERS);
    setFilters(EMPTY_FILTERS);
  };

  const exportCsv = () => {
    if (txns.length === 0) return;
    const rows = [
      ['Thời gian', 'Ngân hàng', 'Tài khoản', 'Tiền vào', 'Mã tham chiếu', 'Nội dung'].join(','),
      ...txns.map((t) =>
        [
          t.transaction_date,
          t.bank_brand_name ?? '',
          t.account_number ?? '',
          t.amount_in ?? '',
          t.reference_number ?? '',
          (t.transaction_content ?? '').replace(/,/g, ';'),
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(','),
      ),
    ].join('\n');
    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sepay-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="SePay đối soát"
        description={
          <>
            Giao dịch ngân hàng thật từ Worker{' '}
            <code className="font-mono text-foreground/85">/admin/sepay/transactions</code> (SePay
            User API). Nhập nội dung/mã đơn để soi tiền vào.
          </>
        }
        icon={<Landmark className="h-5 w-5" />}
        badge={txns.length > 0 ? <LiveBadge /> : null}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={exportCsv} disabled={txns.length === 0}>
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Xuất CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? 'Đang tải…' : 'Làm mới'}
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Giao dịch tiền vào" value={incomingCount} icon={<Activity className="h-4 w-4" />} />
        <KpiCard label="Tổng tiền vào (VND)" value={fmtVnd(totalIn)} icon={<DollarSign className="h-4 w-4" />} />
        <KpiCard label="Số tài khoản" value={accounts} icon={<Landmark className="h-4 w-4" />} />
      </div>

      {/* Bộ lọc + soi đối soát */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Bộ lọc & đối soát</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              placeholder="Số tài khoản"
              value={draft.account_number}
              onChange={(e) => setDraft({ ...draft, account_number: e.target.value })}
            />
            <Input
              placeholder="Số tiền vào (khớp chính xác)"
              inputMode="numeric"
              value={draft.amount_in}
              onChange={(e) => setDraft({ ...draft, amount_in: e.target.value })}
            />
            <Input
              placeholder="Mã tham chiếu"
              value={draft.reference_number}
              onChange={(e) => setDraft({ ...draft, reference_number: e.target.value })}
            />
            <Input
              type="date"
              value={draft.date_min}
              onChange={(e) => setDraft({ ...draft, date_min: e.target.value })}
            />
            <Input
              type="date"
              value={draft.date_max}
              onChange={(e) => setDraft({ ...draft, date_max: e.target.value })}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={applyFilters} disabled={isFetching}>
                <Search className="mr-1.5 h-3.5 w-3.5" />
                Lọc
              </Button>
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Xoá
              </Button>
            </div>
          </div>
          <Input
            placeholder='Soi nội dung CK (vd "HIEUASIA A2B3C4D5") — highlight dòng khớp'
            value={contentMatch}
            onChange={(e) => setContentMatch(e.target.value)}
          />
        </CardContent>
      </Card>

      {showError ? (
        <ErrorBlock message={errorMsg ?? 'Không tải được giao dịch SePay'} onRetry={() => refetch()} />
      ) : isLoading ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">Đang tải…</CardContent>
        </Card>
      ) : txns.length === 0 ? (
        <EmptyState title="Chưa có giao dịch" description="Không có giao dịch khớp bộ lọc hiện tại." />
      ) : (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead className="border-b border-border/60 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Thời gian</th>
                  <th className="px-4 py-3 font-medium">Ngân hàng</th>
                  <th className="px-4 py-3 font-medium">Tài khoản</th>
                  <th className="px-4 py-3 text-right font-medium">Tiền vào</th>
                  <th className="px-4 py-3 font-medium">Mã tham chiếu</th>
                  <th className="px-4 py-3 font-medium">Nội dung</th>
                </tr>
              </thead>
              <tbody>
                {txns.map((t) => {
                  const matched = isMatch(t);
                  const amtIn = parseFloat(t.amount_in || '0');
                  return (
                    <tr
                      key={t.id}
                      className={cn(
                        'border-b border-border/40 last:border-0',
                        matched && 'bg-gold/10',
                      )}
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-foreground/80">
                        {fmtTs(t.transaction_date)}
                      </td>
                      <td className="px-4 py-3">{t.bank_brand_name ?? '—'}</td>
                      <td className="px-4 py-3 font-mono text-xs">{t.account_number ?? '—'}</td>
                      <td
                        className={cn(
                          'px-4 py-3 text-right font-mono',
                          amtIn > 0 ? 'text-emerald-500' : 'text-muted-foreground',
                        )}
                      >
                        {amtIn > 0 ? `+${fmtVnd(amtIn)}` : '—'}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{t.reference_number ?? '—'}</td>
                      <td className="max-w-md px-4 py-3">
                        <span className="flex items-start gap-1.5">
                          {matched && (
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                          )}
                          <span className="line-clamp-2 text-foreground/75">
                            {t.transaction_content ?? '—'}
                          </span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
