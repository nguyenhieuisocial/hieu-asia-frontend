/**
 * /community/cases — case study index (§8.6).
 *
 * Anonymized user narratives showing how Tử Vi + Decision Brief was applied.
 * Each case = process documentation, not outcome promise.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { listCaseStudies } from '@/lib/case-studies';

export const metadata: Metadata = {
  title: 'Case studies — quyết định thực tế qua Tử Vi',
  description:
    'Bộ câu chuyện đã được ẩn danh: người dùng đã ra quyết định nghề nghiệp, gia đình, tài chính như thế nào sau khi đọc lá số.',
  alternates: { canonical: 'https://hieu.asia/community/cases' },
  openGraph: {
    title: 'Case studies',
    description: 'Quy trình ra quyết định thực tế, không phải lời hứa kết quả.',
    url: 'https://hieu.asia/community/cases',
    type: 'website',
  },
};

export default function CaseStudiesIndexPage() {
  const cases = listCaseStudies();
  return (
    <>
      <SiteNav />
      <main id="main-content" className="min-h-screen bg-background text-foreground pt-16">
        <section className="relative isolate overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,_rgba(59,39,84,0.4)_0%,_transparent_55%)]"
          />
          <div className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-24">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold/80 sm:text-xs">
              Cộng đồng / Case studies
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
              Quy trình thật,{' '}
              <span className="bg-gold-gradient bg-clip-text text-transparent">
                không phải lời hứa
              </span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Mỗi câu chuyện là một quyết định khó. Chúng tôi không chia sẻ kết quả
              — chia sẻ cách người đó nhìn lá số, kết hợp với hoàn cảnh, rồi đi
              tới quyết định mà họ thấy thoải mái nhất.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Tất cả case đều được ẩn danh và xin phép trước khi xuất bản.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="mx-auto max-w-4xl px-6">
            <div className="space-y-6">
              {cases.map((c) => (
                <article
                  key={c.slug}
                  className="group rounded-2xl border border-border bg-card/40 p-6 transition-all hover:border-gold/40 hover:shadow-[0_0_40px_-12px_rgba(184,146,61,0.4)] sm:p-8"
                >
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-mono uppercase tracking-[0.2em] text-gold/70">
                      {c.year}
                    </span>
                    <span aria-hidden>·</span>
                    <span>{c.persona}</span>
                  </div>
                  <h2 className="mt-3 font-heading text-xl font-semibold text-foreground sm:text-2xl">
                    <Link
                      href={`/community/cases/${c.slug}`}
                      className="transition-colors hover:text-gold"
                    >
                      {c.title}
                    </Link>
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {c.excerpt}
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <Link
                      href={`/community/cases/${c.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-gold/90 transition-colors hover:text-gold"
                    >
                      Đọc đầy đủ
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {new Date(c.publishedAt).toLocaleDateString('vi-VN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-border bg-card/30 p-6 text-center">
              <BookOpen className="mx-auto h-6 w-6 text-gold/70" aria-hidden="true" />
              <p className="mt-3 text-sm text-muted-foreground">
                Bạn đã ra một quyết định khó sau khi đọc lá số?{' '}
                <a
                  href="mailto:hi@hieu.asia?subject=Case%20study%20cho%20hieu.asia"
                  className="font-medium text-gold/90 underline-offset-4 transition-colors hover:text-gold hover:underline"
                >
                  Chia sẻ với chúng tôi
                </a>{' '}
                — case của bạn sẽ được ẩn danh hoá trước khi xuất bản, và bạn có
                quyền chỉnh sửa hoặc rút lại bất cứ lúc nào.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
