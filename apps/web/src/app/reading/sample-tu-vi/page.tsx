import type * as React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Briefcase,
  Heart,
  Wallet,
  ShieldCheck,
} from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { ResultDisclaimer } from '@/components/ResultDisclaimer';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';

/**
 * Wave 60.95.m P0 — public SSR teaser at `/reading/sample-tu-vi`.
 *
 * Why this exists:
 *   - Before this route, the path matched `/reading/[id]` whose layout
 *     sets `robots: noindex,follow` and whose body streams a `<Skeleton>`
 *     fallback. Bots, social crawlers, and unauthed visitors got NO content.
 *   - This static segment takes precedence over the dynamic `[id]` route
 *     (Next.js routing: static > dynamic), so requests for sample-tu-vi land
 *     here with full SSR content + indexable metadata (set in `./layout.tsx`).
 *
 * Content choice:
 *   - Self-contained teaser (4 cung + 30-60-90 outline), not a re-import of
 *     `/sample-report`. The full page lives at `/sample-report`; this route
 *     is the "in-flow" sample a user lands on from `/reading/[id]/...` deep
 *     links and social shares. CTA at the end funnels to /sample-report for
 *     the deeper view and /onboarding for the real flow.
 *   - TODO: Wave 60.96 — replace inline persona content with a shared
 *     `apps/web/src/data/sample-tu-vi.ts` data file once the canonical
 *     sample-reading payload is defined upstream.
 */

const PERSONA = {
  name: 'Minh Anh (demo)',
  birthSolar: '15/08/1990, 10:00',
  birthLunar: '25/06 Canh Ngọ',
  zodiac: 'Tuổi Ngọ',
  mbti: 'INTJ',
};

type IconType = React.ComponentType<{ className?: string }>;
const PALACE_TEASER: { icon: IconType; palace: string; summary: string; insights: string[] }[] = [
  {
    icon: Sparkles,
    palace: 'Mệnh — Thân',
    summary:
      'Mệnh tại Dần có Tử Vi + Thiên Phủ (Khoa Khôi Việt). Thân đồng cung — bạn nhất quán giữa nội tâm và hành động.',
    insights: [
      'Khí chất ổn định, giữ chữ tín, có khả năng dẫn dắt nhóm nhỏ.',
      'Cần thời gian suy nghĩ trước khi quyết định — đừng để bị ép trong khủng hoảng.',
    ],
  },
  {
    icon: Briefcase,
    palace: 'Quan Lộc (sự nghiệp)',
    summary:
      'Vũ Khúc Hoá Quyền tại Ngọ, tam phương có Thái Dương — kỷ luật cộng với sức ảnh hưởng.',
    insights: [
      'Hợp vai trò chuyên gia có thẩm quyền, không hợp việc lặp đi lặp lại.',
      'Giai đoạn 26–35: xây nền chuyên môn, không vội chuyển ngành.',
    ],
  },
  {
    icon: Wallet,
    palace: 'Tài Bạch',
    summary:
      'Thiên Phủ giữ tài, có Khoa hỗ trợ. Phong cách quản lý tiền: cẩn trọng nhưng có tích luỹ.',
    insights: [
      'Khuynh hướng tiết kiệm tự nhiên, dễ tích luỹ qua chuyên môn.',
      'Lộ trình tài chính: ưu tiên emergency fund 6 tháng trước khi mở rộng.',
    ],
  },
  {
    icon: Heart,
    palace: 'Phu Thê',
    summary:
      'Thái Âm + Thiên Đồng tại Phu Thê — kiểu gắn bó cần sự an toàn cảm xúc.',
    insights: [
      'Bạn dễ vướng người trầm tính, ít nói, có chiều sâu nội tâm.',
      'Điều cần học: nói ra kỳ vọng SỚM, không đợi đối phương "đoán".',
    ],
  },
];

const PLAN_OUTLINE = [
  { period: '30 ngày', title: 'Củng cố vai trò chuyên môn' },
  { period: '60 ngày', title: 'Đánh giá môi trường và cơ hội' },
  { period: '90 ngày', title: 'Quyết định dựa trên dữ kiện' },
];

const ARTICLE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  inLanguage: 'vi-VN',
  headline: 'Mẫu báo cáo Tử Vi — Cẩm Nang cá nhân hoá',
  description:
    'Lá số Tử Vi mẫu công khai trên hieu.asia: 12 cung, đối thoại Mentor, kế hoạch 30-60-90 ngày.',
  url: 'https://hieu.asia/reading/sample-tu-vi',
  author: { '@type': 'Organization', name: 'hieu.asia' },
  publisher: { '@type': 'Organization', name: 'hieu.asia' },
  image: 'https://hieu.asia/og-image.jpg',
  isPartOf: { '@type': 'WebSite', name: 'hieu.asia', url: 'https://hieu.asia' },
};

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'Lá số', item: 'https://hieu.asia/reading' },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Mẫu Tử Vi',
      item: 'https://hieu.asia/reading/sample-tu-vi',
    },
  ],
};

