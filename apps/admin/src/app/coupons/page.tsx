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
  CardDescription,
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
  toast,
} from '@hieu-asia/ui';
import { Ticket, Plus, ShieldAlert, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';

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

function fmtDate(iso?: string | null) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return iso;
  }
}

function statusPill(s: Coupon['status']) {
  const cls =
    s === 'active'
      ? 'border-jade/40 bg-jade/10 text-jade'
      : s === 'expired'
      ? 'border-cream/30 bg-cream/5 text-cream/65'
      : 'border-red-400/40 bg-red-500/10 text-red-200';
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${cls}`}
    >
      {s}
    </span>
  );
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
  });

  const coupons = data?.coupons ?? [];
  const showError = !!error || data?.ok === false;
  const errorMsg = (error as Error | undefined)?.message ?? data?.error;
  const note = data?.note;

  const activeCount = coupons.filter((c) => c.status === 'active').length;

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
      toast.success('Đã revoke coupon');
      qc.invalidateQueries({ queryKey: ['admin', 'coupons'] });
    },
    onError: (e) => toast.error('Revoke thất bại', { description: (e as Error).message }),
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
    if (typeof window !== 'undefined' && !window.confirm(`Revoke coupon "${code}"? Action không undo được.`)) return;
    revokeMut.mutate(code);
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
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="mr-1 h-3.5 w-3.5" />
            Tạo mới
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách coupon</CardTitle>
          <CardDescription>
            State trong Postgres `hieu_asia.coupons`. Tự động chuyển `expired` khi quá `valid_to`.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showError && (
            <div className="mb-4 rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {errorMsg ?? 'Không tải được danh sách coupon.'}
            </div>
          )}

          {note && (
            <div className="mb-4 flex items-start gap-2 rounded-md border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{note}</span>
            </div>
          )}

          {isLoading && <div className="px-3 py-6 text-center text-cream/55">Đang tải…</div>}

          {!isLoading && coupons.length === 0 && !showError && (
            <EmptyState
              title="Chưa có coupon"
              description="Tạo mã giảm giá đầu tiên để chạy promo / referral."
              className="my-2 border-0 bg-transparent"
            />
          )}

          {coupons.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gold/15 text-left text-[11px] uppercase tracking-wider text-cream/60">
                    <th className="px-3 py-2 font-medium">Code</th>
                    <th className="px-3 py-2 font-medium">Giảm</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                    <th className="px-3 py-2 font-medium">Uses</th>
                    <th className="px-3 py-2 font-medium">Hiệu lực</th>
                    <th className="px-3 py-2 font-medium">Note</th>
                    <th className="px-3 py-2 font-medium">Tạo</th>
                    <th className="px-3 py-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => (
                    <tr
                      key={c.code}
                      className="border-b border-gold/10 transition-colors hover:bg-ink/40"
                    >
                      <td className="px-3 py-2 font-mono text-gold">{c.code}</td>
                      <td className="px-3 py-2">{c.discount_pct}%</td>
                      <td className="px-3 py-2">{statusPill(c.status)}</td>
                      <td className="px-3 py-2 font-mono text-xs text-cream/70">
                        {c.uses ?? 0}
                        {c.max_uses ? <span className="text-cream/40">/{c.max_uses}</span> : ''}
                      </td>
                      <td className="px-3 py-2 font-mono text-[11px] text-cream/65">
                        {fmtDate(c.valid_from)} → {fmtDate(c.valid_to)}
                      </td>
                      <td className="max-w-[18ch] truncate px-3 py-2 text-xs text-cream/55" title={c.notes ?? ''}>
                        {c.notes ?? '—'}
                      </td>
                      <td className="px-3 py-2 font-mono text-[11px] text-cream/50">
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

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
              <p className="mt-1 font-mono text-[10px] text-cream/45">
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
