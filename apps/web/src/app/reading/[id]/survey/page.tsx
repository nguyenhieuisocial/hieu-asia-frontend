'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@hieu-asia/ui';
import type { SurveyAnswers } from '@/lib/survey-schema';
import { apiClient } from '@/lib/api';
import { track } from '@/lib/analytics';

// SurveyJS is client-only — heavy DOM dependency, skip SSR.
const PersonalitySurvey = dynamic(
  () => import('@/components/personality-survey').then((m) => m.PersonalitySurvey),
  {
    ssr: false,
    loading: () => (
      <p className="py-12 text-center text-sm text-cream/60">Đang nạp khảo sát…</p>
    ),
  },
);

interface ConsentDraft {
  accepted: true;
  accepted_at: string;
  version: string;
  purposes: string[];
}

interface UserContextDraft {
  birth_date: string;
  birth_place?: string | null;
  gender?: string | null;
  timezone?: string | null;
  current_job?: string | null;
  current_financial_status?: string | null;
  primary_concern?: string | null;
  personality_raw?: string | null;
}

function readSession<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  const raw = window.sessionStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function summarizePersonality(a: SurveyAnswers): string {
  return JSON.stringify(a, null, 2);
}

export default function SurveyPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const readingId = params.id;
  const uploadObject = search.get('upload_object');

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleComplete = React.useCallback(
    async (answers: SurveyAnswers) => {
      setSubmitting(true);
      setError(null);

      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(
          `hieu.survey.${readingId}`,
          JSON.stringify(answers),
        );
      }

      track('survey_completed', { reading_id: readingId, answer_count: Object.keys(answers ?? {}).length });

      try {
        const consent = readSession<ConsentDraft>('hieu.consent') ?? {
          accepted: true as const,
          accepted_at: new Date().toISOString(),
          version: 'v1.0',
          purposes: ['personalized_reading', 'mentor_chat'],
        };
        const userContext = readSession<UserContextDraft>(`hieu.birth.${readingId}`);
        const upload = readSession<{ public_read_url: string; mock: boolean }>(
          `hieu.upload.${readingId}`,
        );
        const userId =
          window.sessionStorage.getItem('hieu.user_id') ?? `anon-${readingId}`;

        if (!userContext || !upload || upload.mock) {
          // No backend / partial data — go straight to processing in mock mode.
          router.push(`/reading/${readingId}/processing`);
          return;
        }

        const resp = await apiClient.createReading({
          user_id: userId,
          user_context: {
            ...userContext,
            personality_raw: summarizePersonality(answers),
          },
          hand_image_url: upload.public_read_url,
          consent,
        });
        window.sessionStorage.setItem(
          `hieu.reading.${readingId}`,
          JSON.stringify(resp),
        );
        router.push(`/reading/${readingId}/processing?session_id=${resp.session_id}`);
      } catch (e) {
        // Fallback: continue in mock mode so demo flow doesn't dead-end.
        console.warn('[survey] createReading failed, mock continue:', e);
        setError(null);
        router.push(`/reading/${readingId}/processing`);
      } finally {
        setSubmitting(false);
      }
    },
    [readingId, router],
  );

  return (
    <main className="min-h-screen bg-ink-radial pb-24">
      <header className="container mx-auto max-w-3xl px-5 py-8">
        <p className="font-mono text-xs uppercase tracking-widest text-gold">
          Bước 3 / 4
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-cream sm:text-4xl">
          Khảo sát tính cách
        </h1>
        <p className="mt-2 text-sm text-cream/70">
          12 câu ngắn để hệ thống hiểu cách bạn quyết định, phản ứng và giao tiếp.
        </p>
        {uploadObject && (
          <p className="mt-1 font-mono text-xs text-cream/40">
            Ảnh: {uploadObject.split('/').pop()}
          </p>
        )}
      </header>

      <section className="container mx-auto max-w-3xl px-5">
        <Card>
          <CardContent className="pt-6">
            <PersonalitySurvey onComplete={handleComplete} />
          </CardContent>
        </Card>

        {submitting && (
          <p className="mt-4 text-center text-sm text-cream/70">Đang gửi khảo sát…</p>
        )}
        {error && (
          <p className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}
      </section>
    </main>
  );
}
