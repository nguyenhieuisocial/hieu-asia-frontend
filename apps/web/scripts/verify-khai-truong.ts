/**
 * Kiểm chứng engine khai-truong.ts bằng các ca tính tay.
 * Chạy: pnpm dlx tsx apps/web/scripts/verify-khai-truong.ts
 *
 * Mốc tham chiếu (lịch can chi):
 *  - chi năm = (year - 4) % 12, 0=Tý … 6=Ngọ … 8=Thân.
 *  - 1990 = Canh Ngọ (chi Ngọ) · 1992 = Nhâm Thân · 1996 = Bính Tý · 2024 = Giáp Thìn
 *    · 2026 = Bính Ngọ · 2028 = Mậu Thân · 2032 = Nhâm Tý.
 *  - Tam Tai theo nhóm tam hợp:
 *      Thân–Tý–Thìn → Tam Tai năm Dần, Mão, Thìn
 *      Dần–Ngọ–Tuất → Tam Tai năm Thân, Dậu, Tuất
 *      Tỵ–Dậu–Sửu  → Tam Tai năm Hợi, Tý, Sửu
 *      Hợi–Mão–Mùi → Tam Tai năm Tỵ, Ngọ, Mùi
 *  - Lục xung: Tý–Ngọ, Sửu–Mùi, Dần–Thân, Mão–Dậu, Thìn–Tuất, Tỵ–Hợi.
 */

import { checkOpeningYear, goodOpeningYearsFrom, canChiOfYear } from '../src/lib/khai-truong';

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

console.log('— Can chi mốc —');
const cc = (y: number) => { const c = canChiOfYear(y); return `${c.can} ${c.chi}`; };
check('1990 = Canh Ngọ', cc(1990), 'Canh Ngọ');
check('1992 = Nhâm Thân', cc(1992), 'Nhâm Thân');
check('2026 = Bính Ngọ', cc(2026), 'Bính Ngọ');
check('2024 = Giáp Thìn', cc(2024), 'Giáp Thìn');

console.log('\n— Tam Tai = "pham" —');
// Tuổi Thân (1992) → Tam Tai năm Dần/Mão/Thìn → 2024 Giáp Thìn vướng.
check('1992 (Thân) × 2024 (Thìn) = pham', checkOpeningYear(1992, 2024).verdict, 'pham');
// Tuổi Ngọ (1990) → nhóm Dần–Ngọ–Tuất → Tam Tai Thân/Dậu/Tuất → 2028 Mậu Thân vướng.
check('1990 (Ngọ) × 2028 (Thân) = pham', checkOpeningYear(1990, 2028).verdict, 'pham');

console.log('\n— Xung tuổi = "can-nhac" —');
// Tuổi Tý (1996) năm Ngọ (2026) → lục xung Tý–Ngọ; Tý nhóm Thân–Tý–Thìn (Tam Tai Dần/Mão/Thìn) nên 2026 Ngọ KHÔNG Tam Tai → can-nhac.
{
  const r = checkOpeningYear(1996, 2026);
  check('1996 (Tý) × 2026 (Ngọ): xung', r.xung.isXung, true);
  check('1996 (Tý) × 2026 (Ngọ): không Tam Tai', r.tamTai.isTamTai, false);
  check('1996 (Tý) × 2026 (Ngọ) = can-nhac', r.verdict, 'can-nhac');
}

console.log('\n— Năm tuổi (trùng chi) = vẫn "thuan" —');
// Tuổi Ngọ (1990) năm Ngọ (2026): trùng chi (Thái Tuế) nhưng KHÔNG xung, KHÔNG Tam Tai → thuan + lưu ý nhẹ.
{
  const r = checkOpeningYear(1990, 2026);
  check('1990 (Ngọ) × 2026 (Ngọ): isNamTuoi', r.xung.isNamTuoi, true);
  check('1990 (Ngọ) × 2026 (Ngọ): không Tam Tai', r.tamTai.isTamTai, false);
  check('1990 (Ngọ) × 2026 (Ngọ) = thuan', r.verdict, 'thuan');
}

console.log('\n— Sạch = "thuan" —');
// Tuổi Thân (1992) năm 2026 (Ngọ): Thân nhóm Thân–Tý–Thìn (Tam Tai Dần/Mão/Thìn) → 2026 Ngọ không Tam Tai; Thân không xung Ngọ → thuan.
check('1992 (Thân) × 2026 (Ngọ) = thuan', checkOpeningYear(1992, 2026).verdict, 'thuan');

console.log('\n— goodOpeningYearsFrom —');
// Tuổi Thân (1992) từ 2026: loại năm Tam Tai (Dần 2034.. ngoài dải, Thìn 2024 trước mốc) + xung Dần.
{
  const good = goodOpeningYearsFrom(1992, 2026, 4);
  check('1992 (Thân) từ 2026: trả 4 năm', good.length, 4);
  // 2026 Ngọ thuan, 2027 Mùi thuan, 2028 Thân (năm tuổi, thuan), 2029 Dậu thuan → 4 năm đầu đều hợp (Thân Tam Tai ở Dần/Mão/Thìn = 2034/2035/2036).
  check('1992 (Thân) từ 2026: 2026-2029', good, [2026, 2027, 2028, 2029]);
}

console.log(`\n${'═'.repeat(40)}\nKẾT QUẢ: ${pass} pass · ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
