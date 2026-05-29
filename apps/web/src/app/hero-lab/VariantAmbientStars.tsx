'use client';

import * as React from 'react';

/**
 * PROTOTYPE concept "Lập lá số — Tinh vân khẽ thở".
 * Self-contained. KHÔNG import la-so-svg thật / components vùng cấm.
 * Lá số 12 cung tự vẽ (SVG + CSS) + một màn sao li ti trôi CỰC khẽ phía sau
 * (canvas 2D nhẹ) như bầu trời đêm vẽ trên giấy cũ. Thi thoảng 1 sao băng lướt qua.
 * Trầm, tiết chế — chấm mực/ochre mờ trên nền giấy sáng, KHÔNG nền đen sao neon.
 */

const INK = '#171411';
const OCHRE = '#A47532';
const PAPER = '#F3ECDD';
const SOFT = '#6B6358';

// Làm tròn toạ độ → SSR & client ra chuỗi giống hệt (tránh hydration mismatch do ULP của Math.cos/sin).
const R = (n: number) => Math.round(n * 100) / 100;

// 12 spoke boundaries → sector "Mệnh" centered at top (same geometry as P1).
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

// Star scatter inside the ring (the "named" stars on the chart itself).
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

type Star = {
  x: number; // 0..1 normalized
  y: number; // 0..1 normalized
  r: number; // base radius (css px)
  baseAlpha: number; // resting opacity
  twAmp: number; // twinkle amplitude
  twSpeed: number; // twinkle angular speed
  twPhase: number; // twinkle phase
  ochre: boolean; // ink vs ochre dot
  vx: number; // horizontal drift (normalized / sec)
  vy: number; // vertical drift (normalized / sec)
};

type Shooter = {
  active: boolean;
  x: number; // css px
  y: number; // css px
  vx: number; // css px / sec
  vy: number; // css px / sec
  life: number; // seconds elapsed
  ttl: number; // total seconds
  len: number; // trail length (css px)
};

// Parse "#rrggbb" → "r,g,b" for rgba() string building.
const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
};
const INK_RGB = rgb(INK);
const OCHRE_RGB = rgb(OCHRE);

