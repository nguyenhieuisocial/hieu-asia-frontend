'use client';

/**
 * Wave 60.62.T1.2 — extracted from /affiliates/promoters/page.tsx.
 *
 * affiliate_network table + reparent + ban/unban actions. Preserves all
 * Wave 43.2 business logic (PromoterRow schema, ban mutation with audit
 * breadcrumb from Wave 60.62.T1.1, reparent dialog).
 */

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  StatusBadge,
  toast,
} from '@hieu-asia/ui';
import { trackAdminMutation } from '@/lib/admin-breadcrumb';
import { AdminTable, type AdminTableColumn } from '@/components/admin/table/AdminTable';
import { useSavedFilters } from '@/lib/saved-filters';
import { SavedFiltersMenu } from '@/components/admin/SavedFiltersMenu';

// Recharts lazy-loaded — keeps it out of the initial admin bundle (tasks
// page pattern). ssr:false because admin is auth-gated.
const PromoterCharts = dynamic(
  () => import('@/components/affiliates/PromoterCharts').then((m) => m.PromoterCharts),
  {
    ssr: false,
    loading: () => <div className="h-64 animate-pulse rounded bg-muted/30" aria-hidden />,
  },
);

interface PromoterRow {
  user_id: string;
  parent_user_id: string | null;
  affiliate_code: string;
  email: string | null;
  depth: number;
  tier: string;
  status: string;
  l1_count: number;
  l2_count: number;
  l3_count: number;
  total_subtree: number;
  created_at: string;
}

