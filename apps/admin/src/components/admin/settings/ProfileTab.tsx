'use client';

/**
 * Wave 60.81.D — Profile tab for /settings.
 *
 * Read-only avatar + name + email + role + last login. Role + email
 * cannot be changed from the admin UI by design — those route through
 * /users + RBAC management (vault 94).
 *
 * Theme preference card preserved from old /settings (only piece worth
 * keeping outside the rebuild).
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from 'next-themes';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import { Mail, Palette, ShieldCheck, UserCircle2 } from 'lucide-react';
import type { AdminProfile } from './types';

const ICON_AVATAR = <UserCircle2 className="h-10 w-10 text-gold/60" aria-hidden />;
const ICON_MAIL = <Mail className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />;
const ICON_ROLE = <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />;
const ICON_PALETTE = <Palette className="h-4 w-4 text-gold" aria-hidden />;

interface ProfileResp {
  ok?: boolean;
  profile?: AdminProfile;
  error?: string;
}

async function fetchProfile(): Promise<ProfileResp> {
  const r = await fetch('/api/admin/me', { cache: 'no-store' });
  if (r.status === 404) {
    return { ok: false, error: 'Profile endpoint chưa wire.' };
  }
  const text = await r.text();
  try {
    return JSON.parse(text) as ProfileResp;
  } catch {
    return { ok: false, error: `Invalid JSON (status ${r.status})` };
  }
}

function fmtDate(s: string | null | undefined): string {
  if (!s) return '—';
  try {
    return new Date(s).toLocaleString('vi-VN');
  } catch {
    return s;
  }
}

export function ProfileTab() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'settings', 'profile'],
    queryFn: fetchProfile,
  });

  const profile = data?.profile;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Thông tin admin của bạn. Đổi role hoặc email phải qua /users (RBAC).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-10 w-3/4 animate-pulse rounded bg-muted/30" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted/30" />
            </div>
          ) : profile ? (
            <div className="flex items-start gap-4">
              <div className="rounded-full border border-gold/30 bg-card/60 p-2">
                {ICON_AVATAR}
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <p className="font-heading text-lg text-foreground">
                  {profile.display_name ?? '(chưa đặt tên)'}
                </p>
                <p className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                  {ICON_MAIL}
                  {profile.email}
                </p>
                <p className="flex items-center gap-1.5 text-xs">
                  {ICON_ROLE}
                  <span className="font-mono text-foreground/85">
                    role: {profile.role}
                  </span>
                </p>
                <p className="font-mono text-[11px] text-muted-foreground">
                  Last login: {fmtDate(profile.last_login_at)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {data?.error ?? 'Không tải được profile.'}
            </p>
          )}
        </CardContent>
      </Card>

      <ThemePreferenceCard />
    </div>
  );
}

/**
 * Theme picker — preserved from old /settings page. next-themes persists
 * the choice in localStorage so this stays client-only.
 */
function ThemePreferenceCard() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const handleSetDark = React.useCallback(() => setTheme('dark'), [setTheme]);
  const handleSetLight = React.useCallback(() => setTheme('light'), [setTheme]);
  const handleSetSystem = React.useCallback(
    () => setTheme('system'),
    [setTheme],
  );

  const active = mounted ? (theme ?? 'system') : 'dark';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {ICON_PALETTE}
          Giao diện
        </CardTitle>
        <CardDescription>
          Lưu trong{' '}
          <code className="font-mono text-foreground/85">localStorage</code> qua
          next-themes. Đang dùng:{' '}
          <span className="text-gold">{resolvedTheme ?? 'dark'}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="inline-flex rounded-md border border-gold/20 bg-card/60 p-0.5">
          <ThemeButton
            active={active === 'dark'}
            onClick={handleSetDark}
            label="Tối (mặc định)"
          />
          <ThemeButton
            active={active === 'light'}
            onClick={handleSetLight}
            label="Sáng"
          />
          <ThemeButton
            active={active === 'system'}
            onClick={handleSetSystem}
            label="Theo hệ thống"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function ThemeButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'rounded px-3 py-1.5 text-xs transition-colors ' +
        (active
          ? 'bg-gold/20 text-gold'
          : 'text-muted-foreground hover:bg-gold/5')
      }
    >
      {label}
    </button>
  );
}
