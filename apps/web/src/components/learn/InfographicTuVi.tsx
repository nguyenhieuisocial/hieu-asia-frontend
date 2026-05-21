'use client';

import * as React from 'react';

interface CungData {
  name: string;
  desc: string;
}

const CUNG_12: readonly CungData[] = [
  { name: 'Mệnh', desc: 'Bản thân, định hướng đời' },
  { name: 'Phụ Mẫu', desc: 'Quan hệ cha mẹ, gia đình' },
  { name: 'Phúc Đức', desc: 'Phước lành, di truyền' },
  { name: 'Điền Trạch', desc: 'Nhà cửa, tài sản' },
  { name: 'Quan Lộc', desc: 'Sự nghiệp, công danh' },
  { name: 'Nô Bộc', desc: 'Bạn bè, cấp dưới' },
  { name: 'Thiên Di', desc: 'Di chuyển, ra ngoài' },
  { name: 'Tật Ách', desc: 'Sức khỏe, bệnh tật' },
  { name: 'Tài Bạch', desc: 'Tiền bạc, vật chất' },
  { name: 'Tử Tức', desc: 'Con cái' },
  { name: 'Phu Thê', desc: 'Vợ chồng, tình cảm' },
  { name: 'Huynh Đệ', desc: 'Anh em, đồng sự' },
];

export function InfographicTuVi() {
  const [active, setActive] = React.useState<number>(0);
  const size = 520;
  const center = size / 2;
  const outerR = 230;
  const innerR = 130;

  const sectors = CUNG_12.map((cung, i) => {
    const startAngle = (i * 30 - 90 - 15) * (Math.PI / 180);
    const endAngle = (i * 30 - 90 + 15) * (Math.PI / 180);
    const x1 = center + innerR * Math.cos(startAngle);
    const y1 = center + innerR * Math.sin(startAngle);
    const x2 = center + outerR * Math.cos(startAngle);
    const y2 = center + outerR * Math.sin(startAngle);
    const x3 = center + outerR * Math.cos(endAngle);
    const y3 = center + outerR * Math.sin(endAngle);
    const x4 = center + innerR * Math.cos(endAngle);
    const y4 = center + innerR * Math.sin(endAngle);
    const labelAngle = (i * 30 - 90) * (Math.PI / 180);
    const labelR = (outerR + innerR) / 2;
    const lx = center + labelR * Math.cos(labelAngle);
    const ly = center + labelR * Math.sin(labelAngle);
    return {
      path: `M ${x1} ${y1} L ${x2} ${y2} A ${outerR} ${outerR} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerR} ${innerR} 0 0 0 ${x1} ${y1} Z`,
      lx,
      ly,
      cung,
      idx: i,
    };
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full max-w-[520px]"
        role="img"
        aria-label="Sơ đồ 12 cung Tử Vi"
      >
        <defs>
          <radialGradient id="tv-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3B2754" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0E0E0F" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={center} cy={center} r={outerR + 10} fill="url(#tv-bg)" />
        {sectors.map((s) => (
          <g key={s.idx}>
            <path
              d={s.path}
              fill={active === s.idx ? '#B8923D' : '#1A1A1C'}
              fillOpacity={active === s.idx ? 0.45 : 0.6}
              stroke="#B8923D"
              strokeOpacity={0.5}
              strokeWidth={1}
              className="cursor-pointer transition-all"
              onClick={() => setActive(s.idx)}
            />
            <text
              x={s.lx}
              y={s.ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="13"
              fontWeight="600"
              fill={active === s.idx ? '#F5EFE0' : '#D8CDB1'}
              className="pointer-events-none select-none"
            >
              {s.cung.name}
            </text>
          </g>
        ))}
        <circle cx={center} cy={center} r={innerR - 6} fill="#0E0E0F" stroke="#B8923D" strokeOpacity={0.4} />
        <text
          x={center}
          y={center - 12}
          textAnchor="middle"
          fontSize="18"
          fontWeight="700"
          fill="#B8923D"
        >
          {CUNG_12[active]!.name}
        </text>
        <foreignObject x={center - 100} y={center + 4} width={200} height={80}>
          <div className="text-center text-xs leading-snug text-cream/80">
            {CUNG_12[active]!.desc}
          </div>
        </foreignObject>
      </svg>
      <div className="grid grid-cols-2 gap-1.5 text-xs sm:grid-cols-3 md:grid-cols-4">
        {CUNG_12.map((c, i) => (
          <button
            key={c.name}
            type="button"
            onClick={() => setActive(i)}
            className={`rounded border px-2 py-1 text-left transition-colors ${
              active === i
                ? 'border-gold bg-gold/10 text-gold'
                : 'border-cream/15 text-cream/70 hover:border-gold/40'
            }`}
          >
            <span className="font-semibold">{c.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
