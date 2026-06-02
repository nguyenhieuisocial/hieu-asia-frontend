// Single source of truth for the homepage "bộ lăng kính" (flagship lenses).
//
// Plan A (catalog-driven): every homepage surface that lists the flagship lenses
// — the hero constellation (MultiHero/LensConstellation), the lens cards
// (app/page.tsx), the methodology strip, and the JSON-LD services — reads from
// THIS array. Change a lens here → it updates everywhere, no drift.
//
// Flagship set = the 5 lenses we stand behind with real depth: Tử Vi + Bát Tự
// (cổ thư-grounded) · MBTI + Big Five (psychology, with deep AI readings) ·
// Xem Tướng (AI vision). Thần Số and the rest live in the broader toolkit
// (ToolkitSection / /cong-cu), not the flagship constellation.

export interface Lens {
  /** stable id; also the emblem key in LensGlyphs EMBLEMS */
  slug: string;
  /** short label for the hero constellation + methodology */
  name: string;
  /** hero: short role phrase ("đang soi · <name> → <role>") */
  role: string;
  /** hero: one-sentence "full" description shown on hover/pick */
  full: string;
  /** methodology strip: what this lens gives */
  give: string;
  /** methodology strip: mono meta line */
  meta: string;
  /** lens card eyebrow (mono, uppercase) */
  eyebrow: string;
  /** lens card title (editorial) */
  title: string;
  /** lens card CTA label */
  cta: string;
  /** lens card destination (learn page where one exists, else the tool) */
  href: string;
  /** JSON-LD service description */
  serviceDesc: string;
  /** absolute URL for JSON-LD */
  url: string;
}

export const LENSES: Lens[] = [
  {
    slug: 'tu-vi',
    name: 'Tử Vi',
    role: 'bản đồ ưu thế & điểm mù',
    full: 'Lá số 12 cung — ưu thế, điểm mù và chu kỳ của bạn.',
    give: 'bản đồ ưu thế & chu kỳ',
    meta: 'lá số 12 cung · 14 chính tinh',
    eyebrow: 'TỬ VI · CUNG MỆNH',
    title: 'Đọc cung mệnh',
    cta: 'Đọc về Tử Vi',
    href: '/learn/tu-vi',
    serviceDesc: 'Lập lá số Tử Vi 12 cung và luận giải ưu thế, điểm mù, chu kỳ.',
    url: 'https://hieu.asia/learn/tu-vi',
  },
  {
    slug: 'bat-tu',
    name: 'Bát Tự',
    role: 'cân bằng ngũ hành',
    full: 'Tứ Trụ can-chi — cân bằng ngũ hành & nhịp thịnh–suy theo thời gian.',
    give: 'nhịp thịnh–suy theo thời gian',
    meta: 'Tứ Trụ can-chi · ngũ hành',
    eyebrow: 'BÁT TỰ · NGŨ HÀNH',
    title: 'Cân ngũ hành',
    cta: 'Đọc về Bát Tự',
    href: '/learn/bat-tu',
    serviceDesc: 'Lập Tứ Trụ Bát Tự và luận cân bằng ngũ hành theo thời gian.',
    url: 'https://hieu.asia/learn/bat-tu',
  },
  {
    slug: 'mbti',
    name: 'MBTI',
    role: 'cách bạn ra quyết định',
    full: '16 kiểu tính cách — cách bạn tiếp nhận, suy nghĩ và ra quyết định.',
    give: 'cách bạn tiếp nhận & ra quyết định',
    meta: '16 kiểu · 4 trục Jung',
    eyebrow: 'MBTI · TÂM LÝ HỌC',
    title: 'Gọi tên tâm trí',
    cta: 'Làm trắc nghiệm MBTI',
    href: '/mbti',
    serviceDesc: 'Trắc nghiệm MBTI 4 trục và bản đọc sâu cá nhân hoá.',
    url: 'https://hieu.asia/mbti',
  },
  {
    slug: 'big-five',
    name: 'Big Five',
    role: '5 chiều tính cách',
    full: 'Big Five (OCEAN) — 5 chiều tính cách có cơ sở khoa học vững nhất.',
    give: '5 chiều tính cách (cơ sở khoa học)',
    meta: 'OCEAN · IPIP-NEO',
    eyebrow: 'BIG FIVE · OCEAN',
    title: 'Đo 5 chiều',
    cta: 'Làm trắc nghiệm Big Five',
    href: '/big-five',
    serviceDesc: 'Trắc nghiệm tính cách Big Five (OCEAN) và bản đọc sâu cá nhân hoá.',
    url: 'https://hieu.asia/big-five',
  },
  {
    slug: 'xem-tuong',
    name: 'Xem Tướng',
    role: 'chỉ tay & tướng mặt',
    full: 'Xem Tướng — đọc chỉ tay và tướng mặt qua ảnh, bằng AI thị giác.',
    give: 'nét tướng từ ảnh',
    meta: 'chỉ tay · tướng mặt · AI',
    eyebrow: 'XEM TƯỚNG · AI',
    title: 'Đọc chỉ tay & tướng',
    cta: 'Thử xem tướng',
    href: '/xem-tuong',
    serviceDesc: 'Đọc chỉ tay và tướng mặt từ ảnh bằng AI thị giác đa phương thức.',
    url: 'https://hieu.asia/xem-tuong',
  },
];

export const LENS_COUNT = LENSES.length;
