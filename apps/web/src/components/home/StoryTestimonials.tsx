'use client';

import * as React from 'react';
import { Quote } from 'lucide-react';

interface Story {
  quote: string;
  name: string;
  role: string;
  context: string;
  /** Optional duration/result tag shown under the quote — keeps story self-contained. */
  detail?: string;
}

/**
 * Placeholder testimonials — pseudonyms, voice-aligned (no hyperbole/exclamation).
 *
 * Structure follows problem → action → result per founder UX review §2.3:
 *   - context: 1-line situation tag (eyebrow)
 *   - quote: 3-4 sentences covering what they were avoiding, what the report
 *     surfaced, what changed after — concrete enough to feel real
 *   - detail: short "X tháng dùng · kết quả Y" line under name (no fabricated %)
 *
 * Replace with real customer stories + photos when 3-5 users grant consent
 * (Wave 57.2 founder action — currently in collection phase).
 */
const STORIES: readonly Story[] = [
  {
    context: 'Quyết định nghỉ việc',
    quote:
      'Tôi gắn bó với công ty 6 năm và sợ thừa nhận mình đã hết động lực. Báo cáo Tử Vi chỉ ra cung Quan của tôi đang gặp Tuần Triệt — không có nghĩa là tôi phải nghỉ, nhưng giúp tôi thấy rõ điều mình né tránh: tôi đang giữ vai trò vì an toàn chứ không phải vì còn hứng thú. Sau khi đối chiếu với năm bản thân và lá số bạn đời, tôi quyết định nói chuyện với sếp về một vai trò mới trong công ty.',
    name: 'Minh A.',
    role: 'Product Manager · TP.HCM',
    detail: 'Dùng 2 tháng · Đổi vai trò nội bộ',
  },
  {
    context: 'Chọn người đồng hành',
    quote:
      'Tôi đã hẹn hò 1.5 năm và liên tục trì hoãn quyết định cưới. Mentor không bảo tôi nên cưới hay không — nó hỏi: "Trong 5 tình huống xấu nhất, ai là người bạn muốn ngồi cùng giải quyết?" Câu hỏi đó tôi tránh suốt một năm. Sau hai cuộc trò chuyện và đọc lại cung Phu Thê + Bát Tự đôi, tôi biết câu trả lời mà mình đã biết từ lâu.',
    name: 'Lan H.',
    role: 'Designer · Hà Nội',
    detail: 'Dùng 6 tuần · Đã đính hôn',
  },
  {
    context: 'Bắt đầu kinh doanh',
    quote:
      'Tôi đứng giữa hai lựa chọn: mở quán cà phê ngắn hạn theo trend, hay xây thương hiệu F&B dài 5 năm. Bát Tự cho thấy bản mệnh tôi thiên Mộc Vượng — phù hợp xây dựng từ gốc rễ hơn là chộp giật. Lá số Tử Vi xác nhận thêm cung Tài Bạch hợp đầu tư dài hạn, không hợp lướt sóng. Quan trọng nhất, tôi tự ra quyết định — không phải ai đó bảo tôi nên làm gì.',
    name: 'Đức T.',
    role: 'Founder F&B · Đà Nẵng',
    detail: 'Dùng 3 tháng · Mở thương hiệu dài hạn',
  },
];

export function StoryTestimonials() {
  return (
    <section
      id="stories"
      aria-labelledby="stories-heading"
      className="relative bg-background py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold/80 sm:text-xs">
            Câu chuyện khách hàng
          </p>
          <h2
            id="stories-heading"
            className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl"
          >
            Họ đã{' '}
            <span className="bg-gold-gradient bg-clip-text text-transparent">tự chọn con đường</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Tên đã được thay đổi để tôn trọng quyền riêng tư.
          </p>
          {/*
            Wave 57.1.6 /ultrareview P2: pseudonym testimonials with technical
            specifics ("cung Quan Tuần Triệt", "Mộc Vượng") could surface a
            real Minh A./Lan H./Đức T. who'd dispute the story. Add visible
            placeholder disclosure until founder collects real consented users
            (queued Wave 57.2). Keeps the section live for hero conversion
            without misrepresenting.
          */}
          <p className="mt-2 text-xs text-muted-foreground/70 sm:text-sm">
            Câu chuyện minh hoạ — chúng tôi đang thu thập feedback từ người
            dùng thực (Q2/2026) và sẽ thay thế khi có sự đồng ý chia sẻ.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STORIES.map((s) => (
            <figure
              key={s.name}
              className="relative flex h-full flex-col rounded-2xl border border-border p-6"
              style={{ backgroundColor: 'rgba(20, 20, 26, 0.4)' }}
            >
              <Quote className="absolute right-5 top-5 h-6 w-6 text-gold/20" aria-hidden="true" />
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold/85">
                {s.context}
              </p>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/85 sm:text-base">
                {s.quote}
              </blockquote>
              <figcaption className="mt-6 border-t border-border pt-4">
                <div className="font-heading text-sm font-semibold text-foreground">{s.name}</div>
                <div className="text-xs text-muted-foreground">{s.role}</div>
                {s.detail ? (
                  <div className="mt-2 text-xs text-gold/85" aria-label="Kết quả">
                    {s.detail}
                  </div>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
