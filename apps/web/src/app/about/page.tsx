import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MessageCircle } from 'lucide-react';
import { Button } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { MarketingHero } from '@/components/marketing/MarketingHero';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { MarketingCard } from '@/components/marketing/MarketingCard';
import { PhilosophyBlock } from '@/components/marketing/PhilosophyBlock';

export const metadata: Metadata = {
  title: 'Về chúng tôi',
  description:
    'hieu.asia là người bạn đồng hành cho mỗi quyết định quan trọng — tri thức cổ học Á Đông trình bày bằng tiếng Việt, AI hiện đại, văn phong điềm tĩnh, không định mệnh hoá.',
  alternates: { canonical: 'https://hieu.asia/about' },
  // Wave 60.96.3 — route-level openGraph REPLACES root-layout openGraph; must
  // re-declare `images` or social preview cards render blank.
  openGraph: {
    title: 'Về chúng tôi',
    description:
      'Sứ mệnh, triết lý và cam kết phía sau hieu.asia.',
    url: 'https://hieu.asia/about',
    type: 'website',
    locale: 'vi_VN',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'hieu.asia — Hiểu mình. Quyết định mình. Cẩm nang AI giúp ra quyết định.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Về hieu.asia',
    description: 'Sứ mệnh, triết lý và cam kết phía sau hieu.asia.',
    images: [
      {
        url: '/og-image.jpg',
        alt: 'hieu.asia — Hiểu mình. Quyết định mình.',
      },
    ],
  },
};

