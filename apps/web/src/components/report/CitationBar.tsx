'use client';

/**
 * CitationBar — "Đối chiếu nguồn" row per report section.
 *
 * Receives the CorpusChunk citations that backed a section's analysis and
 * renders them as small editorial chips. Three label tiers:
 *
 *   similarity >= 0.78 → "Cổ thư"           (high-confidence classical source)
 *   similarity >= 0.55 → "Phương pháp luận hieu.asia"  (framework / methodology)
 *   similarity <  0.55 → "AI suy luận"       (LLM prior, no strong corpus match)
 *
 * The component is intentionally read-only and additive — it does not touch
 * any existing report structure. Drop it below <SectionFeedback> or wherever
 * the caller wants.
 *
 * Returns null when citations array is empty so callers don't need to guard.
 */

import * as React from 'react';
import { cn } from '@hieu-asia/ui';

export interface CitationItem {
  source: string;
  chapter: string | null;
  similarity: number;
}

export interface CitationBarProps {
  citations: CitationItem[];
  className?: string;
}

type CitationTier = 'classical' | 'methodology' | 'inference';

function getTier(similarity: number): CitationTier {
  if (similarity >= 0.78) return 'classical';
  if (similarity >= 0.55) return 'methodology';
  return 'inference';
}

const TIER_LABEL: Record<CitationTier, string> = {
  classical: 'Cổ thư',
  methodology: 'Phương pháp luận hieu.asia',
  inference: 'AI suy luận',
};

/** Dot colour per tier — stays within brand palette (gold/muted/foreground). */
const TIER_DOT_CLASS: Record<CitationTier, string> = {
  classical: 'bg-[#D4B25A]',
  methodology: 'bg-foreground/50',
  inference: 'bg-foreground/25',
};

function CitationChip({ item }: { item: CitationItem }) {
  const tier = getTier(item.similarity);
  const label = TIER_LABEL[tier];
  const dotClass = TIER_DOT_CLASS[tier];

  const displayText = item.chapter
    ? `${item.source} · ${item.chapter}`
    : item.source;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] leading-none',
        'border-border/50 bg-card/30 text-muted-foreground',
      )}
      title={`${label} — độ tương đồng ${Math.round(item.similarity * 100)}%`}
    >
      <span
        className={cn('inline-block h-1.5 w-1.5 shrink-0 rounded-full', dotClass)}
        aria-hidden="true"
      />
      <span className="max-w-[18ch] truncate">{displayText}</span>
      <span className="shrink-0 text-muted-foreground/60">·</span>
      <span className="shrink-0 italic">{label}</span>
    </span>
  );
}

export function CitationBar({ citations, className }: CitationBarProps) {
  if (!citations || citations.length === 0) return null;

  return (
    <div
      className={cn(
        'mt-3 border-t border-border/30 pt-3',
        className,
      )}
      aria-label="Đối chiếu nguồn"
    >
      <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
        Đối chiếu nguồn
      </p>
      <ul
        className="flex flex-wrap gap-1.5"
        role="list"
        aria-label="Nguồn tham chiếu cho phần này"
      >
        {citations.map((item, i) => (
          // key includes index because source+chapter may repeat across palaces
          <li key={`${item.source}-${item.chapter ?? ''}-${i}`} className="contents">
            <CitationChip item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}
