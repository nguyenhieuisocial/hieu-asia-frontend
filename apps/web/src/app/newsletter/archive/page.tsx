/**
 * /newsletter/archive — static archive of past newsletter issues.
 *
 * Wave 60.95.i P2 (vault 130 §11 Creative Director audit): the home
 * NewsletterSignup advertises "mỗi tuần một bài" but offered no proof.
 * This page surfaces 5 sample past issues so the cadence claim is grounded
 * — premium positioning needs evidence, not promises.
 *
 * Pure server component. Sample copy is hand-written calm-editorial
 * Vietnamese, matching the brand voice (no "magic"/"tiên tri"/"định mệnh").
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { NewsletterSignup } from '@/components/home/NewsletterSignup';

export const metadata: Metadata = {
  title: 'Lưu trữ Newsletter',
  description:
    'Đọc các bài tuần đã xuất bản — tự nhận thức, ra quyết định, ngôn ngữ cổ học hiện đại.',
  alternates: { canonical: 'https://hieu.asia/newsletter/archive' },
  // Wave 60.96.3 — root-layout openGraph is replaced when a route declares its
  // own block. Without `images`, social preview cards (Zalo/FB/Telegram/Slack)
  // render blank for the archive page even though /newsletter has its own.
  openGraph: {
    title: 'Lưu trữ Newsletter — hieu.asia',
    description:
      'Đọc các bài tuần đã xuất bản — tự nhận thức, ra quyết định, ngôn ngữ cổ học hiện đại.',
    url: 'https://hieu.asia/newsletter/archive',
    type: 'website',
    locale: 'vi_VN',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'hieu.asia — Newsletter: mỗi tuần một bài calm-editorial',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lưu trữ Newsletter — hieu.asia',
    description: 'Bản tin tuần: tự nhận thức, ra quyết định, ngôn ngữ cổ học hiện đại.',
    images: [
      {
        url: '/og-image.jpg',
        alt: 'hieu.asia — Newsletter calm-editorial',
      },
    ],
  },
};

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'Newsletter', item: 'https://hieu.asia/newsletter' },
    { '@type': 'ListItem', position: 3, name: 'Lưu trữ', item: 'https://hieu.asia/newsletter/archive' },
  ],
};

interface Issue {
  slug: string;
  date: string; // ISO date
  dateLabel: string; // Vietnamese display
  title: string;
  preview: string;
}

/**
 * Hand-written sample issues — calm-editorial register, no fortune-telling
 * language. Topics span reflection, Tử Vi method, Bát Tự psychology, MBTI
 * personas, and methodology framing.
 */
const ISSUES: Issue[] = [
  {
    slug: 'cau-hoi-toi-nen-lam-gi-chua-ro',
    date: '2026-05-20',
    dateLabel: '20 tháng 5, 2026',
    title: "Khi câu hỏi “tôi nên làm gì?” chưa rõ",
    preview:
      'Phần lớn quyết định khó khăn không phải vì thiếu thông tin, mà vì câu hỏi đặt ra chưa đúng. Bài tuần này gợi ý ba bước viết lại câu hỏi trước khi đi tìm câu trả lời — và lý do vì sao lá số chỉ hữu ích sau bước này.',
  },
  {
    slug: 'dai-van-chon-nam-sua-doi',
    date: '2026-05-13',
    dateLabel: '13 tháng 5, 2026',
    title: '4 cách dùng đại vận để chọn năm sửa đổi',
    preview:
      'Đại vận không phải lịch tốt-xấu. Nó là khung 10 năm để bạn biết khi nào năng lượng tự nhiên đỡ bạn, khi nào bạn phải tự đẩy. Bốn cách đọc thực tế: chọn năm khởi sự, năm chuyển nghề, năm gửi đề xuất lớn, và năm chỉ nên giữ nguyên.',
  },
  {
    slug: 'bat-tu-thieu-hoa-khong-thieu-may-man',
    date: '2026-05-06',
    dateLabel: '6 tháng 5, 2026',
    title: "Bát Tự ngũ hành: khi “thiếu Hỏa” không có nghĩa thiếu may mắn",
    preview:
      'Người mới đọc Bát Tự thường lo lắng khi nghe “mệnh thiếu hành X”. Thực tế, một hành thiếu chỉ nói về phong cách ứng xử tự nhiên — không phải về kết quả cuộc đời. Bài này phân biệt giữa cấu trúc lá số và lựa chọn hằng ngày.',
  },
  {
    slug: 'infp-lam-chu-doanh-nghiep-3-bay',
    date: '2026-04-29',
    dateLabel: '29 tháng 4, 2026',
    title: 'MBTI INFP làm chủ doanh nghiệp — 3 bẫy phổ biến',
    preview:
      'INFP khởi nghiệp với ý tưởng đẹp, giá trị rõ, và rất nhiều năng lượng đầu kỳ. Ba bẫy hay gặp: định giá thấp vì sợ “thương mại hoá”, từ chối uỷ quyền, và viết lại kế hoạch khi cảm xúc xuống. Cách nhận biết sớm và quyết định ngược.',
  },
  {
    slug: 'la-so-nhu-ban-do',
    date: '2026-04-22',
    dateLabel: '22 tháng 4, 2026',
    title: 'Đọc lá số như đọc bản đồ, không như đọc lời tiên đoán',
    preview:
      'Một lá số tốt cho biết địa hình bạn đang đi: dốc ở đâu, sông ở đâu, đoạn nào đi nhanh được. Nó không cho biết bạn sẽ tới đâu — vì bạn vẫn là người chọn đường. Bài viết về cách dùng lá số làm công cụ ra quyết định thay vì công cụ dự báo.',
  },
];

