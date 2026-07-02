import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Shield } from 'lucide-react';
import { PALACE_READINGS, findPalaceReading } from '@/lib/palace-readings';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb } from '@/lib/seo/jsonld';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';
import { LearnArticle } from '@/components/learn/LearnArticle';

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
  if (!CUNG_SLUG_REGEX.test(cung)) return { title: 'Không tìm thấy cung Tử Vi' };
  const data = findPalaceReading(cung);
  if (!data) return { title: 'Không tìm thấy cung Tử Vi' };
  return {
    title: `Cung ${data.name}: đọc lá số Tử Vi`,
    description: data.governs.slice(0, 158),
    alternates: { canonical: `https://hieu.asia/learn/tu-vi/${data.slug}` },
    openGraph: {
      title: `Cung ${data.name}`,
      description: data.governs.slice(0, 200),
      url: `https://hieu.asia/learn/tu-vi/${data.slug}`,
      type: 'article',
      images: OG_DEFAULT_IMAGES,
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

  const jsonLd = [
    article({
      headline: `Cung ${data.name} trong Tử Vi — luận theo hướng ra quyết định`,
      description: data.governs,
      url: `/learn/tu-vi/${data.slug}`,
      datePublished: PUBLISHED_AT,
      dateModified: PUBLISHED_AT,
    }),
    breadcrumb([
      { name: 'Trang chủ', url: '/' },
      { name: 'Học huyền học', url: '/learn' },
      { name: 'Tử Vi 12 cung', url: '/learn/tu-vi' },
      { name: `Cung ${data.name}`, url: `/learn/tu-vi/${data.slug}` },
    ]),
  ];

  return (
    <LearnArticle
      eyebrow={`${data.fullName} · ${data.domain}`}
      title={
        <>
          Cung{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">{data.name}</span>{' '}
          quản gì
        </>
      }
      standfirst={data.governs}
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Tử Vi 12 cung', href: '/learn/tu-vi' },
        { label: `Cung ${data.name}` },
      ]}
      tryCta={{
        heading: `Xem cung ${data.name} của bạn`,
        blurb: `Bài này là phần kiến thức nền. Để xem cung ${data.name} CỦA BẠN có sao nào, đại vận hiện tại ra sao — lập lá số mất khoảng 30 giây, không cần đăng ký.`,
        href: '/reading/new?method=tu-vi',
        label: 'Lập lá số Tử Vi',
      }}
      sections={[
        {
          id: 'sao-dang-y',
          tocLabel: 'Sao đáng để ý',
          heading: `Những sao đáng để ý tại cung ${data.name}`,
          children: (
            <>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                Đây là các sao xuất hiện nhiều tại cung này và tín hiệu mỗi sao mang lại khi đóng
                ở đây. Sao chỉ là gợi ý — phải đọc cùng miếu vượng và sao kèm để có nghĩa đầy đủ.
              </p>
              <ul className="space-y-3 rounded-xl border border-border bg-card/40 p-5 sm:p-6">
                {data.keyStars.map((s) => (
                  <li key={s.name} className="flex flex-col gap-1 sm:flex-row sm:gap-3">
                    <span className="shrink-0 font-mono text-xs font-semibold uppercase tracking-wider text-gold-700 sm:w-28">
                      {s.name}
                    </span>
                    <span className="text-sm leading-relaxed text-foreground/80">{s.signal}</span>
                  </li>
                ))}
              </ul>
            </>
          ),
        },
        {
          id: 'buoi-luan',
          tocLabel: 'Một buổi luận',
          heading: `Một buổi luận cung ${data.name} đi như thế nào`,
          children: (
            <ol className="space-y-3">
              {data.framework.map((step, i) => (
                <li
                  key={i}
                  className="flex gap-3 rounded-lg border border-border bg-card/30 p-4"
                >
                  <span className="shrink-0 font-mono text-xs font-bold text-gold-700">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm leading-relaxed text-foreground/80">{step}</span>
                </li>
              ))}
            </ol>
          ),
        },
        {
          id: 'cau-hoi',
          tocLabel: 'Trả lời câu hỏi nào',
          heading: `Cung ${data.name} trả lời được câu hỏi nào của bạn`,
          children: (
            <>
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
            </>
          ),
        },
        {
          id: 'ban-do',
          tocLabel: 'Bản đồ, không phải kịch bản',
          heading: 'Lá số là bản đồ, không phải kịch bản',
          children: (
            <div className="rounded-xl border border-border bg-card/40 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <Shield className="mt-0.5 h-5 w-5 shrink-0 text-gold/80" aria-hidden />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Nội dung trong trang này là kiến thức nền tảng để bạn tự đối chiếu — không phải
                  dự đoán định mệnh, không thay thế lời khuyên y tế, pháp lý hay tài chính
                  chuyên môn. Đọc thêm{' '}
                  <Link href="/methodology" className="text-gold-700 underline underline-offset-4 hover:opacity-80">
                    phương pháp đầy đủ
                  </Link>{' '}
                  và{' '}
                  <Link
                    href="/methodology/tu-vi"
                    className="text-gold-700 underline underline-offset-4 hover:opacity-80"
                  >
                    trường phái Tử Vi
                  </Link>{' '}
                  chúng tôi áp dụng. Lá số dùng tốt nhất khi đi cùng tư duy tỉnh táo và hành động
                  thực tế.
                </p>
              </div>
            </div>
          ),
        },
        {
          id: 'cung-khac',
          tocLabel: 'Các cung khác',
          heading: 'Các cung khác trong lá số',
          children: (
            <>
              <div className="mb-4 flex flex-wrap gap-2">
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
              <Link
                href="/learn/tu-vi"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
              >
                Quay lại 12 cung
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </>
          ),
        },
      ]}
    >
      <JsonLd data={jsonLd} />
    </LearnArticle>
  );
}
