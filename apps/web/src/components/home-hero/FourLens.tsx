'use client';

import * as React from 'react';
import { EMBLEMS } from './LensGlyphs';
import { LENSES } from '@/lib/catalog/lenses';

/**
 * LensConstellation — năm lăng kính nối nhau thành NGÔI SAO; hội tụ = CỜ ĐỎ SAO VÀNG.
 *
 * Lens mode (active 0..N-1): 5 lăng kính nối bằng các CẠNH SAO (pentagram) — hover một hệ
 *   thì 2 cạnh của nó sáng lên. Sơ đồ cạnh: Big Five→Tử Vi→MBTI→Xem Tướng→Bát Tự→Big Five.
 * Hội tụ (active ≥ N): astrolabe mờ đi; một nét vàng tự VẼ ngôi sao 5 cánh (một nét liền)
 *   rồi TÔ màu vàng tươi trên đĩa đỏ — huy hiệu cờ đỏ sao vàng, có tia nắng tỏa + lấp lánh.
 *
 * onHover(i|null) / onPick(i) báo lên cha. SVG/CSS thuần. SSR / reduced-motion = sao tĩnh.
 * NOTE: sơ đồ cạnh sao (EDGES) cố định cho 5 lăng kính flagship — đổi số lượng catalog thì sửa EDGES.
 */

// 2026-06-22: INK/SOFT → currentColor để nét vẽ SVG theo chữ (foreground) của
// theme — Ink trên light, Bone trên dark. (Dùng currentColor thay var() vì
// thuộc-tính SVG không resolve var() ổn định mọi trình duyệt.) OCHRE/FLAGRED giữ.
const INK = 'currentColor';
const OCHRE = '#A47532';
const SOFT = 'currentColor';
const FLAGRED = '#9E2E1C'; // đỏ sơn mài trầm (trước là đỏ cờ neon #DA251D) — dịu lại, hợp nền kem + vàng
const C = 200, R_LENS = 126, LENS_R = 40, CORE_R = 26, OUT_R = 170, STAR_IN = 52;
const R2 = (n: number): number => Math.round(n * 100) / 100;
const P = (r: number, deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [R2(C + r * Math.cos(a)), R2(C + r * Math.sin(a))];
};

