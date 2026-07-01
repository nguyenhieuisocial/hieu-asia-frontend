'use client';

/**
 * /admin/sessions — Wave 60.71.T2.sessions redesign.
 *
 * Vault 107 §5.6 Tier 2. Replaces the Wave 60.20 hand-rolled table + dialog
 * stack with the AdminTable primitive (Wave 60.71.T2.customers), KpiCard
 * strip (Wave 60.9), and a flag/IP/city column powered by Wave 60.20-fu
 * Worker `request_metadata` capture.
 *
 *   ├─ This file (~280 LOC orchestration: queries, KPI strip, filter chrome,
 *   │            bulk action bar, confirm dialogs)
 *   ├─ <AdminTable> primitive (components/admin/table/AdminTable.tsx)
 *   ├─ <SessionRowActions> DropdownMenu (Wave 60.68)
 *   └─ format.ts helpers (humanize id, country flag, duration)
 *
 * RSC discipline:
 *   - Icons pre-rendered at the call site (Wave 60.65.P0a)
 *   - No inline arrow fns in Server→Client props (Wave 60.66.HF1) — page
 *     stays Client because it owns interactive filter state
 *   - Defensive `Array.isArray` on data crossing the React Query boundary
 *     (Wave 60.65.P0c)
 *
 * Behavioural parity with the pre-redesign page:
 *   - Bulk select + CSV export of selection
 *   - Export CSV of the visible result set (client-side via csv-export util)
 *   - Re-orchestrate single + bulk-delete with confirm phrase
 *   - URL-synced filter (?status=…&sort=…) for dashboard CTAs
 */

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ShortId } from '@/components/admin/ShortId';
import { SavedFiltersMenu } from '@/components/admin/SavedFiltersMenu';
import { useSavedFilters } from '@/lib/saved-filters';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  StatusBadge,
  toast,
} from '@hieu-asia/ui';
import {
  Activity,
  AlertTriangle,
  ChevronDown,
  Clock,
  CreditCard,
  Download,
  Filter,
  Globe,
  ListTodo,
  Trash2,
  Users,
  Wallet,
} from 'lucide-react';
import type { TaskStatus } from '@hieu-asia/types';
import { listSessions, getSessionsStats, patchSession } from '@/lib/admin-api';
import { exportToCSV, fmtCsvFilename } from '@/lib/csv-export';
import type { AdminSession } from '@/lib/mock-data';
import { MockBanner } from '@/components/mock-banner';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { ErrorBlock } from '@/components/admin/error-block';
import { KpiCard } from '@/components/admin/kpi-card';
import {
  AdminTable,
  type AdminTableColumn,
} from '@/components/admin/table/AdminTable';
import { SessionRowActions } from '@/components/admin/sessions/SessionRowActions';
import {
  countryFlag,
  fmtDateTime,
  fmtDuration,
  fmtRelative,
  fmtVnd,
  humanizeSessionId,
} from '@/components/admin/sessions/format';

const PAGE_SIZE = 20;
const CONFIRM_PHRASE = 'XÓA HÀNG LOẠT';

// CSV export columns + pretty headers. The backend /export endpoint only
// returns rows when scoped to a single user_id, so export runs client-side
// from the rows already in hand — it covers the current result set the
// operator can see, not the whole DB.
const SESSION_CSV_HEADERS = {
  short_code: 'Mã phiên',
  session_id: 'Session ID',
  created_at: 'Tạo lúc',
  user_email: 'Email',
  user_id: 'User ID',
  status: 'Trạng thái',
  paid: 'Đã trả',
  tier: 'Gói',
  reading_type: 'Loại',
  channel: 'Kênh',
  country: 'Quốc gia',
  city: 'Thành phố',
  duration_seconds: 'Thời lượng (giây)',
  primary_concern: 'Mối quan tâm',
  label: 'Tên gợi nhớ',
  note: 'Ghi chú',
  error: 'Lỗi',
} as const;

/** Flatten an AdminSession into a CSV-friendly row. */
function sessionToCsvRow(s: AdminSession): Record<string, string | number | boolean | null> {
  return {
    short_code: s.short_code ?? '',
    session_id: s.session_id,
    created_at: s.created_at ?? '',
    user_email: s.user_email ?? '',
    user_id: s.user_id ?? '',
    status: s.status,
    paid: s.paid ?? '',
    tier: s.tier ?? '',
    reading_type: s.reading_type ?? '',
    channel: s.channel ?? '',
    country: s.country ?? '',
    city: s.city ?? '',
    duration_seconds: s.duration_seconds ?? '',
    primary_concern: s.primary_concern ?? '',
    label: s.label ?? '',
    note: s.note ?? '',
    error: s.error ?? '',
  };
}

type SortOrder = 'newest' | 'oldest';
type StatusFilter = TaskStatus | '';
type PaidFilter = '' | '1' | '0';
type ReadingTypeFilter = string; // '' = all
type ChannelFilter = string; // '' = all
type CountryFilter = string; // '' = all; otherwise an ISO-3166-1 alpha-2 code

// Today there is effectively ONE reading pipeline, so these mostly read
// "tuvi_batu" / "web". The option lists are intentionally small + extendable —
// variety grows as more reading types / channels launch.
const READING_TYPE_OPTIONS: Array<{ value: ReadingTypeFilter; label: string }> = [
  { value: '', label: 'Tất cả loại' },
  { value: 'tuvi_batu', label: 'Tử Vi · Bát Tự' },
  { value: 'palmistry', label: 'Xem tướng tay' },
  { value: 'face', label: 'Xem tướng mặt' },
];

const CHANNEL_OPTIONS: Array<{ value: ChannelFilter; label: string }> = [
  { value: '', label: 'Tất cả kênh' },
  { value: 'web', label: 'Web' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'zalo', label: 'Zalo' },
];

