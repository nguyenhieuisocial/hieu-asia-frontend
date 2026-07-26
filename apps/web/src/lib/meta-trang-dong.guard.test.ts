// Chốt canh PR-time cho các trang KHÔNG sinh HTML tĩnh.
//
// VÌ SAO PHẢI CÓ: `seo-guard.mjs` chỉ đọc `*.html` do `next build` sinh ra.
// Bốn trang dưới đây render động nên không có `.html` ⇒ guard mù với chúng —
// đó là lý do chúng vượt ngưỡng nhiều tuần mà CI vẫn xanh. `seo-live.mjs` bắt
// được, nhưng nó chạy theo lịch mỗi ngày, tức lỗi vẫn kịp ra production và
// nằm đó tới 24 giờ. Test này chặn ngay ở PR.
//
// Mức độ khít hiện tại (2026-07-26): `/tuong-hop-12-con-giap` TITLE = 59/60 —
// CÒN ĐÚNG 1 KÝ TỰ. Thêm một chữ là đỏ, đó chính là điều mong muốn.
//
// Cách đọc: quét CHUỖI TRONG SOURCE, cùng lối với `nam-het-han.guard.test.ts`
// (các hằng này không `export` nên không import trực tiếp được). Bài học từ
// chốt canh đó: BỎ CHÚ THÍCH TRƯỚC, và phải có khẳng định DƯƠNG rằng đã tìm
// thấy chuỗi — nếu không, một lần đổi tên biến sẽ vô hiệu hoá chốt trong im
// lặng mà test vẫn xanh.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, it, expect } from 'vitest';

import { TITLE_MAX, DESCRIPTION_MAX } from '../../scripts/seo-guard.mjs';

/** Hậu tố `'%s · hieu.asia'` mà root layout tự nối vào mọi title không `absolute`. */
const HAU_TO = ' · hieu.asia'.length;

const goc = join(process.cwd(), 'src', 'app');
const boChuThich = (s: string) =>
  s.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1');

/**
 * Đọc giá trị một hằng chuỗi khai ở cấp module: `const TEN = '…';`
 *
 * ⚠️ PHẢI GHÉP CHUỖI NỐI. Bản đầu chỉ khớp literal ĐẦU TIÊN, nên
 *     const DESCRIPTION =
 *       'nửa đầu rất ngắn' +
 *       ' phần sau dài thêm rất nhiều chữ để vượt 160 ký tự';
 * cho ra 16 ký tự, không phải `null` ⇒ khẳng định dương đi qua, phép so độ dài
 * đi qua, TEST XANH trong khi chuỗi thật vượt ngưỡng. Đây là cách tự nhiên nhất
 * để người sau thêm chữ mà giữ dòng ngắn — và `/tra-cuu-tuoi` chỉ dư 4 ký tự.
 *
 * Nếu vế phải có BẤT KỲ thứ gì không phải literal nháy đơn (biến, template
 * literal, gọi hàm) → trả `null` để chốt ĐỎ, chứ không đo một phần rồi báo đạt.
 */
function docHang(than: string, ten: string): string | null {
  const dau = than.search(new RegExp(`\\bconst ${ten}\\s*=`));
  if (dau === -1) return null;
  return ghepLiteral(than.slice(than.indexOf('=', dau) + 1));
}

/** Đọc `title: '…'` khai trực tiếp trong object (dùng cho generateMetadata). */
function docThuocTinh(than: string, ten: string): string | null {
  const dau = than.search(new RegExp(`\\b${ten}:\\s*'`));
  if (dau === -1) return null;
  return ghepLiteral(than.slice(than.indexOf(':', dau) + 1), ',');
}

/**
 * Ghép các literal nháy đơn cho tới dấu kết thúc, BỎ QUA dấu nằm trong chuỗi
 * (mô tả tiếng Việt có thể chứa dấu chấm phẩy hoặc phẩy). Trả `null` nếu vế
 * phải có phần động.
 */
