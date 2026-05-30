'use client';

import * as React from 'react';
import { TuViEmblem, BatTuEmblem, ThanSoEmblem, MbtiEmblem } from './LensGlyphs';

/**
 * FourLens — "Bốn lăng kính hội tụ về một lõi AI" (emblem cao cấp + tương tác).
 * 4 hệ (Tử Vi · Bát Tự · Thần Số · MBTI) ở 4 hướng, đường mực nối về LÕI AI ở tâm.
 * Dùng 4 EMBLEM SVG khắc nét (LensGlyphs, currentColor) làm NÚT — hover/click "xem" được.
 * `active` 0..3 = soi 1 hệ (lăng kính phóng to + glow + luồng sáng chạy về lõi); 4 = HỘI TỤ.
 * onHover(i|null) / onPick(i) báo lên cha. SVG/CSS thuần. SSR/reduced-motion = hội tụ tĩnh.
 */

const INK = '#171411';
const OCHRE = '#A47532';
const SOFT = '#6B6358';
const C = 200, R_LENS = 126, LENS_R = 40, CORE_R = 26, OUT_R = 170;
const R2 = (n: number): number => Math.round(n * 100) / 100;
const P = (r: number, deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [R2(C + r * Math.cos(a)), R2(C + r * Math.sin(a))];
};

const ANGLES = [-90, 0, 90, 180];
const NAMES = ['Tử Vi', 'Bát Tự', 'Thần Số', 'MBTI'];
const ICONS = [TuViEmblem, BatTuEmblem, ThanSoEmblem, MbtiEmblem];
const LENSES = ANGLES.map((deg) => {
  const [cx, cy] = P(R_LENS, deg);
  const [hsx, hsy] = P(R_LENS - LENS_R - 2, deg);
  const [hex, hey] = P(CORE_R + 2, deg);
  return { cx, cy, hsx, hsy, hex, hey, leftPct: R2((cx / 400) * 100), topPct: R2((cy / 400) * 100) };
});
const OUT_TICKS = Array.from({ length: 36 }, (_, k) => {
  const long = k % 3 === 0;
  const [x1, y1] = P(long ? OUT_R - 7 : OUT_R - 4, k * 10);
  const [x2, y2] = P(OUT_R, k * 10);
  return { x1, y1, x2, y2 };
});
const LENS_TICKS = Array.from({ length: 12 }, (_, k) => {
  const a = (k * 30 * Math.PI) / 180;
  return { x1: R2((LENS_R - 4) * Math.cos(a)), y1: R2((LENS_R - 4) * Math.sin(a)), x2: R2(LENS_R * Math.cos(a)), y2: R2(LENS_R * Math.sin(a)) };
});

export function FourLens(props: {
  active: number;
  onHover?: (i: number | null) => void;
  onPick?: (i: number) => void;
}): React.JSX.Element {
  const { active, onHover, onPick } = props;
  const converge = active >= 4;
  const on = (i: number) => active === i || converge;
  return (
    <div className="fl-box">
      <svg viewBox="0 0 400 400" className="fl" aria-hidden="true">
        <style>{FL_CSS}</style>

        <g className="fl-spin">
          <circle cx={C} cy={C} r={OUT_R} fill="none" stroke={SOFT} strokeWidth={0.5} opacity={0.4} />
          {OUT_TICKS.map((t, i) => <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={SOFT} strokeWidth={0.6} opacity={0.45} />)}
        </g>
        <circle cx={C} cy={C} r={R_LENS} fill="none" stroke={SOFT} strokeWidth={0.6} strokeDasharray="1.5 5" opacity={0.3} />

        {LENSES.map((l, i) => (
          <line key={`h${i}`} className={`fl-hair${on(i) ? ' fl-on' : ''}`} x1={l.hsx} y1={l.hsy} x2={l.hex} y2={l.hey} stroke={OCHRE} strokeWidth={1.1} strokeLinecap="round" />
        ))}
        {LENSES.map((l, i) => (
          <line key={`f${i}`} className={`fl-flow${on(i) ? ' fl-on' : ''}`} x1={l.hsx} y1={l.hsy} x2={l.hex} y2={l.hey} stroke={OCHRE} strokeWidth={1.6} strokeLinecap="round" />
        ))}

        {LENSES.map((l, i) => (
          <g key={`l${i}`} transform={`translate(${l.cx} ${l.cy})`}>
            <g className={`fl-lens${on(i) ? ' fl-on' : ''}`}>
              <circle className="fl-lensbg" r={LENS_R} fill={OCHRE} fillOpacity={0} />
              <circle r={LENS_R} fill="none" stroke={INK} strokeWidth={1.1} />
              <circle r={LENS_R - 7} fill="none" stroke={SOFT} strokeWidth={0.5} />
              {LENS_TICKS.map((t, k) => <line key={k} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={SOFT} strokeWidth={0.5} opacity={0.55} />)}
            </g>
          </g>
        ))}

        <g className={`fl-core${converge ? ' fl-bloom' : ''}`} transform={`translate(${C} ${C})`}>
          <circle className="fl-ripple fl-r1" r={CORE_R} fill="none" stroke={OCHRE} strokeWidth={1} />
          <circle className="fl-ripple fl-r2" r={CORE_R} fill="none" stroke={OCHRE} strokeWidth={1} />
          <circle className="fl-halo" r={CORE_R} fill="none" stroke={OCHRE} strokeWidth={1} />
          <circle r={CORE_R - 8} fill="none" stroke={SOFT} strokeWidth={0.5} />
          <circle className="fl-coredot" r={3.4} fill={OCHRE} />
          <text className="fl-ai" y={4.5} fontSize={converge ? 13 : 10} letterSpacing={2} textAnchor="middle" fill={INK}>{converge ? '⟡' : 'AI'}</text>
        </g>

        <text className={`fl-cap${converge ? ' fl-capon' : ''}`} x={C} y={376} textAnchor="middle" fontSize={11} letterSpacing={1.5} fontFamily="'JetBrains Mono', monospace" fill={SOFT}>
          một bức tranh · của riêng bạn
        </text>
      </svg>

      {/* 4 emblem cao cấp làm nút — hover/click xem được */}
      {ICONS.map((Icon, i) => {
        const l = LENSES[i]!;
        return (
          <button
            key={i}
            type="button"
            className={`fl-ibtn${on(i) ? ' fl-on' : ''}`}
            style={{ left: `${l.leftPct}%`, top: `${l.topPct}%` }}
            onMouseEnter={() => onHover?.(i)}
            onMouseLeave={() => onHover?.(null)}
            onFocus={() => onHover?.(i)}
            onBlur={() => onHover?.(null)}
            onClick={() => onPick?.(i)}
            aria-label={`Hệ ${NAMES[i]} — xem chi tiết`}
          >
            <Icon className="fl-icon" />
          </button>
        );
      })}
    </div>
  );
}

