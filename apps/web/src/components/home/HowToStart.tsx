'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, ClipboardEdit, Cpu, MessageCircle } from 'lucide-react';
import { Button } from '@hieu-asia/ui';

interface Step {
  n: string;
  Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  title: string;
  desc: string;
  ctaLabel: string;
  href: string;
}

const STEPS: readonly Step[] = [
  {
    n: '01',
    Icon: ClipboardEdit,
    title: 'Nhập thông tin cơ bản',
    desc: 'Ngày–giờ sinh và giới tính (~1 phút). Có thể chỉnh sửa sau bất cứ lúc nào miễn phí — nếu đổi ngày sinh, toàn bộ lá số sẽ tự cập nhật.',
    ctaLabel: 'Nhập thông tin',
    href: '/onboarding',
  },
  {
    n: '02',
    Icon: Cpu,
    title: 'AI phân tích trong 30 giây',
    desc: 'Hệ thống tổng hợp Tử Vi, Bát Tự, Thần Số Học và MBTI thành một bức tranh rõ ràng.',
    ctaLabel: 'Xem cách hoạt động',
    href: '#how',
  },
  {
    n: '03',
    Icon: MessageCircle,
    title: 'Trò chuyện với AI Mentor để hành động',
    desc: 'Đặt câu hỏi cụ thể về quyết định bạn đang cân nhắc — Mentor gợi ý các bước tiếp theo.',
    ctaLabel: 'Bắt đầu trò chuyện',
    href: '/onboarding',
  },
];

export function HowToStart() {
  return (
    <section
      id="how-to-start"
      aria-labelledby="how-to-start-heading"
      className="relative bg-background py-20 sm:py-28"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent"
      />
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold/80 sm:text-xs">
            Hướng dẫn bắt đầu
          </p>
          <h2
            id="how-to-start-heading"
            className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl"
          >
            Bắt đầu trong{' '}
            <span className="bg-gold-gradient bg-clip-text text-transparent">3 phút</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Ba bước rõ ràng — bạn luôn biết mình đang ở đâu và bước tiếp theo là gì.
          </p>
        </div>

        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map(({ n, Icon, title, desc, ctaLabel, href }) => (
            <li
              key={n}
              className="flex flex-col rounded-2xl border border-border bg-card/40 p-6 transition-colors hover:border-gold/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/30 bg-gold/5">
                  <Icon className="h-5 w-5 text-gold" aria-hidden={true} />
                </div>
                <span className="font-mono text-xs uppercase tracking-[0.28em] text-gold/85">
                  Bước {n}
                </span>
              </div>
              <h3 className="mt-5 font-heading text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              <Button asChild variant="outline" size="sm" className="group w-full"><Link href={href} className="mt-5">
                
                  {ctaLabel}
                  <ArrowRight
                    className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden={true}
                  />
                
              </Link></Button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
