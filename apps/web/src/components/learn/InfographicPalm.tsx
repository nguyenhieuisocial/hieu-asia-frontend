'use client';

import * as React from 'react';

interface PalmLine {
  id: string;
  name: string;
  desc: string;
  path: string;
  color: string;
}

const LINES: readonly PalmLine[] = [
  {
    id: 'heart',
    name: 'Đường tâm đạo (Heart line)',
    desc: 'Phản ánh đời sống tình cảm, khả năng yêu và kết nối cảm xúc.',
    path: 'M 60 110 Q 140 80 240 100',
    color: '#E07B7B',
  },
  {
    id: 'head',
    name: 'Đường trí đạo (Head line)',
    desc: 'Phản ánh tư duy, cách ra quyết định, sự logic hay sáng tạo.',
    path: 'M 70 160 Q 150 145 230 175',
    color: '#7BB6E0',
  },
  {
    id: 'life',
    name: 'Đường sinh đạo (Life line)',
    desc: 'Phản ánh sức sống, sức khỏe tổng thể và những biến động lớn trong đời.',
    path: 'M 80 130 Q 60 220 110 320',
    color: '#7BC9A8',
  },
  {
    id: 'fate',
    name: 'Đường số mệnh (Fate line)',
    desc: 'Phản ánh sự nghiệp, định hướng và những bước ngoặt nghề nghiệp.',
    path: 'M 165 320 Q 160 220 155 100',
    color: '#B8923D',
  },
  {
    id: 'sun',
    name: 'Đường Mặt Trời (Sun line)',
    desc: 'Phản ánh niềm vui sáng tạo và sự được ghi nhận trong điều mình theo đuổi.',
    path: 'M 195 320 Q 200 240 210 110',
    color: '#F5C766',
  },
  {
    id: 'mercury',
    name: 'Đường Thủy Tinh (Health line)',
    desc: 'Phản ánh khả năng giao tiếp, sự nhạy bén và đầu óc kinh doanh.',
    path: 'M 225 320 Q 235 240 245 130',
    color: '#A98AD3',
  },
  {
    id: 'venus',
    name: 'Vòng Kim Tinh (Venus mount)',
    desc: 'Phần thịt nổi quanh ngón cái, phản ánh đam mê và sức sống tình ái.',
    path: 'M 100 200 Q 60 260 100 320',
    color: '#D88B8B',
  },
];

export function InfographicPalm() {
  const [active, setActive] = React.useState<string>('heart');
  const activeLine = LINES.find((l) => l.id === active);

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_280px]">
      <svg
        viewBox="0 0 320 380"
        className="w-full max-w-[400px] mx-auto"
        role="img"
        aria-label="Sơ đồ các đường chỉ tay chính"
      >
        <path
          d="M 50 200 Q 40 130 60 90 Q 75 60 95 70 L 105 130 Q 110 60 130 50 Q 150 45 155 80 L 158 130 Q 165 50 185 45 Q 205 50 205 90 L 208 135 Q 220 75 240 80 Q 258 90 255 130 L 250 200 Q 260 260 245 320 Q 220 360 165 365 Q 110 360 80 320 Q 55 270 50 200 Z"
          fill="#1A1A1C"
          stroke="#B8923D"
          strokeOpacity={0.3}
          strokeWidth={1.5}
        />
        {LINES.map((line) => (
          <path
            key={line.id}
            d={line.path}
            fill="none"
            stroke={line.color}
            strokeWidth={active === line.id ? 4 : 2}
            strokeOpacity={active === line.id ? 1 : 0.45}
            strokeLinecap="round"
            className="cursor-pointer transition-all"
            onClick={() => setActive(line.id)}
          />
        ))}
      </svg>

      <div className="space-y-2">
        <h3 className="font-heading text-sm font-semibold text-gold">7 đường chỉ tay chính</h3>
        <div className="space-y-1.5">
          {LINES.map((line) => (
            <button
              key={line.id}
              type="button"
              onClick={() => setActive(line.id)}
              className={`flex min-h-[44px] w-full items-center gap-2 rounded border px-2.5 py-2 text-left text-xs transition-colors ${
                active === line.id
                  ? 'border-gold bg-gold/10'
                  : 'border-border hover:border-gold/40'
              }`}
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: line.color }}
              />
              <span className={active === line.id ? 'text-gold' : 'text-foreground/80'}>
                {line.name}
              </span>
            </button>
          ))}
        </div>
        {activeLine && (
          <div className="mt-3 rounded border border-border bg-card/40 p-3">
            <p className="text-xs leading-relaxed text-muted-foreground">{activeLine.desc}</p>
          </div>
        )}
      </div>
    </div>
  );
}
