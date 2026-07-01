import Link from 'next/link';
import { ArrowRight, Columns3, Flame, Sparkles } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { ItalicSpan } from '@/components/marketing/ItalicSpan';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { FaqAccordion, type FaqItem } from '@/components/home/FaqAccordion';

/**
 * Wave 60.95.u P1 — /bat-tu audience landing page (vault 130 P1).
 *
 * Marketing landing for the Bát Tự discipline. Not a tool route — converts
 * to /onboarding?intent=ngu-hanh (IntentChips slug from home page L444).
 * For the deep encyclopedic explanation see /methodology/bat-tu; for the
 * standalone tool entrypoint see /learn/bat-tu.
 *
 * Mirrors /tu-vi audience hub structure (SiteNav + JSON-LD + breadcrumb +
 * hero + content sections + Faq) but with Option D/E editorial primitives
 * (ItalicSpan, brand tokens text-cream-* / bg-warm-dark-*). Stays inside
 * the warm-dark editorial system locked in vault 108.
 */

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'Bát Tự', item: 'https://hieu.asia/bat-tu' },
  ],
};

const WEBPAGE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://hieu.asia/bat-tu',
  url: 'https://hieu.asia/bat-tu',
  name: 'Bát Tự — Tám chữ định hình bạn',
  description:
    'Bát Tự (Tứ Trụ) đọc bản đồ ngũ hành từ 8 chữ năm-tháng-ngày-giờ. hieu.asia kết hợp engine deterministic và AI để đối chiếu 4 trường phái.',
  inLanguage: 'vi-VN',
  isPartOf: { '@type': 'WebSite', name: 'hieu.asia', url: 'https://hieu.asia' },
};

// Wave 60.96.4 — FAQPage JSON-LD mirrors the visible <FaqAccordion> below.
// JSX answers above use <em> + <Link> for visual hierarchy; the schema needs
// plain-text equivalents, so we write parallel strings here. Schema.org spec:
// answers ≤ ~300 chars rank best in Google rich results.
const FAQ_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Bát Tự khác Tử Vi thế nào?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tử Vi đọc qua hệ thống sao trên 12 cung. Bát Tự đọc qua quan hệ ngũ hành và thập thần giữa 4 trụ. Tử Vi mạnh ở chi tiết lĩnh vực (sự nghiệp, hôn nhân, tài chính); Bát Tự mạnh ở cân bằng năng lượng tổng thể. hieu.asia đọc cả hai để đối chiếu chéo kết luận.',
      },
    },
    {
      '@type': 'Question',
      name: 'Có cần biết giờ sinh chính xác không?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Có, càng chính xác càng tốt. Trụ giờ quyết định hậu vận và nhật can ổn định khi giờ rõ. Nếu chỉ biết khoảng (sáng/trưa/chiều/tối), hieu.asia vẫn lập được 3 trụ chính với confidence thấp hơn cho phần liên quan giờ. Sinh quanh 23:00–01:00 cần xác định kỹ.',
      },
    },
    {
      '@type': 'Question',
      name: 'Bát Tự ở hieu.asia có phải bản hoàn chỉnh chưa?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Engine đang ở trạng thái beta: tính được 4 trụ, thập thần và ngũ hành mệnh nạp âm, đóng vai trò lớp đối chiếu phụ với Tử Vi — chưa tự sinh kết luận Bát Tự thuần. Khi đạt 100 lá số được chuyên gia kiểm chứng thì engine chuyển sang bản chính thức.',
      },
    },
  ],
};

const PILLARS: { name: string; role: string }[] = [
  { name: 'Trụ năm', role: 'Tổ tiên, bối cảnh sinh — gốc rễ.' },
  { name: 'Trụ tháng', role: 'Cha mẹ, anh chị — thân tộc gần.' },
  { name: 'Trụ ngày', role: 'Bản thân (nhật can) — trung tâm lá số.' },
  { name: 'Trụ giờ', role: 'Con cái, hậu vận — phái sinh.' },
];

