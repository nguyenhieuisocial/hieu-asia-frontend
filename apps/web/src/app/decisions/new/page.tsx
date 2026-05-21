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

function isTopicId(v: string | null): v is TopicId {
  return v === 'career' || v === 'relationship' || v === 'finance' || v === 'family' || v === 'general';
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
  const initialTopic: TopicId = isTopicId(initialTopicRaw) ? initialTopicRaw : 'general';

  const [topic, setTopic] = useState<TopicId>(initialTopic);
  const [question, setQuestion] = useState('');
  const [situation, setSituation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const questionLength = question.trim().length;
  const situationLength = situation.length;
  const canSubmit =
    !submitting && questionLength >= 10 && questionLength <= 200 && situationLength <= 1000;

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
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/decisions/brief`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          topic,
          question: question.trim(),
          situation: situation.trim() || undefined,
        }),
      });
      if (!res.ok) {
        throw new Error(`API ${res.status}`);
      }
      const data = (await res.json()) as { brief?: DecisionBrief } | DecisionBrief;
      const brief: DecisionBrief =
        'brief' in data && data.brief ? data.brief : (data as DecisionBrief);

      const id = makeId();
      const record = {
        id,
        brief,
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
    <div className="min-h-screen bg-ink text-cream">
      <SiteNav />

      <main className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-cream/55">
          <Link href="/" className="hover:text-gold">Trang chủ</Link>
          <span className="mx-1.5">/</span>
          <Link href="/decisions" className="hover:text-gold">Decision Brief</Link>
          <span className="mx-1.5">/</span>
          <span className="text-cream/70">Tạo mới</span>
        </nav>

        <header className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-gold/80">
            Decision Brief
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight sm:text-4xl">
            Tạo Decision Brief
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-cream/75 sm:text-base">
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
          <p className="text-sm leading-relaxed text-cream/85">
            <strong className="font-semibold">Decision Brief KHÔNG</strong> tư
            vấn tài chính, y tế hay pháp lý cụ thể. Mọi quyết định cuối cùng
            vẫn là của bạn.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <Card className="border-gold/20 bg-ink/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="font-heading text-xl">
                Bạn đang phân vân điều gì?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <fieldset>
                <legend className="text-sm font-medium text-cream/90">
                  Chủ đề
                </legend>
                <p className="mt-1 text-xs text-cream/55">
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
                          : 'border-cream/15 bg-ink/40 hover:border-gold/40',
                      ].join(' ')}
                    >
                      <RadioGroupItem id={`topic-${t.id}`} value={t.id} className="mt-1" />
                      <span className="flex flex-col">
                        <span className="text-sm font-medium text-cream">
                          {t.label}
                        </span>
                        <span className="mt-0.5 text-xs text-cream/60">
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
                <p className="mt-1 text-xs text-cream/55">
                  Ví dụ: &ldquo;Tôi có nên nghỉ việc trong 3 tháng tới?&rdquo;
                </p>
                <Input
                  id="decision-question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  maxLength={200}
                  placeholder="Nhập câu hỏi (10–200 ký tự)"
                  className="mt-2"
                  required
                />
                <div className="mt-1 flex justify-end text-xs text-cream/50">
                  {questionLength}/200
                </div>
              </div>

              <div>
                <Label htmlFor="decision-situation" className="text-sm font-medium">
                  Mô tả tình huống cụ thể{' '}
                  <span className="text-cream/50">(tuỳ chọn)</span>
                </Label>
                <p className="mt-1 text-xs text-cream/55">
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
                <div className="mt-1 flex justify-end text-xs text-cream/50">
                  {situationLength}/1000
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-lg border border-amber-700/40 bg-amber-900/10 p-4"
                >
                  <AlertTriangle
                    className="mt-0.5 h-5 w-5 shrink-0 text-amber-400/90"
                    aria-hidden="true"
                  />
                  <div className="space-y-2 text-sm leading-relaxed text-cream/85">
                    <p>
                      <strong className="font-semibold">
                        Tính năng đang nâng cấp, vui lòng quay lại sau.
                      </strong>{' '}
                      Chúng tôi không thể tạo Decision Brief lúc này.
                    </p>
                    <p className="text-xs text-cream/55">
                      Đây là dữ liệu sẽ được gửi (lưu lại để bạn thử lại sau):
                    </p>
                    <pre className="overflow-x-auto rounded border border-cream/10 bg-ink/60 p-3 font-mono text-[11px] leading-relaxed text-cream/70">
                      {payloadPreview}
                    </pre>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-4">
                <Link
                  href="/decisions"
                  className="text-sm text-cream/65 hover:text-gold"
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
    <Suspense fallback={<div className="min-h-screen bg-ink" aria-hidden="true" />}>
      <NewDecisionInner />
    </Suspense>
  );
}
