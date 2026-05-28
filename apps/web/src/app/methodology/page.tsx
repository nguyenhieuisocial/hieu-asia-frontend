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
import { Scrollyteller } from '@/components/marketing/Scrollyteller';

export const metadata: Metadata = {
  title: 'Phương pháp luận — Engine tính gì, AI luận gì',
  description:
    'hieu.asia không "phán mệnh": engine deterministic lập lá số, AI diễn giải dữ liệu, người dùng quyết định. 5 nguyên tắc, 6 tầng pipeline, confidence score, validation snapshot, quality rubric.',
  alternates: { canonical: 'https://hieu.asia/methodology' },
  // Wave 60.95.k P1-SEO — route-level openGraph REPLACES root-layout
  // openGraph (Next.js merge semantics), so we must re-declare `images` here
  // or Zalo/Facebook/Telegram/Slack previews render blank. Same for `twitter`.
  openGraph: {
    title: 'Phương pháp luận',
    description:
      'Engine deterministic lập lá số, AI diễn giải, người dùng quyết định.',
    url: 'https://hieu.asia/methodology',
    type: 'article',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'hieu.asia — Phương pháp luận: Engine tính, AI luận, người dùng quyết',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phương pháp luận',
    description:
      'Engine deterministic lập lá số, AI diễn giải, người dùng quyết định.',
    images: [
      {
        url: '/og-image.jpg',
        alt: 'hieu.asia — Phương pháp luận: Engine tính, AI luận, người dùng quyết',
      },
    ],
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
      <span className="inline-flex rounded-full border border-jade/30 bg-jade/10 px-2 py-0.5 text-[11px] font-medium text-jade-300">
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

// ─────────────────────────────────────────────────────────────
// Wave 60.67 — Chapter content builders
//
// Each chapter renders the same long-form body once consumed by Scrollyteller.
// Kept as inline JSX (vs separate component files) to preserve the historical
// "everything for /methodology in one file" convention and minimize moving
// parts during the Wave 60.66.P3.6 accordion → scrollytelling pivot.
// ─────────────────────────────────────────────────────────────

function Chapter1Content() {
  return (
    <div className="space-y-12">
      <p className="font-sans text-lg leading-relaxed text-muted-foreground">
        5 nguyên tắc định hình mọi quyết định sản phẩm của hieu.asia — từ cách
        engine tính toán đến cách AI diễn giải và cách dữ liệu được lưu trữ.
      </p>

      <ol className="space-y-4">
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
                      <Icon className="h-4 w-4 text-gold/80" aria-hidden />
                      <h3 className="font-sans text-base font-semibold text-foreground sm:text-lg">
                        {p.title}
                      </h3>
                    </div>
                    <p className="mt-1.5 font-sans text-sm leading-relaxed text-muted-foreground">
                      {p.body}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ol>

      <div>
        <h3 className="font-sans text-xl font-bold text-foreground sm:text-2xl">
          Quy trình tạo một báo cáo
        </h3>
        <p className="mt-2 font-sans text-sm text-muted-foreground/70">
          6 tầng pipeline — từ input của user tới quyết định cuối cùng.
        </p>

        <ol className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {PIPELINE.map((step, idx) => {
            const Icon = step.icon;
            return (
              <li key={step.label} className="relative">
                <div className="flex h-full flex-col rounded-xl border border-border bg-muted/40 p-5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-gold-soft">
                      0{idx + 1}
                    </span>
                    <Icon className="h-4 w-4 text-gold/80" aria-hidden />
                    <h4 className="font-sans text-sm font-semibold text-foreground">
                      {step.label}
                    </h4>
                  </div>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function Chapter2Content() {
  return (
    <div className="space-y-12">
      <p className="font-sans text-lg leading-relaxed text-muted-foreground">
        Ranh giới rõ ràng giữa diễn giải và phán định. AI được phép đọc structured
        chart; AI không được phép tự tạo dữ kiện lá số hay phán định mệnh.
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-jade/25 bg-jade/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-jade-300">
              <CheckCircle2 className="h-5 w-5" aria-hidden />
              AI được phép
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5 font-sans text-sm leading-relaxed text-muted-foreground">
              {AI_CAN.map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-jade-300"
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
            <ul className="space-y-2.5 font-sans text-sm leading-relaxed text-muted-foreground">
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
        <h3 className="font-sans text-xl font-bold text-foreground">
          Dữ liệu dùng để luận
        </h3>
        <p className="mt-2 font-sans text-sm text-muted-foreground/70">
          Mỗi phương pháp có engine riêng, AI chỉ đọc output structured.
        </p>

        {/* Wave 60.79.T3 (vault 112 P1 #8): 5-col table overflows on 375px.
            Mobile shows stacked card-per-row with label-value pairs (<md);
            md+ keeps the original table. Both render the same DATA_ROWS so
            content stays in sync. */}
        {/* Mobile: stacked cards */}
        <div className="mt-4 grid gap-3 md:hidden">
          {DATA_ROWS.map((row) => (
            <div
              key={`m-${row.method}`}
              className="rounded-xl border border-border bg-muted/40 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-foreground">{row.method}</p>
                <StatusBadge status={row.status} />
              </div>
              <dl className="mt-3 space-y-2 text-sm">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-gold-soft">
                    Dữ liệu dùng
                  </dt>
                  <dd className="mt-0.5 text-muted-foreground">{row.data}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-gold-soft">
                    Engine tính?
                  </dt>
                  <dd className="mt-0.5 text-muted-foreground">{row.engine}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-gold-soft">
                    AI làm gì
                  </dt>
                  <dd className="mt-0.5 text-muted-foreground">{row.ai}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
        {/* md+: original table */}
        <div className="mt-4 hidden overflow-x-auto rounded-xl border border-border bg-muted/40 md:block">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-eyebrow uppercase tracking-[0.12em] text-gold-soft">
                <th className="px-4 py-3 font-medium">Phương pháp</th>
                <th className="px-4 py-3 font-medium">Dữ liệu dùng</th>
                <th className="px-4 py-3 font-medium">Engine tính?</th>
                <th className="px-4 py-3 font-medium">AI làm gì</th>
                <th className="px-4 py-3 font-medium">Trạng thái</th>
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
                  <td className="px-4 py-3 text-muted-foreground">{row.data}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.engine}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.ai}</td>
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
  );
}

function Chapter3Content() {
  return (
    <div className="space-y-12">
      <p className="font-sans text-lg leading-relaxed text-muted-foreground">
        Mỗi report có confidence score. Khi thiếu dữ liệu, hieu.asia không
        &quot;đoán cứng&quot; — hệ thống nói rõ độ không chắc.
      </p>

      <div>
        <h3 className="font-sans text-xl font-bold text-foreground">
          Mức tin cậy của kết luận
        </h3>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {CONFIDENCE.map((c) => {
            const palette =
              c.color === 'jade'
                ? 'border-jade/30 bg-jade/5 text-jade-300'
                : c.color === 'amber'
                  ? 'border-amber-500/30 bg-amber-500/5 text-amber-300'
                  : 'border-rose-500/30 bg-rose-950/20 text-rose-300';
            return (
              <div
                key={c.level}
                className={`rounded-xl border p-5 ${palette}`}
              >
                <div className="font-sans text-base font-semibold">
                  {c.level}
                </div>
                <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
                  {c.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-4 rounded-xl border border-border bg-muted/40 p-5">
          <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-gold-soft">
            Ví dụ
          </p>
          <p className="mt-2 font-sans text-sm italic leading-relaxed text-muted-foreground sm:text-base">
            &quot;Mức tin cậy: Trung bình. Lý do: bạn nhập giờ sinh khoảng 23:30,
            gần ranh giờ Tý. Một số cung có thể thay đổi nếu giờ sinh lệch 20-30
            phút.&quot;
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-sans text-xl font-bold text-foreground">
          Vì sao kết luận này?
        </h3>
        <p className="mt-2 font-sans text-sm text-muted-foreground/70">
          Mỗi kết luận quan trọng đều có thể bung ra phần căn cứ.
        </p>

        <Card className="mt-4 border-border bg-muted/40">
          <CardContent className="space-y-5 p-5 sm:p-6">
            <div>
              <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-gold-soft">
                Claim
              </p>
              <p className="mt-2 font-sans text-base text-foreground sm:text-lg">
                &quot;Bạn nên kiểm chứng cơ hội mới trong 60 ngày trước khi nghỉ
                việc.&quot;
              </p>
            </div>

            <div>
              <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-jade-300/80">
                Dựa trên
              </p>
              <ul className="mt-2 space-y-1.5 font-sans text-sm leading-relaxed text-muted-foreground">
                <li className="flex gap-2">
                  <ChevronRight
                    className="mt-0.5 h-4 w-4 shrink-0 text-jade-300/70"
                    aria-hidden
                  />
                  <span>Cung Quan Lộc: xu hướng mở rộng vai trò</span>
                </li>
                <li className="flex gap-2">
                  <ChevronRight
                    className="mt-0.5 h-4 w-4 shrink-0 text-jade-300/70"
                    aria-hidden
                  />
                  <span>Tài Bạch: cần biên an toàn tài chính</span>
                </li>
                <li className="flex gap-2">
                  <ChevronRight
                    className="mt-0.5 h-4 w-4 shrink-0 text-jade-300/70"
                    aria-hidden
                  />
                  <span>
                    Đại vận hiện tại: chủ đề xây nền trước khi mở rộng
                  </span>
                </li>
                <li className="flex gap-2">
                  <ChevronRight
                    className="mt-0.5 h-4 w-4 shrink-0 text-jade-300/70"
                    aria-hidden
                  />
                  <span>Bối cảnh user: đang cân nhắc startup mới</span>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-rose-300/80">
                Không kết luận
              </p>
              <ul className="mt-2 space-y-1.5 font-sans text-sm leading-relaxed text-muted-foreground">
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
                  <span>Không nói startup chắc chắn tốt/xấu</span>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-gold-soft">
                Bước kiểm chứng
              </p>
              <ul className="mt-2 space-y-1.5 font-sans text-sm leading-relaxed text-muted-foreground">
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
                  <span>Nói chuyện với 2 người trong ngành</span>
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
        <h3 className="font-sans text-xl font-bold text-foreground">
          Kiểm chứng thuật toán
        </h3>
        <p className="mt-2 font-sans text-sm text-muted-foreground/70">
          Snapshot test suite tại lần verify gần nhất ({LAST_VERIFIED}).
        </p>

        {/* Wave 60.79.T3 (vault 112 P1 #8): validation table mobile-responsive
            — stacked cards <md, original table md+. */}
        {/* Mobile: stacked cards */}
        <div className="mt-4 grid gap-3 md:hidden">
          {VALIDATION_ROWS.map((row) => (
            <div
              key={`vm-${row.label}`}
              className="rounded-xl border border-border bg-muted/40 p-4"
            >
              <p className="text-sm text-muted-foreground">{row.label}</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="font-mono text-sm text-muted-foreground/70">{row.result}</p>
                {row.status === 'pass' ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-jade/30 bg-jade/10 px-2 py-0.5 text-[11px] font-medium text-jade-300">
                    <CheckCircle2 className="h-3 w-3" aria-hidden />
                    pass
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-300">
                    <Info className="h-3 w-3" aria-hidden />
                    partial
                  </span>
                )}
              </div>
              {row.status === 'partial' && (
                <p className="mt-2 text-[11px] text-muted-foreground/70">
                  2 case đang review do dị biệt trường phái
                </p>
              )}
            </div>
          ))}
        </div>
        {/* md+: original table */}
        <div className="mt-4 hidden overflow-x-auto rounded-xl border border-border bg-muted/40 md:block">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-eyebrow uppercase tracking-[0.12em] text-gold-soft">
                <th className="px-4 py-3 font-medium">Hạng mục</th>
                <th className="px-4 py-3 font-medium">Kết quả</th>
                <th className="px-4 py-3 font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {VALIDATION_ROWS.map((row) => (
                <tr
                  key={row.label}
                  className="border-b border-border last:border-b-0"
                >
                  <td className="px-4 py-3 text-muted-foreground">{row.label}</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground/70">
                    {row.result}
                  </td>
                  <td className="px-4 py-3">
                    {row.status === 'pass' ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-jade/30 bg-jade/10 px-2 py-0.5 text-[11px] font-medium text-jade-300">
                        <CheckCircle2 className="h-3 w-3" aria-hidden />
                        pass
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-300">
                        <Info className="h-3 w-3" aria-hidden />
                        partial — 2 case đang review do dị biệt trường phái
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 font-sans text-sm leading-relaxed text-muted-foreground/70">
          Golden dataset đang mở rộng từ 32 lên 100 lá số ground-truth. Mỗi
          release engine chạy lại regression test.
        </p>
      </div>
    </div>
  );
}

function Chapter4Content() {
  return (
    <div className="space-y-12">
      <p className="font-sans text-lg leading-relaxed text-muted-foreground">
        Human-in-the-loop ở 4 vai trò review, kích hoạt theo 4 trigger. Dữ liệu
        cá nhân được tối thiểu hoá và có thể xoá bất cứ lúc nào.
      </p>

      <div>
        <h3 className="font-sans text-xl font-bold text-foreground">
          Human review
        </h3>
        <p className="mt-2 font-sans text-sm text-muted-foreground/70">
          4 vai trò review, 4 trigger trigger, SLA xử lý phản hồi.
        </p>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card className="border-border bg-muted/40">
            <CardHeader>
              <CardTitle className="text-base text-foreground">
                Vai trò review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 font-sans text-sm leading-relaxed text-muted-foreground">
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

          <Card className="border-border bg-muted/40">
            <CardHeader>
              <CardTitle className="text-base text-foreground">
                Khi nào review được kích hoạt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 font-sans text-sm leading-relaxed text-muted-foreground">
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
          <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-gold-soft">
            SLA
          </p>
          <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
            Xác nhận tiếp nhận trong 72h. Xử lý hoàn tất trong tối đa 30 ngày
            làm việc (yêu cầu xoá/xuất dữ liệu).
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-sans text-xl font-bold text-foreground">
          Privacy-first methodology
        </h3>
        <p className="mt-2 font-sans text-sm text-muted-foreground/70">
          Tóm tắt cách hieu.asia xử lý dữ liệu cá nhân.
        </p>

        <ul className="mt-4 space-y-2.5 font-sans text-sm leading-relaxed text-muted-foreground">
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

        <p className="mt-5 font-sans text-sm text-muted-foreground/70">
          Bảng sub-processor đầy đủ và quyền user xem tại{' '}
          <Link
            href="/privacy"
            className="text-gold-soft underline underline-offset-4 hover:text-gold"
          >
            /privacy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function Chapter5Content() {
  return (
    <div className="space-y-12">
      <p className="font-sans text-lg leading-relaxed text-muted-foreground">
        Quality rubric 8 tiêu chí — mỗi tiêu chí kèm câu hỏi xác minh. Bên dưới
        là 6 câu hỏi thường gặp nhất về phương pháp luận hieu.asia.
      </p>

      <div>
        <h3 className="font-sans text-xl font-bold text-foreground">
          Một luận giải tốt cần 8 tiêu chí
        </h3>

        <ol className="mt-4 grid gap-3 sm:grid-cols-2">
          {RUBRIC.map((r) => (
            <li key={r.n}>
              <div className="flex h-full gap-3 rounded-xl border border-border bg-muted/40 p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 font-mono text-xs font-bold text-gold">
                  {r.n}
                </span>
                <div className="min-w-0">
                  <p className="font-sans text-sm font-semibold text-foreground">
                    {r.name}
                  </p>
                  <p className="mt-1 font-sans text-sm leading-relaxed text-muted-foreground">
                    {r.q}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h3 className="font-sans text-xl font-bold text-foreground">
          Câu hỏi thường gặp
        </h3>

        <Accordion type="single" collapsible className="mt-4 w-full">
          {FAQ.map((f, i) => (
            <AccordionItem key={f.q} value={`faq-${i}`}>
              <AccordionTrigger className="text-left font-sans text-base font-medium text-foreground">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="font-sans leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
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
      <main id="main-content" className="relative">
        {/* ─────────────────────────────────────────────────────────────
           Wave 60.67 — Page hero (Option E typography pivot, vault 109 §4).
           Replaces the previous MarketingHero rendering — scrollytelling
           subsection below benefits from a more concise, scan-fast hero
           that doesn't compete with the sticky chapter title.
           ───────────────────────────────────────────────────────────── */}
        {/* Wave 60.79.T1 (vault 112 P0-10): tighten pt-32 → pt-24 + md:py-24 →
            md:py-20 so the 200+px tag-to-body gap shrinks. pt accounts for
            fixed SiteNav (h-16 = 64px) + breathing room. */}
        <section className="bg-background px-6 py-12 pt-24 md:py-20">
          <div className="mx-auto max-w-marketing-tight">
            <p className="mb-6 font-mono text-eyebrow uppercase tracking-[0.12em] text-gold">
              <span className="mr-2 inline-block h-px w-6 bg-gold align-middle" />
              PHƯƠNG PHÁP · 2026
            </p>
            <h1 className="font-sans text-hero-display font-bold tracking-tight text-foreground">
              Engine tính gì, AI luận gì,{' '}
              <u className="underline decoration-gold decoration-2 underline-offset-[6px]">
                bạn quyết định
              </u>{' '}
              gì
              <span className="text-gold-dot">.</span>
            </h1>
            <p className="mt-8 max-w-marketing-text text-pretty font-sans text-lg leading-relaxed text-muted-foreground">
              Năm chương ngắn: triết lý, giới hạn của AI, cách chúng tôi kiểm
              chứng, quy trình + privacy, và rubric chất lượng.
            </p>

            {/* Breadcrumb + trust pills under hero */}
            <nav
              aria-label="Breadcrumb"
              className="mt-10 font-mono text-eyebrow uppercase tracking-[0.12em] text-muted-foreground/70"
            >
              {/* Wave 60.97.1 — breadcrumb link gets `min-h-11 py-2.5` so
                  it reaches 44px on mobile (was 14px). */}
              <Link
                href="/"
                className="inline-flex min-h-11 items-center py-2.5 transition-colors hover:text-gold-soft active:text-gold-soft touch-manipulation"
              >
                Trang chủ
              </Link>
              <span className="mx-2">/</span>
              <span className="text-muted-foreground">Phương pháp luận</span>
              <span className="mx-2">·</span>
              <span>LAST VERIFIED {LAST_VERIFIED}</span>
            </nav>

            <div className="mt-6 flex flex-wrap gap-2 font-sans text-xs">
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
                  className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-muted/40 px-3 py-1 text-muted-foreground"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
           Wave 60.67 — Scrollytelling section (5 chapters).
           Sticky 40% left column on desktop, single stack on mobile.
           ───────────────────────────────────────────────────────────── */}
        <Scrollyteller
          fallbackEyebrow="PHƯƠNG PHÁP · HIEU.ASIA"
          chapters={[
            {
              id: 'chapter-philosophy',
              eyebrow: 'CHƯƠNG 1 · TRIẾT LÝ',
              title: 'Bốn ống kính, một con người',
              content: <Chapter1Content />,
            },
            {
              id: 'chapter-limits',
              eyebrow: 'CHƯƠNG 2 · GIỚI HẠN',
              title: 'Cái AI biết & cái AI không thể biết',
              content: <Chapter2Content />,
            },
            {
              id: 'chapter-validation',
              eyebrow: 'CHƯƠNG 3 · KIỂM CHỨNG',
              title: 'Confidence không phải tin cậy',
              content: <Chapter3Content />,
            },
            {
              id: 'chapter-process',
              eyebrow: 'CHƯƠNG 4 · CÁCH LÀM',
              title: 'Human-in-the-loop · Privacy-first',
              content: <Chapter4Content />,
            },
            {
              id: 'chapter-rubric',
              eyebrow: 'CHƯƠNG 5 · CHẤT LƯỢNG',
              title: 'Rubric chất lượng + câu hỏi thường gặp',
              content: <Chapter5Content />,
            },
          ]}
        />

        {/* ─────────────────────────────────────────────────────────────
           Related — always-visible footer CTA grid + contact callout.
           ───────────────────────────────────────────────────────────── */}
        <section className="relative bg-muted/40">
          <div className="mx-auto max-w-marketing px-6 pb-20 pt-16 lg:px-12">
            <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-gold">
              <span className="mr-2 inline-block h-px w-6 bg-gold align-middle" />
              ĐỌC TIẾP
            </p>
            <h2 className="mt-4 font-sans text-section-display font-bold tracking-tight text-foreground">
              Tài liệu chi tiết hơn về từng phần
            </h2>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {RELATED.map((r) => {
                const Icon = r.icon;
                return (
                  <Link
                    key={r.href}
                    href={r.href}
                    className="group flex items-center gap-3 rounded-card-editorial border border-border bg-muted/40 p-4 transition-colors duration-300 ease-editorial hover:border-gold/30 hover:bg-card"
                  >
                    <Icon
                      className="h-5 w-5 shrink-0 text-gold/80"
                      aria-hidden
                    />
                    <span className="flex-1 font-sans text-sm font-semibold text-foreground">
                      {r.title}
                    </span>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-muted-foreground/70 transition-transform group-hover:translate-x-1 group-hover:text-gold"
                      aria-hidden
                    />
                  </Link>
                );
              })}
            </div>

            <div className="mt-10 rounded-card-editorial border border-border bg-muted/40 p-5 font-sans text-sm leading-relaxed text-muted-foreground">
              <p className="flex items-start gap-2">
                <AlertTriangle
                  className="mt-0.5 h-4 w-4 shrink-0 text-amber-300"
                  aria-hidden
                />
                <span>
                  Có thắc mắc về phương pháp?{' '}
                  <a
                    className="text-gold-soft underline underline-offset-4 hover:text-gold"
                    href="mailto:methodology@hieu.asia"
                  >
                    methodology@hieu.asia
                  </a>
                  . Báo cáo mẫu công khai tại{' '}
                  <Link
                    href="/sample-report"
                    className="text-gold-soft underline underline-offset-4 hover:text-gold"
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
