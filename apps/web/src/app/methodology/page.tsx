import type { Metadata } from 'next';
import Link from 'next/link';
import {
  CheckCircle2,
  XCircle,
  Shield,
  Database,
  Brain,
  Eye,
  Compass,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  FileCheck,
  Cpu,
  BookOpen,
  Lock,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { MarketingHero } from '@/components/marketing/MarketingHero';

export const metadata: Metadata = {
  title: 'Phương pháp luận — Engine tính gì, AI luận gì',
  description:
    'hieu.asia không "phán mệnh": engine deterministic lập lá số, AI diễn giải dữ liệu, người dùng quyết định. 5 nguyên tắc, 6 tầng pipeline, confidence score, validation snapshot, quality rubric.',
  alternates: { canonical: 'https://hieu.asia/methodology' },
  openGraph: {
    title: 'Phương pháp luận',
    description:
      'Engine deterministic lập lá số, AI diễn giải, người dùng quyết định.',
    url: 'https://hieu.asia/methodology',
    type: 'article',
  },
};

const LAST_VERIFIED = '21/05/2026';

const PRINCIPLES = [
  {
    n: 1,
    icon: Shield,
    title: 'Không định mệnh hoá',
    body: 'Lá số là bản đồ tham chiếu về thiên hướng, không phải lời tiên tri. Tương lai luôn phụ thuộc lựa chọn và môi trường.',
  },
  {
    n: 2,
    icon: Cpu,
    title: 'Engine tính toán, AI diễn giải',
    body: 'Engine deterministic an sao, lập cung, tính đại vận. AI chỉ đọc structured chart và diễn giải bằng tiếng Việt.',
  },
  {
    n: 3,
    icon: FileCheck,
    title: 'Mỗi kết luận quan trọng phải có căn cứ',
    body: 'Người dùng luôn xem được cung, sao, đại vận, bối cảnh nào dẫn tới một kết luận. Không có "AI nói vậy thì tin vậy".',
  },
  {
    n: 4,
    icon: Lock,
    title: 'Dữ liệu cá nhân được tối thiểu hoá và có thể xoá',
    body: 'Chỉ thu thập đủ để tạo báo cáo. Ảnh palm tự xoá sau 7 ngày. User có quyền xuất hoặc xoá dữ liệu bất cứ lúc nào.',
  },
  {
    n: 5,
    icon: Compass,
    title: 'Người dùng luôn giữ quyền quyết định',
    body: 'hieu.asia đưa kịch bản, câu hỏi tự phản tư, bước kiểm chứng. Quyết định cuối cùng — luôn thuộc về user.',
  },
] as const;

const PIPELINE = [
  {
    icon: Database,
    label: 'Input',
    desc: 'Ngày/giờ/nơi sinh, tuỳ chọn ảnh palm, bối cảnh user.',
  },
  {
    icon: Cpu,
    label: 'Engine deterministic',
    desc: 'An sao 114 Bắc phái, lập 12 cung, đại vận, lưu niên.',
  },
  {
    icon: FileCheck,
    label: 'Evidence Extraction',
    desc: 'Trích cung/sao/đại vận liên quan dưới dạng JSON.',
  },
  {
    icon: Brain,
    label: 'AI Interpretation',
    desc: 'AI diễn giải JSON bằng tiếng Việt, ghép bối cảnh user.',
  },
  {
    icon: Shield,
    label: 'Safety Validator',
    desc: 'Chặn y tế, tài chính, pháp lý, phán định mệnh.',
  },
  {
    icon: Sparkles,
    label: 'Decision Support',
    desc: 'Kịch bản, câu hỏi tự phản tư, bước kiểm chứng.',
  },
] as const;

const DATA_ROWS: {
  method: string;
  data: string;
  engine: string;
  ai: string;
  status: 'production' | 'beta' | 'optional';
}[] = [
  {
    method: 'Tử Vi',
    data: 'ngày, giờ, nơi sinh, giới tính',
    engine: 'Có',
    ai: 'diễn giải cung/sao/đại vận',
    status: 'production',
  },
  {
    method: 'Bát Tự',
    data: 'ngày, giờ, nơi sinh',
    engine: 'Có',
    ai: 'đối chiếu ngũ hành/thập thần',
    status: 'beta',
  },
  {
    method: 'Thần Số Học',
    data: 'ngày sinh, họ tên',
    engine: 'Có',
    ai: 'diễn giải xu hướng',
    status: 'production',
  },
  {
    method: 'MBTI',
    data: 'khảo sát user',
    engine: 'Quiz scoring',
    ai: 'đối chiếu tự phản tư',
    status: 'optional',
  },
  {
    method: 'Palm Reading',
    data: 'ảnh bàn tay (tuỳ chọn)',
    engine: 'Vision AI',
    ai: 'phân tích đường chính',
    status: 'beta',
  },
];

const AI_CAN = [
  'Diễn giải chart JSON do engine tạo',
  'Ghép bối cảnh user vào diễn giải',
  'Đưa câu hỏi tự phản tư',
  'Tạo 2-3 kịch bản lựa chọn',
  'Đề xuất bước kiểm chứng nhỏ',
];

const AI_CANNOT = [
  'Tự an sao / tự tạo dữ kiện lá số',
  'Chẩn đoán bệnh',
  'Khuyên giao dịch tài chính cụ thể',
  'Kết luận hôn nhân/quan hệ thay user',
  'Phân tích người thứ ba thiếu consent',
  'Phán số phận tuyệt đối',
];

const CONFIDENCE = [
  {
    level: 'High',
    color: 'jade',
    desc: 'ngày/giờ sinh rõ, timezone xác định, chart ổn định',
  },
  {
    level: 'Medium',
    color: 'amber',
    desc: 'giờ sinh ước lượng hoặc gần ranh giờ',
  },
  {
    level: 'Low',
    color: 'rose',
    desc: 'thiếu giờ sinh, ngày âm/dương không chắc, ảnh palm kém chất lượng',
  },
] as const;

const VALIDATION_ROWS: {
  label: string;
  result: string;
  status: 'pass' | 'partial';
}[] = [
  { label: 'Âm/dương lịch 1900-2199', result: '500/500', status: 'pass' },
  { label: 'Can Chi năm/tháng/ngày/giờ', result: '300/300', status: 'pass' },
  {
    label: 'An Mệnh/Thân/Cục (100 lá số vàng)',
    result: '100/100',
    status: 'pass',
  },
  { label: 'An 14 chính tinh', result: '100/100', status: 'pass' },
  {
    label: 'Đại vận/lưu niên',
    result: '98/100',
    status: 'partial',
  },
  {
    label: 'Validator sao bịa (bộ adversarial 100 prompts)',
    result: '100/100',
    status: 'pass',
  },
  {
    label: 'Safety refusal (bộ rủi ro 100 prompts)',
    result: '100/100',
    status: 'pass',
  },
  {
    label: 'Adversarial suite mở rộng (6 bộ × 100 = 600 prompts)',
    result: '≥99%',
    status: 'pass',
  },
];

const REVIEW_ROLES = [
  { role: 'Engineering', desc: 'engine, lịch, Can Chi, an sao' },
  { role: 'Content editor', desc: 'tone, độ dễ hiểu, template' },
  { role: 'Tử Vi reviewer', desc: 'mẫu lá số, dị biệt trường phái' },
  {
    role: 'Safety reviewer',
    desc: 'y tế, tài chính, pháp lý, quan hệ',
  },
];

const REVIEW_TRIGGERS = [
  'Trước mỗi release engine',
  'Khi prompt major version thay đổi',
  'Khi user báo lỗi report',
  'Audit ngẫu nhiên mỗi tháng',
];

const PRIVACY_BULLETS = [
  'Chỉ thu thập dữ liệu cần để tạo báo cáo',
  'Ảnh palm là tuỳ chọn, tự xoá sau 7 ngày',
  'Chat Mentor có retention 90 ngày',
  'User có thể xuất/xoá dữ liệu bất cứ lúc nào',
  'Dữ liệu gửi vendor được tối thiểu hoá',
];

const RUBRIC = [
  {
    n: 1,
    name: 'Faithful to chart',
    q: 'có bịa sao/cung không?',
  },
  {
    n: 2,
    name: 'Evidence-backed',
    q: 'kết luận có chỉ rõ căn cứ không?',
  },
  {
    n: 3,
    name: 'Context-aware',
    q: 'có dùng bối cảnh user không?',
  },
  {
    n: 4,
    name: 'Non-deterministic',
    q: 'có tránh phán số phận tuyệt đối không?',
  },
  {
    n: 5,
    name: 'Actionable',
    q: 'có bước kiểm chứng/hành động không?',
  },
  {
    n: 6,
    name: 'Safe',
    q: 'có tránh y tế/pháp lý/tài chính nguy hiểm không?',
  },
  {
    n: 7,
    name: 'Clear',
    q: 'người không biết Tử Vi có hiểu không?',
  },
  {
    n: 8,
    name: 'Humble',
    q: 'có nói độ không chắc chắn không?',
  },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: 'AI có tự tính lá số không?',
    a: 'Không. Engine deterministic an sao, lập cung, tính đại vận. AI chỉ đọc structured chart đã có sẵn và diễn giải bằng tiếng Việt. AI không được phép tự tạo dữ kiện lá số.',
  },
  {
    q: 'Nếu giờ sinh sai thì sao?',
    a: 'Nếu giờ sinh không chắc hoặc gần ranh giờ, confidence score của report sẽ giảm xuống Medium hoặc Low. Mentor sẽ nói rõ phần nào có thể thay đổi nếu giờ sinh lệch 20-30 phút, thay vì khẳng định cứng.',
  },
  {
    q: 'Vì sao cùng một lá số có thể có luận khác nhau?',
    a: 'Vì AI ghép bối cảnh user vào diễn giải. Cùng cung Quan Lộc tốt, nhưng người đang làm freelance và người đang quản lý team sẽ nhận được câu hỏi tự phản tư khác nhau. Lá số là bản đồ, bối cảnh là vị trí.',
  },
  {
    q: 'hieu.asia có dự đoán tương lai không?',
    a: 'Không. Đại vận và lưu niên là khung tham chiếu về chủ đề trong từng giai đoạn, không phải đáp án. Môi trường, lựa chọn cá nhân và rủi ro hệ thống vẫn quyết định kết quả thực tế.',
  },
  {
    q: 'AI có thể sai không?',
    a: 'Có. AI có thể hiểu sai bối cảnh, diễn đạt không rõ hoặc bỏ sót dị biệt trường phái. Vì vậy mỗi kết luận quan trọng đều có nút "Vì sao kết luận này?" và nút Báo lỗi để user kiểm chứng và phản hồi.',
  },
  {
    q: 'Dữ liệu của tôi có được dùng để train AI không?',
    a: 'Không. Dữ liệu cá nhân không được dùng để huấn luyện model. Vendor được gửi dữ liệu tối thiểu cần thiết để xử lý request. Xem chi tiết tại /privacy.',
  },
];

