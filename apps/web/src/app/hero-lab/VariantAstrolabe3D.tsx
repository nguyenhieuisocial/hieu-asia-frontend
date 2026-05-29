'use client';

import * as React from 'react';

/**
 * VariantAstrolabe3D — biến thể "thiên bàn có chiều sâu".
 * Self-contained, KHÔNG import la-so-svg thật / components vùng cấm.
 * Concept: lá số 12 cung tách thành NHIỀU LỚP đặt ở các translateZ khác nhau
 * trong một khối preserve-3d + perspective. Rê chuột → cả khối nghiêng
 * (rotateX/Y ≤8°) và mỗi lớp parallax theo độ sâu (lớp gần dịch nhiều hơn)
 * → cảm giác 3D thật, như cầm một cổ vật thiên văn.
 * CSS 3D transforms thuần. transform/opacity only. reduced-motion = phẳng, tĩnh.
 */

const INK = '#171411';
const OCHRE = '#A47532';
const PAPER = '#F3ECDD';
const SOFT = '#6B6358';

// Làm tròn toạ độ → SSR & client ra chuỗi giống hệt (tránh hydration mismatch do ULP của Math.cos/sin).
const R = (n: number) => Math.round(n * 100) / 100;

// 12 spoke boundaries → cung "Mệnh" ở đỉnh (-105°..-75°).
const SPOKES = Array.from({ length: 12 }, (_, k) => {
  const r = ((-75 + 30 * k) * Math.PI) / 180;
  return {
    x1: R(200 + 95 * Math.cos(r)), y1: R(200 + 95 * Math.sin(r)),
    x2: R(200 + 180 * Math.cos(r)), y2: R(200 + 180 * Math.sin(r)),
    delay: 0.6 + k * 0.045,
  };
});

// 24 outer tick marks (vòng tick xoay chậm).
const TICKS = Array.from({ length: 24 }, (_, k) => {
  const r = ((k * 15) * Math.PI) / 180;
  return {
    x1: R(200 + 169 * Math.cos(r)), y1: R(200 + 169 * Math.sin(r)),
    x2: R(200 + 180 * Math.cos(r)), y2: R(200 + 180 * Math.sin(r)),
  };
});

// Star scatter — tách 2 lớp sâu khác nhau cho parallax.
const STARS = ([
  [150, 80], [262, 96], [320, 160], [334, 234], [290, 312],
  [206, 342], [114, 300], [76, 214], [98, 138], [232, 152], [168, 250],
] as const).map(([x, y], i) => ({ x, y, ochre: i % 3 === 0, delay: 1.2 + i * 0.05 }));

// Cung Mệnh (annular sector, đỉnh, -105°..-75°) — khớp hình học P1.
const MENH = 'M153.4 26.1 A180 180 0 0 1 246.6 26.1 L224.6 108.2 A95 95 0 0 0 175.4 108.2 Z';

const LABELS = [
  { t: 'Mệnh', x: 200, y: 50, d: 1.55 },
  { t: 'Tài', x: 352, y: 206, d: 1.65 },
  { t: 'Quan', x: 48, y: 206, d: 1.75 },
];

const cssVar = (d: number) => ({ ['--d']: `${d}s` } as React.CSSProperties);
// Mỗi lớp: --z (chiều sâu px) drive cả translateZ lẫn biên độ parallax.
const layerVar = (z: number) => ({ ['--z']: `${z}px` } as React.CSSProperties);

