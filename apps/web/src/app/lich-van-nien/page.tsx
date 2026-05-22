import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, CalendarCheck, ListChecks } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { DayCard, type VanNienDayDTO } from '@/components/lich-van-nien/DayCard';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';

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

const ACTION_CARDS = [
  {
    title: 'Tra cứu 1 ngày',
    desc: 'Chi tiết ngày dương âm, Can Chi, sao chiếu và giờ tốt cho một ngày bất kỳ.',
    cta: 'Xem hôm nay',
    href: '/lich-van-nien/today',
    icon: Calendar,
  },
  {
    title: 'Lịch tháng',
    desc: 'Cả tháng dạng lịch — màu Hoàng/Hắc đạo, ngày âm, dễ chọn ngày tốt.',
    cta: 'Mở lịch tháng',
    href: '/lich-van-nien/today',
    icon: CalendarCheck,
  },
  {
    title: 'Kiểm tra việc cụ thể',
    desc: 'Nhập việc + ngày + năm sinh → điểm số 0–100 và gợi ý ngày tốt hơn trong tuần.',
    cta: 'Kiểm tra ngay',
    href: '/lich-van-nien/ngay-tot-xau',
    icon: ListChecks,
  },
];

export default async function LichVanNienPage() {
  const today = await getToday();

  return (
    <ToolPageShell
      eyebrow="Lịch Vạn Niên · 2026"
      icon={<span aria-hidden="true">📅</span>}
      title={
        <>
          Lịch <GoldAccent>Vạn Niên</GoldAccent> 2026
        </>
      }
      description="Tra cứu ngày giờ tốt xấu chính xác theo lịch âm dương Việt Nam. Hoàng đạo / Hắc đạo · Can Chi · Sao tốt sao xấu · Giờ hoàng đạo."
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Lịch Vạn Niên' },
      ]}
      heroAction={
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/lich-van-nien/today">
            <Button size="sm">Xem hôm nay</Button>
          </Link>
          <Link href="/lich-van-nien/ngay-tot-xau">
            <Button variant="outline" size="sm">
              Kiểm tra ngày tốt
            </Button>
          </Link>
        </div>
      }
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
      />

      {today && (
        <section className="mt-4">
          <DayCard day={today} />
        </section>
      )}

      <section className="mt-12">
        <h2 className="mb-4 font-heading text-xl font-semibold text-cream">
          Chọn ngày tốt cho việc
        </h2>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-9">
          {ACTIVITIES.map((a) => (
            <Link
              key={a.value}
              href={`/lich-van-nien/ngay-tot-xau?activity=${a.value}`}
              aria-label={`Chọn ngày tốt cho ${a.label}`}
              className="group flex min-h-[88px] flex-col items-center justify-center gap-1 rounded-xl border border-cream/10 bg-ink/40 px-2 py-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40 hover:bg-ink/60 hover:shadow-[0_0_30px_-12px_rgba(184,146,61,0.4)]"
            >
              <div
                aria-hidden="true"
                className="text-2xl transition-transform duration-200 group-hover:scale-110"
              >
                {a.emoji}
              </div>
              <div className="text-[11px] font-medium leading-tight text-cream/85 sm:text-xs">
                {a.label}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-4 md:grid-cols-3">
        {ACTION_CARDS.map((c) => {
          const Icon = c.icon;
          return (
            <Card
              key={c.title}
              className="group border-cream/10 bg-ink/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40"
            >
              <CardHeader>
                <Icon className="mb-2 h-5 w-5 text-gold/85" aria-hidden="true" />
                <CardTitle className="text-base">{c.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-cream/75">
                <p className="leading-relaxed">{c.desc}</p>
                <div className="mt-4">
                  <Link href={c.href}>
                    <Button variant="outline" size="sm">
                      {c.cta} →
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="mt-12">
        <h2 className="mb-4 font-heading text-xl font-semibold text-cream">
          Câu hỏi thường gặp
        </h2>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <details
              key={i}
              className="group rounded-xl border border-cream/10 bg-ink/40 p-4 transition-colors open:border-gold/30 open:bg-ink/60"
            >
              <summary className="cursor-pointer list-none text-sm font-medium text-cream marker:hidden">
                <span className="flex items-center justify-between">
                  {f.q}
                  <span className="ml-3 text-gold transition-transform group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-cream/70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </ToolPageShell>
  );
}
