import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Compass,
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
import {
  BeginnerContent,
  ExpertContent,
} from '@/components/reading/ModeContent';
import { LoTrinhChart } from '@/components/lo-trinh/LoTrinhChart';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';

const SLUG = 'hieu-ban-than';
const TOPIC = 'self';

export const metadata: Metadata = {
  title: 'Hiểu bản thân — lộ trình',
  description:
    'Lộ trình hiểu bản thân: lập lá số, đọc cung Mệnh–Thân, đối chiếu MBTI và Thần Số Học để có một bức chân dung trung thực — không tô hồng, không doạ nạt.',
  alternates: { canonical: `https://hieu.asia/lo-trinh/${SLUG}` },
  openGraph: {
    title: 'Hiểu bản thân — lộ trình',
    description:
      'Một bức chân dung trung thực về điểm mạnh, vùng tối, và kiểu năng lượng của bạn.',
    url: `https://hieu.asia/lo-trinh/${SLUG}`,
    type: 'website',
    images: OG_DEFAULT_IMAGES,
  },
};

const TOOLS: { name: string; desc: string; href: string }[] = [
  {
    name: 'Lá số tổng quan',
    desc: 'Bản đồ 12 cung — điểm khởi đầu của mọi luận giải khác.',
    href: '/onboarding/topic',
  },
  {
    name: 'Cung Mệnh – Thân',
    desc: 'Khí chất gốc và phần "vận hành đời sống" — hai mặt của một con người.',
    href: '/tu-vi/cung-menh',
  },
  {
    name: 'MBTI bổ trợ',
    desc: 'Đối chiếu kiểu nhận thức và ra quyết định với cấu trúc cung Mệnh.',
    href: '/onboarding',
  },
  {
    name: 'Thần Số Học',
    desc: 'Lớp con số sinh nhật — bổ sung góc nhìn về chu kỳ cá nhân.',
    href: '/than-so-hoc',
  },
  {
    name: 'Cẩm nang cá nhân (PDF)',
    desc: 'Tổng hợp lại thành một tài liệu bạn có thể đọc lại sau 6 tháng.',
    href: '/sample-report',
  },
];

interface QuestionRow {
  q: string;
  /** Beginner-friendly answer — accessible Vietnamese, minimal jargon. */
  beginner: string;
  /** Expert answer — Tử Vi terminology preserved, citation-friendly. */
  expert: string;
}

const QUESTIONS: QuestionRow[] = [
  {
    q: 'Tại sao tôi cứ vướng cùng một loại vấn đề?',
    beginner:
      'Lá số chỉ ra mẫu hình lặp lại trong cách bạn ra quyết định. Khi nhận ra mẫu hình, bạn dễ nhìn thấy điểm trigger trước khi rơi vào nó lần nữa, thay vì tự trách sau khi đã xảy ra.',
    expert:
      'Mẫu hình lặp lại thường nằm ở cung Mệnh kết hợp với chính tinh thủ Mệnh và bộ phụ tinh sát–hoá. Soi thêm tam phương tứ chính (Quan Lộc · Tài Bạch · Thiên Di) để xác định trục năng lượng tạo ra mẫu hình, từ đó nhận diện trigger sớm.',
  },
  {
    q: 'Điểm mạnh thật sự của tôi là gì, không phải điều tôi tưởng?',
    beginner:
      'Người ta hay nhầm "thứ mình thích" với "thứ mình giỏi". Lá số tách hai lớp này: phần khí chất cốt lõi và phần năng lực thực thi. Bạn sẽ thấy mảnh nào đang được dùng đúng, mảnh nào còn ngủ.',
    expert:
      'Cung Mệnh cho khí chất cốt lõi (chính tinh thủ Mệnh + miếu/vượng/hãm), cung Quan Lộc cho năng lực thực thi. Đối chiếu với cung Phúc Đức để loại trừ những điểm mạnh "tâm lý" nhưng không có hậu thuẫn vận hành thực tế.',
  },
  {
    q: 'Tôi nên đầu tư phát triển điều gì trong 1-2 năm tới?',
    beginner:
      'Hệ thống đọc giai đoạn vận hiện tại + nền tảng phúc khí để gợi ý ba hướng phát triển có cộng hưởng với pha bạn đang ở — kèm câu hỏi tự phản tư để bạn tự chọn, không phải lời khuyên áp đặt.',
    expert:
      'Đọc đại vận hiện hành (10 năm) + tiểu vận năm hiện tại + cung Phúc Đức nền. Khi sao Lộc/Quyền/Khoa/Kỵ rơi vào tam phương tứ chính của Quan/Tài, đó là cửa sổ phát triển — gợi ý xoay quanh cung được kích hoạt.',
  },
];

