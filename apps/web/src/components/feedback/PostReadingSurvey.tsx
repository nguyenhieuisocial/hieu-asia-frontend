'use client';

/**
 * PostReadingSurvey — Wave 60.95.w P1.
 *
 * Lightweight 3-CTA feedback toast that replaces the deferred "5-user
 * moderated UX test" from Vault 130 P1 with high-volume in-product feedback
 * via PostHog Surveys + custom `post_reading_feedback` event.
 *
 * Why a separate component vs. the existing `<SurveyPrompt>` (Wave 39 W-B):
 *   - `SurveyPrompt` renders dashboard-defined PostHog questions verbatim
 *     (rating scale / open / choice). That's the heavyweight path.
 *   - `PostReadingSurvey` is intentionally lightweight: 3 emoji buttons
 *     (👍 hữu ích / 👎 chưa rõ ràng / 💬 góp ý chi tiết). One-tap rating
 *     plus an optional textarea on "detail". Higher conversion than a
 *     traditional survey card because the cost-per-response is one tap.
 *   - Sends a custom `post_reading_feedback` event so the dashboard can
 *     distinguish quick-rating telemetry from formal `survey sent` events.
 *
 * Trigger logic:
 *   - 30s after mount (gives the user time to read).
 *   - Only when `process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'` —
 *     avoids spamming dev / preview users.
 *   - Per-survey/per-reading dismissal cached for 7 days in localStorage
 *     (`hieu.survey.dismissed.<surveyId>`).
 *   - Lazy-checks PostHog for an *active* matching survey before showing,
 *     so the founder can turn the prompt off via the PostHog dashboard
 *     without a redeploy.
 *
 * a11y:
 *   - `role="dialog"` + `aria-label` on the container.
 *   - Esc key dismisses.
 *   - Respects `prefers-reduced-motion` (no slide-in when reduced).
 */

import * as React from 'react';
import { Button, Card, CardContent } from '@hieu-asia/ui';
import { X } from 'lucide-react';
import { getPostHog } from '@/lib/posthog';
import { SURVEY_IDS } from '@/lib/survey';
import { track } from '@/lib/analytics';

const DISMISS_KEY_PREFIX = 'hieu.survey.dismissed.';
const DISMISS_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const DEFAULT_DELAY_MS = 30_000;

type Rating = 'positive' | 'unclear' | 'detail';

interface PostHogMatchingSurvey {
  id: string;
}

export interface PostReadingSurveyProps {
  /** Reading id used in capture properties (for replay correlation). */
  readingId: string;
  /** PostHog survey id to match. Defaults to READING_SATISFACTION. */
  surveyId?: string;
  /** Delay before the toast appears. Defaults to 30s. */
  delayMs?: number;
  /**
   * Force-render even outside production. Default `false` (production-only).
   * Useful for the Storybook story / Playwright e2e.
   */
  forceRender?: boolean;
}

function readDismissed(surveyId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = window.localStorage.getItem(DISMISS_KEY_PREFIX + surveyId);
    if (!raw) return false;
    const ts = Number(raw);
    if (!Number.isFinite(ts)) return false;
    return Date.now() - ts < DISMISS_TTL_MS;
  } catch {
    return false;
  }
}

function writeDismissed(surveyId: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      DISMISS_KEY_PREFIX + surveyId,
      String(Date.now()),
    );
  } catch {
    /* quota / disabled */
  }
}

