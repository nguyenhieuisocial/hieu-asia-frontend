'use client';

/**
 * CongCuExplorer — trang "Tất cả công cụ" sắp theo 7 NHÓM việc-cần-làm.
 *
 * Bố cục (2026-06-22, sửa "khoảng trống bên phải"):
 * - THANH DUYỆT đầu trang: ô tìm-kiếm (trái) + mục-lục nhảy-nhóm (chips, lấp
 *   hết chiều ngang bên phải ở desktop) → hết khoảng trống ở hàng tìm-kiếm.
 * - 2 lá số MIỄN PHÍ: ở desktop nằm trong panel hero bên phải tiêu đề (page.tsx);
 *   ở mobile/tablet hiện ngay đây (thẻ DỌC, CTA full-width — hết khoảng-hở).
 *   `lg:hidden` ở đây + `hidden lg:block` ở panel → không trùng lặp.
 * - Tìm kiếm không phân biệt dấu (NFD + đ→d); khi tìm → gộp 1 lưới phẳng.
 * - Bề mặt dùng BIẾN-THEME (bg-card/border-border/text-foreground/
 *   text-muted-foreground/text-primary) → đúng cả light lẫn dark.
 * - Mục-lục KHÔNG sticky (ToolPageShell <main> overflow-hidden phá sticky):
 *   dùng anchor + scroll-mt-20 để chừa thanh nav cố định.
 */

import * as React from 'react';
import Link from 'next/link';
import { Search, X, ArrowRight } from 'lucide-react';

export interface ExplorerTool {
  href: string;
  emoji: string;
  name: string;
  desc: string;
  cat: string;
}

export interface ExplorerCategory {
  id: string;
  icon: string;
  label: string;
  blurb: string;
}

export interface FeaturedFree {
  href: string;
  emoji: string;
  name: string;
  tagline: string;
  cta: string;
}

export interface FeaturedConfig {
  eyebrow: string;
  heading: string;
  subcopy: string;
  free: FeaturedFree[];
  lensesHeading: string;
  lenses: string[];
}

/** Bỏ dấu tiếng Việt + đ→d để khớp không phân biệt dấu/hoa-thường. */
function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

