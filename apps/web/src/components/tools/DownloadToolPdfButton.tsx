'use client';

/**
 * DownloadToolPdfButton — reusable "Tải PDF" for any free tool.
 *
 * Sends the tool's already-computed result as a generic {title, subtitle,
 * sections} payload to the worker /tools/pdf route (which renders a branded A4
 * PDF + returns a signed URL), then opens it.
 *
 * v2 — email-gate (lead capture):
 *   • Logged-in user  → tải thẳng (đã có thông tin rồi, không hỏi lại).
 *   • Khách ẩn danh    → nhập email trước (lưu lead qua /email/subscribe) rồi tải.
 */

import * as React from 'react';
import { Download, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_HIEU_API_URL ?? 'https://api.hieu.asia';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  source = 'pdf',
}: {
  /** The payload, or a getter (so it's read at click time from latest state). */
  payload: ToolPdfPayload | (() => ToolPdfPayload | null);
  label?: string;
  className?: string;
  /** Nguồn lead (vd 'pdf-bat-tu') gắn vào bản ghi để biết tải từ công cụ nào. */
  source?: string;
}) {
  const { user } = useAuth();
  const [state, setState] = React.useState<'idle' | 'email' | 'loading' | 'error'>('idle');
  const [email, setEmail] = React.useState('');

  const getBody = (): ToolPdfPayload | null =>
    typeof payload === 'function' ? payload() : payload;

  // Open the result tab SYNCHRONOUSLY inside the click/submit gesture — if opened
  // only AFTER the awaited fetch, Safari/iOS + popup blockers treat it as a
  // programmatic popup and silently block it.
  function openTab(): Window | null {
    const win = typeof window !== 'undefined' ? window.open('about:blank', '_blank') : null;
    if (win) {
      win.document.write(
        '<!doctype html><meta charset="utf-8"><title>Đang tạo PDF…</title>' +
          '<body style="margin:0;font-family:system-ui,sans-serif;padding:2.5rem;color:#3a2f1a;background:#f3ecdd">Đang tạo PDF…</body>',
      );
    }
    return win;
  }

  async function renderAndOpen(win: Window | null, body: ToolPdfPayload) {
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
        const a = document.createElement('a');
        a.href = data.url;
        a.target = '_blank';
        a.rel = 'noopener';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
      setState('idle');
      setEmail('');
    } catch {
      if (win) win.close();
      setState('error');
      window.setTimeout(() => setState('idle'), 3500);
    }
  }

  // Logged-in → tải thẳng. Khách ẩn danh → mở cổng email (thu lead) trước.
  function handleClick() {
    const body = getBody();
    if (!body) return;
    if (user) {
      renderAndOpen(openTab(), body);
    } else {
      setState('email');
    }
  }

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = getBody();
    if (!body) return;
    const em = email.trim().toLowerCase();
    if (!EMAIL_RE.test(em) || em.length > 254) return;
    // Mở tab NGAY trong cú submit (Safari fix). Thu lead fire-and-forget (double
    // opt-in newsletter; KHÔNG chặn tải nếu lỗi).
    const win = openTab();
    void fetch(`${API_BASE}/email/subscribe`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: em, source: String(source).slice(0, 32) }),
    }).catch(() => {});
    renderAndOpen(win, body);
  }

  if (state === 'email') {
    return (
      <form onSubmit={handleEmailSubmit} className="flex w-full max-w-sm flex-col gap-1.5">
        <label className="text-xs text-muted-foreground">
          Nhập email để nhận bản PDF (+ thỉnh thoảng nội dung mới theo lá số — không spam):
        </label>
        <div className="flex items-center gap-2">
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@cua-ban.com"
            className="h-9 flex-1 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <button
            type="submit"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gold/40 bg-gold/[0.06] px-3.5 py-2 text-sm font-medium text-gold transition-colors hover:bg-gold/[0.12]"
          >
            <Download className="h-4 w-4" aria-hidden /> Tải PDF
          </button>
          <button
            type="button"
            onClick={() => {
              setState('idle');
              setEmail('');
            }}
            className="shrink-0 text-xs text-muted-foreground hover:text-foreground"
          >
            Hủy
          </button>
        </div>
      </form>
    );
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
