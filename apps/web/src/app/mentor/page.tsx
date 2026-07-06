import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { MarketingHero } from '@/components/marketing/MarketingHero';
import { OrnamentDivider } from '@/components/marketing/OrnamentDivider';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage } from '@/lib/seo/jsonld';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';
import { formatVND, PRICING } from '@/lib/pricing';

/**
 * /mentor — S7b storefront for the AI Mentor subscription (quyết #16).
 *
 * The 199k/month Mentor AI plan previously had NO landing page — nav/footer
 * "Mentor" links dumped visitors straight into /onboarding?intent=decision.
 * This page is the storefront: founder-approved copy (verbatim), house
 * marketing layout (MarketingHero + editorial cards, per /pricing).
 *
 * Price comes from canonical `PRICING.monthly` — never hardcode 199k here.
 * NOTE: Mentor AI (AI subscription) ≠ "1-1 cùng founder" (human consult at
 * /checkout/founder-1on1) — the differentiation note below keeps them apart.
 * No cancellation/refund promises on this page (no standalone policy exists;
 * refund copy lives in /pricing FAQ only).
 */

const MENTOR_PRICE = `${formatVND(PRICING.monthly.vnd)}/tháng`;
const MENTOR_PRICE_SHORT = `${PRICING.monthly.vnd / 1000}k/tháng`;

const PAGE_DESCRIPTION =
  `Mentor AI trả lời từ chính lá số Tử Vi / Bát Tự bạn đã lập, nhớ mục tiêu và quyết định của bạn, hỏi không giới hạn — ${MENTOR_PRICE}. Lập lá số miễn phí trước.`;

export const metadata: Metadata = {
  title: {
    absolute: 'Mentor AI — hỏi đáp không giới hạn từ lá số của bạn · hieu.asia',
  },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: '/mentor' },
  openGraph: {
    title: 'Mentor AI — hỏi đáp không giới hạn từ lá số của bạn',
    description: `Trả lời bám lá số bạn đã lập, nhớ hành trình của bạn, hỏi không giới hạn — ${MENTOR_PRICE}.`,
    url: 'https://hieu.asia/mentor',
    type: 'website',
    images: OG_DEFAULT_IMAGES,
  },
};

/** Founder-approved value blocks — copy verbatim, do not edit without founder sign-off. */
const VALUE_BLOCKS = [
  {
    title: 'Trả lời từ chính lá số của bạn',
    body: 'Mọi câu trả lời bám vào Tử Vi / Bát Tự bạn đã lập, chỉ rõ căn cứ từng sao từng trụ. Không phán mù.',
  },
  {
    title: 'Nhớ hành trình của bạn',
    body: 'Mục tiêu bạn đang theo, quyết định còn treo: lần sau hỏi tiếp, Mentor nhớ và nối mạch, không phải kể lại từ đầu.',
  },
  {
    title: 'Không giới hạn',
    body: `Chuyện việc, chuyện tiền, chuyện người: hỏi bất kỳ lúc nào, bao nhiêu câu tuỳ bạn — ${MENTOR_PRICE}.`,
  },
] as const;

export default function MentorPage() {
  const JSONLD = [
    webPage({
      name: 'Mentor AI — hỏi đáp không giới hạn từ lá số của bạn',
      description: PAGE_DESCRIPTION,
      url: '/mentor',
    }),
    breadcrumb([
      { name: 'Trang chủ', url: '/' },
      { name: 'Mentor AI', url: '/mentor' },
    ]),
  ];

  return (
    <>
      <JsonLd data={JSONLD} />
      <SiteNav />
      <main id="main-content" className="bg-background">
        <MarketingHero
          eyebrow="MENTOR AI · ĐỒNG HÀNH"
          title="Mentor AI — người đồng hành đọc vị lá số của bạn"
          subtitle="Lá số cho bạn bức tranh. Mentor giúp bạn ra quyết định từ bức tranh đó — hỏi bao nhiêu lần cũng được, lúc nào cũng sẵn."
          primaryCta={{
            label: `Bắt đầu với Mentor — ${MENTOR_PRICE_SHORT}`,
            href: '/checkout/mentor',
          }}
          secondaryCta={{
            label: 'Chưa có lá số? Lập miễn phí trước',
            href: '/la-so-bat-tu',
          }}
        />

        <OrnamentDivider />

        {/* 3 value blocks — h2 order right after the hero h1. */}
        <section className="bg-background py-12">
          <div className="mx-auto max-w-marketing px-6">
            <div className="grid gap-4 md:grid-cols-3">
              {VALUE_BLOCKS.map((block) => (
                <article
                  key={block.title}
                  className="flex flex-col rounded-[2px] border border-border/60 bg-card/40 p-6 md:p-8"
                >
                  <h2 className="font-editorial-display text-2xl font-normal tracking-tight text-foreground">
                    {block.title}
                  </h2>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">
                    {block.body}
                  </p>
                </article>
              ))}
            </div>

            {/* Differentiation: AI subscription vs human 1-1 consult — a
                recurring confusion; keep the two products clearly apart. */}
            <p className="mx-auto mt-8 max-w-marketing-text text-center font-sans text-sm text-muted-foreground/80">
              {"Mentor AI khác gói '1-1 cùng founder' — một bên là trợ lý AI luôn trực; một bên là buổi tư vấn trực tiếp với người thật. Xem cả hai ở "}
              <Link
                href="/pricing"
                className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
              >
                trang Giá
              </Link>
              .
            </p>
          </div>
        </section>

        <OrnamentDivider />

        {/* Closing — no-pressure invitation + repeat CTAs. */}
        <section className="bg-background py-16">
          <div className="mx-auto max-w-marketing-text px-6 text-center">
            <p className="text-balance font-editorial-display text-2xl font-normal tracking-tight text-foreground">
              Bạn không cần tin — cứ lập lá số miễn phí, hỏi thử một câu, rồi
              tự quyết.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/checkout/mentor"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-pill bg-[hsl(var(--primary-cta))] px-7 py-4 font-sans text-sm font-medium text-primary-foreground transition-all duration-300 ease-editorial hover:brightness-110 sm:w-auto"
              >
                Bắt đầu với Mentor — {MENTOR_PRICE_SHORT}
              </Link>
              <Link
                href="/la-so-bat-tu"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-pill border border-border px-7 py-4 font-sans text-sm font-medium text-foreground transition-all duration-300 ease-editorial hover:border-border/80 hover:bg-card sm:w-auto"
              >
                Chưa có lá số? Lập miễn phí trước
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
