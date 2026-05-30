import type { Metadata } from 'next';
// Bản mới ĐÚNG ĐỊNH VỊ "4 lăng kính → AI hợp nhất" (InkHero cũ giữ làm tham chiếu).
import { MultiHero } from './MultiHero';

/**
 * /muc-lab — DEMO NỘI BỘ (noindex) "Mực sống" (Đợt 1 gộp).
 * Hero editorial hiện tại (giấy + mực + ochre) + gộp micro-interaction:
 * lá số tự vẽ mực · tiêu đề mực-loang · cung Mệnh thở · nghiêng theo chuột ·
 * hover cung hé nghĩa · CTA loang mực · con trỏ ngòi bút · giấy sống.
 * SVG/CSS thuần (nhẹ, nạp nhanh), prefers-reduced-motion, không đổi brand.
 */
export const metadata: Metadata = {
  title: 'Mực Lab — demo "Mực sống" (nội bộ)',
  robots: { index: false, follow: false },
};

export default function MucLabPage() {
  return (
    <main>
      {/* concept = hiện thanh "↻ Xem lại" + note concept (chỉ demo nội bộ này, KHÔNG lên production) */}
      <MultiHero concept />
    </main>
  );
}