const PAID_OPTIONS: Array<{ value: PaidFilter; label: string }> = [
  { value: '', label: 'Tất cả thanh toán' },
  { value: '1', label: 'Đã trả' },
  { value: '0', label: 'Chưa trả' },
];

/** Human label for a reading_type code; falls back to the raw code. */
function readingTypeLabel(rt: string | null | undefined): string {
  if (!rt) return '—';
  return READING_TYPE_OPTIONS.find((o) => o.value === rt)?.label ?? rt;
}

/** Human label for a channel code; falls back to the raw code. */
function channelLabel(ch: string | null | undefined): string {
  if (!ch) return '—';
  return CHANNEL_OPTIONS.find((o) => o.value === ch)?.label ?? ch;
}

const STATUS_TONE: Record<TaskStatus, React.ComponentProps<typeof StatusBadge>['status']> = {
  queued: 'neutral',
  running: 'info',
  completed: 'success',
  failed: 'error',
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  queued: 'Đang chờ',
  running: 'Đang chạy',
  completed: 'Hoàn tất',
  failed: 'Lỗi',
};

const STATUS_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'queued', label: 'Đang chờ' },
  { value: 'running', label: 'Đang chạy' },
  { value: 'completed', label: 'Hoàn tất' },
  { value: 'failed', label: 'Lỗi' },
];

// Pre-render icons at module scope (Wave 60.65.P0a).
const ICON_USERS = <Users className="h-4 w-4" aria-hidden />;
const ICON_ACTIVITY = <Activity className="h-4 w-4" aria-hidden />;
const ICON_CLOCK = <Clock className="h-4 w-4" aria-hidden />;
const ICON_GLOBE = <Globe className="h-4 w-4" aria-hidden />;
const ICON_LIST = <ListTodo className="h-5 w-5" aria-hidden />;
const ICON_DOWNLOAD = <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden />;
const ICON_FILTER = <Filter className="h-3 w-3 text-muted-foreground" aria-hidden />;
const ICON_CHEVRON = <ChevronDown className="h-3 w-3 text-muted-foreground" aria-hidden />;
const ICON_TRASH = <Trash2 className="mr-1.5 h-3.5 w-3.5" aria-hidden />;
const ICON_WALLET = <Wallet className="h-4 w-4" aria-hidden />;
const ICON_CREDIT = <CreditCard className="h-4 w-4" aria-hidden />;
const ICON_WARN = <AlertTriangle className="h-4 w-4" aria-hidden />;

function parseStatusParam(raw: string | null): StatusFilter {
  if (!raw) return '';
  if (raw === 'pending') return 'queued'; // Wave 52.1 deeplink alias
  if (raw === 'queued' || raw === 'running' || raw === 'completed' || raw === 'failed') {
    return raw;
  }
  return '';
}

function parseSortParam(raw: string | null): SortOrder {
  return raw === 'oldest' ? 'oldest' : 'newest';
}

