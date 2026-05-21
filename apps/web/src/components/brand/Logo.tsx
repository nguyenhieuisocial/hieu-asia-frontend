/**
 * Logo system cho hieu.asia.
 *
 * Pure SVG (no external images), configurable via props:
 *   - variant: 'gold' (default gradient) | 'dark' (cream on dark) | 'light' (dark on light) | 'mono' (currentColor)
 *   - size: number — kích thước height tính bằng px
 *   - kind: 'wordmark' (text "hieu.asia") | 'symbol' (H mark) | 'lockup' (symbol + wordmark)
 *
 * Mỗi SVG dùng unique gradient ID để render nhiều logo cùng trang không bị conflict.
 */

import * as React from 'react';

export type LogoVariant = 'gold' | 'dark' | 'light' | 'mono';
export type LogoKind = 'wordmark' | 'symbol' | 'lockup';

interface LogoProps {
  kind?: LogoKind;
  variant?: LogoVariant;
  size?: number;
  className?: string;
  title?: string;
}

let __uidCounter = 0;
function useUid(prefix: string) {
  const ref = React.useRef<string>('');
  if (!ref.current) {
    __uidCounter += 1;
    ref.current = `${prefix}-${__uidCounter}`;
  }
  return ref.current;
}

export function Logo({
  kind = 'wordmark',
  variant = 'gold',
  size = 48,
  className,
  title = 'hieu.asia',
}: LogoProps) {
  if (kind === 'symbol') {
    return <SymbolMark variant={variant} size={size} className={className} title={title} />;
  }
  if (kind === 'lockup') {
    return <Lockup variant={variant} size={size} className={className} title={title} />;
  }
  return <Wordmark variant={variant} size={size} className={className} title={title} />;
}

// -------------------- Wordmark --------------------

export function Wordmark({
  variant = 'gold',
  size = 48,
  className,
  title = 'hieu.asia',
}: LogoProps) {
  const uid = useUid('wm');
  const fill = resolveFill(variant, `url(#${uid})`);
  const aspectWidth = (240 / 60) * size;
  return (
    <svg
      role="img"
      aria-label={title}
      viewBox="0 0 240 60"
      width={aspectWidth}
      height={size}
      className={className}
    >
      <title>{title}</title>
      <defs>
        <linearGradient id={uid} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#B8923D" />
          <stop offset="50%" stopColor="#D4B25A" />
          <stop offset="100%" stopColor="#B8923D" />
        </linearGradient>
      </defs>
      <text
        x="10"
        y="44"
        fontFamily="'Be Vietnam Pro', 'Inter', system-ui, sans-serif"
        fontSize="36"
        fontWeight={700}
        fill={fill}
        letterSpacing="-0.02em"
      >
        hieu.asia
      </text>
    </svg>
  );
}

// -------------------- Symbol mark --------------------

export function SymbolMark({
  variant = 'gold',
  size = 64,
  className,
  title = 'hieu.asia',
}: LogoProps) {
  const uid = useUid('sm');
  const bgId = `${uid}-bg`;
  const goldId = `${uid}-gold`;

  const useGradient = variant === 'gold' || variant === 'dark';
  const isMono = variant === 'mono';
  const isLight = variant === 'light';

  const bgFill = useGradient
    ? `url(#${bgId})`
    : isLight
      ? '#F2EDE3'
      : isMono
        ? 'transparent'
        : '#0F0F12';

  const strokeFill = useGradient
    ? `url(#${goldId})`
    : isMono
      ? 'currentColor'
      : isLight
        ? '#B8923D'
        : '#D4B25A';

  const dotFill = isMono ? 'currentColor' : '#B8923D';

  return (
    <svg
      role="img"
      aria-label={title}
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
    >
      <title>{title}</title>
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0F0F12" />
          <stop offset="100%" stopColor="#1A0E2E" />
        </linearGradient>
        <linearGradient id={goldId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4B25A" />
          <stop offset="100%" stopColor="#B8923D" />
        </linearGradient>
      </defs>
      <rect
        width="64"
        height="64"
        rx="12"
        fill={bgFill}
        stroke={isMono ? 'currentColor' : 'none'}
        strokeWidth={isMono ? 1.5 : 0}
      />
      <path
        d="M18 14v36 M46 14v36 M18 32h28"
        stroke={strokeFill}
        strokeWidth={6}
        strokeLinecap="round"
        fill="none"
      />
      <circle cx={50} cy={50} r={2} fill={dotFill} />
    </svg>
  );
}

// -------------------- Lockup (symbol + wordmark) --------------------

export function Lockup({
  variant = 'gold',
  size = 64,
  className,
  title = 'hieu.asia',
}: LogoProps) {
  const uid = useUid('lk');
  const goldId = `${uid}-gold`;
  const bgId = `${uid}-bg`;
  const wmId = `${uid}-wm`;

  const useGradient = variant === 'gold' || variant === 'dark';
  const isMono = variant === 'mono';
  const isLight = variant === 'light';

  const symbolBg = useGradient
    ? `url(#${bgId})`
    : isLight
      ? '#F2EDE3'
      : isMono
        ? 'transparent'
        : '#0F0F12';

  const symbolStroke = useGradient
    ? `url(#${goldId})`
    : isMono
      ? 'currentColor'
      : isLight
        ? '#B8923D'
        : '#D4B25A';

  const wordmarkFill = resolveFill(variant, `url(#${wmId})`);
  const aspectWidth = (320 / 80) * size;

  return (
    <svg
      role="img"
      aria-label={title}
      viewBox="0 0 320 80"
      width={aspectWidth}
      height={size}
      className={className}
    >
      <title>{title}</title>
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0F0F12" />
          <stop offset="100%" stopColor="#1A0E2E" />
        </linearGradient>
        <linearGradient id={goldId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4B25A" />
          <stop offset="100%" stopColor="#B8923D" />
        </linearGradient>
        <linearGradient id={wmId} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#B8923D" />
          <stop offset="50%" stopColor="#D4B25A" />
          <stop offset="100%" stopColor="#B8923D" />
        </linearGradient>
      </defs>
      <g transform="translate(8, 8)">
        <rect
          width="64"
          height="64"
          rx="12"
          fill={symbolBg}
          stroke={isMono ? 'currentColor' : 'none'}
          strokeWidth={isMono ? 1.5 : 0}
        />
        <path
          d="M18 14v36 M46 14v36 M18 32h28"
          stroke={symbolStroke}
          strokeWidth={6}
          strokeLinecap="round"
          fill="none"
        />
        <circle cx={50} cy={50} r={2} fill={isMono ? 'currentColor' : '#B8923D'} />
      </g>
      <text
        x={92}
        y={54}
        fontFamily="'Be Vietnam Pro', 'Inter', system-ui, sans-serif"
        fontSize={40}
        fontWeight={700}
        fill={wordmarkFill}
        letterSpacing="-0.02em"
      >
        hieu.asia
      </text>
    </svg>
  );
}

function resolveFill(variant: LogoVariant, goldUrl: string): string {
  switch (variant) {
    case 'dark':
      return '#F2EDE3';
    case 'light':
      return '#0F0F12';
    case 'mono':
      return 'currentColor';
    case 'gold':
    default:
      return goldUrl;
  }
}
