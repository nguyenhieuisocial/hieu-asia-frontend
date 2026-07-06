'use client';

import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@hieu-asia/ui';

export interface ChatMessage {
  id: string;
  role: 'user' | 'mentor';
  content: string;
  ts: number;
  feedback?: 'up' | 'down' | null;
  pinned?: boolean;
}

export interface ChatMessageListProps {
  messages: ChatMessage[];
  isTyping?: boolean;
  onFeedback?: (id: string, value: 'up' | 'down') => void;
  onPin?: (id: string) => void;
}

export function ChatMessageList({
  messages,
  isTyping,
  onFeedback,
  onPin,
}: ChatMessageListProps) {
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, isTyping]);

  return (
    <div className="flex flex-col gap-4 px-2 py-4 sm:px-4">
      {messages.map((m) => (
        <MessageBubble
          key={m.id}
          message={m}
          onFeedback={onFeedback}
          onPin={onPin}
        />
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={endRef} />
    </div>
  );
}

function MessageBubble({
  message,
  onFeedback,
  onPin,
}: {
  message: ChatMessage;
  onFeedback?: (id: string, value: 'up' | 'down') => void;
  onPin?: (id: string) => void;
}) {
  const isUser = message.role === 'user';
  const time = new Date(message.ts).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={cn(
        'group flex items-end gap-2',
        isUser ? 'justify-end' : 'justify-start',
      )}
    >
      {!isUser && (
        <div
          aria-hidden
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-purple/30 text-sm"
          title="Cố vấn Cuộc Đời"
        >
          ☯
        </div>
      )}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm sm:max-w-[70%]',
          isUser
            ? 'rounded-br-sm bg-gold/15 text-foreground'
            : 'rounded-bl-sm border border-gold/15 bg-card/70 text-foreground',
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="max-w-none">
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="mb-2 whitespace-pre-wrap last:mb-0">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-2 ml-4 list-disc space-y-1 last:mb-0">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-2 ml-4 list-decimal space-y-1 last:mb-0">
                    {children}
                  </ol>
                ),
                strong: ({ children }) => (
                  <strong className="text-gold">{children}</strong>
                ),
                code: ({ children }) => (
                  <code className="rounded bg-card/80 px-1 font-mono text-xs">
                    {children}
                  </code>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        {/* Touch/keyboard parity: hover không tồn tại trên mobile — luôn hiện trên màn nhỏ, và hiện khi nút bên trong nhận focus. */}
        <div className="mt-2 flex items-center justify-between gap-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 max-sm:opacity-100">
          <span className="font-mono text-xs text-muted-foreground">{time}</span>
          {!isUser && (
            <div className="flex items-center gap-1">
              <FeedbackButton
                active={message.feedback === 'up'}
                onClick={() => onFeedback?.(message.id, 'up')}
                title="Hữu ích"
                label="👍"
              />
              <FeedbackButton
                active={message.feedback === 'down'}
                onClick={() => onFeedback?.(message.id, 'down')}
                title="Chưa chuẩn"
                label="👎"
              />
              <FeedbackButton
                active={!!message.pinned}
                onClick={() => onPin?.(message.id)}
                title="Ghim"
                label="📌"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FeedbackButton({
  active,
  onClick,
  title,
  label,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        'rounded px-1.5 py-0.5 text-xs transition-colors',
        active
          ? 'bg-gold/20 text-gold'
          : 'text-muted-foreground hover:bg-gold/10 hover:text-foreground',
      )}
    >
      {label}
    </button>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <div
        aria-hidden
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-purple/30 text-sm"
      >
        ☯
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-gold/15 bg-card/70 px-4 py-3 text-sm text-muted-foreground">
        <span>Đang soạn câu trả lời</span>
        <span className="inline-flex gap-0.5">
          <span className="animate-pulse">.</span>
          <span className="animate-pulse [animation-delay:0.2s]">.</span>
          <span className="animate-pulse [animation-delay:0.4s]">.</span>
        </span>
      </div>
    </div>
  );
}