export function VariantAstrolabe3D() {
  const [run, setRun] = React.useState(0);
  const stage = React.useRef<HTMLDivElement>(null);
  const raf = React.useRef<number | null>(null);
  const target = React.useRef({ rx: 0, ry: 0, px: 0, py: 0 });

  // rAF-throttle: pointermove chỉ ghi target, 1 frame mới flush vào CSS var.
  const flush = React.useCallback(() => {
    raf.current = null;
    const el = stage.current;
    if (!el) return;
    const { rx, ry, px, py } = target.current;
    el.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
    el.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
    el.style.setProperty('--px', px.toFixed(3));
    el.style.setProperty('--py', py.toFixed(3));
  }, []);

  const onMove = (e: React.PointerEvent) => {
    const el = stage.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;  // -0.5..0.5
    const ny = (e.clientY - r.top) / r.height - 0.5;
    // Nghiêng nhỏ ≤8°; px/py là hệ số parallax (-1..1) cho từng lớp nhân với --z.
    target.current = { rx: -ny * 8, ry: nx * 8, px: nx * 2, py: ny * 2 };
    if (raf.current == null) raf.current = requestAnimationFrame(flush);
  };

  const reset = () => {
    if (raf.current != null) { cancelAnimationFrame(raf.current); raf.current = null; }
    target.current = { rx: 0, ry: 0, px: 0, py: 0 };
    const el = stage.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--px', '0');
    el.style.setProperty('--py', '0');
  };

  React.useEffect(() => () => { if (raf.current != null) cancelAnimationFrame(raf.current); }, []);

  return (
    <main className="av" style={{ background: PAPER, color: INK, minHeight: '100vh' }}>
      <style>{CSS}</style>

      <div className="av-wrap" key={run}>
        <div className="av-copy">
          <p className="av-eyebrow">CẨM NANG QUYẾT ĐỊNH BẰNG AI</p>
          <h1 className="av-h1">
            <span className="av-line av-l1">Hiểu mình.</span>
            <span className="av-line av-l2">Quyết định mình.</span>
          </h1>
          <p className="av-deck">
            Một thiên bàn cổ, từng lớp một, dựng lại trước mắt bạn. hieu.asia mở ra
            chiều sâu của tri thức Á Đông — được AI giải mã rõ ràng — để mỗi quyết
            định quan trọng có thêm một góc nhìn, và để bạn tự chọn con đường.
          </p>
        </div>

        {/* perspective container; .av-stage là khối preserve-3d nghiêng theo con trỏ */}
        <div className="av-scene" onPointerMove={onMove} onPointerLeave={reset}>
          <div className="av-stage" ref={stage}>
            <div className="av-shadow" aria-hidden="true" />

            {/* Lớp xa nhất: vòng ngoài + sao mờ nền */}
            <svg viewBox="0 0 400 400" className="av-layer" style={layerVar(0)} role="img" aria-label="Lá số 12 cung dạng thiên bàn (minh hoạ)">
              <circle className="av-draw" pathLength={1} cx={200} cy={200} r={180} fill="none" stroke={INK} strokeWidth={1.1} style={cssVar(0.2)} />
              <circle className="av-draw" pathLength={1} cx={200} cy={200} r={174} fill="none" stroke={SOFT} strokeWidth={0.5} style={cssVar(0.3)} />
            </svg>

            {/* Sao nền — sâu, dịch ít */}
            <svg viewBox="0 0 400 400" className="av-layer av-spin-slow" style={layerVar(8)} aria-hidden="true">
              {STARS.filter((_, i) => i % 2 === 0).map((s, i) => (
                <circle key={i} className="av-star" cx={s.x} cy={s.y} r={1.5} fill={s.ochre ? OCHRE : SOFT} fillOpacity={0.7} style={cssVar(s.delay)} />
              ))}
            </svg>

            {/* Vòng tick xoay chậm */}
            <svg viewBox="0 0 400 400" className="av-layer" style={layerVar(20)} aria-hidden="true">
              <g className="av-spin">
                {TICKS.map((t, i) => (
                  <line key={i} className="av-draw" pathLength={1} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={SOFT} strokeWidth={0.8} style={cssVar(0.35)} />
                ))}
              </g>
            </svg>

            {/* 12 nan + vòng trong */}
            <svg viewBox="0 0 400 400" className="av-layer" style={layerVar(34)} aria-hidden="true">
              <circle className="av-draw" pathLength={1} cx={200} cy={200} r={95} fill="none" stroke={INK} strokeWidth={1} style={cssVar(0.5)} />
              {SPOKES.map((s, i) => (
                <line key={i} className="av-draw" pathLength={1} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={INK} strokeWidth={0.7} style={cssVar(s.delay)} />
              ))}
            </svg>

            {/* Sao tiền cảnh + nhãn — dịch vừa */}
            <svg viewBox="0 0 400 400" className="av-layer" style={layerVar(46)} aria-hidden="true">
              {STARS.filter((_, i) => i % 2 === 1).map((s, i) => (
                <circle key={i} className="av-star" cx={s.x} cy={s.y} r={2} fill={s.ochre ? OCHRE : INK} style={cssVar(s.delay)} />
              ))}
              {LABELS.map((l, i) => (
                <text key={i} className="av-label" x={l.x} y={l.y} fill={SOFT} fontSize={11} textAnchor="middle" style={cssVar(l.d)}>{l.t}</text>
              ))}
            </svg>

            {/* Cung Mệnh — nổi lên, ochre */}
            <svg viewBox="0 0 400 400" className="av-layer" style={layerVar(56)} aria-hidden="true">
              <path className="av-menh" d={MENH} fill={OCHRE} fillOpacity={0.16} stroke={OCHRE} strokeWidth={1.2} />
            </svg>

            {/* Tâm Mệnh — lớp gần nhất, dịch nhiều nhất */}
            <svg viewBox="0 0 400 400" className="av-layer" style={layerVar(72)} aria-hidden="true">
              <circle className="av-halo" cx={200} cy={200} r={30} fill="none" stroke={OCHRE} strokeWidth={0.6} strokeOpacity={0.35} />
              <circle className="av-breathe" cx={200} cy={200} r={3} fill={OCHRE} />
              <text className="av-center" x={200} y={205} fill={INK} fontSize={15} letterSpacing={3} textAnchor="middle">MỆNH</text>
            </svg>
          </div>
        </div>
      </div>

      <div className="av-bar">
        <button className="av-replay" onClick={() => { reset(); setRun((r) => r + 1); }}>↻ Xem lại hiệu ứng</button>
        <span className="av-note">Biến thể Astrolabe 3D · CSS 3D thuần (preserve-3d / translateZ / tilt theo con trỏ) · prefers-reduced-motion: phẳng &amp; tĩnh · /hero-lab (noindex)</span>
      </div>
    </main>
  );
}

