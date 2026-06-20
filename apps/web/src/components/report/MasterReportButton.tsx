'use client';

/**
 * "Tải báo cáo tổng hợp" — the 200-500 page master compendium (Cẩm Nang Cuộc Đời).
 *
 * The master is generated on demand (many AI calls, ~10-15 min) by the
 * master-orchestrate Edge Function, then rendered to PDF by the same server-side
 * Chromium path the single report uses (?doc=master).
 *
 * States:
 *   none       → "Tạo báo cáo tổng hợp" (kicks off build-master, then polls)
 *   generating → "Đang tạo… X/Y mục" (polls master-status)
 *   ready      → "Tải báo cáo tổng hợp (PDF)" (downloads ?doc=master)
 */

import * as React from 'react';
import { Button } from '@hieu-asia/ui';
import { FileStack, Loader2 } from 'lucide-react';
import { track } from '@/lib/analytics';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hieu.asia';

type MasterStatus = 'none' | 'generating' | 'ready' | 'error';

async function getToken(): Promise<string | null> {
  try {
    const { getSupabaseAuth } = await import('@/lib/auth-client');
    const supabase = getSupabaseAuth();
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  } catch {
    return null;
  }
}

export function MasterReportButton({ readingId }: { readingId: string }) {
  const [status, setStatus] = React.useState<MasterStatus>('none');
  const [done, setDone] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  const [busy, setBusy] = React.useState<'idle' | 'building' | 'downloading'>('idle');
  const [msg, setMsg] = React.useState<string | null>(null);
  const pollRef = React.useRef<number | null>(null);

  const checkStatus = React.useCallback(async (): Promise<MasterStatus> => {
    const t = await getToken();
    if (!t) return 'none';
    try {
      const r = await fetch(`${API_BASE}/reading/${encodeURIComponent(readingId)}/master-status`, {
        headers: { authorization: `Bearer ${t}` },
        cache: 'no-store',
      });
      if (!r.ok) return 'none';
      const b = (await r.json()) as { status?: MasterStatus; sections_done?: number; sections_total?: number };
      setDone(b.sections_done ?? 0);
      setTotal(b.sections_total ?? 0);
      const s = (b.status ?? 'none') as MasterStatus;
      setStatus(s);
      return s;
    } catch {
      return 'none';
    }
  }, [readingId]);

  // Initial status check.
  React.useEffect(() => {
    void checkStatus();
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, [checkStatus]);

  // Poll while generating.
  React.useEffect(() => {
    if (status !== 'generating') {
      if (pollRef.current) window.clearInterval(pollRef.current);
      return;
    }
    pollRef.current = window.setInterval(() => void checkStatus(), 15_000);
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, [status, checkStatus]);

  const onBuild = async () => {
    setBusy('building');
    setMsg(null);
    const t = await getToken();
    if (!t) {
      setBusy('idle');
      setMsg('Vui lòng đăng nhập để tạo báo cáo tổng hợp.');
      return;
    }
    try {
      const r = await fetch(`${API_BASE}/reading/${encodeURIComponent(readingId)}/build-master`, {
        method: 'POST',
        headers: { authorization: `Bearer ${t}` },
        cache: 'no-store',
      });
      if (r.status === 402 || r.status === 403) {
        setMsg('Mở khoá báo cáo trả phí để tạo bản tổng hợp.');
      } else if (!r.ok) {
        setMsg('Không tạo được báo cáo tổng hợp, vui lòng thử lại.');
      } else {
        track('master_build_started', { reading_id: readingId });
        setStatus('generating');
        void checkStatus();
      }
    } catch {
      setMsg('Lỗi kết nối, vui lòng thử lại.');
    } finally {
      setBusy('idle');
    }
  };

  const onDownload = async () => {
    setBusy('downloading');
    setMsg(null);
    const t = await getToken();
    if (!t) {
      setBusy('idle');
      setMsg('Vui lòng đăng nhập để tải báo cáo.');
      return;
    }
    try {
      const res = await fetch(`/api/reading/${encodeURIComponent(readingId)}/export-pdf?doc=master`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${t}` },
        cache: 'no-store',
      });
      if (!res.ok) {
        let m = 'Tạo PDF thất bại, vui lòng thử lại.';
        try {
          const b = (await res.json()) as { error?: string };
          if (b.error) m = b.error;
        } catch {
          /* ignore */
        }
        setMsg(m);
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Cam-Nang-Cuoc-Doi-Tong-Hop.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      track('master_pdf_downloaded', { reading_id: readingId });
    } catch {
      setMsg('Lỗi kết nối, vui lòng thử lại.');
    } finally {
      setBusy('idle');
    }
  };

  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="rounded-lg border border-gold/25 bg-card/40 p-4">
      <div className="flex items-start gap-3">
        <FileStack className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="font-heading text-base text-foreground">Báo cáo tổng hợp — Cẩm Nang Cuộc Đời</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Gộp mọi lăng kính (Tử Vi · Bát Tự · thần số · 12 cung · vận hạn) thành một chân dung toàn diện,
            đối chiếu cổ thư, tải về một file PDF lưu vĩnh viễn.
          </p>

          {status === 'generating' && (
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>Đang tạo… {done}/{total || '—'} mục</span>
                <span>{pct}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded bg-muted/15">
                <div className="h-full bg-gold transition-all" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Mất khoảng 10–15 phút. Bạn có thể rời trang và quay lại — tiến độ vẫn được lưu.
              </p>
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {status === 'ready' ? (
              <Button onClick={onDownload} disabled={busy !== 'idle'}>
                {busy === 'downloading' ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" aria-hidden /> Đang tạo PDF…
                  </>
                ) : (
                  'Tải báo cáo tổng hợp (PDF)'
                )}
              </Button>
            ) : status === 'generating' ? (
              <Button variant="outline" disabled>
                <Loader2 className="mr-2 size-4 animate-spin" aria-hidden /> Đang tạo…
              </Button>
            ) : (
              <Button onClick={onBuild} disabled={busy !== 'idle'}>
                {busy === 'building' ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" aria-hidden /> Đang khởi tạo…
                  </>
                ) : (
                  'Tạo báo cáo tổng hợp'
                )}
              </Button>
            )}
          </div>

          {msg && (
            <p className="mt-2 rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-sm text-foreground/80">
              {msg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
