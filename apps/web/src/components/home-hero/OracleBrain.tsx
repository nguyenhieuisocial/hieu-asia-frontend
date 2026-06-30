'use client';

import * as React from 'react';
import { TOOLKIT_GROUPS } from '@/lib/catalog/tools';
import { ShimmerText } from '@/components/fx/ShimmerText';
import { Marquee } from '@/components/fx/Marquee';

/**
 * OracleBrain — the signature "night-sky" section: the whole toolkit (Eastern
 * classics + modern psychology + astrology + intuition) converging on "BẠN".
 *
 * Built with HTML + SVG (NOT canvas) on purpose:
 *  - the labels are real DOM text → Google Translate can translate them
 *    (canvas fillText could not, so they used to stay Vietnamese);
 *  - percentage-positioned nodes scale to any width → nothing clips on PC or
 *    mobile (the old canvas drew satellites past its own edge);
 *  - animation is calm CSS (gentle breathe + twinkle, no zoom/jitter) and is
 *    fully disabled under prefers-reduced-motion.
 */

const ALL_TOOLS = TOOLKIT_GROUPS.flatMap((g) => g.tools.map((t) => t.n));

// 5 groups on a pentagon (top first). left/top are % of the graph box.
const RADIUS = 34;
const HUBS = TOOLKIT_GROUPS.map((g, i, arr) => {
  const a = ((-90 + (360 / arr.length) * i) * Math.PI) / 180;
  return {
    label: g.label,
    left: 50 + Math.cos(a) * RADIUS,
    top: 50 + Math.sin(a) * RADIUS,
  };
});

// Deterministic starfield (no Math.random → SSR-stable, no hydration drift).
const STARS = Array.from({ length: 22 }, (_, i) => ({
  left: (i * 53 + 7) % 100,
  top: (i * 29 + 11) % 100,
  delay: (i % 6) * 0.5,
}));

export function OracleBrain(): React.JSX.Element {
  const [hover, setHover] = React.useState<number | null>(null);
  const [inView, setInView] = React.useState(false);
  const graphRef = React.useRef<HTMLDivElement | null>(null);

  // Draw the constellation in once, when it scrolls into view (CSS handles the
  // line-draw + node fade via [data-in]; reduced-motion shows it static).
  React.useEffect(() => {
    const el = graphRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      aria-label="Bộ não Oracle — AI hợp nhất toàn bộ công cụ về bạn"
      className="ob-section px-6 py-section"
    >
      <div className="mx-auto max-w-marketing text-center">
        <p className="ob-eyebrow font-mono text-editorial-mono uppercase tracking-[0.12em]">
          Bộ não Oracle
        </p>
        <h2 className="ob-title mx-auto mt-3 max-w-2xl text-editorial-h2 font-normal">
          Hàng chục công cụ — <ShimmerText>một bức tranh</ShimmerText> về bạn.
        </h2>
        <p className="ob-sub mx-auto mt-3 max-w-xl text-editorial-caption">
          Cổ học Á Đông, tâm lý hiện đại, chiêm tinh, trực giác — AI nối tất cả lại để bạn hiểu
          mình sâu.
        </p>

        <div
          ref={graphRef}
          data-in={inView || undefined}
          className="ob-graph"
          role="img"
          aria-label="Năm nhóm công cụ hội tụ về Bạn"
        >
          <svg className="ob-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {HUBS.map((h, i) => (
              <line
                key={h.label}
                x1="50"
                y1="50"
                x2={h.left}
                y2={h.top}
                pathLength={1}
                vectorEffect="non-scaling-stroke"
                className={`ob-line${hover === i ? ' ob-line-on' : ''}`}
              />
            ))}
          </svg>

          {STARS.map((s, i) => (
            <span
              key={i}
              className="ob-star"
              style={{ left: `${s.left}%`, top: `${s.top}%`, animationDelay: `${s.delay}s` }}
              aria-hidden="true"
            />
          ))}

          <div className="ob-center" style={{ left: '50%', top: '50%' }}>
            <span className="ob-center-glow" aria-hidden="true" />
            <span className="ob-center-dot" aria-hidden="true" />
            <span className="ob-center-label">BẠN</span>
            <span className="ob-center-sub">hiểu mình sâu</span>
          </div>

          {HUBS.map((h, i) => (
            <button
              key={h.label}
              type="button"
              className={`ob-hub${hover === i ? ' ob-hub-on' : ''}`}
              style={{ left: `${h.left}%`, top: `${h.top}%` }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
            >
              <span className="ob-hub-dot" aria-hidden="true" />
              <span className="ob-hub-label">{h.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-8">
          <Marquee speed={34}>
            {ALL_TOOLS.map((t) => (
              <span key={t} className="ob-tool font-mono text-editorial-mono uppercase tracking-[0.12em]">
                {t}
              </span>
            ))}
          </Marquee>
        </div>
        <div className="mt-6 text-center">
          <a
            href="/cong-cu"
            className="ob-link inline-block whitespace-nowrap font-mono text-editorial-mono uppercase tracking-[0.12em] underline underline-offset-4 transition-opacity hover:opacity-80"
          >
            Xem tất cả công cụ →
          </a>
        </div>
      </div>
    </section>
  );
}
