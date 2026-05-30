'use client';

/**
 * SePay đối soát — giao dịch ngân hàng thật + refund workflow.
 * UI: tabs Giao dịch / Hoàn tiền, date presets, badge mã đơn HIEUASIA,
 * sticky header, hover rows, KPI accent.
 */

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  cn,
  toast,
} from '@hieu-asia/ui';
import {
  Landmark,
  Download,
  Search,
  Activity,
  DollarSign,
  CheckCircle2,
  Undo2,
  Check,
  X as XIcon,
  Clock,
  Tag,
} from 'lucide-react';
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

type RefundStatus = 'requested' | 'approved' | 'completed' | 'rejected';
interface RefundRecord {
  id: string;
  intent_id?: string;
  reference?: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  requested_by: string;
  requested_at: string;
  accepted_by?: string;
  completed_by?: string;
  rejected_by?: string;
  note?: string;
}
interface RefundsEnvelope {
  ok: boolean;
  count?: number;
  refunds?: RefundRecord[];
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
const PROXY = '/api/admin-proxy/admin/sepay';

async function fetchSepayList(filters: Filters): Promise<ListEnvelope> {
  const qs = new URLSearchParams();
  qs.set('limit', String(LIMIT));
  if (filters.account_number) qs.set('account_number', filters.account_number);
  if (filters.amount_in) qs.set('amount_in', filters.amount_in);
  if (filters.reference_number) qs.set('reference_number', filters.reference_number);
  if (filters.date_min) qs.set('date_min', filters.date_min);
  if (filters.date_max) qs.set('date_max', filters.date_max);
  const res = await fetch(`${PROXY}/transactions?${qs.toString()}`, {
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

async function fetchRefunds(): Promise<RefundsEnvelope> {
  const res = await fetch(`${PROXY}/refunds?limit=100`, { cache: 'no-store' });
  const text = await res.text();
  try {
    return JSON.parse(text) as RefundsEnvelope;
  } catch {
    return { ok: false, error: `Invalid JSON (HTTP ${res.status})` };
  }
}

function fmtTs(ts: string) {
  const d = new Date(ts.replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
}
function fmtVnd(amount: number) {
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(amount);
}
/** Trích mã đơn hieu.asia "HIEUASIA xxxxxxxx" từ nội dung CK. */
function orderCode(content: string | null): string | null {
  const m = (content ?? '').toUpperCase().match(/HIEUASIA\s+([A-Z0-9]{8})/);
  return m?.[1] ?? null;
}
function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
}

const STATUS_STYLE: Record<RefundStatus, { label: string; cls: string }> = {
  requested: { label: 'Chờ duyệt', cls: 'bg-amber-500/15 text-amber-500' },
  approved: { label: 'Đã duyệt — chờ chuyển', cls: 'bg-blue-500/15 text-blue-500' },
  completed: { label: 'Đã hoàn tiền', cls: 'bg-emerald-500/15 text-emerald-500' },
  rejected: { label: 'Từ chối', cls: 'bg-red-500/15 text-red-500' },
};

const PRESETS: { label: string; days: number | 'today' | null }[] = [
  { label: 'Hôm nay', days: 'today' },
  { label: '7 ngày', days: 7 },
  { label: '30 ngày', days: 30 },
  { label: 'Tất cả', days: null },
];

export default function AdminSepayPage() {
  const qc = useQueryClient();
  const [tab, setTab] = React.useState<'tx' | 'refunds'>('tx');
  const [draft, setDraft] = React.useState<Filters>(EMPTY_FILTERS);
  const [filters, setFilters] = React.useState<Filters>(EMPTY_FILTERS);
  const [preset, setPreset] = React.useState<string>('Tất cả');
  const [contentMatch, setContentMatch] = React.useState('');
  const [onlyOrders, setOnlyOrders] = React.useState(false);

  const [refundTxn, setRefundTxn] = React.useState<SepayTransaction | null>(null);
  const [refundAmount, setRefundAmount] = React.useState('');
  const [refundReason, setRefundReason] = React.useState('');

  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: ['admin', 'sepay', filters],
    queryFn: () => fetchSepayList(filters),
    refetchInterval: 30_000,
  });
  const refundsQ = useQuery({
    queryKey: ['admin', 'sepay', 'refunds'],
    queryFn: fetchRefunds,
    refetchInterval: 30_000,
  });

  const allTxns: SepayTransaction[] = React.useMemo(() => data?.transactions ?? [], [data?.transactions]);
  const txns = React.useMemo(
    () => (onlyOrders ? allTxns.filter((t) => orderCode(t.transaction_content)) : allTxns),
    [allTxns, onlyOrders],
  );
  const refunds: RefundRecord[] = React.useMemo(() => refundsQ.data?.refunds ?? [], [refundsQ.data?.refunds]);
  const showError = !!error || data?.ok === false;
  const errorMsg =
    (error as Error | undefined)?.message ??
    (data?.error === 'sepay_api_error'
      ? 'Lỗi gọi SePay API (kiểm tra SEPAY_API_TOKEN trên Worker).'
      : data?.error);

  const totalIn = txns.reduce((s, t) => s + parseFloat(t.amount_in || '0'), 0);
  const orderCount = allTxns.filter((t) => orderCode(t.transaction_content)).length;
  const pendingRefunds = refunds.filter((r) => r.status === 'requested' || r.status === 'approved').length;

  const needle = contentMatch.trim().toUpperCase();
  const isMatch = (t: SepayTransaction) =>
    needle.length > 0 && (t.transaction_content ?? '').toUpperCase().includes(needle);

  // ── Refund mutations ──────────────────────────────────────────────────
  const createMut = useMutation({
    mutationFn: async (payload: { reference?: string; amount: number; reason: string }) => {
      const res = await fetch(`${PROXY}/refund`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({ ok: false, error: `HTTP ${res.status}` }));
      if (!res.ok || !body.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
      return body;
    },
    onSuccess: () => {
      toast.success('Đã tạo yêu cầu hoàn tiền', { description: 'Chờ admin duyệt (accept).' });
      setRefundTxn(null);
      setRefundReason('');
      setRefundAmount('');
      setTab('refunds');
      qc.invalidateQueries({ queryKey: ['admin', 'sepay', 'refunds'] });
    },
    onError: (e: unknown) => toast.error('Tạo yêu cầu thất bại', { description: (e as Error).message }),
  });

  const actionMut = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: 'accept' | 'complete' | 'reject' }) => {
      const res = await fetch(`${PROXY}/refund/${encodeURIComponent(id)}/${action}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({}),
      });
      const body = await res.json().catch(() => ({ ok: false, error: `HTTP ${res.status}` }));
      if (!res.ok || !body.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
      return body;
    },
    onSuccess: (_d, v) => {
      const map = { accept: 'Đã duyệt', complete: 'Đã đánh dấu hoàn tất', reject: 'Đã từ chối' };
      toast.success(map[v.action]);
      qc.invalidateQueries({ queryKey: ['admin', 'sepay', 'refunds'] });
    },
    onError: (e: unknown) => toast.error('Thao tác thất bại', { description: (e as Error).message }),
  });

  const openRefund = (t: SepayTransaction) => {
    setRefundTxn(t);
    setRefundAmount(String(Math.round(parseFloat(t.amount_in || '0'))));
    setRefundReason('');
  };
  const submitRefund = () => {
    const amt = Number(refundAmount);
    if (!Number.isFinite(amt) || amt <= 0) return toast.error('Số tiền không hợp lệ');
    if (!refundReason.trim()) return toast.error('Nhập lý do hoàn tiền');
    createMut.mutate({ reference: refundTxn?.reference_number ?? undefined, amount: amt, reason: refundReason.trim() });
  };

  const applyFilters = () => setFilters(draft);
  const resetFilters = () => { setDraft(EMPTY_FILTERS); setFilters(EMPTY_FILTERS); setPreset('Tất cả'); };
  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setPreset(p.label);
    const today = isoDaysAgo(0);
    const next: Filters =
      p.days === null ? { ...draft, date_min: '', date_max: '' }
      : p.days === 'today' ? { ...draft, date_min: today, date_max: today }
      : { ...draft, date_min: isoDaysAgo(p.days), date_max: today };
    setDraft(next);
    setFilters(next);
  };

  const exportCsv = () => {
    if (txns.length === 0) return;
    const rows = [
      ['Thời gian', 'Ngân hàng', 'Tài khoản', 'Tiền vào', 'Mã đơn', 'Mã tham chiếu', 'Nội dung'].join(','),
      ...txns.map((t) =>
        [t.transaction_date, t.bank_brand_name ?? '', t.account_number ?? '', t.amount_in ?? '',
         orderCode(t.transaction_content) ?? '', t.reference_number ?? '',
         (t.transaction_content ?? '').replace(/,/g, ';')]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','),
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
        description="Giao dịch ngân hàng thật + hoàn tiền — pull từ SePay User API."
        icon={<Landmark className="h-5 w-5" />}
        badge={allTxns.length > 0 ? <LiveBadge /> : null}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={exportCsv} disabled={txns.length === 0}>
              <Download className="mr-1.5 h-3.5 w-3.5" />Xuất CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => { refetch(); refundsQ.refetch(); }} disabled={isFetching}>
              {isFetching ? 'Đang tải…' : 'Làm mới'}
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Giao dịch tiền vào" value={txns.filter((t) => parseFloat(t.amount_in || '0') > 0).length} icon={<Activity className="h-4 w-4" />} accent="jade" />
        <KpiCard label="Tổng tiền vào (VND)" value={fmtVnd(totalIn)} icon={<DollarSign className="h-4 w-4" />} accent="gold" />
        <KpiCard label="Đơn hieu.asia" value={orderCount} hint="có mã HIEUASIA" icon={<Tag className="h-4 w-4" />} accent="purple" />
        <KpiCard label="Hoàn tiền chờ xử lý" value={pendingRefunds} icon={<Clock className="h-4 w-4" />} accent={pendingRefunds > 0 ? 'warn' : undefined} />
      </div>

      {/* Tabs */}
      <div className="inline-flex rounded-lg border border-border/60 bg-card/40 p-1">
        {([['tx', 'Giao dịch ngân hàng'], ['refunds', `Hoàn tiền${pendingRefunds ? ` · ${pendingRefunds}` : ''}`]] as const).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={cn(
              'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
              tab === k ? 'bg-gold/15 text-gold shadow-gold-rail' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'tx' ? (
        <>
          {/* Filters */}
          <Card>
            <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
              <CardTitle className="text-sm">Bộ lọc & đối soát</CardTitle>
              <div className="flex flex-wrap gap-1.5">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs transition-colors',
                      preset === p.label ? 'border-gold/40 bg-gold/10 text-gold' : 'border-border/60 text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Input placeholder="Số tài khoản" value={draft.account_number}
                  onChange={(e) => setDraft({ ...draft, account_number: e.target.value })} />
                <Input placeholder="Số tiền vào (khớp chính xác)" inputMode="numeric" value={draft.amount_in}
                  onChange={(e) => setDraft({ ...draft, amount_in: e.target.value })} />
                <Input placeholder="Mã tham chiếu" value={draft.reference_number}
                  onChange={(e) => setDraft({ ...draft, reference_number: e.target.value })} />
                <Input type="date" value={draft.date_min} onChange={(e) => { setDraft({ ...draft, date_min: e.target.value }); setPreset(''); }} />
                <Input type="date" value={draft.date_max} onChange={(e) => { setDraft({ ...draft, date_max: e.target.value }); setPreset(''); }} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={applyFilters} disabled={isFetching}><Search className="mr-1.5 h-3.5 w-3.5" />Lọc</Button>
                  <Button variant="ghost" size="sm" onClick={resetFilters}>Xoá</Button>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input className="flex-1" placeholder='Soi nội dung CK (vd "HIEUASIA A2B3C4D5")'
                  value={contentMatch} onChange={(e) => setContentMatch(e.target.value)} />
                <label className="flex shrink-0 cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                  <input type="checkbox" checked={onlyOrders} onChange={(e) => setOnlyOrders(e.target.checked)} className="accent-gold" />
                  Chỉ đơn hieu.asia
                </label>
              </div>
            </CardContent>
          </Card>

          {showError ? (
            <ErrorBlock message={errorMsg ?? 'Không tải được giao dịch SePay'} onRetry={() => refetch()} />
          ) : isLoading ? (
            <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">Đang tải…</CardContent></Card>
          ) : txns.length === 0 ? (
            <EmptyState title="Chưa có giao dịch" description="Không có giao dịch khớp bộ lọc hiện tại." />
          ) : (
            <Card>
              <CardContent className="overflow-x-auto p-0">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 z-10 border-b border-border/60 bg-card text-left text-xs text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">Thời gian</th>
                      <th className="px-4 py-3 font-medium">Đơn</th>
                      <th className="px-4 py-3 font-medium">Ngân hàng</th>
                      <th className="px-4 py-3 text-right font-medium">Tiền vào</th>
                      <th className="px-4 py-3 font-medium">Tham chiếu</th>
                      <th className="px-4 py-3 font-medium">Nội dung</th>
                      <th className="px-4 py-3 text-right font-medium">Hoàn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {txns.map((t) => {
                      const matched = isMatch(t);
                      const amtIn = parseFloat(t.amount_in || '0');
                      const code = orderCode(t.transaction_content);
                      return (
                        <tr key={t.id} className={cn('border-b border-border/40 transition-colors last:border-0 hover:bg-muted/[0.04]', matched && 'bg-gold/10')}>
                          <td className="whitespace-nowrap px-4 py-3 text-foreground/80">{fmtTs(t.transaction_date)}</td>
                          <td className="px-4 py-3">
                            {code ? (
                              <span className="inline-flex items-center gap-1 rounded bg-gold/15 px-2 py-0.5 font-mono text-xs text-gold">
                                <Tag className="h-3 w-3" />{code}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">{t.bank_brand_name ?? '—'}</td>
                          <td className={cn('px-4 py-3 text-right font-mono', amtIn > 0 ? 'text-emerald-500' : 'text-muted-foreground')}>
                            {amtIn > 0 ? `+${fmtVnd(amtIn)}` : '—'}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs">{t.reference_number ?? '—'}</td>
                          <td className="max-w-sm px-4 py-3">
                            <span className="flex items-start gap-1.5">
                              {matched && <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />}
                              <span className="line-clamp-2 text-foreground/75">{t.transaction_content ?? '—'}</span>
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {amtIn > 0 && (
                              <Button size="sm" variant="ghost" onClick={() => openRefund(t)} title="Tạo yêu cầu hoàn tiền">
                                <Undo2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Undo2 className="h-4 w-4" /> Yêu cầu hoàn tiền
              <span className="font-normal text-xs text-muted-foreground">— SePay không tự chuyển tiền; admin chuyển khoản thủ công rồi đánh dấu hoàn tất</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {refunds.length === 0 ? (
              <p className="px-6 py-10 text-center text-sm text-muted-foreground">Chưa có yêu cầu hoàn tiền nào. Vào tab "Giao dịch" → bấm ↩ để tạo.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 z-10 border-b border-border/60 bg-card text-left text-xs text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2.5 font-medium">Thời gian</th>
                      <th className="px-4 py-2.5 text-right font-medium">Số tiền</th>
                      <th className="px-4 py-2.5 font-medium">Lý do</th>
                      <th className="px-4 py-2.5 font-medium">Trạng thái</th>
                      <th className="px-4 py-2.5 text-right font-medium">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {refunds.map((r) => {
                      const st = STATUS_STYLE[r.status];
                      const busy = actionMut.isPending;
                      return (
                        <tr key={r.id} className="border-b border-border/40 transition-colors last:border-0 hover:bg-muted/[0.04]">
                          <td className="whitespace-nowrap px-4 py-2.5 text-foreground/80">{fmtTs(r.requested_at)}</td>
                          <td className="px-4 py-2.5 text-right font-mono text-red-400">−{fmtVnd(r.amount)}</td>
                          <td className="max-w-xs px-4 py-2.5"><span className="line-clamp-2 text-foreground/75">{r.reason}</span></td>
                          <td className="px-4 py-2.5"><span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', st.cls)}>{st.label}</span></td>
                          <td className="px-4 py-2.5">
                            <div className="flex justify-end gap-1.5">
                              {r.status === 'requested' && (
                                <>
                                  <Button size="sm" variant="outline" disabled={busy} onClick={() => actionMut.mutate({ id: r.id, action: 'accept' })}>
                                    <Check className="mr-1 h-3 w-3" />Duyệt
                                  </Button>
                                  <Button size="sm" variant="ghost" disabled={busy} onClick={() => actionMut.mutate({ id: r.id, action: 'reject' })}>
                                    <XIcon className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                              {r.status === 'approved' && (
                                <Button size="sm" disabled={busy} onClick={() => { if (confirm('Xác nhận ĐÃ chuyển khoản trả lại cho khách?')) actionMut.mutate({ id: r.id, action: 'complete' }); }}>
                                  <CheckCircle2 className="mr-1 h-3 w-3" />Đã hoàn tiền
                                </Button>
                              )}
                              {(r.status === 'completed' || r.status === 'rejected') && (
                                <span className="text-xs text-muted-foreground">{r.completed_by ?? r.rejected_by ?? '—'}</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Refund modal */}
      {refundTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm" onClick={() => setRefundTxn(null)}>
          <Card className="w-full max-w-md border-gold/20 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm"><Undo2 className="h-4 w-4" />Tạo yêu cầu hoàn tiền</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">
                GD gốc: <span className="font-mono">{refundTxn.reference_number ?? '—'}</span>
                {orderCode(refundTxn.transaction_content) && (
                  <span className="ml-1 rounded bg-gold/15 px-1.5 py-0.5 font-mono text-gold">{orderCode(refundTxn.transaction_content)}</span>
                )}
              </p>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Số tiền hoàn (VND)</label>
                <Input inputMode="numeric" value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Lý do</label>
                <Input placeholder="vd: khách yêu cầu huỷ, chuyển nhầm…" value={refundReason} onChange={(e) => setRefundReason(e.target.value)} />
              </div>
              <p className="rounded bg-amber-500/10 px-3 py-2 text-xs text-amber-500">
                ⚠️ Đây chỉ tạo yêu cầu chờ duyệt. SePay không tự chuyển tiền — sau khi duyệt, admin tự chuyển khoản trả lại rồi bấm "Đã hoàn tiền".
              </p>
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="ghost" size="sm" onClick={() => setRefundTxn(null)}>Huỷ</Button>
                <Button size="sm" onClick={submitRefund} disabled={createMut.isPending}>
                  {createMut.isPending ? 'Đang tạo…' : 'Tạo yêu cầu'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
