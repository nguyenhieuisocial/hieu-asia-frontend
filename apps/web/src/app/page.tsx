import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@hieu-asia/ui';
import { ThemeToggle } from '@/components/theme-toggle';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Testimonials } from '@/components/landing/Testimonials';
import { PricingPreview } from '@/components/landing/PricingPreview';
import { FAQ } from '@/components/landing/FAQ';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'hieu.asia — Hiểu chính mình. Quyết định tốt hơn.',
  description:
    'Phân tích Tử Vi, Bát Tự, MBTI và lòng bàn tay bằng AI. Báo cáo định hướng hành động, không định mệnh hóa — người bạn đồng hành huyền học hiện đại cho người Việt.',
  alternates: { canonical: 'https://hieu.asia' },
  openGraph: {
    title: 'hieu.asia — Hiểu chính mình. Quyết định tốt hơn.',
    description:
      'Tử Vi · MBTI · Palm Reading · AI Mentor. Phân tích sâu, đồng cảm, không định mệnh hóa.',
    url: 'https://hieu.asia',
    type: 'website',
  },
};

const ORGANIZATION_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'hieu.asia',
  url: 'https://hieu.asia',
  logo: 'https://hieu.asia/icon',
  sameAs: ['https://t.me/hieuasiabot'],
  description: 'AI phân tích Tử Vi, Bát Tự, MBTI và lòng bàn tay.',
};

const WEBSITE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'hieu.asia',
  url: 'https://hieu.asia',
  inLanguage: 'vi-VN',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://hieu.asia/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default function LandingPage() {
  return (
    <main id="main-content" className="min-h-screen bg-ink text-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSONLD) }}
      />
      <SiteHeader />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <PricingPreview />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}

function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-cream/5 bg-ink/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="font-heading text-lg font-bold text-gold sm:text-xl">
          hieu.asia
        </Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Điều hướng chính">
          <a href="#features" className="text-sm text-cream/70 transition-colors hover:text-gold">
            Tính năng
          </a>
          <a href="#how" className="text-sm text-cream/70 transition-colors hover:text-gold">
            Cách hoạt động
          </a>
          <a href="#pricing" className="text-sm text-cream/70 transition-colors hover:text-gold">
            Bảng giá
          </a>
          <a href="#faq" className="text-sm text-cream/70 transition-colors hover:text-gold">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/onboarding" className="hidden sm:inline-flex">
            <Button size="sm">Bắt đầu</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
