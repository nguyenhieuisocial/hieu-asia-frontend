'use client';

import * as React from 'react';
import { cn } from '@hieu-asia/ui';
import { ChevronDown, ChevronUp, BookOpen, Info } from 'lucide-react';

export interface ExplainPanelPalace {
  /** Palace name, e.g. "Mệnh", "Quan Lộc". */
  name: string;
  /** Importance level for visual hierarchy. */
  importance: 'primary' | 'secondary' | 'supporting';
  /** Stars/sao present in this palace. */
  stars: string[];
  /** Brief reasoning sentence linking palace + stars to the interpretation. */
  reasoning: string;
}

export interface ExplainPanelProps {
  /** Topic this explain panel refers to, e.g. "Sự nghiệp". */
  topic?: string;
  /** Palaces cited by the AI interpretation. */
  palaces: ExplainPanelPalace[];
  /** Current đại vận label, e.g. "Đại vận 34–43 (Quan Lộc)". */
  majorLuckRef?: string;
  /** Current lưu niên label, e.g. "Lưu niên 2026 (Thiên Di)". */
  annualLuckRef?: string;
  /** Optional user-supplied situation that fed the interpretation. */
  userContext?: string;
  /** Optional 2-sentence summary shown at the top of the panel. */
  summary?: string;
}

/**
 * Section 1.2 — "Xem căn cứ luận giải" collapsible.
 *
 * Sits at the end of an interpretation block. Reveals the chart data the AI
 * cited so the reader can audit the reasoning (validator chặn output bịa sao).
 */
export function ExplainPanel({
  topic,
  palaces,
  majorLuckRef,
  annualLuckRef,
  userContext,
  summary,
}: ExplainPanelProps) {
  const [open, setOpen] = React.useState(false);
  const panelId = React.useId();

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          'inline-flex items-center gap-2 rounded-md border border-cream/15 bg-ink/40 px-3 py-1.5 text-xs font-medium text-cream/80 transition-colors',
          'hover:border-gold/40 hover:text-gold',
        )}
      >
        <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
        <span>
          Xem căn cứ luận giải
          {topic ? <span className="text-cream/50"> · {topic}</span> : null}
        </span>
        {open ? (
          <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
        )}
      </button>

      <div
        id={panelId}
        // Smooth height transition via grid-rows trick.
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-out',
          open ? 'mt-3 grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
        aria-hidden={!open}
      >
        <div className="overflow-hidden">
          <div className="rounded-lg border border-cream/10 bg-ink/40 p-4 text-sm text-cream/85">
            {summary && (
              <p className="mb-3 text-cream/90">{summary}</p>
            )}

            <p className="text-xs font-medium uppercase tracking-wider text-cream/60">
              Dựa trên:
            </p>

            {palaces.length === 0 ? (
              <p className="mt-2 text-sm text-cream/50">
                Chưa có dữ liệu cung được trích dẫn.
              </p>
            ) : (
              <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {palaces.map((p, i) => (
                  <PalaceRow key={i} palace={p} />
                ))}
              </ul>
            )}

            {(majorLuckRef || annualLuckRef) && (
              <dl className="mt-4 space-y-1.5 border-t border-cream/10 pt-3 text-sm">
                {majorLuckRef && (
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="text-cream/60">Đại vận hiện tại:</dt>
                    <dd className="text-cream/90">{majorLuckRef}</dd>
                  </div>
                )}
                {annualLuckRef && (
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="text-cream/60">Lưu niên:</dt>
                    <dd className="text-cream/90">{annualLuckRef}</dd>
                  </div>
                )}
              </dl>
            )}

            {userContext && (
              <div className="mt-4 border-t border-cream/10 pt-3">
                <p className="text-xs font-medium uppercase tracking-wider text-cream/60">
                  Bối cảnh bạn đã cung cấp:
                </p>
                <p className="mt-1 italic text-cream/80">{userContext}</p>
              </div>
            )}

            <p className="mt-4 flex items-start gap-2 border-t border-cream/10 pt-3 text-[11px] leading-relaxed text-cream/55">
              <Info className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
              <span>
                Đây là khung dữ liệu lá số mà phần luận giải đã trích dẫn. AI
                không được phép nhắc sao/cung ngoài danh sách này (validator
                chặn output bịa sao).
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PalaceRow({ palace }: { palace: ExplainPanelPalace }) {
  const styles = PALACE_STYLES[palace.importance];
  return (
    <li
      className={cn(
        'rounded-md border px-3 py-2',
        styles.border,
        styles.bg,
        styles.text,
      )}
    >
      <div className={cn('flex flex-wrap items-baseline gap-1.5', styles.size)}>
        <strong className={styles.name}>{palace.name}</strong>
        {palace.stars.length > 0 && (
          <span className="text-cream/70">
            — {palace.stars.join(', ')}
          </span>
        )}
      </div>
      <p className="mt-1 text-xs leading-relaxed text-cream/70">
        {palace.reasoning}
      </p>
    </li>
  );
}

const PALACE_STYLES: Record<
  ExplainPanelPalace['importance'],
  {
    border: string;
    bg: string;
    text: string;
    name: string;
    size: string;
  }
> = {
  primary: {
    border: 'border-gold/30',
    bg: 'bg-gold/15',
    text: 'text-cream',
    name: 'text-gold',
    size: 'text-sm',
  },
  secondary: {
    border: 'border-cream/15',
    bg: 'bg-ink/60',
    text: 'text-cream/90',
    name: 'text-cream',
    size: 'text-sm',
  },
  supporting: {
    border: 'border-cream/10',
    bg: 'bg-ink/40',
    text: 'text-cream/60',
    name: 'text-cream/80',
    size: 'text-xs',
  },
};
