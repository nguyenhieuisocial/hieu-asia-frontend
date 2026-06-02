import Link from 'next/link';
import { ArrowRight, Compass, Brain, Sparkles, BookOpen } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { ItalicSpan } from '@/components/marketing/ItalicSpan';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { MbtiTool } from '@/components/tools/MbtiTool';

/**
 * Wave 60.95.u P1 (vault 130 P1) — /mbti audience landing.
 *
 * Editorial discipline overview (not a tool/quiz page). Brand voice: calm,
 * warm, honest framing. MBTI is positioned as a "language to recognize inner
 * tendencies", NOT scientifically validated psychology — matching the
 * existing BentoLens copy on src/app/page.tsx:595 ("không nhãn dán, mà là
 * ngôn ngữ để nhận diện thiên hướng nội tại").
 *
 * Companion to /tu-vi, /than-so-hoc, /methodology audience routes.
 */

const AXES: { id: string; left: string; right: string; pitch: string }[] = [
  {
    id: 'ei',
    left: 'Extraversion (E)',
    right: 'Introversion (I)',
    pitch: 'Nguồn năng lượng: từ tương tác bên ngoài hay từ phản tư bên trong.',
  },
  {
    id: 'ns',
    left: 'iNtuition (N)',
    right: 'Sensing (S)',
    pitch: 'Cách nạp thông tin: ưu tiên mẫu hình & khả năng hay chi tiết & sự kiện.',
  },
  {
    id: 'tf',
    left: 'Thinking (T)',
    right: 'Feeling (F)',
    pitch: 'Cách ra quyết định: dựa logic & nhất quán hay dựa giá trị & ảnh hưởng đến người.',
  },
  {
    id: 'jp',
    left: 'Judging (J)',
    right: 'Perceiving (P)',
    pitch: 'Cách tổ chức đời sống: thích kế hoạch & kết luận hay thích linh hoạt & mở.',
  },
];

const LENS_INTEGRATION: { title: string; body: string }[] = [
  {
    title: 'MBTI · ngôn ngữ tâm lý',
    body: 'Gọi tên thiên hướng nhận thức và ra quyết định bằng từ vựng hiện đại — dễ chia sẻ, dễ phản tư.',
  },
  {
    title: 'Tử Vi · bản đồ thiên hướng',
    body: '12 cung mô tả lĩnh vực sống và động lực cốt lõi theo giờ sinh — chiều sâu mà MBTI không đo.',
  },
  {
    title: 'Bát Tự · ngũ hành cá nhân',
    body: 'Tương quan Kim-Mộc-Thuỷ-Hoả-Thổ trong tứ trụ — gợi ý khí chất và mùa của đời.',
  },
  {
    title: 'Thần Số Học · chu kỳ thời gian',
    body: 'Đường đời và năm cá nhân — đưa MBTI vào nhịp thời gian, không chỉ là chân dung tĩnh.',
  },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Tôi đã làm test MBTI ở chỗ khác — có cần làm lại không?',
    a: 'Không bắt buộc. Nếu bạn đã có kết quả 4 chữ (vd: INFJ, ENTP), hieu.asia có thể đọc trực tiếp kết quả đó vào báo cáo. Khi onboarding, bạn được chọn nhập sẵn 4 chữ hoặc làm khảo sát ngắn để hệ thống ước lượng — tuỳ bạn.',
  },
  {
    q: 'Kết quả MBTI có thay đổi theo thời gian không?',
    a: 'Có thể, đặc biệt ở các trục trung bình (gần 50/50). Bản thân MBTI là tự thuật (self-report), nên tâm trạng, giai đoạn đời, môi trường công việc đều có thể đẩy kết quả lệch một trục. Vì vậy hieu.asia coi MBTI là điểm khởi đầu để tự phản tư, không phải nhãn cố định.',
  },
  {
    q: 'MBTI có "khoa học" như tâm lý học chính thống không?',
    a: 'MBTI là một khung tự nhận diện (framework for self-recognition) được dùng rộng rãi trong huấn luyện và phát triển cá nhân, không phải công cụ chẩn đoán lâm sàng. Cộng đồng tâm lý học hàn lâm còn tranh luận về độ tin cậy đo lường. hieu.asia dùng MBTI như một ngôn ngữ — không tuyên bố nó "đúng tuyệt đối".',
  },
];

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'MBTI', item: 'https://hieu.asia/mbti' },
  ],
};

