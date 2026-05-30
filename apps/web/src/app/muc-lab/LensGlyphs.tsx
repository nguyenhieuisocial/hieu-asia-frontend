import * as React from 'react';

/**
 * LensGlyphs — 4 emblem SVG cao cấp cho FourLens (Tử Vi · Bát Tự · Thần Số · MBTI).
 * Khắc nét editorial, viewBox 48, currentColor → đổi màu ink↔ochre khi active, animate được, nhẹ.
 * Chi tiết hơn hẳn 4 icon đơn giản cũ.
 */

const r2 = (n: number): number => Math.round(n * 100) / 100;
const pt = (r: number, deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [r2(24 + r * Math.cos(a)), r2(24 + r * Math.sin(a))];
};
const poly = (arr: Array<[number, number]>): string => arr.map(([x, y]) => `${x},${y}`).join(' ');
const base = (className?: string) => ({
  viewBox: '0 0 48 48', className, fill: 'none', stroke: 'currentColor',
  strokeWidth: 1.1, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
});

export function TuViEmblem({ className }: { className?: string }): React.JSX.Element {
  const spokes = Array.from({ length: 12 }, (_, k) => ({ s: pt(10, -90 + 30 * k), e: pt(20, -90 + 30 * k), k }));
  const stars: Array<[number, number]> = [pt(15.5, -55), pt(15.5, 55), pt(15.5, 175)];
  const [mx1, my1] = pt(20, -105), [mx2, my2] = pt(20, -75), [ix2, iy2] = pt(10, -75), [ix1, iy1] = pt(10, -105);
  return (
    <svg {...base(className)}>
      <circle cx={24} cy={24} r={20} />
      <circle cx={24} cy={24} r={10} />
      <path d={`M${mx1} ${my1} A20 20 0 0 1 ${mx2} ${my2} L${ix2} ${iy2} A10 10 0 0 0 ${ix1} ${iy1} Z`} fill="currentColor" fillOpacity={0.18} stroke="none" />
      {spokes.map(({ s, e, k }) => <line key={k} x1={s[0]} y1={s[1]} x2={e[0]} y2={e[1]} strokeWidth={0.9} />)}
      {stars.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={0.9} fill="currentColor" stroke="none" />)}
      <circle cx={24} cy={24} r={1.5} fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BatTuEmblem({ className }: { className?: string }): React.JSX.Element {
  const cols = [9, 19, 29, 39];
  return (
    <svg {...base(className)}>
      <line x1={5} y1={10.5} x2={43} y2={10.5} strokeWidth={0.9} />
      {cols.map((x) => (
        <g key={x}>
          <rect x={x - 3.5} y={11} width={7} height={26} rx={1.2} strokeWidth={1} />
          <line x1={x - 3.5} y1={24} x2={x + 3.5} y2={24} strokeWidth={0.8} />
          <circle cx={x} cy={17.5} r={1} fill="currentColor" stroke="none" />
          <circle cx={x} cy={30.5} r={1} fill="currentColor" stroke="none" />
        </g>
      ))}
      <line x1={5} y1={37.5} x2={43} y2={37.5} strokeWidth={0.9} />
    </svg>
  );
}

export function ThanSoEmblem({ className }: { className?: string }): React.JSX.Element {
  const P9 = Array.from({ length: 9 }, (_, k) => pt(18, -90 + 40 * k));
  const tri: Array<[number, number]> = [0, 3, 6].map((i) => P9[i]!);
  const hex: Array<[number, number]> = [1, 4, 2, 8, 5, 7].map((i) => P9[i]!);
  return (
    <svg {...base(className)}>
      <circle cx={24} cy={24} r={20} />
      <polygon points={poly(tri)} strokeWidth={0.85} />
      <polygon points={poly(hex)} strokeWidth={0.85} />
      {P9.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.3} fill="currentColor" stroke="none" />)}
    </svg>
  );
}

export function MbtiEmblem({ className }: { className?: string }): React.JSX.Element {
  const poles: Array<[number, number]> = [pt(20, -90), pt(20, 0), pt(20, 90), pt(20, 180)];
  const diamond: Array<[number, number]> = [pt(11, -90), pt(11, 0), pt(11, 90), pt(11, 180)];
  return (
    <svg {...base(className)}>
      <circle cx={24} cy={24} r={20} />
      <line x1={24} y1={5} x2={24} y2={43} strokeWidth={0.8} />
      <line x1={5} y1={24} x2={43} y2={24} strokeWidth={0.8} />
      <polygon points={poly(diamond)} strokeWidth={1} />
      {poles.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.4} fill="currentColor" stroke="none" />)}
      <circle cx={24} cy={24} r={1.5} fill="currentColor" stroke="none" />
    </svg>
  );
}
