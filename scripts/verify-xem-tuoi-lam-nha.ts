/**
 * Kiểm chứng lib/xem-tuoi-lam-nha.ts với các ca tính tay (đối chiếu công thức
 * dân gian phổ biến + worker lich-van-nien.ts).
 * Chạy: pnpm dlx tsx scripts/verify-xem-tuoi-lam-nha.ts
 */
import {
  checkHoangOc,
  checkBuildYear,
  goodBuildYearsFrom,
} from '../apps/web/src/lib/xem-tuoi-lam-nha';

let failed = 0;
function eq(actual: unknown, expected: unknown, label: string) {
  const ok = actual === expected;
  if (!ok) failed++;
  console.log(`${ok ? '✅' : '❌'} ${label}: ${String(actual)}${ok ? '' : ` (expected ${String(expected)})`}`);
}

// ── Hoang Ốc thuần (tuổi mụ chia 6, dư 0 = 6) ──────────────────────
eq(checkHoangOc(1990, 2026).cung, 'Nhất Cát', '1990→2026 (tuổi mụ 37, dư 1) Hoang Ốc');
eq(checkHoangOc(1990, 2026).isPham, false, '1990→2026 Hoang Ốc không phạm');
eq(checkHoangOc(1991, 2026).cung, 'Lục Hoang Ốc', '1991→2026 (tuổi mụ 36, dư 0→6)');
eq(checkHoangOc(1991, 2026).isPham, true, '1991→2026 Hoang Ốc phạm');
eq(checkHoangOc(1986, 2026).cung, 'Ngũ Thọ Tử', '1986→2026 (tuổi mụ 41, dư 5)');
eq(checkHoangOc(1987, 2026).cung, 'Tứ Tấn Tài', '1987→2026 (tuổi mụ 40, dư 4)');
eq(checkHoangOc(1989, 2026).cung, 'Nhì Nghi', '1989→2026 (tuổi mụ 38, dư 2)');
eq(checkHoangOc(1994, 2026).cung, 'Tam Địa Sát', '1994→2026 (tuổi mụ 33, dư 3)');

// ── Ca tổng hợp 2026 ───────────────────────────────────────────────
// 1990 Canh Ngọ: tuổi mụ 37 %9=1 → Kim Lâu Thân (Hoang Ốc Nhất Cát, không Tam Tai).
const r1990 = checkBuildYear(1990, 2026);
eq(r1990.kimLau.type, 'Kim Lâu Thân', '1990→2026 Kim Lâu');
eq(r1990.tamTai.isTamTai, false, '1990→2026 Tam Tai');
eq(r1990.xung.isNamTuoi, true, '1990→2026 năm tuổi (Ngọ gặp Ngọ)');
eq(r1990.verdict, 'pham', '1990→2026 verdict');

// 1991 Tân Mùi: tuổi mụ 36 → không Kim Lâu nhưng Lục Hoang Ốc + Tam Tai (Mùi ∈ Tỵ,Ngọ,Mùi... năm Ngọ).
const r1991 = checkBuildYear(1991, 2026);
eq(r1991.kimLau.type, undefined, '1991→2026 Kim Lâu (không)');
eq(r1991.hoangOc.isPham, true, '1991→2026 Hoang Ốc phạm');
eq(r1991.tamTai.isTamTai, true, '1991→2026 Tam Tai (nhóm Hợi-Mão-Mùi gặp năm Ngọ)');
eq(r1991.verdict, 'pham', '1991→2026 verdict');

// 1987 Đinh Mão: tuổi mụ 40 sạch Kim Lâu/Hoang Ốc nhưng nhóm Hợi-Mão-Mùi phạm Tam Tai năm Ngọ.
const r1987 = checkBuildYear(1987, 2026);
eq(r1987.kimLau.type, undefined, '1987→2026 Kim Lâu (không)');
eq(r1987.hoangOc.isPham, false, '1987→2026 Hoang Ốc (Tứ Tấn Tài)');
eq(r1987.tamTai.isTamTai, true, '1987→2026 Tam Tai');
eq(r1987.verdict, 'pham', '1987→2026 verdict');

// 1984 Giáp Tý: sạch 3 hạn chính nhưng Tý–Ngọ lục xung → cần cân nhắc.
const r1984 = checkBuildYear(1984, 2026);
eq(r1984.kimLau.type, undefined, '1984→2026 Kim Lâu (không)');
eq(r1984.hoangOc.isPham, false, '1984→2026 Hoang Ốc (Nhất Cát)');
eq(r1984.tamTai.isTamTai, false, '1984→2026 Tam Tai (không)');
eq(r1984.xung.isXung, true, '1984→2026 lục xung Tý–Ngọ');
eq(r1984.verdict, 'can-nhac', '1984→2026 verdict');

// 1986 Bính Dần: tuổi mụ 41 → Ngũ Thọ Tử.
const r1986 = checkBuildYear(1986, 2026);
eq(r1986.hoangOc.cung, 'Ngũ Thọ Tử', '1986→2026 Hoang Ốc cung');
eq(r1986.verdict, 'pham', '1986→2026 verdict');

// 1989 Kỷ Tỵ: tuổi mụ 38 — sạch cả 3 hạn + không xung → ĐƯỢC TUỔI (khớp các bảng phổ biến).
const r1989 = checkBuildYear(1989, 2026);
eq(r1989.kimLau.type, undefined, '1989→2026 Kim Lâu (không)');
eq(r1989.hoangOc.isPham, false, '1989→2026 Hoang Ốc (Nhì Nghi)');
eq(r1989.tamTai.isTamTai, false, '1989→2026 Tam Tai (không)');
eq(r1989.verdict, 'thuan', '1989→2026 verdict (được tuổi)');

// 1992 Nhâm Thân: tuổi mụ 35 %9=8 → Kim Lâu Lục Súc (đồng thời Ngũ Thọ Tử).
const r1992 = checkBuildYear(1992, 2026);
eq(r1992.kimLau.type, 'Kim Lâu Lục Súc', '1992→2026 Kim Lâu');
eq(r1992.hoangOc.cung, 'Ngũ Thọ Tử', '1992→2026 Hoang Ốc cung');
eq(r1992.verdict, 'pham', '1992→2026 verdict');

// ── Năm được tuổi gần nhất ─────────────────────────────────────────
eq(goodBuildYearsFrom(1990, 2026)[0], 2027, '1990: năm được tuổi gần nhất');
eq(goodBuildYearsFrom(1991, 2026)[0], 2028, '1991: năm được tuổi gần nhất');
eq(goodBuildYearsFrom(1989, 2026)[0], 2026, '1989: năm được tuổi gần nhất (chính 2026)');

// ── Can chi mốc ────────────────────────────────────────────────────
eq(checkBuildYear(1990, 2026).targetCanChi.name, 'Bính Ngọ', '2026 can chi');
eq(checkBuildYear(1990, 2027).targetCanChi.name, 'Đinh Mùi', '2027 can chi');
eq(checkBuildYear(1990, 2026).birthCanChi.name, 'Canh Ngọ', '1990 can chi');

console.log(failed === 0 ? '\n🎉 ALL PASS' : `\n💥 ${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
