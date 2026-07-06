import type { Metadata } from 'next';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { Heart, MessageCircle, Users, ShieldAlert, ArrowRight } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
// Gộp (B) 2026-06-21: bê lá số THẬT (Phu Thê, Phúc Đức + đại vận) + Decision
// Brief từ /lo-trinh/tinh-cam (nay redirect về đây).
import { LoTrinhChart } from '@/components/lo-trinh/LoTrinhChart';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, faqPage } from '@/lib/seo/jsonld';

export const metadata: Metadata = {
  title: 'Tử Vi tình yêu: gắn bó, cảm xúc, mẫu xung đột',
  description:
    'Tử Vi tình cảm — đọc cung Phu Thê, Phúc Đức + tâm lý gắn bó hiện đại. Không phán "hợp/khắc tuyệt đối", chỉ giúp hiểu chính mình và đối tác.',
  alternates: { canonical: 'https://hieu.asia/tu-vi-tinh-yeu' },
  // Wave 60.96.2 — route-level openGraph REPLACES root-layout openGraph; must
  // re-declare `images` or social preview cards render blank.
  openGraph: {
    title: 'Tử Vi tình yêu',
    description: 'Phu Thê + Phúc Đức + kiểu gắn bó — bản đồ quan hệ thân mật.',
    url: 'https://hieu.asia/tu-vi-tinh-yeu',
    type: 'article',
    locale: 'vi_VN',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'hieu.asia — Tử Vi tình yêu: Phu Thê + Phúc Đức',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tử Vi tình yêu',
    description: 'Phu Thê + Phúc Đức + kiểu gắn bó — bản đồ quan hệ thân mật.',
    images: [
      {
        url: '/og-image.jpg',
        alt: 'hieu.asia — Tử Vi tình yêu',
      },
    ],
  },
};

const PATTERNS = [
  {
    icon: Heart,
    title: 'Cần an toàn cảm xúc + sự nhất quán',
    body: 'Phu Thê có Thái Âm/Thiên Đồng — bạn dễ vướng người trầm tính, sâu sắc. Rủi ro: dễ "im lặng = đồng ý" và giữ trong lòng quá lâu.',
    strengths: [
      'Chung thuỷ, chăm sóc tinh tế, nhớ những chi tiết nhỏ.',
      'Tạo cảm giác "về nhà" — chỗ dựa cảm xúc cho đối phương.',
    ],
    watchOut:
      'Giữ trong lòng quá lâu rồi bùng nổ vì một chuyện rất nhỏ; đối phương tưởng mọi thứ ổn vì bạn không nói.',
    selfCheck: 'Điều mình đang im lặng chịu đựng — người kia có thật sự biết không?',
  },
  {
    icon: Users,
    title: 'Hợp người sôi nổi + có sức ảnh hưởng',
    body: 'Phu Thê có Thái Dương/Tham Lang — bạn dễ rung động với người năng động. Cẩn trọng nếu hai bên cùng cường độ cao mà không có người làm điểm cân bằng.',
    strengths: [
      'Mang năng lượng và sự mới mẻ vào quan hệ.',
      'Chủ động làm lành, kéo cả hai ra khỏi giai đoạn trì trệ.',
    ],
    watchOut:
      'Cãi to nhanh, làm lành cũng nhanh — nhưng vết cũ chưa từng được xử lý thật, chỉ bị phủ lên bằng năng lượng mới.',
    selfCheck: 'Mình đang cần được lắng nghe, hay đang cần thắng?',
  },
  {
    icon: MessageCircle,
    title: 'Kết nối qua trí tuệ + giao tiếp',
    body: 'Phu Thê có Thiên Cơ/Cự Môn — gắn bó qua đối thoại sâu. Rủi ro: tranh luận leo thang nếu hai bên đều "thắng cuộc".',
    strengths: [
      'Gắn bó qua những cuộc nói chuyện sâu, cùng nhau nghĩ.',
      'Giải quyết vấn đề bằng đối thoại thay vì né tránh.',
    ],
    watchOut:
      'Tranh luận biến thành "ai đúng ai sai"; phân tích cảm xúc của đối phương như một bài toán thay vì cảm nhận nó.',
    selfCheck: 'Cuộc tranh luận này để hiểu nhau hơn, hay để thắng?',
  },
  {
    icon: ShieldAlert,
    title: 'Phu Thê có Hoá Kỵ/sát tinh',
    body: 'Không phải "không có duyên". Là tín hiệu cần học giao tiếp kỳ vọng SỚM và rõ. Nhiều người có Phu Thê khó vẫn có hôn nhân hạnh phúc khi học được kỹ năng giao tiếp.',
    strengths: [
      'Khi học được cách nói kỳ vọng, quan hệ thường bền hơn — vì đã được rèn qua sóng gió.',
      'Trân trọng sự ổn định hơn người chưa từng phải cố gắng vì nó.',
    ],
    watchOut:
      'Tự gán nhãn "mình không có duyên" rồi hành xử đúng như thế — lời tiên tri tự ứng nghiệm.',
    selfCheck:
      'Vấn đề mình đang gặp là kỹ năng (học được), hay là con người (cần chọn lại)?',
  },
];

