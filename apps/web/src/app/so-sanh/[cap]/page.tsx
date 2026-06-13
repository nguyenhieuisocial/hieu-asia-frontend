import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { ShareResultButton } from '@/components/tools/ShareResultButton';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';
import { allComparisonSlugs, findComparison } from '@/lib/so-sanh';

const BASE = 'https://hieu.asia';

export function generateStaticParams() {
  return allComparisonSlugs().map((cap) => ({ cap }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cap: string }>;
}): Promise<Metadata> {
  const { cap } = await params;
  const c = findComparison(cap);
  if (!c) return {};
  const title = `${c.title}: khác nhau thế nào, nên chọn cái nào?`;
  const description = c.intro.slice(0, 200);
  const url = `${BASE}/so-sanh/${c.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title: c.title, description, url, type: 'article' },
  };
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ cap: string }>;
}) {
  const { cap } = await params;
  const c = findComparison(cap);
  if (!c) notFound();
  const url = `/so-sanh/${c.slug}`;

  return (
    <>
      <JsonLd
        data={[
          webPage({ name: `${c.title}: khác nhau & nên chọn cái nào`, description: c.intro, url }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'So sánh', url: '/so-sanh' },
            { name: c.title, url },
          ]),
          faqPage(c.faqs),
        ]}
      />
      <ToolPageShell
        eyebrow="So sánh lăng kính"
        icon={<span aria-hidden="true">⚖️</span>}
        title={
          <>
            {c.a.ten} <GoldAccent>vs</GoldAccent> {c.b.ten}
          </>
        }
        description={c.intro}
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'So sánh', href: '/so-sanh' },
          { label: c.title },
        ]}
      >
        {/* Banner lan truyền — người nhận link từ bạn */}
        <div className="mt-6 rounded-xl border border-jade/30 bg-jade/[0.05] px-5 py-4 text-sm text-foreground/80">
          <span className="font-semibold text-foreground">Nhận link từ bạn bè?</span>{' '}
          Bạn đang xem so sánh{' '}
          <span className="text-gold font-medium">
            {c.a.ten} vs {c.b.ten}
          </span>{' '}
          mà họ chia sẻ. Tự kiểm tra lăng kính phù hợp nhất với{' '}
          <Link href="/so-sanh" className="underline underline-offset-2 hover:text-gold">
            bạn tại đây
          </Link>{' '}
          — miễn phí.
        </div>

        {/* Hai công cụ */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2" aria-label="Hai công cụ">
          {[c.a, c.b].map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group rounded-xl border border-border bg-card/40 p-5 transition-all hover:border-gold/40"
            >
              <h2 className="font-heading text-xl font-semibold text-foreground group-hover:text-gold">
                {t.ten}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{t.tag}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm text-gold">
                Làm {t.ten} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </section>

        {/* Bảng đối chiếu */}
        <section className="mt-10" aria-label="Bảng đối chiếu">
          <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
            Khác nhau ở đâu?
          </h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Tiêu chí</th>
                  <th className="px-4 py-3 font-medium text-gold">{c.a.ten}</th>
                  <th className="px-4 py-3 font-medium text-gold">{c.b.ten}</th>
                </tr>
              </thead>
              <tbody>
                {c.dims.map((d) => (
                  <tr key={d.aspect} className="border-t border-border/60 align-top">
                    <td className="px-4 py-3 font-medium text-foreground">{d.aspect}</td>
                    <td className="px-4 py-3 text-muted-foreground">{d.a}</td>
                    <td className="px-4 py-3 text-muted-foreground">{d.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA chia sẻ — đặt ngay sau bảng đối chiếu */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <ShareResultButton
            path={url}
            title={`So sánh ${c.a.ten} vs ${c.b.ten}`}
            text={`Mình vừa đọc so sánh ${c.a.ten} và ${c.b.ten} trên hieu.asia — bạn thử xem nhé!`}
            trackId="so-sanh-cap"
          />
          <Link
            href="/so-sanh"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-gold"
          >
            Xem so sánh khác <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Khi nào nên dùng */}
        <section className="mt-10 grid gap-4 sm:grid-cols-2" aria-label="Khi nào nên dùng">
          <div className="rounded-xl border border-gold/25 bg-gold/[0.05] p-5">
            <h3 className="font-heading text-lg font-semibold text-foreground">
              Chọn {c.a.ten} khi…
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.whenA}</p>
          </div>
          <div className="rounded-xl border border-gold/25 bg-gold/[0.05] p-5">
            <h3 className="font-heading text-lg font-semibold text-foreground">
              Chọn {c.b.ten} khi…
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.whenB}</p>
          </div>
        </section>

        {/* Kết luận + CTA */}
        <section className="mt-10">
          <div className="rounded-xl border border-jade/30 bg-jade/[0.06] p-6 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
              Tóm lại
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground/85 sm:text-base">
              {c.bottomLine}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={c.a.href}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gold-gradient px-5 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                Làm {c.a.ten}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href={c.b.href}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gold/40 px-5 py-2.5 text-sm font-semibold text-gold transition-colors hover:bg-gold/10"
              >
                Làm {c.b.ten}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12" aria-label="Câu hỏi thường gặp">
          <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
            Câu hỏi thường gặp
          </h2>
          <div className="mt-4 space-y-4">
            {c.faqs.map((f) => (
              <div key={f.q} className="rounded-xl border border-border bg-card/40 p-5">
                <h3 className="font-semibold text-foreground">{f.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-10 text-center text-xs text-foreground/40">
          So sánh để tham khảo và chọn công cụ phù hợp — không nhằm khẳng định
          phương pháp nào "đúng hơn" tuyệt đối.
        </p>
      </ToolPageShell>
    </>
  );
}
