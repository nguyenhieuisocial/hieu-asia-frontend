/**
 * Wave 60.98-FE — /cam-nang/[slug] single-pillar reader.
 *
 * Server component. Fetches the published pillar from the worker public
 * endpoint (`/content/public/pillars/:slug`), renders the markdown content
 * with a light prose pass + breadcrumb + sticky CTA.
 *
 * SEO: each pillar has its own canonical + OG metadata generated from the
 * fetched topic. 24h CDN cache at the worker edge means even uncached repeat
 * hits are < 50ms TTFB.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb } from '@/lib/seo/jsonld';
import { RevealOnScroll } from '@/components/motion/RevealOnScroll';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hieu.asia';

export const revalidate = 300; // 5-minute ISR — publish-to-live ≤ 5 min

interface PillarRow {
  slug: string;
  topic: string;
  published_at: string | null;
  updated_at: string;
  content: string;
  judge_pick: 'claude' | 'openai' | 'google';
}

interface PillarResponse {
  ok?: boolean;
  pillar?: PillarRow;
  error?: string;
}

async function fetchPillar(slug: string): Promise<PillarRow | null> {
  try {
    const r = await fetch(`${API_BASE}/content/public/pillars/${encodeURIComponent(slug)}`, {
      next: { revalidate: 300, tags: ['pillars', `pillar:${slug}`] },
    });
    if (!r.ok) return null;
    const data = (await r.json()) as PillarResponse;
    return data.pillar ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const pillar = await fetchPillar(slug);
  if (!pillar) {
    return { title: 'Không tìm thấy bài cẩm nang' };
  }
  const url = `https://hieu.asia/cam-nang/${pillar.slug}`;
  return {
    title: `${pillar.topic} — Cẩm nang`,
    description: pillar.content.replace(/\s+/g, ' ').trim().slice(0, 157).replace(/\s\S*$/, '') + '…',
    alternates: { canonical: url },
    openGraph: {
      title: pillar.topic,
      description: 'Cẩm nang chuyên đề trên hieu.asia — đối chiếu nhiều nguồn, biên tập tay, nói thẳng giới hạn.',
      url,
      type: 'article',
      publishedTime: pillar.published_at ?? undefined,
      modifiedTime: pillar.updated_at,
      images: [{ url: 'https://hieu.asia/og-image.jpg', width: 1200, height: 630, alt: pillar.topic }],
    },
    twitter: { card: 'summary_large_image', title: pillar.topic, images: ['https://hieu.asia/og-image.jpg'] },
  };
}

/**
 * Minimal markdown → HTML renderer. The pillar content is already
 * sanitised by the multi-LLM pipeline + founder review, so we just need
 * paragraph wrapping + heading detection. We avoid pulling in `marked` /
 * `react-markdown` to keep this RSC route's bundle near zero.
 */
function renderMarkdown(md: string): string {
  const escape = (s: string) =>
    s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  // Inline formatting — run on ALREADY-ESCAPED text. Chỉ cho phép link nội bộ
  // (/...) hoặc https:// (chặn javascript:/khác). Hỗ trợ [text](url) và **bold**.
  const inline = (s: string) =>
    s
      .replace(
        /\[([^\]]+)\]\((\/[^)\s]*|https:\/\/[^)\s]+)\)/g,
        '<a href="$2" class="text-gold underline underline-offset-2 hover:opacity-80">$1</a>',
      )
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
  const fmt = (s: string) => inline(escape(s));
  const lines = md.split('\n');
  const out: string[] = [];
  let inList = false;
  const flushList = () => {
    if (inList) {
      out.push('</ul>');
      inList = false;
    }
  };
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushList();
      continue;
    }
    if (line.startsWith('### ')) {
      flushList();
      out.push(`<h3 class="mt-8 font-heading text-xl font-semibold text-foreground">${fmt(line.slice(4))}</h3>`);
    } else if (line.startsWith('## ')) {
      flushList();
      out.push(`<h2 class="mt-10 font-heading text-2xl font-semibold text-foreground">${fmt(line.slice(3))}</h2>`);
    } else if (line.startsWith('# ')) {
      flushList();
      out.push(`<h2 class="mt-10 font-heading text-2xl font-semibold text-foreground">${fmt(line.slice(2))}</h2>`);
    } else if (/^[-*]\s+/.test(line)) {
      if (!inList) {
        out.push('<ul class="mt-3 ml-5 list-disc space-y-1 text-foreground/85">');
        inList = true;
      }
      out.push(`<li>${fmt(line.replace(/^[-*]\s+/, ''))}</li>`);
    } else {
      flushList();
      out.push(`<p class="mt-4 leading-relaxed text-foreground/85">${fmt(line)}</p>`);
    }
  }
  flushList();
  return out.join('\n');
}

function formatDate(iso: string | null): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  } catch {
    return '';
  }
}

export default async function PillarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pillar = await fetchPillar(slug);
  if (!pillar) notFound();

  const articleDescription = pillar.content.replace(/\s+/g, ' ').trim().slice(0, 157).replace(/\s\S*$/, '') + '…';

  return (
    <>
      <SiteNav />
      <JsonLd
        data={[
          article({
            headline: pillar.topic,
            description: articleDescription,
            url: `/cam-nang/${pillar.slug}`,
            datePublished: pillar.published_at ?? undefined,
            dateModified: pillar.updated_at,
            type: 'Article',
          }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Cẩm nang', url: '/cam-nang' },
            { name: pillar.topic, url: `/cam-nang/${pillar.slug}` },
          ]),
        ]}
      />
      <main id="main-content" className="min-h-screen bg-background text-foreground pt-16">
        <article className="mx-auto max-w-2xl px-6 py-16">
          <Link
            href="/cam-nang"
            className="inline-flex items-center gap-1 font-mono text-eyebrow uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-3 w-3" aria-hidden /> Cẩm nang
          </Link>

          <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            {pillar.topic}
          </h1>
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            Xuất bản {formatDate(pillar.published_at)} · cập nhật{' '}
            {formatDate(pillar.updated_at)} · biên tập tay bởi founder
          </p>

          <div
            className="mt-8 text-base"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(pillar.content) }}
          />

          <RevealOnScroll>
            <div className="rv-up mt-12 rounded-card-editorial border border-gold/20 bg-gradient-to-br from-gold/10 to-gold/0 p-6">
              <p className="font-heading text-lg font-semibold text-foreground">
                Muốn lá số chi tiết riêng cho bạn?
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Lập lá số miễn phí trong 30 giây — không cần tài khoản, không
                cần thanh toán.
              </p>
              <Link
                href="/onboarding"
                className="mt-4 inline-flex items-center gap-2 rounded-pill bg-gold px-5 py-2.5 font-heading text-sm font-semibold text-ink shadow-md shadow-gold/20 transition-colors hover:bg-gold-soft"
              >
                Lập lá số miễn phí →
              </Link>
            </div>
          </RevealOnScroll>
        </article>
      </main>
      <SiteFooter />
      <StickyMobileCta trackId={`cam-nang-${pillar.slug}`} />
    </>
  );
}
