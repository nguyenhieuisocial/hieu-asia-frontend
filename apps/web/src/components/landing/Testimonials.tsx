'use client';

import * as React from 'react';
import { Star, Quote } from 'lucide-react';

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  rating: number;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Báo cáo Tử Vi của hieu.asia chính xác đến mức bất ngờ. Mentor giúp tôi quyết định mở rộng kinh doanh.',
    name: 'Anh Khoa',
    role: 'Founder F&B, TP.HCM',
    rating: 5,
  },
  {
    quote:
      'Lần đầu tôi thấy AI hiểu được nỗi lo cụ thể của mình, không generic như app khác.',
    name: 'Chị Lan',
    role: 'Marketing Lead, Hà Nội',
    rating: 5,
  },
  {
    quote:
      '30 phút phân tích bằng cả buổi xem thầy. Đáng từng đồng. Highly recommend.',
    name: 'Anh Đức',
    role: 'Tech Lead, Đà Nẵng',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="relative bg-background py-20 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold/80 sm:text-xs">
            Cộng đồng tin dùng
          </p>
          <h2 className="mt-4 font-heading text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            Người Việt nói gì <span className="bg-gold-gradient bg-clip-text text-transparent">về chúng tôi</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="relative flex h-full flex-col rounded-2xl border border-border p-6 transition-colors hover:border-gold/30"
              style={{ backgroundColor: 'rgba(20, 20, 26, 0.4)' }}
            >
              <Quote className="absolute right-5 top-5 h-6 w-6 text-gold/20" aria-hidden="true" />
              <div className="flex gap-0.5" aria-label={`${t.rating} trên 5 sao`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < t.rating
                        ? 'h-4 w-4 fill-gold text-gold'
                        : 'h-4 w-4 text-foreground/20'
                    }
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-base leading-relaxed text-foreground/85">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 border-t border-border pt-4">
                <div className="font-heading text-sm font-semibold text-foreground">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
