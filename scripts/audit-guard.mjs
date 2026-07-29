#!/usr/bin/env node
/**
 * audit-guard — chặn lỗ hổng phụ thuộc MỚI, tha những cái đã xét và ghi lý do.
 *
 * VÌ SAO CẦN, DÙ ĐÃ CÓ DEPENDABOT:
 * Dependabot có bắn cảnh báo, nhưng KHÔNG có check nào đỏ. Nó cũng chỉ mở PR
 * cho phụ thuộc TRỰC TIẾP (`dependabot.yml` khai `dependency-type: "direct"`),
 * nên một lỗ hổng nằm sâu trong cây phụ thuộc chỉ hiện trên trang web GitHub —
 * chờ có người tình cờ mở ra xem.
 *
 * Quan trọng hơn: khối `pnpm.overrides` có ~49 mục, phần lớn là **bản vá bảo
 * mật chỉ tồn tại ở đúng một dòng**. Xoá một dòng ⇒ bản dính quay lại ⇒ không
 * gì đỏ. Ngày 2026-07-27 đã phải viết `lockfile-svgo.guard.test.ts` riêng cho
 * MỘT gói vì lý do đó. Cổng này là bản TỔNG QUÁT của chốt đó: mọi override bảo
 * mật bị gỡ đều làm advisory tương ứng xuất hiện lại ⇒ không nằm trong danh
 * sách đã xét ⇒ ĐỎ.
 *
 * VÌ SAO CHẠY THEO LỊCH, KHÔNG GÁC PR: advisory mới xuất hiện hằng ngày và
 * KHÔNG liên quan gì tới PR đang mở. Gác PR thì một advisory công bố lúc 3h
 * sáng làm đỏ mọi PR hôm đó — cổng kiểu ấy bị tắt trong một tuần. Chạy theo
 * lịch + báo Telegram giữ được tín hiệu mà không chặn nhầm ai.
 *
 * Mã thoát: 0 sạch · 1 có advisory MỚI chưa xét · 2 không chạy được `pnpm audit`
 *           3 danh sách đã xét bị mục (có mục thừa) — lỗi của người sửa.
 */
import { argv, exit } from 'node:process';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

/**
 * Advisory ĐÃ XÉT, kèm lý do và ngày xét. Thêm mục ở đây là một QUYẾT ĐỊNH —
 * phải ghi vì sao chấp nhận, không chỉ dán mã vào cho CI hết đỏ.
 *
 * ⚠️ Đã kiểm lại toàn bộ ngày 2026-07-29: KHÔNG cái nào có bản vá dùng được.
 *
 * ⚠️ ĐÍNH CHÍNH (bản nháp đầu của chính file này ghi SAI): tôi viết "người dùng
 * DUY NHẤT của cả 5 là `apps/miniapp-zalo`". Đếm thật thì đúng cho 4 advisory
 * react-router (1–2 đường mỗi cái, đều mini-app), nhưng SAI cho brace-expansion:
 * nó có **213 đường**, trong đó **74 thuộc `apps/web` — tức hieu.asia**.
 * Kết luận "0 ảnh hưởng khách" vẫn ĐÚNG, nhưng vì lý do khác hẳn: mọi cửa vào
 * đều là devDependency (`eslint`, `eslint-config-next`, `eslint-plugin-storybook`,
 * `@lhci/cli`, `@eslint/eslintrc`) nên không nằm trong bundle. Cửa vào RUNTIME
 * duy nhất là `zmp-sdk` của mini-app, và bundle mini-app đã kiểm: 0 lần xuất
 * hiện chuỗi "babel".
 * → Bài học: "gói này chỉ chỗ kia dùng" là loại khẳng định phải ĐẾM mới được
 *   nói. Lý do dài chưa chắc là lý do đúng.
 */
