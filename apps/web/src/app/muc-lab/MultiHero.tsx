'use client';

import * as React from 'react';
import { FourLens } from './FourLens';

/**
 * MultiHero — hero "Bốn lăng kính (Tử Vi · Bát Tự · Thần Số · MBTI) → AI hợp nhất một bức tranh".
 * MOBILE-FIRST: base CSS = điện thoại; desktop là `@media (min-width:880px)` enhancement.
 * Thứ tự mobile: bối cảnh (eyebrow → headline → deck) → lăng kính tương tác → CTA chính.
 * Hội tụ → xoay vài "ví dụ" nhận định AI (biến lời hứa thành cụ thể, giọng phân tích, không bói).
 * Editorial giấy-mực-ochre, SVG/CSS thuần, prefers-reduced-motion-safe (SSR = hội tụ tĩnh).
 */

const INK = '#171411';
const OCHRE = '#A47532';
const PAPER = '#F3ECDD';
const SOFT = '#6B6358';

const SYSTEMS = [
  { n: 'Tử Vi', r: 'bản đồ ưu thế & vùng tối', full: 'Lá số 12 cung — ưu thế, vùng tối và thời vận của bạn.' },
  { n: 'Bát Tự', r: 'cân bằng ngũ hành', full: 'Tứ Trụ can-chi — cân bằng ngũ hành & nhịp thịnh–suy theo thời gian.' },
  { n: 'Thần Số', r: 'con số đường đời', full: 'Con số đường đời — động lực gốc và bài học của đời bạn.' },
  { n: 'MBTI', r: 'cách bạn ra quyết định', full: '16 kiểu tính cách — cách bạn tiếp nhận, suy nghĩ và ra quyết định.' },
];
const WORDS = ['mình.', 'đời mình.', 'con đường.', 'tương lai.', 'hướng đi.'];
const SAMPLES = [
  'Hợp quyết nhanh, nhưng nên hoãn việc lớn khi đang mệt.',
  'Mạnh ở tầm nhìn xa; điểm cần giữ là kiên nhẫn với chi tiết.',
  'Nửa cuối năm thuận khởi sự; tránh quyết lớn lúc nóng vội.',
];

