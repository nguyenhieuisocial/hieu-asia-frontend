import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Compass,
  Calendar,
  Hash,
  Hand,
  MessageSquareHeart,
  FileText,
  Sun,
  Share2,
  Globe2,
  Activity,
} from 'lucide-react';
import { Button } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { FaqAccordion, type FaqItem } from '@/components/home/FaqAccordion';

export const metadata: Metadata = {
  title: 'Tính năng — hieu.asia',
  description:
    'Tử Vi 12 cung, Bát Tự, MBTI, Thần Số Học, Palm Reading, AI Mentor, PDF Cẩm Nang, Tử Vi hôm nay, đa ngôn ngữ. Mọi tính năng của hieu.asia.',
  alternates: { canonical: 'https://hieu.asia/features' },
  openGraph: {
    title: 'Tính năng — hieu.asia',
    description:
      'Khám phá đầy đủ tính năng: Tử Vi 12 cung, Bát Tự, MBTI, Palm Reading, AI Mentor và nhiều hơn.',
    url: 'https://hieu.asia/features',
    type: 'website',
  },
};

interface Feature {
  Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  title: string;
  desc: string;
  anchor: string;
  cta?: { href: string; label: string };
}

const FEATURES: readonly Feature[] = [
  {
    Icon: Compass,
    anchor: 'tu-vi',
    title: 'Tử Vi Đẩu Số 12 cung',
    desc: 'Lá số Bắc phái với 114 sao chính và phụ. Bản đồ 12 lĩnh vực đời sống — sự nghiệp, tài chính, tình cảm, sức khỏe — kèm đại vận và lưu niên.',
    cta: { href: '/learn/tu-vi', label: 'Tìm hiểu Tử Vi' },
  },
  {
    Icon: Calendar,
    anchor: 'bat-tu',
    title: 'Bát Tự Tứ Trụ',
    desc: 'Bốn trụ Năm – Tháng – Ngày – Giờ theo Ngũ Hành. Hiểu năng lượng bẩm sinh và cách cân bằng Kim, Mộc, Thủy, Hỏa, Thổ trong từng giai đoạn.',
    cta: { href: '/learn/bat-tu', label: 'Tìm hiểu Bát Tự' },
  },
  {
    Icon: Hash,
    anchor: 'numerology-mbti',
    title: 'Thần Số Học & MBTI',
    desc: 'Số chủ đạo từ ngày sinh kết hợp 16 nhóm tính cách MBTI — khung tự nhận thức nhanh, dễ áp dụng vào công việc và quan hệ.',
    cta: { href: '/learn/than-so-hoc', label: 'Khám phá Số học' },
  },
  {
    Icon: Hand,
    anchor: 'palm',
    title: 'Palm Reading AI',
    desc: 'Upload ảnh lòng bàn tay — AI vision multimodal phân tích đường tâm đạo, trí đạo, sinh đạo và các đường phụ. Dùng được khi không có giờ sinh.',
    cta: { href: '/learn/palm', label: 'Tìm hiểu Palm' },
  },
  {
    Icon: MessageSquareHeart,
    anchor: 'mentor',
    title: 'AI Mentor cá nhân hóa',
    desc: 'Trò chuyện với Mentor về quyết định cụ thể bạn đang cân nhắc. Mentor đặt câu hỏi, gợi ý các bước — bạn vẫn là người chọn con đường.',
    cta: { href: '/onboarding?cta=mentor', label: 'Bắt đầu trò chuyện' },
  },
  {
    Icon: FileText,
    anchor: 'pdf',
    title: 'PDF Cẩm Nang xuất bản',
    desc: 'Tải toàn bộ phân tích thành PDF được thiết kế — chia sẻ với người thân hoặc lưu giữ làm cẩm nang cá nhân.',
  },
  {
    Icon: Sun,
    anchor: 'daily',
    title: 'Tử Vi hôm nay',
    desc: 'Mỗi sáng một thông điệp ngắn dựa trên lá số của bạn. Không phải tử vi chung chung — cá nhân hóa theo cung mệnh và đại vận hiện tại.',
    cta: { href: '/tu-vi-hom-nay', label: 'Xem hôm nay' },
  },
  {
    Icon: Share2,
    anchor: 'affiliate',
    title: 'Affiliate program',
    desc: 'Chia sẻ hieu.asia với bạn bè — nhận hoa hồng minh bạch khi họ đăng ký gói. Dashboard riêng để theo dõi hiệu quả.',
    cta: { href: '/affiliate', label: 'Tham gia affiliate' },
  },
  {
    Icon: Globe2,
    anchor: 'i18n',
    title: 'Đa ngôn ngữ',
    desc: 'Giao diện và phân tích bằng Tiếng Việt và English. Thêm ngôn ngữ khác đang được phát triển.',
  },
  {
    Icon: Activity,
    anchor: 'realtime',
    title: 'Cập nhật theo thời gian thực',
    desc: 'Đại vận và lưu niên thay đổi theo ngày tháng. Hệ thống tự động cập nhật để bạn luôn có góc nhìn mới nhất.',
  },
];

