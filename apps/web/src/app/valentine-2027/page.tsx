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

// Ngày âm–dương lấy từ chính engine lịch của repo (`solarToLunar` trong
// lib/ngay-kieng-ky.ts): 14/2/2027 = mùng 9 tháng Giêng âm lịch Đinh Mùi,
// tức Valentine 2027 rơi đúng vào tuần Tết.

export const metadata: Metadata = {
  title: 'Valentine 2027 — xem hợp đôi theo lá số, không đoán mò',
  description:
    'Valentine 2027 rơi vào Chủ Nhật 14/2, mùng 9 tháng Giêng Đinh Mùi — ngay tuần Tết. Xem hợp tuổi theo can-chi và cung Phu Thê trên lá số, có giải thích vì sao.',
  alternates: { canonical: 'https://hieu.asia/valentine-2027' },
  openGraph: {
    title: 'Valentine 2027 — hợp đôi theo lá số, không phải theo cung hoàng đạo chung',
    description:
      'Chủ Nhật 14/2/2027, nhằm mùng 9 Tết Đinh Mùi. Xem hợp tuổi can-chi và cung Phu Thê của riêng hai bạn.',
    url: 'https://hieu.asia/valentine-2027',
    type: 'article',
    locale: 'vi_VN',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'hieu.asia — Valentine 2027',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Valentine 2027 — xem hợp đôi theo lá số',
    description: 'Chủ Nhật 14/2/2027, nhằm mùng 9 Tết Đinh Mùi. Hợp tuổi có giải thích, không phán bừa.',
    images: [{ url: '/og-image.jpg', alt: 'hieu.asia — Valentine 2027' }],
  },
};

const HUB_FAQS = [
  {
    q: 'Valentine 2027 là thứ mấy?',
    a: 'Valentine 2027 rơi vào Chủ Nhật, ngày 14/2/2027 dương lịch. Theo âm lịch, đó là mùng 9 tháng Giêng năm Đinh Mùi — tức vẫn còn trong tuần Tết. Năm nay Valentine và Tết gần như chồng lên nhau, nên nhiều cặp sẽ phải cân giữa lịch nhà và lịch đôi.',
  },
  {
    q: 'Xem hợp tuổi có phải là bói không?',
    a: 'Phần tính thì không. Hợp tuổi dựa trên can-chi, ngũ hành và cung mệnh — đều là phép tính xác định từ năm sinh, ai tính cũng ra kết quả như nhau. Phần luận giải mới là diễn giải, và nó chỉ nên đọc như mô tả xu hướng: hai người dễ thuận ở điểm nào, dễ va ở điểm nào. Không có con số nào quyết định được một mối quan hệ.',
  },
  {
    q: 'Kết quả nói "khắc" thì có nên chia tay không?',
    a: 'Không. Đây là chỗ nhiều trang bói làm sai và làm hại người đọc. "Khắc" trong ngũ hành mô tả hai kiểu năng lượng dễ va nhau, không phải bản án cho một mối quan hệ. Rất nhiều cặp "khắc" sống với nhau êm đẹp vì họ hiểu điểm va của mình. hieu.asia nói rõ chỗ lệch để hai bạn biết mà tránh, không để doạ.',
  },
  {
    q: 'Cung Phu Thê trên lá số cho biết gì?',
    a: 'Cung Phu Thê mô tả thiên hướng của bạn trong chuyện đôi lứa: hợp với kiểu người thế nào, dễ vướng ở đâu, giai đoạn nào chuyện tình cảm nổi lên rõ hơn. Nó nói về bạn, không phải về một người cụ thể nào đang ở ngoài kia.',
  },
  {
    q: 'Tặng quà Valentine trong tuần Tết có kiêng gì không?',
    a: 'Dân gian có vài kiêng vặt đầu năm như tránh tặng đồ sắc nhọn hay đồng hồ. Đây là phong tục vùng miền, mức độ tin tuỳ mỗi nhà. Điều đáng quan tâm hơn là bạn có mặt đúng lúc người kia cần hay không — cái đó không tờ lịch nào tính hộ được.',
  },
];

const JSONLD = [
  article({
    headline: 'Valentine 2027: xem hợp đôi theo lá số, không đoán mò',
    description:
      'Valentine 2027 rơi vào Chủ Nhật 14/2, mùng 9 tháng Giêng Đinh Mùi. Cách xem hợp tuổi theo can-chi và cung Phu Thê, có giải thích căn cứ.',
    url: '/valentine-2027',
    type: 'Article',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Valentine 2027', url: '/valentine-2027' },
  ]),
  faqPage(HUB_FAQS),
];

