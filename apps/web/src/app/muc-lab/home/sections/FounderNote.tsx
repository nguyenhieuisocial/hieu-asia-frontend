import * as React from 'react';

/**
 * FounderNote — founder presence (research: top trust-signal cho sản phẩm mới/nhạy cảm).
 * ⚠️ CHỜ CONTENT THẬT: tên + ảnh + lý do làm + credential kép (cổ học + tech/AI).
 * Build khung + placeholder rõ ràng — KHÔNG bịa người thật.
 */
export function FounderNote(): React.JSX.Element {
  return (
    <section aria-label="Người làm hieu.asia" className="py-16 sm:py-20">
      <div className="mx-auto flex max-w-marketing-tight flex-col gap-5 px-6 sm:flex-row sm:items-center sm:gap-8 sm:px-8">
        {/* TODO: thay bằng ảnh founder thật */}
        <div
          aria-hidden="true"
          className="size-20 flex-none rounded-full border border-primary/25 bg-muted/50"
        />
        <div>
          <p className="font-mono text-editorial-mono uppercase tracking-[0.16em] text-muted-foreground">
            NGƯỜI LÀM HIEU.ASIA
          </p>
          {/* TODO: thay bằng bio thật của founder */}
          <p className="mt-3 max-w-[32em] font-editorial-display text-xl leading-relaxed text-foreground sm:text-2xl">
            “Mình làm hieu.asia vì tin cổ học Á Đông xứng đáng được giải mã rõ ràng, không huyền bí
            hoá — để người trẻ dùng nó mà tự quyết, không bị phán.”
          </p>
          <p className="mt-3 text-muted-foreground">
            — <span className="italic">[Tên founder]</span> · nền tảng{' '}
            <span className="text-foreground/80">cổ học + kỹ thuật/AI</span>.{' '}
            <span className="font-mono text-[11px] uppercase tracking-[0.1em]">(chờ nội dung thật)</span>
          </p>
        </div>
      </div>
    </section>
  );
}
