import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Target,
  XCircle,
  Database,
  FileOutput,
  Shield,
  Eye,
  AlertTriangle,
  FlaskConical,
  Lock,
  Cpu,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';

export const metadata: Metadata = {
  title: 'Model Card — AI Mentor',
  description:
    'Model card — AI Mentor + Composer của hieu.asia: mục đích, input/output, guardrails, human review, known limitations, evaluation, data handling.',
  alternates: { canonical: 'https://hieu.asia/methodology/model-card' },
  openGraph: {
    title: 'Model Card — AI Mentor',
    description:
      'Mục đích, guardrails, evaluation và data handling cho AI Mentor + Composer.',
    url: 'https://hieu.asia/methodology/model-card',
    type: 'article',
    images: OG_DEFAULT_IMAGES,
  },
};

const PURPOSES = [
  'Diễn giải lá số (Tử Vi/Bát Tự/Thần Số Học/MBTI) thành góc nhìn cá nhân hoá.',
  'Hỗ trợ tự phản tư + decision brief + mentor chat.',
  'Soạn báo cáo và Cẩm Nang PDF.',
];

const NOT_FOR = [
  'Chẩn đoán bệnh tật hay tư vấn y tế.',
  'Khuyến nghị mua/bán đầu tư cụ thể.',
  'Tư vấn pháp lý/tranh chấp.',
  'Quyết định hôn nhân/ly hôn/cưới hỏi thay người dùng.',
  'Phân tích về người thứ ba khi không có sự đồng ý.',
];

const INPUTS = [
  'Chart JSON (kết quả của engine deterministic).',
  'User context (chủ đề, tình huống, mục tiêu).',
  'Prompt version (hard-coded versioned).',
  'Mentor memory (nếu user đã đồng ý lưu).',
];

const OUTPUTS = [
  'Markdown report cấu trúc 9 mục H2.',
  'Mentor chat reply (≤ 600 chars).',
  'Decision Brief JSON (5 trường: realProblem, chartSignal, options, smallestNextStep, caveats).',
];

const GUARDRAILS = [
  'Chart faithfulness validator (block sao bịa).',
  'Safety classifier (6 categories: self_harm, mortality, medical, financial_specific, relationship_decisive, legal_specific).',
  'Generic-answer detector (≥2 palace refs + 1 user context + 1 action + 1 caveat).',
  'Refusal policy (mortality/medical/legal/financial_specific).',
  'Rate limit per endpoint.',
];

const HUMAN_REVIEW = [
  'Prompt review trước mỗi production push.',
  'Sample audit ngẫu nhiên mỗi tháng (~30 reports).',
  'User-reported bug review trong 3 ngày làm việc.',
  'Algorithm changelog cập nhật mỗi engine release.',
];

const LIMITATIONS = [
  'Giờ sinh không chính xác làm giảm confidence (xem /methodology cho confidence score).',
  'Dị biệt giữa trường phái Tử Vi (Bắc/Trung Châu/Tử Vân/Liễu Vô) — engine dùng Bắc phái.',
  'AI có thể diễn giải thiếu sắc thái Tử Vi sâu sắc — vẫn cần chuyên gia cho deep reading.',
  'Xem Tướng beta — chỉ là lớp tham chiếu phụ.',
  'Bát Tự beta — chưa quyết định kết luận chính.',
];

const EVALUATION = [
  'Golden chart dataset (đang mở rộng từ 32 → 100 lá số).',
  'Safety adversarial suite (6×100 = 600 prompts; 2 bộ cốt lõi đạt 100/100).',
  'User "đúng với tôi" feedback (per-section).',
  'Internal metrics: hallucinated star rate, generic rate, unsafe rate, refund reason breakdown.',
];

const DATA_HANDLING = [
  'Minimization: chỉ thu input bắt buộc.',
  'Retention: ảnh palm 7 ngày, mentor chat 90 ngày, audit log 12 tháng.',
  'Vendor processors: xem /privacy.',
  'User export/delete bất cứ lúc nào tại /account.',
];

const MODEL_ROUTING = [
  'Định hướng (theo thiết kế): Anthropic Claude Opus — thực tế có thể chạy model dự phòng khi cổng AI gián đoạn.',
  'Fallback: OpenAI GPT (khi Anthropic 429 hoặc unavailable).',
  'Vision (palm): Google Gemini.',
  'Tất cả model có thể thay đổi — methodology không bind model cụ thể mà bind capability + guardrail.',
];

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Trang chủ',
      item: 'https://hieu.asia/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Phương pháp luận',
      item: 'https://hieu.asia/methodology',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Model card',
      item: 'https://hieu.asia/methodology/model-card',
    },
  ],
};

type SectionProps = {
  n: number;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  title: string;
  description?: string;
  items: readonly string[];
  tone?: 'default' | 'rose';
};

