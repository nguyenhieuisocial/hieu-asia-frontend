'use client';

import * as React from 'react';

/**
 * FourLens — "Bốn lăng kính hội tụ về một lõi AI" cho hieu.asia.
 * Thay lá số 12 cung (chỉ Tử Vi) → 4 hệ (Tử Vi · Bát Tự · Thần Số · MBTI) hội tụ:
 *   4 lăng kính ở 4 hướng (mỗi cái = vành + glyph hệ), 4 đường mực nối về LÕI AI ở tâm.
 *   `active` 0..3 = đang soi 1 hệ (hệ đó sáng ochre, đường mực sáng); 4 = HỘI TỤ (cả 4 sáng + lõi nở).
 * SVG/CSS thuần. Toạ độ làm tròn (SSR khớp). Mặc định (SSR/reduced-motion) = trạng thái hội tụ tĩnh.
 */

const INK = '#171411';
const OCHRE = '#A47532';
const SOFT = '#6B6358';
const C = 200, R_LENS = 128, LENS_R = 40, CORE_R = 26;
const R2 = (n: number): number => Math.round(n * 100) / 100;

// top · right · bottom · left
const ANGLES = [-90, 0, 90, 180];
const LENSES = ANGLES.map((deg) => {
  const a = (deg * Math.PI) / 180;
  const cos = Math.cos(a), sin = Math.sin(a);
  return {
    cx: R2(C + R_LENS * cos), cy: R2(C + R_LENS * sin),
    hsx: R2(C + (R_LENS - LENS_R) * cos), hsy: R2(C + (R_LENS - LENS_R) * sin),
    hex: R2(C + CORE_R * cos), hey: R2(C + CORE_R * sin),
  };
});

function Glyph({ i }: { i: number }): React.JSX.Element {
  // glyph đơn giản, tâm (0,0), nét currentColor (đổi màu theo trạng thái lăng kính)
  if (i === 0) {
    // Tử Vi — mini lá số (vành + 8 nan)
    return (
      <g fill="none" stroke="currentColor" strokeWidth={1.2}>
        <circle r={13} />
        {Array.from({ length: 8 }, (_, k) => {
          const a = (k * 45 * Math.PI) / 180;
          return <line key={k} x1={R2(7 * Math.cos(a))} y1={R2(7 * Math.sin(a))} x2={R2(13 * Math.cos(a))} y2={R2(13 * Math.sin(a))} />;
        })}
      </g>
    );
  }
  if (i === 1) {
    // Bát Tự — 4 trụ
    return (
      <g stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
        {[-9, -3, 3, 9].map((x) => <line key={x} x1={x} y1={-12} x2={x} y2={12} />)}
      </g>
    );
  }
  if (i === 2) {
    // Thần Số — vòng số đồng tâm + tâm
    return (
      <g fill="none" stroke="currentColor" strokeWidth={1.2}>
        <circle r={13} />
        <circle r={7} />
        <circle r={1.6} fill="currentColor" stroke="none" />
      </g>
    );
  }
  // MBTI — 4 trục (ô vuông chia tư)
  return (
    <g fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinejoin="round">
      <rect x={-12} y={-12} width={24} height={24} rx={2} />
      <line x1={0} y1={-12} x2={0} y2={12} />
      <line x1={-12} y1={0} x2={12} y2={0} />
    </g>
  );
}

export function FourLens({ active }: { active: number }): React.JSX.Element {
  const converge = active >= 4;
  const on = (i: number) => active === i || converge;
  return (
    <svg viewBox="0 0 400 400" className="fl" role="img" aria-label="Bốn lăng kính (Tử Vi · Bát Tự · Thần Số · MBTI) hội tụ về lõi AI">
      <style>{FL_CSS}</style>

      {/* đường mực nối lăng kính → lõi */}
      {LENSES.map((l, i) => (
        <line key={`h${i}`} className={`fl-hair${on(i) ? ' fl-on' : ''}`} x1={l.hsx} y1={l.hsy} x2={l.hex} y2={l.hey} stroke={OCHRE} strokeWidth={1.1} />
      ))}

      {/* 4 lăng kính */}
      {LENSES.map((l, i) => (
        <g key={`l${i}`} className={`fl-lens${on(i) ? ' fl-on' : ''}`} transform={`translate(${l.cx} ${l.cy})`}>
          <circle r={LENS_R} fill="none" stroke={INK} strokeWidth={1.1} />
          <circle r={LENS_R - 6} fill="none" stroke={SOFT} strokeWidth={0.5} />
          <g className="fl-glyph"><Glyph i={i} /></g>
        </g>
      ))}

      {/* lõi AI */}
      <g className={`fl-core${converge ? ' fl-bloom' : ''}`} transform={`translate(${C} ${C})`}>
        <circle className="fl-halo" r={CORE_R} fill="none" stroke={OCHRE} strokeWidth={1} />
        <circle r={CORE_R - 8} fill="none" stroke={SOFT} strokeWidth={0.5} />
        <circle className="fl-coredot" r={3.4} fill={OCHRE} />
        <text className="fl-ai" y={4.5} fontSize={converge ? 13 : 10} letterSpacing={2} textAnchor="middle" fill={INK}>{converge ? '⟡' : 'AI'}</text>
      </g>

      {/* caption payoff khi hội tụ */}
      <text className={`fl-cap${converge ? ' fl-capon' : ''}`} x={C} y={374} textAnchor="middle" fontSize={11} letterSpacing={1.5} fontFamily="'JetBrains Mono', monospace" fill={SOFT}>
        một bức tranh · của riêng bạn
      </text>
    </svg>
  );
}

const FL_CSS = `
.fl { width: 100%; height: auto; display: block; font-family: 'Newsreader', Georgia, serif; }
.fl-lens { color: ${INK}; opacity: .42; transition: opacity .6s ease, color .6s ease; }
.fl-lens.fl-on { opacity: 1; color: ${OCHRE}; }
.fl-hair { opacity: 0; transition: opacity .55s ease; }
.fl-hair.fl-on { opacity: .85; }
.fl-coredot, .fl-halo { transform-box: fill-box; transform-origin: center; }
.fl-core .fl-coredot { transition: transform .6s ease; }
.fl-core.fl-bloom .fl-coredot { transform: scale(1.5); }
.fl-halo { opacity: .5; transition: opacity .6s ease, transform .6s ease; }
.fl-core.fl-bloom .fl-halo { opacity: 1; transform: scale(1.12); }
.fl-ai { transition: font-size .4s ease; }
.fl-cap { opacity: 0; transition: opacity .6s ease; }
.fl-cap.fl-capon { opacity: 1; }
@media (prefers-reduced-motion: no-preference) {
  .fl-core.fl-bloom .fl-halo { animation: flPulse 2.4s ease-in-out infinite; }
}
@keyframes flPulse { 0%,100% { opacity: .6; } 50% { opacity: 1; } }
`;
