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

export const metadata: Metadata = {
  title: 'Tháng cô hồn 2026 — lịch âm & cách nhìn',
  description:
    'Tháng cô hồn 2026 (tháng 7 âm lịch): từ 13/8 đến 11/9, Rằm Vu Lan 27/8. Nguồn gốc, điều thường kiêng và góc nhìn không mê tín — hiểu để chủ động.',
  alternates: { canonical: 'https://hieu.asia/thang-co-hon-2026' },
  openGraph: {
    title: 'Tháng cô hồn 2026 — tháng nào, kiêng gì, nên hiểu thế nào',
    description:
      'Tháng 7 âm lịch 2026: 13/8–11/9 dương lịch, Vu Lan 27/8. Phân biệt rõ tín ngưỡng và dữ kiện — không phán định mệnh.',
    url: 'https://hieu.asia/thang-co-hon-2026',
    type: 'article',
    locale: 'vi_VN',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'hieu.asia — Tháng cô hồn 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tháng cô hồn 2026 — tháng nào, kiêng gì, hiểu thế nào',
    description: 'Tháng 7 âm lịch 2026 (13/8–11/9), Vu Lan 27/8. Hiểu để chủ động, không phải để sợ.',
    images: [{ url: '/og-image.jpg', alt: 'hieu.asia — Tháng cô hồn 2026' }],
  },
};

const HUB_FAQS = [
  {
    q: 'Tháng cô hồn 2026 là tháng nào, từ ngày nào đến ngày nào?',
    a: 'Tháng cô hồn là cách gọi dân gian của tháng 7 âm lịch. Năm 2026, mùng 1 tháng 7 âm rơi vào thứ Năm 13/8/2026 dương lịch; tháng này đủ 30 ngày nên kéo dài đến khoảng 11/9/2026. Rằm tháng 7 — lễ Vu Lan — là ngày 27/8/2026.',
  },
  {
    q: 'Lễ Vu Lan 2026 vào ngày nào dương lịch?',
    a: 'Lễ Vu Lan (Rằm tháng 7 âm lịch) năm 2026 rơi vào thứ Năm, ngày 27/8/2026 dương lịch. Đây là dịp báo hiếu cha mẹ, tưởng nhớ tổ tiên — phần ý nghĩa nhất của mùa này.',
  },
  {
    q: 'Tháng cô hồn có nên cưới hỏi, khai trương, mua nhà không?',
    a: 'Theo quan niệm dân gian, nhiều người tránh việc trọng đại trong tháng 7 âm. Nhưng đây là phong tục, không phải quy luật bắt buộc. Nếu bạn cần làm, hãy chọn ngày–giờ hợp tuổi dựa trên lịch can-chi minh bạch thay vì kiêng cữ cả tháng vì lo lắng. Không có cơ sở nào cho thấy tháng 7 âm tự nó làm hỏng một việc đã chuẩn bị kỹ.',
  },
  {
    q: 'Tháng cô hồn có "xui" thật không?',
    a: 'Đó là một quan niệm văn hóa, không phải định mệnh giáng xuống ai. hieu.asia không phán mệnh — chúng tôi nói rõ đâu là tín ngưỡng dân gian, đâu là dữ kiện. Điều đáng giữ của tháng này là tinh thần cẩn trọng, sống chậm lại và lòng hiếu thảo, chứ không phải nỗi sợ.',
  },
];

const JSONLD = [
  article({
    headline: 'Tháng cô hồn 2026 là tháng nào? Lịch âm, ý nghĩa và cách nhìn bình tĩnh',
    description:
      'Tháng cô hồn 2026 (tháng 7 âm lịch): 13/8–11/9 dương lịch, Vu Lan 27/8. Nguồn gốc, điều dân gian thường kiêng, và góc nhìn không mê tín.',
    url: '/thang-co-hon-2026',
    type: 'Article',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Tháng cô hồn 2026', url: '/thang-co-hon-2026' },
  ]),
  faqPage(HUB_FAQS),
];

