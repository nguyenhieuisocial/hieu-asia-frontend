'use client';

/**
 * /tuvi-content — danh sách nội dung Tử Vi để founder tự sửa (12 cung + 47 sao).
 *
 * Bước 2/3 của CMS Tử Vi. Dữ liệu ở `hieu_asia.tuvi_content` — CÙNG bảng mà
 * worker API `/content/public/tuvi/*` phục vụ, nên sửa ở đây là sửa đúng nguồn
 * web sẽ đọc (sau khi bước 3 nối web vào DB).
 *
 * Đặt ở route riêng `tuvi-content`, KHÔNG nhét vào `/content` — `/content` là
 * bản nháp bài viết (`content_drafts`), khác hẳn nguồn dữ liệu; gộp vào sẽ gây
 * hiểu nhầm và đụng route động `/content/[id]`.
 */

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Button, Input } from '@hieu-asia/ui';
import { ChevronRight, Search } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { ErrorBlock } from '@/components/admin/error-block';
import { fmtDateTime } from '@/lib/format';

interface Item {
  slug: string;
  kind: 'palace' | 'star';
  title: string;
  sort_order: number | null;
  updated_at: string | null;
}

const KIND_LABEL: Record<Item['kind'], string> = { palace: 'Cung', star: 'Sao' };

export default function TuviContentPage() {
  const [kind, setKind] = React.useState<'all' | Item['kind']>('all');
  const [q, setQ] = React.useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'tuvi-content'],
    queryFn: async () => {
      const r = await fetch('/api/admin/tuvi-content', { cache: 'no-store' });
      const j = (await r.json()) as { ok?: boolean; items?: Item[]; error?: string };
      if (!r.ok || !j.ok) throw new Error(j.error ?? `HTTP ${r.status}`);
      return j.items ?? [];
    },
  });

  const items = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (data ?? []).filter(
      (it) =>
        (kind === 'all' || it.kind === kind) &&
        (!needle || it.title.toLowerCase().includes(needle) || it.slug.includes(needle)),
    );
  }, [data, kind, q]);

  const counts = React.useMemo(() => {
    const all = data ?? [];
    return {
      palace: all.filter((i) => i.kind === 'palace').length,
      star: all.filter((i) => i.kind === 'star').length,
    };
  }, [data]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nội dung Tử Vi"
        description="Sửa phần diễn giải 12 cung và các sao — không cần lập trình viên. Lưu là ghi thẳng vào nguồn dữ liệu của website."
      />

      {error && <ErrorBlock message={(error as Error).message} />}

      <div className="flex flex-wrap items-center gap-2">
        {(['all', 'palace', 'star'] as const).map((k) => (
          <Button
            key={k}
            size="sm"
            variant={kind === k ? 'default' : 'outline'}
            onClick={() => setKind(k)}
          >
            {k === 'all' ? `Tất cả (${counts.palace + counts.star})` : `${KIND_LABEL[k]} (${counts[k]})`}
          </Button>
        ))}
        <div className="relative ml-auto w-full max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm theo tên…"
            className="pl-8"
            aria-label="Tìm mục nội dung"
          />
        </div>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Đang tải…</p>}

      {!isLoading && items.length === 0 && (
        <EmptyState title="Không có mục nào khớp." description="Thử bỏ bộ lọc hoặc xoá từ khoá tìm kiếm." />
      )}

      {items.length > 0 && (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {items.map((it) => (
            <li key={it.slug}>
              <Link
                href={`/tuvi-content/${it.slug}`}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
              >
                <span className="shrink-0 rounded border border-border px-2 py-0.5 text-xs text-muted-foreground">
                  {KIND_LABEL[it.kind]}
                </span>
                <span className="min-w-0 flex-1 truncate font-medium">{it.title}</span>
                <code className="hidden shrink-0 font-mono text-xs text-muted-foreground sm:inline">
                  {it.slug}
                </code>
                <span className="hidden shrink-0 text-xs text-muted-foreground md:inline">
                  {it.updated_at ? fmtDateTime(it.updated_at) : '—'}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
