'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TrustCard {
  icon: React.ReactNode;
  headline: string;
  desc: string;
  href: string;
}

const CARDS: readonly TrustCard[] = [
  {
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="14" cy="14" r="6" />
        <circle cx="34" cy="14" r="6" />
        <circle cx="14" cy="34" r="6" />
        <circle cx="34" cy="34" r="6" />
        <line x1="14" y1="20" x2="14" y2="28" />
        <line x1="34" y1="20" x2="34" y2="28" />
        <line x1="20" y1="14" x2="28" y2="14" />
        <line x1="20" y1="34" x2="28" y2="34" />
      </svg>
    ),
    headline: 'AI đa-vendor cascade',
    desc: 'Claude + GPT + Gemini với Llama fallback. Không phụ thuộc 1 nhà cung cấp.',
    href: '/learn',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="24" cy="24" r="20" />
        <polygon points="24,8 27,18 38,18 29,25 32,36 24,30 16,36 19,25 10,18 21,18" fill="currentColor" fillOpacity={0.2} />
      </svg>
    ),
    headline: '114 chính tinh + 6 phụ tinh',
    desc: 'Iztro engine — tính toán Tử Vi đầy đủ với độ chính xác chuẩn lịch pháp.',
    href: '/learn/tu-vi',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M 24 6 L 40 12 L 40 24 Q 40 36 24 42 Q 8 36 8 24 L 8 12 Z" />
        <path d="M 18 24 L 22 28 L 30 20" />
      </svg>
    ),
    headline: 'Bảo mật theo Nghị định 13',
    desc: 'GDPR-grade, mã hóa at rest, audit log đầy đủ. Dữ liệu cá nhân được tôn trọng.',
    href: '/privacy',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="24" cy="24" r="14" />
        <path d="M 10 24 Q 24 14 38 24 Q 24 34 10 24 Z" />
        <line x1="24" y1="10" x2="24" y2="38" />
      </svg>
    ),
    headline: 'Free tier R2 + Cloudflare edge',
    desc: 'Latency dưới 100ms tại VN, uptime 99.9%. Nền tảng nhẹ, chi phí thấp.',
    href: '/learn',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M 8 36 L 16 24 L 22 30 L 32 14 L 40 22" />
        <circle cx="40" cy="22" r="3" fill="currentColor" />
      </svg>
    ),
    headline: '10,000+ phân tích đã thực hiện',
    desc: 'Cộng đồng người Việt tin dùng. Mỗi báo cáo là một câu chuyện hiểu mình.',
    href: '/learn',
  },
];

const AUTO_INTERVAL_MS = 5000;

export function TrustSignalCarousel() {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  const next = React.useCallback(() => {
    setIndex((i) => (i + 1) % CARDS.length);
  }, []);

  const prev = React.useCallback(() => {
    setIndex((i) => (i - 1 + CARDS.length) % CARDS.length);
  }, []);

  React.useEffect(() => {
    if (paused) return;
    const id = setInterval(next, AUTO_INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <section
      className="border-y border-cream/5 bg-ink/40 py-12"
      aria-label="Tín nhiệm hieu.asia"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-6 text-center">
          <h2 className="font-heading text-2xl font-bold text-gold sm:text-3xl">
            Vì sao chọn hieu.asia
          </h2>
          <p className="mt-1 text-sm text-cream/60">5 lý do để bạn tin tưởng nền tảng này</p>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-xl border border-cream/10 bg-ink/60">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {CARDS.map((c) => (
                <div key={c.headline} className="w-full shrink-0 p-8 sm:p-10">
                  <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
                    <div className="text-gold">{c.icon}</div>
                    <h3 className="font-heading text-xl font-bold text-cream sm:text-2xl">
                      {c.headline}
                    </h3>
                    <p className="text-sm text-cream/70 sm:text-base">{c.desc}</p>
                    <Link
                      href={c.href}
                      className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-gold/40 px-4 py-1.5 text-xs font-semibold text-gold transition-colors hover:bg-gold/10"
                    >
                      Tìm hiểu thêm
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={prev}
            aria-label="Slide trước"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-cream/20 bg-ink/80 p-2 text-cream/70 transition-colors hover:border-gold hover:text-gold sm:left-4"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Slide kế"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-cream/20 bg-ink/80 p-2 text-cream/70 transition-colors hover:border-gold hover:text-gold sm:right-4"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="Chuyển slide">
          {CARDS.map((c, i) => (
            <button
              key={c.headline}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Slide ${i + 1}: ${c.headline}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-8 bg-gold' : 'w-1.5 bg-cream/30 hover:bg-cream/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
