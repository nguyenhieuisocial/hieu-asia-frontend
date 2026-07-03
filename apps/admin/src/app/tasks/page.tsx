'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  StatusBadge,
  toast,
  type DataTableColumn,
} from '@hieu-asia/ui';
import { Bot, RotateCcw, Clock, Activity, AlertTriangle, ExternalLink } from 'lucide-react';
import { getQueueDepth, listTasks, retryTask } from '@/lib/admin-api';
import { groupFailureReasons, deriveFailureReason } from '@/lib/task-failure-reason';
import { MockBanner } from '@/components/mock-banner';
import { PageHeader } from '@/components/admin/page-header';
import { LiveBadge } from '@/components/admin/live-badge';
import { EmptyState } from '@/components/admin/empty-state';
import { KpiCard } from '@/components/admin/kpi-card';
import type { AdminTask } from '@/lib/mock-data';
import { fmtDateTime } from '@/lib/format';
import type { TaskStatus } from '@hieu-asia/types';

// Recharts lazy-loaded so it stays out of the initial bundle (GscTrendChart
// pattern). ssr:false — admin is auth-gated, not SEO-indexed.
const FailureReasonChart = dynamic(
  () =>
    import('@/components/admin/tasks/FailureReasonChart').then((m) => m.FailureReasonChart),
  {
    ssr: false,
    loading: () => <div className="h-64 animate-pulse rounded bg-muted/30" aria-hidden />,
  },
);

const TONE: Record<TaskStatus, React.ComponentProps<typeof StatusBadge>['status']> = {
  queued: 'neutral',
  running: 'info',
  completed: 'success',
  failed: 'error',
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  queued: 'Chờ',
  running: 'Đang chạy',
  completed: 'Hoàn tất',
  failed: 'Lỗi',
};

const STATUS_FILTERS: Array<{ value: '' | TaskStatus; label: string }> = [
  { value: '', label: 'Tất cả' },
  { value: 'queued', label: 'Chờ' },
  { value: 'running', label: 'Đang chạy' },
  { value: 'completed', label: 'Hoàn tất' },
  { value: 'failed', label: 'Lỗi' },
];

function fmtAge(seconds: number | null): string {
  if (seconds == null) return '—';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  return `${Math.round(seconds / 3600)}h`;
}

