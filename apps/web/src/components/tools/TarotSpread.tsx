'use client';

import * as React from 'react';
import type { DrawnCard, Suit } from '@/lib/tools/tarot';

/**
 * Bộ bài Tarot có HÌNH — trải bài + lật từng lá khi rút.
 *
 * Trước đây Tarot chỉ hiện chữ; đây là khoảnh khắc "wow"/nghi thức bị thiếu.
 * Mặt lá vẽ kiểu typographic thanh lịch (số La Mã cho Ẩn Chính · biểu tượng
 * chất cho Ẩn Phụ · viền vàng · tên tiếng Việt) — TỰ VẼ, KHÔNG dùng tranh
 * Rider-Waite-Smith (U.S. Games Systems giữ bản quyền thương mại → rủi ro).
 * Lá ngược: xoay biểu tượng 180° + dấu ⟳ (giữ tên đọc được, không lộn chữ).
 */

const ROMAN = [
  '0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
  'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI',
];

const SUIT_LABEL: Record<Suit, string> = { wands: 'Gậy', cups: 'Cốc', swords: 'Kiếm', pentacles: 'Tiền' };

function SuitEmblem({ suit, className }: { suit?: Suit; className?: string }) {
  const s = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (suit) {
    case 'wands':
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
          <path {...s} d="M16 29 V11" />
          <path {...s} d="M16 12 C12 9 11 5 12 3 C15 4 17 7 16 12Z" />
          <path {...s} d="M16 14 C20 11 21 7 20 5" />
        </svg>
      );
    case 'cups':
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
          <path {...s} d="M8 6 H24 C24 15 20 18 16 18 C12 18 8 15 8 6Z" />
          <path {...s} d="M16 18 V25" />
          <path {...s} d="M10 27 H22" />
        </svg>
      );
    case 'swords':
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
          <path {...s} d="M16 3 V21" />
          <path {...s} d="M11 21 H21" />
          <path {...s} d="M16 21 V27" />
          <path {...s} d="M13 24 H19" />
        </svg>
      );
    case 'pentacles':
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
          <circle {...s} cx="16" cy="16" r="12" />
          <path {...s} d="M16 6 L18.9 14.9 L26.5 14.9 L20.3 20.2 L22.8 29 L16 23.6 L9.2 29 L11.7 20.2 L5.5 14.9 L13.1 14.9 Z" />
        </svg>
      );
    default:
      // ✦ cho Ẩn Chính
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden>
          <path {...s} d="M16 4 L19 13 L28 16 L19 19 L16 28 L13 19 L4 16 L13 13 Z" />
        </svg>
      );
  }
}

function CardFace({ card, orientation }: DrawnCard) {
  const isMajor = card.arcana === 'major';
  const rev = orientation === 'reversed';
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden rounded-lg border-2 border-gold/45 bg-gradient-to-b from-gold/[0.10] to-background p-2 text-center shadow-sm">
      <span aria-hidden className="absolute left-1 top-1 text-gold/40">✦</span>
      <span aria-hidden className="absolute bottom-1 right-1 text-gold/40">✦</span>
      <div className="font-mono text-[12px] uppercase tracking-[0.15em] text-gold/70">
        {isMajor ? 'Ẩn chính' : card.suit ? SUIT_LABEL[card.suit] : ''}
      </div>
      <div className="flex flex-1 items-center justify-center" style={rev ? { transform: 'rotate(180deg)' } : undefined}>
        {isMajor ? (
          <span className="font-heading text-[26px] leading-none text-gold">{ROMAN[card.id] ?? '✦'}</span>
        ) : (
          <SuitEmblem suit={card.suit} className="h-9 w-9 text-gold" />
        )}
      </div>
      <div className="text-[12px] font-medium leading-tight text-foreground">{card.name_vi}</div>
      {rev && <span aria-label="ngược" className="absolute right-1 top-1 font-mono text-[12px] text-amber-600 dark:text-amber-400">⟳</span>}
    </div>
  );
}

function CardBack() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-lg border-2 border-gold/40 bg-gradient-to-br from-gold/20 to-gold/[0.04]">
      <SuitEmblem className="h-7 w-7 text-gold/50" />
    </div>
  );
}

function FlipCard({ d, delay }: { d: DrawnCard; delay: number }) {
  const [revealed, setRevealed] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setRevealed(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div style={{ perspective: '900px' }} className="w-[84px] sm:w-[100px]">
      <div
        className="relative aspect-[2/3] transition-transform duration-700 ease-out"
        style={{ transformStyle: 'preserve-3d', transform: revealed ? 'rotateY(0deg)' : 'rotateY(180deg)' }}
      >
        <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
          <CardFace card={d.card} orientation={d.orientation} />
        </div>
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <CardBack />
        </div>
      </div>
    </div>
  );
}

export function TarotSpread({ drawn, positions }: { drawn: DrawnCard[]; positions: readonly string[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {drawn.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5">
          <FlipCard d={d} delay={180 + i * 180} />
          <span className="max-w-[100px] text-center font-mono text-[12px] uppercase leading-tight tracking-wider text-gold/70">
            {positions[i] ?? ''}
          </span>
        </div>
      ))}
    </div>
  );
}
