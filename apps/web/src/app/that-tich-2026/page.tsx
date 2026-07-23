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
import { permanentRedirect } from 'next/navigation';
import { expiredSeasonalTarget } from '@/lib/seasonal';

// Ngày âm–dương trên trang này lấy từ chính engine lịch của repo
// (`solarToLunar` trong lib/ngay-kieng-ky.ts): 7/7 âm lịch 2026 = 19/8/2026.

export const metadata: Metadata = {
  title: 'Thất Tịch 2026 — ngày nào, nên hiểu thế nào về duyên',
  description:
    'Thất Tịch 2026 rơi vào thứ Tư 19/8 dương lịch (7/7 âm lịch). Nguồn gốc Ngưu Lang – Chức Nữ, chuyện ăn chè đậu đỏ, và cách xem duyên theo lá số thay vì cầu may.',
  alternates: { canonical: 'https://hieu.asia/that-tich-2026' },
  openGraph: {
    title: 'Thất Tịch 2026 là ngày nào? Xem duyên theo lá số, không cầu may',
    description:
      '7/7 âm lịch 2026 = thứ Tư 19/8. Sự tích Ngưu Lang – Chức Nữ, tục ăn chè đậu đỏ và cách nhìn duyên có cơ sở.',
    url: 'https://hieu.asia/that-tich-2026',
    type: 'article',
    locale: 'vi_VN',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'hieu.asia — Thất Tịch 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thất Tịch 2026 — ngày nào, xem duyên thế nào cho có cơ sở',
    description: '7/7 âm lịch 2026 = thứ Tư 19/8. Hiểu duyên bằng lá số, không phải bằng cầu may.',
    images: [{ url: '/og-image.jpg', alt: 'hieu.asia — Thất Tịch 2026' }],
  },
};

const HUB_FAQS = [
  {
    q: 'Thất Tịch 2026 là ngày nào dương lịch?',
    a: 'Thất Tịch là ngày 7 tháng 7 âm lịch. Năm 2026, ngày này rơi vào thứ Tư 19/8/2026 dương lịch. Đây cũng là tuần thứ hai của tháng 7 âm — tháng mà dân gian quen gọi là tháng cô hồn.',
  },
  {
    q: 'Thất Tịch có phải Valentine của người châu Á không?',
    a: 'Nhiều người gọi vậy cho dễ hình dung, nhưng gốc của hai ngày khác nhau. Valentine 14/2 đến từ phương Tây. Thất Tịch bắt nguồn từ sự tích Ngưu Lang – Chức Nữ, mỗi năm chỉ gặp nhau một lần trên cầu Ô Thước — câu chuyện thiên về xa cách và chờ đợi hơn là hò hẹn.',
  },
  {
    q: 'Ăn chè đậu đỏ ngày Thất Tịch có giúp thoát ế không?',
    a: 'Đó là một tục vui của giới trẻ mấy năm gần đây, không phải nghi lễ cổ truyền và cũng không có cơ sở nào cho thấy nó đổi được chuyện tình cảm. Cứ ăn nếu thấy vui. Nhưng nếu bạn thật sự muốn hiểu chuyện duyên của mình, xem cung Phu Thê trên lá số và mức hợp tuổi sẽ cho bạn nhiều thứ để suy nghĩ hơn một bát chè.',
  },
  {
    q: 'Thất Tịch nằm trong tháng cô hồn thì có kiêng cưới hỏi không?',
    a: 'Thất Tịch (7/7 âm) nằm trong tháng 7 âm lịch, tháng mà dân gian thường tránh việc trọng đại. Đây là phong tục, không phải quy luật. Nếu bạn cần chọn ngày cưới, hãy chọn theo can-chi và tuổi hai bên — minh bạch và kiểm chứng được — thay vì kiêng cả tháng vì lo lắng mơ hồ.',
  },
  {
    q: 'Xem duyên theo lá số nghĩa là xem cái gì?',
    a: 'Trên lá số Tử Vi, cung Phu Thê cho biết thiên hướng của bạn trong chuyện đôi lứa: hợp kiểu người thế nào, dễ vướng ở đâu, giai đoạn nào chuyện tình cảm nổi lên rõ. Đó là mô tả xu hướng để bạn tự soi, không phải lời phán ai là "định mệnh" của bạn.',
  },
];

