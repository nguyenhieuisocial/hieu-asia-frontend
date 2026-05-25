import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Shield,
  Compass,
  XCircle,
  Layers,
  Bug,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ExternalLink,
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

export const metadata: Metadata = {
  title: 'AI Safety Policy',
  description:
    'AI Safety Policy của hieu.asia — guardrails OWASP LLM Top 10, refusal policy 6 categories, 4 layer validation, adversarial testing 600 prompts, SLA báo cáo lỗi.',
  alternates: { canonical: 'https://hieu.asia/methodology/ai-safety' },
  openGraph: {
    title: 'AI Safety Policy',
    description:
      'Guardrails, refusal policy, adversarial testing và quy trình kiểm chứng AI.',
    url: 'https://hieu.asia/methodology/ai-safety',
    type: 'article',
  },
};

const ORIENTATION: {
  label: string;
  text: string;
  href?: string;
}[] = [
  {
    label: 'OWASP LLM Top 10',
    text: 'hieu.asia áp dụng OWASP LLM Top 10 làm framework rủi ro tham chiếu.',
    href: 'https://genai.owasp.org/llm-top-10/',
  },
  {
    label: 'NIST AI RMF',
    text: 'NIST AI Risk Management Framework làm framework chất lượng.',
    href: 'https://www.nist.gov/itl/ai-risk-management-framework',
  },
  {
    label: '4 nhóm rủi ro chính',
    text: 'Hallucination, unsafe advice, prompt injection, sensitive data leakage.',
  },
];

const GUARDRAILS: {
  risk: string;
  measure: string;
  status: string;
}[] = [
  {
    risk: 'Prompt injection',
    measure:
      'User input không được sửa system prompt hoặc gọi tool trái phép',
    status: 'Active',
  },
  {
    risk: 'Hallucinated star',
    measure:
      'AI nhắc sao không có trong chart JSON → reject/regenerate',
    status: 'Active',
  },
  {
    risk: 'Unsafe medical advice',
    measure: 'Chuyển hướng sang chuyên gia y tế',
    status: 'Active (safety-guard)',
  },
  {
    risk: 'Financial advice',
    measure: 'Không khuyến nghị giao dịch, all-in, mã cụ thể',
    status: 'Active (safety-guard)',
  },
  {
    risk: 'Legal advice',
    measure: 'Không thay luật sư, chỉ giúp chuẩn bị câu hỏi',
    status: 'Active (safety-guard)',
  },
  {
    risk: 'Relationship harm',
    measure: 'Không kết luận phản bội/chia tay/cưới ngay',
    status: 'Active (safety-guard)',
  },
  {
    risk: 'Third-party analysis',
    measure: 'Không phân tích người thứ ba thiếu consent',
    status: 'Active (policy)',
  },
  {
    risk: 'Sensitive data leakage',
    measure:
      'Prompt/completion ẩn danh hoá trước observability',
    status: 'Active (Langfuse mask)',
  },
  {
    risk: 'Over-personalization',
    measure: 'Có disclaimer và confidence score',
    status: 'Active',
  },
  {
    risk: 'Generic answer',
    measure:
      'Output phải có dữ kiện lá số + bối cảnh + hành động cụ thể',
    status: 'Active (detector)',
  },
];

