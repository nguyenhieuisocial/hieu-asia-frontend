'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Target,
  Trash2,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Textarea,
} from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import {
  deleteJournalEntry,
  readJournalEntries,
  updateJournalEntry,
  type JournalEntry,
  type JournalTopic,
} from '@/lib/journal-storage';

const TOPIC_LABEL: Record<JournalTopic, string> = {
  career: 'Sự nghiệp',
  relationship: 'Tình cảm',
  finance: 'Tài chính',
  family: 'Gia đình',
  general: 'Khác',
};

const dateFmt = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'Asia/Ho_Chi_Minh',
});

function formatDate(iso: string): string {
  try {
    return dateFmt.format(new Date(iso));
  } catch {
    return iso;
  }
}

function addDays(iso: string, days: number): string {
  try {
    const d = new Date(iso);
    d.setDate(d.getDate() + days);
    return dateFmt.format(d);
  } catch {
    return iso;
  }
}

export default function JournalEntryPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id ?? '';

  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);

  const [actualOutcome, setActualOutcome] = useState('');
  const [lesson, setLesson] = useState('');
  const [savingReview, setSavingReview] = useState(false);

  useEffect(() => {
    const all = readJournalEntries();
    const found = all.find((e) => e.id === id) ?? null;
    setEntry(found);
    setHydrated(true);
  }, [id]);

  const reviewedAt = entry?.reviewedAt;

  const canSaveReview = useMemo(() => {
    if (savingReview) return false;
    const a = actualOutcome.trim().length;
    const l = lesson.trim().length;
    return a >= 10 && a <= 500 && l >= 10 && l <= 500;
  }, [actualOutcome, lesson, savingReview]);

  function handleSaveReview(e: React.FormEvent) {
    e.preventDefault();
    if (!canSaveReview || !entry) return;
    setSavingReview(true);
    const patch: Partial<JournalEntry> = {
      reviewedAt: new Date().toISOString(),
      actualOutcome: actualOutcome.trim(),
      lesson: lesson.trim(),
    };
    updateJournalEntry(entry.id, patch);
    setEntry({ ...entry, ...patch });
    setSavingReview(false);
  }

  function handleDelete() {
    if (!entry) return;
    const ok = window.confirm(
      'Xoá quyết định này khỏi trình duyệt của bạn? Hành động không thể hoàn tác.',
    );
    if (!ok) return;
    deleteJournalEntry(entry.id);
    router.push('/journal');
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
          <Link href="/journal" className="hover:text-gold">
            Decision Journal
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-muted-foreground">Chi tiết</span>
        </nav>

        {!hydrated && (
          <div
            className="rounded-lg border border-border bg-card/40 p-8 text-sm text-muted-foreground"
            aria-busy="true"
          >
            Đang tải...
          </div>
        )}

        {hydrated && !entry && (
          <Card className="border-border bg-card/60">
            <CardContent className="flex flex-col items-center px-6 py-12 text-center">
              <BookOpen
                className="mb-4 h-10 w-10 text-muted-foreground"
                aria-hidden="true"
              />
              <h1 className="font-heading text-xl font-semibold">
                Không tìm thấy quyết định này
              </h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                Không tìm thấy quyết định này trên trình duyệt của bạn. Có thể
                bạn đã xoá, hoặc đang ở một thiết bị khác — dữ liệu Journal được
                lưu cục bộ.
              </p>
              <Button asChild variant="outline"><Link href="/journal" className="mt-6">
                Về Decision Journal
              </Link></Button>
            </CardContent>
          </Card>
        )}

        {hydrated && entry && (
          <article>
            <header className="mb-8">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-xs font-medium text-gold">
                  {TOPIC_LABEL[entry.topic]}
                </span>
                <span className="text-xs text-muted-foreground">
                  Tạo ngày {formatDate(entry.createdAt)}
                </span>
                {reviewedAt && (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-300/85">
                    <CheckCircle2
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                    Đã review {formatDate(reviewedAt)}
                  </span>
                )}
              </div>
              <h1 className="font-heading text-2xl font-bold leading-snug sm:text-3xl">
                {entry.question}
              </h1>
            </header>

            <div className="grid gap-6 sm:grid-cols-[1fr_220px] sm:items-start">
              <div className="space-y-6">
                <Card className="border-gold/15 bg-card/60">
                  <CardHeader>
                    <CardTitle className="font-heading text-base">
                      Bạn đã chọn
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">
                      {entry.decision}
                    </p>
                  </CardContent>
                </Card>

                {entry.reasoning && (
                  <Card className="border-border bg-card/40">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="font-heading text-base">
                        Lý do
                      </CardTitle>
                      <button
                        type="button"
                        onClick={() => setShowReasoning((v) => !v)}
                        className="text-xs text-muted-foreground hover:text-gold"
                        aria-expanded={showReasoning}
                      >
                        {showReasoning ? 'Ẩn' : 'Hiện'}
                      </button>
                    </CardHeader>
                    {showReasoning && (
                      <CardContent>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
                          {entry.reasoning}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                )}

                <Card className="border-border bg-card/40">
                  <CardHeader>
                    <CardTitle className="font-heading text-base">
                      Kỳ vọng kết quả
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
                      {entry.expectedOutcome}
                    </p>
                  </CardContent>
                </Card>

                <section aria-labelledby="review-heading" className="pt-2">
                  <div className="mb-3 flex items-center gap-2">
                    <Target
                      className="h-4 w-4 text-gold/80"
                      aria-hidden="true"
                    />
                    <h2
                      id="review-heading"
                      className="font-heading text-lg font-semibold"
                    >
                      Review
                    </h2>
                  </div>

                  {reviewedAt && entry.actualOutcome && entry.lesson ? (
                    <Card className="border-emerald-500/25 bg-emerald-900/[0.06]">
                      <CardContent className="space-y-5 p-5">
                        <div>
                          <h3 className="text-xs font-medium uppercase tracking-wider text-emerald-300/80">
                            Kết quả thực
                          </h3>
                          <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">
                            {entry.actualOutcome}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-xs font-medium uppercase tracking-wider text-emerald-300/80">
                            Bài học
                          </h3>
                          <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">
                            {entry.lesson}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Review hoàn thành ngày {formatDate(reviewedAt)}.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="border-gold/20 bg-card/60">
                      <CardContent className="p-5">
                        <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                          Khi đã đủ thời gian, bạn có thể quay lại đây ghi lại
                          kết quả thực và rút ra bài học. Không cần đợi đúng 30
                          ngày — bao giờ bạn sẵn sàng thì review.
                        </p>
                        <form
                          onSubmit={handleSaveReview}
                          className="space-y-5"
                          noValidate
                        >
                          <div>
                            <Label
                              htmlFor="r-actual"
                              className="text-sm font-medium"
                            >
                              Kết quả thực tế ra sao?{' '}
                              <span className="text-red-400/80">*</span>
                            </Label>
                            <Textarea
                              id="r-actual"
                              value={actualOutcome}
                              onChange={(e) =>
                                setActualOutcome(e.target.value)
                              }
                              maxLength={500}
                              rows={3}
                              placeholder="Mô tả điều thực sự đã xảy ra..."
                              className="mt-2"
                              required
                            />
                            <div className="mt-1 flex justify-end text-xs text-muted-foreground">
                              {actualOutcome.trim().length}/500
                            </div>
                          </div>
                          <div>
                            <Label
                              htmlFor="r-lesson"
                              className="text-sm font-medium"
                            >
                              Bạn rút ra điều gì?{' '}
                              <span className="text-red-400/80">*</span>
                            </Label>
                            <Textarea
                              id="r-lesson"
                              value={lesson}
                              onChange={(e) => setLesson(e.target.value)}
                              maxLength={500}
                              rows={3}
                              placeholder="Lần sau gặp tình huống tương tự, mình sẽ..."
                              className="mt-2"
                              required
                            />
                            <div className="mt-1 flex justify-end text-xs text-muted-foreground">
                              {lesson.trim().length}/500
                            </div>
                          </div>
                          <Button
                            type="submit"
                            disabled={!canSaveReview}
                            className="min-w-[200px]"
                          >
                            <CheckCircle2
                              className="mr-1.5 h-4 w-4"
                              aria-hidden="true"
                            />
                            Đánh dấu đã review
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  )}
                </section>

                <div className="flex items-center justify-between gap-4 border-t border-border pt-6">
                  <Link
                    href="/journal"
                    className="text-sm text-muted-foreground hover:text-gold"
                  >
                    ← Về Decision Journal
                  </Link>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex items-center gap-1.5 rounded-md border border-rose-500/30 bg-rose-900/[0.08] px-3 py-1.5 text-xs text-rose-200/80 transition hover:border-rose-500/60 hover:text-rose-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Xoá quyết định
                  </button>
                </div>
              </div>

              <aside className="space-y-4 sm:sticky sm:top-24">
                <div className="rounded-lg border border-gold/25 bg-gold/[0.04] p-4">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-gold/80">
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    Review sau
                  </div>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {addDays(entry.createdAt, 30)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Gợi ý 30 ngày — bạn có thể review sớm hơn hoặc muộn hơn.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card/40 p-4">
                  <p className="text-xs text-muted-foreground">
                    Bạn cần thêm hỗ trợ?
                  </p>
                  <Link
                    href="/lo-trinh"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-gold/90 hover:text-gold"
                  >
                    Xem Lộ trình
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </div>

                <p className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Sparkles
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/70"
                    aria-hidden="true"
                  />
                  Toàn bộ dữ liệu lưu trên trình duyệt — xoá là mất hẳn.
                </p>

                {reviewedAt && (
                  <p className="flex items-start gap-2 text-xs text-muted-foreground">
                    <RotateCcw
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                    Review đã chốt. Nếu muốn ghi tiếp, hãy tạo một quyết định
                    mới.
                  </p>
                )}
              </aside>
            </div>
          </article>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
