'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Circle,
  Compass,
  MessageCircle,
} from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';

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
interface StoredDecision {
  id: string;
  brief: DecisionBrief;
  question: string;
  topic: string;
  createdAt: string;
}

const TOPIC_LABELS: Record<string, string> = {
  career: 'Sự nghiệp',
  relationship: 'Tình cảm',
  finance: 'Tài chính',
  family: 'Gia đình',
  general: 'Tổng quát',
};

function loadDecision(id: string): StoredDecision | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(`hieu:decisions:${id}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredDecision;
    if (!parsed || typeof parsed !== 'object' || !parsed.brief) return null;
    return parsed;
  } catch {
    return null;
  }
}

function loadChecked(id: string): Set<number> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(`hieu:decisions:${id}:checked`);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as number[];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function saveChecked(id: string, set: Set<number>) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      `hieu:decisions:${id}:checked`,
      JSON.stringify(Array.from(set)),
    );
  } catch {
    /* ignore */
  }
}

function formatVNDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function addDays(iso: string, days: number): string {
  try {
    const d = new Date(iso);
    d.setDate(d.getDate() + days);
    return d.toISOString();
  } catch {
    return iso;
  }
}

export default function DecisionBriefPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';

  const [record, setRecord] = useState<StoredDecision | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [checked, setChecked] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!id) {
      setHydrated(true);
      return;
    }
    setRecord(loadDecision(id));
    setChecked(loadChecked(id));
    setHydrated(true);
  }, [id]);

  const toggle = useCallback(
    (idx: number) => {
      setChecked((prev) => {
        const next = new Set(prev);
        if (next.has(idx)) next.delete(idx);
        else next.add(idx);
        saveChecked(id, next);
        return next;
      });
    },
    [id],
  );

  const reviewDate = useMemo(
    () => (record ? formatVNDate(addDays(record.createdAt, 7)) : null),
    [record],
  );

  // SSR / pre-hydrate placeholder — avoid flicker.
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-ink text-cream">
        <SiteNav />
        <main className="mx-auto max-w-3xl px-6 py-20" aria-hidden="true">
          <div className="h-6 w-40 animate-pulse rounded bg-cream/10" />
          <div className="mt-6 h-10 w-3/4 animate-pulse rounded bg-cream/10" />
          <div className="mt-8 h-40 w-full animate-pulse rounded bg-cream/5" />
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen bg-ink text-cream">
        <SiteNav />
        <main className="mx-auto max-w-2xl px-6 py-24 text-center">
          <Compass className="mx-auto h-10 w-10 text-gold/70" aria-hidden="true" />
          <h1 className="mt-6 font-heading text-3xl font-bold">
            Decision Brief này không tồn tại trên máy bạn
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-cream/70">
            Decision Brief được lưu trên trình duyệt của bạn — nếu bạn đổi máy
            hoặc xoá dữ liệu trình duyệt, brief sẽ mất. Bạn có thể tạo brief
            mới.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/decisions/new">
              <Button>
                Tạo Decision Brief mới
                <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link
              href="/decisions"
              className="text-sm text-cream/65 hover:text-gold"
            >
              ← Về danh sách
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const { brief, question, topic, createdAt } = record;
  const topicLabel = TOPIC_LABELS[topic] ?? 'Tổng quát';

  return (
    <div className="min-h-screen bg-ink text-cream">
      <SiteNav />

      <main className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-cream/55">
          <Link href="/" className="hover:text-gold">Trang chủ</Link>
          <span className="mx-1.5">/</span>
          <Link href="/decisions" className="hover:text-gold">Decision Brief</Link>
          <span className="mx-1.5">/</span>
          <span className="text-cream/70">Brief</span>
        </nav>

        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-gold">
              {topicLabel}
            </span>
            <span className="text-xs text-cream/55">
              Tạo ngày {formatVNDate(createdAt)}
            </span>
          </div>
          <h1 className="mt-4 font-heading text-2xl font-bold leading-snug sm:text-3xl">
            {question}
          </h1>

          {reviewDate && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-jade/30 bg-jade/[0.04] px-4 py-2.5 text-sm text-cream/85">
              <CalendarClock
                className="h-4 w-4 text-jade"
                aria-hidden="true"
              />
              Review sau 7 ngày — <strong className="font-semibold">{reviewDate}</strong>
            </div>
          )}
        </header>

        <section aria-labelledby="real-problem" className="mb-12">
          <h2
            id="real-problem"
            className="font-mono text-xs uppercase tracking-[0.32em] text-gold/80"
          >
            Vấn đề thật sự
          </h2>
          <blockquote className="mt-3 border-l-2 border-l-gold pl-4 text-lg italic leading-relaxed text-cream/90 sm:text-xl">
            {brief.realProblem}
          </blockquote>
        </section>

        <section aria-labelledby="chart-signal" className="mb-12">
          <h2
            id="chart-signal"
            className="font-mono text-xs uppercase tracking-[0.32em] text-gold/80"
          >
            Lá số nói gì
          </h2>
          <p className="mt-3 text-base leading-relaxed text-cream/85">
            {brief.chartSignal}
          </p>
        </section>

        <section aria-labelledby="options" className="mb-12">
          <h2
            id="options"
            className="mb-4 font-heading text-xl font-semibold sm:text-2xl"
          >
            Lựa chọn của bạn
          </h2>
          <div className="grid gap-4">
            {brief.options.map((opt, i) => (
              <Card
                key={`${i}-${opt.label}`}
                className="border-gold/15 bg-ink/60 backdrop-blur-sm"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/40 font-mono text-xs text-gold">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <CardTitle className="text-lg">{opt.label}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed text-cream/80">
                    {opt.description}
                  </p>

                  {opt.risks.length > 0 && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-cream/60">
                        Rủi ro:
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {opt.risks.map((r, ri) => (
                          <li
                            key={ri}
                            className="flex items-start gap-2 text-sm text-cream/75"
                          >
                            <span
                              className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-amber-400/70"
                              aria-hidden="true"
                            />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="inline-flex items-start gap-2 rounded-md border border-jade/30 bg-jade/[0.04] px-3 py-2 text-sm text-cream/85">
                    <span className="text-xs font-medium uppercase tracking-wider text-jade">
                      Nên chọn khi:
                    </span>
                    <span className="text-sm">{opt.bestWhen}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="next-step" className="mb-12">
          <h2
            id="next-step"
            className="mb-2 font-heading text-xl font-semibold sm:text-2xl"
          >
            Bước nhỏ nhất 7 ngày
          </h2>
          <p className="mb-5 text-sm text-cream/65">
            Chọn 1–2 bước bạn có thể làm tuần này. Tick để theo dõi — dữ liệu
            lưu trên trình duyệt.
          </p>
          <ol className="space-y-2">
            {brief.smallestNextStep.map((step, i) => {
              const done = checked.has(i);
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-pressed={done}
                    className={[
                      'flex w-full items-start gap-3 rounded-lg border p-4 text-left transition',
                      done
                        ? 'border-jade/40 bg-jade/[0.06]'
                        : 'border-cream/10 bg-ink/40 hover:border-gold/30',
                    ].join(' ')}
                  >
                    {done ? (
                      <CheckCircle2
                        className="mt-0.5 h-5 w-5 shrink-0 text-jade"
                        aria-hidden="true"
                      />
                    ) : (
                      <Circle
                        className="mt-0.5 h-5 w-5 shrink-0 text-cream/40"
                        aria-hidden="true"
                      />
                    )}
                    <span className="flex flex-1 items-start gap-2">
                      <span className="font-mono text-xs text-cream/70">
                        {i + 1}.
                      </span>
                      <span
                        className={[
                          'text-sm leading-relaxed',
                          done ? 'text-cream/65 line-through' : 'text-cream/90',
                        ].join(' ')}
                      >
                        {step}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>

        {brief.caveats.length > 0 && (
          <section aria-labelledby="caveats" className="mb-12">
            <h2
              id="caveats"
              className="mb-3 font-mono text-xs uppercase tracking-[0.32em] text-amber-400/80"
            >
              Lưu ý
            </h2>
            <div className="rounded-lg border border-amber-700/40 bg-amber-900/10 p-5">
              <ul className="space-y-2">
                {brief.caveats.map((c, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm leading-relaxed text-cream/80"
                  >
                    <AlertTriangle
                      className="mt-0.5 h-4 w-4 shrink-0 text-amber-400/80"
                      aria-hidden="true"
                    />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <footer className="flex flex-col gap-3 border-t border-cream/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => router.push('/decisions')}
            className="text-sm text-cream/65 hover:text-gold"
          >
            ← Quay lại danh sách
          </button>
          <Link href="/reading">
            <Button variant="outline">
              <MessageCircle className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Hỏi Mentor về quyết định này
            </Button>
          </Link>
        </footer>
      </main>

      <SiteFooter />
    </div>
  );
}
