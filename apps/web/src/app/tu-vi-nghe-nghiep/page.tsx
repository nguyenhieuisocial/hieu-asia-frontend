import type { Metadata } from 'next';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { Briefcase, Compass, Target, AlertTriangle, ArrowRight } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
// Gộp (B) 2026-06-21: bê lá số THẬT (đại vận + cung nghề) + Decision Brief từ
// /lo-trinh/su-nghiep (nay redirect về đây) — giữ khoảnh khắc "thấy lá số mình".
import { LoTrinhChart } from '@/components/lo-trinh/LoTrinhChart';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, faqPage } from '@/lib/seo/jsonld';

export const metadata: Metadata = {
  title: 'Tử Vi nghề nghiệp: hợp ngành nào, vai trò gì?',
  description:
    'Tử Vi sự nghiệp — đọc cung Quan Lộc, Tài Bạch, Thiên Di + đại vận để tìm môi trường + vai trò hợp với thiên hướng cá nhân. Miễn phí lập lá số.',
  alternates: { canonical: 'https://hieu.asia/tu-vi-nghe-nghiep' },
  // Wave 60.96.2 — route-level openGraph REPLACES root-layout openGraph; must
  // re-declare `images` or social preview cards render blank.
  openGraph: {
    title: 'Tử Vi nghề nghiệp',
    description: 'Quan Lộc + Tài Bạch + Thiên Di — bản đồ thiên hướng sự nghiệp.',
    url: 'https://hieu.asia/tu-vi-nghe-nghiep',
    type: 'article',
    locale: 'vi_VN',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'hieu.asia — Tử Vi nghề nghiệp: Quan Lộc + Tài Bạch + Thiên Di',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tử Vi nghề nghiệp',
    description: 'Quan Lộc + Tài Bạch + Thiên Di — bản đồ thiên hướng sự nghiệp.',
    images: [
      {
        url: '/og-image.jpg',
        alt: 'hieu.asia — Tử Vi nghề nghiệp',
      },
    ],
  },
};

const PATTERNS = [
  {
    icon: Target,
    title: 'Có cấu trúc + tự chủ trong vai trò',
    body: 'Quan Lộc có Tử Vi/Thiên Phủ → hợp vai trò có thẩm quyền nhưng vẫn cần kỷ luật cao. Ví dụ: chuyên gia kỹ thuật, quản lý cấp trung, founder team nhỏ.',
    strengths: [
      'Chịu trách nhiệm cuối, giữ chuẩn chất lượng cho cả đội.',
      'Được tin tưởng giao việc quan trọng; xây hệ thống bền.',
    ],
    watchOut:
      'Ôm việc vì không tin ai làm "đúng chuẩn" — lên vai trò lớn hơn lại nghẽn vì không buông được quyền kiểm soát.',
    selfCheck: 'Tôi đang giữ chuẩn, hay đang sợ buông?',
  },
  {
    icon: Briefcase,
    title: 'Chuyên môn sâu, không thích quản lý người',
    body: 'Quan Lộc có Vũ Khúc/Thiên Cơ → hợp việc đào sâu một lĩnh vực. Ví dụ: kỹ sư, kế toán, nghiên cứu, IC track.',
    strengths: [
      'Đào sâu nhanh, kỷ luật, chất lượng ổn định.',
      'Giá trị tăng theo độ sâu — hợp đường thăng tiến chuyên gia.',
    ],
    watchOut:
      'Bị đẩy lên quản lý như "phần thưởng" rồi mất cả nghề lẫn niềm vui; ngại kể thành quả nên dễ bị bỏ qua khi xét thưởng.',
    selfCheck:
      'Tôi muốn giỏi hơn hay muốn chức to hơn — và nơi này có đường thăng tiến cho chuyên gia không?',
  },
  {
    icon: Compass,
    title: 'Truyền cảm hứng + sức ảnh hưởng',
    body: 'Quan Lộc có Thái Dương → hợp việc trước công chúng. Ví dụ: giảng dạy, marketing, sales, content creator.',
    strengths: [
      'Kể chuyện, thuyết trình, tạo năng lượng cho cả đội.',
      'Xây thương hiệu cá nhân và mạng quan hệ nhanh.',
    ],
    watchOut:
      'Nhận việc vì hào quang thay vì nội dung; kiệt sức vì lúc nào cũng phải "sáng" trước người khác.',
    selfCheck: 'Nếu không ai vỗ tay, việc này còn đáng làm không?',
  },
  {
    icon: AlertTriangle,
    title: 'Khởi nghiệp + đổi mới',
    body: 'Quan Lộc có Thất Sát/Phá Quân → hợp môi trường biến động. Cẩn trọng nếu Tài Bạch không đủ ổn.',
    strengths: [
      'Quyết nhanh trong mơ hồ, dám mở đường.',
      'Bứt tốc tốt ở giai đoạn 0→1, xoay chuyển tình huống.',
    ],
    watchOut:
      'Chán nhanh khi việc vào guồng → đập đi xây lại cả khi chưa cần; runway tài chính mỏng làm quyết định méo mó.',
    selfCheck: 'Tôi đang đổi mới có chủ đích, hay chỉ đang chán?',
  },
];

