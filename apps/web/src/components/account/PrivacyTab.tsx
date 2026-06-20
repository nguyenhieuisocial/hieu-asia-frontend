'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Switch,
  toast,
} from '@hieu-asia/ui';
import { DataExportSection } from '@/components/account/DataExportSection';
import { DeleteAccountSection } from '@/components/account/DeleteAccountSection';
import { getSupabaseAuth } from '@/lib/auth-client';

const ONBOARDING_KEY = 'hieu:onboarding:v2';

interface ConsentState {
  mbti: boolean;
  palm: boolean;
  mentor: boolean;
  training: boolean;
}

const DEFAULT_CONSENT: ConsentState = {
  mbti: false,
  palm: false,
  mentor: true,
  training: false,
};

function loadConsent(): ConsentState {
  if (typeof window === 'undefined') return DEFAULT_CONSENT;
  try {
    const raw = window.localStorage.getItem(ONBOARDING_KEY);
    if (!raw) return DEFAULT_CONSENT;
    const parsed = JSON.parse(raw) as { consent?: Partial<ConsentState> };
    return { ...DEFAULT_CONSENT, ...(parsed.consent ?? {}) };
  } catch {
    return DEFAULT_CONSENT;
  }
}

function saveConsent(c: ConsentState): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(ONBOARDING_KEY);
    const parsed = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    parsed.consent = c;
    window.localStorage.setItem(ONBOARDING_KEY, JSON.stringify(parsed));
  } catch {
    /* ignore */
  }
}

export interface PrivacyTabProps {
  userId: string | null;
}

const CONSENT_FIELDS: { key: keyof ConsentState; label: string; hint: string }[] = [
  {
    key: 'mbti',
    label: 'MBTI',
    hint: 'Cho phép phân tích MBTI và lưu kết quả vào hồ sơ.',
  },
  {
    key: 'palm',
    label: 'Đọc chỉ tay (Palm)',
    hint: 'Cho phép upload ảnh và phân tích chỉ tay.',
  },
  {
    key: 'mentor',
    label: 'Mentor memory',
    hint: 'Cho phép mentor ghi nhớ mục tiêu, quyết định để cá nhân hóa.',
  },
  {
    key: 'training',
    label: 'Cải thiện sản phẩm (training opt-in)',
    hint: 'Cho phép dùng dữ liệu ẩn danh để cải thiện model.',
  },
];

export function PrivacyTab({ userId }: PrivacyTabProps) {
  const [consent, setConsent] = React.useState<ConsentState>(DEFAULT_CONSENT);
  const [pending, setPending] = React.useState<keyof ConsentState | null>(null);

  React.useEffect(() => {
    setConsent(loadConsent());
  }, []);

  async function toggle(key: keyof ConsentState, value: boolean) {
    const next = { ...consent, [key]: value };
    setConsent(next);
    saveConsent(next);
    setPending(key);

    if (userId) {
      try {
        const sb = getSupabaseAuth();
        let token: string | undefined;
        if (sb) {
          const { data } = await sb.auth.getSession();
          token = data.session?.access_token;
        }
        const headers: Record<string, string> = { 'content-type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch('/api/user/preferences', {
          method: 'POST',
          headers,
          // The proxy contract (and the worker /user/preferences handler) takes
          // a `prefs` bag, not `consent` — sending `consent` 400s at the proxy.
          // The consent flags share the merged prefs store; their keys don't
          // collide with the general settings keys.
          body: JSON.stringify({ user_id: userId, prefs: next }),
        });
        if (res.ok) {
          toast.success('Đã lưu');
        } else {
          // A 404/5xx is a RESOLVED fetch (not a throw) — must check res.ok or
          // we'd show a false "Đã lưu" on a consent (Nghị định 13) toggle.
          toast.error('Không đồng bộ được — đã lưu cục bộ');
        }
      } catch {
        toast.error('Không đồng bộ được — đã lưu cục bộ');
      } finally {
        setPending(null);
      }
    } else {
      setPending(null);
    }
  }

  return (
    <div
      role="tabpanel"
      id="panel-privacy"
      aria-labelledby="tab-privacy"
      className="space-y-6"
    >
      <div>
        <h2 className="font-heading text-2xl text-foreground sm:text-3xl">Quyền riêng tư</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Quyền theo Nghị định 13/2023/NĐ-CP — bạn kiểm soát mọi dữ liệu.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Đồng ý sử dụng dữ liệu</CardTitle>
          <CardDescription>
            Bật/tắt từng tính năng. Tắt bất cứ lúc nào, không cần giải thích.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {CONSENT_FIELDS.map((f) => (
            <div
              key={f.key}
              className="flex items-start justify-between gap-4 rounded-lg border border-border bg-card/40 p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{f.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{f.hint}</p>
              </div>
              <Switch
                checked={consent[f.key]}
                onCheckedChange={(v: boolean) => toggle(f.key, v)}
                disabled={pending === f.key}
                aria-label={f.label}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <DataExportSection userId={userId} />
      <DeleteAccountSection userId={userId} />
    </div>
  );
}
