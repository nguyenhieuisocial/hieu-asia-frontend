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
import { BentoLens } from '@/components/marketing/BentoLens';
import { PhilosophyBlock } from '@/components/marketing/PhilosophyBlock';
import { PricingTierV2 } from '@/components/marketing/PricingTierV2';

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
        thanh toán, không tự gia hạn. Hoàn tiền 100% trong 24 giờ nếu báo cáo
        chưa được tạo; sau đó vẫn xem xét hoàn tiền trong 14 ngày khi có lỗi
        kỹ thuật hoặc trải nghiệm không đúng mô tả.
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
        {/* 1. Hero — Option D MarketingHero */}
        <MarketingHero
          eyebrow="A.I · LUẬN GIẢI · 2026"
          title={
            <>
              Hiểu mình.{' '}
              <em className="italic text-gold-soft">Quyết định</em>{' '}
              mình
              <span className="text-gold-dot drop-shadow-[0_0_16px_rgba(229,198,138,0.18)]">
                .
              </span>
            </>
          }
          subtitle="Bốn ống kính — Tử Vi, Bát Tự, Thần Số, MBTI — đọc lên trong một khoảng lặng. Không tiên tri. Không định mệnh hoá. Chỉ một ngôn ngữ để bạn đối thoại với chính mình."
          primaryCta={{ label: 'Bắt đầu luận giải', href: '/onboarding' }}
          secondaryCta={{ label: 'Xem phương pháp', href: '/methodology' }}
          trustLine="5 phút · miễn phí · không cần thẻ"
          ornament="gold-ring"
          watermark="Tử Vi"
        />

        {/* Wave 52 — persistent disclaimer chip surfaced near hero (also in footer). */}
        <div
          role="note"
          className="mx-auto -mt-6 flex max-w-3xl items-center justify-center px-6"
        >
          <p className="rounded-full border border-gold/20 bg-warm-dark-100/60 px-4 py-1.5 text-center text-[11px] leading-snug text-cream-500 backdrop-blur-sm sm:text-xs">
            Kết quả mang tính tham khảo — không thay thế tư vấn y tế, pháp lý hay tài chính.
          </p>
        </div>

        {/* 2. WhyTrust — existing 3-pillar, wrap in warm-dark-100 shell */}
        <div className="bg-warm-dark-100">
          <WhyTrust />
        </div>

        {/* 3. HowToStart — existing, warm-dark-50 tonal shift */}
        <div className="bg-warm-dark-50">
          <HowToStart />
        </div>

        {/* 4. BentoLens — replaces MethodChooser + FreeTools (R3 diff #3) */}
        <BentoLens
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

        {/* 6. PricingTierV2 — 3 tiers replace 4 (Notion-style toggle + KHUYÊN DÙNG + refund) */}
        <PricingTierV2
          eyebrow="GÓI THÀNH VIÊN"
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
              features: [
                'Một lá số Tử Vi đầy đủ',
                'PDF báo cáo có thể tải về',
                '3 câu hỏi với AI Mentor',
                'Lưu trữ vĩnh viễn trong tài khoản',
              ],
              ctaLabel: 'Mua Premium',
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
              features: [
                'Mentor AI không giới hạn câu hỏi',
                'Đại vận và lưu niên hàng năm',
                'Tất cả 4 ống kính sâu',
                'Huỷ bất cứ lúc nào',
              ],
              ctaLabel: 'Đăng ký Mentor',
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
