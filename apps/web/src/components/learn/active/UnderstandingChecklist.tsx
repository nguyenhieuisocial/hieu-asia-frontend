'use client';

/**
 * UnderstandingChecklist — bảng "Bạn đã thật sự hiểu chưa?".
 *
 * Vận hành hoá "Checklist Hiểu Biết" của founder: chọn lọc các KHÍA CẠNH của
 * HIỂU hợp với chủ đề (cơ chế, phân biệt, ranh giới, vận dụng, dạy lại...), mỗi
 * dòng là một câu "bạn hiểu khía cạnh này nếu GIẢI THÍCH ĐƯỢC ...". Người học tự
 * tick. Đây là TỰ ĐÁNH GIÁ để biết mình đang ở đâu — không phải bài thi.
 *
 * Trạng thái tick lưu localStorage theo topicId (đọc trong useEffect sau mount
 * để khớp hydrate). 0 LLM, 0 server.
 */

import * as React from 'react';
import { Checkbox } from '@hieu-asia/ui';

export interface UnderstandingFacet {
  /** id ổn định, duy nhất trong chủ đề. */
  id: string;
  /** tên khía cạnh ngắn (vd "Cơ chế", "Phân biệt"). */
  facet: string;
  /** "Bạn hiểu nếu giải thích được ..." */
  can: React.ReactNode;
}

export interface UnderstandingChecklistProps {
  /** khoá lưu trạng thái (vd "bat-tu"). */
  topicId: string;
  facets: UnderstandingFacet[];
}

const keyFor = (topicId: string) => `learn:understanding:${topicId}`;

export function UnderstandingChecklist({ topicId, facets }: UnderstandingChecklistProps) {
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = React.useState(false);

  // Đọc localStorage SAU mount để không lệch hydrate (SSR = tất cả chưa tick).
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(keyFor(topicId));
      if (raw) setChecked(JSON.parse(raw) as Record<string, boolean>);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [topicId]);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        window.localStorage.setItem(keyFor(topicId), JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const done = facets.filter((f) => checked[f.id]).length;
  const total = facets.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="rounded-card-editorial border border-gold/20 bg-card/40 p-5 sm:p-6">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Đây là bảng <strong className="text-foreground">tự đánh giá</strong>, không phải bài thi. Tick
        những điều bạn tự tin <strong className="text-foreground">giải thích lại cho người khác</strong>{' '}
        bằng lời của mình. Còn dòng nào chưa tick được — đó chính là chỗ nên đọc lại.
      </p>

      <div className="mt-4" aria-hidden={!hydrated}>
        <div className="mb-1.5 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
          <span>Tự tin giải thích</span>
          <span aria-live="polite">
            {done}/{total}
          </span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-gold transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <ul className="mt-4 space-y-2.5">
        {facets.map((f) => {
          const id = `uc-${topicId}-${f.id}`;
          const isChecked = !!checked[f.id];
          return (
            <li key={f.id}>
              <label
                htmlFor={id}
                className="flex cursor-pointer gap-3 rounded-lg border border-border bg-card/30 p-3 transition-colors hover:border-gold/30"
              >
                <Checkbox
                  id={id}
                  className="mt-0.5"
                  checked={isChecked}
                  onChange={() => toggle(f.id)}
                />
                <span className="min-w-0">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold-700">
                    {f.facet}
                  </span>
                  <span
                    className={[
                      'mt-0.5 block text-sm leading-relaxed',
                      isChecked ? 'text-foreground' : 'text-muted-foreground',
                    ].join(' ')}
                  >
                    {f.can}
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
