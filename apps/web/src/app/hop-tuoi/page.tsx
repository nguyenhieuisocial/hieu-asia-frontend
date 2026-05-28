import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';

export const metadata = {
  title: 'Hợp tuổi cưới hỏi, làm ăn, sinh con — Phân tích AI',
  description:
    'Xem hợp tuổi miễn phí cho cưới hỏi, hợp tác kinh doanh, sinh con, xông đất. Phân tích Thiên Can, Địa Chi, Tam hợp, Tứ hành xung, Cung Phi 8 trạch.',
  alternates: { canonical: 'https://hieu.asia/hop-tuoi' },
  openGraph: {
    title: 'Hợp tuổi cưới hỏi, làm ăn, sinh con',
    description:
      'Tương hợp Can Chi theo từng việc cụ thể — Tam Hợp, Lục Hợp, Tứ Hành Xung. Miễn phí.',
    url: 'https://hieu.asia/hop-tuoi',
    type: 'website' as const,
  },
};

const HOP_TUOI_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Hợp tuổi · Tương hợp Can Chi',
  provider: { '@type': 'Organization', name: 'hieu.asia', url: 'https://hieu.asia' },
  areaServed: 'VN',
  inLanguage: 'vi-VN',
  url: 'https://hieu.asia/hop-tuoi',
  description:
    'Xem hợp tuổi cho cưới hỏi, hợp tác kinh doanh, sinh con, xông đất theo Thiên Can - Địa Chi.',
};

const CARDS = [
  {
    href: '/hop-tuoi/wedding',
    title: 'Cưới hỏi',
    emoji: '💍',
    desc: 'Xem hợp tuổi vợ chồng — Thiên Can, Địa Chi, Cung Phi 8 trạch.',
  },
  {
    href: '/hop-tuoi/business',
    title: 'Hợp tác kinh doanh',
    emoji: '🤝',
    desc: 'Đánh giá tương hợp đối tác, tập trung cung Tài Quan và Ngũ Hành.',
  },
  {
    href: '/hop-tuoi/birth-child',
    title: 'Sinh con',
    emoji: '👶',
    desc: 'Chọn năm sinh con hợp với tuổi cha mẹ theo Tam Hợp / Lục Hợp.',
  },
  {
    href: '/hop-tuoi/xong-dat',
    title: 'Xông đất',
    emoji: '🎋',
    desc: 'Chọn người xông đất đầu năm phù hợp với gia chủ.',
  },
];

export default function HopTuoiLandingPage() {
  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(HOP_TUOI_JSONLD) }}
    />
    <ToolPageShell
      eyebrow="Hợp tuổi · Tương hợp Can Chi"
      icon={<span aria-hidden="true">☯</span>}
      title={
        <>
          Xem <GoldAccent>Hợp Tuổi</GoldAccent>
        </>
      }
      description="Tương hợp Can Chi theo từng việc cụ thể — Thiên Can, Địa Chi, Tam Hợp, Lục Hợp, Tứ Hành Xung. Miễn phí, tức thì."
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Hợp tuổi' },
      ]}
    >
      <h2 className="mt-8 font-heading text-xl font-semibold text-foreground sm:text-2xl">
        Chọn việc cần xem hợp tuổi
      </h2>
      <section
        className="mt-6 grid gap-4 sm:grid-cols-2"
        aria-label="Danh sách công cụ xem hợp tuổi"
      >
        {CARDS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-xl"
          >
            <Card className="relative h-full overflow-hidden border-border bg-card/50 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-gold/40 group-hover:shadow-[0_0_40px_-12px_rgba(184,146,61,0.45)]">
              {/* Subtle gradient corner accent */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gold/15 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-foreground">
                  <span aria-hidden className="text-3xl">
                    {c.emoji}
                  </span>
                  {c.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">{c.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-gold transition-transform group-hover:gap-2">
                  Bắt đầu
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <p className="mt-10 text-center text-xs text-foreground/40">
        Công cụ tham khảo — không thay thế tư vấn chuyên gia. Quyết định cuối cùng thuộc về bạn.
      </p>
    </ToolPageShell>
    <StickyMobileCta trackId="hop-tuoi" />
    </>
  );
}
