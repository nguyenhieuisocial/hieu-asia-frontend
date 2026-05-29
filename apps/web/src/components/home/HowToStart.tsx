'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, ClipboardEdit, Cpu, MessageCircle } from 'lucide-react';
import { Button } from '@hieu-asia/ui';
import { MarketingCard } from '@/components/marketing/MarketingCard';

interface Step {
  n: string;
  Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  title: string;
  desc: string;
  ctaLabel: string;
  href: string;
}

// Wave 60.95.b P1 — Polypane P1-V3 + ChatGPT external review §3.1: 3-step CTAs
// were inconsistent ("Nhập thông tin" / "Xem cách hoạt động" / "Bắt đầu trò
// chuyện"). Bước 02 "Xem cách hoạt động" diverted user OUT of conversion path
// (jumping to anchor #how breaks the flow). Now all 3 steps share the SAME
// `ctaLabel: 'Lập lá số miễn phí'` + same `href: '/onboarding'` — vault 130
// §3 P0 #3 standardize → "one action, one label" pattern.
const STEPS: readonly Step[] = [
  {
    n: '01',
    Icon: ClipboardEdit,
    title: 'Nhập thông tin cơ bản',
    desc: 'Ngày–giờ sinh và giới tính (~1 phút). Có thể chỉnh sửa sau bất cứ lúc nào miễn phí trong trang Tài khoản; khi đổi ngày sinh, bạn yêu cầu tạo lại lá số để cập nhật.',
    ctaLabel: 'Nhập thông tin của tôi →',
    href: '/onboarding',
  },
  {
    n: '02',
    Icon: Cpu,
    title: 'AI phân tích trong 30 giây',
    desc: 'Hệ thống tổng hợp Tử Vi, Bát Tự, Thần Số Học và MBTI thành một bức tranh rõ ràng.',
    ctaLabel: 'Xem AI phân tích thử →',
    href: '/onboarding',
  },
  {
    n: '03',
    Icon: MessageCircle,
    title: 'Trò chuyện với AI Mentor để hành động',
    desc: 'Đặt câu hỏi cụ thể về quyết định bạn đang cân nhắc — Mentor gợi ý các bước tiếp theo.',
    ctaLabel: 'Trò chuyện với Mentor →',
    href: '/onboarding',
  },
];

export function HowToStart() {
  return (
    <section
      id="how-to-start"
      aria-labelledby="how-to-start-heading"
      // Wave 60.79.T1 (vault 112 P0-09): tighten from sm:py-28 → md:py-20 so
      // section padding cascade doesn't pile up 200+px gaps between H2s.
      // Wave 60.95.ae (founder bug report): removed `bg-background` — in dark
      // theme `bg-background` resolves to `rgb(14,14,17)` (đen than ink) which
      // creates a visible color seam against the parent wrapper bg-background
      // `rgb(19,17,13)` set in page.tsx line 531. Same fix as Wave 60.79.T3
      // applied to WhyTrust earlier — inherit page wrapper bg for tonal
      // consistency. Callers that need a specific bg can wrap this component.
      className="relative py-16 md:py-20"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
      />
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary/90 sm:text-xs">
            Hướng dẫn bắt đầu
          </p>
          <h2
            id="how-to-start-heading"
            className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl"
          >
            Bắt đầu trong{' '}
            <span className="text-primary">3 phút</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Ba bước rõ ràng — bạn luôn biết mình đang ở đâu và bước tiếp theo là gì.
          </p>
        </div>

        {/* Wave 60.79.T2 (vault 112 P1 #3): `auto-rows-fr` + `h-full` on each
            <li> so step-02's shorter `desc` doesn't leave a height gap below
            its CTA. CSS Grid stretches row heights uniformly when explicit.

            Wave 60.83 — cards migrated to MarketingCard primitive (was
            `border-border bg-card/40 p-6 hover:border-primary/40`). MarketingCard
            emits identical `h-full flex flex-col` + `hover:border-primary/40`
            (Wave 60.79.T2 spec), and shifts bg from theme-card to
            `warm-dark-200` so cards align with the home page's warm-dark-50
            section wrapper — matches the editorial palette used by BentoLens
            and PricingTierV2 on the same surface. */}
        <ol className="mt-12 grid auto-rows-fr gap-6 md:grid-cols-3">
          {STEPS.map(({ n, Icon, title, desc, ctaLabel, href }) => (
            <li key={n} className="h-full">
              <MarketingCard padding="standard" bg="warm-dark-200">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/5">
                    <Icon className="h-5 w-5 text-primary" aria-hidden={true} />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-[0.28em] text-primary/85">
                    Bước {n}
                  </span>
                </div>
                <h3 className="mt-5 font-heading text-lg font-semibold text-foreground">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                {/* Wave 60.97.1 — `min-h-11 touch-manipulation` lifts the
                    `size="sm"` (h-9 = 36px) CTA to the 44px tap-target
                    minimum. Keeps "sm" visual padding but ensures the hit
                    area passes WCAG 2.5.5 on mobile. */}
                <Button asChild variant="outline" size="sm" className="group w-full min-h-11 touch-manipulation"><Link href={href} className="mt-5">

                    {ctaLabel}
                    <ArrowRight
                      className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden={true}
                    />

                </Link></Button>
              </MarketingCard>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
