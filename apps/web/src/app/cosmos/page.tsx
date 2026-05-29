import type { Metadata } from 'next';
import { CosmosHero } from './CosmosHero';

/**
 * /cosmos — PROTOTYPE NỘI BỘ "Vũ trụ mực" (WebGL/Three.js).
 * Hero 3D: tinh vân mực + ochre, ~3000 sao trôi, cuộn → kết chòm 12 cung, camera trôi.
 * Three.js nạp tách rời (ssr:false); reduced-motion = khung tĩnh; máy không WebGL = nền CSS.
 * noindex — chỉ để founder cảm trên Vercel preview, không đụng trang thật.
 */
export const metadata: Metadata = {
  title: 'Cosmos — vũ trụ mực (prototype nội bộ)',
  robots: { index: false, follow: false },
};

export default function CosmosPage() {
  return <CosmosHero />;
}
