/**
 * useSurvey — polls PostHog for the active surveys matching this user and
 * returns the first one whose id matches `surveyId` (or `null`). Surveys
 * themselves are authored in the PostHog dashboard.
 *
 * Schema-only helper — consumers render the survey UI however they like
 * and call the returned `dismiss()` / `sendResponse()` callbacks to update
 * PostHog. PostHog itself also ships an auto-rendered survey widget which
 * activates when `surveys.enable` is on in the SDK config.
 */

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
