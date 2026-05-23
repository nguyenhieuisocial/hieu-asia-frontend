import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Coffee,
  Sparkles,
  BookOpen,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';

const SLUG = 'hang-ngay';
const TOPIC = 'general';

export const metadata: Metadata = {
  title: 'Tra cứu hằng ngày — lộ trình',
  description:
    'Một câu gợi ý đúng buổi sáng, một ngày tốt cho cuộc họp, một lời nhắc khi vận chuyển pha — tra cứu nhanh hằng ngày qua web hoặc Telegram bot @hieuasiabot.',
  alternates: { canonical: `https://hieu.asia/lo-trinh/${SLUG}` },
  openGraph: {
    title: 'Tra cứu hằng ngày — lộ trình',
    description:
      'Tử Vi hôm nay + Lịch Vạn Niên + Ngày tốt + Telegram bot — gợi ý ngắn, đủ dùng.',
    url: `https://hieu.asia/lo-trinh/${SLUG}`,
    type: 'website',
  },
};

const TOOLS: { name: string; desc: string; href: string }[] = [
  {
    name: 'Tử Vi hôm nay',
    desc: 'Lát cắt ngày — chủ đề năng lượng nổi bật và một gợi ý ngắn để dùng cho hôm nay.',
    href: '/tu-vi-hom-nay',
  },
  {
    name: 'Lịch Vạn Niên',
    desc: 'Lịch âm – dương đầy đủ, can chi từng ngày — tra cứu khi cần chọn ngày.',
    href: '/lich-van-nien',
  },
  {
    name: 'Ngày tốt – ngày xấu',
    desc: 'Lọc ngày theo việc cụ thể: ký hợp đồng, ra mắt, khởi công, cuộc họp lớn.',
    href: '/lich-van-nien/ngay-tot-xau',
  },
  {
    name: 'Newsletter hằng tuần',
    desc: 'Tóm tắt tuần qua email — một câu duy nhất, đủ ngắn để đọc với tách cà phê.',
    href: '#newsletter',
  },
  {
    name: 'Telegram bot',
    desc: 'Chat @hieuasiabot — hỏi nhanh "hôm nay" hoặc "tuần này", trả lời gọn trong vài giây.',
    href: 'https://t.me/hieuasiabot',
  },
];

const QUESTIONS: { q: string; a: string }[] = [
  {
    q: 'Hôm nay tôi nên chú ý điều gì?',
    a: 'Tử Vi hôm nay chiếu can chi ngày lên lá số bạn để gợi một chủ đề năng lượng — ví dụ "ngày dễ trễ giờ" hoặc "ngày phù hợp ra quyết định nhỏ". Không phải lời tiên tri, chỉ là một câu nhắc để bạn để ý sớm, không bất ngờ giữa ngày.',
  },
  {
    q: 'Ngày nào nên ký hợp đồng / ra mắt sản phẩm / tổ chức cuộc họp lớn?',
    a: 'Ngày tốt – xấu lọc theo việc cụ thể, không phải bảng "ngày đẹp" chung chung. Hệ thống kết hợp can chi ngày với lá số bạn để gợi ý 2-3 cửa sổ thời gian trong 30 ngày tới — bạn vẫn quyết, công cụ chỉ chỉ ra ngày dễ thuận hơn.',
  },
  {
    q: 'Có cách nào nhận gợi ý mỗi sáng mà không phải mở web?',
    a: 'Telegram bot @hieuasiabot gửi gợi ý hôm nay vào sáng sớm — bạn cũng có thể hỏi ngược "tuần này thế nào" và nhận tóm tắt ngắn. Hoặc đăng ký newsletter tuần qua email nếu thích đọc tổng hợp một lần thay vì hằng ngày.',
  },
];

const FIT: string[] = [
  'Bạn đã có lá số và muốn tận dụng nó như một thói quen hằng ngày',
  'Bạn không muốn báo cáo dài — chỉ cần một câu gợi ý đúng lúc',
  'Bạn hay chọn ngày cho việc quan trọng (ký, ra mắt, họp lớn)',
  'Bạn thích nhận gợi ý qua Telegram hoặc email thay vì mở app',
  'Bạn dùng lịch âm – dương trong công việc và muốn một bản tra cứu sạch',
];

