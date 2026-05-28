'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Textarea,
} from '@hieu-asia/ui';
import { AlertTriangle, ArrowRight, Scale } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Decision Simulator',
      item: 'https://hieu.asia/decision-simulator',
    },
  ],
};

type Topic = 'career' | 'finance' | 'relationship' | 'general';

const TOPIC_OPTIONS: readonly { id: Topic; label: string }[] = [
  { id: 'career', label: 'Sự nghiệp' },
  { id: 'finance', label: 'Tài chính' },
  { id: 'relationship', label: 'Quan hệ' },
  { id: 'general', label: 'Khác' },
];

const CRITERIA: readonly string[] = [
  'Hợp xu hướng hiện tại',
  'Rủi ro tài chính',
  'Cơ hội học nhanh',
  'Áp lực tinh thần',
  'Tác động dài hạn',
  'Điều kiện nên chọn',
];

type Tag = 'Thấp' | 'Trung bình' | 'Cao';
const TAGS: readonly Tag[] = ['Thấp', 'Trung bình', 'Cao'];

const TAG_STYLE: Record<Tag, string> = {
  'Thấp': 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200',
  'Trung bình': 'border-border bg-muted/5 text-foreground/80',
  'Cao': 'border-amber-400/40 bg-amber-500/10 text-amber-200',
};

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function deterministicTag(seed: number, criterionIndex: number): Tag {
  // Mix seed with criterionIndex so different rows differ.
  const v = (seed ^ (criterionIndex * 2654435761)) >>> 0;
  const i = v % TAGS.length;
  return TAGS[i] ?? 'Trung bình';
}

function isTopic(v: string): v is Topic {
  return v === 'career' || v === 'finance' || v === 'relationship' || v === 'general';
}

type ComparisonRow = { criterion: string; a: Tag; b: Tag };

type Result = {
  rows: ComparisonRow[];
  summary: string;
};

function buildResult(
  titleA: string,
  titleB: string,
  topic: Topic,
): Result {
  const seedA = hashString(`${topic}:${titleA}`);
  const seedB = hashString(`${topic}:${titleB}`);
  const rows: ComparisonRow[] = CRITERIA.map((c, i) => ({
    criterion: c,
    a: deterministicTag(seedA, i),
    b: deterministicTag(seedB, i),
  }));
  const summary =
    `Cân nhắc: Lựa chọn A ("${titleA}") thiên về điều kiện ổn định hơn; ` +
    `lựa chọn B ("${titleB}") thiên về cơ hội học nhanh nhưng đi kèm áp lực. ` +
    `Quyết định phụ thuộc bạn đang ở giai đoạn nào — Phase 1 chỉ hỗ trợ tư duy, ` +
    `chưa phải gợi ý đúng/sai.`;
  return { rows, summary };
}

