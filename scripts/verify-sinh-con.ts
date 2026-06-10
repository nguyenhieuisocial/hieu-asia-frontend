/**
 * Kiểm chứng lib/sinh-con.ts với các mốc đã biết (đối chiếu bảng nạp âm cổ điển
 * + quan hệ Can Chi dân gian). Chạy: pnpm dlx tsx scripts/verify-sinh-con.ts
 */
import { yearProfile, checkParentChild, zodiacRelationTable } from '../apps/web/src/lib/sinh-con';
import { relationOf } from '../apps/web/src/lib/hop-tuoi-pairs';

let failed = 0;
function eq(actual: unknown, expected: unknown, label: string) {
  const ok = actual === expected;
  if (!ok) failed++;
  console.log(`${ok ? '✅' : '❌'} ${label}: ${String(actual)}${ok ? '' : ` (expected ${String(expected)})`}`);
}

// Năm → can chi / con giáp / nạp âm (đối chiếu bảng 60 Giáp Tý)
const y2026 = yearProfile(2026)!;
eq(y2026.canChi, 'Bính Ngọ', '2026 can chi');
eq(y2026.zodiac.ten, 'Ngọ', '2026 con giáp');
eq(y2026.napAmName, 'Thiên Hà Thủy', '2026 nạp âm');
eq(y2026.element, 'thuy', '2026 mệnh');

const y2027 = yearProfile(2027)!;
eq(y2027.canChi, 'Đinh Mùi', '2027 can chi');
eq(y2027.zodiac.ten, 'Mùi', '2027 con giáp');
eq(y2027.napAmName, 'Thiên Hà Thủy', '2027 nạp âm');

const y2028 = yearProfile(2028)!;
eq(y2028.canChi, 'Mậu Thân', '2028 can chi');
eq(y2028.napAmName, 'Đại Trạch Thổ', '2028 nạp âm');

eq(yearProfile(1990)!.canChi, 'Canh Ngọ', '1990 can chi');
eq(yearProfile(1990)!.napAmName, 'Lộ Bàng Thổ', '1990 nạp âm');
eq(yearProfile(1995)!.canChi, 'Ất Hợi', '1995 can chi');
eq(yearProfile(1995)!.napAmName, 'Sơn Đầu Hỏa', '1995 nạp âm');
eq(yearProfile(2000)!.napAmName, 'Bạch Lạp Kim', '2000 nạp âm');
eq(yearProfile(1899), null, 'năm <1900 → null');

// Quan hệ con giáp với bé 2027 (Mùi): tam hợp Hợi–Mão, lục hợp Ngọ, xung Sửu, hại Tý
eq(relationOf('hoi', 'mui'), 'tam-hop', 'Hợi–Mùi tam hợp');
eq(relationOf('mao', 'mui'), 'tam-hop', 'Mão–Mùi tam hợp');
eq(relationOf('ngo', 'mui'), 'luc-hop', 'Ngọ–Mùi lục hợp');
eq(relationOf('suu', 'mui'), 'luc-xung', 'Sửu–Mùi lục xung');
eq(relationOf('ty', 'mui'), 'luc-hai', 'Tý–Mùi lục hại');
// Bé 2026 (Ngọ): tam hợp Dần–Tuất, lục hợp Mùi, xung Tý, hại Sửu
eq(relationOf('dan', 'ngo'), 'tam-hop', 'Dần–Ngọ tam hợp');
eq(relationOf('tuat', 'ngo'), 'tam-hop', 'Tuất–Ngọ tam hợp');
eq(relationOf('ty', 'ngo'), 'luc-xung', 'Tý–Ngọ lục xung');
eq(relationOf('suu', 'ngo'), 'luc-hai', 'Sửu–Ngọ lục hại');

// Đối chiếu tổng hợp: mẹ 1995 (Ất Hợi, Sơn Đầu Hỏa) × bé 2027 (Mùi, Thiên Hà Thủy)
const m95 = checkParentChild(1995, 2027)!;
eq(m95.relation, 'tam-hop', 'mẹ 1995 × bé 2027 — con giáp');
eq(m95.menh.kind, 'con-khac-cha-me', 'mẹ 1995 × bé 2027 — mệnh (Thủy khắc Hỏa)');
eq(m95.menh.tone, 'luu-y', 'tone tương khắc = lưu ý (không hù doạ)');

// Bố 1990 (Canh Ngọ, Lộ Bàng Thổ) × bé 2027: Ngọ–Mùi lục hợp; Thổ khắc Thủy
const b90 = checkParentChild(1990, 2027)!;
eq(b90.relation, 'luc-hop', 'bố 1990 × bé 2027 — con giáp');
eq(b90.menh.kind, 'cha-me-khac-con', 'bố 1990 × bé 2027 — mệnh (Thổ khắc Thủy)');

// Mẹ 1996 (Bính Tý, Giản Hạ Thủy) × bé 2027: Tý–Mùi lục hại; Thủy–Thủy đồng mệnh
const m96 = checkParentChild(1996, 2027)!;
eq(m96.relation, 'luc-hai', 'mẹ 1996 × bé 2027 — con giáp');
eq(m96.menh.kind, 'dong-menh', 'mẹ 1996 × bé 2027 — mệnh');

// Bảng 12 con giáp cho năm 2027 đủ 12 dòng, đúng nhóm
const table27 = zodiacRelationTable(2027);
eq(table27.length, 12, 'bảng 2027 đủ 12 con giáp');
eq(table27.filter((r) => r.kind === 'tam-hop').length, 2, 'bảng 2027: 2 tuổi tam hợp');
eq(table27.filter((r) => r.kind === 'luc-hop').length, 1, 'bảng 2027: 1 tuổi lục hợp');

// Mốc Tết (ranh giới năm âm) — để copy trên trang nêu đúng ngày
import { computeBanMenh } from '../apps/web/src/lib/dat-ten-ngu-hanh';
console.log('Tết 2026:', computeBanMenh(16, 2, 2026)!.lunarYear, '→', computeBanMenh(17, 2, 2026)!.lunarYear);
console.log('Tết 2027:', computeBanMenh(5, 2, 2027)!.lunarYear, '→', computeBanMenh(6, 2, 2027)!.lunarYear);
eq(computeBanMenh(16, 2, 2026)!.lunarYear, 2025, '16/2/2026 còn năm âm 2025 (Ất Tỵ)');
eq(computeBanMenh(17, 2, 2026)!.lunarYear, 2026, '17/2/2026 sang Bính Ngọ (mùng 1 Tết)');
eq(computeBanMenh(5, 2, 2027)!.lunarYear, 2026, '5/2/2027 còn năm âm 2026');
eq(computeBanMenh(6, 2, 2027)!.lunarYear, 2027, '6/2/2027 sang Đinh Mùi (mùng 1 Tết)');

console.log(failed === 0 ? '\n🎉 TẤT CẢ KHỚP' : `\n💥 ${failed} sai lệch`);
if (failed > 0) process.exit(1);
