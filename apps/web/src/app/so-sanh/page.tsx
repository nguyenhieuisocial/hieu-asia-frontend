import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage } from '@/lib/seo/jsonld';
import { COMPARISONS } from '@/lib/so-sanh';

const TITLE = 'So sánh MBTI, Big Five, Tử Vi, Bát Tự, DISC';
const DESCRIPTION =
  'So sánh khách quan các công cụ hiểu mình của hieu.asia — MBTI vs Big Five, Tử Vi vs Bát Tự, MBTI vs DISC. Khác nhau ở đâu và nên chọn cái nào?';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://hieu.asia/so-sanh' },
  openGraph: {
    title: TITLE,
    description: 'Khác nhau ở đâu, nên chọn cái nào — so sánh khách quan, không dìm bên nào.',
    url: 'https://hieu.asia/so-sanh',
    type: 'website' as const,
  },
};

export default function SoSanhHubPage() {
  return (
    <>
      <JsonLd
        data={[
          webPage({ name: TITLE, description: DESCRIPTION, url: '/so-sanh' }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'So sánh', url: '/so-sanh' },
          ]),
        ]}
      />
      <ToolPageShell
        eyebrow="So sánh lăng kính"
        relatedSlug="/so-sanh"
        icon={<span aria-hidden="true">⚖️</span>}
        title={
          <>
            So sánh các <GoldAccent>lăng kính</GoldAccent>
          </>
        }
        description={DESCRIPTION}
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'So sánh' },
        ]}
      >
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Mỗi công cụ là một góc nhìn khác nhau về bản thân. Dưới đây là so sánh khách
          quan từng cặp — khác nhau ở đâu, mạnh ở điểm gì, và nên chọn cái nào theo nhu
          cầu của bạn.
        </p>

        <section className="mt-8 grid gap-4 sm:grid-cols-2" aria-label="Danh sách so sánh">
          {COMPARISONS.map((c) => (
            <Link
              key={c.slug}
              href={`/so-sanh/${c.slug}`}
              className="group rounded-xl border border-border bg-card/40 p-6 transition-all hover:border-gold/40"
            >
              <h2 className="font-heading text-xl font-semibold text-foreground group-hover:text-gold">
                {c.a.ten} <span className="text-muted-foreground">vs</span> {c.b.ten}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.intro}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm text-gold">
                Xem so sánh <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </section>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          So sánh để chọn công cụ phù hợp — không khẳng định phương pháp nào "đúng hơn"
          tuyệt đối.
        </p>
      </ToolPageShell>
    </>
  );
}
