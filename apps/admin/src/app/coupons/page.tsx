'use client';

/**
 * /admin/coupons — Coupon CRUD (Postgres `hieu_asia.coupons`).
 *
 * - GET   /api/admin/coupons         → list
 * - POST  /api/admin/coupons         → create (code/discount_pct/valid_from?/valid_to?/max_uses?/notes?)
 * - PATCH /api/admin/coupons/:code   → edit a live coupon (discount_pct/valid_to/max_uses/notes)
 * - POST  /api/admin/coupons/revoke  → revoke ({code})
 *
 * Edit lets an admin extend/adjust a running promo in place (no revoke+recreate,
 * which would break a code customers already saved). Revoked coupons are terminal
 * and not editable; an expired coupon CAN be edited (e.g. push out valid_to to
 * revive it). Empty state shows worker note when the table isn't provisioned yet.
 */

import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
  Label,
  StatusBadge,
  cn,
  toast,
} from '@hieu-asia/ui';
import { Ticket, Plus, ShieldAlert, Trash2, Search, Percent, CheckCircle2, XCircle, Download, Pencil } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { SavedFiltersMenu } from '@/components/admin/SavedFiltersMenu';
import { useSavedFilters } from '@/lib/saved-filters';
import { ErrorBlock } from '@/components/admin/error-block';
import { KpiCard } from '@/components/admin/kpi-card';
import { exportToCSV, fmtCsvFilename } from '@/lib/csv-export';
import { useBulkSelection } from '@/lib/bulk-action';
import { AdminTable, type AdminTableColumn } from '@/components/admin/table/AdminTable';
import { trackAdminMutation } from '@/lib/admin-breadcrumb';

interface Coupon {
  code: string;
  /** Percent discount — null for fixed-VND coupons (e.g. CTV credit codes). */
  discount_pct: number | null;
  /** Fixed VND discount — set when discount_pct is null (backend coupons.ts). */
  discount_vnd?: number | null;
  /** Plans the coupon applies to — empty/null = every plan (backend coupons.ts). */
  tier_filter?: string[] | null;
  status: 'active' | 'revoked' | 'expired';
  uses?: number;
  max_uses?: number | null;
  valid_from?: string | null;
  valid_to?: string | null;
  notes?: string | null;
  created_at?: string | null;
}

interface CouponsResponse {
  ok: boolean;
  coupons?: Coupon[];
  note?: string;
  error?: string;
}

type StatusFilter = 'all' | 'active' | 'revoked' | 'expired';

const STATUS_FILTERS: Array<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: 'Tất cả' },
  { value: 'active', label: 'Còn hiệu lực' },
  { value: 'revoked', label: 'Đã thu hồi' },
  { value: 'expired', label: 'Hết hạn' },
];

function fmtDate(iso?: string | null) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return iso;
  }
}

// Wave 60.81.B Tier 3 polish — delegate to canonical `StatusBadge` (success /
// warning / error / info / neutral) so coupons/sessions/tasks/payments share
// one pill component. Expired = neutral (information-only), revoked = error.
const STATUS_TONE: Record<
  Coupon['status'],
  React.ComponentProps<typeof StatusBadge>['status']
> = {
  active: 'success',
  expired: 'neutral',
  revoked: 'error',
};

const STATUS_LABEL: Record<Coupon['status'], string> = {
  active: 'Còn hiệu lực',
  expired: 'Hết hạn',
  revoked: 'Đã thu hồi',
};

function statusPill(s: Coupon['status']) {
  return <StatusBadge status={STATUS_TONE[s]} label={STATUS_LABEL[s]} />;
}

async function fetchCoupons(): Promise<CouponsResponse> {
  const r = await fetch('/api/admin/coupons', { cache: 'no-store' });
  const text = await r.text();
  try {
    return JSON.parse(text) as CouponsResponse;
  } catch {
    return { ok: false, error: `Invalid JSON (status ${r.status})` };
  }
}

interface CreateInput {
  code: string;
  discount_pct: number;
  valid_from?: string;
  valid_to?: string;
  max_uses?: number;
  notes?: string;
}

