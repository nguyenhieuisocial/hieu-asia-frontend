'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  RadioGroup,
  RadioGroupItem,
  Textarea,
} from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import {
  makeId,
  mondayOfWeekVN,
  readWeeklyReviews,
  saveWeeklyReview,
  type JournalTopic,
  type WeeklyReview,
} from '@/lib/journal-storage';

const TOPIC_OPTIONS: readonly { id: JournalTopic; label: string }[] = [
  { id: 'career', label: 'Sự nghiệp' },
  { id: 'relationship', label: 'Tình cảm' },
  { id: 'finance', label: 'Tài chính' },
  { id: 'family', label: 'Gia đình' },
  { id: 'general', label: 'Khác' },
];

const TOPIC_LABEL: Record<JournalTopic, string> = {
  career: 'Sự nghiệp',
  relationship: 'Tình cảm',
  finance: 'Tài chính',
  family: 'Gia đình',
  general: 'Khác',
};

function isJournalTopic(v: string): v is JournalTopic {
  return (
    v === 'career' ||
    v === 'relationship' ||
    v === 'finance' ||
    v === 'family' ||
    v === 'general'
  );
}

const weekFmt = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'Asia/Ho_Chi_Minh',
});

function formatWeek(weekStart: string): string {
  // weekStart is YYYY-MM-DD (already VN-local Monday).
  // Anchor at noon UTC to dodge tz boundary surprises during formatting.
  try {
    const [y, m, d] = weekStart.split('-').map((s) => Number(s));
    if (!y || !m || !d) return weekStart;
    const monday = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
    const sunday = new Date(monday);
    sunday.setUTCDate(monday.getUTCDate() + 6);
    return `${weekFmt.format(monday)} – ${weekFmt.format(sunday)}`;
  } catch {
    return weekStart;
  }
}

