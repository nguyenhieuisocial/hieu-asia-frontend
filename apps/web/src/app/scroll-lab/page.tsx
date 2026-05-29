import type { Metadata } from 'next';
import { ScrollProgress } from './_kit/scroll';
import { SecHero } from './SecHero';
import { SecQuestions } from './SecQuestions';
import { SecCung } from './SecCung';
import { SecReading } from './SecReading';
import { SecDecision } from './SecDecision';

/**
 * /scroll-lab — PROTOTYPE NỘI BỘ "cinematic scroll" (không phải trang thật).
 *
 * Demo trải nghiệm cuộn-điện-ảnh "lướt tới đâu hiệu ứng tới đó" cho CẢ TRANG:
 *   Hero → Câu hỏi lớn (pinned) → Bản đồ 12 cung (scroll-tell) →
 *   Bản giải mã AI (stagger reveal) → Quyết định (CTA).
 *
 * Dùng toolkit scroll chung (_kit/scroll): 1 rAF batch cross-browser
 * (không phụ thuộc CSS animation-timeline), transform/opacity only,
 * tôn trọng prefers-reduced-motion, LCP/SSR-safe.
 * noindex — chỉ để founder cảm trên Vercel preview, không đụng trang thật.
 */
export const metadata: Metadata = {
  title: 'Scroll Lab — cinematic prototype (nội bộ)',
  robots: { index: false, follow: false },
};

export default function ScrollLabPage() {
  return (
    <main style={{ background: '#F3ECDD', color: '#171411' }}>
      <ScrollProgress />
      <SecHero />
      <SecQuestions />
      <SecCung />
      <SecReading />
      <SecDecision />
    </main>
  );
}
