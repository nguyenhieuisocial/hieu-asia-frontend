'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@hieu-asia/ui';
import { Settings, ToggleLeft, Server, Bell, Shield, KeyRound, Cpu, Palette } from 'lucide-react';
import { useTheme } from 'next-themes';
import { PageHeader } from '@/components/admin/page-header';

const ENV_DISPLAY: { key: string; value: string }[] = [
  { key: 'NEXT_PUBLIC_API_URL', value: process.env.NEXT_PUBLIC_API_URL ?? '(unset → mock mode)' },
  { key: 'NEXT_PUBLIC_TELEGRAM_BOT', value: process.env.NEXT_PUBLIC_TELEGRAM_BOT ?? '(unset)' },
  { key: 'NEXT_PUBLIC_SUPABASE_URL', value: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '(unset)' },
  { key: 'NEXT_PUBLIC_POSTHOG_KEY', value: process.env.NEXT_PUBLIC_POSTHOG_KEY ? '(set)' : '(unset)' },
  { key: 'NODE_ENV', value: process.env.NODE_ENV ?? 'development' },
];

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Cài đặt"
        description="Feature flags + biến môi trường + đường dẫn nhanh tới các module quản trị."
        icon={<Settings className="h-5 w-5" />}
      />

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <ThemePreferenceCard />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ToggleLeft className="h-4 w-4 text-gold" />
                Feature flags
              </CardTitle>
              <CardDescription>
                Feature flags được quản lý ở trang{' '}
                <Link href="/feature-flags" className="text-gold hover:underline">
                  Feature Flags
                </Link>
                . Toggle ở đây gây drift schema — đã gỡ bỏ.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/feature-flags"
                className="flex items-center justify-between rounded-md border border-gold/15 bg-ink/40 px-4 py-3 transition-colors hover:border-gold/30"
              >
                <div>
                  <p className="font-medium text-cream">Mở Feature Flags</p>
                  <p className="text-xs text-cream/60">
                    Bật/tắt tính năng runtime, persist qua Worker.
                  </p>
                </div>
                <span className="font-mono text-xs text-gold">→</span>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-4 w-4 text-gold" />
                Biến môi trường (read-only)
              </CardTitle>
              <CardDescription>
                Hiển thị các biến runtime quan trọng. Đổi giá trị qua{' '}
                <Link href="/secrets" className="text-gold hover:underline">
                  /secrets
                </Link>{' '}
                hoặc deploy config.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-1 font-mono text-xs">
                {ENV_DISPLAY.map((row) => (
                  <div
                    key={row.key}
                    className="flex items-center justify-between border-b border-gold/10 py-2 last:border-0"
                  >
                    <dt className="text-cream/65">{row.key}</dt>
                    <dd className="text-cream">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-gold" />
                Email & Push
              </CardTitle>
              <CardDescription>
                Cấu hình kênh notification. Resend cho email, Web Push cho browser, Telegram cho
                bot.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="rounded-md border border-gold/15 bg-ink/40 px-4 py-3">
                  <p className="font-medium text-cream">Resend (email)</p>
                  <p className="text-xs text-cream/60">
                    Cần <code className="font-mono text-cream/75">RESEND_API_KEY</code> trên Worker.
                    Set ở{' '}
                    <Link href="/secrets" className="text-gold hover:underline">
                      /secrets
                    </Link>
                    .
                  </p>
                </div>
                <div className="rounded-md border border-gold/15 bg-ink/40 px-4 py-3">
                  <p className="font-medium text-cream">Web Push (VAPID)</p>
                  <p className="text-xs text-cream/60">
                    Cần <code className="font-mono text-cream/75">VAPID_PUBLIC_KEY</code> +{' '}
                    <code className="font-mono text-cream/75">VAPID_PRIVATE_KEY</code>.
                  </p>
                </div>
                <div className="rounded-md border border-gold/15 bg-ink/40 px-4 py-3">
                  <p className="font-medium text-cream">Telegram bot</p>
                  <p className="text-xs text-cream/60">
                    Bot deep-link qua{' '}
                    <code className="font-mono text-cream/75">NEXT_PUBLIC_TELEGRAM_BOT</code>.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-gold" />
                Vendor integrations
              </CardTitle>
              <CardDescription>Trạng thái connect các LLM provider + payments.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/vendors"
                className="flex items-center justify-between rounded-md border border-gold/15 bg-ink/40 px-4 py-3 transition-colors hover:border-gold/30"
              >
                <div>
                  <p className="font-medium text-cream">LLM Vendors</p>
                  <p className="text-xs text-cream/60">Anthropic, OpenAI, Google, Cloudflare</p>
                </div>
                <span className="font-mono text-xs text-gold">→</span>
              </Link>
              <Link
                href="/posthog"
                className="flex items-center justify-between rounded-md border border-gold/15 bg-ink/40 px-4 py-3 transition-colors hover:border-gold/30"
              >
                <div>
                  <p className="font-medium text-cream">PostHog Analytics</p>
                  <p className="text-xs text-cream/60">Funnel, replay, feature flag</p>
                </div>
                <span className="font-mono text-xs text-gold">→</span>
              </Link>
              <Link
                href="/connect"
                className="flex items-center justify-between rounded-md border border-gold/15 bg-ink/40 px-4 py-3 transition-colors hover:border-gold/30"
              >
                <div>
                  <p className="font-medium text-cream">OAuth Connect</p>
                  <p className="text-xs text-cream/60">Wire OAuth flow cho vendor</p>
                </div>
                <span className="font-mono text-xs text-gold">→</span>
              </Link>
              <Link
                href="/payments"
                className="flex items-center justify-between rounded-md border border-gold/15 bg-ink/40 px-4 py-3 transition-colors hover:border-gold/30"
              >
                <div>
                  <p className="font-medium text-cream">Payments</p>
                  <p className="text-xs text-cream/60">SePay webhook + coupon</p>
                </div>
                <span className="font-mono text-xs text-gold">→</span>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gold" />
                Bảo mật
              </CardTitle>
              <CardDescription>
                Rotate secrets, kiểm tra audit log, quản lý admin user.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/secrets"
                className="flex items-center justify-between rounded-md border border-gold/15 bg-ink/40 px-4 py-3 transition-colors hover:border-gold/30"
              >
                <div className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-gold/70" />
                  <div>
                    <p className="font-medium text-cream">API Keys</p>
                    <p className="text-xs text-cream/60">Worker + Vercel secrets</p>
                  </div>
                </div>
                <span className="font-mono text-xs text-gold">→</span>
              </Link>
              <Link
                href="/users"
                className="flex items-center justify-between rounded-md border border-gold/15 bg-ink/40 px-4 py-3 transition-colors hover:border-gold/30"
              >
                <div>
                  <p className="font-medium text-cream">Admin users</p>
                  <p className="text-xs text-cream/60">RBAC: owner / admin / viewer</p>
                </div>
                <span className="font-mono text-xs text-gold">→</span>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * Theme picker tied to next-themes + localStorage (next-themes persists by
 * default). Three options: dark (default), light, system.
 */
function ThemePreferenceCard() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const options: { value: 'dark' | 'light' | 'system'; label: string }[] = [
    { value: 'dark', label: 'Tối (mặc định)' },
    { value: 'light', label: 'Sáng' },
    { value: 'system', label: 'Theo hệ thống' },
  ];

  const active = mounted ? (theme ?? 'system') : 'dark';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-gold" />
          Giao diện
        </CardTitle>
        <CardDescription>
          Lưu trong <code className="font-mono text-cream/75">localStorage</code> qua next-themes.
          Mặc định khi chưa chọn:{' '}
          <span className="text-cream/85">tối</span>. Đang dùng:{' '}
          <span className="text-gold">{resolvedTheme ?? 'dark'}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="inline-flex rounded-md border border-gold/20 bg-ink/40 p-0.5">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setTheme(o.value)}
              className={
                'rounded px-3 py-1.5 text-xs transition-colors ' +
                (active === o.value
                  ? 'bg-gold/20 text-gold'
                  : 'text-cream/65 hover:bg-gold/5')
              }
            >
              {o.label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
