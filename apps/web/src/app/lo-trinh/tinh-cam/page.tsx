import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Heart,
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

const SLUG = 'tinh-cam';
const TOPIC = 'love';

export const metadata: Metadata = {
  title: 'Tình cảm & gia đình — lộ trình',
  description:
    'Đang nặng lòng vì một mối quan hệ? Lộ trình đọc cung Phu Thê, Phúc Đức, Nô Bộc kết hợp tương hợp tuổi để bạn hiểu kiểu gắn bó của mình và người kia — trước khi quyết định bước tiếp.',
  alternates: { canonical: `https://hieu.asia/lo-trinh/${SLUG}` },
  openGraph: {
    title: 'Tình cảm & gia đình — lộ trình',
    description:
      'Phu Thê + Phúc Đức + Nô Bộc + tương hợp tuổi — hiểu kiểu gắn bó trước khi quyết định.',
    url: `https://hieu.asia/lo-trinh/${SLUG}`,
    type: 'website',
  },
};

const TOOLS: { name: string; desc: string; href: string }[] = [
  {
    name: 'Cung Phu Thê',
    desc: 'Kiểu bạn đời bạn hay gặp, kỳ vọng bạn đặt vào quan hệ, cách bạn xử lý mâu thuẫn.',
    href: '/tu-vi/cung-phu-the',
  },
  {
    name: 'Cung Phúc Đức',
    desc: 'Gia đạo và mức chịu đựng — nguồn cảm giác bình yên hay căng thẳng nội tại.',
    href: '/tu-vi/cung-phuc-duc',
  },
  {
    name: 'Cung Nô Bộc',
    desc: 'Vòng tròn xã hội — bạn bè, đồng nghiệp, người gần — vì quan hệ tình cảm sống trong bối cảnh xã hội.',
    href: '/tu-vi',
  },
  {
    name: 'Hợp tuổi & tương hợp',
    desc: 'So lá số hai người — không phải để phán "hợp / không hợp" mà để thấy điểm mâu thuẫn cụ thể.',
    href: '/hop-tuoi',
  },
  {
    name: 'Decision Brief (quan hệ)',
    desc: 'Khi đứng trước quyết định lớn (cưới, chia tay, tha thứ) — tách cảm xúc khỏi dữ kiện.',
    href: '/decisions/new?topic=love',
  },
];

const QUESTIONS: { q: string; a: string }[] = [
  {
    q: 'Vì sao tôi cứ lặp lại một kiểu quan hệ?',
    a: 'Cung Phu Thê chỉ ra "kiểu người" bạn bị thu hút và "kiểu mâu thuẫn" hay quay lại. Kết hợp Phúc Đức để thấy nguồn gốc — thường nằm ở mẫu hình gia đình bạn lớn lên. Hiểu mẫu hình giúp bạn nhận ra nó sớm, không phải tự trách sau lần thứ ba.',
  },
  {
    q: 'Chúng tôi có hợp nhau không?',
    a: 'Tương hợp không phải bảng "hợp / không hợp" đen trắng. Hệ thống so lá số hai người để chỉ ra điểm cộng hưởng và điểm va chạm cụ thể — bạn biết cần thương lượng điều gì, thay vì lo lắng chung chung về "duyên số".',
  },
  {
    q: 'Tôi nên ở lại hay rời đi?',
    a: 'Decision Brief không trả lời thay bạn. Nó giúp bạn tách "mệt tạm thời" khỏi "không tương thích cốt lõi" — kèm câu hỏi tự phản tư về kỳ vọng, lằn ranh, và điều kiện bạn cần để quan hệ này lành mạnh trong 6-12 tháng tới.',
  },
];

const FIT: string[] = [
  'Bạn đang trong một quan hệ nặng nề và muốn nhìn rõ hơn trước khi quyết định',
  'Bạn vừa bắt đầu một quan hệ mới và muốn hiểu mẫu hình lặp lại của mình',
  'Bạn đang cân nhắc kết hôn và muốn đối chiếu lá số hai người',
  'Bạn đang căng thẳng với cha mẹ / anh chị em và muốn hiểu bối cảnh gia đạo',
  'Bạn vừa chia tay và muốn rút bài học có cấu trúc, không chỉ "rồi sẽ ổn"',
  'Bạn quan tâm tới việc xây quan hệ lành mạnh dài hạn',
];

const NOT_FIT: string[] = [
  'Bạn đang trong tình huống bạo lực / lạm dụng (hãy gọi tới đường dây hỗ trợ chuyên môn — chúng tôi không thay thế)',
  'Bạn muốn một câu trả lời "có duyên hay không có duyên" và dừng ở đó',
  'Bạn cần trị liệu cặp đôi chuyên sâu (hãy gặp therapist)',
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
      name: 'Tình cảm',
      item: `https://hieu.asia/lo-trinh/${SLUG}`,
    },
  ],
};

export default function TinhCamPage() {
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
            <span className="text-muted-foreground">Tình cảm</span>
          </nav>

          <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gold/10 text-gold">
            <Heart className="h-5 w-5" aria-hidden />
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
            Lộ trình · Tình cảm & gia đình
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Tình cảm — Hiểu kiểu gắn bó trước khi quyết định
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Một mối quan hệ đang nặng, hoặc bạn muốn hiểu kiểu gắn bó của mình và người
            kia trước khi bước tiếp. Lộ trình này dựng ba lớp — Phu Thê (bạn đời), Phúc
            Đức (gia đạo), Nô Bộc (vòng tròn xã hội) — để bạn thấy bối cảnh thật.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link href={`/onboarding/topic?topic=${TOPIC}`}>
              Bắt đầu lập lá số
            </Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/decisions/new?topic=relationship">
              
                Ghi quyết định tình cảm
              
            </Link></Button>
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

        <section className="relative mx-auto max-w-4xl px-6 pb-12">
          <Link
            href="/community/cases/quan-he-vo-chong-ran-nut"
            className="group block rounded-xl border border-border bg-card/30 p-5 transition-colors hover:border-gold/40"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold/85">
              Đọc case study tương tự
            </p>
            <p className="mt-2 font-heading text-base font-semibold text-foreground group-hover:text-gold">
              Quan hệ vợ chồng có dấu hiệu rạn nứt — có nên ly hôn?
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              Nữ, 42 tuổi · cung Phu Thê có Thiên Cơ + Hoá Kỵ · compatibility check chỉ ra va chạm là phong cách, không phải giá trị.
            </p>
          </Link>
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
              <Button asChild size="lg"><Link href={`/onboarding/topic?topic=${TOPIC}`}>
                Bắt đầu lập lá số
              </Link></Button>
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
