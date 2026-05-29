'use client';

import * as React from 'react';

/** PROTOTYPE concept "Lập lá số" — self-contained, KHÔNG import la-so-svg thật. */

const INK = '#171411';
const OCHRE = '#A47532';
const PAPER = '#F3ECDD';
const SOFT = '#6B6358';

// Làm tròn toạ độ → SSR & client ra chuỗi giống hệt (tránh hydration mismatch do ULP của Math.cos/sin).
const R = (n: number) => Math.round(n * 100) / 100;

// 12 spoke boundaries → sector "Mệnh" centered at top.
const SPOKES = Array.from({ length: 12 }, (_, k) => {
  const r = ((-75 + 30 * k) * Math.PI) / 180;
  return {
    x1: R(200 + 95 * Math.cos(r)), y1: R(200 + 95 * Math.sin(r)),
    x2: R(200 + 180 * Math.cos(r)), y2: R(200 + 180 * Math.sin(r)),
    delay: 0.55 + k * 0.05,
  };
});

// 24 outer tick marks (the slowly-rotating astrolabe ring).
const TICKS = Array.from({ length: 24 }, (_, k) => {
  const r = ((k * 15) * Math.PI) / 180;
  return {
    x1: R(200 + 169 * Math.cos(r)), y1: R(200 + 169 * Math.sin(r)),
    x2: R(200 + 180 * Math.cos(r)), y2: R(200 + 180 * Math.sin(r)),
  };
});

// Star scatter inside the ring.
const STARS = ([
  [150, 80], [262, 96], [320, 160], [334, 234], [290, 312],
  [206, 342], [114, 300], [76, 214], [98, 138], [232, 152], [168, 250],
] as const).map(([x, y], i) => ({ x, y, ochre: i % 3 === 0, delay: 1.15 + i * 0.05 }));

// Mệnh wedge (annular sector, top, -105°..-75°).
const MENH = 'M153.4 26.1 A180 180 0 0 1 246.6 26.1 L224.6 108.2 A95 95 0 0 0 175.4 108.2 Z';

const LABELS = [
  { t: 'Mệnh', x: 200, y: 50, d: 1.5 },
  { t: 'Tài', x: 352, y: 206, d: 1.6 },
  { t: 'Quan', x: 48, y: 206, d: 1.7 },
];

const cssVar = (d: number) => ({ ['--d']: `${d}s` } as React.CSSProperties);

export function HeroLab() {
  const [run, setRun] = React.useState(0);
  const wrap = React.useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = wrap.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--rx', `${(-((e.clientY - r.top) / r.height - 0.5) * 5).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width - 0.5) * 6).toFixed(2)}deg`);
  };
  const reset = () => {
    const el = wrap.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <main className="hl" style={{ background: PAPER, color: INK, minHeight: '100vh' }}>
      <style>{CSS}</style>

      <div className="hl-wrap" key={run}>
        <div className="hl-copy">
          <p className="hl-eyebrow">CẨM NANG QUYẾT ĐỊNH BẰNG AI</p>
          <h1 className="hl-h1">
            <span className="hl-line hl-l1">Hiểu mình.</span>
            <span className="hl-line hl-l2">Quyết định mình.</span>
          </h1>
          <p className="hl-deck">
            Mỗi khi bạn đứng trước một quyết định quan trọng, hieu.asia cho bạn một
            góc nhìn sâu hơn — bằng tri thức cổ học Á Đông, được AI giải mã rõ ràng,
            và để bạn tự chọn con đường.
          </p>
        </div>

        <div className="hl-chart-wrap" ref={wrap} onPointerMove={onMove} onPointerLeave={reset}>
          <svg viewBox="0 0 400 400" className="hl-chart" role="img" aria-label="Lá số 12 cung (minh hoạ)">
            <circle className="hl-draw" pathLength={1} cx={200} cy={200} r={180} fill="none" stroke={INK} strokeWidth={1.1} style={cssVar(0.2)} />
            <g className="hl-spin">
              {TICKS.map((t, i) => (
                <line key={i} className="hl-draw" pathLength={1} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={SOFT} strokeWidth={0.8} style={cssVar(0.3)} />
              ))}
            </g>
            <circle className="hl-draw" pathLength={1} cx={200} cy={200} r={95} fill="none" stroke={INK} strokeWidth={1} style={cssVar(0.45)} />
            {SPOKES.map((s, i) => (
              <line key={i} className="hl-draw" pathLength={1} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={INK} strokeWidth={0.7} style={cssVar(s.delay)} />
            ))}
            <path className="hl-menh" d={MENH} fill={OCHRE} fillOpacity={0.14} stroke={OCHRE} strokeWidth={1.1} />
            {STARS.map((s, i) => (
              <circle key={i} className="hl-star" cx={s.x} cy={s.y} r={1.9} fill={s.ochre ? OCHRE : INK} style={cssVar(s.delay)} />
            ))}
            {LABELS.map((l, i) => (
              <text key={i} className="hl-label" x={l.x} y={l.y} fill={SOFT} fontSize={11} textAnchor="middle" style={cssVar(l.d)}>{l.t}</text>
            ))}
            <circle className="hl-breathe" cx={200} cy={200} r={3} fill={OCHRE} />
            <text className="hl-center" x={200} y={205} fill={INK} fontSize={15} letterSpacing={3} textAnchor="middle">MỆNH</text>
          </svg>
        </div>
      </div>

      <div className="hl-bar">
        <button className="hl-replay" onClick={() => { reset(); setRun((r) => r + 1); }}>↻ Xem lại hiệu ứng</button>
        <span className="hl-note">Prototype P1 · SVG + CSS thuần · tôn trọng prefers-reduced-motion · play-once · /hero-lab (noindex)</span>
      </div>
    </main>
  );
}