function ToolCard({ tool, eyebrow }: { tool: ExplorerTool; eyebrow?: string }) {
  return (
    <Link
      href={tool.href}
      className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/40 hover:bg-primary/[0.05] hover:shadow-[0_1px_20px_-8px_hsl(var(--primary)/0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:hover:shadow-[0_0_28px_-8px_rgba(184,146,61,0.35)]"
    >
      <span
        aria-hidden="true"
        className="text-2xl leading-none transition-transform duration-200 group-hover:scale-110"
      >
        {tool.emoji}
      </span>
      <div className="flex flex-col gap-1">
        {eyebrow && (
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
            {eyebrow}
          </span>
        )}
        <span className="font-heading text-base font-semibold text-foreground transition-colors duration-200 group-hover:text-primary">
          {tool.name}
        </span>
        <span className="text-[13px] leading-relaxed text-muted-foreground">
          {tool.desc}
        </span>
      </div>
      <span
        aria-hidden="true"
        className="mt-auto font-mono text-xs text-primary/60 transition-colors duration-200 group-hover:text-primary"
      >
        Khám phá →
      </span>
    </Link>
  );
}

/** Thẻ lá số MIỄN PHÍ (mobile/tablet) — DỌC: emoji → tên+mô tả → CTA full-width.
 *  Không `ml-auto` nên không còn khoảng-hở phải. (Desktop dùng panel hero.) */
function FreeHeroCard({ item }: { item: FeaturedFree }) {
  return (
    <Link
      href={item.href}
      className="group flex h-full flex-col gap-3 rounded-2xl border border-gold/30 bg-card p-5 transition-all duration-200 hover:border-gold/60 hover:bg-primary/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span
        aria-hidden="true"
        className="grid size-11 place-items-center rounded-xl border border-border bg-background text-2xl"
      >
        {item.emoji}
      </span>
      <div>
        <p className="font-heading text-base font-semibold text-foreground transition-colors group-hover:text-primary">
          {item.name}
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
          {item.tagline}
        </p>
      </div>
      <span className="mt-auto inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors group-hover:bg-primary/90">
        {item.cta}
        <ArrowRight className="size-4" aria-hidden="true" />
      </span>
    </Link>
  );
}

export function CongCuExplorer({
  tools,
  categories,
  featured,
}: {
  tools: readonly ExplorerTool[];
  categories: readonly ExplorerCategory[];
  featured: FeaturedConfig;
}) {
  const [query, setQuery] = React.useState('');
  const isSearching = query.trim().length > 0;

  const filtered = React.useMemo(() => {
    const q = normalize(query);
    if (!q) return tools;
    return tools.filter((t) => normalize(`${t.name} ${t.desc}`).includes(q));
  }, [tools, query]);

  const byCat = React.useMemo(() => {
    const map = new Map<string, ExplorerTool[]>();
    for (const c of categories) map.set(c.id, []);
    for (const t of tools) map.get(t.cat)?.push(t);
    return map;
  }, [tools, categories]);

  const lensTools = React.useMemo(
    () =>
      featured.lenses
        .map((href) => tools.find((t) => t.href === href))
        .filter((t): t is ExplorerTool => Boolean(t)),
    [tools, featured.lenses],
  );

  return (
    <div className="mt-2">
      {/* Thanh duyệt: tìm-kiếm (trái) + mục-lục nhảy-nhóm (lấp phải) */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative lg:w-80 lg:shrink-0">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            inputMode="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm công cụ… (xem tuổi cưới, ngày tốt, mbti)"
            aria-label="Tìm công cụ"
            className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Xoá tìm kiếm"
              className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {!isSearching && (
          <nav
            aria-label="Nhảy tới nhóm"
            className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:flex-1 lg:flex-wrap lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
          >
            {categories.map((c) => {
              const count = byCat.get(c.id)?.length ?? 0;
              if (!count) return null;
              return (
                <a
                  key={c.id}
                  href={`#${c.id}`}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/[0.06] hover:text-primary"
                >
                  <span aria-hidden="true">{c.icon}</span>
                  {c.label}
                  <span className="text-muted-foreground/60">· {count}</span>
                </a>
              );
            })}
          </nav>
        )}
      </div>

      {isSearching ? (
        /* ── Chế độ tìm kiếm: 1 lưới phẳng ── */
        <>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            {filtered.length} / {tools.length} công cụ
          </p>
          {filtered.length > 0 ? (
            <ul
              role="list"
              className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((tool) => (
                <li key={tool.href}>
                  <ToolCard tool={tool} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-8 rounded-2xl border border-border bg-card p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Không có công cụ nào khớp “{query}”.{' '}
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-primary underline-offset-2 hover:underline"
                >
                  Xem tất cả
                </button>
              </p>
            </div>
          )}
        </>
      ) : (
        /* ── Chế độ duyệt: nổi bật + nhóm ── */
        <>
          {/* Lá số miễn phí — CHỈ mobile/tablet (desktop đã có panel hero bên phải) */}
          <div className="mt-8 lg:hidden">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
              {featured.eyebrow}
            </p>
            <h2 className="mt-2 font-heading text-xl font-semibold text-foreground sm:text-2xl">
              {featured.heading}
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {featured.subcopy}
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {featured.free.map((item) => (
                <FreeHeroCard key={item.href} item={item} />
              ))}
            </div>
          </div>

          {/* Năm lăng kính — luôn hiện */}
          {lensTools.length > 0 && (
            <section aria-label={featured.lensesHeading} className="mt-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {featured.lensesHeading}
              </p>
              <ul
                role="list"
                className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3"
              >
                {lensTools.map((tool) => (
                  <li key={tool.href}>
                    <ToolCard tool={tool} eyebrow="Lăng kính" />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Các nhóm */}
          {categories.map((c, idx) => {
            const list = byCat.get(c.id) ?? [];
            if (!list.length) return null;
            return (
              <section key={c.id} id={c.id} className="mt-12 scroll-mt-20">
                <header className="border-b border-border pb-3">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-primary">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h2 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
                      <span aria-hidden="true" className="mr-2">
                        {c.icon}
                      </span>
                      {c.label}
                    </h2>
                    <span className="ml-auto whitespace-nowrap font-mono text-xs text-muted-foreground">
                      {list.length} công cụ
                    </span>
                  </div>
                  <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                    <span
                      aria-hidden="true"
                      className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-gold"
                    />
                    {c.blurb}
                  </p>
                </header>
                <ul
                  role="list"
                  className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {list.map((tool) => (
                    <li key={tool.href}>
                      <ToolCard tool={tool} />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </>
      )}
    </div>
  );
}
