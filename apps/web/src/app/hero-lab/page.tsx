import type { Metadata } from 'next';
import { Gallery } from './Gallery';

/**
 * /hero-lab — PROTOTYPE NỘI BỘ (không phải hero thật).
 * Gallery 4 concept hero để so sánh: P1 "Lập lá số" · P2 scroll-telling 12 cung ·
 * 3D thiên bàn (CSS-3D depth) · Tinh vân khẽ thở (canvas sao nền).
 * Tất cả SVG/CSS(+canvas) thuần, tôn trọng prefers-reduced-motion, không đụng hero thật.
 * noindex — chỉ để founder xem & cảm trên Vercel preview.
 */
export const metadata: Metadata = {
  title: 'Hero Lab — prototype (nội bộ)',
  robots: { index: false, follow: false },
};

export default function HeroLabPage() {
  return <Gallery />;
}