const LENS_N = LENSES.length;
// N hệ chia đều quanh vòng, hệ đầu ở đỉnh (−90°). 5 lăng kính flagship = ngũ giác.
const ANGLES = LENSES.map((_, k) => -90 + (360 / LENS_N) * k);
const NODES = ANGLES.map((deg) => {
  const [cx, cy] = P(R_LENS, deg);
  return { cx, cy, leftPct: R2((cx / 400) * 100), topPct: R2((cy / 400) * 100) };
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

// Cạnh sao (chỉ số catalog: Tử Vi 0 · Bát Tự 1 · MBTI 2 · Big Five 3 · Xem Tướng 4):
// Big Five(3)→Tử Vi(0)→MBTI(2)→Xem Tướng(4)→Bát Tự(1)→Big Five(3).
const EDGES: ReadonlyArray<readonly [number, number]> = [[3, 0], [0, 2], [2, 4], [4, 1], [1, 3]];
// Đa giác sao đặc (đỉnh = vị trí 5 lăng kính, đỉnh-lõm xen kẽ).
const STAR_POLY = ((): string => {
  const pts: string[] = [];
  for (let k = 0; k < 5; k++) {
    const [ox, oy] = P(R_LENS, -90 + 72 * k);
    const [ix, iy] = P(STAR_IN, -90 + 72 * k + 36);
    pts.push(`${ox},${oy}`, `${ix},${iy}`);
  }
  return pts.join(' ');
})();
// Nét vẽ một-nét (pentagram) bắt đầu từ Big Five — "vẽ sao không nhấc bút".
const PENTA = ((): string => {
  const o = Array.from({ length: 5 }, (_, k) => P(R_LENS, -90 + 72 * k));
  const seq = [o[3]!, o[0]!, o[2]!, o[4]!, o[1]!];
  return 'M' + seq.map((p, i) => `${i === 0 ? '' : 'L'}${p[0]} ${p[1]}`).join(' ') + ' Z';
})();
const RAYS = Array.from({ length: 24 }, (_, k) => {
  const [x1, y1] = P(38, k * 15);
  const [x2, y2] = P(146, k * 15);
  return { x1, y1, x2, y2, w: k % 2 ? 0.8 : 1.6 };
});

export function LensConstellation(props: {
  active: number;
  onHover?: (i: number | null) => void;
  onPick?: (i: number) => void;
}): React.JSX.Element {
  const { active, onHover, onPick } = props;
  const converge = active >= LENS_N;
  const onLens = (i: number): boolean => active === i;
  const barOn = (a: number, b: number): boolean => !converge && (active === a || active === b);
  return (
    <div className={`fl-box${converge ? ' fl-converge' : ''}`}>
      <svg viewBox="0 0 400 400" className="fl" aria-hidden="true">
        <style>{FL_CSS}</style>
        <defs>
          <radialGradient id="flGold" cx="50%" cy="42%" r="62%">
            <stop offset="0%" stopColor="#FFE873" />
            <stop offset="55%" stopColor="#FFCE2E" />
            <stop offset="100%" stopColor="#F2B200" />
          </radialGradient>
        </defs>

        {/* lăng kính phân tích (mờ đi khi hội tụ) */}
        <g className="fl-astro">
          <g className="fl-spin">
            <circle cx={C} cy={C} r={OUT_R} fill="none" stroke={SOFT} strokeWidth={0.5} opacity={0.4} />
            {OUT_TICKS.map((t, i) => <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={SOFT} strokeWidth={0.6} opacity={0.45} />)}
          </g>
          <circle cx={C} cy={C} r={R_LENS} fill="none" stroke={SOFT} strokeWidth={0.6} strokeDasharray="1.5 5" opacity={0.3} />

          {/* cạnh sao nối các lăng kính */}
          {EDGES.map(([a, b], i) => {
            const pa = NODES[a]!, pb = NODES[b]!;
            return <line key={`bar${i}`} className={`fl-bar${barOn(a, b) ? ' fl-on' : ''}`} x1={pa.cx} y1={pa.cy} x2={pb.cx} y2={pb.cy} stroke={OCHRE} strokeWidth={1.1} strokeLinecap="round" />;
          })}

          {NODES.map((l, i) => (
            <g key={`l${i}`} transform={`translate(${l.cx} ${l.cy})`}>
              <g className={`fl-lens${onLens(i) ? ' fl-on' : ''}`}>
                <circle className="fl-lensbg" r={LENS_R} fill={OCHRE} fillOpacity={0} />
                <circle r={LENS_R} fill="none" stroke={INK} strokeWidth={1.1} />
                <circle r={LENS_R - 7} fill="none" stroke={SOFT} strokeWidth={0.5} />
                {LENS_TICKS.map((t, k) => <line key={k} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={SOFT} strokeWidth={0.5} opacity={0.55} />)}
              </g>
            </g>
          ))}

          <g className="fl-core" transform={`translate(${C} ${C})`}>
            <circle className="fl-halo" r={CORE_R} fill="none" stroke={OCHRE} strokeWidth={1} />
            <circle r={CORE_R - 8} fill="none" stroke={SOFT} strokeWidth={0.5} />
            <circle className="fl-coredot" r={3.4} fill={OCHRE} />
            <text className="fl-ai" y={4.5} fontSize={10} letterSpacing={2} textAnchor="middle" fill={INK}>AI</text>
          </g>
        </g>

        {/* hội tụ = cờ đỏ sao vàng (vẽ một nét → tô màu) */}
        <g className="fl-flag">
          <circle className="fl-flagred" cx={C} cy={C} r={150} />
          <g className="fl-rays">
            {RAYS.map((r, i) => <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="#FFE873" strokeWidth={r.w} opacity={0.13} />)}
          </g>
          <path className="fl-drawpath" pathLength={100} d={PENTA} />
          <polygon className="fl-flagstar" points={STAR_POLY} />
        </g>

        <text className={`fl-cap${converge ? ' fl-capon' : ''}`} x={C} y={384} textAnchor="middle" fontSize={11} letterSpacing={1.5} fontFamily="var(--font-be-vietnam), system-ui, sans-serif" fill={SOFT}>
          năm lăng kính · một ngôi sao
        </text>
      </svg>

      {/* N emblem cao cấp làm nút — hover/click xem được (mờ khi hội tụ) */}
      {NODES.map((l, i) => {
        const Icon = EMBLEMS[LENSES[i]!.slug] ?? EMBLEMS['tu-vi']!;
        return (
          <button
            key={i}
            type="button"
            className={`fl-ibtn${onLens(i) ? ' fl-on' : ''}${converge ? ' fl-faded' : ''}`}
            style={{ left: `${l.leftPct}%`, top: `${l.topPct}%` }}
            onPointerEnter={(e) => { if (e.pointerType === 'mouse') onHover?.(i); }}
            onPointerLeave={(e) => { if (e.pointerType === 'mouse') onHover?.(null); }}
            onFocus={(e) => { if (e.currentTarget.matches(':focus-visible')) onHover?.(i); }}
            onBlur={() => onHover?.(null)}
            onClick={() => onPick?.(i)}
            aria-label={`Hệ ${LENSES[i]!.name} — xem chi tiết`}
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
.fl { width: 100%; height: 100%; display: block; font-family: var(--font-newsreader), Georgia, serif; }
.fl-spin { transform-box: view-box; transform-origin: 200px 200px; }

.fl-astro { transition: opacity .7s ease; }
.fl-converge .fl-astro { opacity: 0; pointer-events: none; }

.fl-lens { color: ${INK}; opacity: .4; transform-box: fill-box; transform-origin: center; transition: opacity .7s ease, transform .7s cubic-bezier(.2,.8,.3,1), filter .7s ease; }
.fl-lens.fl-on { opacity: 1; transform: scale(1.13); filter: drop-shadow(0 0 6px rgba(164,117,50,.5)); }
.fl-lensbg { transition: fill-opacity .6s ease; }
.fl-lens.fl-on .fl-lensbg { fill-opacity: .07; }

.fl-bar { opacity: .2; transition: opacity .6s ease, stroke-width .4s ease; }
.fl-bar.fl-on { opacity: .92; stroke-width: 1.9; filter: drop-shadow(0 0 3px rgba(164,117,50,.5)); }
.fl-converge .fl-bar { opacity: 0; }

.fl-coredot, .fl-halo { transform-box: fill-box; transform-origin: center; }
.fl-cap { opacity: 0; transition: opacity .6s ease; }
.fl-cap.fl-capon { opacity: 1; }

/* hội tụ — cờ đỏ sao vàng */
.fl-flag { opacity: 0; transform-box: fill-box; transform-origin: center; transform: scale(.86); transition: opacity .45s ease, transform .8s cubic-bezier(.2,.85,.25,1); }
.fl-converge .fl-flag { opacity: 1; transform: scale(1); }
.fl-flagred { fill: ${FLAGRED}; }
.fl-flagstar { fill: url(#flGold); opacity: 0; }
.fl-drawpath { fill: none; stroke: #FFE873; stroke-width: 2.4; stroke-linejoin: round; stroke-linecap: round; stroke-dasharray: 100; stroke-dashoffset: 100; opacity: 0; }
.fl-rays { transform-box: view-box; transform-origin: 200px 200px; }

/* icon buttons */
.fl-ibtn { position: absolute; width: 21%; aspect-ratio: 1; transform: translate(-50%, -50%); display: grid; place-items: center; background: transparent; border: none; cursor: pointer; color: ${INK}; opacity: .5; transition: color .7s ease, opacity .7s ease, transform .7s cubic-bezier(.2,.8,.3,1); }
.fl-ibtn.fl-on { color: ${OCHRE}; opacity: 1; transform: translate(-50%, -50%) scale(1.14); }
.fl-ibtn.fl-faded { opacity: 0; }
.fl-ibtn:hover { opacity: 1; }
.fl-ibtn:focus-visible { outline: 1px solid ${OCHRE}; outline-offset: 2px; border-radius: 50%; }
.fl-icon { width: 54%; height: 54%; }

@media (prefers-reduced-motion: no-preference) {
  .fl-spin { animation: flSpin 90s linear infinite; }
  .fl-rays { animation: flSpin 70s linear infinite; }
  .fl-converge .fl-drawpath { opacity: 1; animation: drawStar 1.05s ease-in-out forwards; }
  .fl-converge .fl-flagstar { animation: fillIn .55s ease 1s both, starShine 3.4s ease-in-out 1.6s infinite; }
  .fl-converge .fl-flag { animation: flWave 7s ease-in-out 1.6s infinite; }
}
@media (prefers-reduced-motion: reduce) {
  .fl-converge .fl-drawpath { display: none; }
  .fl-converge .fl-flagstar { opacity: 1; }
}
@keyframes flSpin { to { transform: rotate(360deg); } }
@keyframes drawStar { to { stroke-dashoffset: 0; } }
@keyframes fillIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes starShine { 0%,100% { filter: drop-shadow(0 0 2px rgba(255,213,40,.4)); } 50% { filter: drop-shadow(0 0 13px rgba(255,213,40,.9)); } }
@keyframes flWave { 0%,100% { transform: scale(1) skewX(0) rotate(0); } 25% { transform: scale(1) skewX(-1deg) rotate(.3deg); } 75% { transform: scale(1) skewX(1deg) rotate(-.3deg); } }
`;
