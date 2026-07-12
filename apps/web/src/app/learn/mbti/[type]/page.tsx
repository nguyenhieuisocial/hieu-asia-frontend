import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import {
  ArrowRight,
  Sparkles,
  Compass,
  TrendingUp,
  Brain,
  Briefcase,
  Heart,
  Sun,
  CloudRain,
  Shuffle,
  Sprout,
} from 'lucide-react';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, faqPage } from '@/lib/seo/jsonld';
import { buildType, listTypes, MBTI_SLUGS, type TypeRef } from '@/lib/mbti-type-data';

export const dynamicParams = false;

export function generateStaticParams() {
  return MBTI_SLUGS.map((type) => ({ type }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const d = buildType(type);
  if (!d) return { title: 'MBTI' };
  const url = `https://hieu.asia/learn/mbti/${d.slug}`;
  return {
    title: d.seoTitle,
    description: d.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title: d.seoTitle,
      description: d.seoDescription,
      url,
      type: 'article',
      locale: 'vi_VN',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: d.seoTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: d.seoTitle,
      description: d.seoDescription,
      images: [{ url: '/og-image.jpg', alt: d.seoTitle }],
    },
  };
}

function TypeChip({ t }: { t: TypeRef }) {
  return (
    <Link
      href={`/learn/mbti/${t.slug}`}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1.5 text-sm text-foreground/80 transition hover:border-gold/40 hover:text-gold"
    >
      <span className="font-mono text-xs font-semibold tracking-wide text-gold-700">{t.code}</span>
      <span className="text-muted-foreground">{t.nick}</span>
    </Link>
  );
}

export default async function MbtiTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const d = buildType(type);
  if (!d) notFound();

  const others = listTypes().filter((t) => t.code !== d.code);

  const JSONLD = [
    article({
      headline: d.seoTitle,
      description: d.seoDescription,
      url: `/learn/mbti/${d.slug}`,
      image: '/og-image.jpg',
      datePublished: '2026-06-22',
      dateModified: '2026-06-22',
      type: 'Article',
    }),
    breadcrumb([
      { name: 'Trang chủ', url: '/' },
      { name: 'Học huyền học', url: '/learn' },
      { name: 'MBTI', url: '/learn/mbti' },
      { name: `${d.code} — ${d.nick}`, url: `/learn/mbti/${d.slug}` },
    ]),
    faqPage(d.faqs),
  ];

  return (
    <>
      <JsonLd data={JSONLD} />

      {/* Hero */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10 pt-6 sm:pt-8">
        <nav aria-label="Breadcrumb" className="mb-5 text-xs text-muted-foreground">
          <Link href="/learn" className="hover:text-gold">
            Học huyền học
          </Link>
          <span className="mx-1.5">/</span>
          <Link href="/learn/mbti" className="hover:text-gold">
            MBTI
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground/70">{d.code}</span>
        </nav>
        <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
          MBTI · {d.groupMeta.name} ({d.groupMeta.en})
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
          <span className="mr-3 font-mono text-gold">{d.code}</span>
          {d.nick}
        </h1>
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {d.letters}
        </p>
        <p className="mt-4 text-base leading-relaxed text-foreground/80 sm:text-lg">{d.tagline}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/mbti">Làm trắc nghiệm MBTI</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/learn/mbti">Cả 16 nhóm</Link>
          </Button>
        </div>
      </section>

      {/* Thẻ dữ kiện */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <div className="grid gap-3 sm:grid-cols-3">
          <Card className="border-border bg-card/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                <Sparkles className="h-4 w-4 text-gold" aria-hidden /> Nhóm lớn
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              {d.groupMeta.name}
              <span className="block text-xs text-muted-foreground/80">{d.groupMeta.en}</span>
            </CardContent>
          </Card>
          <Card className="border-border bg-card/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                <Brain className="h-4 w-4 text-gold" aria-hidden /> Chức năng trội
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              {d.stackDetail[0]?.fn}
              <span className="block text-xs text-muted-foreground/80">
                {d.stackDetail[0]?.gloss}
              </span>
            </CardContent>
          </Card>
          <Card className="border-border bg-card/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                <Compass className="h-4 w-4 text-gold" aria-hidden /> Chuỗi chức năng
              </CardTitle>
            </CardHeader>
            <CardContent className="font-mono text-sm leading-relaxed text-muted-foreground">
              {d.stack.join(' · ')}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tổng quan */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <h2 className="mb-3 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          {d.code} là người thế nào?
        </h2>
        <p className="text-base leading-relaxed text-foreground/85">{d.overview}</p>
      </section>

      {/* Điểm mạnh + Hướng phát triển */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="border-border bg-card/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                <TrendingUp className="h-4 w-4 text-emerald-400" aria-hidden /> Điểm mạnh nổi bật
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5 text-sm leading-relaxed text-foreground/80">
                {d.strengths.map((s) => (
                  <li key={s} className="flex gap-2">
                    <span aria-hidden className="text-emerald-400">
                      •
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-border bg-card/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                <Compass className="h-4 w-4 text-amber-400" aria-hidden /> Hướng phát triển
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5 text-sm leading-relaxed text-foreground/80">
                {d.growth.map((s) => (
                  <li key={s} className="flex gap-2">
                    <span aria-hidden className="text-amber-400">
                      •
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Điểm mạnh và hướng phát triển là <strong>xu hướng</strong> của nhóm {d.code}, không phải
          lời phán cố định. Ai cũng có thể rèn giũa theo hướng mình muốn.
        </p>
      </section>

      {/* Khi ở phong độ tốt + Dưới áp lực */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="border-border bg-card/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                <Sun className="h-4 w-4 text-amber-400" aria-hidden /> Khi ở phong độ tốt
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-foreground/80">
              {d.atBest}
            </CardContent>
          </Card>
          <Card className="border-border bg-card/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                <CloudRain className="h-4 w-4 text-sky-400" aria-hidden /> Dưới áp lực
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-foreground/80">
              {d.underStress}
            </CardContent>
          </Card>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Đây là những nếp <strong>thường thấy</strong> khi {d.code} phát triển lành mạnh hoặc khi
          căng thẳng kéo dài — mô tả để nhận ra và tự điều chỉnh, không phải điều bắt buộc xảy ra.
        </p>
      </section>

      {/* Chuỗi chức năng nhận thức */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <h2 className="mb-2 flex items-center gap-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          <Brain className="h-5 w-5 text-gold" aria-hidden /> Chuỗi chức năng nhận thức
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          Theo lý thuyết Jung, mỗi nhóm dùng bốn chức năng theo thứ tự ưu tiên — từ chức năng dùng
          tự nhiên nhất (trội) đến chức năng yếu, ít ý thức nhất (ẩn).
        </p>
        <ol className="space-y-2">
          {d.stackDetail.map((s, i) => (
            <li
              key={s.fn}
              className="flex items-start gap-3 rounded-lg border border-border bg-card/40 px-4 py-3"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold/40 font-heading text-xs text-gold-700">
                {i + 1}
              </span>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-base font-semibold text-foreground">{s.fn}</span>
                  <span className="font-mono text-[13px] uppercase tracking-[0.14em] text-muted-foreground">
                    {s.role}
                  </span>
                </div>
                <p className="mt-0.5 text-sm leading-relaxed text-foreground/80">{s.gloss}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Dễ nhầm với */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <h2 className="mb-2 flex items-center gap-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          <Shuffle className="h-5 w-5 text-gold" aria-hidden /> Dễ nhầm {d.code} với nhóm nào
        </h2>
        <p className="text-base leading-relaxed text-foreground/85">{d.commonConfusions}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Hai nhóm có thể trông giống nhau ở bề ngoài nhưng khác ở chuỗi chức năng bên trong. Khi
          phân vân, hãy nhìn cách một người <strong>ra quyết định</strong> và <strong>nạp năng
          lượng</strong>, chứ đừng chỉ nhìn hành vi.
        </p>
      </section>

      {/* Con đường trưởng thành */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <h2 className="mb-2 flex items-center gap-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          <Sprout className="h-5 w-5 text-emerald-400" aria-hidden /> Con đường trưởng thành của{' '}
          {d.code}
        </h2>
        <p className="text-base leading-relaxed text-foreground/85">{d.growthPath}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Trong lý thuyết chức năng nhận thức, phát triển thường đi từ việc dùng tốt chức năng{' '}
          <strong>phụ trợ</strong> và <strong>cấp ba</strong>, rồi dần làm hoà với chức năng kém — một
          hướng gợi ý để tự quan sát, không phải bài kiểm tra.
        </p>
      </section>

      {/* Công việc */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <h2 className="mb-2 flex items-center gap-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          <Briefcase className="h-5 w-5 text-gold" aria-hidden /> {d.code} trong công việc
        </h2>
        <p className="text-base leading-relaxed text-foreground/85">{d.workStyle}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Đây là xu hướng tham khảo theo khung MBTI, không phải giới hạn nghề nghiệp.
        </p>
      </section>

      {/* Quan hệ */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <h2 className="mb-2 flex items-center gap-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          <Heart className="h-5 w-5 text-rose-400" aria-hidden /> {d.code} trong các mối quan hệ
        </h2>
        <p className="text-base leading-relaxed text-foreground/85">{d.relationships}</p>
      </section>

      {/* Cùng nhóm lớn */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <h2 className="mb-3 font-heading text-lg font-semibold text-foreground">
          Cùng nhóm {d.groupMeta.name} ({d.groupMeta.en})
        </h2>
        <div className="flex flex-wrap gap-2">
          {d.groupMates.map((t) => (
            <TypeChip key={t.slug} t={t} />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          Câu hỏi thường gặp
        </h2>
        <div className="space-y-3">
          {d.faqs.map((f) => (
            <Card key={f.q} className="border-border bg-card/40">
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-base text-foreground">{f.q}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Bắt email */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <div className="rounded-xl border border-border bg-card/40 p-6">
          <h2 className="mb-3 font-heading text-lg font-semibold text-foreground">
            Nhận bài về MBTI &amp; hiểu mình
          </h2>
          <OccasionLeadCapture
            source={`mbti-type-${d.slug}`}
            capturedEvent="lead_capture_mbti_type"
            capturedProps={{ type: d.code }}
            blurb={`Để lại email, thi thoảng chúng tôi gửi bài giúp bạn hiểu sâu hơn về nhóm ${d.code}, 16 nhóm MBTI và cách áp dụng vào đời sống. Không spam.`}
            cta="Nhận bài"
          />
        </div>
      </section>

      {/* CTA → trắc nghiệm */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Bạn có phải {d.code} không?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
            Trang này mô tả nhóm {d.code} ({d.nick}). Để biết nhóm tính cách của riêng bạn, hãy làm
            bộ trắc nghiệm khoảng 5 phút — kết quả ngay, miễn phí, theo bốn trục lưỡng cực Jung.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/mbti">Làm trắc nghiệm MBTI</Link>
            </Button>
            <Link
              href="/learn/mbti"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
            >
              Tìm hiểu cả 16 nhóm <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* 15 nhóm còn lại */}
      <section className="relative mx-auto max-w-3xl px-6 pb-12">
        <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">Các nhóm khác</h2>
        <div className="flex flex-wrap gap-2">
          {others.map((t) => (
            <TypeChip key={t.slug} t={t} />
          ))}
        </div>
        <p className="mt-5 text-xs text-muted-foreground">
          MBTI là khung phân loại để tự phản tỉnh (dựa trên thuyết Jung), không phải chẩn đoán tâm
          lý hay lời phán số mệnh — mô tả xu hướng tự nhiên, có thể thay đổi theo giai đoạn cuộc đời.
        </p>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-12">
        <RelatedTools
          links={[
            { href: '/mbti', label: 'Trắc nghiệm MBTI' },
            { href: '/learn/mbti', label: 'Tìm hiểu MBTI' },
            { href: '/enneagram', label: 'Trắc nghiệm Enneagram' },
          ]}
        />
      </div>

      <StickyMobileCta href="/mbti" label="Làm trắc nghiệm" trackId={`mbti-type-${d.slug}`} />
    </>
  );
}