// Wave 60.60.b — SEO + GEO structured data.
// AboutPage schema with mainEntity Organization (signals trust + entity
// identity to Google KG + AI assistants). Breadcrumb keeps navigation
// clarity in search results.
const ABOUT_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
        { '@type': 'ListItem', position: 2, name: 'Về chúng tôi', item: 'https://hieu.asia/about' },
      ],
    },
    {
      '@type': 'AboutPage',
      url: 'https://hieu.asia/about',
      name: 'Về hieu.asia',
      inLanguage: 'vi-VN',
      description:
        'Sứ mệnh, triết lý và cam kết phía sau hieu.asia — sản phẩm Việt Nam giúp bạn hiểu mình và ra quyết định có trách nhiệm.',
      mainEntity: {
        '@type': 'Organization',
        name: 'hieu.asia',
        url: 'https://hieu.asia',
        logo: 'https://hieu.asia/icon-512.png',
        slogan: 'Hiểu mình. Quyết định mình.',
        foundingDate: '2025',
        founder: { '@type': 'Person', name: 'Hiệu' },
        description:
          'AI cá nhân hoá Tử Vi, Bát Tự, MBTI, Big Five và Xem Tướng bằng tiếng Việt — không tiên tri, không định mệnh hoá; AI gợi mở để bạn chiêm nghiệm, bạn là người quyết định.',
        sameAs: ['https://t.me/hieuasiabot'],
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'hi@hieu.asia',
          contactType: 'customer support',
          areaServed: 'VN',
          availableLanguage: ['Vietnamese'],
        },
      },
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ABOUT_JSON_LD) }}
      />
      <SiteNav />
      <main id="main-content" className="min-h-screen bg-background text-foreground">
        {/* Section 1 — Hero + Founder face placeholder.
            Wave 60.79.T1 (vault 112 P0-03): add gold-ring ornament so the
            right ~50% of viewport at lg+ is no longer dead space. */}
        <MarketingHero
          eyebrow="VỀ CHÚNG TÔI"
          title={
            <>
              Về <em className="text-gold-soft">hieu.asia</em>
              <span className="text-gold-dot">.</span>
            </>
          }
          subtitle="Một sản phẩm Việt Nam, xây cho người Việt — và bất cứ ai muốn hiểu mình rõ hơn để ra quyết định tốt hơn."
          primaryCta={{ label: 'Liên hệ', href: 'mailto:hi@hieu.asia' }}
          secondaryCta={{ label: 'Telegram bot', href: 'https://t.me/hieuasiabot' }}
          ornament="gold-ring"
        />

        {/* Wave 60.79.T3 (vault 112 P1 #7): founder block — bumped avatar
            20→28 mobile / 28→32 desktop, centered vertically with text, added
            ring-2 ring-gold/30 (Option D brand). Block centered on row so it
            doesn't read as orphan against full-width section. */}
        <section className="relative bg-background pb-20">
          <div className="mx-auto max-w-3xl px-6">
            <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:gap-7 sm:text-left">
              <div
                aria-hidden="true"
                className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gradient-to-br from-gold/20 via-background to-purple/30 font-heading text-4xl text-gold ring-2 ring-gold/30 ring-offset-2 ring-offset-warm-dark-50 sm:h-28 sm:w-28 sm:text-5xl"
              >
                H
              </div>
              <div className="flex-1">
                <p className="font-heading text-lg font-semibold text-foreground">
                  Hiệu
                </p>
                <p className="mt-1 text-sm text-muted-foreground/70">
                  Một engineer + Tử Vi practitioner ở TP.HCM
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 — Mission + Vision merged.
            Wave 60.79.T1 (vault 112 P0): tighten from py-20 sm:py-24 → py-16
            md:py-20 so 3 stacked sections don't pile up 530px of vertical air. */}
        <section className="relative bg-background py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mb-12 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-gold-700">
                Sứ mệnh & tầm nhìn
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">
                Hiểu mình. Quyết định mình.
              </h2>
            </div>
            {/* Wave 60.83 — Mission/Vision cards migrated to MarketingCard
                primitive (Wave 60.79.T2). Was: rounded-2xl border-border bg-card p-7.
                Primitive gives standard p-6 + h-full grid alignment + hover:border-gold/40
                for free, consistent with HowToStart/WhyTrust cards. */}
            <div className="grid gap-10 md:grid-cols-2">
              <MarketingCard padding="standard" bg="warm-dark-200">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-gold-700">
                  Sứ mệnh
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Mỗi khi bạn đứng trước một quyết định quan trọng, hieu.asia cho
                  bạn một góc nhìn sâu hơn — bằng tri thức cổ học Á Đông, trình bày
                  bằng tiếng Việt cho người Việt, được AI giải mã rõ ràng, và để
                  bạn tự chọn con đường.
                </p>
              </MarketingCard>
              <MarketingCard padding="standard" bg="warm-dark-200">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-gold-700">
                  Tầm nhìn
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Một nơi mà cổ học không bị thương mại hoá rẻ tiền, không doạ vận
                  hạn, không bán bùa — chỉ có tri thức được trình bày rõ ràng để
                  bạn có thêm một góc nhìn cho cuộc đời mình.
                </p>
              </MarketingCard>
            </div>
          </div>
        </section>

        {/* Section 3 — Philosophy + Commitments merged (founder voice + ethics) */}
        <PhilosophyBlock
          eyebrow="TRIẾT LÝ & CAM KẾT"
          title={
            <>
              Cổ học là <em className="text-gold-soft">khung tự nhận thức</em>,
              không phải bản án<span className="text-gold-dot">.</span>
            </>
          }
          body={[
            'Tôi xây hieu.asia vì tôi tin cổ học Á Đông — bao gồm tinh hoa cổ truyền Việt Nam như Cân Xương Đoán Số — đáng được trình bày bằng ngôn ngữ của thời đại này, cho người Việt. Không huyễn hoặc, không thương mại hoá rẻ tiền. Mỗi người đều có quyền hiểu chính mình rõ hơn, và quyền tự chọn con đường mình đi.',
            'Riêng tư là mặc định — dữ liệu mã hoá lúc lưu và lúc truyền, không bán cho bên thứ ba, không dùng huấn luyện mô hình, bạn có quyền xoá bất cứ lúc nào. Không định mệnh hoá — không tuyên bố dự đoán tương lai, không doạ vận hạn, không bán bùa giải. Không thay thế chuyên gia — quyết định y tế, pháp lý, tài chính cần chuyên gia phù hợp.',
            'Built on Next.js 15 (web trên Vercel) + Cloudflare Workers (API) + Supabase, với các mô hình AI hàng đầu cho phần diễn giải — chi tiết kiến trúc tại /methodology.',
          ]}
          citation="hieu.asia — 2026"
        />

        {/* Contact CTAs */}
        <section className="relative bg-background py-16">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Liên hệ với chúng tôi
            </h2>
            <p className="mt-3 max-w-xl mx-auto text-muted-foreground">
              Phản hồi, hợp tác, hay chỉ đơn giản là một câu hỏi — chúng tôi
              đọc tất cả email.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="min-w-[200px]">
                <Link href="mailto:hi@hieu.asia">
                  <Mail className="mr-1.5 h-4 w-4" aria-hidden={true} />
                  hi@hieu.asia
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="min-w-[200px]">
                <Link href="https://t.me/hieuasiabot">
                  <MessageCircle className="mr-1.5 h-4 w-4" aria-hidden={true} />
                  Telegram bot
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <StickyMobileCta trackId="about" />
    </>
  );
}