async function fetchPromoters(): Promise<PromoterRow[]> {
  const r = await fetch('/api/admin/affiliates/promoters', { cache: 'no-store' });
  const d = await r.json();
  if (!r.ok || !d.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
  return d.promoters as PromoterRow[];
}

function dt(iso: string) {
  try {
    return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

export function PromotersTab() {
  const qc = useQueryClient();
  const [search, setSearch] = React.useState('');
  const [reparentTarget, setReparentTarget] = React.useState<PromoterRow | null>(null);
  const savedFilters = useSavedFilters<{ search: string }>('affiliate-promoters', { search: '' });

  const q = useQuery({
    queryKey: ['affiliate-promoters'],
    queryFn: fetchPromoters,
    refetchInterval: 60_000,
  });

  const banMut = useMutation({
    mutationFn: async ({ id, banned }: { id: string; banned: boolean }) => {
      const r = await fetch(`/api/admin/affiliates/${id}/ban`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ banned }),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
      return d;
    },
    onSuccess: (_d, vars) => {
      // Wave 60.62.T1.1 — backfill audit breadcrumb. Destructive (ban/unban).
      // PII-safe: only the action flag, no affiliate id.
      trackAdminMutation('affiliates.promoters.ban', 'success', { banned: vars.banned });
      toast.success('Đã cập nhật trạng thái');
      qc.invalidateQueries({ queryKey: ['affiliate-promoters'] });
    },
    onError: (e: Error) => {
      trackAdminMutation('affiliates.promoters.ban', 'failure', {
        error: e.message.slice(0, 200),
      });
      toast.error(e.message);
    },
  });

  const filtered = React.useMemo(() => {
    const rows = q.data ?? [];
    const s = search.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(
      (r) =>
        r.affiliate_code.toLowerCase().includes(s) ||
        (r.email ? r.email.toLowerCase().includes(s) : false) ||
        r.user_id.toLowerCase().includes(s),
    );
  }, [q.data, search]);

  const columns: AdminTableColumn<PromoterRow>[] = [
    { id: 'code', header: 'Mã', cell: (r) => <span className="font-mono text-gold">{r.affiliate_code}</span> },
    {
      id: 'email',
      header: 'Email',
      cell: (r) => (
        <span className="block max-w-[22ch] truncate text-foreground/85" title={r.email ?? undefined}>
          {r.email ?? '—'}
        </span>
      ),
    },
    {
      id: 'depth',
      header: 'Tầng',
      sortKey: 'depth',
      className: 'text-right',
      hideOnMobile: true,
      cell: (r) => <span className="font-mono">{r.depth}</span>,
    },
    { id: 'tier', header: 'Hạng', cell: (r) => <span className="capitalize">{r.tier}</span> },
    {
      id: 'status',
      header: 'Trạng thái',
      cell: (r) =>
        r.status === 'active' ? (
          <StatusBadge status="success" label="Hoạt động" />
        ) : (
          <StatusBadge status="error" label={r.status === 'banned' ? 'Bị ban' : r.status} />
        ),
    },
    { id: 'l1', header: 'L1', className: 'text-right', hideOnMobile: true, cell: (r) => <span className="font-mono">{r.l1_count}</span> },
    { id: 'l2', header: 'L2', className: 'text-right', hideOnMobile: true, cell: (r) => <span className="font-mono">{r.l2_count}</span> },
    { id: 'l3', header: 'L3', className: 'text-right', hideOnMobile: true, cell: (r) => <span className="font-mono">{r.l3_count}</span> },
    {
      id: 'created_at',
      header: 'Tạo',
      hideOnMobile: true,
      cell: (r) => <span className="text-xs text-muted-foreground">{dt(r.created_at)}</span>,
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: (r) => (
        <div className="flex flex-wrap gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              if (!confirm('Ban/Unban tài khoản này?')) return;
              banMut.mutate({ id: r.user_id, banned: r.status === 'active' });
            }}
            disabled={banMut.isPending}
            className="border border-border"
          >
            {r.status === 'active' ? 'Ban' : 'Unban'}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setReparentTarget(r)}
            className="border border-border"
          >
            Reparent
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Bảng affiliate_network: ai mời ai, depth, tier, subtree size, ban + reparent.
        </p>
        <Button variant="ghost" className="border border-border" onClick={() => q.refetch()}>
          Làm mới
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 pt-6">
          <Input
            placeholder="Tìm mã / email / user_id…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <div className="ml-auto text-sm text-muted-foreground">
            {filtered.length} / {q.data?.length ?? 0}
          </div>
          <SavedFiltersMenu
            presets={savedFilters.presets}
            onApply={(name) => {
              const p = savedFilters.loadPreset(name);
              if (p) setSearch(p.search);
            }}
            onDelete={savedFilters.deletePreset}
            onSave={(name) => savedFilters.savePreset(name, { search })}
            saveHint="Lưu bộ lọc hiện tại"
          />
        </CardContent>
      </Card>

      {!q.isLoading && !q.error && (
        <PromoterCharts rows={q.data ?? []} />
      )}

      <Card>
        <CardContent className="pt-6">
          {q.error ? (
            <p className="text-sm text-red-700 dark:text-red-300">{(q.error as Error).message}</p>
          ) : (
            <AdminTable
              rows={filtered}
              columns={columns}
              getRowId={(r) => r.user_id}
              loading={q.isLoading}
              caption="Danh sách promoter"
              empty={<span className="text-sm text-muted-foreground">Chưa có promoter nào.</span>}
            />
          )}
        </CardContent>
      </Card>

      <ReparentDialog
        target={reparentTarget}
        promoters={q.data ?? []}
        onClose={() => setReparentTarget(null)}
        onDone={() => {
          setReparentTarget(null);
          qc.invalidateQueries({ queryKey: ['affiliate-promoters'] });
        }}
      />
    </div>
  );
}

function ReparentDialog({
  target,
  promoters,
  onClose,
  onDone,
}: {
  target: PromoterRow | null;
  promoters: PromoterRow[];
  onClose: () => void;
  onDone: () => void;
}) {
  const [parentInput, setParentInput] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    setParentInput(target?.parent_user_id ?? '');
  }, [target]);

  const suggestion = React.useMemo(() => {
    if (!parentInput) return null;
    const s = parentInput.trim().toLowerCase();
    return promoters.find(
      (p) =>
        p.user_id.toLowerCase() === s ||
        p.affiliate_code.toLowerCase() === s ||
        (p.email ? p.email.toLowerCase() === s : false),
    );
  }, [parentInput, promoters]);

  async function submit() {
    if (!target) return;
    const trimmed = parentInput.trim();
    const newParentUserId = trimmed === '' ? null : (suggestion?.user_id ?? trimmed);
    setBusy(true);
    try {
      const r = await fetch(`/api/admin/affiliates/${target.user_id}/reparent`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ new_parent_user_id: newParentUserId }),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
      toast.success('Đã reparent thành công');
      onDone();
    } catch (e) {
      const msg = (e as Error).message;
      // Worker surfaces the Postgres RPC "Cycle detected — new parent is in
      // self subtree" raw — translate to a friendly vi-VN hint.
      if (/cycle/i.test(msg)) {
        toast.error('Không thể chuyển: tạo vòng lặp — cha mới đã là cấp dưới của affiliate này.');
      } else {
        toast.error(msg);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={!!target} onOpenChange={(o) => (!o ? onClose() : null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reparent affiliate</DialogTitle>
        </DialogHeader>
        {target && (
          <div className="space-y-3 text-sm">
            <div>
              Affiliate:{' '}
              <span className="font-mono text-gold">{target.affiliate_code}</span> (
              {target.email ?? target.user_id.slice(0, 8)})
            </div>
            <div>
              Parent hiện tại:{' '}
              <span className="font-mono">
                {target.parent_user_id ?? '(root)'}
              </span>
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase text-muted-foreground">
                Parent user_id mới (hoặc affiliate code / email, bỏ trống để promote về root)
              </label>
              <Input
                value={parentInput}
                onChange={(e) => setParentInput(e.target.value)}
                placeholder="uuid / code / email"
                disabled={busy}
              />
              {suggestion && (
                <p className="mt-1 text-xs text-muted-foreground">
                  → resolve về:{' '}
                  <span className="font-mono text-gold">{suggestion.affiliate_code}</span> (
                  {suggestion.user_id})
                </p>
              )}
            </div>
            <p className="rounded border border-yellow-500/30 bg-yellow-500/5 p-2 text-xs text-yellow-700 dark:text-yellow-200">
              Cảnh báo: RPC sẽ recompute path + depth toàn bộ subtree. Cycle detect tự động.
            </p>
          </div>
        )}
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            Hủy
          </Button>
          <Button onClick={submit} disabled={busy}>
            {busy ? 'Đang reparent…' : 'Xác nhận reparent'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
