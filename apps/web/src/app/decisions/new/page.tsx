'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Loader2,
  ShieldAlert,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Textarea,
} from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import {
  castTuViChart,
  projectTuViChartToStructured,
  type StructuredChartEnvelope,
} from '@/lib/tuvi-client';

type TopicId = 'career' | 'relationship' | 'finance' | 'family' | 'general';

const TOPIC_OPTIONS: readonly { id: TopicId; label: string; hint: string }[] = [
  { id: 'career', label: 'Sự nghiệp', hint: 'Nghỉ việc, chuyển vai, khởi nghiệp' },
  { id: 'relationship', label: 'Tình cảm', hint: 'Quan hệ, hôn nhân, chia tay' },
  { id: 'finance', label: 'Tài chính', hint: 'Đầu tư, mua nhà, tiết kiệm' },
  { id: 'family', label: 'Gia đình', hint: 'Cha mẹ, con cái, người thân' },
  { id: 'general', label: 'Khác / Tổng quát', hint: 'Một quyết định không thuộc nhóm trên' },
];

const API_BASE =
  process.env.NEXT_PUBLIC_HIEU_API_URL ??
  process.env.HIEU_API_URL ??
  'https://api.hieu.asia';

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

/**
 * Stored chart profile (see `MyChartTab` / operating-manual). We only need
 * the birth inputs to cast a Tử Vi chart on demand — the chart itself is
 * not persisted under this key, just the birth data.
 */
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

