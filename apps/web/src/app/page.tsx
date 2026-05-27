import type { Metadata } from 'next';
import { Sparkles, Calendar, Hash, Brain } from 'lucide-react';
import { PRICING } from '@/lib/pricing';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { WhyTrust } from '@/components/home/WhyTrust';
import { HowToStart } from '@/components/home/HowToStart';
import { FaqAccordion, type FaqItem } from '@/components/home/FaqAccordion';
import { NewsletterSignup } from '@/components/home/NewsletterSignup';
import { MarketingHero } from '@/components/marketing/MarketingHero';
import { LiveCounterEyebrow } from '@/components/marketing/LiveCounterEyebrow';
import { LotusLottie } from '@/components/marketing/LotusLottie';
import { BentoLens } from '@/components/marketing/BentoLens';
import { PhilosophyBlock } from '@/components/marketing/PhilosophyBlock';
import { PricingTierV2 } from '@/components/marketing/PricingTierV2';
import { ScanRow } from '@/components/marketing/ScanRow';
import { IntentChips } from '@/components/marketing/IntentChips';
import { BigNumberRow } from '@/components/marketing/BigNumberRow';
import { PullQuote } from '@/components/marketing/PullQuote';
import { SectionDivider } from '@/components/marketing/SectionDivider';

export const metadata: Metadata = {
  // Homepage title already contains the brand → bypass the layout
  // template `%s · hieu.asia` via `{ absolute: ... }` to avoid the
  // "hieu.asia ... · hieu.asia" duplication.
  title: {
    absolute: 'Tử Vi & Bát Tự AI — hieu.asia | Cẩm nang hiểu mình',
  },
  description:
    'Kết hợp Tử Vi, Bát Tự, Thần Số Học, MBTI và AI Mentor để giúp bạn hiểu bản thân, đặt câu hỏi đúng và tự ra quyết định có trách nhiệm.',
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
      text: 'Hệ thống tổng hợp Tử Vi, Bát Tự, Thần Số Học và MBTI thành một bức tranh rõ ràng.',
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
      name: 'Palm Reading AI',
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
        text: 'Có. Bạn vẫn dùng được MBTI, Thần Số Học và Palm Reading mà không cần giờ sinh. Có thể cập nhật lá số bất cứ lúc nào sau đó.',
      },
    },
    {
      '@type': 'Question',
      name: 'Dữ liệu cá nhân được bảo vệ thế nào?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Mã hoá AES-256 khi lưu trữ, TLS 1.3 khi truyền. Không bán dữ liệu, không dùng để huấn luyện mô hình. Tuân thủ Nghị định 13/2023/NĐ-CP. Xoá tài khoản trong trang Tài khoản.',
      },
    },
    {
      '@type': 'Question',
      name: 'Giá bao nhiêu? Có dùng thử miễn phí không?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tier Standard miễn phí gồm 6 công cụ tra cứu. Premium 99.000đ một lần, Mentor Monthly 199.000đ/tháng hoặc Mentor Yearly 1.990.000đ/năm, Lifetime 4.990.000đ một lần.',
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
        text: 'Tử Vi và Bát Tự tính theo Bắc phái với 114 sao (không tra bảng), Mentor AI đối thoại có ngữ cảnh, văn phong calm không định mệnh hoá.',
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
    'Kết hợp Tử Vi, Bát Tự, Thần Số Học, MBTI và AI Mentor để giúp bạn hiểu bản thân, đặt câu hỏi đúng và tự ra quyết định có trách nhiệm.',
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
        Có. Bạn vẫn có thể bắt đầu với MBTI, Thần Số Học và Palm Reading mà
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
          thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân của Việt Nam.
        </p>
      </>
    ),
  },
  {
    q: 'Giá bao nhiêu? Có dùng thử miễn phí không?',
    a: (
      <p>
        Tier <strong>Standard miễn phí</strong> gồm khảo sát đầu vào và 6 công cụ
        tra cứu. <strong>Premium 99.000đ một lần</strong> (1 lá số đầy đủ + PDF
        + 3 câu hỏi Mentor). <strong>Mentor Monthly 199.000đ/tháng</strong> hoặc{' '}
        <strong>Mentor Yearly 1.990.000đ/năm</strong> (Mentor không giới hạn +
        đại vận/lưu niên). <strong>Lifetime 4.990.000đ một lần</strong>. Xem chi
        tiết tại trang Pricing.
      </p>
    ),
  },
  {
    q: 'Tôi có thể huỷ gói subscription bất cứ lúc nào?',
    a: (
      <p>
        Có. Bạn huỷ trong trang Tài khoản — gói vẫn dùng được đến hết kỳ đã
        thanh toán, không tự gia hạn. Bạn có 24h sau khi mua để hoàn tiền
        instant nếu báo cáo chưa tạo. Sau đó, mọi gói trả phí (Premium /
        Mentor / Lifetime) đều có 14 ngày để yêu cầu hoàn tiền nếu không hài
        lòng. Hoàn tiền trong 24h sau khi yêu cầu, không cần lý do.
      </p>
    ),
  },
  {
    q: 'hieu.asia có khác gì với các app xem bói khác?',
    a: (
      <>
        <p>
          Ba điểm khác biệt rõ ràng: (1) tính toán Tử Vi và Bát Tự theo trường
          phái Bắc phái với 114 sao, không phải bảng tra cứu sẵn; (2) Mentor AI
          đặt câu hỏi và đối thoại có ngữ cảnh, không phải chatbot scripted;
          (3) văn phong calm, không định mệnh hoá — bạn vẫn là người chọn.
        </p>
      </>
    ),
  },
];

