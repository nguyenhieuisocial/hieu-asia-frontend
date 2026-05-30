'use client';

import * as React from 'react';

/**
 * InkHero — DEMO "Mực sống" (Đợt 1, bản ĐỘNG) cho hieu.asia.
 *
 * Phát triển TỪ giao diện hiện tại (giấy + mực + ochre, Newsreader). Lá số KHÔNG còn là ảnh
 * tĩnh: sau khi tự vẽ bằng mực, nó SỐNG & tự chuyển động liên tục (SVG/CSS thuần):
 *   • vòng tick XOAY chậm (cơ chế thiên bàn) + 1 KIM QUÉT (astrolabe) quay quanh tâm
 *   • 3 sao bay theo QUỸ ĐẠO, sao rải LẤP LÁNH, SÓNG SÁNG chạy vòng quanh 12 cung
 *   • toàn chart TRÔI nhẹ + cung Mệnh THỞ
 * Tương tác: nghiêng theo chuột · hover cung hé nghĩa · CTA loang mực · con trỏ ngòi bút.
 *
 * Không ảnh, không WebGL. LCP-safe. prefers-reduced-motion → tĩnh đẹp (mọi chuyển động tắt).
 * Toạ độ làm tròn để SSR/client khớp.
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

const SPOKES = Array.from({ length: 12 }, (_, k) => {
  const [x1, y1] = P(RI, -105 + 30 * k);
  const [x2, y2] = P(RO, -105 + 30 * k);
  return { x1, y1, x2, y2, delay: 0.55 + k * 0.045 };
});
const TICKS = Array.from({ length: 24 }, (_, k) => {
  const inner = k % 3 === 0 ? 159 : 170; // bất đối xứng → thấy được khi xoay
  const [x1, y1] = P(inner, 15 * k);
  const [x2, y2] = P(RO, 15 * k);
  return { x1, y1, x2, y2, long: k % 3 === 0 };
});
// sao rải trong vòng (lấp lánh)
const STARS = ([
  [150, 84], [262, 96], [322, 158], [330, 236], [288, 308],
  [206, 338], [120, 300], [82, 214], [104, 140], [232, 152], [168, 250],
] as const).map(([x, y], i) => ({ x, y, ochre: i % 3 === 0, d: 1.15 + i * 0.05, tw: 3 + (i % 5) }));
// quỹ đạo: sao bay quanh tâm (đặt ở bán kính r trên trục đứng, group xoay quanh tâm)
const ORBITS = [
  { r: 134, dur: 14, rev: false, ochre: true, size: 3.4 },
  { r: 110, dur: 20, rev: true, ochre: true, size: 2.8 },
  { r: 152, dur: 10, rev: false, ochre: false, size: 2.4 },
  { r: 88, dur: 17, rev: true, ochre: true, size: 2.4 },
];

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

const cssVar = (d: number, extra?: Record<string, string | number>) =>
  ({ ['--d']: `${d}s`, ...extra } as React.CSSProperties);

const WORDS = ['mình.', 'đời mình.', 'con đường.', 'tương lai.', 'hướng đi.'];

export function InkHero(): React.JSX.Element {
  const [run, setRun] = React.useState(0);
  const [hover, setHover] = React.useState<number | null>(null);
  const wrap = React.useRef<HTMLDivElement>(null);

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

  // Kim quét quay MƯỢT (rAF) + trỏ theo chuột khi hover (đường ngắn). Cung kim đang chỉ = cung "đọc".
  const [active, setActive] = React.useState(0);
  const hoverRef = React.useRef<number | null>(null);
  const sweepEl = React.useRef<SVGGElement>(null);
  React.useEffect(() => { hoverRef.current = hover; }, [hover]);
  React.useEffect(() => {
    const reduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = sweepEl.current;
    if (reduce) { if (el) el.style.transform = 'rotate(0deg)'; setActive(0); return; }
    let cur = 0, tgt = 0, lastA = -1, raf = 0;
    let last = performance.now();
    const SPEED = 360 / 31; // ~31s/vòng → ~2.6s mỗi cung
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      const h = hoverRef.current;
      if (h != null) {
        const base = 30 * h;
        tgt = base + 360 * Math.round((cur - base) / 360); // cung gần nhất → quay đường ngắn tới chuột
      } else {
        tgt += SPEED * dt; // quay đều liên tục
      }
      cur += (tgt - cur) * (h != null ? Math.min(1, dt * 30) : Math.min(1, dt * 8)); // hover: bám gần tức thì; auto: mượt
      if (el) el.style.transform = `rotate(${cur.toFixed(2)}deg)`;
      const a = (((Math.round(cur / 30) % 12) + 12) % 12);
      if (a !== lastA) { lastA = a; setActive(a); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [run]);
  const cung = hover != null ? hover : active;
  const cur = CUNG[cung] ?? CUNG[0]!;

  // Từ cuối "Quyết định ___" đổi liên tục (độc lập với dial).
  const [wordIdx, setWordIdx] = React.useState(0);
  React.useEffect(() => {
    const reduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const id = window.setInterval(() => setWordIdx((w) => (w + 1) % WORDS.length), 2800);
    return () => window.clearInterval(id);
  }, [run]);

  return (
    <main className="ih" style={{ background: PAPER, color: INK, minHeight: '100vh', position: 'relative' }}>
      <style>{CSS}</style>
      <div className="ih-grain" aria-hidden="true" />

      <div className="ih-wrap" key={run}>
        <div className="ih-copy">
          <p className="ih-eyebrow"><span className="ih-livedot" aria-hidden="true" />CẨM NANG QUYẾT ĐỊNH BẰNG AI</p>
          <h1 className="ih-h1">
            <span className="ih-line ih-l1">Hiểu mình.</span>
            <span className="ih-line ih-l2">Quyết định <span key={wordIdx} className="ih-rot">{WORDS[wordIdx] ?? 'mình.'}</span></span>
          </h1>
          <p className="ih-deck">
            Mỗi khi bạn đứng trước một quyết định quan trọng, hieu.asia cho bạn một góc nhìn
            sâu hơn — bằng tri thức cổ học Á Đông, được AI giải mã rõ ràng, để bạn tự chọn con đường.
          </p>
          <p className="ih-soi">
            <span key={cung} className="ih-soi-in">✦ đang soi · <b className="ih-soi-n">{cur.n}</b> · {cur.dm}</span>
          </p>
          <div className="ih-cta-row">
            <a className="ih-cta ih-cta-primary" href="#"><span className="ih-cta-num">①</span>Tôi đang phân vân một quyết định</a>
            <a className="ih-cta ih-cta-ghost" href="#"><span className="ih-cta-num">②</span>Tôi muốn xem nhanh <span className="ih-cta-sub">(Tử Vi 2026 · Hợp tuổi)</span></a>
          </div>
          <p className="ih-micro">MIỄN PHÍ · KHÔNG CẦN THẺ · 1 PHÚT</p>
        </div>

        <div className="ih-chart-wrap" ref={wrap} onPointerMove={onMove} onPointerLeave={resetTilt}>
          <div className="ih-float">
            <svg viewBox="0 0 400 400" className="ih-chart" role="img" aria-label="Lá số 12 cung sống (minh hoạ)">
              <circle className="ih-draw" pathLength={1} cx={C} cy={C} r={RO} fill="none" stroke={INK} strokeWidth={1.1} style={cssVar(0.2)} />
              <circle className="ih-draw" pathLength={1} cx={C} cy={C} r={RI} fill="none" stroke={INK} strokeWidth={1} style={cssVar(0.45)} />

              {/* vòng tick xoay chậm */}
              <g className="ih-spin">
                {TICKS.map((t, i) => (
                  <line key={`t${i}`} className="ih-draw" pathLength={1} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={SOFT} strokeWidth={0.8} style={cssVar(0.3)} />
                ))}
              </g>

              {/* kim quét astrolabe — trỏ tới cung đang đọc */}
              <g className="ih-sweep" ref={sweepEl}>
                <line x1={C} y1={C} x2={C} y2={24} stroke={OCHRE} strokeWidth={1.5} strokeLinecap="round" />
                <circle cx={C} cy={24} r={3.4} fill={OCHRE} />
              </g>

              {SPOKES.map((s, i) => (
                <line key={`s${i}`} className="ih-draw" pathLength={1} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={INK} strokeWidth={0.7} style={cssVar(s.delay)} />
              ))}

              {/* sóng sáng chạy quanh 12 cung (lớp riêng, không chặn hover) */}
              <g className="ih-glow" aria-hidden="true" pointerEvents="none">
                {CUNG.map((c, i) => (
                  <path key={`g${i}`} className="ih-glowwedge" d={c.d} fill={OCHRE} style={{ ['--i']: i } as React.CSSProperties} />
                ))}
              </g>

              {/* 12 cung — hover được */}
              {CUNG.map((c, i) => (
                <path
                  key={`w${i}`}
                  className={`ih-wedge${cung === i ? ' ih-won' : ''}`}
                  d={c.d}
                  fill={OCHRE}
                  onMouseEnter={() => { hoverRef.current = i; setHover(i); }}
                  onMouseLeave={() => { hoverRef.current = null; setHover((h) => (h === i ? null : h)); }}
                />
              ))}
              {CUNG.map((c, i) => (
                <text key={`l${i}`} className={`ih-wlabel${cung === i ? ' ih-lon' : ''}`} x={c.lx} y={c.ly} fontSize={8.5} textAnchor="middle" dominantBaseline="middle">{c.n}</text>
              ))}

              {/* sao lấp lánh */}
              {STARS.map((s, i) => (
                <circle key={`st${i}`} className="ih-star" cx={s.x} cy={s.y} r={1.7} fill={s.ochre ? OCHRE : INK} style={cssVar(s.d, { ['--tw']: `${s.tw}s` })} />
              ))}

              {/* sao bay theo quỹ đạo */}
              {ORBITS.map((o, i) => (
                <g key={`o${i}`} className={`ih-orbit${o.rev ? ' ih-rev' : ''}`} style={{ ['--dur']: `${o.dur}s` } as React.CSSProperties}>
                  <circle cx={C} cy={C - o.r} r={o.size} fill={o.ochre ? OCHRE : SOFT} />
                </g>
              ))}

              <circle className="ih-breathe" cx={C} cy={C} r={3} fill={OCHRE} />
              <text className="ih-center" x={C} y={C + 5} fill={INK} fontSize={12.5} letterSpacing={1.5} textAnchor="middle">{cur.n.toUpperCase()}</text>
            </svg>
          </div>

          <p className="ih-annot" aria-live="polite">
            <span key={cung} className="ih-annot-line">
              <span className="ih-annot-n">{cur.n}</span> · <span className="ih-annot-d">{cur.dm}</span> — {cur.b}
            </span>
          </p>
        </div>
      </div>

      <div className="ih-bar">
        <button className="ih-replay" onClick={() => { resetTilt(); setRun((r) => r + 1); }}>↻ Xem lại hiệu ứng</button>
        <span className="ih-note">Demo "Mực sống" · lá số TỰ ĐỌC lần lượt 12 cung (kim quét trỏ + tâm + ý nghĩa đổi theo) · chạm để giữ · SVG/CSS thuần</span>
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
@media (prefers-reduced-motion: no-preference) { .ih-grain::after { animation: ihStain 80s ease-in-out infinite alternate; } }

