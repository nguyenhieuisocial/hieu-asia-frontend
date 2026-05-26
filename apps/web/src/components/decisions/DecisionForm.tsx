/**
 * DecisionForm — full Decision Brief input form: 5-topic radio,
 * question input, situation textarea, character counts, submit
 * button. Calls the parent-supplied submit handler with the
 * normalized payload. Safety/Error blocks render between the
 * inputs and the submit row (parent decides what to show).
 *
 * Extracted from /decisions/new monolith (Wave 60.58 T1.1).
 *
 * The form itself is presentational + local input state only;
 * the parent owns network state, brief persistence, and routing.
 */

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
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

export type TopicId =
  | 'career'
  | 'relationship'
  | 'finance'
  | 'family'
  | 'general';

export const TOPIC_OPTIONS: readonly {
  id: TopicId;
  label: string;
  hint: string;
}[] = [
  { id: 'career', label: 'Sự nghiệp', hint: 'Nghỉ việc, chuyển vai, khởi nghiệp' },
  { id: 'relationship', label: 'Tình cảm', hint: 'Quan hệ, hôn nhân, chia tay' },
  { id: 'finance', label: 'Tài chính', hint: 'Đầu tư, mua nhà, tiết kiệm' },
  { id: 'family', label: 'Gia đình', hint: 'Cha mẹ, con cái, người thân' },
  { id: 'general', label: 'Khác / Tổng quát', hint: 'Một quyết định không thuộc nhóm trên' },
];

export function isTopicId(v: string | null): v is TopicId {
  return (
    v === 'career' ||
    v === 'relationship' ||
    v === 'finance' ||
    v === 'family' ||
    v === 'general'
  );
}

export type DecisionFormPayload = {
  topic: TopicId;
  question: string;
  situation: string | undefined;
};

export type DecisionFormProps = {
  initialTopic: TopicId;
  submitting: boolean;
  onSubmit: (payload: DecisionFormPayload) => void | Promise<void>;
  /** Slot for SafetyBlock / ErrorBlock rendered above the submit row. */
  feedbackSlot?: React.ReactNode;
};

export function DecisionForm({
  initialTopic,
  submitting,
  onSubmit,
  feedbackSlot,
}: DecisionFormProps) {
  const [topic, setTopic] = useState<TopicId>(initialTopic);
  const [question, setQuestion] = useState('');
  const [situation, setSituation] = useState('');

  const questionLength = question.trim().length;
  const situationLength = situation.length;
  const canSubmit = useMemo(
    () =>
      !submitting &&
      questionLength >= 10 &&
      questionLength <= 500 &&
      situationLength <= 1000,
    [submitting, questionLength, situationLength],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    await onSubmit({
      topic,
      question: question.trim(),
      situation: situation.trim() || undefined,
    });
  }

  return (
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
                  <RadioGroupItem
                    id={`topic-${t.id}`}
                    value={t.id}
                    className="mt-1"
                  />
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
              3–5 câu về bối cảnh: lý do, ràng buộc, điều bạn lo ngại. Càng
              cụ thể, gợi ý càng sát.
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

          {feedbackSlot}

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
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
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
  );
}
