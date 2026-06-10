/**
 * Kiểm chứng lib/xong-dat.ts với các mốc đã biết (bảng nạp âm cổ điển + quan hệ
 * Can Chi dân gian + mốc Tết từ lịch âm trong repo).
 * Chạy: pnpm dlx tsx scripts/verify-xong-dat.ts
 */
import {
  checkXongDat,
  topCandidates,
  cautionChis,
  yearChiGroups,
  candidateYears,
  DEFAULT_TARGET_YEAR,
} from '../apps/web/src/lib/xong-dat';
import { computeBanMenh } from '../apps/web/src/lib/dat-ten-ngu-hanh';

let failed = 0;
function eq(actual: unknown, expected: unknown, label: string) {
  const ok = actual === expected;
  if (!ok) failed++;
  console.log(`${ok ? '✅' : '❌'} ${label}: ${String(actual)}${ok ? '' : ` (expected ${String(expected)})`}`);
}

// --- Năm đích -----------------------------------------------------------------
eq(DEFAULT_TARGET_YEAR, 2027, 'năm đích mặc định');
const probe = checkXongDat(1990, 1990, 2027)!;
eq(probe.target.canChi, 'Đinh Mùi', '2027 can chi');
eq(probe.target.napAmName, 'Thiên Hà Thủy', '2027 nạp âm');
eq(checkXongDat(1990, 1990, 2028)!.target.canChi, 'Mậu Thân', '2028 can chi');

// Mốc Tết (ranh giới năm âm) — copy trên trang nêu 06/02/2027
eq(computeBanMenh(5, 2, 2027)!.lunarYear, 2026, '5/2/2027 còn năm âm 2026');
eq(computeBanMenh(6, 2, 2027)!.lunarYear, 2027, '6/2/2027 sang Đinh Mùi (mùng 1 Tết)');

// --- Nhóm chi theo năm Mùi ------------------------------------------------------
const g27 = yearChiGroups(2027)!;
eq(g27.tamHop.map((z) => z.ten).join(','), 'Mão,Hợi', 'tam hợp với chi năm Mùi');
eq(g27.lucHop.map((z) => z.ten).join(','), 'Ngọ', 'lục hợp với chi năm Mùi');
eq(g27.xung.map((z) => z.ten).join(','), 'Sửu', 'lục xung với chi năm Mùi');
eq(g27.hai.map((z) => z.ten).join(','), 'Tý', 'lục hại với chi năm Mùi');
eq(g27.trung.map((z) => z.ten).join(','), 'Mùi', 'trùng chi năm (Thái Tuế)');

// --- Từng ca đối chiếu (đáp án tính tay theo bảng cổ điển) ----------------------

// A. Khách 1996 (Bính Tý, Giản Hạ Thủy) × chủ 1990 (Canh Ngọ, Lộ Bàng Thổ):
//    Tý hại năm Mùi (−1) + Tý xung chủ Ngọ (−3, cờ cứng) + Thổ chủ khắc Thủy khách (−2)
const a = checkXongDat(1996, 1990, 2027)!;
eq(a.guest.canChi, 'Bính Tý', 'A: can chi khách');
eq(a.chiNam.score, -1, 'A: chi × năm (lục hại)');
eq(a.chiChu.score, -3, 'A: chi × chủ (lục xung)');
eq(a.menhChu.score, -2, 'A: mệnh (chủ khắc khách)');
eq(a.tier, 'nen-can-nhac', 'A: tier nên cân nhắc');

// B. Khách 1971 (Tân Hợi, Thoa Xuyến Kim) × chủ 1990: Hợi tam hợp năm (+2),
//    Hợi–Ngọ bình hoà (0), Thổ chủ sinh Kim khách (+1) → 3 = Hợp
const b = checkXongDat(1971, 1990, 2027)!;
eq(b.guest.napAmName, 'Thoa Xuyến Kim', 'B: nạp âm khách');
eq(b.total, 3, 'B: tổng điểm');
eq(b.tier, 'hop', 'B: tier hợp');

