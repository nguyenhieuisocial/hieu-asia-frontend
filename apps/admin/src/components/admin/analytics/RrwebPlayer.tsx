'use client';

/**
 * RrwebPlayer — in-admin replay built on rrweb's core Replayer (`@rrweb/replay`)
 * DIRECTLY, with our own play/seek controls. We dropped the `rrweb-player` Svelte
 * wrapper: instantiated inside Next via dynamic import it mounted its chrome but
 * never populated the replay frame (Svelte lifecycle didn't run the inner
 * Replayer). Driving the Replayer ourselves is bundled + same-origin, so it sits
 * inside the admin's strict CSP, and any failure surfaces a soft message instead
 * of an empty box. Events arrive already gunzipped server-side (see posthog-server).
 */

import * as React from 'react';
import '@rrweb/replay/dist/style.css';
import { Play, Pause } from 'lucide-react';

interface Props {
  events: unknown[];
}

interface ReplayerLike {
  getMetaData(): { totalTime: number; startTime: number; endTime: number };
  getCurrentTime(): number;
  play(timeOffset?: number): void;
  pause(timeOffset?: number): void;
}

function fmt(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export default function RrwebPlayer({ events }: Props) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const replayerRef = React.useRef<ReplayerLike | null>(null);
  const [err, setErr] = React.useState<string | null>(null);
  const [playing, setPlaying] = React.useState(false);
  const [total, setTotal] = React.useState(0);
  const [cur, setCur] = React.useState(0);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host || events.length < 2) return;
    host.innerHTML = '';
    let cancelled = false;
    let raf = 0;
    let replayer: ReplayerLike | null = null;
    (async () => {
      try {
        const mod = await import('@rrweb/replay');
        if (cancelled || !hostRef.current) return;
        const Replayer = mod.Replayer as unknown as new (
          events: unknown[],
          config: { root: HTMLElement; skipInactive?: boolean; showWarning?: boolean; mouseTail?: boolean },
        ) => ReplayerLike;
        replayer = new Replayer(events, {
          root: hostRef.current,
          skipInactive: true,
          showWarning: false,
          mouseTail: false,
        });
        replayerRef.current = replayer;
        setTotal(replayer.getMetaData().totalTime);

        // Scale the recorded viewport down to fit the panel width (Replayer
        // renders at the original page size; a 1920px page would overflow).
        const meta = events.find((e) => (e as { type?: number }).type === 4) as
          | { data?: { width?: number } }
          | undefined;
        const recW = meta?.data?.width;
        const wrap = hostRef.current.querySelector('.replayer-wrapper') as HTMLElement | null;
        if (wrap && recW && hostRef.current.clientWidth) {
          const scale = Math.min(1, hostRef.current.clientWidth / recW);
          wrap.style.transform = `scale(${scale})`;
          wrap.style.transformOrigin = 'top left';
        }

        replayer.play();
        setPlaying(true);
        const tick = () => {
          if (cancelled || !replayer) return;
          try {
            setCur(replayer.getCurrentTime());
          } catch {
            /* ignore */
          }
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      } catch (e) {
        if (!cancelled) setErr((e as Error).message || 'Không phát lại được phiên này.');
      }
    })();
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      try {
        replayer?.pause();
      } catch {
        /* ignore */
      }
    };
  }, [events]);

  const toggle = () => {
    const r = replayerRef.current;
    if (!r) return;
    if (playing) {
      r.pause();
      setPlaying(false);
    } else {
      r.play(r.getCurrentTime());
      setPlaying(true);
    }
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const r = replayerRef.current;
    if (!r || !total) return;
    const t = (Number(e.target.value) / 1000) * total;
    r.play(t);
    setCur(t);
    setPlaying(true);
  };

  if (err) {
    return (
      <div className="rounded-md border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-200">
        Không phát lại được phiên này ({err}). Dữ liệu video của PostHog ở định dạng riêng — phiên khác có thể vẫn phát được.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        ref={hostRef}
        className="relative max-h-[60vh] overflow-auto rounded-md border border-border bg-white"
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          className="inline-flex items-center gap-1 rounded border border-gold/30 bg-gold/10 px-2.5 py-1 text-sm text-gold hover:border-gold/60"
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {playing ? 'Tạm dừng' : 'Phát'}
        </button>
        <input
          type="range"
          min={0}
          max={1000}
          value={total ? Math.min(1000, (cur / total) * 1000) : 0}
          onChange={onSeek}
          aria-label="Tua phiên"
          className="h-1 flex-1 cursor-pointer accent-gold"
        />
        <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
          {fmt(cur)} / {fmt(total)}
        </span>
      </div>
    </div>
  );
}
