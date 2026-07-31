// Chốt canh cho một bản vá bảo mật CHỈ TỒN TẠI Ở HAI DÒNG override.
//
// GHSA-mh99-v99m-4gvg / CVE-2026-14257 (high, DoS làm tràn bộ nhớ) có dải nguy
// hiểm `<= 5.0.7` — PHẲNG, KHÔNG chia theo major. Nghĩa là `1.1.16` và `2.1.2`
// đều nằm trong dải, dù nhìn số major thì tưởng không liên quan. Chỗ này đã làm
// ba lần kết luận sai vì grep theo major, nên test dưới đây so theo TỪNG NHÁNH
// bằng mốc vá thật của nhánh đó, không so với 5.0.8 cho tất cả.
//
// Mốc vá thật (đã đối chiếu mã nguồn: bản có `EXPANSION_MAX_LENGTH` là bản vá):
//     1.x -> 1.1.17 (ra 2026-07-29)
//     2.x -> 2.1.3  (ra 2026-07-28)
//     5.x -> 5.0.8  (ra 2026-07-23)
// Advisory chốt ngày 24/07 nên dải của nó KHÔNG biết hai bản backport 1.x/2.x.
// Hệ quả: `pnpm audit` và Dependabot VẪN kêu dù mã đã hết lỗ hổng. Đừng "sửa"
// bằng cách chiều lòng công cụ — xem hai test cuối.
//
// VÌ SAO PHẢI CÓ TEST NÀY:
// Cả bản vá nằm gọn trong `pnpm.overrides` của package.json gốc:
//     "brace-expansion@1": "^1.1.18"
//     "brace-expansion@5": "^5.0.8"
// Khối overrides đang có ~50 mục và rất dễ bị "dọn cho gọn". Xoá dòng `@1` thì
// `minimatch@3.1.5` (cha DUY NHẤT của nhánh 1.x trong kho này) re-resolve về
// `brace-expansion@1.1.16` và lỗ hổng quay lại. Không có cửa nào chặn:
// `.github/dependabot.yml` chỉ mở PR cho dep TRỰC TIẾP nên không nhắc về dep
// transitive, còn `scripts/audit-guard.mjs` đã có sẵn mục miễn trừ cho đúng mã
// advisory này (bắt buộc, vì dải phẳng làm nó kêu vĩnh viễn) ⇒ audit vẫn xanh.
// CI xanh, lỗ hổng về.
//
// Test đọc lockfile chứ không đọc `node_modules`: đó là thứ commit vào repo và
// là thứ Dependabot thực sự quét (`manifest_path: pnpm-lock.yaml`).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, it, expect } from 'vitest';

/** Bản đầu tiên HẾT nằm trong lỗ hổng, tra theo major. */
const MOC_VA_THEO_MAJOR: Record<number, readonly [number, number, number]> = {
  1: [1, 1, 17],
  2: [2, 1, 3],
  5: [5, 0, 8],
};

const gocRepo = join(process.cwd(), '..', '..');
const lockfile = readFileSync(join(gocRepo, 'pnpm-lock.yaml'), 'utf8');
const gocPackageJson = JSON.parse(readFileSync(join(gocRepo, 'package.json'), 'utf8')) as {
  pnpm?: { overrides?: Record<string, string> };
};
const overrides = gocPackageJson.pnpm?.overrides ?? {};

const soSanh = (a: readonly number[], b: readonly number[]) => {
  for (let i = 0; i < 3; i++) {
    const hieu = (a[i] ?? 0) - (b[i] ?? 0);
    if (hieu !== 0) return hieu;
  }
  return 0;
};

