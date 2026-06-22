import type * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Briefcase,
  Heart,
  Wallet,
  Activity,
  Home,
  Compass,
  Calendar,
  CheckCircle2,
  Circle,
  Lock,
  BookOpen,
  Zap,
} from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { ResultDisclaimer } from '@/components/ResultDisclaimer';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';

export const metadata: Metadata = {
  title: 'Mẫu báo cáo Tử Vi — xem trước trải nghiệm Premium',
  description:
    'Báo cáo Tử Vi mẫu công khai: 12 cung, Mệnh — Thân, đại vận, lưu niên, kế hoạch 30-60-90 ngày. Xem trước trước khi quyết định lập lá số.',
  alternates: { canonical: 'https://hieu.asia/sample-report' },
  // Wave 60.95.k P1-SEO — route-level openGraph REPLACES root-layout
  // openGraph (Next.js merge semantics), so we must re-declare `images` here
  // or Zalo/Facebook/Telegram/Slack previews render blank. Same for `twitter`.
  openGraph: {
    title: 'Mẫu báo cáo Tử Vi',
    description: 'Cẩm Nang cá nhân hoá: 12 cung + Mentor + kế hoạch hành động.',
    url: 'https://hieu.asia/sample-report',
    type: 'article',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'hieu.asia — Mẫu báo cáo Tử Vi: 12 cung + Mentor + kế hoạch 30-60-90',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mẫu báo cáo Tử Vi',
    description: 'Cẩm Nang cá nhân hoá: 12 cung + Mentor + kế hoạch hành động.',
    images: [
      {
        url: '/og-image.jpg',
        alt: 'hieu.asia — Mẫu báo cáo Tử Vi: 12 cung + Mentor + kế hoạch 30-60-90',
      },
    ],
  },
};

const PERSONA = {
  name: 'Minh Anh (demo)',
  birthSolar: '15/08/1990, 10:00',
  birthLunar: '25/06 Canh Ngọ',
  zodiac: 'Tuổi Ngọ',
  mbti: 'INTJ',
  numerology: 'Số chủ đạo 6',
};

// Mục lục 30 mục — 7 visible, 23 blur
const TOC_VISIBLE = [
  { part: 'A', label: 'LÁ SỐ — CỐT CÁCH', items: [
    { id: 'A1', name: 'Ngũ hành cục Hỏa Lục Cục — năng lượng nền tảng' },
    { id: 'A2', name: 'Mệnh chủ Phá Quân & Thân chủ Tử Vi — 2 ngôi sao chủ đạo' },
    { id: 'A3', name: 'Cách cục Tử Phủ Đồng Lương — khí chất ổn định dẫn dắt' },
    { id: 'A4', name: 'Thân cung Dần — vận hướng nửa sau cuộc đời' },
    { id: 'A5', name: 'Pha Trường Sinh hiện tại — đang ở giai đoạn bứt phá' },
  ]},
  { part: 'B', label: 'SỰ NGHIỆP & TÀI NĂNG', items: [
    { id: 'B1', name: 'Tam phương Quan Lộc — Vũ Khúc Quyền trấn giữ sự nghiệp' },
    { id: 'B2', name: 'Phong cách làm việc: chuyên gia có thẩm quyền, không hợp quản lý đám đông' },
  ]},
];

