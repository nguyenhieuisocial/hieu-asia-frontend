'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@hieu-asia/ui';
import { Sparkles } from '@/components/animations/Sparkles';

export function CTA() {
  return (
    <section className="relative bg-background py-20 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-purple-700/30 via-background to-background p-10 text-center sm:p-16">
          <Sparkles count={18} className="-z-10" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-20 opacity-60"
            style={{
              background:
                'radial-gradient(circle at 50% 0%, rgba(184,146,61,0.18), transparent 60%)',
            }}
          />

          <h2 className="font-heading text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            Sẵn sàng tìm hiểu <span className="bg-gold-gradient bg-clip-text text-transparent">chính mình?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Miễn phí khảo sát đầu tiên · không cần đăng ký · 30 giây để bắt đầu.
          </p>
          <div className="mt-10">
            <Link href="/onboarding">
              <Button size="lg" className="group min-w-[220px]">
                Bắt đầu ngay
                <ArrowRight
                  className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
