'use client';

/**
 * LearnArticleView — the interactive (client) half of the /learn editorial
 * template. The public entry point is the `LearnArticle` server wrapper in
 * ./LearnArticle.tsx, which keys each section's element-valued `heading`/`children`
 * before they cross the RSC boundary into this client component (otherwise React's
 * Flight serializer logs a dev-only "unique key" warning for every /learn page).
 * Pages import `LearnArticle`, never this view directly.
 *
 * Spec: trang-hoc-preview.html (founder-approved, sub-page upgrade #3). Intent =
 * one reusable template every /learn topic shares:
 *   • a top reading-progress bar           → reuses <ReadingProgress> (report)
 *   • a sticky desktop table-of-contents that highlights the current section
 *     (scroll-spy via IntersectionObserver) + numbered mono index
 *   • a mobile "jump to section" sheet      → reuses <FloatingTOC> (generic)
 *   • clean section hierarchy (numbered H2s, generous rhythm)
 *   • a "giờ thử công cụ" CTA at the end
 *   • related-lens cards (read from the lens catalog)
 *
 * The page supplies its METADATA (eyebrow/title/standfirst/breadcrumb) and its
 * SECTIONS (id + toc label + heading + body). All written content lives in the
 * section bodies — this template only provides chrome, so educational copy is
 * preserved verbatim by the pages that use it.
 *
 * Editorial tokens (match the in-app learn design system, which renders on the
 * dark ink theme via LearnLayout): font-heading / font-mono, gold + gold-700,
 * border-border, bg-card, rounded-card-editorial. The preview's light-paper hex
 * palette is intentionally adapted to these existing tokens — same structure,
 * native theme.
 */

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@hieu-asia/ui';
import { ReadingProgress } from '@/components/report/ReadingProgress';
import { FloatingTOC } from '@/components/ui/FloatingTOC';

export interface LearnSection {
  /** DOM id + TOC anchor target (kebab-case, unique on the page). */
  id: string;
  /** Short label shown in the table of contents. */
  tocLabel: string;
  /** Section heading rendered as the numbered <h2>. */
  heading: React.ReactNode;
  /** Section body — any existing page content goes here, unchanged. */
  children: React.ReactNode;
  /** Optional extra classes on the <section> (e.g. card framing). */
  className?: string;
}

export interface LearnBreadcrumbItem {
  label: string;
  href?: string;
}

export interface LearnRelatedLens {
  /** mono eyebrow, uppercase (e.g. "NGŨ HÀNH"). */
  eyebrow: string;
  /** lens name (e.g. "Bát Tự"). */
  name: string;
  href: string;
}

export interface LearnTryCta {
  heading: string;
  blurb: string;
  href: string;
  label: string;
}

export interface LearnArticleProps {
  /** mono eyebrow above the H1 (e.g. "HỌC · TỬ VI ĐẨU SỐ"). */
  eyebrow: string;
  /** H1 — pass a node so the page keeps its gold-gradient span. */
  title: React.ReactNode;
  /** standfirst / sub-deck below the H1. */
  standfirst: React.ReactNode;
  /** optional reading meta line (e.g. "8 phút đọc · Cập nhật 2026"). */
  readMeta?: React.ReactNode;
  /** breadcrumb trail; last item is the current page (no href). */
  breadcrumb: LearnBreadcrumbItem[];
  /** the article body, in order. The TOC is built from these. */
  sections: LearnSection[];
  /** end-of-article "try the tool" call to action. */
  tryCta: LearnTryCta;
  /** related lenses to surface as cards; omit to hide the related block. */
  relatedLenses?: LearnRelatedLens[];
  /** heading for the related-lenses block (mono). */
  relatedHeading?: string;
  /** non-TOC extras (e.g. <JsonLd>) rendered before the article. */
  children?: React.ReactNode;
}

const CTA_ANCHOR = 'thu-cong-cu';

