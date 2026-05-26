import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MessageCircle } from 'lucide-react';
import { Button } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { MarketingHero } from '@/components/marketing/MarketingHero';
import { PhilosophyBlock } from '@/components/marketing/PhilosophyBlock';

export const metadata: Metadata = {
  title: 'Về chúng tôi',
  description:
    'hieu.asia là người bạn đồng hành cho mỗi quyết định quan trọng — tri thức cổ học Á Đông trình bày bằng tiếng Việt, AI hiện đại, văn phong calm, không định mệnh hoá.',
  alternates: { canonical: 'https://hieu.asia/about' },
  openGraph: {
    title: 'Về chúng tôi',
    description:
      'Sứ mệnh, triết lý và cam kết phía sau hieu.asia.',
    url: 'https://hieu.asia/about',
    type: 'website',
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
          'AI cá nhân hoá Tử Vi, Bát Tự, Thần Số Học, MBTI và Palm Reading bằng tiếng Việt — không tiên tri, không định mệnh hoá, AI làm reflection, user quyết định.',
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
      <main id="main-content" className="min-h-screen bg-background text-foreground pt-16">
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

        <section className="relative bg-warm-dark-50 pb-20">
          <div className="mx-auto max-w-3xl px-6">
            <div className="flex items-center gap-5">
              <div
                aria-hidden="true"
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gradient-to-br from-gold/20 via-background to-purple/30 font-heading text-2xl text-gold"
              >
                H
              </div>
              <div className="flex-1">
                <p className="font-heading text-base font-semibold text-cream-50">
                  Hiệu
                </p>
                <p className="text-xs text-cream-500">
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
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold/85">
                Sứ mệnh & tầm nhìn
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">
                Hiểu mình. Quyết định mình.
              </h2>
            </div>
            <div className="grid gap-10 md:grid-cols-2">
              <article className="rounded-2xl border border-border bg-warm-dark-200 p-7">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold/85">
                  Sứ mệnh
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Mỗi khi bạn đứng trước một quyết định quan trọng, hieu.asia cho
                  bạn một góc nhìn sâu hơn — bằng tri thức cổ học Á Đông, trình bày
                  bằng tiếng Việt cho người Việt, được AI giải mã rõ ràng, và để
                  bạn tự chọn con đường.
                </p>
              </article>
              <article className="rounded-2xl border border-border bg-warm-dark-200 p-7">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold/85">
                  Tầm nhìn
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Một nơi mà cổ học không bị thương mại hoá rẻ tiền, không doạ vận
                  hạn, không bán bùa — chỉ có tri thức được trình bày rõ ràng để
                  bạn có thêm một góc nhìn cho cuộc đời mình.
                </p>
              </article>
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
            'Built on Cloudflare Workers + Next.js 15 + Supabase + Claude — chi tiết kiến trúc tại /methodology.',
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
    </>
  );
}