export const DA_XET = {
  'GHSA-mh99-v99m-4gvg': {
    goi: 'brace-expansion',
    lyDo:
      'Kho có CẢ 5.0.8 (đã vá) LẪN 1.1.16. Dải nguy hiểm `<= 5.0.7` PHẲNG nên ' +
      '1.1.16 vẫn nằm trong. Nhánh 1.x KHÔNG có bản vá: 1.1.16 ra 08/07, bản vá ' +
      '5.0.8 ra 23/07, không có 1.x nào sau đó. ĐÃ ĐẾM 213 đường: apps/web 74, ' +
      'apps/admin 64, miniapp-telegram 64, miniapp-zalo 10, packages/config 1. ' +
      'MỌI cửa vào là devDependency (eslint, eslint-config-next, ' +
      'eslint-plugin-storybook, @lhci/cli, @eslint/eslintrc) ⇒ không vào bundle. ' +
      'Cửa vào runtime DUY NHẤT là zmp-sdk→@babel/cli của mini-app, và bundle ' +
      'mini-app đã kiểm: 0 lần xuất hiện chuỗi "babel".',
    xetNgay: '2026-07-29',
  },
  'GHSA-qwww-vcr4-c8h2': {
    goi: 'react-router',
    lyDo:
      'Cần 8.3.0. Ta ở 7.18.1 do `react-router-dom@7` kéo — mà react-router-dom ' +
      'MỚI NHẤT chỉ 7.18.2, KHÔNG có bản 8. Nên không có đường nâng nào không ' +
      'phải là ép `react-router` lên major mà react-router-dom chưa theo.',
    xetNgay: '2026-07-29',
  },
  'GHSA-wrjc-x8rr-h8h6': {
    goi: 'react-router',
    lyDo: 'Cần 7.18.0; bản 6.x dính là do `zmp-ui@1.11.14` ghim, mà đó ĐÚNG LÀ bản zmp-ui mới nhất.',
    xetNgay: '2026-07-29',
  },
  'GHSA-337j-9hxr-rhxg': {
    goi: 'react-router',
    lyDo: 'Cùng gốc với GHSA-wrjc: zmp-ui@1.11.14 (mới nhất) ghim react-router 6.x.',
    xetNgay: '2026-07-29',
  },
  'GHSA-jjmj-jmhj-qwj2': {
    goi: 'react-router-dom',
    lyDo:
      '`first_patched_version` là **null** — KHÔNG tồn tại bản vá nào cả, không ' +
      'phải "chưa nâng". Cũng do zmp-ui ghim 6.x.',
    xetNgay: '2026-07-29',
  },
};

/** Bóc danh sách advisory từ JSON của `pnpm audit`. Hàm thuần để test khoá được. */
export function bocAdvisory(json) {
  const kho = json?.advisories;
  if (!kho || typeof kho !== 'object') return null;
  return Object.values(kho).map((a) => ({
    ma: a.github_advisory_id ?? String(a.id ?? ''),
    goi: a.module_name ?? '',
    mucDo: a.severity ?? '',
    dai: a.vulnerable_versions ?? '',
    // GIỮ trường này — nó là thứ duy nhất phát hiện được "hôm nay đã có bản vá".
    banVa: a.patched_versions ?? '',
  }));
}

/**
 * Mục đã xét QUÁ HẠN, phải xem lại.
 *
 * ⚠️ CHIỀU THỨ BA, thiếu nó thì cổng vĩnh viễn không đỏ ở đúng ca quan trọng
 * nhất. Cả 5 mục hiện tại đều có lý do dạng "thượng nguồn chưa với tới được" —
 * loại lý do MỤC NHANH NHẤT theo thời gian. Nếu mai `zmp-ui` nâng react-router,
 * hoặc `react-router-dom@8` ra, thì advisory VẪN xuất hiện (ta vẫn ở bản cũ),
 * VẪN nằm trong DA_XET ⇒ exit 0 mãi mãi và không ai biết là đã nâng được.
 *
 * ĐÃ CÂN NHẮC VÀ BỎ cách "so `patched_versions`": 4/5 mục hiện tại ĐÃ CÓ bản vá
 * ở thượng nguồn (`>=7.18.0`, `>=8.3.0`, `>=5.0.8`) mà vẫn không với tới được —
 * nên phép so đó sẽ đỏ ngay hôm nay cho cả 4, tức báo động sai. Thứ thật sự mục
 * là LÝ DO, và thứ đo được nó là THỜI GIAN. Vẫn in `patched_versions` ra để
 * người xem tự đối chiếu.
 */
export const HAN_XET_LAI_NGAY = 90;
export function quaHanXetLai(daXet, homNay) {
  const moc = new Date(homNay).getTime() - HAN_XET_LAI_NGAY * 86400000;
  return Object.entries(daXet)
    .filter(([, v]) => {
      const t = new Date(v.xetNgay).getTime();
      return Number.isFinite(t) && t < moc;
    })
    .map(([m]) => m);
}

/**
 * So advisory tìm được với danh sách đã xét.
 *
 * ⚠️ BÁO CẢ HAI CHIỀU. Chỉ báo "có cái mới" là chưa đủ: một mục ĐÃ XÉT không
 * còn xuất hiện nghĩa là lỗ hổng đã được vá ở đâu đó, và mục đó nay là lời nói
 * dối nằm lại trong file — đúng kiểu "mục miễn trừ thành chỗ giấu lỗi" mà
 * `seo-guard` đã mắc một lần. Mục thừa ⇒ mã 3, buộc người sửa dọn.
 */
export function soSanh(timThay, daXet) {
  const maDaXet = new Set(Object.keys(daXet));
  const maTimThay = new Set(timThay.map((a) => a.ma));
  return {
    moi: timThay.filter((a) => !maDaXet.has(a.ma)),
    thua: [...maDaXet].filter((m) => !maTimThay.has(m)),
  };
}

