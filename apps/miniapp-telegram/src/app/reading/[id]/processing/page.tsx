'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { Check } from 'lucide-react';
import { haptic } from '@/lib/telegram-haptic';

const STEPS = [
  { key: 'vision', label: 'Vision AI đọc đường chỉ tay' },
  { key: 'logic', label: 'Đối chiếu Tử Vi + Lá số' },
  { key: 'psych', label: 'Phân tích khảo sát tâm lý' },
  { key: 'align', label: 'Đồng bộ 3 góc nhìn' },
  { key: 'report', label: 'Soạn báo cáo chiến lược' },
];

/** Approximate timing — production uses Socket.IO events from backend. */
const STEP_MS = 1400;

export default function MiniAppProcessingPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const readingId = params.id;
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (activeIdx >= STEPS.length) {
      setDone(true);
      void haptic('success');
      const t = setTimeout(() => router.replace(`/reading/${readingId}/report`), 600);
      return () => clearTimeout(t);
    }
    void haptic('light');
    const t = setTimeout(() => setActiveIdx((i) => i + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [activeIdx, readingId, router]);

  return (
    <main className="min-h-screen px-4 py-6">
      <div className="mx-auto max-w-md">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gold/80">Đang xử lý</p>
        <h1 className="mt-1 font-heading text-xl font-semibold text-cream">
          Hệ thống đang luận giải báo cáo
        </h1>
        <p className="mt-2 text-sm text-cream/70">
          Thường mất 60–120 giây. Bạn có thể đóng và quay lại sau — báo cáo vẫn được tạo.
        </p>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Tiến trình</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {STEPS.map((step, i) => {
                const state = i < activeIdx ? 'done' : i === activeIdx ? 'active' : 'pending';
                return (
                  <li key={step.key} className="flex items-center gap-3 text-sm">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                        state === 'done'
                          ? 'border-jade/40 bg-jade/15 text-jade-50'
                          : state === 'active'
                          ? 'border-gold/40 bg-gold/15 text-gold'
                          : 'border-cream/15 bg-ink/30 text-cream/40'
                      }`}
                    >
                      {state === 'done' ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </span>
                    <span className={state === 'pending' ? 'text-cream/50' : 'text-cream/90'}>{step.label}</span>
                    {state === 'active' && (
                      <span className="ml-auto inline-block h-2 w-2 animate-pulse rounded-full bg-gold" />
                    )}
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>

        {done && (
          <p className="mt-5 text-center font-mono text-xs text-jade">✓ Xong — đang mở báo cáo…</p>
        )}
      </div>
    </main>
  );
}
