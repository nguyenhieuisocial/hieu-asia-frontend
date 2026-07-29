#!/usr/bin/env node
/**
 * seo-live — đo tiêu đề/mô tả trên TRANG ĐANG CHẠY THẬT, không phải trên build.
 *
 * VÌ SAO CẦN CÁI NÀY BÊN CẠNH `seo-guard`:
 * `seo-guard.mjs` chỉ đọc các file `*.html` do `next build` sinh ra. Trang nào
 * không tiền-dựng (có `generateMetadata` động, hoặc render phía client) thì
 * KHÔNG có `.html` ⇒ guard không thấy ⇒ guard xanh mà site vẫn sai. Ngày
 * 2026-07-26 quét thật phát hiện 4 trang như vậy đã vượt ngưỡng từ lâu:
 * /bang-chung (mô tả 267), /mbti (176), /tuong-hop-12-con-giap (tiêu đề 69,
 * mô tả 245), /tra-cuu-tuoi (tiêu đề 64, mô tả 233). Cả 4 đều KHÔNG sinh
 * `.html` — đã kiểm lại trên bản dựng, không phải suy đoán.
 *
 * Cùng hôm đó còn một bài học thứ hai: /mbti khai `description` ở CẢ
 * `layout.tsx` lẫn `page.tsx`. Metadata của page ĐÈ layout, nên sửa layout là
 * sửa vào chỗ không ra trang — chỉ có phép đo trên trang thật mới lộ ra.
 *
 * Chạy:  pnpm --filter web seo-live            (mặc định https://hieu.asia)
 *        pnpm --filter web seo-live -- <url>   (đo môi trường khác — mọi URL
 *                                               lấy từ sitemap đều được ĐỔI VỀ
 *                                               gốc này trước khi tải)
 * Mã thoát:  0 sạch · 1 vi phạm SEO · 2 hạ tầng hỏng (không kết luận được)
 *            3 LỖI CỦA NGƯỜI VIẾT PR (sitemap teo, danh sách bỏ qua sai).
 *
 * ⚠️ VÌ SAO TÁCH 3 KHỎI 2: nơi gọi ở CI map mã 2 thành `::warning::` + không
 * chặn (đúng, vì mạng chập không phải lỗi của PR). Nhưng "sitemap teo mất cả
 * cụm" và "danh sách bỏ qua ăn quá rộng" LÀ lỗi của PR — để chung mã 2 thì
 * chúng thành advisory và merge được, tức chốt canh tự vô hiệu. Cụ thể: viết
 * `--bo-qua` ăn 50% site sẽ ra "cảnh báo hạ tầng" và check VẪN XANH dù không
 * đo gì. Mã 3 buộc nơi gọi phải chặn.
 * Tách 1/2 là cố ý, cùng quy ước với `seo-guard.mjs`: CI phải phân biệt được
 * "PR này làm hỏng SEO" với "site đang chết / mạng lỗi".
 *
 * Các hàm dưới đây là HÀM THUẦN (không I/O, không exit) để
 * `src/lib/seo-live.test.ts` khoá được hành vi — cùng quy ước với
 * `seo-guard.mjs`. Bốn lỗi nặng nhất của bản nháp đầu (bỏ sót sitemap con,
 * không có sàn số trang, `-- <url>` vẫn đo production, sitemap trộn bị vứt
 * nhánh) đều là loại test bắt được trong vài dòng.
 */
import { argv, exit } from 'node:process';
import { pathToFileURL } from 'node:url';

import { TITLE_MAX, DESCRIPTION_MAX } from './seo-guard.mjs';

/**
 * Sàn TỔNG. Sitemap thật đo được 978 URL (2026-07-26). Không có sàn thì một
 * sitemap teo lại vẫn cho ra "0 vi phạm ✅" — đúng cái bẫy `seo-guard.mjs` đã
 * ghi ở `MIN_PAGES`.
 *
 * ⚠️ SÀN NÀY CHỈ BẮT ĐƯỢC MẤT MÁT LỚN (>78 URL). Nó KHÔNG bảo vệ được từng cụm
 * — việc đó là của `CUM_TOI_THIEU` ngay dưới. Đừng gán cho con số này công
 * dụng nó không có.
 */
export const MIN_TRANG = 900;

