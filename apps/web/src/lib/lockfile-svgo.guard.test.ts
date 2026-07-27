// Chốt canh cho một bản vá bảo mật CHỈ TỒN TẠI Ở MỘT DÒNG override.
//
// Dependabot #108 (high, GHSA svgo, dải nguy hiểm >= 1.0.0 < 2.8.3) được vá
// bằng đúng một dòng trong `pnpm.overrides` của package.json gốc:
//     "css-minimizer-webpack-plugin": "^7.0.4"
// Nó ép chuỗi zmp-cli -> css-minimizer-webpack-plugin -> cssnano ->
// cssnano-preset-default -> postcss-svgo -> svgo nhảy từ svgo@1.3.2 lên svgo@4.
//
// VÌ SAO PHẢI CÓ TEST NÀY:
// Khối `overrides` đang có ~49 mục và rất dễ bị "dọn cho gọn". Xoá dòng đó thì
// `pnpm install` re-resolve css-minimizer về 1.3.0, svgo@1.3.2 quay lại, và
// KHÔNG có cửa nào chặn: không workflow nào chạy `pnpm audit`, còn
// `.github/dependabot.yml` chỉ mở PR cho dep TRỰC TIẾP (`dependency-type:
// "direct"`) nên nó sẽ không nhắc về một dep transitive. CI xanh, lỗ hổng về.
//
// Test đọc lockfile chứ không đọc `node_modules`: đó là thứ commit vào repo và
// là thứ Dependabot thực sự quét (`manifest_path: pnpm-lock.yaml`).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, it, expect } from 'vitest';

/** Bản svgo đầu tiên hết nằm trong dải nguy hiểm của GHSA #108. */
const SVGO_TOI_THIEU = [2, 8, 3] as const;

const gocRepo = join(process.cwd(), '..', '..');
const lockfile = readFileSync(join(gocRepo, 'pnpm-lock.yaml'), 'utf8');
const gocPackageJson = JSON.parse(readFileSync(join(gocRepo, 'package.json'), 'utf8')) as {
  pnpm?: { overrides?: Record<string, string> };
};

const soSanh = (a: readonly number[], b: readonly number[]) => {
  for (let i = 0; i < 3; i++) {
    const hieu = (a[i] ?? 0) - (b[i] ?? 0);
    if (hieu !== 0) return hieu;
  }
  return 0;
};

describe('lockfile không được chứa svgo trong dải nguy hiểm (Dependabot #108)', () => {
  const banSvgo = [...lockfile.matchAll(/^ {2}svgo@(\d+)\.(\d+)\.(\d+)/gm)].map((m) => ({
    chuoi: `${m[1]}.${m[2]}.${m[3]}`,
    so: [Number(m[1]), Number(m[2]), Number(m[3])] as const,
  }));

  it('tìm thấy ít nhất một bản svgo — nếu không, regex đã mục và chốt canh vô nghĩa', () => {
    // Khẳng định DƯƠNG. Thiếu nó thì một lần đổi định dạng lockfile (hoặc svgo
    // biến mất khỏi cây) sẽ làm test dưới đây "xanh" vì không có gì để kiểm.
    expect(
      banSvgo.length,
      'Không thấy dòng `  svgo@x.y.z:` nào trong pnpm-lock.yaml. Hoặc svgo đã ' +
        'rời khỏi cây phụ thuộc (tốt — hãy xoá test này kèm lý do), hoặc định ' +
        'dạng lockfile đã đổi và test này đang KHÔNG canh gì cả.',
    ).toBeGreaterThan(0);
  });

  for (const b of banSvgo) {
    it(`svgo@${b.chuoi} phải >= ${SVGO_TOI_THIEU.join('.')}`, () => {
      expect(
        soSanh(b.so, SVGO_TOI_THIEU),
        `svgo@${b.chuoi} nằm trong dải nguy hiểm của Dependabot #108 ` +
          '(>= 1.0.0 < 2.8.3). Gần như chắc chắn vì override ' +
          '`css-minimizer-webpack-plugin` đã bị xoá khỏi pnpm.overrides — ' +
          'khôi phục nó, đừng hạ ngưỡng ở đây.',
      ).toBeGreaterThanOrEqual(0);
    });
  }

  it('override css-minimizer-webpack-plugin vẫn còn và vẫn ở nhánh >= 7', () => {
    const v = gocPackageJson.pnpm?.overrides?.['css-minimizer-webpack-plugin'];
    expect(
      v,
      'Mất override `css-minimizer-webpack-plugin` trong pnpm.overrides. Đó là ' +
        'thứ duy nhất giữ svgo ra khỏi dải nguy hiểm #108.',
    ).toBeDefined();
    expect(v).toMatch(/^\^?[7-9]\d*\./);
  });

  it('chuỗi trung gian cũng phải là nhánh mới, không lặng lẽ tụt về cssnano@4', () => {
    // cssnano@4 -> postcss-svgo@4 -> svgo@1. Nếu ai override cssnano riêng về 4
    // thì svgo 1 quay lại mà dòng override ở trên vẫn còn nguyên, trông như ổn.
    expect(lockfile).not.toMatch(/^ {2}cssnano@4\./m);
    expect(lockfile).not.toMatch(/^ {2}postcss-svgo@4\./m);
  });

  it('KHÔNG được có override svgo trực tiếp — postcss-svgo@4 dùng API svgo v1', () => {
    // Cách "sửa" hấp dẫn nhưng sai: ép `svgo: ^3`. postcss-svgo@4 gọi
    // `new SVGO(...)` (API v1, svgo 2 đã bỏ) nên nếu nhánh webpack có ngày được
    // dùng thật thì nó vỡ lúc build. Phải sửa ở gốc chuỗi như hiện tại.
    expect(gocPackageJson.pnpm?.overrides?.svgo).toBeUndefined();
  });
});
