/**
 * /pricing — 3-tier landing page.
 *
 * Reads optional `?session=<reading_id>` query — passes it through to the
 * unlock flow so payment is bound to a specific reading. If absent, the
 * unlock page (server) will block submission until a session is supplied.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { PriceTier } from '@/components/payment/PriceTier';

type Tier = 'premium' | 'subscription_monthly' | 'subscription_yearly';

interface TierConfig {
  id: Tier;
  name: string;
  price: string;
  period?: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
}

const TIERS: TierConfig[] = [
  {
    id: 'premium',
    name: 'Premium (một lần)',
    price: '99.000₫',
    period: 'một lần',
    features: [
      'Mở khóa đầy đủ 1 báo cáo chi tiết',
      '3 câu hỏi với Mentor cá nhân',
      'Tải PDF báo cáo',
      'Không tự động gia hạn',
    ],
    cta: 'Chọn Premium',
  },
  {
    id: 'subscription_monthly',
    name: 'Gói tháng',
    price: '199.000₫',
    period: '/ tháng',
    features: [
      'Không giới hạn báo cáo',
      'Trò chuyện không giới hạn với Mentor',
      'Tải PDF + chia sẻ',
      'Hủy bất cứ lúc nào',
    ],
    cta: 'Chọn gói tháng',
    highlighted: true,
    badge: 'Phổ biến',
  },
  {
    id: 'subscription_yearly',
    name: 'Gói năm',
    price: '1.990.000₫',
    period: '/ năm',
    features: [
      'Tất cả tính năng gói tháng',
      'Tiết kiệm 17% so với gói tháng',
      'Hỗ trợ ưu tiên',
      'Truy cập sớm tính năng mới',
    ],
    cta: 'Chọn gói năm',
    badge: 'Tiết kiệm 17%',
  },
];

export default function PricingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session') ?? '';

  const handleSelect = React.useCallback(
    (tier: Tier) => {
      if (!sessionId) {
        // Fallback: send the user to dashboard to pick a reading first.
        router.push('/dashboard?need_reading=1');
        return;
      }
      router.push(`/unlock/${encodeURIComponent(sessionId)}?tier=${tier}`);
    },
    [router, sessionId],
  );

  return (
    <main className="container mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-10 flex flex-col items-center text-center">
        <Link
          href="/dashboard"
          className="self-start text-sm text-cream/60 hover:text-gold"
        >
          ← Quay lại
        </Link>
        <p className="mt-4 font-mono text-xs uppercase tracking-widest text-gold/70">
          Hiểu mình. Quyết định mình.
        </p>
        <h1 className="mt-2 font-heading text-3xl text-cream sm:text-4xl">
          Mở khóa toàn bộ báo cáo
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-cream/70 sm:text-base">
          Mỗi quyết định quan trọng cần một góc nhìn sâu hơn — tri thức cổ học
          Việt Nam, được AI giải mã rõ ràng, để bạn tự chọn con đường.
        </p>
        {!sessionId && (
          <p className="mt-4 rounded-md border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-200">
            Chưa có lá số nào được chọn — bạn cần tạo lá số trước khi thanh toán.
          </p>
        )}
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => (
          <PriceTier
            key={t.id}
            name={t.name}
            price={t.price}
            period={t.period}
            features={t.features}
            cta={t.cta}
            highlighted={t.highlighted}
            badge={t.badge}
            onClick={() => handleSelect(t.id)}
          />
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-cream/50">
        Thanh toán an toàn qua chuyển khoản ngân hàng nội địa Việt Nam. Hệ
        thống tự động xác nhận sau 5-10 giây kể từ khi giao dịch thành công.
      </p>
    </main>
  );
}
