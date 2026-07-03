import type { Metadata } from 'next';
import { Calendar, User, Briefcase, HelpCircle, Heart } from 'lucide-react';
import { PRICING, formatVND } from '@/lib/pricing';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { FaqAccordion, type FaqItem } from '@/components/home/FaqAccordion';
import { NewsletterSignup } from '@/components/home/NewsletterSignup';
import { AstroTickerLive } from '@/components/home/AstroTickerLive';
import { TrustBand } from '@/components/home/TrustBand';
import { StartupPath } from '@/components/home/StartupPath';
// Wave 62.04 — homepage swapped from MarketingHero → HeroV4 (split layout
// + 12-cung neo thị giác + 2 entry points). MarketingHero stays the
// canonical reusable hero for /pricing /features /about /methodology
// /checkout. HomeHeroEyebrow + LotusLottie removed here — neither has a
// home in the editorial hero (eyebrow text is inline, lotus motion
// replaced by static 12-cung schematic per founder spec).
// Wave 62.08 — BentoLens swapped to EditorialList for the "Bốn ống kính"
// section per founder vault 138 spec "đa số section 4 thẻ vuông có thể
// chuyển sang editorial list dọc với số thứ tự". BentoLens component stays
// available for other pages. DisciplineGlyph imports dropped here — the
// new EditorialList doesn't surface icons (editorial restraint per spec).
// Wave 62.07 — SocialProofQuiet added between Pricing + FAQ as anti-
// testimonial "khoảng lặng" section (4 anonymous decision excerpts in
// founder voice, no stars/faces).
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
// Homepage hero "4 lăng kính → AI" (MultiHero) + editorial sections. Moved out
// of the retired /muc-lab demo into components/home-hero/. HeroV4 stays
// available for other surfaces.
import { MultiHero } from '@/components/home-hero/MultiHero';
import { OracleBrain } from '@/components/home-hero/OracleBrain';
import { InstantChartHero } from '@/components/home-hero/InstantChartHero';
import { NotOraclesStrip } from '@/components/home-hero/NotOraclesStrip';
import { Methodology } from '@/components/home-hero/Methodology';
import { ToolkitSection } from '@/components/home-hero/ToolkitSection';
import { MissionNote } from '@/components/home-hero/MissionNote';
import { EngineProofShowcase } from '@/components/home-hero/EngineProofShowcase';
import { PricingTierV2 } from '@/components/marketing/PricingTierV2';
import { SampleOutputShowcase } from '@/components/marketing/SampleOutputShowcase';
import { MentorSampleLazy } from '@/components/marketing/MentorSampleLazy';
import { ScanRow } from '@/components/marketing/ScanRow';
import { PullQuote } from '@/components/marketing/PullQuote';
import { SocialProofQuiet } from '@/components/marketing/SocialProofQuiet';
import { RevealOnScroll } from '@/components/motion/RevealOnScroll';
import { ScrollProgress } from '@/components/fx/ScrollProgress';

export const metadata: Metadata = {
  // Homepage title already contains the brand → bypass the layout
  // template `%s · hieu.asia` via `{ absolute: ... }` to avoid the
  // "hieu.asia ... · hieu.asia" duplication.
  title: {
    absolute: 'Tử Vi & Bát Tự AI — hieu.asia | Cẩm nang hiểu mình',
  },
  description:
    'Kết hợp Tử Vi, Bát Tự, MBTI, Big Five, DISC, Enneagram, Xem Tướng, Tarot… cùng AI Mentor để hiểu bản thân, đặt câu hỏi đúng và tự quyết định có trách nhiệm.',
  alternates: { canonical: 'https://hieu.asia/' },
  openGraph: {
    title: 'hieu.asia — Hiểu mình. Quyết định mình.',
    description:
      'Cẩm nang AI cá nhân hoá bằng cổ học Á Đông và tâm lý hiện đại — trình bày bằng tiếng Việt.',
    url: 'https://hieu.asia/',
    siteName: 'hieu.asia',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'hieu.asia — Cẩm nang AI giúp hiểu mình và ra quyết định',
      },
    ],
  },
  // V4-FIX BUG-NEW5: see note in app/layout.tsx — Twitter Cards spec doesn't
  // define `twitter:image:width` / `:height`; only `:alt` is allowed.
  twitter: {
    card: 'summary_large_image',
    title: 'hieu.asia — Hiểu mình. Quyết định mình.',
    description:
      'Cẩm nang AI cá nhân hoá bằng cổ học Á Đông và tâm lý hiện đại — trình bày bằng tiếng Việt.',
    images: [
      {
        url: '/og-image.jpg',
        alt: 'hieu.asia — Cẩm nang AI giúp hiểu mình và ra quyết định',
      },
    ],
  },
};

