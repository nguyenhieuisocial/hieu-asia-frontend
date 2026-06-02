'use client';

/**
 * /admin/coupons — Coupon CRUD (Postgres `hieu_asia.coupons`).
 *
 * - GET  /api/admin/coupons         → list
 * - POST /api/admin/coupons         → create (code/discount_pct/valid_from?/valid_to?/max_uses?/notes?)
 * - POST /api/admin/coupons/revoke  → revoke ({code})
 *
 * No edit action in v1 — match brief. Empty state shows worker note when
 * the table isn't provisioned yet.
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
import { Ticket, Plus, ShieldAlert, Trash2, Search, Percent, CheckCircle2, XCircle, Download } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { ErrorBlock } from '@/components/admin/error-block';
import { KpiCard } from '@/components/admin/kpi-card';
import { exportToCSV, fmtCsvFilename } from '@/lib/csv-export';
import { useBulkSelection } from '@/lib/bulk-action';
import { trackAdminMutation } from '@/lib/admin-breadcrumb';

interface Coupon {
  code: string;
  discount_pct: number;
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
  { value: 'active', label: 'Active' },
  { value: 'revoked', label: 'Revoked' },
  { value: 'expired', label: 'Expired' },
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

function statusPill(s: Coupon['status']) {
  return <StatusBadge status={STATUS_TONE[s]} label={s} />;
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coupons"
        description="Mã giảm giá kích hoạt tại checkout. Hỗ trợ tạo + revoke; edit không trong v1."
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
                    uses: 'Uses',
                    max_uses: 'Max uses',
                    valid_from: 'Valid from',
                    valid_to: 'Valid to',
                    notes: 'Notes',
                    created_at: 'Created',
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
          label="Active"
          value={activeCount}
          icon={<CheckCircle2 className="h-4 w-4" />}
          accent="jade"
          hint="đang dùng được"
        />
        <KpiCard
          label="Revoked"
          value={revokedCount}
          icon={<XCircle className="h-4 w-4" />}
          accent={revokedCount > 0 ? 'red' : 'jade'}
          hint="đã thu hồi"
        />
        <KpiCard
          label="Expired"
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
            <div className="flex flex-wrap gap-1.5">
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
            <div className="mb-4 flex items-start gap-2 rounded-md border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
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
            <div className="overflow-x-auto rounded-lg border border-gold/15 bg-card/60">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold/15 text-left text-[11px] uppercase tracking-wider text-gold/80">
                    <th className="w-10 px-3 py-2">
                      <input
                        type="checkbox"
                        checked={allActiveFilteredSelected}
                        onChange={togglePage}
                        aria-label="Chọn tất cả coupon active"
                        className="h-4 w-4 cursor-pointer rounded border-gold/30 bg-card/60 text-gold accent-gold"
                      />
                    </th>
                    <th className="px-3 py-2 font-medium">Code</th>
                    <th className="px-3 py-2 font-medium">Giảm</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                    <th className="px-3 py-2 font-medium">Uses</th>
                    <th className="px-3 py-2 font-medium">Hiệu lực</th>
                    <th className="px-3 py-2 font-medium">Note</th>
                    <th className="px-3 py-2 font-medium">Tạo</th>
                    <th className="px-3 py-2 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => {
                    const isSelected = selected.has(c.code);
                    const canSelect = c.status === 'active';
                    return (
                      <tr
                        key={c.code}
                        className={cn(
                          'border-b border-gold/10 transition-all duration-300 ease-editorial last:border-0 hover:bg-gold/[0.03]',
                          isSelected && 'bg-gold/5',
                        )}
                      >
                        <td className="px-3 py-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={!canSelect}
                            onChange={() => toggleOne(c.code)}
                            aria-label={`Chọn ${c.code}`}
                            className="h-4 w-4 cursor-pointer rounded border-gold/30 bg-card/60 text-gold accent-gold disabled:cursor-not-allowed disabled:opacity-30"
                          />
                        </td>
                        <td className="px-3 py-2 font-mono text-gold">{c.code}</td>
                        <td className="px-3 py-2 tabular-nums text-foreground/90">
                          {c.discount_pct}%
                        </td>
                        <td className="px-3 py-2">{statusPill(c.status)}</td>
                        <td className="px-3 py-2 font-mono text-xs text-muted-foreground tabular-nums">
                          {c.uses ?? 0}
                          {c.max_uses ? <span className="text-muted-foreground">/{c.max_uses}</span> : ''}
                        </td>
                        <td className="px-3 py-2 font-mono text-[11px] text-muted-foreground">
                          {fmtDate(c.valid_from)} → {fmtDate(c.valid_to)}
                        </td>
                        <td
                          className="max-w-[18ch] truncate px-3 py-2 text-xs text-muted-foreground"
                          title={c.notes ?? ''}
                        >
                          {c.notes ?? '—'}
                        </td>
                        <td className="px-3 py-2 font-mono text-[11px] text-muted-foreground">
                          {fmtDate(c.created_at)}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {c.status === 'active' ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={revokeMut.isPending}
                              onClick={() => onRevoke(c.code)}
                              className="text-red-400 hover:bg-red-900/30 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
    </div>
  );
}
