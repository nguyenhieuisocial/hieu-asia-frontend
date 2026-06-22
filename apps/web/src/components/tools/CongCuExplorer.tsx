'use client';

/**
 * CongCuExplorer — trang "Tất cả công cụ" sắp theo 7 NHÓM việc-cần-làm, có vùng
 * "Bắt đầu ở đây" (lá số miễn phí + lăng kính) và mục-lục nhảy-nhóm.
 *
 * - Tìm kiếm không phân biệt dấu (NFD + đ→d) trên tên + mô tả. Khi đang tìm,
 *   ẩn vùng nổi bật/mục-lục/tiêu-đề-nhóm và gộp thành 1 lưới phẳng kết quả.
 * - Toàn bộ bề mặt dùng BIẾN-THEME (bg-card / border-border / text-foreground /
 *   text-muted-foreground / text-primary) → đúng cả light (Giấy thấm) lẫn dark
 *   (Khoảng lặng). Trước đây dùng white-opacity nên mất nền ở light.
 * - Mục-lục KHÔNG sticky: ToolPageShell <main> có overflow-hidden (cho glow nền)
 *   → phá position:sticky. Dùng anchor + scroll-mt-20 để chừa thanh nav cố định.
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

function FreeHeroCard({ item }: { item: FeaturedFree }) {
  return (
    <Link
      href={item.href}
      className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border-[1.5px] border-gold/45 bg-card p-5 transition-all duration-200 hover:border-gold/70 hover:shadow-[0_2px_24px_-10px_hsl(var(--primary)/0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:flex-row sm:items-center"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gold/[0.1] to-transparent"
      />
      <span className="relative flex items-center gap-4">
        <span
          aria-hidden="true"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-gold/25 bg-gold/10 text-3xl"
        >
          {item.emoji}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-heading text-lg font-semibold text-foreground">
            {item.name}
          </span>
          <span className="mt-0.5 block font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
            {item.tagline}
          </span>
        </span>
      </span>
      <span className="relative inline-flex shrink-0 items-center gap-1 self-start rounded-full bg-primary px-4 py-2 font-heading text-sm font-semibold text-primary-foreground transition-colors group-hover:bg-primary/90 sm:ml-auto sm:self-auto">
        {item.cta}
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
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
      {/* Search */}
      <div className="relative max-w-md">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="search"
          inputMode="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm theo nhu cầu… (vd: xem tuổi cưới, ngày tốt, mbti)"
          aria-label="Tìm công cụ"
          className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/30"
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

      {isSearching ? (
        /* ── Chế độ tìm kiếm: 1 lưới phẳng ── */
        <>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
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
        /* ── Chế độ duyệt: nổi bật + mục lục + nhóm ── */
        <>
          {/* Bắt đầu ở đây */}
          <section aria-label="Bắt đầu ở đây" className="mt-8">
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

            {lensTools.length > 0 && (
              <>
                <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
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
              </>
            )}
          </section>

          {/* Mục lục nhảy-nhóm */}
          <nav
            aria-label="Nhóm công cụ"
            className="mt-10 flex flex-wrap gap-2 border-y border-border py-3"
          >
            {categories.map((c) => {
              const count = byCat.get(c.id)?.length ?? 0;
              if (!count) return null;
              return (
                <a
                  key={c.id}
                  href={`#${c.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/[0.06] hover:text-primary"
                >
                  <span aria-hidden="true">{c.icon}</span>
                  {c.label}
                  <span className="text-muted-foreground/60">· {count}</span>
                </a>
              );
            })}
          </nav>

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