/**
 * Sàn TỪNG CỤM = 60% số đo ngày 2026-07-26 (làm tròn xuống).
 *
 * Chỉ liệt kê 21 cụm ≥10 URL — chúng chiếm 867/978. 68 cụm nhỏ còn lại (111
 * URL) do sàn tổng gánh, và `canhBaoCumMoi` sẽ nhắc khi cụm nào lớn quá ngưỡng.
 *
 * ĐÂY mới là chỗ bắt được ca "API nội dung rớt": `app/sitemap.ts` gọi API lấy
 * danh sách cẩm nang, API chết là cả cụm `/cam-nang` biến mất. Cụm đó chỉ có 11
 * URL nên sàn TỔNG (dư địa 78) hoàn toàn không thấy; `'/cam-nang': 6` mới thấy.
 *
 * ⚠️ KHOẢNG MÙ CÒN LẠI — biết để đừng tưởng kín: mất ≤40% một cụm mà tổng vẫn
 * ≥900 thì cả hai sàn đều im. Cụ thể: /cung-hoang-dao mất 37/92, /hop-tuoi 34,
 * /tarot 33, /tu-vi-thang 32, /ban-menh 32, /learn 31 vẫn xanh. 78/111 URL của
 * các cụm nhỏ cũng vậy.
 *
 * ⚠️ `'/tu-vi-thang': 47` bị buộc NGẦM vào `WINDOW_MONTHS = 5` trong
 * `tu-vi-thang-data.ts` (cửa sổ trượt 6 tháng ⇒ 79 URL). Hạ WINDOW_MONTHS
 * xuống 2 thì còn ~40 < 47 và chốt này đỏ. Hai hằng số không tham chiếu nhau.
 *
 * Số đo gốc: cung-hoang-dao 92 · hop-tuoi 83 · tarot 81 · tu-vi-thang 79 ·
 * ban-menh 78 · learn 77 · gieo-que 66 · tu-vi 61 · huong-nha 37 · xong-dat 31 ·
 * khai-truong 31 · xem-tuoi-lam-nha 25 · than-so-hoc 19 · xem-tuoi-cuoi 17 ·
 * gio-hoang-dao 14 · tu-vi-hom-nay 13 · tu-vi-2026 13 · tu-vi-2027 13 ·
 * sao-han 13 · tam-tai 13 · cam-nang 11.
 *
 * CẬP NHẬT KHI NÀO: chỉ khi nội dung co lại CÓ CHỦ Ý. Sửa số kèm lý do trong
 * commit — đừng hạ sàn chỉ để CI hết đỏ.
 */
export const CUM_TOI_THIEU = {
  '/cung-hoang-dao': 55,
  '/hop-tuoi': 49,
  '/tarot': 48,
  '/tu-vi-thang': 47,
  '/ban-menh': 46,
  '/learn': 46,
  '/gieo-que': 39,
  '/tu-vi': 36,
  '/huong-nha': 22,
  '/xong-dat': 18,
  '/khai-truong': 18,
  '/xem-tuoi-lam-nha': 15,
  '/than-so-hoc': 11,
  '/xem-tuoi-cuoi': 10,
  '/gio-hoang-dao': 8,
  '/tu-vi-hom-nay': 7,
  '/tu-vi-2026': 7,
  '/tu-vi-2027': 7,
  '/sao-han': 7,
  '/tam-tai': 7,
  '/cam-nang': 6,
};

/**
 * Tỷ lệ lỗi hạ tầng tối đa còn KẾT LUẬN ĐƯỢC. Trên ngưỡng ⇒ mã 2.
 *
 * ⚠️ VÌ SAO KHÔNG PHẢI "0". Bản trước là `if (loiHaTang.length) exit(2)` — CHỈ
 * MỘT request rớt trong 978 là cả lượt quét thành "không kết luận được", tức
 * toàn bộ lớp bảo vệ TỰ TẮT mà vẫn báo xanh ở CI (vì mã 2 chỉ cảnh báo). Một
 * hiccup CDN là đủ. Nay vài lỗi lẻ vẫn cho phép kết luận về 97%+ còn lại —
 * chúng được IN RA, và lượt chạy theo lịch hôm sau sẽ đo lại đúng mấy trang đó.
 */
export const NGUONG_HA_TANG = 0.02;

/**
 * Ngưỡng MẶC ĐỊNH là 0 — phải truyền `--chiu-loi=N` mới nới.
 *
 * ⚠️ VÌ SAO KHÔNG NỚI MẶC ĐỊNH: hai nơi gọi có hậu quả NGƯỢC NHAU khi ra mã 2.
 *  · Ở CI (`seo-guard.yml`) mã 2 = cảnh báo câm ⇒ ngưỡng 0 làm cả lớp bảo vệ
 *    tự tắt vì một hiccup. Ở đó CẦN nới.
 *  · Ở lượt chạy theo lịch (`seo-live.yml`) mã 2 = FAIL + bắn Telegram ⇒ nó
 *    vốn đã "loud". Nới mặc định ở đây thành ra: 19 URL production chết mà
 *    KHÔNG ai được báo — 19 trang chết trong sitemap là vấn đề SEO thật, không
 *    phải nhiễu. Nới toàn cục là dịch lỗ sang chỗ tệ hơn.
 * Nên: nghiêm mặc định, CI tự khai mức chịu đựng của mình.
 */