// C. Khách 1983 (Quý Hợi, Đại Hải Thủy) × chủ 1988 (Mậu Thìn, Đại Lâm Mộc):
//    Hợi tam hợp năm (+2), Hợi–Thìn bình hoà (0), Thủy khách sinh Mộc chủ (+2) → 4 = Rất hợp
const c = checkXongDat(1983, 1988, 2027)!;
eq(c.host.napAmName, 'Đại Lâm Mộc', 'C: nạp âm gia chủ');
eq(c.menhChu.score, 2, 'C: khách sinh chủ');
eq(c.total, 4, 'C: tổng điểm');
eq(c.tier, 'rat-hop', 'C: tier rất hợp');

// D. Khách 1991 (Tân Mùi — trùng chi năm/Thái Tuế) × chủ 1988:
//    −2 (Thái Tuế) + 0 (Mùi–Thìn bình hoà) − 2 (Mộc chủ khắc Thổ khách) = −4 → nên cân nhắc
const d = checkXongDat(1991, 1988, 2027)!;
eq(d.chiNam.score, -2, 'D: Thái Tuế −2');
eq(d.total, -4, 'D: tổng điểm');
eq(d.tier, 'nen-can-nhac', 'D: tier nên cân nhắc');

// E. Khách 1985 (Ất Sửu) × chủ 1990: Sửu xung năm Mùi (−3, cờ cứng) → nên cân nhắc
const e = checkXongDat(1985, 1990, 2027)!;
eq(e.chiNam.score, -3, 'E: xung chi năm');
eq(e.tier, 'nen-can-nhac', 'E: tier nên cân nhắc');

// --- Top gợi ý cho chủ 1990 (tính tay toàn dải 1962–2009) -----------------------
// Điểm 4 (chi +2 và mệnh Hỏa sinh Thổ +2): 1978 Ngọ · 1986 Dần · 1987 Mão ·
// 1994 Tuất · 1995 Hợi; kế tiếp điểm 3 năm nhỏ nhất: 1962 (Nhâm Dần, Kim).
const top = topCandidates(1990, 2027, 6);
eq(top.length, 6, 'top 1990: đủ 6 gợi ý');
eq(top.map((r) => r.guest.year).join(','), '1978,1986,1987,1994,1995,1962', 'top 1990: đúng 6 năm');
eq(top.slice(0, 5).every((r) => r.tier === 'rat-hop'), true, 'top 1990: 5 năm đầu rất hợp');
eq(top[5]!.tier, 'hop', 'top 1990: năm thứ 6 = hợp');
eq(top.every((r) => r.total >= 2), true, 'top 1990: không lọt tuổi điểm thấp');

// Đa dạng nhóm tuổi: không chi nào quá 2 năm
const chiCount = new Map<string, number>();
for (const r of top) chiCount.set(r.guest.zodiac.slug, (chiCount.get(r.guest.zodiac.slug) ?? 0) + 1);
eq(Math.max(...chiCount.values()) <= 2, true, 'top 1990: tối đa 2 năm mỗi con giáp');

// --- Nhóm nên cân nhắc cho chủ 1990 ---------------------------------------------
const caution = cautionChis(1990, 2027);
eq(caution.map((x) => x.zodiac.ten).join(','), 'Tý,Sửu,Mùi', 'caution 1990: Tý, Sửu, Mùi');
eq(caution[0]!.reasons.length, 2, 'caution Tý: 2 lý do (hại năm + xung chủ)');

// --- Dải ứng viên ----------------------------------------------------------------
const cand = candidateYears(2027);
eq(cand[0], 1962, 'ứng viên từ 1962 (65 tuổi)');
eq(cand[cand.length - 1], 2009, 'ứng viên đến 2009 (18 tuổi)');

// Mọi gia chủ 1900–2100 đều ra kết quả, không crash
let okAll = true;
for (let y = 1940; y <= 2010; y++) {
  if (!checkXongDat(1990, y, 2027) || topCandidates(y, 2027, 6).length === 0) okAll = false;
}
eq(okAll, true, 'mọi gia chủ 1940–2010 đều có gợi ý');

console.log(failed === 0 ? '\n🎉 TẤT CẢ KHỚP' : `\n💥 ${failed} sai lệch`);
if (failed > 0) process.exit(1);
