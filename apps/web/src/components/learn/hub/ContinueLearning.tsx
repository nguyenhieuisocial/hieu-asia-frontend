'use client';

/**
 * ContinueLearning — chip "Học tiếp" trên hub /learn.
 *
 * Đọc `learn:last-visited` (do LearnPathNav ghi khi người học mở một bài) +
 * tiến độ checklist của bài đó, hiện MỘT dòng chip dẫn thẳng về bài đang học.
 * Khách mới (chưa có dữ liệu) → khung rỗng.
 *
 * Chống CLS: khung ngoài cao cố định (h-11) render sẵn từ server; chip chỉ
 * xuất hiện bên trong sau hydration nên không đẩy layout. localStorage chỉ đọc
 * trong useEffect (hydration-safe, trang giữ nguyên static render).
 */

import * as React from 'react';
import Link from 'next/link';
import { learnTopicBySlug } from '@/lib/learn/related';
import {
  readLastVisited,
  readTopicSummary,
  stateOf,
  type TopicSummary,
} from '@/lib/learn/progress';
import { track } from '@/lib/analytics';

interface ContinueTarget {
  slug: string;
  name: string;
  href: string;
  summary: TopicSummary | null;
}

export function ContinueLearning() {
  const [target, setTarget] = React.useState<ContinueTarget | null>(null);

  React.useEffect(() => {
    const last = readLastVisited();
    if (!last) return;
    const topic = learnTopicBySlug(last.slug);
    if (!topic) return;
    setTarget({
      slug: topic.slug,
      name: topic.name,
      href: topic.href,
      summary: readTopicSummary(topic.slug),
    });
  }, []);

  return (
    <div className="mt-5 flex h-11 items-center justify-center">
      {target ? (
        <Link
          href={target.href}
          onClick={() => track('learn_continue_clicked', { topic: target.slug })}
          className="inline-flex max-w-full items-center gap-2 rounded-full border border-gold/30 bg-card/40 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-gold/60 hover:text-foreground"
        >
          <span className="font-mono text-eyebrow uppercase text-gold-700">
            Học tiếp
          </span>
          <span className="truncate font-medium text-foreground">{target.name}</span>
          {target.summary && stateOf(target.summary) !== 'none' ? (
            <span className="shrink-0 font-mono text-[12px] text-gold-700">
              {target.summary.total > 0
                ? `${target.summary.done}/${target.summary.total}`
                : `${target.summary.done} mục`}
            </span>
          ) : null}
          <span aria-hidden="true" className="shrink-0 text-gold-700">
            →
          </span>
        </Link>
      ) : null}
    </div>
  );
}
