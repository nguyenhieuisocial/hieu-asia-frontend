'use client';

import * as React from 'react';
import { FourLens } from './FourLens';

/**
 * MultiHero — hero ĐÚNG ĐỊNH VỊ: "Bốn lăng kính (Tử Vi · Bát Tự · Thần Số · MBTI),
 * AI hợp nhất thành MỘT bức tranh". Editorial giấy-mực-ochre, SVG/CSS thuần.
 * - Lăng kính tự soi lần lượt 4 hệ → hội tụ; HOVER/CLICK một lăng kính để xem chi tiết (pause auto).
 * - Headline: từ cuối "Quyết định ___" đổi liên tục. prefers-reduced-motion-safe (SSR = hội tụ tĩnh).
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

const reduceMotion = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function MultiHero(): React.JSX.Element {
  const [run, setRun] = React.useState(0);
  const [autoActive, setAutoActive] = React.useState(4); // 0..3 soi 1 hệ; 4 = hội tụ (SSR/reduced)
  const [hover, setHover] = React.useState<number | null>(null);
  const [wordIdx, setWordIdx] = React.useState(0);
  const hoverRef = React.useRef<number | null>(null);
  React.useEffect(() => { hoverRef.current = hover; }, [hover]);

  React.useEffect(() => {
    if (reduceMotion()) return;
    const a = window.setInterval(() => { if (hoverRef.current == null) setAutoActive((x) => (x + 1) % 5); }, 2400);
    const s = window.setInterval(() => setWordIdx((x) => (x + 1) % WORDS.length), 2800);
    return () => { window.clearInterval(a); window.clearInterval(s); };
  }, [run]);

  const active = hover != null ? hover : autoActive;
  const sys = active >= 0 && active < 4 ? SYSTEMS[active] : null;
  const soi = sys ? (
    hover != null ? (
      <><b className="mh-soi-n">{sys.n}</b> <span className="mh-soi-r">· {sys.full}</span></>
    ) : (
      <><span className="mh-soi-k">đang soi ·</span> <b className="mh-soi-n">{sys.n}</b> <span className="mh-soi-r">→ {sys.r}</span></>
    )
  ) : (
    <><span className="mh-soi-k">AI hợp nhất ·</span> <b className="mh-soi-n">một bức tranh</b> <span className="mh-soi-r">của riêng bạn</span></>
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
          <p className="mh-deck">
            Tử Vi, Bát Tự, Thần Số Học và MBTI — bốn cách cổ học và hiện đại nhìn về bạn.
            AI đọc cả bốn, hợp lại thành một bức tranh rõ ràng để bạn tự quyết định.
          </p>
          <div className="mh-cta-row">
            <a className="mh-cta mh-cta-primary" href="#"><span className="mh-cta-num">①</span>Tôi đang phân vân một quyết định</a>
            <a className="mh-cta mh-cta-ghost" href="#"><span className="mh-cta-num">②</span>Tôi muốn xem nhanh <span className="mh-cta-sub">(Tử Vi 2026 · Hợp tuổi)</span></a>
          </div>
          <p className="mh-micro">MIỄN PHÍ · KHÔNG CẦN THẺ · 1 PHÚT</p>
        </div>

        <div className="mh-vis">
          <FourLens active={active} onHover={setHover} onPick={(i) => setHover((h) => (h === i ? null : i))} />
          <p className="mh-soi" aria-live="off"><span key={`${active}-${hover != null}`} className="mh-soi-in">{soi}</span></p>
          <p className="mh-hint">{hover != null ? 'bấm/để chuột ra để tiếp tục' : 'di chuột hoặc bấm một lăng kính để xem'}</p>
        </div>
      </div>

      <div className="mh-bar">
        <button className="mh-replay" onClick={() => { setHover(null); setAutoActive(4); setRun((r) => r + 1); }}>↻ Xem lại</button>
        <span className="mh-note">Concept "Bốn lăng kính" · AI hợp nhất Tử Vi + Bát Tự + Thần Số + MBTI → một bức tranh · SVG/CSS thuần · /muc-lab (noindex)</span>
      </div>
    </main>
  );
}

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const CSS = `
.mh { font-family: 'Newsreader', Georgia, serif; overflow-x: hidden; }
.mh-grain { position: absolute; inset: 0; pointer-events: none; z-index: 0; opacity: .05; mix-blend-mode: multiply; background-image: ${NOISE}; }
.mh-wrap { position: relative; z-index: 1; max-width: 1180px; margin: 0 auto; padding: 80px 56px 24px; display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 48px; align-items: center; }
@media (max-width: 880px) { .mh-wrap { grid-template-columns: 1fr; padding: 44px 24px 8px; } .mh-vis { order: -1; } }

.mh-eyebrow { display: flex; align-items: center; font-family: 'JetBrains Mono', monospace; letter-spacing: .2em; font-size: 11.5px; color: ${SOFT}; margin: 0; }
.mh-livedot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${OCHRE}; margin-right: 9px; }
.mh-h1 { font-size: clamp(2.6rem, 6vw, 5rem); line-height: .99; margin: .35em 0 .45em; font-weight: 400; letter-spacing: -.02em; }
.mh-line { display: block; }
.mh-l2 { color: ${OCHRE}; font-style: italic; }
.mh-rot { display: inline-block; background-image: linear-gradient(${OCHRE}, ${OCHRE}); background-repeat: no-repeat; background-position: 0 96%; background-size: 100% 2px; }
.mh-deck { max-width: 30em; font-size: 1.06rem; line-height: 1.58; color: ${INK}; opacity: .82; margin: 0; }

.mh-cta-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 1.8em; }
.mh-cta { position: relative; overflow: hidden; display: inline-flex; align-items: center; border-radius: 2px; padding: 14px 24px; font-size: 1rem; text-decoration: none; }
.mh-cta::before { content: ''; position: absolute; left: 50%; top: 50%; width: 8px; height: 8px; border-radius: 50%; background: radial-gradient(circle, rgba(23,20,17,.4), rgba(23,20,17,0) 70%); transform: translate(-50%,-50%) scale(0); transition: transform .55s cubic-bezier(.2,.7,.2,1); }
.mh-cta:hover::before { transform: translate(-50%,-50%) scale(34); }
.mh-cta-primary { background: ${OCHRE}; color: ${PAPER}; }
.mh-cta-ghost { border: 1px solid rgba(164,117,50,.35); color: ${INK}; }
.mh-cta-ghost::before { background: radial-gradient(circle, rgba(164,117,50,.5), rgba(164,117,50,0) 70%); }
.mh-cta > * { position: relative; z-index: 1; }
.mh-cta-num { font-family: 'JetBrains Mono', monospace; margin-right: .6em; opacity: .85; }
.mh-cta-sub { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${SOFT}; margin-left: .4em; }
.mh-micro { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .16em; color: ${SOFT}; margin-top: 1.5em; }

.mh-vis { display: grid; place-items: center; gap: 12px; }
.mh-soi { margin: 0; text-align: center; min-height: 1.3em; max-width: 30em; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; letter-spacing: .02em; line-height: 1.5; }
.mh-soi-in { display: inline-block; animation: mhFadeUp .5s ease both; }
.mh-soi-k { color: ${SOFT}; }
.mh-soi-n { color: ${OCHRE}; font-weight: 500; font-family: 'Newsreader', Georgia, serif; font-size: 1.15em; font-style: italic; }
.mh-soi-r { color: ${SOFT}; }
.mh-hint { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: .14em; text-transform: uppercase; color: ${SOFT}; opacity: .6; }

.mh-l1, .mh-l2 { opacity: 1; }
@media (prefers-reduced-motion: no-preference) {
  .mh-l1 { clip-path: inset(0 100% 0 0); animation: mhInk .85s cubic-bezier(.2,.7,.2,1) .15s both; }
  .mh-l2 { clip-path: inset(0 100% 0 0); animation: mhInk .9s cubic-bezier(.2,.7,.2,1) .45s both; }
  .mh-rot { background-size: 0% 2px; animation: mhFadeUp .55s cubic-bezier(.2,.7,.2,1) both, mhUline .7s cubic-bezier(.2,.7,.2,1) .12s both; }
  .mh-eyebrow { animation: mhFade .8s ease both; }
  .mh-deck { animation: mhFade 1s ease .85s both; }
  .mh-cta-row { animation: mhFade 1s ease 1.05s both; }
  .mh-livedot { animation: mhPulse 1.8s ease-in-out 1.4s infinite; }
}
@keyframes mhInk { to { clip-path: inset(0 0 0 0); } }
@keyframes mhUline { to { background-size: 100% 2px; } }
@keyframes mhFade { from { opacity: 0; } to { opacity: 1; } }
@keyframes mhFadeUp { from { opacity: 0; transform: translateY(.35em); } to { opacity: 1; transform: translateY(0); } }
@keyframes mhPulse { 0%,100% { opacity: .35; transform: scale(.8); } 50% { opacity: 1; transform: scale(1.15); } }

.mh-bar { position: relative; z-index: 1; max-width: 1180px; margin: 0 auto; padding: 8px 56px 48px; display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
@media (max-width: 880px) { .mh-bar { padding: 8px 24px 40px; } }
.mh-replay { font-family: 'JetBrains Mono', monospace; font-size: 13px; border: 1px solid ${OCHRE}; color: ${OCHRE}; background: transparent; padding: 9px 16px; border-radius: 4px; cursor: pointer; }
.mh-replay:hover { background: rgba(164,117,50,.08); }
.mh-note { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${SOFT}; }
`;
