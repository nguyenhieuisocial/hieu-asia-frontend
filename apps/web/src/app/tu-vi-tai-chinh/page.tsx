import type { Metadata } from 'next';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { Wallet, PiggyBank, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, faqPage } from '@/lib/seo/jsonld';

export const metadata: Metadata = {
  title: 'Tử Vi tài chính: kiếm tiền, quản lý, rủi ro',
  description:
    'Tử Vi tài chính — đọc cung Tài Bạch, Điền Trạch + đại vận để hiểu khuynh hướng kiếm tiền và quản lý tài chính cá nhân. KHÔNG phải tư vấn đầu tư.',
  alternates: { canonical: 'https://hieu.asia/tu-vi-tai-chinh' },
  // Wave 60.96.2 — route-level openGraph REPLACES root-layout openGraph; must
  // re-declare `images` or social preview cards render blank.
  openGraph: {
    title: 'Tử Vi tài chính',
    description: 'Tài Bạch + Điền Trạch — khuynh hướng tài chính cá nhân.',
    url: 'https://hieu.asia/tu-vi-tai-chinh',
    type: 'article',
    locale: 'vi_VN',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'hieu.asia — Tử Vi tài chính: Tài Bạch + Điền Trạch',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tử Vi tài chính',
    description: 'Tài Bạch + Điền Trạch — khuynh hướng tài chính cá nhân.',
    images: [
      {
        url: '/og-image.jpg',
        alt: 'hieu.asia — Tử Vi tài chính',
      },
    ],
  },
};

const PATTERNS = [
  {
    icon: PiggyBank,
    title: 'Tích luỹ ổn định, ít rủi ro',
    body: 'Tài Bạch có Thiên Phủ/Thái Âm — khuynh hướng tiết kiệm tự nhiên. Hợp tích luỹ qua chuyên môn + bất động sản. Tránh "lướt sóng".',
    strengths: [
      'Tiết kiệm tự nhiên, ít chi tiêu bốc đồng.',
      'Hợp tích sản dài hạn: chuyên môn sâu, quỹ định kỳ, nhà để ở.',
    ],
    watchOut:
      'Quá an toàn → tiền nằm im mất giá vì lạm phát; né mọi quyết định vì sợ sai nên bỏ lỡ cả cơ hội học quản lý tiền.',
    selfCheck: 'Tôi đang thận trọng có tính toán, hay chỉ đang né mọi quyết định?',
  },
  {
    icon: TrendingUp,
    title: 'Quyết liệt, có hệ thống',
    body: 'Tài Bạch có Vũ Khúc — kỷ luật tài chính cao. Hợp ngành tài chính, kế toán, kỹ sư. Cẩn trọng "cứng nhắc" trong quyết định đầu tư.',
    strengths: [
      'Kỷ luật ngân sách cao, theo dõi dòng tiền sát.',
      'Ra quyết định dựa trên số liệu thay vì cảm xúc.',
    ],
    watchOut:
      'Bám kế hoạch cũ khi hoàn cảnh đã đổi; khắt khe chuyện tiền tới mức làm căng các mối quan hệ thân thiết.',
    selfCheck:
      'Kế hoạch này còn đúng với hoàn cảnh hiện tại không, hay tôi giữ nó chỉ vì đã lỡ cam kết?',
  },
  {
    icon: Wallet,
    title: 'Đa nguồn thu nhập, biến động',
    body: 'Tài Bạch có Tham Lang/Phá Quân — thu nhập đa nguồn, có lên có xuống. Hợp người làm freelance, kinh doanh, sáng tạo. Bắt buộc có emergency fund.',
    strengths: [
      'Nhạy cơ hội, tạo được nhiều nguồn thu.',
      'Thu nhập có thể bứt tốc khi gặp đúng sóng.',
    ],
    watchOut:
      'Thu nhập lên xuống nhưng chi tiêu chỉ đi lên; thiếu quỹ dự phòng nên một cú hụt thu là vỡ cả kế hoạch.',
    selfCheck: 'Nếu 3 tháng tới không có đồng nào về, tôi sống bằng gì?',
  },
  {
    icon: AlertTriangle,
    title: 'Tài Bạch có Hoá Kỵ/sát tinh',
    body: 'Không nghĩa là "đời mạt vận tài chính". Là tín hiệu cần kỷ luật quản lý dòng tiền cao hơn người khác — và TUYỆT ĐỐI tránh dùng đòn bẩy (vay nợ) cao.',
    strengths: [
      'Khi đã có kỷ luật, đây thường là người quản trị rủi ro tốt nhất — vì quen cảnh giác.',
      'Học tài chính cá nhân nghiêm túc thường thấy chuyển biến rõ nhất ở nhóm này.',
    ],
    watchOut:
      'Vay đòn bẩy cao, đầu tư theo đám đông, hoặc giao người khác quyết thay chuyện tiền của mình.',
    selfCheck: 'Khoản này nếu mất trắng, tôi có còn ngủ được không?',
  },
];

