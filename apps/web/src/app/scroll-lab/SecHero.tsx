'use client';

import * as React from 'react';
import { useScrollProgress } from './_kit/scroll';

/**
 * SecHero — Section 1, HERO điện ảnh (full viewport) cho /scroll-lab (hieu.asia).
 *
 * Nội dung: lá số 12 cung tự vẽ (stroke-draw lúc load) + tiêu đề ink-reveal (clip-path)
 * + eyebrow + 1 dòng deck + gợi ý "cuộn xuống ↓".
 *
 * Scroll (mở màn cho cả trang): useScrollProgress(heroRef) →
 *   - lá số trôi lên nhẹ + mờ dần + scale nhỏ lại (parallax chiều sâu)
 *   - tiêu đề dịch chậm hơn (phân lớp)
 *
 * RÀNG BUỘC:
 *   - transform / opacity ONLY cho motion-cuộn (compositor-safe). clip-path chỉ dùng cho ink-reveal lúc load.
 *     (stroke-dashoffset chỉ dùng 1 lần lúc load để vẽ nét — không bám scroll.)
 *   - KHÔNG scroll-jacking — cuộn tự nhiên, hiệu ứng bám tiến trình.
 *   - prefers-reduced-motion: reduce → trạng thái CUỐI tĩnh, đẹp, không phụ thuộc scroll/JS.
 *     (useScrollProgress trả 1 khi reduced → ta CHẶN, ép trạng thái hero đầy đủ, không mờ.)
 *   - LCP-safe: tiêu đề + deck nằm trong DOM, không ẩn cứng. clip-path mặc định = hiện toàn bộ (SSR/no-JS),
 *     chỉ "đóng" lại sau mount khi cho phép motion → không bao giờ kẹt ẩn.
 *   - Mobile ≤880px reflow 1 cột, nhẹ.
 *   - File MỚI self-contained (chỉ import React + toolkit).
 */

const INK = '#171411';
const OCHRE = '#A47532';
const PAPER = '#F3ECDD';
const SOFT = '#6B6358';

/* reduced-motion hook — SSR-safe (false trên server + render đầu, cập nhật sau mount). */
function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    }
    mq.addListener(apply);
    return () => mq.removeListener(apply);
  }, []);
  return reduced;
}

/* ───────────────────────── Lá số 12 cung (tự vẽ) ─────────────────────────
 * Hình học theo brand brief: center 200,200; vòng ngoài r=180; vòng trong r=95;
 * 12 nan ở góc -75+30k°; 24 tick ngoài; cung Mệnh = wedge đỉnh -105°..-75°.
 */

function polar(cx: number, cy: number, r: number, deg: number): { x: number; y: number } {
  const rad = (deg * Math.PI) / 180;
  // Làm tròn 2 chữ số → SSR (Node) & client (browser) ra chuỗi giống hệt, tránh hydration mismatch do ULP của trig.
  return { x: Math.round((cx + r * Math.cos(rad)) * 100) / 100, y: Math.round((cy + r * Math.sin(rad)) * 100) / 100 };
}

const CX = 200;
const CY = 200;
const R_OUT = 180;
const R_IN = 95;

// Cung Mệnh (path chính xác từ brief) — wedge đỉnh trên.
const MENH_PATH =
  'M153.4 26.1 A180 180 0 0 1 246.6 26.1 L224.6 108.2 A95 95 0 0 0 175.4 108.2 Z';

// 12 nan: đoạn từ vòng trong → vòng ngoài tại các góc -75 + 30k.
const SPOKES: ReadonlyArray<{ x1: number; y1: number; x2: number; y2: number }> = Array.from(
  { length: 12 },
  (_, k) => {
    const deg = -75 + 30 * k;
    const inP = polar(CX, CY, R_IN, deg);
    const outP = polar(CX, CY, R_OUT, deg);
    return { x1: inP.x, y1: inP.y, x2: outP.x, y2: outP.y };
  },
);

