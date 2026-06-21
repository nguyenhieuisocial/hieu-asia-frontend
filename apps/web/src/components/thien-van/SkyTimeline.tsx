import * as React from 'react';
import { SKY_EVENTS, kindMeta, type SkyEvent } from '@/lib/sky-events';

/**
 * Dòng thời gian thiên văn 2026–2030 — SVG thuần, 0 dep, server-safe.
 *
 * Tổng quan QUÉT-NHANH đặt trên các danh sách chữ: mỗi sự kiện = 1 dấu mốc
 * đặt theo NGÀY thật dọc trục năm. Vị trí suy ra TỪ chuỗi `dateVN` đã tính sẵn
 * trong dữ liệu (parse năm/tháng/ngày) — KHÔNG `new Date()`/`Date.now()`, nên
 * render giống hệt trên máy chủ lẫn trình duyệt, không lệch múi giờ.
 *
 * Phân biệt loại bằng HÌNH + MÀU (đọc tốt cả nền giấy lẫn nền tối, alpha thấp):
 *   - Nguyệt thực  → chấm tròn đỏ đồng (cùng "trăng máu" của hero).
 *   - Nhật thực    → hình thoi vàng (điểm nhấn brand).
 *   - Phân & chí   → vạch dọc xám-lam mảnh (nhịp mùa, nền chứ không nổi).
 *
 * Không gắn nhãn chữ mỗi mốc (≈26 sự kiện → rối). Dấu mốc + chú giải + mốc năm
 * là đủ; mỗi mốc có <title> để rê chuột xem chi tiết.
 */

const DAY_MS = 86_400_000;

/** "2026-03-20 21:45" → {year, ms-since-year-start} dùng để đặt vị trí. KHÔNG dùng Date. */
function parseVNDate(dateVN: string): { year: number; dayOfYear: number } {
  const datePart = dateVN.split(' ')[0] ?? '';
  const [y = '0', m = '1', d = '1'] = datePart.split('-');
  const year = Number(y);
  const month = Number(m); // 1..12
  const day = Number(d);
  // Ngày-trong-năm gần đúng (đủ để đặt mốc; không cần chính xác giờ/phút).
  const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const cum = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const dayOfYear = (cum[month - 1] ?? 0) + (leap && month > 2 ? 1 : 0) + (day - 1);
  return { year, dayOfYear };
}

/** Vị trí 0..1 dọc trục [minYear .. maxYear+1). */
function fracOf(dateVN: string, minYear: number, span: number): number {
  const { year, dayOfYear } = parseVNDate(dateVN);
  const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const yearLen = leap ? 366 : 365;
  return (year - minYear + dayOfYear / yearLen) / span;
}

type Marker = {
  e: SkyEvent;
  cx: number;
  title: string;
};

