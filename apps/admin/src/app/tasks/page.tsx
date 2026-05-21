'use client';

import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  StatusBadge,
  type DataTableColumn,
} from '@hieu-asia/ui';
import { Bot, RotateCcw, Clock, Activity, AlertTriangle } from 'lucide-react';
import { getQueueDepth, listTasks, retryTask } from '@/lib/admin-api';
import { MockBanner } from '@/components/mock-banner';
import { PageHeader } from '@/components/admin/page-header';
import { LiveBadge } from '@/components/admin/live-badge';
import { EmptyState } from '@/components/admin/empty-state';
import { KpiCard } from '@/components/admin/kpi-card';
import type { AdminTask } from '@/lib/mock-data';
import type { TaskStatus } from '@hieu-asia/types';

const TONE: Record<TaskStatus, React.ComponentProps<typeof StatusBadge>['status']> = {
  queued: 'neutral',
  running: 'info',
  completed: 'success',
  failed: 'error',
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  queued: 'queued',
  running: 'running',
  completed: 'completed',
  failed: 'failed',
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
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'tasks'] }),
  });

  const oldestAge = queue.data?.oldest_pending_age_seconds ?? null;
  const oldestAlert = (oldestAge ?? 0) > 3600;

  const cols: DataTableColumn<AdminTask>[] = [
    {
      key: 'task_id',
      header: 'Task ID',
      width: '120px',
      cell: (t) => <span className="font-mono text-xs text-cream/70">{t.task_id.slice(0, 12)}…</span>,
    },
    {
      key: 'name',
      header: 'Session',
      cell: (t) => <span className="font-mono text-xs text-cream">{t.name}</span>,
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
      cell: (t) =>
        new Date(t.started_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }),
    },
    {
      key: 'duration_seconds',
      header: 'Thời lượng',
      align: 'right',
      width: '90px',
      cell: (t) => (t.duration_seconds == null ? '—' : `${t.duration_seconds}s`),
    },
    { key: 'retries', header: 'Retry', align: 'right', width: '60px' },
    {
      key: 'error',
      header: 'Lỗi',
      cell: (t) =>
        t.error ? (
          <span className="line-clamp-1 font-mono text-xs text-red-300">{t.error}</span>
        ) : (
          <span className="text-cream/30">—</span>
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
            onClick={() => retry.mutate(t.task_id)}
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
          label="Pending"
          value={queue.data?.default ?? 0}
          icon={<Clock className="h-4 w-4" />}
          accent={oldestAlert ? 'red' : 'gold'}
          hint="đang chờ"
        />
        <KpiCard
          label="Processing"
          value={queue.data?.high_priority ?? 0}
          icon={<Activity className="h-4 w-4" />}
          accent="purple"
          hint="đang chạy"
        />
        <KpiCard
          label="Oldest pending"
          value={fmtAge(oldestAge)}
          icon={oldestAlert ? <AlertTriangle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
          accent={oldestAlert ? 'red' : 'jade'}
          hint={oldestAlert ? 'SLA breach' : 'OK'}
        />
        <KpiCard
          label="RAG queue"
          value={queue.data?.rag ?? 0}
          icon={<Bot className="h-4 w-4" />}
          accent="jade"
          hint="indexing jobs"
        />
      </div>

      {oldestAlert && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
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
                      'rounded-full border px-3 py-1 text-xs font-medium transition-colors ' +
                      (active
                        ? 'border-gold/60 bg-gold/15 text-gold'
                        : 'border-cream/15 bg-ink/40 text-cream/70 hover:border-gold/30 hover:text-cream')
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
              emptyState="Chưa có task."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
