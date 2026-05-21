'use client';

import * as React from 'react';
import { cn } from '@hieu-asia/ui';

/**
 * Lightweight prompt editor — textarea with a line-number gutter,
 * Tab-to-indent (2 spaces), Cmd/Ctrl+S to save, and an optional word-wrap toggle.
 *
 * Not Monaco. Intentionally minimal to keep the admin bundle small. Sufficient
 * for hand-editing system prompts (~1-10 KB) with `{{user_id}}` / `{{session_id}}`
 * placeholders.
 */
export interface PromptEditorProps {
  value: string;
  onChange: (next: string) => void;
  onSave?: () => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  /** Spell-check default off (Vietnamese is OK to enable when prose). */
  spellCheck?: boolean;
}

export function PromptEditor({
  value,
  onChange,
  onSave,
  placeholder,
  maxLength,
  className,
  spellCheck = false,
}: PromptEditorProps) {
  const taRef = React.useRef<HTMLTextAreaElement | null>(null);
  const gutterRef = React.useRef<HTMLDivElement | null>(null);
  const [wrap, setWrap] = React.useState(true);

  const lineCount = React.useMemo(() => value.split('\n').length, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd/Ctrl + S → save
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      onSave?.();
      return;
    }
    // Tab → 2 spaces (don't blur)
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const insert = '  ';
      const next = value.slice(0, start) + insert + value.slice(end);
      onChange(next);
      // restore caret after React paints
      requestAnimationFrame(() => {
        if (taRef.current) {
          taRef.current.selectionStart = taRef.current.selectionEnd = start + insert.length;
        }
      });
    }
  };

  // Keep gutter in sync with textarea scroll
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (gutterRef.current) {
      gutterRef.current.scrollTop = (e.target as HTMLTextAreaElement).scrollTop;
    }
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center justify-end gap-3 text-xs text-cream/60">
        <label className="inline-flex cursor-pointer items-center gap-1.5">
          <input
            type="checkbox"
            checked={wrap}
            onChange={(e) => setWrap(e.target.checked)}
            className="h-3.5 w-3.5 accent-gold"
          />
          Word wrap
        </label>
      </div>

      <div className="flex h-[60vh] overflow-hidden rounded-md border border-gold/15 bg-ink/40 backdrop-blur-sm">
        {/* Line-number gutter */}
        <div
          ref={gutterRef}
          aria-hidden="true"
          className="select-none overflow-hidden border-r border-gold/10 bg-ink/60 px-2 py-3 text-right font-mono text-xs leading-5 text-cream/40"
          style={{ minWidth: '3rem' }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          placeholder={placeholder}
          maxLength={maxLength}
          spellCheck={spellCheck}
          lang={spellCheck ? 'vi' : undefined}
          wrap={wrap ? 'soft' : 'off'}
          className={cn(
            'flex-1 resize-none bg-transparent px-3 py-3 font-mono text-sm leading-5 text-cream',
            'placeholder:text-cream/30 focus:outline-none',
            wrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre overflow-x-auto',
          )}
        />
      </div>

      <div className="flex justify-between font-mono text-[11px] text-cream/55">
        <span>
          {value.length.toLocaleString('vi-VN')} ký tự · {lineCount} dòng
          {maxLength && ` · tối đa ${maxLength.toLocaleString('vi-VN')}`}
        </span>
        <span className="text-cream/40">Tab = 2 spaces · Cmd/Ctrl+S = Lưu</span>
      </div>
    </div>
  );
}