const TOC_LOCKED = [
  { id: 'B3', name: 'Top 3 lĩnh vực nghề thiên hướng theo lá số' },
  { id: 'B4', name: 'Điểm mù trong ra quyết định — từ phân tích tâm lý' },
  { id: 'B5', name: 'Thời điểm bứt phá theo đại vận — cửa sổ 3 năm tới' },
  { id: 'B6', name: 'Rủi ro sự nghiệp cần tránh (Lục Sát cung Quan Lộc)' },
  { id: 'C1', name: 'Tam phương Tài Bạch — Thiên Phủ Khoa giữ của' },
  { id: 'C2', name: 'Mô thức thu nhập hợp lá số: lương cố định hay kinh doanh?' },
  { id: 'C3', name: 'Tài vận 2026 — Tứ Hóa lưu niên tác động cung Tài Bạch' },
  { id: 'C4', name: 'Cạm bẫy tài chính cần tránh theo ngũ hành cục' },
  { id: 'C5', name: 'Giai đoạn tích lũy vs chi tiêu theo đại vận' },
  { id: 'D1', name: 'Tam phương Phu Thê — Thái Âm Thiên Đồng cung quan hệ' },
  { id: 'D2', name: 'Chân dung người phù hợp theo lá số' },
  { id: 'D3', name: 'Pattern xung đột trong quan hệ — từ tính cách cốt lõi' },
  { id: 'D4', name: 'Cung Tử Tức — vận gia đình, con cái' },
  { id: 'D5', name: 'Thời điểm thuận lợi cho chuyện hôn nhân theo vận hạn' },
  { id: 'E1', name: 'Tam phương sức khỏe — cung Tật Ách' },
  { id: 'E2', name: 'Cơ quan / hệ thống cần chú ý theo ngũ hành Hỏa Lục Cục' },
  { id: 'E3', name: 'Lục Sát cung Tật Ách — dấu hiệu cần đề phòng' },
  { id: 'E4', name: 'Mùa / giai đoạn sức khỏe cần giữ gìn' },
  { id: 'F1', name: 'Đại vận hiện tại — cung đang cai quản (35–45 tuổi)' },
  { id: 'F2', name: 'Tứ Hóa năm 2026 — sao nào được kích hoạt, ảnh hưởng thực tế' },
  { id: 'F3', name: 'Tứ Hóa đại vận — xu hướng 10 năm này' },
  { id: 'G1', name: 'Gợi ý bổ khuyết ngũ hành: màu / hướng / nghề hợp cục' },
  { id: 'G2', name: 'Kế hoạch tự-chiêm-nghiệm 30 ngày — 6 nhóm × 5 ngày' },
];

type IconType = React.ComponentType<{ className?: string }>;
const PALACE_PREVIEWS: { icon: IconType; palace: string; summary: string; insights: string[] }[] = [
  {
    icon: Sparkles,
    palace: 'Mệnh — Thân',
    summary:
      'Mệnh tại Dần có Tử Vi + Thiên Phủ (Khoa Khôi Việt). Thân đồng cung — bạn nhất quán giữa nội tâm và hành động.',
    insights: [
      'Khí chất ổn định, giữ chữ tín, có khả năng dẫn dắt nhóm nhỏ.',
      'Cần thời gian suy nghĩ trước khi quyết định — đừng để bị ép trong khủng hoảng.',
      'Khi căng thẳng, bạn dễ rút vào nội tâm thay vì bộc lộ — học cách nói ra với 1 người tin cậy.',
    ],
  },
  {
    icon: Briefcase,
    palace: 'Quan Lộc (sự nghiệp)',
    summary:
      'Vũ Khúc Hoá Quyền tại Ngọ, tam phương có Thái Dương — kỷ luật + sức ảnh hưởng.',
    insights: [
      'Hợp vai trò chuyên gia có thẩm quyền, không hợp việc lặp đi lặp lại.',
      'Giai đoạn 26–35: xây nền chuyên môn, không vội chuyển ngành.',
      'Tránh quyết định nóng vào quý 1 năm 2026 — lưu niên có Hoá Kỵ tại Quan.',
    ],
  },
  {
    icon: Wallet,
    palace: 'Tài Bạch',
    summary:
      'Thiên Phủ giữ tài, có Khoa hỗ trợ. Phong cách quản lý tiền: cẩn trọng nhưng có tích luỹ.',
    insights: [
      'Khuynh hướng tiết kiệm tự nhiên, dễ tích luỹ qua chuyên môn.',
      'Cẩn trọng với "dồn toàn lực" đầu tư — không hợp khuynh hướng tài chính của bạn.',
      'Lộ trình tài chính 2026: ưu tiên quỹ dự phòng 6 tháng trước khi mở rộng.',
    ],
  },
  {
    icon: Heart,
    palace: 'Phu Thê',
    summary:
      'Thái Âm + Thiên Đồng tại Phu Thê — kiểu gắn bó cần sự an toàn cảm xúc.',
    insights: [
      'Bạn dễ vướng người trầm tính, ít nói, có chiều sâu nội tâm.',
      'Rủi ro giao tiếp: dễ "im lặng = đồng ý" hoặc giữ trong lòng quá lâu.',
      'Điều cần học: nói ra kỳ vọng SỚM, không đợi đối phương "đoán".',
    ],
  },
  {
    icon: Compass,
    palace: 'Thiên Di',
    summary:
      'Thiên Mã + Thái Dương — cơ duyên với môi trường quốc tế và cộng đồng rộng.',
    insights: [
      'Đi xa thường mở ra cơ hội mới — không nên "đóng" mình ở một địa phương.',
      'Cẩn trọng với "say nhịp" khi ở môi trường mới — giữ thói quen kỷ luật cá nhân.',
    ],
  },
  {
    icon: Activity,
    palace: 'Tật Ách (sức khoẻ)',
    summary:
      'Cơ địa nhạy với stress hệ tiêu hoá. KHÔNG dùng để chẩn đoán bệnh — tham vấn bác sĩ khi cần.',
    insights: [
      'Thói quen cần giữ: ngủ đủ, ăn đều, vận động nhẹ mỗi ngày.',
      'Khi áp lực cao, ưu tiên giảm caffein + tăng nước.',
    ],
  },
  {
    icon: Home,
    palace: 'Điền Trạch',
    summary:
      'Thái Âm tại Điền — có thiên hướng tích luỹ bất động sản qua thời gian.',
    insights: [
      'Hợp đầu tư bất động sản dài hạn hơn lướt sóng.',
      'Mua nhà đầu tiên nên cân nhắc địa điểm yên tĩnh — phù hợp tính cách bạn.',
    ],
  },
];

