'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
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
  makeId,
  saveJournalEntry,
  type JournalEntry,
  type JournalTopic,
} from '@/lib/journal-storage';

const TOPIC_OPTIONS: readonly { id: JournalTopic; label: string; hint: string }[] =
  [
    { id: 'career', label: 'Sự nghiệp', hint: 'Nghỉ việc, chuyển vai, khởi nghiệp' },
    { id: 'relationship', label: 'Tình cảm', hint: 'Quan hệ, hôn nhân, chia tay' },
    { id: 'finance', label: 'Tài chính', hint: 'Đầu tư, mua nhà, tiết kiệm' },
    { id: 'family', label: 'Gia đình', hint: 'Cha mẹ, con cái, người thân' },
    {
      id: 'general',
      label: 'Khác',
      hint: 'Một quyết định không thuộc nhóm trên',
    },
  ];

function isJournalTopic(v: string): v is JournalTopic {
  return (
    v === 'career' ||
    v === 'relationship' ||
    v === 'finance' ||
    v === 'family' ||
    v === 'general'
  );
}

export default function NewJournalEntryPage() {
  const router = useRouter();

  const [topic, setTopic] = useState<JournalTopic>('general');
  const [question, setQuestion] = useState('');
  const [decision, setDecision] = useState('');
  const [reasoning, setReasoning] = useState('');
  const [expectedOutcome, setExpectedOutcome] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const qLen = question.trim().length;
  const dLen = decision.trim().length;
  const rLen = reasoning.length;
  const eLen = expectedOutcome.trim().length;

  const canSubmit =
    !submitting &&
    qLen >= 10 &&
    qLen <= 200 &&
    dLen >= 10 &&
    dLen <= 500 &&
    rLen <= 1000 &&
    eLen >= 10 &&
    eLen <= 500;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    const id = makeId('jr_');
    const entry: JournalEntry = {
      id,
      createdAt: new Date().toISOString(),
      topic,
      question: question.trim(),
      decision: decision.trim(),
      reasoning: reasoning.trim(),
      expectedOutcome: expectedOutcome.trim(),
    };
    saveJournalEntry(entry);
    router.push(`/journal/${id}`);
  }

  return (
    <main className="min-h-screen bg-ink text-cream">
      <SiteNav />

      <section className="mx-auto max-w-3xl px-6 pt-16 pb-20">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-cream/55">
          <Link href="/" className="hover:text-gold">
            Trang chủ
          </Link>
          <span className="mx-1.5">/</span>
          <Link href="/journal" className="hover:text-gold">
            Decision Journal
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-cream/70">Quyết định mới</span>
        </nav>

        <header className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-gold/80">
            Decision Journal
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight sm:text-4xl">
            Ghi một quyết định
          </h1>
        </header>

        <div className="mb-8 flex items-start gap-3 rounded-lg border border-gold/25 bg-gold/[0.04] p-4">
          <BookOpen
            className="mt-0.5 h-5 w-5 shrink-0 text-gold/80"
            aria-hidden="true"
          />
          <p className="text-sm leading-relaxed text-cream/85">
            Decision Journal không phán đúng/sai. Mục đích là 30 ngày sau bạn
            nhìn lại, biết mình đã quyết theo lý do gì.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <Card className="border-gold/20 bg-ink/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="font-heading text-xl">
                Quyết định của bạn
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <fieldset>
                <legend className="text-sm font-medium text-cream/90">
                  Chủ đề
                </legend>
                <RadioGroup
                  name="journal-topic"
                  value={topic}
                  onValueChange={(v) => isJournalTopic(v) && setTopic(v)}
                  className="mt-4 grid gap-2 sm:grid-cols-2"
                >
                  {TOPIC_OPTIONS.map((t) => (
                    <Label
                      key={t.id}
                      htmlFor={`jt-${t.id}`}
                      className={[
                        'flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition',
                        topic === t.id
                          ? 'border-gold bg-gold/10'
                          : 'border-cream/15 bg-ink/40 hover:border-gold/40',
                      ].join(' ')}
                    >
                      <RadioGroupItem
                        id={`jt-${t.id}`}
                        value={t.id}
                        className="mt-1"
                      />
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
                <Label htmlFor="j-question" className="text-sm font-medium">
                  Bạn đang quyết định điều gì?{' '}
                  <span className="text-red-400/80">*</span>
                </Label>
                <p className="mt-1 text-xs text-cream/55">
                  Câu hỏi gọn — sau này nhìn lại sẽ dễ nhớ ngữ cảnh.
                </p>
                <Input
                  id="j-question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  maxLength={200}
                  placeholder="Tôi có nên nghỉ việc hiện tại để..."
                  className="mt-2"
                  required
                />
                <div className="mt-1 flex justify-end text-xs text-cream/50">
                  {qLen}/200 (tối thiểu 10)
                </div>
              </div>

              <div>
                <Label htmlFor="j-decision" className="text-sm font-medium">
                  Bạn đã chọn gì? <span className="text-red-400/80">*</span>
                </Label>
                <p className="mt-1 text-xs text-cream/55">
                  Phương án bạn quyết theo, kèm mốc thời gian nếu có.
                </p>
                <Textarea
                  id="j-decision"
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                  maxLength={500}
                  rows={3}
                  placeholder="Tôi sẽ nghỉ việc vào tháng sau, dành 3 tháng học..."
                  className="mt-2"
                  required
                />
                <div className="mt-1 flex justify-end text-xs text-cream/50">
                  {dLen}/500 (tối thiểu 10)
                </div>
              </div>

              <div>
                <Label htmlFor="j-reasoning" className="text-sm font-medium">
                  Lý do bạn chọn vậy?{' '}
                  <span className="text-cream/50">(tuỳ chọn)</span>
                </Label>
                <p className="mt-1 text-xs text-cream/55">
                  Càng cụ thể, sau này càng dễ học từ chính mình.
                </p>
                <Textarea
                  id="j-reasoning"
                  value={reasoning}
                  onChange={(e) => setReasoning(e.target.value)}
                  maxLength={1000}
                  rows={5}
                  placeholder="Vì tôi đã cảm thấy công việc không còn ý nghĩa, và..."
                  className="mt-2"
                />
                <div className="mt-1 flex justify-end text-xs text-cream/50">
                  {rLen}/1000
                </div>
              </div>

              <div>
                <Label htmlFor="j-expected" className="text-sm font-medium">
                  Bạn kỳ vọng kết quả thế nào?{' '}
                  <span className="text-red-400/80">*</span>
                </Label>
                <p className="mt-1 text-xs text-cream/55">
                  Viết kỳ vọng cụ thể — khi review, bạn sẽ so kết quả thực với
                  điều này.
                </p>
                <Textarea
                  id="j-expected"
                  value={expectedOutcome}
                  onChange={(e) => setExpectedOutcome(e.target.value)}
                  maxLength={500}
                  rows={3}
                  placeholder="Trong 3 tháng tôi sẽ học được X, có Y khách hàng đầu tiên..."
                  className="mt-2"
                  required
                />
                <div className="mt-1 flex justify-end text-xs text-cream/50">
                  {eLen}/500 (tối thiểu 10)
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <Link
                  href="/journal"
                  className="text-sm text-cream/65 hover:text-gold"
                >
                  ← Quay lại
                </Link>
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="min-w-[180px]"
                >
                  {submitting ? (
                    'Đang lưu...'
                  ) : (
                    <>
                      Lưu quyết định
                      <ArrowRight
                        className="ml-1.5 h-4 w-4"
                        aria-hidden="true"
                      />
                    </>
                  )}
                </Button>
              </div>

              <p className="flex items-center gap-2 text-xs text-cream/55">
                <Sparkles className="h-3.5 w-3.5 text-gold/70" aria-hidden="true" />
                Lưu trên trình duyệt của bạn. Không ai khác đọc được.
              </p>
            </CardContent>
          </Card>
        </form>
      </section>

      <SiteFooter />
    </main>
  );
}
