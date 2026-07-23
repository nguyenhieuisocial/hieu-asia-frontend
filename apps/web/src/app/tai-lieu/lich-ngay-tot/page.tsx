import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';
import { LichNgayTotBuilder } from '@/components/tai-lieu/LichNgayTotBuilder';
import { LICH_HOW_TO_USE, LICH_DISCLAIMER } from '@/lib/tai-lieu/lich-ngay-tot';

/**
 * /tai-lieu/lich-ngay-tot — tài liệu tặng "Lịch ngày tốt tháng này".
 *
 * Dữ liệu ngày lấy thẳng từ engine Lịch Vạn Niên đang chạy (POST
 * /tools/lich-van-nien/month) — cùng nguồn với /lich-van-nien/today, nên bảng
 * ở đây không bao giờ lệch với công cụ tra cứu. Trang tự lấy THÁNG HIỆN TẠI
 * theo giờ Việt Nam, vì vậy nội dung mới lại mỗi đầu tháng mà không phải sửa
 * code — đúng nhịp "lý do để quay lại" của một tài liệu định kỳ.
 */

const DESC =
  'Tài liệu miễn phí: bảng ngày Hoàng đạo, ngày nên thận trọng, can chi và trực ngày của cả tháng — lấy thẳng từ engine Lịch Vạn Niên, tải PDF về in ra dùng dần.';

export const metadata: Metadata = {
  title: 'Lịch ngày tốt tháng này — tài liệu miễn phí',
  description: DESC,
  alternates: { canonical: 'https://hieu.asia/tai-lieu/lich-ngay-tot' },
  openGraph: {
    title: 'Lịch ngày tốt tháng này — hieu.asia',
    description: DESC,
    url: 'https://hieu.asia/tai-lieu/lich-ngay-tot',
    type: 'article',
    images: OG_DEFAULT_IMAGES,
  },
};

const FAQS = [
  {
    q: 'Ngày Hoàng đạo và Hắc đạo khác nhau thế nào?',
    a: 'Theo lịch pháp, mỗi ngày có một trong 12 vị thần luân phiên trực. Sáu ngày có cát tinh trực gọi là ngày Hoàng đạo, được xem là thuận cho khởi sự; sáu ngày còn lại gọi là Hắc đạo, thường được khuyên thận trọng hơn. Đây là quy ước để tham khảo, không phải phép đo.',
  },
  {
    q: 'Bảng này có tính theo tuổi của tôi không?',
    a: 'Không. Bảng tháng là lớp chung cho mọi người. Nếu cần tính theo tuổi — có cả Tam Tai, Kim Lâu, Hoang Ốc — thì dùng công cụ Xem ngày tốt theo mục đích, ở đó bạn nhập năm sinh và chọn việc cụ thể.',
  },
  {
    q: 'Vì sao mỗi trang lịch lại ghi ngày tốt xấu khác nhau?',
    a: 'Vì các sách cổ chép khác nhau, và mỗi nơi chọn một bộ quy tắc để dựa vào. hieu.asia nêu rõ mình dựa vào đâu: 12 trực, Nhị thập bát tú và bảng Hoàng đạo – Hắc đạo cổ truyền. Nhập cùng dữ liệu thì luôn ra cùng kết quả.',
  },
  {
    q: 'Tải bản PDF có mất phí không?',
    a: 'Không. Bạn để lại email để nhận bản PDF vào hộp thư; nếu đã đăng nhập thì tải thẳng. Chúng tôi không bán dữ liệu và bạn huỷ nhận thư bất cứ lúc nào.',
  },
];

export default function TaiLieuLichNgayTotPage() {
  return (
    <>
      <JsonLd
        data={[
          webPage({
            name: 'Lịch ngày tốt tháng này — tài liệu miễn phí',
            description: DESC,
            url: '/tai-lieu/lich-ngay-tot',
          }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Tài liệu tặng', url: '/tai-lieu' },
            { name: 'Lịch ngày tốt tháng này', url: '/tai-lieu/lich-ngay-tot' },
          ]),
          faqPage(FAQS),
        ]}
      />
      <ToolPageShell
        eyebrow="Tài liệu tặng · Lịch Vạn Niên"
        icon={<span aria-hidden="true">📅</span>}
        title={
          <>
            Lịch <GoldAccent>ngày tốt</GoldAccent> tháng này
          </>
        }
        description="Cả tháng trên một bảng: ngày Hoàng đạo, ngày nên thận trọng, can chi và trực của từng ngày. Số liệu lấy thẳng từ engine Lịch Vạn Niên của hieu.asia — bạn tải PDF về in ra, dán lên tủ lạnh dùng dần."
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Tài liệu tặng', href: '/tai-lieu' },
          { label: 'Lịch ngày tốt tháng này' },
        ]}
      >
        <div className="mx-auto max-w-3xl space-y-8">
          <LichNgayTotBuilder />

          <section className="rounded-2xl border border-border bg-card/30 p-5">
            <h2 className="font-heading text-base font-semibold text-foreground">
              Cách dùng bảng này cho đỡ rối
            </h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-base leading-relaxed text-foreground/90">
              {LICH_HOW_TO_USE.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </section>

          <section className="rounded-2xl border border-gold/25 bg-gold/[0.04] p-5">
            <h2 className="font-heading text-base font-semibold text-foreground">
              Câu hỏi hay gặp
            </h2>
            <dl className="mt-3 space-y-4">
              {FAQS.map((f) => (
                <div key={f.q}>
                  <dt className="text-sm font-medium text-foreground">{f.q}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <p className="text-sm leading-relaxed text-muted-foreground">{LICH_DISCLAIMER}</p>

          <nav aria-label="Trang liên quan" className="text-sm text-muted-foreground">
            Xem thêm:{' '}
            <Link href="/xem-ngay" className="text-gold hover:underline">
              xem ngày tốt theo mục đích
            </Link>{' '}
            ·{' '}
            <Link href="/lich-van-nien" className="text-gold hover:underline">
              lịch vạn niên
            </Link>{' '}
            ·{' '}
            <Link href="/tai-lieu" className="text-gold hover:underline">
              các tài liệu tặng khác
            </Link>
          </nav>
        </div>
      </ToolPageShell>
    </>
  );
}
