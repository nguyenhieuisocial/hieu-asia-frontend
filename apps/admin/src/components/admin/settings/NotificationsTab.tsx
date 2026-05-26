'use client';

/**
 * Wave 60.81.D — Notifications tab for /settings.
 *
 * Form fields:
 *   - email digest: daily / weekly / off (DropdownMenu)
 *   - Slack webhook URL
 *   - Telegram bot token
 *   - critical alerts toggle (Switch)
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
  Input,
  Label,
  Switch,
  cn,
  toast,
} from '@hieu-asia/ui';
import { Bell, Save } from 'lucide-react';
import { ErrorBlock } from '@/components/admin/error-block';
import type { NotificationPrefs } from './types';

const ICON_SAVE = <Save className="h-3.5 w-3.5" aria-hidden />;
const ICON_BELL = <Bell className="h-4 w-4 text-gold" aria-hidden />;

const DIGEST_OPTIONS: Array<{
  value: NotificationPrefs['email_digest'];
  label: string;
  hint: string;
}> = [
  { value: 'daily', label: 'Hàng ngày', hint: 'Tóm tắt 24h' },
  { value: 'weekly', label: 'Hàng tuần', hint: 'Thứ 2, 9h sáng' },
  { value: 'off', label: 'Tắt', hint: 'Không gửi digest' },
];

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
  email_digest: 'weekly',
  slack_webhook_url: '',
  telegram_bot_token: '',
  critical_alerts_enabled: true,
};

export function NotificationsTab() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'settings', 'notifications'],
    queryFn: fetchPrefs,
  });

  const [form, setForm] = React.useState<NotificationPrefs>(DEFAULT_PREFS);
  const [busy, setBusy] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);

  // Hydrate form from server response.
  React.useEffect(() => {
    if (data?.prefs) {
      setForm(data.prefs);
      setDirty(false);
    }
  }, [data?.prefs]);

  const handleDigest = React.useCallback(
    (value: NotificationPrefs['email_digest']) => {
      setForm((prev) => ({ ...prev, email_digest: value }));
      setDirty(true);
    },
    [],
  );

  const handleSlack = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, slack_webhook_url: e.target.value }));
      setDirty(true);
    },
    [],
  );

  const handleTelegram = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, telegram_bot_token: e.target.value }));
      setDirty(true);
    },
    [],
  );

  const handleCriticalToggle = React.useCallback((checked: boolean) => {
    setForm((prev) => ({ ...prev, critical_alerts_enabled: checked }));
    setDirty(true);
  }, []);

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
            Email digest
          </CardTitle>
          <CardDescription>
            Frequency tóm tắt admin gửi đến email đăng nhập.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-3">
            {DIGEST_OPTIONS.map((opt) => {
              const checked = form.email_digest === opt.value;
              return (
                <DigestRadio
                  key={opt.value}
                  value={opt.value}
                  label={opt.label}
                  hint={opt.hint}
                  checked={checked}
                  disabled={isLoading || busy}
                  onSelect={handleDigest}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Slack webhook</CardTitle>
          <CardDescription>
            Incoming webhook URL — empty = không gửi Slack.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1.5">
          <Label htmlFor="slack-url" className="text-xs uppercase tracking-wider text-muted-foreground">
            Webhook URL
          </Label>
          <Input
            id="slack-url"
            type="url"
            value={form.slack_webhook_url}
            onChange={handleSlack}
            placeholder="https://hooks.slack.com/services/..."
            disabled={isLoading || busy}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Telegram bot</CardTitle>
          <CardDescription>
            Bot token để gửi critical alert qua Telegram. Lưu encrypted.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1.5">
          <Label htmlFor="tg-token" className="text-xs uppercase tracking-wider text-muted-foreground">
            Bot token
          </Label>
          <Input
            id="tg-token"
            type="password"
            value={form.telegram_bot_token}
            onChange={handleTelegram}
            placeholder="123456:ABC-DEF…"
            disabled={isLoading || busy}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Critical alerts</CardTitle>
          <CardDescription>
            Gửi alert ngay khi worker error rate &gt; 5% hoặc payment webhook
            fail liên tiếp.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-3 rounded-md border border-gold/15 bg-card/60 px-4 py-3">
            <span className="text-sm">Bật cảnh báo critical</span>
            <Switch
              checked={form.critical_alerts_enabled}
              onCheckedChange={handleCriticalToggle}
              disabled={isLoading || busy}
              aria-label="Critical alerts toggle"
            />
          </div>
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

interface DigestRadioProps {
  value: NotificationPrefs['email_digest'];
  label: string;
  hint: string;
  checked: boolean;
  disabled: boolean;
  onSelect: (v: NotificationPrefs['email_digest']) => void;
}

function DigestRadio({
  value,
  label,
  hint,
  checked,
  disabled,
  onSelect,
}: DigestRadioProps) {
  const handleClick = React.useCallback(() => {
    if (!disabled) onSelect(value);
  }, [onSelect, value, disabled]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'flex flex-col items-start gap-1 rounded-md border px-3 py-2 text-left text-sm transition-colors',
        checked
          ? 'border-gold/50 bg-gold/[0.08] text-foreground'
          : 'border-gold/15 bg-card/40 text-foreground/85 hover:border-gold/30',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <span className="font-medium">{label}</span>
      <span className="text-[11px] text-muted-foreground">{hint}</span>
    </button>
  );
}