const HOW_TO_READ = [
  {
    step: 'Cung Phu Thê + chính tinh',
    body: 'Cho biết kiểu gắn bó và nhu cầu cảm xúc cốt lõi CỦA BẠN trong quan hệ thân mật — để hiểu chính mình, không phải để "đoán" đối tác.',
  },
  {
    step: 'Nhìn kèm Phúc Đức',
    body: 'Phúc Đức phản ánh kỳ vọng hạnh phúc của bạn. Nhiều trục trặc tình cảm thật ra là lệch kỳ vọng — biết kỳ vọng của mình thực tế tới đâu là một nửa lời giải.',
  },
  {
    step: 'Lưu niên chiếu Phu Thê',
    body: 'Giai đoạn quan hệ dễ căng thì chuẩn bị kỹ năng giao tiếp sớm — đó là cách dùng đúng, thay vì đọc thành "số phải chia tay".',
  },
];

const FAQ = [
  {
    q: 'Cung Phu Thê là gì?',
    a: 'Phu Thê là cung trong lá số Tử Vi mô tả kiểu gắn bó và nhu cầu cảm xúc của bạn trong quan hệ thân mật: bạn cần gì để thấy an toàn, dễ rung động với kiểu người nào, và rủi ro giao tiếp nào hay lặp lại.',
  },
  {
    q: 'Tử Vi có nói ai là "định mệnh" của tôi không?',
    a: 'Không. Lá số không chứa tên hay hình bóng một người cụ thể nào. Cung Phu Thê mô tả kiểu gắn bó của chính bạn — và một quan hệ tốt được xây bằng cách hai người đối xử với nhau mỗi ngày, không phải bằng "đúng người trong lá số".',
  },
  {
    q: 'Phu Thê có sao khó nghĩa là tôi không có duyên?',
    a: 'Không. Trong cách đọc của hieu.asia, đó là tín hiệu nên học cách nói kỳ vọng sớm và rõ — một kỹ năng học được. Nhiều người có Phu Thê "khó" vẫn có hôn nhân hạnh phúc; nguy hiểm nhất là tự gán nhãn rồi sống đúng như nhãn đó.',
  },
  {
    q: 'Có nên xem lá số người yêu để "kiểm tra" họ không?',
    a: 'Không nên — lá số là thông tin riêng tư; xem lén để phán xét một người là dùng sai công cụ. Nếu cả hai cùng muốn hiểu nhau, hãy dùng công cụ hợp đôi với sự đồng ý của cả hai — kết quả tập trung vào cách giao tiếp, không phán hợp/khắc.',
  },
  {
    q: 'Trang này khác gì xem hợp tuổi?',
    a: 'Hợp tuổi đối chiếu Can Chi hai năm sinh — tín hiệu nhanh mang tính tham khảo văn hoá. Cung Phu Thê sâu hơn: giúp bạn hiểu kiểu gắn bó của chính mình. Dùng cả hai bổ trợ nhau, nhưng đừng để bất kỳ cái nào quyết định thay hai người.',
  },
];

const DOS_DONTS = [
  {
    do: 'Đọc cung Phu Thê CỦA BẠN để hiểu khuôn mẫu chính bạn dễ rơi vào.',
    dont: 'KHÔNG dùng cung Phu Thê để "kiểm tra" người yêu — đó là vi phạm quyền riêng tư.',
  },
  {
    do: 'Đối chiếu với cung Phúc Đức để biết "kỳ vọng quan hệ" có thực tế không.',
    dont: 'KHÔNG kết luận "hợp/khắc tuyệt đối" — quan hệ là quá trình hai bên cùng học.',
  },
  {
    do: 'Khi gặp lưu niên xung Phu Thê, học cách giao tiếp kỳ vọng RÕ và sớm.',
    dont: 'KHÔNG hỏi Mentor "tôi có nên ly hôn ngay không?" — Mentor sẽ từ chối quyết định thay bạn.',
  },
];