describe('lockfile không được chứa brace-expansion dính CVE-2026-14257', () => {
  const ban = [...lockfile.matchAll(/^ {2}brace-expansion@(\d+)\.(\d+)\.(\d+):/gm)].map((m) => ({
    chuoi: `${m[1]}.${m[2]}.${m[3]}`,
    major: Number(m[1]),
    so: [Number(m[1]), Number(m[2]), Number(m[3])] as const,
  }));

  it('tìm thấy ít nhất một bản brace-expansion — nếu không, regex đã mục và chốt canh vô nghĩa', () => {
    // Khẳng định DƯƠNG. Thiếu nó thì một lần đổi định dạng lockfile (hoặc gói
    // biến mất khỏi cây) sẽ làm mọi test dưới đây "xanh" vì không có gì để kiểm.
    expect(
      ban.length,
      'Không thấy dòng `  brace-expansion@x.y.z:` nào trong pnpm-lock.yaml. Hoặc ' +
        'gói đã rời khỏi cây phụ thuộc (tốt — hãy xoá test này kèm lý do, và dọn ' +
        'luôn mục GHSA-mh99-v99m-4gvg trong scripts/audit-guard.mjs), hoặc định ' +
        'dạng lockfile đã đổi và test này đang KHÔNG canh gì cả.',
    ).toBeGreaterThan(0);
  });

  it('mọi major xuất hiện đều phải có mốc vá đã biết', () => {
    // Nếu mai có nhánh 3.x/4.x/6.x lọt vào, ta KHÔNG được im lặng cho qua.
    const la = ban.map((b) => b.major).filter((m) => !(m in MOC_VA_THEO_MAJOR));
    expect(
      [...new Set(la)],
      'Xuất hiện nhánh brace-expansion chưa có mốc vá trong MOC_VA_THEO_MAJOR. ' +
        'Tra bản vá thật của nhánh đó (bản có `EXPANSION_MAX_LENGTH` trong ' +
        'index.js) rồi bổ sung — đừng xoá major khỏi danh sách để test hết đỏ.',
    ).toEqual([]);
  });

  for (const b of ban) {
    const moc = MOC_VA_THEO_MAJOR[b.major];
    if (!moc) continue;
    it(`brace-expansion@${b.chuoi} phải >= ${moc.join('.')} (mốc vá của nhánh ${b.major}.x)`, () => {
      expect(
        soSanh(b.so, moc),
        `brace-expansion@${b.chuoi} dính CVE-2026-14257. Dải nguy hiểm là ` +
          '`<= 5.0.7` PHẲNG — đừng nhìn số major rồi kết luận là an toàn. Gần ' +
          `như chắc chắn vì override \`brace-expansion@${b.major}\` đã bị xoá ` +
          'khỏi pnpm.overrides — khôi phục nó, đừng hạ mốc ở đây.',
      ).toBeGreaterThanOrEqual(0);
    });
  }

  it('hai override brace-expansion vẫn còn và vẫn ở trên mốc vá', () => {
    expect(
      overrides['brace-expansion@1'],
      'Mất override `brace-expansion@1`. Không có nó, minimatch@3.1.5 kéo lại ' +
        'brace-expansion@1.1.16 (dính).',
    ).toMatch(/^\^?1\.1\.(1[7-9]|[2-9]\d)/);
    expect(
      overrides['brace-expansion@5'],
      'Mất override `brace-expansion@5`.',
    ).toMatch(/^\^?5\.(0\.([89]|\d{2,})|[1-9])/);
  });

  it('KHÔNG được có override brace-expansion phẳng — nhánh 5 là ESM-only, minimatch@3 dùng require()', () => {
    // Cách "sửa" hấp dẫn nhưng sai #1: ép `"brace-expansion": "^5"` cho gọn để
    // Dependabot hết kêu. brace-expansion@5 là `"type": "module"`, engines
    // `node: 20 || >=22`, và đổi API so với 1.x. minimatch@3.1.5 — thứ DUY NHẤT
    // kéo nhánh 1.x ở đây — nạp nó bằng `require()`, nên override phẳng làm
    // eslint/glob@7 vỡ lúc chạy chứ không phải lúc cài. Phải giữ override có
    // hậu tố major.
    expect(
      overrides['brace-expansion'],
      'Có override `brace-expansion` phẳng (không hậu tố major). Nó ép nhánh 5 ' +
        '(ESM-only) vào minimatch@3 vốn dùng require() ⇒ vỡ lúc chạy. Dùng ' +
        '`brace-expansion@1` và `brace-expansion@5` riêng.',
    ).toBeUndefined();
  });

  it('KHÔNG được ép minimatch@3 lên nhánh 10 — @eslint/eslintrc cần default export', () => {
    // Cách "sửa" hấp dẫn nhưng sai #2, và là cách DUY NHẤT thật sự gỡ được
    // brace-expansion 1.x khỏi lockfile — nên rất dễ có người thử lại. ĐÃ ĐO
    // 2026-07-31: `"minimatch@3": "^10.2.5"` xoá sạch 1.x khỏi lockfile nhưng
    // `pnpm lint` đỏ ngay:
    //     The requested module 'minimatch' does not provide an export named 'default'
    // Nguồn: @eslint/eslintrc/lib/config-array/override-tester.js:23
    //     import minimatch from "minimatch";
    // minimatch@10 chỉ có named export. Và không có đường vòng: @eslint/eslintrc
    // mới nhất (3.3.6) VẪN ghim `minimatch: ^3.1.5`; eslint-plugin-import@2.32.0,
    // eslint-plugin-react@7.37.5, eslint-plugin-jsx-a11y@6.10.2 vẫn `^3.1.2`.
    // Khi nào thượng nguồn nâng thì bỏ test này VÀ chạy lại `pnpm lint` thật.
    const v = overrides['minimatch@3'] ?? overrides['minimatch'];
    expect(
      v,
      'Có override đẩy minimatch@3 lên nhánh mới. Đã thử 2026-07-31: lint đỏ ' +
        'toàn kho vì @eslint/eslintrc import default export mà minimatch@10 ' +
        'không có. Nếu thượng nguồn đã nâng, hãy chạy `pnpm lint` chứng minh ' +
        'xanh rồi mới gỡ test này.',
    ).toBeUndefined();
  });

  it('minimatch@3 vẫn ở đó — nếu biến mất thì brace-expansion 1.x cũng nên biến mất', () => {
    // Cột mốc để biết KHI NÀO món nợ này đóng được. minimatch@3.1.5 là cha duy
    // nhất của nhánh 1.x; ngày nó rời cây thì cả override `brace-expansion@1`
    // lẫn mục miễn trừ trong audit-guard đều nên bị dọn.
    const conMinimatch3 = /^ {2}minimatch@3\./m.test(lockfile);
    const conBx1 = /^ {2}brace-expansion@1\./m.test(lockfile);
    expect(
      conBx1,
      'minimatch@3 đã rời lockfile nhưng brace-expansion@1 vẫn còn — nghĩa là ' +
        'có cha mới mà ghi chú ở đầu file không biết. Đếm lại đường phụ thuộc.',
    ).toBe(conMinimatch3);
  });
});