.ih-wrap { position: relative; z-index: 2; max-width: 1180px; margin: 0 auto; padding: 88px 56px 24px; display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 40px; align-items: center; }
@media (max-width: 880px) { .ih-wrap { grid-template-columns: 1fr; padding: 48px 24px 8px; } .ih-chart-wrap { order: -1; } }

.ih-eyebrow { font-family: 'JetBrains Mono', monospace; letter-spacing: .24em; font-size: 12px; color: ${SOFT}; margin: 0; }
.ih-livedot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${OCHRE}; margin-right: 9px; vertical-align: middle; }
.ih-h1 { font-size: clamp(2.7rem, 6.2vw, 5.2rem); line-height: .98; margin: .35em 0 .5em; font-weight: 400; letter-spacing: -.02em; }
.ih-line { display: block; }
.ih-l2 { color: ${OCHRE}; font-style: italic; }
.ih-rot { display: inline-block; background-image: linear-gradient(${OCHRE}, ${OCHRE}); background-repeat: no-repeat; background-position: 0 96%; background-size: 100% 2px; }
.ih-deck { max-width: 30em; font-size: 1.06rem; line-height: 1.58; color: ${INK}; opacity: .82; }
.ih-soi { margin: 1.1em 0 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: .03em; color: ${SOFT}; min-height: 1.3em; }
.ih-soi-in { display: inline-block; animation: ihAnnotFade .5s ease both; }
.ih-soi-n { color: ${OCHRE}; font-weight: 500; }

