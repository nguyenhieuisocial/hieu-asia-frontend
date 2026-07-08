'use client';

import * as React from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * BackToTop — nút "về đầu trang" cho trang dài. CHỈ mobile (`md:hidden`) để
 * KHÔNG đè FloatingMentor (desktop-only, cùng góc phải-dưới). Hiện sau khi cuộn
 * quá ~2 màn hình → trang ngắn không bao giờ thấy (không cần chọn "trang nào").
 *
 * An toàn chồng lớp: `z-30` < StickyMobileCta/FloatingMentor (`z-40`) → trang có
 * thanh CTA đáy thì CTA luôn thắng (nút ẩn sau), không chồng xấu. Tap-target
 * 44px, tôn trọng safe-area đáy + reduced-motion (cuộn tức thì nếu người dùng
 * tắt hiệu ứng).
 */
export function BackToTop(): React.JSX.Element {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 2);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toTop = React.useCallback(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }, []);

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Về đầu trang"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed right-4 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-30 inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-card/90 text-foreground shadow-[0_6px_24px_-8px_rgba(0,0,0,0.35)] backdrop-blur-md transition-opacity duration-300 hover:border-gold/60 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold md:hidden ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <ArrowUp className="h-5 w-5 text-gold" aria-hidden />
    </button>
  );
}