async function createCoupon(input: CreateInput): Promise<Coupon> {
  const r = await fetch('/api/admin/coupons', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await r.json().catch(() => ({ ok: false, error: `HTTP ${r.status}` }));
  if (!r.ok || !data.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
  return data.coupon as Coupon;
}

async function revokeCoupon(code: string): Promise<void> {
  const r = await fetch('/api/admin/coupons/revoke', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  const data = await r.json().catch(() => ({ ok: false, error: `HTTP ${r.status}` }));
  if (!r.ok || !data.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
}

interface EditInput {
  discount_pct: number;
  // null = clear the column (unlimited uses / never expires / no note).
  max_uses: number | null;
  valid_to: string | null; // 'YYYY-MM-DD' from the date input, or null
  notes: string | null;
}

async function updateCoupon(code: string, input: EditInput): Promise<Coupon> {
  const r = await fetch(`/api/admin/coupons/${encodeURIComponent(code)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await r.json().catch(() => ({ ok: false, error: `HTTP ${r.status}` }));
  if (!r.ok || !data.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
  return data.coupon as Coupon;
}

export default function CouponsPage() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'coupons'],
    queryFn: fetchCoupons,
    staleTime: 60_000,
  });

  const coupons = React.useMemo(() => data?.coupons ?? [], [data?.coupons]);
  const showError = !!error || data?.ok === false;
  const errorMsg = (error as Error | undefined)?.message ?? data?.error;
  const note = data?.note;

  // -- Filtering --------------------------------------------------------------
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>('all');
  const searchRef = React.useRef<HTMLInputElement>(null);
  const savedFilters = useSavedFilters<{ search: string; statusFilter: StatusFilter }>(
    'coupons',
    { search: '', statusFilter: 'all' },
  );

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return coupons.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (q && !c.code.toLowerCase().includes(q) && !(c.notes ?? '').toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [coupons, search, statusFilter]);

  // -- Bulk selection ---------------------------------------------------------
  // Only active coupons are selectable (revoked/expired can't be re-revoked).
  const activeFiltered = React.useMemo(
    () => filtered.filter((c) => c.status === 'active'),
    [filtered],
  );
  const bulk = useBulkSelection(activeFiltered, (c) => c.code);
  const selected = bulk.selected;
  const allActiveFilteredSelected = bulk.allSelected;
  const togglePage = bulk.toggleAll;
  const toggleOne = bulk.toggle;
  const clearSelection = bulk.clear;

  // -- KPIs -------------------------------------------------------------------
  const activeCount = coupons.filter((c) => c.status === 'active').length;
  const revokedCount = coupons.filter((c) => c.status === 'revoked').length;
  const expiredCount = coupons.filter((c) => c.status === 'expired').length;
  const totalUses = coupons.reduce((s, c) => s + (c.uses ?? 0), 0);

  // -- Create dialog ----------------------------------------------------------
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<CreateInput>({ code: '', discount_pct: 10 });

  const createMut = useMutation({
    mutationFn: createCoupon,
    onSuccess: (c) => {
      toast.success('Tạo coupon thành công', { description: c.code });
      qc.invalidateQueries({ queryKey: ['admin', 'coupons'] });
      setOpen(false);
      setForm({ code: '', discount_pct: 10 });
    },
    onError: (e) => toast.error('Tạo coupon thất bại', { description: (e as Error).message }),
  });

  const revokeMut = useMutation({
    mutationFn: revokeCoupon,
    onSuccess: () => {
      // Wave 60.15/60.16 — destructive action. No coupon code in data.
      trackAdminMutation('coupons.revoke', 'success');
      toast.success('Đã revoke coupon');
      qc.invalidateQueries({ queryKey: ['admin', 'coupons'] });
    },
    onError: (e) => {
      const msg = (e as Error).message;
      trackAdminMutation('coupons.revoke', 'failure', { error: msg.slice(0, 200) });
      toast.error('Revoke thất bại', { description: msg });
    },
  });

  // -- Edit dialog ------------------------------------------------------------
  const [editCode, setEditCode] = React.useState<string | null>(null);
  const [editForm, setEditForm] = React.useState<EditInput>({
    discount_pct: 10,
    max_uses: null,
    valid_to: null,
    notes: null,
  });

  function openEdit(c: Coupon) {
    setEditForm({
      // Fixed-VND coupon (pct=null) → prefill 0; validation (1-100) blocks
      // accidentally saving a pct over a VND coupon.
      discount_pct: c.discount_pct ?? 0,
      max_uses: c.max_uses ?? null,
      // ISO timestamp → 'YYYY-MM-DD' for the <input type="date">.
      valid_to: c.valid_to ? c.valid_to.slice(0, 10) : null,
      notes: c.notes ?? null,
    });
    setEditCode(c.code);
  }

  const editMut = useMutation({
    mutationFn: ({ code, input }: { code: string; input: EditInput }) => updateCoupon(code, input),
    onSuccess: (c) => {
      trackAdminMutation('coupons.update', 'success');
      toast.success('Đã cập nhật coupon', { description: c.code });
      qc.invalidateQueries({ queryKey: ['admin', 'coupons'] });
      setEditCode(null);
    },
    onError: (e) => {
      const msg = (e as Error).message;
      trackAdminMutation('coupons.update', 'failure', { error: msg.slice(0, 200) });
      toast.error('Cập nhật thất bại', { description: msg });
    },
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.code || !form.discount_pct) {
      toast.error('Code + discount % bắt buộc');
      return;
    }
    if (form.discount_pct < 1 || form.discount_pct > 100) {
      toast.error('Discount % phải nằm 1–100');
      return;
    }
    createMut.mutate(form);
  }

  function onEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editCode) return;
    if (editForm.discount_pct < 1 || editForm.discount_pct > 100) {
      toast.error('Discount % phải nằm 1–100');
      return;
    }
    editMut.mutate({ code: editCode, input: editForm });
  }

  function onRevoke(code: string) {
    if (
      typeof window !== 'undefined' &&
      !window.confirm(`Revoke coupon "${code}"? Action không undo được.`)
    )
      return;
    revokeMut.mutate(code);
  }

  // TODO(sprint-3): replace client-side loop with `POST /admin/coupons/bulk-revoke`
  // that accepts `{ codes: string[] }` and writes one audit_log entry.
  async function bulkRevoke() {
    const codes = Array.from(selected);
    if (codes.length === 0) return;
    if (
      typeof window !== 'undefined' &&
      !window.confirm(`Vô hiệu hoá ${codes.length} coupon? Action không undo được.`)
    )
      return;
    for (const c of codes) {
      try {
        await revokeCoupon(c);
      } catch (err) {
        toast.error(`Revoke ${c} thất bại`, { description: (err as Error).message });
      }
    }
    toast.success(`Đã vô hiệu hoá ${codes.length} coupon`);
    clearSelection();
    qc.invalidateQueries({ queryKey: ['admin', 'coupons'] });
  }

  // Custom leading checkbox column (NOT AdminTable onBulkSelect) so we keep the
  // external useBulkSelection state + the active-only constraint (non-active
  // coupons are non-selectable) + the shared bulk-action bar wiring.
  const columns: AdminTableColumn<Coupon>[] = [
    {
      id: 'select',
      className: 'w-10',
      header: (
        <input
          type="checkbox"
          checked={allActiveFilteredSelected}
          onChange={togglePage}
          aria-label="Chọn tất cả coupon active"
          className="h-4 w-4 cursor-pointer rounded border-gold/30 bg-card/60 text-gold accent-gold"
        />
      ),
      cell: (c) => (
        <input
          type="checkbox"
          checked={selected.has(c.code)}
          disabled={c.status !== 'active'}
          onChange={() => toggleOne(c.code)}
          aria-label={`Chọn ${c.code}`}
          className="h-4 w-4 cursor-pointer rounded border-gold/30 bg-card/60 text-gold accent-gold disabled:cursor-not-allowed disabled:opacity-30"
        />
      ),
    },
    { id: 'code', header: 'Mã', cell: (c) => <span className="font-mono text-gold">{c.code}</span> },
    {
      id: 'discount',
      header: 'Giảm',
      // Gap audit 2026-07-02 — fixed-VND coupons (discount_pct=null,
      // discount_vnd set; e.g. CTV credit codes) rendered "null%".
      cell: (c) =>
        c.discount_pct != null ? (
          <span className="tabular-nums text-foreground/90">{c.discount_pct}%</span>
        ) : c.discount_vnd != null ? (
          <span className="tabular-nums text-foreground/90">
            {Number(c.discount_vnd).toLocaleString('vi-VN')}đ
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      // Gap audit 2026-07-02 — tier_filter (coupon áp cho gói nào) được trả về
      // nhưng chưa hiển thị; admin không biết phạm vi coupon.
      id: 'scope',
      header: 'Áp dụng cho',
      cell: (c) =>
        c.tier_filter && c.tier_filter.length > 0 ? (
          <span className="text-xs text-foreground/80" title={c.tier_filter.join(', ')}>
            {c.tier_filter.join(', ')}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">Mọi gói</span>
        ),
    },
    { id: 'status', header: 'Trạng thái', cell: (c) => statusPill(c.status) },
    {
      id: 'uses',
      header: 'Lượt dùng',
      hideOnMobile: true,
      cell: (c) => (
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {c.uses ?? 0}
          {c.max_uses ? <span className="text-muted-foreground">/{c.max_uses}</span> : ''}
        </span>
      ),
    },
    {
      id: 'validity',
      header: 'Hiệu lực',
      hideOnMobile: true,
      cell: (c) => (
        <span className="font-mono text-[11px] text-muted-foreground">
          {fmtDate(c.valid_from)} → {fmtDate(c.valid_to)}
        </span>
      ),
    },
    {
      id: 'note',
      header: 'Ghi chú',
      className: 'max-w-[18ch] truncate',
      hideOnMobile: true,
      cell: (c) => (
        <span className="text-xs text-muted-foreground" title={c.notes ?? ''}>
          {c.notes ?? '—'}
        </span>
      ),
    },
    {
      id: 'created',
      header: 'Tạo',
      hideOnMobile: true,
      cell: (c) => (
        <span className="font-mono text-[11px] text-muted-foreground">{fmtDate(c.created_at)}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      className: 'text-right',
      cell: (c) => (
        <div className="flex items-center justify-end gap-1">
          {c.status !== 'revoked' && (
            <Button
              size="sm"
              variant="ghost"
              disabled={editMut.isPending}
              onClick={() => openEdit(c)}
              aria-label={`Sửa ${c.code}`}
              title="Sửa coupon"
              className="text-gold hover:bg-gold/10"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {c.status === 'active' && (
            <Button
              size="sm"
              variant="ghost"
              disabled={revokeMut.isPending}
              onClick={() => onRevoke(c.code)}
              aria-label={`Thu hồi ${c.code}`}
              title="Thu hồi coupon"
              className="text-red-400 hover:bg-red-900/30 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coupons"
        description="Mã giảm giá kích hoạt tại checkout. Tạo, sửa (mức giảm / hạn / lượt) và thu hồi."
        icon={<Ticket className="h-5 w-5" />}
        badge={
          coupons.length > 0 ? (
            <span className="rounded-full border border-gold/20 bg-gold/10 px-2 py-0.5 font-mono text-[10px] text-gold">
              {activeCount}/{coupons.length} active
            </span>
          ) : null
        }
        actions={
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                exportToCSV(
                  filtered.map((c) => ({
                    code: c.code,
                    discount_pct: c.discount_pct,
                    status: c.status,
                    uses: c.uses ?? 0,
                    max_uses: c.max_uses ?? '',
                    valid_from: c.valid_from ?? '',
                    valid_to: c.valid_to ?? '',
                    notes: c.notes ?? '',
                    created_at: c.created_at ?? '',
                  })),
                  fmtCsvFilename('coupons'),
                  {
                    code: 'Code',
                    discount_pct: 'Discount %',
                    status: 'Status',
                    uses: 'Lượt dùng',
                    max_uses: 'Max uses',
                    valid_from: 'Valid from',
                    valid_to: 'Valid to',
                    notes: 'Notes',
                    created_at: 'Ngày tạo',
                  },
                )
              }
              disabled={filtered.length === 0}
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Xuất CSV
            </Button>
            <Button size="sm" onClick={() => setOpen(true)}>
              <Plus className="mr-1 h-3.5 w-3.5" />
              Tạo mới
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Còn hiệu lực"
          value={activeCount}
          icon={<CheckCircle2 className="h-4 w-4" />}
          accent="jade"
          hint="đang dùng được"
        />
        <KpiCard
          label="Đã thu hồi"
          value={revokedCount}
          icon={<XCircle className="h-4 w-4" />}
          accent={revokedCount > 0 ? 'red' : 'jade'}
          hint="đã thu hồi"
        />
        <KpiCard
          label="Hết hạn"
          value={expiredCount}
          icon={<Ticket className="h-4 w-4" />}
          accent="purple"
          hint="hết hạn"
        />
        <KpiCard
          label="Lượt dùng"
          value={totalUses}
          icon={<Percent className="h-4 w-4" />}
          accent="gold"
          hint="tổng redeem"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bộ lọc</CardTitle>
          <div className="mt-2 flex flex-col gap-3">
            <div className="relative max-w-md">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                ref={searchRef}
                placeholder="Tìm code / note…   (phím /)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {STATUS_FILTERS.map((f) => {
                const active = statusFilter === f.value;
                return (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setStatusFilter(f.value)}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs font-medium transition-all duration-300 ease-editorial',
                      active
                        ? 'border-gold/60 bg-gold/15 text-gold'
                        : 'border-border bg-card/60 text-muted-foreground hover:border-gold/30 hover:text-foreground',
                    )}
                  >
                    {f.label}
                  </button>
                );
              })}
              <SavedFiltersMenu
                className="ml-auto"
                presets={savedFilters.presets}
                onApply={(name) => {
                  const p = savedFilters.loadPreset(name);
                  if (p) {
                    setSearch(p.search);
                    setStatusFilter(p.statusFilter);
                  }
                }}
                onDelete={savedFilters.deletePreset}
                onSave={(name) =>
                  savedFilters.savePreset(name, { search, statusFilter })
                }
                saveHint="Lưu tìm kiếm + trạng thái hiện tại"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {showError && (
            <div className="mb-4">
              <ErrorBlock
                compact
                message={errorMsg ?? 'Không tải được danh sách coupon.'}
                onRetry={() => qc.invalidateQueries({ queryKey: ['admin', 'coupons'] })}
              />
            </div>
          )}

          {note && (
            <div className="mb-4 flex items-start gap-2 rounded-md border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-200">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{note}</span>
            </div>
          )}

          {isLoading && (
            <div className="space-y-2 py-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-muted/30" />
              ))}
            </div>
          )}

          {!isLoading && filtered.length === 0 && !showError && (
            <EmptyState
              title={coupons.length === 0 ? 'Chưa có coupon' : 'Không có coupon khớp bộ lọc'}
              description={
                coupons.length === 0
                  ? 'Tạo mã giảm giá đầu tiên để chạy promo / referral.'
                  : 'Thử bỏ filter hoặc xóa search query.'
              }
              className="my-2 border-0 bg-transparent"
            />
          )}

          {filtered.length > 0 && (
            <AdminTable
              rows={filtered}
              columns={columns}
              getRowId={(c) => c.code}
              rowClassName={(c) =>
                cn('hover:bg-gold/[0.03]', selected.has(c.code) && 'bg-gold/5')
              }
              caption="Danh sách coupon"
            />
          )}
        </CardContent>
      </Card>

      {/* Floating bulk action bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 lg:left-[calc(50%+8rem)]">
          <div className="flex items-center gap-2 rounded-full border border-gold/40 bg-card/95 px-3 py-2 shadow-2xl backdrop-blur">
            <span className="px-2 font-mono text-xs text-gold">{selected.size} đã chọn</span>
            <Button
              size="sm"
              onClick={bulkRevoke}
              disabled={revokeMut.isPending}
              className="bg-red-500/90 text-foreground hover:bg-red-500"
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Vô hiệu hoá {selected.size} coupon
            </Button>
            <Button size="sm" variant="ghost" onClick={clearSelection}>
              Bỏ chọn
            </Button>
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo coupon mới</DialogTitle>
            <DialogDescription>
              Code phải UNIQUE. Hỗ trợ optional max_uses + thời hạn.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4 py-2">
            <div>
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                placeholder="HIEUFREE10"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase().trim() })}
                required
                pattern="[A-Z0-9_-]{3,32}"
              />
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                UPPER_SNAKE_CASE, 3–32 ký tự, A-Z 0-9 _ -.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="pct">Giảm (%)</Label>
                <Input
                  id="pct"
                  type="number"
                  min={1}
                  max={100}
                  value={form.discount_pct}
                  onChange={(e) => setForm({ ...form, discount_pct: Number(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="max">Max uses</Label>
                <Input
                  id="max"
                  type="number"
                  min={1}
                  placeholder="vô hạn"
                  value={form.max_uses ?? ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      max_uses: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="from">Hiệu lực từ</Label>
                <Input
                  id="from"
                  type="date"
                  value={form.valid_from ?? ''}
                  onChange={(e) => setForm({ ...form, valid_from: e.target.value || undefined })}
                />
              </div>
              <div>
                <Label htmlFor="to">Hết hạn</Label>
                <Input
                  id="to"
                  type="date"
                  value={form.valid_to ?? ''}
                  onChange={(e) => setForm({ ...form, valid_to: e.target.value || undefined })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Ghi chú</Label>
              <Input
                id="notes"
                placeholder="Promo Tết 2026"
                value={form.notes ?? ''}
                onChange={(e) => setForm({ ...form, notes: e.target.value || undefined })}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Huỷ
              </Button>
              <Button type="submit" disabled={createMut.isPending}>
                {createMut.isPending ? 'Đang tạo…' : 'Tạo coupon'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editCode !== null} onOpenChange={(o) => (o ? null : setEditCode(null))}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Sửa coupon <span className="font-mono text-gold">{editCode}</span>
            </DialogTitle>
            <DialogDescription>
              Đổi mức giảm / hạn dùng / lượt mà không phải thu hồi rồi tạo lại — mã khách đã lưu vẫn dùng được.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onEditSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="edit-pct">Giảm (%)</Label>
                <Input
                  id="edit-pct"
                  type="number"
                  min={1}
                  max={100}
                  value={editForm.discount_pct}
                  onChange={(e) => setEditForm({ ...editForm, discount_pct: Number(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-max">Max uses</Label>
                <Input
                  id="edit-max"
                  type="number"
                  min={1}
                  placeholder="vô hạn"
                  value={editForm.max_uses ?? ''}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      max_uses: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-to">Hết hạn</Label>
              <Input
                id="edit-to"
                type="date"
                value={editForm.valid_to ?? ''}
                onChange={(e) => setEditForm({ ...editForm, valid_to: e.target.value || null })}
              />
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                Để trống = không hết hạn. Đặt ngày tương lai cho coupon đã hết hạn để dùng lại.
              </p>
            </div>
            <div>
              <Label htmlFor="edit-notes">Ghi chú</Label>
              <Input
                id="edit-notes"
                placeholder="Promo Tết 2026"
                value={editForm.notes ?? ''}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value || null })}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditCode(null)}>
                Huỷ
              </Button>
              <Button type="submit" disabled={editMut.isPending}>
                {editMut.isPending ? 'Đang lưu…' : 'Lưu thay đổi'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
