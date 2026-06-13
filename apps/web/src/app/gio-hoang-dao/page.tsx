import type { Metadata } from 'next';
import Link from 'next/link';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { GioHoangDaoChecker } from '@/components/gio-hoang-dao/GioHoangDaoChecker';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';
import { HOANG_DAO_STARS, HAC_DAO_STARS } from '@/lib/gio-hoang-dao';

const DESC =
  'Xem giờ hoàng đạo (giờ tốt) trong ngày theo lịch pháp truyền thống: mỗi ngày có 6 giờ hoàng đạo và 6 giờ hắc đạo, đổi theo Địa Chi của ngày. Nhập ngày để xem giờ tốt — tham khảo, không bói toán.';

export const metadata: Metadata = {
  title: 'Giờ hoàng đạo hôm nay — tra giờ tốt trong ngày',
  description: DESC,
  alternates: { canonical: 'https://hieu.asia/gio-hoang-dao' },
  openGraph: {
    title: 'Giờ hoàng đạo — tra giờ tốt trong ngày',
    description: DESC,
    url: 'https://hieu.asia/gio-hoang-dao',
    type: 'website',
  },
};

const FAQS = [
  {
    q: 'Giờ hoàng đạo là gì?',
    a: 'Theo lịch pháp truyền thống, một ngày có 12 canh giờ (mỗi canh 2 tiếng). Trong đó 6 canh được xem là giờ hoàng đạo (giờ tốt) và 6 canh là giờ hắc đạo. Giờ hoàng đạo gắn với 6 cát tinh: Thanh Long, Minh Đường, Kim Quỹ, Thiên Đức, Ngọc Đường, Tư Mệnh.',
  },
  {
    q: 'Giờ hoàng đạo có giống nhau mỗi ngày không?',
    a: 'Không. Giờ hoàng đạo đổi theo Địa Chi của từng ngày (ngày Tý, Sửu, Dần…). Vì vậy hôm nay và ngày mai thường có bộ giờ tốt khác nhau. Công cụ này tự xác định theo ngày bạn chọn.',
  },
  {
    q: 'Xem giờ hoàng đạo hôm nay thế nào?',
    a: 'Bạn để nguyên ngày mặc định (hôm nay) hoặc chọn một ngày bất kỳ. Hệ thống hiển thị đủ 12 canh giờ kèm khung giờ đồng hồ, đánh dấu giờ tốt (hoàng đạo) — giờ xấu (hắc đạo), và gợi ý giờ tốt kế tiếp trong hôm nay.',
  },
  {
    q: 'Người ta dùng giờ hoàng đạo để làm gì?',
    a: 'Nhiều người chọn giờ hoàng đạo để xuất hành, đón dâu, khởi công, khai trương, làm lễ… cho thuận lợi và an tâm. Đây là tập tục văn hoá mang tính tham khảo, không phải lời phán chắc chắn.',
  },
  {
    q: 'Giờ hoàng đạo tính theo cách nào?',
    a: 'Từ Địa Chi của ngày, xác định mốc khởi sao Thanh Long rồi xếp lần lượt 12 sao (6 cát, 6 hung) vào 12 canh giờ. Bộ giờ ở đây tính theo bài quyết cổ điển và khớp với Lịch Vạn Niên của hieu.asia.',
  },
];

export default function GioHoangDaoPage() {
  return (
    <>
      <JsonLd
        data={[
          webPage({
            name: 'Giờ hoàng đạo hôm nay — tra giờ tốt trong ngày',
            description: DESC,
            url: '/gio-hoang-dao',
          }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Lịch Vạn Niên', url: '/lich-van-nien' },
            { name: 'Giờ hoàng đạo', url: '/gio-hoang-dao' },
          ]),
          faqPage(FAQS),
        ]}
      />
      <ToolPageShell
        eyebrow="Lịch Vạn Niên · Giờ hoàng đạo"
        icon={<span aria-hidden="true">🕐</span>}
        title={
          <>
            Giờ <GoldAccent>hoàng đạo</GoldAccent>
          </>
        }
        description="Tra giờ tốt (hoàng đạo) trong ngày theo lịch pháp truyền thống. Mỗi ngày có 6 giờ hoàng đạo đổi theo Địa Chi của ngày — tra cứu để tham khảo, không phán số mệnh."
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Lịch Vạn Niên', href: '/lich-van-nien' },
          { label: 'Giờ hoàng đạo' },
        ]}
      >
      <div className="mx-auto mb-6 max-w-3xl">
        <Link
          href="/gio-hoang-dao/y-nghia"
          className="flex items-center justify-between gap-3 rounded-lg border border-gold/25 bg-gold/5 px-4 py-3 text-sm transition-colors hover:bg-gold/10"
        >
          <span className="text-foreground/85">🕐 <b className="text-foreground">Ý nghĩa 12 sao giờ</b> — Thanh Long, Bạch Hổ... mỗi sao là gì &amp; hợp việc nào</span>
          <span className="shrink-0 text-gold">Mở →</span>
        </Link>
      </div>
        <section className="space-y-8">
          <GioHoangDaoChecker />

          {/* 6 sao hoàng đạo */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              6 sao hoàng đạo (giờ tốt)
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {HOANG_DAO_STARS.map((s) => (
                <div key={s.name} className="rounded-xl border border-border bg-background/40 p-4">
                  <div className="font-heading text-base font-semibold text-foreground">{s.name}</div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.meaning}</p>
                  {s.suits && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      <span className="font-medium text-foreground">Hợp: </span>
                      {s.suits}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 6 sao hắc đạo */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              6 sao hắc đạo (giờ nên tránh)
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Sáu canh giờ còn lại ứng với 6 sao hắc đạo — theo phong tục nên tránh khởi sự việc
              trọng đại. Đây là lời nhắc thận trọng để tham khảo, không phải điều chắc chắn.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {HAC_DAO_STARS.map((s) => (
                <div key={s.name} className="rounded-xl border border-border bg-background/40 p-4">
                  <div className="font-heading text-base font-semibold text-foreground">{s.name}</div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.meaning}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Lời nhắn */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Một lời nhắn
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Chọn giờ hoàng đạo là một nét văn hoá đẹp, giúp ta khởi sự với tâm thế an tâm và trân
              trọng thời khắc. Nhưng giờ tốt không làm thay phần chuẩn bị, và lỡ giờ tốt cũng không có
              nghĩa việc sẽ hỏng. hieu.asia trình bày để bạn <strong>tham khảo</strong> — không phán số
              mệnh.
            </p>
          </section>

          {/* FAQ */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Câu hỏi thường gặp
            </h2>
            <dl className="mt-4 space-y-4">
              {FAQS.map((f, i) => (
                <div key={i}>
                  <dt className="font-medium text-foreground">{f.q}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <RelatedTools
            links={[
              { href: '/xem-ngay', label: 'Xem ngày tốt' },
              { href: '/ngay-kieng-ky', label: 'Ngày kiêng kỵ' },
              { href: '/sao-han', label: 'Xem sao hạn' },
              { href: '/lich-van-nien', label: 'Lịch Vạn Niên' },
            ]}
          />
        </section>
      </ToolPageShell>
    </>
  );
}
