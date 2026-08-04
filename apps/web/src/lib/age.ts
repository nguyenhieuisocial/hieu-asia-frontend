/**
 * Tuổi dương lịch tính tới hôm nay, trừ thêm 1 nếu chưa qua sinh nhật trong năm.
 * Trước đây hàm này bị lặp lại y hệt ở 3 nơi (TimeFlowChecker, LaSoChecker,
 * BatTuChecker) — gom về một chỗ theo quy tắc "fix tận gốc, không vá lẻ".
 * `/dai-van-hien-tai/form.tsx` từng dùng công thức thiếu (chỉ trừ năm sinh,
 * không trừ thêm 1) nên lệch 1 tuổi với 3 nơi trên trong khoảng đầu năm tới
 * trước sinh nhật — sửa cùng đợt này để cả site dùng chung một quy ước.
 */
export function ageFromDate(dateStr: string, now: Date = new Date()): number | null {
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec((dateStr ?? '').trim());
  if (!m) return null;
  const by = Number(m[1]);
  const bm = Number(m[2]);
  const bd = Number(m[3]);
  let age = now.getFullYear() - by;
  const mo = now.getMonth() + 1;
  if (mo < bm || (mo === bm && now.getDate() < bd)) age -= 1;
  return age >= 0 && age < 140 ? age : null;
}
