'use client';

import * as React from 'react';
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
import { listUsers } from '@/lib/admin-api';
import type { AdminUser } from '@/lib/mock-data';

const PLAN_TONE: Record<AdminUser['plan'], React.ComponentProps<typeof StatusBadge>['status']> = {
  free: 'neutral',
  mentor_month: 'info',
  mentor_year: 'warning',
  lifetime: 'success',
};

const PLAN_LABEL: Record<AdminUser['plan'], string> = {
  free: 'Miễn phí',
  mentor_month: 'Mentor tháng',
  mentor_year: 'Mentor năm',
  lifetime: 'Trọn đời',
};

const PAGE_SIZE = 15;

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN');
}

export default function AdminUsersPage() {
  const [search, setSearch] = React.useState('');
  const [plan, setPlan] = React.useState<AdminUser['plan'] | ''>('');
  const [page, setPage] = React.useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', { search, plan, page }],
    queryFn: () => listUsers({ search, plan: plan || undefined, page, page_size: PAGE_SIZE }),
  });

  const [selected, setSelected] = React.useState<AdminUser | null>(null);

  const cols: DataTableColumn<AdminUser>[] = [
    { key: 'id', header: 'ID', width: '110px', cell: (u) => <span className="font-mono text-xs text-cream/70">{u.id}</span> },
    { key: 'email', header: 'Email', cell: (u) => <span className="text-cream">{u.email}</span> },
    {
      key: 'telegram_id',
      header: 'Telegram',
      cell: (u) => u.telegram_id ? <span className="font-mono text-xs text-cream/75">{u.telegram_id}</span> : <span className="text-cream/40">—</span>,
    },
    { key: 'registered_at', header: 'Đăng ký', cell: (u) => fmtDate(u.registered_at), width: '110px' },
    { key: 'last_active_at', header: 'Truy cập gần nhất', cell: (u) => fmtDate(u.last_active_at), width: '150px' },
    {
      key: 'plan',
      header: 'Gói',
      width: '130px',
      cell: (u) => <StatusBadge status={PLAN_TONE[u.plan]} label={PLAN_LABEL[u.plan]} />,
    },
    { key: 'total_readings', header: 'BC', align: 'right', width: '60px' },
    { key: 'total_spend_usd', header: 'Chi tiêu', align: 'right', width: '90px', cell: (u) => `$${u.total_spend_usd.toFixed(2)}` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-cream">Người dùng</h1>
        <p className="mt-1 text-sm text-cream/65">Danh sách tài khoản đăng ký + gói + hoạt động.</p>
      </div>

      <Card>
        <CardHeader className="gap-3">
          <CardTitle className="text-base">Bộ lọc</CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              placeholder="Tìm theo email hoặc ID…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="sm:max-w-sm"
            />
            <select
              value={plan}
              onChange={(e) => {
                setPlan(e.target.value as AdminUser['plan'] | '');
                setPage(1);
              }}
              className="h-10 rounded-md border border-gold/15 bg-ink/40 px-3 text-sm text-cream"
            >
              <option value="">Tất cả gói</option>
              <option value="free">Miễn phí</option>
              <option value="mentor_month">Mentor tháng</option>
              <option value="mentor_year">Mentor năm</option>
              <option value="lifetime">Trọn đời</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={cols}
            rows={data?.rows ?? []}
            rowKey={(u) => u.id}
            onRowClick={(u) => setSelected(u)}
            page={data?.page ?? 1}
            pageSize={data?.page_size ?? PAGE_SIZE}
            total={data?.total ?? 0}
            onPageChange={setPage}
            emptyState={isLoading ? 'Đang tải…' : 'Không có user khớp.'}
          />
        </CardContent>
      </Card>

      {selected && <UserDrawer user={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function UserDrawer({ user, onClose }: { user: AdminUser; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60" onClick={onClose}>
      <div
        className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-gold/20 bg-ink p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl text-cream">{user.email}</h2>
          <button onClick={onClose} className="text-cream/60 hover:text-gold">✕</button>
        </div>
        <dl className="mt-6 space-y-3 text-sm">
          <Row label="ID">{user.id}</Row>
          <Row label="Telegram">{user.telegram_id ?? '—'}</Row>
          <Row label="Đăng ký">{fmtDate(user.registered_at)}</Row>
          <Row label="Truy cập gần nhất">{fmtDate(user.last_active_at)}</Row>
          <Row label="Gói">{PLAN_LABEL[user.plan]}</Row>
          <Row label="Số báo cáo">{user.total_readings}</Row>
          <Row label="Tổng chi tiêu">${user.total_spend_usd.toFixed(2)}</Row>
        </dl>
        <p className="mt-6 rounded border border-gold/15 bg-gold/5 p-3 text-xs text-cream/65">
          TODO: link đến danh sách session của user, force-logout, đổi gói.
        </p>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-gold/10 pb-2">
      <dt className="text-xs uppercase tracking-wider text-cream/55">{label}</dt>
      <dd className="font-mono text-sm text-cream">{children}</dd>
    </div>
  );
}
