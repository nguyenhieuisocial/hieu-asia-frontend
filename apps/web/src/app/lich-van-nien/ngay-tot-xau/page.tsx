import type { Metadata } from 'next';
import { ActivityChecker } from '@/components/lich-van-nien/ActivityChecker';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';

export const metadata: Metadata = {
  title: 'Kiểm tra ngày tốt — Lịch Vạn Niên',
  description:
    'Kiểm tra ngày tốt cho cưới hỏi, khai trương, động thổ, nhập trạch, xuất hành. Chấm điểm 0-100, hiển thị lý do và gợi ý ngày tốt hơn.',
  alternates: { canonical: 'https://hieu.asia/lich-van-nien/ngay-tot-xau' },
  openGraph: {
    title: 'Kiểm tra ngày tốt — Lịch Vạn Niên · hieu.asia',
    description:
      'Chấm điểm ngày tốt cho cưới hỏi, khai trương, động thổ. Cá nhân hoá theo tuổi.',
    url: 'https://hieu.asia/lich-van-nien/ngay-tot-xau',
    type: 'website',
  },
};

export default function NgayTotXauPage() {
  return (
    <ToolPageShell
      eyebrow="Lịch Vạn Niên · Tốt xấu"
      icon={<span aria-hidden="true">📈</span>}
      title={
        <>
          Kiểm tra <GoldAccent>ngày tốt</GoldAccent>
        </>
      }
      description="Nhập việc bạn dự định làm, ngày mong muốn và (tuỳ chọn) năm sinh. Hệ thống chấm điểm dựa trên Hoàng/Hắc đạo, trực ngày, sao tốt sao xấu, và cảnh báo Tam Tai / Kim Lâu / Hoang Ốc nếu có."
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Lịch Vạn Niên', href: '/lich-van-nien' },
        { label: 'Ngày tốt xấu' },
      ]}
    >
      <section className="space-y-8">
        <ActivityChecker />

        <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
            Cách chấm điểm
          </h2>
          <ul className="mt-3 space-y-1.5 pl-5 text-sm text-muted-foreground list-disc">
            <li>Điểm khởi đầu: 50/100.</li>
            <li>Ngày Hoàng Đạo +15, Hắc Đạo -15.</li>
            <li>Trực ngày phù hợp việc +10, không phù hợp -20.</li>
            <li>Mỗi sao tốt cộng 8, mỗi sao xấu trừ 12.</li>
            <li>Phạm Tam Tai / Kim Lâu / Hoang Ốc trừ 10-15.</li>
            <li>≥ 60 điểm: phù hợp; &lt; 60: gợi ý ngày khác.</li>
          </ul>
        </section>
      </section>
    </ToolPageShell>
  );
}
