'use client';

/**
 * RrwebPlayer — minimal in-admin replay surface built on rrweb's core Replayer
 * (not the Svelte rrweb-player wrapper, to keep the Next bundle simple). Plays
 * a pre-assembled event array. Everything is same-origin + bundled, so it sits
 * inside the admin's strict CSP (script-src 'self'). Construction is wrapped in
 * try/catch: PostHog's snapshot format is undocumented/unstable, so a recording
 * that won't assemble shows a soft message instead of crashing the page.
 */

import * as React from 'react';
import 'rrweb-player/dist/style.css';

interface Props {
  events: unknown[];
}

export default function RrwebPlayer({ events }: Props) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host || events.length < 2) return;
    host.innerHTML = '';
    let player: { $destroy?: () => void } | null = null;
    let cancelled = false;
    (async () => {
      try {
        const mod = await import('rrweb-player');
        if (cancelled || !hostRef.current) return;
        const PlayerCtor = mod.default as unknown as new (args: {
          target: HTMLElement;
          props: { events: unknown[]; width?: number; autoPlay?: boolean; showController?: boolean };
        }) => { $destroy?: () => void };
        player = new PlayerCtor({
          target: hostRef.current,
          props: {
            events,
            width: Math.min(hostRef.current.clientWidth || 900, 1100),
            autoPlay: false,
            showController: true,
          },
        });
      } catch (e) {
        if (!cancelled) setErr((e as Error).message || 'Không phát lại được phiên này.');
      }
    })();
    return () => {
      cancelled = true;
      try {
        player?.$destroy?.();
      } catch {
        /* ignore */
      }
    };
  }, [events]);

  if (err) {
    return (
      <div className="rounded-md border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-200">
        Không phát lại được phiên này ({err}). Dữ liệu video của PostHog ở định dạng riêng — phiên khác có thể vẫn phát được.
      </div>
    );
  }
  return <div ref={hostRef} className="overflow-auto rounded-md border border-border bg-black/40" />;
}
