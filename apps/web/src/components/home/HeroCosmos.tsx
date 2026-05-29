'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

/**
 * HeroCosmos — hero homepage bản "Vũ trụ" sci-fi × tâm linh (WebGL).
 *
 * PREVIEW: thay HeroV4 trên homepage (nội bộ, chưa merge) để founder duyệt hướng.
 * - Nền InkCosmos (Three.js) chế độ `ambient` → mandala 12 cung kết 1 lần lúc load
 *   (không bám cuộn, hợp 1 section hero) + sao warp + camera trôi.
 * - Three.js nạp tách rời (ssr:false); nền #04060d hiện ngay (LCP-safe: tiêu đề là DOM/SSR).
 * - Giữ NGUYÊN copy + 2 entry-point CTA của HeroV4 (link thật). Bỏ italic-vàng → trắng + cyan austere.
 * - Đáy fade xuống nền trang (giấy) để chuyển mượt sang các section editorial bên dưới.
 */

const InkCosmos = dynamic(() => import('@/app/cosmos/InkCosmos').then((m) => m.InkCosmos), {
  ssr: false,
  loading: () => null,
});

const LIGHT = '#eaf1ff';
const CYAN = '#6fe0ef';

export function HeroCosmos() {
  const [unsupported, setUnsupported] = React.useState(false);
  const onUnsupported = React.useCallback(() => setUnsupported(true), []);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
      style={{ minHeight: 'calc(100svh - 4rem)', background: '#04060d' }}
    >
      {/* Nền vũ trụ (WebGL) */}
      <div className="absolute inset-0" aria-hidden="true">
        {unsupported ? (
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 50% 38%, rgba(95,215,232,0.12), rgba(4,6,13,0) 70%), radial-gradient(circle at 70% 72%, rgba(143,123,224,0.1), rgba(4,6,13,0) 55%), #04060d',
            }}
          />
        ) : (
          <InkCosmos ambient={0.82} onUnsupported={onUnsupported} />
        )}
      </div>

      {/* Nội dung hero */}
      <div
        className="relative z-10 mx-auto flex max-w-marketing flex-col justify-center px-6 py-section lg:px-12"
        style={{ minHeight: 'calc(100svh - 4rem)' }}
      >
        <div className="max-w-2xl">
          <p
            className="mb-6 flex items-center gap-x-3 font-mono text-editorial-mono uppercase"
            style={{ color: CYAN }}
          >
            <span className="inline-block h-px w-6" style={{ background: CYAN }} aria-hidden="true" />
            <span>Cẩm nang quyết định bằng AI</span>
          </p>

          <h1
            id="hero-heading"
            className="text-balance font-editorial-display text-editorial-display font-light"
            style={{ color: LIGHT, textShadow: '0 2px 48px rgba(0,0,0,0.55)' }}
          >
            Hiểu mình.{' '}
            <span className="font-editorial-display font-light" style={{ color: CYAN }}>
              Quyết định mình.
            </span>
          </h1>

          <p
            className="mt-card max-w-marketing-text text-pretty text-editorial-lede"
            style={{ color: 'rgba(234,241,255,0.82)' }}
          >
            Mỗi người sinh ra dưới một cấu trúc sao riêng. hieu.asia giải mã cấu trúc ấy
            bằng AI — để bạn nhìn rõ chính mình, và tự quyết định.
          </p>

          <div className="mt-block flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href="/onboarding?intent=decision"
              className="inline-flex min-h-12 items-center justify-center rounded-[2px] px-7 py-4 font-editorial-display text-editorial-lede font-medium transition-all duration-300 hover:brightness-110"
              style={{ background: CYAN, color: '#04060d' }}
            >
              Tôi đang phân vân một quyết định
            </Link>
            <Link
              href="/tu-vi-2026"
              className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-[2px] border px-7 py-4 font-sans text-base transition-all duration-300"
              style={{ borderColor: 'rgba(234,241,255,0.32)', color: LIGHT }}
            >
              <span>Tôi muốn xem nhanh</span>
              <span className="text-editorial-caption" style={{ color: 'rgba(234,241,255,0.55)' }}>
                (Tử Vi 2026 · Hợp tuổi)
              </span>
            </Link>
          </div>

          <p
            className="mt-block font-mono text-editorial-mono uppercase"
            style={{ color: 'rgba(234,241,255,0.5)' }}
          >
            Miễn phí · không cần thẻ · 1 phút
          </p>
        </div>
      </div>

      {/* Fade xuống nền trang (giấy) — chuyển mượt sang section editorial bên dưới */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-background"
        aria-hidden="true"
      />
    </section>
  );
}
