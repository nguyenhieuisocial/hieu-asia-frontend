'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { Sparkles, ScanLine, MessageSquare, Lock } from 'lucide-react';
import { TgMainButton } from '@/components/tg-main-button';
import { getTelegramUser, type TelegramUser } from '@/lib/telegram-auth';

const TRUST = [
  { Icon: Sparkles, text: 'Báo cáo cá nhân hoá 9 góc nhìn' },
  { Icon: ScanLine, text: 'Phân tích bàn tay + ngày sinh' },
  { Icon: MessageSquare, text: 'Mentor AI trò chuyện 24/7' },
  { Icon: Lock, text: 'Dữ liệu được mã hoá' },
];

export default function MiniAppWelcomePage() {
  const router = useRouter();
  const [user, setUser] = React.useState<TelegramUser | null>(null);

  React.useEffect(() => {
    void getTelegramUser().then(setUser);
  }, []);

  const greetingName = user?.first_name ?? 'bạn';

  return (
    <main className="min-h-screen px-4 pb-32 pt-6">
      <div className="mx-auto max-w-md">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gold/80">
          hieu.asia · mini app
        </p>
        <h1 className="mt-1 font-heading text-2xl font-semibold text-cream">
          Chào {greetingName} 👋
        </h1>
        <p className="mt-2 text-sm text-cream/70">
          Cẩm Nang Cuộc Đời AI — phân tích tính cách, vận hạn, chiến lược hành động dựa trên dữ liệu
          bạn cung cấp.
        </p>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Báo cáo đầu tiên của bạn</CardTitle>
            <CardDescription>
              Mất khoảng 5 phút: đồng ý xử lý dữ liệu → nhập ngày sinh → chụp bàn tay → khảo sát ngắn.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5 text-sm">
              {TRUST.map(({ Icon, text }) => (
                <li key={text} className="flex items-start gap-2.5 text-cream/85">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Link
          href="/dashboard"
          className="mt-4 block rounded-md border border-gold/20 px-4 py-3 text-center text-sm text-cream/80 hover:border-gold/40"
        >
          Đã có báo cáo trước đây? Mở bảng điều khiển →
        </Link>
      </div>

      <TgMainButton text="Bắt đầu" onClick={() => router.push('/consent')} />
    </main>
  );
}