const JSONLD = [
  article({
    headline: 'Thất Tịch 2026 là ngày nào? Sự tích, tục lệ và cách xem duyên có cơ sở',
    description:
      'Thất Tịch 2026 rơi vào thứ Tư 19/8 (7/7 âm lịch). Nguồn gốc Ngưu Lang – Chức Nữ, tục ăn chè đậu đỏ, và cách xem duyên theo lá số thay vì cầu may.',
    url: '/that-tich-2026',
    type: 'Article',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Thất Tịch 2026', url: '/that-tich-2026' },
  ]),
  faqPage(HUB_FAQS),
];

export default function ThatTich2026Page() {
  // S10 mùa vụ: hết 2026 → 308 về evergreen (Next tự dựng redirect lúc build).
  const evergreen = expiredSeasonalTarget('/that-tich-2026');
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
            <span className="text-muted-foreground">Thất Tịch 2026</span>
          </nav>
          <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold-700">
            Dịp tình duyên · xem bằng lá số
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Thất Tịch 2026 là ngày nào?
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/80 sm:text-lg">
            Thất Tịch năm 2026 rơi vào <strong className="text-foreground">thứ Tư 19/8</strong>{' '}
            dương lịch, tức mùng <strong className="text-foreground">7 tháng 7 âm lịch</strong>.
            Đây là ngày gắn với sự tích Ngưu Lang – Chức Nữ, và mấy năm nay thành dịp giới trẻ
            rủ nhau ăn chè đậu đỏ "cầu duyên". Trang này nói thẳng: chè thì cứ ăn cho vui, còn
            muốn hiểu chuyện duyên của mình thì nên nhìn vào lá số, không phải nhìn vào bát chè.
          </p>
        </section>

        {/* Mốc ngày */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Các mốc quanh Thất Tịch 2026
          </h2>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-3 text-muted-foreground">Mùng 1 tháng 7 âm</td>
                  <td className="px-4 py-3 font-medium text-foreground">Thứ Năm, 13/8/2026</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-muted-foreground">Thất Tịch — mùng 7 tháng 7 âm</td>
                  <td className="px-4 py-3 font-medium text-foreground">Thứ Tư, 19/8/2026</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-muted-foreground">Rằm tháng 7 — lễ Vu Lan</td>
                  <td className="px-4 py-3 font-medium text-foreground">Thứ Năm, 27/8/2026</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Muốn tra ngày âm, can-chi và giờ hoàng đạo của một ngày bất kỳ?{' '}
            <Link href="/lich-van-nien" className="text-gold hover:underline">
              Lịch vạn niên 2026
            </Link>{' '}
            có đủ. Thất Tịch nằm trong tháng 7 âm — xem thêm{' '}
            <Link href="/thang-co-hon-2026" className="text-gold hover:underline">
              tháng cô hồn 2026
            </Link>{' '}
            nếu bạn đang cân nhắc việc trọng đại trong tháng này.
          </p>
        </section>

        {/* Nguồn gốc */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Sự tích Ngưu Lang – Chức Nữ, kể cho đúng
          </h2>
          <p className="leading-relaxed text-foreground/85">
            Chuyện kể rằng Chức Nữ là người dệt vải trên trời, phải lòng chàng chăn trâu Ngưu Lang
            dưới hạ giới. Vì mối duyên trái phép, hai người bị chia cắt hai bên sông Ngân, mỗi năm
            chỉ được gặp nhau một lần vào đêm mùng 7 tháng 7, khi đàn quạ bắc cầu Ô Thước.
          </p>
          <p className="mt-4 leading-relaxed text-foreground/85">
            Điều đáng chú ý là gốc của Thất Tịch không phải một ngày lễ tình nhân vui vẻ. Nó là câu
            chuyện về <strong className="text-foreground">xa cách, chờ đợi và giữ lòng</strong>.
            Ở Trung Hoa xưa, đêm này còn gọi là lễ Khất Xảo — con gái cầu cho khéo tay, giỏi nữ công,
            chứ không phải cầu người yêu. Cách gọi "Valentine châu Á" là chuyện của thời nay.
          </p>
        </section>

        {/* Chè đậu đỏ */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Chuyện ăn chè đậu đỏ để "thoát ế"
          </h2>
          <p className="leading-relaxed text-foreground/85">
            Tục ăn chè đậu đỏ ngày Thất Tịch nổi lên ở Việt Nam khoảng vài năm gần đây, lan từ mạng
            xã hội chứ không có trong nghi lễ cổ truyền. Ý tưởng đơn giản: màu đỏ tượng trưng cho
            may mắn và nhân duyên.
          </p>
          <p className="mt-4 leading-relaxed text-foreground/85">
            Chúng tôi không khuyên bạn bỏ. Rủ bạn bè đi ăn chè là một cái cớ dễ thương để gặp nhau,
            và bản thân điều đó đã có giá trị. Chỉ cần nhớ nó là một trào lưu vui, không phải một
            phép màu — và <strong className="text-foreground">không ai nên bán cho bạn nỗi lo</strong>{' '}
            rằng bỏ lỡ một ngày thì lỡ cả đường tình duyên.
          </p>
        </section>

        {/* Góc nhìn thương hiệu + tool */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <div className="rounded-card-editorial border border-gold/20 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
              Muốn hiểu duyên của mình? Nhìn lá số, đừng cầu may
            </h2>
            <p className="mt-4 leading-relaxed text-foreground/85">
              Trên lá số Tử Vi, chuyện đôi lứa nằm ở <strong className="text-foreground">cung Phu Thê</strong>:
              các sao trong cung đó mô tả thiên hướng của bạn khi yêu — hợp kiểu người thế nào, hay
              vướng ở đâu, giai đoạn nào chuyện tình cảm nổi lên rõ hơn.
            </p>
            <p className="mt-4 leading-relaxed text-foreground/85">
              Đó là mô tả xu hướng để bạn tự soi, không phải lời phán ai là "định mệnh" của bạn.
              hieu.asia không đoán ngày bạn lấy chồng lấy vợ, và cũng không bán bùa cầu duyên. Cái
              chúng tôi làm được là chỉ cho bạn thấy lá số ghi gì, và chỗ nào lá số chưa nói rõ thì
              nói thẳng là chưa rõ.
            </p>
          </div>
        </section>

        {/* Công cụ */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Làm gì trong ngày Thất Tịch cho ra chuyện
          </h2>
          <ul className="mt-3 ml-5 list-disc space-y-2 text-foreground/85">
            <li>
              <Link href="/hop-tuoi" className="text-gold hover:underline">Xem hợp tuổi</Link>{' '}
              — đối chiếu tuổi hai người theo can-chi, ngũ hành và cung mệnh, có giải thích vì sao
              hợp hay khắc ở điểm nào, miễn phí.
            </li>
            <li>
              <Link href="/tarot" className="text-gold hover:underline">Trải bài Tarot tình yêu</Link>{' '}
              — một cách gợi mở để bạn tự đặt câu hỏi về mối quan hệ đang có, không phải để phán kết cục.
            </li>
            <li>
              <Link href="/la-so-tu-vi" className="text-gold hover:underline">Lập lá số Tử Vi miễn phí</Link>{' '}
              — xem cung Phu Thê của chính mình có sao nào, thay vì đọc tử vi chung cho cả con giáp.
            </li>
            <li>
              <Link href="/xem-ngay" className="text-gold hover:underline">Xem ngày tốt theo việc</Link>{' '}
              — nếu bạn đang tính chuyện cưới hỏi và muốn chọn ngày có cơ sở, không kiêng cữ mơ hồ.
            </li>
          </ul>
        </section>

        {/* Lead capture theo mùa */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <OccasionLeadCapture
            source="that-tich-2026"
            capturedEvent="lead_capture_that_tich"
            blurb="Để lại email, chúng tôi nhắc bạn các mốc theo mùa: Thất Tịch, Rằm tháng 7, Tết và sao hạn đầu năm. Thi thoảng thôi, không spam."
            cta="Nhận nhắc theo mùa"
          />
        </section>

        {/* FAQ */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Câu hỏi thường gặp về Thất Tịch 2026
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
              Xem duyên của chính bạn, không phải của cả con giáp
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              Lập lá số miễn phí trong khoảng 30 giây — không cần tài khoản, không cần thẻ. Bạn xem
              lá số đầy đủ trước, rồi tự quyết có đọc sâu hay không.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/onboarding?intent=that-tich">Lập lá số miễn phí</Link>
              </Button>
              <Link
                href="/hop-tuoi"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
              >
                Xem hợp tuổi hai người <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <StickyMobileCta trackId="that-tich-2026" />
    </>
  );
}