export default function ThangCoHon2026Page() {
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
            <span className="text-muted-foreground">Tháng cô hồn 2026</span>
          </nav>
          <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold-700">
            Lịch âm · góc nhìn không mê tín
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Tháng cô hồn 2026 là tháng nào?
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/80 sm:text-lg">
            "Tháng cô hồn" là cách gọi dân gian của tháng 7 âm lịch. Năm 2026, tháng này
            bắt đầu từ <strong className="text-foreground">13/8</strong> và kéo dài tới khoảng{' '}
            <strong className="text-foreground">11/9</strong> (dương lịch), với Rằm tháng 7 —
            lễ Vu Lan — vào <strong className="text-foreground">27/8/2026</strong>. Trang này
            nói thẳng một điều: tháng cô hồn là một nét văn hóa, không phải một bản án. Bạn nên
            biết để ứng xử có hiểu biết, chứ không phải để sợ.
          </p>
        </section>

        {/* Mốc ngày */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Tháng cô hồn 2026 rơi vào ngày nào?
          </h2>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-3 text-muted-foreground">Mùng 1 tháng 7 âm</td>
                  <td className="px-4 py-3 font-medium text-foreground">Thứ Năm, 13/8/2026</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-muted-foreground">Rằm tháng 7 — lễ Vu Lan</td>
                  <td className="px-4 py-3 font-medium text-foreground">Thứ Năm, 27/8/2026</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-muted-foreground">Cuối tháng 7 âm (tháng đủ 30 ngày)</td>
                  <td className="px-4 py-3 font-medium text-foreground">Khoảng 11/9/2026</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Cần tra một ngày âm – dương bất kỳ trong tháng?{' '}
            <Link href="/lich-van-nien" className="text-gold hover:underline">
              Lịch vạn niên 2026
            </Link>{' '}
            cho bạn ngày âm, can-chi và giờ hoàng đạo từng ngày.
          </p>
        </section>

        {/* Nguồn gốc */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Tháng cô hồn từ đâu mà có?
          </h2>
          <p className="leading-relaxed text-foreground/85">
            Trong tháng 7 âm lịch có hai mạch ý nghĩa chồng lên nhau, đến từ hai truyền thống khác nhau.
          </p>
          <p className="mt-4 leading-relaxed text-foreground/85">
            <strong className="text-foreground">Lễ Vu Lan (Phật giáo)</strong> gắn với tích Mục Kiền Liên
            cứu mẹ khỏi cảnh đói khổ. Đây là dịp nhắc về lòng hiếu thảo: báo hiếu cha mẹ khi còn sống và
            tưởng nhớ tổ tiên đã khuất. Phần lớn người Việt giữ tháng này như một mùa của sự biết ơn.
          </p>
          <p className="mt-4 leading-relaxed text-foreground/85">
            <strong className="text-foreground">Tục cúng cô hồn (tín ngưỡng dân gian)</strong> xuất phát
            từ quan niệm rằng tháng 7 là lúc "mở cửa ngục", các vong linh không nơi nương tựa được về
            dương gian. Vì vậy nhiều gia đình cúng thí thực, làm việc thiện để chia sẻ và cầu bình an.
            Đây là một quan niệm văn hóa — chúng tôi trình bày để bạn hiểu, không khẳng định đúng sai.
          </p>
        </section>

        {/* Kiêng gì */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Dân gian thường kiêng gì trong tháng cô hồn?
          </h2>
          <p className="leading-relaxed text-foreground/85">
            Những điều dưới đây là <strong className="text-foreground">quan niệm dân gian</strong>, mức độ
            tin và làm theo tùy mỗi người. Liệt kê ở đây để bạn nắm, không phải để hù dọa:
          </p>
          <ul className="mt-3 ml-5 list-disc space-y-1.5 text-foreground/85">
            <li>Hạn chế việc trọng đại: cưới hỏi, khởi công xây nhà, mua xe, ký kết lớn.</li>
            <li>Tránh khai trương, mở hàng đầu tháng nếu chưa chọn được ngày ưng ý.</li>
            <li>Một số kiêng vặt theo vùng miền: phơi quần áo ban đêm, nhặt tiền rơi, đi khuya một mình.</li>
            <li>Giữ lời ăn tiếng nói nhẹ nhàng, tránh xích mích — phần này thì lúc nào cũng nên.</li>
          </ul>
        </section>

        {/* Góc nhìn thương hiệu */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <div className="rounded-card-editorial border border-gold/20 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
              Góc nhìn hieu.asia: hiểu để chủ động, không phải để sợ
            </h2>
            <p className="mt-4 leading-relaxed text-foreground/85">
              Tháng cô hồn không phải điềm xấu cố định giáng xuống đầu ai. Nó là một quy ước văn hóa,
              nhắc người ta sống chậm lại, cẩn trọng hơn và nhớ tới người đã khuất. Bản thân khoảng
              thời gian này không có "quyền lực" làm hỏng việc của bạn.
            </p>
            <p className="mt-4 leading-relaxed text-foreground/85">
              Một việc đã chuẩn bị kỹ và đúng thời điểm của bạn thì tháng 7 âm lịch không tự nó làm
              hỏng. Ngược lại, làm liều vào "tháng đẹp" cũng chẳng an toàn hơn. Cái quyết định kết quả
              là sự chuẩn bị và lựa chọn của bạn — không phải tờ lịch.
            </p>
            <p className="mt-4 leading-relaxed text-foreground/85">
              Điều đáng giữ nhất của mùa này là tinh thần Vu Lan: báo hiếu cha mẹ, tưởng nhớ tổ tiên,
              làm vài việc tử tế. Đó mới là phần "thiêng" thật sự — và nó không nằm ở chuyện kiêng cữ.
            </p>
          </div>
        </section>

        {/* Chọn ngày có cơ sở */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Vẫn cần làm việc lớn trong tháng 7 âm? Chọn ngày có cơ sở
          </h2>
          <p className="leading-relaxed text-foreground/85">
            Nếu công việc không dời được, đừng kiêng cả tháng trong lo lắng mơ hồ. Cách bình tĩnh hơn là
            chọn ngày – giờ hợp tuổi dựa trên lịch can-chi, minh bạch và kiểm chứng được:
          </p>
          <ul className="mt-3 ml-5 list-disc space-y-1.5 text-foreground/85">
            <li>
              <Link href="/xem-ngay" className="text-gold hover:underline">Xem ngày tốt theo việc</Link>{' '}
              — chọn ngày cưới hỏi, khai trương, động thổ… theo can-chi và tuổi.
            </li>
            <li>
              <Link href="/lich-van-nien" className="text-gold hover:underline">Lịch vạn niên 2026</Link>{' '}
              — tra ngày âm, giờ hoàng đạo, ngày hắc đạo từng ngày.
            </li>
            <li>
              <Link href="/khai-truong" className="text-gold hover:underline">Xem ngày khai trương</Link>{' '}
              và{' '}
              <Link href="/xem-tuoi-lam-nha" className="text-gold hover:underline">xem tuổi làm nhà</Link>{' '}
              — gợi ý mốc thời gian hợp tuổi gia chủ.
            </li>
          </ul>
        </section>

        {/* Lead capture theo mùa */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <OccasionLeadCapture
            source="thang-co-hon-2026"
            capturedEvent="lead_capture_thang_co_hon"
            blurb="Để lại email, chúng tôi nhắc bạn các mốc theo mùa: ngày tốt theo việc, Rằm tháng 7, Tết và sao hạn đầu năm. Thi thoảng thôi, không spam."
            cta="Nhận nhắc theo mùa"
          />
        </section>

        {/* FAQ */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Câu hỏi thường gặp về tháng cô hồn 2026
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
              Hiểu chính mình, rồi tự quyết — không bói mù
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              hieu.asia dùng engine tính theo can-chi và lá số thật để đưa ra tham khảo có cơ sở, rồi
              để bạn quyết định. Lập lá số miễn phí trong 2 phút — không cần tài khoản, không cần thẻ.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/onboarding?intent=thang-co-hon">Lập lá số miễn phí</Link>
              </Button>
              <Link
                href="/tu-vi-hom-nay"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
              >
                Xem Tử Vi hôm nay <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <StickyMobileCta trackId="thang-co-hon-2026" />
    </>
  );
}