async function reOrchestrate(sessionId: string) {
  // timeout 15s: re-orchestrate gọi worker → Supabase; nếu treo, nút không kẹt
  // mãi (AbortError → throw → mutation onError toast) thay vì đơ nút "Đang…".
  const r = await fetch(`/api/admin/sessions/${sessionId}/re-orchestrate`, {
    method: 'POST',
    signal: AbortSignal.timeout(15000),
  });
  const data = await r.json().catch(() => ({ ok: false, error: `HTTP ${r.status}` }));
  if (!r.ok || !data.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
  return data;
}

async function bulkDelete(sessionIds: string[]) {
  const r = await fetch('/api/admin/sessions/bulk-delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_ids: sessionIds, confirm: 'DELETE_BULK' }),
  });
  const data = await r.json().catch(() => ({ ok: false, error: `HTTP ${r.status}` }));
  if (!r.ok || !data.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
  return data;
}

export default function AdminSessionsPage() {
  // useSearchParams() requires a Suspense boundary (App Router CSR bailout).
  // Local boundary keeps sidebar/topbar mounted while ?tab= resolves.
  return (
    <React.Suspense fallback={<div className="h-72 animate-pulse rounded bg-muted/30" />}>
      <AdminSessionsPageInner />
    </React.Suspense>
  );
}

function AdminSessionsPageInner() {
  const qc = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Wave 52.1 — hydrate filter + sort from URL on mount so dashboard CTAs
  // like `/sessions?status=pending&sort=oldest` deeplink straight into a
  // filtered, oldest-first view.
  const [status, setStatus] = React.useState<StatusFilter>(() =>
    parseStatusParam(searchParams?.get('status') ?? null),
  );
  const [sort, setSort] = React.useState<SortOrder>(() =>
    parseSortParam(searchParams?.get('sort') ?? null),
  );
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  // Sessions enrichment wave — payment / type / channel + date-range + the
  // group-by-user scope. Hydrated from URL so dashboard CTAs + bookmarks
  // deeplink into a pre-filtered view.
  const [paid, setPaid] = React.useState<PaidFilter>(
    () => (searchParams?.get('paid') as PaidFilter) || '',
  );
  const [readingType, setReadingType] = React.useState<ReadingTypeFilter>(
    () => searchParams?.get('reading_type') ?? '',
  );
  const [channel, setChannel] = React.useState<ChannelFilter>(
    () => searchParams?.get('channel') ?? '',
  );
  // Sessions polish — country filter (backend `country` param = ISO alpha-2,
  // e.g. VN). Stored uppercase so it matches the cf-ipcountry-derived values.
  const [country, setCountry] = React.useState<CountryFilter>(
    () => (searchParams?.get('country') ?? '').toUpperCase(),
  );
  const [fromDate, setFromDate] = React.useState<string>(
    () => searchParams?.get('from') ?? '',
  );
  const [toDate, setToDate] = React.useState<string>(() => searchParams?.get('to') ?? '');
  const [userId, setUserId] = React.useState<string>(
    () => searchParams?.get('user_id') ?? '',
  );
  // Saved filter presets — client-side (localStorage). Purely additive; captures
  // only the text-search + primary status filter to stay safe against the
  // URL-synced multi-dimension filter state on this page.
  const savedFilters = useSavedFilters<{ search: string; status: StatusFilter }>(
    'sessions',
    { search: '', status: '' },
  );
  const [selected, setSelected] = React.useState<string[]>([]);
  const [confirmBulkOpen, setConfirmBulkOpen] = React.useState(false);
  const [bulkConfirmText, setBulkConfirmText] = React.useState('');
  const [confirmSingleId, setConfirmSingleId] = React.useState<string | null>(null);
  // Wave 65 — rename/note dialog state.
  const [renameId, setRenameId] = React.useState<string | null>(null);
  const [renameLabel, setRenameLabel] = React.useState('');
  const [renameNote, setRenameNote] = React.useState('');

  // Persist filter/sort to URL so reloads + bookmarks keep state.
  React.useEffect(() => {
    const next = new URLSearchParams();
    if (status) next.set('status', status);
    if (sort !== 'newest') next.set('sort', sort);
    if (paid) next.set('paid', paid);
    if (readingType) next.set('reading_type', readingType);
    if (channel) next.set('channel', channel);
    if (country) next.set('country', country);
    if (fromDate) next.set('from', fromDate);
    if (toDate) next.set('to', toDate);
    if (userId) next.set('user_id', userId);
    const qs = next.toString();
    router.replace(qs ? `?${qs}` : '?', { scroll: false });
  }, [status, sort, paid, readingType, channel, country, fromDate, toDate, userId, router]);

  const { data, isLoading, refetch, isFetching, error } = useQuery({
    queryKey: [
      'admin',
      'sessions',
      { status, search, page, paid, readingType, channel, country, fromDate, toDate, userId },
    ],
    queryFn: () =>
      listSessions({
        status: status || undefined,
        search,
        page,
        page_size: PAGE_SIZE,
        paid: paid || undefined,
        reading_type: readingType || undefined,
        channel: channel || undefined,
        country: country || undefined,
        from: fromDate || undefined,
        to: toDate || undefined,
        user_id: userId || undefined,
      }),
    // Real-time: poll every 15s ONLY while a session is still running (queue is
    // live). Idle pages don't poll. The fn reads the latest fetched rows so the
    // interval flips itself off once the last running session settles.
    refetchInterval: (query) => {
      const liveRows = query.state.data?.rows;
      const hasRunning =
        Array.isArray(liveRows) && liveRows.some((r) => r.status === 'running');
      return hasRunning ? 15_000 : false;
    },
  });

  // Wave 65 — whole-DB KPI totals (the page-slice aggregates below only see
  // the current 20 rows). Falls back to page-slice when the endpoint is down.
  const { data: stats } = useQuery({
    queryKey: ['admin', 'sessions', 'stats'],
    queryFn: getSessionsStats,
    staleTime: 30_000,
    refetchInterval: 30_000,
  });

  // Defensive Array.isArray (Wave 60.65.P0c) on async data
  const rawRows: AdminSession[] = React.useMemo(
    () => (Array.isArray(data?.rows) ? data.rows : []),
    [data?.rows],
  );

  // Client-side sort on the current page; server pagination is independent.
  const rows = React.useMemo(() => {
    const copy = [...rawRows];
    copy.sort((a, b) => {
      const ta = new Date(a.created_at).getTime();
      const tb = new Date(b.created_at).getTime();
      return sort === 'oldest' ? ta - tb : tb - ta;
    });
    return copy;
  }, [rawRows, sort]);

  // STT (số thứ tự) — running ordinal continuous across pages (page 2 → 21,22…),
  // newest-first. Display-only: HA-XXXXX (short_code) stays the stable per-session id.
  const sttById = React.useMemo(() => {
    const m: Record<string, number> = {};
    rows.forEach((r, i) => {
      m[r.session_id] = (page - 1) * PAGE_SIZE + i + 1;
    });
    return m;
  }, [rows, page]);

  // Any filter active → the whole-DB /stats total no longer describes the
  // result set; fall back to the filtered data.total so the count + paging
  // reflect what the operator is actually looking at (#50).
  const filterActive = !!(
    search ||
    status ||
    paid ||
    readingType ||
    channel ||
    country ||
    fromDate ||
    toDate ||
    userId
  );
  const total = filterActive
    ? (data?.total ?? 0)
    : (stats?.total ?? data?.total ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Page-slice aggregates — fallback when /stats endpoint is unavailable.
  const completedCountPage = rows.filter((r) => r.status === 'completed').length;
  const runningCountPage = rows.filter((r) => r.status === 'running').length;
  const last1hCountPage = rows.filter((r) => {
    const t = new Date(r.created_at).getTime();
    return !Number.isNaN(t) && Date.now() - t < 3600 * 1000;
  }).length;

  // Whole-DB KPI values when /stats is available; else page-slice fallback.
  const kpiRunning = stats?.by_status?.running ?? runningCountPage;
  const kpiLast1h = stats?.last_1h ?? last1hCountPage;
  const kpiCompleted = stats?.by_status?.completed ?? completedCountPage;

  // Sessions enrichment wave — payment + health KPIs. Whole-DB from /stats when
  // present; else page-slice fallback (revenue can't be page-summed without an
  // amount field, so revenue shows "—" until the backend ships revenue_vnd).
  const paidCountPage = rows.filter((r) => r.paid === true).length;
  const kpiRevenueVnd = stats?.revenue_vnd; // undefined → "—"
  const kpiPaidCount = stats?.paid_count ?? paidCountPage;
  const kpiStuckCount = stats?.stuck_count; // undefined → "—" (needs backend)

  const uniqueUsers = new Set(rows.map((r) => r.user_id || r.user_email).filter(Boolean)).size;
  const completedDurations = rows
    .filter((r) => r.status === 'completed' && r.duration_seconds != null)
    .map((r) => r.duration_seconds as number);
  const avgDuration = completedDurations.length
    ? Math.round(
        completedDurations.reduce((sum, d) => sum + d, 0) / completedDurations.length,
      )
    : null;

  const reOrchestrateMut = useMutation({
    mutationFn: reOrchestrate,
    onSuccess: (_d, id) => {
      toast.success('Đã trigger re-orchestrate', { description: `Session ${id}` });
      qc.invalidateQueries({ queryKey: ['admin', 'sessions'] });
    },
    onError: (e) =>
      toast.error('Re-orchestrate thất bại', { description: (e as Error).message }),
  });

  // Wave 65 — set label/note on a session.
  const renameMut = useMutation({
    mutationFn: (vars: { id: string; label: string; note: string }) =>
      patchSession(vars.id, { label: vars.label, note: vars.note }),
    onSuccess: (res) => {
      if (res.ok) {
        toast.success('Đã lưu tên / ghi chú');
        setRenameId(null);
        qc.invalidateQueries({ queryKey: ['admin', 'sessions'] });
      } else {
        toast.error('Lưu thất bại', { description: res.error });
      }
    },
    onError: (e) => toast.error('Lưu thất bại', { description: (e as Error).message }),
  });

  const bulkDeleteMut = useMutation({
    mutationFn: bulkDelete,
    onSuccess: (_d, ids) => {
      toast.success(`Đã xóa ${ids.length} phiên`);
      setSelected([]);
      setConfirmBulkOpen(false);
      setBulkConfirmText('');
      qc.invalidateQueries({ queryKey: ['admin', 'sessions'] });
    },
    onError: (e) => toast.error('Xóa thất bại', { description: (e as Error).message }),
  });

  // ---- Stable callbacks (no inline arrow fns in row-action props) ----

  const handleStatusChange = React.useCallback((v: string) => {
    setStatus(v === '__all' ? '' : (v as StatusFilter));
    setPage(1);
  }, []);

  const handlePaidChange = React.useCallback((v: string) => {
    setPaid(v === '__all' ? '' : (v as PaidFilter));
    setPage(1);
  }, []);

  const handleReadingTypeChange = React.useCallback((v: string) => {
    setReadingType(v === '__all' ? '' : v);
    setPage(1);
  }, []);

  const handleChannelChange = React.useCallback((v: string) => {
    setChannel(v === '__all' ? '' : v);
    setPage(1);
  }, []);

  const handleCountryChange = React.useCallback((v: string) => {
    setCountry(v === '__all' ? '' : v);
    setPage(1);
  }, []);

  const handleFromDateChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFromDate(e.target.value);
      setPage(1);
    },
    [],
  );

  const handleToDateChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setToDate(e.target.value);
      setPage(1);
    },
    [],
  );

  // Group-by-user: clicking a user cell scopes the list to that user_id. Click
  // the active chip again (handled in the cell) to clear.
  const handleFilterByUser = React.useCallback((id: string) => {
    setUserId((prev) => (prev === id ? '' : id));
    setPage(1);
  }, []);

  const handleClearUserFilter = React.useCallback(() => {
    setUserId('');
    setPage(1);
  }, []);

  const handleSortChange = React.useCallback((v: string) => {
    setSort(v as SortOrder);
  }, []);

  const handleSearch = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

  const handleRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  // CSV exports run client-side from the rows already fetched (the visible
  // result set, current filter + page). The backend /export endpoint only
  // returns data when scoped to a single user_id, so an "all" call there
  // yields a header-only file — this keeps the button honest (#18).
  const handleExportAll = React.useCallback(() => {
    if (rows.length === 0) return;
    exportToCSV(rows.map(sessionToCsvRow), fmtCsvFilename('sessions'), SESSION_CSV_HEADERS);
    toast.success(`Đang tải CSV ${rows.length} phiên (trang hiện tại)…`);
  }, [rows]);

  const handleExportSelected = React.useCallback(() => {
    if (selected.length === 0) return;
    const picked = new Set(selected);
    const chosen = rows.filter((r) => picked.has(r.session_id));
    if (chosen.length === 0) return;
    exportToCSV(chosen.map(sessionToCsvRow), fmtCsvFilename('sessions'), SESSION_CSV_HEADERS);
    toast.success(`Đang tải CSV ${chosen.length} phiên đã chọn…`);
  }, [selected, rows]);

  const handleClearSelected = React.useCallback(() => {
    setSelected([]);
  }, []);

  const handleOpenBulkConfirm = React.useCallback(() => {
    setConfirmBulkOpen(true);
  }, []);

  const handleBulkDialogChange = React.useCallback((o: boolean) => {
    setConfirmBulkOpen(o);
    if (!o) setBulkConfirmText('');
  }, []);

  const handleBulkConfirmTextChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setBulkConfirmText(e.target.value);
    },
    [],
  );

  const handleBulkDeleteCancel = React.useCallback(() => {
    setConfirmBulkOpen(false);
  }, []);

  const handleBulkDeleteConfirm = React.useCallback(() => {
    bulkDeleteMut.mutate(selected);
  }, [bulkDeleteMut, selected]);

  const handleSingleDialogChange = React.useCallback((o: boolean) => {
    if (!o) setConfirmSingleId(null);
  }, []);

  const handleSingleDeleteCancel = React.useCallback(() => {
    setConfirmSingleId(null);
  }, []);

  const handleSingleDeleteConfirm = React.useCallback(() => {
    if (confirmSingleId) {
      bulkDeleteMut.mutate([confirmSingleId]);
      setConfirmSingleId(null);
    }
  }, [bulkDeleteMut, confirmSingleId]);

  const handlePrevPage = React.useCallback(() => {
    setPage((p) => Math.max(1, p - 1));
  }, []);

  const handleNextPage = React.useCallback(() => {
    setPage((p) => Math.min(totalPages, p + 1));
  }, [totalPages]);

  const handleRowClick = React.useCallback(
    (row: AdminSession) => {
      router.push(`/sessions/${encodeURIComponent(row.session_id)}`);
    },
    [router],
  );

  const handleReOrchestrate = React.useCallback(
    (id: string) => {
      reOrchestrateMut.mutate(id);
    },
    [reOrchestrateMut],
  );

  const handleAskDelete = React.useCallback((id: string) => {
    setConfirmSingleId(id);
  }, []);

  const handleAskRename = React.useCallback(
    (id: string) => {
      const row = rows.find((r) => r.session_id === id);
      setRenameLabel(row?.label ?? '');
      setRenameNote(row?.note ?? '');
      setRenameId(id);
    },
    [rows],
  );

  const handleRenameSave = React.useCallback(() => {
    if (renameId) {
      renameMut.mutate({ id: renameId, label: renameLabel, note: renameNote });
    }
  }, [renameId, renameLabel, renameNote, renameMut]);

  // ---- Column config ----

  const columns = React.useMemo<AdminTableColumn<AdminSession>[]>(
    () => [
      {
        id: 'stt',
        header: 'STT',
        width: '48px',
        className: 'text-right tabular-nums text-muted-foreground',
        cell: (s) => sttById[s.session_id] ?? '',
      },
      {
        id: 'created_at',
        header: 'Tạo',
        sortKey: 'created_at',
        width: '140px',
        cell: (s) => (
          <div>
            <div className="font-mono text-xs text-foreground/85">{fmtDateTime(s.created_at)}</div>
            <div className="text-[10px] text-muted-foreground">{fmtRelative(s.created_at)}</div>
          </div>
        ),
      },
      {
        id: 'session_id',
        header: 'Session',
        sortKey: 'session_id',
        width: '200px',
        cell: (s) => (
          <div className="min-w-0">
            <span
              className="inline-flex items-center rounded border border-gold/25 bg-gold/10 px-1.5 py-0.5 font-mono text-[11px] font-medium text-gold"
              title={`session_id: ${s.session_id}`}
            >
              {s.short_code ?? humanizeSessionId(s.session_id)}
            </span>
            {s.label ? (
              <div className="mt-0.5 truncate text-xs text-foreground/85" title={s.label}>
                {s.label}
              </div>
            ) : null}
          </div>
        ),
      },
      {
        id: 'user',
        header: 'User',
        sortKey: 'user_email',
        // Wave 63 — was showing the raw user_id UUID under the email +
        // "—" for anonymous sessions ("tên user không chính xác / ID quá
        // dài"). Now: real email (or "Khách ẩn danh" for guest sessions) +
        // a short, copyable user_id chip instead of the full 36-char UUID.
        // Sessions enrichment wave — clicking the email filters the list to
        // that user (group-by-user). stopPropagation so it doesn't also open
        // the row detail.
        cell: (s) => (
          <div className="min-w-0">
            {s.user_email && s.user_email.includes('@') && s.user_id ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFilterByUser(s.user_id);
                }}
                className="truncate text-left text-foreground underline-offset-2 hover:text-gold hover:underline"
                title={`Lọc theo user: ${s.user_email}`}
              >
                {s.user_email}
              </button>
            ) : (
              <div className="truncate text-foreground">
                {s.user_email && s.user_email.includes('@') ? (
                  s.user_email
                ) : (
                  <span className="italic text-muted-foreground">Khách ẩn danh</span>
                )}
              </div>
            )}
            {s.user_id && <ShortId id={s.user_id} className="mt-0.5" />}
          </div>
        ),
      },
      {
        id: 'paid',
        header: 'Thanh toán',
        width: '120px',
        cell: (s) => {
          // null → not enriched by backend yet → "—". true → green badge +
          // tier. false → muted "Chưa".
          if (s.paid == null) {
            return <span className="text-muted-foreground">—</span>;
          }
          if (s.paid) {
            return (
              <div className="min-w-0">
                <span className="inline-flex items-center rounded border border-jade/30 bg-jade/10 px-1.5 py-0.5 text-[11px] font-medium text-jade-700 dark:text-jade-50">
                  Đã trả
                </span>
                {s.tier ? (
                  <div className="mt-0.5 truncate text-[10px] text-muted-foreground" title={s.tier}>
                    {s.tier}
                  </div>
                ) : null}
              </div>
            );
          }
          return <span className="text-xs text-muted-foreground">Chưa</span>;
        },
      },
      {
        id: 'concern',
        header: 'Mối quan tâm',
        hideOnMobile: true,
        cell: (s) => (
          <span className="line-clamp-1 text-foreground/85">{s.primary_concern}</span>
        ),
      },
      {
        id: 'reading_type',
        header: 'Loại',
        width: '130px',
        hideOnMobile: true,
        cell: (s) =>
          s.reading_type ? (
            <span className="inline-flex items-center rounded border border-gold/20 bg-gold/5 px-1.5 py-0.5 text-[11px] text-foreground/85">
              {readingTypeLabel(s.reading_type)}
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        id: 'channel',
        header: 'Kênh',
        width: '100px',
        hideOnMobile: true,
        cell: (s) =>
          s.channel ? (
            <span className="text-foreground/85">{channelLabel(s.channel)}</span>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        id: 'geo',
        header: 'Vị trí',
        width: '160px',
        hideOnMobile: true,
        cell: (s) => {
          const flag = countryFlag(s.country);
          if (!s.country && !s.city) {
            return <span className="text-muted-foreground">—</span>;
          }
          return (
            <div className="min-w-0">
              <div className="truncate text-foreground/90">
                <span className="mr-1.5" aria-hidden>
                  {flag}
                </span>
                {s.city ?? s.country}
              </div>
              {s.ip && (
                <div
                  className="truncate font-mono text-[10px] text-muted-foreground"
                  title={s.ip}
                >
                  {s.ip}
                </div>
              )}
            </div>
          );
        },
      },
      {
        id: 'duration',
        header: 'Thời lượng',
        sortKey: 'duration_seconds',
        width: '90px',
        className: 'text-right tabular-nums',
        hideOnMobile: true,
        cell: (s) => (
          <span className="text-foreground/90">{fmtDuration(s.duration_seconds)}</span>
        ),
      },
      {
        id: 'status',
        header: 'Trạng thái',
        sortKey: 'status',
        width: '150px',
        // Failed sessions surface the error inline (red icon + truncated msg,
        // full text in the title tooltip) so operators can triage without
        // opening the detail page.
        cell: (s) => (
          <div className="min-w-0">
            <StatusBadge status={STATUS_TONE[s.status]} label={STATUS_LABEL[s.status]} />
            {s.status === 'failed' && s.error ? (
              <div
                className="mt-0.5 flex items-center gap-1 text-[10px] text-red-600 dark:text-red-400"
                title={s.error}
              >
                <AlertTriangle className="h-3 w-3 shrink-0" aria-hidden />
                <span className="truncate">{s.error}</span>
              </div>
            ) : null}
          </div>
        ),
      },
      {
        id: 'actions',
        header: '',
        width: '48px',
        cell: (s) => (
          <SessionRowActions
            sessionId={s.session_id}
            onReOrchestrate={handleReOrchestrate}
            onDelete={handleAskDelete}
            onRename={handleAskRename}
            reOrchPending={reOrchestrateMut.isPending}
          />
        ),
      },
    ],
    [
      sttById,
      handleReOrchestrate,
      handleAskDelete,
      handleAskRename,
      handleFilterByUser,
      reOrchestrateMut.isPending,
    ],
  );

  const statusLabel =
    STATUS_OPTIONS.find((o) => o.value === status)?.label ?? 'Tất cả trạng thái';
  const sortLabel = sort === 'oldest' ? 'Cũ nhất' : 'Mới nhất';
  const paidLabel = PAID_OPTIONS.find((o) => o.value === paid)?.label ?? 'Tất cả thanh toán';
  const readingTypeLabelSel =
    READING_TYPE_OPTIONS.find((o) => o.value === readingType)?.label ?? 'Tất cả loại';
  const channelLabelSel =
    CHANNEL_OPTIONS.find((o) => o.value === channel)?.label ?? 'Tất cả kênh';
  // Sessions polish — country options derived from the distinct `country`
  // values on the current page (plus the active selection so it never drops
  // out of its own dropdown). Sorted alphabetically; flag emoji via the
  // shared countryFlag() helper. Empty list ⇒ the dropdown is hidden below.
  const countryOptions = React.useMemo<CountryFilter[]>(() => {
    const set = new Set<string>();
    for (const r of rows) {
      if (r.country) set.add(r.country.toUpperCase());
    }
    if (country) set.add(country);
    return Array.from(set).sort();
  }, [rows, country]);
  const countryLabelSel = country
    ? `${countryFlag(country)} ${country}`.trim()
    : 'Tất cả quốc gia';
  const hasActiveFilter = filterActive;
  const showError = !!error;
  const errorMsg = (error as Error | undefined)?.message;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Phiên phân tích"
        description={
          <>
            Mỗi phiên = 1 task pipeline + 1 báo cáo. Click row để xem state JSON đầy đủ
            và lifecycle timeline.
          </>
        }
        icon={ICON_LIST}
        badge={
          total > 0 ? (
            <span className="rounded-full border border-gold/20 bg-gold/10 px-2 py-0.5 font-mono text-[10px] text-gold">
              {total} phiên
            </span>
          ) : null
        }
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportAll}
            disabled={rows.length === 0}
            title="Xuất các phiên đang hiển thị trên trang hiện tại ra file CSV."
          >
            {ICON_DOWNLOAD}
            Xuất CSV trang này
          </Button>
        }
      />

      <MockBanner source={data?._source} />

      {filterActive && !stats && (
        <div className="rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-amber-700 dark:text-amber-200">
          Số liệu chỉ trong trang hiện tại — tải lại để lấy toàn bộ.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Tổng phiên"
          value={total}
          icon={ICON_USERS}
          accent="gold"
          hint={stats ? 'toàn hệ thống' : `trang này: ${rows.length}`}
        />
        <KpiCard
          label="Đang chạy"
          value={kpiRunning}
          icon={ICON_ACTIVITY}
          accent={kpiRunning > 0 ? 'jade' : 'purple'}
          hint={stats ? 'toàn hệ thống' : 'trang này'}
        />
        <KpiCard
          label="1h gần nhất"
          value={kpiLast1h}
          icon={ICON_CLOCK}
          accent="purple"
          hint={stats ? 'toàn hệ thống' : 'trang này'}
        />
        <KpiCard
          label="Thời lượng TB"
          value={avgDuration != null ? fmtDuration(avgDuration) : '—'}
          icon={ICON_GLOBE}
          accent="gold"
          hint={`${kpiCompleted} hoàn tất · ${uniqueUsers} user`}
        />
        <KpiCard
          label="Doanh thu"
          value={fmtVnd(kpiRevenueVnd)}
          icon={ICON_WALLET}
          accent="jade"
          hint={kpiRevenueVnd != null ? 'toàn hệ thống' : 'chờ backend'}
        />
        <KpiCard
          label="Đã thanh toán"
          value={kpiPaidCount}
          icon={ICON_CREDIT}
          accent="gold"
          hint={stats?.paid_count != null ? 'toàn hệ thống' : 'trang này'}
        />
        <KpiCard
          label="Phiên treo"
          value={kpiStuckCount != null ? kpiStuckCount : '—'}
          icon={ICON_WARN}
          accent={kpiStuckCount != null && kpiStuckCount > 0 ? 'red' : 'purple'}
          hint={kpiStuckCount != null ? 'chạy quá lâu' : 'chờ backend'}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
          <CardDescription>
            Tìm theo mã phiên / email / tên trên toàn hệ thống, kết hợp với bộ
            lọc trạng thái / thanh toán / ngày để thu hẹp kết quả.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Tìm theo mã phiên / email / tên…"
              title="Tìm kiếm trên toàn hệ thống theo mã phiên, email, hoặc tên gợi nhớ."
              value={search}
              onChange={handleSearch}
              className="min-w-0 flex-1 sm:max-w-md"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-10 items-center gap-1.5 rounded-md border border-gold/20 bg-card/60 px-3 text-sm text-foreground transition-all duration-300 ease-editorial hover:border-gold/50"
                  aria-label="Lọc theo trạng thái"
                >
                  {ICON_FILTER}
                  <span>{statusLabel}</span>
                  {ICON_CHEVRON}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[12rem]">
                <DropdownMenuLabel>Trạng thái</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={status || '__all'}
                  onValueChange={handleStatusChange}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <DropdownMenuRadioItem
                      key={opt.value || '__all'}
                      value={opt.value || '__all'}
                    >
                      {opt.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-10 items-center gap-1.5 rounded-md border border-gold/20 bg-card/60 px-3 text-sm text-foreground transition-all duration-300 ease-editorial hover:border-gold/50"
                  aria-label="Lọc theo thanh toán"
                >
                  {ICON_FILTER}
                  <span>{paidLabel}</span>
                  {ICON_CHEVRON}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[12rem]">
                <DropdownMenuLabel>Thanh toán</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={paid || '__all'}
                  onValueChange={handlePaidChange}
                >
                  {PAID_OPTIONS.map((opt) => (
                    <DropdownMenuRadioItem
                      key={opt.value || '__all'}
                      value={opt.value || '__all'}
                    >
                      {opt.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-10 items-center gap-1.5 rounded-md border border-gold/20 bg-card/60 px-3 text-sm text-foreground transition-all duration-300 ease-editorial hover:border-gold/50"
                  aria-label="Lọc theo loại"
                >
                  {ICON_FILTER}
                  <span>{readingTypeLabelSel}</span>
                  {ICON_CHEVRON}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[12rem]">
                <DropdownMenuLabel>Loại</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={readingType || '__all'}
                  onValueChange={handleReadingTypeChange}
                >
                  {READING_TYPE_OPTIONS.map((opt) => (
                    <DropdownMenuRadioItem
                      key={opt.value || '__all'}
                      value={opt.value || '__all'}
                    >
                      {opt.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-10 items-center gap-1.5 rounded-md border border-gold/20 bg-card/60 px-3 text-sm text-foreground transition-all duration-300 ease-editorial hover:border-gold/50"
                  aria-label="Lọc theo kênh"
                >
                  {ICON_FILTER}
                  <span>{channelLabelSel}</span>
                  {ICON_CHEVRON}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[12rem]">
                <DropdownMenuLabel>Kênh</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={channel || '__all'}
                  onValueChange={handleChannelChange}
                >
                  {CHANNEL_OPTIONS.map((opt) => (
                    <DropdownMenuRadioItem
                      key={opt.value || '__all'}
                      value={opt.value || '__all'}
                    >
                      {opt.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Sessions polish — country filter. Options come from the distinct
                country codes on the current page; hidden entirely when none are
                present so the chrome stays clean for single-market traffic. */}
            {countryOptions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-10 items-center gap-1.5 rounded-md border border-gold/20 bg-card/60 px-3 text-sm text-foreground transition-all duration-300 ease-editorial hover:border-gold/50"
                    aria-label="Lọc theo quốc gia"
                  >
                    {ICON_FILTER}
                    <span>{countryLabelSel}</span>
                    {ICON_CHEVRON}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[12rem]">
                  <DropdownMenuLabel>Quốc gia</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={country || '__all'}
                    onValueChange={handleCountryChange}
                  >
                    <DropdownMenuRadioItem value="__all">
                      Tất cả quốc gia
                    </DropdownMenuRadioItem>
                    {countryOptions.map((cc) => (
                      <DropdownMenuRadioItem key={cc} value={cc}>
                        {countryFlag(cc)} {cc}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <div className="flex items-center gap-1.5">
              <label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Từ
              </label>
              <Input
                type="date"
                value={fromDate}
                onChange={handleFromDateChange}
                aria-label="Lọc từ ngày"
                className="h-10 w-[9.5rem]"
              />
              <label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Đến
              </label>
              <Input
                type="date"
                value={toDate}
                onChange={handleToDateChange}
                aria-label="Lọc đến ngày"
                className="h-10 w-[9.5rem]"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-10 items-center gap-1.5 rounded-md border border-gold/20 bg-card/60 px-3 text-sm text-foreground transition-all duration-300 ease-editorial hover:border-gold/50"
                  aria-label="Sắp xếp"
                >
                  <span>{sortLabel}</span>
                  {ICON_CHEVRON}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[10rem]">
                <DropdownMenuLabel>Sắp xếp</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSortChange}>
                  <DropdownMenuRadioItem value="newest">Mới nhất</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="oldest">Cũ nhất</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isFetching}
            >
              {isFetching ? 'Đang tải…' : 'Làm mới'}
            </Button>
            <SavedFiltersMenu
              className="ml-auto"
              presets={savedFilters.presets}
              onApply={(name) => {
                const p = savedFilters.loadPreset(name);
                if (p) {
                  setSearch(p.search);
                  setStatus(p.status);
                  setPage(1);
                }
              }}
              onDelete={savedFilters.deletePreset}
              onSave={(name) => savedFilters.savePreset(name, { search, status })}
              saveHint="Lưu bộ lọc hiện tại"
            />
          </div>
          {userId ? (
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Đang lọc theo user:</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 font-mono text-gold">
                {userId.slice(0, 8)}…
                <button
                  type="button"
                  onClick={handleClearUserFilter}
                  className="text-gold/70 hover:text-gold"
                  aria-label="Bỏ lọc theo user"
                >
                  ×
                </button>
              </span>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách</CardTitle>
          <CardDescription>
            Hiển thị {rows.length} / {total} phiên. Click row để xem chi tiết.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showError && (
            <div className="mb-4">
              <ErrorBlock
                compact
                message={errorMsg ?? 'Không tải được dữ liệu phiên.'}
                onRetry={handleRefresh}
              />
            </div>
          )}

          <AdminTable<AdminSession>
            rows={rows}
            columns={columns}
            onRowClick={handleRowClick}
            loading={isLoading}
            onBulkSelect={setSelected}
            getRowId={getSessionId}
            caption="Danh sách phiên phân tích"
            empty={
              <EmptyState
                title={
                  hasActiveFilter
                    ? 'Không có phiên khớp bộ lọc'
                    : 'Chưa có phiên phân tích nào'
                }
                description={
                  hasActiveFilter
                    ? 'Thử bỏ filter hoặc reset search query.'
                    : 'Khi user bắt đầu một phiên đọc bài, dòng đầu tiên sẽ xuất hiện ở đây kèm trạng thái real-time.'
                }
                className="border-0 bg-transparent"
              />
            }
          />

          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Trang <span className="text-gold">{page}</span> / {totalPages} ·{' '}
              <span className="text-muted-foreground">{total} bản ghi</span>
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={page <= 1}
                className="rounded border border-gold/20 px-2.5 py-1 transition-all duration-300 ease-editorial hover:border-gold/40 disabled:opacity-40"
              >
                ← Trước
              </button>
              <button
                type="button"
                onClick={handleNextPage}
                disabled={page >= totalPages}
                className="rounded border border-gold/20 px-2.5 py-1 transition-all duration-300 ease-editorial hover:border-gold/40 disabled:opacity-40"
              >
                Sau →
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating bulk-action bar */}
      {selected.length > 0 && (
        <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 lg:left-[calc(50%+8rem)]">
          <div className="flex items-center gap-2 rounded-full border border-gold/40 bg-card/95 px-3 py-2 shadow-2xl backdrop-blur">
            <span className="px-2 font-mono text-xs text-gold">
              {selected.length} đã chọn
            </span>
            <Button size="sm" variant="outline" onClick={handleExportSelected}>
              {ICON_DOWNLOAD}
              Xuất CSV {selected.length}
            </Button>
            <Button
              size="sm"
              onClick={handleOpenBulkConfirm}
              className="bg-red-500/90 text-foreground hover:bg-red-500"
            >
              {ICON_TRASH}
              Xóa {selected.length} phiên
            </Button>
            <Button size="sm" variant="ghost" onClick={handleClearSelected}>
              Bỏ chọn
            </Button>
          </div>
        </div>
      )}

      {/* Bulk delete confirm */}
      <Dialog open={confirmBulkOpen} onOpenChange={handleBulkDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa {selected.length} phiên?</DialogTitle>
            <DialogDescription>
              Hành động không hoàn tác. Xóa luôn báo cáo và metadata. Gõ{' '}
              <code className="font-mono text-gold">{CONFIRM_PHRASE}</code> để xác nhận.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={bulkConfirmText}
            onChange={handleBulkConfirmTextChange}
            placeholder={CONFIRM_PHRASE}
            autoFocus
          />
          <DialogFooter>
            <Button variant="ghost" onClick={handleBulkDeleteCancel}>
              Hủy
            </Button>
            <Button
              onClick={handleBulkDeleteConfirm}
              disabled={bulkConfirmText !== CONFIRM_PHRASE || bulkDeleteMut.isPending}
              className="bg-red-500/90 text-foreground hover:bg-red-500"
            >
              {bulkDeleteMut.isPending ? 'Đang xóa…' : 'Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Single-row delete confirm (reuses bulk endpoint with one id) */}
      <Dialog open={!!confirmSingleId} onOpenChange={handleSingleDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa phiên?</DialogTitle>
            <DialogDescription>
              Session <code className="font-mono text-gold">{confirmSingleId}</code> sẽ
              bị xóa vĩnh viễn.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={handleSingleDeleteCancel}>
              Hủy
            </Button>
            <Button
              onClick={handleSingleDeleteConfirm}
              className="bg-red-500/90 text-foreground hover:bg-red-500"
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Wave 65 — set label / note */}
      <Dialog open={!!renameId} onOpenChange={(o) => !o && setRenameId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đặt tên / ghi chú phiên</DialogTitle>
            <DialogDescription>
              Tên gợi nhớ + ghi chú nội bộ cho phiên này. Không đổi ID gốc — chỉ là nhãn hiển thị.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Tên gợi nhớ</label>
              <Input
                value={renameLabel}
                onChange={(e) => setRenameLabel(e.target.value)}
                placeholder="vd: Chị Lan – tài chính"
                maxLength={120}
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Ghi chú</label>
              <Input
                value={renameNote}
                onChange={(e) => setRenameNote(e.target.value)}
                placeholder="vd: khách VIP, cần follow-up"
                maxLength={280}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRenameId(null)} disabled={renameMut.isPending}>
              Hủy
            </Button>
            <Button onClick={handleRenameSave} disabled={renameMut.isPending}>
              {renameMut.isPending ? 'Đang lưu…' : 'Lưu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** Stable row-id extractor for AdminTable. */
function getSessionId(s: AdminSession): string {
  return s.session_id;
}
