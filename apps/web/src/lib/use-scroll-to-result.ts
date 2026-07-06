'use client';

import * as React from 'react';

/**
 * Cuộn tới khối kết quả sau khi user chủ động bấm xem — trên mobile kết quả
 * nằm dưới màn nên không cuộn thì tưởng bấm không ăn. Chỉ cuộn khi đã arm()
 * (user vừa bấm), không cuộn khi kết quả được khôi phục lúc mount (URL/localStorage).
 * Không truyền `behavior` — scrollIntoView dùng CSS scroll-behavior của html
 * (smooth, tự thành auto khi prefers-reduced-motion).
 */
export function useScrollToResult<T>(result: T): {
  resultRef: React.RefObject<HTMLDivElement | null>;
  armScroll: () => void;
} {
  const resultRef = React.useRef<HTMLDivElement | null>(null);
  const armed = React.useRef(false);
  const armScroll = React.useCallback(() => {
    armed.current = true;
  }, []);
  React.useEffect(() => {
    if (!result || !armed.current) return;
    armed.current = false;
    resultRef.current?.scrollIntoView({ block: 'start' });
  }, [result]);
  return { resultRef, armScroll };
}