export default function Valentine2027Page() {
  // S10 mùa vụ: hết mùa 2027 → 308 về evergreen (Next tự dựng redirect lúc build).
  const evergreen = expiredSeasonalTarget('/valentine-2027');
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
            <span className="text-muted-foreground">Valentine 2027</span>
          </nav>
          <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold-700">
            Dịp tình duyên · xem bằng lá số
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Valentine 2027: xem hợp đôi cho có cơ sở
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/80 sm:text-lg">
            Valentine 2027 rơi vào <strong className="text-foreground">Chủ Nhật 14/2</strong>,
            nhằm <strong className="text-foreground">mùng 9 tháng Giêng Đinh Mùi</strong> — vẫn
            trong tuần Tết. Nếu bạn định xem chuyện hợp – khắc dịp này, trang này chỉ cho bạn
            cách xem dựa trên can-chi và lá số thật, có giải thích từng bước, thay vì một con số
            phần trăm từ trên trời rơi xuống.
          </p>
        </section>

        {/* Mốc ngày */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Valentine 2027 và Tết Đinh Mùi
          </h2>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-3 text-muted-foreground">Mùng 1 Tết Đinh Mùi</td>
                  <td className="px-4 py-3 font-medium text-foreground">Thứ Bảy, 6/2/2027</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-muted-foreground">Valentine — mùng 9 tháng Giêng</td>
                  <td className="px-4 py-3 font-medium text-foreground">Chủ Nhật, 14/2/2027</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Hai lịch chồng nhau nên dễ kẹt lịch nhà. Cần tra ngày âm và giờ hoàng đạo quanh dịp
            này?{' '}
            <Link href="/lich-van-nien" className="text-gold hover:underline">
              Lịch vạn niên
            </Link>{' '}
            tra được từng ngày.
          </p>
        </section>

        {/* Hợp tuổi nghĩa là gì */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            "Hợp tuổi" thật ra đang tính cái gì
          </h2>
          <p className="leading-relaxed text-foreground/85">
            Phần lớn kết quả hợp tuổi bạn thấy trên mạng đến từ ba lớp đối chiếu, và cả ba đều
            tính được minh bạch từ năm sinh:
          </p>
          <ul className="mt-3 ml-5 list-disc space-y-2 text-foreground/85">
            <li>
              <strong className="text-foreground">Địa chi</strong> — 12 con giáp xếp thành các
              nhóm tam hợp, lục hợp, và các cặp xung, hại. Đây là lớp mà ai cũng nghe: "tuổi này
              xung tuổi kia".
            </li>
            <li>
              <strong className="text-foreground">Ngũ hành nạp âm</strong> — mỗi năm sinh ứng với
              một hành; hai hành có thể tương sinh, tương khắc hoặc trung tính.
            </li>
            <li>
              <strong className="text-foreground">Cung mệnh (Bát trạch)</strong> — chia Đông tứ
              mệnh và Tây tứ mệnh, thường dùng khi xét chuyện nhà cửa và chung sống.
            </li>
          </ul>
          <p className="mt-4 leading-relaxed text-foreground/85">
            Một trang tử tế phải cho bạn thấy <strong className="text-foreground">từng lớp trên
            ra kết quả gì</strong>, chứ không gộp thành một con số "hợp 87%" rồi thôi. Con số gộp
            nghe cho sướng nhưng không kiểm chứng được, và đó chính là kiểu bói chung chung mà
            hieu.asia không làm.
          </p>
        </section>

        {/* Góc nhìn thương hiệu */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <div className="rounded-card-editorial border border-gold/20 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
              "Khắc" không phải là bản án
            </h2>
            <p className="mt-4 leading-relaxed text-foreground/85">
              Đây là chỗ nhiều trang xem tuổi làm hại người đọc nhiều nhất: phán một chữ "đại kỵ"
              rồi để đó, mặc người ta lo. Trong ngũ hành, khắc chỉ mô tả hai kiểu năng lượng dễ va
              nhau — nó nói về điểm cần chú ý, không nói về kết cục.
            </p>
            <p className="mt-4 leading-relaxed text-foreground/85">
              Chúng tôi nói rõ chỗ lệch để hai bạn biết mà tránh, và cũng nói thẳng khi dữ kiện
              chưa đủ để kết luận. Không có chuyện một bảng tra tuổi quyết định được ai nên ở với
              ai. Cái quyết định là hai người có chịu hiểu nhau hay không.
            </p>
          </div>
        </section>

        {/* Công cụ */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Xem gì trong dịp Valentine
          </h2>
          <ul className="mt-3 ml-5 list-disc space-y-2 text-foreground/85">
            <li>
              <Link href="/hop-tuoi" className="text-gold hover:underline">Xem hợp tuổi hai người</Link>{' '}
              — đối chiếu địa chi, ngũ hành và cung mệnh, kèm giải thích vì sao hợp hay lệch ở
              từng lớp. Miễn phí, không cần tài khoản.
            </li>
            <li>
              <Link href="/tarot" className="text-gold hover:underline">Trải bài Tarot tình yêu</Link>{' '}
              — dùng để tự đặt câu hỏi về mối quan hệ đang có, không phải để phán kết cục.
            </li>
            <li>
              <Link href="/la-so-tu-vi" className="text-gold hover:underline">Lập lá số Tử Vi miễn phí</Link>{' '}
              — xem cung Phu Thê của riêng bạn có sao nào, thay vì đọc chung cho cả con giáp.
            </li>
            <li>
              <Link href="/xem-ngay" className="text-gold hover:underline">Xem ngày tốt theo việc</Link>{' '}
              — nếu dịp này bạn định cầu hôn hoặc chốt ngày cưới, chọn ngày theo can-chi và tuổi
              hai bên.
            </li>
          </ul>
        </section>

        {/* Lead capture theo mùa */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <OccasionLeadCapture
            source="valentine-2027"
            capturedEvent="lead_capture_valentine"
            blurb="Để lại email, chúng tôi nhắc bạn các mốc theo mùa: Tết và sao hạn đầu năm, ngày tốt theo việc, các dịp tình duyên. Thi thoảng thôi, không spam."
            cta="Nhận nhắc theo mùa"
          />
        </section>

        {/* FAQ */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Câu hỏi thường gặp về Valentine 2027
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
              Xem hợp đôi có giải thích, không phải một con số
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              Nhập năm sinh hai người, xem từng lớp đối chiếu ra kết quả gì. Miễn phí, không cần
              thẻ, không cần tài khoản.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/hop-tuoi">Xem hợp tuổi miễn phí</Link>
              </Button>
              <Link
                href="/la-so-tu-vi"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
              >
                Lập lá số Tử Vi của bạn <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <StickyMobileCta trackId="valentine-2027" />
    </>
  );
}