const ORGANIZATION_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'hieu.asia',
  url: 'https://hieu.asia',
  logo: 'https://hieu.asia/icon-512.png',
  sameAs: ['https://t.me/hieuasiabot'],
  description:
    'Hiểu mình. Quyết định mình. AI giải mã Tử Vi, Bát Tự, MBTI và tướng tay theo tri thức cổ học Á Đông, trình bày bằng tiếng Việt cho người Việt.',
};

const WEBSITE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'hieu.asia',
  url: 'https://hieu.asia',
  inLanguage: 'vi-VN',
};

const HOWTO_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Bắt đầu trong 3 phút với hieu.asia',
  description:
    'Ba bước để có góc nhìn huyền học cá nhân hóa: nhập thông tin, để AI phân tích, trò chuyện với AI Mentor.',
  inLanguage: 'vi-VN',
  totalTime: 'PT3M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Nhập thông tin cơ bản',
      text: 'Cung cấp ngày giờ sinh và giới tính. Khoảng 1 phút, có thể chỉnh sửa sau.',
      url: 'https://hieu.asia/onboarding',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'AI phân tích trong 30 giây',
      text: 'Hệ thống tổng hợp Tử Vi, Bát Tự, MBTI, Big Five và Xem Tướng (cùng các công cụ như Thần Số Học) thành một bức tranh rõ ràng.',
      url: 'https://hieu.asia/#how',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Trò chuyện với AI Mentor để hành động',
      text: 'Đặt câu hỏi về quyết định bạn đang cân nhắc. Mentor gợi ý các bước tiếp theo.',
      url: 'https://hieu.asia/onboarding',
    },
  ],
};

const SERVICES_JSONLD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Tử Vi Đẩu Số',
      serviceType: 'Tử Vi astrology reading',
      provider: { '@type': 'Organization', name: 'hieu.asia', url: 'https://hieu.asia' },
      areaServed: 'VN',
      inLanguage: 'vi-VN',
      url: 'https://hieu.asia/learn/tu-vi',
      description:
        'Lá số Tử Vi 12 cung với chính tinh và phụ tinh — bản đồ 12 lĩnh vực đời sống.',
    },
    {
      '@type': 'Service',
      name: 'Bát Tự Tứ Trụ',
      serviceType: 'Bát Tự (BaZi) reading',
      provider: { '@type': 'Organization', name: 'hieu.asia', url: 'https://hieu.asia' },
      areaServed: 'VN',
      inLanguage: 'vi-VN',
      url: 'https://hieu.asia/learn/bat-tu',
      description:
        'Bát Tự 4 trụ Năm – Tháng – Ngày – Giờ theo Ngũ Hành — cân bằng năng lượng bẩm sinh.',
    },
    {
      '@type': 'Service',
      name: 'MBTI 16 loại tính cách',
      serviceType: 'MBTI personality assessment',
      provider: { '@type': 'Organization', name: 'hieu.asia', url: 'https://hieu.asia' },
      areaServed: 'VN',
      inLanguage: 'vi-VN',
      url: 'https://hieu.asia/learn/mbti',
      description:
        'MBTI dựa trên 4 trục của Carl Jung — khung tự nhận thức về cách bạn vận hành tự nhiên.',
    },
    {
      '@type': 'Service',
      name: 'Big Five (OCEAN)',
      serviceType: 'Big Five (OCEAN) personality assessment',
      provider: { '@type': 'Organization', name: 'hieu.asia', url: 'https://hieu.asia' },
      areaServed: 'VN',
      inLanguage: 'vi-VN',
      url: 'https://hieu.asia/big-five',
      description:
        'Trắc nghiệm Big Five (OCEAN) — 5 chiều tính cách có cơ sở khoa học vững nhất, kèm bản đọc sâu cá nhân hoá.',
    },
    {
      '@type': 'Service',
      name: 'Xem Tướng AI',
      serviceType: 'Palmistry / chiromancy AI analysis',
      provider: { '@type': 'Organization', name: 'hieu.asia', url: 'https://hieu.asia' },
      areaServed: 'VN',
      inLanguage: 'vi-VN',
      url: 'https://hieu.asia/learn/palm',
      description:
        'AI phân tích 7 đường chính trên lòng bàn tay — tâm đạo, trí đạo, sinh đạo và các đường phụ.',
    },
  ],
};

