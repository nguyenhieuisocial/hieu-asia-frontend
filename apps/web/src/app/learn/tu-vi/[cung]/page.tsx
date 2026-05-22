import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ArrowRight, Shield } from 'lucide-react';
import { Button } from '@hieu-asia/ui';
import { PALACE_READINGS, findPalaceReading } from '@/lib/palace-readings';

// Closed whitelist of the 12 palace slugs. Defence-in-depth alongside
// findPalaceReading() — rejects malformed input before lookup.
const CUNG_SLUG_REGEX = /^cung-[a-z-]{2,20}$/;

export function generateStaticParams() {
  return PALACE_READINGS.map((p) => ({ cung: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ cung: string }> },
): Promise<Metadata> {
  const { cung } = await params;
  if (!CUNG_SLUG_REGEX.test(cung)) return { title: 'Không tìm thấy cung Tử Vi | hieu.asia' };
  const data = findPalaceReading(cung);
  if (!data) return { title: 'Không tìm thấy cung Tử Vi | hieu.asia' };
  return {
    title: `Cung ${data.name} — đọc lá số Tử Vi để ra quyết định | hieu.asia`,
    description: data.governs.slice(0, 158),
    alternates: { canonical: `https://hieu.asia/learn/tu-vi/${data.slug}` },
    openGraph: {
      title: `Cung ${data.name} · hieu.asia`,
      description: data.governs.slice(0, 200),
      url: `https://hieu.asia/learn/tu-vi/${data.slug}`,
      type: 'article',
    },
  };
}

const PUBLISHED_AT = '2026-05-22';

export default async function LearnPalacePage({
  params,
}: {
  params: Promise<{ cung: string }>;
}) {
  const { cung } = await params;
  if (!CUNG_SLUG_REGEX.test(cung)) notFound();
  const data = findPalaceReading(cung);
  if (!data) notFound();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Cung ${data.name} trong Tử Vi — luận theo hướng ra quyết định`,
    description: data.governs,
    url: `https://hieu.asia/learn/tu-vi/${data.slug}`,
    datePublished: PUBLISHED_AT,
    dateModified: PUBLISHED_AT,
    inLanguage: 'vi-VN',
    author: { '@type': 'Organization', name: 'hieu.asia', url: 'https://hieu.asia' },
    publisher: { '@type': 'Organization', name: 'hieu.asia', url: 'https://hieu.asia' },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://hieu.asia/learn/tu-vi/${data.slug}`,
    },
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="mb-6 flex items-center text-xs text-muted-foreground">
        <Link href="/" className="hover:text-gold">
          Trang chủ
        </Link>
        <ChevronRight className="mx-1 h-3 w-3" aria-hidden />
        <Link href="/learn" className="hover:text-gold">
          Học huyền học
        </Link>
        <ChevronRight className="mx-1 h-3 w-3" aria-hidden />
        <Link href="/learn/tu-vi" className="hover:text-gold">
          Tử Vi 12 cung
        </Link>
        <ChevronRight className="mx-1 h-3 w-3" aria-hidden />
        <span className="text-muted-foreground">Cung {data.name}</span>
      </nav>

      <header className="mb-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
          {data.fullName} · {data.domain}
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl">
          Cung{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            {data.name}
          </span>{' '}
          quản gì
        </h1>
        <p className="mt-5 text-base leading-relaxed text-foreground/80">{data.governs}</p>
      </header>

      <section className="mb-10">
        <h2 className="mb-4 font-heading text-xl font-bold text-foreground">
          Những sao đáng để ý tại cung {data.name}
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          Đây là các sao xuất hiện nhiều tại cung này và tín hiệu mỗi sao mang lại khi đóng
          ở đây. Sao chỉ là gợi ý — phải đọc cùng miếu vượng và sao kèm để có nghĩa đầy đủ.
        </p>
        <ul className="space-y-3 rounded-xl border border-border bg-card/40 p-5 sm:p-6">
          {data.keyStars.map((s) => (
            <li key={s.name} className="flex flex-col gap-1 sm:flex-row sm:gap-3">
              <span className="shrink-0 font-mono text-xs font-semibold uppercase tracking-wider text-gold sm:w-28">
                {s.name}
              </span>
              <span className="text-sm leading-relaxed text-foreground/80">{s.signal}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 font-heading text-xl font-bold text-foreground">
          Một buổi luận cung {data.name} đi như thế nào
        </h2>
        <ol className="space-y-3">
          {data.framework.map((step, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-lg border border-border bg-card/30 p-4"
            >
              <span className="shrink-0 font-mono text-xs font-bold text-gold">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-sm leading-relaxed text-foreground/80">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 font-heading text-xl font-bold text-foreground">
          Cung {data.name} trả lời được câu hỏi nào của bạn
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          Lá số không phải để hỏi "tương lai có gì". Hỏi đúng câu — bạn sẽ thấy lá số trở
          thành công cụ ra quyết định:
        </p>
        <ul className="space-y-2">
          {data.decisionQuestions.map((q, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-lg border border-border bg-card/30 px-4 py-3"
            >
              <span className="shrink-0 text-gold/80">?</span>
              <span className="text-sm leading-relaxed text-foreground/80">{q}</span>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="disclaimer-heading"
        className="mb-10 rounded-xl border border-border bg-card/40 p-5 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-gold/80" aria-hidden />
          <div>
            <h2
              id="disclaimer-heading"
              className="font-heading text-base font-semibold text-foreground"
            >
              Lá số là bản đồ, không phải kịch bản
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Nội dung trong trang này là kiến thức nền tảng để bạn tự đối chiếu — không phải
              dự đoán định mệnh, không thay thế lời khuyên y tế, pháp lý hay tài chính
              chuyên môn. Đọc thêm{' '}
              <Link href="/methodology" className="text-gold underline-offset-4 hover:underline">
                phương pháp đầy đủ
              </Link>{' '}
              và{' '}
              <Link
                href="/methodology/tu-vi"
                className="text-gold underline-offset-4 hover:underline"
              >
                trường phái Tử Vi
              </Link>{' '}
              chúng tôi áp dụng. Lá số dùng tốt nhất khi đi cùng tư duy tỉnh táo và hành động
              thực tế.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12 rounded-2xl border border-gold/25 bg-card/40 p-6 text-center sm:p-8">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Xem cung {data.name} của bạn
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Bài này là phần kiến thức nền. Để xem cung {data.name} CỦA BẠN có sao nào, đại
          vận hiện tại ra sao — lập lá số mất khoảng 30 giây, không cần đăng ký.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/reading/new?method=tu-vi">
            <Button size="lg">Lập lá số Tử Vi</Button>
          </Link>
          <Link
            href="/learn/tu-vi"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
          >
            Quay lại 12 cung
            <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>

      <section className="border-t border-border pt-8">
        <h2 className="mb-4 font-heading text-base font-semibold text-foreground">
          Các cung khác trong lá số
        </h2>
        <div className="flex flex-wrap gap-2">
          {PALACE_READINGS.filter((p) => p.slug !== data.slug).map((p) => (
            <Link
              key={p.slug}
              href={`/learn/tu-vi/${p.slug}`}
              className="rounded-full border border-border bg-card/40 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-gold/50 hover:text-gold"
            >
              Cung {p.name}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