const WEBPAGE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'MBTI — 16 kiểu tâm trí',
  description:
    'MBTI tại hieu.asia: 4 trục, 16 kiểu, một ngôn ngữ tự nhận diện thiên hướng — kết hợp với Tử Vi, Bát Tự, Thần Số Học qua AI Mentor.',
  url: 'https://hieu.asia/mbti',
  inLanguage: 'vi-VN',
  isPartOf: {
    '@type': 'WebSite',
    name: 'hieu.asia',
    url: 'https://hieu.asia',
  },
};

// Wave 60.96.4 — FAQPage JSON-LD mirrors visible FAQ accordion. MBTI FAQ
// strings are already plain text (vs bat-tu which uses JSX <em>), so the
// schema text can mirror the source FAQ array directly.
const FAQ_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: f.a,
    },
  })),
};

export default function MbtiHubPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBPAGE_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
      />

      <main id="main-content" className="relative">
        {/* Hero */}
        <section className="bg-background px-6 py-12 pt-24 md:py-20">
          <div className="mx-auto max-w-marketing-tight">
            <p className="mb-6 font-mono text-eyebrow uppercase tracking-[0.12em] text-gold-700">
              <span className="mr-2 inline-block h-px w-6 bg-gold align-middle" />
              MBTI · TÂM LÝ HỌC
            </p>
            <h1 className="font-sans text-hero-display font-bold tracking-tight text-foreground">
              MBTI — 16 kiểu, 4 trục,{' '}
              <ItalicSpan>một bản đồ tâm trí</ItalicSpan>
              <span className="text-gold-dot">.</span>
            </h1>
            <p className="mt-8 max-w-marketing-text text-pretty font-sans text-lg leading-relaxed text-muted-foreground">
              MBTI tại hieu.asia không phải bài test để dán nhãn bạn. Đây là một ngôn
              ngữ để <ItalicSpan>gọi tên</ItalicSpan> thiên hướng nội tại — cách bạn nạp năng lượng, xử lý
              thông tin, ra quyết định, tổ chức đời sống — để cuộc đối thoại với chính
              mình trở nên rõ ràng hơn.
            </p>

            <nav
              aria-label="Breadcrumb"
              className="mt-10 font-mono text-eyebrow uppercase tracking-[0.12em] text-muted-foreground/70"
            >
              <Link href="/" className="hover:text-gold-soft">
                Trang chủ
              </Link>
              <span className="mx-2">/</span>
              <span className="text-muted-foreground">MBTI</span>
            </nav>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="#mbti-test">Làm bài test MBTI →</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/methodology">Phương pháp luận</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* MBTI test tool — quiz → 4-letter type → deep reading */}
        <section id="mbti-test" className="scroll-mt-24 bg-background px-6 pb-6 md:pb-10">
          <div className="mx-auto max-w-marketing-tight">
            <div className="mb-6 flex items-center gap-3">
              <Compass className="h-5 w-5 text-gold" aria-hidden />
              <h2 className="font-sans text-section-display font-bold tracking-tight text-foreground">
                Làm bài test — <ItalicSpan>16 câu, khoảng 4 phút</ItalicSpan>
              </h2>
            </div>
            <p className="mb-8 max-w-marketing-text font-sans text-base leading-relaxed text-muted-foreground">
              Trả lời theo thang đồng ý để hệ thống ước lượng 4 trục, ra kiểu của bạn, rồi đọc một bản
              luận giải sâu cá nhân hoá. Kết quả là điểm khởi đầu để tự phản tư — không phải nhãn cố định.
            </p>
            <MbtiTool />
          </div>
        </section>

        {/* What it is — 4 axes */}
        <section className="bg-background px-6 py-12 md:py-16">
          <div className="mx-auto max-w-marketing-tight">
            <div className="mb-6 flex items-center gap-3">
              <Compass className="h-5 w-5 text-gold" aria-hidden />
              <h2 className="font-sans text-section-display font-bold tracking-tight text-foreground">
                4 trục nhị phân, 16 kiểu kết hợp
              </h2>
            </div>
            <p className="max-w-marketing-text font-sans text-base leading-relaxed text-muted-foreground">
              MBTI (Myers-Briggs Type Indicator) phân tâm trí theo bốn trục đối lập.
              Mỗi trục cho một chữ — bốn chữ ghép lại thành một trong 16 kiểu (INFJ,
              ENTP, ISFP…). Không có kiểu &quot;tốt&quot; hay &quot;xấu&quot; — chỉ có
              khác biệt về thiên hướng.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {AXES.map((axis) => (
                <div
                  key={axis.id}
                  className="rounded-xl border border-border bg-muted/40 p-5"
                >
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-gold-soft">
                    <span>{axis.left}</span>
                    <span className="text-muted-foreground/70">·</span>
                    <span>{axis.right}</span>
                  </div>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">
                    {axis.pitch}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How hieu.asia uses it */}
        <section className="bg-muted/40 px-6 py-12 md:py-16">
          <div className="mx-auto max-w-marketing-tight">
            <div className="mb-6 flex items-center gap-3">
              <Brain className="h-5 w-5 text-gold" aria-hidden />
              <h2 className="font-sans text-section-display font-bold tracking-tight text-foreground">
                hieu.asia <ItalicSpan>kết hợp</ItalicSpan> MBTI với 3 ống kính khác
              </h2>
            </div>
            <p className="max-w-marketing-text font-sans text-base leading-relaxed text-muted-foreground">
              MBTI một mình là một chân dung tâm lý hiện đại. Khi đặt cạnh Tử Vi, Bát
              Tự, Thần Số Học — mỗi ống kính trả lời một câu hỏi khác về cùng một con
              người. AI Mentor đối chiếu cả bốn để gợi ý hành động cụ thể, chứ không
              chỉ đọc nhãn.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {LENS_INTEGRATION.map((lens) => (
                <div
                  key={lens.title}
                  className="rounded-xl border border-border bg-background p-5"
                >
                  <h3 className="font-sans text-base font-semibold text-foreground">
                    {lens.title}
                  </h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
                    {lens.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MBTI vs Eastern systems — honest framing */}
        <section className="bg-background px-6 py-12 md:py-16">
          <div className="mx-auto max-w-marketing-tight">
            <div className="mb-6 flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-gold" aria-hidden />
              <h2 className="font-sans text-section-display font-bold tracking-tight text-foreground">
                MBTI và chiêm tinh Đông phương — khác chỗ nào?
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-muted/40 p-5">
                <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-gold-soft">
                  MBTI
                </p>
                <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">
                  Là <ItalicSpan>tự thuật tâm lý</ItalicSpan> — bạn trả lời câu hỏi, hệ thống suy ra kiểu.
                  Phản ánh cách bạn <em>nghĩ</em> về mình ở thời điểm trả lời. Không
                  phải định mệnh, có thể trôi theo giai đoạn đời.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-5">
                <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-gold-soft">
                  Tử Vi · Bát Tự
                </p>
                <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">
                  Dựa trên <ItalicSpan>thời điểm sinh</ItalicSpan> — engine deterministic lập lá số từ ngày
                  giờ sinh, không thay đổi theo tâm trạng. Cho chiều sâu lịch sử và
                  bối cảnh văn hoá mà MBTI không có.
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-marketing-text font-sans text-sm italic leading-relaxed text-muted-foreground/70">
              Cả hai đều là ống kính — không phải đáp án. hieu.asia ghép chúng lại để
              bạn nhìn mình từ nhiều phía, rồi tự quyết định.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-muted/40 px-6 py-12 md:py-16">
          <div className="mx-auto max-w-marketing-tight">
            <div className="mb-6 flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-gold" aria-hidden />
              <h2 className="font-sans text-section-display font-bold tracking-tight text-foreground">
                Câu hỏi thường gặp
              </h2>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {FAQ.map((f, i) => (
                <AccordionItem key={f.q} value={`mbti-faq-${i}`}>
                  <AccordionTrigger className="text-left font-sans text-base font-medium text-foreground">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="font-sans leading-relaxed text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/onboarding?intent=mbti">
                  Bắt đầu với MBTI
                  <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Link
                href="/methodology"
                className="inline-flex items-center text-sm text-muted-foreground/70 hover:text-gold-soft"
              >
                Cách AI luận giải
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <StickyMobileCta href="/onboarding?intent=mbti" trackId="mbti" />
    </div>
  );
}