export function LearnArticleView({
  eyebrow,
  title,
  standfirst,
  readMeta,
  breadcrumb,
  sections,
  tryCta,
  relatedLenses = [],
  relatedHeading = 'Các lăng kính khác',
  children,
}: LearnArticleProps) {
  // TOC entries = the article sections + a trailing link to the try-CTA.
  const tocItems = React.useMemo(
    () => [
      ...sections.map((s) => ({ id: s.id, label: s.tocLabel })),
      { id: CTA_ANCHOR, label: 'Thử ngay' },
    ],
    [sections],
  );

  const [activeId, setActiveId] = React.useState<string | undefined>(
    tocItems[0]?.id,
  );
  const reducedMotionRef = React.useRef(false);

  React.useEffect(() => {
    try {
      reducedMotionRef.current = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
    } catch {
      /* ignore */
    }
  }, []);

  // Scroll-spy: highlight the section currently in the upper viewport band.
  React.useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const ids = tocItems.map((t) => t.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-15% 0px -75% 0px', threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [tocItems]);

  const handleTocClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    setActiveId(id);
    el.scrollIntoView({
      behavior: reducedMotionRef.current ? 'auto' : 'smooth',
      block: 'start',
    });
    // Update the hash without an extra scroll jump.
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <>
      <ReadingProgress />

      <main className="mx-auto max-w-6xl px-6 pt-6 pb-12 sm:pt-8 sm:pb-16">
        {children}

        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground"
        >
          {breadcrumb.map((item, i) => {
            const last = i === breadcrumb.length - 1;
            return (
              <React.Fragment key={`${item.label}-${i}`}>
                {item.href && !last ? (
                  <Link href={item.href} className="hover:text-gold">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-muted-foreground">{item.label}</span>
                )}
                {!last && <span aria-hidden="true">/</span>}
              </React.Fragment>
            );
          })}
        </nav>

        <header className="mb-10 max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold-700">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {standfirst}
          </p>
          {readMeta ? (
            <p className="mt-5 border-t border-border pt-4 font-mono text-[11px] tracking-[0.06em] text-muted-foreground">
              {readMeta}
            </p>
          ) : null}
        </header>

        {/* Two-column editorial layout: sticky TOC sidebar + article body.
            Sidebar collapses on < lg (mobile uses the FloatingTOC sheet). */}
        <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12">
          <nav
            aria-label="Mục lục bài viết"
            className="hidden lg:block lg:sticky lg:top-24 lg:self-start"
          >
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Trong bài
            </p>
            <ul className="space-y-px">
              {tocItems.map((item, i) => {
                const isActive = item.id === activeId;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => handleTocClick(e, item.id)}
                      aria-current={isActive ? 'true' : undefined}
                      className={cn(
                        'flex items-baseline gap-2 border-l-2 py-1.5 pl-3 font-mono text-xs transition-colors',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40',
                        isActive
                          ? 'border-gold text-gold'
                          : 'border-border text-muted-foreground hover:text-foreground',
                      )}
                    >
                      <span aria-hidden="true" className="text-[10px] opacity-70">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <article className="min-w-0">
            {sections.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                className={cn(
                  'scroll-mt-24 border-b border-border/60 py-8 first:pt-0',
                  s.className,
                )}
              >
                <h2 className="mb-4 font-heading text-xl font-bold text-foreground sm:text-2xl">
                  <span
                    aria-hidden="true"
                    className="mr-3 font-mono text-base text-gold-700"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {s.heading}
                </h2>
                {s.children}
              </section>
            ))}

            {/* Try-the-tool CTA */}
            <section
              id={CTA_ANCHOR}
              aria-labelledby={`${CTA_ANCHOR}-heading`}
              className="scroll-mt-24 py-8"
            >
              <div className="flex flex-col gap-5 rounded-card-editorial border border-gold/25 bg-card/40 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div>
                  <h2
                    id={`${CTA_ANCHOR}-heading`}
                    className="font-heading text-xl font-bold text-foreground sm:text-2xl"
                  >
                    {tryCta.heading}
                  </h2>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                    {tryCta.blurb}
                  </p>
                </div>
                <Link
                  href={tryCta.href}
                  className="inline-flex shrink-0 items-center justify-center rounded-card-editorial bg-gold px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-gold-soft"
                >
                  {tryCta.label}
                </Link>
              </div>
            </section>

            {/* Related lenses */}
            {relatedLenses.length > 0 ? (
              <section aria-label={relatedHeading} className="pt-2">
                <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {relatedHeading}
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {relatedLenses.map((lens) => (
                    <Link
                      key={lens.href}
                      href={lens.href}
                      className="group rounded-card-editorial border border-border bg-card/40 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40"
                    >
                      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-gold-700">
                        {lens.eyebrow}
                      </p>
                      <p className="mt-1.5 font-heading text-base text-foreground group-hover:text-gold">
                        {lens.name}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </article>
        </div>
      </main>

      {/* Mobile "jump to section" sheet (desktop keeps the sticky sidebar). */}
      <FloatingTOC items={tocItems} title="Mục lục" />
    </>
  );
}
