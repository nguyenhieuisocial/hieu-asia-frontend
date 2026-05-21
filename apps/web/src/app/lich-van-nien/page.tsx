import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { DayCard, type VanNienDayDTO } from '@/components/lich-van-nien/DayCard';

export const metadata: Metadata = {
  title: 'Lịch Vạn Niên 2026 — Tra cứu ngày giờ tốt xấu',
  description:
    'Lịch vạn niên Việt Nam: ngày dương âm, Can Chi, Hoàng đạo / Hắc đạo, sao tốt sao xấu, giờ hoàng đạo, ngày tốt cho cưới hỏi, khai trương, động thổ.',
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hieu.asia';

async function getToday(): Promise<VanNienDayDTO | null> {
  try {
    const res = await fetch(`${API_BASE}/tools/lich-van-nien/today`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { ok: boolean; day: VanNienDayDTO };
    return data.ok ? data.day : null;
  } catch {
    return null;
  }
}

const ACTIVITIES = [
  { value: 'cuoi_hoi', label: 'Cưới hỏi', emoji: '💍' },
  { value: 'khai_truong', label: 'Khai trương', emoji: '🏢' },
  { value: 'dong_tho', label: 'Động thổ', emoji: '🏠' },
  { value: 'nhap_trach', label: 'Nhập trạch', emoji: '🔑' },
  { value: 'xuat_hanh', label: 'Xuất hành', emoji: '✈️' },
  { value: 'mua_xe', label: 'Mua xe', emoji: '🚗' },
  { value: 'ky_hop_dong', label: 'Ký hợp đồng', emoji: '📝' },
  { value: 'cat_toc', label: 'Cắt tóc', emoji: '✂️' },
  { value: 'an_tang', label: 'An táng', emoji: '🪦' },
];

export default async function LichVanNienPage() {
  const today = await getToday();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      <section className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Lịch Vạn Niên 2026
        </h1>
        <p className="text-base sm:text-lg text-foreground/80 max-w-2xl mx-auto">
          Tra cứu ngày giờ tốt xấu chính xác theo lịch âm dương Việt Nam.
          Hoàng đạo / Hắc đạo · Can Chi · Sao tốt sao xấu · Giờ hoàng đạo.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <Link
            href="/lich-van-nien/today"
            className="inline-flex h-10 items-center justify-center rounded-md bg-gold px-4 text-sm font-medium text-ink transition-colors hover:bg-gold-400"
          >
            Xem hôm nay
          </Link>
          <Link
            href="/lich-van-nien/ngay-tot-xau"
            className="inline-flex h-10 items-center justify-center rounded-md border border-gold/40 bg-transparent px-4 text-sm font-medium text-gold transition-colors hover:bg-gold/10"
          >
            Kiểm tra ngày tốt
          </Link>
        </div>
      </section>

      {today && (
        <section>
          <DayCard day={today} />
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-3">Chọn ngày tốt cho việc</h2>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-9">
          {ACTIVITIES.map((a) => (
            <Link
              key={a.value}
              href={`/lich-van-nien/ngay-tot-xau?activity=${a.value}`}
              className="rounded-lg border bg-card p-3 text-center transition-colors hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30"
            >
              <div className="text-2xl">{a.emoji}</div>
              <div className="mt-1 text-xs font-medium">{a.label}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tra cứu 1 ngày</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-foreground/80">
            Xem chi tiết ngày dương âm, Can Chi, sao chiếu, giờ tốt cho 1 ngày bất kỳ.
            <div className="mt-3">
              <Link
                href="/lich-van-nien/today"
                className="inline-flex h-9 items-center rounded-md border border-gold/40 px-3 text-xs font-medium text-gold hover:bg-gold/10"
              >
                Xem hôm nay
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lịch tháng</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-foreground/80">
            Xem cả tháng dạng lịch với màu Hoàng/Hắc đạo, ngày âm, để dễ chọn ngày.
            <div className="mt-3">
              <Link
                href="/lich-van-nien/today"
                className="inline-flex h-9 items-center rounded-md border border-gold/40 px-3 text-xs font-medium text-gold hover:bg-gold/10"
              >
                Mở lịch tháng
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kiểm tra việc cụ thể</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-foreground/80">
            Nhập việc + ngày + năm sinh → trả về điểm số 0-100 và gợi ý ngày tốt hơn.
            <div className="mt-3">
              <Link
                href="/lich-van-nien/ngay-tot-xau"
                className="inline-flex h-9 items-center rounded-md border border-gold/40 px-3 text-xs font-medium text-gold hover:bg-gold/10"
              >
                Kiểm tra ngay
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
