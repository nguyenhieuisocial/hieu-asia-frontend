'use client';

/**
 * StreakCard — daily check-in / streak widget (Hướng 2: thói quen quay lại).
 *
 * Two layouts via `variant`:
 *  - 'card' (default): full widget for the authenticated /account feed (right
 *    after FeedHero).
 *  - 'compact': slim one-line strip for content pages (e.g. /tu-vi-hom-nay) —
 *    surfaces the check-in at the daily touch-point without stealing focus.
 *    Carries its own top margin and renders nothing while loading so it never
 *    flashes a skeleton at the (mostly anonymous) public-page audience.
 *
 * Reads the user's streak from the worker on mount and lets them check in once
 * per day. Milestones (7/30/100/365 days) earn a recognition badge + a congrats
 * line on the day they're hit — recognition only, still NO rewards economy.
 *
 * Degrades silently: if the user isn't signed in or the endpoint is briefly
 * unavailable (e.g. before the backend deploy lands), it renders nothing rather
 * than showing a broken state.
 */

import * as React from 'react';
import { Flame } from 'lucide-react';
import { getStreak, checkin, streakMilestone, type StreakView } from '@/lib/daily-checkin';
import { track } from '@/lib/analytics';

export function StreakCard({ variant = 'card' }: { variant?: 'card' | 'compact' } = {}) {
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
    if (!res) {
      setError(true);
      return;
    }
    setStreak(res.streak);
    // Measure real check-ins (not idempotent re-clicks) so we can see whether
    // the streak loop drives return visits — informs any future rewards call.
    if (!res.alreadyCheckedIn) {
      const m = streakMilestone(res.streak.current);
      track('daily_checkin', {
        streak_current: res.streak.current,
        streak_best: res.streak.best,
        milestone_days: m.justHit ? m.reached?.days : undefined,
        surface: variant,
      });
    }
  }

  if (phase === 'hidden') return null;
  if (phase === 'loading') {
    // Compact lives on public pages where most visitors are anonymous (and will
    // resolve to `hidden`); skip the skeleton so it doesn't flash for them.
    if (variant === 'compact') return null;
    return <div aria-hidden className="h-[148px] w-full animate-pulse rounded-xl bg-card/30" />;
  }
  if (!streak) return null;

  const { current, best, total, checkedInToday } = streak;
  const fresh = total === 0;
  const ms = streakMilestone(current);
  const ctaLabel = submitting
    ? 'Đang điểm danh…'
    : fresh
      ? 'Bắt đầu chuỗi ngày'
      : current > 0
        ? 'Điểm danh hôm nay'
        : 'Điểm danh lại';

  if (variant === 'compact') {
    return (
      <section
        aria-label="Điểm danh hằng ngày"
        className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-gold/25 bg-gold/[0.06] px-4 py-3"
      >
        <Flame
          className={`h-5 w-5 shrink-0 ${current > 0 ? 'text-gold' : 'text-muted-foreground/40'}`}
          aria-hidden
        />
        <p className="text-sm text-foreground/90">
          <span className="font-heading text-foreground">{current}</span> ngày liên tiếp
          {best > 0 && <span className="text-muted-foreground"> · kỷ lục {best}</span>}
        </p>
        {ms.reached && (
          <span
            className={`inline-flex items-center gap-1 rounded-full border border-gold/40 px-2 py-0.5 text-[11px] font-medium text-gold-700 ${
              ms.justHit ? 'bg-gold/15' : ''
            }`}
          >
            <span aria-hidden>{ms.justHit ? '🎉' : '🏅'}</span>
            {ms.justHit ? `Vừa đạt mốc ${ms.reached.label}!` : `Mốc ${ms.reached.label}`}
          </span>
        )}
        <div className="ml-auto">
          {checkedInToday ? (
            <span className="flex items-center gap-1.5 text-sm text-gold-700">
              <span aria-hidden>✓</span> Đã điểm danh hôm nay
            </span>
          ) : (
            <button
              type="button"
              onClick={handleCheckin}
              disabled={submitting}
              className="rounded-lg border border-gold/40 bg-gold/10 px-3.5 py-1.5 text-sm font-medium text-gold-700 transition hover:border-gold/60 hover:bg-gold/15 disabled:opacity-60"
            >
              {ctaLabel}
            </button>
          )}
        </div>
        {error && (
          <p role="alert" className="w-full text-xs text-red-400">
            Chưa điểm danh được — kiểm tra kết nối và thử lại.
          </p>
        )}
      </section>
    );
  }

  return (
    <section
      aria-labelledby="streak-h"
      className="rounded-xl border border-border bg-card/30 p-5"
    >
      {ms.justHit && ms.reached && (
        <p className="mb-3 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-sm text-gold-700">
          <span aria-hidden>🎉</span> Chúc mừng! Bạn vừa giữ chuỗi đủ{' '}
          <strong className="font-semibold">{ms.reached.label}</strong> liên tiếp.
        </p>
      )}

      <div className="mb-3 flex items-baseline justify-between">
        <div className="flex items-center gap-2">
          <h2 id="streak-h" className="font-heading text-base text-foreground/80 sm:text-lg">
            Chuỗi ngày của bạn
          </h2>
          {ms.reached && (
            <span className="inline-flex items-center gap-1 rounded-full border border-gold/40 px-2 py-0.5 text-[11px] font-medium text-gold-700">
              <span aria-hidden>🏅</span>
              {ms.reached.label}
            </span>
          )}
        </div>
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
              {ctaLabel}
            </button>
            {error && (
              <p role="alert" className="mt-2 text-xs text-red-400">
                Chưa điểm danh được — kiểm tra kết nối và thử lại.
              </p>
            )}
          </>
        )}
        {ms.next && (
          <p className="mt-2 text-xs text-muted-foreground">
            Còn <span className="text-foreground/80">{ms.toNext}</span> ngày tới mốc {ms.next.label}.
          </p>
        )}
      </div>
    </section>
  );
}
