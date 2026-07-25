'use client';

/**
 * LearnPathNav — mount MỘT LẦN trong layout /learn, làm 2 việc:
 *
 * 1. GHI `learn:last-visited` khi người học mở một bài (kể cả trang con như
 *    /learn/mbti/intj → ghi chủ đề cha "mbti") — nguồn cho chip "Học tiếp"
 *    trên hub.
 * 2. HIỆN strip "bài tiếp theo trong lộ trình" ở cuối TRANG CHỦ ĐỀ (chỉ trang
 *    chủ đề chính, không hiện ở trang con để khỏi nhiễu khi đang tra cứu).
 *
 * Mount qua layout nên KHÔNG phải sửa 18 trang bài. Strip nằm NGAY TRONG HTML
 * tĩnh — `usePathname` đã có giá trị lúc prerender, nên chữ "Bài tiếp theo…"
 * xuất hiện trong file .html (đã kiểm trên bản build) → không CLS và Google đọc
 * được liên kết nội bộ này. Trang vẫn static: chỉ localStorage mới cần client.
 */

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { pathForTopic } from '@/lib/learn/paths';
import { learnTopicBySlug } from '@/lib/learn/related';
import { writeLastVisited } from '@/lib/learn/progress';
import { track } from '@/lib/analytics';

/** /learn/<slug> hoặc /learn/<slug>/<con> → {slug, isTopicPage}. */
function parseLearnPath(pathname: string): { slug: string; isTopicPage: boolean } | null {
  const m = pathname.match(/^\/learn\/([^/]+)(\/[^/]+)?\/?$/);
  const slug = m?.[1];
  if (!slug) return null;
  return { slug, isTopicPage: !m[2] };
}

export function LearnPathNav() {
  const pathname = usePathname();
  const parsed = parseLearnPath(pathname ?? '');
  const topic = parsed ? learnTopicBySlug(parsed.slug) : undefined;

  // Ghi "bài gần nhất" cho mọi trang thuộc một chủ đề hợp lệ.
  React.useEffect(() => {
    if (topic) writeLastVisited(topic.slug);
  }, [topic]);

  if (!parsed || !topic || !parsed.isTopicPage) return null;
  const pos = pathForTopic(topic.slug);
  if (!pos) return null;

  const next = pos.nextSlug ? learnTopicBySlug(pos.nextSlug) : undefined;

  return (
    <nav aria-label="Lộ trình học" className="mx-auto max-w-6xl px-6 pb-12">
      <div className="flex flex-col gap-4 rounded-card-editorial border border-border bg-card/40 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="min-w-0">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-gold-700">
            Lộ trình · {pos.path.name}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Bạn đang ở bài {pos.index + 1}/{pos.path.slugs.length}
            {next ? ' — đọc xong, tự kiểm tra bằng checklist rồi đi tiếp.' : ' — bài cuối của lộ trình này.'}
          </p>
        </div>
        {next ? (
          <Link
            href={next.href}
            onClick={() =>
              track('learn_path_next_clicked', {
                path: pos.path.id,
                from_topic: topic.slug,
                to_topic: next.slug,
              })
            }
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-gold/30 px-5 py-2.5 text-sm font-semibold text-gold-700 transition-colors hover:border-gold/60 hover:text-gold"
          >
            Bài tiếp theo: {next.name}
            <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <Link
            href="/learn"
            onClick={() =>
              track('learn_path_next_clicked', {
                path: pos.path.id,
                from_topic: topic.slug,
                to_topic: 'learn-hub',
              })
            }
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-gold/30 px-5 py-2.5 text-sm font-semibold text-gold-700 transition-colors hover:border-gold/60 hover:text-gold"
          >
            Xem lộ trình khác
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
