'use client';

/**
 * CongCuExplorer — searchable "explore" surface for the full tool catalog
 * (Bitget's scannable, filterable markets list, reframed for hieu.asia's tools).
 * Diacritic-insensitive search so "tu vi" matches "Tử Vi". Keeps the exact card
 * styling of the original /cong-cu grid; only adds find-fast + result count.
 */

import * as React from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';

export interface ExplorerTool {
  href: string;
  emoji: string;
  name: string;
  desc: string;
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

export function CongCuExplorer({ tools }: { tools: readonly ExplorerTool[] }) {
  const [query, setQuery] = React.useState('');

  const filtered = React.useMemo(() => {
    const q = normalize(query);
    if (!q) return tools;
    return tools.filter((t) => normalize(`${t.name} ${t.desc}`).includes(q));
  }, [tools, query]);

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
          placeholder="Tìm công cụ… (vd: tử vi, mbti, ngày tốt)"
          aria-label="Tìm công cụ"
          className="h-11 w-full rounded-xl border border-white/[0.1] bg-white/[0.04] pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/30"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Xoá tìm kiếm"
            className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Result count */}
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
        {query
          ? `${filtered.length} / ${tools.length} công cụ`
          : `${tools.length} công cụ`}
      </p>

      {/* Grid (identical card style to the original) */}
      {filtered.length > 0 ? (
        <ul
          role="list"
          className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((tool) => (
            <li key={tool.href}>
              <Link
                href={tool.href}
                className="group flex h-full flex-col gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 transition-all duration-200 hover:border-gold/40 hover:bg-gold/[0.06] hover:shadow-[0_0_28px_-8px_rgba(184,146,61,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
              >
                <span
                  aria-hidden="true"
                  className="text-2xl leading-none transition-transform duration-200 group-hover:scale-110"
                >
                  {tool.emoji}
                </span>
                <div className="flex flex-col gap-1">
                  <span className="font-heading text-base font-semibold text-foreground transition-colors duration-200 group-hover:text-gold">
                    {tool.name}
                  </span>
                  <span className="text-[13px] leading-relaxed text-muted-foreground">
                    {tool.desc}
                  </span>
                </div>
                <span
                  aria-hidden="true"
                  className="mt-auto font-mono text-xs text-gold/40 transition-colors duration-200 group-hover:text-gold/70"
                >
                  Khám phá →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Không có công cụ nào khớp “{query}”.{' '}
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-gold underline-offset-2 hover:underline"
            >
              Xem tất cả
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
