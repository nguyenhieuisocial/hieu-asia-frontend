import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage } from '@/lib/seo/jsonld';
import { ALL_PAGES, MAJOR_PAGES, getCardPage } from '@/lib/tarot-card-pages';
import { MINOR_PAGES } from '@/lib/tarot-card-pages-minor';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_PAGES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getCardPage(slug);
  if (!c) return {};
  // SEO-FIX: use { absolute } so the root template (' · hieu.asia') is NOT
  // appended. Previous plain-string title included '| hieu.asia' and got the
  // template suffix too → double branding + >60 chars in search results.
  // short title fits in ~55 chars for all 78 cards.
  const shortTitle = `Lá ${c.name_vi} (${c.name}) · Tarot | hieu.asia`;
  // og:title can be longer — social cards allow more space.
  const ogTitle = `Ý nghĩa lá ${c.name} (${c.name_vi}) — xuôi & ngược`;
  // SEO-FIX: description truncated to stay under 160 chars.
  // Old template with 3 upright + 2 reversed keywords often exceeded 160 chars.
  const description = `Ý nghĩa lá ${c.name_vi} (${c.name}): xuôi — ${c.keyUp
    .slice(0, 2)
    .join(', ')}; ngược — ${c.keyRev[0]}. Biểu tượng, tình cảm – công việc và câu hỏi tự soi.`;
  const url = `https://hieu.asia/tarot/y-nghia/${c.slug}`;
  return {
    title: { absolute: shortTitle },
    description,
    alternates: { canonical: url },
    openGraph: { title: ogTitle, description, url, siteName: 'hieu.asia', locale: 'vi_VN', type: 'article' },
  };
}

export default async function TarotCardMeaningPage({ params }: Props) {
  const { slug } = await params;
  const c = getCardPage(slug);
  if (!c) notFound();

  // prev/next trong đúng nhóm: 22 Ẩn chính theo hành trình 0→21, 56 Ẩn phụ theo 4 chất × (Át→Vua).
  const group = c.arcana === 'minor' ? MINOR_PAGES : MAJOR_PAGES;
  const idx = group.findIndex((x) => x.slug === c.slug);
  const prev = idx > 0 ? group[idx - 1] : undefined;
  const next = idx < group.length - 1 ? group[idx + 1] : undefined;

  return (
    <ToolPageShell
      eyebrow={
        c.arcana === 'minor'
          ? `TAROT PHẢN TƯ · ẨN PHỤ · ${(c.suit_vi ?? '').toUpperCase()}`
          : `TAROT PHẢN TƯ · ẨN CHÍNH ${String(c.number).padStart(2, '0')}`
      }
      relatedSlug="/tarot"
      icon="🃏"
      title={
        <>
          {c.name_vi} · <GoldAccent>{c.name}</GoldAccent>
        </>
      }
      description={`Ý nghĩa lá ${c.name} theo truyền thống Rider–Waite–Smith, viết lại theo lối phản tư: hiểu lá để tự hỏi đúng câu — không phải để được phán.`}
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Tarot', href: '/tarot' },
        { label: 'Ý nghĩa lá bài', href: '/tarot/y-nghia' },
        { label: c.name_vi },
      ]}
    >
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-gold/25 bg-gold/5 p-4">
            <div className="font-mono text-[12px] uppercase tracking-[0.12em] text-gold/80">Nghĩa xuôi</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {c.keyUp.map((k) => (
                <span key={k} className="rounded-full border border-gold/30 px-2.5 py-0.5 text-xs text-foreground/85">
                  {k}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card/40 p-4">
            <div className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted-foreground">Nghĩa ngược</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {c.keyRev.map((k) => (
                <span key={k} className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>

        <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
          <h2 className="font-heading text-xl font-semibold text-foreground">Hình ảnh trên lá</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.image}</p>
        </section>

        <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
          <h2 className="font-heading text-xl font-semibold text-foreground">Nghĩa xuôi (upright)</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.up}</p>
        </section>

        <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
          <h2 className="font-heading text-xl font-semibold text-foreground">Nghĩa ngược (reversed)</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.rev}</p>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground/80">
            Lưu ý: lá ngược không phải &ldquo;điềm xấu&rdquo; — đó là mặt trầm của cùng một năng lượng, một góc nhìn
            ngược lại để tự soi.
          </p>
        </section>

        <div className="grid gap-3 sm:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-heading text-lg font-semibold text-foreground">💞 Tình cảm &amp; quan hệ</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.love}</p>
          </section>
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-heading text-lg font-semibold text-foreground">💼 Công việc &amp; tiền bạc</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.work}</p>
          </section>
        </div>

        {c.ease ? (
          <p className="rounded-lg border border-gold/25 bg-gold/5 px-4 py-3 text-sm leading-relaxed text-foreground/85">
            ⚖️ {c.ease}
          </p>
        ) : null}

        <section className="rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/10 to-transparent p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">Câu hỏi để bạn tự soi</h2>
          <ul className="mt-3 space-y-2">
            {c.reflect.map((q) => (
              <li key={q} className="flex gap-2 text-sm leading-relaxed text-foreground/85">
                <span aria-hidden className="text-gold">·</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            Ý nghĩa nằm ở điều chính bạn soi thấy — lá bài chỉ là tấm gương. Không bói toán, không tiên đoán.
          </p>
        </section>

        <nav className="flex items-center justify-between gap-3 text-sm" aria-label="Lá trước / lá sau">
          {prev ? (
            <Link
              href={`/tarot/y-nghia/${prev.slug}`}
              className="rounded-md border border-border px-4 py-2.5 text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground"
            >
              ← {prev.arcana === 'minor' ? prev.name_vi : `${String(prev.number).padStart(2, '0')} ${prev.name_vi}`}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/tarot/y-nghia/${next.slug}`}
              className="rounded-md border border-border px-4 py-2.5 text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground"
            >
              {next.arcana === 'minor' ? next.name_vi : `${String(next.number).padStart(2, '0')} ${next.name_vi}`} →
            </Link>
          ) : (
            <span />
          )}
        </nav>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/tarot"
            className="rounded-md bg-gold px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Rút lá cho câu hỏi của bạn →
          </Link>
          <Link
            href="/tarot/y-nghia"
            className="rounded-md border border-gold/30 px-5 py-2.5 text-sm text-gold transition-colors hover:bg-gold/10"
          >
            📖 Thư viện đủ 78 lá
          </Link>
        </div>
      </div>

      <JsonLd
        data={[
          webPage({
            url: `/tarot/y-nghia/${c.slug}`,
            name: `Ý nghĩa lá ${c.name} (${c.name_vi}) — xuôi & ngược`,
            description: `Ý nghĩa lá ${c.name} (${c.name_vi}${c.arcana === 'minor' ? `, Ẩn phụ chất ${c.suit_vi}` : `, Ẩn chính số ${c.number}`}) theo hệ Rider–Waite–Smith: nghĩa xuôi, nghĩa ngược, góc tình cảm – công việc và câu hỏi tự soi.`,
          }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Tarot', url: '/tarot' },
            { name: 'Ý nghĩa lá bài', url: '/tarot/y-nghia' },
            { name: c.name_vi, url: `/tarot/y-nghia/${c.slug}` },
          ]),
        ]}
      />
    </ToolPageShell>
  );
}