export function PostReadingSurvey({
  readingId,
  surveyId = SURVEY_IDS.READING_SATISFACTION,
  delayMs = DEFAULT_DELAY_MS,
  forceRender = false,
}: PostReadingSurveyProps): React.ReactElement | null {
  const [visible, setVisible] = React.useState(false);
  const [phase, setPhase] = React.useState<'choose' | 'detail' | 'done'>(
    'choose',
  );
  const [detailText, setDetailText] = React.useState('');
  const [reducedMotion, setReducedMotion] = React.useState(false);

  // Production gate: skip entirely in dev / preview unless explicitly forced.
  const isProd =
    forceRender ||
    (typeof process !== 'undefined' &&
      process.env.NEXT_PUBLIC_VERCEL_ENV === 'production');

  // Read reduced-motion preference once on mount.
  React.useEffect(() => {
    try {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mq.matches);
    } catch {
      /* ignore */
    }
  }, []);

  // Lazy arm: 30s after mount, check (a) production gate, (b) dismissal TTL,
  // (c) whether PostHog has an active matching survey for this user.
  React.useEffect(() => {
    if (!isProd) return;
    if (readDismissed(surveyId)) return;

    const timer = window.setTimeout(() => {
      const ph = getPostHog();
      if (!ph) {
        // No PostHog client (key missing or opt-out) — skip silently.
        return;
      }
      try {
        ph.getActiveMatchingSurveys((surveys) => {
          const list = surveys as unknown as PostHogMatchingSurvey[];
          const match = list?.find?.((s) => s?.id === surveyId);
          if (match) setVisible(true);
        });
      } catch {
        /* ignore — PostHog SDK absent or surveys disabled */
      }
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [isProd, surveyId, delayMs]);

  const dismiss = React.useCallback(() => {
    writeDismissed(surveyId);
    setVisible(false);
    try {
      getPostHog()?.capture('survey dismissed', {
        $survey_id: surveyId,
        reading_id: readingId,
      });
    } catch {
      /* ignore */
    }
  }, [surveyId, readingId]);

  const submit = React.useCallback(
    (rating: Rating, comment?: string) => {
      track('post_reading_feedback', {
        rating,
        survey_id: surveyId,
        reading_id: readingId,
        ...(comment ? { comment } : {}),
      });
      // Also forward to PostHog's standard `survey sent` so the survey
      // dashboard's response counters stay accurate.
      try {
        getPostHog()?.capture('survey sent', {
          $survey_id: surveyId,
          $survey_response: rating,
          ...(comment ? { $survey_response_1: comment } : {}),
          reading_id: readingId,
        });
      } catch {
        /* ignore */
      }
      writeDismissed(surveyId);
      setPhase('done');
      window.setTimeout(() => setVisible(false), 1500);
    },
    [surveyId, readingId],
  );

  // Esc key dismiss.
  React.useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        dismiss();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, dismiss]);

  if (!visible) return null;

  // Slide-in animation; CSS `prefers-reduced-motion` in globals.css clamps
  // duration to 0.01ms automatically when the user opts out. We also gate
  // via `reducedMotion` state so the transform/opacity start values match
  // the final state (no flash) when motion is reduced.
  const animStyle: React.CSSProperties = reducedMotion
    ? {}
    : {
        animation: 'hieu-post-reading-survey-in 300ms ease-out both',
      };

  return (
    <div
      role="dialog"
      aria-label="Phản hồi nhanh về báo cáo"
      style={animStyle}
      className="fixed bottom-4 right-4 z-50 w-[min(92vw,360px)] print:hidden"
    >
      <style>{`
        @keyframes hieu-post-reading-survey-in {
          from { transform: translateY(12px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <Card className="border-gold/30 bg-card/95 shadow-xl backdrop-blur">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium leading-snug text-foreground">
              {phase === 'done'
                ? 'Cảm ơn bạn — phản hồi đã được ghi lại.'
                : phase === 'detail'
                  ? 'Bạn có thể chia sẻ chi tiết hơn không?'
                  : 'Bạn thấy báo cáo có hữu ích không?'}
            </p>
            <button
              type="button"
              aria-label="Đóng (Esc)"
              onClick={dismiss}
              className="-mr-1 -mt-1 rounded-md p-1 text-muted-foreground hover:bg-muted/10 hover:text-foreground focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {phase === 'choose' && (
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => submit('positive')}
                className="border-gold/40 hover:border-gold hover:bg-gold/10"
              >
                <span aria-hidden="true" className="mr-1">
                  👍
                </span>
                Hữu ích
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => submit('unclear')}
                className="border-gold/40 hover:border-gold hover:bg-gold/10"
              >
                <span aria-hidden="true" className="mr-1">
                  👎
                </span>
                Chưa rõ ràng
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPhase('detail')}
                className="border-gold/40 hover:border-gold hover:bg-gold/10"
              >
                <span aria-hidden="true" className="mr-1">
                  💬
                </span>
                Góp ý chi tiết
              </Button>
            </div>
          )}

          {phase === 'detail' && (
            <div className="space-y-2">
              <label htmlFor="post-reading-detail" className="sr-only">
                Góp ý chi tiết
              </label>
              <textarea
                id="post-reading-detail"
                value={detailText}
                onChange={(e) => setDetailText(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Ví dụ: phần nào khó hiểu, cần thêm thông tin gì..."
                className="w-full rounded-md border border-border bg-card/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setPhase('choose')}
                >
                  Quay lại
                </Button>
                <Button
                  size="sm"
                  onClick={() => submit('detail', detailText.trim() || undefined)}
                  disabled={detailText.trim().length === 0}
                >
                  Gửi góp ý
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
