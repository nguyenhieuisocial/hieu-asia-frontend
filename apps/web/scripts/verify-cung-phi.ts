/**
 * Kiểm chứng bảng CUNG_PHI (bát trạch) bằng các ca tính tay.
 * Chạy: pnpm dlx tsx apps/web/scripts/verify-cung-phi.ts
 *
 * Nguồn tham chiếu:
 *   dieukhacdamynghe.vn — bảng direct-lookup từ sumDigits(năm) % 9
 *   (ví dụ xác nhận: nữ 1991 → sumDigits=2 → Càn; nữ 1984 → sumDigits=4 → Cấn)
 *
 * Method code dùng: key = sumDigits(năm dương lịch, đệ quy rút gọn → 1–9),
 * tra bảng direct-lookup. KHÔNG qua La Shu intermediate.
 *
 * Bảng đã audit 2026-06-13 — tất cả 9 key nam + 9 key nữ đều khớp nguồn.
 */

import { cungPhi } from '../src/lib/huong-nha';

let pass = 0;
let fail = 0;

function check(label: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) {
    pass++;
    console.log(`  ✅ ${label}`);
  } else {
    fail++;
    console.log(`  ❌ ${label}\n       got=${JSON.stringify(got)}\n      want=${JSON.stringify(want)}`);
  }
}

// ── NỮ — cases từ nguồn và tính tay ─────────────────────────────────────
// Nguồn dieukhacdamynghe.vn xác nhận: nữ 1991 (sumDigits=2) → Càn
// sumDigits(1991) = 1+9+9+1 = 20 → 2+0 = 2 → key=2 → Càn
console.log('\n[NỮ]');
check('nữ 1991 (key=2) → Càn', cungPhi(1991, 'nu'), 'Càn');

// sumDigits(1984) = 1+9+8+4 = 22 → 2+2 = 4 → key=4 → Cấn
// Xác nhận bởi thanhnienviet.vn: "nữ 1984 thuộc Cấn cung"
check('nữ 1984 (key=4) → Cấn', cungPhi(1984, 'nu'), 'Cấn');

// sumDigits(1990) = 1+9+9+0 = 19 → 1+9 = 10 → 1+0 = 1 → key=1 → Cấn
check('nữ 1990 (key=1) → Cấn', cungPhi(1990, 'nu'), 'Cấn');

// sumDigits(1975) = 1+9+7+5 = 22 → 4 → key=4 → Cấn
check('nữ 1975 (key=4) → Cấn', cungPhi(1975, 'nu'), 'Cấn');

// sumDigits(1970) = 1+9+7+0 = 17 → 8 → key=8 → Chấn
check('nữ 1970 (key=8) → Chấn', cungPhi(1970, 'nu'), 'Chấn');

// sumDigits(1980) = 1+9+8+0 = 18 → 9 → key=9 → Tốn
check('nữ 1980 (key=9) → Tốn', cungPhi(1980, 'nu'), 'Tốn');

// sumDigits(2003) = 2+0+0+3 = 5 → key=5 → Ly
check('nữ 2003 (key=5) → Ly', cungPhi(2003, 'nu'), 'Ly');

// sumDigits(1965) = 1+9+6+5 = 21 → 3 → key=3 → Đoài
check('nữ 1965 (key=3) → Đoài', cungPhi(1965, 'nu'), 'Đoài');

// sumDigits(1973) = 1+9+7+3 = 20 → 2 → key=2 → Càn
check('nữ 1973 (key=2) → Càn', cungPhi(1973, 'nu'), 'Càn');

// sumDigits(1986) = 1+9+8+6 = 24 → 6 → key=6 → Khảm
check('nữ 1986 (key=6) → Khảm', cungPhi(1986, 'nu'), 'Khảm');

// sumDigits(1987) = 1+9+8+7 = 25 → 7 → key=7 → Khôn
check('nữ 1987 (key=7) → Khôn', cungPhi(1987, 'nu'), 'Khôn');

// ── NAM — cases tính tay ────────────────────────────────────────────────
// sumDigits(1990) = 1 → key=1 → Khảm
console.log('\n[NAM]');
check('nam 1990 (key=1) → Khảm', cungPhi(1990, 'nam'), 'Khảm');

// sumDigits(1984) = 4 → key=4 → Đoài
check('nam 1984 (key=4) → Đoài', cungPhi(1984, 'nam'), 'Đoài');

// sumDigits(1991) = 2 → key=2 → Ly
check('nam 1991 (key=2) → Ly', cungPhi(1991, 'nam'), 'Ly');

// sumDigits(1975) = 4 → key=4 → Đoài
check('nam 1975 (key=4) → Đoài', cungPhi(1975, 'nam'), 'Đoài');

// sumDigits(1980) = 9 → key=9 → Khôn
check('nam 1980 (key=9) → Khôn', cungPhi(1980, 'nam'), 'Khôn');

// sumDigits(2003) = 5 → key=5 → Càn
check('nam 2003 (key=5) → Càn', cungPhi(2003, 'nam'), 'Càn');

// sumDigits(1970) = 8 → key=8 → Chấn
check('nam 1970 (key=8) → Chấn', cungPhi(1970, 'nam'), 'Chấn');

// sumDigits(1965) = 3 → key=3 → Cấn
check('nam 1965 (key=3) → Cấn', cungPhi(1965, 'nam'), 'Cấn');

// sumDigits(1986) = 6 → key=6 → Khôn
check('nam 1986 (key=6) → Khôn', cungPhi(1986, 'nam'), 'Khôn');

// sumDigits(1987) = 7 → key=7 → Tốn
check('nam 1987 (key=7) → Tốn', cungPhi(1987, 'nam'), 'Tốn');

// sumDigits(1988) = 8 → key=8 → Chấn
check('nam 1988 (key=8) → Chấn', cungPhi(1988, 'nam'), 'Chấn');

// ── Tổng kết ─────────────────────────────────────────────────────────────
console.log(`\n${pass + fail} cases: ${pass} pass, ${fail} fail`);
if (fail > 0) {
  console.error('\nCó lỗi — kiểm tra lại bảng CUNG_PHI.');
  process.exit(1);
} else {
  console.log('Tất cả đúng.');
}