.ih-cta-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 2em; }
.ih-cta { position: relative; overflow: hidden; display: inline-flex; align-items: center; gap: .5em; border-radius: 2px; padding: 14px 24px; font-size: 1rem; text-decoration: none; }
.ih-cta::before { content: ''; position: absolute; left: 50%; top: 50%; width: 8px; height: 8px; border-radius: 50%; background: radial-gradient(circle, rgba(23,20,17,.4), rgba(23,20,17,0) 70%); transform: translate(-50%,-50%) scale(0); transition: transform .55s cubic-bezier(.2,.7,.2,1); }
.ih-cta:hover::before { transform: translate(-50%,-50%) scale(34); }
.ih-cta-primary { background: ${OCHRE}; color: ${PAPER}; }
.ih-cta-ghost { border: 1px solid rgba(164,117,50,.35); color: ${INK}; }
.ih-cta-ghost::before { background: radial-gradient(circle, rgba(164,117,50,.5), rgba(164,117,50,0) 70%); }
.ih-cta > * { position: relative; z-index: 1; }
.ih-cta-sub { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${SOFT}; }
.ih-cta-num { font-family: 'JetBrains Mono', monospace; margin-right: .6em; opacity: .85; }
.ih-micro { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .16em; color: ${SOFT}; margin-top: 1.6em; }

