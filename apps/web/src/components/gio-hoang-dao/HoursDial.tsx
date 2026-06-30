import * as React from 'react';
import type { HourInfo } from '@/lib/gio-hoang-dao';

/**
 * Đồng hồ 12 canh giờ — SVG thuần, 0 dep, server-component safe (không hook).
 *
 * Vẽ 12 canh giờ (Tý, Sửu, Dần… Hợi) thành 12 cung quanh một vòng tròn, mỗi
 * cung tô màu theo trạng thái GIỜ HOÀNG ĐẠO (tốt) hay HẮC ĐẠO (nên tránh) của
 * NGÀY đang chọn, và đánh dấu canh giờ HIỆN TẠI. 100% dữ liệu từ engine
 * `computeGioHoangDao` (lib/gio-hoang-dao.ts) — không bịa, không tự tính lại.
 *
 * Cùng họ với `ban-do-sao/NatalWheel.tsx` và `la-so-svg.tsx`: nét cấu trúc
 * dùng `currentColor` (text-foreground); điểm nhấn bọc trong nhóm text-gold;
 * vùng tô dùng rgba alpha thấp đọc tốt trên CẢ nền giấy lẫn nền tối.
 *
 * Bố cục như mặt đồng hồ: canh Tý (23h–1h) ở đỉnh (12 giờ), các canh xếp
 * THEO CHIỀU KIM ĐỒNG HỒ — Sửu, Dần… giống thứ tự giờ tăng dần trong ngày.
 */

const DEG = Math.PI / 180;

// Tô nền cung — alpha thấp để đọc tốt trên cả nền giấy lẫn tối.
const TINT_GOOD = 'rgba(193, 154, 58, 0.16)'; // vàng kim (hoàng đạo)
const TINT_BAD = 'rgba(120, 120, 120, 0.08)'; // xám trung tính (hắc đạo)
const TINT_ACTIVE = 'rgba(193, 154, 58, 0.30)'; // canh giờ hiện tại — đậm hơn

export function HoursDial({
  hours,
  activeIndex,
  className,
}: {
  /** 12 canh giờ THẬT từ engine (result.hours). */
  hours: HourInfo[];
  /** Chỉ số canh giờ hiện tại (0=Tý…11=Hợi), -1 nếu không đánh dấu. */
  activeIndex?: number;
  className?: string;
}) {
  const size = 360;
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = 168;
  const rInner = 78; // hub
  const rChi = 142; // bán kính đặt tên chi
  const rRange = 122; // bán kính đặt khung giờ
  const seg = 30; // 360/12

  // Canh i đặt sao cho TÂM cung nằm đúng "vị trí giờ": Tý ở đỉnh (12 giờ),
  // xếp theo chiều kim đồng hồ. Trên SVG y hướng xuống nên CW = góc tăng theo
  // công thức dưới. Tâm cung i ở góc (đỉnh = -90°), cung trải ±15° quanh tâm.
  const angleAt = (i: number) => -90 + i * seg; // độ; đỉnh = -90 (12 giờ)
  const pt = (deg: number, r: number) => {
    const a = deg * DEG;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  // Đường annular-sector cho cung canh i (tâm tại angleAt(i), rộng ±15°).
  const sectorPath = (i: number, rIn: number, rOut: number) => {
    const a0 = angleAt(i) - seg / 2;
    const a1 = angleAt(i) + seg / 2;
    const o0 = pt(a0, rOut);
    const o1 = pt(a1, rOut);
    const i1 = pt(a1, rIn);
    const i0 = pt(a0, rIn);
    // 30° < 180° → large-arc=0. Góc tăng = CW (sweep 1) vòng ngoài; vòng trong đi ngược (sweep 0).
    return `M ${o0.x.toFixed(2)} ${o0.y.toFixed(2)} A ${rOut} ${rOut} 0 0 1 ${o1.x.toFixed(2)} ${o1.y.toFixed(2)} L ${i1.x.toFixed(2)} ${i1.y.toFixed(2)} A ${rIn} ${rIn} 0 0 0 ${i0.x.toFixed(2)} ${i0.y.toFixed(2)} Z`;
  };

  const active = typeof activeIndex === 'number' ? activeIndex : -1;
  const goodCount = hours.filter((h) => h.good).length;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label={`Đồng hồ 12 canh giờ: ${goodCount} giờ hoàng đạo (tô vàng) và ${12 - goodCount} giờ hắc đạo trong ngày`}
    >
      {/* ── Nền tô theo trạng thái từng canh ── */}
      <g>
        {hours.map((h, i) => (
          <path
            key={`tint-${h.branch}`}
            d={sectorPath(i, rInner, rOuter)}
            fill={i === active ? TINT_ACTIVE : h.good ? TINT_GOOD : TINT_BAD}
          />
        ))}
      </g>

      {/* ── Cấu trúc: vòng + nan chia cung (text-foreground) ── */}
      <g className="text-foreground" stroke="currentColor" fill="none">
        <circle cx={cx} cy={cy} r={rOuter} strokeOpacity={0.5} strokeWidth={1.25} />
        <circle cx={cx} cy={cy} r={rInner} strokeOpacity={0.3} strokeWidth={1} />
        {hours.map((h, i) => {
          const a = angleAt(i) - seg / 2;
          const p1 = pt(a, rInner);
          const p2 = pt(a, rOuter);
          return (
            <line
              key={`div-${h.branch}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              strokeOpacity={0.25}
              strokeWidth={1}
            />
          );
        })}
      </g>

      {/* ── Viền nổi bật cho canh giờ hiện tại (text-gold) ── */}
      {active >= 0 && active < hours.length && (
        <path
          d={sectorPath(active, rInner, rOuter)}
          className="text-gold"
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.85}
          strokeWidth={2}
        />
      )}

      {/* ── Nhãn từng canh: tên chi + khung giờ ── */}
      <g>
        {hours.map((h, i) => {
          const chi = pt(angleAt(i), rChi);
          const range = pt(angleAt(i), rRange);
          const isActive = i === active;
          return (
            <g key={`label-${h.branch}`}>
              <text
                x={chi.x}
                y={chi.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={isActive ? 16 : 14}
                fontWeight={h.good || isActive ? 600 : 400}
                className={h.good || isActive ? 'text-gold' : 'text-foreground'}
                fill="currentColor"
                fillOpacity={h.good || isActive ? 0.95 : 0.6}
              >
                {h.branch}
              </text>
              <text
                x={range.x}
                y={range.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={9}
                fontFamily="var(--font-be-vietnam), system-ui, sans-serif"
                className="text-foreground"
                fill="currentColor"
                fillOpacity={0.55}
              >
                {h.range}
              </text>
            </g>
          );
        })}
      </g>

      {/* ── Hub trung tâm: số giờ tốt ── */}
      <g>
        <text
          x={cx}
          y={cy - 11}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={26}
          fontWeight={700}
          className="text-gold"
          fill="currentColor"
        >
          {goodCount}
        </text>
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={9}
          className="text-foreground"
          fill="currentColor"
          fillOpacity={0.6}
        >
          giờ hoàng đạo
        </text>
      </g>
    </svg>
  );
}