function isTopicId(v: string | null): v is TopicId {
  return v === 'career' || v === 'relationship' || v === 'finance' || v === 'family' || v === 'general';
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

  const [topic, setTopic] = useState<TopicId>(initialTopic);
  const [question, setQuestion] = useState('');
  const [situation, setSituation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [safetyBlock, setSafetyBlock] = useState<{
    category: string;
    reply: string;
    followUps: string[];
  } | null>(null);

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

  const questionLength = question.trim().length;
  const situationLength = situation.length;
  const canSubmit =
    !submitting && questionLength >= 10 && questionLength <= 500 && situationLength <= 1000;

  const payloadPreview = useMemo(
    () =>
      JSON.stringify(
        { topic, question: question.trim(), situation: situation.trim() || undefined },
        null,
        2,
      ),
    [topic, question, situation],
  );

  // Keep topic in sync if user navigates back/forward.
  useEffect(() => {
    if (isTopicId(initialTopicRaw) && initialTopicRaw !== topic) {
      setTopic(initialTopicRaw);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTopicRaw]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setSafetyBlock(null);
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/decisions/brief`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          topic,
          question: question.trim(),
          situation: situation.trim() || undefined,
          // Wave 19 — attach structured chart when available so the worker
          // can echo a typed envelope back for the detail page renderer.
          chart: chart ?? undefined,
        }),
      });
      // Rate limit (429) → friendly message, do not throw.
      if (res.status === 429) {
        setError('Bạn đã tạo Decision Brief quá nhanh. Vui lòng thử lại sau ~1 giờ.');
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
        const reason = typeof data.error === 'string' ? data.error : `API ${res.status}`;
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
        question: question.trim(),
        topic,
        createdAt: new Date().toISOString(),
      };
      try {
        window.localStorage.setItem(`hieu:decisions:${id}`, JSON.stringify(record));
      } catch {
        /* localStorage full / disabled — degrade silently */
      }
      router.push(`/decisions/${id}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'unknown';
      setError(msg);
      setSubmitting(false);
    }
  }

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
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-gold/80">
            Decision Brief
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight sm:text-4xl">
            Tạo Decision Brief
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

        {chart && birthInputs ? (
          <div
            className="mb-8 flex items-start gap-3 rounded-lg border border-jade/30 bg-jade/5 p-4"
            data-testid="decision-chart-banner"
          >
            <span className="mt-0.5 text-jade" aria-hidden="true">
              ✓
            </span>
            <p className="text-sm leading-relaxed text-foreground/85">
              <strong className="font-semibold">Lá số đã có</strong> — đang sử
              dụng lá số ngày {birthInputs.birth_date}. Brief sẽ tham chiếu các
              cung và sao trong lá số của bạn.
            </p>
          </div>
        ) : !birthInputs && !chartLoading ? (
          <Card className="mb-8 border-gold/20 bg-gold/5">
            <CardContent className="flex flex-col items-start gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-foreground">
                  Tạo Decision Brief có lá số (nhanh hơn)
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Nhập ngày & giờ sinh một lần — Brief sẽ tham chiếu cung & sao
                  thay vì chỉ dựa vào mô tả.
                </p>
              </div>
              <Button asChild={false} variant="outline">
                <Link
                  href={`/onboarding?returnTo=${encodeURIComponent('/decisions/new')}`}
                >
                  Lập lá số trước →
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : null}

        <form onSubmit={handleSubmit} noValidate>
          <Card className="border-gold/20 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="font-heading text-xl">
                Bạn đang phân vân điều gì?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <fieldset>
                <legend className="text-sm font-medium text-foreground/90">
                  Chủ đề
                </legend>
                <p className="mt-1 text-xs text-muted-foreground">
                  Giúp hệ thống chọn đúng cung trên lá số để tham chiếu.
                </p>
                <RadioGroup
                  name="decision-topic"
                  value={topic}
                  onValueChange={(v) => isTopicId(v) && setTopic(v)}
                  className="mt-4 grid gap-2 sm:grid-cols-2"
                >
                  {TOPIC_OPTIONS.map((t) => (
                    <Label
                      key={t.id}
                      htmlFor={`topic-${t.id}`}
                      className={[
                        'flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition',
                        topic === t.id
                          ? 'border-gold bg-gold/10'
                          : 'border-border bg-card/40 hover:border-gold/40',
                      ].join(' ')}
                    >
                      <RadioGroupItem id={`topic-${t.id}`} value={t.id} className="mt-1" />
                      <span className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">
                          {t.label}
                        </span>
                        <span className="mt-0.5 text-xs text-muted-foreground">
                          {t.hint}
                        </span>
                      </span>
                    </Label>
                  ))}
                </RadioGroup>
              </fieldset>

              <div>
                <Label htmlFor="decision-question" className="text-sm font-medium">
                  Câu hỏi bạn đang phân vân?{' '}
                  <span className="text-red-400/80">*</span>
                </Label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Ví dụ: &ldquo;Tôi có nên nghỉ việc trong 3 tháng tới?&rdquo;
                </p>
                <Input
                  id="decision-question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  maxLength={500}
                  placeholder="Nhập câu hỏi (10–500 ký tự)"
                  className="mt-2"
                  required
                />
                <div className="mt-1 flex justify-end text-xs text-muted-foreground">
                  {questionLength}/500
                </div>
              </div>

              <div>
                <Label htmlFor="decision-situation" className="text-sm font-medium">
                  Mô tả tình huống cụ thể{' '}
                  <span className="text-muted-foreground">(tuỳ chọn)</span>
                </Label>
                <p className="mt-1 text-xs text-muted-foreground">
                  3–5 câu về bối cảnh: lý do, ràng buộc, điều bạn lo ngại.
                  Càng cụ thể, gợi ý càng sát.
                </p>
                <Textarea
                  id="decision-situation"
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  maxLength={1000}
                  rows={6}
                  placeholder="Tôi đang làm vị trí X được 3 năm, gần đây cảm thấy..."
                  className="mt-2"
                />
                <div className="mt-1 flex justify-end text-xs text-muted-foreground">
                  {situationLength}/1000
                </div>
              </div>

              {safetyBlock && (
                <div
                  role="alert"
                  className="rounded-lg border border-rose-500/40 bg-rose-900/10 p-4"
                >
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-rose-300" aria-hidden="true" />
                    <div className="space-y-2 text-sm leading-relaxed text-foreground/85">
                      <p>{safetyBlock.reply}</p>
                      {safetyBlock.followUps.length > 0 && (
                        <>
                          <p className="text-xs text-muted-foreground">Gợi ý:</p>
                          <ul className="ml-4 list-disc space-y-1 text-xs text-muted-foreground">
                            {safetyBlock.followUps.map((f, i) => (
                              <li key={i}>{f}</li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-lg border border-amber-700/40 bg-amber-900/10 p-4"
                >
                  <AlertTriangle
                    className="mt-0.5 h-5 w-5 shrink-0 text-amber-400/90"
                    aria-hidden="true"
                  />
                  <div className="space-y-2 text-sm leading-relaxed text-foreground/85">
                    <p>
                      <strong className="font-semibold">
                        Tính năng đang nâng cấp, vui lòng quay lại sau.
                      </strong>{' '}
                      Chúng tôi không thể tạo Decision Brief lúc này.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Đây là dữ liệu sẽ được gửi (lưu lại để bạn thử lại sau):
                    </p>
                    <pre className="overflow-x-auto rounded border border-border bg-card/60 p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
                      {payloadPreview}
                    </pre>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-4">
                <Link
                  href="/decisions"
                  className="text-sm text-muted-foreground hover:text-gold"
                >
                  ← Quay lại
                </Link>
                <Button type="submit" disabled={!canSubmit} className="min-w-[200px]">
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      Tạo Decision Brief
                      <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
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
