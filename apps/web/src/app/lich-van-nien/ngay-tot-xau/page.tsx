import type { Metadata } from 'next';
import Link from 'next/link';
import { ActivityChecker } from '@/components/lich-van-nien/ActivityChecker';

export const metadata: Metadata = {
  title: 'Kiểm tra ngày tốt — Lịch Vạn Niên',
  description:
    'Kiểm tra ngày tốt cho cưới hỏi, khai trương, động thổ, nhập trạch, xuất hành... Chấm điểm 0-100, hiển thị lý do và gợi ý ngày tốt hơn.',
};

export default function NgayTotXauPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <nav className="text-sm">
        <Link href="/lich-van-nien" className="text-gold hover:underline">
          ← Lịch Vạn Niên
        </Link>
      </nav>

      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Kiểm tra ngày tốt xấu
        </h1>
        <p className="text-sm text-foreground/70 max-w-2xl">
          Nhập việc bạn dự định làm, ngày mong muốn và (tùy chọn) năm sinh.
          Hệ thống chấm điểm dựa trên Hoàng/Hắc đạo, trực ngày, sao tốt sao xấu,
          và cảnh báo Tam Tai / Kim Lâu / Hoang Ốc nếu có.
        </p>
      </header>

      <ActivityChecker />

      <section className="text-sm text-foreground/70 space-y-2 pt-4 border-t">
        <h2 className="text-base font-semibold text-foreground">Cách chấm điểm</h2>
        <ul className="space-y-1 list-disc pl-5">
          <li>Điểm khởi đầu: 50/100.</li>
          <li>Ngày Hoàng Đạo +15, Hắc Đạo -15.</li>
          <li>Trực ngày phù hợp việc +10, không phù hợp -20.</li>
          <li>Mỗi sao tốt cộng 8, mỗi sao xấu trừ 12.</li>
          <li>Phạm Tam Tai / Kim Lâu / Hoang Ốc trừ 10-15.</li>
          <li>≥ 60 điểm: phù hợp; &lt; 60: gợi ý ngày khác.</li>
        </ul>
      </section>
    </main>
  );
}
