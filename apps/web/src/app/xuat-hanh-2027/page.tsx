import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@hieu-asia/ui';
import { ArrowRight } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, faqPage } from '@/lib/seo/jsonld';
import { computeXuatHanh } from '@/lib/xuat-hanh';
import { permanentRedirect } from 'next/navigation';
import { expiredSeasonalTarget } from '@/lib/seasonal';

// Tết Đinh Mùi 2027 — mùng 1 = Thứ Bảy 06/02/2027 (giao thừa 05/02).
const TET_DAYS = [
  { label: 'Mùng 1', weekday: 'Thứ Bảy', dd: 6, mm: 2, yy: 2027 },
  { label: 'Mùng 2', weekday: 'Chủ Nhật', dd: 7, mm: 2, yy: 2027 },
  { label: 'Mùng 3', weekday: 'Thứ Hai', dd: 8, mm: 2, yy: 2027 },
] as const;

const DAYS = TET_DAYS.map((d) => ({ ...d, r: computeXuatHanh(d.dd, d.mm, d.yy) }));
const mung1 = DAYS[0]!.r;

export const metadata: Metadata = {
  title: 'Xuất hành Tết 2027 — hướng & giờ tốt 3 ngày',
  description:
    'Hướng xuất hành Tết Đinh Mùi 2027 — Hỷ Thần, Tài Thần & giờ hoàng đạo cho mùng 1 (6/2), mùng 2 (7/2), mùng 3 (8/2). Tính theo Can-Chi, tham khảo.',
  alternates: { canonical: 'https://hieu.asia/xuat-hanh-2027' },
  openGraph: {
    title: 'Xuất hành đầu năm 2027 — hướng & giờ tốt mùng 1, 2, 3 Tết',
    description:
      'Hướng Hỷ Thần / Tài Thần + giờ hoàng đạo từng ngày Tết Đinh Mùi 2027, tính theo Can-Chi, minh bạch nguồn.',
    url: 'https://hieu.asia/xuat-hanh-2027',
    type: 'article',
    locale: 'vi_VN',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'hieu.asia — Xuất hành đầu năm 2027' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Xuất hành đầu năm 2027 — hướng & giờ tốt',
    description: 'Hỷ Thần / Tài Thần + giờ hoàng đạo mùng 1–3 Tết Đinh Mùi, tính theo Can-Chi.',
    images: [{ url: '/og-image.jpg', alt: 'hieu.asia — Xuất hành 2027' }],
  },
};

const HUB_FAQS = [
  {
    q: 'Mùng 1 Tết 2027 nên xuất hành hướng nào, giờ nào?',
    a: mung1
      ? `Mùng 1 Tết Đinh Mùi (Thứ Bảy 6/2/2027) là ngày ${mung1.dayCanChi.label}. Theo lịch can-chi: hướng Hỷ Thần (cầu may) là ${mung1.hyThan}, hướng Tài Thần (cầu tài) là ${mung1.taiThan}. Giờ hoàng đạo (giờ tốt) gồm ${mung1.goodHours.slice(0, 3).map((h) => h.range).join(', ')}… Đây là phong tục tham khảo, không phải điều bắt buộc.`
      : 'Xem bảng hướng và giờ tốt từng ngày Tết 2027 ở trên.',
  },
  {
    q: 'Tết Nguyên đán 2027 vào ngày nào dương lịch?',
    a: 'Tết Đinh Mùi 2027: giao thừa là Thứ Sáu 5/2/2027, mùng 1 là Thứ Bảy 6/2/2027, mùng 2 là 7/2, mùng 3 là 8/2 (dương lịch).',
  },
  {
    q: 'Hỷ Thần, Tài Thần là gì? Tính thế nào?',
    a: 'Hỷ Thần (喜神) là phương vị cầu may mắn, hỉ sự; Tài Thần (財神) là phương vị cầu tài lộc. Cả hai được tính theo THIÊN CAN của ngày (chu kỳ 10 ngày), không phụ thuộc tuổi người đi. hieu.asia tính tự động từ Can-Chi ngày — kết quả ai tra cũng giống nhau.',
  },
  {
    q: 'Xuất hành sai hướng có sao không?',
    a: 'Đây là phong tục cầu may đầu năm, không phải định mệnh. Đi đúng hướng Hỷ Thần/Tài Thần là một nét văn hóa để bắt đầu năm với tinh thần tích cực — không đi được hướng đó cũng không có nghĩa cả năm xui. Cái quyết định vẫn là sự chuẩn bị và lựa chọn của bạn.',
  },
];

