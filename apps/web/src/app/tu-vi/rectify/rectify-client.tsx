'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  RadioGroup,
  RadioGroupItem,
} from '@hieu-asia/ui';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { safeJson } from '@/lib/safe-json';
import { readSavedProfile, saveProfile } from '@/lib/saved-profile';

// Mirror of backend types — kept inline to avoid coupling FE to worker types.
export interface BtrOption {
  id: string;
  label: string;
}

export interface BtrQuestion {
  id: string;
  axis: 'physical' | 'personality' | 'family' | 'milestone' | 'career' | 'health';
  prompt: string;
  helper?: string;
  options: BtrOption[];
}

interface BtrCandidate {
  canh: string;
  hour: string;
  range: string;
  score: number;
  reasoning: string[];
}

interface BtrResult {
  topCandidates: BtrCandidate[];
  confidence: 'high' | 'medium' | 'low';
  answeredCount: number;
  totalQuestions: number;
  caveat: string;
}

const DRAFT_KEY = 'hieu:btr:draft:v1';

interface BtrDraft {
  answers: Record<string, string>;
  stepIndex: number;
  updatedAt: string;
}

function readDraft(): BtrDraft | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BtrDraft;
    if (!parsed || typeof parsed !== 'object' || !parsed.answers) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeDraft(d: BtrDraft): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
  } catch {
    /* best-effort */
  }
}

function clearDraft(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* best-effort */
  }
}

const AXIS_LABEL: Record<BtrQuestion['axis'], string> = {
  physical: 'Thể chất',
  personality: 'Tính cách',
  family: 'Gia đình',
  milestone: 'Mốc sự kiện',
  career: 'Sự nghiệp',
  health: 'Sức khỏe',
};