const REFUSAL_CATEGORIES: {
  key: string;
  label: string;
  redirect: string;
  example: string;
  reply: string;
}[] = [
  {
    key: 'self_harm',
    label: 'self_harm',
    redirect: 'surface 1800 599 920 hotline',
    example: '"Tôi không muốn sống nữa, bạn nghĩ sao về lá số tôi?"',
    reply:
      'Mình rất lo cho bạn. Mình không phải chuyên gia tâm lý — bạn vui lòng gọi 1800 599 920 (Ngày Mai – đường dây hỗ trợ khủng hoảng) ngay để có người đồng hành. Lá số có thể đợi.',
  },
  {
    key: 'mortality',
    label: 'mortality',
    redirect: 'không phán sống chết',
    example: '"Lá số tôi cho biết tôi sống được bao lâu?"',
    reply:
      'Mình không đoán thọ mệnh hay thời điểm qua đời từ lá số. Đây là ranh giới đạo đức của hieu.asia. Mình có thể giúp bạn nhìn các chủ đề sức khoẻ và lựa chọn lối sống thay vào đó.',
  },
  {
    key: 'medical',
    label: 'medical',
    redirect: 'chuyển bác sĩ',
    example: '"Tôi đau ngực mấy hôm rồi, lá số nói tôi bị gì?"',
    reply:
      'Mình không chẩn đoán y tế. Triệu chứng đau ngực cần được bác sĩ khám trực tiếp — bạn đặt lịch với bác sĩ hoặc đến cơ sở y tế gần nhất sớm nhất có thể.',
  },
  {
    key: 'financial_specific',
    label: 'financial_specific (mua/bán cụ thể, all-in)',
    redirect: 'chuyển advisor có chứng chỉ',
    example: '"Tôi nên all-in vào mã VNM tuần này không?"',
    reply:
      'Mình không tư vấn giao dịch cụ thể hay khuyên all-in. Bạn cần advisor có chứng chỉ hành nghề. Mình có thể giúp bạn nhìn chủ đề tài chính tổng quát và câu hỏi tự phản tư về khẩu vị rủi ro.',
  },
  {
    key: 'relationship_decisive',
    label: 'relationship_decisive (có nên ly hôn ngay)',
    redirect: 'chuyển chuyên gia tâm lý',
    example: '"Tôi có nên ly hôn chồng tôi luôn không?"',
    reply:
      'Mình không quyết định ly hôn thay bạn. Đây là quyết định lớn cần chuyên gia tâm lý hôn nhân đồng hành. Mình có thể giúp bạn chuẩn bị câu hỏi để mang vào phiên trị liệu.',
  },
  {
    key: 'legal_specific',
    label: 'legal_specific (có nên kiện ai)',
    redirect: 'chuyển luật sư',
    example: '"Tôi có nên kiện công ty cũ không?"',
    reply:
      'Mình không tư vấn pháp lý. Bạn cần gặp luật sư để đánh giá hồ sơ cụ thể. Mình có thể giúp bạn liệt kê câu hỏi mang vào buổi tư vấn pháp lý.',
  },
];

const LAYERS = [
  {
    n: 'L1',
    title: 'Engine deterministic',
    desc: 'Lập lá số, an sao → no AI',
  },
  {
    n: 'L2',
    title: 'Evidence extraction',
    desc: 'Trích cung/sao/đại vận liên quan → no AI',
  },
  {
    n: 'L3',
    title: 'AI interpretation',
    desc: 'AI diễn giải JSON → có guardrails',
  },
  {
    n: 'L4',
    title: 'Safety classifier post-LLM',
    desc: 'Reject/regenerate nếu vi phạm policy',
  },
] as const;

const ADVERSARIAL = [
  '600 prompts tổng cộng: 6 bộ × 100 prompts/bộ.',
  '2 bộ cốt lõi (sao bịa + safety refusal) đạt 100/100 — xem chi tiết tại /methodology.',
  '4 bộ specialized (jailbreaks, role-play, encoding tricks, multi-turn injection) đạt ≥99%.',
  'Chạy lại mỗi prompt version thay đổi.',
];

const REPORTING = [
  'User báo lỗi → /account/report.',
  'Email khẩn: safety@hieu.asia.',
  'SLA: phản hồi trong 72h, fix trong 7 ngày cho lỗi P0/P1.',
];

const REFERENCES: { label: string; href?: string }[] = [
  {
    label: 'OWASP LLM Top 10',
    href: 'https://genai.owasp.org/llm-top-10/',
  },
  {
    label: 'NIST AI Risk Management Framework',
    href: 'https://www.nist.gov/itl/ai-risk-management-framework',
  },
  {
    label: 'Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân',
  },
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
      name: 'AI Safety Policy',
      item: 'https://hieu.asia/methodology/ai-safety',
    },
  ],
};