function ListSection({
  n,
  icon: Icon,
  title,
  description,
  items,
  tone = 'default',
}: SectionProps) {
  const iconColor = tone === 'rose' ? 'text-rose-400' : 'text-gold/80';
  const bulletColor = tone === 'rose' ? 'text-rose-400/80' : 'text-gold/85';
  return (
    <section className="relative mx-auto max-w-4xl px-6 py-8">
      {/* BUG-031 (Wave 54): a11y/SEO h2 — CardTitle inside renders <h3>. */}
      <h2 className="sr-only">
        {n}. {title}
      </h2>
      <Card className="border-border bg-card/40">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 font-mono text-sm font-bold text-gold">
              {n}
            </div>
            <div className="flex items-center gap-2">
              <Icon className={`h-5 w-5 ${iconColor}`} aria-hidden />
              <CardTitle className="font-heading text-lg text-foreground sm:text-xl">
                {title}
              </CardTitle>
            </div>
          </div>
          {description ? (
            <CardDescription className="mt-2 text-sm text-muted-foreground">
              {description}
            </CardDescription>
          ) : null}
        </CardHeader>
        <CardContent>
          <ul className="space-y-2.5 text-sm leading-relaxed text-foreground/80">
            {items.map((item) => (
              <li key={item} className="flex gap-2">
                {tone === 'rose' ? (
                  <XCircle
                    className={`mt-0.5 h-4 w-4 shrink-0 ${bulletColor}`}
                    aria-hidden
                  />
                ) : (
                  <ChevronRight
                    className={`mt-0.5 h-4 w-4 shrink-0 ${bulletColor}`}
                    aria-hidden
                  />
                )}
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}

export default function ModelCardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />
      <main id="main-content" className="relative pt-16 methodology-a11y">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-ink-radial opacity-80"
          />
          <div className="relative mx-auto max-w-4xl px-6 pb-8 pt-6 sm:pt-8">
            <nav
              aria-label="Breadcrumb"
              className="mb-4 text-xs text-muted-foreground"
            >
              <Link href="/" className="hover:text-gold">
                Trang chủ
              </Link>
              <span className="mx-1.5">/</span>
              <Link href="/methodology" className="hover:text-gold">
                Phương pháp luận
              </Link>
              <span className="mx-1.5">/</span>
              <span className="text-muted-foreground">Model card</span>
            </nav>

            <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold-700">
              Model Card
            </p>
            <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
              Model Card — AI Mentor + Composer
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Tài liệu mô tả mục đích, ranh giới, guardrails, đánh giá và xử lý
              dữ liệu của hệ AI Mentor + Composer mà hieu.asia đang vận hành.
            </p>
          </div>
        </section>

        <ListSection
          n={1}
          icon={Target}
          title="Mục đích"
          items={PURPOSES}
        />
        <ListSection
          n={2}
          icon={XCircle}
          title="Không dùng cho"
          items={NOT_FOR}
          tone="rose"
        />
        <ListSection
          n={3}
          icon={Database}
          title="Input"
          items={INPUTS}
        />
        <ListSection
          n={4}
          icon={FileOutput}
          title="Output"
          items={OUTPUTS}
        />
        <ListSection
          n={5}
          icon={Shield}
          title="Guardrails"
          items={GUARDRAILS}
        />
        <ListSection
          n={6}
          icon={Eye}
          title="Human review"
          items={HUMAN_REVIEW}
        />
        <ListSection
          n={7}
          icon={AlertTriangle}
          title="Known limitations"
          items={LIMITATIONS}
        />
        <ListSection
          n={8}
          icon={FlaskConical}
          title="Evaluation"
          items={EVALUATION}
        />
        <ListSection
          n={9}
          icon={Lock}
          title="Data handling"
          items={DATA_HANDLING}
        />
        <ListSection
          n={10}
          icon={Cpu}
          title="Model routing"
          items={MODEL_ROUTING}
        />

        {/* Footer note */}
        <section className="relative mx-auto max-w-4xl px-6 pb-20 pt-8">
          <div className="rounded-xl border border-gold/20 bg-gold/5 p-5 text-sm leading-relaxed text-foreground/80">
            <p className="flex items-start gap-2">
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                aria-hidden
              />
              <span>
                Model card này được review cùng với prompt version. Đọc thêm{' '}
                <Link
                  href="/methodology"
                  className="text-gold-700 underline underline-offset-4 hover:opacity-80"
                >
                  /methodology
                </Link>{' '}
                cho tổng quan và{' '}
                <Link
                  href="/methodology/ai-safety"
                  className="text-gold-700 underline underline-offset-4 hover:opacity-80"
                >
                  /methodology/ai-safety
                </Link>{' '}
                cho safety policy chi tiết.
              </span>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
