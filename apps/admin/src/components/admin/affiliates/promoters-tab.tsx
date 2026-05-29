'use client';

/**
 * Wave 60.62.T1.2 — extracted from /affiliates/promoters/page.tsx.
 *
 * affiliate_network table + reparent + ban/unban actions. Preserves all
 * Wave 43.2 business logic (PromoterRow schema, ban mutation with audit
 * breadcrumb from Wave 60.62.T1.1, reparent dialog).
 */

import * as React from 'react';
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
  toast,
} from '@hieu-asia/ui';
import { trackAdminMutation } from '@/lib/admin-breadcrumb';

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
        </CardContent>
      </Card>

      <Card>
        <CardContent className="overflow-x-auto pt-6">
          {q.isLoading ? (
            <p className="text-sm text-muted-foreground">Đang tải…</p>
          ) : q.error ? (
            <p className="text-sm text-red-700 dark:text-red-300">{(q.error as Error).message}</p>
          ) : (
            <table className="w-full min-w-[820px] text-sm">
              <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="pb-2 pr-3">Mã</th>
                  <th className="pb-2 pr-3">Email</th>
                  <th className="pb-2 pr-3 text-right">Depth</th>
                  <th className="pb-2 pr-3">Tier</th>
                  <th className="pb-2 pr-3">Status</th>
                  <th className="pb-2 pr-3 text-right">L1</th>
                  <th className="pb-2 pr-3 text-right">L2</th>
                  <th className="pb-2 pr-3 text-right">L3</th>
                  <th className="pb-2 pr-3">Tạo</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.user_id} className="border-b border-border hover:bg-muted/30">
                    <td className="py-2 pr-3 font-mono text-gold">{r.affiliate_code}</td>
                    <td className="py-2 pr-3 text-foreground/85">{r.email ?? '—'}</td>
                    <td className="py-2 pr-3 text-right font-mono">{r.depth}</td>
                    <td className="py-2 pr-3 capitalize">{r.tier}</td>
                    <td className="py-2 pr-3">
                      {r.status === 'active' ? (
                        <span className="text-green-400">active</span>
                      ) : (
                        <span className="text-red-400">{r.status}</span>
                      )}
                    </td>
                    <td className="py-2 pr-3 text-right font-mono">{r.l1_count}</td>
                    <td className="py-2 pr-3 text-right font-mono">{r.l2_count}</td>
                    <td className="py-2 pr-3 text-right font-mono">{r.l3_count}</td>
                    <td className="py-2 pr-3 text-muted-foreground text-xs">{dt(r.created_at)}</td>
                    <td className="py-2 flex flex-wrap gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          banMut.mutate({ id: r.user_id, banned: r.status === 'active' })
                        }
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
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-6 text-center text-muted-foreground">
                      Chưa có promoter nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
      toast.error((e as Error).message);
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
