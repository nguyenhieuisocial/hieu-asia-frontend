'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_GROUPS } from '@/lib/nav-config';

/**
 * Thanh liên kết mục-con: hiện các trang CHỊ EM cùng nhóm sidebar (từ
 * `nav-config` — một nguồn sự thật) để đi lại nhanh trong một cụm. Ví dụ cụm
 * "AI & Chi phí": Chi phí LLM · Chất lượng AI · Vendors · Prompt Editor · RAG.
 *
 * Tự suy nhóm từ đường dẫn hiện tại (khớp cả trang con `/prompts/[role]`) → thêm
 * trang vào `nav-config` là thanh này tự cập nhật, không sửa tay. Ẩn khi trang
 * không thuộc nhóm nào có >1 mục (tránh nhiễu ở trang đứng lẻ như Tổng quan).
 */
export function SectionNav() {
  const pathname = usePathname();

  const group = React.useMemo(() => {
    if (!pathname) return undefined;
    const inItem = (href: string) => pathname === href || pathname.startsWith(href + '/');
    return NAV_GROUPS.find((g) => g.items.some((it) => inItem(it.href)));
  }, [pathname]);

  if (!pathname || !group || group.items.length <= 1) return null;

  return (
    <nav
      aria-label={`Điều hướng cụm ${group.label}`}
      className="mb-4 flex items-center gap-2 overflow-x-auto pb-1"
    >
      <span className="shrink-0 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {group.label}
      </span>
      <span className="h-4 w-px shrink-0 bg-gold/15" aria-hidden />
      <div className="flex items-center gap-1.5">
        {group.items.map((it) => {
          const active = pathname === it.href || pathname.startsWith(it.href + '/');
          const Icon = it.Icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              aria-current={active ? 'page' : undefined}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 text-[12px] leading-5 transition-all duration-300 ease-editorial focus:outline-none focus-visible:border-gold/60 ${
                active
                  ? 'border-gold/60 bg-gold/15 font-medium text-gold'
                  : 'border-gold/20 text-muted-foreground hover:border-gold/40 hover:bg-gold/5 hover:text-foreground'
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span className="whitespace-nowrap">{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