.ih-chart-wrap { perspective: 1100px; display: grid; place-items: center; gap: 14px; }
.ih-float { transform-style: preserve-3d; }
.ih-chart { width: min(440px, 82vw); height: auto; transform: rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)); transition: transform .45s ease-out; }

/* defaults = trạng thái cuối (reduced-motion / no-JS) */
.ih-draw { stroke-dasharray: 1; stroke-dashoffset: 0; }
.ih-wedge { fill-opacity: 0; cursor: pointer; pointer-events: all; transition: fill-opacity .35s ease; }
.ih-wedge.ih-menh { fill-opacity: .08; }
.ih-wedge:hover, .ih-wedge.ih-won { fill-opacity: .28; }
.ih-glowwedge { fill-opacity: 0; }
.ih-wlabel { fill: ${INK}; font-family: 'JetBrains Mono', monospace; letter-spacing: .04em; opacity: 0; transition: opacity .3s ease; pointer-events: none; }
.ih-wlabel.ih-lon { opacity: .9; }
.ih-center, .ih-l1, .ih-l2 { opacity: 1; }
.ih-star, .ih-breathe { transform-box: fill-box; transform-origin: center; pointer-events: none; }
/* nhóm xoay quanh tâm 200,200 */
.ih-spin, .ih-sweep, .ih-orbit { transform-box: view-box; transform-origin: 200px 200px; pointer-events: none; }
.ih-center { pointer-events: none; }
.ih-sweep { opacity: 0; }

