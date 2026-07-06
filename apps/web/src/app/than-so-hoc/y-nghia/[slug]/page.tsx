import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { FaqSection } from '@/components/seo/FaqSection';
import { breadcrumb, webPage, faqPage, type FaqItem } from '@/lib/seo/jsonld';
import { SO_CHU_DAO, getSoChuDao } from '@/lib/than-so-hoc-numbers';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return SO_CHU_DAO.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const n = getSoChuDao(slug);
  if (!n) return {};
  const title = `Số chủ đạo ${n.number} — ${n.archetype}: ý nghĩa, điểm mạnh, bài học | hieu.asia`;
  const description = `Thần số học số ${n.number}${n.master ? ' (số master)' : ''} — ${n.archetype}: ${n.keyTags.join(', ')}. Chân dung khuynh hướng, điểm mạnh, bài học lớn, góc tình cảm – công việc và câu hỏi tự soi.`;
  const metaTitle = `Số chủ đạo ${n.number} — ${n.archetype}: ý nghĩa & bài học`;
  const metaDescription = `Thần số học số ${n.number}${n.master ? ' (số master)' : ''} — ${n.archetype}: ${n.keyTags.join(', ')}. Chân dung khuynh hướng, điểm mạnh và bài học lớn.`.slice(0, 158);
  const url = `https://hieu.asia/than-so-hoc/y-nghia/${n.slug}`;
  return {
    title: { absolute: metaTitle },
    description: metaDescription,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'hieu.asia', locale: 'vi_VN', type: 'article' },
  };
}

