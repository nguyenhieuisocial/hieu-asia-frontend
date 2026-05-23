'use client';

import * as React from 'react';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@hieu-asia/ui';

type Tier = {
  name: string;
  price: string;
  cadence: string;
  desc: string;
  bullets: string[];
  highlight?: boolean;
  badge?: string;
};

const TIERS: Tier[] = [
  {
    name: 'Premium',
    price: '99k',
    cadence: 'một lần',
    desc: 'Báo cáo đầy đủ + 3 câu hỏi Mentor',
    bullets: ['Tử Vi · Bát Tự · MBTI', 'Báo cáo PDF tải về', '3 câu hỏi với Mentor AI'],
  },
  {
    name: 'Tháng',
    price: '199k',
    cadence: '/ tháng',
    desc: 'Đồng hành cùng Mentor mỗi ngày',
    bullets: ['Mentor AI không giới hạn', 'Cập nhật vận hạn lưu niên', 'Lưu lịch sử insight'],
    highlight: true,
    badge: 'Phổ biến nhất',
  },
  {
    name: 'Năm',
    price: '1.99M',
    cadence: '/ năm',
    desc: 'Tiết kiệm 17% + 3 lá số người thân',
    bullets: ['Tất cả tính năng gói Tháng', 'Phân tích 3 lá số người thân', 'Ưu tiên hỗ trợ'],
  },
];

export function PricingPreview() {
  return (
    <section id="pricing" className="relative bg-background py-20 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold/80 sm:text-xs">
            Chi phí minh bạch
          </p>
          <h2 className="mt-4 font-heading text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            Chọn gói phù hợp <span className="bg-gold-gradient bg-clip-text text-transparent">với bạn</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Khảo sát đầu vào luôn miễn phí. Hủy hoặc đổi gói bất cứ lúc nào.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {TIERS.map((t) => (
            <article
              key={t.name}
              className={[
                'relative flex flex-col rounded-2xl border p-7 transition-all',
                t.highlight
                  ? 'border-gold/60 bg-gradient-to-b from-gold/[0.06] to-transparent shadow-[0_0_60px_-20px_rgba(184,146,61,0.5)]'
                  : 'border-border hover:border-gold/30',
              ].join(' ')}
              style={!t.highlight ? { backgroundColor: 'rgba(20, 20, 26, 0.4)' } : undefined}
            >
              {t.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-gold/40 bg-background px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
                  {t.badge}
                </span>
              )}
              <h3 className="font-heading text-lg font-semibold text-foreground">{t.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="font-heading text-4xl font-bold text-foreground">{t.price}</span>
                <span className="text-sm text-muted-foreground">VND {t.cadence}</span>
              </div>
              <ul className="mt-6 space-y-2.5">
                {t.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-foreground/80">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg" className="group"><Link href="/pricing">
            
              Xem chi tiết các gói
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            
          </Link></Button>
        </div>
      </div>
    </section>
  );
}
