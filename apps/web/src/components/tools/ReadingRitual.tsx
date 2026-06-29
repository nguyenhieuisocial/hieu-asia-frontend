'use client';

import * as React from 'react';

/**
 * ReadingRitual — loading state dùng chung cho các quiz tính cách.
 *
 * Thay thế bare Skeleton khi AI đang luận giải kết quả. Hiển thị một
 * astrolabe SVG quay nhẹ + chuỗi tin nhắn xoay nhau để truyền cảm giác
 * "nghi thức" — không phải chờ kỹ thuật thuần tuý.
 *
 * Props:
 *   messages — mảng string, mỗi message hiện ~2s rồi đổi sang cái tiếp theo
 *   (lặp vô hạn cho đến khi unmount).
 */
export function ReadingRitual({ messages }: { messages: string[] }) {
  const [idx, setIdx] = React.useState(0);
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    if (!messages.length) return;
    const id = setInterval(() => {
      setVisible(false);
      const timer = setTimeout(() => {
        setIdx((prev) => (prev + 1) % messages.length);
        setVisible(true);
      }, 400);
      return () => clearTimeout(timer);
    }, 2200);
    return () => clearInterval(id);
  }, [messages.length]);

  const msg = messages[idx] ?? '';

  return (
    <div className="flex flex-col items-center gap-0 py-8 text-center" role="status" aria-live="polite">
      {/* Astrolabe SVG — ba vòng tròn xoay với tốc độ khác nhau */}
      <svg
        width="96"
        height="96"
        viewBox="0 0 200 200"
        aria-hidden="true"
        className="mb-6"
      >
        {/* Vòng ngoài + tick marks — xoay xuôi chậm */}
        <g
          style={{
            transformOrigin: '100px 100px',
            animation: 'ritualSpin1 14s linear infinite',
          }}
        >
          <circle cx="100" cy="100" r="86" stroke="currentColor" strokeWidth="1" fill="none" className="text-gold/60" />
          <line x1="100" y1="14" x2="100" y2="26" stroke="currentColor" strokeWidth="1.5" className="text-gold/60" />
          <line x1="100" y1="174" x2="100" y2="186" stroke="currentColor" strokeWidth="1.5" className="text-gold/60" />
          <line x1="14" y1="100" x2="26" y2="100" stroke="currentColor" strokeWidth="1.5" className="text-gold/60" />
          <line x1="174" y1="100" x2="186" y2="100" stroke="currentColor" strokeWidth="1.5" className="text-gold/60" />
        </g>
        {/* Vòng giữa dashed — xoay ngược */}
        <g
          style={{
            transformOrigin: '100px 100px',
            animation: 'ritualSpin2 22s linear infinite reverse',
          }}
        >
          <circle
            cx="100"
            cy="100"
            r="64"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 8"
            fill="none"
            className="text-gold/50"
          />
        </g>
        {/* Lõi pulse */}
        <g
          style={{
            transformOrigin: '100px 100px',
            animation: 'ritualPulse 2.6s ease-in-out infinite',
          }}
        >
          <circle cx="100" cy="100" r="22" stroke="currentColor" strokeWidth="1" fill="none" className="text-gold/60" />
          <circle cx="100" cy="100" r="3" className="fill-gold" />
        </g>
      </svg>

      {/* Keyframes nhúng inline — không cần Tailwind plugin */}
      <style>{`
        @keyframes ritualSpin1 { to { transform: rotate(360deg); } }
        @keyframes ritualSpin2 { to { transform: rotate(360deg); } }
        @keyframes ritualPulse {
          0%,100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.12); }
        }
      `}</style>

      {/* Rotating message */}
      <p
        className="font-heading text-base italic text-foreground/80 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0, minHeight: '1.6em' }}
      >
        {msg}
      </p>

      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
        AI đang luận giải · không tắt trang
      </p>
    </div>
  );
}
