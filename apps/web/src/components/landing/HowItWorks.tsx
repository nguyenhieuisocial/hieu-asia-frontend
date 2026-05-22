'use client';

import * as React from 'react';
import { ClipboardList, Hand, Cpu, FileText } from 'lucide-react';

const STEPS = [
  {
    n: '01',
    Icon: ClipboardList,
    title: 'Khảo sát ngắn',
    desc: '5 phút trả lời 12–20 câu để chúng tôi hiểu bối cảnh và cách bạn ra quyết định.',
  },
  {
    n: '02',
    Icon: Hand,
    title: 'Tải ảnh lòng bàn tay',
    desc: 'Chụp tay trái và tay phải theo hướng dẫn — không cần app riêng, ngay trên trình duyệt.',
  },
  {
    n: '03',
    Icon: Cpu,
    title: 'AI phân tích',
    desc: '30 giây để hệ thống tổng hợp Tử Vi · Bát Tự · MBTI · Palm Reading.',
  },
  {
    n: '04',
    Icon: FileText,
    title: 'Báo cáo + Mentor',
    desc: 'Nhận 9 góc nhìn hành động và chat cùng Mentor AI 24/7 để đào sâu.',
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative bg-background py-20 sm:py-32">
      {/* Subtle top divider */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent"
      />

      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold/80 sm:text-xs">
            Quy trình minh bạch
          </p>
          <h2 className="mt-4 font-heading text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            Bốn bước đến <span className="bg-gold-gradient bg-clip-text text-transparent">báo cáo</span> của bạn
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Bạn luôn biết hệ thống đang làm gì với dữ liệu — và có thể xoá bất cứ lúc nào.
          </p>
        </div>

        <div className="relative mt-16">
          {/* Connecting dashed line on desktop */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-12 hidden h-px border-t border-dashed border-gold/25 md:block"
            style={{ marginLeft: '12%', marginRight: '12%' }}
          />

          <ol className="grid gap-10 md:grid-cols-4 md:gap-6">
            {STEPS.map(({ n, Icon, title, desc }) => (
              <li key={n} className="relative flex flex-col items-center text-center md:items-start md:text-left">
                <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border border-gold/30 bg-background shadow-[0_0_40px_-12px_rgba(184,146,61,0.45)]">
                  <Icon className="h-7 w-7 text-gold" aria-hidden="true" />
                </div>
                <span className="mt-5 font-mono text-xs uppercase tracking-[0.28em] text-gold/70">
                  Bước {n}
                </span>
                <h3 className="mt-2 font-heading text-lg font-semibold text-foreground">{title}</h3>
                <p className="mt-2 max-w-[18rem] text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

