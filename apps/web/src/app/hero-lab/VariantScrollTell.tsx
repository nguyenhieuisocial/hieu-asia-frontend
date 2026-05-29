'use client';

import * as React from 'react';

/**
 * VariantScrollTell — PROTOTYPE P2 "scroll-telling 12 cung".
 * Self-contained, KHÔNG import la-so-svg thật / components vùng cấm. Tự vẽ SVG lá số riêng.
 *
 * Concept: section cao vài màn hình. Lá số 12 cung STICKY ở một bên; bên kia là chuỗi
 * đoạn text cuộn qua — mỗi đoạn ứng 1 cung. Đoạn vào giữa viewport → cung tương ứng
 * sáng lên (ochre), các cung khác mờ đi. Cảm giác: bản đồ sao dẫn đọc từng lĩnh vực đời mình.
 *
 * Kỹ thuật: highlight cần đồng bộ state JS → chart, nên dùng IntersectionObserver
 * (vanilla) làm cơ chế chính set cung active; CSS chỉ lo phần chuyển động (fill/opacity/transform).
 * prefers-reduced-motion: bỏ hiệu ứng, mọi cung rõ + chữ liệt kê tĩnh.
 */

const INK = '#171411';
const OCHRE = '#A47532';
const PAPER = '#F3ECDD';
const SOFT = '#6B6358';

const C = 200;
const RO = 180;
const RI = 95;

type Cung = {
  key: string;
  /** index of the wedge on the chart (0 = Mệnh at top, clockwise) */
  wedge: number;
  /** short on-chart label (mirrors WEDGES[wedge].short) */
  short: string;
  /** scroll step copy */
  title: string;
  domain: string;
  body: string;
};

// 12 wedges tiling the chart (mid angle -90 + 30k). Mệnh at top, clockwise.
// Paths/centroids computed against center 200,200; outer r=180; inner r=95.
const WEDGES: { d: string; lx: number; ly: number; short: string }[] = [
  { d: 'M153.41 26.13 A180 180 0 0 1 246.59 26.13 L224.59 108.24 A95 95 0 0 0 175.41 108.24 Z', lx: 200.0, ly: 62.5, short: 'Mệnh' },
  { d: 'M246.59 26.13 A180 180 0 0 1 327.28 72.72 L267.18 132.82 A95 95 0 0 0 224.59 108.24 Z', lx: 268.75, ly: 80.92, short: 'Phụ Mẫu' },
  { d: 'M327.28 72.72 A180 180 0 0 1 373.87 153.41 L291.76 175.41 A95 95 0 0 0 267.18 132.82 Z', lx: 319.08, ly: 131.25, short: 'Phúc Đức' },
  { d: 'M373.87 153.41 A180 180 0 0 1 373.87 246.59 L291.76 224.59 A95 95 0 0 0 291.76 175.41 Z', lx: 337.5, ly: 200.0, short: 'Điền Trạch' },
  { d: 'M373.87 246.59 A180 180 0 0 1 327.28 327.28 L267.18 267.18 A95 95 0 0 0 291.76 224.59 Z', lx: 319.08, ly: 268.75, short: 'Quan Lộc' },
  { d: 'M327.28 327.28 A180 180 0 0 1 246.59 373.87 L224.59 291.76 A95 95 0 0 0 267.18 267.18 Z', lx: 268.75, ly: 319.08, short: 'Nô Bộc' },
  { d: 'M246.59 373.87 A180 180 0 0 1 153.41 373.87 L175.41 291.76 A95 95 0 0 0 224.59 291.76 Z', lx: 200.0, ly: 337.5, short: 'Thiên Di' },
  { d: 'M153.41 373.87 A180 180 0 0 1 72.72 327.28 L132.82 267.18 A95 95 0 0 0 175.41 291.76 Z', lx: 131.25, ly: 319.08, short: 'Tật Ách' },
  { d: 'M72.72 327.28 A180 180 0 0 1 26.13 246.59 L108.24 224.59 A95 95 0 0 0 132.82 267.18 Z', lx: 80.92, ly: 268.75, short: 'Tài Bạch' },
  { d: 'M26.13 246.59 A180 180 0 0 1 26.13 153.41 L108.24 175.41 A95 95 0 0 0 108.24 224.59 Z', lx: 62.5, ly: 200.0, short: 'Tử Tức' },
  { d: 'M26.13 153.41 A180 180 0 0 1 72.72 72.72 L132.82 132.82 A95 95 0 0 0 108.24 175.41 Z', lx: 80.92, ly: 131.25, short: 'Phu Thê' },
  { d: 'M72.72 72.72 A180 180 0 0 1 153.41 26.13 L175.41 108.24 A95 95 0 0 0 132.82 132.82 Z', lx: 131.25, ly: 80.92, short: 'Huynh Đệ' },
];