/** The ambient night-sky canvas. Drawn behind the chart; never blocks LCP. */
function StarCanvas() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Cap DPR so retina screens don't pay for a 3x buffer on a faint backdrop.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    let stars: Star[] = [];
    const shooter: Shooter = { active: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, ttl: 0, len: 0 };

    const seedStars = () => {
      // Density scales with area; fewer on mobile. Hard cap ~60.
      const small = w < 760;
      const target = small ? 26 : 56;
      const count = Math.min(60, Math.max(18, Math.round((w * h) / (small ? 26000 : 21000))));
      const n = Math.min(target, count);
      stars = Array.from({ length: n }, () => {
        const ochre = Math.random() < 0.22;
        return {
          x: Math.random(),
          y: Math.random(),
          r: 0.6 + Math.random() * 1.15,
          // Faint on purpose: ink dots stay subtle on bright paper.
          baseAlpha: (ochre ? 0.1 : 0.08) + Math.random() * 0.1,
          twAmp: 0.02 + Math.random() * 0.05,
          twSpeed: 0.25 + Math.random() * 0.5,
          twPhase: Math.random() * Math.PI * 2,
          ochre,
          // Extremely slow drift: a few px over many seconds.
          vx: (Math.random() - 0.5) * 0.004,
          vy: (Math.random() - 0.5) * 0.0028,
        };
      });
    };

    const drawStar = (s: Star, alpha: number) => {
      const px = s.x * w;
      const py = s.y * h;
      ctx.beginPath();
      ctx.arc(px, py, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.ochre ? OCHRE_RGB : INK_RGB},${alpha.toFixed(3)})`;
      ctx.fill();
    };

    const drawStaticFrame = () => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) drawStar(s, s.baseAlpha);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedStars();
      // Redraw immediately so a resize never leaves a blank/stale backdrop.
      drawStaticFrame();
    };

    resize();

    // Reduced motion: draw once, statically, and stop. No rAF, no listeners churn.
    if (reduce) {
      let roTimer = 0;
      const ro = new ResizeObserver(() => {
        window.clearTimeout(roTimer);
        roTimer = window.setTimeout(resize, 120);
      });
      ro.observe(canvas);
      return () => {
        window.clearTimeout(roTimer);
        ro.disconnect();
      };
    }

    let raf = 0;
    let last = 0;
    let running = false;
    let inView = true;
    let visible = !document.hidden;
    let nextShooterAt = 6 + Math.random() * 8; // seconds until first shooting star
    let clock = 0;

    const spawnShooter = () => {
      // Lazy diagonal streak across the upper area, fading quickly.
      const fromLeft = Math.random() < 0.5;
      const startX = fromLeft ? -40 : w + 40;
      const startY = Math.random() * h * 0.45;
      const dir = fromLeft ? 1 : -1;
      const speed = 150 + Math.random() * 90; // css px/sec — unhurried
      shooter.active = true;
      shooter.x = startX;
      shooter.y = startY;
      shooter.vx = dir * speed;
      shooter.vy = speed * (0.28 + Math.random() * 0.18);
      shooter.life = 0;
      shooter.ttl = 1.5 + Math.random() * 0.8;
      shooter.len = 60 + Math.random() * 50;
    };

    const drawShooter = () => {
      const t = shooter.life / shooter.ttl;
      // Ease in/out so it appears and vanishes softly, never a harsh blink.
      const fade = Math.sin(Math.min(1, Math.max(0, t)) * Math.PI);
      const tailX = shooter.x - (shooter.vx / Math.hypot(shooter.vx, shooter.vy)) * shooter.len;
      const tailY = shooter.y - (shooter.vy / Math.hypot(shooter.vx, shooter.vy)) * shooter.len;
      const grad = ctx.createLinearGradient(shooter.x, shooter.y, tailX, tailY);
      grad.addColorStop(0, `rgba(${OCHRE_RGB},${(0.42 * fade).toFixed(3)})`);
      grad.addColorStop(1, `rgba(${OCHRE_RGB},0)`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.1;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(shooter.x, shooter.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();
      // tiny head
      ctx.beginPath();
      ctx.arc(shooter.x, shooter.y, 1.1, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${OCHRE_RGB},${(0.5 * fade).toFixed(3)})`;
      ctx.fill();
    };

    const frame = (ts: number) => {
      if (!running) return;
      if (!last) last = ts;
      let dt = (ts - last) / 1000;
      last = ts;
      // Clamp dt (tab refocus / long frame) so drift never jumps.
      if (dt > 0.05) dt = 0.05;
      clock += dt;

      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        // Gentle wrap-around drift.
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        if (s.x < -0.02) s.x += 1.04;
        else if (s.x > 1.02) s.x -= 1.04;
        if (s.y < -0.02) s.y += 1.04;
        else if (s.y > 1.02) s.y -= 1.04;

        const tw = Math.sin(clock * s.twSpeed + s.twPhase) * s.twAmp;
        drawStar(s, Math.max(0, s.baseAlpha + tw));
      }

      // Shooting star scheduling + render.
      if (!shooter.active && clock >= nextShooterAt) {
        spawnShooter();
      }
      if (shooter.active) {
        shooter.life += dt;
        shooter.x += shooter.vx * dt;
        shooter.y += shooter.vy * dt;
        if (shooter.life >= shooter.ttl) {
          shooter.active = false;
          nextShooterAt = clock + 9 + Math.random() * 12; // long, rare gaps
        } else {
          drawShooter();
        }
      }

      raf = window.requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || !inView || !visible) return;
      running = true;
      last = 0;
      raf = window.requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
    };

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) start();
      else stop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    // Pause when scrolled out of viewport.
    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true;
        if (inView) start();
        else stop();
      },
      { threshold: 0.01 },
    );
    io.observe(canvas);

    let roTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(roTimer);
      roTimer = window.setTimeout(resize, 120);
    });
    ro.observe(canvas);

    start();

    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
      io.disconnect();
      ro.disconnect();
      window.clearTimeout(roTimer);
    };
  }, []);

  return <canvas ref={canvasRef} className="hs-sky" aria-hidden="true" />;
}

export function VariantAmbientStars() {
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
    <main className="hs" style={{ background: PAPER, color: INK, minHeight: '100vh' }}>
      <style>{CSS}</style>

      {/* Ambient sky sits behind everything; content below is real DOM (LCP-safe). */}
      <StarCanvas />

      <div className="hs-wrap" key={run}>
        <div className="hs-copy">
          <p className="hs-eyebrow">CẨM NANG QUYẾT ĐỊNH BẰNG AI</p>
          <h1 className="hs-h1">
            <span className="hs-line hs-l1">Hiểu mình.</span>
            <span className="hs-line hs-l2">Quyết định mình.</span>
          </h1>
          <p className="hs-deck">
            Mỗi khi bạn đứng trước một quyết định quan trọng, hieu.asia cho bạn một
            góc nhìn sâu hơn — bằng tri thức cổ học Á Đông, được AI giải mã rõ ràng,
            và để bạn tự chọn con đường.
          </p>
        </div>

        <div className="hs-chart-wrap" ref={wrap} onPointerMove={onMove} onPointerLeave={reset}>
          <svg viewBox="0 0 400 400" className="hs-chart" role="img" aria-label="Lá số 12 cung (minh hoạ)">
            <circle className="hs-draw" pathLength={1} cx={200} cy={200} r={180} fill="none" stroke={INK} strokeWidth={1.1} style={cssVar(0.2)} />
            <g className="hs-spin">
              {TICKS.map((t, i) => (
                <line key={i} className="hs-draw" pathLength={1} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={SOFT} strokeWidth={0.8} style={cssVar(0.3)} />
              ))}
            </g>
            <circle className="hs-draw" pathLength={1} cx={200} cy={200} r={95} fill="none" stroke={INK} strokeWidth={1} style={cssVar(0.45)} />
            {SPOKES.map((s, i) => (
              <line key={i} className="hs-draw" pathLength={1} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={INK} strokeWidth={0.7} style={cssVar(s.delay)} />
            ))}
            <path className="hs-menh" d={MENH} fill={OCHRE} fillOpacity={0.14} stroke={OCHRE} strokeWidth={1.1} />
            {STARS.map((s, i) => (
              <circle key={i} className="hs-star" cx={s.x} cy={s.y} r={1.9} fill={s.ochre ? OCHRE : INK} style={cssVar(s.delay)} />
            ))}
            {LABELS.map((l, i) => (
              <text key={i} className="hs-label" x={l.x} y={l.y} fill={SOFT} fontSize={11} textAnchor="middle" style={cssVar(l.d)}>{l.t}</text>
            ))}
            <circle className="hs-breathe" cx={200} cy={200} r={3} fill={OCHRE} />
            <text className="hs-center" x={200} y={205} fill={INK} fontSize={15} letterSpacing={3} textAnchor="middle">MỆNH</text>
          </svg>
        </div>
      </div>

      <div className="hs-bar">
        <button className="hs-replay" onClick={() => { reset(); setRun((r) => r + 1); }}>↻ Xem lại hiệu ứng</button>
        <span className="hs-note">Prototype · Tinh vân khẽ thở · canvas 2D nhẹ + SVG/CSS · tôn trọng prefers-reduced-motion · /hero-lab (noindex)</span>
      </div>
    </main>
  );
}

