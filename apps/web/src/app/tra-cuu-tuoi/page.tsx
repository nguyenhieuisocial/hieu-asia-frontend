import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, faqPage, type FaqItem } from '@/lib/seo/jsonld';
import { TraCuuTuoi } from './TraCuuTuoi';

const TITLE = 'Tra cứu tuổi trọn đời: Can Chi, mệnh, hướng, sao hạn';
const DESCRIPTION =
  'Nhập năm sinh + giới tính, xem ngay mọi lát cắt của tuổi: Can Chi, nạp âm, mệnh ngũ hành, Kim Lâu, Tam Tai, Hoang Ốc, hướng nhà theo cung phi, sao hạn năm nay, con giáp, màu & nghề hợp. Phong tục dân gian tính minh bạch để tham khảo.';
const URL = 'https://hieu.asia/tra-cuu-tuoi';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    type: 'website',
    locale: 'vi_VN',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: '/og-image.jpg', alt: TITLE }],
  },
};

// Giải nghĩa các thuật ngữ hiện trong kết quả — giọng tham khảo, không phán.
const TERMS: { term: string; body: string }[] = [
  {
    term: 'Can Chi & nạp âm',
    body: 'Can Chi là tên năm âm lịch ghép từ 10 Thiên Can và 12 Địa Chi (ví dụ Canh Ngọ). Nạp âm là "mệnh" của năm theo vòng 60 Giáp Tý, gắn với một trong năm hành Kim – Mộc – Thủy – Hỏa – Thổ.',
  },
  {
    term: 'Kim Lâu — phạm thì sao?',
    body: 'Tính theo tuổi mụ chia 9: dư 1/3/6/8 được coi là phạm (Kim Lâu Thân/Thê/Tử/Lục Súc), thường xét khi cưới hỏi hoặc làm nhà. Phạm nghĩa là năm đó kém thuận cho hai việc lớn này — chỉ là điểm cần lưu ý, không phải điềm xấu. Nếu không gấp, dân gian hoãn sang năm không phạm, hoặc theo tục mượn tuổi người hợp đứng ra lo việc. Tham khảo, quyết định là ở bạn.',
  },
  {
    term: 'Tam Tai — phạm thì sao?',
    body: 'Mỗi nhóm ba con giáp (tam hợp) gặp Tam Tai vào ba năm liền nhau cố định. Phạm Tam Tai nghĩa là đang trong ba năm đó — giai đoạn nên cẩn trọng hơn, không phải điềm dữ. Nhiều người giữ ổn định, tránh khởi sự quá lớn (xây nhà, cưới hỏi, mở kinh doanh) trong ba năm này hoặc chọn thời điểm hợp lý hơn. Tham khảo.',
  },
  {
    term: 'Hoang Ốc — phạm thì sao?',
    body: 'Tính theo tuổi mụ chia 6, đếm vòng sáu cung. Ba cung Tam Địa Sát, Ngũ Thọ Tử, Lục Hoang Ốc được coi là phạm, dân gian kiêng khi khởi công xây nhà. Nếu năm nay phạm mà vẫn muốn làm, thường hoãn sang năm đẹp hơn, hoặc mượn tuổi người không phạm đứng ra động thổ. Tham khảo, không bắt buộc.',
  },
  {
    term: 'Cung phi & hướng nhà',
    body: 'Từ năm sinh và giới tính suy ra cung phi (mệnh quái), thuộc Đông tứ mệnh hoặc Tây tứ mệnh. Theo Bát Trạch, mỗi cung hợp bốn hướng tốt và tránh bốn hướng xấu. Nên ưu tiên đặt cửa, bàn làm việc, giường ngủ theo hướng tốt của cung phi — đây là gợi ý để tham khảo, không phải quy tắc cứng.',
  },
  {
    term: 'Sao hạn — gặp sao xấu thì sao?',
    body: 'Cửu Diệu niên hạn — mỗi năm một sao chiếu mệnh theo tuổi mụ và giới tính. Có sao tốt, sao trung tính, sao cần thận trọng. Gặp sao xấu, dân gian giữ gìn sức khoẻ – tài chính và có tục dâng sao giải hạn đầu năm; đây là phong tục để tham khảo, không phải lời tiên tri.',
  },
];