export default function SampleTuViPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />

      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(ellipse_at_top,_rgba(184,146,61,0.10)_0%,_transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(184,146,61,0.18)_0%,_transparent_55%)]"
        />

        {/* Hero */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10 pt-12 sm:pt-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
            Mẫu lá số · Tử Vi Bắc phái
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Mẫu báo cáo Tử Vi
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/85 sm:text-lg">
            Đây là báo cáo demo cho một persona giả định — không phải thông tin có
            thật. Mục đích: để bạn thấy hieu.asia trả về gì trước khi quyết định
            lập lá số của riêng mình.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Bản đầy đủ sẽ gồm 12 cung, đối thoại Mentor cá nhân hoá, kế hoạch
            30-60-90 ngày và 5 câu tự phản tư. Phía dưới là một lát cắt nhỏ để
            bạn cảm nhận giọng văn và độ sâu của Cẩm Nang.
          </p>

          <div className="mt-7 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-gold/5 px-3 py-1 text-gold/90">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden /> Persona demo · không có dữ liệu thật
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1 text-muted-foreground">
              Tử Vi Bắc phái 114 sao
            </span>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="relative mx-auto max-w-3xl px-6 pb-4">
          <ResultDisclaimer />
        </section>

        {/* Executive summary */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <Card className="border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-foreground sm:text-2xl">
                Tóm tắt 1 trang
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-foreground/85 sm:text-base">
              <div className="grid gap-2 text-xs sm:grid-cols-2">
                <Stat label="Tên" value={PERSONA.name} />
                <Stat label="Sinh" value={PERSONA.birthSolar} />
                <Stat label="Âm lịch" value={PERSONA.birthLunar} />
                <Stat label="Con giáp" value={PERSONA.zodiac} />
                <Stat label="MBTI" value={PERSONA.mbti} />
              </div>
              <p className="border-l-2 border-gold/40 pl-4">
                Bạn ở giai đoạn cần củng cố vai trò chuyên môn trước khi mở rộng.
                Quan Lộc tốt cộng Tài Bạch cẩn trọng — không hợp all-in đầu tư.
                Phu Thê cần học giao tiếp kỳ vọng sớm. 3 tháng tới: ưu tiên
                emergency fund, không quyết định nghề vội vàng.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 4 cung teaser */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <h2 className="mb-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Lá số 12 cung — xem trước 4 cung chính
          </h2>
          <p className="mb-5 text-sm text-muted-foreground">
            Bản đầy đủ phân tích cả 12 cung (Tử Tức, Nô Bộc, Thiên Di, Tật Ách,
            Điền Trạch, Phúc Đức, Phụ Mẫu).
          </p>
          <div className="space-y-4">
            {PALACE_TEASER.map((p, i) => {
              const Icon = p.icon;
              return (
                <Card key={i} className="border-border bg-card/40">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground sm:text-lg">
                      <Icon className="h-4 w-4 text-gold" aria-hidden /> {p.palace}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm leading-relaxed text-foreground/85 sm:text-base">
                      {p.summary}
                    </p>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {p.insights.map((s, j) => (
                        <li key={j} className="flex gap-2">
                          <span className="text-gold/85">·</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Plan outline */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <h2 className="mb-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Kế hoạch 30-60-90 ngày
          </h2>
          <p className="mb-5 text-sm text-muted-foreground">
            Bản đầy đủ liệt kê 3 việc cụ thể cho từng giai đoạn cộng 5 câu tự
            phản tư.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {PLAN_OUTLINE.map((p, i) => (
              <Card key={i} className="border-border bg-card/40">
                <CardContent className="pt-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-gold/80">
                    {p.period}
                  </p>
                  <p className="mt-1 font-heading text-sm font-semibold text-foreground">
                    {p.title}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative mx-auto max-w-3xl px-6 pb-20">
          <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Tạo lá số của riêng bạn
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85 sm:text-base">
              Mẫu trên là persona giả định. Bản của bạn cá nhân hoá theo ngày
              giờ sinh, MBTI (nếu có) và bối cảnh đời sống hiện tại. Hoàn tiền
              100% trong 24 giờ nếu báo cáo chưa được tạo.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/onboarding">Lập lá số của tôi</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/sample-report">Xem mẫu báo cáo đầy đủ</Link>
              </Button>
              <Link
                href="/methodology"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
              >
                Phương pháp luận
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <StickyMobileCta trackId="sample-tu-vi" />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 font-heading text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
