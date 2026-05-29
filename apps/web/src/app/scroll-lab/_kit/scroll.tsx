'use client';

import * as React from 'react';

/**
 * scroll.tsx — nền scroll-animation cho /scroll-lab (hieu.asia).
 *
 * Hợp đồng export (5 section khác build lên — tên + props phải đúng):
 *   - Reveal           fade + translateY khi vào viewport (IntersectionObserver, 1 lần)
 *   - Parallax         dịch translate theo tiến trình cuộn của phần tử
 *   - Pinned           ghim child (sticky h:100vh) trong vùng cao 'height', gọi children(progress)
 *   - useScrollProgress(ref) → 0..1 tiến trình phần tử qua viewport
 *   - ScrollProgress   thanh tiến trình đọc fixed top, ochre
 *
 * Cơ chế (RÀNG BUỘC):
 *   - transform / opacity ONLY (compositor-safe). KHÔNG scroll-jacking — cuộn tự nhiên, hiệu ứng bám tiến trình.
 *   - MỘT scroll listener passive + MỘT resize listener + MỘT vòng rAF dùng chung cho
 *     Parallax / Pinned / useScrollProgress / ScrollProgress (registry). KHÔNG mỗi component một listener.
 *   - Reveal dùng IntersectionObserver riêng (đúng spec).
 *   - rAF là cơ chế chính, cross-browser (KHÔNG dựa vào CSS animation-timeline — Safari/FF chưa đủ).
 *   - prefers-reduced-motion: reduce → trạng thái cuối tĩnh, KHÔNG phụ thuộc scroll/JS.
 *   - SSR-safe: không đụng window khi render; nội dung đọc được nếu JS fail (Reveal hiện mặc định,
 *     chỉ ẩn sau mount khi cho phép motion).
 *   - Cleanup đầy đủ khi unmount. Refs React 19 useRef<T>(null).
 */

const OCHRE = '#A47532';

/* ───────────────────────── reduced-motion hook ─────────────────────────
 * SSR-safe: trả false trên server + lần render đầu (tránh hydration mismatch),
 * cập nhật sau mount. Lắng nghe thay đổi của media query.
 */
function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    // addEventListener('change') chuẩn; fallback addListener cho Safari cũ.
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    }
    mq.addListener(apply);
    return () => mq.removeListener(apply);
  }, []);

  return reduced;
}

/* ───────────────────────── shared scroll registry ─────────────────────────
 * Một listener scroll (passive) + một listener resize, gom vào một vòng rAF.
 * Mỗi subscriber là callback chạy mỗi frame có thay đổi; tự đọc geometry & ghi style.
 * Lazy-init khi có subscriber đầu tiên; tear-down khi rỗng.
 */
type Subscriber = () => void;

const subscribers = new Set<Subscriber>();
let rafId = 0;
let listening = false;

function runAll(): void {
  rafId = 0;
  // Lặp trên bản sao để callback có thể unsubscribe an toàn trong lúc chạy.
  for (const fn of Array.from(subscribers)) fn();
}

function schedule(): void {
  if (rafId !== 0) return;
  if (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {
    // Môi trường không có rAF (không kỳ vọng ở client) — chạy đồng bộ để vẫn cập nhật.
    runAll();
    return;
  }
  rafId = window.requestAnimationFrame(runAll);
}

function startListening(): void {
  if (listening || typeof window === 'undefined') return;
  listening = true;
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  // Một số trình duyệt/đổi orientation đổi layout mà không bắn 'resize' đúng lúc.
  window.addEventListener('orientationchange', schedule, { passive: true });
}

function stopListening(): void {
  if (!listening || typeof window === 'undefined') return;
  listening = false;
  window.removeEventListener('scroll', schedule);
  window.removeEventListener('resize', schedule);
  window.removeEventListener('orientationchange', schedule);
  if (rafId !== 0) {
    window.cancelAnimationFrame(rafId);
    rafId = 0;
  }
}

/** Đăng ký một callback chạy mỗi frame-cuộn. Trả hàm unsubscribe. Chạy 1 lần ngay để set vị trí ban đầu. */
function subscribe(fn: Subscriber): () => void {
  subscribers.add(fn);
  startListening();
  fn(); // set trạng thái đúng ngay khi mount (không chờ scroll đầu tiên)
  return () => {
    subscribers.delete(fn);
    if (subscribers.size === 0) stopListening();
  };
}

/* ───────────────────────── geometry helper ─────────────────────────
 * progress 0..1: 0 = mép trên phần tử chạm đáy viewport, 1 = mép dưới rời đỉnh viewport.
 * Tổng quãng cuộn = viewportH + chiều cao phần tử. Clamp [0,1].
 */
function elementProgress(el: HTMLElement): number {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight || 0;
  const denom = vh + rect.height;
  if (denom <= 0) return 0;
  const p = (vh - rect.top) / denom;
  return p < 0 ? 0 : p > 1 ? 1 : p;
}

function clamp01(n: number): number {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

/* ───────────────────────────── Reveal ───────────────────────────── */

export function Reveal(props: {
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
}): React.JSX.Element {
  const { children, as = 'div', className, delay = 0, y = 28, amount = 0.2 } = props;
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLElement>(null);
  // mounted: trước mount luôn hiện (SSR / no-JS đọc được). Sau mount, nếu cho phép motion → ẩn rồi reveal.
  const [mounted, setMounted] = React.useState(false);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (reduced) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true); // không observer → hiện luôn, không để ẩn vĩnh viễn
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect(); // chạy 1 lần
            break;
          }
        }
      },
      { threshold: amount },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, amount]);

  // Trạng thái ẩn chỉ áp dụng SAU mount và KHI cho phép motion → SSR/no-JS không bao giờ kẹt opacity:0.
  const hidden = mounted && !reduced && !shown;

  const style: React.CSSProperties = {
    opacity: hidden ? 0 : 1,
    transform: hidden ? `translate3d(0, ${y}px, 0)` : 'translate3d(0, 0, 0)',
    transition: reduced
      ? undefined
      : `opacity .7s cubic-bezier(.22,.61,.36,1) ${delay}s, transform .7s cubic-bezier(.22,.61,.36,1) ${delay}s`,
    willChange: hidden ? 'opacity, transform' : undefined,
  };

  const Tag = as as React.ElementType;
  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}

