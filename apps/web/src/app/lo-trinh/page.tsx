import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Compass,
  Briefcase,
  Heart,
  Calendar,
  Coffee,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';

export const metadata: Metadata = {
  title: 'Lộ trình theo nhu cầu',
  description:
    'Chọn lộ trình theo nhu cầu thực tế: hiểu bản thân, sự nghiệp, tình cảm, kế hoạch năm, hoặc tra cứu hằng ngày. Mỗi lộ trình gợi ý đúng công cụ — bạn không phải đọc hết menu sản phẩm.',
  alternates: { canonical: 'https://hieu.asia/lo-trinh' },
  openGraph: {
    title: 'Lộ trình theo nhu cầu',
    description:
      'Năm lộ trình theo nhu cầu thực tế — từ hiểu bản thân đến lập kế hoạch năm và tra cứu nhanh hằng ngày.',
    url: 'https://hieu.asia/lo-trinh',
    type: 'website',
  },
};

type Route = {
  slug: string;
  title: string;
  Icon: typeof Compass;
  framing: string;
  kit: string[];
};

const ROUTES: Route[] = [
  {
    slug: 'hieu-ban-than',
    title: 'Tôi muốn hiểu bản thân',
    Icon: Compass,
    framing:
      'Bạn muốn một bức chân dung trung thực: điểm mạnh, vùng tối, kiểu năng lượng và lý do mình hay vướng cùng một loại vấn đề.',
    kit: ['Lá số tổng quan + cung Mệnh–Thân', 'MBTI + Thần Số Học bổ trợ', 'Cẩm nang cá nhân PDF'],
  },
  {
    slug: 'su-nghiep',
    title: 'Tôi đang phân vân sự nghiệp',
    Icon: Briefcase,
    framing:
      'Bạn đang đứng giữa ngã ba: ở lại, đổi việc, hay tự làm. Bạn cần một góc nhìn tỉnh táo để tách "cảm giác mệt" khỏi "cơ hội thật".',
    kit: ['Cung Quan Lộc + Tài Bạch + Thiên Di', 'Decision Brief cho lựa chọn nghề', 'Đại vận + lưu niên kế hoạch năm'],
  },
  {
    slug: 'tinh-cam',
    title: 'Tôi đang gặp vấn đề tình cảm / gia đình',
    Icon: Heart,
    framing:
      'Một mối quan hệ đang nặng, hoặc bạn muốn hiểu kiểu gắn bó của mình và người kia trước khi quyết định bước tiếp.',
    kit: ['Cung Phu Thê + Phúc Đức + Nô Bộc', 'Hợp tuổi & tương hợp', 'Decision Brief cho quan hệ'],
  },
  {
    slug: 'ke-hoach-nam',
    title: 'Tôi muốn lập kế hoạch năm',
    Icon: Calendar,
    framing:
      'Bạn muốn nhìn cả năm: tháng nào nên đẩy, tháng nào nên giữ, đại vận đang vào pha gì. Một bản đồ thời điểm cho 12 tháng tới.',
    kit: ['Đại vận hiện tại', 'Lưu niên 2026', 'Annual Planner + Monthly Review'],
  },
  {
    slug: 'hang-ngay',
    title: 'Tôi muốn tra cứu nhanh hằng ngày',
    Icon: Coffee,
    framing:
      'Bạn không cần báo cáo dài — chỉ cần một câu gợi ý đúng buổi sáng, một ngày tốt cho cuộc họp, hoặc một lời nhắc khi vận chuyển pha.',
    kit: ['Tử Vi hôm nay', 'Lịch Vạn Niên + Ngày tốt', 'Telegram bot @hieuasiabot'],
  },
];

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'Lộ trình', item: 'https://hieu.asia/lo-trinh' },
  ],
};

export default function LoTrinhHubPage() {
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

        <section className="relative mx-auto max-w-5xl px-6 pb-10 pt-12 sm:pt-16">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-gold">
              Trang chủ
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-muted-foreground">Lộ trình</span>
          </nav>

          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold-700">
            Lộ trình theo nhu cầu
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Bạn đang muốn hiểu điều gì?
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Chọn lộ trình phù hợp — chúng tôi sẽ gợi ý đúng công cụ thay vì bắt bạn đọc hết
            menu sản phẩm.
          </p>
        </section>

        <section className="relative mx-auto max-w-5xl px-6 pb-12">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ROUTES.map((r) => {
              const Icon = r.Icon;
              return (
                <Card
                  key={r.slug}
                  className="flex h-full flex-col border-border bg-card/40 transition-colors hover:border-gold/40"
                >
                  <CardHeader className="pb-3">
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 text-gold">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <CardTitle className="font-heading text-lg text-foreground">
                      {r.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                      {r.framing}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col justify-between gap-4">
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      {r.kit.map((k) => (
                        <li key={k} className="flex gap-2">
                          <span aria-hidden className="mt-1 inline-block h-1 w-1 shrink-0 rounded-full bg-gold/70" />
                          <span>{k}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild variant="outline" className="w-full justify-between"><Link href={`/lo-trinh/${r.slug}`}>
                      
                        Bắt đầu lộ trình
                        <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                      
                    </Link></Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="relative mx-auto max-w-5xl px-6 pb-20">
          <div className="rounded-xl border border-border bg-card/40 p-6 sm:p-8">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-1 h-5 w-5 shrink-0 text-gold" aria-hidden />
                <div>
                  <h2 className="font-heading text-lg font-semibold text-foreground">
                    Không chắc cần gì?
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Lập một lá số tổng quan trước — sau đó hệ thống sẽ gợi ý lộ trình
                    phù hợp dựa trên cấu trúc lá số của bạn.
                  </p>
                </div>
              </div>
              <Button asChild><Link href="/onboarding/topic" className="shrink-0">
                Lập lá số tổng quan
              </Link></Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <StickyMobileCta trackId="lo-trinh" />
    </div>
  );
}
