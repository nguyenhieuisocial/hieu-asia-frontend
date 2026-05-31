import * as React from 'react';

/**
 * MissionNote — trust qua SỨ MỆNH (founder ẩn danh, không tên/ảnh).
 * Research: khi không có founder-identity, values/mission statement là trust-signal thay thế hợp lệ.
 * Củng cố định vị "không bói toán · quyết định là của bạn". Có heading (h2) cho a11y.
 */
export function MissionNote(): React.JSX.Element {
  return (
    <section aria-label="Vì sao chúng tôi làm hieu.asia" className="py-16 sm:py-20">
      <div className="mx-auto max-w-marketing-tight px-6 sm:px-8">
        <h2 className="font-mono text-editorial-mono uppercase tracking-[0.16em] text-muted-foreground">
          VÌ SAO CHÚNG TÔI LÀM HIEU.ASIA
        </h2>
        <blockquote className="mt-4 border-l-2 border-primary/40 pl-5 font-editorial-display text-xl leading-relaxed text-foreground sm:text-2xl">
          “Chúng tôi tin cổ học Á Đông xứng đáng được giải mã rõ ràng, không huyền bí hoá — để bạn
          dùng nó mà tự quyết, không bị phán. Vì vậy mỗi kết quả đều nói thẳng: đây là dữ kiện, còn
          quyết định là của bạn.”
        </blockquote>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          — Đội ngũ hieu.asia
        </p>
      </div>
    </section>
  );
}
