// Chốt canh: HAI con số sao Tử Vi, không được dùng lẫn.
//
// LỖI GỐC (bắt tại trận 01/08/2026): 36 chỗ trên trang bán hàng, ảnh chia sẻ,
// dữ liệu cho AI và cả hiệu ứng đếm số ở trang chủ đều hứa "lá số 121 sao",
// trong khi engine trả về đúng 114 sao mỗi lá số. Gọi `/tools/tuvi-v2` với 4
// ngày sinh khác nhau đều ra: 14 chính tinh + 14 phụ tinh + 38 sao lẻ + 4 vòng
// 12 sao = 114. Một sản phẩm lấy "con số thật" làm điểm bán mà rao sai chính
// con số đó thì mất nhiều hơn được.
//
// Vì sao 121 vẫn tồn tại HỢP LỆ ở một chỗ: bảng tra trong
// `app/methodology/tu-vi/page.tsx` có đúng 121 dòng — gồm cả 4 Tứ Hoá (hoá khí
// gắn lên sao khác, không phải sao độc lập) và các lưu sao chỉ hiện khi xem đại
// vận / lưu niên. Trang đó IN RA chính bảng ấy nên được nói 121; mọi trang mô
// tả "lá số bạn nhận được" phải nói 114.
//
// Luật quét: chỉ số sao BA CHỮ SỐ mới là con số của cả lá số. Các cụm nhỏ hơn
// trong repo ("9 sao" Cửu Diệu, "12 sao" một vòng, "6 sao" hoàng đạo…) không
// liên quan nên không bị đụng tới.
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

import { describe, it, expect } from 'vitest';

const SRC = join(process.cwd(), 'src');

/** Nơi DUY NHẤT được phép nói 121 — vì nó in ra chính bảng tra 121 dòng. */
const TRANG_BANG_TRA = join('app', 'methodology', 'tu-vi', 'page.tsx');

/** Số sao thật sự an trên một lá số gốc. */
const SAO_MOI_LA_SO = '114';

/** Chính file này nói cả "114 sao" lẫn "121 sao" trong phần giải thích ở trên. */
const TU_LOAI_TRU = 'tuvi-star-count.guard.test.ts';

function nguonTsx(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...nguonTsx(full));
    else if (entry.name === TU_LOAI_TRU) continue;
    else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) out.push(full);
  }
  return out;
}

/** Mọi cụm "<ba chữ số> sao" trong một file. */
function soSaoBaChuSo(src: string): string[] {
  return [...src.matchAll(/\b(\d{3}) sao\b/g)].flatMap((m) => (m[1] ? [m[1]] : []));
}

describe('guard: số sao Tử Vi', () => {
  const files = nguonTsx(SRC).map((f) => ({
    duong: relative(SRC, f).split(sep).join(sep),
    so: soSaoBaChuSo(readFileSync(f, 'utf8')),
  }));

  it('có ít nhất một chỗ ghi "114 sao" — nếu không, guard này đang canh khoảng không', () => {
    // Khẳng định DƯƠNG: thiếu nó thì một lần đổi chữ (bỏ hẳn con số khỏi trang)
    // sẽ làm hai test dưới "xanh" vì không còn gì để kiểm.
    const tong = files.reduce((n, f) => n + f.so.filter((s) => s === SAO_MOI_LA_SO).length, 0);
    expect(tong, 'Không còn chỗ nào ghi "114 sao". Nếu cố ý bỏ con số khỏi trang thì xoá guard này kèm lý do.').toBeGreaterThan(0);
  });

  it('ngoài trang bảng tra, mọi con số sao đều là 114', () => {
    const sai = files
      .filter((f) => f.duong !== TRANG_BANG_TRA)
      .flatMap((f) => f.so.filter((s) => s !== SAO_MOI_LA_SO).map((s) => `${f.duong}: "${s} sao"`));

    expect(
      sai,
      'Lá số gốc có 114 sao. Con số 121 là kích thước BẢNG TRA (kèm Tứ Hoá + lưu sao), ' +
        `chỉ được dùng trong ${TRANG_BANG_TRA}.`,
    ).toEqual([]);
  });

  it('trang bảng tra chỉ được dùng đúng hai con số 114 và 121', () => {
    const trang = files.find((f) => f.duong === TRANG_BANG_TRA);
    expect(trang, `Không tìm thấy ${TRANG_BANG_TRA} — đường dẫn đã đổi, sửa lại guard.`).toBeDefined();

    const la = [...new Set(trang!.so)].sort();
    expect(la).toEqual(['114', '121']);
  });
});
