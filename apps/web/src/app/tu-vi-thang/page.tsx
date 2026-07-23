import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@hieu-asia/ui';
import { ArrowRight } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, faqPage, itemList, webPage } from '@/lib/seo/jsonld';
import { ZODIAC } from '@/lib/hop-tuoi-pairs';
import {
  buildMonthOverview,
  liveMonths,
  monthSlug,
  WINDOW_MONTHS,
} from '@/lib/tu-vi-thang-data';

const TITLE = 'Tử vi tháng theo con giáp — tra can chi từng tháng';
const DESC =
  'Tử vi từng tháng cho 12 con giáp: trụ tháng theo tiết khí, quan hệ hợp xung với chi tuổi, và danh sách ngày trong tháng hợp hoặc xung chi tuổi. Tính từ can chi, tham khảo chứ không phán số mệnh.';
const URL = 'https://hieu.asia/tu-vi-thang';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: URL,
    type: 'website',
    locale: 'vi_VN',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
};

const HUB_FAQS = [
  {
    q: 'Tử vi tháng ở đây được tính từ đâu?',
    a: 'Từ can chi. Mỗi tháng có một trụ tháng (can + chi) tính theo tiết khí — cùng engine Bát Tự mà hieu.asia dùng cho lá số. Từ chi tháng đó, trang đối chiếu với chi tuổi của bạn theo các quan hệ Tam Hợp, Lục Hợp, Lục Xung, Lục Hại, rồi tính tiếp ngũ hành và can chi từng ngày trong tháng. Không có bước nào là cảm hứng hay do AI viết tự do.',
  },
  {
    q: 'Vì sao chỉ có vài tháng, không có cả năm?',
    a: `Vì một trang tử vi tháng chỉ có ích tới khi tháng đó kết thúc. Cụm này giữ tháng đang diễn ra cộng ${WINDOW_MONTHS} tháng phía trước; hết tháng nào thì trang tháng đó tự rụng khỏi sitemap và chuyển hướng về trang tử vi hôm nay, thay vì để lại một đống trang nói về tháng đã xong.`,
  },
  {
    q: 'Trụ tháng đổi vào ngày 1 dương lịch phải không?',
    a: 'Không. Trụ tháng theo Bát Tự đổi tại tiết khí, thường rơi vào khoảng ngày 4–8 dương lịch, nên một tháng dương thường nằm vắt qua hai trụ tháng. Mỗi trang đều ghi rõ tháng đó bị cắt ở ngày nào và trụ nào chiếm phần lớn.',
  },
  {
    q: 'Đọc tử vi tháng theo con giáp có đúng với riêng tôi không?',
    a: 'Chỉ đúng ở mức khung chung. Con giáp gộp mọi người sinh cùng một năm âm vào một nhóm, nên nội dung theo con giáp là bối cảnh, không phải chân dung của bạn. Muốn sát hơn thì cần lá số theo ngày giờ sinh.',
  },
];

export default function TuViThangHubPage() {
  const months = liveMonths().map((k) => buildMonthOverview(k));
  const listItems = months.map((m) => ({
    name: `Tử vi ${m.label} (trụ tháng ${m.main.label})`,
    url: `/tu-vi-thang/${m.slug}`,
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <JsonLd
        data={[
          webPage({ name: TITLE, description: DESC, url: '/tu-vi-thang' }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Tử vi tháng', url: '/tu-vi-thang' },
          ]),
          itemList(listItems),
          faqPage(HUB_FAQS),
        ]}
      />

      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-ink-radial opacity-80"
        />

        <section className="relative mx-auto max-w-3xl px-6 pb-10 pt-6 sm:pt-8">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-gold">
              Trang chủ
            </Link>
            <span className="mx-1.5">/</span>
            <span>Tử vi tháng</span>
          </nav>
          <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
            Tra cứu theo can chi · {months.length} tháng đang mở
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Tử vi tháng theo con giáp
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/80 sm:text-lg">
            Mỗi tháng mang một trụ can chi riêng. Trang này lấy trụ tháng đó đối chiếu với chi tuổi
            của bạn, rồi liệt kê luôn những ngày trong tháng có địa chi hợp hoặc xung với tuổi — tất
            cả đều là con số tính được, bạn kiểm tra lại được. Đây là tra cứu phong tục để tham
            khảo khi sắp lịch, không phải lời phán về số mệnh.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/la-so-tu-vi">Lập lá số Tử Vi của bạn</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/hop-tuoi">Xem hợp tuổi</Link>
            </Button>
          </div>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Các tháng đang có
          </h2>
          <ul className="space-y-3">
            {months.map((m) => (
              <li key={m.slug}>
                <Link
                  href={`/tu-vi-thang/${m.slug}`}
                  className="block rounded-xl border border-border bg-card/40 p-4 transition hover:border-gold/40"
                >
                  <p className="font-heading text-lg font-semibold text-foreground">
                    Tử vi {m.label}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Trụ tháng {m.main.label} · can {m.main.can} hành {m.main.canElement} · chi{' '}
                    {m.main.chi} hành {m.main.chiElement} · nạp âm {m.main.napAm.name}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Một tháng ở lại danh sách cho tới hết tháng đó, rồi tự rụng khỏi đây và khỏi sitemap —
            chúng tôi không giữ trang nói về một tháng đã xong để lấy lượt truy cập.
          </p>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Đi thẳng tới tuổi của bạn
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            Chọn con giáp để xem tháng gần nhất, rồi chuyển tháng ngay trên trang đó.
          </p>
          <div className="flex flex-wrap gap-2">
            {months[0] &&
              ZODIAC.map((z) => (
                <Link
                  key={z.slug}
                  href={`/tu-vi-thang/${months[0]!.slug}/${z.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1.5 text-sm text-foreground/80 transition hover:border-gold/40 hover:text-gold"
                >
                  <span aria-hidden="true">{z.emoji}</span> Tuổi {z.ten}
                </Link>
              ))}
          </div>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Câu hỏi thường gặp
          </h2>
          <dl className="space-y-4">
            {HUB_FAQS.map((f) => (
              <div key={f.q} className="rounded-xl border border-border bg-card/40 p-5">
                <dt className="font-heading text-base font-semibold text-foreground">{f.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Muốn sát hơn khung con giáp?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              Khung theo tháng và con giáp giúp bạn sắp lịch, nhưng nó dùng đúng một dữ kiện của
              bạn. Lá số theo ngày giờ sinh cho thêm đại vận, lưu niên và cung Mệnh — đó mới là
              phần riêng của bạn.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/la-so-tu-vi">Lập lá số miễn phí</Link>
              </Button>
              <Link
                href="/hop-tuoi"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
              >
                Xem hợp tuổi <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6 pb-12">
          <RelatedTools current="/tu-vi-thang" />
        </div>
      </main>
      <SiteFooter />
      <StickyMobileCta href="/la-so-tu-vi" trackId="tu-vi-thang-hub" />
    </div>
  );
}