const NOT_FIT: string[] = [
  'Bạn chưa có lá số — hãy bắt đầu với "Hiểu bản thân" hoặc "Sự nghiệp" trước',
  'Bạn muốn lập kế hoạch năm — hãy dùng lộ trình "Kế hoạch năm" để có khung 12 tháng',
];

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'Lộ trình', item: 'https://hieu.asia/lo-trinh' },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Tra cứu hằng ngày',
      item: `https://hieu.asia/lo-trinh/${SLUG}`,
    },
  ],
};

export default function HangNgayPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />
      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(ellipse_at_top,_rgba(184,146,61,0.10)_0%,_transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(184,146,61,0.18)_0%,_transparent_55%)]"
        />

        <section className="relative mx-auto max-w-4xl px-6 pb-10 pt-12 sm:pt-16">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-gold">
              Trang chủ
            </Link>
            <span className="mx-1.5">/</span>
            <Link href="/lo-trinh" className="hover:text-gold">
              Lộ trình
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-muted-foreground">Tra cứu hằng ngày</span>
          </nav>

          <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gold/10 text-gold">
            <Coffee className="h-5 w-5" aria-hidden />
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
            Lộ trình · Tra cứu nhanh hằng ngày
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Hằng ngày — Một câu gợi ý, đủ dùng
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Bạn không cần báo cáo dài — chỉ cần một câu gợi ý đúng buổi sáng, một ngày
            tốt cho cuộc họp, hoặc một lời nhắc khi vận đang chuyển pha. Lộ trình này
            biến lá số thành một thói quen nhẹ — qua web hoặc Telegram.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={`/onboarding/topic?topic=${TOPIC}`}>
              <Button size="lg">Bắt đầu lập lá số</Button>
            </Link>
            <Link href="/tu-vi-hom-nay">
              <Button size="lg" variant="outline">
                Xem Tử Vi hôm nay
              </Button>
            </Link>
          </div>
        </section>

        <section className="relative mx-auto max-w-4xl px-6 pb-12">
          <div className="mb-6 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-gold" aria-hidden />
            <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
              Bạn sẽ dùng tới những công cụ này
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((t) => (
              <Link key={t.name} href={t.href}>
                <Card className="h-full border-border bg-card/40 transition-colors hover:border-gold/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="font-heading text-base text-foreground">
                      {t.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs leading-relaxed text-muted-foreground">
                    {t.desc}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="relative mx-auto max-w-4xl px-6 pb-12">
          <div className="mb-6 flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-gold" aria-hidden />
            <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
              3 câu hỏi điển hình lộ trình này trả lời
            </h2>
          </div>
          <div className="space-y-4">
            {QUESTIONS.map((qa) => (
              <div
                key={qa.q}
                className="rounded-xl border border-border bg-card/40 p-5"
              >
                <p className="font-heading text-base font-semibold text-foreground">{qa.q}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{qa.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative mx-auto max-w-4xl px-6 pb-12">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card/40 p-6">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Phù hợp khi bạn...
              </h2>
              <ul className="mt-4 space-y-2.5">
                {FIT.map((f) => (
                  <li key={f} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-card/30 p-6">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Không phù hợp khi bạn...
              </h2>
              <ul className="mt-4 space-y-2.5">
                {NOT_FIT.map((f) => (
                  <li key={f} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                    <span aria-hidden className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-muted/40" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="relative mx-auto max-w-4xl px-6 pb-20">
          <div className="rounded-xl border border-border bg-card/40 p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              Sẵn sàng bắt đầu?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Lập lá số mất khoảng 3 phút. Bạn có thể xem mẫu báo cáo trước nếu muốn
              biết kết quả trông như thế nào.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={`/onboarding/topic?topic=${TOPIC}`}>
                <Button size="lg">Bắt đầu lập lá số</Button>
              </Link>
              <Link
                href="/sample-report"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
              >
                Xem mẫu báo cáo
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
