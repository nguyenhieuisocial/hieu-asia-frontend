'use client';

/**
 * SessionReplayPanel — in-admin session replay.
 *
 * Lists recent recordings (metadata: who, when, duration, clicks, errors, URL)
 * from PostHog server-side (key never leaks, no public link). Clicking a row
 * loads that recording's assembled events and plays them inside admin via the
 * bundled rrweb player. The list is the solid, supported part; playback is
 * best-effort (PostHog's snapshot API is undocumented/unstable) and degrades to
 * a soft message per-recording when a session can't be assembled.
 */

import * as React from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, cn } from '@hieu-asia/ui';
import { Clapperboard, MousePointerClick, AlertTriangle, Play } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { ErrorBlock } from '@/components/admin/error-block';

const RrwebPlayer = dynamic(() => import('./RrwebPlayer'), {
  ssr: false,
  loading: () => <div className="h-72 animate-pulse rounded bg-muted/30" />,
});

interface Recording {
  id: string;
  distinct_id: string | null;
  duration: number | null;
  start_time: string | null;
  start_url: string | null;
  click_count: number | null;
  keypress_count: number | null;
  console_error_count: number | null;
  person_name: string | null;
  viewed: boolean;
}
interface ListResponse {
  ok: boolean;
  recordings: Recording[];
  error?: string;
}

function fmtDuration(sec: number | null): string {
  if (sec == null) return '—';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}
function fmtTime(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

export default function SessionReplayPanel() {
  const [list, setList] = React.useState<ListResponse | null>(null);
  const [listLoading, setListLoading] = React.useState(true);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [events, setEvents] = React.useState<unknown[] | null>(null);
  const [playLoading, setPlayLoading] = React.useState(false);
  const [playErr, setPlayErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/admin/posthog/recordings?limit=40');
        const data = (await res.json().catch(() => ({ ok: false, recordings: [], error: `HTTP ${res.status}` }))) as ListResponse;
        if (!cancelled) setList(data);
      } catch (e) {
        if (!cancelled) setList({ ok: false, recordings: [], error: (e as Error).message });
      } finally {
        if (!cancelled) setListLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const play = React.useCallback(async (id: string) => {
    setActiveId(id);
    setEvents(null);
    setPlayErr(null);
    setPlayLoading(true);
    try {
      const res = await fetch(`/api/admin/posthog/recordings/${encodeURIComponent(id)}/snapshots`);
      const data = (await res.json().catch(() => ({ ok: false, events: [], error: `HTTP ${res.status}` }))) as {
        ok: boolean;
        events: unknown[];
        error?: string;
      };
      if (data.ok && data.events.length >= 2) {
        setEvents(data.events);
      } else {
        setPlayErr(data.error ?? 'Không phát lại được phiên này.');
      }
    } catch (e) {
      setPlayErr((e as Error).message);
    } finally {
      setPlayLoading(false);
    }
  }, []);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Xem lại phiên"
        description="Danh sách phiên khách + xem lại thao tác — lấy từ PostHog ngay trong admin, không qua trang họ, không lộ ra ngoài. (Phát video là best-effort vì PostHog để định dạng riêng.)"
        icon={<Clapperboard className="h-5 w-5" />}
      />

      {/* Player */}
      {activeId && (
        <Card>
          <CardContent className="space-y-2 p-3">
            <p className="font-mono text-[11px] text-muted-foreground">Phiên {activeId.slice(0, 12)}…</p>
            {playLoading && <div className="h-72 animate-pulse rounded bg-muted/30" />}
            {playErr && (
              <div className="rounded-md border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-200">
                {playErr}
              </div>
            )}
            {events && events.length >= 2 && <RrwebPlayer events={events} />}
          </CardContent>
        </Card>
      )}

      {/* List */}
      {listLoading && (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded bg-muted/30" />
          ))}
        </div>
      )}

      {list && !list.ok && <ErrorBlock compact message={list.error ?? 'Không tải được danh sách phiên.'} />}

      {list?.ok && list.recordings.length === 0 && (
        <EmptyState
          title="Chưa có phiên nào được ghi"
          description="PostHog chưa ghi phiên nào (hệ thống đang ít traffic). Mục sẽ tự đầy khi có khách thật."
          className="border-0 bg-transparent"
        />
      )}

      {list?.ok && list.recordings.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold/15 text-left font-mono text-[11px] uppercase tracking-wide text-gold/80">
                    <th className="px-3 py-2 font-medium">Người dùng</th>
                    <th className="px-3 py-2 font-medium">Bắt đầu</th>
                    <th className="px-3 py-2 font-medium">Dài</th>
                    <th className="px-3 py-2 font-medium">Click</th>
                    <th className="px-3 py-2 font-medium">Lỗi</th>
                    <th className="px-3 py-2 font-medium">Trang vào</th>
                    <th className="px-3 py-2 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {list.recordings.map((r) => (
                    <tr
                      key={r.id}
                      className={cn(
                        'border-b border-gold/10 last:border-0 hover:bg-gold/[0.03]',
                        activeId === r.id && 'bg-gold/5',
                      )}
                    >
                      <td className="px-3 py-2 font-mono text-xs text-foreground/85">
                        {r.person_name ?? r.distinct_id?.slice(0, 14) ?? '—'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-xs text-muted-foreground">
                        {fmtTime(r.start_time)}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs tabular-nums">{fmtDuration(r.duration)}</td>
                      <td className="px-3 py-2 text-xs tabular-nums text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <MousePointerClick className="h-3 w-3" aria-hidden />
                          {r.click_count ?? 0}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs tabular-nums">
                        {r.console_error_count ? (
                          <span className="inline-flex items-center gap-1 text-red-400">
                            <AlertTriangle className="h-3 w-3" aria-hidden />
                            {r.console_error_count}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </td>
                      <td
                        className="max-w-[22ch] truncate px-3 py-2 text-xs text-muted-foreground"
                        title={r.start_url ?? ''}
                      >
                        {r.start_url ?? '—'}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => void play(r.id)}
                          className="inline-flex items-center gap-1 rounded border border-gold/25 bg-gold/5 px-2 py-1 text-xs text-gold hover:border-gold/50"
                        >
                          <Play className="h-3 w-3" aria-hidden />
                          Phát
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
