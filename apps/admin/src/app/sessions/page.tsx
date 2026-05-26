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
 *   - Export-all CSV (proxied through /api/admin/sessions/export)
 *   - Re-orchestrate single + bulk-delete with confirm phrase
 *   - URL-synced filter (?status=…&sort=…) for dashboard CTAs
 */

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
  ChevronDown,
  Clock,
  Download,
  Filter,
  Globe,
  ListTodo,
  Trash2,
  Users,
} from 'lucide-react';
import type { TaskStatus } from '@hieu-asia/types';
import { listSessions } from '@/lib/admin-api';
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
  humanizeSessionId,
} from '@/components/admin/sessions/format';

const PAGE_SIZE = 20;
const CONFIRM_PHRASE = 'XÓA HÀNG LOẠT';

type SortOrder = 'newest' | 'oldest';
type StatusFilter = TaskStatus | '';

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

/** Trigger a browser download — proxy may not set Content-Disposition. */
function downloadUrl(url: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = `hieu-asia-sessions-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

async function reOrchestrate(sessionId: string) {
  const r = await fetch(`/api/admin/sessions/${sessionId}/re-orchestrate`, { method: 'POST' });
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
  const [selected, setSelected] = React.useState<string[]>([]);
  const [confirmBulkOpen, setConfirmBulkOpen] = React.useState(false);
  const [bulkConfirmText, setBulkConfirmText] = React.useState('');
  const [confirmSingleId, setConfirmSingleId] = React.useState<string | null>(null);

  // Persist filter/sort to URL so reloads + bookmarks keep state.
  React.useEffect(() => {
    const next = new URLSearchParams();
    if (status) next.set('status', status);
    if (sort !== 'newest') next.set('sort', sort);
    const qs = next.toString();
    router.replace(qs ? `?${qs}` : '?', { scroll: false });
  }, [status, sort, router]);

  const { data, isLoading, refetch, isFetching, error } = useQuery({
    queryKey: ['admin', 'sessions', { status, search, page }],
    queryFn: () =>
      listSessions({ status: status || undefined, search, page, page_size: PAGE_SIZE }),
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

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // KPI aggregates — page slice only until backend exposes global totals.
  const completedCount = rows.filter((r) => r.status === 'completed').length;
  const runningCount = rows.filter((r) => r.status === 'running').length;
  const last1hCount = rows.filter((r) => {
    const t = new Date(r.created_at).getTime();
    return !Number.isNaN(t) && Date.now() - t < 3600 * 1000;
  }).length;
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

  const handleExportAll = React.useCallback(() => {
    const qs = new URLSearchParams({ format: 'csv' });
    if (status) qs.set('status', status);
    if (search) qs.set('search', search);
    downloadUrl(`/api/admin/sessions/export?${qs.toString()}`);
    toast.success('Đang tải CSV…');
  }, [status, search]);

  const handleExportSelected = React.useCallback(() => {
    if (selected.length === 0) return;
    const qs = new URLSearchParams({ format: 'csv' });
    qs.set('session_ids', selected.join(','));
    downloadUrl(`/api/admin/sessions/export?${qs.toString()}`);
    toast.success(`Đang tải CSV ${selected.length} phiên đã chọn…`);
  }, [selected]);

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

  // ---- Column config ----

  const columns = React.useMemo<AdminTableColumn<AdminSession>[]>(
    () => [
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
        width: '140px',
        cell: (s) => (
          <span
            className="font-mono text-xs text-gold"
            title={s.session_id}
          >
            {humanizeSessionId(s.session_id)}
          </span>
        ),
      },
      {
        id: 'user',
        header: 'User',
        sortKey: 'user_email',
        cell: (s) => (
          <div className="min-w-0">
            <div className="truncate text-foreground">{s.user_email || '—'}</div>
            <div className="truncate font-mono text-[10px] text-muted-foreground">
              {s.user_id || ''}
            </div>
          </div>
        ),
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
        width: '120px',
        cell: (s) => (
          <StatusBadge status={STATUS_TONE[s.status]} label={STATUS_LABEL[s.status]} />
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
            reOrchPending={reOrchestrateMut.isPending}
          />
        ),
      },
    ],
    [handleReOrchestrate, handleAskDelete, reOrchestrateMut.isPending],
  );

  const statusLabel =
    STATUS_OPTIONS.find((o) => o.value === status)?.label ?? 'Tất cả trạng thái';
  const sortLabel = sort === 'oldest' ? 'Cũ nhất' : 'Mới nhất';
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
          >
            {ICON_DOWNLOAD}
            Xuất CSV tất cả
          </Button>
        }
      />

      <MockBanner source={data?._source} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Phiên trang này"
          value={rows.length}
          icon={ICON_USERS}
          accent="gold"
          hint={`/ tổng ${total}`}
        />
        <KpiCard
          label="Đang chạy"
          value={runningCount}
          icon={ICON_ACTIVITY}
          accent={runningCount > 0 ? 'jade' : 'purple'}
          hint="hot pipeline"
        />
        <KpiCard
          label="1h gần nhất"
          value={last1hCount}
          icon={ICON_CLOCK}
          accent="purple"
          hint="phiên mới"
        />
        <KpiCard
          label="Thời lượng TB"
          value={avgDuration != null ? fmtDuration(avgDuration) : '—'}
          icon={ICON_GLOBE}
          accent="gold"
          hint={`${completedCount} hoàn tất · ${uniqueUsers} user`}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
          <CardDescription>
            Tìm theo session_id, email, hoặc nội dung mối quan tâm.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Tìm session_id / email / nội dung…"
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
          </div>
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
                  search || status
                    ? 'Không có phiên khớp bộ lọc'
                    : 'Chưa có phiên phân tích nào'
                }
                description={
                  search || status
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
    </div>
  );
}

/** Stable row-id extractor for AdminTable. */
function getSessionId(s: AdminSession): string {
  return s.session_id;
}
