'use client';

import * as React from 'react';

import { Parallax, Pinned } from './_kit/scroll';

/**
 * SecQuestions — SECTION 2 của /scroll-lab (hieu.asia).
 *
 * "Những câu hỏi lớn": nền ĐÊM (charcoal) để tạo nhịp tương phản giữa trang.
 * Dùng <Pinned height="320vh">: khi cuộn qua (progress 0..1) lần lượt hiện & tan
 * 4 câu hỏi đời người, mỗi câu chiếm một khoảng progress. Câu active opacity 1 +
 * lên rõ; câu khác mờ + dịch nhẹ. Một lá số mờ xoay rất chậm sau lưng (parallax).
 * Cuối cùng chốt: "Mỗi câu hỏi, một bản đồ."
 *
 * RÀNG BUỘC:
 *   - transform / opacity ONLY cho motion (compositor-safe). KHÔNG WebGL/video/lib mới.
 *   - KHÔNG scroll-jacking — Pinned bám tiến trình cuộn tự nhiên.
 *   - prefers-reduced-motion: reduce → liệt kê 4 câu tĩnh, KHÔNG ghim, không phụ thuộc scroll/JS.
 *   - SSR/LCP-safe: tiêu đề + câu hỏi nằm trong DOM, không ẩn cứng. Trạng thái ẩn chỉ
 *     áp dụng sau mount khi cho phép motion (giống Reveal trong toolkit) → no-JS vẫn đọc được.
 *   - Mobile ≤880px: 1 cột, chữ co lại bằng clamp().
 */

const INK = '#171411';
const OCHRE = '#A47532';
const PAPER = '#F3ECDD';
const CHARCOAL = '#15110C';
const GOLD = '#D4A261';

const QUESTIONS: readonly string[] = [
  'Sự nghiệp nên rẽ hướng nào?',
  'Người ấy có phải người của mình?',
  'Có nên dấn khoản vốn này?',
  'Khi nào mới là đúng lúc?',
];

/* ───────── reduced-motion hook (SSR-safe, cùng pattern toolkit) ───────── */
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

/* ───────── đường cong active cho 1 câu hỏi ─────────
 * Mỗi câu chiếm một "slot" tâm tại center, rộng dần hiện/tan.
 * Trả 0..1: 1 khi progress đúng tâm câu, 0 khi ra ngoài cửa sổ của câu.
 */
function slotActivity(progress: number, index: number, count: number): number {
  // Chia [0,1] thành 'count' tâm cách đều, chừa mép đầu/cuối để câu 1 kịp hiện
  // và câu cuối kịp tan trước khi lộ dòng chốt.
  const start = 0.06;
  const end = 0.82;
  const span = end - start;
  const center = count > 1 ? start + (span * index) / (count - 1) : start + span / 2;
  // Nửa bề rộng cửa sổ mỗi câu: hơi rộng hơn khoảng cách giữa 2 tâm để chuyển mượt.
  const step = count > 1 ? span / (count - 1) : span;
  const half = step * 0.62;
  const d = Math.abs(progress - center);
  if (d >= half) return 0;
  // smoothstep cho mép mềm
  const t = 1 - d / half; // 0..1
  return t * t * (3 - 2 * t);
}

/* Dòng chốt hiện ở cuối (progress cao). */
function finaleActivity(progress: number): number {
  const start = 0.86;
  if (progress <= start) return 0;
  const t = Math.min(1, (progress - start) / (1 - start));
  return t * t * (3 - 2 * t);
}

/* ───────── Lá số 12 cung (mờ, nền) ─────────
 * Vẽ theo spec brand: center 200,200; r ngoài 180, trong 95; 12 nan góc -75+30k°;
 * 24 tick ngoài. Chỉ nét mảnh, màu gold mờ — làm chất nền, không cạnh tranh chữ.
 */
