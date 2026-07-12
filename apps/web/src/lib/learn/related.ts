// Related-lens cards for the /learn editorial template.
//
// The home flagship catalog (lib/catalog/lenses.ts) only holds the 5 flagship
// lenses and points some hrefs at the TOOL (e.g. /mbti) rather than the /learn
// page. For the learn footer we want every learn topic to cross-link to the
// OTHER learn topics, so this is a small learn-scoped registry keyed by slug.
// Kept separate from the flagship catalog to avoid changing its href contract.

import type { LearnRelatedLens } from '@/components/learn/LearnArticle';

interface LearnTopic extends LearnRelatedLens {
  slug: string;
}

const LEARN_TOPICS: readonly LearnTopic[] = [
  { slug: 'tu-vi', eyebrow: 'ĐÔNG PHƯƠNG', name: 'Tử Vi', href: '/learn/tu-vi' },
  { slug: 'bat-tu', eyebrow: 'NGŨ HÀNH', name: 'Bát Tự', href: '/learn/bat-tu' },
  { slug: 'mbti', eyebrow: 'TÂM LÝ HỌC', name: 'MBTI', href: '/learn/mbti' },
  { slug: 'big-five', eyebrow: 'OCEAN', name: 'Big Five', href: '/learn/big-five' },
  { slug: 'disc', eyebrow: 'HÀNH VI', name: 'DISC', href: '/learn/disc' },
  { slug: 'enneagram', eyebrow: '9 NHÓM', name: 'Enneagram', href: '/learn/enneagram' },
  { slug: 'than-so-hoc', eyebrow: 'PYTHAGORAS', name: 'Thần Số Học', href: '/learn/than-so-hoc' },
  { slug: 'palm', eyebrow: 'XEM TƯỚNG', name: 'Xem chỉ tay', href: '/learn/palm' },
  { slug: 'kinh-dich', eyebrow: 'KINH DỊCH', name: 'Kinh Dịch', href: '/learn/kinh-dich' },
  { slug: 'tarot', eyebrow: 'TAROT', name: 'Tarot', href: '/learn/tarot' },
  { slug: 'phong-thuy', eyebrow: 'PHONG THỦY', name: 'Phong Thủy', href: '/learn/phong-thuy' },
  { slug: 'chiem-tinh', eyebrow: 'CHIÊM TINH', name: 'Chiêm tinh', href: '/learn/chiem-tinh' },
  { slug: 'hop-tuoi', eyebrow: 'CAN CHI', name: 'Hợp tuổi', href: '/learn/hop-tuoi' },
  { slug: 'sao-han', eyebrow: 'CỬU DIỆU', name: 'Sao Hạn', href: '/learn/sao-han' },
  { slug: 'con-giap', eyebrow: '12 ĐỊA CHI', name: '12 Con Giáp', href: '/learn/con-giap' },
  { slug: 'trach-cat', eyebrow: 'TRẠCH CÁT', name: 'Trạch Cát', href: '/learn/trach-cat' },
  { slug: 'can-xuong', eyebrow: 'CÂN XƯƠNG', name: 'Cân Xương', href: '/learn/can-xuong' },
  { slug: 'dat-ten-ngu-hanh', eyebrow: 'NGŨ HÀNH', name: 'Đặt tên ngũ hành', href: '/learn/dat-ten-ngu-hanh' },
];

const BY_SLUG: ReadonlyMap<string, LearnTopic> = new Map(
  LEARN_TOPICS.map((t) => [t.slug, t]),
);

// Chủ đề lân cận chọn tay theo slug — thay cho "lấy 4 mục đầu" (vốn hiển thị
// cùng một tập gợi ý ở mọi trang). Mỗi chủ đề trỏ tới 4 chủ đề gần nghĩa để
// người đọc đi tiếp theo cụm hợp lý, đồng thời tăng liên kết nội bộ theo chủ đề.
// Mọi slug ở đây phải là trang /learn có thật (khớp LEARN_TOPICS).
const NEIGHBORS: Readonly<Record<string, readonly string[]>> = {
  'tu-vi': ['bat-tu', 'sao-han', 'con-giap', 'hop-tuoi'],
  'bat-tu': ['tu-vi', 'hop-tuoi', 'dat-ten-ngu-hanh', 'phong-thuy'],
  'kinh-dich': ['tarot', 'phong-thuy', 'tu-vi', 'trach-cat'],
  'tarot': ['kinh-dich', 'chiem-tinh', 'than-so-hoc', 'mbti'],
  'phong-thuy': ['trach-cat', 'dat-ten-ngu-hanh', 'bat-tu', 'kinh-dich'],
  'chiem-tinh': ['tarot', 'than-so-hoc', 'big-five', 'tu-vi'],
  'than-so-hoc': ['chiem-tinh', 'tarot', 'dat-ten-ngu-hanh', 'mbti'],
  'hop-tuoi': ['con-giap', 'tu-vi', 'bat-tu', 'trach-cat'],
  'con-giap': ['hop-tuoi', 'sao-han', 'tu-vi', 'trach-cat'],
  'sao-han': ['tu-vi', 'con-giap', 'trach-cat', 'hop-tuoi'],
  'trach-cat': ['phong-thuy', 'sao-han', 'hop-tuoi', 'con-giap'],
  'dat-ten-ngu-hanh': ['phong-thuy', 'bat-tu', 'than-so-hoc', 'hop-tuoi'],
  'palm': ['can-xuong', 'mbti', 'tu-vi', 'tarot'],
  'can-xuong': ['palm', 'tu-vi', 'sao-han', 'bat-tu'],
  'mbti': ['big-five', 'enneagram', 'disc', 'than-so-hoc'],
  'big-five': ['mbti', 'disc', 'enneagram', 'chiem-tinh'],
  'disc': ['mbti', 'big-five', 'enneagram', 'palm'],
  'enneagram': ['mbti', 'big-five', 'disc', 'tarot'],
};

/**
 * Related-lens cards for `currentSlug`, capped at `limit` (default 4 — matches
 * the 4-up grid in LearnArticle). Uses the curated `NEIGHBORS` table so each
 * topic points at genuinely adjacent topics. Falls back to the legacy "first N
 * topics" behaviour for any slug not present in the table.
 */
export function relatedLearnLenses(
  currentSlug: string,
  limit = 4,
): LearnRelatedLens[] {
  const curated = NEIGHBORS[currentSlug]
    ?.map((slug) => BY_SLUG.get(slug))
    .filter((t): t is LearnTopic => t !== undefined && t.slug !== currentSlug);

  const topics =
    curated && curated.length > 0
      ? curated
      : LEARN_TOPICS.filter((t) => t.slug !== currentSlug);

  return topics
    .slice(0, limit)
    .map(({ eyebrow, name, href }) => ({ eyebrow, name, href }));
}