export default function AdminTasksPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = React.useState<TaskStatus | ''>('');
  const [selectedTask, setSelectedTask] = React.useState<AdminTask | null>(null);

  const tasks = useQuery({
    queryKey: ['admin', 'tasks', filter],
    queryFn: () => listTasks({ page_size: 30, status: filter || undefined }),
    refetchInterval: 5_000,
  });
  const queue = useQuery({
    queryKey: ['admin', 'queue-depth'],
    queryFn: getQueueDepth,
    refetchInterval: 5_000,
  });

  const retry = useMutation({
    mutationFn: (id: string) => retryTask(id),
    // Partial match (exact:false) so the filtered list key ['admin','tasks',filter]
    // is invalidated too — otherwise the retried row wouldn't refresh.
    onSuccess: () => {
      toast.success('Đã đưa task vào hàng đợi retry');
      qc.invalidateQueries({ queryKey: ['admin', 'tasks'], exact: false });
    },
    onError: (e) => toast.error('Retry thất bại', { description: (e as Error).message }),
  });

  const oldestAge = queue.data?.oldest_pending_age_seconds ?? null;
  const oldestAlert = (oldestAge ?? 0) > 3600;

  // Failure-reason breakdown over the CURRENTLY-FETCHED page rows (no extra
  // fetch). Reads the raw worker status (`raw_status`, falling back to the
  // normalized `status`) so the category survives the failed-collapse.
  const taskRows = React.useMemo(() => tasks.data?.rows ?? [], [tasks.data?.rows]);
  const failureBreakdown = React.useMemo(
    () => groupFailureReasons(taskRows.map((t) => ({ status: t.raw_status ?? t.status }))),
    [taskRows],
  );
  const failedCount = React.useMemo(
    () => taskRows.filter((t) => deriveFailureReason(t.raw_status ?? t.status) !== '').length,
    [taskRows],
  );

  const cols: DataTableColumn<AdminTask>[] = [
    {
      key: 'task_id',
      header: 'Task ID',
      width: '120px',
      cell: (t) => <span className="font-mono text-xs text-muted-foreground">{t.task_id.slice(0, 12)}…</span>,
    },
    {
      key: 'name',
      header: 'Session',
      width: '170px',
      // Direct link to the session detail. stopPropagation so clicking the id
      // navigates instead of also opening the row drawer. Id rút gọn để bảng
      // không tràn ngang — id đầy đủ nằm trong title.
      cell: (t) =>
        t.name ? (
          <Link
            href={`/sessions/${encodeURIComponent(t.name)}`}
            onClick={(e) => e.stopPropagation()}
            className="font-mono text-xs text-foreground underline decoration-dotted underline-offset-2 hover:text-gold"
            title={t.name}
          >
            {t.name.length > 18 ? `${t.name.slice(0, 18)}…` : t.name}
          </Link>
        ) : (
          <span className="text-foreground/30">—</span>
        ),
    },
    {
      // Gap audit 2026-07-02 — tasks linked the session but not the CUSTOMER.
      // user_id/user_email arrive via worker enrichment (backend #345);
      // best-effort → "—" when the join failed or the session is anonymous.
      key: 'user_email',
      header: 'Khách',
      cell: (t) =>
        t.user_id ? (
          <Link
            href={`/customers/${encodeURIComponent(t.user_id)}`}
            onClick={(e) => e.stopPropagation()}
            className="truncate text-xs text-foreground underline decoration-dotted underline-offset-2 hover:text-gold"
            title="Mở hồ sơ khách hàng"
          >
            {t.user_email && t.user_email.includes('@')
              ? t.user_email
              : `${t.user_id.slice(0, 8)}…`}
          </Link>
        ) : (
          <span className="text-foreground/30">—</span>
        ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      width: '110px',
      cell: (t) => <StatusBadge status={TONE[t.status]} label={STATUS_LABEL[t.status]} />,
    },
    {
      key: 'started_at',
      header: 'Bắt đầu',
      width: '150px',
      // Cột phụ — ẩn dưới md để mobile khỏi scroll qua 8 cột.
      className: 'hidden md:table-cell',
      cell: (t) =>
        new Date(t.started_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }),
    },
    {
      key: 'duration_seconds',
      header: 'Thời lượng',
      align: 'right',
      width: '90px',
      className: 'hidden md:table-cell',
      cell: (t) => (t.duration_seconds == null ? '—' : `${t.duration_seconds}s`),
    },
    // retries column REMOVED (gap audit 2026-07-02): backend hardcodes
    // retries=0 (reading_tasks has no retries column yet) — a permanently-zero
    // column misleads operators. Re-add when the DB column lands.
    {
      key: 'error',
      header: 'Lỗi',
      cell: (t) =>
        t.error ? (
          <span className="line-clamp-1 font-mono text-xs text-red-700 dark:text-red-300">{t.error}</span>
        ) : (
          <span className="text-foreground/30">—</span>
        ),
    },
    {
      key: 'actions',
      header: '',
      width: '90px',
      cell: (t) =>
        t.status === 'failed' ? (
          <Button
            size="sm"
            variant="outline"
            // Stop propagation so retrying a row doesn't also open its drawer.
            onClick={(e) => {
              e.stopPropagation();
              retry.mutate(t.task_id);
            }}
            disabled={retry.isPending}
          >
            <RotateCcw className="mr-1 h-3 w-3" />
            Retry
          </Button>
        ) : null,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Task / Lỗi"
        description="Theo dõi worker queue. Auto refresh mỗi 5s."
        icon={<Bot className="h-5 w-5" />}
        badge={<LiveBadge tone={oldestAlert ? 'red' : 'jade'} />}
      />

      <MockBanner source={tasks.data?._source ?? queue.data?._source} />

      {/* Queue KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Đang chờ"
          value={queue.data?.default ?? 0}
          icon={<Clock className="h-4 w-4" />}
          accent={oldestAlert ? 'red' : 'gold'}
          hint="trong hàng đợi"
        />
        <KpiCard
          label="Đang xử lý"
          value={queue.data?.high_priority ?? 0}
          icon={<Activity className="h-4 w-4" />}
          accent="purple"
          hint="đang chạy"
        />
        <KpiCard
          label="Chờ lâu nhất"
          value={fmtAge(oldestAge)}
          icon={oldestAlert ? <AlertTriangle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
          accent={oldestAlert ? 'red' : 'jade'}
          hint={oldestAlert ? 'quá SLA 1 giờ' : 'OK'}
        />
        <KpiCard
          label="Hàng đợi RAG"
          value={queue.data?.rag ?? 0}
          icon={<Bot className="h-4 w-4" />}
          accent="jade"
          hint="job đánh chỉ mục"
        />
      </div>

      {oldestAlert && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-200">
          <strong>Cảnh báo:</strong> task chờ lâu nhất đã quá 1 giờ ({fmtAge(oldestAge)}). Kiểm tra
          worker logs hoặc retry các task failed bên dưới.
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>Task gần đây</CardTitle>
              <CardDescription>30 task gần nhất theo bộ lọc.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_FILTERS.map((f) => {
                const active = filter === f.value;
                return (
                  <button
                    key={f.value || 'all'}
                    type="button"
                    onClick={() => setFilter(f.value)}
                    className={
                      'rounded-full border px-3 py-1 text-xs font-medium transition-all duration-300 ease-editorial ' +
                      (active
                        ? 'border-gold/60 bg-gold/15 text-gold'
                        : 'border-border bg-card/60 text-muted-foreground hover:border-gold/30 hover:text-foreground')
                    }
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {(tasks.data?.rows ?? []).length === 0 ? (
            <EmptyState
              title={tasks.isLoading ? 'Đang tải…' : 'Queue đang trống'}
              description={
                filter
                  ? 'Không có task khớp bộ lọc. Thử "Tất cả".'
                  : 'Worker xử lý hết task hiện có. Khi có session mới được tạo, task sẽ xuất hiện ở đây.'
              }
            />
          ) : (
            <DataTable
              columns={cols}
              rows={tasks.data?.rows ?? []}
              rowKey={(t) => t.task_id}
              onRowClick={(t) => setSelectedTask(t)}
              emptyState="Chưa có task."
            />
          )}
        </CardContent>
      </Card>

      {/* Failure-reason breakdown — derived from the fetched page rows only. */}
      <Card>
        <CardHeader>
          <CardTitle>Nguyên nhân lỗi</CardTitle>
          <CardDescription>
            Nhóm theo nguyên nhân trong {taskRows.length} task gần nhất.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {failedCount === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Không có task lỗi trong danh sách.
            </p>
          ) : (
            <FailureReasonChart data={failureBreakdown} />
          )}
        </CardContent>
      </Card>

      {/* Row drill-down drawer */}
      <Sheet open={selectedTask !== null} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {selectedTask && (
            <>
              <SheetHeader>
                <SheetTitle>Chi tiết task</SheetTitle>
                <SheetDescription className="font-mono text-xs break-all">
                  {selectedTask.task_id}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Trạng thái</span>
                  <span className="flex items-center gap-2">
                    <StatusBadge
                      status={TONE[selectedTask.status]}
                      label={STATUS_LABEL[selectedTask.status]}
                    />
                    {(() => {
                      const reason = deriveFailureReason(
                        selectedTask.raw_status ?? selectedTask.status,
                      );
                      return reason ? (
                        <span className="rounded border border-red-500/40 bg-red-500/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-red-700 dark:text-red-300">
                          {reason}
                        </span>
                      ) : null;
                    })()}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Bắt đầu</span>
                  <span className="font-mono text-xs text-foreground">
                    {fmtDateTime(selectedTask.started_at)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Thời lượng</span>
                  <span className="font-mono text-xs text-foreground">
                    {selectedTask.duration_seconds == null
                      ? '—'
                      : `${selectedTask.duration_seconds}s`}
                  </span>
                </div>

                {/* Retry hidden while backend hardcodes retries=0 (no DB column
                    yet) — showing a fake 0 misleads triage. */}
                {selectedTask.retries > 0 && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Retry</span>
                    <span className="font-mono text-xs text-foreground">
                      {selectedTask.retries}
                    </span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <span className="text-muted-foreground">Lỗi</span>
                  <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-md border border-gold/15 bg-card/60 p-3 font-mono text-xs text-red-700 dark:text-red-300">
                    {selectedTask.error ?? '—'}
                  </pre>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedTask.name && (
                    <Link
                      href={`/sessions/${encodeURIComponent(selectedTask.name)}`}
                      className="inline-flex items-center gap-1.5 rounded-md border border-gold/30 px-3 py-1.5 text-xs text-gold transition-colors hover:bg-gold/10"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Xem session
                    </Link>
                  )}
                  {selectedTask.user_id && (
                    <Link
                      href={`/customers/${encodeURIComponent(selectedTask.user_id)}`}
                      className="inline-flex items-center gap-1.5 rounded-md border border-gold/30 px-3 py-1.5 text-xs text-gold transition-colors hover:bg-gold/10"
                      title={selectedTask.user_email ?? undefined}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Xem khách hàng
                    </Link>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
