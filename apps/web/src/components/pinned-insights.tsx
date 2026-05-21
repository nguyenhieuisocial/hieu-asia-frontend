'use client';

import * as React from 'react';
import { cn } from '@hieu-asia/ui';

export interface PinnedInsight {
  id: string;
  title?: string;
  content: string;
  pinnedAt: number;
}

export interface PinnedInsightsProps {
  items: PinnedInsight[];
  onUnpin?: (id: string) => void;
  className?: string;
}

export function PinnedInsights({
  items,
  onUnpin,
  className,
}: PinnedInsightsProps) {
  return (
    <aside
      className={cn(
        'flex h-full flex-col border-l border-gold/15 bg-ink/40',
        className,
      )}
    >
      <header className="border-b border-gold/15 px-4 py-3">
        <h2 className="font-heading text-sm font-medium text-gold">
          📌 Insights đã ghim
        </h2>
        <p className="mt-1 text-xs text-cream/70">
          {items.length} mục · lưu trên thiết bị này
        </p>
      </header>
      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {items.length === 0 && (
          <p className="px-2 py-6 text-center text-xs text-cream/70">
            Chưa có gì được ghim. Ghim câu trả lời từ Mentor hoặc insight trong
            báo cáo để xem ở đây.
          </p>
        )}
        {items.map((p) => (
          <article
            key={p.id}
            className="rounded-md border border-gold/15 bg-ink/60 p-3 text-xs text-cream/90"
          >
            {p.title && (
              <p className="mb-1 font-medium text-gold">{p.title}</p>
            )}
            <p className="line-clamp-4 leading-relaxed">{p.content}</p>
            {onUnpin && (
              <button
                type="button"
                onClick={() => onUnpin(p.id)}
                className="mt-2 text-[10px] uppercase tracking-wider text-cream/40 hover:text-gold"
              >
                Bỏ ghim
              </button>
            )}
          </article>
        ))}
      </div>
    </aside>
  );
}