const SITE_URL = 'https://hieu.asia';

function buildJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Newsletter hieu.asia',
    description:
      'Bản tin tuần về tự nhận thức, ra quyết định, và cổ học ứng dụng hiện đại.',
    url: `${SITE_URL}/newsletter/archive`,
    inLanguage: 'vi-VN',
    publisher: {
      '@type': 'Organization',
      name: 'hieu.asia',
      url: SITE_URL,
    },
    blogPost: ISSUES.map((issue) => ({
      '@type': 'BlogPosting',
      headline: issue.title,
      datePublished: issue.date,
      description: issue.preview,
      inLanguage: 'vi-VN',
      url: `${SITE_URL}/newsletter/archive#${issue.slug}`,
      author: { '@type': 'Organization', name: 'hieu.asia' },
    })),
  };
}

export default function NewsletterArchivePage() {
  const jsonLd = buildJsonLd();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="main-content" className="mx-auto max-w-3xl px-6 py-20 sm:py-24">
        <header className="mb-12 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-gold/80">
            Newsletter · lưu trữ
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold leading-tight sm:text-5xl">
            Lưu trữ{' '}
            <span className="bg-gold-gradient bg-clip-text text-transparent">
              Newsletter
            </span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Mỗi tuần một bài viết ngắn. Dưới đây là các số đã xuất bản gần đây
            — để bạn biết trước nội dung và phong cách trước khi đăng ký.
          </p>
        </header>

        <section aria-labelledby="archive-heading" className="space-y-5">
          <h2 id="archive-heading" className="sr-only">
            Các số đã xuất bản
          </h2>
          {ISSUES.map((issue) => (
            <article
              key={issue.slug}
              id={issue.slug}
              className="rounded-2xl border border-gold/15 bg-card/60 p-6 transition-colors hover:border-gold/30 sm:p-8"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 text-gold/70" aria-hidden="true" />
                <time dateTime={issue.date} className="font-mono tracking-wide">
                  {issue.dateLabel}
                </time>
              </div>
              <h3 className="mt-3 font-heading text-xl font-semibold leading-snug text-foreground sm:text-2xl">
                {issue.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {issue.preview}
              </p>
            </article>
          ))}
        </section>

        <div className="mt-10 rounded-xl border border-gold/15 bg-gold/[0.04] p-5 text-sm text-muted-foreground sm:text-base">
          <p>
            Đây là các bài mẫu tiêu biểu. Toàn bộ kho lưu trữ sẽ được mở dần
            theo từng số phát hành.
          </p>
        </div>

        <section className="mt-16">
          <div className="mb-6 max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-gold/80">
              Tiếp theo
            </p>
            <h2 className="mt-3 font-heading text-2xl font-semibold leading-tight sm:text-3xl">
              Đăng ký để nhận bài mới
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Bài tuần kế tiếp gửi tới hộp thư của bạn. Không spam, huỷ bất cứ
              lúc nào.
            </p>
          </div>
          <NewsletterSignup variant="inline" id="newsletter-archive" />
        </section>

        <nav aria-label="Liên kết liên quan" className="mt-12">
          <Link
            href="/#newsletter"
            className="inline-flex items-center gap-2 text-sm text-gold/90 hover:text-gold"
          >
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            Về trang chủ
          </Link>
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}
