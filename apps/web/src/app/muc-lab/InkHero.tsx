'use client';

import * as React from 'react';

/**
 * InkHero — DEMO "Mực sống" (Đợt 1 gộp) cho hieu.asia.
 *
 * Phát triển TỪ giao diện hiện tại (editorial giấy + mực + ochre, Newsreader) — gộp các
 * micro-interaction, kích hoạt ở những KHOẢNH KHẮC khác nhau nên không rối:
 *   • Vào trang: giấy sống (grain + vệt mực trôi) + LÁ SỐ tự vẽ bằng mực + TIÊU ĐỀ mực-loang
 *   • Đứng yên : cung Mệnh THỞ + lá số NGHIÊNG theo chuột + con trỏ NGÒI BÚT (vệt mực)
 *   • Hover    : chạm CUNG → hé tên + nghĩa · hover CTA → LOANG chấm mực
 *
 * Pure SVG + CSS (nhẹ, nạp nhanh). LCP-safe (chữ render sẵn). prefers-reduced-motion: tĩnh, đẹp.
 * Toạ độ làm tròn để SSR/client khớp (tránh hydration mismatch).
 */

const INK = '#171411';
const OCHRE = '#A47532';
const PAPER = '#F3ECDD';
const SOFT = '#6B6358';
const C = 200, RO = 180, RI = 95;

const R2 = (n: number): number => Math.round(n * 100) / 100;
const P = (r: number, deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [R2(C + r * Math.cos(a)), R2(C + r * Math.sin(a))];
};

// 12 nan (ranh giới cung) tại -105 + 30k, từ vòng trong → ngoài.
const SPOKES = Array.from({ length: 12 }, (_, k) => {
  const [x1, y1] = P(RI, -105 + 30 * k);
  const [x2, y2] = P(RO, -105 + 30 * k);
  return { x1, y1, x2, y2, delay: 0.55 + k * 0.045 };
});
// 24 tick ngoài.
const TICKS = Array.from({ length: 24 }, (_, k) => {
  const [x1, y1] = P(169, 15 * k);
  const [x2, y2] = P(RO, 15 * k);
  return { x1, y1, x2, y2 };
});
// 12 cung: annular sector (hover được) + vị trí nhãn.
type Cung = { d: string; lx: number; ly: number; n: string; dm: string; b: string };
const CUNG_META: Array<{ n: string; dm: string; b: string }> = [
  { n: 'Mệnh', dm: 'con người bạn', b: 'Cốt cách & cách bạn phản ứng trước áp lực.' },
  { n: 'Phụ Mẫu', dm: 'cha mẹ · cội nguồn', b: 'Liên hệ với cha mẹ, nền tảng gia đình.' },
  { n: 'Phúc Đức', dm: 'phúc phần', b: 'Phúc khí tích luỹ, sự an yên trong tâm.' },
  { n: 'Điền Trạch', dm: 'nhà cửa · đất đai', b: 'Tài sản, nhà đất, tích sản của bạn.' },
  { n: 'Quan Lộc', dm: 'sự nghiệp', b: 'Thiên hướng nghề nghiệp & ngã rẽ công danh.' },
  { n: 'Nô Bộc', dm: 'bạn bè · đối tác', b: 'Đồng nghiệp, đối tác — ai nâng, ai cản.' },
  { n: 'Thiên Di', dm: 'di chuyển · cơ hội', b: 'Dịch chuyển, cơ hội xa nhà.' },
  { n: 'Tật Ách', dm: 'sức khoẻ', b: 'Thể trạng & điểm cần giữ gìn.' },
  { n: 'Tài Bạch', dm: 'tiền bạc', b: 'Dòng tiền — khi nào nên liều, khi nào nên thủ.' },
  { n: 'Tử Tức', dm: 'con cái', b: 'Đường con cái, điều bạn truyền lại.' },
  { n: 'Phu Thê', dm: 'hôn nhân', b: 'Cách bạn yêu & điều cần ở bạn đời.' },
  { n: 'Huynh Đệ', dm: 'anh em', b: 'Anh chị em, bằng hữu sát cánh.' },
];
const CUNG: Cung[] = CUNG_META.map((m, i) => {
  const a0 = -105 + 30 * i, a1 = -75 + 30 * i;
  const [ox0, oy0] = P(RO, a0), [ox1, oy1] = P(RO, a1);
  const [ix1, iy1] = P(RI, a1), [ix0, iy0] = P(RI, a0);
  const [lx, ly] = P((RO + RI) / 2, (a0 + a1) / 2);
  return {
    d: `M${ox0} ${oy0} A${RO} ${RO} 0 0 1 ${ox1} ${oy1} L${ix1} ${iy1} A${RI} ${RI} 0 0 0 ${ix0} ${iy0} Z`,
    lx, ly, ...m,
  };
});

