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
      aria-label="Gửi tin nhắn cho Mentor"
      onSubmit={(e) => {
        e.preventDefault();
        if (!disabled && value.trim()) onSend();
      }}
      className="flex items-end gap-2 border-t border-gold/15 bg-card/80 px-3 py-3 sm:px-4 sm:py-4"
    >
      <label htmlFor="mentor-chat-input" className="sr-only">
        Nội dung tin nhắn
      </label>
      <textarea
        id="mentor-chat-input"
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        rows={1}
        placeholder={placeholder ?? 'Hỏi Mentor về bất kỳ điều gì…'}
        aria-label="Nội dung tin nhắn gửi Mentor"
        aria-describedby="mentor-chat-hint"
        className={cn(
          'flex-1 resize-none rounded-md border border-gold/20 bg-card/60 px-3 py-2 text-sm text-foreground',
          'placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold',
        )}
        disabled={disabled}
      />
      <span id="mentor-chat-hint" className="sr-only">
        Nhấn Enter để gửi, Shift + Enter để xuống dòng
      </span>
      <Button
        type="submit"
        disabled={disabled || !value.trim()}
        aria-label="Gửi tin nhắn cho Mentor"
      >
        Gửi
      </Button>
    </form>
  );
}