// FAQPage JSON-LD — answers ≤200 chars each, mirror the visible FAQ semantics
// but trimmed for crawlers (rich-result eligibility). Keep in sync with HOME_FAQ
// below: if you change the visible Q&A, update this block too.
const FAQ_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  inLanguage: 'vi-VN',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'hieu.asia có dự đoán tương lai không?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Không. Chúng tôi không dự đoán tương lai. Mục tiêu là giúp bạn nhìn rõ mẫu hình hành vi và động lực bẩm sinh để tự ra quyết định tốt hơn.',
      },
    },
    {
      '@type': 'Question',
      name: 'Tôi không có giờ sinh chính xác thì có dùng được không?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Có. Bạn vẫn dùng được MBTI, Big Five, Thần Số Học và Xem Tướng mà không cần giờ sinh. Có thể cập nhật lá số bất cứ lúc nào sau đó.',
      },
    },
    {
      '@type': 'Question',
      name: 'Dữ liệu cá nhân được bảo vệ thế nào?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Mã hoá AES-256 khi lưu trữ, TLS 1.3 khi truyền. Không bán dữ liệu, không dùng để huấn luyện mô hình. Tuân thủ Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 và Nghị định 356/2025/NĐ-CP. Xoá tài khoản trong trang Tài khoản.',
      },
    },
    {
      '@type': 'Question',
      name: 'Giá bao nhiêu? Có dùng thử miễn phí không?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Tier Standard miễn phí gồm các công cụ tra cứu cơ bản. Premium ${formatVND(PRICING.premium.vnd)} một lần, Mentor Monthly ${formatVND(PRICING.monthly.vnd)}/tháng hoặc Mentor Yearly ${formatVND(PRICING.yearly.vnd)}/năm, Lifetime ${formatVND(PRICING.lifetime.vnd)} một lần.`,
      },
    },
    {
      '@type': 'Question',
      name: 'Tôi có thể huỷ gói subscription bất cứ lúc nào?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Có. Huỷ trong trang Tài khoản, gói dùng hết kỳ đã thanh toán, không tự gia hạn. Hoàn tiền 100% trong 24h nếu báo cáo chưa tạo.',
      },
    },
    {
      '@type': 'Question',
      name: 'hieu.asia có khác gì với các app xem bói khác?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tử Vi và Bát Tự tính theo Bắc phái với 121 sao (không tra bảng), Mentor AI đối thoại có ngữ cảnh, văn phong điềm tĩnh không định mệnh hoá.',
      },
    },
  ],
};

// SoftwareApplication JSON-LD — offers sourced from PRICING (lib/pricing.ts).
// No aggregateRating: we have no audited review data and refuse to fabricate.
const SOFTWARE_APP_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'hieu.asia',
  url: 'https://hieu.asia',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Web',
  description:
    'Kết hợp Tử Vi, Bát Tự, MBTI, Big Five, DISC, Enneagram, Xem Tướng, Tarot… cùng AI Mentor để hiểu bản thân, đặt câu hỏi đúng và tự quyết định có trách nhiệm.',
  inLanguage: 'vi-VN',
  offers: [
    {
      '@type': 'Offer',
      name: PRICING.premium.label,
      price: String(PRICING.premium.vnd),
      priceCurrency: 'VND',
    },
    {
      '@type': 'Offer',
      name: PRICING.monthly.label,
      price: String(PRICING.monthly.vnd),
      priceCurrency: 'VND',
    },
    {
      '@type': 'Offer',
      name: PRICING.yearly.label,
      price: String(PRICING.yearly.vnd),
      priceCurrency: 'VND',
    },
    {
      '@type': 'Offer',
      name: PRICING.lifetime.label,
      price: String(PRICING.lifetime.vnd),
      priceCurrency: 'VND',
    },
  ],
};