const FAQ: readonly FaqItem[] = [
  {
    q: 'Bát Tự khác Tử Vi thế nào?',
    a: (
      <>
        Tử Vi đọc qua hệ thống <em>sao</em> trên <em>12 cung</em>. Bát Tự đọc qua{' '}
        <em>quan hệ ngũ hành</em> + <em>thập thần</em> giữa 4 trụ. Tử Vi mạnh ở chi tiết lĩnh
        vực (sự nghiệp, hôn nhân, tài chính); Bát Tự mạnh ở cân bằng năng lượng tổng thể. Hai
        hệ bổ sung cho nhau — hieu.asia đọc cả hai để đối chiếu chéo kết luận, không nhân danh
        một hệ duy nhất.
      </>
    ),
  },
  {
    q: 'Có cần biết giờ sinh chính xác không?',
    a: (
      <>
        Có, càng chính xác càng tốt. Trụ giờ quyết định <em>hậu vận</em> và <em>nhật can</em>{' '}
        ổn định khi giờ rõ. Nếu chỉ biết khoảng (sáng/trưa/chiều/tối), hieu.asia vẫn lập được
        3 trụ chính + đưa ra mức độ tin cậy thấp hơn cho phần liên quan giờ. Sinh quanh giao
        thời tý/sửu (23:00–01:00) cần xác định kỹ — engine sẽ hỏi rõ ở onboarding.
      </>
    ),
  },
  {
    q: 'Bát Tự ở hieu.asia có phải bản hoàn chỉnh chưa?',
    a: (
      <>
        Engine đang ở trạng thái <em>beta</em>: tính được 4 trụ, thập thần và ngũ hành mệnh
        nạp âm, đóng vai trò lớp đối chiếu phụ với Tử Vi — chưa tự sinh kết luận Bát Tự
        thuần. Khi đạt 100 lá số được chuyên gia kiểm chứng thì engine chuyển sang bản chính
        thức. Xem{' '}
        <Link href="/methodology/bat-tu" className="text-gold hover:text-gold-soft">
          /methodology/bat-tu
        </Link>{' '}
        để biết chi tiết.
      </>
    ),
  },
];

