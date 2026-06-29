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
import { RelatedTools } from '@/components/tools/RelatedTools';
import { DownloadToolPdfButton } from '@/components/tools/DownloadToolPdfButton';

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

// Khung tiêu chí để NGƯỜI DÙNG tự cân nhắc — không phải máy chấm điểm.
// Mỗi tiêu chí kèm 1 câu hỏi dẫn dắt áp cho cả hai lựa chọn.
const CRITERIA: readonly { name: string; question: string }[] = [
  {
    name: 'Hợp xu hướng hiện tại',
    question: 'Lựa chọn nào hợp hơn với hướng bạn đang đi trong 1–2 năm tới?',
  },
  {
    name: 'Rủi ro tài chính',
    question: 'Nếu kịch bản xấu nhất xảy ra, lựa chọn nào bạn còn chịu được về tiền bạc?',
  },
  {
    name: 'Cơ hội học nhanh',
    question: 'Lựa chọn nào buộc bạn học kỹ năng mới hoặc trưởng thành nhanh hơn?',
  },
  {
    name: 'Áp lực tinh thần',
    question: 'Lựa chọn nào khiến bạn căng thẳng kéo dài hơn — và bạn chịu được bao lâu?',
  },
  {
    name: 'Tác động dài hạn',
    question: 'Sau 3–5 năm nhìn lại, lựa chọn nào để lại nền tảng tốt hơn?',
  },
  {
    name: 'Điều kiện nên chọn',
    question: 'Mỗi lựa chọn chỉ thực sự đúng khi điều kiện nào là thật?',
  },
];

function isTopic(v: string): v is Topic {
  return v === 'career' || v === 'finance' || v === 'relationship' || v === 'general';
}

export default function DecisionSimulatorPage() {
  const [titleA, setTitleA] = useState('');
  const [descA, setDescA] = useState('');
  const [titleB, setTitleB] = useState('');
  const [descB, setDescB] = useState('');
  const [topic, setTopic] = useState<Topic>('career');
  const [showFramework, setShowFramework] = useState(false);

  const canSubmit = useMemo(() => {
    const a = titleA.trim();
    const b = titleB.trim();
    return (
      a.length >= 5 &&
      a.length <= 100 &&
      b.length >= 5 &&
      b.length <= 100 &&
      descA.length <= 500 &&
      descB.length <= 500
    );
  }, [titleA, titleB, descA, descB]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    // Không có "động cơ chấm điểm" — đây là khung để người dùng tự cân nhắc.
    // Phân tích sâu theo lá số nằm ở Decision Brief (/decisions/new, AI thật).
    setShowFramework(true);
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
            Đây là khung giúp bạn tự cân nhắc — không phải máy chấm điểm hộ. Mọi
            lựa chọn cuối cùng vẫn là của bạn.
          </p>
        </div>

        <header className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-gold-700">
            Mô phỏng quyết định
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight sm:text-4xl">
            <span className="bg-gold-gradient bg-clip-text text-transparent">
              So sánh 2 lựa chọn
            </span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Không phải để biết đúng/sai, mà để hiểu rõ trade-off của từng hướng đi.
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
                  Mở khung cân nhắc
                  <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        {showFramework && (
          <section aria-labelledby="framework-heading" className="mt-10">
            <h2
              id="framework-heading"
              className="mb-2 flex items-center gap-2 font-heading text-lg font-semibold sm:text-xl"
            >
              <Scale className="h-5 w-5 text-gold" aria-hidden="true" />
              Khung cân nhắc
            </h2>
            <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
              Với mỗi tiêu chí, tự hỏi câu bên dưới cho{' '}
              <strong className="text-foreground">cả hai lựa chọn</strong> rồi tự
              chấm — chúng tôi không quyết thay bạn.
            </p>
            <Card className="border-border bg-card/40">
              <CardContent className="p-0">
                <ul className="divide-y divide-border">
                  {CRITERIA.map((c) => (
                    <li key={c.name} className="px-5 py-4">
                      <p className="font-heading text-sm font-semibold text-foreground">
                        {c.name}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {c.question}
                      </p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        <div className="rounded-lg border border-border bg-card/40 px-3 py-2 text-xs text-foreground/80">
                          <span className="font-mono uppercase tracking-wider text-gold-700">
                            A
                          </span>{' '}
                          — {titleA.trim()}
                        </div>
                        <div className="rounded-lg border border-border bg-card/40 px-3 py-2 text-xs text-foreground/80">
                          <span className="font-mono uppercase tracking-wider text-gold-700">
                            B
                          </span>{' '}
                          — {titleB.trim()}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="mt-6 border-gold/25 bg-gold/[0.05]">
              <CardHeader>
                <CardTitle className="font-heading text-base sm:text-lg">
                  Muốn phân tích sâu theo lá số của bạn?
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Decision Brief đọc lá số Tử Vi + tính cách của bạn rồi phân tích
                  từng lựa chọn bằng AI — thay vì khung chung chung.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg">
                    <Link href="/decisions/new">
                      Lập Decision Brief (AI thật)
                      <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/journal/new">Lập decision journal</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 flex justify-end">
              <DownloadToolPdfButton
                source="pdf-decision-simulator"
                payload={() => {
                  if (!showFramework) return null;
                  const a = titleA.trim();
                  const b = titleB.trim();
                  if (!a || !b) return null;
                  const topicLabel =
                    TOPIC_OPTIONS.find((t) => t.id === topic)?.label ?? 'Khác';
                  return {
                    title: 'Mô Phỏng Quyết Định — hieu.asia',
                    subtitle: `Khung cân nhắc 2 lựa chọn · Chủ đề: ${topicLabel}`,
                    hero: {
                      big: `${a}  ⇄  ${b}`,
                      small:
                        'Khung giúp bạn tự cân nhắc trade-off của từng hướng — không phải máy chấm điểm hộ. Quyết định cuối cùng vẫn là của bạn.',
                    },
                    sections: [
                      {
                        heading: 'Hai lựa chọn của bạn',
                        rows: [
                          { label: 'Lựa chọn A', value: a },
                          ...(descA.trim()
                            ? [{ label: 'Bối cảnh A', value: descA.trim() }]
                            : []),
                          { label: 'Lựa chọn B', value: b },
                          ...(descB.trim()
                            ? [{ label: 'Bối cảnh B', value: descB.trim() }]
                            : []),
                          { label: 'Chủ đề', value: topicLabel },
                        ],
                      },
                      ...CRITERIA.map((c) => ({
                        heading: c.name,
                        text: `${c.question}\n\nA — ${a}\nB — ${b}`,
                      })),
                      {
                        heading: 'Bước tiếp theo',
                        text:
                          'Với mỗi tiêu chí ở trên, tự hỏi câu dẫn dắt cho cả hai lựa chọn rồi tự chấm — chúng tôi không quyết thay bạn.\n\nMuốn phân tích sâu theo lá số Tử Vi + tính cách của bạn bằng AI thật? Lập Decision Brief tại hieu.asia/decisions/new.',
                      },
                    ],
                  };
                }}
              />
            </div>
          </section>
        )}
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-12">
        <RelatedTools current="/decision-simulator" />
      </div>

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
      <legend className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold-700">
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
