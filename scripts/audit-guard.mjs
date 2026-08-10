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
 * ⚠️ ĐÍNH CHÍNH 2026-07-31 — chỉ cho brace-expansion: câu trên đã HẾT ĐÚNG với
 * nó. Nhánh 1.x ĐÃ được backport bản vá ở `1.1.17` (ra 29/07, đúng ngày ghi chú
 * trên nên lúc đó chưa nhìn thấy) và `1.1.18` (30/07). Kho nay ở 1.1.18, tức
 * lỗ hổng đã hết ở MỨC MÃ NGUỒN. Mục vẫn phải nằm lại đây vì dải nguy hiểm
 * `<= 5.0.7` là PHẲNG: `1.1.18 <= 5.0.7` theo semver ⇒ `pnpm audit` và
 * Dependabot vẫn kêu. Bài học lặp lại lần hai với đúng gói này: "không có bản
 * vá" là khẳng định có HẠN SỬ DỤNG — phải hỏi lại registry, không đọc lại ghi
 * chú cũ.
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
 *
 * ⚠️ DỌN 2026-08-03 — hai mục đã rời khỏi đây vì `pnpm audit` KHÔNG còn báo:
 *   • `GHSA-mh99-v99m-4gvg` (brace-expansion): dải advisory thượng nguồn đã
 *     được sửa lại nên 1.1.18 hết bị tính là dính. Lý do dài ở mục cũ (237
 *     đường, minimatch@3 không nâng được) nay chỉ còn giá trị lịch sử.
 *   • `GHSA-qwww-vcr4-c8h2` (react-router, HIGH): ĐÃ VÁ THẬT — #1043 nâng
 *     mini-app lên `react-router@8.3.0`, nhánh 7.x biến mất khỏi lockfile.
 *
 * → Bài học đắt nhất của đợt này: mục cũ kết luận "không có đường nâng nào" vì
 *   `react-router-dom` mới nhất chỉ 7.18.2, KHÔNG có bản 8. Đúng dữ kiện, sai
 *   kết luận — v8 ĐỔI TÊN GÓI: `react-router-dom` gộp vào `react-router@8`.
 *   Tra một cái tên gói rồi kết luận "hết đường" là chưa đủ; phải hỏi cả xem
 *   gói có đổi tên / gộp ở major kế tiếp không.
 *
 * ⚠️ THÊM 2026-08-10 — ba mục MỚI (1 jszip + 2 image-size). Cả ba đều dev-only,
 * mỗi cái đúng MỘT đường phụ thuộc (đã đếm bằng `pnpm why … -r`, không suy đoán).
 *
 * ⚠️ DỌN 2026-08-10 — cả BA mục react-router (`GHSA-wrjc-x8rr-h8h6`,
 * `GHSA-337j-9hxr-rhxg`, `GHSA-jjmj-jmhj-qwj2`) đã rời khỏi đây: cổng báo chúng
 * "thừa" và kiểm lại thì đúng — `zmp-ui` KHÔNG còn trong cây phụ thuộc (`pnpm why
 * zmp-ui -r` rỗng; nó rời đi ở #1052), mà zmp-ui chính là thứ duy nhất ghim nhánh
 * 6.x. Nay `pnpm why react-router -r` chỉ còn 8.3.0 và lockfile không còn dòng
 * react-router 6/7 nào. Mã nguồn mini-app cũng không import zmp-ui (chỉ còn 2 câu
 * chú thích nhắc tên). Ba lý do dài viết ngày 01/08 nay chỉ còn giá trị lịch sử.
 *
 * → Ghi lại vì đây là lần chiều "THỪA" của cổng thực sự bắt được việc: lỗ hổng
 *   biến mất KHÔNG phải do ai đi vá nó, mà do một gói khác rời khỏi cây kéo theo.
 *   Không có chiều này thì ba mục kia nằm lại vĩnh viễn, đọc như "vẫn đang dính".
 *
 * → Cái bẫy của đợt này, ghi lại để không mắc lần nữa: `jszip` TRÔNG NHƯ đã vá
 *   vì `pnpm.overrides` có `jszip: ^3.10.1`. Nhưng ngay dưới nó còn dòng HẸP HƠN
 *   `zip-local>jszip: ^2.6.1`, mà pnpm ưu tiên dòng hẹp hơn ⇒ đúng cái đường
 *   dính vẫn ở 2.7.0. Một override phạm vi rộng KHÔNG chứng minh được gì khi có
 *   override hẹp hơn cùng gói nằm cạnh — phải đọc `pnpm why`, đừng đọc
 *   `package.json` rồi kết luận. Dòng hẹp ấy là CỐ Ý (#1057) và load-bearing:
 *   xoá nó đi thì `zmp build` vỡ ngay, không phải rác để dọn.
 */
export const DA_XET = {
  // ── jszip 2.7.0 — dev-only, MỘT đường, nằm trong CLI của Zalo Mini App ──
  // `pnpm why jszip -r` (10/08): đúng 1 đường, dev only —
  //   @hieu-asia/miniapp-zalo → zmp-cli@2.1.0 → zip-local@0.3.5 → jszip@2.7.0
  // Không app nào khác chạm tới; gói này không bao giờ vào bundle khách xem.
  'GHSA-36fh-84j7-cv5h': {
    goi: 'jszip',
    lyDo:
      'Path traversal xảy ra khi GIẢI NÉN: `loadAsync` chấp nhận tên file chứa ' +
      '`../` nên archive độc hại ghi được ra ngoài thư mục đích. Đường dùng duy ' +
      'nhất ở kho này chạy NGƯỢC LẠI — `zmp-cli` gọi `zip-local` để NÉN thư mục ' +
      'build trước khi upload (#1057 ghi rõ mục đích), không đọc archive nào từ ' +
      'bên ngoài ⇒ không có đầu vào cho kẻ tấn công đưa tên file vào. Đã ĐẾM ' +
      '`pnpm why jszip -r`: đúng 1 đường, dev-only, chỉ mini-app Zalo. ' +
      'KHÔNG có đường nâng: bản vá cần jszip >=3.8.0, nhưng zip-local@0.3.5 (bản ' +
      'MỚI NHẤT trên registry, thượng nguồn đã bỏ bê) gọi `new JSZip(buffer)` — ' +
      'constructor bị xoá ở 3.x. #1057 đã thử ép 3.10.1 và VỠ build, nên mới có ' +
      'override hẹp `zip-local>jszip: ^2.6.1`; dòng đó là cố ý, không phải rác. ' +
      'Đã hỏi lại registry 10/08: zmp-cli@4.0.3 (mới nhất) VẪN dep `zip-local ^0.3.4`, ' +
      'tức nâng zmp-cli cũng không thoát. XÉT LẠI khi: zmp-cli bỏ zip-local, ' +
      'zip-local ra bản chạy jszip 3, hoặc mini-app bắt đầu giải nén archive ngoài.',
    xetNgay: '2026-08-10',
  },

  // ── image-size 2.0.2 — dev-only, MỘT đường, nằm trong Storybook của apps/web ──
  // `pnpm why image-size -r` (10/08): đúng 1 đường, dev only —
  //   apps/web → @storybook/nextjs-vite@10.4.1 → vite-plugin-storybook-nextjs@3.3.0
  //   → image-size@2.0.2
  // Không phải dep trực tiếp ở bất kỳ package.json nào (grep: 0 kết quả) và
  // không vào bundle production — `next/image` xử lý ảnh bằng sharp, không gọi
  // gói này. Hai advisory dưới cùng gói, cùng đường, cùng dạng lỗi nên lý do
  // song song nhau; tách hai mục vì `pnpm audit` báo hai mã riêng.
  'GHSA-w3rx-r6r6-pgpr': {
    goi: 'image-size',
    lyDo:
      'Vòng lặp vô hạn khi đọc file ICNS dị dạng ⇒ treo tiến trình (DoS). Chỉ ' +
      'Storybook gọi, tức chỉ chạy trên máy lập trình viên lúc `storybook dev` / ' +
      '`build-storybook`, trên ảnh nằm sẵn trong repo do chính ta đặt vào — không ' +
      'có ảnh nào từ người lạ đi qua đây, và tiến trình có treo cũng không ảnh ' +
      'hưởng khách. Đã ĐẾM: 1 đường, dev-only, không vào bundle. KHÔNG có bản vá — ' +
      'hỏi registry 10/08: bản mới nhất của image-size LÀ 2.0.2, mà dải dính là ' +
      '`<=2.0.2` (pnpm audit trả `patched_versions: <0.0.0`, tức chưa tồn tại bản ' +
      'sạch nào). vite-plugin-storybook-nextjs@3.3.2 (mới nhất) vẫn đòi `^2.0.0`. ' +
      'XÉT LẠI khi image-size ra 2.0.3+ hoặc Storybook đổi sang gói đọc ảnh khác.',
    xetNgay: '2026-08-10',
  },
  'GHSA-5p2g-fcmc-qvqq': {
    goi: 'image-size',
    lyDo:
      'Cùng gói, cùng đường và cùng dạng lỗi với GHSA-w3rx-r6r6-pgpr, chỉ khác ' +
      'định dạng ảnh: vòng lặp vô hạn ở bộ đọc JXL và HEIF ⇒ treo tiến trình. ' +
      'Kết luận y hệt: 1 đường duy nhất đã đếm, dev-only qua Storybook của ' +
      'apps/web, ảnh đầu vào là ảnh trong repo chứ không từ người lạ, không vào ' +
      'bundle khách xem. KHÔNG có bản vá tồn tại (image-size mới nhất 2.0.2 nằm ' +
      'trọn trong dải dính `<=2.0.2`). Xét lại cùng lúc với mục ICNS ở trên.',
    xetNgay: '2026-08-10',
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
 * nhất. Cả 3 mục hiện tại đều có lý do dạng "thượng nguồn chưa vá / chưa với tới
 * được" — loại lý do MỤC NHANH NHẤT theo thời gian. Nếu mai `image-size` ra
 * 2.0.3, hoặc `zmp-cli` bỏ `zip-local`, thì advisory VẪN xuất hiện (ta vẫn ở bản
 * cũ), VẪN nằm trong DA_XET ⇒ exit 0 mãi mãi và không ai biết là đã vá được.
 *
 * ĐÃ CÂN NHẮC VÀ BỎ cách "so `patched_versions`": ca jszip có bản vá ở thượng
 * nguồn (`>=3.8.0`) mà vẫn không với tới được (zip-local kẹt ở API 2.x) — nên
 * phép so đó sẽ đỏ ngay hôm nay, tức báo động sai. Thứ thật sự mục là LÝ DO, và
 * thứ đo được nó là THỜI GIAN. Vẫn in `patched_versions` ra để người xem tự
 * đối chiếu.
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
