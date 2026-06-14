'use client';

/**
 * Cấp / gia hạn / huỷ gói trả phí cho một END-USER theo email.
 *
 * Wraps POST /api/admin/customers/set-plan (owner-gated) → worker
 * /admin/users/set-plan. The #1 operator job pre-launch: comp influencers /
 * test users / first manual-SePay payers to a REAL cross-session plan (the
 * per-session "mở khoá thủ công" only unlocks one reading with a tier the quota
 * gate ignores). Self-contained: renders its own trigger Button + Dialog.
 */

import * as React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from '@hieu-asia/ui';

type Plan = 'free' | 'subscription_monthly' | 'lifetime';

const PLAN_LABEL: Record<Plan, string> = {
  lifetime: 'Trọn đời',
  subscription_monthly: 'Mentor tháng',
  free: 'Free (huỷ gói)',
};

interface SetPlanResult {
  ok?: boolean;
  email?: string;
  plan?: string;
  expires_at?: string | null;
  error?: string;
}

export function SetPlanDialog({
  defaultEmail = '',
  triggerLabel = 'Cấp / gia hạn gói',
  onSuccess,
}: {
  /** Prefill + lock the email (used from a customer detail page). */
  defaultEmail?: string;
  triggerLabel?: string;
  onSuccess?: () => void;
}) {
  const qc = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState(defaultEmail);
  const [plan, setPlan] = React.useState<Plan>('lifetime');
  const [days, setDays] = React.useState('30');
  const [msg, setMsg] = React.useState<{ ok: boolean; text: string } | null>(null);

  // Reset form each time the dialog opens.
  React.useEffect(() => {
    if (open) {
      setEmail(defaultEmail);
      setPlan('lifetime');
      setDays('30');
      setMsg(null);
    }
  }, [open, defaultEmail]);

  const mut = useMutation({
    mutationFn: async (): Promise<SetPlanResult> => {
      const res = await fetch('/api/admin/customers/set-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          plan,
          ...(plan === 'subscription_monthly' ? { days: Number(days) || 30 } : {}),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as SetPlanResult;
      // not_found is returned as 200 {ok:false}; treat both as failure.
      if (!res.ok || data.ok === false) {
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      return data;
    },
    onSuccess: (data) => {
      const until = data.expires_at
        ? ` (đến ${new Date(data.expires_at).toLocaleDateString('vi-VN')})`
        : '';
      setMsg({ ok: true, text: `Đã đặt gói "${PLAN_LABEL[plan]}" cho ${data.email}${until}.` });
      qc.invalidateQueries({ queryKey: ['admin', 'customers'] });
      qc.invalidateQueries({ queryKey: ['admin', 'customer'] });
      onSuccess?.();
    },
    onError: (e) => {
      const raw = (e as Error).message;
      setMsg({
        ok: false,
        text: raw === 'not_found' ? 'Không tìm thấy user với email này.' : raw,
      });
    },
  });

  const valid = email.includes('@');

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>
      <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cấp / gia hạn / huỷ gói</DialogTitle>
            <DialogDescription>
              Đặt gói trả phí cho user theo email (tặng gói cho influencer, người test, khách trả tiền
              tay). Hành động được ghi vào nhật ký. Gói áp dụng xuyên suốt mọi lần đọc.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sp-email">Email user</Label>
              <Input
                id="sp-email"
                type="email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                disabled={!!defaultEmail}
              />
            </div>

            <div className="space-y-2">
              <Label>Gói</Label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(PLAN_LABEL) as Plan[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlan(p)}
                    className={
                      plan === p
                        ? 'rounded-md border border-gold bg-gold/10 px-3 py-1.5 text-sm text-gold'
                        : 'rounded-md border border-gold/20 px-3 py-1.5 text-sm text-muted-foreground hover:border-gold/40'
                    }
                  >
                    {PLAN_LABEL[p]}
                  </button>
                ))}
              </div>
            </div>

            {plan === 'subscription_monthly' && (
              <div className="space-y-2">
                <Label htmlFor="sp-days">Số ngày hiệu lực</Label>
                <Input
                  id="sp-days"
                  type="number"
                  min="1"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="w-32"
                />
              </div>
            )}

            {msg && (
              <p
                className={
                  msg.ok
                    ? 'rounded-md border border-gold/40 bg-gold/10 px-3 py-2 text-sm text-gold'
                    : 'rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300'
                }
              >
                {msg.text}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Đóng
            </Button>
            <Button onClick={() => mut.mutate()} disabled={!valid || mut.isPending}>
              {mut.isPending ? 'Đang lưu…' : 'Xác nhận'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
