/**
 * LearnPathsSection — khối "Lộ trình gợi ý" trên hub /learn (SERVER component).
 *
 * 5 lộ trình phủ đúng 18 chủ đề (lib/learn/paths.ts). Toàn bộ tên bài + link
 * nằm trong HTML tĩnh; trạng thái từng bài do PathStepChip nâng cấp phía
 * client. Trả lời câu "nên bắt đầu từ đâu?" mà danh mục 18 card không trả
 * lời được.
 */

import * as React from 'react';
import { LEARN_PATHS } from '@/lib/learn/paths';
import { learnTopicBySlug } from '@/lib/learn/related';
import { PathStepChip } from './PathStepChip';

export function LearnPathsSection() {
  return (
    <section aria-labelledby="lo-trinh-heading" className="mt-14">
      <div className="mb-6 text-center">
        <h2
          id="lo-trinh-heading"
          className="font-heading text-2xl font-bold text-foreground sm:text-3xl"
        >
          Chưa biết bắt đầu từ đâu?
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Năm lộ trình xếp sẵn theo thứ tự dễ hiểu trước, chuyên sâu sau. Đọc xong mỗi bài, tự
          kiểm tra bằng checklist ở cuối bài — tiến độ của bạn hiện ngay tại đây.
        </p>
      </div>

      <div className="space-y-4">
        {LEARN_PATHS.map((path) => (
          <div
            key={path.id}
            className="rounded-card-editorial border border-border bg-card/40 p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="font-heading text-lg font-bold text-foreground">{path.name}</h3>
              <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-gold-700">
                {path.slugs.length} bài
              </span>
            </div>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {path.tagline}
            </p>
            <ol className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-2">
              {path.slugs.map((slug, i) => {
                const topic = learnTopicBySlug(slug);
                if (!topic) return null;
                return (
                  <li key={slug} className="flex items-center gap-1.5">
                    {i > 0 ? (
                      <span aria-hidden="true" className="text-xs text-muted-foreground">
                        →
                      </span>
                    ) : null}
                    <PathStepChip
                      pathId={path.id}
                      slug={slug}
                      name={topic.name}
                      href={topic.href}
                    />
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}
