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
 * để khớp hydrate). 0 LLM.
 *
 * Đồng bộ đa thiết bị (TÙY CHỌN, best-effort): localStorage vẫn là nguồn chính.
 * Sau mount cũng GET /api/user/preferences để union trạng thái từ server; mỗi
 * lần tick POST (debounce ~600ms) lên cùng key. Mọi lỗi (401 khi chưa đăng nhập,
 * network...) đều nuốt im lặng — không bao giờ vỡ UI. Chỉ chạm mạng trong
 * useEffect / event handler (hydration-safe).
 */

import * as React from 'react';
import { Checkbox } from '@hieu-asia/ui';
import { track } from '@/lib/analytics';

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
  const syncTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Đọc localStorage SAU mount để không lệch hydrate (SSR = tất cả chưa tick).
  // Rồi GET server để union (best-effort, chưa đăng nhập → 401 → bỏ qua im lặng).
  React.useEffect(() => {
    let local: Record<string, boolean> = {};
    try {
      const raw = window.localStorage.getItem(keyFor(topicId));
      if (raw) {
        local = JSON.parse(raw) as Record<string, boolean>;
        setChecked(local);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/user/preferences', { credentials: 'same-origin' });
        if (!res.ok) return;
        const data = (await res.json()) as { ok?: boolean; preferences?: Record<string, unknown> };
        const remote = data?.preferences?.[keyFor(topicId)];
        if (!data?.ok || cancelled || typeof remote !== 'object' || remote === null) return;
        // Union: server ∪ localStorage. Ghi lại localStorage để hai bên đồng bộ.
        const merged = { ...(remote as Record<string, boolean>), ...local };
        setChecked(merged);
        try {
          window.localStorage.setItem(keyFor(topicId), JSON.stringify(merged));
        } catch {
          /* ignore */
        }
      } catch {
        /* ignore: 401/network — localStorage vẫn là nguồn chính */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [topicId]);

  // Dọn timer debounce khi unmount.
  React.useEffect(
    () => () => {
      if (syncTimer.current) clearTimeout(syncTimer.current);
    },
    [],
  );

  // POST debounce (~600ms) — fire-and-forget, nuốt mọi lỗi. user_id:'self' chỉ
  // là placeholder cho PrefsSchema; proxy luôn ghi đè bằng user_id từ session.
  const scheduleSync = (nextChecked: Record<string, boolean>) => {
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      fetch('/api/user/preferences', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ user_id: 'self', prefs: { [keyFor(topicId)]: nextChecked } }),
      }).catch(() => {
        /* best-effort */
      });
    }, 600);
  };

  const toggle = (id: string) => {
    const checkedNext = !checked[id];
    setChecked((prev) => {
      const next = { ...prev, [id]: checkedNext };
      try {
        window.localStorage.setItem(keyFor(topicId), JSON.stringify(next));
      } catch {
        /* ignore */
      }
      scheduleSync(next);
      return next;
    });
    // Đo lường ngoài updater (tránh fire 2 lần ở StrictMode dev).
    track('learn_checklist_ticked', { topic: topicId, facet_id: id, checked: checkedNext });
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
        <div className="mb-1.5 flex items-center justify-between font-mono text-[13px] text-muted-foreground">
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
                  <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-gold-700">
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
