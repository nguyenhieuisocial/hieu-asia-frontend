import * as React from 'react';

/**
 * MissionNote — trust qua SỨ MỆNH (founder ẩn danh, không tên/ảnh).
 * Research: khi không có founder-identity, values/mission statement là trust-signal thay thế hợp lệ.
 * Củng cố định vị "không bói toán · quyết định là của bạn". Có heading (h2) cho a11y.
 */
export function MissionNote(): React.JSX.Element {
  return (
    <section aria-label="Vì sao chúng tôi làm hieu.asia" className="py-12 sm:py-14">
      <div className="mx-auto max-w-marketing-tight px-6 sm:px-8">
        <h2 className="rv-fade font-mono text-editorial-mono uppercase tracking-[0.12em] text-muted-foreground">
          VÌ SAO CHÚNG TÔI LÀM HIEU.ASIA
        </h2>
        <blockquote className="rv-up mt-4 rounded-card-editorial border-l-[3px] border-primary/70 bg-card/40 p-6 pl-5 font-editorial-display text-xl leading-relaxed text-foreground sm:p-8 sm:text-2xl" style={{ animationDelay: '100ms' }}>
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