const HOW_TO_READ = [
  {
    step: 'Cung Tài Bạch + chính tinh',
    body: 'Cho biết CÁCH tiền về với bạn và cách bạn quản nó — không phải con số tài sản. 4 khuôn mẫu ở trên là những tổ hợp thường gặp.',
  },
  {
    step: 'Nhìn kèm Điền Trạch + Phúc Đức',
    body: 'Điền Trạch nói về tích sản (nhà đất, của để dành), Phúc Đức nói về quan niệm hưởng thụ — đọc cùng nhau mới ra bức tranh tiền bạc đầy đủ.',
  },
  {
    step: 'Đại vận + lưu niên để chọn nhịp',
    body: 'Giai đoạn nên tích luỹ phòng thủ và giai đoạn có thể mở rộng là khác nhau. Lưu ý: đây là nhịp chiến lược cá nhân, không phải tín hiệu "năm trúng lớn".',
  },
];

const FAQ = [
  {
    q: 'Cung Tài Bạch là gì?',
    a: 'Tài Bạch là cung trong lá số Tử Vi mô tả cách bạn kiếm tiền và quản lý tiền: khuynh hướng tích luỹ hay mạo hiểm, kỷ luật hay tuỳ hứng. Nó phản ánh CÁCH vận hành với tiền, không phải con số tài sản bạn sẽ có.',
  },
  {
    q: 'Tử Vi có đoán được bao giờ tôi giàu không?',
    a: 'Không. Lá số cho biết khuynh hướng quản lý tiền và nhịp giai đoạn, không cho biết số tài sản hay thời điểm "phát tài". Bất kỳ ai hứa đoán được điều đó đều đang bán ảo vọng — của cải thực tế đến từ thu nhập, kỷ luật chi tiêu và thời gian.',
  },
  {
    q: 'Tài Bạch có Hoá Kỵ là "mạt vận tài chính"?',
    a: 'Không. Đó là tín hiệu nên giữ kỷ luật dòng tiền cao hơn trung bình và tránh đòn bẩy — không phải bản án. Thực tế nhiều người nhóm này trở thành người quản trị rủi ro giỏi nhất sau khi học tài chính cá nhân nghiêm túc.',
  },
  {
    q: 'hieu.asia có khuyên tôi mua cổ phiếu, coin hay đất không?',
    a: 'Không bao giờ. hieu.asia không phải nền tảng tư vấn đầu tư và không đưa khuyến nghị mua/bán bất kỳ tài sản nào. Mọi nội dung ở đây là góc nhìn về khuynh hướng cá nhân; quyết định đầu tư cần người tư vấn có chứng chỉ và hiểu biết thị trường thực tế.',
  },
  {
    q: 'Muốn xem tài chính năm nay thì xem thế nào?',
    a: 'Xem đại vận và lưu niên chiếu cung Tài Bạch để biết giai đoạn này nên tích luỹ phòng thủ hay có thể mở rộng. Với một quyết định tiền bạc cụ thể (đổi việc lương thấp hơn, mua nhà, học tiếp…), dùng công cụ Quyết định để AI phân tích kèm bối cảnh thật của bạn.',
  },
];

const REMINDERS = [
  'hieu.asia KHÔNG đưa ra tư vấn đầu tư cụ thể (mua cổ phiếu nào, lúc nào, bao nhiêu).',
  'Tử Vi cho biết KHUYNH HƯỚNG quản lý tiền, không cho biết RỦI RO THỊ TRƯỜNG.',
  'Quyết định đầu tư cần tham vấn người có chứng chỉ + cập nhật thị trường thực tế.',
  'Tài Bạch tốt không đảm bảo giàu; Tài Bạch yếu không đảm bảo nghèo — kỷ luật mới là yếu tố quyết định.',
];

const JSONLD = [
  article({
    headline: 'Tử Vi tài chính — Tài Bạch + Điền Trạch + đại vận',
    description:
      'Tử Vi tài chính — đọc cung Tài Bạch, Điền Trạch + đại vận để hiểu khuynh hướng kiếm tiền và quản lý tài chính cá nhân.',
    url: '/tu-vi-tai-chinh',
    image: '/og-image.jpg',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Tử Vi tài chính', url: '/tu-vi-tai-chinh' },
  ]),
  faqPage(FAQ),
];