// The 6 cung that get a scroll step (subset of the 12 — the life-domains people decide on).
const STEPS: Cung[] = [
  {
    key: 'menh', wedge: 0, short: 'Mệnh',
    title: 'Mệnh', domain: 'con người bạn',
    body: 'Khởi đầu của mọi bản đồ là chính bạn. Cung Mệnh phác ra cốt cách, cách bạn phản ứng trước áp lực và điều khiến bạn thấy mình là mình. Hiểu nó, mọi quyết định khác có một điểm tựa.',
  },
  {
    key: 'taibach', wedge: 8, short: 'Tài Bạch',
    title: 'Tài Bạch', domain: 'tiền bạc',
    body: 'Tiền không chỉ là con số — là cách bạn xoay xở, giữ và buông. Cung Tài Bạch cho thấy dòng chảy tài chính tự nhiên của bạn, để bạn chọn thời điểm liều và thời điểm thủ.',
  },
  {
    key: 'quanloc', wedge: 4, short: 'Quan Lộc',
    title: 'Quan Lộc', domain: 'sự nghiệp',
    body: 'Con đường công danh hiếm khi thẳng. Cung Quan Lộc đọc thiên hướng nghề nghiệp, môi trường bạn toả sáng và những ngã rẽ đáng cân nhắc — không để phán, mà để bạn chủ động.',
  },
  {
    key: 'phuthe', wedge: 10, short: 'Phu Thê',
    title: 'Phu Thê', domain: 'hôn nhân',
    body: 'Một mối quan hệ bền là hai người hiểu nhịp của nhau. Cung Phu Thê soi cách bạn yêu, điều bạn cần ở bạn đời và những điểm dễ va chạm — để bước vào cam kết với mắt mở.',
  },
  {
    key: 'phucduc', wedge: 2, short: 'Phúc Đức',
    title: 'Phúc Đức', domain: 'phúc phần',
    body: 'Có những điều vượt ngoài nỗ lực: nền tảng gia đình, sự an yên trong tâm, phúc khí tích luỹ. Cung Phúc Đức nhắc bạn điều gì nên gìn giữ và vun trồng cho đường dài.',
  },
  {
    key: 'thiendi', wedge: 6, short: 'Thiên Di',
    title: 'Thiên Di', domain: 'di chuyển & cơ hội',
    body: 'Đôi khi vận may nằm ở một nơi khác. Cung Thiên Di nói về dịch chuyển, cơ hội xa nhà và những người bạn gặp trên đường — để bạn biết khi nào nên đi và khi nào nên ở.',
  },
];

// outer ring tick marks (static, light astrolabe texture)
const TICKS = Array.from({ length: 24 }, (_, k) => {
  const a = (k * 15 * Math.PI) / 180;
  return {
    x1: C + 169 * Math.cos(a), y1: C + 169 * Math.sin(a),
    x2: C + RO * Math.cos(a), y2: C + RO * Math.sin(a),
  };
});

// 12 spoke boundaries (sector dividers) at -105 + 30k
const SPOKES = Array.from({ length: 12 }, (_, k) => {
  const a = ((-105 + 30 * k) * Math.PI) / 180;
  return {
    x1: C + RI * Math.cos(a), y1: C + RI * Math.sin(a),
    x2: C + RO * Math.cos(a), y2: C + RO * Math.sin(a),
  };
});

