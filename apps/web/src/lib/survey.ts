/**
 * useSurvey — polls PostHog for the active surveys matching this user and
 * returns the first one whose id matches `surveyId` (or `null`). Surveys
 * themselves are authored in the PostHog dashboard.
 *
 * Schema-only helper — consumers render the survey UI however they like
 * and call the returned `dismiss()` / `sendResponse()` callbacks to update
 * PostHog. PostHog itself also ships an auto-rendered survey widget which
 * activates when `surveys.enable` is on in the SDK config.
 *
 * Wave 39 W-B — strategic surveys (5):
 *   - SURVEY_IDS.ONBOARDING_NPS         — first /account visit after 1st reading
 *   - SURVEY_IDS.READING_SATISFACTION   — 30s after /reading/[id]/report mount
 *   - SURVEY_IDS.CHURN_RISK             — returning users with last_active > 14d
 *   - SURVEY_IDS.PRICING_INTENT         — /pricing dwell > 30s w/o click-buy
 *   - SURVEY_IDS.FEATURE_REQUEST        — /account "Góp ý" link
 *
 * The string values MUST match the survey id in the PostHog dashboard
 * (Surveys → ⋯ → "Copy ID"). Each id is a UUID — these placeholders
 * compile but won't match anything until the USER pastes the real UUIDs
 * after creating the surveys in PostHog UI.
 *
 * USER ACTION: create the survey definitions in PostHog dashboard, then
 * replace these placeholder ids with the real UUIDs. The string keys here
 * are stable so consumers don't have to change.
 */
export const SURVEY_IDS = {
  ONBOARDING_NPS: "survey_onboarding_nps",
  READING_SATISFACTION: "survey_reading_satisfaction",
  CHURN_RISK: "survey_churn_risk",
  PRICING_INTENT: "survey_pricing_intent",
  FEATURE_REQUEST: "survey_feature_request",
} as const;

export type SurveyKey = keyof typeof SURVEY_IDS;
export type SurveyId = (typeof SURVEY_IDS)[SurveyKey];

const SHOWN_KEY_PREFIX = "hieu.survey.shown.";

/**
 * Has this user already seen `surveyId`? (localStorage flag — survives
 * refresh + session, scoped per browser. PostHog itself also dedupes
 * server-side via the survey "shown to user" rule, this is just the
 * client-side fast-path so we never re-render the prompt twice in one
 * tab.)
 */
export function hasShownSurvey(surveyId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(SHOWN_KEY_PREFIX + surveyId) === "1";
  } catch {
    return false;
  }
}

/** Mark `surveyId` as shown for the current browser. */
export function markSurveyShown(surveyId: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SHOWN_KEY_PREFIX + surveyId, "1");
  } catch {
    /* quota / disabled — best-effort */
  }
}

'use client';

import * as React from 'react';
import { getPostHog } from './posthog';

export interface SurveyQuestion {
  type: string;
  question: string;
  description?: string;
  required?: boolean;
  choices?: string[];
}

export interface PostHogSurvey {
  id: string;
  name: string;
  description?: string;
  questions: SurveyQuestion[];
  start_date?: string;
  end_date?: string | null;
}

export interface UseSurveyResult {
  survey: PostHogSurvey | null;
  loading: boolean;
  dismiss: () => void;
  sendResponse: (responses: Record<string, unknown>) => void;
}

export function useSurvey(surveyId: string): UseSurveyResult {
  const [survey, setSurvey] = React.useState<PostHogSurvey | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const ph = getPostHog();
    if (!ph) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    try {
      ph.getActiveMatchingSurveys((surveys) => {
        if (cancelled) return;
        const match = (surveys as unknown as PostHogSurvey[]).find(
          (s) => s.id === surveyId,
        );
        setSurvey(match ?? null);
        setLoading(false);
      });
    } catch {
      setLoading(false);
    }
    return () => {
      cancelled = true;
    };
  }, [surveyId]);

  const dismiss = React.useCallback(() => {
    const ph = getPostHog();
    if (!ph || !survey) return;
    try {
      ph.capture('survey dismissed', { $survey_id: survey.id });
    } catch {
      /* ignore */
    }
    setSurvey(null);
  }, [survey]);

  const sendResponse = React.useCallback(
    (responses: Record<string, unknown>) => {
      const ph = getPostHog();
      if (!ph || !survey) return;
      try {
        ph.capture('survey sent', {
          $survey_id: survey.id,
          ...responses,
        });
      } catch {
        /* ignore */
      }
      setSurvey(null);
    },
    [survey],
  );

  return { survey, loading, dismiss, sendResponse };
}

/**
 * useSurveyPrompt — opinionated wrapper around `useSurvey` that:
 *
 *   1. Returns `null` immediately when `hasShownSurvey(surveyId)` is true
 *      (per-browser dedup — never show the same survey twice).
 *   2. Delays activation by `delayMs` after `armed` flips to true (so the
 *      caller can require, e.g., 30s on a page before triggering).
 *   3. Marks the survey shown on first non-null render, so dismiss /
 *      navigate-away still counts as "seen".
 *   4. Wraps `dismiss` + `sendResponse` so the caller doesn't have to
 *      remember to localStorage-flag.
 *
 * Returns the same shape as `useSurvey` plus a `ready` flag that
 * consumers can use to delay mounting their UI until everything settles.
 */
export interface UseSurveyPromptOptions {
  /**
   * When `false`, the hook does not poll PostHog or render the survey.
   * Useful for "dwell time" surveys: set armed = true after a setTimeout.
   * Default `true`.
   */
  armed?: boolean;
  /** Extra debounce in ms before the survey activates after armed. */
  delayMs?: number;
}

export function useSurveyPrompt(
  surveyId: string,
  options: UseSurveyPromptOptions = {},
): UseSurveyResult & { ready: boolean } {
  const { armed = true, delayMs = 0 } = options;
  const [active, setActive] = React.useState(armed && delayMs === 0);
  const [alreadyShown, setAlreadyShown] = React.useState(false);

  React.useEffect(() => {
    // Per-browser dedup — read once, then we won't change our mind.
    setAlreadyShown(hasShownSurvey(surveyId));
  }, [surveyId]);

  React.useEffect(() => {
    if (!armed || alreadyShown) {
      setActive(false);
      return;
    }
    if (delayMs <= 0) {
      setActive(true);
      return;
    }
    const t = window.setTimeout(() => setActive(true), delayMs);
    return () => window.clearTimeout(t);
  }, [armed, delayMs, alreadyShown]);

  const inner = useSurvey(active && !alreadyShown ? surveyId : '');

  // Mark shown the first time PostHog actually returns a matching survey.
  const shownRef = React.useRef(false);
  React.useEffect(() => {
    if (inner.survey && !shownRef.current) {
      shownRef.current = true;
      markSurveyShown(surveyId);
    }
  }, [inner.survey, surveyId]);

  return {
    survey: alreadyShown ? null : inner.survey,
    loading: inner.loading,
    dismiss: inner.dismiss,
    sendResponse: inner.sendResponse,
    ready: active && !alreadyShown,
  };
}
