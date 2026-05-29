'use client';

/**
 * ReadingProgress — thanh tiến độ đọc mảnh, gắn đầu trang báo cáo
 * (/reading/[id]/report). Cho biết người đọc đã cuộn qua bao nhiêu % nội dung.
 *
 * KHÔNG nhầm với `@/components/reading/reading-progress.tsx` (cùng tên export
 * `ReadingProgress` nhưng khác hẳn mục đích: file đó là live agent-run progress
 * cho trang /processing, subscribe `useAgentRun`). Component NÀY thuần frontend,
 * không fetch gì — chỉ phản ánh vị trí cuộn của tài liệu.
 *
 * Chiến lược (ưu tiên CSS thuần, JS chỉ khi cần):
 *  1) CSS scroll-driven animation — `animation-timeline: scroll(root block)`
 *     scale thanh theo trục X từ 0 → 1. 0 JS trên trục cuộn, mượt ở compositor.
 *     Bật qua `@supports (animation-timeline: scroll())`.
 *  2) JS-lite fallback — khi trình duyệt KHÔNG hỗ trợ scroll-timeline, HOẶC khi
 *     user bật reduced-motion (media query `prefers-reduced-motion: reduce`
 *     hoặc app-level opt-in `<html data-reduced-motion="true">`). Lý do tách
 *     reduced-motion sang JS: globals.css có rule
 *     `[data-reduced-motion='true'] * { animation-duration: 0.001s !important }`
 *     sẽ "đóng băng" scroll-timeline ở 100%, nên ta cập nhật width trực tiếp
 *     (KHÔNG dùng animation property) để thanh vẫn đúng — vì đây là thông tin
 *     hữu ích, không phải chuyển động trang trí.
 *
 * Editorial: thanh ochre/gold mảnh (3px), bo góc 2px, không gradient/đổ bóng.
 * a11y: role=progressbar + aria-valuenow cập nhật ở JS path; ở CSS path thanh
 * thuần trang trí nên ẩn khỏi a11y tree (aria-hidden) để screen reader không
 * đọc giá trị tĩnh sai lệch.
 */

import * as React from 'react';
import { cn } from '@hieu-asia/ui';

export interface ReadingProgressProps {
  /** Lớp bổ sung cho wrapper cố định (hiếm khi cần). */
  className?: string;
}

/** Có hỗ trợ CSS scroll-driven timeline không (an toàn SSR). */
function supportsScrollTimeline(): boolean {
  return (
    typeof CSS !== 'undefined' &&
    typeof CSS.supports === 'function' &&
    CSS.supports('animation-timeline: scroll()')
  );
}

export function ReadingProgress({ className }: ReadingProgressProps) {
  // `useJs=null` cho đến khi effect chạy phía client → tránh hydration mismatch.
  // null  → giả định CSS path (markup mặc định, không gắn listener).
  // true  → JS-lite path (không hỗ trợ CSS, hoặc reduced-motion).
  // false → CSS path xác nhận.
  const [useJs, setUseJs] = React.useState<boolean | null>(null);
  const [pct, setPct] = React.useState(0);

  React.useEffect(() => {
    const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compute = () => {
      const appReduced =
        document.documentElement.dataset.reducedMotion === 'true';
      // Dùng JS khi không hỗ trợ scroll-timeline HOẶC reduced-motion bật.
      setUseJs(!supportsScrollTimeline() || reduceMq.matches || appReduced);
    };
    compute();
    reduceMq.addEventListener('change', compute);
    return () => reduceMq.removeEventListener('change', compute);
  }, []);

  // JS-lite: cập nhật % theo scroll, throttle bằng rAF. Chỉ chạy khi useJs===true.
  React.useEffect(() => {
    if (useJs !== true) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const next = max > 0 ? Math.min(100, Math.max(0, (doc.scrollTop / max) * 100)) : 0;
      setPct(Math.round(next));
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [useJs]);

  const isCssPath = useJs !== true; // null (SSR/hydrate) hoặc false → CSS path

  return (
    <div
      className={cn(
        // Mảnh, cố định trên cùng, trên hầu hết overlay nhưng dưới Sheet/Dialog.
        // print:hidden — không in thanh tiến độ vào PDF.
        'fixed inset-x-0 top-0 z-40 h-[3px] print:hidden',
        className,
      )}
      // CSS path: thuần trang trí → ẩn khỏi a11y tree (giá trị tĩnh sẽ sai).
      // JS path: là progressbar thật, expose giá trị động cho screen reader.
      aria-hidden={isCssPath ? true : undefined}
      role={isCssPath ? undefined : 'progressbar'}
      aria-label={isCssPath ? undefined : 'Tiến độ đọc báo cáo'}
      aria-valuemin={isCssPath ? undefined : 0}
      aria-valuemax={isCssPath ? undefined : 100}
      aria-valuenow={isCssPath ? undefined : pct}
    >
      {/* Rãnh nền mảnh dựa trên đường kẻ ochre rất nhạt (giữ gu "rule"). */}
      <div className="absolute inset-0 bg-ochre/10" />
      {/* Thanh tiến độ — ochre đặc, bo góc 2px, không gradient/shadow. */}
      <div
        className={cn(
          'reading-progress__bar absolute inset-y-0 left-0 w-full origin-left rounded-r-[2px] bg-ochre',
          isCssPath && 'reading-progress__bar--css',
        )}
        style={isCssPath ? undefined : { transform: `scaleX(${pct / 100})` }}
      />

      {/* Scoped CSS scroll-driven animation (pattern inline-<style> như
          Sparkles/AnimatedBeam — tránh đụng globals.css). Chỉ áp dụng khi
          trình duyệt hỗ trợ; nếu không, `--css` class vẫn ở scaleX(0) và JS
          path đã được kích hoạt thay thế. */}
      <style>{`
        .reading-progress__bar--css { transform: scaleX(0); }
        @supports (animation-timeline: scroll()) {
          @keyframes reading-progress-grow {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
          }
          .reading-progress__bar--css {
            animation: reading-progress-grow linear both;
            animation-timeline: scroll(root block);
          }
        }
      `}</style>
    </div>
  );
}
