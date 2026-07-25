// Chặn "năm chết": hằng số năm gõ cứng trong mã, tụt lại phía sau ngày thật.
//
// VÌ SAO CẦN CHỐT NÀY
// Đây là họ hàng của lỗi đã sửa ở PR #965, nhưng NẶNG HƠN ở một điểm quyết
// định: ở #965 mọi thứ dẫn từ `new Date()` nên **dựng lại là tự khỏi**. Ở đây
// năm là hằng số literal trong mã ⇒ **deploy lại KHÔNG chữa được**, bắt buộc có
// người sửa tay. Mà không ai được nhắc thì không ai sửa.
//
// SỐ ĐO 26/07/2026 (mô phỏng: bundle chính các hàm sinh trang rồi chạy với đồng
// hồ giả, đếm số trang có năm sai trong `<title>`/`<h1>`/JSON-LD):
//   hôm nay        →   0 trang sai
//   01/01/2027     →  75 trang sai
//   06/02/2027     → 107 trang sai  (mùng 1 Tết Đinh Mùi — mốc do chính nội
//                                    dung /xong-dat ghi ra)
//   01/01/2029     → 107 trang sai  (không tự khỏi, đúng như dự đoán)
// Các trang này đều cho index, có canonical trỏ về chính nó và đang nằm trong
// sitemap production — tức Google vẫn xếp hạng chúng cho truy vấn năm mới.
//
// CHỐT NÀY CỐ Ý SẼ ĐỎ VÀO 01/01/2027 — ĐỌC KỸ TRƯỚC KHI TẮT
// Nó chỉ đỏ khi web ĐANG THỰC SỰ phục vụ nội dung sai năm, không sớm hơn một
// ngày nào. Cách sửa là bump hằng số (và rà lại phần chữ quanh nó), không phải
// nới ngưỡng. Nếu năm nào đó quyết định để nguyên có chủ đích thì sửa luôn
// `GHI_CHU` bên dưới cho người sau biết đó là lựa chọn, không phải bỏ quên.
//
// KHÔNG tự ý nhảy năm giúp: chọn năm nào là quyết định nội dung (mùa cưới bắt
// đầu trước Tết, mùa khai trương lại khác), và 2 trong 4 hằng số nằm trong cụm
// agent khác đang giữ. Chốt này chỉ ĐỌC, không sửa file của ai.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const NAM_NAY = new Date().getFullYear();
const doc = (p: string) => readFileSync(join(process.cwd(), p), 'utf8');

/** Hằng số năm khai bằng literal — nơi nào cũng là `export const TÊN = 2026;` */
const HANG_SO = [
  { file: 'src/app/xem-tuoi-cuoi/years.ts', ten: 'TARGET_YEAR', cum: '/xem-tuoi-cuoi (+17 trang con)' },
  { file: 'src/app/xem-tuoi-lam-nha/years.ts', ten: 'TARGET_YEAR', cum: '/xem-tuoi-lam-nha (+25 trang con)' },
  { file: 'src/app/khai-truong/years.ts', ten: 'TARGET_YEAR', cum: '/khai-truong (+31 trang con)' },
  { file: 'src/lib/xong-dat.ts', ten: 'DEFAULT_TARGET_YEAR', cum: '/xong-dat (+31 trang con) + /tai-lieu/tuoi-xong-dat' },
];

