import type { Metadata } from 'next';
import { PRICING, formatVND } from '@/lib/pricing';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { FaqAccordion, type FaqItem } from '@/components/home/FaqAccordion';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { JsonLd } from '@/components/seo/JsonLd';
import { faqPage } from '@/lib/seo/jsonld';
import { SetHtmlLang } from '@/components/i18n/SetHtmlLang';

// Wave i18n-v1 — first real (hand-translated) English page. Scope is
// intentionally lean: hero + value prop + pricing + FAQ + closing CTA only.
// SiteNav/SiteFooter are reused as-is (Vietnamese labels) for v1 — a known,
// documented limitation, not an oversight (see the plan doc for why).
export const metadata: Metadata = {
  title: { absolute: 'Vietnamese Astrology & Four Pillars AI — hieu.asia' },
  description:
    'Tử Vi and Bát Tự charts calculated from your real birth date and time — cross-checked with MBTI and Big Five. No vague fortune-telling, no scare tactics.',
  alternates: {
    canonical: 'https://hieu.asia/en',
    languages: {
      'vi-VN': 'https://hieu.asia/',
      en: 'https://hieu.asia/en',
      'x-default': 'https://hieu.asia/',
    },
  },
  openGraph: {
    title: 'hieu.asia — Understand yourself. Decide for yourself.',
    description:
      'An AI-guided companion built on East Asian astrology and modern psychology — now in English.',
    url: 'https://hieu.asia/en',
    siteName: 'hieu.asia',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'hieu.asia — an AI companion for understanding yourself and making decisions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'hieu.asia — Understand yourself. Decide for yourself.',
    description: 'Tử Vi · Bát Tự · MBTI, read by AI.',
    images: [{ url: '/og-image.jpg', alt: 'hieu.asia' }],
  },
};

// Matches the exact pattern `app/page.tsx`'s `HomeFaqEntry` uses: every item
// carries BOTH a display version (`a`, JSX, can hold `<strong>` etc.) and a
// plain-text crawler version (`aCrawler`, ≤200 chars, no markup) — the two
// must be kept in sync by hand when either changes. This avoids extracting
// text back out of JSX at runtime, which breaks for any answer that mixes
// plain strings with elements like `<strong>` (React children become an
// array, not a string, in that case).
interface EnFaqEntry extends FaqItem {
  aCrawler: string;
}

