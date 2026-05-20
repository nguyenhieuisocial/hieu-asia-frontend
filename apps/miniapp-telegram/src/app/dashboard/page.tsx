'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { TgBackButton } from '@/components/tg-back-button';
import { TgMainButton } from '@/components/tg-main-button';
import { getTelegramUser, type TelegramUser } from '@/lib/telegram-auth';

interface DashReport {
  id: string;
  date: string;
  primary_concern: string;
  mentor_messages: number;
}

const MOCK_REPORTS: DashReport[] = [
  {
    id: 'demo-task-001',
    date: '20/05/2026',
    primary_concern: 'Dòng tiền căng + middle manager chống đối',
    mentor_messages: 12,
  },
  {
    id: 'demo-task-002',
    date: '12/03/2026',
    primary_concern: 'Có nên mở chi nhánh thứ 4?',
    mentor_messages: 5,
  },
];

export default function MiniAppDashboardPage() {
  const router = useRouter();
  const [user, setUser] = React.useState<TelegramUser | null>(null);

  React.useEffect(() => {
    void getTelegramUser().then(setUser);
  }, []);

  return (
    <main className="min-h-screen px-4 pb-32 pt-3">
      <TgBackButton onBack={() => router.push('/')} fallbackLabel="Trang chính" />

      <div className="mx-auto max-w-md pt-3">
        <div className="flex items-center gap-3">
          <div
            aria-hidden
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 font-heading text-base text-gold"
          >
            {(user?.first_name ?? 'B').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs text-cream/55">Chào,</p>
            <h1 className="font-heading text-lg text-cream">{user?.first_name ?? 'bạn'}</h1>
          </div>
        </div>

        <section className="mt-6">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-gold/75">
            Báo cáo của tôi
          </p>
          <ul className="space-y-3">
            {MOCK_REPORTS.map((r) => (
              <li key={r.id}>
                <Link href={`/reading/${r.id}/report`}>
                  <Card className="transition-colors hover:border-gold/40">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{r.date}</CardTitle>
                        <span className="font-mono text-xs text-cream/55">
                          💬 {r.mentor_messages}
                        </span>
                      </div>
                      <CardDescription className="line-clamp-2">{r.primary_concern}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <Card className="mt-6 border-purple/30 bg-purple/10">
          <CardHeader>
            <CardTitle className="text-sm">Gói Mentor</CardTitle>
            <CardDescription>17 / 60 lượt mentor dùng trong tháng.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-2 overflow-hidden rounded-full bg-cream/10">
              <div className="h-full bg-gold-gradient" style={{ width: '28%' }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <TgMainButton text="Tạo báo cáo mới" onClick={() => router.push('/consent')} />
    </main>
  );
}
