import * as React from 'react';
import { ZODIAC, type NatalChart } from '@/lib/western-astrology';

/**
 * Bánh xe bản đồ sao (natal wheel) — vẽ tay bằng SVG, không thư viện ngoài.
 *
 * Vì sao tự vẽ (không dùng @astrodraw/astrochart...): khớp đúng bảng màu
 * "giấy cũ / vàng" của brand, kiểm soát hoàn toàn typography, và quan trọng
 * nhất — MỌI vị trí vẽ ra đều là kinh độ hoàng đạo THẬT đã tính & kiểm chứng
 * (Meeus, sai số <0.06°), đúng lời hứa "con số là thật". Cùng họ với
 * `la-so-svg.tsx` (lá số Tử Vi vẽ tay).
 *
 * Bố cục theo quy ước chiêm tinh Tây:
 *   - Cung Mọc (Ascendant) đặt ở mép TRÁI (9 giờ = chân trời đông). Nếu chưa
 *     có nơi sinh → mặc định 0° Bạch Dương ở trái.
 *   - Kinh độ tăng dần NGƯỢC chiều kim đồng hồ (chuẩn natal).
 *   - Vành ngoài: 12 cung (mỗi 30°), tô nhạt theo nguyên tố; biểu tượng cung.
 *   - Vành trong: 10 thiên thể (Mặt Trời, Mặt Trăng, cung Mọc, 7 hành tinh)
 *     đặt đúng kinh độ, có vạch dẫn tới vị trí thật; tự né khi sát nhau.
 *
 * Pure SVG, server-component safe (không state/hook, không asset ngoài).
 * Theming: nét cấu trúc dùng `currentColor` (text-foreground); điểm nhấn
 * (thiên thể, biểu tượng) bọc trong nhóm `text-gold`.
 */

const DEG = Math.PI / 180;

// Màu nền nhạt theo nguyên tố — alpha thấp để đọc tốt trên cả nền giấy lẫn tối.
const ELEMENT_TINT: Record<string, string> = {
  Lửa: 'rgba(193, 96, 58, 0.10)', // đất nung
  Đất: 'rgba(140, 112, 58, 0.10)', // hoàng thổ
  Khí: 'rgba(120, 138, 150, 0.10)', // xám lam
  Nước: 'rgba(72, 110, 140, 0.10)', // chàm nhạt
};

type Body = {
  glyph: string;
  name: string;
  lon: number;
  emphasis: 'sun' | 'moon' | 'asc' | 'planet';
};