function LaSo(): React.JSX.Element {
  const cx = 200;
  const cy = 200;
  const rOuter = 180;
  const rInner = 95;
  // Làm tròn toạ độ → SSR & client ra chuỗi giống hệt (tránh hydration mismatch do ULP của Math.cos/sin).
  const r2 = (n: number) => Math.round(n * 100) / 100;

  const spokes = Array.from({ length: 12 }, (_, k) => {
    const deg = -75 + 30 * k;
    const rad = (deg * Math.PI) / 180;
    const x1 = r2(cx + rInner * Math.cos(rad));
    const y1 = r2(cy + rInner * Math.sin(rad));
    const x2 = r2(cx + rOuter * Math.cos(rad));
    const y2 = r2(cy + rOuter * Math.sin(rad));
    return { x1, y1, x2, y2, key: k };
  });

  const ticks = Array.from({ length: 24 }, (_, k) => {
    const deg = k * 15;
    const rad = (deg * Math.PI) / 180;
    const rt = rOuter + 10;
    const x1 = r2(cx + rOuter * Math.cos(rad));
    const y1 = r2(cy + rOuter * Math.sin(rad));
    const x2 = r2(cx + rt * Math.cos(rad));
    const y2 = r2(cy + rt * Math.sin(rad));
    return { x1, y1, x2, y2, key: k };
  });

  return (
    <svg
      viewBox="0 0 400 400"
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <g fill="none" stroke={GOLD} strokeWidth={1} opacity={0.5}>
        <circle cx={cx} cy={cy} r={rOuter} />
        <circle cx={cx} cy={cy} r={rOuter - 14} strokeWidth={0.6} />
        <circle cx={cx} cy={cy} r={rInner} />
        <circle cx={cx} cy={cy} r={rInner * 0.46} strokeWidth={0.6} />
        {spokes.map((s) => (
          <line key={`s-${s.key}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} />
        ))}
        {ticks.map((t) => (
          <line key={`t-${t.key}`} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} strokeWidth={0.8} />
        ))}
        {/* Cung Mệnh nhấn nhẹ (đỉnh -105°..-75°) theo spec brand */}
        <path
          d="M153.4 26.1 A180 180 0 0 1 246.6 26.1 L224.6 108.2 A95 95 0 0 0 175.4 108.2 Z"
          fill={GOLD}
          fillOpacity={0.05}
          stroke={GOLD}
          strokeWidth={0.8}
          opacity={0.7}
        />
      </g>
    </svg>
  );
}

/* ───────── Cảnh ghim (motion) ───────── */
function PinnedScene(progress: number): React.JSX.Element {
  const finale = finaleActivity(progress);
  // Lá số xoay rất chậm theo tiến trình (compositor-safe: rotate qua transform).
  const rot = progress * 28; // tổng ~28deg suốt cả đoạn — rất chậm
  const finaleShift = (1 - finale) * 24;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: CHARCOAL,
        color: PAPER,
        overflow: 'hidden',
      }}
    >
      {/* Lá số nền — Parallax dịch nhẹ theo cuộn, kèm xoay rất chậm. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 'min(118vh, 132vw)',
          height: 'min(118vh, 132vw)',
          transform: 'translate(-50%, -50%)',
          opacity: 0.16,
          pointerEvents: 'none',
        }}
      >
        <Parallax speed={0.16} axis="y">
          <div
            style={{
              transform: `rotate(${rot}deg)`,
              transformOrigin: '50% 50%',
              willChange: 'transform',
            }}
          >
            <LaSo />
          </div>
        </Parallax>
      </div>

      {/* Khói tối quanh mép để chữ nổi (radial, không cản chữ). */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(120% 90% at 50% 50%, rgba(21,17,12,0) 38%, ${CHARCOAL} 92%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Nhãn nhỏ trên cùng */}
      <div
        style={{
          position: 'absolute',
          top: 'clamp(28px, 7vh, 64px)',
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 'clamp(11px, 1.4vw, 13px)',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: GOLD,
          opacity: 0.72,
        }}
      >
        Những câu hỏi lớn
      </div>

      {/* Các câu hỏi chồng tâm — chỉ câu active rõ. */}
      <div
        style={{
          position: 'relative',
          width: 'min(92vw, 980px)',
          padding: '0 24px',
          textAlign: 'center',
        }}
      >
        {QUESTIONS.map((q, i) => {
          const a = slotActivity(progress, i, QUESTIONS.length);
          // active: opacity cao + scale ~1 + y=0; inactive: mờ + dịch xuống + co nhẹ.
          const opacity = 0.06 + a * 0.94;
          const y = (1 - a) * 40;
          const scale = 0.965 + a * 0.035;
          const blurDim = a < 0.5; // câu chưa rõ thì mờ chữ đi một chút
          return (
            <h2
              key={i}
              aria-hidden={a < 0.5 ? true : undefined}
              style={{
                position: i === 0 ? 'relative' : 'absolute',
                top: i === 0 ? undefined : '50%',
                left: i === 0 ? undefined : 0,
                right: i === 0 ? undefined : 0,
                margin: 0,
                fontFamily: "'Newsreader', Georgia, serif",
                fontWeight: 400,
                lineHeight: 1.08,
                fontSize: 'clamp(2rem, 6.4vw, 5rem)',
                color: a > 0.5 ? PAPER : GOLD,
                opacity,
                transform:
                  i === 0
                    ? `translate3d(0, ${y}px, 0) scale(${scale})`
                    : `translate3d(0, calc(-50% + ${y}px), 0) scale(${scale})`,
                transformOrigin: '50% 50%',
                textShadow: a > 0.5 ? '0 1px 40px rgba(0,0,0,0.45)' : 'none',
                filter: blurDim ? 'blur(0.4px)' : 'none',
                willChange: 'transform, opacity',
              }}
            >
              {q}
            </h2>
          );
        })}
      </div>

      {/* Dòng chốt — hiện ở cuối đoạn ghim. */}
      <div
        aria-hidden={finale < 0.5 ? true : undefined}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 'clamp(40px, 12vh, 110px)',
          textAlign: 'center',
          padding: '0 24px',
          opacity: finale,
          transform: `translate3d(0, ${finaleShift}px, 0)`,
          willChange: 'transform, opacity',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            display: 'block',
            width: 44,
            height: 1,
            margin: '0 auto 20px',
            background: OCHRE,
            opacity: 0.7,
          }}
        />
        <p
          style={{
            margin: 0,
            fontFamily: "'Newsreader', Georgia, serif",
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(1.15rem, 2.6vw, 1.9rem)',
            color: GOLD,
          }}
        >
          Mỗi câu hỏi, một bản đồ.
        </p>
      </div>
    </div>
  );
}

/* ───────── Bản tĩnh (reduced-motion / no-JS-friendly) ─────────
 * Liệt kê 4 câu hỏi rõ ràng + dòng chốt. Không ghim, không phụ thuộc scroll.
 */
function StaticList(): React.JSX.Element {
  return (
    <div
      style={{
        background: CHARCOAL,
        color: PAPER,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(64px, 12vh, 140px) clamp(24px, 6vw, 80px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Lá số nền tĩnh, rất mờ. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          right: '-6%',
          width: 'min(80vh, 70vw)',
          height: 'min(80vh, 70vw)',
          transform: 'translateY(-50%)',
          opacity: 0.1,
          pointerEvents: 'none',
        }}
      >
        <LaSo />
      </div>

      <div style={{ position: 'relative', maxWidth: 980, margin: '0 auto', width: '100%' }}>
        <p
          style={{
            margin: '0 0 clamp(28px, 5vh, 52px)',
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 'clamp(11px, 1.4vw, 13px)',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: GOLD,
            opacity: 0.8,
          }}
        >
          Những câu hỏi lớn
        </p>
        <ol
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(20px, 4vh, 40px)',
          }}
        >
          {QUESTIONS.map((q, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 'clamp(14px, 2.4vw, 28px)',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 'clamp(0.8rem, 1.6vw, 1rem)',
                  color: OCHRE,
                  flex: '0 0 auto',
                  paddingTop: '0.35em',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2
                style={{
                  margin: 0,
                  fontFamily: "'Newsreader', Georgia, serif",
                  fontWeight: 400,
                  lineHeight: 1.1,
                  fontSize: 'clamp(1.6rem, 4.6vw, 3.2rem)',
                  color: PAPER,
                }}
              >
                {q}
              </h2>
            </li>
          ))}
        </ol>
        <p
          style={{
            margin: 'clamp(36px, 7vh, 72px) 0 0',
            fontFamily: "'Newsreader', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 'clamp(1.15rem, 2.6vw, 1.9rem)',
            color: GOLD,
          }}
        >
          Mỗi câu hỏi, một bản đồ.
        </p>
      </div>
    </div>
  );
}

export function SecQuestions(): React.JSX.Element {
  const reduced = useReducedMotion();

  return (
    <section
      aria-label="Những câu hỏi lớn"
      style={{
        width: '100%',
        background: CHARCOAL,
        color: PAPER,
        // viền chuyển nhịp với section giấy trước/sau
        borderTop: `1px solid ${INK}`,
        borderBottom: `1px solid ${INK}`,
      }}
    >
      {reduced ? (
        <StaticList />
      ) : (
        <Pinned height="320vh">{(progress) => PinnedScene(progress)}</Pinned>
      )}
    </section>
  );
}
