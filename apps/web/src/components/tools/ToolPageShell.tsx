import * as React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { RelatedTools } from '@/components/tools/RelatedTools';

export interface ToolPageShellProps {
  eyebrow: string;
  title: React.ReactNode;
  description: React.ReactNode;
  icon?: React.ReactNode;
  /** When set, renders a small breadcrumb row under the hero. */
  breadcrumb?: { label: string; href?: string }[];
  /** Optional CTA row in the hero, e.g. quick action buttons. */
  heroAction?: React.ReactNode;
  /** Khi set, render khối "Công cụ liên quan" (tra RELATED_TOOLS theo route) ở cuối trang. */
  relatedSlug?: string;
  /** Page content below the hero. */
  children: React.ReactNode;
}

/**
 * Premium shell for tool pages.
 *
 * Layout: SiteNav (fixed) → decorative hero with gold-gradient accent on title →
 * children in a centered max-w container → SiteFooter.
 *
 * Background uses `bg-ink-radial` plus a soft gold glow blob in the top-right
 * for visual depth without distracting from content.
 */
export function ToolPageShell({
  eyebrow,
  title,
  description,
  icon,
  breadcrumb,
  heroAction,
  relatedSlug,
  children,
}: ToolPageShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <main id="main-content" className="relative overflow-hidden pt-16">
        {/* Decorative glows — purely visual, ignored by screen readers */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-ink-radial opacity-90"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-gold/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 left-[-15%] h-[360px] w-[360px] rounded-full bg-purple/20 blur-3xl"
        />

        <section className="relative">
          <div className="mx-auto max-w-6xl px-6 pt-6 pb-8 sm:pt-8 sm:pb-12">
            {breadcrumb && breadcrumb.length > 0 && (
              <nav aria-label="Breadcrumb" className="mb-4">
                <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                  {breadcrumb.map((b, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      {b.href ? (
                        <Link href={b.href} className="transition-colors hover:text-gold">
                          {b.label}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">{b.label}</span>
                      )}
                      {i < breadcrumb.length - 1 && (
                        <ChevronRight className="h-3 w-3 text-foreground/30" aria-hidden="true" />
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <div className="flex items-start gap-5">
              {icon && (
                <div
                  aria-hidden="true"
                  className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/15 via-background to-purple/20 text-3xl shadow-[0_0_40px_-12px_rgba(184,146,61,0.45)] sm:flex"
                >
                  {icon}
                </div>
              )}
              <div className="flex-1">
                <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-primary">
                  {eyebrow}
                </p>
                <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
                  {title}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {description}
                </p>
                {heroAction && <div className="mt-6">{heroAction}</div>}
              </div>
            </div>
          </div>
        </section>

        <div className="relative mx-auto max-w-6xl px-6 pb-20 sm:pb-24">
          {children}
          {relatedSlug && (
            <div className="mt-12 border-t border-border pt-6">
              <RelatedTools current={relatedSlug} />
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

/**
 * Convenience: gold-gradient inline accent for titles.
 * Use inside `title` prop, e.g. `<>Lịch <Gold>Vạn Niên</Gold></>`.
 */
export function GoldAccent({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gold-gradient bg-clip-text text-transparent">{children}</span>
  );
}