describe('năm gõ cứng không được tụt lại phía sau ngày thật', () => {
  for (const { file, ten, cum } of HANG_SO) {
    it(`${ten} trong ${file}`, () => {
      const src = doc(file);
      const m = new RegExp(`\\b${ten}\\s*(?::\\s*number)?\\s*=\\s*(\\d{4})\\b`).exec(src);
      // Đọc không ra thì PHẢI đỏ. Một chốt im lặng bỏ qua trông y hệt như chốt
      // xanh — đúng cái bẫy đã dính một lần trong đợt này.
      expect(m, `${file}: không đọc được ${ten} — hằng số bị đổi tên hay đổi cách khai? Chốt này đang không bảo vệ gì.`).not.toBeNull();

      const nam = Number(m![1]);
      expect(
        nam,
        `${cum}: ${ten} = ${nam} trong khi đang là năm ${NAM_NAY}. ` +
          `Các trang này in năm ${nam} vào <title>/<h1>/JSON-LD, vẫn cho index và vẫn nằm trong sitemap — ` +
          `người tìm cho năm ${NAM_NAY} bấm vào sẽ thấy toàn bộ tính toán của năm cũ. ` +
          `Dựng lại KHÔNG chữa được vì đây là hằng số trong mã. Sửa: bump hằng số + rà lại phần chữ quanh nó.`,
      ).toBeGreaterThanOrEqual(NAM_NAY);
    });
  }

  it('/lich-van-nien: tiêu đề và H1 không được kẹt ở năm cũ', () => {
    // Trang này có HAI đồng hồ: thẻ ngày lấy từ API (tự nhảy năm) còn tiêu
    // đề/H1 gõ cứng năm → sang 01/01 là tự mâu thuẫn ngay trong một khung hình.
    const src = doc('src/app/lich-van-nien/page.tsx');

    // Bản đầu của chốt này BẮT HỤT: nó dò chuỗi "Lịch Vạn Niên 2026" liền mạch,
    // nên không thấy được dạng nằm trong JSX (`Lịch <GoldAccent>Vạn
    // Niên</GoldAccent> 2026` có thẻ xen giữa). Kiểm đột biến mới lộ ra. Nay dò
    // MỌI token năm sau khi bỏ chú thích — không phụ thuộc cách viết câu chữ.
    const thanFile = src
      .replace(/\/\*[\s\S]*?\*\//g, ' ')
      .replace(/(^|[^:])\/\/[^\n]*/g, '$1'); // giữ nguyên `https://…`

    expect(
      /new Date\(\)[\s\S]{0,40}getFullYear\(\)/.test(src),
      '/lich-van-nien không còn chỗ nào tính năm theo ngày hiện tại — quay lại gõ chết năm thì sang 01/01 ' +
        'tiêu đề sẽ mâu thuẫn với thẻ ngày ngay bên cạnh (thẻ ngày lấy từ API, tự làm mới mỗi giờ).',
    ).toBe(true);

    const namCu = [...thanFile.matchAll(/\b(20\d{2})\b/g)]
      .map((m) => Number(m[1]))
      .filter((n) => n < NAM_NAY);
    expect(
      namCu,
      `/lich-van-nien còn năm gõ chết đã cũ (${namCu.join(', ')}) giữa năm ${NAM_NAY}. ` +
        `Google lấy <title> làm nhãn kết quả tìm kiếm, đúng vào mùa tra cứu lịch mạnh nhất là đầu năm. ` +
        `Cho nó đi qua hàm tính năm như các chỗ còn lại.`,
    ).toEqual([]);
  });
});

// Nửa còn lại của PR #965: 4 trang mùa vụ có `permanentRedirect` theo ngày
// nhưng thiếu `revalidate` nên lệnh 308 bị nướng vào HTML lúc build, trong khi
// `app/sitemap.ts` (ISR 1 giờ) đã loại URL ra từ lúc hết mùa.
describe('trang mùa vụ phải tính lại theo ngày, không nướng cứng lúc build', () => {
  const TRANG_MUA_VU = [
    'src/app/thang-co-hon-2026/page.tsx',
    'src/app/that-tich-2026/page.tsx',
    'src/app/valentine-2027/page.tsx',
    'src/app/xuat-hanh-2027/page.tsx',
  ];

  it('mỗi trang có điều kiện hết hạn theo ngày đều khai revalidate', () => {
    for (const f of TRANG_MUA_VU) {
      const src = doc(f);
      expect(src, `${f}: mất lệnh chuyển hướng hết mùa — chốt này đang canh nhầm file?`).toMatch(
        /expiredSeasonalTarget/,
      );
      expect(
        src,
        `${f}: có chuyển hướng theo ngày nhưng KHÔNG có revalidate ⇒ quyết định bị đóng băng vào HTML lúc build. ` +
          `Hết mùa mà chưa deploy lại thì sitemap đã bỏ URL trong khi trang vẫn trả 200 nội dung mùa cũ.`,
      ).toMatch(/export const revalidate = \d+/);
    }
  });
});

// Trang in năm © bằng `new Date()` trong server component tĩnh: năm bị nướng
// vào HTML, còn chân trang là client component nên tự nhảy năm ⇒ hai dòng © trên
// cùng một trang nói khác nhau kể từ 01/01.
describe('trang in năm © phải tính lại được', () => {
  for (const f of ['src/app/privacy/page.tsx', 'src/app/terms/page.tsx']) {
    it(f, () => {
      const src = doc(f);
      expect(src, `${f}: không còn in năm © — chốt này đang canh nhầm file?`).toMatch(/getFullYear\(\)/);
      expect(
        src,
        `${f}: in năm © từ new Date() trong server component tĩnh mà không có revalidate ⇒ ` +
          `sang 01/01 thân trang ghi năm cũ trong khi chân trang cùng trang đã nhảy năm mới.`,
      ).toMatch(/export const revalidate = \d+/);
    });
  }
});