const CSS = `
.av { font-family: 'Newsreader', Georgia, serif; overflow-x: hidden; }
.av-wrap { max-width: 1180px; margin: 0 auto; padding: 88px 56px 24px; display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 40px; align-items: center; }
@media (max-width: 880px) { .av-wrap { grid-template-columns: 1fr; padding: 48px 24px 8px; } .av-scene { order: -1; } }

.av-eyebrow { font-family: 'JetBrains Mono', monospace; letter-spacing: .24em; font-size: 12px; color: ${SOFT}; }
.av-h1 { font-size: clamp(2.7rem, 6.2vw, 5.2rem); line-height: .98; margin: .35em 0 .5em; font-weight: 400; letter-spacing: -0.02em; }
.av-line { display: block; }
.av-l2 { color: ${OCHRE}; font-style: italic; }
.av-deck { max-width: 30em; font-size: 1.06rem; line-height: 1.58; color: ${INK}; opacity: .82; }

/* perspective sống ở scene; stage là khối 3D nghiêng */
.av-scene { perspective: 1000px; perspective-origin: 50% 45%; display: grid; place-items: center; }
.av-stage {
  position: relative;
  width: min(440px, 82vw);
  aspect-ratio: 1 / 1;
  transform-style: preserve-3d;
  transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
  transition: transform .5s cubic-bezier(.2,.7,.2,1);
  will-change: transform;
}

/* Mỗi lớp xếp chồng tuyệt đối; translateZ tạo chiều sâu, --z*--px/--py tạo parallax.
   Lớp --z lớn (gần) dịch nhiều hơn lớp --z nhỏ (xa) → cảm giác 3D thật. */
.av-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: translate3d(
    calc(var(--z, 0px) * var(--px, 0) * 0.16),
    calc(var(--z, 0px) * var(--py, 0) * 0.16),
    var(--z, 0px)
  );
  transform-style: preserve-3d;
}

/* Bóng đổ mềm, rất nhẹ — giữ shadow tối thiểu của brand. Nằm dưới đáy khối. */
.av-shadow {
  position: absolute;
  left: 12%; right: 12%;
  bottom: -6%;
  height: 9%;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(23,20,17,.16), rgba(23,20,17,0) 70%);
  transform: translateZ(-30px);
  filter: blur(2px);
}

/* Defaults = trạng thái cuối (reduced-motion / no-JS safe, LCP-safe: không ẩn nội dung) */
.av-draw { stroke-dasharray: 1; stroke-dashoffset: 0; }
.av-star, .av-label, .av-center, .av-menh { opacity: 1; }
.av-star, .av-breathe, .av-halo { transform-box: fill-box; transform-origin: center; }

@media (prefers-reduced-motion: no-preference) {
  .av-draw { animation: avDraw 1.25s ease both var(--d, 0s); }
  .av-star { animation: avPop .5s ease both var(--d, 0s); }
  .av-menh { animation: avFill .9s ease 1.1s both; }
  .av-label { animation: avFade .8s ease both var(--d, 0s); }
  .av-center { animation: avFade 1s ease 1.4s both; }
  .av-breathe { animation: avBreathe 5s ease-in-out 2s infinite; }
  .av-halo { animation: avHalo 6s ease-in-out 2.2s infinite; }
  .av-spin { transform-box: fill-box; transform-origin: center; animation: avSpin 220s linear 2s infinite; }
  .av-spin-slow { animation: avSpin 320s linear reverse 2s infinite; }
  .av-l1 { clip-path: inset(0 100% 0 0); animation: avInk .85s cubic-bezier(.2,.7,.2,1) .15s both; }
  .av-l2 { clip-path: inset(0 100% 0 0); animation: avInk .9s cubic-bezier(.2,.7,.2,1) .5s both; }
  .av-eyebrow { animation: avFade .8s ease both; }
  .av-deck { animation: avFade 1s ease 1s both; }
}

/* reduced-motion: khoá phẳng, không nghiêng, không parallax */
@media (prefers-reduced-motion: reduce) {
  .av-stage { transform: none !important; transition: none; }
  .av-layer { transform: translateZ(var(--z, 0px)); }
}

/* Cảm ứng / mobile: tắt tilt + parallax theo con trỏ, GIỮ chiều sâu tĩnh.
   (translateZ vẫn còn → vẫn thấy lớp lang, nhưng không lệ thuộc con trỏ.) */
@media (hover: none), (pointer: coarse) {
  .av-stage { transform: rotateX(6deg); }
  .av-layer { transform: translateZ(var(--z, 0px)); }
}

@keyframes avDraw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes avPop { from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); } }
@keyframes avFill { from { fill-opacity: 0; } to { fill-opacity: .16; } }
@keyframes avFade { from { opacity: 0; } to { opacity: 1; } }
@keyframes avInk { to { clip-path: inset(0 0 0 0); } }
@keyframes avBreathe { 0%,100% { opacity: .45; transform: scale(1); } 50% { opacity: 1; transform: scale(1.7); } }
@keyframes avHalo { 0%,100% { opacity: .2; transform: scale(.94); } 50% { opacity: .5; transform: scale(1.06); } }
@keyframes avSpin { to { transform: rotate(360deg); } }

.av-bar { max-width: 1180px; margin: 0 auto; padding: 8px 56px 48px; display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
@media (max-width: 880px) { .av-bar { padding: 8px 24px 40px; } }
.av-replay { font-family: 'JetBrains Mono', monospace; font-size: 13px; border: 1px solid ${OCHRE}; color: ${OCHRE}; background: transparent; padding: 9px 16px; border-radius: 4px; cursor: pointer; }
.av-replay:hover { background: rgba(164,117,50,.08); }
.av-note { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${SOFT}; }
`;