const reduceMotion = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function MultiHero(): React.JSX.Element {
  const [run, setRun] = React.useState(0);
  const [autoActive, setAutoActive] = React.useState(4); // 0..3 soi 1 hệ; 4 = hội tụ
  const [hover, setHover] = React.useState<number | null>(null);
  const [wordIdx, setWordIdx] = React.useState(0);
  const [sample, setSample] = React.useState(0);
  const hoverRef = React.useRef<number | null>(null);
  React.useEffect(() => { hoverRef.current = hover; }, [hover]);

  React.useEffect(() => {
    if (reduceMotion()) return;
    const a = window.setInterval(() => { if (hoverRef.current == null) setAutoActive((x) => (x + 1) % 5); }, 2400);
    const w = window.setInterval(() => setWordIdx((x) => (x + 1) % WORDS.length), 2800);
    const s = window.setInterval(() => setSample((x) => (x + 1) % SAMPLES.length), 3600);
    return () => { window.clearInterval(a); window.clearInterval(w); window.clearInterval(s); };
  }, [run]);

  const active = hover != null ? hover : autoActive;
  const sys = active >= 0 && active < 4 ? SYSTEMS[active] : null;
  const soi = sys ? (
    hover != null
      ? <><b className="mh-soi-n">{sys.n}</b> <span className="mh-soi-r">· {sys.full}</span></>
      : <><span className="mh-soi-k">đang soi ·</span> <b className="mh-soi-n">{sys.n}</b> <span className="mh-soi-r">→ {sys.r}</span></>
  ) : (
    <><span className="mh-soi-k">ví dụ ·</span> <span className="mh-soi-q">“{SAMPLES[sample] ?? SAMPLES[0]}”</span></>
  );

  return (
    <main className="mh" style={{ background: PAPER, color: INK, minHeight: '100vh', position: 'relative' }}>
      <style>{CSS}</style>
      <div className="mh-grain" aria-hidden="true" />

      <div className="mh-wrap" key={run}>
        <div className="mh-copy">
          <p className="mh-eyebrow"><span className="mh-livedot" aria-hidden="true" />BỐN LĂNG KÍNH · AI HỢP NHẤT THÀNH MỘT</p>
          <h1 className="mh-h1">
            <span className="mh-line mh-l1">Hiểu mình.</span>
            <span className="mh-line mh-l2">Quyết định <span key={wordIdx} className="mh-rot">{WORDS[wordIdx] ?? 'mình.'}</span></span>
          </h1>
          <p className="mh-deck">Tử Vi, Bát Tự, Thần Số và MBTI — bốn lăng kính nhìn về bạn. AI đọc cả bốn, hợp thành một bức tranh rõ ràng để bạn tự quyết.</p>
        </div>

        <div className="mh-vis">
          <FourLens active={active} onHover={setHover} onPick={(i) => setHover((h) => (h === i ? null : i))} />
          <p className="mh-soi"><span key={`${active}-${hover != null}-${sample}`} className="mh-soi-in">{soi}</span></p>
          <p className="mh-hint">{hover != null ? 'chạm lại để tiếp tục' : 'chạm một lăng kính để xem từng hệ'}</p>
        </div>

        <div className="mh-act">
          <div className="mh-cta-row">
            <a className="mh-cta mh-cta-primary" href="#"><span className="mh-cta-num">①</span>Tôi đang phân vân một quyết định</a>
            <a className="mh-cta mh-cta-ghost" href="#"><span className="mh-cta-num">②</span>Xem nhanh<span className="mh-cta-sub">· Tử Vi 2026 · Hợp tuổi</span></a>
          </div>
          <p className="mh-micro">MIỄN PHÍ · KHÔNG CẦN THẺ · 1 PHÚT</p>
        </div>
      </div>

      <div className="mh-bar">
        <button className="mh-replay" onClick={() => { setHover(null); setAutoActive(4); setRun((r) => r + 1); }}>↻ Xem lại</button>
        <span className="mh-note">Concept "Bốn lăng kính" · AI hợp nhất Tử Vi + Bát Tự + Thần Số + MBTI → một bức tranh · mobile-first · SVG/CSS thuần · /muc-lab (noindex)</span>
      </div>
    </main>
  );
}

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const CSS = `
.mh { font-family: 'Newsreader', Georgia, serif; overflow-x: hidden; }
.mh-grain { position: absolute; inset: 0; pointer-events: none; z-index: 0; opacity: .05; mix-blend-mode: multiply; background-image: ${NOISE}; }

/* ===== BASE = MOBILE ===== */
.mh-wrap { position: relative; z-index: 1; max-width: 1180px; margin: 0 auto; padding: 38px 22px 16px; display: flex; flex-direction: column; gap: 24px; }

.mh-eyebrow { display: flex; align-items: center; font-family: 'JetBrains Mono', monospace; letter-spacing: .16em; font-size: 11px; color: ${SOFT}; margin: 0; }
.mh-livedot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${OCHRE}; margin-right: 9px; flex: none; }
.mh-h1 { font-size: clamp(2.4rem, 9.5vw, 3rem); line-height: 1.02; margin: .28em 0 .36em; font-weight: 400; letter-spacing: -.02em; }
.mh-line { display: block; }
.mh-l2 { color: ${OCHRE}; font-style: italic; }
.mh-rot { display: block; background-image: linear-gradient(${OCHRE}, ${OCHRE}); background-repeat: no-repeat; background-position: 0 96%; background-size: 100% 2px; }
.mh-deck { font-size: 1.04rem; line-height: 1.55; color: ${INK}; opacity: .82; margin: 0; max-width: 34em; }

.mh-vis { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.mh-soi { margin: 0; text-align: center; min-height: 4.5em; max-width: 32em; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; letter-spacing: .01em; line-height: 1.5; }
.mh-soi-in { display: inline-block; animation: mhFadeUp .5s ease both; }
.mh-soi-k { color: ${SOFT}; }
.mh-soi-n { color: ${OCHRE}; font-weight: 500; font-family: 'Newsreader', Georgia, serif; font-size: 1.15em; font-style: italic; }
.mh-soi-r { color: ${SOFT}; }
.mh-soi-q { color: ${INK}; opacity: .92; font-family: 'Newsreader', Georgia, serif; font-size: 1.12em; font-style: italic; }
.mh-hint { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: .12em; text-transform: uppercase; color: ${SOFT}; opacity: .78; }

.mh-act { display: flex; flex-direction: column; gap: 14px; }
.mh-cta-row { display: flex; flex-direction: column; gap: 10px; }
.mh-cta { position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; border-radius: 3px; padding: 15px 22px; font-size: 1.02rem; text-decoration: none; }
.mh-cta::before { content: ''; position: absolute; left: 50%; top: 50%; width: 8px; height: 8px; border-radius: 50%; background: radial-gradient(circle, rgba(23,20,17,.4), rgba(23,20,17,0) 70%); transform: translate(-50%,-50%) scale(0); transition: transform .55s cubic-bezier(.2,.7,.2,1); }
.mh-cta-primary { background: ${OCHRE}; color: ${PAPER}; }
.mh-cta-ghost { border: 1px solid rgba(164,117,50,.35); color: ${INK}; }
.mh-cta-ghost::before { background: radial-gradient(circle, rgba(164,117,50,.5), rgba(164,117,50,0) 70%); }
.mh-cta > * { position: relative; z-index: 1; }
.mh-cta-num { font-family: 'JetBrains Mono', monospace; margin-right: .6em; opacity: .85; }
.mh-cta-sub { font-family: 'JetBrains Mono', monospace; font-size: 11px; opacity: .68; margin-left: .5em; }
.mh-micro { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .14em; color: ${SOFT}; margin: 0; text-align: center; }

.mh-l1, .mh-l2 { opacity: 1; }
@media (prefers-reduced-motion: no-preference) {
  .mh-l1 { clip-path: inset(0 100% 0 0); animation: mhInk .85s cubic-bezier(.2,.7,.2,1) .15s both; }
  .mh-l2 { clip-path: inset(0 100% 0 0); animation: mhInk .9s cubic-bezier(.2,.7,.2,1) .45s both; }
  .mh-rot { background-size: 0% 2px; animation: mhFadeUp .55s cubic-bezier(.2,.7,.2,1) both, mhUline .7s cubic-bezier(.2,.7,.2,1) .12s both; }
  .mh-eyebrow { animation: mhFade .8s ease both; }
  .mh-deck { animation: mhFade 1s ease .85s both; }
  .mh-act { animation: mhFade 1s ease 1.05s both; }
  .mh-livedot { animation: mhPulse 1.8s ease-in-out 1.4s infinite; }
}
@keyframes mhInk { to { clip-path: inset(0 0 0 0); } }
@keyframes mhUline { to { background-size: 100% 2px; } }
@keyframes mhFade { from { opacity: 0; } to { opacity: 1; } }
@keyframes mhFadeUp { from { opacity: 0; transform: translateY(.35em); } to { opacity: 1; transform: translateY(0); } }
@keyframes mhPulse { 0%,100% { opacity: .35; transform: scale(.8); } 50% { opacity: 1; transform: scale(1.15); } }

/* ===== DESKTOP enhancement ===== */
@media (min-width: 880px) {
  .mh-wrap { display: grid; grid-template-columns: 1.05fr .95fr; grid-template-areas: "copy vis" "act vis"; column-gap: 48px; row-gap: 18px; align-items: center; padding: 76px 56px 24px; }
  .mh-copy { grid-area: copy; align-self: end; }
  .mh-vis { grid-area: vis; }
  .mh-act { grid-area: act; align-self: start; }
  .mh-h1 { font-size: clamp(3rem, 6vw, 5rem); line-height: .99; }
  .mh-deck { font-size: 1.06rem; }
  .mh-soi { min-height: 3em; }
  .mh-cta-row { flex-direction: row; flex-wrap: wrap; }
  .mh-cta { justify-content: flex-start; }
  .mh-micro { text-align: left; }
}

.mh-bar { position: relative; z-index: 1; max-width: 1180px; margin: 0 auto; padding: 8px 22px 40px; display: flex; gap: 14px; align-items: center; flex-wrap: wrap; }
@media (min-width: 880px) { .mh-bar { padding: 8px 56px 48px; } }
.mh-replay { font-family: 'JetBrains Mono', monospace; font-size: 13px; border: 1px solid ${OCHRE}; color: ${OCHRE}; background: transparent; padding: 9px 16px; border-radius: 4px; cursor: pointer; }
.mh-note { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${SOFT}; }

@media (hover: hover) {
  .mh-cta:hover::before { transform: translate(-50%,-50%) scale(34); }
  .mh-replay:hover { background: rgba(164,117,50,.08); }
}
`;
