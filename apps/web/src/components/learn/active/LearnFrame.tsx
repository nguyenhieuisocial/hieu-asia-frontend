/**
 * LearnFrame — khung tư duy 5 bước PROBLEM → WHY → WHAT → HOW → SO WHAT.
 *
 * Đặt ở đầu một bài /learn để người đọc biết "vì sao mình học cái này" trước
 * khi lao vào chi tiết. Thuần trình bày (không state) → render phía server,
 * 0 JS client, nội dung nằm trong HTML (tốt cho SEO).
 *
 * Nội dung do trang cung cấp và PHẢI grounded (rút từ chính bài viết / cổ thư),
 * giữ giọng "góc nhìn tham khảo, không phán định".
 */

import * as React from 'react';

export interface LearnFrameProps {
  /** Bạn học cái này để giải quyết vấn đề gì? */
  problem: React.ReactNode;
  /** Vì sao nó tồn tại / vì sao quan trọng? */
  why: React.ReactNode;
  /** Nó là gì (và không phải là gì)? Thành phần chính? */
  what: React.ReactNode;
  /** Cơ chế vận hành thực tế. */
  how: React.ReactNode;
  /** Biết rồi thì dùng vào việc gì / thay đổi điều gì? */
  soWhat: React.ReactNode;
  /** Câu dẫn ngắn (tuỳ chọn). */
  caption?: React.ReactNode;
}

const STEPS: { key: string; label: string }[] = [
  { key: 'problem', label: 'Vấn đề' },
  { key: 'why', label: 'Vì sao' },
  { key: 'what', label: 'Là gì' },
  { key: 'how', label: 'Vận hành' },
  { key: 'soWhat', label: 'Để làm gì' },
];

export function LearnFrame(props: LearnFrameProps) {
  const { caption } = props;
  return (
    <div className="rounded-card-editorial border border-gold/20 bg-card/40 p-5 sm:p-6">
      <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-gold-700">
        Bản đồ bài học
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {caption ??
          'Năm câu hỏi để định hướng trước khi đi vào chi tiết — bạn đang học để làm gì.'}
      </p>

      <ol className="mt-5 space-y-4">
        {STEPS.map((step, i) => (
          <li key={step.key} className="flex gap-3.5">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold/30 font-mono text-[13px] text-gold-700"
            >
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-gold-700">
                {step.label}
              </p>
              <div className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {props[step.key as keyof LearnFrameProps]}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