const cssVar = (d: number) => ({ ['--d']: `${d}s` } as React.CSSProperties);

export function InkHero(): React.JSX.Element {
  const [run, setRun] = React.useState(0);
  const [hover, setHover] = React.useState<number | null>(null);
  const wrap = React.useRef<HTMLDivElement>(null);
  const trail = React.useRef<HTMLCanvasElement>(null);

  // Nghiêng theo chuột (chỉ chuột thật)
  const onMove = (e: React.PointerEvent) => {
    const el = wrap.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--rx', `${(-((e.clientY - r.top) / r.height - 0.5) * 5).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width - 0.5) * 6).toFixed(2)}deg`);
  };
  const resetTilt = () => {
    const el = wrap.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  // Con trỏ = ngòi bút: vệt mực mờ tan dần trên canvas phủ hero
  React.useEffect(() => {
    const cv = trail.current;
    if (!cv) return;
    const reduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    type Dot = { x: number; y: number; life: number };
    let dots: Dot[] = [];
    let raf = 0;
    const resize = () => {
      const r = cv.getBoundingClientRect();
      cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(cv);
    let lastX = 0, lastY = 0;
    const onPt = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const r = cv.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (Math.hypot(x - lastX, y - lastY) > 5) { dots.push({ x, y, life: 1 }); lastX = x; lastY = y; }
      if (dots.length > 40) dots = dots.slice(-40);
    };
    const loop = () => {
      const r = cv.getBoundingClientRect();
      ctx.clearRect(0, 0, r.width, r.height);
      for (const d of dots) {
        d.life -= 0.045;
        if (d.life <= 0) continue;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 2.6 * d.life + 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(23,20,17,${(0.16 * d.life).toFixed(3)})`;
        ctx.fill();
      }
      dots = dots.filter((d) => d.life > 0);
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', onPt, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener('pointermove', onPt); cancelAnimationFrame(raf); ro.disconnect(); };
  }, [run]);

  const cur = hover != null ? CUNG[hover] : null;

  return (
    <main className="ih" style={{ background: PAPER, color: INK, minHeight: '100vh', position: 'relative' }}>
      <style>{CSS}</style>
      <div className="ih-grain" aria-hidden="true" />
      <canvas className="ih-trail" ref={trail} aria-hidden="true" />

      <div className="ih-wrap" key={run}>
        {/* Cột chữ */}
        <div className="ih-copy">
          <p className="ih-eyebrow">CẨM NANG QUYẾT ĐỊNH BẰNG AI</p>
          <h1 className="ih-h1">
            <span className="ih-line ih-l1">Hiểu mình.</span>
            <span className="ih-line ih-l2">Quyết định mình.</span>
          </h1>
          <p className="ih-deck">
            Mỗi khi bạn đứng trước một quyết định quan trọng, hieu.asia cho bạn một góc nhìn
            sâu hơn — bằng tri thức cổ học Á Đông, được AI giải mã rõ ràng, để bạn tự chọn con đường.
          </p>
          <div className="ih-cta-row">
            <a className="ih-cta ih-cta-primary" href="#">Tôi đang phân vân một quyết định</a>
            <a className="ih-cta ih-cta-ghost" href="#">Tôi muốn xem nhanh <span className="ih-cta-sub">(Tử Vi 2026 · Hợp tuổi)</span></a>
          </div>
          <p className="ih-micro">MIỄN PHÍ · KHÔNG CẦN THẺ · 1 PHÚT</p>
        </div>

        {/* Lá số */}
        <div className="ih-chart-wrap" ref={wrap} onPointerMove={onMove} onPointerLeave={resetTilt}>
          <svg viewBox="0 0 400 400" className="ih-chart" role="img" aria-label="Lá số 12 cung (minh hoạ)">
            {/* khung tự vẽ */}
            <circle className="ih-draw" pathLength={1} cx={C} cy={C} r={RO} fill="none" stroke={INK} strokeWidth={1.1} style={cssVar(0.2)} />
            <circle className="ih-draw" pathLength={1} cx={C} cy={C} r={RI} fill="none" stroke={INK} strokeWidth={1} style={cssVar(0.45)} />
            {TICKS.map((t, i) => (
              <line key={`t${i}`} className="ih-draw" pathLength={1} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={SOFT} strokeWidth={0.8} style={cssVar(0.3)} />
            ))}
            {SPOKES.map((s, i) => (
              <line key={`s${i}`} className="ih-draw" pathLength={1} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={INK} strokeWidth={0.7} style={cssVar(s.delay)} />
            ))}
            {/* 12 cung — hover được */}
            {CUNG.map((c, i) => (
              <path
                key={`w${i}`}
                className={`ih-wedge${hover === i ? ' ih-won' : ''}${i === 0 ? ' ih-menh' : ''}`}
                d={c.d}
                fill={OCHRE}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover((h) => (h === i ? null : h))}
              />
            ))}
            {/* nhãn cung khi hover */}
            {CUNG.map((c, i) => (
              <text key={`l${i}`} className={`ih-wlabel${hover === i ? ' ih-lon' : ''}`} x={c.lx} y={c.ly} fontSize={8.5} textAnchor="middle" dominantBaseline="middle">
                {c.n}
              </text>
            ))}
            {/* tâm Mệnh thở */}
            <circle className="ih-breathe" cx={C} cy={C} r={3} fill={OCHRE} />
            <text className="ih-center" x={C} y={C + 5} fill={INK} fontSize={14} letterSpacing={3} textAnchor="middle">MỆNH</text>
          </svg>

          {/* chú thích editorial */}
          <p className="ih-annot" aria-live="polite">
            {cur ? (
              <><span className="ih-annot-n">{cur.n}</span> · <span className="ih-annot-d">{cur.dm}</span> — {cur.b}</>
            ) : (
              <span className="ih-annot-hint">Lá số 12 cung · di chuột lên một cung để đọc ý nghĩa</span>
            )}
          </p>
        </div>
      </div>

      <div className="ih-bar">
        <button className="ih-replay" onClick={() => { resetTilt(); setRun((r) => r + 1); }}>↻ Xem lại hiệu ứng</button>
        <span className="ih-note">Demo "Mực sống" · giao diện editorial hiện tại + micro-interaction · SVG/CSS thuần · tôn trọng prefers-reduced-motion</span>
      </div>
    </main>
  );
}

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const CSS = `
.ih { font-family: 'Newsreader', Georgia, serif; overflow-x: hidden; }
.ih-grain { position: absolute; inset: 0; pointer-events: none; z-index: 0; opacity: .055; mix-blend-mode: multiply; background-image: ${NOISE}; }
.ih-grain::after { content: ''; position: absolute; inset: -20%; background: radial-gradient(40% 30% at 30% 40%, rgba(164,117,50,.06), transparent 70%); }
@media (prefers-reduced-motion: no-preference) {
  .ih-grain::after { animation: ihStain 80s ease-in-out infinite alternate; }
}
.ih-trail { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; }

.ih-wrap { position: relative; z-index: 2; max-width: 1180px; margin: 0 auto; padding: 88px 56px 24px; display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 40px; align-items: center; }
@media (max-width: 880px) { .ih-wrap { grid-template-columns: 1fr; padding: 48px 24px 8px; } .ih-chart-wrap { order: -1; } }

.ih-eyebrow { font-family: 'JetBrains Mono', monospace; letter-spacing: .24em; font-size: 12px; color: ${SOFT}; margin: 0; }
.ih-h1 { font-size: clamp(2.7rem, 6.2vw, 5.2rem); line-height: .98; margin: .35em 0 .5em; font-weight: 400; letter-spacing: -.02em; }
.ih-line { display: block; }
.ih-l2 { color: ${OCHRE}; font-style: italic; }
.ih-deck { max-width: 30em; font-size: 1.06rem; line-height: 1.58; color: ${INK}; opacity: .82; }

.ih-cta-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 2em; }
.ih-cta { position: relative; overflow: hidden; display: inline-flex; align-items: center; gap: .5em; border-radius: 2px; padding: 14px 24px; font-size: 1rem; text-decoration: none; transition: transform .2s ease; }
.ih-cta::before { content: ''; position: absolute; left: 50%; top: 50%; width: 8px; height: 8px; border-radius: 50%; background: radial-gradient(circle, rgba(164,117,50,.55), rgba(164,117,50,0) 70%); transform: translate(-50%,-50%) scale(0); transition: transform .55s cubic-bezier(.2,.7,.2,1); }
.ih-cta:hover::before { transform: translate(-50%,-50%) scale(34); }
.ih-cta-primary { background: ${OCHRE}; color: ${PAPER}; }
.ih-cta-primary::before { background: radial-gradient(circle, rgba(23,20,17,.4), rgba(23,20,17,0) 70%); }
.ih-cta-ghost { border: 1px solid rgba(164,117,50,.35); color: ${INK}; }
.ih-cta > * { position: relative; z-index: 1; }
.ih-cta-sub { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${SOFT}; }
.ih-micro { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .16em; color: ${SOFT}; margin-top: 1.6em; }

.ih-chart-wrap { perspective: 1100px; display: grid; place-items: center; gap: 14px; }
.ih-chart { width: min(440px, 82vw); height: auto; transform: rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)); transition: transform .45s ease-out; }

/* defaults = trạng thái cuối (reduced-motion / no-JS) */
.ih-draw { stroke-dasharray: 1; stroke-dashoffset: 0; }
.ih-wedge { fill-opacity: 0; stroke: ${OCHRE}; stroke-width: 0; cursor: pointer; transition: fill-opacity .35s ease; }
.ih-wedge.ih-menh { fill-opacity: .1; }
.ih-wedge:hover, .ih-wedge.ih-won { fill-opacity: .2; }
.ih-wlabel { fill: ${INK}; font-family: 'JetBrains Mono', monospace; letter-spacing: .04em; opacity: 0; transition: opacity .3s ease; pointer-events: none; }
.ih-wlabel.ih-lon { opacity: .9; }
.ih-center, .ih-l1, .ih-l2 { opacity: 1; }
.ih-breathe { transform-box: fill-box; transform-origin: center; }

@media (prefers-reduced-motion: no-preference) {
  .ih-draw { animation: ihDraw 1.25s ease both var(--d, 0s); }
  .ih-l1 { clip-path: inset(0 100% 0 0); animation: ihInk .85s cubic-bezier(.2,.7,.2,1) .15s both; }
  .ih-l2 { clip-path: inset(0 100% 0 0); animation: ihInk .9s cubic-bezier(.2,.7,.2,1) .5s both; }
  .ih-eyebrow { animation: ihFade .8s ease both; }
  .ih-deck { animation: ihFade 1s ease .9s both; }
  .ih-cta-row { animation: ihFade 1s ease 1.1s both; }
  .ih-breathe { animation: ihBreathe 5s ease-in-out 2s infinite; }
  .ih-center { animation: ihFade 1s ease 1.3s both; }
}
@keyframes ihDraw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes ihInk { to { clip-path: inset(0 0 0 0); } }
@keyframes ihFade { from { opacity: 0; } to { opacity: 1; } }
@keyframes ihBreathe { 0%,100% { opacity: .45; transform: scale(1); } 50% { opacity: 1; transform: scale(1.7); } }
@keyframes ihStain { from { transform: translate(0,0); } to { transform: translate(8%, 6%); } }

.ih-annot { min-height: 1.4em; margin: 0; text-align: center; font-size: .98rem; color: ${INK}; max-width: 30em; }
.ih-annot-n { color: ${OCHRE}; font-style: italic; }
.ih-annot-d { font-family: 'JetBrains Mono', monospace; font-size: .8em; color: ${SOFT}; letter-spacing: .02em; }
.ih-annot-hint { color: ${SOFT}; font-family: 'JetBrains Mono', monospace; font-size: .8rem; letter-spacing: .04em; }

.ih-bar { position: relative; z-index: 2; max-width: 1180px; margin: 0 auto; padding: 8px 56px 48px; display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
@media (max-width: 880px) { .ih-bar { padding: 8px 24px 40px; } }
.ih-replay { font-family: 'JetBrains Mono', monospace; font-size: 13px; border: 1px solid ${OCHRE}; color: ${OCHRE}; background: transparent; padding: 9px 16px; border-radius: 4px; cursor: pointer; }
.ih-replay:hover { background: rgba(164,117,50,.08); }
.ih-note { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${SOFT}; }
`;
