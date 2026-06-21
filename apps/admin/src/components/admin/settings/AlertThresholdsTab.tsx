'use client';

/**
 * Operator-editable alert thresholds tab for /settings.
 *
 * Six numeric thresholds that used to be hardcoded in the worker. A solo
 * operator can now tune alerting without a redeploy. Mirrors the backend
 * /admin/settings/alert-thresholds contract 1:1.
 *
 * GET   /api/admin/settings/alert-thresholds  (viewer+) → { thresholds }
 * PATCH /api/admin/settings/alert-thresholds  (owner+)  → merged thresholds
 *
 * Owner-only on Save: loosening a threshold silences alerts. Non-owners see
 * the values read-only with a note, mirroring how the retention tab routes
 * destructive edits through an owner gate. The PATCH proxy also enforces
 * owner+ server-side, so this is defence-in-depth, not the only gate.
 *
 * If the backend isn't deployed yet (404), the tab degrades to the documented
 * defaults so the operator can still see + edit the shape.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  toast,
} from '@hieu-asia/ui';
import { Gauge, Save, ShieldAlert } from 'lucide-react';
import { ErrorBlock } from '@/components/admin/error-block';
import type { AdminProfile, AlertThresholds } from './types';

const ICON_GAUGE = <Gauge className="h-4 w-4 text-gold" aria-hidden />;
const ICON_SAVE = <Save className="h-3.5 w-3.5" aria-hidden />;
const ICON_SHIELD = (
  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden />
);

/** Documented backend defaults — used when the endpoint isn't wired yet. */
const DEFAULTS: AlertThresholds = {
  errors_per_hour: 2,
  llm_cost_usd_per_day: 50,
  signup_drop_ratio: 0.5,
  ai_balance_usd: 3,
  queue_warn_seconds: 3600,
  queue_critical_seconds: 14400,
};

interface ThresholdsResp {
  ok?: boolean;
  thresholds?: AlertThresholds;
  error?: string;
  note?: string;
}

interface ProfileResp {
  ok?: boolean;
  profile?: AdminProfile;
  error?: string;
}

async function fetchThresholds(): Promise<ThresholdsResp> {
  const r = await fetch('/api/admin/settings/alert-thresholds', {
    cache: 'no-store',
  });
  if (r.status === 404) {
    return {
      ok: false,
      note: 'Endpoint ngưỡng cảnh báo chưa wire ở worker — đang hiển thị giá trị mặc định, UI vẫn editable.',
    };
  }
  const text = await r.text();
  try {
    return JSON.parse(text) as ThresholdsResp;
  } catch {
    return { ok: false, error: `Invalid JSON (status ${r.status})` };
  }
}

async function fetchProfile(): Promise<ProfileResp> {
  const r = await fetch('/api/admin/me', { cache: 'no-store' });
  if (r.status === 404) return { ok: false };
  const text = await r.text();
  try {
    return JSON.parse(text) as ProfileResp;
  } catch {
    return { ok: false };
  }
}

/** Form state mirrors AlertThresholds but as strings so inputs stay controlled. */
type FormState = Record<keyof AlertThresholds, string>;

const FIELDS: Array<{
  key: keyof AlertThresholds;
  title: string;
  helper: string;
  step: string;
  unit: string;
}> = [
  {
    key: 'errors_per_hour',
    title: 'Số lỗi/giờ trước khi cảnh báo',
    helper: 'Vượt ngưỡng này trong 1 giờ thì bắn cảnh báo lỗi.',
    step: '1',
    unit: 'lỗi/giờ',
  },
  {
    key: 'llm_cost_usd_per_day',
    title: 'Chi phí AI tối đa mỗi ngày (USD)',
    helper: 'Tổng chi phí gọi AI trong ngày vượt mức này thì cảnh báo.',
    step: '1',
    unit: 'USD/ngày',
  },
  {
    key: 'signup_drop_ratio',
    title: 'Tỷ lệ tụt đăng ký (0–1)',
    helper: 'Số đăng ký giảm hơn tỷ lệ này so với baseline thì cảnh báo. Ví dụ 0.5 = giảm 50%.',
    step: '0.05',
    unit: 'tỷ lệ',
  },
  {
    key: 'ai_balance_usd',
    title: 'Ngưỡng số dư AI thấp (USD)',
    helper: 'Số dư cổng AI tụt dưới mức này thì cảnh báo để nạp thêm.',
    step: '1',
    unit: 'USD',
  },
  {
    key: 'queue_warn_seconds',
    title: 'Tuổi hàng đợi báo vàng (giây)',
    helper: 'Việc trong hàng đợi chờ lâu hơn mức này thì cảnh báo vàng.',
    step: '60',
    unit: 'giây',
  },
  {
    key: 'queue_critical_seconds',
    title: 'Tuổi hàng đợi báo đỏ (giây)',
    helper: 'Việc chờ lâu hơn mức này thì cảnh báo đỏ. Phải ≥ ngưỡng báo vàng.',
    step: '60',
    unit: 'giây',
  },
];

function toForm(t: AlertThresholds): FormState {
  return {
    errors_per_hour: String(t.errors_per_hour),
    llm_cost_usd_per_day: String(t.llm_cost_usd_per_day),
    signup_drop_ratio: String(t.signup_drop_ratio),
    ai_balance_usd: String(t.ai_balance_usd),
    queue_warn_seconds: String(t.queue_warn_seconds),
    queue_critical_seconds: String(t.queue_critical_seconds),
  };
}

/**
 * Defensive parse + validate. Returns the typed payload on success, or a
 * Vietnamese error string on the first failing rule.
 */
