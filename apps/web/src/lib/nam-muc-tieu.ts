/**
 * Năm mục tiêu của các cụm trang xem ngày theo tuổi — LẬT VÀO MÙNG 1 TẾT.
 *
 * VÌ SAO CÓ FILE NÀY
 * Trước đây mỗi cụm giữ một hằng số `TARGET_YEAR = 2026` gõ tay, kèm ghi chú
 * "cập nhật mỗi mùa". Không ai nhắc thì không ai cập nhật, và **dựng lại web
 * KHÔNG chữa được** vì đó là literal trong mã. Đo được: từ 01/01/2027 có 75
 * trang in sai năm, tới mùng 1 Tết Đinh Mùi là 107 trang, và sang 2029 vẫn 107.
 *
 * VÌ SAO LẬT THEO TẾT chứ không phải 01/01
 * Đây là lựa chọn của founder. Các cụm này (cưới hỏi, làm nhà, khai trương,
 * xông đất) đều xem theo TUỔI ÂM và can chi năm — mà tuổi âm chỉ tăng khi sang
 * năm mới âm lịch. Lật vào 01/01 dương sẽ khiến trang nói "năm Đinh Mùi" trong
 * khi vẫn còn hơn một tháng nữa mới tới Tết.
 *
 * KHÔNG GÕ BẢNG NGÀY TẾT
 * Bảng ngày Tết gõ tay chính là loại lỗi file này sinh ra để dẹp — nó sẽ hết
 * dữ liệu vào một năm nào đó và lại rơi vào im lặng. Thay vào đó dùng thẳng bộ
 * lịch âm sẵn có trong repo (`solarToLunar`, thuật toán Hồ Ngọc Đức, tính theo
 * thiên văn): **năm âm lịch tự nhảy đúng vào mùng 1 Tết**, nên chỉ cần đọc nó.
 *
 * Đã kiểm chứng bằng ngày thật:
 *   26/07/2026 → âm 13/6/2026        → 2026
 *   05/02/2027 → âm 29/12/2026       → 2026   (áp Tết, chưa lật)
 *   06/02/2027 → âm 1/1/2027  ← Tết  → 2027   (lật đúng mùng 1)
 *   25/01/2028 → âm 29/12/2027       → 2027
 *   26/01/2028 → âm 1/1/2028  ← Tết  → 2028
 *
 * DÙNG NHƯ THẾ NÀO — đọc kỹ chỗ này
 * Phải gọi hàm này **lúc render**, KHÔNG gán vào hằng số cấp module. Hằng số
 * cấp module chỉ được tính một lần cho mỗi tiến trình máy chủ, nên quanh mốc
 * Tết các tiến trình cũ/mới sẽ trả về năm khác nhau — **sai không đều còn khó
 * lần hơn sai đều**. Kèm theo, route dùng nó phải khai `revalidate`, nếu không
 * kết quả vẫn bị nướng vào HTML từ lúc build.
 */
import { solarToLunar } from './ngay-kieng-ky';

/**
 * Năm âm lịch đang hiệu lực tại `now` — cũng chính là năm mục tiêu của các cụm
 * xem ngày theo tuổi. Lật vào đúng mùng 1 Tết.
 */
export function namMucTieu(now: Date = new Date()): number {
  // Lịch âm Việt Nam theo múi giờ VN; `solarToLunar` đã tự dùng UTC+7 bên trong,
  // nên chỉ cần đưa vào đúng ngày dương theo giờ VN.
  const vn = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  return solarToLunar(vn.getUTCDate(), vn.getUTCMonth() + 1, vn.getUTCFullYear()).year;
}
