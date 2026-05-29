'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';

/**
 * CosmosHero — khung trải nghiệm "Vũ trụ mực" cho /cosmos (hieu.asia).
 *
 * - Nền vũ trụ WebGL (InkCosmos) nạp tách rời (ssr:false) → không chặn tải trang.
 *   Trong lúc nạp / máy không hỗ trợ WebGL: nền CSS tối dịu, chữ vẫn đọc được (LCP-safe).
 * - Vùng cuộn ~320vh; lớp chữ STICKY giữa màn, đổi theo tiến trình cuộn:
 *     đầu: "Hiểu mình. Quyết định mình." → giữa: "Mười hai cung, một bản đồ sao"
 *     → cuối: CTA. (Cập nhật opacity trực tiếp qua ref — không re-render mỗi frame.)
 * - InkCosmos tự đọc window.scrollY để kết chòm 12 cung + dolly camera.
 */

const PAPER = '#F3ECDD';
const GOLD = '#D4A261';
const SOFT = '#8a93a8';
const SCROLL_SPAN = 2;

const InkCosmos = dynamic(() => import('./InkCosmos').then((m) => m.InkCosmos), {
  ssr: false,
  loading: () => null,
});

const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);

export function CosmosHero(): React.JSX.Element {
  const [unsupported, setUnsupported] = React.useState(false);
  const s0 = React.useRef<HTMLDivElement>(null);
  const s1 = React.useRef<HTMLDivElement>(null);
  const s2 = React.useRef<HTMLDivElement>(null);
  const hint = React.useRef<HTMLDivElement>(null);

  const onUnsupported = React.useCallback(() => setUnsupported(true), []);

  React.useEffect(() => {
    let raf = 0;
    const apply = () => {
      raf = 0;
      const p = clamp01(window.scrollY / (window.innerHeight * SCROLL_SPAN));
      if (s0.current) s0.current.style.opacity = String(clamp01(1 - p * 2.3));
      if (s1.current) s1.current.style.opacity = String(clamp01(1 - Math.abs(p - 0.56) / 0.2));
      if (s2.current) s2.current.style.opacity = String(clamp01((p - 0.8) / 0.16));
      if (hint.current) hint.current.style.opacity = String(clamp01(1 - p * 4));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply); };
    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return (
    <div style={{ position: 'relative', background: '#04060d', color: PAPER }}>
      {/* Nền vũ trụ — cố định, phủ toàn màn, sau chữ */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: '#04060d' }}>
        {unsupported ? (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(95,215,232,0.14), rgba(4,6,13,0) 70%), radial-gradient(circle at 72% 72%, rgba(232,183,101,0.08), rgba(4,6,13,0) 55%), #04060d',
            }}
          />
        ) : (
          <InkCosmos onUnsupported={onUnsupported} />
        )}
      </div>

      {/* Vùng cuộn + lớp chữ sticky */}
      <div style={{ position: 'relative', zIndex: 1, height: `${SCROLL_SPAN * 100 + 120}vh` }}>
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 'clamp(24px, 5vw, 64px)',
            pointerEvents: 'none',
          }}
        >
          {/* Stage 0 — mở màn */}
          <div ref={s0} style={{ maxWidth: 820 }}>
            <p
              style={{
                margin: 0,
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 'clamp(11px, 1.4vw, 13px)',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: GOLD,
              }}
            >
              Cẩm nang quyết định bằng AI
            </p>
            <h1
              style={{
                margin: 'clamp(16px, 3vw, 26px) 0',
                fontFamily: "'Newsreader', Georgia, serif",
                fontWeight: 500,
                lineHeight: 1.05,
                letterSpacing: '-0.015em',
                fontSize: 'clamp(40px, 8.5vw, 100px)',
                color: PAPER,
                textShadow: '0 2px 40px rgba(0,0,0,0.5)',
              }}
            >
              Hiểu mình.<br />
              <span style={{ color: GOLD, fontStyle: 'italic' }}>Quyết định mình.</span>
            </h1>
            <p
              style={{
                margin: '0 auto',
                maxWidth: 540,
                fontFamily: "'Be Vietnam Pro', system-ui, sans-serif",
                fontSize: 'clamp(15px, 2vw, 19px)',
                lineHeight: 1.6,
                color: PAPER,
                opacity: 0.82,
              }}
            >
              Giữa muôn vàn vì sao, có một bản đồ của riêng bạn — tri thức cổ học Á Đông,
              được AI giải mã rõ ràng, để bạn tự chọn con đường.
            </p>
          </div>

          {/* Stage 1 — chòm sao đang kết */}
          <div ref={s1} style={{ position: 'absolute', maxWidth: 760, opacity: 0 }}>
            <h2
              style={{
                margin: 0,
                fontFamily: "'Newsreader', Georgia, serif",
                fontWeight: 500,
                lineHeight: 1.1,
                fontSize: 'clamp(28px, 5.5vw, 64px)',
                color: PAPER,
                textShadow: '0 2px 40px rgba(0,0,0,0.6)',
              }}
            >
              Mười hai cung,<br />
              <span style={{ color: GOLD, fontStyle: 'italic' }}>một bản đồ sao</span> cho đời bạn.
            </h2>
          </div>

          {/* Stage 2 — chốt / CTA */}
          <div ref={s2} style={{ position: 'absolute', maxWidth: 720, opacity: 0 }}>
            <h2
              style={{
                margin: '0 0 clamp(20px,3vw,32px)',
                fontFamily: "'Newsreader', Georgia, serif",
                fontWeight: 500,
                lineHeight: 1.1,
                fontSize: 'clamp(30px, 6vw, 72px)',
                color: PAPER,
                textShadow: '0 2px 40px rgba(0,0,0,0.6)',
              }}
            >
              Lá số của bạn <span style={{ color: GOLD, fontStyle: 'italic' }}>đang chờ</span>.
            </h2>
            <span
              style={{
                pointerEvents: 'auto',
                display: 'inline-block',
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 14,
                letterSpacing: '0.08em',
                color: '#04060d',
                background: GOLD,
                padding: '14px 28px',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              Mở lá số của bạn
            </span>
          </div>
        </div>
      </div>

      {/* Gợi ý cuộn */}
      <div
        ref={hint}
        aria-hidden="true"
        style={{
          position: 'fixed',
          bottom: 'clamp(18px, 4vh, 38px)',
          left: 0,
          right: 0,
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: SOFT,
          }}
        >
          Cuộn để kết chòm sao
        </span>
        <span style={{ fontSize: 16, color: GOLD, animation: 'cosmos-bob 1.8s ease-in-out infinite' }}>↓</span>
      </div>

      <style>{`
        @keyframes cosmos-bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }
        @media (prefers-reduced-motion: reduce){ [style*="cosmos-bob"]{animation:none !important} }
      `}</style>
    </div>
  );
}