const FAQS: FaqItem[] = [
  {
    q: 'Tra cứu tuổi trọn đời là gì?',
    a: 'Là công cụ gom mọi lát cắt phong tục của một tuổi vào một chỗ: chỉ cần nhập năm sinh và giới tính, bạn thấy ngay Can Chi, nạp âm, mệnh ngũ hành, các hạn theo năm hiện tại (Kim Lâu, Tam Tai, xung năm, Hoang Ốc, sao hạn), hướng nhà theo cung phi, đặc điểm con giáp và màu – nghề hợp mệnh. Mọi con số đều được tính minh bạch, không bịa.',
  },
  {
    q: 'Các thông tin này có quyết định số phận không?',
    a: 'Không. Đây là tri thức phong tục dân gian dùng để tham khảo và hiểu mình. Chúng tôi tính minh bạch từng bước để bạn biết rõ vì sao "phạm" hay "không phạm" một điều gì đó, thay vì nghe phán mơ hồ. Tính cách và tương lai của bạn do chính bạn quyết định.',
  },
  {
    q: 'Vì sao kết quả tính theo năm âm lịch?',
    a: 'Tuổi và mệnh theo quy ước dân gian đổi vào Tết Nguyên đán. Nếu bạn sinh trong tháng 1 hoặc đầu tháng 2 dương lịch (trước Tết), rất có thể bạn vẫn thuộc tuổi của năm liền trước — hãy đối chiếu ngày Tết của năm sinh để chắc chắn.',
  },
  {
    q: 'Các hạn theo năm được tính cho năm nào?',
    a: 'Mục "Năm nay với tuổi này" luôn tính theo năm dương lịch hiện tại. Muốn xét cho một việc và một năm cụ thể (cưới, làm nhà, khai trương…), hãy mở các trang chuyên sâu được liên kết trong phần kết quả.',
  },
  {
    q: 'Công cụ có lưu dữ liệu của tôi không?',
    a: 'Không. Toàn bộ phép tính chạy ngay trong trình duyệt của bạn, không gửi lên máy chủ, không lưu và không chia sẻ.',
  },
];

export default async function TraCuuTuoiPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; gender?: string }>;
}) {
  const sp = await searchParams;
  const initialYear = typeof sp.year === 'string' ? sp.year : undefined;
  const initialGender: 'nam' | 'nu' | undefined =
    sp.gender === 'nu' ? 'nu' : sp.gender === 'nam' ? 'nam' : undefined;
  const JSONLD = [
    breadcrumb([
      { name: 'Trang chủ', url: '/' },
      { name: 'Tra cứu tuổi trọn đời', url: '/tra-cuu-tuoi' },
    ]),
    faqPage(FAQS),
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <JsonLd data={JSONLD} />

      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-ink-radial opacity-80"
        />

        {/* Hero + công cụ */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10 pt-6 sm:pt-8">
          <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
            Tra cứu tuổi · một chỗ · miễn phí
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Tra cứu tuổi trọn đời
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/80 sm:text-lg">
            Nhập năm sinh và giới tính — xem ngay Can Chi, nạp âm, mệnh ngũ hành, các hạn theo năm nay
            (Kim Lâu, Tam Tai, Hoang Ốc, sao hạn), hướng nhà theo cung phi, con giáp và màu – nghề hợp
            mệnh. Tất cả tính minh bạch trong trình duyệt để <strong className="text-foreground">tham khảo</strong>
            , không phán, không bói.
          </p>

          <div className="mt-7">
            <TraCuuTuoi initialYear={initialYear} initialGender={initialGender} />
          </div>
        </section>

        {/* Giải nghĩa các thuật ngữ */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Các thuật ngữ trong kết quả nghĩa là gì?
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {TERMS.map((t) => (
              <div key={t.term} className="rounded-lg border border-border bg-card/40 p-4">
                <p className="mb-1 font-heading text-base font-semibold text-foreground">{t.term}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{t.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground/90">Lưu ý:</strong> tuổi và mệnh tính theo năm âm lịch (đổi
            vào Tết). Người sinh tháng 1 hoặc đầu tháng 2 dương lịch có thể vẫn thuộc tuổi của năm liền
            trước — hãy đối chiếu ngày Tết của năm sinh để chắc chắn.
          </p>
        </section>

        {/* FAQ */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Câu hỏi thường gặp
          </h2>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <div key={f.q} className="rounded-lg border border-border bg-card/40 p-4">
                <p className="mb-1.5 font-heading text-base font-semibold text-foreground">{f.q}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            Muốn hiểu sâu hơn về chính mình từ giờ – ngày – tháng – năm sinh, hãy lập{' '}
            <Link href="/la-so-bat-tu" className="text-gold hover:underline">
              lá số Bát Tự
            </Link>{' '}
            hoặc{' '}
            <Link href="/la-so-tu-vi" className="text-gold hover:underline">
              lá số Tử Vi
            </Link>{' '}
            đầy đủ — miễn phí.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