export default function BatTuLandingPage() {
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

      <main id="main-content" className="relative pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden bg-background pt-6 pb-16 md:pt-8 md:pb-20 lg:pb-24">
          <div className="relative mx-auto max-w-marketing px-6 lg:px-12">
            <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground/70">
              <Link href="/" className="hover:text-gold">
                Trang chủ
              </Link>
              <span className="mx-1.5">/</span>
              <span>Bát Tự</span>
            </nav>

            <p className="mb-8 flex flex-wrap items-center gap-x-3 font-mono text-eyebrow uppercase text-gold-700">
              <span className="inline-block h-px w-6 bg-gold align-middle" />
              Bát Tự · Tứ Trụ · 八字
            </p>

            <h1 className="text-balance font-sans text-hero-display font-bold tracking-tight text-foreground">
              Bát Tự — Tám chữ <ItalicSpan goldDotAfter>định hình bạn</ItalicSpan>
            </h1>

            <p className="mt-8 max-w-marketing-text text-pretty text-lg leading-relaxed text-muted-foreground">
              Bát Tự đọc bản đồ ngũ hành từ tám chữ Thiên Can + Địa Chi của năm-tháng-ngày-giờ
              sinh. hieu.asia kết hợp engine tính xác định (cùng dữ liệu vào luôn cho cùng kết
              quả) tính 4 trụ + thập thần với AI Mentor
              đối chiếu cùng Tử Vi, MBTI, Big Five và Xem Tướng — để bạn ra quyết định, không
              phải để phán mệnh.
            </p>

            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link
                href="/onboarding?intent=ngu-hanh"
                className="inline-flex items-center justify-center rounded-pill bg-gold px-7 py-4 font-sans text-sm font-medium text-ink transition-all duration-300 ease-editorial hover:bg-gold-soft"
              >
                Xem Bát Tự của tôi
              </Link>
              <Link
                href="/methodology/bat-tu"
                className="inline-flex items-center justify-center rounded-pill border border-border px-7 py-4 font-sans text-sm font-medium text-foreground transition-all duration-300 ease-editorial hover:border-border/80 hover:bg-card"
              >
                Phương pháp luận
              </Link>
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground/70 sm:ml-2">
                Engine beta · đối chiếu với Tử Vi
              </span>
            </div>
          </div>
        </section>

        {/* What it is */}
        <section className="relative bg-muted/40 py-16 md:py-20">
          <div className="mx-auto max-w-marketing-tight px-6">
            <p className="mb-4 font-mono text-eyebrow uppercase tracking-[0.12em] text-gold-700">
              — Bát Tự là gì
            </p>
            <h2 className="text-balance font-sans text-section-display font-bold tracking-tight text-foreground">
              Tám chữ, bốn trụ, năm <ItalicSpan>nguyên tố</ItalicSpan>
            </h2>

            <div className="mt-8 grid gap-6 text-base leading-relaxed text-muted-foreground md:grid-cols-2">
              <p>
                Bát Tự (八字, nghĩa đen "tám chữ") lấy năm-tháng-ngày-giờ sinh, mỗi mốc một
                cặp Thiên Can + Địa Chi — tổng cộng 4 trụ × 2 chữ = 8 chữ. Mỗi chữ mang một
                trong năm hành Kim, Mộc, Thủy, Hỏa, Thổ; tỉ lệ và quan hệ tương sinh - tương
                khắc giữa chúng dệt nên bản đồ năng lượng cốt lõi.
              </p>
              <p>
                Khác Tử Vi (đọc sao trên 12 cung), Bát Tự đọc qua quan hệ ngũ hành và{' '}
                <em>thập thần</em> — 10 vai trò xã hội tính từ trụ ngày (Tỉ Kiên, Kiếp Tài,
                Thực Thần, Thương Quan, Chính Tài, Thiên Tài, Chính Quan, Thất Sát, Chính Ấn,
                Thiên Ấn). Hệ này hợp với câu hỏi cân bằng năng lượng tổng thể hơn là chi tiết
                từng lĩnh vực.
              </p>
            </div>

            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {PILLARS.map((p) => (
                <li
                  key={p.name}
                  className="flex gap-3 rounded-card-editorial border border-border bg-card p-5"
                >
                  <Columns3 className="mt-0.5 size-5 shrink-0 text-gold-soft" strokeWidth={1.5} aria-hidden />
                  <div>
                    <p className="font-sans text-base font-semibold text-foreground">{p.name}</p>
                    <p className="mt-1 font-sans text-sm leading-relaxed text-muted-foreground">{p.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* How hieu.asia analyzes it */}
        <section className="relative bg-background py-16 md:py-20">
          <div className="mx-auto max-w-marketing-tight px-6">
            <p className="mb-4 font-mono text-eyebrow uppercase tracking-[0.12em] text-gold-700">
              — Cách hieu.asia đọc
            </p>
            <h2 className="text-balance font-sans text-section-display font-bold tracking-tight text-foreground">
              Một lá số, <ItalicSpan>năm ống kính</ItalicSpan>
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-card-editorial border border-border bg-card p-6">
                <Flame className="size-6 text-gold-soft" strokeWidth={1.5} aria-hidden />
                <h3 className="mt-4 font-sans text-lg font-semibold text-foreground">
                  Engine tính 4 trụ
                </h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
                  Tính xác định: Can-Chi, thập thần, ngũ hành mệnh nạp âm, tiết khí. Cùng dữ
                  liệu vào luôn cho cùng kết quả.
                </p>
              </div>
              <div className="rounded-card-editorial border border-border bg-card p-6">
                <Sparkles className="size-6 text-gold-soft" strokeWidth={1.5} aria-hidden />
                <h3 className="mt-4 font-sans text-lg font-semibold text-foreground">
                  AI đối chiếu chéo
                </h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
                  Nếu Tử Vi cho thấy chủ đề Tài Bạch và Bát Tự cho thấy thiếu Chính Tài →
                  độ tin cậy tăng. Không có thì giảm.
                </p>
              </div>
              <div className="rounded-card-editorial border border-gold/40 bg-card p-6">
                <ArrowRight className="size-6 text-gold" strokeWidth={1.5} aria-hidden />
                <h3 className="mt-4 font-sans text-lg font-semibold text-foreground">
                  Bạn quyết định
                </h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
                  Báo cáo kết thúc bằng kế hoạch hành động + câu hỏi tự phản tư, không phải
                  lời tiên tri.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sample insight */}
        <section className="relative bg-muted/40 py-16 md:py-20">
          <div className="mx-auto max-w-marketing-tight px-6">
            <p className="mb-4 font-mono text-eyebrow uppercase tracking-[0.12em] text-gold-700">
              — Một đoạn đọc Bát Tự nghe thế nào
            </p>
            <blockquote className="mt-6 border-l-2 border-gold/50 pl-6 font-marketing-display text-xl leading-relaxed text-foreground md:text-2xl">
              <p>
                "Nhật can Giáp Mộc sinh tháng Thân — Kim vượng khắc Mộc. Bạn cần Thủy để hoá
                Kim sinh Mộc; điều đó đọc thành xu hướng tìm cố vấn, học vấn, môi trường ôn
                hoà thay vì cạnh tranh trực diện."
              </p>
              <p className="mt-4">
                "Thập thần đậm Thương Quan + Thực Thần — bạn diễn đạt mạnh, sáng tạo, nhưng dễ
                căng với cấp trên (khắc Quan). Mẫu này hợp công việc chuyên môn hơn quản lý
                trực tiếp."
              </p>
              <footer className="mt-6 font-sans text-sm font-normal text-muted-foreground/70">
                — Trích mẫu báo cáo Bát Tự, đối chiếu cùng Tử Vi cung Quan Lộc + Tài Bạch.
              </footer>
            </blockquote>
          </div>
        </section>

        {/* CTA */}
        <section className="relative bg-background py-16 md:py-20">
          <div className="mx-auto max-w-marketing-tight px-6 text-center">
            <h2 className="text-balance font-sans text-section-display font-bold tracking-tight text-foreground">
              Đọc <ItalicSpan goldDotAfter>tám chữ</ItalicSpan> của bạn
            </h2>
            <p className="mx-auto mt-6 max-w-marketing-text text-pretty text-base leading-relaxed text-muted-foreground">
              Onboarding 5 phút. Engine tính 4 trụ, AI đối chiếu cùng Tử Vi, MBTI, Big Five và
              Xem Tướng — bạn đọc lá số đầy đủ trước khi xem luận giải.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/onboarding?intent=ngu-hanh"
                className="inline-flex items-center justify-center rounded-pill bg-gold px-7 py-4 font-sans text-sm font-medium text-ink transition-all duration-300 ease-editorial hover:bg-gold-soft"
              >
                Bắt đầu — miễn phí cốt lõi
              </Link>
              <Link
                href="/sample-report"
                className="inline-flex items-center text-sm text-muted-foreground/70 hover:text-gold"
              >
                Xem mẫu báo cáo
                <ArrowRight className="ml-1 size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FaqAccordion
          items={FAQ}
          id="bat-tu-faq"
          eyebrow="Câu hỏi thường gặp"
          title={
            <>
              Trước khi bạn{' '}
              <span className="bg-gold-gradient bg-clip-text text-transparent">đọc lá số</span>
            </>
          }
        />
        <div className="mx-auto max-w-6xl px-6 pb-12">
          <RelatedTools current="/bat-tu" />
        </div>
      </main>
      <SiteFooter />
      <StickyMobileCta href="/onboarding?intent=ngu-hanh" trackId="bat-tu" />
    </div>
  );
}