const CSS = `
.hl { font-family: 'Newsreader', Georgia, serif; overflow-x: hidden; }
.hl-wrap { max-width: 1180px; margin: 0 auto; padding: 88px 56px 24px; display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 40px; align-items: center; }
@media (max-width: 880px) { .hl-wrap { grid-template-columns: 1fr; padding: 48px 24px 8px; } .hl-chart-wrap { order: -1; } }
.hl-eyebrow { font-family: 'JetBrains Mono', monospace; letter-spacing: .24em; font-size: 12px; color: ${SOFT}; }
.hl-h1 { font-size: clamp(2.7rem, 6.2vw, 5.2rem); line-height: .98; margin: .35em 0 .5em; font-weight: 400; letter-spacing: -0.02em; }
.hl-line { display: block; }
.hl-l2 { color: ${OCHRE}; font-style: italic; }
.hl-deck { max-width: 30em; font-size: 1.06rem; line-height: 1.58; color: ${INK}; opacity: .82; }
.hl-chart-wrap { perspective: 1100px; display: grid; place-items: center; }
.hl-chart { width: min(440px, 82vw); height: auto; transform: rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)); transition: transform .45s ease-out; }

/* Defaults = final state (reduced-motion / no-JS safe) */
.hl-draw { stroke-dasharray: 1; stroke-dashoffset: 0; }
.hl-star, .hl-label, .hl-center { opacity: 1; }
.hl-star, .hl-breathe { transform-box: fill-box; transform-origin: center; }

@media (prefers-reduced-motion: no-preference) {
  .hl-draw { animation: hlDraw 1.25s ease both var(--d, 0s); }
  .hl-star { animation: hlPop .5s ease both var(--d, 0s); }
  .hl-menh { animation: hlFill .9s ease 1.05s both; }
  .hl-label { animation: hlFade .8s ease both var(--d, 0s); }
  .hl-center { animation: hlFade 1s ease 1.35s both; }
  .hl-breathe { animation: hlBreathe 5s ease-in-out 2s infinite; }
  .hl-spin { transform-box: fill-box; transform-origin: center; animation: hlSpin 220s linear 2s infinite; }
  .hl-l1 { clip-path: inset(0 100% 0 0); animation: hlInk .85s cubic-bezier(.2,.7,.2,1) .15s both; }
  .hl-l2 { clip-path: inset(0 100% 0 0); animation: hlInk .9s cubic-bezier(.2,.7,.2,1) .5s both; }
  .hl-eyebrow { animation: hlFade .8s ease both; }
  .hl-deck { animation: hlFade 1s ease .95s both; }
}
@keyframes hlDraw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes hlPop { from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); } }
@keyframes hlFill { from { fill-opacity: 0; } to { fill-opacity: .14; } }
@keyframes hlFade { from { opacity: 0; } to { opacity: 1; } }
@keyframes hlInk { to { clip-path: inset(0 0 0 0); } }
@keyframes hlBreathe { 0%,100% { opacity: .45; transform: scale(1); } 50% { opacity: 1; transform: scale(1.7); } }
@keyframes hlSpin { to { transform: rotate(360deg); } }

.hl-bar { max-width: 1180px; margin: 0 auto; padding: 8px 56px 48px; display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
@media (max-width: 880px) { .hl-bar { padding: 8px 24px 40px; } }
.hl-replay { font-family: 'JetBrains Mono', monospace; font-size: 13px; border: 1px solid ${OCHRE}; color: ${OCHRE}; background: transparent; padding: 9px 16px; border-radius: 4px; cursor: pointer; }
.hl-replay:hover { background: rgba(164,117,50,.08); }
.hl-note { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${SOFT}; }
`;