function parseAndValidate(
  form: FormState,
): { ok: true; value: AlertThresholds } | { ok: false; error: string } {
  const nums = {} as AlertThresholds;
  for (const f of FIELDS) {
    const raw = form[f.key].trim();
    const n = Number(raw);
    if (raw === '' || !Number.isFinite(n)) {
      return { ok: false, error: `"${f.title}" phải là số hợp lệ.` };
    }
    nums[f.key] = n;
  }

  // Positive numbers (ratios can be 0..1, others must be > 0).
  if (nums.errors_per_hour <= 0)
    return { ok: false, error: 'Số lỗi/giờ phải lớn hơn 0.' };
  if (nums.llm_cost_usd_per_day <= 0)
    return { ok: false, error: 'Chi phí AI tối đa mỗi ngày phải lớn hơn 0.' };
  if (nums.ai_balance_usd <= 0)
    return { ok: false, error: 'Ngưỡng số dư AI phải lớn hơn 0.' };
  if (nums.queue_warn_seconds <= 0)
    return { ok: false, error: 'Tuổi hàng đợi báo vàng phải lớn hơn 0.' };
  if (nums.queue_critical_seconds <= 0)
    return { ok: false, error: 'Tuổi hàng đợi báo đỏ phải lớn hơn 0.' };

  // signup_drop_ratio is a ratio in [0, 1].
  if (nums.signup_drop_ratio < 0 || nums.signup_drop_ratio > 1) {
    return { ok: false, error: 'Tỷ lệ tụt đăng ký phải trong khoảng 0–1.' };
  }

  // Critical queue age must be at least the warn age.
  if (nums.queue_critical_seconds < nums.queue_warn_seconds) {
    return {
      ok: false,
      error: 'Tuổi hàng đợi báo đỏ phải ≥ tuổi báo vàng.',
    };
  }

  return { ok: true, value: nums };
}

export function AlertThresholdsTab() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'settings', 'alert-thresholds'],
    queryFn: fetchThresholds,
    staleTime: 60_000,
  });

  const { data: profileData } = useQuery({
    queryKey: ['admin', 'settings', 'profile'],
    queryFn: fetchProfile,
    staleTime: 60_000,
  });

  const isOwner = profileData?.profile?.role === 'owner';

  const [form, setForm] = React.useState<FormState>(() => toForm(DEFAULTS));
  const [dirty, setDirty] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  // Hydrate from server response (falls back to defaults when not wired).
  React.useEffect(() => {
    if (data?.thresholds) {
      setForm(toForm(data.thresholds));
      setDirty(false);
    }
  }, [data?.thresholds]);

  const handleChange = React.useCallback(
    (key: keyof AlertThresholds, value: string) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setDirty(true);
    },
    [],
  );

  const handleSave = React.useCallback(async () => {
    const parsed = parseAndValidate(form);
    if (!parsed.ok) {
      toast.error('Giá trị không hợp lệ', { description: parsed.error });
      return;
    }
    setBusy(true);
    try {
      const r = await fetch('/api/admin/settings/alert-thresholds', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.value),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d?.ok !== false) {
        toast('Đã lưu ngưỡng cảnh báo', {
          description: 'audit_log đã ghi nhận thay đổi.',
        });
        setDirty(false);
        refetch();
      } else {
        toast.error('Không lưu được', {
          description: d?.error ?? `HTTP ${r.status}`,
        });
      }
    } catch (err) {
      toast.error('Lỗi khi lưu', { description: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }, [form, refetch]);

  const showError = !!error;
  const errorMsg = (error as Error | undefined)?.message;
  const readOnly = !isOwner;

  return (
    <div className="space-y-4">
      {showError && (
        <ErrorBlock
          compact
          message={errorMsg ?? 'Không tải được ngưỡng cảnh báo.'}
          onRetry={() => refetch()}
        />
      )}
      {data?.note && !showError && (
        <div className="rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-muted-foreground">
          {data.note}
        </div>
      )}
      {data?.error && !showError && !data?.note && (
        <div className="rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-muted-foreground">
          {data.error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {ICON_GAUGE}
            Ngưỡng cảnh báo vận hành
          </CardTitle>
          <CardDescription>
            Các mức kích hoạt cảnh báo cho worker (lỗi/giờ, chi phí AI, tụt đăng
            ký, số dư AI, tuổi hàng đợi). Chỉnh ở đây thay vì sửa code rồi
            deploy lại.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {readOnly && (
            <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs">
              {ICON_SHIELD}
              <p className="text-foreground/85">
                Bạn đang xem ở chế độ chỉ-đọc. Chỉ tài khoản{' '}
                <code className="font-mono">owner</code> mới đổi được ngưỡng cảnh
                báo.
              </p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label htmlFor={`threshold-${f.key}`}>{f.title}</Label>
                <div className="relative">
                  <Input
                    id={`threshold-${f.key}`}
                    type="number"
                    inputMode="decimal"
                    step={f.step}
                    value={form[f.key]}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                    disabled={isLoading || busy || readOnly}
                    aria-describedby={`threshold-${f.key}-help`}
                    className="pr-16"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-[11px] text-muted-foreground">
                    {f.unit}
                  </span>
                </div>
                <p
                  id={`threshold-${f.key}-help`}
                  className="text-[11px] text-muted-foreground"
                >
                  {f.helper}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={!dirty || busy || isLoading || readOnly}
        >
          {ICON_SAVE}
          <span className="ml-1.5">{busy ? 'Đang lưu…' : 'Lưu thay đổi'}</span>
        </Button>
      </div>
    </div>
  );
}