// 24 tick ngắn bên ngoài vòng ngoài (góc 15° một).
const TICKS: ReadonlyArray<{ x1: number; y1: number; x2: number; y2: number }> = Array.from(
  { length: 24 },
  (_, k) => {
    const deg = 15 * k;
    const a = polar(CX, CY, R_OUT, deg);
    const b = polar(CX, CY, R_OUT + 10, deg);
    return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
  },
);

/**
 * LaSo — SVG lá số 12 cung. `drawn` = true → các nét đã vẽ xong (stroke-dashoffset 0).
 * Khi reduced-motion: render thẳng trạng thái đã vẽ (không transition).
 */
function LaSo(props: { drawn: boolean; reduced: boolean }): React.JSX.Element {
  const { drawn, reduced } = props;
  // Chu vi xấp xỉ để làm dash. Vòng ngoài/ trong + nan + tick — dùng một con số đủ lớn cho mỗi loại.
  const circOut = 2 * Math.PI * R_OUT; // ~1131
  const circIn = 2 * Math.PI * R_IN; // ~597
  const spokeLen = R_OUT - R_IN; // 85

  const drawTransition = (dur: string, delay: string): string | undefined =>
    reduced ? undefined : `stroke-dashoffset ${dur} cubic-bezier(.22,.61,.36,1) ${delay}`;

  // Helper style cho nét vẽ: ẩn (offset = len) → hiện (offset 0).
  const strokeDraw = (len: number, dur: string, delay: string): React.CSSProperties => ({
    strokeDasharray: len,
    strokeDashoffset: drawn ? 0 : len,
    transition: drawTransition(dur, delay),
  });

  return (
    <svg
      viewBox="0 0 400 400"
      width="100%"
      height="100%"
      role="img"
      aria-label="Lá số 12 cung"
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* Vòng ngoài */}
      <circle
        cx={CX}
        cy={CY}
        r={R_OUT}
        fill="none"
        stroke={INK}
        strokeWidth={1.5}
        style={strokeDraw(circOut, '1.4s', '0s')}
      />
      {/* Vòng trong */}
      <circle
        cx={CX}
        cy={CY}
        r={R_IN}
        fill="none"
        stroke={INK}
        strokeWidth={1.2}
        style={strokeDraw(circIn, '1.2s', '0.15s')}
      />
      {/* 12 nan */}
      {SPOKES.map((s, i) => (
        <line
          key={`spoke-${i}`}
          x1={s.x1}
          y1={s.y1}
          x2={s.x2}
          y2={s.y2}
          stroke={INK}
          strokeWidth={1}
          style={strokeDraw(spokeLen, '0.7s', `${0.3 + i * 0.04}s`)}
        />
      ))}
      {/* 24 tick ngoài */}
      {TICKS.map((t, i) => (
        <line
          key={`tick-${i}`}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={SOFT}
          strokeWidth={1}
          style={strokeDraw(12, '0.5s', `${0.5 + i * 0.02}s`)}
        />
      ))}
      {/* Cung Mệnh — tô ochre mờ, viền ochre. Fade-in sau khi khung đã vẽ. */}
      <path
        d={MENH_PATH}
        fill={OCHRE}
        fillOpacity={drawn ? 0.16 : 0}
        stroke={OCHRE}
        strokeWidth={1.4}
        style={{
          strokeDasharray: 300,
          strokeDashoffset: drawn ? 0 : 300,
          transition: reduced
            ? undefined
            : 'stroke-dashoffset 1s cubic-bezier(.22,.61,.36,1) 0.9s, fill-opacity .9s ease 1.2s',
        }}
      />
      {/* Nhãn "Mệnh" ở giữa cung */}
      <text
        x={CX}
        y={70}
        textAnchor="middle"
        fontSize={13}
        fontFamily="'Newsreader', serif"
        fill={OCHRE}
        style={{
          opacity: drawn ? 1 : 0,
          transition: reduced ? undefined : 'opacity .8s ease 1.5s',
        }}
      >
        Mệnh
      </text>
      {/* Chấm tâm */}
      <circle
        cx={CX}
        cy={CY}
        r={3}
        fill={INK}
        style={{
          opacity: drawn ? 1 : 0,
          transition: reduced ? undefined : 'opacity .6s ease 0.6s',
        }}
      />
    </svg>
  );
}

