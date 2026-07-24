'use client';

/**
 * SePay đối soát — giao dịch ngân hàng thật + refund workflow.
 * UI: tabs Giao dịch / Hoàn tiền, date presets, badge mã đơn HIEUASIA,
 * sticky header, hover rows, KPI accent.
 */

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  StatusBadge,
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
  AlertTriangle,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { ErrorBlock } from '@/components/admin/error-block';
import { KpiCard } from '@/components/admin/kpi-card';
import { LiveBadge } from '@/components/admin/live-badge';
import { AdminTable, type AdminTableColumn } from '@/components/admin/table/AdminTable';
import { fmtDateTime, fmtNumber } from '@/lib/format';

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

/** Trích mã đơn hieu.asia "HIEUASIA xxxxxxxx" từ nội dung CK. */
function orderCode(content: string | null): string | null {
  const m = (content ?? '').toUpperCase().match(/HIEUASIA\s+([A-Z0-9]{8})/);
  return m?.[1] ?? null;
}
// Day key "YYYY-MM-DD" trong giờ VN (ICT, UTC+7). Nghiệp vụ chạy ở Việt Nam nên
// phải dịch mốc thời gian +7h TRƯỚC khi cắt ngày UTC; nếu không, preset "Hôm
// nay"/7/30 ngày và cột doanh thu theo ngày sẽ lệch 1 ngày lúc gần nửa đêm.
function ictDayKey(ms: number): string {
  return new Date(ms + 7 * 3_600_000).toISOString().slice(0, 10);
}
function isoDaysAgo(days: number): string {
  return ictDayKey(Date.now() - days * 86_400_000);
}

const STATUS_BADGE: Record<
  RefundStatus,
  { status: 'success' | 'warning' | 'error' | 'info' | 'neutral'; label: string }
> = {
  requested: { status: 'warning', label: 'Chờ duyệt' },
  approved: { status: 'info', label: 'Đã duyệt — chờ chuyển' },
  completed: { status: 'success', label: 'Đã hoàn tiền' },
  rejected: { status: 'error', label: 'Từ chối' },
};

const PRESETS: { label: string; days: number | 'today' | null }[] = [
  { label: 'Hôm nay', days: 'today' },
  { label: '7 ngày', days: 7 },
  { label: '30 ngày', days: 30 },
  { label: 'Tất cả', days: null },
];

export default function AdminSepayPage() {
  // useSearchParams() requires a Suspense boundary (App Router CSR bailout) —
  // the refund deep-link (?refund_ref=…) from the session detail page reads it.
  return (
    <React.Suspense fallback={<div className="h-72 animate-pulse rounded bg-muted/30" />}>
      <AdminSepayPageInner />
    </React.Suspense>
  );
}

