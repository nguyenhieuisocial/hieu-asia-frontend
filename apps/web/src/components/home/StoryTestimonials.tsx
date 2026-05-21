'use client';

import * as React from 'react';
import { Quote } from 'lucide-react';

interface Story {
  quote: string;
  name: string;
  role: string;
  context: string;
}

/**
 * Placeholder testimonials — voice-aligned, no hyperbole or exclamation.
 * Replace with real customer stories when collected.
 */
const STORIES: readonly Story[] = [
  {
    context: 'Quyết định nghỉ việc',
    quote:
      'Tôi đang cân nhắc rời một công ty đã gắn bó 6 năm. Báo cáo Tử Vi không nói tôi nên hay không nên — nhưng giúp tôi thấy rõ điều gì tôi đang né tránh.',
    name: 'Minh A.',
    role: 'Product Manager, TP.HCM',
  },
  {
    context: 'Chọn người đồng hành',
    quote:
      'Mentor đặt cho tôi đúng câu hỏi mà tôi tránh hỏi chính mình. Sau hai cuộc trò chuyện, tôi biết mình thật sự muốn gì.',
    name: 'Lan H.',
    role: 'Designer, Hà Nội',
  },
  {
    context: 'Bắt đầu kinh doanh',
    quote:
      'Bát Tự cho tôi biết năng lượng bẩm sinh của mình thiên về Mộc — tôi hợp xây dựng dài hạn hơn là săn cơ hội ngắn. Quan trọng nhất, tôi tự ra quyết định.',
    name: 'Đức T.',
    role: 'Founder F&B, Đà Nẵng',
  },
];

export function StoryTestimonials() {
  return (
    <section
      id="stories"
      aria-labelledby="stories-heading"
      className="relative bg-ink py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold/80 sm:text-xs">
            Câu chuyện khách hàng
          </p>
          <h2
            id="stories-heading"
            className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-cream sm:text-4xl"
          >
            Họ đã{' '}
            <span className="bg-gold-gradient bg-clip-text text-transparent">tự chọn con đường</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-cream/70 sm:text-lg">
            Tên đã được thay đổi để tôn trọng quyền riêng tư.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STORIES.map((s) => (
            <figure
              key={s.name}
              className="relative flex h-full flex-col rounded-2xl border border-cream/10 p-6"
              style={{ backgroundColor: 'rgba(20, 20, 26, 0.4)' }}
            >
              <Quote className="absolute right-5 top-5 h-6 w-6 text-gold/20" aria-hidden="true" />
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold/70">
                {s.context}
              </p>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-cream/85 sm:text-base">
                {s.quote}
              </blockquote>
              <figcaption className="mt-6 border-t border-cream/5 pt-4">
                <div className="font-heading text-sm font-semibold text-cream">{s.name}</div>
                <div className="text-xs text-cream/55">{s.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
