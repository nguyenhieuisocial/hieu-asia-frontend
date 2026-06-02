'use client';

/**
 * StreakCard — daily check-in / streak widget (Hướng 2: thói quen quay lại).
 *
 * Renders inside the authenticated /account feed (right after FeedHero). Reads
 * the user's streak from the worker on mount and lets them check in once per
 * day. No rewards economy — the consecutive-day count is the loop itself.
 *
 * Degrades silently: if the user isn't signed in or the endpoint is briefly
 * unavailable (e.g. before the backend deploy lands), the card hides rather
 * than showing a broken state.
 */

import * as React from 'react';
import { Flame } from 'lucide-react';
import { getStreak, checkin, type StreakView } from '@/lib/daily-checkin';

export function StreakCard() {
  const [phase, setPhase] = React.useState<'loading' | 'ready' | 'hidden'>('loading');
  const [streak, setStreak] = React.useState<StreakView | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    getStreak()
      .then((s) => {
        if (!alive) return;
        if (s) {
          setStreak(s);
          setPhase('ready');
        } else {
          setPhase('hidden');
        }
      })
      .catch(() => {
        if (alive) setPhase('hidden');
      });
    return () => {
      alive = false;
    };
  }, []);

  async function handleCheckin() {
    if (submitting || streak?.checkedInToday) return;
    setSubmitting(true);
    setError(false);
    const res = await checkin();
    setSubmitting(false);
    if (res) setStreak(res.streak);
    else setError(true);
  }

  if (phase === 'hidden') return null;
  if (phase === 'loading') {
    return <div aria-hidden className="h-[148px] w-full animate-pulse rounded-xl bg-card/30" />;
  }
  if (!streak) return null;

  const { current, best, total, checkedInToday } = streak;
  const fresh = total === 0;

  return (
    <section
      aria-labelledby="streak-h"
      className="rounded-xl border border-border bg-card/30 p-5"
    >
      <div className="mb-3 flex items-baseline justify-between">
        <h2 id="streak-h" className="font-heading text-base text-foreground/80 sm:text-lg">
          Chuỗi ngày của bạn
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Điểm danh
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Flame
          className={`h-7 w-7 shrink-0 ${current > 0 ? 'text-gold' : 'text-muted-foreground/40'}`}
          aria-hidden
        />
        <div>
          <div className="font-heading text-3xl leading-none text-foreground">{current}</div>
          <div className="text-xs text-muted-foreground">ngày liên tiếp</div>
        </div>
        <div className="ml-auto text-right text-xs text-muted-foreground">
          <div>
            Kỷ lục: <span className="text-foreground/80">{best}</span> ngày
          </div>
          <div>
            Tổng: <span className="text-foreground/80">{total}</span> ngày
          </div>
        </div>
      </div>

      <div className="mt-4">
        {checkedInToday ? (
          <p className="flex items-center gap-2 text-sm text-gold-700">
            <span aria-hidden>✓</span>
            Đã điểm danh hôm nay — quay lại ngày mai để giữ chuỗi.
          </p>
        ) : (
          <>
            <button
              type="button"
              onClick={handleCheckin}
              disabled={submitting}
              className="rounded-lg border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-medium text-gold-700 transition hover:border-gold/60 hover:bg-gold/15 disabled:opacity-60"
            >
              {submitting
                ? 'Đang điểm danh…'
                : fresh
                  ? 'Bắt đầu chuỗi ngày'
                  : current > 0
                    ? 'Điểm danh hôm nay'
                    : 'Điểm danh lại'}
            </button>
            {error && (
              <p role="alert" className="mt-2 text-xs text-red-400">
                Chưa điểm danh được — kiểm tra kết nối và thử lại.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