function AdminSepayPageInner() {
  const qc = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  // Honor a ?tab= deep-link (e.g. /sepay?tab=refunds from the ledger) on first
  // render; falls back to the dashboard tab for any missing/invalid value.
  const initialTab = ((): 'dashboard' | 'tx' | 'reconcile' | 'refunds' => {
    const t = searchParams.get('tab');
    return t === 'tx' || t === 'reconcile' || t === 'refunds' ? t : 'dashboard';
  })();
  const [tab, setTab] = React.useState<'dashboard' | 'tx' | 'reconcile' | 'refunds'>(initialTab);
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

  // Deep-link from the session detail page: /sepay?refund_ref=…&refund_amount=…&refund_reason=…
  // Synthesize a minimal SepayTransaction so the EXISTING refund modal + createMut
  // (POST /admin/sepay/refund) fire unchanged. We then strip the params from the
  // URL so a refresh doesn't re-open the modal. Runs once on mount.
  const deepLinkHandled = React.useRef(false);
  React.useEffect(() => {
    if (deepLinkHandled.current) return;
    const ref = searchParams.get('refund_ref');
    const amountParam = searchParams.get('refund_amount');
    const reasonParam = searchParams.get('refund_reason');
    if (!ref && !amountParam) return;
    deepLinkHandled.current = true;
    setRefundTxn({
      id: `deeplink-${ref ?? 'txn'}`,
      transaction_date: '',
      account_number: null,
      amount_in: amountParam ?? '0',
      amount_out: '0',
      accumulated: '0',
      transaction_content: null,
      reference_number: ref,
      bank_brand_name: null,
      sub_account: null,
      code: null,
    });
    if (amountParam) setRefundAmount(String(Math.round(Number(amountParam) || 0)));
    if (reasonParam) setRefundReason(reasonParam);
    toast.info('Mở yêu cầu hoàn tiền từ phiên', {
      description: 'Kiểm tra mã giao dịch + số tiền trước khi tạo yêu cầu.',
    });
    // Drop the query params so a reload doesn't re-trigger the modal.
    router.replace('/sepay', { scroll: false });
  }, [searchParams, router]);

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
          .map((v) => {
            let s = String(v);
            if (/^[=+\-@]/.test(s)) s = `'${s}`; // chống CSV/formula injection khi mở Excel
            return `"${s.replace(/"/g, '""')}"`;
          }).join(','),
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

  // Table A — Giao dịch (txns). Cells close over isMatch + openRefund.
  const txColumns: AdminTableColumn<SepayTransaction>[] = [
    {
      id: 'time',
      header: 'Thời gian',
      className: 'whitespace-nowrap text-foreground/80',
      cell: (t) => fmtDateTime(t.transaction_date),
    },
    {
      id: 'order',
      header: 'Đơn',
      cell: (t) => {
        const code = orderCode(t.transaction_content);
        return code ? (
          <span className="inline-flex items-center gap-1 rounded bg-gold/15 px-2 py-0.5 font-mono text-xs text-gold">
            <Tag className="h-3 w-3" />{code}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        );
      },
    },
    {
      id: 'bank',
      header: 'Ngân hàng',
      hideOnMobile: true,
      cell: (t) => t.bank_brand_name ?? '—',
    },
    {
      id: 'amount',
      header: 'Tiền vào',
      className: 'text-right',
      cell: (t) => {
        const amtIn = parseFloat(t.amount_in || '0');
        return (
          <span className={cn('font-mono tabular-nums', amtIn > 0 ? 'text-emerald-500' : 'text-muted-foreground')}>
            {amtIn > 0 ? `+${fmtNumber(amtIn)}` : '—'}
          </span>
        );
      },
    },
    {
      // Gap audit 2026-07-02 — SePay trả amount_out + accumulated (số dư chạy)
      // từ ngày đầu nhưng bảng chỉ hiện tiền vào → đối soát thiếu nửa bức tranh.
      id: 'amount_out',
      header: 'Tiền ra',
      className: 'text-right',
      cell: (t) => {
        const v = parseFloat(t.amount_out || '0');
        return v > 0 ? (
          <span className="font-mono tabular-nums text-red-400">−{fmtNumber(v)}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
    },
    {
      id: 'accumulated',
      header: 'Số dư',
      className: 'text-right',
      hideOnMobile: true,
      cell: (t) => {
        const v = parseFloat(t.accumulated || '0');
        return v > 0 ? (
          <span className="font-mono tabular-nums text-foreground/80">{fmtNumber(v)}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
    },
    {
      id: 'reference',
      header: 'Tham chiếu',
      className: 'max-w-[16ch] truncate font-mono text-xs',
      hideOnMobile: true,
      cell: (t) =>
        t.reference_number ? <span title={t.reference_number}>{t.reference_number}</span> : '—',
    },
    {
      id: 'content',
      header: 'Nội dung',
      className: 'max-w-sm',
      cell: (t) => {
        const matched = isMatch(t);
        return (
          <span className="flex items-start gap-1.5">
            {matched && <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />}
            <span className="line-clamp-2 text-foreground/75">{t.transaction_content ?? '—'}</span>
          </span>
        );
      },
    },
    {
      id: 'refund',
      header: 'Hoàn',
      className: 'text-right',
      cell: (t) => {
        const amtIn = parseFloat(t.amount_in || '0');
        return amtIn > 0 ? (
          <Button size="sm" variant="ghost" onClick={() => openRefund(t)} aria-label="Tạo yêu cầu hoàn tiền" title="Tạo yêu cầu hoàn tiền">
            <Undo2 className="h-3.5 w-3.5" aria-hidden />
          </Button>
        ) : null;
      },
    },
  ];

  // Table B — Yêu cầu hoàn tiền (refunds). Cells close over actionMut.
  const refundColumns: AdminTableColumn<RefundRecord>[] = [
    {
      id: 'time',
      header: 'Thời gian',
      className: 'whitespace-nowrap text-foreground/80',
      cell: (r) => fmtDateTime(r.requested_at),
    },
    {
      id: 'amount',
      header: 'Số tiền',
      className: 'text-right',
      cell: (r) => <span className="font-mono tabular-nums text-red-400">−{fmtNumber(r.amount)}</span>,
    },
    {
      id: 'reason',
      header: 'Lý do',
      className: 'max-w-xs',
      hideOnMobile: true,
      cell: (r) => <span className="line-clamp-2 text-foreground/75">{r.reason}</span>,
    },
    {
      // Gap audit 2026-07-02 — intent_id/reference có trên record nhưng không
      // hiển thị → không tra được refund thuộc đơn nào. intent_id là khoá nối
      // sang đối soát/payments; nối thẳng tới hồ sơ khách cần backend trả
      // user_id (follow-up, không làm bừa ở FE).
      id: 'intent',
      header: 'Đơn gốc',
      className: 'font-mono text-xs',
      hideOnMobile: true,
      cell: (r) =>
        r.intent_id ? (
          <span title={r.reference ? `ref: ${r.reference}` : r.intent_id}>
            {r.intent_id.slice(0, 14)}…
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      id: 'actors',
      header: 'Ai xử lý',
      className: 'max-w-[220px] text-xs',
      hideOnMobile: true,
      cell: (r) => {
        const steps = [
          r.requested_by ? `yêu cầu: ${r.requested_by}` : null,
          r.accepted_by ? `duyệt: ${r.accepted_by}` : null,
          r.completed_by ? `hoàn: ${r.completed_by}` : null,
          r.rejected_by ? `từ chối: ${r.rejected_by}` : null,
          r.note ? `ghi chú: ${r.note}` : null,
        ].filter((s): s is string => !!s);
        return steps.length ? (
          <span className="line-clamp-2 text-muted-foreground" title={steps.join('\n')}>
            {steps.join(' · ')}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
    },
    {
      id: 'status',
      header: 'Trạng thái',
      cell: (r) => {
        const st = STATUS_BADGE[r.status];
        return <StatusBadge status={st.status} label={st.label} />;
      },
    },
    {
      id: 'actions',
      header: 'Thao tác',
      className: 'text-right',
      cell: (r) => {
        const busy = actionMut.isPending;
        return (
          <div className="flex justify-end gap-1.5">
            {r.status === 'requested' && (
              <>
                <Button size="sm" variant="outline" disabled={busy} onClick={() => actionMut.mutate({ id: r.id, action: 'accept' })}>
                  <Check className="mr-1 h-3 w-3" />Duyệt
                </Button>
                <Button size="sm" variant="ghost" disabled={busy} aria-label="Từ chối yêu cầu hoàn tiền" title="Từ chối" onClick={() => { if (confirm('Từ chối yêu cầu hoàn tiền này?')) actionMut.mutate({ id: r.id, action: 'reject' }); }}>
                  <XIcon className="h-3 w-3" aria-hidden />
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
        );
      },
    },
  ];

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
        <KpiCard label="Tổng tiền vào (VND)" value={fmtNumber(totalIn)} icon={<DollarSign className="h-4 w-4" />} accent="gold" />
        <KpiCard label="Đơn hieu.asia" value={orderCount} hint="có mã HIEUASIA" icon={<Tag className="h-4 w-4" />} accent="purple" />
        <KpiCard label="Hoàn tiền chờ xử lý" value={pendingRefunds} icon={<Clock className="h-4 w-4" />} accent={pendingRefunds > 0 ? 'warn' : undefined} />
      </div>

      {/* Tabs */}
      <div className="inline-flex rounded-lg border border-border/60 bg-card/40 p-1">
        {([['dashboard', 'Tổng quan'], ['tx', 'Giao dịch ngân hàng'], ['reconcile', 'Đối soát'], ['refunds', `Hoàn tiền${pendingRefunds ? ` · ${pendingRefunds}` : ''}`]] as const).map(([k, label]) => (
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

      {tab === 'dashboard' ? (
        <DashboardView />
      ) : tab === 'tx' ? (
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
          ) : (
            <Card>
              <CardContent className="p-0">
                <AdminTable
                  rows={txns}
                  columns={txColumns}
                  getRowId={(t) => t.id}
                  loading={isLoading}
                  rowClassName={(t) => (isMatch(t) ? 'bg-gold/10' : undefined)}
                  caption="Danh sách giao dịch ngân hàng"
                  empty={<EmptyState title="Chưa có giao dịch" description="Không có giao dịch khớp bộ lọc hiện tại." />}
                />
              </CardContent>
            </Card>
          )}
        </>
      ) : tab === 'reconcile' ? (
        <ReconcileView />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Undo2 className="h-4 w-4" /> Yêu cầu hoàn tiền
              <span className="font-normal text-xs text-muted-foreground">— SePay không tự chuyển tiền; admin chuyển khoản thủ công rồi đánh dấu hoàn tất</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <AdminTable
              rows={refunds}
              columns={refundColumns}
              getRowId={(r) => r.id}
              loading={refundsQ.isLoading}
              caption="Danh sách yêu cầu hoàn tiền"
              empty={<span className="text-sm text-muted-foreground">Chưa có yêu cầu hoàn tiền nào. Vào tab "Giao dịch" → bấm ↩ để tạo.</span>}
            />
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

// ── Tab Đối soát: ghép tiền ngân hàng ↔ đơn (GET /admin/sepay/reconcile) ──────
interface ReconTxn {
  id: string;
  transaction_date: string;
  amount_in: string;
  transaction_content: string | null;
  reference_number: string | null;
  bank_brand_name: string | null;
}
interface ReconOrder {
  id: string;
  tier: string;
  user_id: string;
  amount_due: number;
  status: string;
  paid_at: string | null;
  underpaid: boolean;
}
interface ReconEnvelope {
  ok: boolean;
  summary?: { matched: number; orphan: number; other: number };
  matched?: { txn: ReconTxn; code: string; order: ReconOrder | null }[];
  orphan?: { txn: ReconTxn; code: string }[];
  other?: { txn: ReconTxn }[];
  error?: string;
}

function ReconcileView() {
  const q = useQuery({
    queryKey: ['admin', 'sepay', 'reconcile'],
    queryFn: async (): Promise<ReconEnvelope> => {
      const r = await fetch(`${PROXY}/reconcile?limit=100`, { cache: 'no-store' });
      const t = await r.text();
      try {
        return JSON.parse(t) as ReconEnvelope;
      } catch {
        return { ok: false, error: `Invalid JSON (HTTP ${r.status})` };
      }
    },
    refetchInterval: 30_000,
  });
  const d = q.data;
  if (q.isLoading) {
    return <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">Đang đối soát…</CardContent></Card>;
  }
  if (!d?.ok) {
    return <ErrorBlock message={d?.error === 'sepay_api_error' ? 'Lỗi gọi SePay API' : d?.error ?? 'Không đối soát được'} onRetry={() => q.refetch()} />;
  }
  const matched = d.matched ?? [];
  const orphan = d.orphan ?? [];
  const other = d.other ?? [];

  // Table C — Khớp đơn (matched). Row = { txn, code, order }.
  type MatchedRow = { txn: ReconTxn; code: string; order: ReconOrder | null };
  const matchedColumns: AdminTableColumn<MatchedRow>[] = [
    {
      id: 'time',
      header: 'Thời gian',
      className: 'whitespace-nowrap text-foreground/80',
      cell: (r) => fmtDateTime(r.txn.transaction_date),
    },
    {
      id: 'code',
      header: 'Mã đơn',
      cell: (r) => (
        <span className="inline-flex items-center gap-1 rounded bg-gold/15 px-2 py-0.5 font-mono text-xs text-gold"><Tag className="h-3 w-3" />{r.code}</span>
      ),
    },
    {
      id: 'tier',
      header: 'Gói',
      hideOnMobile: true,
      cell: (r) => r.order?.tier ?? '—',
    },
    {
      id: 'customer',
      header: 'Khách',
      className: 'font-mono text-xs',
      hideOnMobile: true,
      cell: (r) => (r.order?.user_id ? <a href={`/customers/${r.order.user_id}`} className="text-gold hover:underline">{r.order.user_id.slice(0, 12)}…</a> : '—'),
    },
    {
      id: 'amount',
      header: 'Tiền vào',
      className: 'text-right',
      cell: (r) => <span className="font-mono tabular-nums text-emerald-500">+{new Intl.NumberFormat('vi-VN').format(parseFloat(r.txn.amount_in || '0'))}</span>,
    },
    {
      id: 'status',
      header: 'Trạng thái',
      cell: (r) =>
        r.order?.underpaid ? (
          <StatusBadge status="error" label="Thiếu tiền" />
        ) : r.order?.status === 'paid' ? (
          <StatusBadge status="success" label="Đã trả" />
        ) : (
          <StatusBadge status="warning" label={r.order?.status ?? '—'} />
        ),
    },
  ];

  // Table D — Tiền mồ côi (orphan). Row = { txn, code }. Cùng cột/header như
  // bảng thủ công trước (Thời gian / Mã / Tiền vào / Tham chiếu).
  type OrphanRow = (typeof orphan)[number];
  const orphanColumns: AdminTableColumn<OrphanRow>[] = [
    {
      id: 'time',
      header: 'Thời gian',
      className: 'whitespace-nowrap text-foreground/80',
      cell: (r) => fmtDateTime(r.txn.transaction_date),
    },
    {
      id: 'code',
      header: 'Mã',
      className: 'font-mono text-xs',
      cell: (r) => r.code,
    },
    {
      id: 'amount',
      header: 'Tiền vào',
      className: 'text-right font-mono tabular-nums',
      cell: (r) => `+${new Intl.NumberFormat('vi-VN').format(parseFloat(r.txn.amount_in || '0'))}`,
    },
    {
      id: 'reference',
      header: 'Tham chiếu',
      className: 'font-mono text-xs',
      cell: (r) => r.txn.reference_number ?? '—',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <KpiCard label="Khớp đơn" value={matched.length} icon={<CheckCircle2 className="h-4 w-4" />} accent="jade" />
        <KpiCard label="Tiền mồ côi" value={orphan.length} hint="có mã nhưng không thấy đơn" icon={<AlertTriangle className="h-4 w-4" />} accent={orphan.length ? 'red' : undefined} />
        <KpiCard label="Khác (không mã đơn)" value={other.length} icon={<Landmark className="h-4 w-4" />} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />Khớp đơn ({matched.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <AdminTable
            rows={matched}
            columns={matchedColumns}
            getRowId={(r) => r.txn.id ?? r.code}
            caption="Danh sách giao dịch khớp đơn"
            empty={
              <span className="text-sm text-muted-foreground">
                Chưa có giao dịch khớp đơn. Sẽ xuất hiện khi có thanh toán thật mang mã HIEUASIA.
              </span>
            }
          />
        </CardContent>
      </Card>

      {orphan.length > 0 && (
        <Card className="border-red-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm text-red-500">
              <AlertTriangle className="h-4 w-4" />Tiền mồ côi ({orphan.length}) — có mã nhưng không thấy đơn (đơn hết hạn?)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <AdminTable
              rows={orphan}
              columns={orphanColumns}
              getRowId={(r) => r.txn.id ?? r.code}
              caption="Danh sách tiền mồ côi"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ── "Sửa gói": vá MỘT user bị lệch gói (đã trả tiền nhưng plan DB sai) ─────────
// Client CHỈ gửi user_id; worker tự suy ra gói đúng từ audit log rồi PATCH (nếu
// thực sự lệch — idempotent). Owner-gated ở proxy. Dialog xác nhận hiện rõ
// "đang X → sẽ thành Y" trước khi chạy; không có tiền nào di chuyển (chỉ sửa gói).
interface DriftRow {
  user_id: string;
  expected_plan: string;
  actual_plan: string | null;
  tier: string;
  last_paid_at: string;
}

function DriftFixDialog({ drift, onSuccess }: { drift: DriftRow; onSuccess?: () => void }) {
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  const submit = React.useCallback(async () => {
    setPending(true);
    let res: { ok: boolean; changed?: boolean; reason?: string; error?: string };
    try {
      const r = await fetch(`${PROXY}/drift/fix`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ user_id: drift.user_id }),
      });
      const text = await r.text();
      try {
        res = JSON.parse(text);
      } catch {
        res = { ok: false, error: `Phản hồi không hợp lệ (HTTP ${r.status})` };
      }
    } catch (e) {
      res = { ok: false, error: (e as Error)?.message ?? 'Lỗi mạng' };
    }
    setPending(false);
    if (res.ok) {
      if (res.changed) {
        toast.success('Đã sửa gói cho user.', { description: `Gói mới: ${drift.expected_plan}` });
      } else {
        toast.info('Không cần sửa.', {
          description: res.reason === 'already_in_sync' ? 'Gói đã đúng.' : 'Không tìm thấy đơn đã trả.',
        });
      }
      setOpen(false);
      onSuccess?.();
    } else {
      toast.error('Sửa gói thất bại', { description: res.error });
    }
  }, [drift, onSuccess]);

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Check className="mr-1 h-3 w-3" />Sửa gói
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa gói cho user này?</DialogTitle>
            <DialogDescription>
              User <span className="font-mono">{drift.user_id.slice(0, 12)}…</span> đã thanh toán
              nhưng gói trong hệ thống chưa đúng. Sẽ đổi gói từ{' '}
              <strong className="text-red-500">{drift.actual_plan ?? 'free'}</strong> →{' '}
              <strong className="text-emerald-500">{drift.expected_plan}</strong>. Đây chỉ là sửa
              quyền lợi gói — KHÔNG có tiền nào được chuyển. Gói đúng được hệ thống tự tính lại từ
              lịch sử thanh toán; nếu thực ra đã đúng, sẽ không có gì thay đổi.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
              Huỷ
            </Button>
            <Button onClick={submit} disabled={pending}>
              {pending ? 'Đang sửa…' : 'Sửa gói'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ── Tab Tổng quan: doanh thu từ audit /payment/transactions ───────────────────
const TIER_LABEL: Record<string, string> = {
  premium: 'Premium',
  subscription_monthly: 'Mentor tháng',
  subscription_yearly: 'Mentor năm',
  lifetime: 'Lifetime',
  lifetime_onetime: 'Lifetime',
};
interface AuditRecord {
  id: string;
  created_at: string;
  type: string;
  amount?: number | null;
  metadata?: { tier?: string } | null;
}

function DashboardView() {
  const q = useQuery({
    queryKey: ['admin', 'sepay', 'revenue'],
    queryFn: async (): Promise<{ ok: boolean; records?: AuditRecord[]; error?: string }> => {
      const r = await fetch('/api/admin-proxy/payment/transactions?limit=500', { cache: 'no-store' });
      const t = await r.text();
      try {
        return JSON.parse(t);
      } catch {
        return { ok: false, error: `Invalid JSON (HTTP ${r.status})` };
      }
    },
    refetchInterval: 60_000,
  });
  const healthQ = useQuery({
    queryKey: ['admin', 'sepay', 'webhook-health'],
    queryFn: async (): Promise<{ ok: boolean; last_webhook_at?: string | null; webhooks_24h?: number; last_paid_at?: string | null; total_webhooks?: number }> => {
      const r = await fetch('/api/admin-proxy/admin/sepay/webhook-health', { cache: 'no-store' });
      try { return JSON.parse(await r.text()); } catch { return { ok: false }; }
    },
    refetchInterval: 60_000,
  });
  const subsQ = useQuery({
    queryKey: ['admin', 'sepay', 'subscriptions'],
    queryFn: async (): Promise<{ ok: boolean; subscriptions?: { id: string; plan: string; plan_expires_at: string | null; days_left: number | null; expired: boolean }[] }> => {
      const r = await fetch('/api/admin-proxy/admin/sepay/subscriptions', { cache: 'no-store' });
      try { return JSON.parse(await r.text()); } catch { return { ok: false }; }
    },
    refetchInterval: 120_000,
  });
  const driftQ = useQuery({
    queryKey: ['admin', 'sepay', 'drift'],
    queryFn: async (): Promise<{ ok: boolean; checked?: number; drifts?: { user_id: string; expected_plan: string; actual_plan: string | null; tier: string; last_paid_at: string }[] }> => {
      const r = await fetch('/api/admin-proxy/admin/sepay/drift', { cache: 'no-store' });
      try { return JSON.parse(await r.text()); } catch { return { ok: false }; }
    },
    refetchInterval: 300_000,
  });
  const d = q.data;
  if (q.isLoading) return <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">Đang tải…</CardContent></Card>;
  if (!d?.ok) return <ErrorBlock message={d?.error ?? 'Không tải được số liệu'} onRetry={() => q.refetch()} />;
  const recs = d.records ?? [];
  const paid = recs.filter((r) => r.type === 'intent_paid');
  const created = recs.filter((r) => r.type === 'intent_created');
  const revenue = paid.reduce((s, r) => s + (r.amount ?? 0), 0);
  const aov = paid.length ? Math.round(revenue / paid.length) : 0;
  const conv = created.length ? Math.round((paid.length / created.length) * 100) : 0;

  const byTier: Record<string, { count: number; rev: number }> = {};
  for (const r of paid) {
    const tier = (r.metadata?.tier as string) || 'khác';
    byTier[tier] = byTier[tier] || { count: 0, rev: 0 };
    byTier[tier].count += 1;
    byTier[tier].rev += r.amount ?? 0;
  }
  const tierRows = Object.entries(byTier).sort((a, b) => b[1].rev - a[1].rev);
  const maxTierRev = Math.max(1, ...tierRows.map(([, v]) => v.rev));

  const days: { day: string; rev: number }[] = [];
  for (let i = 13; i >= 0; i--) days.push({ day: ictDayKey(Date.now() - i * 86_400_000), rev: 0 });
  for (const r of paid) {
    const t = r.created_at ? new Date(r.created_at).getTime() : NaN;
    if (Number.isNaN(t)) continue;
    const key = ictDayKey(t);
    const slot = days.find((x) => x.day === key);
    if (slot) slot.rev += r.amount ?? 0;
  }
  const maxDayRev = Math.max(1, ...days.map((x) => x.rev));

  // Table E — Lệch thanh toán (drift). Dùng lại shape DriftRow mà dialog sửa gói
  // đã nhận. Thêm header (bảng thủ công trước không có header).
  const driftColumns: AdminTableColumn<DriftRow>[] = [
    {
      id: 'customer',
      header: 'Khách',
      cell: (x) => (
        <a href={`/customers/${x.user_id}`} className="font-mono text-xs text-gold hover:underline">{x.user_id.slice(0, 12)}…</a>
      ),
    },
    {
      id: 'plan',
      header: 'Lệch gói',
      className: 'text-xs',
      cell: (x) => (
        <>cần <span className="text-emerald-500">{x.expected_plan}</span> · đang <span className="text-red-500">{x.actual_plan ?? 'free'}</span></>
      ),
    },
    {
      id: 'paid',
      header: 'Trả lần cuối',
      className: 'text-right text-xs text-muted-foreground',
      cell: (x) => fmtDateTime(x.last_paid_at),
    },
    {
      id: 'action',
      header: '',
      className: 'text-right',
      cell: (x) => <DriftFixDialog drift={x} onSuccess={() => driftQ.refetch()} />,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Doanh thu" value={fmtNumber(revenue)} icon={<DollarSign className="h-4 w-4" />} accent="gold" />
        <KpiCard label="Đơn đã trả" value={paid.length} icon={<CheckCircle2 className="h-4 w-4" />} accent="jade" />
        <KpiCard label="Giá TB / đơn" value={fmtNumber(aov)} icon={<Tag className="h-4 w-4" />} accent="purple" />
        <KpiCard label="Tỉ lệ chốt" value={`${conv}%`} hint={`${paid.length}/${created.length} đơn`} icon={<Activity className="h-4 w-4" />} />
      </div>

      {driftQ.data?.ok && (driftQ.data.drifts?.length ?? 0) > 0 && (
        <Card className="border-red-500/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm text-red-500">
              <AlertTriangle className="h-4 w-4" />Lệch thanh toán ({driftQ.data.drifts!.length}) — đã trả tiền nhưng gói chưa đúng
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <AdminTable
              rows={driftQ.data.drifts!}
              columns={driftColumns}
              getRowId={(x) => x.user_id}
              caption="Danh sách user lệch thanh toán"
            />
          </CardContent>
        </Card>
      )}
      {paid.length === 0 && (
        <p className="rounded bg-amber-500/10 px-4 py-3 text-sm text-amber-500">
          Chưa có đơn đã thanh toán nào — biểu đồ sẽ hiện khi có giao dịch thật.
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-sm">Doanh thu 14 ngày</CardTitle></CardHeader>
          <CardContent>
            <div className="flex h-32 items-end gap-1">
              {days.map((x) => (
                <div key={x.day} className="group flex flex-1 flex-col items-center justify-end" title={`${x.day}: ${fmtNumber(x.rev)}`}>
                  <div className="w-full rounded-t bg-gold/60 transition-all group-hover:bg-gold" style={{ height: `${Math.max(2, (x.rev / maxDayRev) * 100)}%` }} />
                </div>
              ))}
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
              <span>{days[0]?.day.slice(5)}</span>
              <span>{days[days.length - 1]?.day.slice(5)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Doanh thu theo gói</CardTitle></CardHeader>
          <CardContent className="space-y-2.5">
            {tierRows.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">—</p>
            ) : (
              tierRows.map(([tier, v]) => (
                <div key={tier}>
                  <div className="flex justify-between text-xs">
                    <span>{TIER_LABEL[tier] ?? tier} <span className="text-muted-foreground">({v.count})</span></span>
                    <span className="font-mono tabular-nums text-foreground/80">{fmtNumber(v.rev)}</span>
                  </div>
                  <div className="mt-0.5 h-1.5 rounded bg-muted/10">
                    <div className="h-1.5 rounded bg-gold/70" style={{ width: `${(v.rev / maxTierRev) * 100}%` }} />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              Webhook SePay
              {healthQ.data?.ok && (healthQ.data.webhooks_24h ?? 0) > 0 ? (
                <StatusBadge status="success" label="Đang nhận" />
              ) : (
                <StatusBadge status="neutral" label="Chưa có webhook" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Webhook cuối</span><span className="font-mono">{healthQ.data?.last_webhook_at ? fmtDateTime(healthQ.data.last_webhook_at) : '—'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Webhook 24h</span><span className="font-mono">{healthQ.data?.webhooks_24h ?? 0}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Thanh toán cuối</span><span className="font-mono">{healthQ.data?.last_paid_at ? fmtDateTime(healthQ.data.last_paid_at) : '—'}</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-sm"><Clock className="h-4 w-4" />Subscription sắp/đã hết hạn</CardTitle></CardHeader>
          <CardContent className="p-0">
            {(() => {
              if (!subsQ.data?.ok) return <p className="px-4 py-6 text-center text-sm text-muted-foreground">—</p>;
              const subs = (subsQ.data.subscriptions ?? [])
                .filter((s) => s.plan !== 'lifetime' && s.days_left !== null && s.days_left <= 14)
                .sort((a, b) => (a.days_left ?? 0) - (b.days_left ?? 0));
              if (subs.length === 0) return <p className="px-4 py-6 text-center text-sm text-muted-foreground">Không có sub sắp hết hạn (14 ngày).</p>;
              type SubRow = (typeof subs)[number];
              const subColumns: AdminTableColumn<SubRow>[] = [
                {
                  id: 'id',
                  header: 'Mã',
                  className: 'font-mono text-xs',
                  cell: (s) => `${s.id.slice(0, 12)}…`,
                },
                {
                  id: 'plan',
                  header: 'Gói',
                  cell: (s) => TIER_LABEL[s.plan] ?? s.plan,
                },
                {
                  id: 'status',
                  header: 'Trạng thái',
                  className: 'text-right',
                  cell: (s) =>
                    s.expired ? (
                      <StatusBadge status="error" label="Hết hạn" />
                    ) : (
                      <StatusBadge status="warning" label={`còn ${s.days_left} ngày`} />
                    ),
                },
              ];
              return (
                <AdminTable
                  rows={subs}
                  columns={subColumns}
                  getRowId={(s) => s.id}
                  caption="Subscription sắp/đã hết hạn"
                />
              );
            })()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
