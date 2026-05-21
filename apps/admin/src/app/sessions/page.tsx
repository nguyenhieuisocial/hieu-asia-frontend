'use client';

import * as React from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  StatusBadge,
  cn,
  toast,
} from '@hieu-asia/ui';
import { Download, MoreVertical, RotateCcw, Trash2, Eye } from 'lucide-react';
import { listSessions } from '@/lib/admin-api';
import { MockBanner } from '@/components/mock-banner';
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

const STATUS_FILTERS: Array<{ value: '' | TaskStatus; label: string }> = [
  { value: '', label: 'Tất cả' },
  { value: 'queued', label: 'Đang chờ' },
  { value: 'running', label: 'Đang chạy' },
  { value: 'completed', label: 'Hoàn tất' },
  { value: 'failed', label: 'Lỗi' },
];

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
}
function fmtDuration(sec: number | null) {
  if (sec == null) return '—';
  if (sec < 60) return `${sec}s`;
  return `${Math.floor(sec / 60)}m ${sec % 60}s`;
}

const PAGE_SIZE = 20;
const CONFIRM_PHRASE = 'XÓA HÀNG LOẠT';

/** Trigger a browser download for a URL. Browser will use Content-Disposition filename. */
function downloadUrl(url: string) {
  const a = document.createElement('a');
  a.href = url;
  // Hint a filename in case proxy doesn't set Content-Disposition
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
  const [status, setStatus] = React.useState<TaskStatus | ''>('');
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [confirmBulkOpen, setConfirmBulkOpen] = React.useState(false);
  const [bulkConfirmText, setBulkConfirmText] = React.useState('');
  const [confirmSingleId, setConfirmSingleId] = React.useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'sessions', { status, search, page }],
    queryFn: () =>
      listSessions({ status: status || undefined, search, page, page_size: PAGE_SIZE }),
  });

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Drop selections that aren't on current page (visual hygiene only; bulk still works across pages).
  const allOnPageSelected = rows.length > 0 && rows.every((r) => selected.has(r.session_id));
  const someOnPageSelected = rows.some((r) => selected.has(r.session_id));

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const togglePage = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) {
        for (const r of rows) next.delete(r.session_id);
      } else {
        for (const r of rows) next.add(r.session_id);
      }
      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());

  const reOrchestrateMut = useMutation({
    mutationFn: reOrchestrate,
    onSuccess: (_d, id) => {
      toast.success('Đã trigger re-orchestrate', { description: `Session ${id}` });
      qc.invalidateQueries({ queryKey: ['admin', 'sessions'] });
    },
    onError: (e) => toast.error('Re-orchestrate thất bại', { description: (e as Error).message }),
  });

  const bulkDeleteMut = useMutation({
    mutationFn: bulkDelete,
    onSuccess: (_d, ids) => {
      toast.success(`Đã xóa ${ids.length} phiên`);
      clearSelection();
      setConfirmBulkOpen(false);
      setBulkConfirmText('');
      qc.invalidateQueries({ queryKey: ['admin', 'sessions'] });
    },
    onError: (e) => toast.error('Xóa thất bại', { description: (e as Error).message }),
  });

  const handleExportAll = () => {
    const qs = new URLSearchParams({ format: 'csv' });
    if (status) qs.set('status', status);
    if (search) qs.set('search', search);
    downloadUrl(`/api/admin/sessions/export?${qs.toString()}`);
    toast.success('Đang tải CSV…');
  };

  const handleExportSelected = () => {
    if (selected.size === 0) return;
    const qs = new URLSearchParams({ format: 'csv' });
    qs.set('session_ids', Array.from(selected).join(','));
    downloadUrl(`/api/admin/sessions/export?${qs.toString()}`);
    toast.success(`Đang tải CSV ${selected.size} phiên đã chọn…`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-cream">Phiên phân tích</h1>
          <p className="mt-1 text-sm text-cream/65">
            Mỗi phiên = 1 task Celery + 1 báo cáo. Click để xem chi tiết.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExportAll}>
          <Download className="mr-1.5 h-3.5 w-3.5" />
          Xuất CSV tất cả
        </Button>
      </div>

      <MockBanner source={data?._source} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bộ lọc</CardTitle>
          <div className="mt-2 flex flex-col gap-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                placeholder="Tìm session_id / email / nội dung…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="sm:max-w-md"
              />
            </div>
            {/* Filter pills */}
            <div className="flex flex-wrap gap-1.5">
              {STATUS_FILTERS.map((f) => {
                const active = status === f.value;
                return (
                  <button
                    key={f.value || 'all'}
                    type="button"
                    onClick={() => {
                      setStatus(f.value);
                      setPage(1);
                    }}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                      active
                        ? 'border-gold/60 bg-gold/15 text-gold'
                        : 'border-cream/15 bg-ink/40 text-cream/70 hover:border-gold/30 hover:text-cream',
                    )}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Selectable table (custom, since DataTable doesn't support row selection). */}
          <div className="rounded-lg border border-gold/15 bg-ink/40 backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold/15 text-left">
                    <th className="w-10 px-4 py-3">
                      <Checkbox
                        checked={allOnPageSelected}
                        onChange={togglePage}
                        aria-label="Chọn tất cả trên trang"
                        ref={(el) => {
                          if (el) el.indeterminate = !allOnPageSelected && someOnPageSelected;
                        }}
                      />
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-gold/80" style={{ width: '110px' }}>
                      Session
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-gold/80">User</th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-gold/80">Mối quan tâm</th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-gold/80" style={{ width: '110px' }}>
                      Trạng thái
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-gold/80" style={{ width: '140px' }}>
                      Tạo
                    </th>
                    <th className="px-4 py-3 text-right font-mono text-xs uppercase tracking-wider text-gold/80" style={{ width: '90px' }}>
                      Thời lượng
                    </th>
                    <th className="px-4 py-3 text-right font-mono text-xs uppercase tracking-wider text-gold/80" style={{ width: '80px' }}>
                      Cost
                    </th>
                    <th className="w-12 px-2 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center text-cream/50">
                        {isLoading ? 'Đang tải…' : 'Không có phiên khớp.'}
                      </td>
                    </tr>
                  ) : (
                    rows.map((s) => {
                      const isSelected = selected.has(s.session_id);
                      return (
                        <tr
                          key={s.session_id}
                          className={cn(
                            'border-b border-gold/10 transition-colors last:border-0',
                            isSelected && 'bg-gold/5',
                          )}
                        >
                          <td className="px-4 py-3">
                            <Checkbox
                              checked={isSelected}
                              onChange={() => toggleOne(s.session_id)}
                              aria-label={`Chọn ${s.session_id}`}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Link
                              href={`/sessions/${s.session_id}`}
                              className="font-mono text-xs text-gold hover:underline"
                            >
                              {s.session_id}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-cream">{s.user_email}</td>
                          <td className="px-4 py-3">
                            <span className="line-clamp-1 text-cream/85">{s.primary_concern}</span>
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge
                              status={STATUS_TONE[s.status]}
                              label={STATUS_LABEL[s.status]}
                            />
                          </td>
                          <td className="px-4 py-3 text-cream/90">{fmtDateTime(s.created_at)}</td>
                          <td className="px-4 py-3 text-right text-cream/90">
                            {fmtDuration(s.duration_seconds)}
                          </td>
                          <td className="px-4 py-3 text-right text-cream/90">
                            ${s.cost_usd.toFixed(3)}
                          </td>
                          <td className="px-2 py-3">
                            <RowMenu
                              sessionId={s.session_id}
                              onReOrchestrate={() => reOrchestrateMut.mutate(s.session_id)}
                              onDelete={() => setConfirmSingleId(s.session_id)}
                              reOrchPending={reOrchestrateMut.isPending}
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-gold/15 px-4 py-3 text-xs text-cream/70">
              <span>
                Trang <span className="text-gold">{page}</span> / {totalPages} ·{' '}
                <span className="text-cream/50">{total} bản ghi</span>
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded border border-gold/20 px-2.5 py-1 hover:border-gold/40 disabled:opacity-40"
                >
                  ← Trước
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="rounded border border-gold/20 px-2.5 py-1 hover:border-gold/40 disabled:opacity-40"
                >
                  Sau →
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating action bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 lg:left-[calc(50%+8rem)]">
          <div className="flex items-center gap-2 rounded-full border border-gold/40 bg-ink/95 px-3 py-2 shadow-2xl backdrop-blur">
            <span className="px-2 font-mono text-xs text-gold">{selected.size} đã chọn</span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportSelected}
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Xuất CSV {selected.size}
            </Button>
            <Button
              size="sm"
              onClick={() => setConfirmBulkOpen(true)}
              className="bg-red-500/90 text-cream hover:bg-red-500"
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Xóa {selected.size} phiên
            </Button>
            <Button size="sm" variant="ghost" onClick={clearSelection}>
              Bỏ chọn
            </Button>
          </div>
        </div>
      )}

      {/* Bulk delete confirm */}
      <Dialog
        open={confirmBulkOpen}
        onOpenChange={(o) => {
          setConfirmBulkOpen(o);
          if (!o) setBulkConfirmText('');
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa {selected.size} phiên?</DialogTitle>
            <DialogDescription>
              Hành động không hoàn tác. Xóa luôn báo cáo và metadata. Gõ{' '}
              <code className="font-mono text-gold">{CONFIRM_PHRASE}</code> để xác nhận.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={bulkConfirmText}
            onChange={(e) => setBulkConfirmText(e.target.value)}
            placeholder={CONFIRM_PHRASE}
            autoFocus
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmBulkOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={() => bulkDeleteMut.mutate(Array.from(selected))}
              disabled={bulkConfirmText !== CONFIRM_PHRASE || bulkDeleteMut.isPending}
              className="bg-red-500/90 text-cream hover:bg-red-500"
            >
              {bulkDeleteMut.isPending ? 'Đang xóa…' : 'Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Single-row delete confirm (reuses bulk endpoint with one id) */}
      <Dialog open={!!confirmSingleId} onOpenChange={(o) => !o && setConfirmSingleId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa phiên?</DialogTitle>
            <DialogDescription>
              Session <code className="font-mono text-gold">{confirmSingleId}</code> sẽ bị xóa vĩnh
              viễn.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmSingleId(null)}>
              Hủy
            </Button>
            <Button
              onClick={() => {
                if (confirmSingleId) {
                  bulkDeleteMut.mutate([confirmSingleId]);
                  setConfirmSingleId(null);
                }
              }}
              className="bg-red-500/90 text-cream hover:bg-red-500"
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RowMenu({
  sessionId,
  onReOrchestrate,
  onDelete,
  reOrchPending,
}: {
  sessionId: string;
  onReOrchestrate: () => void;
  onDelete: () => void;
  reOrchPending: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Thao tác"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-cream/60 hover:bg-gold/10 hover:text-gold"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-44 p-1">
        <Link
          href={`/sessions/${sessionId}`}
          onClick={() => setOpen(false)}
          className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-cream hover:bg-gold/10"
        >
          <Eye className="h-3.5 w-3.5" />
          Xem chi tiết
        </Link>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            onReOrchestrate();
          }}
          disabled={reOrchPending}
          className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm text-cream hover:bg-gold/10 disabled:opacity-50"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Re-run pipeline
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            onDelete();
          }}
          className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm text-red-300 hover:bg-red-500/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Xóa
        </button>
      </PopoverContent>
    </Popover>
  );
}
