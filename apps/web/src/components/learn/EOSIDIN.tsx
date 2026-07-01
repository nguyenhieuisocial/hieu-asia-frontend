'use client';

import * as React from 'react';

interface Step {
  letter: string;
  name: string;
  vn: string;
  desc: string;
}

const STEPS: readonly Step[] = [
  { letter: 'E', name: 'Exploration', vn: 'Khám phá', desc: 'Hỏi bối cảnh user' },
  { letter: 'O', name: 'Observation', vn: 'Quan sát', desc: 'AI quan sát data (palm + birth + survey)' },
  { letter: 'S', name: 'Synthesis', vn: 'Tổng hợp', desc: 'Đông – Tây kết hợp' },
  { letter: 'I', name: 'Insight', vn: 'Thấu hiểu', desc: 'Rút ra insight cá nhân' },
  { letter: 'D', name: 'Decision', vn: 'Quyết định', desc: 'Hỗ trợ ra quyết định' },
  { letter: 'I', name: 'Implementation', vn: 'Triển khai', desc: 'Plan 90 ngày cụ thể' },
  { letter: 'N', name: 'Navigation', vn: 'Đồng hành', desc: 'Mentor liên tục theo thời gian' },
];

export function EOSIDIN() {
  const [active, setActive] = React.useState(0);
  const size = 480;
  const center = size / 2;
  const radius = 170;

  const nodes = STEPS.map((step, i) => {
    const angle = (i * (360 / STEPS.length) - 90) * (Math.PI / 180);
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { ...step, x, y, angle, idx: i };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full max-w-[480px]"
          role="img"
          aria-label="Phương pháp EOSIDIN — 7 bước hỗ trợ hiểu mình"
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
            >
              <path d="M 0 0 L 8 4 L 0 8 z" fill="#B8923D" fillOpacity={0.6} />
            </marker>
          </defs>

          {nodes.map((node, i) => {
            const next = nodes[(i + 1) % nodes.length]!;
            return (
              <line
                key={`line-${i}`}
                x1={node.x}
                y1={node.y}
                x2={next.x}
                y2={next.y}
                stroke="#B8923D"
                strokeOpacity={0.25}
                strokeWidth={1.5}
                strokeDasharray="4 4"
                markerEnd="url(#arrowhead)"
              />
            );
          })}

          <circle cx={center} cy={center} r={62} fill="var(--ig-fill,#1A1A1C)" stroke="#B8923D" strokeOpacity={0.4} />
          <text
            x={center}
            y={center - 6}
            textAnchor="middle"
            fontSize="20"
            fontWeight="700"
            fill="#B8923D"
          >
            EOSIDIN
          </text>
          <text
            x={center}
            y={center + 16}
            textAnchor="middle"
            fontSize="10"
            fill="#D8CDB1"
            opacity={0.7}
          >
            Phương pháp hieu.asia
          </text>

          {nodes.map((node) => (
            <g
              key={node.idx}
              className="cursor-pointer"
              onClick={() => setActive(node.idx)}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={36}
                fill={active === node.idx ? '#B8923D' : "var(--ig-fill-2,#0E0E0F)"}
                stroke="#B8923D"
                strokeOpacity={active === node.idx ? 1 : 0.5}
                strokeWidth={active === node.idx ? 2 : 1.5}
              />
              <text
                x={node.x}
                y={node.y - 4}
                textAnchor="middle"
                fontSize="20"
                fontWeight="800"
                fill={active === node.idx ? '#0E0E0F' : '#B8923D'}
                className="pointer-events-none select-none"
              >
                {node.letter}
              </text>
              <text
                x={node.x}
                y={node.y + 12}
                textAnchor="middle"
                fontSize="9"
                fill={active === node.idx ? '#0E0E0F' : '#D8CDB1'}
                opacity={0.85}
                className="pointer-events-none select-none"
              >
                {node.vn}
              </text>
            </g>
          ))}
        </svg>
        <div className="mt-4 w-full max-w-md rounded-lg border border-gold/30 bg-card/40 p-4 text-center">
          <div className="font-heading text-sm font-bold text-gold">
            {STEPS[active]!.letter} — {STEPS[active]!.name}{' '}
            <span className="text-muted-foreground">({STEPS[active]!.vn})</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{STEPS[active]!.desc}</p>
        </div>
      </div>

      <ol className="grid gap-2 text-xs sm:grid-cols-2 md:grid-cols-4">
        {STEPS.map((s, i) => (
          <li
            key={`${s.letter}-${i}`}
            className={`rounded border px-3 py-2 ${
              active === i ? 'border-gold bg-gold/10' : 'border-border'
            }`}
          >
            <div className="font-semibold text-foreground">
              {i + 1}. {s.vn}
            </div>
            <div className="text-muted-foreground">{s.desc}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}