const EN_FAQ: readonly EnFaqEntry[] = [
  {
    q: 'Does hieu.asia predict the future?',
    aCrawler:
      "No. We don't claim to predict the future. The goal is to help you see your behavioral patterns and innate tendencies clearly, so you can make better decisions yourself.",
    a: (
      <p>
        No. We don&apos;t claim to predict the future. The goal is to help
        you see your behavioral patterns and innate tendencies clearly, so
        you can make better decisions yourself.
      </p>
    ),
  },
  {
    q: "I don't know my exact birth time — can I still use this?",
    aCrawler:
      'Yes. You can start with MBTI, Big Five, Numerology, and Face Reading without a birth time, and update your chart later once you find more accurate information.',
    a: (
      <p>
        Yes. You can start with MBTI, Big Five, Numerology, and Face
        Reading without a birth time, and update your chart later once you
        find more accurate information.
      </p>
    ),
  },
  {
    q: 'How is my personal data protected?',
    aCrawler:
      "Data is transmitted over encrypted TLS. Reports and exported files are stored on infrastructure with encryption at rest (Cloudflare R2 / Supabase Storage). We don't sell your data or use it to train models. You can delete your account anytime from your Account page.",
    a: (
      <p>
        Data is transmitted over encrypted TLS. Reports and exported files
        are stored on infrastructure with encryption at rest (Cloudflare R2
        / Supabase Storage). We don&apos;t sell your data or use it to
        train models. You can delete your account anytime from your
        Account page.
      </p>
    ),
  },
  {
    q: 'How much does it cost? Is there a free plan?',
    aCrawler: `Standard is free and includes the intake survey plus basic lookup tools. Premium ${formatVND(PRICING.premium.vnd)} one-time (1 full chart + PDF + 3 Mentor questions). Mentor ${formatVND(PRICING.monthly.vnd)}/month or ${formatVND(PRICING.yearly.vnd)}/year (30 Mentor questions/day + yearly-cycle readings). Lifetime ${formatVND(PRICING.lifetime.vnd)} one-time.`,
    a: (
      <p>
        <strong>Standard is free</strong> — the intake survey plus basic
        lookup tools. <strong>Premium {formatVND(PRICING.premium.vnd)} one-time</strong> (1
        full chart + PDF + 3 Mentor questions).{' '}
        <strong>Mentor {formatVND(PRICING.monthly.vnd)}/month</strong> or{' '}
        <strong>{formatVND(PRICING.yearly.vnd)}/year</strong> (30 Mentor
        questions/day + yearly-cycle readings).{' '}
        <strong>Lifetime {formatVND(PRICING.lifetime.vnd)} one-time</strong>.
      </p>
    ),
  },
  {
    q: 'Can I cancel anytime?',
    aCrawler:
      "Yes. Cancel from your Account page — your plan stays active until the end of the paid period, no auto-renewal. Within 24 hours of purchase, if your report hasn't been generated yet, you get a full refund, no questions asked.",
    a: (
      <p>
        Yes. Cancel from your Account page — your plan stays active until
        the end of the paid period, no auto-renewal. Within 24 hours of
        purchase, if your report hasn&apos;t been generated yet, you get a
        full refund, no questions asked.
      </p>
    ),
  },
  {
    q: 'How is hieu.asia different from other fortune-telling apps?',
    aCrawler:
      "Three things: Tử Vi and Bát Tự are calculated using the Northern-school method with 114 stars, not pulled from a lookup table; the AI Mentor holds a real, contextual conversation, not a scripted chatbot; the tone stays calm and non-deterministic — you're always the one who decides.",
    a: (
      <p>
        Three things: (1) Tử Vi and Bát Tự are calculated using the
        Northern-school method with 114 stars — not pulled from a lookup
        table; (2) the AI Mentor holds a real, contextual conversation, not
        a scripted chatbot; (3) the tone stays calm and non-deterministic —
        you&apos;re always the one who decides.
      </p>
    ),
  },
];

const FAQ_JSONLD = {
  ...faqPage(EN_FAQ.map((e) => ({ q: e.q, a: e.aCrawler }))),
  inLanguage: 'en',
};