export function SkyTimeline({ className }: { className?: string }) {
  // Trục co theo dữ liệu thật: minYear → maxYear (bao trọn cả năm cuối).
  const years = SKY_EVENTS.map((e) => parseVNDate(e.dateVN).year);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const span = maxYear - minYear + 1; // số năm trục phủ (vd 2026..2030 → 5)

  const w = 720;
  const h = 132;
  const padX = 28;
  const axisY = 74;
  const innerW = w - padX * 2;
  const x = (frac: number) => padX + frac * innerW;

  const markers: Marker[] = SKY_EVENTS.map((e) => {
    const meta = kindMeta(e);
    const datePart = (e.dateVN.split(' ')[0] ?? '').split('-');
    const dmy = `${datePart[2] ?? ''}/${datePart[1] ?? ''}/${datePart[0] ?? ''}`;
    // Nguyệt thực KHÔNG show %; chỉ nhật thực có obscuration.
    const pct = e.type === 'solar' && e.obscuration != null ? ` · che ~${e.obscuration}%` : '';
    return {
      e,
      cx: x(fracOf(e.dateVN, minYear, span)),
      title: `${meta.label} — ${dmy} (giờ VN)${pct}`,
    };
  });

  // Mốc năm: vạch dọc + nhãn ở ĐẦU mỗi năm.
  const yearTicks = Array.from({ length: span }, (_, i) => {
    const yr = minYear + i;
    return { yr, cx: x(i / span) };
  });

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      role="img"
      aria-label={`Dòng thời gian các sự kiện thiên văn ${minYear}–${maxYear}: nguyệt thực, nhật thực và bốn điểm phân – chí`}
    >
      {/* ── Lưới năm: vạch dọc mảnh + nhãn năm ── */}
      <g className="text-foreground">
        {yearTicks.map(({ yr, cx }) => (
          <g key={`yr-${yr}`}>
            <line x1={cx} y1={axisY - 28} x2={cx} y2={axisY + 14} stroke="currentColor" strokeOpacity={0.16} strokeWidth={1} />
            <text x={cx + 4} y={axisY + 28} fontSize={12} fill="currentColor" fillOpacity={0.55} className="font-mono">
              {yr}
            </text>
          </g>
        ))}
        {/* vạch cuối khép trục */}
        <line x1={x(1)} y1={axisY - 28} x2={x(1)} y2={axisY + 14} stroke="currentColor" strokeOpacity={0.16} strokeWidth={1} />
      </g>

      {/* ── Trục chính ── */}
      <line x1={padX} y1={axisY} x2={w - padX} y2={axisY} stroke="currentColor" className="text-gold" strokeOpacity={0.35} strokeWidth={1.25} />

      {/* ── Dấu mốc theo loại ── */}
      <g>
        {markers.map((mk, i) => {
          const { e, cx } = mk;
          if (e.type === 'season') {
            // Phân & chí: vạch dọc xám-lam mảnh (nhịp nền).
            return (
              <g key={`mk-${i}`}>
                <title>{mk.title}</title>
                <line x1={cx} y1={axisY - 12} x2={cx} y2={axisY + 12} stroke="rgba(96,120,138,0.85)" strokeWidth={1.75} strokeLinecap="round" />
              </g>
            );
          }
          if (e.type === 'solar') {
            // Nhật thực: hình thoi vàng (điểm nhấn brand).
            const r = 6;
            return (
              <g key={`mk-${i}`}>
                <title>{mk.title}</title>
                <path
                  d={`M ${cx} ${axisY - r} L ${cx + r} ${axisY} L ${cx} ${axisY + r} L ${cx - r} ${axisY} Z`}
                  fill="rgba(184,146,61,0.95)"
                  stroke="var(--background, #fff)"
                  strokeWidth={1}
                />
              </g>
            );
          }
          // Nguyệt thực: chấm tròn đỏ đồng ("trăng máu").
          return (
            <g key={`mk-${i}`}>
              <title>{mk.title}</title>
              <circle cx={cx} cy={axisY} r={5.5} fill="rgba(176,73,44,0.95)" stroke="var(--background, #fff)" strokeWidth={1} />
            </g>
          );
        })}
      </g>

      {/* ── Chú giải ── */}
      <g className="text-foreground" fontSize={12} fill="currentColor">
        <g transform={`translate(${padX}, ${h - 14})`}>
          <circle cx={6} cy={-4} r={5.5} fill="rgba(176,73,44,0.95)" />
          <text x={18} y={0} fillOpacity={0.75}>Nguyệt thực</text>
        </g>
        <g transform={`translate(${padX + 130}, ${h - 14})`}>
          <path d="M 6 -10 L 12 -4 L 6 2 L 0 -4 Z" fill="rgba(184,146,61,0.95)" />
          <text x={20} y={0} fillOpacity={0.75}>Nhật thực</text>
        </g>
        <g transform={`translate(${padX + 248}, ${h - 14})`}>
          <line x1={6} y1={-11} x2={6} y2={3} stroke="rgba(96,120,138,0.85)" strokeWidth={1.75} strokeLinecap="round" />
          <text x={18} y={0} fillOpacity={0.75}>Phân &amp; chí</text>
        </g>
      </g>
    </svg>
  );
}