function previousWeekStart(weekStart: string): string {
  const parts = weekStart.split('-').map((s) => Number(s));
  const y = parts[0] ?? 1970;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - 7);
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(dt.getUTCDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

function countConsecutiveWeeks(reviews: WeeklyReview[]): number {
  if (reviews.length === 0) return 0;
  const set = new Set(reviews.map((r) => r.weekStart));
  let cursor = mondayOfWeekVN();
  let count = 0;
  // Tolerate a missed current week — start from current or last.
  if (!set.has(cursor)) {
    cursor = previousWeekStart(cursor);
    if (!set.has(cursor)) return 0;
  }
  while (set.has(cursor)) {
    count += 1;
    cursor = previousWeekStart(cursor);
  }
  return count;
}

export default function WeeklyReviewPage() {
  const [hydrated, setHydrated] = useState(false);
  const [reviews, setReviews] = useState<WeeklyReview[]>([]);
  const [currentWeek, setCurrentWeek] = useState('');
  const [editing, setEditing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form state.
  const [topicFocus, setTopicFocus] = useState<JournalTopic>('general');
  const [highlights, setHighlights] = useState('');
  const [energyDrain, setEnergyDrain] = useState('');
  const [oneLearning, setOneLearning] = useState('');
  const [oneChange, setOneChange] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setReviews(readWeeklyReviews());
    setCurrentWeek(mondayOfWeekVN());
    setHydrated(true);
  }, []);

  const thisWeekReview = useMemo(
    () => reviews.find((r) => r.weekStart === currentWeek) ?? null,
    [reviews, currentWeek],
  );

  // When loading an existing review for the current week, prime the form.
  useEffect(() => {
    if (thisWeekReview) {
      setTopicFocus(thisWeekReview.topicFocus);
      setHighlights(thisWeekReview.highlights);
      setEnergyDrain(thisWeekReview.energyDrain);
      setOneLearning(thisWeekReview.oneLearning);
      setOneChange(thisWeekReview.oneChange);
    }
  }, [thisWeekReview]);

  const streak = useMemo(() => countConsecutiveWeeks(reviews), [reviews]);
  const pastReviews = useMemo(
    () => reviews.filter((r) => r.weekStart !== currentWeek).slice(0, 8),
    [reviews, currentWeek],
  );

  const showForm = !thisWeekReview || editing;

  const lenOK = (s: string) => {
    const n = s.trim().length;
    return n >= 10 && n <= 300;
  };
  const canSave =
    !saving &&
    lenOK(highlights) &&
    lenOK(energyDrain) &&
    lenOK(oneLearning) &&
    lenOK(oneChange);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    setSaving(true);
    const review: WeeklyReview = {
      id: thisWeekReview?.id ?? makeId('wr_'),
      weekStart: currentWeek,
      createdAt: thisWeekReview?.createdAt ?? new Date().toISOString(),
      highlights: highlights.trim(),
      energyDrain: energyDrain.trim(),
      oneLearning: oneLearning.trim(),
      oneChange: oneChange.trim(),
      topicFocus,
    };
    saveWeeklyReview(review);
    setReviews(readWeeklyReviews());
    setEditing(false);
    setSaving(false);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <section className="mx-auto max-w-3xl px-6 pt-16 pb-20">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-gold">
            Trang chủ
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-muted-foreground">Weekly Review</span>
        </nav>

        <header className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-gold/80">
            Đánh giá tuần
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight sm:text-4xl">
            <span className="bg-gold-gradient bg-clip-text text-transparent">
              5 phút mỗi tuần
            </span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Mỗi tuần, 5 phút — chuyển từ &ldquo;cảm giác&rdquo; sang
            &ldquo;dữ kiện&rdquo;. Lưu trên máy bạn.
          </p>
        </header>

        {!hydrated && (
          <div
            className="rounded-lg border border-border bg-card/40 p-8 text-sm text-muted-foreground"
            aria-busy="true"
          >
            Đang tải...
          </div>
        )}

        {hydrated && (
          <>
            <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 text-gold/80" aria-hidden="true" />
                Tuần này: {formatWeek(currentWeek)}
              </span>
              {streak > 0 && (
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <Sparkles
                    className="h-4 w-4 text-gold/80"
                    aria-hidden="true"
                  />
                  Bạn đã review{' '}
                  <strong className="font-medium text-foreground">
                    {streak} tuần liên tiếp
                  </strong>
                </span>
              )}
            </div>

            {!showForm && thisWeekReview && (
              <Card className="border-emerald-500/25 bg-emerald-900/[0.06]">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 font-heading text-lg">
                      <CheckCircle2
                        className="h-5 w-5 text-emerald-300/85"
                        aria-hidden="true"
                      />
                      Đã review tuần này
                    </CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatWeek(thisWeekReview.weekStart)} ·{' '}
                      <span className="rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-[10px] font-medium text-gold">
                        {TOPIC_LABEL[thisWeekReview.topicFocus]}
                      </span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card/40 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-gold/40 hover:text-gold"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    Sửa lại
                  </button>
                </CardHeader>
                <CardContent className="space-y-5">
                  <ReviewField label="Khoảnh khắc tốt nhất" body={thisWeekReview.highlights} />
                  <ReviewField label="Điều làm bạn mệt" body={thisWeekReview.energyDrain} />
                  <ReviewField label="Một điều học được" body={thisWeekReview.oneLearning} />
                  <ReviewField label="Một điều sẽ làm khác tuần tới" body={thisWeekReview.oneChange} />
                </CardContent>
              </Card>
            )}

            {showForm && (
              <form onSubmit={handleSubmit} noValidate>
                <Card className="border-gold/20 bg-card/60 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="font-heading text-xl">
                      {thisWeekReview
                        ? 'Sửa review tuần này'
                        : 'Review tuần này'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-7">
                    <fieldset>
                      <legend className="text-sm font-medium text-foreground/90">
                        Tuần này bạn tập trung vào đâu?
                      </legend>
                      <RadioGroup
                        name="weekly-topic"
                        value={topicFocus}
                        onValueChange={(v) =>
                          isJournalTopic(v) && setTopicFocus(v)
                        }
                        className="mt-4 grid gap-2 sm:grid-cols-2"
                      >
                        {TOPIC_OPTIONS.map((t) => (
                          <Label
                            key={t.id}
                            htmlFor={`wt-${t.id}`}
                            className={[
                              'flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition',
                              topicFocus === t.id
                                ? 'border-gold bg-gold/10'
                                : 'border-border bg-card/40 hover:border-gold/40',
                            ].join(' ')}
                          >
                            <RadioGroupItem
                              id={`wt-${t.id}`}
                              value={t.id}
                            />
                            <span className="text-sm text-foreground">
                              {t.label}
                            </span>
                          </Label>
                        ))}
                      </RadioGroup>
                    </fieldset>

                    <FieldTextarea
                      id="w-highlights"
                      label="Khoảnh khắc tốt nhất của tuần"
                      hint="1-2 câu: lúc nào bạn thấy mình thật sự sống?"
                      value={highlights}
                      onChange={setHighlights}
                    />
                    <FieldTextarea
                      id="w-drain"
                      label="Điều gì làm bạn mệt?"
                      hint="Việc, người, hay thói quen nào hút năng lượng?"
                      value={energyDrain}
                      onChange={setEnergyDrain}
                    />
                    <FieldTextarea
                      id="w-learn"
                      label="Một điều bạn học được"
                      hint="Về chính mình, người khác, hay công việc."
                      value={oneLearning}
                      onChange={setOneLearning}
                    />
                    <FieldTextarea
                      id="w-change"
                      label="Một điều bạn sẽ làm khác tuần tới"
                      hint="Đủ nhỏ để thực sự làm được."
                      value={oneChange}
                      onChange={setOneChange}
                    />

                    <div className="flex items-center justify-between gap-4">
                      {thisWeekReview && (
                        <button
                          type="button"
                          onClick={() => setEditing(false)}
                          className="text-sm text-muted-foreground hover:text-gold"
                        >
                          Huỷ
                        </button>
                      )}
                      <Button
                        type="submit"
                        disabled={!canSave}
                        className={
                          thisWeekReview ? 'min-w-[180px]' : 'ml-auto min-w-[180px]'
                        }
                      >
                        {saving ? (
                          'Đang lưu...'
                        ) : (
                          <>
                            Lưu review
                            <ArrowRight
                              className="ml-1.5 h-4 w-4"
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </Button>
                    </div>

                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Sparkles
                        className="h-3.5 w-3.5 text-gold/70"
                        aria-hidden="true"
                      />
                      Lưu trên trình duyệt của bạn — không gửi server.
                    </p>
                  </CardContent>
                </Card>
              </form>
            )}

            {pastReviews.length > 0 && (
              <section aria-labelledby="past-heading" className="mt-12">
                <h2
                  id="past-heading"
                  className="font-heading text-lg font-semibold sm:text-xl"
                >
                  Các tuần đã review
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Bấm vào một tuần để xem chi tiết.
                </p>
                <ul className="mt-5 grid gap-3">
                  {pastReviews.map((r) => {
                    const open = expandedId === r.id;
                    return (
                      <li key={r.id}>
                        <Card className="border-border bg-card/40">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedId(open ? null : r.id)
                            }
                            aria-expanded={open}
                            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                          >
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-medium text-foreground">
                                  {formatWeek(r.weekStart)}
                                </span>
                                <span className="rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-[10px] font-medium text-gold">
                                  {TOPIC_LABEL[r.topicFocus]}
                                </span>
                              </div>
                            </div>
                            <ArrowRight
                              className={[
                                'h-4 w-4 shrink-0 text-muted-foreground transition',
                                open ? 'rotate-90 text-gold' : '',
                              ].join(' ')}
                              aria-hidden="true"
                            />
                          </button>
                          {open && (
                            <CardContent className="space-y-4 border-t border-border pt-5">
                              <ReviewField label="Khoảnh khắc tốt nhất" body={r.highlights} />
                              <ReviewField label="Điều làm bạn mệt" body={r.energyDrain} />
                              <ReviewField label="Một điều học được" body={r.oneLearning} />
                              <ReviewField label="Một điều sẽ làm khác tuần tới" body={r.oneChange} />
                            </CardContent>
                          )}
                        </Card>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            <section className="mt-12 rounded-xl border border-gold/25 bg-gold/[0.04] p-6 sm:p-8">
              <h2 className="font-heading text-lg font-semibold sm:text-xl">
                Cũng có thể dùng Decision Journal
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Khi tuần này có một quyết định lớn, hãy ghi riêng vào Journal —
                sẽ dễ review sau 30 ngày hơn.
              </p>
              <Link
                href="/journal"
                className="mt-5 inline-flex items-center gap-2 rounded-md border border-gold/50 bg-card/60 px-4 py-2 text-sm font-medium text-gold transition hover:bg-gold/10"
              >
                Mở Decision Journal
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </section>
          </>
        )}
      </section>

      <SiteFooter />
      <StickyMobileCta trackId="weekly-review" />
    </main>
  );
}

function FieldTextarea({
  id,
  label,
  hint,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const len = value.trim().length;
  return (
    <div>
      <Label htmlFor={id} className="text-sm font-medium">
        {label} <span className="text-red-400/80">*</span>
      </Label>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={300}
        rows={3}
        className="mt-2"
        required
      />
      <div className="mt-1 flex justify-end text-xs text-muted-foreground">
        {len}/300 (tối thiểu 10)
      </div>
    </div>
  );
}

function ReviewField({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </h3>
      <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">
        {body}
      </p>
    </div>
  );
}
