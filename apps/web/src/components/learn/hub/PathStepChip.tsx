'use client';

/**
 * PathStepChip — một bài trong khối "Lộ trình gợi ý" trên hub /learn.
 *
 * Là <Link> nên vẫn nằm trong HTML server-render (tốt cho internal linking);
 * chỉ cái CHẤM trạng thái là nâng cấp phía client sau mount: xám (chưa học) →
 * vàng (đang học) → ✓ (đã tự tin). Server render sẵn chấm xám cùng kích thước
 * nên không CLS.
 */

import * as React from 'react';
import Link from 'next/link';
import { readTopicSummary, stateOf, type TopicState } from '@/lib/learn/progress';
import { track } from '@/lib/analytics';

export interface PathStepChipProps {
  pathId: string;
  slug: string;
  name: string;
  href: string;
}

const STATE_LABEL: Record<TopicState, string> = {
  none: 'chưa học',
  'in-progress': 'đang học',
  confident: 'đã tự tin giải thích',
};

export function PathStepChip({ pathId, slug, name, href }: PathStepChipProps) {
  const [state, setState] = React.useState<TopicState>('none');

  React.useEffect(() => {
    setState(stateOf(readTopicSummary(slug)));
  }, [slug]);

  return (
    <Link
      href={href}
      onClick={() => track('learn_path_step_clicked', { path: pathId, topic: slug })}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground"
    >
      {state === 'confident' ? (
        <span aria-hidden="true" className="text-[11px] leading-none text-gold">
          ✓
        </span>
      ) : (
        <span
          aria-hidden="true"
          className={[
            'h-1.5 w-1.5 shrink-0 rounded-full',
            state === 'in-progress' ? 'bg-gold' : 'bg-border',
          ].join(' ')}
        />
      )}
      <span>{name}</span>
      <span className="sr-only"> — {STATE_LABEL[state]}</span>
    </Link>
  );
}