const FEATURES_FAQ: readonly FaqItem[] = [
  {
    q: 'Tôi cần thông tin gì để bắt đầu?',
    a: (
      <p>
        Ngày sinh, giới tính, và nếu có — giờ sinh. Giờ sinh càng chính xác,
        phân tích Tử Vi và Bát Tự càng chi tiết. Không có giờ sinh, bạn vẫn dùng
        được MBTI, Thần Số Học và Palm Reading.
      </p>
    ),
  },
  {
    q: 'Tôi có thể cập nhật lá số sau không?',
    a: (
      <p>
        Có. Bạn có thể chỉnh sửa ngày, giờ, giới tính trong trang Tài khoản. Lá
        số mới được tính lại tức thì.
      </p>
    ),
  },
  {
    q: 'Mentor AI dùng mô hình nào?',
    a: (
      <p>
        Mentor đối thoại dùng Claude — model AI hiện đại với cửa sổ ngữ cảnh
        lớn. Mentor không phải chatbot scripted — nó hiểu lá số của bạn và đặt
        câu hỏi có ngữ cảnh.
      </p>
    ),
  },
  {
    q: 'PDF có thể xuất nhiều lần?',
    a: (
      <p>
        Có. Sau khi mở khoá báo cáo, bạn xuất PDF bao nhiêu lần tuỳ ý. Nếu cập
        nhật lá số, PDF mới sẽ phản ánh thay đổi.
      </p>
    ),
  },
];

export default function FeaturesPage() {
  return (
    <>
      <SiteNav />
      <main id="main-content" className="min-h-screen bg-background text-foreground pt-16">
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-background">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,_rgba(59,39,84,0.4)_0%,_transparent_55%)]"
          />
          <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-28">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold/80 sm:text-xs">
              Sản phẩm
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Tính năng của{' '}
              <span className="bg-gold-gradient bg-clip-text text-transparent">hieu.asia</span>
            </h1>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Mọi công cụ bạn cần để hiểu chính mình rõ hơn — gói gọn trong một
              nền tảng, vận hành trên hạ tầng edge của Cloudflare.
            </p>
          </div>
        </section>

        {/* Feature grid */}
        <section className="relative bg-background py-12 sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ Icon, anchor, title, desc, cta }) => (
                <article
                  key={anchor}
                  id={anchor}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_0_40px_-12px_rgba(184,146,61,0.4)]"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gold/30 bg-gold/5 transition-colors group-hover:border-gold/60 group-hover:bg-gold/10">
                    <Icon className="h-5 w-5 text-gold" aria-hidden={true} />
                  </div>
                  <h2 className="font-heading text-lg font-semibold leading-tight text-foreground">
                    {title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {desc}
                  </p>
                  {cta && (
                    <Link href={cta.href} className="mt-5">
                      <Button variant="outline" size="sm" className="w-full">
                        {cta.label}
                      </Button>
                    </Link>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA strip */}
        <section className="relative bg-background py-16">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Sẵn sàng để bắt đầu?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Mở khoá lá số trong 3 phút — khảo sát đầu vào miễn phí.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/onboarding">
                <Button size="lg" className="min-w-[200px]">
                  Mở khóa lá số
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="min-w-[200px]">
                  Xem bảng giá
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <FaqAccordion
          items={FEATURES_FAQ}
          id="features-faq"
          eyebrow="FAQ tính năng"
          title="Câu hỏi về tính năng"
        />
      </main>
      <SiteFooter />
    </>
  );
}
