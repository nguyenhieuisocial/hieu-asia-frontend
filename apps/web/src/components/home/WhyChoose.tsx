'use client';

import * as React from 'react';
import { Zap, Lock, BookOpen, MessageSquareHeart } from 'lucide-react';

interface Reason {
  Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  title: string;
  desc: string;
}

const REASONS: readonly Reason[] = [
  {
    Icon: Zap,
    title: 'Edge-fast — phản hồi dưới 1 giây',
    desc: 'Hạ tầng chạy trên Cloudflare Workers ở 300+ thành phố. Bạn nhập xong, kết quả đến gần như tức thì.',
  },
  {
    Icon: Lock,
    title: 'Riêng tư mặc định',
    desc: 'Dữ liệu được mã hoá AES-256 lúc lưu, TLS 1.3 lúc truyền. Bạn có thể xoá toàn bộ tài khoản bất cứ lúc nào.',
  },
  {
    Icon: BookOpen,
    title: 'AI giải mã cổ học Á Đông',
    desc: 'Tử Vi Bắc phái 114 sao, Bát Tự Ngũ Hành, Thần Số Học, MBTI — và cả tinh hoa cổ truyền Việt Nam (Cân Xương Đoán Số). Diễn giải bằng AI hiện đại, văn phong tiếng Việt.',
  },
  {
    Icon: MessageSquareHeart,
    title: 'Mentor đồng hành mỗi ngày',
    desc: 'Khi bạn đứng trước một quyết định, Mentor đặt câu hỏi và gợi ý — bạn vẫn là người chọn con đường.',
  },
];

export function WhyChoose() {
  return (
    <section
      id="why"
      aria-labelledby="why-heading"
      className="relative bg-ink py-20 sm:py-28"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent"
      />
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold/80 sm:text-xs">
            Vì sao chọn hieu.asia
          </p>
          <h2
            id="why-heading"
            className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-cream sm:text-4xl"
          >
            Bốn lý do để bắt đầu{' '}
            <span className="bg-gold-gradient bg-clip-text text-transparent">ngay hôm nay</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map(({ Icon, title, desc }) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-cream/10 bg-ink/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_0_40px_-12px_rgba(184,146,61,0.4)]"
            >
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
                  <Icon className="h-5 w-5 text-gold" aria-hidden={true} />
                </div>
                <h3 className="font-heading text-base font-semibold leading-tight text-cream">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/70">{desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