const HOW_TO_READ = [
  {
    step: 'Cung Quan Lộc + chính tinh',
    body: 'Cho biết KIỂU vai trò bạn phát huy tốt nhất — 4 khuôn mẫu ở trên là những tổ hợp thường gặp. Cùng một sao có thể ứng nhiều nghề khác nhau.',
  },
  {
    step: 'Nhìn kèm Tài Bạch + Thiên Di',
    body: 'Tử Vi đọc cung theo cụm, không đọc rời: Tài Bạch cho biết cách tiền về, Thiên Di cho biết môi trường và việc "ra ngoài" hợp bạn tới đâu.',
  },
  {
    step: 'Đại vận + lưu niên để chọn thời điểm',
    body: 'Cùng một lá số, mỗi giai đoạn 10 năm có trọng tâm khác — dùng để cân nhắc lúc nào nên đẩy, lúc nào nên giữ, thay vì hỏi "có nên đổi việc không" chung chung.',
  },
];

const FAQ = [
  {
    q: 'Cung Quan Lộc là gì?',
    a: 'Quan Lộc là một trong 12 cung của lá số Tử Vi, mô tả thiên hướng sự nghiệp: kiểu vai trò bạn phát huy tốt, cách bạn làm việc và phát triển nghề. Nó được đọc cùng cung Tài Bạch (tiền) và Thiên Di (môi trường) để ra bức tranh sự nghiệp đầy đủ.',
  },
  {
    q: 'Tử Vi có nói tôi nên làm nghề gì không?',
    a: 'Không kê tên nghề. Cùng một chính tinh có thể ứng với nhiều nghề — ví dụ Thái Dương tại Quan Lộc có thể là giảng dạy, marketing hoặc sáng tạo nội dung. Lá số mô tả kiểu vai trò và môi trường hợp bạn; chọn nghề cụ thể cần thêm bối cảnh thật (kỹ năng, thị trường, tài chính) của chính bạn.',
  },
  {
    q: 'Quan Lộc có sao "xấu" nghĩa là sự nghiệp lận đận?',
    a: 'Không. Trong cách đọc của hieu.asia, sao khó không phải bản án mà là một cách vận hành riêng kèm bài học riêng — ví dụ Hoá Kỵ tại Quan Lộc thường nhắc về kỷ luật cam kết, chứ không có nghĩa "thất nghiệp". Cách bạn dùng khuynh hướng đó mới quyết định kết quả.',
  },
  {
    q: 'Muốn biết có nên đổi việc năm nay thì xem thế nào?',
    a: 'Xem đại vận hiện tại và lưu niên chiếu cung Quan Lộc để biết giai đoạn này thuận cho việc đẩy hay nên củng cố. Sau đó dùng công cụ Quyết định (Decision Brief) — AI đọc lá số kèm bối cảnh thật của bạn và phân tích từng lựa chọn, thay vì phán có/không.',
  },
  {
    q: 'Không nhớ giờ sinh có xem được không?',
    a: 'Lá số 12 cung cần giờ sinh chính xác — sai giờ là lệch cung. Nếu không chắc giờ sinh, bạn có thể bắt đầu bằng Career Fit (chỉ cần ngày sinh + 5 lựa chọn về cách làm việc) hoặc xem Bát Tự theo ngày sinh trước.',
  },
];