const HOME_FAQ: readonly FaqItem[] = [
  {
    q: 'hieu.asia có dự đoán tương lai không?',
    a: (
      <p>
        Không. Chúng tôi không tuyên bố dự đoán tương lai. Mục tiêu của hieu.asia
        là giúp bạn nhìn rõ mẫu hình hành vi và động lực bẩm sinh, để bạn tự ra
        quyết định tốt hơn.
      </p>
    ),
  },
  {
    q: 'Tôi không có giờ sinh chính xác thì có dùng được không?',
    a: (
      <p>
        Có. Bạn vẫn có thể bắt đầu với MBTI, Big Five, Thần Số Học và Xem Tướng mà
        không cần giờ sinh. Khi tìm được thông tin chính xác hơn, bạn có thể cập
        nhật lá số bất cứ lúc nào.
      </p>
    ),
  },
  {
    q: 'Dữ liệu cá nhân được bảo vệ thế nào?',
    a: (
      <>
        <p>
          Toàn bộ dữ liệu được mã hoá AES-256 khi lưu trữ và truyền qua TLS 1.3.
          Chúng tôi không bán dữ liệu cho bên thứ ba và không dùng dữ liệu của
          bạn để huấn luyện mô hình.
        </p>
        <p className="mt-2">
          Bạn có thể yêu cầu xoá toàn bộ tài khoản trong trang Tài khoản. Tuân
          thủ Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 và Nghị định 356/2025/NĐ-CP
          (thay thế Nghị định 13/2023/NĐ-CP).
        </p>
      </>
    ),
  },
  {
    q: 'Giá bao nhiêu? Có dùng thử miễn phí không?',
    a: (
      <p>
        Tier <strong>Standard miễn phí</strong> gồm khảo sát đầu vào và các công
        cụ tra cứu cơ bản. <strong>Premium {formatVND(PRICING.premium.vnd)} một lần</strong>{' '}
        (1 lá số đầy đủ + PDF + 3 câu hỏi Mentor).{' '}
        <strong>Mentor Monthly {formatVND(PRICING.monthly.vnd)}/tháng</strong> hoặc{' '}
        <strong>Mentor Yearly {formatVND(PRICING.yearly.vnd)}/năm</strong> (Mentor
        không giới hạn + đại vận/lưu niên).{' '}
        <strong>Lifetime {formatVND(PRICING.lifetime.vnd)} một lần</strong>. Xem
        chi tiết tại trang Pricing.
      </p>
    ),
  },
  {
    q: 'Tôi có thể huỷ gói subscription bất cứ lúc nào?',
    a: (
      <p>
        Có. Bạn huỷ trong trang Tài khoản — gói vẫn dùng được đến hết kỳ đã
        thanh toán, không tự gia hạn. Trong 24h sau khi mua, nếu báo cáo chưa
        tạo, bạn được hoàn 100% không cần lý do. Sau khi báo cáo đã tạo, trong
        vòng 14 ngày vẫn được xem xét hoàn tiền nếu có lỗi kỹ thuật hoặc trải
        nghiệm không đúng mô tả. Mỗi yêu cầu được xử lý trong 24h.
      </p>
    ),
  },
  {
    q: 'hieu.asia có khác gì với các app xem bói khác?',
    a: (
      <>
        <p>
          Ba điểm khác biệt rõ ràng: (1) tính toán Tử Vi và Bát Tự theo trường
          phái Bắc phái với 121 sao, không phải bảng tra cứu sẵn; (2) Mentor AI
          đặt câu hỏi và đối thoại có ngữ cảnh, không phải chatbot scripted;
          (3) văn phong điềm tĩnh, không định mệnh hoá — bạn vẫn là người chọn.
        </p>
      </>
    ),
  },
];

