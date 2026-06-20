'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { ChartBanner } from '@/components/decisions/ChartBanner';
import { SafetyBlock, type SafetyBlockData } from '@/components/decisions/SafetyBlock';
import { ErrorBlock } from '@/components/decisions/ErrorBlock';
import {
  DecisionForm,
  type DecisionFormPayload,
  type TopicId,
  isTopicId,
} from '@/components/decisions/DecisionForm';
import {
  castTuViChart,
  projectTuViChartToStructured,
  type StructuredChartEnvelope,
} from '@/lib/tuvi-client';

interface DecisionOption {
  label: string;
  description: string;
  risks: string[];
  bestWhen: string;
}
interface DecisionBrief {
  realProblem: string;
  chartSignal: string;
  options: DecisionOption[];
  smallestNextStep: string[];
  caveats: string[];
  generatedAt: string;
}
type StructuredChart = StructuredChartEnvelope;

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.HIEU_API_URL ??
  'https://api.hieu.asia';

/**
 * Stored chart profile (see `MyChartTab` / operating-manual). We only need
 * the birth inputs to cast a Tử Vi chart on demand — the chart itself is
 * not persisted under this key, just the birth data.
 */
import { getPersonalitySummary } from '@/lib/personality-store';

const CHART_PROFILE_KEY = 'hieu:chart:profile:v1';
const ONBOARDING_KEY = 'hieu:onboarding:v2';

interface BirthInputs {
  birth_date: string;
  birth_time: string;
  gender: string;
}

function readBirthInputs(): BirthInputs | null {
  if (typeof window === 'undefined') return null;
  // Primary: explicit chart profile written by /account → MyChartTab.
  const tryParse = (raw: string | null): Partial<BirthInputs> | null => {
    if (!raw) return null;
    try {
      const obj = JSON.parse(raw) as Record<string, unknown>;
      return {
        birth_date: typeof obj.birth_date === 'string' ? obj.birth_date : '',
        birth_time: typeof obj.birth_time === 'string' ? obj.birth_time : '',
        gender: typeof obj.gender === 'string' ? obj.gender : '',
      };
    } catch {
      return null;
    }
  };
  const sources = [
    window.localStorage.getItem(CHART_PROFILE_KEY),
    window.localStorage.getItem(ONBOARDING_KEY),
  ];
  for (const raw of sources) {
    const parsed = tryParse(raw);
    if (
      parsed &&
      parsed.birth_date &&
      parsed.birth_time &&
      parsed.gender &&
      /^\d{4}-\d{1,2}-\d{1,2}$/.test(parsed.birth_date)
    ) {
      return {
        birth_date: parsed.birth_date,
        birth_time: parsed.birth_time,
        gender: parsed.gender,
      };
    }
  }
  return null;
}

function parseHour(raw: string): number {
  const m = /^(\d{1,2})/.exec(raw.trim());
  if (!m || !m[1]) return 12;
  const h = Number(m[1]);
  return Number.isFinite(h) && h >= 0 && h <= 23 ? h : 12;
}

function normalizeGender(raw: string): 'male' | 'female' {
  const v = raw.toLowerCase().trim();
  return v === 'nữ' || v === 'nu' || v === 'female' || v === 'f' ? 'female' : 'male';
}

/** Map onboarding/lo-trinh topic slugs to the backend's canonical 5-topic set. */
function normalizeTopicSlug(v: string | null): TopicId {
  if (!v) return 'general';
  if (v === 'love') return 'relationship';     // /onboarding/topic uses "love"
  if (v === 'self') return 'general';           // /lo-trinh/hieu-ban-than
  if (v === 'decision') return 'general';       // /onboarding/topic uses "decision"
  if (isTopicId(v)) return v;
  return 'general';
}