export default function TuViTaiChinhPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <JsonLd data={JSONLD} />

      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-ink-radial opacity-80"
        />

        <section className="relative mx-auto max-w-3xl px-6 pb-12 pt-6 sm:pt-8">
          <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
            Tử Vi · Tài chính & dòng tiền cá nhân
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Tử Vi tài chính — bạn quản lý tiền kiểu nào?
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/80 sm:text-lg">
            Cung Tài Bạch phản ánh CÁCH BẠN KIẾM và QUẢN LÝ tiền — không phải con số tài
            sản. Hiểu khuynh hướng giúp bạn chọn chiến lược tài chính hợp tính cách
            mình, thay vì sao chép chiến lược của người khác.
          </p>
          <Card className="mt-6 border-amber-700/40 bg-amber-900/10">
            <CardContent className="flex items-start gap-3 pt-5 text-sm leading-relaxed text-amber-100/90">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden />
              <p>
                <strong className="text-amber-100">Disclaimer rõ:</strong> hieu.asia KHÔNG
                phải nền tảng tư vấn đầu tư. Mọi nội dung dưới đây là góc nhìn khuynh
                hướng cá nhân, không phải khuyến nghị mua/bán tài sản tài chính.
              </p>
            </CardContent>
          </Card>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link href="/onboarding">
              Xem tử vi tài chính của tôi
            </Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/tu-vi/cung-tai-bach">
              
                Cung Tài Bạch là gì
              
            </Link></Button>
          </div>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            4 khuôn mẫu tài chính thường gặp
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {PATTERNS.map((p) => {
              const Icon = p.icon;
              return (
                <Card key={p.title} className="border-border bg-card/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-start gap-2 font-heading text-base text-foreground">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                      {p.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                    <p>{p.body}</p>
                    <ul className="space-y-1">
                      {p.strengths.map((s) => (
                        <li key={s} className="flex gap-2">
                          <span aria-hidden className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold/70" />
                          <span className="text-foreground/80">{s}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="rounded-md border border-amber-400/25 bg-amber-500/[0.06] px-2.5 py-2 text-xs leading-relaxed text-amber-100/85">
                      <strong className="text-amber-200">Cạm bẫy:</strong> {p.watchOut}
                    </p>
                    <p className="text-xs italic text-foreground/70">
                      Tự vấn: &ldquo;{p.selfCheck}&rdquo;
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Đọc cung Tài Bạch thế nào cho đúng
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {HOW_TO_READ.map((h, i) => (
              <Card key={h.step} className="border-border bg-card/40">
                <CardHeader className="pb-2">
                  <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold-700">
                    Bước {i + 1}
                  </p>
                  <CardTitle className="font-heading text-base text-foreground">
                    {h.step}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed text-muted-foreground">
                  {h.body}
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Lưu ý trung thực: Tài Bạch mô tả KHUYNH HƯỚNG quản lý tiền — không dự
            đoán số tài sản, không biết rủi ro thị trường, và không thay được kỷ
            luật chi tiêu thực tế của bạn.
          </p>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Câu hỏi thường gặp
          </h2>
          <div className="space-y-3">
            {FAQ.map((f) => (
              <details
                key={f.q}
                className="group rounded-lg border border-border bg-card/40 px-4 py-3"
              >
                <summary className="cursor-pointer list-none font-medium text-foreground [&::-webkit-details-marker]:hidden">
                  {f.q}
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <Card className="border-border bg-card/40">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-foreground sm:text-2xl">
                Lằn ranh hieu.asia không vượt qua
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm leading-relaxed text-foreground/80 sm:text-base">
                {REMINDERS.map((r, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-amber-300">→</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-20">
          <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Xem cung Tài Bạch + Điền Trạch của bạn
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              Lập lá số 2 phút. Mentor sẽ giúp bạn dịch Tài Bạch + Điền Trạch + đại vận
              thành thói quen tài chính nên có (và nên tránh) trong 90 ngày tới.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link href="/onboarding">
                Lập lá số miễn phí
              </Link></Button>
              <Link
                href="/tu-vi-2026"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
              >
                Tử Vi 2026 <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
        <div className="mx-auto max-w-6xl px-6 pb-12">
          <RelatedTools current="/tu-vi-tai-chinh" />
        </div>
      </main>
      <SiteFooter />
      <StickyMobileCta href="/onboarding?intent=tai-chinh" trackId="tu-vi-tai-chinh" />
    </div>
  );
}
