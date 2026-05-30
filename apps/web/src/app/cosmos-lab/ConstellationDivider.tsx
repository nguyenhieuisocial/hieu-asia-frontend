'use client';

import * as React from 'react';

/**
 * ConstellationDivider — DEMO Nhóm 4: vạch ngăn section bằng đường nối chòm sao.
 * Vẽ dần khi cuộn tới (IntersectionObserver). SSR-safe: mặc định hiện đủ (no-JS/reduced
 * không kẹt ẩn), chỉ "ẩn rồi vẽ lại" sau mount khi cho phép motion.
 * tone: 'light' (mực/ochre trên giấy) | 'dark' (cyan trên nền tối).
 */

const STARS: ReadonlyArray<readonly [number, number]> = [
  [60, 72], [232, 38], [418, 86], [600, 30], [786, 80], [968, 44], [1140, 66],
];

export function ConstellationDivider({ tone = 'light' }: { tone?: 'light' | 'dark' }): React.JSX.Element {
  const ref = React.useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => { setMounted(true); }, []);
  React.useEffect(() => {
    const reduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof IntersectionObserver === 'undefined') { setShown(true); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => {
      if (es[0]?.isIntersecting) { setShown(true); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const hidden = mounted && !shown; // ẩn chỉ sau mount; SSR/reduced = hiện
  const stroke = tone === 'dark' ? '#6fe0ef' : '#A47532';
  const star = tone === 'dark' ? '#eaf1ff' : '#171411';

  const lines = STARS.slice(0, -1).map((p, i) => {
    const a = p;
    const b = STARS[i + 1]!;
    return { x1: a[0], y1: a[1], x2: b[0], y2: b[1], i };
  });

  return (
    <div ref={ref} aria-hidden="true" className="w-full overflow-hidden" style={{ padding: '14px 0' }}>
      <svg viewBox="0 0 1200 120" width="100%" height="72" preserveAspectRatio="xMidYMid meet" style={{ display: 'block', opacity: 0.85 }}>
        {lines.map((l) => (
          <line
            key={l.i}
            x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke={stroke} strokeWidth={1} pathLength={1}
            style={{
              strokeDasharray: 1,
              strokeDashoffset: hidden ? 1 : 0,
              transition: `stroke-dashoffset 0.9s cubic-bezier(.22,.61,.36,1) ${0.1 + l.i * 0.12}s`,
            }}
          />
        ))}
        {STARS.map(([x, y], i) => (
          <circle
            key={`s${i}`}
            cx={x} cy={y} r={i === 3 ? 3 : 2.1}
            fill={i === 3 ? stroke : star}
            style={{ opacity: hidden ? 0 : 1, transition: `opacity 0.6s ease ${0.2 + i * 0.12}s` }}
          />
        ))}
      </svg>
    </div>
  );
}