export default async function SoChuDaoPage({ params }: Props) {
  const { slug } = await params;
  const n = getSoChuDao(slug);
  if (!n) notFound();

  const idx = SO_CHU_DAO.findIndex((x) => x.slug === n.slug);
  const prev = idx > 0 ? SO_CHU_DAO[idx - 1] : undefined;
  const next = idx < SO_CHU_DAO.length - 1 ? SO_CHU_DAO[idx + 1] : undefined;

  // Câu hỏi thường gặp — dựng từ dữ liệu THẬT của số (overview/strengths/challenge/work/love),
  // mỗi số một bộ riêng. Dùng chung 1 mảng cho cả FAQPage JSON-LD lẫn phần hiển thị.
  const faqs: FaqItem[] = [
    { q: `Số chủ đạo ${n.number} (${n.archetype}) nói lên điều gì về tính cách?`, a: n.overview },
    { q: `Điểm mạnh tự nhiên của số ${n.number} là gì?`, a: `Người số ${n.number} thường mạnh ở: ${n.strengths.join('; ')}.` },
    { q: `Bài học lớn nhất của người số ${n.number} là gì?`, a: n.challenge },
    { q: `Số ${n.number} hợp công việc và tiền bạc thế nào?`, a: n.work },
    { q: `Số ${n.number} trong tình cảm và quan hệ thế nào?`, a: n.love },
    ...(n.master
      ? [
          {
            q: `Số master ${n.number} có "cao cấp" hơn số thường không?`,
            a: `Không. Số master không phải đẳng cấp cao hơn — nó là phiên bản cường độ cao của một năng lượng gốc, đi kèm bài tập khó hơn và rủi ro quá tải lớn hơn. Nơi nào dùng số master để tâng bốc rồi bán khoá học "khai mở sứ mệnh" giá cao, nơi đó đang bán nỗi khao khát được đặc biệt.`,
          },
        ]
      : []),
  ];

  return (
    <ToolPageShell
      eyebrow={`THẦN SỐ HỌC · SỐ CHỦ ĐẠO${n.master ? ' · MASTER' : ''}`}
      relatedSlug="/than-so-hoc"
      icon="🔢"
      title={
        <>
          Số <GoldAccent>{n.number}</GoldAccent> — {n.archetype}
        </>
      }
      description={`Ý nghĩa số chủ đạo ${n.number} theo thần số học Pythagoras, viết theo lối phản tư: con số mô tả khuynh hướng để bạn tự quan sát — không phán số phận.`}
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Thần số học', href: '/than-so-hoc' },
        { label: 'Ý nghĩa số chủ đạo', href: '/than-so-hoc/y-nghia' },
        { label: `Số ${n.number}` },
      ]}
    >
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/10 to-transparent p-6">
          <div className="flex items-center gap-6">
            <span className="font-heading text-6xl font-bold text-gold">{n.number}</span>
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[12px] uppercase tracking-[0.12em] text-gold/80">
                {n.master ? 'Số master — cường độ cao' : 'Số cơ bản'}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {n.keyTags.map((k) => (
                  <span key={k} className="rounded-full border border-gold/30 px-2.5 py-0.5 text-xs text-foreground/85">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
          <h2 className="font-heading text-xl font-semibold text-foreground">Chân dung khuynh hướng</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{n.overview}</p>
        </section>

        <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
          <h2 className="font-heading text-xl font-semibold text-foreground">Điểm mạnh tự nhiên</h2>
          <ul className="mt-3 space-y-2">
            {n.strengths.map((s) => (
              <li key={s} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                <span aria-hidden className="text-gold">·</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
          <h2 className="font-heading text-xl font-semibold text-foreground">Bài học lớn</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{n.challenge}</p>
        </section>

        <div className="grid gap-3 sm:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-heading text-lg font-semibold text-foreground">💞 Tình cảm &amp; quan hệ</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{n.love}</p>
          </section>
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-heading text-lg font-semibold text-foreground">💼 Công việc &amp; tiền bạc</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{n.work}</p>
          </section>
        </div>

        {n.master ? (
          <p className="rounded-lg border border-gold/25 bg-gold/5 px-4 py-3 text-sm leading-relaxed text-foreground/85">
            ⚖️ Số master không phải &ldquo;đẳng cấp cao hơn&rdquo; — nó là phiên bản cường độ cao của một năng lượng
            gốc, đi kèm bài tập khó hơn và rủi ro quá tải lớn hơn. Nơi nào dùng số master để tâng bốc bạn rồi bán khóa
            học &ldquo;khai mở sứ mệnh&rdquo; giá cao, nơi đó đang bán nỗi khao khát được đặc biệt.
          </p>
        ) : null}

        <section className="rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/10 to-transparent p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">Câu hỏi để bạn tự soi</h2>
          <ul className="mt-3 space-y-2">
            {n.reflect.map((q) => (
              <li key={q} className="flex gap-2 text-sm leading-relaxed text-foreground/85">
                <span aria-hidden className="text-gold">·</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            Con số mô tả khuynh hướng — không phán số phận. Cùng một số, mỗi người sống một đời khác nhau; quyết định ở
            bạn.
          </p>
        </section>

        <FaqSection items={faqs} />

        <nav className="flex items-center justify-between gap-3 text-sm" aria-label="Số trước / số sau">
          {prev ? (
            <Link
              href={`/than-so-hoc/y-nghia/${prev.slug}`}
              className="rounded-md border border-border px-4 py-2.5 text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground"
            >
              ← Số {prev.number} {prev.archetype}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/than-so-hoc/y-nghia/${next.slug}`}
              className="rounded-md border border-border px-4 py-2.5 text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground"
            >
              Số {next.number} {next.archetype} →
            </Link>
          ) : (
            <span />
          )}
        </nav>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/than-so-hoc"
            className="rounded-md bg-gold px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Tính số chủ đạo của bạn →
          </Link>
          <Link
            href="/than-so-hoc/y-nghia"
            className="rounded-md border border-gold/30 px-5 py-2.5 text-sm text-gold transition-colors hover:bg-gold/10"
          >
            🔢 Xem cả 12 số
          </Link>
        </div>
      </div>

      <JsonLd
        data={[
          webPage({
            url: `/than-so-hoc/y-nghia/${n.slug}`,
            name: `Số chủ đạo ${n.number} — ${n.archetype}`,
            description: `Ý nghĩa số chủ đạo ${n.number} trong thần số học: khuynh hướng, điểm mạnh, bài học, tình cảm – công việc và câu hỏi tự soi.`,
          }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Thần số học', url: '/than-so-hoc' },
            { name: 'Ý nghĩa số chủ đạo', url: '/than-so-hoc/y-nghia' },
            { name: `Số ${n.number}`, url: `/than-so-hoc/y-nghia/${n.slug}` },
          ]),
          faqPage(faqs),
        ]}
      />
    </ToolPageShell>
  );
}
