'use client';

import * as React from 'react';
import { Button } from '@hieu-asia/ui';
import { track } from '@/lib/analytics';

/**
 * Nút chia sẻ kết quả — dùng Web Share API (mobile) với fallback copy link.
 * `path` là đường dẫn tương đối (vd "/big-five?r=72-65-80-55-40"); component
 * tự ghép origin để ra URL đầy đủ shareable.
 */
export function ShareResultButton({
  path,
  title,
  text,
  trackId,
  label,
}: {
  path: string;
  title: string;
  text: string;
  trackId: string;
  /** Override default button label "Chia sẻ kết quả" */
  label?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const onShare = async () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}${path}` : path;
    track('result_shared', { tool: trackId });
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }
    } catch {
      // user huỷ share sheet — không coi là lỗi, rơi xuống copy.
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Button variant="outline" onClick={onShare} aria-live="polite">
      {copied ? 'Đã copy link ✓' : (label ?? 'Chia sẻ kết quả')}
    </Button>
  );
}
