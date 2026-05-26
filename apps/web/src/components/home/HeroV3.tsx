// Wave 56 (V4 Sprint B) — converted from client to Server Component. After
// removing Framer Motion entry animations there's no client-only logic; this
// drops the framer-motion import (and bundle) from the home page entirely.
// Button (@hieu-asia/ui) is internally `'use client'` but RSC can render it.
import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, FileText, ShieldCheck, Globe2, Users } from 'lucide-react';
import { Button } from '@hieu-asia/ui';

/**
 * HeroV3 — premium full-bleed hero per brand truth vault 71/72.
 *
 * Tagline H1 + Promise subtitle + dual CTA + trust badge row.
 * Layered gradient (ink → purple radial) with subtle gold ornament SVG.
 *
 * Wave 56 (V4 Sprint B) LCP fix — REMOVED Framer Motion entry animations
 * from the above-fold elements (H1, badge, paragraph, CTAs, trust badges,
 * SVG ornaments). The H1 (#hero-heading) is the LCP element. With Framer
 * Motion's `initial={{ opacity: 0 }}` the SSR HTML ships
 * `style="opacity:0;transform:translateY(14px)"` → the LCP element is
 * INVISIBLE until JS hydrates and the entry animation completes (≥710ms
 * after hydration). On mobile this pushed LCP to 6s+.
 *
 * The animation entrance was a nice-to-have; the design works (and feels
 * sharper) without it. CSS hover/transition effects on CTAs are preserved.
 * The decorative SVG ornaments are kept (they're behind the LCP element,
 * z-index -10/-20/-30) but rendered as plain SVG without entry animation.
 */
export function HeroV3() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-background"
    >
      {/* Layer 1: purple/gold radial wash */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 bg-[radial-gradient(ellipse_at_top,_rgba(59,39,84,0.55)_0%,_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(184,146,61,0.18)_0%,_transparent_60%)]"
      />
      {/* Layer 2: faint grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 opacity-[0.06] [background-image:linear-gradient(rgba(184,146,61,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(184,146,61,0.55)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]"
      />
      {/* Layer 3: floating gold ornaments */}
      <GoldOrnaments />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col items-center justify-center px-6 py-24 text-center sm:py-32">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-card/60 px-4 py-1.5 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold/90 sm:text-xs">
            Cẩm nang quyết định bằng AI
          </span>
        </div>

        <h1
          id="hero-heading"
          className="mt-8 max-w-4xl text-balance font-heading text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
        >
          Hiểu mình.{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            Quyết định mình.
          </span>
        </h1>

        <p className="mt-8 max-w-2xl text-pretty text-base leading-relaxed text-foreground/80 sm:text-lg">
          Mỗi khi bạn đứng trước một quyết định quan trọng, hieu.asia cho bạn một
          góc nhìn sâu hơn — bằng tri thức cổ học Á Đông, trình bày bằng tiếng
          Việt cho người Việt, được AI giải mã rõ ràng, và để bạn tự chọn con đường.
        </p>

        <div className="mt-10 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
          <div className="flex w-full flex-col items-center gap-1.5 sm:w-auto">
            <Button asChild size="lg" className="group w-full min-w-[260px] sm:w-auto"><Link href="/onboarding" className="w-full sm:w-auto">

                Lập lá số miễn phí trong 1 phút
                <ArrowRight
                  className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />

            </Link></Button>
            <span className="text-[11px] text-muted-foreground/80 sm:text-xs">
              Không cần thẻ tín dụng · Không gửi email
            </span>
          </div>
          <Button asChild size="lg" variant="outline" className="group w-full min-w-[220px] sm:w-auto"><Link href="/sample-report" className="w-full sm:w-auto">

              <FileText className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Xem báo cáo mẫu trước

          </Link></Button>
        </div>

        <ul
          className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-muted-foreground sm:text-sm"
          aria-label="Tin cậy"
        >
          <TrustBadge Icon={Users}>Tử Vi Bắc phái 114 sao · validation 4 tầng</TrustBadge>
          <TrustBadge Icon={ShieldCheck}>AES-256 · TLS 1.3 · Tuân thủ NĐ 13/2023</TrustBadge>
          <TrustBadge Icon={Globe2}>Hỗ trợ Tiếng Việt + English</TrustBadge>
        </ul>
      </div>

      {/* Bottom fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background"
      />
    </section>
  );
}

function TrustBadge({
  Icon,
  children,
}: {
  Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  children: React.ReactNode;
}) {
  return (
    <li className="inline-flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 text-gold/80" aria-hidden={true} />
      <span>{children}</span>
    </li>
  );
}

function GoldOrnaments() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Floating SVG ornament — top right. Wave 56 — dropped motion wrapper;
          static opacity at brand-mood level. Not on LCP path (z=-10). */}
      <svg
        className="absolute -right-16 top-20 hidden h-72 w-72 text-gold/40 opacity-[0.55] md:block"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
      >
        <circle cx="100" cy="100" r="80" />
        <circle cx="100" cy="100" r="55" />
        <circle cx="100" cy="100" r="30" />
        <path d="M100 20 L100 180 M20 100 L180 100" />
        <path d="M40 40 L160 160 M40 160 L160 40" />
      </svg>
      {/* Floating SVG ornament — bottom left */}
      <svg
        className="absolute -left-20 bottom-16 hidden h-64 w-64 text-gold/30 opacity-40 md:block"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
      >
        <polygon points="100,10 190,100 100,190 10,100" />
        <polygon points="100,40 160,100 100,160 40,100" />
        <polygon points="100,70 130,100 100,130 70,100" />
      </svg>
    </div>
  );
}