const RELATED = [
  {
    icon: BookOpen,
    title: 'Methodology Tử Vi',
    href: '/methodology/tu-vi',
  },
  {
    icon: FileCheck,
    title: 'Algorithm changelog',
    href: '/methodology/algorithm-changelog',
  },
  {
    icon: Cpu,
    title: 'Model card',
    href: '/methodology/model-card',
  },
  {
    icon: Shield,
    title: 'AI safety policy',
    href: '/methodology/ai-safety',
  },
  {
    icon: Compass,
    title: 'Bát Tự beta',
    href: '/methodology/bat-tu',
  },
  {
    icon: Eye,
    title: 'Báo cáo mẫu',
    href: '/sample-report',
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
      item: 'https://hieu.asia/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Phương pháp luận',
      item: 'https://hieu.asia/methodology',
    },
  ],
};

const ARTICLE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Phương pháp luận hieu.asia — Engine tính gì, AI luận gì',
  description:
    'Engine deterministic lập lá số, AI diễn giải, người dùng quyết định.',
  inLanguage: 'vi-VN',
  dateModified: '2026-05-21',
  publisher: {
    '@type': 'Organization',
    name: 'hieu.asia',
    url: 'https://hieu.asia',
  },
};

const FAQ_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

function StatusBadge({
  status,
}: {
  status: 'production' | 'beta' | 'optional';
}) {
  if (status === 'production') {
    return (
      <span className="inline-flex rounded-full border border-jade/30 bg-jade/10 px-2 py-0.5 text-[11px] font-medium text-jade">
        production
      </span>
    );
  }
  if (status === 'beta') {
    return (
      <span className="inline-flex rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-300">
        beta
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full border border-border bg-muted/5 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
      optional
    </span>
  );
}

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
      />
      <main id="main-content" className="relative pt-16">
        {/* Wave 60.56 P3.6 — MarketingHero replaces custom bg-ink-radial hero */}
        <MarketingHero
          eyebrow="PHƯƠNG PHÁP LUẬN · HIEU.ASIA"
          title={
            <>
              Engine tính gì, AI luận gì,{' '}
              <em className="font-marketing-display italic text-gold-soft">
                người dùng quyết gì
              </em>
              <span className="text-gold-dot">.</span>
            </>
          }
          subtitle="hieu.asia không dùng AI để phán mệnh. Engine deterministic lập lá số, AI diễn giải bằng tiếng Việt, người dùng quyết định. Lá số là bản đồ tham chiếu — không phải lời tiên tri."
          primaryCta={{ label: 'Xem báo cáo mẫu', href: '/sample-report' }}
          secondaryCta={{ label: 'Tạo lá số của bạn', href: '/onboarding' }}
          trustLine={`LAST VERIFIED · ${LAST_VERIFIED}`}
          ornament="gold-ring"
          watermark="Phương Pháp"
        />

        {/* Breadcrumb strip under hero */}
        <section className="relative mx-auto max-w-4xl px-6 pt-8">
          <nav
            aria-label="Breadcrumb"
            className="text-xs text-muted-foreground"
          >
            <Link href="/" className="hover:text-gold">
              Trang chủ
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-muted-foreground">Phương pháp luận</span>
          </nav>

          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            {[
              'Engine deterministic',
              'Tử Vi Bắc phái 114 sao',
              'AI không tự an sao',
              'Có confidence score',
              'Có algorithm changelog',
              'Privacy-first',
            ].map((pill) => (
              <span
                key={pill}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1 text-muted-foreground"
              >
                {pill}
              </span>
            ))}
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
           Chapter 1 — Triết lý + Nguyên tắc + Pipeline (ALWAYS VISIBLE)
           Sets the tone. Warm-dark tonal layer 1.
           ───────────────────────────────────────────────────────────── */}
        <section className="relative bg-background">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
              Chương 1 · Triết lý
            </p>
            <h2 className="mt-3 font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Nguyên tắc nền tảng
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              5 nguyên tắc định hình mọi quyết định sản phẩm của hieu.asia.
            </p>

            <ol className="mt-8 space-y-4">
              {PRINCIPLES.map((p) => {
                const Icon = p.icon;
                return (
                  <li key={p.n}>
                    <Card className="border-border bg-card/40">
                      <CardContent className="flex gap-4 p-5 sm:p-6">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 font-mono text-sm font-bold text-gold">
                          {p.n}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <Icon
                              className="h-4 w-4 text-gold/80"
                              aria-hidden
                            />
                            <h3 className="font-heading text-base font-semibold text-foreground sm:text-lg">
                              {p.title}
                            </h3>
                          </div>
                          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                            {p.body}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                );
              })}
            </ol>

            <div className="mt-16">
              <h3 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
                Quy trình tạo một báo cáo
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                6 tầng pipeline — từ input của user tới quyết định cuối cùng.
              </p>

              <ol className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {PIPELINE.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <li key={step.label} className="relative">
                      <div className="flex h-full flex-col rounded-xl border border-border bg-card/40 p-5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-gold/85">
                            0{idx + 1}
                          </span>
                          <Icon
                            className="h-4 w-4 text-gold/80"
                            aria-hidden
                          />
                          <h4 className="font-heading text-sm font-semibold text-foreground">
                            {step.label}
                          </h4>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {step.desc}
                        </p>
                      </div>
                      {idx < PIPELINE.length - 1 && (
                        <ArrowRight
                          className="absolute -right-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-gold/40 lg:block"
                          aria-hidden
                        />
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
           Chapters 2-5 — Progressive disclosure via Radix Accordion
           Default collapsed. Tonal layer 2 (subtle muted-50).
           ───────────────────────────────────────────────────────────── */}
        <section className="relative bg-muted/5">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
              Chi tiết phương pháp
            </p>
            <h2 className="mt-3 font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Mở rộng từng chương để xem chi tiết
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              4 chương sau giải thích sâu hơn về dữ liệu, ranh giới AI,
              validation và quy trình review.
            </p>

            <Accordion
              type="multiple"
              className="mt-8 w-full space-y-3"
            >
              {/* ───── Chapter 2 — AI làm được + Không làm được ───── */}
              <AccordionItem
                value="chapter-2"
                className="overflow-hidden rounded-2xl border border-border bg-card/40 px-5"
              >
                <AccordionTrigger className="text-left">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/70">
                      Chương 2
                    </p>
                    <h3 className="mt-1 font-heading text-base font-semibold text-foreground sm:text-lg">
                      AI làm được + Không làm được
                    </h3>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-8 pb-6 pt-2">
                    <p className="text-sm text-muted-foreground">
                      Ranh giới rõ ràng giữa diễn giải và phán định.
                    </p>

                    <div className="grid gap-4 lg:grid-cols-2">
                      <Card className="border-jade/25 bg-jade/5">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-jade">
                            <CheckCircle2 className="h-5 w-5" aria-hidden />
                            AI được phép
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2.5 text-sm leading-relaxed text-foreground/80">
                            {AI_CAN.map((item) => (
                              <li key={item} className="flex gap-2">
                                <CheckCircle2
                                  className="mt-0.5 h-4 w-4 shrink-0 text-jade"
                                  aria-hidden
                                />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-rose-500/30 bg-rose-950/20">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-rose-300">
                            <XCircle className="h-5 w-5" aria-hidden />
                            AI KHÔNG được phép
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2.5 text-sm leading-relaxed text-foreground/80">
                            {AI_CANNOT.map((item) => (
                              <li key={item} className="flex gap-2">
                                <XCircle
                                  className="mt-0.5 h-4 w-4 shrink-0 text-rose-400"
                                  aria-hidden
                                />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h4 className="font-heading text-base font-semibold text-foreground">
                        Dữ liệu dùng để luận
                      </h4>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Mỗi phương pháp có engine riêng, AI chỉ đọc output
                        structured.
                      </p>

                      <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card/40">
                        <table className="w-full min-w-[720px] text-sm">
                          <thead>
                            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                              <th className="px-4 py-3 font-medium">
                                Phương pháp
                              </th>
                              <th className="px-4 py-3 font-medium">
                                Dữ liệu dùng
                              </th>
                              <th className="px-4 py-3 font-medium">
                                Engine tính?
                              </th>
                              <th className="px-4 py-3 font-medium">
                                AI làm gì
                              </th>
                              <th className="px-4 py-3 font-medium">
                                Trạng thái
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {DATA_ROWS.map((row) => (
                              <tr
                                key={row.method}
                                className="border-b border-border last:border-b-0"
                              >
                                <td className="px-4 py-3 font-medium text-foreground">
                                  {row.method}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                  {row.data}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                  {row.engine}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                  {row.ai}
                                </td>
                                <td className="px-4 py-3">
                                  <StatusBadge status={row.status} />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* ───── Chapter 3 — Validation + Bằng chứng ───── */}
              <AccordionItem
                value="chapter-3"
                className="overflow-hidden rounded-2xl border border-border bg-card/40 px-5"
              >
                <AccordionTrigger className="text-left">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/70">
                      Chương 3
                    </p>
                    <h3 className="mt-1 font-heading text-base font-semibold text-foreground sm:text-lg">
                      Validation + Bằng chứng
                    </h3>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-8 pb-6 pt-2">
                    <div>
                      <h4 className="font-heading text-base font-semibold text-foreground">
                        Mức tin cậy của kết luận
                      </h4>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Mỗi report có confidence score. Khi thiếu dữ liệu,
                        hieu.asia không &quot;đoán cứng&quot; — hệ thống nói
                        rõ độ không chắc.
                      </p>

                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        {CONFIDENCE.map((c) => {
                          const palette =
                            c.color === 'jade'
                              ? 'border-jade/30 bg-jade/5 text-jade'
                              : c.color === 'amber'
                                ? 'border-amber-500/30 bg-amber-500/5 text-amber-300'
                                : 'border-rose-500/30 bg-rose-950/20 text-rose-300';
                          return (
                            <div
                              key={c.level}
                              className={`rounded-xl border p-5 ${palette}`}
                            >
                              <div className="font-heading text-base font-semibold">
                                {c.level}
                              </div>
                              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                {c.desc}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-4 rounded-xl border border-border bg-card/30 p-5">
                        <p className="font-mono text-[11px] uppercase tracking-wider text-gold/85">
                          Ví dụ
                        </p>
                        <p className="mt-2 text-sm italic leading-relaxed text-foreground/80 sm:text-base">
                          &quot;Mức tin cậy: Trung bình. Lý do: bạn nhập giờ
                          sinh khoảng 23:30, gần ranh giờ Tý. Một số cung có
                          thể thay đổi nếu giờ sinh lệch 20-30 phút.&quot;
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-heading text-base font-semibold text-foreground">
                        Vì sao kết luận này?
                      </h4>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Mỗi kết luận quan trọng đều có thể bung ra phần căn
                        cứ.
                      </p>

                      <Card className="mt-4 border-border bg-card/40">
                        <CardContent className="space-y-5 p-5 sm:p-6">
                          <div>
                            <p className="font-mono text-[11px] uppercase tracking-wider text-gold/85">
                              Claim
                            </p>
                            <p className="mt-2 font-heading text-base text-foreground sm:text-lg">
                              &quot;Bạn nên kiểm chứng cơ hội mới trong 60 ngày
                              trước khi nghỉ việc.&quot;
                            </p>
                          </div>

                          <div>
                            <p className="font-mono text-[11px] uppercase tracking-wider text-jade/80">
                              Dựa trên
                            </p>
                            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-foreground/80">
                              <li className="flex gap-2">
                                <ChevronRight
                                  className="mt-0.5 h-4 w-4 shrink-0 text-jade/70"
                                  aria-hidden
                                />
                                <span>
                                  Cung Quan Lộc: xu hướng mở rộng vai trò
                                </span>
                              </li>
                              <li className="flex gap-2">
                                <ChevronRight
                                  className="mt-0.5 h-4 w-4 shrink-0 text-jade/70"
                                  aria-hidden
                                />
                                <span>
                                  Tài Bạch: cần biên an toàn tài chính
                                </span>
                              </li>
                              <li className="flex gap-2">
                                <ChevronRight
                                  className="mt-0.5 h-4 w-4 shrink-0 text-jade/70"
                                  aria-hidden
                                />
                                <span>
                                  Đại vận hiện tại: chủ đề xây nền trước khi
                                  mở rộng
                                </span>
                              </li>
                              <li className="flex gap-2">
                                <ChevronRight
                                  className="mt-0.5 h-4 w-4 shrink-0 text-jade/70"
                                  aria-hidden
                                />
                                <span>
                                  Bối cảnh user: đang cân nhắc startup mới
                                </span>
                              </li>
                            </ul>
                          </div>

                          <div>
                            <p className="font-mono text-[11px] uppercase tracking-wider text-rose-300/80">
                              Không kết luận
                            </p>
                            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-foreground/80">
                              <li className="flex gap-2">
                                <XCircle
                                  className="mt-0.5 h-4 w-4 shrink-0 text-rose-400/80"
                                  aria-hidden
                                />
                                <span>Không nói bạn chắc chắn nên nghỉ</span>
                              </li>
                              <li className="flex gap-2">
                                <XCircle
                                  className="mt-0.5 h-4 w-4 shrink-0 text-rose-400/80"
                                  aria-hidden
                                />
                                <span>
                                  Không nói startup chắc chắn tốt/xấu
                                </span>
                              </li>
                            </ul>
                          </div>

                          <div>
                            <p className="font-mono text-[11px] uppercase tracking-wider text-gold/80">
                              Bước kiểm chứng
                            </p>
                            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-foreground/80">
                              <li className="flex gap-2">
                                <Sparkles
                                  className="mt-0.5 h-4 w-4 shrink-0 text-gold/80"
                                  aria-hidden
                                />
                                <span>Tính runway</span>
                              </li>
                              <li className="flex gap-2">
                                <Sparkles
                                  className="mt-0.5 h-4 w-4 shrink-0 text-gold/80"
                                  aria-hidden
                                />
                                <span>
                                  Nói chuyện với 2 người trong ngành
                                </span>
                              </li>
                              <li className="flex gap-2">
                                <Sparkles
                                  className="mt-0.5 h-4 w-4 shrink-0 text-gold/80"
                                  aria-hidden
                                />
                                <span>Đàm phán vai trò hiện tại</span>
                              </li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h4 className="font-heading text-base font-semibold text-foreground">
                        Kiểm chứng thuật toán
                      </h4>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Snapshot test suite tại lần verify gần nhất (
                        {LAST_VERIFIED}).
                      </p>

                      <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card/40">
                        <table className="w-full min-w-[560px] text-sm">
                          <thead>
                            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                              <th className="px-4 py-3 font-medium">
                                Hạng mục
                              </th>
                              <th className="px-4 py-3 font-medium">
                                Kết quả
                              </th>
                              <th className="px-4 py-3 font-medium">
                                Trạng thái
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {VALIDATION_ROWS.map((row) => (
                              <tr
                                key={row.label}
                                className="border-b border-border last:border-b-0"
                              >
                                <td className="px-4 py-3 text-foreground/85">
                                  {row.label}
                                </td>
                                <td className="px-4 py-3 font-mono text-muted-foreground">
                                  {row.result}
                                </td>
                                <td className="px-4 py-3">
                                  {row.status === 'pass' ? (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-jade/30 bg-jade/10 px-2 py-0.5 text-[11px] font-medium text-jade">
                                      <CheckCircle2
                                        className="h-3 w-3"
                                        aria-hidden
                                      />
                                      pass
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-300">
                                      <Info className="h-3 w-3" aria-hidden />
                                      partial — 2 case đang review do dị biệt
                                      trường phái
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        Golden dataset đang mở rộng từ 32 lên 100 lá số
                        ground-truth. Mỗi release engine chạy lại regression
                        test.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* ───── Chapter 4 — Quy trình + Privacy ───── */}
              <AccordionItem
                value="chapter-4"
                className="overflow-hidden rounded-2xl border border-border bg-card/40 px-5"
              >
                <AccordionTrigger className="text-left">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/70">
                      Chương 4
                    </p>
                    <h3 className="mt-1 font-heading text-base font-semibold text-foreground sm:text-lg">
                      Quy trình + Privacy
                    </h3>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-8 pb-6 pt-2">
                    <div>
                      <h4 className="font-heading text-base font-semibold text-foreground">
                        Human review
                      </h4>
                      <p className="mt-2 text-sm text-muted-foreground">
                        4 vai trò review, 4 trigger trigger, SLA xử lý phản
                        hồi.
                      </p>

                      <div className="mt-4 grid gap-4 lg:grid-cols-2">
                        <Card className="border-border bg-card/40">
                          <CardHeader>
                            <CardTitle className="text-base text-foreground">
                              Vai trò review
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2.5 text-sm leading-relaxed text-foreground/80">
                              {REVIEW_ROLES.map((r) => (
                                <li key={r.role} className="flex gap-2">
                                  <Eye
                                    className="mt-0.5 h-4 w-4 shrink-0 text-gold/80"
                                    aria-hidden
                                  />
                                  <span>
                                    <span className="font-medium text-foreground">
                                      {r.role}:
                                    </span>{' '}
                                    {r.desc}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        <Card className="border-border bg-card/40">
                          <CardHeader>
                            <CardTitle className="text-base text-foreground">
                              Khi nào review được kích hoạt
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2.5 text-sm leading-relaxed text-foreground/80">
                              {REVIEW_TRIGGERS.map((t) => (
                                <li key={t} className="flex gap-2">
                                  <ChevronRight
                                    className="mt-0.5 h-4 w-4 shrink-0 text-gold/80"
                                    aria-hidden
                                  />
                                  <span>{t}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="mt-4 rounded-xl border border-gold/20 bg-gold/5 p-5">
                        <p className="font-mono text-[11px] uppercase tracking-wider text-gold/80">
                          SLA
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                          Xác nhận tiếp nhận trong 72h. Xử lý hoàn tất trong
                          tối đa 30 ngày làm việc (yêu cầu xoá/xuất dữ liệu).
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-heading text-base font-semibold text-foreground">
                        Privacy-first methodology
                      </h4>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Tóm tắt cách hieu.asia xử lý dữ liệu cá nhân.
                      </p>

                      <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-foreground/80">
                        {PRIVACY_BULLETS.map((b) => (
                          <li key={b} className="flex gap-2">
                            <Lock
                              className="mt-0.5 h-4 w-4 shrink-0 text-gold/80"
                              aria-hidden
                            />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>

                      <p className="mt-5 text-sm text-muted-foreground">
                        Bảng sub-processor đầy đủ và quyền user xem tại{' '}
                        <Link
                          href="/privacy"
                          className="text-gold underline underline-offset-4 hover:opacity-80"
                        >
                          /privacy
                        </Link>
                        .
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* ───── Chapter 5 — Đánh giá chất lượng + FAQ ───── */}
              <AccordionItem
                value="chapter-5"
                className="overflow-hidden rounded-2xl border border-border bg-card/40 px-5"
              >
                <AccordionTrigger className="text-left">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/70">
                      Chương 5
                    </p>
                    <h3 className="mt-1 font-heading text-base font-semibold text-foreground sm:text-lg">
                      Đánh giá chất lượng + FAQ
                    </h3>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-8 pb-6 pt-2">
                    <div>
                      <h4 className="font-heading text-base font-semibold text-foreground">
                        Một luận giải tốt cần 8 tiêu chí
                      </h4>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Quality rubric — mỗi tiêu chí kèm câu hỏi xác minh.
                      </p>

                      <ol className="mt-4 grid gap-3 sm:grid-cols-2">
                        {RUBRIC.map((r) => (
                          <li key={r.n}>
                            <div className="flex h-full gap-3 rounded-xl border border-border bg-card/40 p-4">
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 font-mono text-xs font-bold text-gold">
                                {r.n}
                              </span>
                              <div className="min-w-0">
                                <p className="font-heading text-sm font-semibold text-foreground">
                                  {r.name}
                                </p>
                                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                  {r.q}
                                </p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <h4 className="font-heading text-base font-semibold text-foreground">
                        Câu hỏi thường gặp
                      </h4>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Những câu hỏi thường gặp nhất về phương pháp luận
                        hieu.asia.
                      </p>

                      <Accordion
                        type="single"
                        collapsible
                        className="mt-4 w-full"
                      >
                        {FAQ.map((f, i) => (
                          <AccordionItem key={f.q} value={`faq-${i}`}>
                            <AccordionTrigger className="text-left text-base font-medium">
                              {f.q}
                            </AccordionTrigger>
                            <AccordionContent className="leading-relaxed text-muted-foreground">
                              {f.a}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
           Related — outside collapse, always visible footer CTA
           Warm-dark tonal layer 3 — return to background.
           ───────────────────────────────────────────────────────────── */}
        <section className="relative bg-background">
          <div className="mx-auto max-w-5xl px-6 pb-20 pt-16">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Đọc tiếp
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tài liệu chi tiết hơn về từng phần.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {RELATED.map((r) => {
                const Icon = r.icon;
                return (
                  <Link
                    key={r.href}
                    href={r.href}
                    className="group flex items-center gap-3 rounded-xl border border-border bg-card/40 p-4 transition-colors hover:border-gold/30 hover:bg-card/60"
                  >
                    <Icon
                      className="h-5 w-5 shrink-0 text-gold/80"
                      aria-hidden
                    />
                    <span className="flex-1 font-heading text-sm font-semibold text-foreground">
                      {r.title}
                    </span>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-foreground/40 transition-transform group-hover:translate-x-1 group-hover:text-gold"
                      aria-hidden
                    />
                  </Link>
                );
              })}
            </div>

            <div className="mt-10 rounded-xl border border-border bg-card/40 p-5 text-sm leading-relaxed text-muted-foreground">
              <p className="flex items-start gap-2">
                <AlertTriangle
                  className="mt-0.5 h-4 w-4 shrink-0 text-amber-300"
                  aria-hidden
                />
                <span>
                  Có thắc mắc về phương pháp?{' '}
                  <a
                    className="text-gold underline underline-offset-4 hover:opacity-80"
                    href="mailto:methodology@hieu.asia"
                  >
                    methodology@hieu.asia
                  </a>
                  . Báo cáo mẫu công khai tại{' '}
                  <Link
                    href="/sample-report"
                    className="text-gold underline underline-offset-4 hover:opacity-80"
                  >
                    /sample-report
                  </Link>
                  .
                </span>
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
