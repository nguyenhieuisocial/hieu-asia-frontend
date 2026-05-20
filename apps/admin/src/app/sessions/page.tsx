'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  Input,
  StatusBadge,
  type DataTableColumn,
} from '@hieu-asia/ui';
import { listSessions } from '@/lib/admin-api';
import type { AdminSession } from '@/lib/mock-data';
import type { TaskStatus } from '@hieu-asia/types';

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

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
}
function fmtDuration(sec: number | null) {
  if (sec == null) return '—';
  if (sec < 60) return `${sec}s`;
  return `${Math.floor(sec / 60)}m ${sec % 60}s`;
}

const PAGE_SIZE = 20;

export default function AdminSessionsPage() {
  const [status, setStatus] = React.useState<TaskStatus | ''>('');
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'sessions', { status, search, page }],
    queryFn: () =>
      listSessions({ status: status || undefined, search, page, page_size: PAGE_SIZE }),
  });

  const cols: DataTableColumn<AdminSession>[] = [
    {
      key: 'session_id',
      header: 'Session',
      width: '110px',
      cell: (s) => (
        <Link href={`/sessions/${s.session_id}`} className="font-mono text-xs text-gold hover:underline">
          {s.session_id}
        </Link>
      ),
    },
    { key: 'user_email', header: 'User', cell: (s) => <span className="text-cream">{s.user_email}</span> },
    {
      key: 'primary_concern',
      header: 'Mối quan tâm',
      cell: (s) => <span className="line-clamp-1 text-cream/85">{s.primary_concern}</span>,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      width: '110px',
      cell: (s) => <StatusBadge status={STATUS_TONE[s.status]} label={STATUS_LABEL[s.status]} />,
    },
    { key: 'created_at', header: 'Tạo', cell: (s) => fmtDateTime(s.created_at), width: '140px' },
    { key: 'duration_seconds', header: 'Thời lượng', cell: (s) => fmtDuration(s.duration_seconds), align: 'right', width: '90px' },
    { key: 'cost_usd', header: 'Cost', cell: (s) => `$${s.cost_usd.toFixed(3)}`, align: 'right', width: '80px' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-cream">Phiên phân tích</h1>
        <p className="mt-1 text-sm text-cream/65">Mỗi phiên = 1 task Celery + 1 báo cáo. Click để xem chi tiết.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bộ lọc</CardTitle>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <Input
              placeholder="Tìm session_id / email / nội dung…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="sm:max-w-md"
            />
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as TaskStatus | '');
                setPage(1);
              }}
              className="h-10 rounded-md border border-gold/15 bg-ink/40 px-3 text-sm text-cream"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="queued">Đang chờ</option>
              <option value="running">Đang chạy</option>
              <option value="completed">Hoàn tất</option>
              <option value="failed">Lỗi</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={cols}
            rows={data?.rows ?? []}
            rowKey={(s) => s.session_id}
            page={data?.page ?? 1}
            pageSize={data?.page_size ?? PAGE_SIZE}
            total={data?.total ?? 0}
            onPageChange={setPage}
            emptyState={isLoading ? 'Đang tải…' : 'Không có phiên khớp.'}
          />
        </CardContent>
      </Card>
    </div>
  );
}