@media (prefers-reduced-motion: no-preference) {
  .ih-draw { animation: ihDraw 1.25s ease both var(--d, 0s); }
  .ih-l1 { clip-path: inset(0 100% 0 0); animation: ihInk .85s cubic-bezier(.2,.7,.2,1) .15s both; }
  .ih-l2 { clip-path: inset(0 100% 0 0); animation: ihInk .9s cubic-bezier(.2,.7,.2,1) .5s both; }
  .ih-eyebrow { animation: ihFade .8s ease both; }
  .ih-deck { animation: ihFade 1s ease .9s both; }
  .ih-cta-row { animation: ihFade 1s ease 1.1s both; }
  .ih-livedot { animation: ihPulse 1.8s ease-in-out 1.4s infinite; }
  .ih-rot { background-size: 0% 2px; animation: ihRotIn .55s cubic-bezier(.2,.7,.2,1) both, ihUnderline .7s cubic-bezier(.2,.7,.2,1) .12s both; }

  /* CHUYỂN ĐỘNG LIÊN TỤC — vào sớm (~1.4s), RÕ & nhanh hơn hẳn */
  .ih-spin { animation: ihSpin 50s linear 1.4s infinite; }
  .ih-sweep { animation: ihFade 1s ease 1.4s forwards; opacity: .55; }
  .ih-orbit { opacity: 0; animation: ihFade 1.1s ease 1.4s forwards, ihSpin var(--dur, 16s) linear 1.4s infinite; }
  .ih-orbit.ih-rev { animation: ihFade 1.1s ease 1.4s forwards, ihSpin var(--dur, 16s) linear 1.4s infinite reverse; }
  .ih-breathe { animation: ihBreathe 4.2s ease-in-out 1.4s infinite; }
  .ih-center { animation: ihFade 1s ease 1.3s both; }
  .ih-star { animation: ihPop .5s ease both var(--d,0s), ihTwinkle var(--tw, 4s) ease-in-out 1.4s infinite; }
  .ih-glowwedge { animation: ihFlow 6s linear infinite; animation-delay: calc(var(--i) * -0.5s + 1.4s); }
  .ih-float { animation: ihFloat 6.5s ease-in-out 1.4s infinite; }
}
@keyframes ihDraw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes ihInk { to { clip-path: inset(0 0 0 0); } }
@keyframes ihFade { from { opacity: 0; } to { opacity: 1; } }
@keyframes ihPop { from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); } }
@keyframes ihBreathe { 0%,100% { opacity: .45; transform: scale(1); } 50% { opacity: 1; transform: scale(1.7); } }
@keyframes ihSpin { to { transform: rotate(360deg); } }
@keyframes ihTwinkle { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
@keyframes ihFlow { 0% { fill-opacity: 0; } 5% { fill-opacity: .3; } 17% { fill-opacity: 0; } 100% { fill-opacity: 0; } }
@keyframes ihFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@keyframes ihStain { from { transform: translate(0,0); } to { transform: translate(8%, 6%); } }
@keyframes ihPulse { 0%,100% { opacity: .35; transform: scale(.8); } 50% { opacity: 1; transform: scale(1.15); } }
@keyframes ihUnderline { to { background-size: 100% 2px; } }
@keyframes ihRotIn { from { opacity: 0; transform: translateY(.5em); } to { opacity: 1; transform: translateY(0); } }

.ih-annot { min-height: 1.4em; margin: 0; text-align: center; font-size: .98rem; color: ${INK}; max-width: 30em; }
.ih-annot-line { display: inline-block; animation: ihAnnotFade .5s ease both; }
@keyframes ihAnnotFade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
.ih-annot-n { color: ${OCHRE}; font-style: italic; }
.ih-annot-d { font-family: 'JetBrains Mono', monospace; font-size: .8em; color: ${SOFT}; letter-spacing: .02em; }
.ih-annot-hint { color: ${SOFT}; font-family: 'JetBrains Mono', monospace; font-size: .8rem; letter-spacing: .04em; }

.ih-bar { position: relative; z-index: 2; max-width: 1180px; margin: 0 auto; padding: 8px 56px 48px; display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
@media (max-width: 880px) { .ih-bar { padding: 8px 24px 40px; } }
.ih-replay { font-family: 'JetBrains Mono', monospace; font-size: 13px; border: 1px solid ${OCHRE}; color: ${OCHRE}; background: transparent; padding: 9px 16px; border-radius: 4px; cursor: pointer; }
.ih-replay:hover { background: rgba(164,117,50,.08); }
.ih-note { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${SOFT}; }
`;
