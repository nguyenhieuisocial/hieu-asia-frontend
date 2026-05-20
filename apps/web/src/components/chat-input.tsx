'use client';

import * as React from 'react';
import { Button, cn } from '@hieu-asia/ui';

export interface ChatInputProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
  placeholder,
}: ChatInputProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
  }, [value]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) onSend();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!disabled && value.trim()) onSend();
      }}
      className="flex items-end gap-2 border-t border-gold/15 bg-ink/80 px-3 py-3 sm:px-4 sm:py-4"
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        rows={1}
        placeholder={placeholder ?? 'Hỏi Mentor về bất kỳ điều gì…'}
        className={cn(
          'flex-1 resize-none rounded-md border border-gold/20 bg-ink/60 px-3 py-2 text-sm text-cream',
          'placeholder:text-cream/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold',
        )}
        disabled={disabled}
      />
      <Button type="submit" disabled={disabled || !value.trim()}>
        Gửi
      </Button>
    </form>
  );
}
