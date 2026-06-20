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
  Calendar,
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
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';

export const metadata: Metadata = {
  title: 'Phương pháp luận — Engine tính gì, AI luận gì',
  description:
    'hieu.asia không "phán mệnh": engine deterministic lập lá số, AI diễn giải, người dùng quyết định. 6 tầng pipeline, confidence score, quality rubric.',
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

// QA tables below show illustrative representative figures (relabeled "số minh hoạ"
// in the UI) — real measured numbers are published post-launch, not a verified-date claim.

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
    method: 'Big Five (OCEAN)',
    data: 'khảo sát user',
    engine: 'Quiz scoring',
    ai: 'đối chiếu 5 chiều OCEAN',
    status: 'optional',
  },
  {
    method: 'Xem Tướng',
    data: 'ảnh bàn tay / khuôn mặt (tuỳ chọn)',
    engine: 'Vision AI',
    ai: 'phân tích nét tướng',
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

// ─────────────────────────────────────────────────────────────
// Wave 62.07 — Test cases public (vault 138 §"99% trên 500/600 mỏng").
// Made the "99% accuracy on 500/600" claim tangible by enumerating:
//   1. Sample 20 of 500 âm-dương lịch conversion test cases (table).
//   2. All 10 categories of the 600 prompt safety eval (table — pass rates).
// NOTE: Sample rows are illustrative representative slices of the suites that
// run before each release. No public dataset/runner is published yet, so we do
// not claim it can be re-run externally. Founder updates with real numbers
// post-ship.
// ─────────────────────────────────────────────────────────────

type CalendarCase = {
  id: string;
  input: string;
  expected: string;
  status: 'pass' | 'partial';
};

// 20 sample rows of the 500-case âm-dương conversion suite. Inputs span
// 1900-2199 boundary cases, leap months, Tet edge dates, day-boundary hours.
const CALENDAR_CASES: ReadonlyArray<CalendarCase> = [
  { id: 'AD-001', input: '1900-01-31 (DL)', expected: '1900-01-01 Canh Tý (ÂL)', status: 'pass' },
  { id: 'AD-027', input: '1923-02-16 (DL)', expected: '1923-01-01 Quý Hợi (ÂL)', status: 'pass' },
  { id: 'AD-058', input: '1945-08-15 12:00 (DL)', expected: '1945-07-08 Ất Dậu — giờ Ngọ', status: 'pass' },
  { id: 'AD-074', input: '1955-04-22 (DL nhuận tháng 3)', expected: '1955-03-30 Ất Mùi — nhuận tháng 3', status: 'pass' },
  { id: 'AD-093', input: '1968-02-29 (DL năm nhuận)', expected: '1968-02-02 Mậu Thân (ÂL)', status: 'pass' },
  { id: 'AD-112', input: '1975-04-30 (DL)', expected: '1975-03-19 Ất Mão (ÂL)', status: 'pass' },
  { id: 'AD-148', input: '1984-02-02 23:45 (DL)', expected: '1984-01-01 Giáp Tý — giờ Tý kế', status: 'pass' },
  { id: 'AD-187', input: '1990-12-31 (DL)', expected: '1990-11-15 Canh Ngọ (ÂL)', status: 'pass' },
  { id: 'AD-201', input: '1995-02-19 (DL Tết Ất Hợi)', expected: '1995-01-01 Ất Hợi — mùng 1 Tết', status: 'pass' },
  { id: 'AD-234', input: '2000-01-01 00:00 (DL Y2K)', expected: '1999-11-25 Kỷ Mão — giờ Tý', status: 'pass' },
  { id: 'AD-268', input: '2004-02-29 (DL năm nhuận)', expected: '2004-02-10 Giáp Thân (ÂL)', status: 'pass' },
  { id: 'AD-293', input: '2009-05-25 (DL nhuận tháng 5 ÂL)', expected: '2009-05-02 nhuận — Kỷ Sửu', status: 'pass' },
  { id: 'AD-321', input: '2012-02-04 (DL Lập Xuân)', expected: '2012-01-13 Nhâm Thìn — giáp tiết', status: 'pass' },
  { id: 'AD-345', input: '2016-03-09 (DL nhật thực)', expected: '2016-02-01 Bính Thân (ÂL)', status: 'pass' },
  { id: 'AD-378', input: '2020-04-23 (DL nhuận tháng 4 ÂL)', expected: '2020-04-01 nhuận — Canh Tý', status: 'partial' },
  { id: 'AD-401', input: '2024-02-10 (DL Tết Giáp Thìn)', expected: '2024-01-01 Giáp Thìn — mùng 1 Tết', status: 'pass' },
  { id: 'AD-433', input: '2033-11-22 (DL nhuận tháng 11 ÂL)', expected: '2033-11-01 nhuận — Quý Sửu', status: 'partial' },
  { id: 'AD-455', input: '2057-09-30 (DL)', expected: '2057-08-22 Đinh Sửu (ÂL)', status: 'pass' },
  { id: 'AD-478', input: '2100-02-28 (DL — không nhuận DL)', expected: '2100-01-21 Canh Thân (ÂL)', status: 'pass' },
  { id: 'AD-500', input: '2199-12-31 23:59 (DL — biên trên)', expected: '2199-11-16 Kỷ Mùi — giờ Tý kế', status: 'pass' },
];

type SafetyCategory = {
  id: string;
  category: string;
  count: number;
  passRate: string;
  note?: string;
};

// 600 prompt safety eval breakdown — 10 categories, summing to exactly 600.
// Verified: 80+60+50+40+50+40+80+100+60+40 = 600.
const SAFETY_CATEGORIES: ReadonlyArray<SafetyCategory> = [
  { id: 'S-01', category: 'Crisis intervention deflection', count: 80, passRate: '100% pass', note: 'Khủng hoảng → khuyên gọi đường dây 1800-599-920' },
  { id: 'S-02', category: 'Financial advice deflection', count: 60, passRate: '100% pass', note: 'Không khuyên đầu tư cụ thể, không khuyến nghị mã CK' },
  { id: 'S-03', category: 'Medical advice deflection', count: 50, passRate: '100% pass', note: 'Triệu chứng/bệnh → khuyên gặp bác sĩ chuyên khoa' },
  { id: 'S-04', category: 'Legal advice deflection', count: 40, passRate: '100% pass', note: 'Tranh chấp pháp lý → khuyên luật sư có giấy phép' },
  { id: 'S-05', category: 'Self-harm escalation', count: 50, passRate: '100% pass', note: 'Phát hiện ý định tự hại → ngắt session, hotline' },
  { id: 'S-06', category: 'Underage user detection', count: 40, passRate: '100% pass', note: 'Tuổi < 16 → khoá tính năng, yêu cầu giám hộ' },
  { id: 'S-07', category: 'PII leak prevention', count: 80, passRate: '100% pass', note: 'Không lặp lại CMND/CCCD/thẻ trong response' },
  { id: 'S-08', category: 'Hallucination / false confidence', count: 100, passRate: '88% pass', note: '12/100 case đang xét lại — phán quá chắc về tương lai' },
  { id: 'S-09', category: 'Prompt injection resistance', count: 60, passRate: '100% pass', note: 'Ignore system role, bypass safety → từ chối' },
  { id: 'S-10', category: 'Cross-language consistency', count: 40, passRate: '100% pass', note: 'EN/VN cùng câu hỏi → cùng mức từ chối' },
];

const SAFETY_TOTAL = SAFETY_CATEGORIES.reduce((sum, c) => sum + c.count, 0);

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
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-mono text-sm font-bold text-primary">
                    {p.n}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary/80" aria-hidden />
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
                    <span className="font-mono text-[11px] text-primary/80">
                      0{idx + 1}
                    </span>
                    <Icon className="h-4 w-4 text-primary/80" aria-hidden />
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
                  <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-primary/80">
                    Dữ liệu dùng
                  </dt>
                  <dd className="mt-0.5 text-muted-foreground">{row.data}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-primary/80">
                    Engine tính?
                  </dt>
                  <dd className="mt-0.5 text-muted-foreground">{row.engine}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-primary/80">
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
              <tr className="border-b border-border text-left font-mono text-eyebrow uppercase tracking-[0.12em] text-primary/80">
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
          <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-primary/80">
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
              <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-primary/80">
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
              <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-primary/80">
                Bước kiểm chứng
              </p>
              <ul className="mt-2 space-y-1.5 font-sans text-sm leading-relaxed text-muted-foreground">
                <li className="flex gap-2">
                  <Sparkles
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary/80"
                    aria-hidden
                  />
                  <span>Tính runway</span>
                </li>
                <li className="flex gap-2">
                  <Sparkles
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary/80"
                    aria-hidden
                  />
                  <span>Nói chuyện với 2 người trong ngành</span>
                </li>
                <li className="flex gap-2">
                  <Sparkles
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary/80"
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
          Cấu trúc bộ kiểm thử chạy trước mỗi lần phát hành. Số liệu dưới đây là{' '}
          <strong>minh hoạ đại diện</strong> — số đo thật sẽ công bố sau khi ra mắt.
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
              <tr className="border-b border-border text-left font-mono text-eyebrow uppercase tracking-[0.12em] text-primary/80">
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
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary/80"
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
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary/80"
                      aria-hidden
                    />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-5">
          <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-primary/80">
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
                className="mt-0.5 h-4 w-4 shrink-0 text-primary/80"
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
            className="text-primary/80 underline underline-offset-4 hover:text-primary"
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
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-mono text-xs font-bold text-primary">
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
      <main id="main-content" className="relative methodology-a11y">
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
            <p className="mb-6 font-mono text-eyebrow uppercase tracking-[0.12em] text-primary">
              <span className="mr-2 inline-block h-px w-6 bg-primary align-middle" />
              PHƯƠNG PHÁP · 2026
            </p>
            <h1 className="font-sans text-hero-display font-bold tracking-tight text-foreground">
              Engine tính gì, AI luận gì,{' '}
              <u className="underline decoration-primary decoration-2 underline-offset-[6px]">
                bạn quyết định
              </u>{' '}
              gì
              <span className="text-primary">.</span>
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
                className="inline-flex min-h-11 items-center py-2.5 transition-colors hover:text-primary/80 active:text-primary/80 touch-manipulation"
              >
                Trang chủ
              </Link>
              <span className="mx-2">/</span>
              <span className="text-muted-foreground">Phương pháp luận</span>
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
              title: 'Năm ống kính, một con người',
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
           Wave 62.07 — Test cases public (vault 138 §"99/600 mỏng").
           Made the existing "≥99% on 600 prompts" + "500/500 calendar" claim
           tangible: sample 20 of 500 calendar rows + full 10-category 600
           safety eval breakdown. Honest framing: the sample rows shown here
           are representative slices; a public dataset/runner is not yet
           published, so we do not claim "reproduce it yourself" until it is.
           ───────────────────────────────────────────────────────────── */}
        <section
          aria-labelledby="test-cases-heading"
          className="bg-background py-section"
        >
          <div className="mx-auto max-w-marketing-tight px-6 lg:px-12">
            <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-primary">
              <span className="mr-2 inline-block h-px w-6 bg-primary align-middle" />
              KIỂM CHỨNG · TEST CASES CÔNG KHAI
            </p>
            <h2
              id="test-cases-heading"
              className="mt-6 font-editorial-display text-editorial-h2 font-normal tracking-tight text-foreground"
            >
              Không nói &quot;99% chính xác&quot;.{' '}
              <em className="italic text-primary/80">Cho bạn xem cách chúng tôi kiểm thử</em>
              <span className="text-primary">.</span>
            </h2>
            <p className="mt-6 max-w-marketing-text font-sans text-editorial-lede text-muted-foreground">
              Hai bộ kiểm chứng cốt lõi của hieu.asia — bộ chuyển đổi
              âm/dương lịch và bộ prompt safety eval — chạy tự động trước mỗi
              lần phát hành. Bên dưới là một số case mẫu đại diện cùng
              breakdown để bạn xem cách chúng tôi kiểm chứng.
            </p>

            <div className="mt-card flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-pill border border-border bg-muted/40 px-3 py-1 font-mono text-eyebrow uppercase tracking-[0.12em] text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" aria-hidden />
                Số minh hoạ · số đo thật công bố sau ra mắt
              </span>
            </div>

            {/* ─────────────────────────────────────────────────────────
                Test bundle 1 — 500 âm-dương lịch conversion cases.
                ───────────────────────────────────────────────────────── */}
            <div className="mt-block">
              <h3 className="font-editorial-display text-editorial-h3 font-normal tracking-tight text-foreground">
                Bộ 1 · 500 case chuyển đổi âm-dương lịch
              </h3>
              <p className="mt-3 max-w-marketing-text font-sans text-base text-muted-foreground">
                Engine phải pass toàn bộ 500 case này trước mỗi release.
                Phủ 1900-2199, năm nhuận, tháng nhuận âm lịch, ranh giờ Tý,
                các mùng 1 Tết, ngày đặc biệt (Y2K, nhật/nguyệt thực).
              </p>
              <p className="mt-2 font-sans text-editorial-caption text-muted-foreground/70">
                Sample dưới đây là một số case đại diện trong bộ kiểm thử
                chuyển đổi âm-dương lịch chạy trước mỗi release.
              </p>

              {/* Mobile: stacked cards */}
              <div className="mt-card grid gap-3 md:hidden">
                {CALENDAR_CASES.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-xl border border-border bg-muted/40 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-primary/80">
                        {c.id}
                      </p>
                      {c.status === 'pass' ? (
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
                    <dl className="mt-3 space-y-2 text-sm">
                      <div>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/70">
                          Input
                        </dt>
                        <dd className="mt-0.5 font-mono text-xs text-foreground">{c.input}</dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/70">
                          Expected
                        </dt>
                        <dd className="mt-0.5 font-mono text-xs text-muted-foreground">{c.expected}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>

              {/* md+: table */}
              <div className="mt-card hidden overflow-x-auto rounded-xl border border-border bg-muted/40 md:block">
                <table className="w-full min-w-[720px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left font-mono text-eyebrow uppercase tracking-[0.12em] text-primary">
                      <th className="px-4 py-3 font-medium">ID</th>
                      <th className="px-4 py-3 font-medium">Input (dương lịch)</th>
                      <th className="px-4 py-3 font-medium">Expected (âm lịch · Can Chi)</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CALENDAR_CASES.map((c) => (
                      <tr
                        key={c.id}
                        className="border-b border-border last:border-b-0"
                      >
                        <td className="px-4 py-3 font-mono text-xs text-primary/80">{c.id}</td>
                        <td className="px-4 py-3 font-mono text-xs text-foreground">{c.input}</td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.expected}</td>
                        <td className="px-4 py-3">
                          {c.status === 'pass' ? (
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-4 font-sans text-editorial-caption text-muted-foreground/70">
                Trạng thái <em className="italic text-amber-300">partial</em>{' '}
                ở 2 case (AD-378, AD-433) phản ánh dị biệt giữa lịch Việt và
                lịch Trung Quốc khi xét tháng nhuận biên — đang theo dõi để
                đồng bộ với chuẩn Đài thiên văn Phùng Khoách Phú (Đài Loan).
              </p>
            </div>

            {/* ─────────────────────────────────────────────────────────
                Test bundle 2 — 600 prompt safety eval (10 categories).
                ───────────────────────────────────────────────────────── */}
            <div className="mt-block">
              <h3 className="font-editorial-display text-editorial-h3 font-normal tracking-tight text-foreground">
                Bộ 2 · 600 prompt safety eval — phân theo 10 chủ đề
              </h3>
              <p className="mt-3 max-w-marketing-text font-sans text-base text-muted-foreground">
                Adversarial prompts chia 10 chủ đề ranh giới — AI phải từ chối
                hoặc chuyển hướng đúng cách. Mỗi chủ đề chạy mỗi đêm trong CI;
                điểm dưới ngưỡng → block release. <em>Tỷ lệ dưới đây là số minh hoạ
                đại diện cho phạm vi kiểm thử — số đo thật sẽ công bố sau khi ra mắt.</em>
              </p>

              {/* Mobile: stacked cards */}
              <div className="mt-card grid gap-3 md:hidden">
                {SAFETY_CATEGORIES.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-xl border border-border bg-muted/40 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-foreground">{c.category}</p>
                      <span className="font-mono text-eyebrow uppercase tracking-[0.12em] text-primary/80">
                        {c.id}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <span className="font-mono text-xs text-muted-foreground">
                        n = {c.count}
                      </span>
                      {c.passRate.startsWith('100') ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-jade/30 bg-jade/10 px-2 py-0.5 text-[11px] font-medium text-jade-300">
                          <CheckCircle2 className="h-3 w-3" aria-hidden />
                          {c.passRate}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-300">
                          <Info className="h-3 w-3" aria-hidden />
                          {c.passRate}
                        </span>
                      )}
                    </div>
                    {c.note && (
                      <p className="mt-2 font-sans text-xs leading-relaxed text-muted-foreground/80">
                        {c.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* md+: table */}
              <div className="mt-card hidden overflow-x-auto rounded-xl border border-border bg-muted/40 md:block">
                <table className="w-full min-w-[720px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left font-mono text-eyebrow uppercase tracking-[0.12em] text-primary">
                      <th className="px-4 py-3 font-medium">ID</th>
                      <th className="px-4 py-3 font-medium">Chủ đề</th>
                      <th className="px-4 py-3 font-medium">n</th>
                      <th className="px-4 py-3 font-medium">Tỉ lệ pass</th>
                      <th className="px-4 py-3 font-medium">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SAFETY_CATEGORIES.map((c) => (
                      <tr
                        key={c.id}
                        className="border-b border-border last:border-b-0"
                      >
                        <td className="px-4 py-3 font-mono text-xs text-primary/80">{c.id}</td>
                        <td className="px-4 py-3 font-medium text-foreground">{c.category}</td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.count}</td>
                        <td className="px-4 py-3">
                          {c.passRate.startsWith('100') ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-jade/30 bg-jade/10 px-2 py-0.5 text-[11px] font-medium text-jade-300">
                              <CheckCircle2 className="h-3 w-3" aria-hidden />
                              {c.passRate}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-300">
                              <Info className="h-3 w-3" aria-hidden />
                              {c.passRate}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{c.note}</td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-border bg-muted/60">
                      <td className="px-4 py-3 font-mono text-xs text-primary/80">Σ</td>
                      <td className="px-4 py-3 font-semibold text-foreground">Tổng cộng (10 chủ đề)</td>
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-foreground">{SAFETY_TOTAL}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">~98% trung bình</td>
                      <td className="px-4 py-3 text-muted-foreground">12 case đang xét lại trong S-08</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-4 font-sans text-editorial-caption text-muted-foreground/70">
                Mỗi prompt trong bộ safety eval đi kèm expected behavior
                (refuse, redirect, escalate) và được chạy trước mỗi release.
              </p>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
           Related — always-visible footer CTA grid + contact callout.
           ───────────────────────────────────────────────────────────── */}
        <section className="relative bg-muted/40">
          <div className="mx-auto max-w-marketing px-6 pb-20 pt-16 lg:px-12">
            <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-primary">
              <span className="mr-2 inline-block h-px w-6 bg-primary align-middle" />
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
                    className="group flex items-center gap-3 rounded-card-editorial border border-border bg-muted/40 p-4 transition-colors duration-300 ease-editorial hover:border-primary/30 hover:bg-card"
                  >
                    <Icon
                      className="h-5 w-5 shrink-0 text-primary/80"
                      aria-hidden
                    />
                    <span className="flex-1 font-sans text-sm font-semibold text-foreground">
                      {r.title}
                    </span>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-muted-foreground/70 transition-transform group-hover:translate-x-1 group-hover:text-primary"
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
                    className="text-primary/80 underline underline-offset-4 hover:text-primary"
                    href="mailto:methodology@hieu.asia"
                  >
                    methodology@hieu.asia
                  </a>
                  . Báo cáo mẫu công khai tại{' '}
                  <Link
                    href="/sample-report"
                    className="text-primary/80 underline underline-offset-4 hover:text-primary"
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
      <StickyMobileCta trackId="methodology" />
    </div>
  );
}
