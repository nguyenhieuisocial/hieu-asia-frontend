import * as React from 'react';

/**
 * Cách một system prompt được "đấu dây" vào hệ thống — worker trả trong
 * `meta.wiring` (backend #351):
 *  - kv_live:     runtime đọc thẳng KV → sửa ở admin là áp dụng ngay.
 *  - code_synced: prompt chạy trong code nhưng đã đồng bộ với bản KV.
 *  - code_inline: prompt nằm cứng trong code; bản ở admin chỉ là bản chuẩn
 *                 tham chiếu — sửa ở admin KHÔNG đổi hành vi runtime.
 */
export type PromptWiring = 'kv_live' | 'code_synced' | 'code_inline';

/**
 * Metadata "Ý nghĩa & kết nối" cho từng system prompt — worker trả kèm mỗi
 * prompt object kể từ backend #351. LUÔN optional phía client: worker cũ chưa
 * deploy thì field này undefined → ẩn toàn bộ panel/badge liên quan.
 */
export interface PromptMeta {
  /** Tên hiển thị, vd "Vision — mắt đọc ảnh bàn tay". */
  label: string;
  /** 1 câu: prompt này để làm gì. */
  summary: string;
  /** 2-4 câu: vì sao quan trọng + cơ chế. */
  detail: string;
  /** Vị trí 1-5 trong pipeline đọc; null nếu đứng ngoài pipeline. */
  stage: number | null;
  /** Nhận đầu vào từ đâu (chuỗi hiển thị tiếng Việt). */
  upstream: string[];
  /** Kết quả đi tiếp tới đâu. */
  downstream: string[];
  /** Nơi chạy thật (worker, edge function…). */
  runs_at: string[];
  wiring: PromptWiring;
  /** Sửa ở admin thì hiệu lực thế nào — hiện cạnh nút Lưu. */
  wiring_note: string;
  /** Model đang dùng, mô tả tiếng Việt. */
  model: string;
}

const WIRING_BADGE: Record<PromptWiring, { label: string; className: string }> = {
  kv_live: {
    label: 'Sửa là áp dụng ngay',
    className: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200',
  },
  code_synced: {
    label: 'Chạy trong code — đã đồng bộ',
    className: 'border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-200',
  },
  code_inline: {
    label: 'Chạy trong code — đây là bản chuẩn',
    className: 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-200',
  },
};

/**
 * Badge cho biết sửa prompt ở admin có hiệu lực thế nào. Tooltip (native
 * `title`) = wiring_note từ worker — không thêm dependency tooltip mới.
 */
export function WiringBadge({ wiring, note }: { wiring: PromptWiring; note: string }) {
  const cfg = WIRING_BADGE[wiring];
  return (
    <span
      title={note}
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}
