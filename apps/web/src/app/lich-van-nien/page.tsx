import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { DayCard, type VanNienDayDTO } from '@/components/lich-van-nien/DayCard';

export const metadata: Metadata = {
  title: 'Lịch Vạn Niên 2026 — Tra cứu ngày giờ tốt xấu',
  description:
    'Lịch vạn niên Việt Nam: ngày dương âm, Can Chi, Hoàng đạo / Hắc đạo, sao tốt sao xấu, giờ hoàng đạo, ngày tốt cho cưới hỏi, khai trương, động thổ.',
  alternates: { canonical: 'https://hieu.asia/lich-van-nien' },
};

const FAQS = [
  {
    q: 'Ngày Hoàng đạo và Hắc đạo khác nhau thế nào?',
    a: 'Hoàng đạo là ngày có sao tốt chiếu, thuận lợi cho khởi sự, cưới hỏi, khai trương. Hắc đạo là ngày có sao xấu chiếu, nên tránh việc trọng đại. Lịch vạn niên hieu.asia tính toán dựa trên 12 trực và Nhị thập bát tú.',
  },
  {
    q: 'Cách chọn giờ Hoàng đạo trong ngày?',
    a: 'Mỗi ngày có 6 giờ Hoàng đạo trong 12 canh giờ (2 tiếng/canh). Hệ thống tính dựa trên Địa Chi ngày và bảng giờ Hoàng đạo cổ truyền. Nên chọn giờ Hoàng đạo trùng với việc bạn định làm (ví dụ Tý/Ngọ tốt cho khai trương).',
  },
  {
    q: 'Lịch âm dương có chính xác không?',
    a: 'Chính xác. hieu.asia sử dụng thuật toán thiên văn tính giờ ICT (UTC+7) theo kinh tuyến 105°E như lịch Việt Nam chính thống — sai số dưới 1 phút.',
  },
  {
    q: 'Có thể kiểm tra ngày tốt cho việc cụ thể không?',
    a: 'Có. Vào mục "Kiểm tra việc cụ thể" trên trang, chọn việc (cưới hỏi, khai trương, động thổ, nhập trạch, xuất hành, mua xe...) và nhập ngày + năm sinh. Hệ thống trả về điểm số 0-100 và gợi ý ngày tốt hơn trong tuần.',
  },
  {
    q: 'Tại sao cùng 1 ngày, người này tốt người kia xấu?',
    a: 'Vì cần đối chiếu Can Chi ngày với năm sinh (tuổi) của bạn. Tam hợp / Lục hợp là tốt, Tứ hành xung / Lục xung là xấu. hieu.asia cá nhân hóa kết quả theo năm sinh bạn nhập.',
  },
];

const FAQ_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
      />
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

      <section>
        <h2 className="text-xl font-semibold mb-4">Câu hỏi thường gặp</h2>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <details key={i} className="rounded-lg border bg-card p-4">
              <summary className="cursor-pointer text-sm font-medium">{f.q}</summary>
              <p className="mt-3 text-sm text-foreground/75 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