const QUESTIONS = [
  'Bạn có hợp đi làm thuê hay tự kinh doanh?',
  'Bạn có nên chuyển ngành ở giai đoạn này không?',
  'Bạn hợp quản lý hay chuyên môn sâu?',
  'Môi trường tổ chức lớn hay startup hợp bạn hơn?',
  'Năm 2026 nên đẩy hay giữ vai trò hiện tại?',
];

const JSONLD = [
  article({
    headline: 'Tử Vi nghề nghiệp — Quan Lộc + Tài Bạch + Thiên Di',
    description:
      'Tử Vi sự nghiệp — đọc cung Quan Lộc, Tài Bạch, Thiên Di + đại vận để tìm môi trường + vai trò hợp với thiên hướng cá nhân.',
    url: '/tu-vi-nghe-nghiep',
    image: '/og-image.jpg',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Tử Vi nghề nghiệp', url: '/tu-vi-nghe-nghiep' },
  ]),
  faqPage(FAQ),
];

export default function TuViNgheNghiepPage() {
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
            Tử Vi · Sự nghiệp & vai trò
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Bạn hợp ngành nào, vai trò gì, môi trường nào?
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/80 sm:text-lg">
            Tử Vi không kê khai "bạn sẽ làm nghề X". Nhưng cung Quan Lộc + Tài Bạch +
            Thiên Di cho biết KIỂU vai trò, KIỂU môi trường, KIỂU đồng nghiệp mà bạn
            phát huy tốt nhất. Lập lá số 2 phút để xem 4 cung chính ảnh hưởng nghề
            nghiệp của bạn.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link href="/onboarding">
              Xem tử vi nghề nghiệp của tôi
            </Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/tu-vi/cung-quan-loc">
              
                Cung Quan Lộc là gì
              
            </Link></Button>
          </div>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            4 khuôn mẫu nghề nghiệp thường gặp
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
            Đọc cung Quan Lộc thế nào cho đúng
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
            Lưu ý trung thực: lá số mô tả KIỂU vai trò và môi trường — không kê tên
            nghề cụ thể, và không thay được việc bạn đánh giá kỹ năng, thị trường,
            tài chính thực tế của mình.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Liên quan:{' '}
            <Link href="/lo-trinh" className="text-gold hover:underline">
              Lộ trình theo nhu cầu
            </Link>{' '}
            ·{' '}
            <Link href="/methodology" className="text-gold hover:underline">
              Engine tính gì, AI luận gì
            </Link>
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
          <Card className="border-border bg-card/40">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-foreground sm:text-2xl">
                Mentor sẽ giúp bạn trả lời 5 câu này
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm leading-relaxed text-foreground/80 sm:text-base">
                {QUESTIONS.map((q, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 font-mono text-gold/85">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{q}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-xs text-muted-foreground">
                Mentor không trả lời "có" hoặc "không" — Mentor hỏi lại bối cảnh, đối chiếu lá số,
                và đưa 2–3 kịch bản với điều kiện kiểm chứng. Bạn vẫn là người quyết định.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-20">
          <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Bắt đầu — xem Quan Lộc + Tài Bạch của bạn
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              Lập lá số (2 phút, miễn phí). Bạn sẽ thấy 12 cung tương tác, click vào cung
              Quan Lộc để xem chính tinh + đại vận + lưu niên. Sau đó hỏi Mentor về quyết
              định nghề cụ thể của bạn.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link href="/onboarding">
                Lập lá số miễn phí
              </Link></Button>
              <Link
                href="/sample-report"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
              >
                Xem mẫu báo cáo <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-3xl px-6 pb-12">
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            Lá số nghề nghiệp của bạn
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Trên là góc nhìn chung. Dưới đây đọc đúng lá số THẬT của bạn — cung Quan Lộc, Tài Bạch,
            Thiên Di cùng đại vận hiện tại — rồi lập Decision Brief nếu đang phân vân.
          </p>
          <div className="mt-5">
            <LoTrinhChart topic="career" focusPalaces={['Quan Lộc', 'Tài Bạch', 'Thiên Di']} />
          </div>
        </section>
        <div className="mx-auto max-w-6xl px-6 pb-12">
          <RelatedTools current="/tu-vi-nghe-nghiep" />
        </div>
      </main>
      <SiteFooter />
      <StickyMobileCta href="/onboarding?intent=su-nghiep" trackId="tu-vi-nghe-nghiep" />
    </div>
  );
}