export function docChiuLoi(thamSo) {
  const m = (thamSo ?? '').match(/^--chiu-loi=(\d+(?:\.\d+)?)$/);
  if (!m) return 0;
  return Math.min(Number(m[1]) / 100, NGUONG_HA_TANG);
}
export const CHO_TOI_DA_MS = 15000;
export const SO_LAN_THU_LAI = 2;
export const SONG_SONG = 12;
/** Số lỗi hạ tầng liên tiếp thì ngưng — site đã hỏng, đo tiếp chỉ tốn thời gian. */
export const NGUNG_SOM_SAU = 25;

/** Giải mã entity. `&amp;` PHẢI đứng cuối, nếu không "&amp;lt;" ra sai. */
export function giaiMa(s) {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(?:39|x27);/g, "'")
    .replace(/&amp;/g, '&');
}

export function bocLoc(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

/**
 * Đổi URL tuyệt đối trong sitemap về gốc đang đo. Thiếu bước này thì truyền
 * `-- http://localhost:3000` vào vẫn đi tải production và báo xanh cho một bản
 * dựng nó chưa hề chạm tới.
 */
export function veGoc(u, goc) {
  try {
    const { pathname, search } = new URL(u);
    return goc.replace(/\/$/, '') + pathname + search;
  } catch {
    return null;
  }
}

/**
 * Bỏ mọi khối `<svg>…</svg>` trước khi dò thẻ.
 *
 * ⚠️ KHÔNG được thay bằng "chỉ đọc phần `<head>`" — tôi đã thử và nó SAI trên
 * chính site này: với trang render động, Next phát `<title>`/`<meta>` TRONG
 * `<body>` (metadata theo luồng, React hoisting lúc chạy). Đo thử: `/mbti` có
 * `</head>` ở khoảng byte 242k còn `<title>` mãi ~351k ⇒ cắt theo `<head>` làm
 * 26 trang động báo oan "thiếu tiêu đề". (Con số byte trôi theo mỗi bản dựng —
 * đừng coi là hằng số, cứ đo lại nếu cần.)
 *
 * Còn lý do phải bỏ SVG — ĐỪNG XOÁ BỘ LỌC NÀY, nó đang gánh việc thật:
 * `components/thien-van/SkyTimeline.tsx` render `<title>` trong từng marker SVG.
 * Đo trên `/thien-van`: 27 thẻ `<title>` trước khi lọc, còn đúng 1 sau khi lọc.
 * Không bỏ SVG thì một trang MẤT tiêu đề thật vẫn vớ được
 * `"Nguyệt thực toàn phần … — 03/03/2026 (giờ VN)"` — dài hợp lệ ⇒ luật "thiếu
 * tiêu đề" không bao giờ đỏ được.
 * (Kiểm trên `/mbti` hay `/` sẽ thấy 0 SVG title và tưởng bộ lọc thừa — sai,
 * phải kiểm trên `/thien-van`.)
 */
export function boSvg(html) {
  return html.replace(/<svg[\s\S]*?<\/svg>/gi, '');
}

/** `null` = không phải trang HTML (chuyển hướng, JSON, trang lỗi trần…). */
export function docTieuDe(html) {
  if (!/<html[\s>]/i.test(html)) return null;
  const m = boSvg(html).match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? giaiMa(m[1]).trim() : '';
}

export function docMoTa(html) {
  if (!/<html[\s>]/i.test(html)) return null;
  const m = boSvg(html).match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  return m ? giaiMa(m[1]).trim() : '';
}

/** Trả danh sách vi phạm của MỘT trang. Rỗng = đạt. */
export function kiemMotTrang(duong, html) {
  const tieuDe = docTieuDe(html);
  const moTa = docMoTa(html);
  if (tieuDe === null || moTa === null)
    return [{ duong, luat: 'không phải trang HTML', chiTiet: html.slice(0, 60) }];

  const ra = [];
  if (!tieuDe) ra.push({ duong, luat: 'thiếu tiêu đề', chiTiet: '' });
  else if (tieuDe.length > TITLE_MAX)
    ra.push({ duong, luat: `tiêu đề ${tieuDe.length}>${TITLE_MAX}`, chiTiet: tieuDe });
  if (!moTa) ra.push({ duong, luat: 'thiếu mô tả', chiTiet: '' });
  else if (moTa.length > DESCRIPTION_MAX)
    ra.push({ duong, luat: `mô tả ${moTa.length}>${DESCRIPTION_MAX}`, chiTiet: moTa.slice(0, 90) });
  return ra;
}

/** Chia đều danh sách cho N luồng. Phân hoạch đầy đủ và rời nhau. */
export function chiaLuong(danh, n) {
  return Array.from({ length: n }, (_, i) => danh.filter((_, j) => j % n === i));
}

/** Gom URL theo đoạn đường dẫn đầu tiên. `/` (trang chủ) đứng riêng. */
export function gomCum(urls) {
  const ra = new Map();
  for (const u of urls) {
    let p;
    try {
      p = new URL(u).pathname;
    } catch {
      continue;
    }
    const cum = p === '/' ? '/' : `/${p.split('/')[1]}`;
    ra.set(cum, (ra.get(cum) ?? 0) + 1);
  }
  return ra;
}

/**
 * Kiểm sitemap có bị teo không. Trả danh sách lý do; rỗng = ổn.
 *
 * ⚠️ VÌ SAO KHÔNG CHỈ DÙNG MỘT CON SỐ TỔNG: bản trước chỉ có `MIN_TRANG = 900`
 * trên tổng 978 ⇒ dư địa 78 URL. Đo thật: chỉ 4/89 cụm vượt 78, nghĩa là 85 cụm
 * có thể BIẾN MẤT SẠCH mà sàn tổng vẫn xanh. Ca cụ thể: mất trọn `/learn`
 * (77 URL) → còn 901 ≥ 900 → in "0 vi phạm", exit 0. Nên phải có sàn TỪNG CỤM.
 */
export function kiemSanSitemap(urls) {
  const ly = [];
  if (urls.length < MIN_TRANG)
    ly.push(`tổng ${urls.length} URL, dưới sàn ${MIN_TRANG}`);
  const dem = gomCum(urls);
  for (const [cum, moc] of Object.entries(CUM_TOI_THIEU)) {
    const co = dem.get(cum) ?? 0;
    if (co < moc) ly.push(`cụm ${cum} chỉ còn ${co} URL, dưới sàn ${moc}`);
  }
  return ly;
}

/**
 * Cụm ≥ NGUONG_CUM_LON URL mà CHƯA có sàn riêng — in ra để không bị mục.
 *
 * ⚠️ VÌ SAO CẦN: `CUM_TOI_THIEU` là ảnh chụp một ngày. Cụm mới sinh ra, hoặc
 * cụm nhỏ lớn lên quá ngưỡng, sẽ nằm ngoài lưới mà KHÔNG ai biết — đúng cách
 * `/learn` từng lọt. Ngày 2026-07-26 có 4 cụm sát ngưỡng: /community (8),
 * /xem-ngay (8), /so-sanh (7), /methodology (6). Cùng tinh thần báo `stale`
 * cho ALLOWLIST của `seo-guard.mjs`: nhắc, không chặn.
 */
export const NGUONG_CUM_LON = 10;
export function canhBaoCumMoi(urls) {
  const ra = [];
  for (const [cum, n] of gomCum(urls)) {
    if (n >= NGUONG_CUM_LON && !(cum in CUM_TOI_THIEU))
      ra.push(
        `cụm ${cum} đã có ${n} URL nhưng chưa có sàn trong CUM_TOI_THIEU — ` +
          'thêm vào, nếu không nó biến mất mà không ai báo.',
      );
  }
  return ra;
}

/**
 * Hàng loạt URL cùng một mã lỗi ⇒ HẠ TẦNG, không phải nội dung.
 *
 * ⚠️ BA CA THẬT của repo này, cả ba trước đây đều ra mã thoát 1 kèm tin nhắn
 * "Meta trên site thật đang sai" — chẩn đoán ngược hoàn toàn:
 *   · bật chế độ bảo trì (`middleware.ts` → 307 về `/maintenance`): 978 URL
 *     đều "chuyển hướng 307";
 *   · chạy `-- <preview>` có Vercel Deployment Protection: 978 URL đều 401;
 *   · trôi lệch sitemap↔route đầu tháng (đã ghi ở `tu-vi-thang-data.ts`):
 *     hàng loạt 404.
 * Dấu hiệu chung: thất bại ĐỒNG LOẠT và GIỐNG NHAU. Lỗi nội dung thật thì
 * lẻ tẻ và khác nhau — đợt này chỉ 6 vi phạm trên 978 trang.
 */
export const TY_LE_DONG_LOAT = 0.5;
export function doHongDongLoat(viPham, tongUrl) {
  if (tongUrl === 0) return null;
  const dem = new Map();
  for (const v of viPham) dem.set(v.luat, (dem.get(v.luat) ?? 0) + 1);
  for (const [luat, n] of dem) {
    if (n / tongUrl >= TY_LE_DONG_LOAT)
      return `${n}/${tongUrl} URL cùng lỗi "${luat}"`;
  }
  return null;
}

/**
 * Tách danh sách URL thành {do, boQua} theo tiền tố đường dẫn.
 *
 * ⚠️ VÌ SAO CẦN BỎ QUA KHI ĐO TRÊN BẢN DỰNG CI: một số route render động bằng
 * cách `fetch` RA NGOÀI ngay lúc nhận request (`/cam-nang` gọi API nội dung,
 * `/tu-vi-hom-nay` gọi `hieu.asia`, `/hop-tuoi` cũng có). Trên CI điều đó gây
 * HAI hỏng thật:
 *  ① API chập → `fetchPillar` trả null → `notFound()` → HTTP 404 → bị xếp là
 *    VI PHẠM (không phải lỗi hạ tầng) → mã 1 → CHẶN MỌI PR, kể cả PR chỉ sửa
 *    CSS. Required check đỏ oan.
 *  ② Trang lấy nội dung từ PRODUCTION nên phép đo không nói gì về bản dựng của
 *    PR — đo mà không trung thực còn tệ hơn không đo.
 * Lượt chạy theo lịch trên production vẫn phủ chúng, ở đó phép đo mới có nghĩa.
 *
 * ⚠️ Bỏ qua chỉ áp cho việc TẢI. Sàn `MIN_TRANG`/`CUM_TOI_THIEU` vẫn chạy trên
 * DANH SÁCH ĐẦY ĐỦ, nên "thiếu cả cụm trong sitemap" vẫn bị bắt như thường.
 */
export function tachBoQua(urls, mau) {
  if (!mau?.length) return { do: urls, boQua: [] };
  const dinh = (u) => {
    let p;
    try {
      p = new URL(u).pathname;
    } catch {
      return false;
    }
    return mau.some((m) =>
      m.endsWith('/*') ? p === m.slice(0, -2) || p.startsWith(m.slice(0, -1)) : p === m,
    );
  };
  return { do: urls.filter((u) => !dinh(u)), boQua: urls.filter(dinh) };
}

/**
 * Chặn danh sách bỏ qua phình to trong im lặng.
 *
 * ⚠️ CA THẬT ĐÃ SẬP VÀO: tôi viết `--bo-qua=/hop-tuoi` định loại 3 trang động,
 * nhưng nó ăn theo tiền tố nên loại luôn **83** URL — 80 trang TĨNH đang được
 * đo tốt bỗng ra khỏi lưới mà không có gì báo. Nay mẫu phải ghi rõ `/x/*` mới
 * ăn cả nhánh, và tỷ lệ bỏ qua vượt ngưỡng thì ĐỎ.
 */
/** Mẫu bỏ qua nào không khớp URL nào — dấu hiệu gõ sai hoặc route đã đổi tên. */
export function mauKhongKhop(urls, mau) {
  return (mau ?? []).filter((m) => tachBoQua(urls, [m]).boQua.length === 0);
}

export const BO_QUA_TOI_DA = 0.05;
export function kiemBoQua(soBoQua, tong) {
  if (tong === 0 || soBoQua / tong <= BO_QUA_TOI_DA) return null;
  return (
    `danh sách bỏ qua ăn ${soBoQua}/${tong} URL ` +
    `(quá ${Math.round(BO_QUA_TOI_DA * 100)}%) — gần như chắc chắn một mẫu đang ` +
    'ăn rộng hơn ý định. Ghi rõ từng đường dẫn, hoặc `/nhánh/*` nếu thật sự muốn cả nhánh.'
  );
}

/** Trạng thái dùng chung của các luồng quét. Tách ra để test được. */
export function trangThaiMoi() {
  return { viPham: [], loiHaTang: [], dat: 0, trangHong: 0, loiLienTiep: 0, dungSom: false };
}

/**
 * Ghi một lỗi hạ tầng và quyết định có ngưng sớm không.
 *
 * ⚠️ ĐẾM LIÊN TIẾP, KHÔNG ĐẾM TÍCH LUỸ. Bản trước dùng tổng: chỉ cần CDN rớt
 * lẻ tẻ 2,6% (25/978 — hoàn toàn bình thường qua Cloudflare) là lượt quét ngắt
 * ở URL thứ ~300 và exit 2. Lặp lại mỗi ngày ⇒ chốt canh KHÔNG BAO GIỜ quét
 * hết site nữa, mà vẫn trông như "mạng lỗi, mai chạy lại" — một hồi quy SEO ở
 * URL thứ 700 sẽ không bao giờ được đo. Mỗi request thành công reset về 0, nên
 * ngưỡng này chỉ chạm khi site thực sự chết.
 */
export function ghiLoiHaTang(so, muc) {
  so.loiHaTang.push(muc);
  so.loiLienTiep++;
  if (so.loiLienTiep >= NGUNG_SOM_SAU) so.dungSom = true;
  return so;
}

// ───────────────────────── phần có I/O ─────────────────────────

const nghi = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * 5xx/429/lỗi mạng → thử lại. 4xx và 3xx → trả về luôn (lỗi của site, không
 * phải nhiễu mạng). `redirect: 'manual'` là CỐ Ý — xem `phanLoaiPhanHoi`.
 */
async function taiCoThuLai(u) {
  let loiCuoi;
  for (let lan = 0; lan <= SO_LAN_THU_LAI; lan++) {
    try {
      const r = await fetch(u, {
        cache: 'no-store',
        redirect: 'manual',
        signal: AbortSignal.timeout(CHO_TOI_DA_MS),
      });
      if (r.status < 500 && r.status !== 429) return r;
      loiCuoi = new Error(`HTTP ${r.status}`);
    } catch (e) {
      loiCuoi = e;
    }
    if (lan < SO_LAN_THU_LAI) await nghi(500 * (lan + 1));
  }
  throw loiCuoi;
}

/**
 * Tách phần thuần khiết của việc phân loại một phản hồi, để test khoá được.
 * Trả `null` nghĩa là phản hồi ổn, đọc thân trang tiếp.
 *
 * ⚠️ VÌ SAO PHẢI BẮT 3xx: `fetch` mặc định `redirect: 'follow'`. Nếu một thay
 * đổi routing làm phần lớn URL trong sitemap 308 về `/`, thì MỌI trang đều trả
 * 200 với tiêu đề + mô tả hợp lệ của trang chủ ⇒ `đạt 978 · vi phạm 0` ⇒
 * exit 0, trong khi site đã mất gần hết trang. Sàn cụm cũng không cứu được vì
 * số URL trong sitemap không đổi. Thêm nữa: URL nằm trong sitemap mà lại
 * chuyển hướng TỰ NÓ đã là lỗi SEO.
 */
export function phanLoaiPhanHoi(duong, status, viTri) {
  if (status >= 300 && status < 400)
    return { duong, luat: `chuyển hướng ${status}`, chiTiet: viTri ?? '' };
  if (status >= 400) return { duong, luat: `HTTP ${status}`, chiTiet: '' };
  return null;
}

/**
 * Gộp sitemap. `tai` được tiêm vào để test khoá được hành vi mà không cần mạng
 * — ba lỗi "im lặng báo xanh" (sitemap con hỏng, sitemap trộn, <loc> rác) đều
 * nằm ở đây.
 */
export async function gopSitemap(goc, tai) {
  const dau = await tai(`${goc}/sitemap.xml`);
  // Sitemap chỉ mục thường KHÔNG lẫn URL thường, nhưng nếu lẫn thì phải gộp cả
  // hai — chỉ lấy một nhánh là bỏ sót trong im lặng.
  const ra = dau.filter((u) => !u.endsWith('.xml'));
  for (const u of dau.filter((u) => u.endsWith('.xml'))) {
    const con = veGoc(u, goc);
    if (!con) throw new Error(`<loc> sitemap con không phải URL hợp lệ: ${u}`);
    ra.push(...(await tai(con)));
  }

  const hong = ra.filter((u) => veGoc(u, goc) === null);
  if (hong.length) throw new Error(`${hong.length} <loc> không phải URL hợp lệ, ví dụ: ${hong[0]}`);
  return [...new Set(ra.map((u) => veGoc(u, goc)))];
}

/**
 * Sitemap con trả 404 mà không kiểm `ok` thì `bocLoc` khớp 0 kết quả và cả tập
 * trang đó biến mất KHÔNG MỘT TIẾNG ĐỘNG — vẫn in "0 vi phạm ✅". Tách ra khỏi
 * I/O để test khoá được đúng phép kiểm đó.
 */
export function bocSitemap(u, ok, status, xml) {
  if (!ok) throw new Error(`${u} → HTTP ${status}`);
  return bocLoc(xml);
}

const taiXml = async (u) => {
  const r = await taiCoThuLai(u);
  return bocSitemap(u, r.ok, r.status, r.ok ? await r.text() : '');
};

/**
 * Kiểm tham số dòng lệnh. Trả chuỗi lỗi, hoặc `null` nếu ổn.
 *
 * ⚠️ MỌI LỖI GÕ TRƯỚC ĐÂY ĐỀU IM LẶNG HOẶC BỊ CHẨN ĐOÁN NGƯỢC:
 *  · quên URL, để cờ ở vị trí đầu ⇒ `goc = "--bo-qua=…"` ⇒ fetch ném ⇒ mã 2 ⇒
 *    Telegram báo "site không phản hồi" trong khi site vẫn sống;
 *  · viết `--bo-qua /x` (dấu cách thay `=`) ⇒ cờ thành một mẫu vô nghĩa ⇒ KHÔNG
 *    bỏ qua gì ⇒ mấy cụm gọi API trả 404 ⇒ mã 1 ⇒ chặn mọi PR, không dòng nào
 *    nói "cờ của bạn vô hiệu".
 */
export function kiemThamSo(goc, co) {
  try {
    const u = new URL(goc);
    if (!/^https?:$/.test(u.protocol)) return `gốc "${goc}" phải là http(s)`;
  } catch {
    return `gốc "${goc}" không phải URL hợp lệ — nhớ truyền URL TRƯỚC các cờ`;
  }
  for (const c of co) {
    if (!/^--(bo-qua|chiu-loi)=/.test(c))
      return `tham số "${c}" không nhận ra (chỉ có --bo-qua= và --chiu-loi=, phải dùng dấu =)`;
    // ⚠️ PHẢI SOI CẢ GIÁ TRỊ, không chỉ tiền tố. `--chiu-loi=2%` khớp tiền tố
    // nên lọt, rồi `docChiuLoi` âm thầm trả 0 — mà ở `seo-guard.yml` mức chịu 0
    // nghĩa là MỘT URL rớt lẻ cũng ra mã 2 ⇒ map thành cảnh báo ⇒ toàn bộ phép
    // đo live thành advisory, check xanh. Một dấu `%` thừa là đủ tháo cổng.
    if (c.startsWith('--chiu-loi=') && !/^--chiu-loi=\d+(\.\d+)?$/.test(c))
      return `"${c}" sai định dạng — chỉ nhận số phần trăm, ví dụ --chiu-loi=2 (KHÔNG có dấu %)`;
    if (c === '--bo-qua=') return '--bo-qua= rỗng — bỏ hẳn cờ nếu không muốn bỏ qua gì';
  }
  return null;
}

async function main() {
  const goc = (argv[2] || 'https://hieu.asia').replace(/\/$/, '');
  const co = argv.slice(3).filter(Boolean);
  const loiThamSo = kiemThamSo(goc, co);
  if (loiThamSo) {
    console.error(`seo-live: ${loiThamSo}`);
    return exit(3);
  }
  const chiuLoi = docChiuLoi(co.find((c) => c.startsWith('--chiu-loi=')));
  const tienToBoQua = (co.find((c) => c.startsWith('--bo-qua=')) ?? '')
    .replace(/^--bo-qua=/, '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  let urls;
  try {
    urls = await gopSitemap(goc, taiXml);
  } catch (e) {
    console.error(`seo-live: không lấy được sitemap từ ${goc} — ${e?.message ?? e}`);
    return exit(2);
  }

  const teo = kiemSanSitemap(urls);
  if (teo.length) {
    console.error(
      'seo-live: sitemap đang thiếu trang — KHÔNG kết luận "sạch" trên một tập bị teo.',
    );
    for (const l of teo) console.error(`  ⚠ ${l}`);
    console.error(
      'Nếu đây là thay đổi nội dung CÓ CHỦ Ý, cập nhật CUM_TOI_THIEU trong ' +
        'apps/web/scripts/seo-live.mjs kèm lý do.',
    );
    return exit(3);
  }

  // Sàn đã chạy trên DANH SÁCH ĐẦY ĐỦ ở trên — giờ mới bỏ bớt phần không đo.
  const { do: canDo, boQua } = tachBoQua(urls, tienToBoQua);
  if (tienToBoQua.length) {
    console.log(
      `seo-live: BỎ QUA ${boQua.length} URL theo yêu cầu (${tienToBoQua.join(', ')}) — ` +
        'chúng gọi mạng ra ngoài lúc render nên đo ở đây vừa nhiễu vừa không ' +
        'nói gì về bản dựng này. Lượt chạy theo lịch trên production vẫn phủ.',
    );
    // Mẫu khớp 0 URL = route bị đổi tên, hoặc gõ sai (thiếu `/` đầu, dùng dấu
    // cách thay `=`). Im lặng ở đây nghĩa là cụm đó BỖNG được đo lại và sẽ đỏ
    // oan — phải nói ra.
    for (const m of mauKhongKhop(urls, tienToBoQua))
      console.error(`seo-live: ⚠ mẫu bỏ qua "${m}" không khớp URL nào — gõ sai hay route đã đổi?`);
    const qua = kiemBoQua(boQua.length, urls.length);
    if (qua) {
      console.error(`seo-live: ${qua}`);
      return exit(3);
    }
  }

  const so = trangThaiMoi();
  const taiFn = taiCoThuLai;

  const quet = async (danh) => {
    for (const u of danh) {
      if (so.dungSom) return;
      const duong = u.replace(goc, '') || '/';
      let r;
      try {
        r = await taiFn(u);
      } catch (e) {
        ghiLoiHaTang(so, { duong, luat: 'không tải được', chiTiet: String(e?.message ?? e) });
        continue;
      }
      const xau = phanLoaiPhanHoi(duong, r.status, r.headers.get('location') ?? '');
      if (xau) {
        so.viPham.push(xau);
        so.trangHong++;
        so.loiLienTiep = 0;
        continue;
      }
      let than;
      try {
        // `await r.text()` PHẢI nằm trong try: `AbortSignal.timeout` huỷ cả lúc
        // đọc thân, nên một kết nối đứt giữa chừng ném từ đây. Bản trước để
        // ngoài ⇒ unhandled rejection ⇒ Node thoát mã 1 ⇒ CI đọc thành "PR làm
        // hỏng SEO" trong khi thật ra là mạng lỗi.
        than = await r.text();
      } catch (e) {
        ghiLoiHaTang(so, { duong, luat: 'đứt khi đọc trang', chiTiet: String(e?.message ?? e) });
        continue;
      }
      so.loiLienTiep = 0;
      const loi = kiemMotTrang(duong, than);
      if (loi.length) {
        so.viPham.push(...loi);
        so.trangHong++;
      } else so.dat++;
    }
  };
  await Promise.all(chiaLuong(canDo, SONG_SONG).map(quet));

  const { dat, trangHong, viPham, loiHaTang } = so;
  // ĐẾM THEO TRANG, không theo vi phạm: một trang thiếu cả tiêu đề lẫn mô tả
  // sinh 2 phần tử trong `viPham`. Bản trước trừ `viPham.length` nên con số
  // "chưa đo" lệch, và ở trường hợp xấu còn ra SỐ ÂM.
  const chuaDo = canDo.length - dat - trangHong - loiHaTang.length;
  console.log(
    `seo-live: ${goc} — ${urls.length} URL trong sitemap` +
      (boQua.length ? ` (đo ${canDo.length}, bỏ qua ${boQua.length})` : '') +
      ` · đạt ${dat} · ${trangHong} trang sai (${viPham.length} vi phạm) · ` +
      `lỗi hạ tầng ${loiHaTang.length}` +
      (so.dungSom ? ` · NGƯNG SỚM, ${chuaDo} URL chưa đo` : ''),
  );
  for (const c of canhBaoCumMoi(urls)) console.log(`  ⓘ ${c}`);
  for (const v of viPham) console.log(`  ✗ ${v.duong.padEnd(40)} ${v.luat.padEnd(22)} ${v.chiTiet}`);
  for (const v of loiHaTang) console.log(`  ⚠ ${v.duong.padEnd(40)} ${v.luat.padEnd(22)} ${v.chiTiet}`);

  // Quá NGƯỠNG (hoặc đã ngưng sớm) ⇒ không kết luận được, mã 2. Dưới ngưỡng ⇒
  // vẫn kết luận trên phần đã đo được; mấy trang lẻ đã in ở trên và lượt chạy
  // theo lịch hôm sau sẽ đo lại. Bản trước exit(2) ngay từ MỘT lỗi, khiến cả
  // lớp bảo vệ tự tắt vì một hiccup mạng.
  if (so.dungSom || (canDo.length > 0 && loiHaTang.length / canDo.length > chiuLoi)) {
    console.error(
      `seo-live: ${loiHaTang.length}/${canDo.length} URL không tải được ` +
        `(quá mức chịu ${Math.round(chiuLoi * 100)}%) ⇒ KHÔNG kết luận được.`,
    );
    return exit(2);
  }
  if (loiHaTang.length)
    console.log(
      `::warning::seo-live: ${loiHaTang.length} URL không tải được nhưng dưới mức ` +
        'chịu — kết luận chỉ áp cho phần đã đo. Xem danh sách ⚠ ở trên.',
    );

  const dongLoat = doHongDongLoat(viPham, canDo.length);
  if (dongLoat) {
    console.error(`seo-live: ${dongLoat} ⇒ xếp là HẠ TẦNG, không phải lỗi nội dung.`);
    return exit(2);
  }
  return exit(viPham.length ? 1 : 0);
}

if (import.meta.url === pathToFileURL(argv[1] ?? '').href) {
  // `.catch` bắt buộc: thiếu nó thì mọi lỗi lọt ra ngoài thành unhandled
  // rejection và Node thoát mã 1 — trùng mã của "có vi phạm SEO".
  main().catch((e) => {
    console.error(`seo-live: hỏng ngoài dự kiến — ${e?.stack ?? e}`);
    exit(2);
  });
}
