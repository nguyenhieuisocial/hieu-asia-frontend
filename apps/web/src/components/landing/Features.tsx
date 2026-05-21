'use client';

import * as React from 'react';
import { Compass, Calendar, ScanLine, MessageSquareHeart } from 'lucide-react';

const FEATURES = [
  {
    Icon: Compass,
    title: 'Tử Vi Đẩu Số 114 sao',
    desc: 'Tính toán chính xác 12 cung, đại vận và lưu niên — theo trường phái Bắc phái.',
  },
  {
    Icon: Calendar,
    title: 'Bát Tự Tứ Trụ',
    desc: 'Năm / Tháng / Ngày / Giờ stem-branch cùng ngũ hành cục và dụng thần.',
  },
  {
    Icon: ScanLine,
    title: 'Palm Reading AI',
    desc: 'Vision multimodal phân tích đường chỉ tay — Life, Head, Heart và đặc trưng cá nhân.',
  },
  {
    Icon: MessageSquareHeart,
    title: 'Mentor cá nhân hóa',
    desc: 'Claude Opus đồng hành mỗi ngày — đặt câu hỏi, lên kế hoạch, tự phản tư.',
  },
];

export function Features() {
  return (
    <section id="features" className="relative bg-ink py-20 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold/80 sm:text-xs">
            Tính năng cốt lõi
          </p>
          <h2 className="mt-4 font-heading text-4xl font-bold leading-tight tracking-tight text-cream sm:text-5xl">
            Bốn hệ thống. <span className="bg-gold-gradient bg-clip-text text-transparent">Một bức tranh.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-cream/70 sm:text-lg">
            Kết hợp tri thức cổ điển Á Đông với AI hiện đại — chính xác trong tính toán,
            đồng cảm trong diễn giải.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ Icon, title, desc }) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-cream/5 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_0_40px_-12px_rgba(184,146,61,0.4)]"
              style={{ backgroundColor: 'rgba(20, 20, 26, 0.4)' }}
            >
              {/* Hover glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    'radial-gradient(circle at top left, rgba(184,146,61,0.12), transparent 60%)',
                }}
              />
              <div className="relative">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gold/30 bg-gold/5 transition-colors group-hover:border-gold/60 group-hover:bg-gold/10">
                  <Icon className="h-5 w-5 text-gold" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-lg font-semibold leading-tight text-cream">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/65">{desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