const JSONLD = [
  article({
    headline: 'Xuất hành đầu năm 2027 (Đinh Mùi): hướng & giờ tốt mùng 1, 2, 3 Tết',
    description:
      'Hướng Hỷ Thần, Tài Thần và giờ hoàng đạo cho mùng 1–3 Tết Đinh Mùi 2027, tính theo Can-Chi từng ngày, minh bạch nguồn.',
    url: '/xuat-hanh-2027',
    type: 'Article',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Xuất hành đầu năm 2027', url: '/xuat-hanh-2027' },
  ]),
  faqPage(HUB_FAQS),
];

export default function XuatHanh2027Page() {
  // S10 mùa vụ: hết 2027 → 308 về evergreen (Next tự dựng redirect lúc build).
  const evergreen = expiredSeasonalTarget('/xuat-hanh-2027');
  if (evergreen) permanentRedirect(evergreen);
  return (
    <>
      <SiteNav />
      <JsonLd data={JSONLD} />
      <main id="main-content" className="min-h-screen bg-background text-foreground pt-16">
        {/* Hero */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10 pt-6 sm:pt-8">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-gold">Trang chủ</Link>
            <span className="mx-1.5">/</span>
            <span className="text-muted-foreground">Xuất hành đầu năm 2027</span>
          </nav>
          <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold-700">
            Tết Đinh Mùi 2027 · tính theo Can-Chi
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Xuất hành đầu năm 2027: hướng &amp; giờ tốt
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/80 sm:text-lg">
            Xuất hành là tục đi ra khỏi nhà lần đầu trong năm mới để cầu một năm hanh thông. Dưới đây là
            hướng <strong className="text-foreground">Hỷ Thần</strong> (cầu may),{' '}
            <strong className="text-foreground">Tài Thần</strong> (cầu tài) và giờ hoàng đạo cho mùng 1–3
            Tết Đinh Mùi 2027 — tính tự động theo Can-Chi từng ngày. Đây là phong tục để tham khảo,
            không phải lời phán số mệnh.
          </p>
        </section>

        {/* Bảng từng ngày */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <div className="grid gap-4 sm:grid-cols-3">
            {DAYS.map((d) => (
              <div key={d.label} className="rounded-2xl border border-border bg-card/40 p-5">
                <p className="font-heading text-lg font-semibold text-foreground">{d.label}</p>
                <p className="text-xs text-muted-foreground">
                  {d.weekday}, {String(d.dd).padStart(2, '0')}/{String(d.mm).padStart(2, '0')}/{d.yy}
                  {d.r ? ` · ngày ${d.r.dayCanChi.label}` : ''}
                </p>
                {d.r ? (
                  <dl className="mt-4 space-y-2.5 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Hướng Hỷ Thần (cầu may)</dt>
                      <dd className="font-semibold text-gold">{d.r.hyThan}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Hướng Tài Thần (cầu tài)</dt>
                      <dd className="font-semibold text-gold">{d.r.taiThan}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Giờ hoàng đạo (giờ tốt)</dt>
                      <dd className="text-foreground/85">
                        {d.r.goodHours.slice(0, 4).map((h) => h.range).join(' · ')}
                      </dd>
                    </div>
                  </dl>
                ) : null}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Giờ tốt đầy đủ từng ngày (12 canh giờ, sao chiếu){' '}
            <Link href="/gio-hoang-dao" className="text-gold hover:underline">tra ở công cụ Giờ hoàng đạo</Link>.
          </p>
        </section>

        {/* Giải thích */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Hỷ Thần, Tài Thần được tính thế nào?
          </h2>
          <p className="leading-relaxed text-foreground/85">
            Hai phương vị này tính theo <strong className="text-foreground">thiên can của ngày</strong>{' '}
            (chu kỳ 10 ngày), không phụ thuộc tuổi người đi. Hỷ Thần theo khẩu quyết cổ
            (《考原》): Giáp–Kỷ ở Đông Bắc, Ất–Canh ở Tây Bắc, Bính–Tân ở Tây Nam, Đinh–Nhâm ở
            Chính Nam, Mậu–Quý ở Đông Nam. hieu.asia suy Can-Chi ngày bằng cùng engine với Lịch vạn
            niên của site, nên kết quả ai tra cũng như nhau — minh bạch, kiểm chứng được.
          </p>
          <div className="mt-4 rounded-xl border border-gold/20 bg-gold/5 p-4 text-sm leading-relaxed text-foreground/80">
            <strong className="text-foreground">Nói thẳng về độ tin:</strong> Hướng Tài Thần có nhiều phái
            tính khác nhau (lịch vạn niên Việt Nam dùng một bản, một số phái Trung Hoa tính khác). Ở đây
            dùng bản phổ biến trong lịch vạn niên Việt Nam. Đây là <strong className="text-foreground">phong
            tục cầu may</strong>, không phải khoa học — hãy xem như một nét văn hóa đẹp đầu năm, không phải
            ràng buộc.
          </div>
        </section>

        {/* Góc nhìn thương hiệu */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <div className="rounded-card-editorial border border-gold/20 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
              Đi đúng hướng để vui, không phải để sợ
            </h2>
            <p className="mt-4 leading-relaxed text-foreground/85">
              Chọn hướng xuất hành đẹp là cách bắt đầu năm mới với tâm thế tích cực. Nhưng một năm tốt
              không nằm ở việc bước ra cửa theo hướng nào — nó nằm ở những gì bạn chuẩn bị và quyết định
              suốt cả năm. Nếu không tiện đi đúng hướng, đừng lo: đây là tục cầu may, không phải lời tuyên án.
            </p>
          </div>
        </section>

        {/* Liên kết */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <nav aria-label="Công cụ liên quan" className="text-sm leading-7">
            <span className="text-muted-foreground">Xem thêm: </span>
            <Link href="/tu-vi-2027" className="text-gold hover:underline">Tử Vi 2027 Đinh Mùi</Link>
            {', '}
            <Link href="/xong-dat" className="text-gold hover:underline">Xem tuổi xông đất</Link>
            {', '}
            <Link href="/gio-hoang-dao" className="text-gold hover:underline">Giờ hoàng đạo</Link>
            {', '}
            <Link href="/lich-van-nien" className="text-gold hover:underline">Lịch vạn niên 2027</Link>
            .
          </nav>
        </section>

        {/* Lead capture */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <OccasionLeadCapture
            source="xuat-hanh-2027"
            capturedEvent="lead_capture_xuat_hanh"
            blurb="Để lại email, chúng tôi nhắc các mốc Tết Đinh Mùi 2027: ngày tốt, giờ xuất hành, tuổi xông đất. Thi thoảng thôi, không spam."
            cta="Nhận nhắc Tết 2027"
          />
        </section>

        {/* FAQ */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Câu hỏi thường gặp về xuất hành 2027
          </h2>
          <dl className="space-y-4">
            {HUB_FAQS.map((f) => (
              <div key={f.q} className="rounded-lg border border-border bg-card/40 p-4">
                <dt className="font-heading font-medium text-foreground">{f.q}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* CTA */}
        <section className="relative mx-auto max-w-3xl px-6 pb-16">
          <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Năm Đinh Mùi 2027 của riêng bạn
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              Hướng xuất hành là chung cho cả ngày. Vận trình 2027 RIÊNG bạn phụ thuộc lá số cá nhân. Lập
              lá số miễn phí trong 30 giây — không cần tài khoản, không cần thẻ.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/onboarding?intent=xuat-hanh-2027">Lập lá số miễn phí</Link>
              </Button>
              <Link
                href="/tu-vi-2027"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
              >
                Tử Vi 2027 Đinh Mùi <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <StickyMobileCta trackId="xuat-hanh-2027" />
    </>
  );
}