const PLAN_30_60_90: { period: string; title: string; items: string[] }[] = [
  {
    period: '30 ngày',
    title: 'Củng cố vai trò chuyên môn',
    items: [
      'Liệt kê 3 việc bạn làm tốt nhất trong vai trò hiện tại — yêu cầu mở rộng phạm vi cho 2 trong số đó.',
      'Mở quỹ dự phòng đến 3 tháng chi tiêu (nếu chưa có).',
      'Đặt 1 cuộc nói chuyện với người làm cùng ngành 2 cấp trên bạn.',
    ],
  },
  {
    period: '60 ngày',
    title: 'Đánh giá môi trường',
    items: [
      'Viết tiêu chí công việc lý tưởng (5 dòng) — đánh giá công việc hiện tại theo tiêu chí đó.',
      'Hoàn tất 1 dự án có deliverable rõ — có thể show ngoài team.',
      'Tăng quỹ dự phòng lên 6 tháng.',
    ],
  },
  {
    period: '90 ngày',
    title: 'Quyết định dựa trên dữ kiện',
    items: [
      'Dựa trên 60 ngày trước, quyết định: ở lại + thương lượng vai trò mới, hay khám phá ngoài.',
      'Nếu chuyển: đã có 2-3 hướng cụ thể được người trong ngành xác nhận khả thi.',
      'Review lại Cẩm Nang này — Mentor sẽ hỏi bạn 5 câu reflection.',
    ],
  },
];

const REFLECTION_QUESTIONS = [
  'Trong 30 ngày qua, quyết định khó nhất là gì? Bạn đã quyết dựa trên dữ kiện hay cảm xúc?',
  'Có việc nào bạn đang né tránh vì sợ phản hồi tiêu cực không?',
  'Nếu bạn không có ràng buộc tài chính, bạn sẽ làm gì khác trong 6 tháng tới?',
  'Ai là 1 người bạn nên có cuộc nói chuyện thẳng thắn trong tuần này?',
  'Việc gì bạn đang trì hoãn vì "chờ đúng lúc"? Đúng lúc thực sự là khi nào?',
];

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'Mẫu báo cáo', item: 'https://hieu.asia/sample-report' },
  ],
};

