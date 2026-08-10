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
import { understandingKey, writeTopicSummary } from '@/lib/learn/progress';

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

export function UnderstandingChecklist({ topicId, facets }: UnderstandingChecklistProps) {
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = React.useState(false);
  const syncTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Bản MỚI NHẤT của map tick, cập nhật ngay lúc set state. Cần nó vì lời gọi
  // GET dưới đây là async: nếu union với biến chụp lúc mount thì cú tick người
  // học bấm TRONG lúc chờ mạng bị xoá ngược — checkbox tự bỏ tick, localStorage
  // và summary bị ghi đè bằng số cũ.
  const liveRef = React.useRef<Record<string, boolean>>({});

  // Đặt state + ref cùng lúc. Side-effect vẫn để NGOÀI updater để không chạy
  // hai lần trong StrictMode dev.
  const apply = React.useCallback((next: Record<string, boolean>) => {
    liveRef.current = next;
    setChecked(next);
  }, []);

  // Đọc localStorage SAU mount để không lệch hydrate (SSR = tất cả chưa tick).
  // Rồi GET server để union (best-effort, chưa đăng nhập → 401 → bỏ qua im lặng).
  React.useEffect(() => {
    let local: Record<string, boolean> = {};
    try {
      const raw = window.localStorage.getItem(understandingKey(topicId));
      if (raw) local = JSON.parse(raw) as Record<string, boolean>;
    } catch {
      /* ignore */
    }
    // Gọi cả khi không có gì trong storage: `liveRef` phải LUÔN khớp chủ đề đang
    // xem. Nếu chỉ đặt khi có dữ liệu thì lúc đổi topicId mà chủ đề mới chưa
    // từng tick, ref còn giữ map của chủ đề CŨ và bước union bên dưới sẽ bê tick
    // của bài khác sang.
    apply(local);
    setHydrated(true);
    // Ghi tóm tắt {done,total} cho hub /learn (learn:summary:<slug>) — cả khi
    // done=0, để hub biết tổng số dòng của bài (trang là nơi duy nhất biết).
    writeTopicSummary(topicId, facets.filter((f) => local[f.id]).length, facets.length);

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/user/preferences', { credentials: 'same-origin' });
        if (!res.ok) return;
        const data = (await res.json()) as { ok?: boolean; preferences?: Record<string, unknown> };
        const remote = data?.preferences?.[understandingKey(topicId)];
        if (!data?.ok || cancelled || typeof remote !== 'object' || remote === null) return;
        // Union: server ∪ trạng thái ĐANG hiện trên máy (liveRef, không phải
        // `local` chụp lúc mount) → tick vừa bấm trong lúc chờ mạng vẫn thắng.
        const merged = { ...(remote as Record<string, boolean>), ...liveRef.current };
        apply(merged);
        try {
          window.localStorage.setItem(understandingKey(topicId), JSON.stringify(merged));
        } catch {
          /* ignore */
        }
        writeTopicSummary(topicId, facets.filter((f) => merged[f.id]).length, facets.length);
      } catch {
        /* ignore: 401/network — localStorage vẫn là nguồn chính */
      }
    })();
    return () => {
      cancelled = true;
    };
    // facets là mảng module-const ở mọi trang → identity ổn định, không re-run thừa.
  }, [topicId, facets, apply]);

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
        body: JSON.stringify({ user_id: 'self', prefs: { [understandingKey(topicId)]: nextChecked } }),
      }).catch(() => {
        /* best-effort */
      });
    }, 600);
  };

  const toggle = (id: string) => {
    const checkedNext = !liveRef.current[id];
    // Tính `next` NGOÀI updater để mọi side-effect (localStorage, sync, summary,
    // analytics) chạy đúng 1 lần kể cả StrictMode dev.
    const next = { ...liveRef.current, [id]: checkedNext };
    apply(next);
    try {
      window.localStorage.setItem(understandingKey(topicId), JSON.stringify(next));
    } catch {
      /* ignore */
    }
    scheduleSync(next);
    writeTopicSummary(topicId, facets.filter((f) => next[f.id]).length, facets.length);
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
                  <span className="font-mono text-eyebrow uppercase text-gold-700">
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
