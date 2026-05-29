import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Briefcase,
  Compass,
  Crosshair,
  Heart,
  Lightbulb,
  Shield,
  Wallet,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';

export const metadata: Metadata = {
  title: 'Decision Brief — Quyết định bớt mơ hồ',
  description:
    'Decision Brief tách vấn đề thật khỏi cảm xúc, đưa 2–4 lựa chọn có rủi ro kèm, gợi ý bước nhỏ nhất bạn có thể làm trong 7 ngày. Bạn vẫn là người quyết định.',
  alternates: { canonical: 'https://hieu.asia/decisions' },
  openGraph: {
    title: 'Decision Brief',
    description:
      'Quyết định bớt mơ hồ — không phải tiên đoán số phận, mà giúp bạn reframe vấn đề.',
    url: 'https://hieu.asia/decisions',
    type: 'website' as const,
  },
};

type TopicCard = {
  id: 'career' | 'relationship' | 'finance';
  title: string;
  blurb: string;
  Icon: typeof Briefcase;
};

const TOPIC_CARDS: readonly TopicCard[] = [
  {
    id: 'career',
    title: 'Sự nghiệp',
    blurb: 'Nghỉ việc, chuyển vai, khởi nghiệp',
    Icon: Briefcase,
  },
  {
    id: 'relationship',
    title: 'Tình cảm',
    blurb: 'Quan hệ, hôn nhân, gia đình',
    Icon: Heart,
  },
  {
    id: 'finance',
    title: 'Tài chính',
    blurb: 'Đầu tư, mua nhà, tiết kiệm',
    Icon: Wallet,
  },
];

const VALUE_PROPS = [
  {
    Icon: Crosshair,
    label: 'Tách vấn đề thật khỏi cảm xúc',
  },
  {
    Icon: Lightbulb,
    label: 'Đưa ra 2–4 lựa chọn cụ thể có rủi ro kèm',
  },
  {
    Icon: Compass,
    label: 'Gợi ý bước nhỏ nhất bạn có thể làm trong 7 ngày',
  },
  {
    Icon: Shield,
    label: 'Không phán "đúng/sai" — bạn vẫn là người quyết định',
  },
] as const;

const HOW_STEPS = [
  {
    n: 1,
    title: 'Bạn mô tả tình huống',
    body: '3–5 câu về điều bạn đang phân vân, càng cụ thể càng tốt.',
  },
  {
    n: 2,
    title: 'Hệ thống kết hợp lá số + bối cảnh',
    body: 'Gợi ý 2–4 lựa chọn cùng rủi ro của mỗi hướng.',
  },
  {
    n: 3,
    title: 'Bạn chọn bước nhỏ nhất',
    body: 'Quay lại review sau 7 ngày để xem điều gì đã rõ hơn.',
  },
] as const;

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Trang chủ',
      item: 'https://hieu.asia',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Decision Brief',
      item: 'https://hieu.asia/decisions',
    },
  ],
};

export default function DecisionsHubPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />

      <main className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <header className="mb-14 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-gold/80">
            Bản tóm tắt quyết định
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold leading-tight sm:text-5xl">
            Quyết định{' '}
            <span className="bg-gold-gradient bg-clip-text text-transparent">
              bớt mơ hồ
            </span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Decision Brief không tiên đoán số phận. Nó giúp bạn{' '}
            <em>reframe</em> tình huống — tách vấn đề thật khỏi cảm xúc, nhìn
            các lựa chọn cạnh nhau, và chọn bước nhỏ nhất bạn có thể làm trong
            tuần này.
          </p>
        </header>

        <section aria-labelledby="value-heading" className="mb-16">
          <h2
            id="value-heading"
            className="font-heading text-2xl font-semibold sm:text-3xl"
          >
            Decision Brief làm gì cho bạn
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {VALUE_PROPS.map(({ Icon, label }) => (
              <li
                key={label}
                className="flex items-start gap-4 rounded-lg border border-border bg-card/40 p-5"
              >
                <Icon
                  className="mt-0.5 h-5 w-5 shrink-0 text-gold/80"
                  aria-hidden="true"
                />
                <span className="text-sm leading-relaxed text-foreground/80">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="topics-heading" className="mb-16">
          <h2
            id="topics-heading"
            className="font-heading text-2xl font-semibold sm:text-3xl"
          >
            3 chủ đề bắt đầu nhanh
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Chọn nơi bạn đang phân vân nhất. Bạn có thể đổi sau.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {TOPIC_CARDS.map(({ id, title, blurb, Icon }) => (
              <Link
                key={id}
                href={`/decisions/new?topic=${id}`}
                className="group"
              >
                <Card className="h-full border-gold/15 bg-card/60 backdrop-blur-sm transition hover:border-gold/40">
                  <CardHeader>
                    <Icon
                      className="mb-2 h-6 w-6 text-gold/80"
                      aria-hidden="true"
                    />
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      {blurb}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="inline-flex items-center text-sm text-gold/90 transition-transform group-hover:translate-x-0.5">
                      Bắt đầu
                      <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="how-heading" className="mb-16">
          <h2
            id="how-heading"
            className="font-heading text-2xl font-semibold sm:text-3xl"
          >
            Cách Decision Brief hoạt động
          </h2>
          <ol className="mt-8 grid gap-5 sm:grid-cols-3">
            {HOW_STEPS.map((step) => (
              <li
                key={step.n}
                className="rounded-lg border border-border bg-card/40 p-6"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 font-mono text-sm text-gold">
                  {step.n}
                </div>
                <h3 className="mt-4 font-heading text-base font-semibold">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section
          aria-labelledby="cta-heading"
          className="rounded-xl border border-gold/25 bg-gold/[0.04] p-8 sm:p-10"
        >
          <h2
            id="cta-heading"
            className="font-heading text-xl font-semibold sm:text-2xl"
          >
            Chưa có lá số?
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Decision Brief gợi ý chính xác hơn khi đã có lá số của bạn — hệ
            thống sẽ kết hợp bối cảnh tình huống với tín hiệu từ lá số. Lập lá
            số trước (3–5 phút), rồi quay lại đây.
          </p>
          <div className="mt-6">
            <Link
              href="/onboarding/topic"
              className="inline-flex items-center gap-2 rounded-md border border-gold/50 bg-card/60 px-5 py-2.5 text-sm font-medium text-gold transition hover:bg-gold/10"
            >
              Lập lá số trước
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
