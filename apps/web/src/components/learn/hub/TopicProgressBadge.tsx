'use client';

/**
 * TopicProgressBadge — dòng tiến độ nhỏ trong card chủ đề trên hub /learn.
 *
 * Đọc summary checklist (`learn:summary:<slug>`, fallback map tick cũ) SAU
 * mount. Khung cao cố định (h-4) render sẵn từ server để không CLS; chưa có
 * tiến độ → khung rỗng. Nhãn giữ đúng bản chất tự-đánh-giá: "tự tin giải
 * thích x/y", không phải "hoàn thành khóa học".
 */

import * as React from 'react';
import {
  readTopicSummary,
  stateOf,
  type TopicState,
  type TopicSummary,
} from '@/lib/learn/progress';

export function TopicProgressBadge({ slug }: { slug: string }) {
  const [summary, setSummary] = React.useState<TopicSummary | null>(null);

  React.useEffect(() => {
    setSummary(readTopicSummary(slug));
  }, [slug]);

  const state: TopicState = stateOf(summary);

  return (
    <div className="mt-3 flex h-4 items-center gap-2 font-mono text-[12px] text-gold-700">
      {state === 'confident' ? (
        // ✓ là trang trí — để trần thì trình đọc màn hình đọc thêm "check mark".
        <span>
          <span aria-hidden="true">✓</span> Đã tự tin giải thích
        </span>
      ) : state === 'in-progress' && summary ? (
        summary.total > 0 ? (
          <>
            <span
              aria-hidden="true"
              className="h-1 w-16 shrink-0 overflow-hidden rounded-full bg-border"
            >
              <span
                className="block h-full rounded-full bg-gold"
                style={{ width: `${Math.round((summary.done / summary.total) * 100)}%` }}
              />
            </span>
            <span>
              Tự tin giải thích {summary.done}/{summary.total}
            </span>
          </>
        ) : (
          <span>Đã tick {summary.done} mục</span>
        )
      ) : null}
    </div>
  );
}