export default function DecisionSimulatorPage() {
  const [titleA, setTitleA] = useState('');
  const [descA, setDescA] = useState('');
  const [titleB, setTitleB] = useState('');
  const [descB, setDescB] = useState('');
  const [topic, setTopic] = useState<Topic>('career');
  const [result, setResult] = useState<Result | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    const a = titleA.trim();
    const b = titleB.trim();
    return (
      a.length >= 5 &&
      a.length <= 100 &&
      b.length >= 5 &&
      b.length <= 100 &&
      descA.length <= 500 &&
      descB.length <= 500 &&
      !submitting
    );
  }, [titleA, titleB, descA, descB, submitting]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);

    // Phase 1: try the API, fall back to deterministic client-side comparison.
    try {
      const resp = await fetch('/api/decisions/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          a: { title: titleA.trim(), description: descA.trim() },
          b: { title: titleB.trim(), description: descB.trim() },
          topic,
        }),
      });
      if (resp.ok) {
        const data = (await resp.json()) as Partial<Result>;
        if (Array.isArray(data.rows) && typeof data.summary === 'string') {
          setResult({ rows: data.rows, summary: data.summary });
          setSubmitting(false);
          return;
        }
      }
    } catch {
      // Network or parse error — fall through to client-side fallback.
    }

    setResult(buildResult(titleA.trim(), titleB.trim(), topic));
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />

      <section className="mx-auto max-w-3xl px-6 pt-16 pb-20">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-gold">
            Trang chủ
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-muted-foreground">Decision Simulator</span>
        </nav>

        <div
          role="note"
          className="mb-8 flex items-start gap-3 rounded-lg border border-amber-400/30 bg-amber-500/[0.06] p-4 text-sm text-amber-100/85"
        >
          <AlertTriangle
            className="mt-0.5 h-4 w-4 shrink-0 text-amber-300"
            aria-hidden="true"
          />
          <p>
            Simulator này hỗ trợ tư duy, không thay quyết định. Mọi lựa chọn cuối
            cùng vẫn là của bạn.
          </p>
        </div>

        <header className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-gold/80">
            Decision Simulator
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight sm:text-4xl">
            <span className="bg-gold-gradient bg-clip-text text-transparent">
              So sánh 2 lựa chọn
            </span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Không phải để biết đúng/sai, mà để hiểu rõ trade-off.
          </p>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <Card className="border-gold/20 bg-card/60">
            <CardHeader>
              <CardTitle className="font-heading text-xl">
                2 lựa chọn của bạn
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Tiêu đề ngắn (5–100 ký tự) + mô tả tuỳ chọn (≤ 500 ký tự).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ChoiceFields
                prefix="a"
                heading="Lựa chọn A"
                title={titleA}
                onTitle={setTitleA}
                desc={descA}
                onDesc={setDescA}
              />
              <ChoiceFields
                prefix="b"
                heading="Lựa chọn B"
                title={titleB}
                onTitle={setTitleB}
                desc={descB}
                onDesc={setDescB}
              />

              <fieldset>
                <legend className="text-sm font-medium text-foreground/90">
                  Chủ đề
                </legend>
                <RadioGroup
                  name="ds-topic"
                  value={topic}
                  onValueChange={(v) => isTopic(v) && setTopic(v)}
                  className="mt-3 grid gap-2 sm:grid-cols-2"
                >
                  {TOPIC_OPTIONS.map((t) => (
                    <Label
                      key={t.id}
                      htmlFor={`ds-topic-${t.id}`}
                      className={[
                        'flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition',
                        topic === t.id
                          ? 'border-gold bg-gold/10'
                          : 'border-border bg-card/40 hover:border-gold/40',
                      ].join(' ')}
                    >
                      <RadioGroupItem id={`ds-topic-${t.id}`} value={t.id} />
                      <span className="text-sm text-foreground">{t.label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </fieldset>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="min-w-[220px]"
                >
                  {submitting ? (
                    'Đang phân tích...'
                  ) : (
                    <>
                      So sánh 2 lựa chọn
                      <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        {result && (
          <section aria-labelledby="result-heading" className="mt-10">
            <h2
              id="result-heading"
              className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold sm:text-xl"
            >
              <Scale className="h-5 w-5 text-gold" aria-hidden="true" />
              Bảng so sánh
            </h2>
            <Card className="border-border bg-card/40">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                        <th className="px-5 py-3 text-left font-medium">
                          Tiêu chí
                        </th>
                        <th className="px-5 py-3 text-left font-medium">A</th>
                        <th className="px-5 py-3 text-left font-medium">B</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows.map((r) => (
                        <tr
                          key={r.criterion}
                          className="border-b border-border last:border-0"
                        >
                          <td className="px-5 py-3 text-foreground/85">
                            {r.criterion}
                          </td>
                          <td className="px-5 py-3">
                            <span
                              className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium ${TAG_STYLE[r.a]}`}
                            >
                              {r.a}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <span
                              className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium ${TAG_STYLE[r.b]}`}
                            >
                              {r.b}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <p className="mt-5 text-sm leading-relaxed text-foreground/80">
              {result.summary}
            </p>

            <div className="mt-6">
              <Button asChild size="lg" variant="outline"><Link href="/journal/new">
                
                  Lập decision journal
                  <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                
              </Link></Button>
            </div>
          </section>
        )}
      </section>

      <SiteFooter />
      <StickyMobileCta trackId="decision-simulator" />
    </div>
  );
}

function ChoiceFields({
  prefix,
  heading,
  title,
  onTitle,
  desc,
  onDesc,
}: {
  prefix: string;
  heading: string;
  title: string;
  onTitle: (v: string) => void;
  desc: string;
  onDesc: (v: string) => void;
}) {
  const titleLen = title.trim().length;
  const descLen = desc.length;
  return (
    <fieldset className="space-y-3">
      <legend className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
        {heading}
      </legend>
      <div>
        <Label htmlFor={`ds-${prefix}-title`} className="text-sm font-medium">
          Tiêu đề <span className="text-red-400/80">*</span>
        </Label>
        <Input
          id={`ds-${prefix}-title`}
          value={title}
          onChange={(e) => onTitle(e.target.value)}
          minLength={5}
          maxLength={100}
          required
          placeholder='Ví dụ: "Ở lại công ty hiện tại"'
          className="mt-2"
        />
        <div className="mt-1 flex justify-end text-xs text-muted-foreground">
          {titleLen}/100 (tối thiểu 5)
        </div>
      </div>
      <div>
        <Label htmlFor={`ds-${prefix}-desc`} className="text-sm font-medium">
          Mô tả ngắn
        </Label>
        <Textarea
          id={`ds-${prefix}-desc`}
          value={desc}
          onChange={(e) => onDesc(e.target.value)}
          maxLength={500}
          rows={3}
          className="mt-2"
          placeholder="Bối cảnh, điều kiện đi kèm (tuỳ chọn)."
        />
        <div className="mt-1 flex justify-end text-xs text-muted-foreground">
          {descLen}/500
        </div>
      </div>
    </fieldset>
  );
}