export default function LandingPage() {
  return (
    <>
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
      <main id="main-content" className="min-h-screen bg-warm-dark-50 text-cream-50 pt-16">
        {/* 1. Hero — Wave 60.66.P2 Option E (vault 109 §3 Phase 2)
            bg="painted" enables PaintedCanvas (SVG noise + radial gold + linear
            warm-dark fade) + GlassPanel CTA overlay. Other heroes (/pricing,
            /features, /about, /methodology, /checkout) keep default bg="flat". */}
        <MarketingHero
          bg="painted"
          eyebrow={<LiveCounterEyebrow count={1243} period="trong tuần" rating={4.8} />}
          title={
            // Wave 60.95.a P0 — Polypane P1-V1 fix: mobile 320px wrapped headline
            // as 3 lines ("Hiểu mình. / Quyết / định mình."). Wrap second clause
            // in `inline-block` span so `text-balance` treats it as one unit;
            // result: clean 2-line break ("Hiểu mình." / "Quyết định mình.").
            <>
              Hiểu mình.{' '}
              <span className="inline-block">
                <u className="underline decoration-gold decoration-2 underline-offset-[6px]">
                  Quyết định
                </u>{' '}
                mình
                <span className="text-gold-dot drop-shadow-[0_0_16px_rgba(229,198,138,0.18)]">
                  .
                </span>
              </span>
            </>
          }
          subtitle="Bốn ống kính cổ học · một khoảng lặng · bạn vẫn chọn."
          // Wave 60.95.a P0 — CTA unified to "Lập lá số miễn phí" per vault 130 §3
          // P0 #3 (was "Bắt đầu luận giải"). Standardize across site → single
          // primary action verb so users not confused between 5 CTA variants.
          // Secondary CTA pointed to /sample-report (vault 130 P1-6 "show before
          // pricing"). Old "Xem phương pháp" link still discoverable via nav.
          primaryCta={{ label: 'Lập lá số miễn phí', href: '/onboarding' }}
          secondaryCta={{ label: 'Xem báo cáo mẫu', href: '/sample-report' }}
          // Wave 60.95.a P0 — split free/refund into 2 stacked lines per vault 130
          // §3 P0 #5 + Polypane P1-V2 ("free + 14-day-refund cạnh nhau gây nhầm
          // lẫn — miễn phí thì hoàn tiền cái gì?"). Now reads:
          //   Line 1: free trial copy
          //   Line 2: refund applies to paid tiers only
          trustLine={[
            '5 phút · miễn phí · không cần thẻ',
            'Gói trả phí có hoàn tiền trong 14 ngày',
          ]}
          ornament="gold-ring"
          // Wave 60.69 — Lottie lotus rotation intro (vault 109 §4.1). LotusLottie
          // is a client component dynamically imported with ssr:false so its
          // ~30 KB chunk is LAZY-only. Pre-rendered JSX here so the RSC boundary
          // sees a child element value (not a Component reference) — same RSC
          // pattern as Wave 60.65.P0a / 60.66.HF1.
          lottie={<LotusLottie />}
          watermark="Tử Vi"
        />

        {/* Wave 60.66.P3 — IntentChips (vault 109 §3 Phase 3 + vault 108 §5).
            Perplexity-style intent capture below hero — 6 entry points each
            deep-linking to /onboarding?intent=<slug>. Glassmorphism panel
            (cap respected: hero CTAs use 1 panel via PaintedCanvas + this = 2). */}
        <div className="mx-auto -mt-2 max-w-marketing px-6 lg:px-12">
          <IntentChips
            eyebrow="HOẶC BẮT ĐẦU TỪ"
            chips={[
              { slug: 'cung-menh', label: 'Cung mệnh' },
              { slug: 'dai-van', label: 'Đại vận' },
              { slug: 'ngu-hanh', label: 'Ngũ hành' },
              { slug: 'duong-doi', label: 'Đường đời' },
              { slug: 'mbti', label: 'MBTI' },
              { slug: 'tuong-tay', label: 'Tướng tay' },
            ]}
            glass
          />
        </div>

        {/* Wave 52 — persistent disclaimer chip surfaced near hero (also in footer). */}
        <div
          role="note"
          className="mx-auto mt-4 flex max-w-3xl items-center justify-center px-6"
        >
          <p className="rounded-full border border-gold/20 bg-warm-dark-100/60 px-4 py-1.5 text-center text-[11px] leading-snug text-cream-500 backdrop-blur-sm sm:text-xs">
            Kết quả mang tính tham khảo — không thay thế tư vấn y tế, pháp lý hay tài chính.
          </p>
        </div>

        {/* Wave 60.66.P3 — ScanRow (vault 109 §3 Phase 3 + vault 108 §5).
            Mobile top-of-fold scan-fast pattern (Basecamp): 4 ống kính cards in
            horizontal scroll on mobile, 4-col grid on desktop. Pre-rendered Lucide
            icons (Wave 60.65.P0a RSC pattern). */}
        <ScanRow
          eyebrow="ĐỌC NHANH"
          title={
            <>
              Bạn quan tâm{' '}
              <u className="underline decoration-gold decoration-2 underline-offset-[6px]">
                điều gì
              </u>{' '}
              nhất
              <span className="text-gold-dot">.</span>
            </>
          }
          items={[
            {
              id: 'tu-vi',
              icon: <Sparkles className="size-5 text-gold" strokeWidth={1.5} />,
              label: 'Tử Vi cung mệnh',
              body: 'Bản đồ 12 cung — đọc cung mệnh + cung tài + cung quan.',
              href: '/learn/tu-vi',
            },
            {
              id: 'bat-tu',
              icon: <Calendar className="size-5 text-gold" strokeWidth={1.5} />,
              label: 'Bát Tự ngũ hành',
              body: 'Cân ngũ hành bẩm sinh + dụng thần năm sinh.',
              href: '/learn/bat-tu',
            },
            {
              id: 'than-so',
              icon: <Hash className="size-5 text-gold" strokeWidth={1.5} />,
              label: 'Thần Số đời',
              body: 'Numerology — đường đời + ngày sinh + tên.',
              href: '/learn/than-so-hoc',
            },
            {
              id: 'mbti',
              icon: <Brain className="size-5 text-gold" strokeWidth={1.5} />,
              label: 'MBTI 16 loại',
              body: '4 trục Jung — INTJ, ENFP, ISTP, ESFJ...',
              href: '/learn/mbti',
            },
          ]}
          bg="warm-dark-100"
        />

        {/* 2. WhyTrust — existing 3-pillar, wrap in warm-dark-100 shell */}
        <div className="bg-warm-dark-100">
          <WhyTrust />
        </div>

        {/* 3. HowToStart — existing, warm-dark-50 tonal shift */}
        <div className="bg-warm-dark-50">
          <HowToStart />
        </div>

        {/* 4. BentoLens — replaces MethodChooser + FreeTools (R3 diff #3).
            Wave 60.66.P3: layout="heterogeneous" → Tử Vi hero tile (8x4) +
            BátTự/ThầnSố (4x2 each) + MBTI full-width (12x2) per vault 109 §3
            Phase 3 + R4 #1 + R6 #7. */}
        <BentoLens
          layout="heterogeneous"
          eyebrow="BỐN ỐNG KÍNH"
          title={
            <>
              Một con người, <em className="italic text-gold-soft">soi</em> từ bốn góc
              <span className="text-gold-dot">.</span>
            </>
          }
          bg="warm-dark-100"
          lenses={[
            {
              id: 'tuvi',
              name: 'TỬ VI',
              subname: 'CUNG MỆNH',
              // Wave 60.65.P0 — pre-render icon as JSX element instead of passing
              // the Lucide forwardRef component reference. See BentoLens.tsx
              // header for full rationale (Sentry HIEU-ASIA-WORKER-A).
              icon: <Sparkles className="text-gold size-9" strokeWidth={1.25} />,
              action: 'Đọc',
              title: 'cung mệnh',
              body: 'Bản đồ sao thời điểm sinh — không phải lời tiên tri, mà là bản đồ ưu thế và bóng tối tự nhiên.',
              watermark: 'Tử Vi',
              recommended: true,
            },
            {
              id: 'battu',
              name: 'BÁT TỰ',
              subname: 'NGŨ HÀNH',
              icon: <Calendar className="text-gold size-9" strokeWidth={1.25} />,
              action: 'Cân',
              title: 'ngũ hành',
              body: 'Tám chữ năm-tháng-ngày-giờ — đo nội lực và cân bằng nguyên tố.',
              watermark: 'Bát Tự',
            },
            {
              id: 'thanso',
              name: 'THẦN SỐ',
              subname: 'NUMEROLOGY',
              icon: <Hash className="text-gold size-9" strokeWidth={1.25} />,
              action: 'Đếm',
              title: 'con số đời',
              body: 'Numerology phương Tây — đường đời, ngày sinh, tên gọi cộng dồn thành mật mã hành trình.',
              watermark: 'Thần Số',
            },
            {
              id: 'mbti',
              name: 'MBTI',
              subname: 'TÂM LÝ HỌC',
              icon: <Brain className="text-gold size-9" strokeWidth={1.25} />,
              action: 'Gọi tên',
              title: 'tâm trí',
              body: '16 kiểu Myers-Briggs — không nhãn dán, mà là ngôn ngữ để nhận diện thiên hướng nội tại.',
              watermark: 'MBTI',
            },
          ]}
        />

        {/* Wave 60.66.P4 — BigNumberRow social proof + risk-reversal (vault 109
            §3 Phase 4 ENRICHED + vault 108 §5 Phase 4). 3-col big numerals with
            count-up reveal via Motion `useInView` + 14-day refund block below.
            Seed values 1243 / 4.8 / 14 — founder can adjust. Reuses existing
            LazyMotion `m` (Phase 2 root setup) → 0 KB initial bundle delta. */}
        <BigNumberRow
          eyebrow="MINH CHỨNG"
          title={
            <>
              Người Việt{' '}
              <u className="underline decoration-gold decoration-2 underline-offset-[6px]">
                tin tưởng
              </u>{' '}
              hieu.asia<span className="text-gold-dot">.</span>
            </>
          }
          numbers={[
            {
              value: 1243,
              caption: 'BÁO CÁO MỘT THÁNG QUA',
            },
            {
              value: 4.8,
              suffix: '★',
              caption: 'ĐÁNH GIÁ PREMIUM',
              // Wave 60.66.HF1: was `format: (n) => n.toFixed(1)` arrow-fn —
              // inline functions don't serialize across Server → Client RSC
              // boundary. Use serializable `decimalPlaces` instead. Same
              // pattern as Wave 60.65.P0a Lucide forwardRef fix.
              decimalPlaces: 1,
            },
            {
              value: 14,
              suffix: ' NGÀY',
              caption: 'HOÀN TIỀN 100%',
            },
          ]}
          riskReversal={{
            headline: 'Không hài lòng? Hoàn tiền trong 14 ngày.',
            body: 'Không cần lý do. Chuyển khoản trong 24h sau khi yêu cầu. Bạn vẫn giữ được PDF báo cáo đã tải.',
            cta: 'Xem chính sách hoàn tiền',
            href: '/pricing#refund',
          }}
          bg="warm-dark-50"
        />

        {/* Wave 60.66.P5 — lotus SectionDivider between social proof and
            philosophy stance. Visual breath + cultural mark (vault 109 §3
            Phase 5 ENRICHED). */}
        <SectionDivider variant="lotus" />

        {/* 5. PhilosophyBlock — replaces fake StoryTestimonials (R3 diff #2) */}
        <PhilosophyBlock
          eyebrow="TRIẾT LÝ"
          title={
            <>
              Bạn vẫn là <em className="italic text-gold-soft">người quyết định</em>
              <span className="text-gold-dot">.</span>
            </>
          }
          body={[
            'Tử Vi không tiên tri. MBTI không nhãn dán. Bát Tự không định mệnh.',
            'Đây chỉ là bốn ngôn ngữ — bốn ống kính — giúp bạn nhìn rõ hơn về chính mình. Quyết định cuối cùng luôn là của bạn.',
          ]}
          bg="warm-dark-50"
        />

        {/* Wave 60.66.P5 — Editorial PullQuote between philosophy and pricing
            (vault 109 §3 Phase 5 ENRICHED). Motion `whileInView` fade-in via
            LazyMotion provider (Phase 2 root setup). One of 3 preserved
            Instrument Serif decorative roles. */}
        <PullQuote attribution="— Triết lý hieu.asia" bg="warm-dark-100">
          Trí tuệ phương Đông không phải lời tiên tri.{' '}
          Đó là <em className="text-gold-soft">khoảng lặng</em> để bạn nghe rõ chính mình.
        </PullQuote>

        {/* 6. PricingTierV2 — 3 tiers replace 4 (Notion-style toggle + KHUYÊN DÙNG + refund) */}
        <PricingTierV2
          eyebrow="GÓI THÀNH VIÊN"
          page="/"
          title={
            <>
              Đi <em className="italic text-gold-soft">sâu</em> theo nhịp của bạn
              <span className="text-gold-dot">.</span>
            </>
          }
          tiers={[
            {
              id: 'free',
              name: 'MIỄN PHÍ',
              nameDisplay: 'Khởi đầu',
              description: 'Khảo sát đầu vào và 6 công cụ tra cứu — không cần thẻ.',
              priceMonthly: PRICING.standard.vnd,
              bestFor:
                'bạn muốn thử công cụ và xem tổng quan trước khi quyết định.',
              features: [
                'Khảo sát đầu vào',
                '6 công cụ tra cứu cơ bản',
                'Tử Vi · Bát Tự · MBTI · Thần Số',
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
              priceMonthly: PRICING.monthly.vnd,
              priceYearly: PRICING.yearly.vnd,
              yearlyDiscount: 'Tiết kiệm ~17%',
              bestFor:
                'bạn thường xuyên hỏi về quyết định, công việc, quan hệ, kế hoạch năm.',
              features: [
                'Mentor AI không giới hạn câu hỏi',
                'Đại vận và lưu niên hàng năm',
                'Tất cả 4 ống kính sâu',
                'Huỷ bất cứ lúc nào',
              ],
              ctaLabel: 'Dùng Mentor không giới hạn',
              ctaHref: '/pricing#mentor',
              refundDays: 14,
            },
          ]}
        />

        {/* 7. FaqAccordion — existing 6 Q, warm-dark-100 */}
        <div className="bg-warm-dark-100">
          <FaqAccordion items={HOME_FAQ} id="faq" />
        </div>

        {/* 8. NewsletterSignup — existing, warm-dark-50 */}
        <div className="bg-warm-dark-50">
          <NewsletterSignup id="newsletter" />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
