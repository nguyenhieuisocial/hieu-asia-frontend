// ─────────────────────────────────────────────────────────────────────────────
// TOOL → LEARN COVERAGE — bản đồ "mỗi công cụ một bài Học của riêng nó".
//
// Bất biến (tool-coverage.test.ts canh):
//   1. Mọi công cụ công khai (có `catalog` hoặc `home` trong TOOL_REGISTRY) đều
//      phải có mặt ở đây hoặc nằm trong EXEMPT_TOOLS.
//   2. KHÔNG hai công cụ nào trỏ về cùng một bài Học — trước đây 5 công cụ ngày
//      giờ (/lich-van-nien, /xem-ngay, /gio-hoang-dao, /ngay-kieng-ky,
//      /thien-van) dùng chung /learn/trach-cat, nên người đọc mở bài Học từ
//      "lịch thiên văn" lại rơi vào bài chọn ngày cưới. Bất biến này chặn việc đó
//      tái diễn.
//   3. Mọi đích không nằm trong PENDING phải là trang có thật trên đĩa.
//
// PENDING = đã có chỗ trên bản đồ nhưng bài chưa viết xong. Viết xong bài nào thì
// XOÁ slug đó khỏi PENDING (test sẽ tự đòi trang phải tồn tại). Chương trình kết
// thúc khi PENDING rỗng.
//
// Kế hoạch đầy đủ + "lõi riêng" của từng bài (không bài nào được lấn lõi bài
// khác): docs/superpowers/plans/2026-07-31-learn-per-tool.md
// ─────────────────────────────────────────────────────────────────────────────

/** Công cụ → bài Học CHÍNH của riêng nó. Giá trị phải đôi một khác nhau. */
export const TOOL_LEARN_MAP: Readonly<Record<string, string>> = {
  // ── đã có sẵn ──────────────────────────────────────────────────────────────
  '/tu-vi': '/learn/tu-vi',
  '/bat-tu': '/learn/bat-tu',
  '/mbti': '/learn/mbti',
  '/big-five': '/learn/big-five',
  '/disc': '/learn/disc',
  '/enneagram': '/learn/enneagram',
  '/than-so-hoc': '/learn/than-so-hoc',
  '/tarot': '/learn/tarot',
  '/gieo-que': '/learn/kinh-dich',
  '/can-xuong': '/learn/can-xuong',
  '/sao-han': '/learn/sao-han',
  '/hop-tuoi': '/learn/hop-tuoi',
  '/dat-ten-ngu-hanh': '/learn/dat-ten-ngu-hanh',
  '/xem-ngay': '/learn/trach-cat',
  '/ban-do-sao': '/learn/chiem-tinh',
  '/xem-tuong': '/learn/palm',

  // ── dùng trang con đã có của /learn/tu-vi (không tạo bài mới) ───────────────
  '/tu-vi-nghe-nghiep': '/learn/tu-vi/cung-quan-loc',
  '/tu-vi-tinh-yeu': '/learn/tu-vi/cung-phu-the',
  '/tu-vi-tai-chinh': '/learn/tu-vi/cung-tai-bach',

  // ── xem tuổi việc lớn ──────────────────────────────────────────────────────
  '/kim-lau': '/learn/kim-lau',
  '/tam-tai': '/learn/tam-tai',
  '/xem-tuoi-lam-nha': '/learn/hoang-oc',
  '/xem-tuoi-cuoi': '/learn/cuoi-hoi',
  '/khai-truong': '/learn/khai-truong',
  '/xong-dat': '/learn/xong-dat',
  '/tra-cuu-tuoi': '/learn/doc-mot-tuoi',

  // ── ngày giờ tốt xấu ───────────────────────────────────────────────────────
  '/lich-van-nien': '/learn/lich-am-duong',
  '/gio-hoang-dao': '/learn/gio-hoang-dao',
  '/ngay-kieng-ky': '/learn/ngay-kieng-ky',
  '/xuat-hanh': '/learn/xuat-hanh',
  '/thien-van': '/learn/thien-van',

  // ── phong thuỷ chuyên sâu ──────────────────────────────────────────────────
  '/huong-nha': '/learn/bat-trach',
  '/huong-ban-lam-viec': '/learn/du-nien',
  '/phi-tinh': '/learn/huyen-khong-phi-tinh',
  '/thuoc-lo-ban': '/learn/thuoc-lo-ban',
  '/mau-xe-hop-menh': '/learn/ngu-hanh-mau-sac',

  // ── nền tảng can chi ───────────────────────────────────────────────────────
  '/ban-menh': '/learn/nap-am',
  '/luc-thap-hoa-giap': '/learn/can-chi',
  '/tuong-hop-12-con-giap': '/learn/tam-hop-luc-xung',
  '/tinh-menh-cuc': '/learn/menh-cuc',

  // ── lập lá số ──────────────────────────────────────────────────────────────
  '/la-so-tu-vi': '/learn/lap-la-so',
  '/la-so-bat-tu': '/learn/lap-bat-tu',

  // ── vận theo thời gian ─────────────────────────────────────────────────────
  '/dai-van-hien-tai': '/learn/dai-van',
  '/timeline': '/learn/giao-van',
  '/tu-vi-hom-nay': '/learn/nhat-van',
  '/tu-vi-thang': '/learn/tiet-khi',
  '/tu-vi-2026': '/learn/thai-tue',
  '/tu-vi-2027': '/learn/luu-nien',

  // ── văn hoá & thiên văn ────────────────────────────────────────────────────
  '/cung-hoang-dao': '/learn/cung-hoang-dao',
  '/that-tich-2026': '/learn/that-tich',
  '/valentine-2027': '/learn/ngay-tinh-yeu',
  '/ban-do': '/learn/nhip-song',

  // ── quan hệ & gia đình ─────────────────────────────────────────────────────
  '/compatibility': '/learn/hop-doi',
  '/xem-hop-nhom': '/learn/dong-nhom',
  '/family-profiles': '/learn/hieu-nguoi-than',
  '/sinh-con': '/learn/sinh-con',

  // ── tư duy phản biện ───────────────────────────────────────────────────────
  '/bang-chung': '/learn/kiem-chung',
  '/tu-kiem': '/learn/barnum',
  '/so-sanh': '/learn/so-sanh-lang-kinh',
  '/decision-simulator': '/learn/ra-quyet-dinh',
  '/career-fit': '/learn/nghe-nghiep',
};

/**
 * Trang KHÔNG phải công cụ tính toán nên không cần bài Học riêng:
 * /reading là trang bán bài đọc 5 lăng kính, /hoi-dap là hub hỏi đáp gom câu hỏi
 * của mọi công cụ. Cả hai trỏ về hub /learn.
 */
export const EXEMPT_TOOLS: readonly string[] = ['/reading', '/hoi-dap'];

/**
 * Bài đã lên bản đồ nhưng CHƯA viết. Xoá dần theo từng đợt; rỗng = xong chương
 * trình "mỗi công cụ một bài Học riêng".
 */
export const PENDING: readonly string[] = [
  '/learn/doc-mot-tuoi',
  '/learn/nhat-van',
  '/learn/that-tich',
  '/learn/ngay-tinh-yeu',
  '/learn/nhip-song',
  '/learn/sinh-con',
  '/learn/tuong-mat',
];

/** Bài Học phụ (không phải `learn` chính) — công cụ có thể trỏ thêm. */
export const SECONDARY_LEARN: Readonly<Record<string, readonly string[]>> = {
  '/xem-tuong': ['/learn/tuong-mat'],
};
