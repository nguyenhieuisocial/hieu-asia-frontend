'use client';

/**
 * KeyNameCell — truncated middle + copy button (Wave 60.81.A.v2).
 *
 * Shows the env-var-style name with a click-to-copy affordance. We do NOT
 * surface the plaintext token here — that lives behind the Reveal flow in
 * the actions DropdownMenu. The masked preview is the visual hint.
 */

import * as React from 'react';
import { toast } from '@hieu-asia/ui';
import { Copy } from 'lucide-react';

export function KeyNameCell({
  keyName,
  preview,
}: {
  keyName: string;
  preview: string;
}) {
  const handleCopy = React.useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(keyName);
        toast('Đã copy tên key', { description: keyName });
      } catch {
        toast('Không copy được', {
          description: 'Trình duyệt từ chối clipboard. Thử chọn thủ công.',
        });
      }
    },
    [keyName],
  );

  // Truncate middle: keep prefix + last 6 chars
  const display =
    keyName.length > 24 ? `${keyName.slice(0, 12)}…${keyName.slice(-6)}` : keyName;

  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className="min-w-0">
        <div className="truncate font-mono text-xs text-foreground/85">{display}</div>
        <div className="truncate font-mono text-[10px] text-muted-foreground">
          {preview}
        </div>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy ${keyName}`}
        className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-gold/10 hover:text-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ochre dark:focus-visible:ring-gold"
      >
        <Copy className="h-3 w-3" aria-hidden />
      </button>
    </div>
  );
}