export default function AiSafetyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />
      <main id="main-content" className="relative pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-ink-radial opacity-80"
          />
          <div className="relative mx-auto max-w-5xl px-6 pb-8 pt-12 sm:pt-16">
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
              <span className="text-muted-foreground">AI Safety</span>
            </nav>

            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
              AI Safety
            </p>
            <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
              AI Safety Policy
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Cách hieu.asia phòng vệ AI: guardrails theo OWASP LLM Top 10,
              refusal policy 6 categories, 4 layer validation, adversarial
              testing 600 prompts.
            </p>
          </div>
        </section>

        {/* 1. Định hướng */}
        <section className="relative mx-auto max-w-5xl px-6 py-8">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            1. Định hướng
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Framework rủi ro và chất lượng tham chiếu.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {ORIENTATION.map((o) => (
              <Card key={o.label} className="border-border bg-card/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base text-foreground">
                    <Compass className="h-4 w-4 text-gold/80" aria-hidden />
                    {o.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {o.text}
                  </p>
                  {o.href ? (
                    <a
                      href={o.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-xs text-gold underline underline-offset-4 hover:opacity-80"
                    >
                      Xem framework
                      <ExternalLink className="h-3 w-3" aria-hidden />
                    </a>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 2. Bảng guardrail */}
        <section className="relative mx-auto max-w-6xl px-6 py-12">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            2. Bảng guardrail
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            10 rủi ro chính và biện pháp đối ứng đang vận hành.
          </p>

          <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card/40">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Rủi ro</th>
                  <th className="px-4 py-3 font-medium">Biện pháp</th>
                  <th className="px-4 py-3 font-medium">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {GUARDRAILS.map((row) => (
                  <tr
                    key={row.risk}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {row.risk}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{row.measure}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 rounded-full border border-jade/30 bg-jade/10 px-2 py-0.5 text-[11px] font-medium text-jade">
                        <CheckCircle2 className="h-3 w-3" aria-hidden />
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. Refusal policy */}
        <section className="relative mx-auto max-w-5xl px-6 py-12">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            3. Refusal policy
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            6 categories engine từ chối trả lời — kèm ví dụ user prompt và
            reply mẫu.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {REFUSAL_CATEGORIES.map((c) => (
              <Card
                key={c.key}
                className="border-rose-500/30 bg-rose-950/15"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-mono text-sm text-rose-300">
                    <XCircle className="h-4 w-4" aria-hidden />
                    {c.label}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Redirect: {c.redirect}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-foreground/80">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      User prompt ví dụ
                    </p>
                    <p className="mt-1 italic text-muted-foreground">{c.example}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-jade/80">
                      Reply mẫu
                    </p>
                    <p className="mt-1 leading-relaxed">{c.reply}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 4. 4 layers */}
        <section className="relative mx-auto max-w-5xl px-6 py-12">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            4. Quy trình kiểm chứng (4 layers)
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            AI chỉ chen vào L3 — và bị bao bọc bởi L4.
          </p>

          <ol className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {LAYERS.map((l) => (
              <li
                key={l.n}
                className="rounded-xl border border-border bg-card/40 p-5"
              >
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-gold/80" aria-hidden />
                  <span className="font-mono text-xs font-bold text-gold">
                    {l.n}
                  </span>
                </div>
                <h3 className="mt-2 font-heading text-sm font-semibold text-foreground">
                  {l.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {l.desc}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* 5. Adversarial testing */}
        <section className="relative mx-auto max-w-4xl px-6 py-12">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            5. Adversarial testing
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Bộ test đối kháng định kỳ để xác nhận guardrails hoạt động.
          </p>

          <Card className="mt-6 border-border bg-card/40">
            <CardContent className="p-5 sm:p-6">
              <ul className="space-y-2.5 text-sm leading-relaxed text-foreground/80">
                {ADVERSARIAL.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Bug
                      className="mt-0.5 h-4 w-4 shrink-0 text-gold/80"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* 6. Reporting */}
        <section className="relative mx-auto max-w-4xl px-6 py-12">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            6. Báo cáo lỗi
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Kênh báo cáo và SLA xử lý.
          </p>

          <Card className="mt-6 border-gold/20 bg-gold/5">
            <CardContent className="p-5 sm:p-6">
              <ul className="space-y-2.5 text-sm leading-relaxed text-foreground/85">
                {REPORTING.map((item) => (
                  <li key={item} className="flex gap-2">
                    <AlertTriangle
                      className="mt-0.5 h-4 w-4 shrink-0 text-amber-300"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* 7. References */}
        <section className="relative mx-auto max-w-4xl px-6 pb-20 pt-12">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            7. References
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Framework và quy định tham chiếu.
          </p>

          <ul className="mt-6 space-y-2.5 text-sm leading-relaxed text-foreground/80">
            {REFERENCES.map((r) => (
              <li key={r.label} className="flex gap-2">
                <BookOpen
                  className="mt-0.5 h-4 w-4 shrink-0 text-gold/80"
                  aria-hidden
                />
                {r.href ? (
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/85 hover:text-gold"
                  >
                    {r.label}
                    <ExternalLink
                      className="ml-1 inline h-3 w-3"
                      aria-hidden
                    />
                  </a>
                ) : (
                  <span>{r.label}</span>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-xl border border-border bg-card/40 p-5 text-sm leading-relaxed text-muted-foreground">
            <p className="flex items-start gap-2">
              <Shield
                className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                aria-hidden
              />
              <span>
                Liên quan:{' '}
                <Link
                  href="/methodology/model-card"
                  className="text-gold underline underline-offset-4 hover:opacity-80"
                >
                  /methodology/model-card
                </Link>{' '}
                ·{' '}
                <Link
                  href="/methodology"
                  className="text-gold underline underline-offset-4 hover:opacity-80"
                >
                  /methodology
                </Link>
                .
              </span>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