const FL_CSS = `
.fl-box { position: relative; width: min(440px, 82vw); aspect-ratio: 1; }
.fl { width: 100%; height: 100%; display: block; font-family: 'Newsreader', Georgia, serif; }
.fl-spin { transform-box: view-box; transform-origin: 200px 200px; }

.fl-lens { color: ${INK}; opacity: .4; transform-box: fill-box; transform-origin: center; transition: opacity .6s ease, transform .7s cubic-bezier(.2,.8,.3,1), filter .6s ease; }
.fl-lens.fl-on { opacity: 1; transform: scale(1.13); filter: drop-shadow(0 0 6px rgba(164,117,50,.5)); }
.fl-lensbg { transition: fill-opacity .6s ease; }
.fl-lens.fl-on .fl-lensbg { fill-opacity: .07; }

.fl-hair { opacity: 0; transition: opacity .55s ease; }
.fl-hair.fl-on { opacity: .55; }
.fl-flow { opacity: 0; stroke-dasharray: 5 13; }
.fl-flow.fl-on { opacity: .95; filter: drop-shadow(0 0 3px rgba(164,117,50,.6)); }

.fl-coredot, .fl-halo, .fl-ripple { transform-box: fill-box; transform-origin: center; }
.fl-core .fl-coredot { transition: transform .6s ease; }
.fl-core.fl-bloom .fl-coredot { transform: scale(1.5); }
.fl-halo { transition: transform .6s ease; }
.fl-core.fl-bloom .fl-halo { transform: scale(1.15); filter: drop-shadow(0 0 7px rgba(164,117,50,.55)); }
.fl-ai { transition: font-size .4s ease; }
.fl-ripple { opacity: 0; }
.fl-cap { opacity: 0; transition: opacity .6s ease; }
.fl-cap.fl-capon { opacity: 1; }

/* icon buttons */
.fl-ibtn { position: absolute; width: 21%; aspect-ratio: 1; transform: translate(-50%, -50%); display: grid; place-items: center; background: transparent; border: none; cursor: pointer; color: ${INK}; opacity: .5; transition: color .5s ease, opacity .5s ease, transform .55s cubic-bezier(.2,.8,.3,1); }
.fl-ibtn.fl-on { color: ${OCHRE}; opacity: 1; transform: translate(-50%, -50%) scale(1.14); }
.fl-ibtn:hover { opacity: 1; }
.fl-ibtn:focus-visible { outline: 1px solid ${OCHRE}; outline-offset: 2px; border-radius: 50%; }
.fl-icon { width: 54%; height: 54%; }

@media (prefers-reduced-motion: no-preference) {
  .fl-spin { animation: flSpin 90s linear infinite; }
  .fl-flow.fl-on { animation: flFlow .85s linear infinite; }
  .fl-core.fl-bloom .fl-ripple { animation: flRipple 2.6s ease-out infinite; }
  .fl-core.fl-bloom .fl-r2 { animation-delay: 1.3s; }
}
@keyframes flSpin { to { transform: rotate(360deg); } }
@keyframes flFlow { from { stroke-dashoffset: 18; } to { stroke-dashoffset: 0; } }
@keyframes flRipple { 0% { opacity: .5; transform: scale(1); } 70% { opacity: 0; transform: scale(2.1); } 100% { opacity: 0; transform: scale(2.1); } }
`;
