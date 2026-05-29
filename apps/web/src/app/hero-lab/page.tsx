import type { Metadata } from 'next';
import { HeroLab } from './HeroLab';

/**
 * /hero-lab — PROTOTYPE NỘI BỘ (không phải hero thật).
 * Demo concept "Lập lá số" P1: lá số 12 cung tự vẽ + tiêu đề mực-loang +
 * cung Mệnh thở + vòng tick xoay chậm (astrolabe) + pointer-tilt.
 * SVG + CSS thuần, tôn trọng prefers-reduced-motion, không đụng hero thật.
 * noindex — chỉ để founder xem & cảm trên Vercel preview.
 */
export const metadata: Metadata = {
  title: 'Hero Lab — prototype (nội bộ)',
  robots: { index: false, follow: false },
};

export default function HeroLabPage() {
  return <HeroLab />;
}