// Cheap UUID generator — avoids requiring crypto.randomUUID polyfill.
function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    try {
      return crypto.randomUUID();
    } catch {
      /* fall through */
    }
  }
  return 'd_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function NewDecisionInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTopicRaw = searchParams.get('topic');
  const initialTopic: TopicId = normalizeTopicSlug(initialTopicRaw);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [safetyBlock, setSafetyBlock] = useState<SafetyBlockData | null>(null);
  /** Tracks the last submitted payload so the Retry button can resubmit. */
  const [lastPayload, setLastPayload] = useState<DecisionFormPayload | null>(null);

  // Chart hydration — read stored birth inputs (set via /account or onboarding)
  // and cast a Tử Vi chart on mount. The cast is cached in localStorage by the
  // tuvi-client, so this is instant on the second visit. We don't block the
  // form on this; if it fails or no inputs exist, the brief still submits
  // without a chart (worker just won't echo one).
  const [birthInputs, setBirthInputs] = useState<BirthInputs | null>(null);
  const [chart, setChart] = useState<StructuredChart | null>(null);
  const [chartLoading, setChartLoading] = useState(false);

  useEffect(() => {
    const inputs = readBirthInputs();
    setBirthInputs(inputs);
    if (!inputs) return;
    let cancelled = false;
    setChartLoading(true);
    castTuViChart({
      birthSolarDate: inputs.birth_date,
      birthHour: parseHour(inputs.birth_time),
      gender: normalizeGender(inputs.gender),
      language: 'vi-VN',
    })
      .then((full) => {
        if (cancelled) return;
        setChart(projectTuViChartToStructured(full));
      })
      .catch(() => {
        // Silent fallback — submit without chart.
      })
      .finally(() => {
        if (!cancelled) setChartLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const submitBrief = useCallback(
    async (payload: DecisionFormPayload) => {
      setError(null);
      setSafetyBlock(null);
      setSubmitting(true);
      setLastPayload(payload);
      try {
        const res = await fetch(`${API_BASE}/decisions/brief`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            // Wave 19 — attach structured chart when available so the worker
            // can echo a typed envelope back for the detail page renderer.
            chart: chart ?? undefined,
            // Personality context from MBTI / Big Five / DISC if the user
            // completed any of those tools this session. Backend (decision-brief)
            // uses it to personalise options + surface relevant blind spots.
            personalitySummary: getPersonalitySummary() || undefined,
          }),
        });
        // Rate limit (429) → friendly message, do not throw.
        if (res.status === 429) {
          setError(
            'Bạn đã tạo Decision Brief quá nhanh. Vui lòng thử lại sau ~1 giờ.',
          );
          setSubmitting(false);
          return;
        }
        const data = (await res.json().catch(() => null)) as
          | (Record<string, unknown> & {
              ok?: boolean;
              safe?: boolean;
              blocked?: boolean;
              category?: string;
              reply?: string;
              followUps?: string[];
              brief?: DecisionBrief;
              chart?: StructuredChart;
              error?: string;
              kind?: string;
            })
          | null;
        if (!data) {
          throw new Error('Phản hồi không hợp lệ');
        }
        // Safety-gate response — worker returns 200 with safe=false.
        if (data.ok === true && data.safe === false && data.reply) {
          setSafetyBlock({
            category: data.category ?? 'general',
            reply: data.reply,
            followUps: Array.isArray(data.followUps) ? data.followUps : [],
          });
          setSubmitting(false);
          return;
        }
        // Server-side validation error (400) — show the message directly.
        if (!res.ok || data.ok === false) {
          const reason =
            typeof data.error === 'string' ? data.error : `API ${res.status}`;
          if (data.kind === 'input') {
            setError(`Đầu vào không hợp lệ: ${reason}`);
          } else {
            setError(reason);
          }
          setSubmitting(false);
          return;
        }
        const brief: DecisionBrief | undefined = data.brief;
        if (!brief || !brief.realProblem) {
          throw new Error('Brief returned empty');
        }
        const id = makeId();
        const record = {
          id,
          brief,
          // Persist the structured chart (when the worker echoed one back) so
          // the detail page can render the StructuredChart panel without
          // re-fetching.
          chart: data.chart ?? undefined,
          question: payload.question,
          topic: payload.topic,
          createdAt: new Date().toISOString(),
        };
        try {
          window.localStorage.setItem(
            `hieu:decisions:${id}`,
            JSON.stringify(record),
          );
        } catch {
          /* localStorage full / disabled — degrade silently */
        }
        router.push(`/decisions/${id}`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'unknown';
        setError(msg);
        setSubmitting(false);
      }
    },
    [chart, router],
  );

  const handleRetry = useCallback(() => {
    if (lastPayload) {
      void submitBrief(lastPayload);
    }
  }, [lastPayload, submitBrief]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <main className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-gold">Trang chủ</Link>
          <span className="mx-1.5">/</span>
          <Link href="/decisions" className="hover:text-gold">Decision Brief</Link>
          <span className="mx-1.5">/</span>
          <span className="text-muted-foreground">Tạo mới</span>
        </nav>

        <header className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-gold-700">
            Bản tóm tắt quyết định
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight sm:text-4xl">
            Tạo Bản tóm tắt quyết định
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Mô tả ngắn gọn câu hỏi và tình huống. Hệ thống sẽ trả về một bản
            tóm tắt giúp bạn nhìn vấn đề rõ hơn — không phải câu trả lời tuyệt
            đối.
          </p>
        </header>

        <div className="mb-8 flex items-start gap-3 rounded-lg border border-amber-700/40 bg-amber-900/10 p-4">
          <ShieldAlert
            className="mt-0.5 h-5 w-5 shrink-0 text-amber-400/90"
            aria-hidden="true"
          />
          <p className="text-sm leading-relaxed text-foreground/85">
            <strong className="font-semibold">Decision Brief KHÔNG</strong> tư
            vấn tài chính, y tế hay pháp lý cụ thể. Mọi quyết định cuối cùng
            vẫn là của bạn.
          </p>
        </div>

        <ChartBanner
          birthDate={chart && birthInputs ? birthInputs.birth_date : null}
          loading={chartLoading}
          returnTo="/decisions/new"
        />

        <DecisionForm
          initialTopic={initialTopic}
          submitting={submitting}
          onSubmit={submitBrief}
          feedbackSlot={
            <>
              {safetyBlock && <SafetyBlock block={safetyBlock} />}
              {error && <ErrorBlock message={error} onRetry={handleRetry} />}
            </>
          }
        />
      </main>

      <SiteFooter />
    </div>
  );
}

export default function NewDecisionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" aria-hidden="true" />}>
      <NewDecisionInner />
    </Suspense>
  );
}
