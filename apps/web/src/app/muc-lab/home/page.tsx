import type { Metadata } from 'next';
import * as React from 'react';
import { User, Briefcase, HelpCircle, Calendar, Heart } from 'lucide-react';

import { MultiHero } from '../MultiHero';
import { NotOraclesStrip } from './sections/NotOraclesStrip';
import { Methodology } from './sections/Methodology';
import { FreeReadingTeaser } from './sections/FreeReadingTeaser';
import { PricingLite } from './sections/PricingLite';
import { MissionNote } from './sections/MissionNote';
import { ToolkitSection } from './sections/ToolkitSection';

import { ScanRow } from '@/components/marketing/ScanRow';
import { WhyTrust } from '@/components/home/WhyTrust';
import { HowToStart } from '@/components/home/HowToStart';
import { SampleOutputShowcase } from '@/components/marketing/SampleOutputShowcase';
import { MentorSampleInteractive } from '@/components/marketing/MentorSampleInteractive';
import { SocialProofQuiet } from '@/components/marketing/SocialProofQuiet';
import { FaqAccordion, type FaqItem } from '@/components/home/FaqAccordion';
import { SiteFooter } from '@/components/home/SiteFooter';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';

/**
 * /muc-lab/home — STAGING trang chủ "4 lăng kính → AI" (noindex).
 * Mobile-first, editorial decoder (không oracle). Compose: hero editorial (MultiHero) +
 * section production tái sử dụng (KHÔNG sửa) + section mới lấp lỗ. Không đụng app/page.tsx.
 */
export const metadata: Metadata = {
  title: 'Trang chủ (staging) — 4 lăng kính',
  robots: { index: false, follow: false },
};

const STAGING_FAQ: readonly FaqItem[] = [
  {
    q: 'hieu.asia khác gì với thầy bói / app xem bói?',
    a: (
      <p>
        Thầy bói đưa ra câu trả lời. hieu.asia đặt câu hỏi — soi rõ ưu thế, thời điểm thuận và
        rủi ro từ bốn hệ, để <strong>bạn tự quyết</strong>. Không “số phận”, không “vận hạn”.
      </p>
    ),
  },
  {
    q: 'Cái này có dự đoán tương lai không?',
    a: (
      <p>
        Không. Chúng tôi không dự đoán tương lai — chỉ giải mã mẫu hình và động lực bẩm sinh để
        bạn ra quyết định tốt hơn.
      </p>
    ),
  },
  {
    q: 'Dữ liệu ngày/giờ sinh của tôi có an toàn không?',
    a: (
      <p>
        Chỉ dùng để tính toán. Không bán, không chia sẻ, không dùng để huấn luyện mô hình. Tuân
        thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.
      </p>
    ),
  },
  {
    q: 'Miễn phí đến đâu?',
    a: (
      <p>
        Tier <strong>miễn phí</strong> gồm khảo sát đầu vào và công cụ tra cứu cơ bản — không cần
        thẻ. Nâng cấp khi bạn muốn đi sâu hơn.
      </p>
    ),
  },
];

export default function MucLabHomePage(): React.JSX.Element {
  return (
    <>
      <main>
        <MultiHero />
        <NotOraclesStrip />

        <ScanRow
          eyebrow="TÔI MUỐN..."
          title={
            <>
              Bạn đang phân vân{' '}
              <u className="underline decoration-primary decoration-2 underline-offset-[6px]">
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
              body: 'Đại vận 10 năm + lưu niên Bính Ngọ 2026 — đọc chu kỳ thời gian so với lá số gốc của bạn.',
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

        {/* Methodology trước trust/how — giải thích cơ chế trước khi build trust (review #23). */}
        <Methodology />
        {/* Breadth — chống undersell: KHÔNG chỉ 4 lăng kính, có cả bộ công cụ */}
        <ToolkitSection />

        <div className="bg-muted/40">
          <WhyTrust />
        </div>
        <div className="bg-background">
          <HowToStart />
        </div>

        <SampleOutputShowcase />
        <MentorSampleInteractive />

        <FreeReadingTeaser />

        <SocialProofQuiet />
        <MissionNote />{/* founder ẩn danh → trust qua sứ mệnh */}

        <div className="bg-muted/40">
          <FaqAccordion items={STAGING_FAQ} id="faq" />
        </div>

        <PricingLite />

        {/* Final CTA trước footer (review: thiếu lời mời hành động ở cuối) */}
        <section aria-label="Bắt đầu" className="py-16 text-center sm:py-20">
          <div className="mx-auto max-w-marketing-tight px-6 sm:px-8">
            <h2 className="font-marketing-display text-3xl leading-tight text-foreground sm:text-4xl">
              Bắt đầu hiểu mình hôm nay.
            </h2>
            <a
              href="/onboarding"
              className="mt-5 inline-flex items-center justify-center rounded-md bg-[hsl(var(--primary-cta))] px-8 py-3.5 font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Lập lá số của tôi →
            </a>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Miễn phí · không cần thẻ · 1 phút
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
      <StickyMobileCta trackId="muclab-home" label="Lập lá số của tôi" />
    </>
  );
}
