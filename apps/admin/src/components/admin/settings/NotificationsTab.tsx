'use client';

/**
 * Wave 60.81.D — Notifications tab for /settings.
 *
 * Three toggles, mirroring the backend KV schema 1:1 (wave-60-82.ts):
 *   - email_alerts          (boolean)
 *   - sentry_high_priority  (boolean)
 *   - weekly_digest         (boolean)
 *
 * #20 fix: the FE previously offered a digest enum + Slack webhook + Telegram
 * token + critical-alerts toggle, none of which the backend stores — Save
 * "succeeded" but the values were silently dropped. The tab now reads+writes
 * exactly the three fields the backend persists, so Save round-trips.
 *
 * PATCH /api/admin/settings/notifications on Save. audit_log row written.
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
  Switch,
  toast,
} from '@hieu-asia/ui';
import { Bell, Save } from 'lucide-react';
import { ErrorBlock } from '@/components/admin/error-block';
import type { NotificationPrefs } from './types';

const ICON_SAVE = <Save className="h-3.5 w-3.5" aria-hidden />;
const ICON_BELL = <Bell className="h-4 w-4 text-gold" aria-hidden />;

interface PrefsResp {
  ok?: boolean;
  prefs?: NotificationPrefs;
  error?: string;
}

async function fetchPrefs(): Promise<PrefsResp> {
  const r = await fetch('/api/admin/settings/notifications', {
    cache: 'no-store',
  });
  if (r.status === 404) {
    return {
      ok: false,
      error: 'Notification prefs endpoint chưa wire — UI vẫn editable.',
    };
  }
  const text = await r.text();
  try {
    return JSON.parse(text) as PrefsResp;
  } catch {
    return { ok: false, error: `Invalid JSON (status ${r.status})` };
  }
}

const DEFAULT_PREFS: NotificationPrefs = {
  email_alerts: true,
  sentry_high_priority: true,
  weekly_digest: false,
};

const TOGGLES: Array<{
  key: keyof NotificationPrefs;
  title: string;
  description: string;
  label: string;
}> = [
  {
    key: 'email_alerts',
    title: 'Email alerts',
    description: 'Gửi email khi có sự cố vận hành cần admin chú ý.',
    label: 'Bật email alert',
  },
  {
    key: 'sentry_high_priority',
    title: 'Sentry high-priority',
    description: 'Nhận thông báo khi Sentry bắn issue mức high-priority.',
    label: 'Bật cảnh báo Sentry high-priority',
  },
  {
    key: 'weekly_digest',
    title: 'Weekly digest',
    description: 'Email tóm tắt vận hành hàng tuần (Thứ 2, 9h sáng).',
    label: 'Bật digest hàng tuần',
  },
];

export function NotificationsTab() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'settings', 'notifications'],
    queryFn: fetchPrefs,
    staleTime: 60_000,
  });

  const [form, setForm] = React.useState<NotificationPrefs>(DEFAULT_PREFS);
  const [busy, setBusy] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);

  // Hydrate form from server response.
  React.useEffect(() => {
    if (data?.prefs) {
      setForm({
        email_alerts: data.prefs.email_alerts,
        sentry_high_priority: data.prefs.sentry_high_priority,
        weekly_digest: data.prefs.weekly_digest,
      });
      setDirty(false);
    }
  }, [data?.prefs]);

  const handleToggle = React.useCallback(
    (key: keyof NotificationPrefs, checked: boolean) => {
      setForm((prev) => ({ ...prev, [key]: checked }));
      setDirty(true);
    },
    [],
  );

  const handleSave = React.useCallback(async () => {
    setBusy(true);
    try {
      const r = await fetch('/api/admin/settings/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok && data?.ok !== false) {
        toast('Đã lưu thiết lập notification', {
          description: 'audit_log đã ghi nhận thay đổi.',
        });
        setDirty(false);
        refetch();
      } else {
        toast('Không lưu được', {
          description: data?.error ?? `HTTP ${r.status}`,
        });
      }
    } catch (err) {
      toast('Lỗi khi lưu', { description: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }, [form, refetch]);

  const showError = !!error;
  const errorMsg = (error as Error | undefined)?.message;

  return (
    <div className="space-y-4">
      {showError && (
        <ErrorBlock
          compact
          message={errorMsg ?? 'Không tải được prefs.'}
          onRetry={() => refetch()}
        />
      )}
      {data?.error && !showError && (
        <div className="rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-muted-foreground">
          {data.error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {ICON_BELL}
            Thông báo admin
          </CardTitle>
          <CardDescription>
            Các kênh thông báo cho tài khoản admin đăng nhập.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {TOGGLES.map((t) => (
            <div
              key={t.key}
              className="flex items-start justify-between gap-3 rounded-md border border-gold/15 bg-card/60 px-4 py-3"
            >
              <div className="min-w-0 space-y-0.5">
                <p className="text-sm font-medium text-foreground">{t.title}</p>
                <p className="text-xs text-muted-foreground">{t.description}</p>
              </div>
              <Switch
                checked={form[t.key]}
                onCheckedChange={(checked) => handleToggle(t.key, checked)}
                disabled={isLoading || busy}
                aria-label={t.label}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={!dirty || busy || isLoading}>
          {ICON_SAVE}
          <span className="ml-1.5">{busy ? 'Đang lưu…' : 'Lưu thay đổi'}</span>
        </Button>
      </div>
    </div>
  );
}