const JSONLD = [
  article({
    headline: 'Tử Vi tình yêu — Phu Thê + Phúc Đức + kiểu gắn bó',
    description:
      'Tử Vi tình cảm — đọc cung Phu Thê, Phúc Đức + tâm lý gắn bó hiện đại. Không phán "hợp/khắc tuyệt đối", chỉ giúp hiểu chính mình.',
    url: '/tu-vi-tinh-yeu',
    image: '/og-image.jpg',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Tử Vi tình yêu', url: '/tu-vi-tinh-yeu' },
  ]),
  faqPage(FAQ),
];

export default function TuViTinhYeuPage() {
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
            Tử Vi · Tình cảm & quan hệ thân mật
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Tử Vi tình yêu — không phán hợp/khắc, chỉ giúp hiểu mình
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/80 sm:text-lg">
            Cung Phu Thê không nói "ai là người định mệnh của bạn". Nó mô tả KIỂU gắn bó
            bạn dễ rơi vào, nhu cầu cảm xúc cốt lõi, và rủi ro giao tiếp dễ gặp. hieu.asia
            kết hợp Tử Vi với khung tâm lý gắn bó hiện đại để giúp bạn hiểu CHÍNH BẠN
            trong quan hệ — không phải để "đoán" đối tác.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link href="/onboarding">
              Xem tử vi tình cảm của tôi
            </Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/tu-vi/cung-phu-the">
              
                Cung Phu Thê là gì
              
            </Link></Button>
          </div>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            4 khuôn mẫu quan hệ thường gặp
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
            Đọc cung Phu Thê thế nào cho đúng
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
            Lưu ý trung thực: không tồn tại "hợp/khắc tuyệt đối" trong cách đọc của
            hieu.asia — quan hệ là kỹ năng hai người cùng học, lá số chỉ giúp bạn
            thấy rõ khuôn mẫu của chính mình.
          </p>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Câu hỏi thường gặp
          </h2>
          <dl className="space-y-3">
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
          </dl>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Nên / Không nên
          </h2>
          <div className="space-y-3">
            {DOS_DONTS.map((d, i) => (
              <Card key={i} className="border-border bg-card/40">
                <CardContent className="grid gap-3 pt-5 sm:grid-cols-2">
                  <div>
                    <p className="font-mono text-[12px] uppercase tracking-widest text-jade-50">
                      Nên
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/85">{d.do}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[12px] uppercase tracking-widest text-red-300">
                      Không nên
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/85">{d.dont}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-20">
          <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Xem cung Phu Thê CỦA BẠN
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              Bạn sẽ thấy chính tinh tại Phu Thê, tứ hoá, và tam phương tứ chính (Phu Thê +
              Phúc Đức + Tật Ách + Quan Lộc). Mentor sẽ giúp bạn dịch chúng thành "tôi cần
              gì trong quan hệ" và "tôi dễ gặp rủi ro giao tiếp gì".
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link href="/onboarding">
                Lập lá số miễn phí
              </Link></Button>
              <Link
                href="/hop-tuoi"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
              >
                Xem hợp tuổi cưới hỏi <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-3xl px-6 pb-12">
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            Lá số tình cảm của bạn
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Trên là góc nhìn chung. Dưới đây đọc đúng lá số THẬT của bạn — cung Phu Thê, Phúc Đức cùng
            đại vận hiện tại — rồi lập Decision Brief nếu đang phân vân một mối quan hệ.
          </p>
          <div className="mt-5">
            <LoTrinhChart topic="relationship" focusPalaces={['Phu Thê', 'Phúc Đức']} />
          </div>
          <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs leading-relaxed text-foreground/80">
            Nếu bạn đang ở trong mối quan hệ có bạo lực hoặc bị kiểm soát, lá số không phải nơi để cân nhắc
            ở/đi — hãy tìm hỗ trợ an toàn (Ngôi nhà Bình yên 1900&nbsp;969&nbsp;680). An toàn của bạn trên hết.
          </p>
        </section>
        <div className="mx-auto max-w-6xl px-6 pb-12">
          <RelatedTools current="/tu-vi-tinh-yeu" />
        </div>
      </main>
      <SiteFooter />
      <StickyMobileCta href="/onboarding?intent=tinh-cam" trackId="tu-vi-tinh-yeu" />
    </div>
  );
}
