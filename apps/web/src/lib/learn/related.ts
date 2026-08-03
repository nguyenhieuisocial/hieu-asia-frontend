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
  // Đợt 2 — cụm phong thuỷ chuyên sâu. Trước đó 3 công cụ (/thuoc-lo-ban,
  // /phi-tinh, /huong-ban-lam-viec) cùng trỏ về bài ô /learn/phong-thuy.
  { slug: 'du-nien', eyebrow: 'BÁT BIẾN', name: '8 du niên', href: '/learn/du-nien' },
  { slug: 'huyen-khong-phi-tinh', eyebrow: 'CỬU VẬN', name: 'Huyền Không Phi Tinh', href: '/learn/huyen-khong-phi-tinh' },
  { slug: 'thuoc-lo-ban', eyebrow: 'KÍCH THƯỚC', name: 'Thước Lỗ Ban', href: '/learn/thuoc-lo-ban' },
  { slug: 'ngu-hanh-mau-sac', eyebrow: 'SINH KHẮC', name: 'Ngũ hành & màu sắc', href: '/learn/ngu-hanh-mau-sac' },
  // Đợt 3 — nền tảng can chi + hướng xuất hành.
  { slug: 'can-chi', eyebrow: 'CHU KỲ 60', name: 'Thiên can – Địa chi', href: '/learn/can-chi' },
  { slug: 'nap-am', eyebrow: 'BẢN MỆNH', name: 'Nạp âm', href: '/learn/nap-am' },
  { slug: 'tam-hop-luc-xung', eyebrow: 'VÒNG 12 CHI', name: 'Tam hợp – Lục xung', href: '/learn/tam-hop-luc-xung' },
  { slug: 'xuat-hanh', eyebrow: 'HỶ THẦN', name: 'Hướng xuất hành', href: '/learn/xuat-hanh' },
  // Đợt 4 — việc lớn theo tuổi + thiên văn.
  { slug: 'cuoi-hoi', eyebrow: 'CƯỚI HỎI', name: 'Xem tuổi cưới', href: '/learn/cuoi-hoi' },
  // eyebrow KHÔNG để 'THÁI TUẾ': đó là nhãn của bài /learn/thai-tue (nay đã có).
  // Bài này chỉ dùng Thái Tuế ở lát cắt cần cho việc mở hàng.
  { slug: 'khai-truong', eyebrow: 'MỞ HÀNG', name: 'Tuổi khai trương', href: '/learn/khai-truong' },
  { slug: 'xong-dat', eyebrow: 'TỤC TẾT', name: 'Xông đất', href: '/learn/xong-dat' },
  { slug: 'thien-van', eyebrow: 'NHẬT NGUYỆT THỰC', name: 'Lịch thiên văn', href: '/learn/thien-van' },
  // Đợt 5 — cách máy tính ra kết quả: lập lá số, lập tứ trụ, và hai thứ làm nền.
  { slug: 'menh-cuc', eyebrow: 'MỆNH & CỤC', name: 'Mệnh và Cục', href: '/learn/menh-cuc' },
  { slug: 'lap-la-so', eyebrow: 'AN SAO', name: 'Lập lá số Tử Vi', href: '/learn/lap-la-so' },
  { slug: 'tiet-khi', eyebrow: '24 TIẾT KHÍ', name: '24 tiết khí', href: '/learn/tiet-khi' },
  { slug: 'lap-bat-tu', eyebrow: 'TỨ TRỤ', name: 'Lập tứ trụ Bát Tự', href: '/learn/lap-bat-tu' },
  // Đợt 6 — vận theo thời gian.
  { slug: 'dai-van', eyebrow: '10 NĂM', name: 'Đại vận', href: '/learn/dai-van' },
  { slug: 'thai-tue', eyebrow: 'NĂM TUỔI', name: 'Thái Tuế', href: '/learn/thai-tue' },
  // Đợt 7 — khép cụm vận theo thời gian.
  { slug: 'giao-van', eyebrow: 'CHUYỂN VẬN', name: 'Giao vận', href: '/learn/giao-van' },
  { slug: 'luu-nien', eyebrow: 'CHỒNG LỚP', name: 'Lưu niên', href: '/learn/luu-nien' },
  // Đợt 8 — quan hệ & tư duy phản biện.
  { slug: 'so-sanh-lang-kinh', eyebrow: 'ĐỐI CHIẾU', name: 'So sánh lăng kính', href: '/learn/so-sanh-lang-kinh' },
  { slug: 'ra-quyet-dinh', eyebrow: 'THIÊN KIẾN', name: 'Ra quyết định', href: '/learn/ra-quyet-dinh' },
  { slug: 'hop-doi', eyebrow: 'HỢP ĐÔI', name: 'Điểm hợp đôi', href: '/learn/hop-doi' },
  { slug: 'dong-nhom', eyebrow: 'NHÓM', name: 'Động lực nhóm', href: '/learn/dong-nhom' },
  { slug: 'hieu-nguoi-than', eyebrow: 'ĐẠO ĐỨC', name: 'Hiểu người thân', href: '/learn/hieu-nguoi-than' },
  { slug: 'nghe-nghiep', eyebrow: 'SỞ THÍCH NGHỀ', name: 'Gợi ý nghề nghiệp', href: '/learn/nghe-nghiep' },
  // Đợt 9 — đợt CUỐI của chương trình "mỗi công cụ một bài Học riêng".
  { slug: 'doc-mot-tuoi', eyebrow: 'MỘT NĂM SINH', name: 'Đọc một tuổi', href: '/learn/doc-mot-tuoi' },
  { slug: 'nhat-van', eyebrow: 'VẬN NGÀY', name: 'Tử Vi hôm nay', href: '/learn/nhat-van' },
  { slug: 'tuong-mat', eyebrow: 'NHÂN TƯỚNG', name: 'Tướng mặt', href: '/learn/tuong-mat' },
  { slug: 'that-tich', eyebrow: 'NGƯU LANG', name: 'Thất Tịch', href: '/learn/that-tich' },
  { slug: 'ngay-tinh-yeu', eyebrow: 'VĂN HOÁ', name: 'Ngày tình yêu', href: '/learn/ngay-tinh-yeu' },
  { slug: 'nhip-song', eyebrow: 'KẾ HOẠCH', name: 'Nhịp sống', href: '/learn/nhip-song' },
  { slug: 'sinh-con', eyebrow: 'CHỌN NĂM', name: 'Sinh con theo năm', href: '/learn/sinh-con' },
  // Đợt 8 — tư duy phản biện (mở đầu cụm, còn 3 bài nữa trong PENDING).
  { slug: 'barnum', eyebrow: 'HIỆU ỨNG FORER', name: 'Hiệu ứng Barnum', href: '/learn/barnum' },
  { slug: 'kiem-chung', eyebrow: 'KHẢ SAI', name: 'Kiểm chứng dự đoán', href: '/learn/kiem-chung' },
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
  'bat-tu': ['tu-vi', 'hop-tuoi', 'dat-ten-ngu-hanh', 'phong-thuy'],
  'kinh-dich': ['tarot', 'phong-thuy', 'tu-vi', 'trach-cat'],
  'tarot': ['kinh-dich', 'chiem-tinh', 'than-so-hoc', 'mbti'],
  // Bài ô trỏ XUỐNG 4 bài chuyên sâu của chính nó (ngu-hanh-mau-sac được link
  // trong thân bài). Trước đây bài ô giảng lại đủ cả 4 chủ đề mà không có một
  // link nào sang chúng — hai trang cùng chủ đề, cùng domain, không liên kết là
  // đúng kịch bản Google tự chọn một bản và dìm bản kia.
  'phong-thuy': ['bat-trach', 'du-nien', 'huyen-khong-phi-tinh', 'thuoc-lo-ban'],
  'chiem-tinh': ['cung-hoang-dao', 'tarot', 'than-so-hoc', 'big-five'],
  'than-so-hoc': ['chiem-tinh', 'tarot', 'dat-ten-ngu-hanh', 'mbti'],
  'hop-tuoi': ['con-giap', 'tu-vi', 'bat-tu', 'trach-cat'],
  'con-giap': ['hop-tuoi', 'sao-han', 'tu-vi', 'trach-cat'],
  // thien-van đứng đầu: nó giải thích La Hầu / Kế Đô thực chất là hai giao điểm
  // quỹ đạo. Thiếu chiều này thì liên kết giữa hai bài chỉ có một chiều.
  'sao-han': ['thien-van', 'tu-vi', 'con-giap', 'trach-cat'],
  'trach-cat': ['gio-hoang-dao', 'ngay-kieng-ky', 'lich-am-duong', 'phong-thuy'],
  // Đợt 1 — mỗi bài mới trỏ về 4 bài gần nghĩa, và các bài cũ ở trên đã được
  // chỉnh để trỏ NGƯỢC lại, tránh chủ đề mới thành ngõ cụt trong liên kết nội bộ.
  'kim-lau': ['tam-tai', 'hoang-oc', 'hop-tuoi', 'sao-han'],
  'tam-tai': ['kim-lau', 'hoang-oc', 'sao-han', 'con-giap'],
  'hoang-oc': ['kim-lau', 'tam-tai', 'bat-trach', 'phong-thuy'],
  'bat-trach': ['du-nien', 'huyen-khong-phi-tinh', 'phong-thuy', 'hoang-oc'],
  'du-nien': ['bat-trach', 'huyen-khong-phi-tinh', 'phong-thuy', 'thuoc-lo-ban'],
  'huyen-khong-phi-tinh': ['bat-trach', 'du-nien', 'phong-thuy', 'thuoc-lo-ban'],
  'thuoc-lo-ban': ['phong-thuy', 'bat-trach', 'ngu-hanh-mau-sac', 'hoang-oc'],
  'ngu-hanh-mau-sac': ['nap-am', 'dat-ten-ngu-hanh', 'phong-thuy', 'thuoc-lo-ban'],
  'can-chi': ['nap-am', 'tam-hop-luc-xung', 'con-giap', 'bat-tu'],
  'nap-am': ['can-chi', 'ngu-hanh-mau-sac', 'dat-ten-ngu-hanh', 'bat-tu'],
  'tam-hop-luc-xung': ['con-giap', 'hop-tuoi', 'can-chi', 'sao-han'],
  'xuat-hanh': ['gio-hoang-dao', 'trach-cat', 'lich-am-duong', 'bat-trach'],
  'cuoi-hoi': ['kim-lau', 'tam-tai', 'hop-tuoi', 'trach-cat'],
  'khai-truong': ['thai-tue', 'tam-tai', 'xong-dat', 'trach-cat'],
  // xong-dat ↔ khai-truong phải trỏ nhau: hai bài đối xử KHÁC NHAU với cùng một
  // cấu hình "trùng chi năm / Thái Tuế", nên phải đọc được sang nhau để người
  // đọc thấy đó là khác biệt có chủ ý giữa hai tục, không phải site tự mâu thuẫn.
  'xong-dat': ['tam-hop-luc-xung', 'khai-truong', 'nap-am', 'hop-tuoi'],
  'thien-van': ['lich-am-duong', 'sao-han', 'chiem-tinh', 'tiet-khi'],
  'menh-cuc': ['lap-la-so', 'nap-am', 'tu-vi', 'can-chi'],
  'lap-la-so': ['menh-cuc', 'tu-vi', 'lap-bat-tu', 'can-chi'],
  'lap-bat-tu': ['tiet-khi', 'bat-tu', 'can-chi', 'lap-la-so'],
  'tiet-khi': ['lich-am-duong', 'lap-bat-tu', 'thien-van', 'trach-cat'],
  'dai-van': ['giao-van', 'luu-nien', 'menh-cuc', 'thai-tue'],
  'giao-van': ['dai-van', 'luu-nien', 'tiet-khi', 'menh-cuc'],
  'luu-nien': ['dai-van', 'thai-tue', 'giao-van', 'sao-han'],
  'so-sanh-lang-kinh': ['barnum', 'kiem-chung', 'ra-quyet-dinh', 'mbti'],
  'ra-quyet-dinh': ['so-sanh-lang-kinh', 'nghe-nghiep', 'barnum', 'kiem-chung'],
  'nghe-nghiep': ['ra-quyet-dinh', 'so-sanh-lang-kinh', 'mbti', 'disc'],
  'doc-mot-tuoi': ['can-chi', 'nap-am', 'kim-lau', 'tam-tai'],
  'nhat-van': ['can-chi', 'barnum', 'luu-nien', 'trach-cat'],
  'tuong-mat': ['palm', 'can-xuong', 'barnum', 'kiem-chung'],
  'that-tich': ['thien-van', 'ngay-tinh-yeu', 'lich-am-duong', 'hop-doi'],
  'ngay-tinh-yeu': ['that-tich', 'hop-doi', 'lich-am-duong', 'cung-hoang-dao'],
  'nhip-song': ['dai-van', 'luu-nien', 'tiet-khi', 'trach-cat'],
  'sinh-con': ['nap-am', 'tam-hop-luc-xung', 'dat-ten-ngu-hanh', 'hieu-nguoi-than'],
  'hop-doi': ['dong-nhom', 'hop-tuoi', 'tam-hop-luc-xung', 'hieu-nguoi-than'],
  'dong-nhom': ['hop-doi', 'hieu-nguoi-than', 'disc', 'hop-tuoi'],
  'hieu-nguoi-than': ['dong-nhom', 'hop-doi', 'enneagram', 'barnum'],
  // thai-tue ↔ khai-truong trỏ nhau: khai-truong dùng Thái Tuế ở lát cắt mở hàng,
  // thai-tue giữ khái niệm tổng quát. Không trỏ nhau thì đọc như hai bài rời rạc.
  'thai-tue': ['khai-truong', 'tam-hop-luc-xung', 'dai-van', 'can-chi'],
  'cung-hoang-dao': ['chiem-tinh', 'tarot', 'than-so-hoc', 'con-giap'],
  'lich-am-duong': ['trach-cat', 'gio-hoang-dao', 'ngay-kieng-ky', 'sao-han'],
  'gio-hoang-dao': ['trach-cat', 'lich-am-duong', 'ngay-kieng-ky', 'phong-thuy'],
  'ngay-kieng-ky': ['trach-cat', 'gio-hoang-dao', 'lich-am-duong', 'tam-tai'],
  'dat-ten-ngu-hanh': ['phong-thuy', 'bat-tu', 'than-so-hoc', 'hop-tuoi'],
  'palm': ['can-xuong', 'mbti', 'tu-vi', 'tarot'],
  'can-xuong': ['palm', 'tu-vi', 'sao-han', 'bat-tu'],
  'mbti': ['big-five', 'enneagram', 'disc', 'than-so-hoc'],
  'big-five': ['mbti', 'disc', 'enneagram', 'chiem-tinh'],
  'disc': ['mbti', 'big-five', 'enneagram', 'palm'],
  'enneagram': ['mbti', 'big-five', 'disc', 'tarot'],
  // Đợt 8 — hai bài trỏ nhau trước (companion), rồi ra ngoài cụm mình đang
  // soi: barnum về phía các bảng hỏi tính cách, kiem-chung về phía Tử Vi vì
  // công cụ Bằng Chứng backtest đúng hệ đó.
  'barnum': ['kiem-chung', 'mbti', 'tarot', 'than-so-hoc'],
  'kiem-chung': ['barnum', 'tu-vi', 'sao-han', 'thai-tue'],
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
