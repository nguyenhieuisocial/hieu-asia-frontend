import type { Metadata } from 'next';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { HeroV3 } from '@/components/home/HeroV3';
import { HowToStart } from '@/components/home/HowToStart';
import { MethodChooser } from '@/components/home/MethodChooser';
import { FreeTools } from '@/components/home/FreeTools';
import { WhyChoose } from '@/components/home/WhyChoose';
import { StoryTestimonials } from '@/components/home/StoryTestimonials';
import { FaqAccordion, type FaqItem } from '@/components/home/FaqAccordion';
import { PricingTeaser } from '@/components/home/PricingTeaser';
import { NewsletterSignup } from '@/components/home/NewsletterSignup';

export const metadata: Metadata = {
  title: 'hieu.asia — Cẩm nang AI giúp hiểu mình và ra quyết định',
  description:
    'Kết hợp Tử Vi, Bát Tự, Thần Số Học, MBTI và AI Mentor để giúp bạn hiểu bản thân, đặt câu hỏi đúng và tự ra quyết định có trách nhiệm.',
  alternates: { canonical: 'https://hieu.asia/' },
  openGraph: {
    title: 'hieu.asia — Hiểu mình. Quyết định mình.',
    description:
      'Cẩm nang AI cá nhân hoá bằng cổ học Việt Nam và tâm lý hiện đại.',
    url: 'https://hieu.asia/',
    siteName: 'hieu.asia',
    locale: 'vi_VN',
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
  description:
    'Hiểu mình. Quyết định mình. AI giải mã Tử Vi, Bát Tự, MBTI và tướng tay theo tri thức cổ học Việt Nam.',
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
          thủ GDPR và các tiêu chuẩn bảo mật phổ biến.
        </p>
      </>
    ),
  },
  {
    q: 'Giá bao nhiêu? Có dùng thử miễn phí không?',
    a: (
      <p>
        Khảo sát đầu vào miễn phí. Gói Standard 99.000đ một lần (1 lá số đầy
        đủ + PDF + 3 câu hỏi Mentor), Premium 199.000đ/tháng hoặc 1.990.000đ/năm
        (Mentor không giới hạn + đại vận/lưu niên), hoặc Lifetime 4.990.000đ
        một lần. Xem chi tiết tại trang Pricing.
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
      <SiteNav />
      <main id="main-content" className="min-h-screen bg-ink text-cream pt-16">
        <HeroV3 />
        <HowToStart />
        <MethodChooser />
        <FreeTools />
        <WhyChoose />
        <PricingTeaser />
        <StoryTestimonials />
        <FaqAccordion items={HOME_FAQ} id="faq" />
        <NewsletterSignup id="newsletter" />
      </main>
      <SiteFooter />
    </>
  );
}