function ghepLiteral(vePhaiThoo: string, ketThuc = ';'): string | null {
  let i = 0;
  let trongChuoi = false;
  while (i < vePhaiThoo.length) {
    const c = vePhaiThoo[i];
    if (trongChuoi) {
      if (c === '\\') i++;
      else if (c === "'") trongChuoi = false;
    } else if (c === "'") trongChuoi = true;
    else if (c === ketThuc) break;
    i++;
  }
  const vePhai = vePhaiThoo.slice(0, i);

  const literal = [...vePhai.matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((x) => x[1]);
  if (literal.length === 0) return null;
  // Bỏ hết literal, dấu +, khoảng trắng. Còn sót gì nghĩa là có phần động.
  const conLai = vePhai.replace(/'(?:[^'\\]|\\.)*'/g, '').replace(/[+\s]/g, '');
  if (conLai !== '' && conLai !== 'asconst') return null;
  return literal.join('').replace(/\\'/g, "'");
}

// `title`/`desc` = tên HẰNG cấp module. `titleThuocTinh` = tiêu đề khai trực
// tiếp trong object của `generateMetadata` (trường hợp /mbti — trước đây bị bỏ
// trắng nên tiêu đề /mbti KHÔNG có chốt PR-time nào, chỉ còn cron 24h).
const TRANG = [
  { duong: 'tuong-hop-12-con-giap/page.tsx', title: 'TITLE', desc: 'DESCRIPTION' },
  { duong: 'tra-cuu-tuoi/page.tsx', title: 'TITLE', desc: 'DESCRIPTION' },
  { duong: 'bang-chung/page.tsx', title: 'TITLE', desc: 'DESC' },
  { duong: 'mbti/page.tsx', titleThuocTinh: 'title', desc: 'MBTI_META_DESC' },
] as const;

describe('meta trang render động (seo-guard không thấy)', () => {
  for (const t of TRANG) {
    const than = boChuThich(readFileSync(join(goc, t.duong), 'utf8'));

    const tenTieuDe: string | undefined =
      'title' in t ? t.title : 'titleThuocTinh' in t ? t.titleThuocTinh : undefined;
    const docTieuDe = () =>
      'title' in t ? docHang(than, t.title) : docThuocTinh(than, t.titleThuocTinh);

    it(`${t.duong} — tiêu đề + hậu tố ≤ ${TITLE_MAX}`, () => {
      const v = docTieuDe();
      expect(
        v,
        `Không đọc được tiêu đề (\`${tenTieuDe}\`) trong ${t.duong}. Hằng bị đổi ` +
          'tên, chuyển sang template literal, hoặc nối thêm phần động ⇒ chốt ' +
          'canh này đang KHÔNG canh gì cả. Sửa test cho khớp, đừng xoá.',
      ).not.toBeNull();
      expect(v!.length + HAU_TO, `"${v}" + " · hieu.asia"`).toBeLessThanOrEqual(TITLE_MAX);
    });

    it(`${t.duong} — mô tả ≤ ${DESCRIPTION_MAX}`, () => {
      const v = docHang(than, t.desc);
      expect(
        v,
        `Không tìm thấy \`const ${t.desc} = '…'\` trong ${t.duong}. ` +
          'Hằng bị đổi tên hoặc nối thêm phần động ⇒ chốt canh này đang KHÔNG ' +
          'canh gì cả.',
      ).not.toBeNull();
      expect(v!.length, `"${v?.slice(0, 60)}…"`).toBeLessThanOrEqual(DESCRIPTION_MAX);
    });
  }

  // Bảo vệ chính cái máy đọc: nếu `ghepLiteral` thoái hoá về "chỉ lấy literal
  // đầu tiên" thì mọi phép đo trên rơi xuống một phần chuỗi và báo đạt oan.
  it('ghép đủ chuỗi nối, và trả null khi vế phải có phần động', () => {
    const noi = "const X =\n  'nửa đầu' +\n  ' nửa sau';";
    expect(docHang(noi, 'X')).toBe('nửa đầu nửa sau');

    const dauChamPhayTrongChuoi = "const Y = 'a; b';";
    expect(docHang(dauChamPhayTrongChuoi, 'Y')).toBe('a; b');

    expect(docHang('const Z = `mẫu ${x}`;', 'Z')).toBeNull();
    expect(docHang("const W = 'a' + bien;", 'W')).toBeNull();
    expect(docHang("const V = layChuoi('a');", 'V')).toBeNull();
    expect(docHang("const U = 'a' as const;", 'U')).toBe('a');
    expect(docHang("const T = 'x';", 'KHONG_CO')).toBeNull();

    expect(docThuocTinh("  title: 'Tiêu đề', url: 'x',", 'title')).toBe('Tiêu đề');
    expect(docThuocTinh('  title: `Tôi là ${x}`,', 'title')).toBeNull();
  });

  it('mô tả thật của /mbti nằm ở page.tsx, KHÔNG phải layout.tsx', () => {
    // Bẫy đã sập một lần: tôi rút mô tả trong `layout.tsx` rồi báo đã vá, nhưng
    // `page.tsx` có `generateMetadata` nên nó ĐÈ layout — trang thật vẫn 176 ký
    // tự. Khoá lại sự thật đó để không ai sửa nhầm file lần nữa.
    const page = boChuThich(readFileSync(join(goc, 'mbti/page.tsx'), 'utf8'));
    expect(page).toMatch(/export async function generateMetadata/);
    expect(page).toMatch(/description:\s*MBTI_META_DESC/);
  });
});