/* ──────────────────────────── Parallax ────────────────────────────
 * Dịch translate theo tiến trình cuộn của phần tử. progress 0..1 map về -1..1
 * (giữa viewport = 0), nhân speed → dịch tối đa ~ speed * 50% kích thước trục.
 */
export function Parallax(props: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  axis?: 'x' | 'y';
}): React.JSX.Element {
  const { children, className, speed = 0.2, axis = 'y' } = props;
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (reduced) {
      const el = ref.current;
      if (el) el.style.transform = '';
      return;
    }
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const p = elementProgress(el); // 0..1
      const centered = (p - 0.5) * 2; // -1..1, 0 ở giữa viewport
      const dim = axis === 'y' ? el.offsetHeight : el.offsetWidth;
      const shift = centered * speed * dim * 0.5;
      el.style.transform =
        axis === 'y' ? `translate3d(0, ${shift}px, 0)` : `translate3d(${shift}px, 0, 0)`;
    };

    const unsub = subscribe(update);
    return () => {
      unsub();
      if (ref.current) ref.current.style.transform = '';
    };
  }, [reduced, speed, axis]);

  const style: React.CSSProperties = reduced ? {} : { willChange: 'transform' };
  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

/* ───────────────────────────── Pinned ─────────────────────────────
 * Ghim child (sticky top:0, h:100vh) trong vùng cao 'height'. Gọi children(progress 0..1)
 * theo cuộn qua đoạn ghim. progress 0 = vùng vừa chạm đỉnh viewport;
 * 1 = đã cuộn hết phần dư (height - 100vh).
 * reduced-motion: không ghim, height auto, render children(0.5) tĩnh.
 */
export function Pinned(props: {
  height?: string;
  className?: string;
  children: (progress: number) => React.ReactNode;
}): React.JSX.Element {
  const { height = '300vh', className, children } = props;
  const reduced = useReducedMotion();
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (reduced) {
      setProgress(0.5); // trạng thái tĩnh giữa chừng, đẹp + không phụ thuộc scroll
      return;
    }
    const el = wrapRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight || 0;
      // Quãng cuộn khả dụng = tổng chiều cao vùng - 1 màn hình (phần child bị ghim).
      const scrollable = rect.height - vh;
      if (scrollable <= 0) {
        setProgress(0);
        return;
      }
      // -rect.top = số px đã cuộn qua kể từ khi đỉnh vùng chạm đỉnh viewport.
      const p = clamp01(-rect.top / scrollable);
      setProgress(p);
    };

    const unsub = subscribe(update);
    return () => unsub();
  }, [reduced]);

  if (reduced) {
    // Không ghim: vùng cao auto, child render tĩnh theo luồng tài liệu.
    return (
      <div ref={wrapRef} className={className}>
        <div style={{ minHeight: '100vh' }}>{children(progress)}</div>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className={className} style={{ position: 'relative', height }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {children(progress)}
      </div>
    </div>
  );
}

/* ──────────────────────── useScrollProgress ────────────────────────
 * 0..1 tiến trình phần tử đi qua viewport. reduced-motion: trả 1 (trạng thái cuối).
 */
export function useScrollProgress(ref: React.RefObject<HTMLElement | null>): number {
  const reduced = useReducedMotion();
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (reduced) {
      setProgress(1);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const update = () => setProgress(elementProgress(el));
    const unsub = subscribe(update);
    return () => unsub();
  }, [reduced, ref]);

  return progress;
}

/* ──────────────────────────── ScrollProgress ────────────────────────────
 * Thanh tiến trình đọc fixed top, width 0→100% theo cuộn cả trang. Màu ochre.
 * reduced-motion: ẩn (không phụ thuộc scroll).
 */
export function ScrollProgress(props?: { className?: string }): React.JSX.Element {
  const className = props?.className;
  const reduced = useReducedMotion();
  const barRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (reduced) return;
    const bar = barRef.current;
    if (!bar) return;

    const update = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? clamp01(scrollTop / max) : 0;
      // scaleX trên compositor — rẻ hơn đổi width.
      bar.style.transform = `scaleX(${p})`;
    };

    const unsub = subscribe(update);
    return () => unsub();
  }, [reduced]);

  if (reduced) return <></>;

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 100,
        pointerEvents: 'none',
      }}
    >
      <div
        ref={barRef}
        style={{
          height: '100%',
          background: OCHRE,
          transform: 'scaleX(0)',
          transformOrigin: '0 50%',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
