import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage } from '@/lib/seo/jsonld';
import { ZODIAC, pairToSlug } from '@/lib/hop-tuoi-pairs';

const TITLE = 'Tra cứu hợp tuổi 12 con giáp theo từng cặp';
const DESCRIPTION =
  'Tuổi nào hợp tuổi nào? Tra nhanh tương hợp Can Chi giữa hai con giáp theo Tam Hợp, Lục Hợp, Lục Xung, Lục Hại. Tham khảo tổng quan, không định mệnh hoá.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://hieu.asia/hop-tuoi/tuoi' },
  openGraph: {
    title: TITLE,
    description:
      'Bảng tra hợp tuổi 12 con giáp theo từng cặp — Tam Hợp, Lục Hợp, Lục Xung, Lục Hại.',
    url: 'https://hieu.asia/hop-tuoi/tuoi',
    type: 'website' as const,
  },
};

export default function HopTuoiTuoiHubPage() {
  return (
    <>
      <JsonLd
        data={[
          webPage({ name: TITLE, description: DESCRIPTION, url: '/hop-tuoi/tuoi' }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Hợp tuổi', url: '/hop-tuoi' },
            { name: 'Tra hợp tuổi theo con giáp', url: '/hop-tuoi/tuoi' },
          ]),
        ]}
      />
      <ToolPageShell
        eyebrow="Hợp tuổi · 12 con giáp"
        icon={<span aria-hidden="true">☯</span>}
        title={
          <>
            Tra <GoldAccent>hợp tuổi</GoldAccent> theo con giáp
          </>
        }
        description={DESCRIPTION}
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Hợp tuổi', href: '/hop-tuoi' },
          { label: 'Theo con giáp' },
        ]}
      >
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Chọn con giáp của bạn để xem nhanh mức tương hợp với 12 con giáp còn lại theo
          Can Chi. Đây là góc nhìn tổng quan theo tuổi để tham khảo — muốn chính xác hơn,
          hãy dùng công cụ phân tích theo năm sinh ở cuối trang.
        </p>

        <section className="mt-8 space-y-8" aria-label="Danh sách 12 con giáp">
          {ZODIAC.map((z) => (
            <div key={z.slug}>
              <h2 className="flex items-center gap-2 font-heading text-xl font-semibold text-foreground sm:text-2xl">
                <span aria-hidden className="text-2xl">
                  {z.emoji}
                </span>
                Tuổi {z.ten} hợp tuổi gì?
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                {z.blurb}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2" aria-label={`Các cặp với tuổi ${z.ten}`}>
                {ZODIAC.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`/hop-tuoi/tuoi/${pairToSlug(z.slug, other.slug)}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1.5 text-sm text-foreground/85 transition-all hover:border-gold/40 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    >
                      <span aria-hidden>{other.emoji}</span>
                      {z.ten} – {other.ten}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="mt-12">
          <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Muốn xem chính xác theo năm sinh?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/80 sm:text-base">
              Bảng theo con giáp chỉ là góc nhìn tổng quan. Để phân tích đầy đủ Thiên Can,
              Địa Chi và Ngũ Hành theo đúng năm sinh của hai người, hãy dùng công cụ hợp
              tuổi chi tiết — hoặc xem hợp cho cả nhóm từ ba người trở lên.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/hop-tuoi"
                className="inline-flex items-center gap-1.5 rounded-lg bg-gold-gradient px-5 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                Xem hợp tuổi theo năm sinh
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/xem-hop-nhom"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
              >
                Xem hợp nhóm (từ 3 người)
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <div className="mt-12 border-t border-border pt-6">
          <RelatedTools
            links={[
              { href: '/hop-tuoi', label: 'Hợp tuổi theo năm sinh' },
              { href: '/xem-hop-nhom', label: 'Xem hợp nhóm' },
              { href: '/learn/con-giap', label: 'Tìm hiểu 12 con giáp' },
            ]}
          />
        </div>

        <p className="mt-10 text-center text-xs text-foreground/40">
          Tham khảo tổng quan theo con giáp — không bói toán, không quyết định số phận.
          Yếu tố con người và lá số chi tiết quan trọng hơn.
        </p>
      </ToolPageShell>
    </>
  );
}
