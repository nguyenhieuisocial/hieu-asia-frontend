'use client';

/**
 * DownloadToolPdfButton — reusable "Tải PDF" for any free tool.
 *
 * Sends the tool's already-computed result as a generic {title, subtitle,
 * sections} payload to the worker /tools/pdf route (which renders a branded A4
 * PDF + returns a signed URL), then triggers a download. v1 is download-only;
 * the email-gate (lead capture for anonymous users) is a follow-up.
 */

import * as React from 'react';
import { Download, Loader2 } from 'lucide-react';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_HIEU_API_URL ?? 'https://api.hieu.asia';

export interface ToolPdfPayload {
  title: string;
  subtitle?: string;
  sections: Array<{
    heading: string;
    rows?: Array<{ label: string; value: string }>;
    text?: string;
  }>;
}

export function DownloadToolPdfButton({
  payload,
  label = 'Tải PDF',
  className,
}: {
  /** The payload, or a getter (so it's read at click time from latest state). */
  payload: ToolPdfPayload | (() => ToolPdfPayload | null);
  label?: string;
  className?: string;
}) {
  const [state, setState] = React.useState<'idle' | 'loading' | 'error'>('idle');

  async function handleClick() {
    const body = typeof payload === 'function' ? payload() : payload;
    if (!body) return;

    // Open the result tab SYNCHRONOUSLY, while the click's user-activation is
    // still valid. If the tab is opened only AFTER the awaited fetch, Safari/iOS
    // (and popup blockers) treat it as a programmatic popup and silently block
    // it — the download just never appears. The blank tab shows a placeholder
    // until the signed PDF URL is ready, then we point it at the file.
    const win = typeof window !== 'undefined' ? window.open('about:blank', '_blank') : null;
    if (win) {
      win.document.write(
        '<!doctype html><meta charset="utf-8"><title>Đang tạo PDF…</title>' +
          '<body style="margin:0;font-family:system-ui,sans-serif;padding:2.5rem;color:#3a2f1a;background:#f3ecdd">Đang tạo PDF…</body>',
      );
    }

    setState('loading');
    try {
      const res = await fetch(`${API_BASE}/tools/pdf`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { ok?: boolean; url?: string; error?: string };
      if (!data?.ok || !data?.url) throw new Error(data?.error || 'pdf_failed');
      if (win) {
        win.location.href = data.url;
      } else {
        // Popup blocked despite the sync open — fall back to an anchor click.
        const a = document.createElement('a');
        a.href = data.url;
        a.target = '_blank';
        a.rel = 'noopener';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
      setState('idle');
    } catch {
      if (win) win.close();
      setState('error');
      window.setTimeout(() => setState('idle'), 3500);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={state === 'loading'}
      className={
        className ??
        'inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/[0.06] px-4 py-2.5 text-sm font-medium text-gold transition-colors hover:bg-gold/[0.12] disabled:opacity-60'
      }
      aria-label="Tải kết quả ra PDF"
    >
      {state === 'loading' ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : (
        <Download className="h-4 w-4" aria-hidden />
      )}
      {state === 'loading' ? 'Đang tạo PDF…' : state === 'error' ? 'Lỗi — thử lại' : label}
    </button>
  );
}
