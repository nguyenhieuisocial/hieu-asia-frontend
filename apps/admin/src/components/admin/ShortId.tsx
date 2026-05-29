'use client';

import { useState } from 'react';

/**
 * Wave 63 — ShortId. Founder: customer/session UUIDs render too long
 * (`01ceb312-6cc1-4ba5-a826-51f5ac9c1bcf`). This shows a compact prefix in a
 * mono chip, keeps the full id in `title` (hover) + copies it on click.
 *
 * Default shows first 8 chars (`01ceb312…`) — enough to eyeball-match a row
 * without dominating the layout. Pass `chars` to override, `prefix` to strip a
 * known leading namespace (e.g. `tg-`, `sess_`).
 */
export function ShortId({
  id,
  chars = 8,
  prefix,
  className = '',
}: {
  id: string | null | undefined;
  chars?: number;
  prefix?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  if (!id) return <span className="text-muted-foreground/50">—</span>;

  const stripped = prefix && id.startsWith(prefix) ? id.slice(prefix.length) : id;
  const short = stripped.length > chars ? `${stripped.slice(0, chars)}…` : stripped;

  const copy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* clipboard blocked — title still shows full id */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      title={copied ? 'Đã copy!' : `${id} · bấm để copy`}
      className={`inline-flex items-center gap-1 rounded-[2px] border border-border/60 bg-muted/40 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground ${className}`}
    >
      {copied ? 'đã copy' : short}
    </button>
  );
}
