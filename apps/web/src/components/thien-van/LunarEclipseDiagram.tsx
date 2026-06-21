import * as React from 'react';

/**
 * Hình minh họa nguyệt thực toàn phần ("trăng máu") — SVG thuần, 0 dep.
 *
 * Vẽ đúng hiện tượng: Mặt Trăng đi vào BÓNG TỐI (umbra) của Trái Đất; ở pha
 * toàn phần, ánh sáng Mặt Trời khúc xạ qua khí quyển nhuộm Trăng đỏ đồng.
 * Hình học (không phải số liệu giả) — minh hoạ khái niệm, không "che X%"
 * (nguyệt thực toàn phần không có chỉ số % như nhật thực → không bịa con số).
 *
 * Bố cục: vầng nửa tối (penumbra) → bóng tối (umbra) → Trăng đỏ ở tâm, kèm
 * hai "bóng mờ" hai bên gợi quỹ đạo Trăng đi qua. Màu đỏ đồng đọc tốt trên
 * cả nền giấy lẫn nền tối.
 */
export function LunarEclipseDiagram({ className }: { className?: string }) {
  const w = 560;
  const h = 220;
  const cx = 280;
  const cy = 110;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} role="img" aria-label="Minh họa nguyệt thực toàn phần: Mặt Trăng đi vào bóng tối Trái Đất và chuyển màu đỏ đồng">
      <defs>
        <radialGradient id="le-umbra" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0b0a14" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#0b0a14" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#0b0a14" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="le-penumbra" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1726" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#1a1726" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="le-blood" cx="42%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#d8794e" />
          <stop offset="55%" stopColor="#b0492c" />
          <stop offset="100%" stopColor="#6e2614" />
        </radialGradient>
        <radialGradient id="le-pale" cx="40%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#efe7d2" />
          <stop offset="100%" stopColor="#cdbfa0" />
        </radialGradient>
      </defs>

      {/* Quỹ đạo Trăng (hướng đi qua bóng) */}
      <line x1={44} y1={cy} x2={w - 44} y2={cy} stroke="currentColor" className="text-gold" strokeOpacity={0.25} strokeWidth={1} strokeDasharray="2 4" />

      {/* Penumbra (nửa tối) + Umbra (bóng tối) */}
      <circle cx={cx} cy={cy} r={104} fill="url(#le-penumbra)" />
      <circle cx={cx} cy={cy} r={82} fill="url(#le-umbra)" />

      {/* Bóng mờ hai bên: Trăng trước & sau khi vào bóng */}
      <circle cx={92} cy={cy} r={22} fill="url(#le-pale)" opacity={0.4} />
      <circle cx={w - 92} cy={cy} r={22} fill="url(#le-pale)" opacity={0.4} />

      {/* Trăng máu ở tâm (pha toàn phần) */}
      <circle cx={cx} cy={cy} r={38} fill="url(#le-blood)" />
      {/* viền sáng mảnh (ánh khúc xạ rìa) */}
      <circle cx={cx} cy={cy} r={38} fill="none" stroke="#e9a17a" strokeOpacity={0.5} strokeWidth={1} />

      {/* Nhãn nhỏ các pha */}
      <g className="text-foreground" fill="currentColor" fillOpacity={0.5} fontSize={10} textAnchor="middle">
        <text x={92} y={cy + 40}>vào bóng</text>
        <text x={cx} y={cy + 64} fillOpacity={0.7} fontSize={11}>toàn phần · trăng máu</text>
        <text x={w - 92} y={cy + 40}>ra khỏi bóng</text>
      </g>
    </svg>
  );
}
