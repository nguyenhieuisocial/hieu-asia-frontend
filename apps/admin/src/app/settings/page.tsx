'use client';

import * as React from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@hieu-asia/ui';
import { Settings, ToggleLeft, Server, Bell, Shield, KeyRound, Cpu } from 'lucide-react';
import { getFeatureFlags, updateFeatureFlags, type FeatureFlags } from '@/lib/admin-api';
import { MockBanner } from '@/components/mock-banner';
import { PageHeader } from '@/components/admin/page-header';

interface FlagDef {
  key: keyof FeatureFlags;
  label: string;
  desc: string;
}

const FLAGS: FlagDef[] = [
  { key: 'mentor_chat_enabled', label: 'Mentor chat', desc: 'Cho phép user gửi tin nhắn cho Mentor AI.' },
  { key: 'premium_signup_open', label: 'Premium signup', desc: 'Mở đăng ký gói trả phí.' },
  { key: 'telegram_login_enabled', label: 'Telegram login', desc: 'Cho phép đăng nhập qua Telegram WebApp.' },
  { key: 'rag_ingestion_lock', label: 'Khoá ingest RAG', desc: 'Khoá ingest tài liệu mới (an toàn pre-release).' },
];

const ENV_DISPLAY: { key: string; value: string }[] = [
  { key: 'NEXT_PUBLIC_API_URL', value: process.env.NEXT_PUBLIC_API_URL ?? '(unset → mock mode)' },
  { key: 'NEXT_PUBLIC_TELEGRAM_BOT', value: process.env.NEXT_PUBLIC_TELEGRAM_BOT ?? '(unset)' },
  { key: 'NEXT_PUBLIC_SUPABASE_URL', value: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '(unset)' },
  { key: 'NEXT_PUBLIC_POSTHOG_KEY', value: process.env.NEXT_PUBLIC_POSTHOG_KEY ? '(set)' : '(unset)' },
  { key: 'NODE_ENV', value: process.env.NODE_ENV ?? 'development' },
];

export default function AdminSettingsPage() {
  const qc = useQueryClient();
  const { data: flags } = useQuery({ queryKey: ['admin', 'flags'], queryFn: getFeatureFlags });
  const mutation = useMutation({
    mutationFn: updateFeatureFlags,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'flags'] }),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cài đặt"
        description="Feature flags + biến môi trường + đường dẫn nhanh tới các module quản trị."
        icon={<Settings className="h-5 w-5" />}
      />

      <MockBanner source={flags?._source} />

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ToggleLeft className="h-4 w-4 text-gold" />
                Feature flags
              </CardTitle>
              <CardDescription>
                Bật/tắt tính năng không cần deploy. V1 lưu in-memory — restart sẽ reset. V2 sẽ
                persist qua KV.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {FLAGS.map((f) => {
                const value = flags?.[f.key] ?? false;
                return (
                  <div
                    key={f.key}
                    className="flex items-center justify-between rounded-md border border-gold/15 bg-ink/40 px-4 py-3 transition-colors hover:border-gold/25"
                  >
                    <div className="pr-4">
                      <p className="font-medium text-cream">{f.label}</p>
                      <p className="text-xs text-cream/60">{f.desc}</p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => mutation.mutate({ [f.key]: checked })}
                      disabled={mutation.isPending}
                    />
                  </div>
                );
              })}
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
