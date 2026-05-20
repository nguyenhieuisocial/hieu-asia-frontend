'use client';

import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Switch,
} from '@hieu-asia/ui';
import { getFeatureFlags, updateFeatureFlags, type FeatureFlags } from '@/lib/admin-api';

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
      <div>
        <h1 className="font-heading text-3xl font-semibold text-cream">Cài đặt</h1>
        <p className="mt-1 text-sm text-cream/65">
          Feature flags (V1: in-memory backend) và biến môi trường runtime.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feature flags</CardTitle>
          <CardDescription>
            Bật/tắt tính năng không cần deploy. V1 lưu trong memory — restart sẽ reset.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {FLAGS.map((f) => {
            const value = flags?.[f.key] ?? false;
            return (
              <div
                key={f.key}
                className="flex items-center justify-between rounded-md border border-gold/15 bg-ink/40 px-4 py-3"
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
          <CardTitle>Biến môi trường (read-only)</CardTitle>
          <CardDescription>Hiển thị các biến runtime quan trọng. Đổi giá trị qua deploy config.</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2 font-mono text-xs">
            {ENV_DISPLAY.map((row) => (
              <div key={row.key} className="flex items-center justify-between border-b border-gold/10 py-2">
                <dt className="text-cream/65">{row.key}</dt>
                <dd className="text-cream">{row.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
