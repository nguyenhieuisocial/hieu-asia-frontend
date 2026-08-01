// Related-lens cards for the /learn editorial template.
//
// The home flagship catalog (lib/catalog/lenses.ts) only holds the 5 flagship
// lenses and points some hrefs at the TOOL (e.g. /mbti) rather than the /learn
// page. For the learn footer we want every learn topic to cross-link to the
// OTHER learn topics, so this is a small learn-scoped registry keyed by slug.
// Kept separate from the flagship catalog to avoid changing its href contract.

import type { LearnRelatedLens } from '@/components/learn/LearnArticle';

export interface LearnTopic extends LearnRelatedLens {
  slug: string;
}

export const LEARN_TOPICS: readonly LearnTopic[] = [
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
  // Đợt 1 của chương trình "mỗi công cụ một bài Học riêng" (xem
  // lib/learn/tool-coverage.ts). Trước đây 5 công cụ ngày–giờ cùng trỏ về
  // /learn/trach-cat và 36 công cụ không có bài Học nào.
  { slug: 'kim-lau', eyebrow: 'TUỔI CƯỚI', name: 'Kim Lâu', href: '/learn/kim-lau' },
  { slug: 'tam-tai', eyebrow: 'TAM HỢP', name: 'Tam Tai', href: '/learn/tam-tai' },
  { slug: 'hoang-oc', eyebrow: 'LÀM NHÀ', name: 'Hoang Ốc', href: '/learn/hoang-oc' },
  { slug: 'bat-trach', eyebrow: 'CUNG PHI', name: 'Bát Trạch', href: '/learn/bat-trach' },
  { slug: 'cung-hoang-dao', eyebrow: '12 CUNG', name: 'Cung hoàng đạo', href: '/learn/cung-hoang-dao' },
  { slug: 'lich-am-duong', eyebrow: 'LỊCH PHÁP', name: 'Lịch âm dương', href: '/learn/lich-am-duong' },
  { slug: 'gio-hoang-dao', eyebrow: '12 GIỜ', name: 'Giờ hoàng đạo', href: '/learn/gio-hoang-dao' },
  { slug: 'ngay-kieng-ky', eyebrow: 'KIÊNG KỴ', name: 'Ngày kiêng kỵ', href: '/learn/ngay-kieng-ky' },
  // Từ đợt "lập lá số & tứ trụ" (/tu-vi-thang → /learn/tiet-khi trong tool-coverage.ts).
  { slug: 'tiet-khi', eyebrow: '24 MỐC MẶT TRỜI', name: '24 tiết khí', href: '/learn/tiet-khi' },
];

const BY_SLUG: ReadonlyMap<string, LearnTopic> = new Map(
  LEARN_TOPICS.map((t) => [t.slug, t]),
);

/** Tra một chủ đề /learn theo slug (dùng cho lộ trình học + chip "Học tiếp"). */
export function learnTopicBySlug(slug: string): LearnTopic | undefined {
  return BY_SLUG.get(slug);
}

// Chủ đề lân cận chọn tay theo slug — thay cho "lấy 4 mục đầu" (vốn hiển thị
// cùng một tập gợi ý ở mọi trang). Mỗi chủ đề trỏ tới 4 chủ đề gần nghĩa để
// người đọc đi tiếp theo cụm hợp lý, đồng thời tăng liên kết nội bộ theo chủ đề.
// Mọi slug ở đây phải là trang /learn có thật (khớp LEARN_TOPICS).
const NEIGHBORS: Readonly<Record<string, readonly string[]>> = {
  'tu-vi': ['bat-tu', 'sao-han', 'con-giap', 'hop-tuoi'],
  'bat-tu': ['tu-vi', 'hop-tuoi', 'dat-ten-ngu-hanh', 'tiet-khi'],
  'kinh-dich': ['tarot', 'phong-thuy', 'tu-vi', 'trach-cat'],
  'tarot': ['kinh-dich', 'chiem-tinh', 'than-so-hoc', 'mbti'],
  'phong-thuy': ['bat-trach', 'trach-cat', 'dat-ten-ngu-hanh', 'bat-tu'],
  'chiem-tinh': ['cung-hoang-dao', 'tarot', 'than-so-hoc', 'big-five'],
  'than-so-hoc': ['chiem-tinh', 'tarot', 'dat-ten-ngu-hanh', 'mbti'],
  'hop-tuoi': ['con-giap', 'tu-vi', 'bat-tu', 'trach-cat'],
  'con-giap': ['hop-tuoi', 'sao-han', 'tu-vi', 'trach-cat'],
  'sao-han': ['tu-vi', 'con-giap', 'trach-cat', 'hop-tuoi'],
  'trach-cat': ['gio-hoang-dao', 'ngay-kieng-ky', 'lich-am-duong', 'phong-thuy'],
  // Đợt 1 — mỗi bài mới trỏ về 4 bài gần nghĩa, và các bài cũ ở trên đã được
  // chỉnh để trỏ NGƯỢC lại, tránh chủ đề mới thành ngõ cụt trong liên kết nội bộ.
  'kim-lau': ['tam-tai', 'hoang-oc', 'hop-tuoi', 'sao-han'],
  'tam-tai': ['kim-lau', 'hoang-oc', 'sao-han', 'con-giap'],
  'hoang-oc': ['kim-lau', 'tam-tai', 'bat-trach', 'phong-thuy'],
  'bat-trach': ['phong-thuy', 'hoang-oc', 'trach-cat', 'dat-ten-ngu-hanh'],
  'cung-hoang-dao': ['chiem-tinh', 'tarot', 'than-so-hoc', 'con-giap'],
  'lich-am-duong': ['trach-cat', 'gio-hoang-dao', 'ngay-kieng-ky', 'tiet-khi'],
  'gio-hoang-dao': ['trach-cat', 'lich-am-duong', 'ngay-kieng-ky', 'tiet-khi'],
  'ngay-kieng-ky': ['trach-cat', 'gio-hoang-dao', 'lich-am-duong', 'tiet-khi'],
  'dat-ten-ngu-hanh': ['phong-thuy', 'bat-tu', 'than-so-hoc', 'hop-tuoi'],
  // Từ đợt "lập lá số & tứ trụ" — tiết khí là mốc đổi trụ tháng nên gắn chặt với
  // bát tự và lịch pháp; thiên-van/can-chi (2 láng giềng lẽ ra cũng thuộc đây)
  // chưa có bài riêng trên nhánh này nên tạm chưa đưa vào.
  'tiet-khi': ['lich-am-duong', 'bat-tu', 'gio-hoang-dao', 'ngay-kieng-ky'],
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