export function VariantScrollTell() {
  // -1 = no step centered yet (intro). Otherwise index into STEPS.
  const [active, setActive] = React.useState(0);
  const stepRefs = React.useRef<(HTMLElement | null)[]>([]);

  React.useEffect(() => {
    // Respect reduced motion: leave everything in the static "all-clear" state.
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the viewport center band.
        let best: { i: number; ratio: number } | null = null;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = Number((e.target as HTMLElement).dataset.idx);
          if (!best || e.intersectionRatio > best.ratio) {
            best = { i, ratio: e.intersectionRatio };
          }
        }
        if (best) setActive(best.i);
      },
      // A narrow band across the vertical middle of the viewport.
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.5, 1] },
    );

    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const activeWedge = STEPS[active]?.wedge ?? -1;

  return (
    <main className="st" style={{ background: PAPER, color: INK }}>
      <style>{CSS}</style>

      <header className="st-head">
        <p className="st-eyebrow">CẨM NANG QUYẾT ĐỊNH BẰNG AI</p>
        <h1 className="st-h1">
          Bản đồ sao <span className="st-em">dẫn bạn đọc</span> từng lĩnh vực đời mình.
        </h1>
        <p className="st-deck">
          Mỗi cung trên lá số là một vùng của cuộc đời. Cuộn xuống — ánh sáng sẽ lần lượt
          rọi vào từng cung, và bạn đọc nó theo nhịp của riêng mình.
        </p>
        <p className="st-hint" aria-hidden="true">cuộn xuống ↓</p>
      </header>

      <section className="st-scene" aria-label="Mười hai cung của lá số">
        {/* Sticky chart */}
        <div className="st-sticky">
          <figure className="st-chart-fig">
            <svg
              viewBox="0 0 400 400"
              className="st-chart"
              role="img"
              aria-label={`Lá số 12 cung — đang nói về cung ${STEPS[active]?.title ?? 'Mệnh'} (minh hoạ)`}
            >
              {/* base rings */}
              <circle cx={C} cy={C} r={RO} fill="none" stroke={INK} strokeWidth={1.1} />
              <circle cx={C} cy={C} r={RI} fill="none" stroke={INK} strokeWidth={1} />

              {/* outer tick ring */}
              {TICKS.map((t, i) => (
                <line key={`t${i}`} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={SOFT} strokeWidth={0.8} />
              ))}

              {/* 12 wedges — fill/opacity driven by active state */}
              {WEDGES.map((w, i) => {
                const on = i === activeWedge;
                return (
                  <path
                    key={`w${i}`}
                    className={`st-wedge${on ? ' st-on' : ''}`}
                    d={w.d}
                    fill={OCHRE}
                    stroke={OCHRE}
                  />
                );
              })}

              {/* sector dividers on top of fills */}
              {SPOKES.map((s, i) => (
                <line key={`s${i}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={INK} strokeWidth={0.7} strokeOpacity={0.5} />
              ))}

              {/* on-chart labels */}
              {WEDGES.map((w, i) => {
                const on = i === activeWedge;
                return (
                  <text
                    key={`l${i}`}
                    className={`st-wlabel${on ? ' st-lon' : ''}`}
                    x={w.lx}
                    y={w.ly}
                    fontSize={9.5}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {w.short}
                  </text>
                );
              })}

              {/* center mark + active cung name */}
              <circle cx={C} cy={C} r={3} fill={OCHRE} />
              <text className="st-center" x={C} y={C + 5} fill={INK} fontSize={15} letterSpacing={3} textAnchor="middle">
                {(STEPS[active]?.title ?? 'MỆNH').toUpperCase()}
              </text>
            </svg>
            <figcaption className="st-cap">
              {activeWedge >= 0 ? `Cung ${STEPS[active]?.title} · ${STEPS[active]?.domain}` : 'Lá số 12 cung'}
            </figcaption>
          </figure>
        </div>

        {/* Scrolling steps */}
        <ol className="st-steps">
          {STEPS.map((s, i) => (
            <li
              key={s.key}
              ref={(el) => { stepRefs.current[i] = el; }}
              data-idx={i}
              className={`st-step${i === active ? ' st-step-on' : ''}`}
            >
              <span className="st-num">{String(i + 1).padStart(2, '0')}</span>
              <h2 className="st-step-title">
                {s.title}
                <span className="st-domain"> · {s.domain}</span>
              </h2>
              <p className="st-step-body">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <footer className="st-foot">
        <p className="st-close">
          Mười hai cung, một bức tranh. <span className="st-em">Hiểu mình. Quyết định mình.</span>
        </p>
        <p className="st-note">
          Prototype P2 · scroll-telling · SVG + CSS + IntersectionObserver · tôn trọng prefers-reduced-motion · /hero-lab (noindex)
        </p>
      </footer>
    </main>
  );
}

const CSS = `
.st { font-family: 'Newsreader', Georgia, serif; overflow-x: hidden; }

/* ---- intro ---- */
.st-head { max-width: 880px; margin: 0 auto; padding: 96px 32px 24px; }
.st-eyebrow { font-family: 'JetBrains Mono', monospace; letter-spacing: .24em; font-size: 12px; color: ${SOFT}; margin: 0; }
.st-h1 { font-size: clamp(2.2rem, 5vw, 3.8rem); line-height: 1.04; letter-spacing: -0.02em; font-weight: 400; margin: .4em 0 .5em; }
.st-em { color: ${OCHRE}; font-style: italic; }
.st-deck { max-width: 32em; font-size: 1.06rem; line-height: 1.6; color: ${INK}; opacity: .82; margin: 0; }
.st-hint { font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: .16em; color: ${SOFT}; margin-top: 2.4em; }

/* ---- scene: sticky chart + scrolling steps ---- */
.st-scene {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 32px;
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 56px;
  align-items: start;
}

.st-sticky { position: sticky; top: 0; height: 100vh; display: grid; place-items: center; }
.st-chart-fig { margin: 0; display: grid; justify-items: center; gap: 14px; }
.st-chart { width: min(440px, 78vw); height: auto; display: block; }
.st-cap {
  font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: .04em;
  color: ${SOFT}; text-align: center; min-height: 1.2em;
  transition: color .5s ease;
}

/* wedges: default dim; active = lit ochre. transform/opacity/fill only. */
.st-wedge {
  fill-opacity: .05;
  stroke-opacity: .18;
  stroke-width: 1;
  transform-box: fill-box;
  transform-origin: center;
  transition: fill-opacity .55s ease, stroke-opacity .55s ease, transform .55s ease;
}
.st-wedge.st-on {
  fill-opacity: .2;
  stroke-opacity: 1;
  stroke-width: 1.4;
  transform: scale(1.015);
}

.st-wlabel {
  fill: ${SOFT};
  fill-opacity: .55;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: .02em;
  transition: fill .5s ease, fill-opacity .5s ease;
}
.st-wlabel.st-lon { fill: ${OCHRE}; fill-opacity: 1; }

.st-center {
  font-family: 'Newsreader', Georgia, serif;
  transition: opacity .4s ease;
}

/* steps column */
.st-steps { list-style: none; margin: 0; padding: 0; }
.st-step {
  min-height: 86vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4vh 0;
  border-left: 1px solid rgba(23,20,17,.1);
  padding-left: 28px;
  transition: opacity .5s ease, border-color .5s ease;
  opacity: .42;
}
.st-step-on { opacity: 1; border-color: ${OCHRE}; }
.st-num {
  font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: .2em;
  color: ${OCHRE}; display: block; margin-bottom: .8em;
}
.st-step-title { font-size: clamp(1.7rem, 3.4vw, 2.7rem); font-weight: 400; letter-spacing: -.01em; margin: 0 0 .5em; line-height: 1.05; }
.st-domain { color: ${SOFT}; font-style: italic; font-size: .58em; letter-spacing: 0; }
.st-step-body { max-width: 30em; font-size: 1.08rem; line-height: 1.62; color: ${INK}; opacity: .86; margin: 0; }

/* ---- footer ---- */
.st-foot { max-width: 880px; margin: 0 auto; padding: 18vh 32px 12vh; }
.st-close { font-size: clamp(1.5rem, 3.2vw, 2.4rem); font-weight: 400; line-height: 1.2; letter-spacing: -.01em; margin: 0 0 2.2em; }
.st-note { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${SOFT}; margin: 0; }

/* ---- mobile: one column, chart sticks at top ---- */
@media (max-width: 880px) {
  .st-head { padding: 56px 22px 16px; }
  .st-scene { grid-template-columns: 1fr; gap: 0; padding: 0 22px; }
  .st-sticky {
    position: sticky; top: 0; height: auto;
    padding: 14px 0 10px;
    background: ${PAPER};
    z-index: 2;
    box-shadow: 0 10px 18px -14px rgba(23,20,17,.4);
  }
  .st-chart { width: min(280px, 64vw); }
  .st-cap { font-size: 11px; }
  .st-step { min-height: 70vh; padding-left: 18px; }
  .st-foot { padding: 12vh 22px 10vh; }
}

/* ---- reduced motion: static, everything legible, no scroll dependency ---- */
@media (prefers-reduced-motion: reduce) {
  .st-sticky { position: static; height: auto; padding: 24px 0; }
  .st-step { min-height: 0; opacity: 1; padding: 18px 0; padding-left: 28px; border-color: rgba(23,20,17,.18); }
  .st-wedge { fill-opacity: .12; stroke-opacity: .7; transform: none; transition: none; }
  .st-wlabel { fill: ${SOFT}; fill-opacity: .9; transition: none; }
  .st-cap, .st-center, .st-step, .st-wedge, .st-wlabel { transition: none; }
}
`;