export default function EnglishLandingPage() {
  return (
    <>
      <SetHtmlLang lang="en" />
      <JsonLd data={FAQ_JSONLD} />
      <SiteNav />
      <main id="main-content" className="min-h-screen bg-background text-foreground pt-nav-safe">
        {/* Hero — static, no interactive calculator (v1 scope cut; the VN
            homepage's InstantChartHero widget is out of scope for now). */}
        <section className="mx-auto max-w-3xl px-6 py-16 text-center sm:py-24">
          <p className="font-mono text-editorial-mono uppercase tracking-[0.12em] text-primary/90">
            Real charts · no fortune-telling
          </p>
          <h1 className="mt-4 text-balance font-editorial-display text-3xl font-normal leading-tight tracking-tight text-foreground sm:text-5xl">
            Understand yourself through <em className="italic text-primary">real charts</em> — not vague predictions.
          </h1>
          <p className="mt-6 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Tử Vi (Vietnamese astrology) and Bát Tự (Four Pillars) calculated
            from your actual birth date and time — cross-checked against
            modern psychology (MBTI, Big Five). No scare tactics, no ritual
            sales.
          </p>
          <a
            href="/onboarding"
            className="mt-8 inline-flex items-center justify-center rounded-[2px] bg-[hsl(var(--primary-cta))] px-8 py-3 font-editorial-display text-base font-medium text-primary-foreground transition-all duration-300 hover:brightness-110"
          >
            Get my free chart →
          </a>
          <p className="mt-3 font-mono text-editorial-mono uppercase tracking-[0.12em] text-muted-foreground">
            No card required · takes about 30 seconds
          </p>
        </section>

        {/* Value prop — condensed version of the VN homepage's Methodology
            section (full component out of scope for v1). */}
        <section className="border-y border-border bg-muted/30 py-12">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <p className="text-pretty text-base leading-relaxed text-foreground/90 sm:text-lg">
              hieu.asia combines four lenses — Vietnamese astrology (Tử Vi),
              Chinese Four Pillars (Bát Tự), and modern psychology (MBTI,
              Big Five) — into one picture, read by an AI Mentor you can
              actually talk to. Every calculation runs from your real birth
              data, not a lookup table.
            </p>
          </div>
        </section>

        {/* Pricing — plain JSX, not the shared PricingTierV2 component
            (that component has Vietnamese strings hard-coded into its JSX,
            not exposed as props — see plan doc Task 7 context). Same VND
            prices as the Vietnamese homepage (single source of truth:
            lib/pricing.ts), English sentence structure around them. */}
        <section id="pricing" className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center font-editorial-display text-2xl font-normal text-foreground sm:text-3xl">
            Go as deep as you want
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card/40 p-6">
              <h3 className="font-heading text-lg font-semibold text-foreground">Free</h3>
              <p className="mt-1 text-2xl font-semibold text-foreground">{formatVND(PRICING.standard.vnd)}</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Intake survey and basic lookup tools — no card needed.
              </p>
              <a
                href="/onboarding"
                className="mt-4 inline-block rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-card"
              >
                Start free
              </a>
            </div>
            <div className="rounded-2xl border border-gold/40 bg-card/60 p-6 ring-1 ring-gold/20">
              <h3 className="font-heading text-lg font-semibold text-foreground">Premium</h3>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {formatVND(PRICING.premium.vnd)} <span className="text-sm font-normal text-muted-foreground">one-time</span>
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                One full chart + PDF + 3 Mentor questions.
              </p>
              <a
                href="/onboarding"
                className="mt-4 inline-block rounded-md bg-gold px-4 py-2 text-sm font-semibold text-ink hover:bg-gold/90"
              >
                Unlock 1 chart
              </a>
            </div>
            <div className="rounded-2xl border border-border bg-card/40 p-6">
              <h3 className="font-heading text-lg font-semibold text-foreground">Mentor</h3>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {formatVND(PRICING.monthly.vnd)} <span className="text-sm font-normal text-muted-foreground">/month</span>
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                30 Mentor questions/day, plus yearly-cycle readings.
              </p>
              <a
                href="/onboarding"
                className="mt-4 inline-block rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-card"
              >
                Start with Mentor
              </a>
            </div>
          </div>
          <p className="mt-6 text-center text-eyebrow uppercase text-muted-foreground">
            Full refund within 24h if your report hasn&apos;t been generated yet · 14-day guarantee
          </p>
        </section>

        <FaqAccordion
          items={EN_FAQ}
          id="faq"
          eyebrow="Frequently asked"
          title="Everything you'd want to ask first"
        />

        <div className="mx-auto flex max-w-marketing-tight flex-col items-center gap-3 px-6 py-10 text-center sm:py-12">
          <p className="font-editorial-display text-2xl leading-snug text-foreground sm:text-3xl">
            Ready? Your chart is <em className="italic text-primary">calculated in 30 seconds</em>.
          </p>
          <a
            href="/onboarding"
            className="inline-flex items-center justify-center rounded-[2px] bg-[hsl(var(--primary-cta))] px-8 py-3 font-editorial-display text-base font-medium text-primary-foreground transition-all duration-300 hover:brightness-110"
          >
            Get my free chart →
          </a>
          <p className="font-mono text-editorial-mono uppercase tracking-[0.12em] text-muted-foreground">
            No card required · your chart is yours to keep
          </p>
        </div>
      </main>
      <SiteFooter />
      <StickyMobileCta trackId="home-en" label="Get my chart" />
    </>
  );
}