export default function LandingPage() {
  return (
    <>
      <ScrollProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICES_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SOFTWARE_APP_JSONLD) }}
      />
      <SiteNav />
      <main id="main-content" className="min-h-screen bg-background text-foreground pt-16">
        {/* 1. Hero — Wave 60.66.P2 Option E (vault 109 §3 Phase 2)
            bg="painted" enables PaintedCanvas (SVG noise + radial gold + linear
            warm-dark fade) + GlassPanel CTA overlay. Other heroes (/pricing,
            /features, /about, /methodology, /checkout) keep default bg="flat". */}
        {/* Wave 60.95.r — removed hero eyebrow slot entirely per founder
            direction. Wave 60.95.o removed the seeded LiveCounterEyebrow
            (1.243 reports / 4.8★) and replaced with a factual "4 ỐNG KÍNH
            · MỘT BỨC TRANH" eyebrow, but founder requested removing the
            slot itself for a tighter hero. The 4-discipline value-prop is
            already communicated via the EditorialList section below the hero
            (BỐN ỐNG KÍNH eyebrow + 4 lens cards), so deduplicating cleans
            up the above-the-fold real estate. The HeroBadgeScroll motion
            wrapper is dropped here too — without an eyebrow child it has
            nothing to animate. */}
        {/* Wave 62.04 — HeroV4 ("Như giấy cũ" editorial hero). Split layout
            with 12-cung schematic SVG as visual anchor, two entry points
            for two-audience problem (modern AI vs traditional cổ học),
            Newsreader italic accent on signature headline. Replaces
            MarketingHero(bg="painted") which served the previous warm-dark
            casino-adjacent direction. Wave 62 master plan in
            docs/superpowers/plans/2026-05-28-wave-62-homepage-redesign.md.

            Wave 61.07 PostHog flag `home-hero-eyebrow` (eyebrow A/B test)
            is now part of HeroV4 internal eyebrow text — no external prop
            needed. The eyebrow copy in HeroV4 reads
            "Cẩm nang quyết định bằng AI" which aligns with the founder
            signature copy and supersedes the old A/B variant.

            Old `secondaryCta` "Xem báo cáo mẫu" deferred — the new hero
            uses /tu-vi-2026 as secondary destination for the traditional
            audience. Sample report still discoverable via inline CTA at
            the EditorialList "Bốn ống kính" section closing line. */}
        {/* Phase 1 — cửa trước THẬT: lá số Bát Tự client-side hiện ngay khi
            khách nhập ngày sinh (thay teaser GIẢ cũ). Niềm tin TRƯỚC form.
            Đặt trên MultiHero để là thứ đầu tiên người lạ chạm vào. */}
        <InstantChartHero />

        {/* Câu chuyện thương hiệu "năm lăng kính → AI" — giữ bản sắc editorial */}
        <MultiHero />

        {/* Bộ não Oracle — khu nền tối: đồ thị TOÀN BỘ công cụ hội tụ về "Bạn".
            Mảng signature immersive; tương phản nền tối để chòm sao sáng rực. */}
        <OracleBrain />

        {/* Brand "không phải oracle" — editorial decoder strip ngay dưới hero */}
        <RevealOnScroll><NotOraclesStrip /></RevealOnScroll>

        {/* Thiên văn hôm nay — dải lịch can-chi & giờ hoàng đạo chạy động (dữ
            liệu THẬT, tính client-side; cho cảm giác "sống" + lý do quay lại
            mỗi ngày). Đặt sau "không phải oracle" để khung lịch/thực-dụng rõ. */}
        <AstroTickerLive />

        {/* Trust band — đưa "Bằng Chứng" (moat) + độ-tin THẬT lên cao (mẫu
            trust-signal nổi bật của Bitget; tuyên bố đều kiểm chứng được). */}
        <RevealOnScroll><TrustBand /></RevealOnScroll>

        {/* Wave 64 (declutter) — gieo giá sớm ngay sau trust: hạ rào cản, cho
            thấy "miễn phí" + mức vào trước khi cuộn sâu tới bảng giá. Cố ý KHÔNG
            nhắc "hoàn tiền" ở đây (giữ ở bảng giá cạnh điều khoản — review #2). */}
        <div className="mx-auto flex max-w-marketing-tight flex-col items-center gap-1.5 px-6 pt-8 text-center sm:flex-row sm:justify-center sm:gap-3">
          <p className="text-editorial-caption text-muted-foreground">
            Lá số &amp; 5 lăng kính cơ bản{' '}
            <strong className="font-medium text-foreground">miễn phí mãi mãi</strong> · đọc sâu từ{' '}
            {formatVND(PRICING.premium.vnd)}.
          </p>
          <a
            href="#pricing"
            className="whitespace-nowrap font-mono text-editorial-mono uppercase tracking-[0.12em] text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
          >
            Xem các gói →
          </a>
        </div>

        {/* Wave 63.4 — removed the IntentChips "HOẶC BẮT ĐẦU TỪ" 6-lens strip.
            Founder (vault 138 review #2): the hero had THREE stacked start
            mechanisms — HeroV4's 2 CTAs, this 6-lens strip, and the ScanRow
            "TÔI MUỐN" intent cards below. (2) and (3) did the same job and
            "Đại vận"/"MBTI" appeared in both → choice overload + redundancy.
            Kept ScanRow as the single primary intent router; the lenses are
            still explorable via the "Bốn ống kính" EditorialList section.
            This also removes "Tướng tay"/Palm from the hero, where it sat as
            a peer of the 4 canonical ống kính despite being a secondary
            (no-birth-time) entry — keeping the "bốn ống kính" message clean. */}

        {/* Wave 60.95.d P1-11 — ScanRow refactored taxonomy → user intent.
            Vault 130 §1 + ChatGPT review §2.2: user intent first, discipline
            as secondary mono-tag. 5 intent cards mapping question-as-card →
            tool deep-link. Mobile horizontal scroll + desktop 4-col grid
            (5th card wraps to 2nd row on lg). Pre-rendered Lucide icons
            (Wave 60.65.P0a RSC pattern). */}
        <ScanRow
          eyebrow="TÔI MUỐN..."
          title={
            <>
              Bạn đang phân vân{' '}
              <u className="underline decoration-primary decoration-2">
                về điều gì
              </u>
              <span className="text-primary">.</span>
            </>
          }
          items={[
            {
              id: 'intent-self',
              icon: <User className="size-5 text-primary" strokeWidth={1.5} />,
              tag: 'LÁ SỐ TỔNG QUAN',
              label: 'Tôi muốn hiểu bản thân',
              body: 'Lá số Tử Vi + Bát Tự + MBTI gộp lại — một bức tranh tổng thể về thiên hướng và năng lượng bẩm sinh.',
              href: '/onboarding?intent=self',
            },
            {
              id: 'intent-career',
              icon: <Briefcase className="size-5 text-primary" strokeWidth={1.5} />,
              tag: 'TỬ VI CUNG QUAN',
              label: 'Tôi đang chọn nghề',
              body: 'Đọc cung Quan + cung Tài trong bản đồ 12 cung — gợi ý hướng nghề phù hợp ưu thế tự nhiên.',
              href: '/onboarding?intent=career',
            },
            {
              id: 'intent-decision',
              icon: <HelpCircle className="size-5 text-primary" strokeWidth={1.5} />,
              tag: 'AI MENTOR',
              label: 'Tôi đang phân vân quyết định',
              body: 'Mentor AI đặt câu hỏi mở dựa trên lá số — soi rõ giả định và rủi ro thay vì phán quyết hộ bạn.',
              href: '/onboarding?intent=decision',
            },
            {
              id: 'intent-year',
              icon: <Calendar className="size-5 text-primary" strokeWidth={1.5} />,
              tag: 'LƯU NIÊN · ĐẠI VẬN',
              label: 'Tôi muốn xem năm 2026',
              body: 'Đại vận 10 năm + lưu niên Bính Ngọ 2026 — chu kỳ thời gian áp lên lá số gốc.',
              href: '/tu-vi-2026',
            },
            {
              id: 'intent-relationship',
              icon: <Heart className="size-5 text-primary" strokeWidth={1.5} />,
              tag: 'HỢP ĐÔI · BÁT TỰ',
              label: 'Tôi muốn xem quan hệ',
              body: 'So sánh Bát Tự ngũ hành hai người — nhận diện nơi tương sinh và nơi cần kiên nhẫn.',
              href: '/onboarding?intent=relationship',
            },
          ]}
          bg="warm-dark-100"
        />

        {/* Methodology — show-your-work: cơ chế 4 lăng kính → AI, đặt trước trust (review #23). */}
        <RevealOnScroll><Methodology /></RevealOnScroll>
        {/* Breadth — chống undersell (founder feedback): KHÔNG chỉ 4 lăng kính, có cả bộ 12 công cụ. */}
        <RevealOnScroll><ToolkitSection /></RevealOnScroll>

        {/* Wave 64 (declutter) — 3 khối bỏ ở đây:
            • WhyTrust + HowToStart: niềm tin đã do TrustBand phủ SỚM (gồm Bằng
              Chứng); các bước bắt đầu do StartupPath (ngay trước Pricing).
            • EditorialList "NĂM ỐNG KÍNH": TRÙNG với Methodology ("Năm lăng kính,
              một bức tranh") ở trên — Methodology giờ mang link /learn từng lăng
              kính. Bỏ ~5 màn cuộn (nặng nhất trên mobile = 80% user).
            Cả 3 component vẫn còn trong repo cho surface khác. */}

        {/* Wave 60.95.o — removed BigNumberRow section per founder direction.
            The block advertised seed numbers (1243 reports/4.8★) that the
            product can't yet defend; per vault 108 §5 Risk 3 ("Founder must
            be able to defend the number; if not, swap to neutral copy"),
            replacing fake social proof with no-proof is more honest than
            wrong-proof. 14-day refund promise lives on /pricing CTA and as
            MarketingHero trustLine, so the risk-reversal is not lost. */}

        {/* Wave 60.95.ak — PhilosophyBlock removed per founder direction
            (TRIẾT LÝ block "Bạn vẫn là người quyết định" + body "Tử Vi không
            tiên tri..."). Philosophy stance now lives entirely in the PullQuote
            below (same message, denser editorial format).
            PhilosophyBlock component itself stays in `marketing/` and renders
            on /about page (gitnexus impact confirmed LOW + isolated usage).
            2026-06-23 — bỏ SectionDivider lotus (founder: ngôi sao ngắt trang
            thừa, phí chiều cao); PullQuote tự đủ "khoảng thở" editorial. */}

        {/* Wave 60.66.P5 — Editorial PullQuote between philosophy and pricing
            (vault 109 §3 Phase 5 ENRICHED). Motion `whileInView` fade-in via
            LazyMotion provider (Phase 2 root setup). One of 3 preserved
            Instrument Serif decorative roles. */}
        <PullQuote attribution="— Triết lý hieu.asia" bg="warm-dark-100">
          Trí tuệ phương Đông không phải lời tiên tri.{' '}
          Đó là <em className="text-primary/80">khoảng lặng</em> để bạn nghe rõ chính mình.
        </PullQuote>

        {/* Wave 64 — EngineProofShowcase: lá số Tử Vi + bảng Bát Tự MẪU (data
            tĩnh, có nhãn demo) ngay trước báo cáo mẫu — cho thấy "lá số được
            TÍNH RA" trước khi đọc kết quả. Phá đơn điệu text + chứng minh
            "tính thật, không tra bảng". */}
        <RevealOnScroll><EngineProofShowcase /></RevealOnScroll>

        {/* Wave 60.95.c P1-6 — SampleOutputShowcase (vault 130 §III P1-6, biggest
            conversion lever per ChatGPT R6 §3.2). Surfaces 4 illustrative report
            chunks (Cung Mệnh + Đại vận + Mentor + Kế hoạch 30d) BEFORE PricingTierV2
            so user sees what they get before seeing the price. Server component,
            no client state — keeps initial bundle flat. Primary CTA →/onboarding,
            secondary →/sample-report (full demo). */}
        <SampleOutputShowcase />

        {/* Wave 60.95.i P2 — MentorSampleInteractive (vault 130 §interaction
            designer). Companion to the static SampleOutputShowcase above:
            3 pre-canned Mentor Q&A buttons let user click → reveal a hand-
            written response, zero LLM cost. Sits between "what you'll get"
            (showcase) and "what it costs" (pricing) so curiosity is closed
            with a touch interaction before price friction. Client component
            (useState for active question), no Motion runtime — pure CSS
            grid-row trick for reveal. */}
        <MentorSampleLazy />

        {/* Lộ trình khởi đầu — band kích-hoạt có khung phần-thưởng THẬT (mẫu
            task-center/rewards của Bitget; mời bạn → voucher giảm giá có thật).
            Đặt trước Giá: làm xong các bước free rồi mới tới gói trả phí. */}
        <RevealOnScroll><StartupPath /></RevealOnScroll>

        {/* Lời mời "lập lá số thật" giờ là HERO (InstantChartHero, trên cùng) —
            teaser GIẢ cũ ở đây đã bỏ. Để khách lướt thẳng xuống giá sau khi
            xem mẫu báo cáo + Mentor demo. */}

        {/* 6. PricingTierV2 — 3 tiers replace 4 (Notion-style toggle + KHUYÊN DÙNG + refund) */}
        {/* Wave 64 — anchor cho "Xem các gói →" (gieo giá sớm); scroll-mt chừa nav dính. */}
        <div id="pricing" aria-hidden="true" className="scroll-mt-24" />
        <PricingTierV2
          eyebrow="GÓI THÀNH VIÊN"
          page="/"
          title={
            <>
              Đi <em className="italic text-primary/80">sâu</em> theo nhịp của bạn
              <span className="text-primary">.</span>
            </>
          }
          tiers={[
            {
              id: 'free',
              name: 'MIỄN PHÍ',
              nameDisplay: 'Khởi đầu',
              description: 'Khảo sát đầu vào và các công cụ tra cứu cơ bản — không cần thẻ.',
              priceMonthly: PRICING.standard.vnd,
              bestFor:
                'bạn muốn thử công cụ và xem tổng quan trước khi quyết định.',
              features: [
                'Khảo sát đầu vào',
                'Công cụ tra cứu cơ bản',
                'Tử Vi · Bát Tự · MBTI · Big Five · Xem Tướng',
                'Lưu hồ sơ cá nhân',
              ],
              ctaLabel: 'Bắt đầu miễn phí',
              ctaHref: '/onboarding',
            },
            {
              id: 'premium',
              name: 'PREMIUM · 1 LÁ SỐ',
              nameDisplay: 'Đối thoại',
              description: 'Một lá số đầy đủ kèm PDF và 3 câu hỏi Mentor AI.',
              priceMonthly: PRICING.premium.vnd,
              // Wave 60.89.HF1 — Premium = one-time purchase (vault 105 §5.2),
              // not a subscription. Without this override the component
              // defaults to "/ tháng" which misleads buyers.
              priceUnit: 'một lần',
              bestFor:
                'bạn muốn báo cáo đầy đủ một lần + PDF để giữ lại.',
              features: [
                'Một lá số Tử Vi đầy đủ',
                'PDF báo cáo có thể tải về',
                '3 câu hỏi với AI Mentor',
                'Lưu trữ vĩnh viễn trong tài khoản',
              ],
              ctaLabel: 'Mở khóa 1 lá số',
              ctaHref: '/pricing#premium',
              primary: true,
              recommended: true,
              refundDays: 14,
            },
            {
              id: 'mentor',
              name: 'MENTOR · KHÔNG GIỚI HẠN',
              nameDisplay: 'Đồng hành',
              description: 'Mentor AI không giới hạn, đại vận và lưu niên hàng năm.',
              // Wave 62.05 — yearly toggle removed on homepage. Yearly +
              // Lifetime live in the /pricing "Tuỳ chọn nâng cao" expandable;
              // the homepage anchor stays on the 199.000₫/tháng entry price
              // so the 3 tiers read as a clean ladder without an extra
              // toggle to evaluate.
              priceMonthly: PRICING.monthly.vnd,
              bestFor:
                'bạn thường xuyên hỏi về quyết định, công việc, quan hệ, kế hoạch năm.',
              features: [
                'Mentor AI không giới hạn câu hỏi',
                'Đại vận và lưu niên hàng năm',
                'Tất cả 5 ống kính sâu',
                'Huỷ bất cứ lúc nào',
              ],
              ctaLabel: 'Dùng Mentor không giới hạn',
              ctaHref: '/pricing#mentor',
              refundDays: 14,
            },
          ]}
        />

        {/* Wave 63.4 — pricing reconciliation + single refund guarantee.
            Founder review #2: (a) the 3-tier table omitted Mentor-Yearly +
            Lifetime that the FAQ lists → "bảng nói 3, FAQ liệt kê 5 = thiếu
            minh bạch". One line now points to the full /pricing page as the
            single source of truth. (b) the refund policy was told 3× in 3
            wordings (hero + FAQ) → one calm "thẻ bảo đảm" line beside pricing;
            the 24h-instant nuance stays in FAQ as a detail. */}
        <div className="mx-auto mt-6 flex max-w-marketing-tight flex-col items-center gap-3 px-6 text-center">
          <p className="font-mono text-editorial-mono uppercase tracking-[0.12em] text-muted-foreground">
            Hoàn 100% trong 24h nếu chưa tạo báo cáo · bảo hành 14 ngày
          </p>
          <p className="text-editorial-caption text-muted-foreground">
            Có gói Mentor theo năm (₫1.990.000) và Lifetime (₫4.990.000) —{' '}
            <a
              href="/pricing"
              className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
            >
              xem tất cả tại trang Giá →
            </a>
          </p>
        </div>

        {/* Wave 62.07 — SocialProofQuiet between Pricing and FAQ.
            Anti-testimonial "khoảng lặng" section — 4 anonymous excerpts
            in founder voice about real decisions (changing jobs, marriage,
            sending child abroad, leaving the city). Italic Newsreader,
            ochre quote marks, NO stars/faces/names. Editorial pulse
            between high-friction pricing and FAQ that closes objections. */}
        <RevealOnScroll><SocialProofQuiet /></RevealOnScroll>
        {/* MissionNote — founder ẩn danh → trust qua sứ mệnh (không testimonial mặt/sao) */}
        <RevealOnScroll><MissionNote /></RevealOnScroll>

        {/* 7. FaqAccordion — existing 6 Q, warm-dark-100 */}
        <div className="bg-muted/40">
          <FaqAccordion items={HOME_FAQ} id="faq" />
        </div>

        {/* 8. NewsletterSignup — existing, warm-dark-50 */}
        <div className="bg-background">
          <RevealOnScroll>
            <NewsletterSignup id="newsletter" />
          </RevealOnScroll>
        </div>

      </main>
      <SiteFooter />
      <StickyMobileCta trackId="home" label="Lập lá số của tôi" />
    </>
  );
}