/** Mọi mục đã xét PHẢI có lý do thật, không được để trống cho có. */
export function kiemLyDo(daXet) {
  return Object.entries(daXet)
    .filter(([, v]) => !v?.lyDo || v.lyDo.trim().length < 40 || !v?.xetNgay)
    .map(([m]) => m);
}

function chayAudit() {
  // `pnpm audit` thoát khác 0 khi CÓ advisory — đó là hành vi bình thường, không
  // phải lỗi chạy. Nên phải bắt lỗi và đọc stdout thay vì tin mã thoát.
  try {
    return execFileSync('pnpm', ['audit', '--json'], {
      maxBuffer: 1e9,
      stdio: ['ignore', 'pipe', 'ignore'],
      shell: process.platform === 'win32',
    }).toString();
  } catch (e) {
    const ra = e?.stdout?.toString() ?? '';
    if (ra.trim().startsWith('{')) return ra;
    throw new Error(`không chạy được \`pnpm audit\`: ${e?.message ?? e}`);
  }
}

function main() {
  let json;
  try {
    json = JSON.parse(chayAudit());
  } catch (e) {
    console.error(`audit-guard: ${e?.message ?? e}`);
    return exit(2);
  }

  const timThay = bocAdvisory(json);
  if (timThay === null) {
    // Định dạng đổi ⇒ mọi phép so bên dưới thành vô nghĩa và sẽ báo "sạch".
    console.error(
      'audit-guard: không đọc được `advisories` trong JSON của pnpm audit — ' +
        'nhiều khả năng pnpm đổi định dạng. KHÔNG kết luận "sạch" khi không đọc được gì.',
    );
    return exit(2);
  }

  const loiLyDo = kiemLyDo(DA_XET);
  if (loiLyDo.length) {
    console.error(`audit-guard: ${loiLyDo.length} mục đã xét thiếu lý do hoặc ngày xét:`);
    for (const m of loiLyDo) console.error(`  ✗ ${m}`);
    return exit(3);
  }

  const { moi, thua } = soSanh(timThay, DA_XET);
  const quaHan = quaHanXetLai(DA_XET, new Date().toISOString().slice(0, 10));
  console.log(
    `audit-guard: ${timThay.length} advisory · đã xét ${Object.keys(DA_XET).length} · ` +
      `MỚI ${moi.length} · thừa ${thua.length} · quá hạn xét lại ${quaHan.length}`,
  );

  for (const a of moi)
    console.log(`  ✗ MỚI  ${a.ma}  ${a.mucDo.padEnd(8)} ${a.goi}  ${a.dai}  → vá ở ${a.banVa}`);
  for (const m of quaHan)
    console.log(
      `  ⓘ QUÁ HẠN ${m} (${DA_XET[m].goi}) — xét ngày ${DA_XET[m].xetNgay}, quá ` +
        `${HAN_XET_LAI_NGAY} ngày. Lý do "thượng nguồn chưa vá" mục nhanh: kiểm lại ` +
        'bản mới nhất của thượng nguồn rồi cập nhật `xetNgay`, hoặc vá luôn nếu nay vá được.',
    );
  for (const m of thua)
    console.log(
      `  ⓘ THỪA ${m} (${DA_XET[m].goi}) — không còn xuất hiện, tức đã được vá. ` +
        'Xoá mục này khỏi DA_XET, đừng để nó nằm lại nói dối.',
    );

  if (moi.length) {
    console.error(
      `\naudit-guard: có ${moi.length} lỗ hổng CHƯA AI XÉT. Vá được thì vá; ` +
        'không vá được thì thêm vào DA_XET kèm LÝ DO THẬT (đã truy đường phụ ' +
        'thuộc, đã kiểm bản mới nhất của thượng nguồn) và ngày xét.',
    );
    return exit(1);
  }
  if (thua.length || quaHan.length) return exit(3);

  // Khẳng định DƯƠNG: tới đây mà không đo được advisory nào NGHĨA LÀ danh sách
  // đã xét cũng rỗng (nếu không thì `thua` đã khác 0). Một phép đo rỗng trên
  // một danh sách rỗng đọc y hệt "sạch" — phải nói ra thay vì im.
  if (timThay.length === 0 && Object.keys(DA_XET).length === 0)
    console.log(
      '::warning::audit-guard: 0 advisory VÀ danh sách đã xét cũng rỗng. Có thể site ' +
        'thật sự sạch, cũng có thể phép quét không đọc được gì — kiểm `pnpm audit` bằng tay.',
    );
  return exit(0);
}

if (import.meta.url === pathToFileURL(argv[1] ?? '').href) main();
