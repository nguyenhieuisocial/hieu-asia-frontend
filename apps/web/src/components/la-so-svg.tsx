import * as React from 'react';

/**
 * Schematic 12-cung "lá số tử vi" — visual anchor (neo thị giác) for the
 * Wave 62.04 Hero redesign per "Như giấy cũ" spec.
 *
 * Founder rationale (vault 138):
 *   "Người mới không biết 'lá số' là gì. Một sơ đồ 12 cung đơn giản với
 *    một vài sao chính được highlight sẽ làm cho khái niệm trở nên cụ thể.
 *    Có thể là một artifact tĩnh ban đầu — không cần interactive ngay."
 *
 * Visual elements:
 *   - 12 radial dividers (slice the wheel into 12 cung — life areas)
 *   - 2 concentric outer rings (frame the chart)
 *   - 2 concentric inner rings (center halo)
 *   - 12 small markers at slice centers (each = one of the 12 cung)
 *   - 8 sao chính (star) dots scattered between inner + outer rings
 *   - Center: filled dot + "MỆNH" mono caption (the self palace anchor)
 *
 * Theming:
 *   Uses `currentColor` throughout so the parent controls hue via
 *   `text-primary` / `text-ochre` / `text-gold-night`. Renders in
 *   - Day mode: Ochre #A47532 on Paper bg
 *   - Night mode: Gold-soft #D4A261 on Charcoal bg
 *   Alpha is hard-coded per element so the layering effect (faint outer
 *   ring vs prominent dividers) survives across themes.
 *
 * Pure SVG, no external asset, no JS runtime — server-component safe.
 */
export function LaSoSvg({ className }: { className?: string }) {
  const cx = 200;
  const cy = 200;
  const rOuter = 150;
  const rOuterEdge = 158;
  const rInner = 70;
  const rInnerEdge = 62;

  // 12 cung dividers (radial lines). Position 0 is the top (12 o'clock),
  // dividers spaced 30° apart going clockwise.
  const dividers = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * Math.PI * 2) / 12 - Math.PI / 2;
    return {
      x1: cx + rInner * Math.cos(angle),
      y1: cy + rInner * Math.sin(angle),
      x2: cx + rOuter * Math.cos(angle),
      y2: cy + rOuter * Math.sin(angle),
    };
  });

  // 12 cung markers at slice centers (between two adjacent dividers).
  // Small dots that hint at "12 chambers" without overwhelming the
  // schematic with text. Founder spec: "không cần interactive ngay".
  const cungMarkers = Array.from({ length: 12 }, (_, i) => {
    const angle = ((i + 0.5) * Math.PI * 2) / 12 - Math.PI / 2;
    const r = (rOuter + rInner) / 2;
    return {
      cx: cx + r * Math.cos(angle),
      cy: cy + r * Math.sin(angle),
    };
  });

  // 8 sao chính (major star) dots scattered between inner + outer rings.
  // Hand-placed positions to feel like a star map rather than uniform grid.
  // Coordinates roughly match Tử Vi đẩu số position quadrant logic
  // (Tử Vi → top, Thiên Cơ → upper-right, Thái Dương → right, etc.) but
  // the SVG is schematic, not literal — exact accuracy not required.
  const saoChinh: Array<[number, number, number]> = [
    [200, 60, 2.5],    // top (Tử Vi)
    [300, 88, 2.2],    // upper-right (Thiên Cơ)
    [340, 200, 2.5],   // right (Thái Dương)
    [310, 308, 2.0],   // lower-right (Vũ Khúc)
    [205, 340, 2.4],   // bottom (Thiên Đồng)
    [100, 308, 2.0],   // lower-left (Liêm Trinh)
    [60, 195, 2.5],    // left (Thiên Phủ)
    [95, 92, 2.2],     // upper-left (Thái Âm)
  ];

  return (
    <svg
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Sơ đồ 12 cung lá số tử vi — mỗi cung là một lĩnh vực đời sống"
      className={className}
    >
      {/* Outer ring frame — pair of concentric rings for depth */}
      <circle
        cx={cx}
        cy={cy}
        r={rOuterEdge}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.12"
        strokeWidth="0.5"
      />
      <circle
        cx={cx}
        cy={cy}
        r={rOuter}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1"
      />

      {/* Inner ring (center halo) */}
      <circle
        cx={cx}
        cy={cy}
        r={rInner}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1"
      />
      <circle
        cx={cx}
        cy={cy}
        r={rInnerEdge}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeWidth="0.5"
      />

      {/* 12 cung dividers */}
      {dividers.map((d, i) => (
        <line
          key={`divider-${i}`}
          x1={d.x1}
          y1={d.y1}
          x2={d.x2}
          y2={d.y2}
          stroke="currentColor"
          strokeOpacity="0.22"
          strokeWidth="0.75"
        />
      ))}

      {/* 12 cung markers at slice centers */}
      {cungMarkers.map((m, i) => (
        <circle
          key={`cung-${i}`}
          cx={m.cx}
          cy={m.cy}
          r="1.2"
          fill="currentColor"
          fillOpacity="0.35"
        />
      ))}

      {/* 8 sao chính (major star) dots */}
      {saoChinh.map(([x, y, r], i) => (
        <circle
          key={`sao-${i}`}
          cx={x}
          cy={y}
          r={r}
          fill="currentColor"
          fillOpacity="0.7"
        />
      ))}

      {/* Center anchor — small filled dot + MỆNH caption */}
      <circle cx={cx} cy={cy} r="3" fill="currentColor" fillOpacity="0.85" />
      <text
        x={cx}
        y={cy + 22}
        textAnchor="middle"
        fontSize="9"
        fontFamily="var(--font-jetbrains-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
        fill="currentColor"
        fillOpacity="0.55"
      >
        MỆNH
      </text>
    </svg>
  );
}
