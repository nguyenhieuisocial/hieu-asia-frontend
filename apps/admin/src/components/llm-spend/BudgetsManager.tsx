'use client';

import * as React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  StatusBadge,
} from '@hieu-asia/ui';
import { upsertApiBudget, type ApiBudgetRow, type BudgetUpsert } from '@/lib/llm-spend-api';

interface Props {
  rows: ApiBudgetRow[];
  isLoading?: boolean;
}

function fmtUsd(v: number | null | undefined) {
  if (v == null) return '—';
  return `$${Number(v).toFixed(2)}`;
}

function pct(used: number, limit: number): number {
  if (!limit || limit <= 0) return 0;
  return Math.min(100, (used / limit) * 100);
}

export function BudgetsManager({ rows, isLoading }: Props) {
  const qc = useQueryClient();
  const [form, setForm] = React.useState<BudgetUpsert>({
    user_id: null,
    team_id: null,
    period: 'monthly',
    limit_usd: 0,
    soft_limit_usd: null,
  });
  const [error, setError] = React.useState<string | null>(null);

  const upsert = useMutation({
    mutationFn: (body: BudgetUpsert) => upsertApiBudget(body),
    onSuccess: () => {
      setError(null);
      setForm({ user_id: null, team_id: null, period: 'monthly', limit_usd: 0, soft_limit_usd: null });
      qc.invalidateQueries({ queryKey: ['llm-spend', 'budgets'] });
    },
    onError: (e: Error) => setError(e.message),
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.limit_usd || form.limit_usd <= 0) {
      setError('limit_usd phải > 0');
      return;
    }
    upsert.mutate({
      ...form,
      user_id: form.user_id || null,
      team_id: form.team_id || null,
      soft_limit_usd: form.soft_limit_usd || null,
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-3">
        <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Budget hiện hữu</h3>
        {isLoading && <p className="text-sm text-muted-foreground">Đang tải…</p>}
        {!isLoading && rows.length === 0 && (
          <p className="text-sm text-muted-foreground">Chưa có budget. Tạo budget đầu tiên ở cột phải.</p>
        )}
        <ul className="space-y-2">
          {rows.map((b) => {
            const p = pct(b.current_usage_usd ?? 0, b.limit_usd);
            const tone = p >= 90 ? 'bg-red-500' : p >= 60 ? 'bg-gold' : 'bg-jade';
            return (
              <li
                key={b.id ?? `${b.user_id ?? 'global'}-${b.period}`}
                // Wave 60.83 — ease-editorial transition for the budget row hover
                // (Wave 60.81.B Tier 3 canonical pattern, matches /coupons rows).
                className="rounded-md border border-gold/15 bg-card/60 px-3 py-3 text-sm transition-all duration-300 ease-editorial hover:border-gold/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-gold">
                      {b.user_id ? `user:${b.user_id.slice(0, 12)}` : b.team_id ? `team:${b.team_id}` : 'global'}
                    </span>
                    {/* Wave 60.83 — period chip → canonical StatusBadge (neutral),
                        same pill component used in /coupons /sessions /audit. */}
                    <StatusBadge status="neutral" label={b.period} />
                  </div>
                  <span className="font-mono text-foreground">
                    {fmtUsd(b.current_usage_usd)} / {fmtUsd(b.limit_usd)}
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded bg-muted/30">
                  <div className={`h-full ${tone}`} style={{ width: `${p}%` }} />
                </div>
                {b.soft_limit_usd != null && (
                  <div className="mt-1 text-[11px] text-muted-foreground">soft limit: {fmtUsd(b.soft_limit_usd)}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thêm / cập nhật budget</CardTitle>
          <CardDescription>Upsert theo (user_id, team_id, period). Để trống user/team = budget global.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="user_id">User ID</Label>
              <Input
                id="user_id"
                placeholder="(để trống = global)"
                value={form.user_id ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, user_id: e.target.value || null }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="team_id">Team ID</Label>
              <Input
                id="team_id"
                placeholder="(optional)"
                value={form.team_id ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, team_id: e.target.value || null }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="period">Chu kỳ</Label>
              <select
                id="period"
                value={form.period}
                onChange={(e) =>
                  setForm((f) => ({ ...f, period: e.target.value as BudgetUpsert['period'] }))
                }
                className="w-full rounded border border-gold/20 bg-card/60 px-3 py-2 text-sm text-foreground"
              >
                <option value="daily">daily</option>
                <option value="weekly">weekly</option>
                <option value="monthly">monthly</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="limit_usd">Limit USD</Label>
              <Input
                id="limit_usd"
                type="number"
                step="0.01"
                min="0"
                value={form.limit_usd}
                onChange={(e) => setForm((f) => ({ ...f, limit_usd: Number(e.target.value) }))}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="soft_limit_usd">Soft limit USD (optional)</Label>
              <Input
                id="soft_limit_usd"
                type="number"
                step="0.01"
                min="0"
                value={form.soft_limit_usd ?? ''}
                onChange={(e) =>
                  setForm((f) => ({ ...f, soft_limit_usd: e.target.value ? Number(e.target.value) : null }))
                }
              />
            </div>
            {error && <p className="text-xs text-red-700 dark:text-red-300">{error}</p>}
            <Button type="submit" disabled={upsert.isPending}>
              {upsert.isPending ? 'Đang lưu…' : 'Lưu budget'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
