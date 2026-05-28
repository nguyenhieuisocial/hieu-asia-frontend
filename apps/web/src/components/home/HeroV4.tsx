// Wave 62.04 — HeroV4 ("Như giấy cũ" editorial hero).
// Server Component — no 'use client' needed. RSC-compatible Link + plain JSX.
//
// Solves three founder pain points from vault 138 brand review:
//   1. "Hai khán giả mâu thuẫn" — split CTAs at hero level (modern AI vs
//      traditional cổ học) instead of a single ambiguous primary button.
//   2. "Hero thiếu neo thị giác" — 12-cung schematic SVG anchors the right
//      side, giving new visitors a concrete picture of what "lá số" means
//      before they read a single word of explanation.
//   3. "CTA lặp 8+ lần" — homepage CTA architecture refactored: hero owns
//      both entry-point CTAs; downstream sections drop redundant repeats.
//
// Replaces the legacy `MarketingHero` instance on the homepage only —
// /pricing /features /about /methodology /checkout continue using
// MarketingHero unchanged (gitnexus impact analysis confirmed 7 callers).
//
// Layout:
//   Mobile (default): LaSo SVG first (~60% viewport width), text + CTAs
//                     below in editorial column.
//   Desktop (lg+):    text left (7 cols), LaSo SVG right (5 cols),
//                     vertical-centered.
//
// Type system: consumes Wave 62.03 editorial scale + 62.01 Newsreader.
// Color system: consumes Wave 62.02 Paper × Ink × Ochre tokens (auto-
// flips to Charcoal × Bone × Gold-soft when .dark class present).
//
// No motion library — Wave 56 LCP lesson: hero must render visible from
// SSR (no `opacity: 0` initial states). The editorial-display weight 300
// + italic accent gives the editorial mood without animation.

import * as React from 'react';
import Link from 'next/link';
import { LaSoSvg } from '@/components/la-so-svg';

export function HeroV4() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-background py-section lg:py-hero"
    >
      <div className="mx-auto max-w-marketing px-6 lg:px-12">
        <div className="grid items-center gap-block lg:grid-cols-12 lg:gap-12">
          {/* Right column on desktop, top on mobile — Lá số schematic neo */}
          <div className="order-1 flex justify-center lg:order-2 lg:col-span-5">
            <LaSoSvg
              className="aspect-square w-3/5 max-w-[300px] text-primary sm:w-1/2 lg:w-full lg:max-w-[420px]"
            />
          </div>

          {/* Left column on desktop, below SVG on mobile — text + CTAs */}
          <div className="order-2 lg:order-1 lg:col-span-7">
            {/* Eyebrow */}
            <p className="mb-8 flex items-center gap-x-3 font-mono text-editorial-mono uppercase text-primary">
              <span className="inline-block h-px w-6 bg-primary" aria-hidden="true" />
              <span>Cẩm nang quyết định bằng AI</span>
            </p>

            {/* Display headline — Newsreader weight 300 with italic accent.
                Founder signature copy preserved; only the typographic voice
                changes from sans-bold to editorial-light. */}
            <h1
              id="hero-heading"
              className="text-balance font-editorial-display text-editorial-display font-light text-foreground"
            >
              Hiểu mình.{' '}
              <em className="font-editorial-display italic font-light text-primary">
                Quyết định mình.
              </em>
            </h1>

            {/* Lede sub-deck */}
            <p className="mt-card max-w-marketing-text text-pretty text-editorial-lede text-muted-foreground">
              Mỗi khi bạn đứng trước một quyết định quan trọng, hieu.asia cho bạn
              một góc nhìn sâu hơn — bằng tri thức cổ học Á Đông, được AI giải
              mã rõ ràng, và để bạn tự chọn con đường.
            </p>

            {/* Two entry points — Wave 62.04 P0 fix for the "two audiences"
                problem. Primary = modern (AI mentor / decision support).
                Secondary = traditional (lookup tools cohort). */}
            <div className="mt-block flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/onboarding?intent=decision"
                className="inline-flex min-h-12 items-center justify-center rounded-[2px] bg-primary px-7 py-4 font-editorial-display text-editorial-lede font-medium text-primary-foreground transition-all duration-300 ease-editorial hover:bg-primary/90"
              >
                Tôi đang phân vân một quyết định
              </Link>
              <Link
                href="/tu-vi-2026"
                className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-[2px] border border-primary/30 bg-transparent px-7 py-4 font-sans text-base text-foreground transition-all duration-300 ease-editorial hover:border-primary/60 hover:bg-primary/5"
              >
                <span>Tôi muốn xem nhanh</span>
                <span className="text-editorial-caption text-muted-foreground transition-colors group-hover:text-primary/70">
                  (Tử Vi 2026 · Hợp tuổi)
                </span>
              </Link>
            </div>

            {/* Microcopy — JetBrains Mono editorial label */}
            <p className="mt-block font-mono text-editorial-mono uppercase text-muted-foreground/80">
              Miễn phí · không cần thẻ · 1 phút
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
