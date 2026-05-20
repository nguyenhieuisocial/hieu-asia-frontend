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
import { getQueueDepth, listTasks, retryTask } from '@/lib/admin-api';
import type { AdminTask } from '@/lib/mock-data';
import type { TaskStatus } from '@hieu-asia/types';

const TONE: Record<TaskStatus, React.ComponentProps<typeof StatusBadge>['status']> = {
  queued: 'neutral',
  running: 'info',
  completed: 'success',
  failed: 'error',
};

export default function AdminTasksPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'tasks'],
    queryFn: () => listTasks({ page_size: 30 }),
    refetchInterval: 5_000,
  });
  const queue = useQuery({ queryKey: ['admin', 'queue-depth'], queryFn: getQueueDepth, refetchInterval: 5_000 });

  const retry = useMutation({
    mutationFn: (id: string) => retryTask(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'tasks'] }),
  });

  const cols: DataTableColumn<AdminTask>[] = [
    { key: 'task_id', header: 'Task ID', width: '120px', cell: (t) => <span className="font-mono text-xs text-cream/70">{t.task_id}</span> },
    { key: 'name', header: 'Tên', cell: (t) => <span className="font-mono text-xs text-cream">{t.name}</span> },
    { key: 'status', header: 'Trạng thái', width: '110px', cell: (t) => <StatusBadge status={TONE[t.status]} label={t.status} /> },
    { key: 'started_at', header: 'Bắt đầu', width: '150px', cell: (t) => new Date(t.started_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) },
    { key: 'duration_seconds', header: 'Thời lượng', align: 'right', width: '90px', cell: (t) => (t.duration_seconds == null ? '—' : `${t.duration_seconds}s`) },
    { key: 'retries', header: 'Retry', align: 'right', width: '60px' },
    {
      key: 'error',
      header: 'Lỗi',
      cell: (t) =>
        t.error ? <span className="line-clamp-1 font-mono text-xs text-red-300">{t.error}</span> : <span className="text-cream/30">—</span>,
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
            Retry
          </Button>
        ) : null,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-cream">Task / Lỗi (Celery)</h1>
        <p className="mt-1 text-sm text-cream/65">Theo dõi worker. Refresh tự động mỗi 5s.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <QueueCard name="Default" count={queue.data?.default ?? 0} />
        <QueueCard name="High priority" count={queue.data?.high_priority ?? 0} />
        <QueueCard name="RAG" count={queue.data?.rag ?? 0} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task gần đây</CardTitle>
          <CardDescription>30 task gần nhất, mọi trạng thái.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={cols}
            rows={data?.rows ?? []}
            rowKey={(t) => t.task_id}
            emptyState={isLoading ? 'Đang tải…' : 'Chưa có task.'}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function QueueCard({ name, count }: { name: string; count: number }) {
  return (
    <div className="rounded-lg border border-gold/15 bg-ink/50 p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-cream/55">Queue · {name}</p>
      <p className="mt-1 font-heading text-2xl text-cream">{count}</p>
      <p className="text-xs text-cream/55">job đang chờ</p>
    </div>
  );
}
