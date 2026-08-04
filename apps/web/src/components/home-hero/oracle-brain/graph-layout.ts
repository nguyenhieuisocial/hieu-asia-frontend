import { TOOLKIT_GROUPS } from '@/lib/site-registry';

export const ALL_TOOLS = TOOLKIT_GROUPS.flatMap((g) => g.tools.map((t) => t.n));

export const RADIUS = 33; // hub distance from center (% of box)
export const SAT_R = 6.5; // satellite cluster radius around a hub (% of box)

export const HUBS = TOOLKIT_GROUPS.map((g, i, arr) => {
  const a = ((-90 + (360 / arr.length) * i) * Math.PI) / 180;
  const left = 50 + Math.cos(a) * RADIUS;
  const top = 50 + Math.sin(a) * RADIUS;
  const nSat = Math.max(3, Math.min(5, Math.round(g.tools.length / 3)));
  const sats = Array.from({ length: nSat }, (_, k) => {
    const sa = a + (k - (nSat - 1) / 2) * 0.42;
    return { left: left + Math.cos(sa) * SAT_R, top: top + Math.sin(sa) * SAT_R };
  });
  return {
    label: g.label,
    count: g.tools.length,
    // Giữ cả href để tên công cụ trong lăng kính là LINK bấm được (cross-link).
    tools: g.tools.map((t) => ({ n: t.n, href: t.href })),
    left,
    top,
    sats,
  };
});

export type Hub = (typeof HUBS)[number];

// Đợt 2 "chạm nhóm ra ý nghĩa": mô tả ngắn mỗi lăng kính (khớp NHÃN hub). Chỉ Cổ
// học + Chiêm tinh có kết quả tính được ở client — còn lại chỉ giới thiệu + dẫn
// tới công cụ (KHÔNG bịa kết quả, giữ đúng tinh thần teaser).
export const LENS_ABOUT: Record<string, string> = {
  'Cổ học Á Đông': 'Từ ngày sinh: can chi, con giáp, mệnh nạp âm, màu & hướng nghề hợp.',
  'Tâm lý hiện đại': 'Tính cách qua MBTI, Big Five, DISC, Enneagram — cần làm bài trắc nghiệm ngắn.',
  'Chiêm tinh phương Tây': 'Cung hoàng đạo tính từ vị trí Mặt Trời lúc bạn sinh.',
  'Trực giác': 'Tarot — lăng kính trực giác; bạn rút bài để soi một câu hỏi.',
  'Khám phá & so sánh': 'So sánh nhiều lăng kính & hợp tuổi — ghép các mảnh thành bức tranh chung.',
};
export const DONG_IDX = HUBS.findIndex((h) => h.label === 'Cổ học Á Đông');
export const TAY_IDX = HUBS.findIndex((h) => h.label === 'Chiêm tinh phương Tây');

// Deterministic starfield (SSR-stable).
export const STARS = Array.from({ length: 24 }, (_, i) => ({
  left: (i * 53 + 7) % 100,
  top: (i * 31 + 11) % 100,
  delay: (i % 6) * 0.5,
}));