const FIT: string[] = [
  'Bạn đang ở giai đoạn chuyển pha (đổi việc, kết hôn, chuyển nhà, sau biến cố)',
  'Bạn từng đọc nhiều bài "biết mình" nhưng vẫn thấy mình mơ hồ',
  'Bạn muốn một góc nhìn có cấu trúc, không phải "động viên chung chung"',
  'Bạn quen với tự phản tư và sẵn sàng nghe điều không dễ chịu',
  'Bạn cần một tài liệu để đọc lại sau 6-12 tháng — không phải một buổi trò chuyện 1 lần rồi quên',
];

const NOT_FIT: string[] = [
  'Bạn đang khủng hoảng tâm lý cấp tính (hãy gặp chuyên gia tâm lý — chúng tôi không thay thế)',
  'Bạn muốn ai đó nói "bạn là người đặc biệt" và dừng ở đó',
  'Bạn cần chẩn đoán y khoa hoặc trị liệu — đây là công cụ phản tư, không phải y tế',
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
      name: 'Hiểu bản thân',
      item: `https://hieu.asia/lo-trinh/${SLUG}`,
    },
  ],
};

export default function HieuBanThanPage() {
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

        <section className="relative mx-auto max-w-4xl px-6 pb-10 pt-6 sm:pt-8">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-gold">
              Trang chủ
            </Link>
            <span className="mx-1.5">/</span>
            <Link href="/lo-trinh" className="hover:text-gold">
              Lộ trình
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-muted-foreground">Hiểu bản thân</span>
          </nav>

          <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gold/10 text-gold">
            <Compass className="h-5 w-5" aria-hidden />
          </div>
          <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold-700">
            Lộ trình · Tôi muốn hiểu bản thân
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Hiểu bản thân — một bức chân dung trung thực
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Không phải lời tiên tri, cũng không phải động viên rỗng. Lộ trình này dựng
            chân dung của bạn từ ba lớp — Tử Vi, MBTI, Thần Số — để bạn thấy điểm mạnh,
            vùng tối, và kiểu năng lượng đang vận hành đời mình.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link href={`/onboarding/topic?topic=${TOPIC}`}>
              Bắt đầu lập lá số
            </Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/onboarding/topic?topic=self">
              
                Bắt đầu hành trình cá nhân
              
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

          <ExpertContent className="mt-6 rounded-xl border border-gold/30 bg-gold/5 p-5 text-sm leading-relaxed text-foreground/85">
            <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold-700">
              Bộ khung Tử Vi đang dùng
            </p>
            <p className="mt-2">
              Lộ trình này soi <strong className="text-foreground">cung Mệnh</strong> (khí chất),{' '}
              <strong className="text-foreground">cung Thân</strong> (vận hành đời sống),
              tam phương tứ chính (Quan Lộc · Tài Bạch · Thiên Di) và{' '}
              <strong className="text-foreground">cung Phúc Đức</strong> nền. Đại vận hiện hành
              cùng tiểu hạn năm hiện tại được dùng để gợi ý cửa sổ phát triển — không phải
              tiên đoán cố định.
            </p>
          </ExpertContent>
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
                <BeginnerContent className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {qa.beginner}
                </BeginnerContent>
                <ExpertContent className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {qa.expert}
                </ExpertContent>
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
          <LoTrinhChart
            topic="general"
            focusPalaces={['Mệnh', 'Phúc Đức', 'Tật Ách']}
          />
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
