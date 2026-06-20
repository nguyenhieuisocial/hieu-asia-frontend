import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { FaqSection } from '@/components/seo/FaqSection';
import { breadcrumb, webPage, faqPage, type FaqItem } from '@/lib/seo/jsonld';
import { SAO_GIO, getSaoGio } from '@/lib/gio-hoang-dao-stars';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return SAO_GIO.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = getSaoGio(slug);
  if (!s) return {};
  const loai = s.good ? 'sao hoàng đạo (giờ tốt)' : 'sao hắc đạo (giờ xấu)';
  const title = `Sao ${s.name} là gì? Ý nghĩa giờ ${s.name} — ${s.good ? 'giờ tốt' : 'giờ xấu'}`;
  const description = `Sao ${s.name} — ${loai}: ${s.keyTags.join(', ')}. ${
    s.good ? 'Việc thường hợp' : 'Việc nên thận trọng'
  } trong giờ ${s.name} và cách dùng tỉnh táo, không bói mù.`;
  const url = `https://hieu.asia/gio-hoang-dao/y-nghia/${s.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'hieu.asia', locale: 'vi_VN', type: 'article' },
  };
}

export default async function SaoGioPage({ params }: Props) {
  const { slug } = await params;
  const s = getSaoGio(slug);
  if (!s) notFound();

  const idx = SAO_GIO.findIndex((x) => x.slug === s.slug);
  const prev = idx > 0 ? SAO_GIO[idx - 1] : undefined;
  const next = idx < SAO_GIO.length - 1 ? SAO_GIO[idx + 1] : undefined;

  // Câu hỏi thường gặp — dựng từ dữ liệu THẬT của sao (overview/favors/cautions),
  // mỗi sao một bộ riêng. Dùng chung 1 mảng cho cả FAQPage JSON-LD lẫn phần hiển thị.
  const faqs: FaqItem[] = [
    { q: `Sao ${s.name} là gì?`, a: s.overview },
    ...(s.good && s.favors ? [{ q: `Giờ ${s.name} hợp làm việc gì?`, a: s.favors }] : []),
    ...(!s.good && s.cautions
      ? [
          { q: `Giờ ${s.name} nên thận trọng việc gì?`, a: s.cautions },
          {
            q: `Giờ ${s.name} (giờ xấu) có thật sự nguy hiểm không?`,
            a: `Không. "Giờ xấu" chỉ là lời nhắc thận trọng theo phong tục, không phải điềm tai hoạ. 12 sao luân phiên mỗi ngày — không có giờ nào là "giờ định mệnh"; sự chuẩn bị và nỗ lực mới quyết định kết quả.`,
          },
        ]
      : []),
    {
      q: 'Có nhất thiết phải chọn giờ hoàng đạo không?',
      a: 'Không bắt buộc. Giờ hoàng đạo là một quy ước văn hoá giúp bạn bắt đầu với tâm thế vững hơn; nó không thay thế sự chuẩn bị, năng lực và quyết định của chính bạn.',
    },
  ];

  return (
    <ToolPageShell
      eyebrow={`GIỜ HOÀNG ĐẠO · ${s.good ? 'SAO HOÀNG ĐẠO' : 'SAO HẮC ĐẠO'}`}
      relatedSlug="/gio-hoang-dao"
      icon={s.good ? '🌟' : '⚠️'}
      title={
        <>
          Sao <GoldAccent>{s.name}</GoldAccent>
        </>
      }
      description={`Ý nghĩa sao ${s.name} — ${
        s.good ? 'một trong 6 sao hoàng đạo (giờ tốt)' : 'một trong 6 sao hắc đạo (giờ xấu)'
      }, viết theo lối tỉnh táo: hiểu sao để chọn thời điểm cho vững tâm, không phải để sợ.`}
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Giờ hoàng đạo', href: '/gio-hoang-dao' },
        { label: 'Ý nghĩa 12 sao', href: '/gio-hoang-dao/y-nghia' },
        { label: s.name },
      ]}
    >
      <div className="mx-auto max-w-3xl space-y-6">
        <div
          className={`rounded-2xl border p-6 ${
            s.good
              ? 'border-gold/25 bg-gradient-to-br from-gold/10 to-transparent'
              : 'border-border bg-card/40'
          }`}
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl" aria-hidden>
              {s.good ? '🌟' : '⚠️'}
            </span>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold/80">
                {s.good ? 'Sao hoàng đạo — giờ tốt' : 'Sao hắc đạo — giờ xấu'}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {s.keyTags.map((k) => (
                  <span key={k} className="rounded-full border border-gold/30 px-2.5 py-0.5 text-xs text-foreground/85">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
          <h2 className="font-heading text-xl font-semibold text-foreground">Sao {s.name} nghĩa là gì?</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.overview}</p>
        </section>

        {s.good && s.favors ? (
          <section className="rounded-2xl border border-gold/25 bg-gold/5 p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground">✅ Việc thường hợp trong giờ {s.name}</h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85">{s.favors}</p>
          </section>
        ) : null}

        {!s.good && s.cautions ? (
          <section className="rounded-2xl border border-border bg-card/40 p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground">⚠️ Việc nên thận trọng trong giờ {s.name}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.cautions}</p>
            <p className="mt-3 rounded-lg border border-gold/20 bg-gold/5 px-4 py-3 text-xs leading-relaxed text-foreground/80">
              Lưu ý: &ldquo;giờ xấu&rdquo; là lời nhắc thận trọng theo phong tục, không phải điềm tai hoạ. 12 sao luân
              phiên mỗi ngày — không có giờ nào là &ldquo;giờ định mệnh&rdquo;.
            </p>
          </section>
        ) : null}

        <section className="rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/10 to-transparent p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">Dùng giờ một cách tỉnh táo</h2>
          <ul className="mt-3 space-y-2">
            {s.reflect.map((q) => (
              <li key={q} className="flex gap-2 text-sm leading-relaxed text-foreground/85">
                <span aria-hidden className="text-gold">·</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            Giờ tốt giúp bạn bắt đầu với tâm thế vững; sự chuẩn bị và nỗ lực mới quyết định kết quả. Không bói toán,
            không phán định mệnh.
          </p>
        </section>

        <FaqSection items={faqs} />

        <nav className="flex items-center justify-between gap-3 text-sm" aria-label="Sao trước / sao sau">
          {prev ? (
            <Link
              href={`/gio-hoang-dao/y-nghia/${prev.slug}`}
              className="rounded-md border border-border px-4 py-2.5 text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground"
            >
              ← {prev.name}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/gio-hoang-dao/y-nghia/${next.slug}`}
              className="rounded-md border border-border px-4 py-2.5 text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground"
            >
              {next.name} →
            </Link>
          ) : (
            <span />
          )}
        </nav>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/gio-hoang-dao"
            className="rounded-md bg-gold px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Tra giờ hoàng đạo hôm nay →
          </Link>
          <Link
            href="/gio-hoang-dao/y-nghia"
            className="rounded-md border border-gold/30 px-5 py-2.5 text-sm text-gold transition-colors hover:bg-gold/10"
          >
            🕐 Xem cả 12 sao
          </Link>
        </div>
      </div>

      <JsonLd
        data={[
          webPage({
            url: `/gio-hoang-dao/y-nghia/${s.slug}`,
            name: `Sao ${s.name} là gì? Ý nghĩa giờ ${s.name}`,
            description: `Ý nghĩa sao ${s.name} — ${
              s.good ? 'sao hoàng đạo, giờ tốt' : 'sao hắc đạo, giờ xấu'
            }: biểu tượng, việc hợp/nên tránh và cách dùng tỉnh táo.`,
          }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Giờ hoàng đạo', url: '/gio-hoang-dao' },
            { name: 'Ý nghĩa 12 sao', url: '/gio-hoang-dao/y-nghia' },
            { name: s.name, url: `/gio-hoang-dao/y-nghia/${s.slug}` },
          ]),
          faqPage(faqs),
        ]}
      />
    </ToolPageShell>
  );
}