/* ───────────────────────────── SecHero ───────────────────────────── */

export function SecHero(): React.JSX.Element {
  const reduced = useReducedMotion();
  const heroRef = React.useRef<HTMLElement>(null);

  // useScrollProgress trả 1 khi reduced → ta KHÔNG dùng giá trị đó để mờ hero.
  // Hero ở ĐỈNH trang: kit trả ~0.5 khi element đầy màn (cao = viewport). Remap để hero
  // ĐẦY ĐỦ lúc nghỉ (progress 0) rồi mờ dần khi cuộn đi (progress 1 sau ~1 màn cuộn).
  const rawProgress = useScrollProgress(heroRef);
  const progress = reduced ? 0 : Math.min(1, Math.max(0, (rawProgress - 0.5) * 2));

  // mounted: bật các hiệu ứng load (ink-reveal + stroke-draw) sau khi gắn DOM.
  // Dùng useEffect THẲNG (không rAF lồng trong effect — dễ kẹt ở StrictMode/headless khiến reveal không chạy).
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // active = cho phép load-animation chạy (đã mount + cho phép motion).
  // reduced / no-JS / trước mount → coi như đã "hiện" để không bao giờ kẹt ẩn.
  const active = mounted && !reduced;
  const drawn = reduced || mounted; // SVG: reduced hiện ngay; có motion thì vẽ sau mount
  const revealed = reduced || mounted; // tiêu đề: mặc định hiện, chỉ "đóng" khi active & chưa mount

  /* Parallax chiều sâu cho lá số:
   * progress 0 (hero đầy màn) → 1 (hero rời viewport).
   * Lá số trôi LÊN (-translateY), mờ dần, scale nhỏ lại. */
  const chartStyle: React.CSSProperties = reduced
    ? {}
    : {
        transform: `translate3d(0, ${-progress * 90}px, 0) scale(${1 - progress * 0.18})`,
        opacity: 1 - progress * 0.9,
        transformOrigin: 'center center',
        willChange: 'transform, opacity',
      };

  /* Tiêu đề dịch chậm hơn (lớp gần hơn → ít dịch hơn lá số), mờ nhẹ về cuối. */
  const titleLayerStyle: React.CSSProperties = reduced
    ? {}
    : {
        transform: `translate3d(0, ${-progress * 36}px, 0)`,
        opacity: 1 - progress * 0.55,
        willChange: 'transform, opacity',
      };

  /* Eyebrow / deck: lớp text phụ, dịch rất ít. */
  const deckLayerStyle: React.CSSProperties = reduced
    ? {}
    : {
        transform: `translate3d(0, ${-progress * 18}px, 0)`,
        opacity: 1 - progress * 0.7,
        willChange: 'transform, opacity',
      };

  // Ink-reveal cho tiêu đề: clip-path quét từ trái sang (mực loang). Trạng thái cuối = full.
  const inkClip = revealed ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)';

  // Gợi ý cuộn: reduced → tĩnh mờ nhẹ. Có motion → fade-in lúc load rồi mờ dần khi bắt đầu cuộn.
  const hintOpacity = reduced
    ? 0.85
    : revealed
      ? Math.max(0, 0.85 * (1 - progress * 1.4))
      : 0;
  const hintStyle: React.CSSProperties = {
    opacity: hintOpacity,
    transition: reduced ? undefined : 'opacity .9s ease 1.8s',
  };

  return (
    <section
      ref={heroRef}
      aria-label="Hiểu mình. Quyết định mình."
      style={{
        position: 'relative',
        minHeight: '100svh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: PAPER,
        color: INK,
        overflow: 'hidden',
        padding: 'clamp(24px, 5vw, 64px)',
        boxSizing: 'border-box',
        // grain/vignette nhẹ bằng radial-gradient (không ảnh, không lib)
        backgroundImage:
          'radial-gradient(ellipse at 50% 38%, rgba(243,236,221,0) 40%, rgba(23,20,17,0.05) 100%)',
      }}
    >
      {/* Lá số — lớp nền chiều sâu, đặt sau text. */}
      <div
        aria-hidden={false}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 'min(78vmin, 560px)',
          height: 'min(78vmin, 560px)',
          marginLeft: 'calc(min(78vmin, 560px) / -2)',
          marginTop: 'calc(min(78vmin, 560px) / -2)',
          pointerEvents: 'none',
        }}
      >
        <div style={chartStyle}>
          <LaSo drawn={drawn} reduced={reduced} />
        </div>
      </div>

      {/* Khối nội dung — nằm trên lá số, có lớp giấy mờ phía sau chữ để đọc rõ (LCP-safe). */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          maxWidth: 760,
          width: '100%',
        }}
      >
        {/* Eyebrow */}
        <div style={deckLayerStyle}>
          <p
            style={{
              margin: 0,
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 'clamp(11px, 1.4vw, 13px)',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: OCHRE,
              fontWeight: 500,
            }}
          >
            Cẩm nang quyết định bằng AI
          </p>
        </div>

        {/* Tiêu đề — ink-reveal bằng clip-path. Hai dòng để nhịp điện ảnh. */}
        <h1
          style={{
            ...titleLayerStyle,
            margin: 'clamp(18px, 3vw, 28px) 0',
            fontFamily: "'Newsreader', Georgia, serif",
            fontWeight: 500,
            lineHeight: 1.04,
            letterSpacing: '-0.015em',
            fontSize: 'clamp(40px, 9vw, 104px)',
            color: INK,
          }}
        >
          <span
            style={{
              display: 'block',
              clipPath: inkClip,
              WebkitClipPath: inkClip,
              transition: active
                ? 'clip-path 1.1s cubic-bezier(.22,.61,.36,1) 0.25s'
                : undefined,
            }}
          >
            Hiểu mình.
          </span>
          <span
            style={{
              display: 'block',
              clipPath: inkClip,
              WebkitClipPath: inkClip,
              color: OCHRE,
              transition: active
                ? 'clip-path 1.1s cubic-bezier(.22,.61,.36,1) 0.55s'
                : undefined,
            }}
          >
            Quyết định mình.
          </span>
        </h1>

        {/* Deck */}
        <div style={deckLayerStyle}>
          <p
            style={{
              margin: '0 auto',
              maxWidth: 540,
              fontFamily: "'Be Vietnam Pro', system-ui, sans-serif",
              fontSize: 'clamp(15px, 2vw, 19px)',
              lineHeight: 1.6,
              color: SOFT,
            }}
          >
            AI giải mã lá số của bạn thành ngôn ngữ rõ ràng — không phán xét, không bói toán.
            Bạn đọc, bạn hiểu, rồi bạn tự quyết.
          </p>
        </div>
      </div>

      {/* Gợi ý cuộn xuống */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 'clamp(20px, 4vh, 40px)',
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          zIndex: 2,
          ...hintStyle,
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: SOFT,
          }}
        >
          Cuộn xuống
        </span>
        <span
          style={{
            display: 'inline-block',
            fontSize: 16,
            color: OCHRE,
            animation: reduced ? undefined : 'sechero-bob 1.8s ease-in-out infinite',
          }}
        >
          ↓
        </span>
      </div>

      {/* Keyframes cho mũi tên (transform only — compositor-safe). Reduced-motion: 0 animation. */}
      <style>{`
        @keyframes sechero-bob {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, 6px, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="sechero-bob"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
