import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage } from '@/lib/seo/jsonld';
import { PURPOSES } from './purposes';

const DESC =
  'Xem ngày tốt cho cưới hỏi, khai trương, động thổ, nhập trạch, xuất hành, mua xe, ký hợp đồng. Chấm điểm theo Hoàng đạo, trực ngày, sao tốt xấu và cảnh báo Tam Tai, Kim Lâu, Hoang Ốc theo tuổi.';

export const metadata: Metadata = {
  title: 'Xem ngày tốt theo mục đích — Lịch Vạn Niên',
  description: DESC,
  alternates: { canonical: 'https://hieu.asia/xem-ngay' },
  openGraph: {
    title: 'Xem ngày tốt theo mục đích',
    description: DESC,
    url: 'https://hieu.asia/xem-ngay',
    type: 'website',
  },
};

export default function XemNgayHubPage() {
  return (
    <>
      <JsonLd
        data={[
          webPage({ name: 'Xem ngày tốt theo mục đích', description: DESC, url: '/xem-ngay' }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Xem ngày tốt', url: '/xem-ngay' },
          ]),
        ]}
      />
      <ToolPageShell
        eyebrow="Lịch Vạn Niên · Xem ngày"
        icon={<span aria-hidden="true">📅</span>}
        title={
          <>
            <GoldAccent>Xem ngày tốt</GoldAccent> theo mục đích
          </>
        }
        description="Chọn việc bạn dự định làm để xem ngày đẹp phù hợp — chấm điểm theo Hoàng/Hắc đạo, trực ngày, sao tốt xấu và cảnh báo Tam Tai, Kim Lâu, Hoang Ốc theo tuổi. Tham khảo theo lịch pháp truyền thống, không phải lời phán số mệnh."
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Lịch Vạn Niên', href: '/lich-van-nien' },
          { label: 'Xem ngày tốt' },
        ]}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PURPOSES.map((p) => (
            <Link
              key={p.slug}
              href={`/xem-ngay/${p.slug}`}
              className="group rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-sm transition-colors hover:border-gold/40"
            >
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="text-2xl">
                  {p.emoji}
                </span>
                <span className="font-heading text-lg font-semibold text-foreground group-hover:text-gold">
                  Xem ngày {p.h1Suffix}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p.seoDescription}
              </p>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Muốn kiểm tra nhanh nhiều loại việc trong một form?{' '}
          <Link href="/lich-van-nien/ngay-tot-xau" className="text-gold hover:underline">
            Dùng công cụ Kiểm tra ngày tốt tổng hợp
          </Link>
          .
        </p>

        <p className="mt-3 text-sm text-muted-foreground">
          Xem thêm:{' '}
          <Link href="/ngay-kieng-ky" className="text-gold hover:underline">
            Ngày kiêng kỵ (Tam Nương, Nguyệt Kỵ)
          </Link>{' '}
          ·{' '}
          <Link href="/sao-han" className="text-gold hover:underline">
            Xem sao hạn
          </Link>{' '}
          ·{' '}
          <Link href="/gio-hoang-dao" className="text-gold hover:underline">
            Giờ hoàng đạo
          </Link>
        </p>
      </ToolPageShell>
    </>
  );
}
