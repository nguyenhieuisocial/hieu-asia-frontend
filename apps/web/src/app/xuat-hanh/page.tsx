import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { XuatHanhChecker } from '@/components/xuat-hanh/XuatHanhChecker';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { JsonLd } from '@/components/seo/JsonLd';
import { webPage, breadcrumb, faqPage } from '@/lib/seo/jsonld';

const DESC =
  'Tra hướng xuất hành (Hỷ Thần cầu may, Tài Thần cầu tài) và giờ hoàng đạo cho bất kỳ ngày nào, tính theo Can-Chi của ngày. Minh bạch, kiểm chứng được — phong tục tham khảo, không phán số mệnh.';

export const metadata: Metadata = {
  title: 'Hướng & giờ xuất hành — tra theo ngày',
  description: DESC,
  alternates: { canonical: 'https://hieu.asia/xuat-hanh' },
  openGraph: {
    title: 'Hướng & giờ xuất hành — tra theo ngày',
    description: DESC,
    url: 'https://hieu.asia/xuat-hanh',
    type: 'website',
    locale: 'vi_VN',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'hieu.asia — Hướng & giờ xuất hành' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hướng & giờ xuất hành — tra theo ngày',
    description: 'Hỷ Thần / Tài Thần + giờ hoàng đạo cho ngày bất kỳ, tính theo Can-Chi.',
    images: [{ url: '/og-image.jpg', alt: 'hieu.asia — Hướng & giờ xuất hành' }],
  },
};

const FAQS = [
  {
    q: 'Hướng xuất hành hôm nay là hướng nào?',
    a: 'Nhập ngày vào công cụ phía trên để xem hướng Hỷ Thần (cầu may) và Tài Thần (cầu tài) của hôm nay. Hai hướng này tính theo thiên can của ngày — mặc định công cụ hiển thị ngày hôm nay.',
  },
  {
    q: 'Hỷ Thần và Tài Thần khác nhau thế nào?',
    a: 'Hỷ Thần (喜神) là phương vị cầu may mắn, hỉ sự; Tài Thần (財神) là phương vị cầu tài lộc. Cả hai tính theo thiên can của ngày (chu kỳ 10 ngày), không phụ thuộc tuổi người đi.',
  },
  {
    q: 'Đi sai hướng xuất hành có sao không?',
    a: 'Đây là phong tục cầu may, không phải định mệnh. Đi đúng hướng là một nét văn hóa để bắt đầu với tâm thế tích cực — không tiện đi đúng hướng cũng không có nghĩa gặp xui. Hướng Tài Thần còn có vài phái tính khác nhau; ở đây dùng bản phổ biến trong lịch vạn niên Việt Nam.',
  },
  {
    q: 'Tết 2027 xuất hành hướng nào, giờ nào?',
    a: 'Xem trang Xuất hành đầu năm 2027 (Đinh Mùi) cho hướng và giờ tốt mùng 1, 2, 3 Tết — tính sẵn theo Can-Chi từng ngày.',
  },
];

export default function XuatHanhPage() {
  return (
    <>
      <JsonLd
        data={[
          webPage({ name: 'Hướng & giờ xuất hành — tra theo ngày', description: DESC, url: '/xuat-hanh' }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Lịch Vạn Niên', url: '/lich-van-nien' },
            { name: 'Hướng & giờ xuất hành', url: '/xuat-hanh' },
          ]),
          faqPage(FAQS),
        ]}
      />
      <ToolPageShell
        eyebrow="Lịch Vạn Niên · Xuất hành"
        icon={<span aria-hidden="true">🧭</span>}
        title={
          <>
            Hướng &amp; giờ <GoldAccent>xuất hành</GoldAccent>
          </>
        }
        description="Tra hướng Hỷ Thần (cầu may), Tài Thần (cầu tài) và giờ hoàng đạo cho ngày bất kỳ — tính theo Can-Chi của ngày, minh bạch và kiểm chứng được. Tham khảo theo phong tục, không phán số mệnh."
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Lịch Vạn Niên', href: '/lich-van-nien' },
          { label: 'Hướng & giờ xuất hành' },
        ]}
        relatedSlug="/xuat-hanh"
      >
        <section className="space-y-8">
          <XuatHanhChecker />

          {/* Dẫn về trang mùa Tết */}
          <div className="mx-auto max-w-3xl">
            <Link
              href="/xuat-hanh-2027"
              className="flex items-center justify-between gap-3 rounded-lg border border-gold/25 bg-gold/5 px-4 py-3 text-sm transition-colors hover:bg-gold/10"
            >
              <span className="text-foreground/85">
                🧧 <b className="text-foreground">Xuất hành đầu năm 2027</b> — hướng &amp; giờ tốt mùng 1, 2, 3 Tết Đinh Mùi
              </span>
              <span className="shrink-0 text-gold">Mở →</span>
            </Link>
          </div>

          {/* Giải thích */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold/80">
              Hướng xuất hành tính thế nào?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Hỷ Thần theo khẩu quyết cổ (《考原》): Giáp–Kỷ ở Đông Bắc, Ất–Canh ở Tây Bắc, Bính–Tân ở
              Tây Nam, Đinh–Nhâm ở Chính Nam, Mậu–Quý ở Đông Nam. hieu.asia suy Can-Chi ngày bằng cùng
              engine với Lịch Vạn Niên của site, nên kết quả ai tra cũng như nhau — minh bạch, kiểm
              chứng được, không bịa. Hướng Tài Thần dùng bản lịch vạn niên Việt Nam (một số phái Trung
              Hoa tính khác — đây là phong tục, không phải khoa học).
            </p>
          </section>

          {/* Lead capture */}
          <OccasionLeadCapture
            source="xuat-hanh"
            capturedEvent="lead_capture_xuat_hanh_tool"
            blurb="Để lại email, chúng tôi nhắc các mốc theo mùa: ngày tốt, giờ &amp; hướng xuất hành đầu năm, sao hạn. Thi thoảng thôi, không spam."
            cta="Nhận nhắc theo mùa"
          />
        </section>
      </ToolPageShell>
    </>
  );
}