const TOTAL_ITEMS = TOC_VISIBLE.reduce((s, g) => s + g.items.length, 0) + TOC_LOCKED.length;

export default function SampleReportPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />

      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(ellipse_at_top,_rgba(184,146,61,0.10)_0%,_transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(184,146,61,0.18)_0%,_transparent_55%)]"
        />

        <section className="relative mx-auto max-w-3xl px-6 pb-10 pt-6 sm:pt-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold-700">
            Mẫu báo cáo · Cẩm nang cá nhân hoá
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Xem trước trải nghiệm hieu.asia
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/85 sm:text-lg">
            Đây là báo cáo demo cho một persona giả định — không phải thông tin có thật.
            Mục đích: để bạn thấy hieu.asia trả về gì TRƯỚC khi quyết định lập lá số.
          </p>

          <div className="mt-7 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-gold/5 px-3 py-1 text-gold-700">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden /> Persona demo · không có dữ liệu thật
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1 text-muted-foreground">
              Tử Vi Bắc phái 114 sao
            </span>
          </div>

          {/* Badge kỹ thuật — trust signals */}
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <TechBadge
              icon={<Zap className="h-3.5 w-3.5" />}
              label="An sao chuẩn tiết khí"
              tooltip="Không dùng xấp xỉ tháng âm lịch — tính đúng ngày tiết khí chuyển cung"
            />
            <TechBadge
              icon={<BookOpen className="h-3.5 w-3.5" />}
              label="Đối chiếu cổ thư"
              tooltip="50 thẻ cổ thư Tử Vi + Bát Tự — mỗi nhận định ghi rõ xuất xứ, kiểm chứng được"
            />
            <TechBadge
              icon={<CheckCircle2 className="h-3.5 w-3.5" />}
              label="Múi giờ lịch sử VN"
              tooltip="Sinh trước 1975? Giờ thật của bạn khác giờ hiện tại — chúng tôi tính đúng múi giờ từng thời kỳ"
            />
            <TechBadge
              icon={<ShieldCheck className="h-3.5 w-3.5" />}
              label="Có disclaimer rõ"
              tooltip="Chúng tôi nói rõ: đây là tham khảo, không phải dự đoán số phận. Hiếm nền tảng dám nói thật điều này."
            />
          </div>
        </section>

        {/* Wave 52.1 — per-report disclaimer at top of result preview (BUG-018). */}
        <section className="relative mx-auto max-w-3xl px-6 pb-4">
          <ResultDisclaimer />
        </section>

        {/* Mục lục "Bạn sẽ nhận được" */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <div className="rounded-xl border border-gold/25 bg-gradient-to-br from-gold/[0.04] to-transparent p-5 sm:p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold-700">
              Bản Premium · {TOTAL_ITEMS} mục có tên cụ thể
            </p>
            <h2 className="mt-2 font-heading text-xl font-semibold text-foreground sm:text-2xl">
              Bạn sẽ nhận được gì?
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              7 mục đầu có preview bên dưới. Phần còn lại trong bản đầy đủ.
            </p>

            <div className="mt-5 space-y-4">
              {TOC_VISIBLE.map((group) => (
                <div key={group.part}>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-gold-700">
                    Phần {group.part} — {group.label}
                  </p>
                  <ul className="space-y-1.5">
                    {group.items.map((item) => (
                      <li key={item.id} className="flex items-start gap-2 text-sm text-foreground/85">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                        <span>
                          <span className="font-mono text-[10px] text-muted-foreground">{item.id}.</span>{' '}
                          {item.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Locked items — blurred */}
            <div className="relative mt-4">
              <ul className="space-y-1.5 blur-[3px] select-none" aria-hidden="true">
                {TOC_LOCKED.slice(0, 8).map((item) => (
                  <li key={item.id} className="flex items-start gap-2 text-sm text-foreground/60">
                    <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40" />
                    <span>
                      <span className="font-mono text-[10px] text-muted-foreground/60">{item.id}.</span>{' '}
                      {item.name}
                    </span>
                  </li>
                ))}
                <li className="flex items-start gap-2 text-sm text-muted-foreground/40">
                  <Circle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>... và {TOC_LOCKED.length - 8} mục nữa</span>
                </li>
              </ul>
              {/* Fade overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-transparent via-background/70 to-background/95">
                <div className="flex items-center gap-1.5 rounded-full border border-gold/30 bg-background/90 px-3 py-1.5 shadow-sm">
                  <Lock className="h-3.5 w-3.5 text-gold" aria-hidden />
                  <span className="text-xs font-medium text-foreground/80">
                    {TOC_LOCKED.length} mục còn lại trong bản đầy đủ
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <Button asChild size="sm">
                <Link href="/onboarding">
                  Lập lá số — xem bản đầy đủ
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Executive summary */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <Card className="border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-foreground sm:text-2xl">
                Tóm tắt 1 trang
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-foreground/85 sm:text-base">
              <div className="grid gap-2 text-xs sm:grid-cols-2">
                <Stat label="Tên" value={PERSONA.name} />
                <Stat label="Sinh" value={PERSONA.birthSolar} />
                <Stat label="Âm lịch" value={PERSONA.birthLunar} />
                <Stat label="Con giáp" value={PERSONA.zodiac} />
                <Stat label="MBTI" value={PERSONA.mbti} />
                <Stat label="Thần Số" value={PERSONA.numerology} />
              </div>
              <p className="border-l-2 border-gold/40 pl-4">
                Bạn ở giai đoạn cần củng cố vai trò chuyên môn trước khi mở rộng. Quan
                Lộc tốt + Tài Bạch cẩn trọng — không hợp dồn toàn lực đầu tư. Phu Thê cần
                học giao tiếp kỳ vọng sớm. 3 tháng tới: ưu tiên quỹ dự phòng, không
                quyết định nghề nóng vội.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 12 cung previews */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Lá số 12 cung — preview
          </h2>
          <div className="space-y-4">
            {PALACE_PREVIEWS.map((p, i) => {
              const Icon = p.icon;
              return (
                <Card key={i} className="border-border bg-card/40">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground sm:text-lg">
                      <Icon className="h-4 w-4 text-gold" aria-hidden /> {p.palace}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm leading-relaxed text-foreground/85 sm:text-base">
                      {p.summary}
                    </p>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {p.insights.map((s, j) => (
                        <li key={j} className="flex gap-2">
                          <span className="text-gold/85">·</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Preview Bát Tự — lăng kính bổ sung */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <Card className="border-dashed border-gold/30 bg-card/30">
            <CardHeader className="pb-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-gold-700">
                Trong bản đầy đủ — lăng kính Bát Tự
              </p>
              <CardTitle className="font-heading text-base text-foreground sm:text-lg">
                Bát Tự bổ sung chiều sâu tâm lý
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm leading-relaxed text-foreground/85">
                <strong className="text-foreground">Nhật Chủ Canh Kim sinh tháng Mộc</strong> — áp lực
                khắc chủ. Đại vận Quý Thủy hiện tại thông quan: cơ hội xuất hiện nhưng cần hành
                động đúng thời điểm, không chờ "hoàn hảo".
              </p>
              <p className="text-sm leading-relaxed text-foreground/85">
                Tứ trụ xác nhận xu hướng Tử Vi: <em>chuyên môn sâu hơn quản lý rộng</em> — phù
                hợp người dẫn dắt nhóm nhỏ chuyên biệt hơn là điều phối đại chúng.
              </p>
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/5 px-3 py-2">
                <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
                <p className="text-xs text-muted-foreground">
                  Chi tiết 8 mục Bát Tự (Thập Thần, Thiên Can, dụng thần, đại vận từng năm) trong bản Premium.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section Bổ Khuyết — partially visible, partially blurred */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.03]">
            <div className="p-5 sm:p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-amber-600 dark:text-amber-400">
                Mục G1 — Gợi ý bổ khuyết ngũ hành · preview 30%
              </p>
              <h2 className="mt-2 font-heading text-xl font-semibold text-foreground sm:text-2xl">
                Bổ khuyết & hành động cụ thể
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Đây là phần khách nhớ lâu nhất. Dựa trên Hỏa Lục Cục + cách cục Tử Phủ:
              </p>

              {/* Visible part */}
              <div className="mt-4 space-y-3">
                <div className="rounded-lg border border-border/50 bg-card/40 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Màu sắc hỗ trợ
                  </p>
                  <p className="mt-1 text-sm text-foreground/85">
                    <strong className="text-foreground">Trắng, bạc, vàng nhạt</strong> (Kim — hành thông
                    quan) · <strong className="text-foreground">Đen, xanh đậm</strong> (Thủy — tăng
                    lưu thông). Tránh: đỏ đậm, cam nóng (tăng Hỏa khi Hỏa đã đủ mạnh).
                  </p>
                </div>
                <div className="rounded-lg border border-border/50 bg-card/40 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Hướng làm việc tốt
                  </p>
                  <p className="mt-1 text-sm text-foreground/85">
                    <strong className="text-foreground">Tây, Tây Bắc</strong> — hướng Kim khí. Bàn làm
                    việc quay về hướng này hoặc ngồi bên trái cửa sổ hướng Tây.
                  </p>
                </div>
              </div>

              {/* Blurred part */}
              <div className="relative mt-3">
                <div className="space-y-3 blur-[4px] select-none" aria-hidden="true">
                  <div className="rounded-lg border border-border/50 bg-card/40 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Nghề hợp thiên mệnh
                    </p>
                    <p className="mt-1 text-sm text-foreground/60">
                      Tài chính, luật, cơ khí chính xác, phân tích dữ liệu — các lĩnh vực Kim tính...
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-card/40 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      3 ngày tốt tháng 7/2026
                    </p>
                    <p className="mt-1 text-sm text-foreground/60">
                      07/07 · 15/07 · 23/07 — ngày Kim Thủy vượng, hợp ký kết và...
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-card/40 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Checklist 30 ngày cụ thể
                    </p>
                    <p className="mt-1 text-sm text-foreground/60">
                      Ngày 1–5: Cung Mệnh · Ngày 6–10: Cung Quan Lộc · Ngày 11–15: Cung Tài Bạch...
                    </p>
                  </div>
                </div>
                {/* Fade overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-transparent via-background/60 to-background/90">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-background/90 px-3 py-1.5 shadow-sm">
                      <Lock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" aria-hidden />
                      <span className="text-xs font-medium text-foreground/80">
                        Mở khoá bổ khuyết đầy đủ + {TOC_LOCKED.length} mục còn lại
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button asChild size="sm">
                  <Link href="/onboarding">
                    Lập lá số của tôi
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden />
                  </Link>
                </Button>
                <Link
                  href="/pricing"
                  className="text-sm text-muted-foreground hover:text-gold"
                >
                  Xem gói &amp; giá →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Mentor sample */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            AI Mentor — đối thoại mẫu
          </h2>
          <Card className="border-border bg-card/40">
            <CardContent className="space-y-4 pt-5 text-sm leading-relaxed sm:text-base">
              <div className="rounded-lg bg-muted/5 p-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  User
                </p>
                <p className="mt-1 text-foreground/90">
                  Tôi đang phân vân giữa ở lại công ty hiện tại hoặc chuyển sang một
                  startup mới. Tôi nên làm gì?
                </p>
              </div>
              <div className="rounded-lg bg-gold/[0.06] p-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-gold-700">
                  Mentor
                </p>
                <p className="mt-1 text-foreground/85">
                  Trước khi trả lời, mình cần hỏi 2 việc: (1) Bạn có runway tài chính
                  bao nhiêu tháng nếu thu nhập giảm 30%? (2) Trong 6 tháng qua, bạn có
                  cảm thấy ngừng học ở công ty hiện tại không?
                </p>
                <p className="mt-3 text-foreground/85">
                  Lá số bạn cho thấy chủ đề năm nay là "củng cố trước khi mở rộng" —
                  Quan Lộc đang Hoá Quyền, có dấu hiệu thăng tiến nếu chờ đúng dịp.
                  Nhưng Tài Bạch không hợp rủi ro cao.
                </p>
                <p className="mt-3 text-foreground/85">
                  <strong className="text-gold-700">3 kịch bản để bạn cân nhắc:</strong>
                </p>
                <ol className="ml-4 mt-2 list-decimal space-y-1 text-foreground/85">
                  <li>Ở lại + đàm phán vai trò mới (ít rủi ro, tận dụng Quan Lộc tốt).</li>
                  <li>Tìm việc song song trong 60 ngày (kiểm chứng cơ hội trước khi nhảy).</li>
                  <li>Chuyển hẳn (chỉ chọn nếu runway ≥ 6 tháng + cơ hội đã xác minh).</li>
                </ol>
                <p className="mt-3 text-foreground/85">
                  Mình không khuyên bạn nghỉ ngay. Bước 7 ngày tới: tính runway, viết
                  5 tiêu chí công việc mới, nói chuyện với 2 người trong ngành bạn quan
                  tâm.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 30-60-90 plan */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Kế hoạch 30-60-90 ngày
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {PLAN_30_60_90.map((p, i) => (
              <Card key={i} className="border-border bg-card/40">
                <CardHeader className="pb-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-gold-700">
                    {p.period}
                  </p>
                  <CardTitle className="mt-1 font-heading text-base text-foreground">
                    {p.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {p.items.map((it, j) => (
                      <li key={j} className="flex gap-2">
                        <span className="text-gold/85">→</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Reflection */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <Card className="border-purple/30 bg-purple/[0.04]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-xl text-foreground sm:text-2xl">
                <Calendar className="h-5 w-5 text-purple-700 dark:text-purple-50" aria-hidden /> 5 câu tự phản tư
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-sm leading-relaxed text-foreground/85 sm:text-base">
                {REFLECTION_QUESTIONS.map((q, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 font-mono text-purple-700 dark:text-purple-50">
                      {String(i + 1).padStart(2, '0')}.
                    </span>
                    <span>{q}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </section>

        {/* CTA cuối */}
        <section className="relative mx-auto max-w-3xl px-6 pb-20">
          <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Báo cáo thật của bạn sẽ khác — và sâu hơn.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85 sm:text-base">
              Mẫu trên là persona giả định. Bản của bạn cá nhân hoá theo
              ngày–giờ sinh, MBTI (nếu có), và bối cảnh đời sống hiện tại. {TOTAL_ITEMS} mục được
              đặt tên cụ thể theo lá số thật — không phải template chung chung.
            </p>
            <ul className="mt-4 space-y-1.5 text-sm text-foreground/80">
              {[
                'Lưu vĩnh viễn trong tài khoản — không mất sau khi đọc',
                'Nhận toàn bộ báo cáo qua email trong 5 phút',
                'Hoàn tiền 100% trong 24 giờ nếu báo cáo chưa được tạo',
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link href="/onboarding">
                Lập lá số của tôi
              </Link></Button>
              <Button asChild size="lg" variant="outline"><Link href="/pricing">
                Xem gói
              </Link></Button>
              <Link
                href="/methodology"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
              >
                Phương pháp luận
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <StickyMobileCta trackId="sample-report" />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-heading text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function TechBadge({
  icon,
  label,
  tooltip,
}: {
  icon: React.ReactNode;
  label: string;
  tooltip: string;
}) {
  return (
    <div
      className="group relative flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/40 px-2.5 py-2 text-xs text-foreground/75 hover:border-gold/40 hover:text-foreground transition-colors cursor-default"
      title={tooltip}
    >
      <span className="text-gold" aria-hidden>{icon}</span>
      <span className="leading-tight">{label}</span>
      {/* Tooltip */}
      <div
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-0 z-10 mb-1.5 w-56 rounded-lg border border-border bg-background p-2.5 text-xs leading-relaxed text-foreground/80 opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
      >
        {tooltip}
      </div>
    </div>
  );
}