const CSS = `
.hs { font-family: 'Newsreader', Georgia, serif; overflow-x: hidden; position: relative; }
.hs-sky { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
.hs-wrap { position: relative; z-index: 1; max-width: 1180px; margin: 0 auto; padding: 88px 56px 24px; display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 40px; align-items: center; }
@media (max-width: 880px) { .hs-wrap { grid-template-columns: 1fr; padding: 48px 24px 8px; } .hs-chart-wrap { order: -1; } }
.hs-eyebrow { font-family: 'JetBrains Mono', monospace; letter-spacing: .24em; font-size: 12px; color: ${SOFT}; }
.hs-h1 { font-size: clamp(2.7rem, 6.2vw, 5.2rem); line-height: .98; margin: .35em 0 .5em; font-weight: 400; letter-spacing: -0.02em; }
.hs-line { display: block; }
.hs-l2 { color: ${OCHRE}; font-style: italic; }
.hs-deck { max-width: 30em; font-size: 1.06rem; line-height: 1.58; color: ${INK}; opacity: .82; }
.hs-chart-wrap { perspective: 1100px; display: grid; place-items: center; }
.hs-chart { width: min(440px, 82vw); height: auto; transform: rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)); transition: transform .45s ease-out; }

/* Defaults = final state (reduced-motion / no-JS safe) */
.hs-draw { stroke-dasharray: 1; stroke-dashoffset: 0; }
.hs-star, .hs-label, .hs-center { opacity: 1; }
.hs-star, .hs-breathe { transform-box: fill-box; transform-origin: center; }

@media (prefers-reduced-motion: no-preference) {
  .hs-draw { animation: hsDraw 1.25s ease both var(--d, 0s); }
  .hs-star { animation: hsPop .5s ease both var(--d, 0s); }
  .hs-menh { animation: hsFill .9s ease 1.05s both; }
  .hs-label { animation: hsFade .8s ease both var(--d, 0s); }
  .hs-center { animation: hsFade 1s ease 1.35s both; }
  .hs-breathe { animation: hsBreathe 5s ease-in-out 2s infinite; }
  .hs-spin { transform-box: fill-box; transform-origin: center; animation: hsSpin 220s linear 2s infinite; }
  .hs-l1 { clip-path: inset(0 100% 0 0); animation: hsInk .85s cubic-bezier(.2,.7,.2,1) .15s both; }
  .hs-l2 { clip-path: inset(0 100% 0 0); animation: hsInk .9s cubic-bezier(.2,.7,.2,1) .5s both; }
  .hs-eyebrow { animation: hsFade .8s ease both; }
  .hs-deck { animation: hsFade 1s ease .95s both; }
}
@keyframes hsDraw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes hsPop { from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); } }
@keyframes hsFill { from { fill-opacity: 0; } to { fill-opacity: .14; } }
@keyframes hsFade { from { opacity: 0; } to { opacity: 1; } }
@keyframes hsInk { to { clip-path: inset(0 0 0 0); } }
@keyframes hsBreathe { 0%,100% { opacity: .45; transform: scale(1); } 50% { opacity: 1; transform: scale(1.7); } }
@keyframes hsSpin { to { transform: rotate(360deg); } }

.hs-bar { position: relative; z-index: 1; max-width: 1180px; margin: 0 auto; padding: 8px 56px 48px; display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
@media (max-width: 880px) { .hs-bar { padding: 8px 24px 40px; } }
.hs-replay { font-family: 'JetBrains Mono', monospace; font-size: 13px; border: 1px solid ${OCHRE}; color: ${OCHRE}; background: transparent; padding: 9px 16px; border-radius: 4px; cursor: pointer; }
.hs-replay:hover { background: rgba(164,117,50,.08); }
.hs-note { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${SOFT}; }
`;
