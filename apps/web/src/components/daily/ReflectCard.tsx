'use client';

/**
 * ReflectCard — "Câu hỏi suy ngẫm hôm nay"
 *
 * A calm editorial card surfacing a single reflective question keyed to the
 * current date (rotates daily, deterministic so SSR==CSR). The textarea is
 * private-by-default: content is persisted to localStorage under
 * `reflect:<isoDate>` and never leaves the browser.
 *
 * Design: matches the existing card style on /tu-vi-hom-nay
 * (rounded-xl border border-border bg-card/40).
 */

import * as React from 'react';

const QUESTIONS = [
  'Nếu hôm nay chỉ làm một việc khiến bạn tự hào, đó sẽ là việc gì?',
  'Điều gì đang chiếm nhiều năng lượng của bạn nhất — và liệu nó có xứng đáng không?',
  'Ai là người bạn muốn cảm ơn hôm nay, dù chỉ trong lòng?',
  'Có điều gì bạn đang trì hoãn vì sợ — không phải vì bận?',
  'Phiên bản tốt nhất của bạn hôm nay trông như thế nào?',
  'Điều nhỏ nào có thể làm cho ngày của ai đó tốt hơn — kể cả của chính bạn?',
  'Bạn đang mang theo lo lắng nào từ hôm qua mà thực ra không cần thiết?',
];

function getDailyQuestion(isoDate: string): string {
  // Simple deterministic pick: sum char codes of date string mod length
  let hash = 0;
  for (let i = 0; i < isoDate.length; i++) {
    hash = (hash + isoDate.charCodeAt(i)) % QUESTIONS.length;
  }
  return QUESTIONS[hash]!;
}

export function ReflectCard({ date }: { date: string }) {
  const question = getDailyQuestion(date);
  const storageKey = `reflect:${date}`;

  const [text, setText] = React.useState('');
  const [mounted, setMounted] = React.useState(false);

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  React.useEffect(() => {
    try {
      setText(localStorage.getItem(storageKey) ?? '');
    } catch {
      // localStorage unavailable (private mode, etc.) — silent
    }
    setMounted(true);
  }, [storageKey]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setText(val);
    try {
      if (val) {
        localStorage.setItem(storageKey, val);
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch {
      // silent
    }
  }

  // Render a stable placeholder shell during SSR / before hydration
  if (!mounted) {
    return (
      <div className="rounded-xl border border-border bg-card/40 p-5" aria-hidden>
        <p className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-gold/80">
          Câu hỏi suy ngẫm hôm nay
        </p>
        <p className="font-heading text-base italic leading-relaxed text-foreground/85">
          &ldquo;{question}&rdquo;
        </p>
      </div>
    );
  }

  return (
    <section
      aria-labelledby="reflect-heading"
      className="rounded-xl border border-border bg-card/40 p-5"
    >
      <p
        id="reflect-heading"
        className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-gold/80"
      >
        Câu hỏi suy ngẫm hôm nay
      </p>

      <blockquote className="mb-4 border-l-2 border-gold/30 pl-3 font-heading text-base italic leading-relaxed text-foreground/85">
        &ldquo;{question}&rdquo;
      </blockquote>

      <textarea
        value={text}
        onChange={handleChange}
        rows={3}
        placeholder="Viết vài dòng cho riêng bạn… (chỉ mình bạn thấy)"
        className="w-full resize-none rounded-lg border border-border bg-background/40 px-3.5 py-2.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gold/40"
        aria-label="Ghi chú cá nhân cho câu hỏi suy ngẫm hôm nay"
      />

      <p className="mt-2 font-mono text-[10px] text-muted-foreground">
        Lưu tự động · chỉ mình bạn thấy
      </p>
    </section>
  );
}
