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
 *   - Cung Mệnh highlight: filled arc sector at top slice (ochre accent)
 *   - Center: filled dot + "MỆNH" mono caption (the self palace anchor)
 *
 * Theming (two-layer colour split):
 *   - Structural strokes (rings, dividers): `text-foreground` group →
 *     ink #171411 day / bone #E8DCC1 night — always legible on bg.
 *   - Accent elements (Mệnh sector, star dots, labels): inherit parent
 *     `text-primary` = ochre #A47532 day / gold-soft #D4A261 night.
 *   Alpha is hard-coded per element so layering survives both themes.
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
      angle,
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

  // Cung Mệnh highlight — top slice (between divider 11 and divider 0).
  // Arc sector from angle (-π/2 - π/12) to (-π/2 + π/12) = ±15° around top.
  const methStartAngle = -Math.PI / 2 - Math.PI / 12;
  const methEndAngle   = -Math.PI / 2 + Math.PI / 12;
  const methArcPath = [
    `M ${cx + rInner * Math.cos(methStartAngle)} ${cy + rInner * Math.sin(methStartAngle)}`,
    `L ${cx + rOuter * Math.cos(methStartAngle)} ${cy + rOuter * Math.sin(methStartAngle)}`,
    `A ${rOuter} ${rOuter} 0 0 1 ${cx + rOuter * Math.cos(methEndAngle)} ${cy + rOuter * Math.sin(methEndAngle)}`,
    `L ${cx + rInner * Math.cos(methEndAngle)} ${cy + rInner * Math.sin(methEndAngle)}`,
    `A ${rInner} ${rInner} 0 0 0 ${cx + rInner * Math.cos(methStartAngle)} ${cy + rInner * Math.sin(methStartAngle)}`,
    'Z',
  ].join(' ');

  // Label positions for faint cung labels — computed from slice angle (same
  // formula as cungMarkers) so they stay type-safe without array indexing.
  const labelRadius = (rOuter + rInner) / 2;
  const cungLabelAngle = (i: number) => ((i + 0.5) * Math.PI * 2) / 12 - Math.PI / 2;
  const methLabelX = cx + labelRadius * Math.cos(-Math.PI / 2);
  const methLabelY = cy + labelRadius * Math.sin(-Math.PI / 2);
  // Quan ≈ slice 8 (lower-left), Tài ≈ slice 2 (upper-right).
  const quanLabelX = cx + labelRadius * Math.cos(cungLabelAngle(8));
  const quanLabelY = cy + labelRadius * Math.sin(cungLabelAngle(8));
  const taiLabelX = cx + labelRadius * Math.cos(cungLabelAngle(2));
  const taiLabelY = cy + labelRadius * Math.sin(cungLabelAngle(2));

  return (
    <svg
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Sơ đồ 12 cung lá số tử vi — mỗi cung là một lĩnh vực đời sống"
      className={className}
    >
      {/* ── STRUCTURAL LAYER: foreground colour (ink day / bone night) ── */}
      <g className="text-foreground">
        {/* Outer hairline edge — stays faint */}
        <circle
          cx={cx}
          cy={cy}
          r={rOuterEdge}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.15"
          strokeWidth="0.5"
        />
        {/* Main outer ring — raised to anchor weight */}
        <circle
          cx={cx}
          cy={cy}
          r={rOuter}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.7"
          strokeWidth="1.75"
        />

        {/* Main inner ring — raised to anchor weight */}
        <circle
          cx={cx}
          cy={cy}
          r={rInner}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.7"
          strokeWidth="1.75"
        />
        {/* Inner hairline edge — stays faint */}
        <circle
          cx={cx}
          cy={cy}
          r={rInnerEdge}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.15"
          strokeWidth="0.5"
        />

        {/* 12 cung dividers — raised from 0.22 to 0.65 */}
        {dividers.map((d, i) => (
          <line
            key={`divider-${i}`}
            x1={d.x1}
            y1={d.y1}
            x2={d.x2}
            y2={d.y2}
            stroke="currentColor"
            strokeOpacity="0.55"
            strokeWidth="1.25"
          />
        ))}
      </g>

      {/* ── ACCENT LAYER: ochre / gold-soft (inherits text-primary from parent) ── */}

      {/* Cung Mệnh sector fill — top slice at ~35% opacity */}
      <path
        d={methArcPath}
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="1.25"
      />

      {/* 12 cung markers at slice centers */}
      {cungMarkers.map((m, i) => (
        <circle
          key={`cung-${i}`}
          cx={m.cx}
          cy={m.cy}
          r="1.2"
          fill="currentColor"
          fillOpacity="0.45"
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

      {/* Cung Mệnh label — readable at mid-radius of the top slice */}
      <text
        x={methLabelX}
        y={methLabelY + 5}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="8"
        fontFamily="var(--font-be-vietnam), system-ui, sans-serif"
        letterSpacing="0.12em"
        fill="currentColor"
        fillOpacity="0.9"
      >
        Mệnh
      </text>

      {/* Faint cung labels — gesture "12-palace map" for newcomers */}
      {/* Quan = cungMarkers[8] (~8 o'clock, lower-left quadrant) */}
      <text
        x={quanLabelX}
        y={quanLabelY + 4}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="7"
        fontFamily="var(--font-be-vietnam), system-ui, sans-serif"
        fill="currentColor"
        fillOpacity="0.3"
      >
        Quan
      </text>
      {/* Tài = cungMarkers[2] (~2 o'clock, upper-right quadrant) */}
      <text
        x={taiLabelX}
        y={taiLabelY + 4}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="7"
        fontFamily="var(--font-be-vietnam), system-ui, sans-serif"
        fill="currentColor"
        fillOpacity="0.3"
      >
        Tài
      </text>

      {/* Center anchor — small filled dot + MỆNH mono caption */}
      <circle cx={cx} cy={cy} r="3" fill="currentColor" fillOpacity="0.85" />
      <text
        x={cx}
        y={cy + 22}
        textAnchor="middle"
        fontSize="9"
        fontFamily="var(--font-be-vietnam), system-ui, sans-serif"
        letterSpacing="0.18em"
        fill="currentColor"
        fillOpacity="0.55"
      >
        MỆNH
      </text>
    </svg>
  );
}
