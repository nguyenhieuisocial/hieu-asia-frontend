'use client';

import * as React from 'react';

export interface ChatQuickPromptsProps {
  prompts: string[];
  onPick: (prompt: string) => void;
}

export function ChatQuickPrompts({ prompts, onPick }: ChatQuickPromptsProps) {
  if (!prompts.length) return null;
  return (
    <div className="flex gap-2 overflow-x-auto border-t border-gold/15 bg-ink/40 px-3 py-2 sm:px-4">
      {prompts.map((p, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onPick(p)}
          className="shrink-0 rounded-full border border-gold/30 bg-ink/60 px-3 py-1.5 text-xs text-cream/90 hover:border-gold hover:bg-gold/10"
        >
          {p}
        </button>
      ))}
    </div>
  );
}