export function NatalWheel({ chart, className }: { chart: NatalChart; className?: string }) {
  const size = 360;
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = 170; // mép ngoài cùng
  const rBandInner = 144; // mép trong dải cung (vùng tô nguyên tố nằm giữa rBandInner..rOuter)
  const rSignGlyph = 157; // bán kính đặt biểu tượng cung
  const rTick = 144; // vạch độ ở mép trong dải cung
  const rBodyRing = 116; // bán kính gốc đặt thiên thể
  const rInner = 84; // vòng tròn trong (hub)

  // Cung Mọc ở trái. Kinh độ tăng ngược chiều kim đồng hồ.
  const asc = chart.ascendant?.longitude ?? 0;
  const pt = (lon: number, r: number) => {
    const a = Math.PI + (lon - asc) * DEG; // asc → π (trái); lon tăng → a tăng (CCW)
    return { x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) };
  };

  // Đường annular-sector cho 1 cung [lon1, lon2], bán kính [rIn, rOut].
  const sectorPath = (lon1: number, lon2: number, rIn: number, rOut: number) => {
    const a = pt(lon1, rOut);
    const b = pt(lon2, rOut);
    const c = pt(lon2, rIn);
    const d = pt(lon1, rIn);
    // 30° < 180° → large-arc=0. lon tăng = CCW = sweep 0 (vòng ngoài); vòng trong đi ngược = sweep 1.
    return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${rOut} ${rOut} 0 0 0 ${b.x.toFixed(2)} ${b.y.toFixed(2)} L ${c.x.toFixed(2)} ${c.y.toFixed(2)} A ${rIn} ${rIn} 0 0 1 ${d.x.toFixed(2)} ${d.y.toFixed(2)} Z`;
  };

  // Thu thập thiên thể.
  const bodies: Body[] = [
    { glyph: '☉', name: `Mặt Trời ${chart.sun.sign.name}`, lon: chart.sun.longitude, emphasis: 'sun' },
    { glyph: '☽', name: `Mặt Trăng ${chart.moon.sign.name}`, lon: chart.moon.longitude, emphasis: 'moon' },
    ...chart.planets.map((p): Body => ({
      glyph: p.planet.symbol,
      name: `${p.planet.name} ${p.position.sign.name}`,
      lon: p.position.longitude,
      emphasis: 'planet',
    })),
  ];
  if (chart.ascendant) {
    bodies.push({ glyph: 'Asc', name: `Cung Mọc ${chart.ascendant.sign.name}`, lon: chart.ascendant.longitude, emphasis: 'asc' });
  }

  // Né va chạm: sắp theo kinh độ; mỗi lá sát lá LIỀN TRƯỚC (<minSep) thì lùi
  // vào trong sâu thêm 1 nấc — CHUỖI khoảng-cách-liền-kề, nên cụm 3+ sao
  // (stellium) vẫn được tách bán kính riêng từng lá, không trùng. Hết cụm
  // (gặp một khoảng ≥minSep) thì reset về nấc gốc.
  const minSep = 9;
  const rStep = 17;
  const sorted = [...bodies].sort((m, n) => m.lon - n.lon);
  const placed = sorted.map((b) => ({ ...b, r: rBodyRing }));
  let depth = 0;
  for (let i = 1; i < placed.length; i++) {
    depth = placed[i]!.lon - placed[i - 1]!.lon < minSep ? depth + 1 : 0;
    placed[i]!.r = rBodyRing - depth * rStep;
  }

  // Đường nối góc (aspect lines): nối kinh độ 2 thiên thể qua tâm. Dùng đúng
  // chart.aspects ĐÃ TÍNH (góc thật + orb), tô màu theo tính chất. Bỏ "trùng tụ"
  // (0° ~ cùng điểm, không thành đường). Tên trong aspects là canonical
  // ('Mặt Trời'/'Mặt Trăng'/tên hành tinh) → tra kinh độ theo tên đó.
  const lonByName: Record<string, number> = {
    'Mặt Trời': chart.sun.longitude,
    'Mặt Trăng': chart.moon.longitude,
  };
  for (const p of chart.planets) lonByName[p.planet.name] = p.position.longitude;
  const TENSE = new Set(['square', 'opposition']);
  const aspectLines = (chart.aspects ?? [])
    .filter((a) => a.aspect !== 'conjunction')
    .map((a) => ({ a: lonByName[a.bodyA], b: lonByName[a.bodyB], tense: TENSE.has(a.aspect) }))
    .filter((x): x is { a: number; b: number; tense: boolean } => x.a != null && x.b != null);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label="Bánh xe bản đồ sao — 12 cung hoàng đạo với vị trí Mặt Trời, Mặt Trăng và các hành tinh"
    >
      {/* ── Nền nguyên tố theo cung ── */}
      <g>
        {ZODIAC.map((s) => (
          <path key={`tint-${s.idx}`} d={sectorPath(s.idx * 30, s.idx * 30 + 30, rBandInner, rOuter)} fill={ELEMENT_TINT[s.element]} />
        ))}
      </g>

      {/* ── Cấu trúc: vòng + nan + vạch độ (text-foreground) ── */}
      <g className="text-foreground" stroke="currentColor" fill="none">
        <circle cx={cx} cy={cy} r={rOuter} strokeOpacity={0.5} strokeWidth={1.25} />
        <circle cx={cx} cy={cy} r={rBandInner} strokeOpacity={0.35} strokeWidth={1} />
        <circle cx={cx} cy={cy} r={rInner} strokeOpacity={0.3} strokeWidth={1} />
        {/* 12 nan chia cung */}
        {ZODIAC.map((s) => {
          const p1 = pt(s.idx * 30, rInner);
          const p2 = pt(s.idx * 30, rOuter);
          return <line key={`div-${s.idx}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} strokeOpacity={0.28} strokeWidth={1} />;
        })}
        {/* vạch độ mỗi 10° */}
        {Array.from({ length: 36 }, (_, i) => {
          const lon = i * 10;
          const inner = pt(lon, rTick);
          const outer = pt(lon, i % 3 === 0 ? rTick + 7 : rTick + 4);
          return <line key={`tick-${i}`} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} strokeOpacity={0.3} strokeWidth={0.75} />;
        })}
      </g>

      {/* ── Biểu tượng 12 cung (text-gold) ── */}
      <g className="text-gold" fill="currentColor">
        {ZODIAC.map((s) => {
          const p = pt(s.idx * 30 + 15, rSignGlyph);
          return (
            <text key={`sign-${s.idx}`} x={p.x} y={p.y} fontSize={15} textAnchor="middle" dominantBaseline="central" fillOpacity={0.85}>
              {s.symbol}
            </text>
          );
        })}
      </g>

      {/* ── Trục chân trời (Mọc–Lặn) làm điểm tựa ── */}
      <g className="text-gold" stroke="currentColor">
        <line x1={cx - rOuter} y1={cy} x2={cx - rInner} y2={cy} strokeOpacity={0.45} strokeWidth={1.25} strokeDasharray="2 3" />
        {chart.ascendant && (
          <line x1={cx + rInner} y1={cy} x2={cx + rOuter} y2={cy} strokeOpacity={0.25} strokeWidth={1} strokeDasharray="2 3" />
        )}
      </g>

      {/* ── Đường nối góc (aspect lines) trong vòng trong ── */}
      <g>
        {aspectLines.map((ln, i) => {
          const p1 = pt(ln.a, rInner);
          const p2 = pt(ln.b, rInner);
          return (
            <line
              key={`asp-${i}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={ln.tense ? 'rgba(176, 73, 44, 0.45)' : 'currentColor'}
              className={ln.tense ? undefined : 'text-gold'}
              strokeOpacity={ln.tense ? undefined : 0.32}
              strokeWidth={0.9}
            />
          );
        })}
      </g>

      {/* ── Thiên thể: vạch dẫn + chấm + biểu tượng ── */}
      <g className="text-gold">
        {placed.map((b, i) => {
          const onBand = pt(b.lon, rBandInner); // vị trí THẬT trên dải cung
          const dot = pt(b.lon, b.r);
          const big = b.emphasis === 'sun' || b.emphasis === 'moon';
          return (
            <g key={`body-${i}`}>
              {/* vạch dẫn từ chấm tới kinh độ thật */}
              <line x1={dot.x} y1={dot.y} x2={onBand.x} y2={onBand.y} stroke="currentColor" strokeOpacity={0.3} strokeWidth={0.75} />
              <circle cx={dot.x} cy={dot.y} r={big ? 13 : 11} fill="var(--background, #fff)" stroke="currentColor" strokeOpacity={0.5} strokeWidth={1} />
              {b.emphasis === 'asc' ? (
                <text x={dot.x} y={dot.y} fontSize={8} textAnchor="middle" dominantBaseline="central" fill="currentColor" fontWeight={600}>
                  Asc
                </text>
              ) : (
                <text x={dot.x} y={dot.y} fontSize={big ? 15 : 13} textAnchor="middle" dominantBaseline="central" fill="currentColor">
                  {b.glyph}
                </text>
              )}
            </g>
          );
        })}
      </g>

      {/* ── Hub trung tâm: tam trụ (Mặt Trời · Trăng · Mọc) ── */}
      <g>
        <text x={cx} y={cy - 12} textAnchor="middle" dominantBaseline="central" fontSize={20} className="text-gold" fill="currentColor">
          {chart.sun.sign.symbol}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" dominantBaseline="central" fontSize={9} className="text-foreground" fill="currentColor" fillOpacity={0.6}>
          ☉ {chart.sun.sign.name}
        </text>
      </g>
    </svg>
  );
}