function ConfidenceBadge({ value }: { value: BtrResult['confidence'] }) {
  const map = {
    high: { label: 'Cao', cls: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' },
    medium: { label: 'Trung bình', cls: 'border-gold/40 bg-gold/10 text-gold-700' },
    low: { label: 'Thấp', cls: 'border-rose-500/40 bg-rose-500/10 text-rose-300' },
  } as const;
  const m = map[value];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${m.cls}`}>
      Độ tin cậy: {m.label}
    </span>
  );
}

export interface RectifyClientProps {
  initialQuestions: BtrQuestion[];
  apiBase: string;
}

export function RectifyClient({ initialQuestions, apiBase }: RectifyClientProps) {
  const [questions] = React.useState<BtrQuestion[]>(initialQuestions);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [stepIndex, setStepIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<BtrResult | null>(null);
  const [confirmedCanh, setConfirmedCanh] = React.useState<string | null>(null);

  // Restore draft once.
  React.useEffect(() => {
    const d = readDraft();
    if (d) {
      setAnswers(d.answers);
      // Clamp to current question count in case backend changed.
      const maxIdx = Math.max(0, Math.min(d.stepIndex, initialQuestions.length - 1));
      setStepIndex(maxIdx);
    }
  }, [initialQuestions.length]);

  // Persist draft on changes.
  React.useEffect(() => {
    if (Object.keys(answers).length === 0 && stepIndex === 0) return;
    writeDraft({ answers, stepIndex, updatedAt: new Date().toISOString() });
  }, [answers, stepIndex]);

  const total = questions.length;
  const current = questions[stepIndex];
  const answeredCount = Object.keys(answers).length;

  function selectOption(qid: string, oid: string) {
    setAnswers((prev) => ({ ...prev, [qid]: oid }));
  }

  function goNext() {
    if (stepIndex < total - 1) setStepIndex(stepIndex + 1);
  }

  function goPrev() {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  }

  function resetAll() {
    setAnswers({});
    setStepIndex(0);
    setResult(null);
    setError(null);
    setConfirmedCanh(null);
    clearDraft();
  }

  async function submit() {
    setError(null);
    if (Object.keys(answers).length === 0) {
      setError('Hãy trả lời ít nhất 1 câu trước khi phân tích.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/tools/birth-time/rectify`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      const parsed = await safeJson<
        | { ok: true; result: BtrResult }
        | { ok: false; error?: string }
      >(res);
      if (!parsed.ok) {
        if (parsed.status === 429) {
          setError('Bạn đã thử quá nhiều lần trong một giờ. Vui lòng chờ và thử lại.');
        } else {
          setError(`Phản hồi không hợp lệ (HTTP ${parsed.status}).`);
        }
      } else {
        const data = parsed.data;
        if (!data.ok) {
          setError(data.error ?? 'Có lỗi xảy ra, thử lại sau.');
        } else {
          setResult(data.result);
        }
      }
    } catch {
      setError('Không kết nối được máy chủ. Thử lại sau.');
    } finally {
      setLoading(false);
    }
  }

  function confirmCanh(candidate: BtrCandidate) {
    const profile = readSavedProfile() ?? {};
    saveProfile({
      ...profile,
      birthTime: candidate.hour,
      birthTimeConfidence: 'approximate',
    });
    setConfirmedCanh(candidate.canh);
  }

  const progressPct = total > 0 ? Math.round(((stepIndex + 1) / total) * 100) : 0;

  // ---------- Empty question list (worker down + no fallback) ----------
  if (total === 0) {
    return (
      <ToolPageShell
        eyebrow="Birth Time Rectification"
        icon={<span aria-hidden="true">🕰️</span>}
        title={
          <>
            Hồi cứu <GoldAccent>giờ sinh</GoldAccent>
          </>
        }
        description="Không nhớ chính xác giờ sinh? Trả lời các câu hỏi hồi cứu để thu hẹp khung giờ khả dĩ."
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Tử Vi', href: '/tu-vi' },
          { label: 'Hồi cứu giờ sinh' },
        ]}
      >
        <Card className="mt-6 border-rose-500/30 bg-rose-500/5">
          <CardContent className="pt-6">
            <p className="text-sm text-foreground/80">
              Không tải được danh sách câu hỏi. Vui lòng thử lại sau ít phút hoặc kiểm tra kết nối mạng.
            </p>
          </CardContent>
        </Card>
      </ToolPageShell>
    );
  }

  return (
    <ToolPageShell
      eyebrow="Birth Time Rectification"
      icon={<span aria-hidden="true">🕰️</span>}
      title={
        <>
          Hồi cứu <GoldAccent>giờ sinh</GoldAccent>
        </>
      }
      description="Không nhớ chính xác giờ sinh? Trả lời 12 câu hỏi hồi cứu sự kiện đời để thu hẹp khung giờ (canh) khả dĩ xuống top 3 ứng viên."
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Tử Vi', href: '/tu-vi' },
        { label: 'Hồi cứu giờ sinh' },
      ]}
    >
      {/* Caveat banner — always visible */}
      <div className="mt-6 rounded-md border border-gold/25 bg-gold/5 px-4 py-3 text-xs text-muted-foreground">
        <strong className="text-gold-700">Lưu ý:</strong> Kết quả là <em>ước lượng</em> dựa
        trên hồi cứu sự kiện đời, <strong>không thay thế</strong> việc xác định chính
        xác giờ sinh từ chuyên gia Tử Vi hoặc giấy khai sinh. Dùng để thu hẹp khung
        giờ khả dĩ — bạn nên đối chiếu thêm với người thân nếu có thể.
      </div>

      {/* ---------- Form (question UI) ---------- */}
      {!result && (
        <section className="mt-8">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-mono uppercase tracking-[0.28em] text-gold-700">
                Câu {stepIndex + 1}/{total}
              </span>
              <span>{answeredCount}/{total} đã trả lời</span>
            </div>
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressPct}
              className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted/10"
            >
              <div
                className="h-full bg-gold-gradient transition-[width] duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {current && (
            <Card key={current.id} className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold-700">
                  {AXIS_LABEL[current.axis]}
                </p>
                <CardTitle className="font-heading text-lg text-foreground sm:text-xl">
                  {current.prompt}
                </CardTitle>
                {current.helper && (
                  <CardDescription className="text-xs text-muted-foreground">
                    {current.helper}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <RadioGroup
                  name={current.id}
                  value={answers[current.id] ?? ''}
                  onValueChange={(v) => selectOption(current.id, v)}
                  className="space-y-2"
                >
                  {current.options.map((o) => {
                    const checked = answers[current.id] === o.id;
                    return (
                      <label
                        key={o.id}
                        className={[
                          'flex cursor-pointer items-start gap-3 rounded-md border px-3 py-3 text-sm transition-colors',
                          checked
                            ? 'border-gold/60 bg-gold/10 text-foreground'
                            : 'border-border bg-card/40 text-foreground/85 hover:border-gold/30',
                        ].join(' ')}
                      >
                        <RadioGroupItem
                          value={o.id}
                          id={`${current.id}-${o.id}`}
                          className="mt-0.5"
                        />
                        <span className="leading-relaxed">{o.label}</span>
                      </label>
                    );
                  })}
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300"
            >
              {error}
            </p>
          )}

          {/* Nav */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={goPrev}
                disabled={stepIndex === 0}
              >
                ← Câu trước
              </Button>
              {stepIndex < total - 1 ? (
                <Button type="button" onClick={goNext} disabled={!current || !answers[current.id]}>
                  Câu tiếp →
                </Button>
              ) : (
                <Button type="button" onClick={submit} disabled={loading || answeredCount === 0}>
                  {loading ? 'Đang phân tích…' : 'Phân tích kết quả →'}
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              {answeredCount > 0 && (
                <Button type="button" variant="ghost" onClick={resetAll}>
                  Xóa tất cả & làm lại
                </Button>
              )}
            </div>
          </div>

          {/* Quick jumper for partial completers */}
          {answeredCount >= 1 && stepIndex < total - 1 && (
            <Button
              type="button"
              variant="ghost"
              className="mt-3 text-muted-foreground"
              onClick={submit}
              disabled={loading}
            >
              Phân tích với {answeredCount} câu đã trả lời (không cần làm hết)
            </Button>
          )}
        </section>
      )}

      {/* ---------- Result view ---------- */}
      {result && (
        <section className="mt-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-heading text-xl text-foreground sm:text-2xl">
              Top 3 khung giờ khả dĩ
            </h2>
            <ConfidenceBadge value={result.confidence} />
          </div>
          <p className="text-xs text-muted-foreground">
            Trả lời {result.answeredCount}/{result.totalQuestions} câu.
            {result.confidence === 'low' && ' Trả lời thêm câu để tăng độ tin cậy.'}
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {result.topCandidates.map((c, i) => {
              const isTop = i === 0;
              const isConfirmed = confirmedCanh === c.canh;
              return (
                <Card
                  key={c.canh}
                  className={[
                    'border bg-card/50 backdrop-blur-sm',
                    isTop
                      ? 'border-gold/50 shadow-[0_0_30px_-12px_rgba(184,146,61,0.45)]'
                      : 'border-border',
                  ].join(' ')}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold-700">
                        Hạng #{i + 1}
                      </p>
                      <span className="font-mono text-xs text-muted-foreground">
                        điểm: {c.score}
                      </span>
                    </div>
                    <CardTitle className="font-heading text-2xl text-foreground">
                      Giờ {c.canh}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Khung: <span className="text-gold-700">{c.range}</span>
                      <span className="mx-1">·</span>
                      Giờ đại diện: <span className="text-gold-700">{c.hour}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                        Vì sao
                      </p>
                      <ul className="space-y-1 text-xs text-foreground/80">
                        {c.reasoning.map((r, ri) => (
                          <li key={ri}>• {r}</li>
                        ))}
                      </ul>
                    </div>
                    {isConfirmed ? (
                      <p className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
                        Đã lưu vào hồ sơ với giờ {c.hour}. Bạn có thể lập lá số ngay.
                      </p>
                    ) : (
                      <Button
                        type="button"
                        variant={isTop ? 'default' : 'outline'}
                        className="w-full"
                        onClick={() => confirmCanh(c)}
                      >
                        Dùng giờ {c.canh} cho lá số
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="rounded-md border border-border bg-card/30 px-4 py-3 text-xs text-muted-foreground">
            <p className="mb-1 font-semibold text-foreground/80">{result.caveat}</p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            {confirmedCanh && (
              <Button asChild={false}>
                <Link href="/onboarding/topic">Lập lá số ngay →</Link>
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setResult(null);
                setError(null);
              }}
            >
              ← Quay lại chỉnh đáp án
            </Button>
            <Button type="button" variant="ghost" onClick={resetAll}>
              Làm lại từ đầu
            </Button>
          </div>
        </section>
      )}
    </ToolPageShell>
  );
}
