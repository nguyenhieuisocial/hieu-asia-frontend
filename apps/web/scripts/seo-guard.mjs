#!/usr/bin/env node
/**
 * SEO metadata guard — vault 172.
 *
 * VÌ SAO CÓ FILE NÀY
 * Đợt SEO 2026-07-25 tìm ra ba lần hỏng, cả ba đều IM LẶNG — không có gì báo,
 * chỉ lộ khi có người tình cờ đo:
 *   1. 133 trang hiển thị mô tả cụt lửng trên SERP. `clampDescription` (#936)
 *      chặn được việc cắt gãy giữa chữ nhưng vẫn LẶNG LẼ cắt khi mẫu chữ quá
 *      dài — code trông "đã fix" trong khi Google vẫn thấy câu cụt.
 *   2. 79/79 trang của một cụm có <title> vượt ngưỡng, vì root layout nối thêm
 *      " · hieu.asia" (12 ký tự) mà không ai tính vào.
 *   3. Hai trang ĐÃ được rút chữ ở #942, có hẳn comment "SEO S7: rút gọn",
 *      mà vẫn vượt — vì #942 dùng mốc ~170 và đo chuỗi trong source thay vì đo
 *      <title> render ra. Sửa-mà-chưa-xong nguy hiểm hơn chưa-sửa.
 *
 * Nên guard này đo ĐÚNG THỨ GOOGLE THẤY: HTML tĩnh do `next build` sinh ra,
 * không đọc chuỗi trong source.
 *
 * DÙNG
 *   pnpm --filter web build && pnpm --filter web seo-guard
 *
 * ⛔ ĐÃ LÀ REQUIRED CHECK (bật 2026-07-25 ở branch protection, tên
 * "seo-guard (vault 172)"; xem vault 94). Chạy ở workflow riêng, nhưng vi phạm giờ
 * CHẶN merge — không còn advisory như thiết kế ban đầu. Thêm luật mới thì đo trước
 * cho chắc số vi phạm đang bằng 0, kẻo chặn nhầm việc của người khác.
 *
 * Các hàm kiểm tra bên dưới là HÀM THUẦN (không I/O, không exit) để
 * `src/lib/seo-guard.test.ts` khoá được hành vi. Phần CLI ở cuối file chỉ chạy
 * khi file này được gọi trực tiếp.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { argv, exit } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

// ── Ngưỡng: MỘT nguồn duy nhất cho mọi agent ────────────────────────
// Trước đây mỗi đợt dùng một mốc khác nhau (~170 vs 160) nên có trang "đã sửa"
// mà vẫn hỏng. Từ nay chỉ có hai số này.
export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 160;

/**
 * Số trang tối thiểu phải đọc được. Dưới mức này = build lỗi/bị xoá, KHÔNG phải
 * "site sạch".
 *
 * Đặt sát thực tế (1.113 trang tại 2026-07-25) chứ không đặt thấp cho "an toàn":
 * ngưỡng 200 nghe thì rộng rãi nhưng có nghĩa là **913 trang có thể biến mất mà
 * guard vẫn in "✅ không có vi phạm"**. Một thay đổi routing khiến cụm
 * `/hop-tuoi` (132 trang) hay `/tu-vi-thang` (157 trang) chuyển sang render động
 * sẽ rút chúng khỏi phạm vi kiểm mà không có tín hiệu nào.
 */
const MIN_PAGES = 1000;

/**
 * Giải mã thực thể HTML.
 *
 * THỨ TỰ QUAN TRỌNG: `&amp;` phải giải CUỐI CÙNG. Giải nó trước thì `&amp;lt;`
 * → `&lt;` → `<`, tức giải hai lần và làm sai nội dung (CodeQL js/double-escaping
 * bắt đúng lỗi này trong bản đầu của file). Đừng sắp xếp lại cho "gọn".
 */
function decodeEntities(s) {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

// ── Luật ────────────────────────────────────────────────────────────

/**
 * Kiểm một trang. Trả về mảng vi phạm (rỗng = đạt).
 * @param {{url: string, title: string|null, description: string|null, h1Count?: number, noindex?: boolean}} page
 */
export function checkPage(page) {
  const out = [];
  const { title, description, h1Count, noindex } = page;

  // Chỉ soi trang CHO-INDEX: h1 thuần là tín hiệu tìm kiếm nên trang noindex
  // không có gì để mất — và 25 trang riêng tư của site render nội dung phía
  // client trong <Suspense>, HTML tĩnh chỉ có khung nên h1 xuất hiện sau khi tải
  // xong (đúng thiết kế). Soi cả chúng thì luật sinh 25 báo động sai rồi bị tắt.
  //
  // `typeof` chứ không phải truthy: h1Count === 0 LÀ ca cần bắt.
  if (typeof h1Count === 'number' && !noindex) {
    if (h1Count === 0) {
      out.push({
        rule: 'h1-missing',
        detail:
          'không có <h1> — Google mất tín hiệu chủ đề mạnh nhất của trang, và ' +
          'heading bắt đầu từ h2/h3 là lỗi heading-order (WCAG 1.3.1)',
      });
    } else if (h1Count > 1) {
      out.push({
        rule: 'h1-multiple',
        detail: `${h1Count} thẻ <h1> trên một trang — chỉ được đúng 1; các h1 sau nên hạ xuống h2`,
      });
    }
  }

  if (!title) {
    out.push({ rule: 'title-missing', detail: 'không có <title>' });
  } else if (title.length > TITLE_MAX) {
    out.push({
      rule: 'title-too-long',
      detail: `<title> ${title.length} ký tự (tối đa ${TITLE_MAX}) — "${title}"`,
    });
  }

  if (!description) {
    out.push({ rule: 'description-missing', detail: 'không có meta description' });
    return out;
  }
  if (description.length > DESCRIPTION_MAX) {
    out.push({
      rule: 'description-too-long',
      detail: `mô tả ${description.length} ký tự (tối đa ${DESCRIPTION_MAX})`,
    });
  }
  // Mô tả kết thúc bằng "…" nghĩa là clampDescription ĐÃ PHẢI CẮT — tức mẫu chữ
  // quá dài. Đây chính là lỗi làm 133 trang hiển thị câu cụt trên SERP mà không
  // ai biết: độ dài vẫn ≤160 nên mọi phép kiểm "chỉ đo độ dài" đều báo xanh.
  if (description.endsWith('…')) {
    out.push({
      rule: 'description-clamped',
      detail: `mô tả bị clampDescription cắt (kết thúc bằng "…") — rút mẫu chữ ngắn lại, đừng để clamp cắt`,
    });
  }
  return out;
}

/** Đưa URL về dạng so sánh được: bỏ tên miền, bỏ dấu `/` cuối. */
export function normalizeUrl(u, base = 'https://hieu.asia') {
  if (!u) return null;
  return u.replace(base, '').split(/[?#]/)[0].replace(/\/+$/, '') || '/';
}

/**
 * Kiểm canonical ở mức TOÀN SITE (không kiểm được từng trang riêng lẻ vì cần
 * biết cả tập trang).
 *
 * VÌ SAO CẦN: canonical đang được gõ TAY ở 185 file, không có helper dùng chung
 * — đúng môi trường sinh lỗi copy-paste. Và mọi cách hỏng ở đây đều IM LẶNG mà
 * hậu quả nặng: trang vẫn hiện, vẫn có nội dung, chỉ là không bao giờ lên hạng.
 *
 * Đo 2026-07-25 (1.113 trang tĩnh): 0 vi phạm cả 3 luật. 66 trang `/hop-tuoi/
 * tuoi/X-Y` cố ý trỏ canonical sang `Y-X` là ĐÚNG — cặp tuổi đối xứng nên gom
 * hai thứ tự về một trang để khỏi trùng nội dung; cả 66 đều đã được loại khỏi
 * sitemap. Thêm luật lúc vi phạm bằng 0 nên không chặn việc của ai.
 *
 * @param {{url: string, canonical: string|null, noindex: boolean}[]} pages
 * @param {Set<string>|null} sitemapUrls URL trong sitemap (đã chuẩn hoá), null = không đọc được
 */
export function checkCanonicalGraph(pages, sitemapUrls) {
  const out = [];
  const exists = new Set(pages.map((p) => p.url));
  /** Trang cho-index có canonical trỏ sang trang KHÁC → url đích. */
  const ceded = new Map();
  for (const p of pages) {
    if (p.noindex || !p.canonical) continue;
    const target = normalizeUrl(p.canonical);
    if (target !== p.url) ceded.set(p.url, target);
  }

  for (const [url, target] of ceded) {
    // Trỏ vào trang không tồn tại: Google dồn xếp hạng vào hư không ⇒ trang này
    // mất sạch, và không có lỗi nào hiện ra ở đâu.
    if (!exists.has(target)) {
      out.push({
        url,
        rule: 'canonical-ghost',
        detail: `canonical trỏ tới "${target}" — trang đó KHÔNG có trong build; Google dồn xếp hạng vào hư không`,
      });
      continue;
    }
    // A→B và B→A: Google không chọn được bản chuẩn nên thường bỏ CẢ HAI.
    if (ceded.get(target) === url) {
      out.push({
        url,
        rule: 'canonical-loop',
        detail: `canonical vòng tròn với "${target}" — hai trang trỏ vào nhau, Google dễ bỏ cả hai`,
      });
    }
    // Đã nhường canonical thì đừng nộp cho Google: Search Console sẽ báo
    // "Duplicate, submitted URL not selected as canonical".
    if (sitemapUrls && sitemapUrls.has(url)) {
      out.push({
        url,
        rule: 'canonical-ceded-in-sitemap',
        detail: `đã nhường canonical cho "${target}" mà vẫn nằm trong sitemap — bỏ khỏi app/sitemap.ts`,
      });
    }
  }
  return out;
}

/**
 * Trang CHO-INDEX mà Google KHÔNG CÓ ĐƯỜNG NÀO tìm ra: vừa không có liên kết
 * nội bộ trỏ tới, vừa không nằm trong sitemap. Trang kiểu này mất traffic hoàn
 * toàn âm thầm — build xanh, test xanh, mở được nếu gõ đúng URL, chỉ Search
 * Console mới hé lộ và thường là muộn.
 *
 * ⚠️ HAI LẦN THIẾT KẾ SAI TRƯỚC KHI RA ĐƯỢC LUẬT NÀY — đọc trước khi sửa
 *
 * 1. Bản đo đầu (vault 172 §4b, đã rút): biểu thức lọc href bỏ qua mọi đường dẫn
 *    có `#`/`?` ⇒ trang CÓ link vẫn bị báo mồ côi. Bất đối xứng sai số ở đây là
 *    chiều XẤU: bỏ sót một href sinh BÁO ĐỘNG GIẢ chứ không bỏ qua êm.
 *
 * 2. Bản thứ hai lấy MỌI `href=` ⇒ tính cả `<link rel="canonical">` của chính
 *    trang, nên mọi trang đều tự "được trỏ tới" và luật KHÔNG BAO GIỜ ĐỎ ĐƯỢC.
 *    Một chốt không thể đỏ còn tệ hơn không có chốt: nó tạo an toàn giả. Chỉ
 *    kiểm đột biến mới lộ ra. ⇒ chỉ lấy href của thẻ `<a>`, và bỏ link tự trỏ.
 *
 * 3. Bản thứ ba chỉ xét liên kết nội bộ ⇒ báo 79 trang, nhưng bóc ra thì 0 cái
 *    là vấn đề thật: 78 là chặng chuyển hướng cố ý, 1 là trang CÓ trong sitemap
 *    (Google vẫn tìm ra) và có link render phía trình duyệt. Luật đo sai thứ cần
 *    đo. ⇒ điều kiện đúng là **không link NỘI BỘ *VÀ* không có trong sitemap**.
 *
 * Đo trên 1.113 trang sau khi sửa: chỉ còn các chặng chuyển hướng cố ý (đã có
 * mục miễn trừ sẵn). Thêm luật lúc số vi phạm thật bằng 0 nên không chặn ai.
 *
 * ⚠️ ĐIỂM MÙ ĐÃ BIẾT — ĐỌC TRƯỚC KHI TIN MỘT BÁO CÁO "MỒ CÔI"
 * `duocTro` dựng từ HTML TĨNH (`collectHtml` chỉ lấy `*.html`). Trang render
 * ĐỘNG không sinh file tĩnh, nên **mọi link nằm trên trang động đều vô hình**
 * với phép đo này. Ví dụ thật trong repo: `/tu-vi-hom-nay` (`force-dynamic`) và
 * `/bang-chung` đều không có `.html` — quét tĩnh tưởng chúng không trỏ đi đâu,
 * trong khi trên production chúng trỏ tới đủ 12 trang con và tới
 * `/bang-chung/do-chinh-xac`.
 *
 * Vì thế điều kiện phải là "không link nội bộ **VÀ** không trong sitemap": vế
 * sitemap chính là cái cứu khỏi điểm mù này. ĐỪNG nới luật thành "chỉ cần thiếu
 * link nội bộ" — sẽ báo sai hàng loạt trang chỉ được link từ hub động.
 *
 * Muốn đo mồ côi cho ĐÚNG thì phải đọc trang đã render (dev/prod server), không
 * đọc `.next`. Lịch sử: đây là lần thứ BA phép đo này sai trong dự án — xem
 * note 172 §4b (2 lần đầu) và §13 (lần thứ ba, 26/07).
 *
 * @param {{url: string, noindex: boolean}[]} pages
 * @param {Set<string>} duocTro URL được trang KHÁC trỏ tới bằng thẻ `<a>`
 * @param {Set<string>|null} sitemapUrls null = không đọc được sitemap → bỏ luật
 */
/**
 * Không đọc được sitemap trong build ⇒ HAI luật tự tắt: `canonical-ceded-in-sitemap`
 * (xem `checkCanonicalGraph`) và `orphan-page` (ngay dưới). Cả hai CỐ Ý khoan dung
 * với `null` để những luật còn lại vẫn chạy — đó là thiết kế đúng, có test khoá.
 *
 * Cái SAI là ở phần CLI: trước đây nó chỉ `console.warn` rồi vẫn in "✅ không có vi
 * phạm" và thoát 0. Guard bỏ luật mà CI vẫn xanh là kiểu hỏng tệ nhất, và đây KHÔNG
 * phải giả định — vault 172 §4c ghi ca thật: `sitemap.xml` trong build là THƯ MỤC
 * (file thật tên `sitemap.xml.body`), đọc nhầm tên làm luật tắt ÂM THẦM nhiều ngày
 * trong khi guard vẫn báo sạch.
 *
 * ⇒ Coi "không đọc được sitemap" LÀ MỘT VI PHẠM có tên, để nó chặn merge như mọi vi
 * phạm khác. Thà đỏ CI vì guard hỏng, còn hơn xanh CI vì guard đã thôi kiểm.
 *
 * @param {Set<string>|null} sitemapUrls
 */
export function checkSitemapReadable(sitemapUrls) {
  if (sitemapUrls) return [];
  return [
    {
      url: '(toàn build)',
      rule: 'guard-sitemap-unreadable',
      detail:
        'KHÔNG đọc được sitemap trong thư mục build ⇒ 2 luật đã bị bỏ: ' +
        '`canonical-ceded-in-sitemap` và `orphan-page`. Guard không được báo sạch khi ' +
        'đang thiếu luật. Kiểm: build có sinh `sitemap.xml.body` không (LƯU Ý `sitemap.xml` ' +
        'là THƯ MỤC, không phải file); nếu Next đổi tên đầu ra thì thêm tên mới vào danh ' +
        'sách thử trong `main()`',
    },
  ];
}

export function checkOrphanPages(pages, duocTro, sitemapUrls) {
  if (!sitemapUrls) return [];
  const out = [];
  for (const p of pages) {
    if (p.noindex || p.url === '/') continue;
    if (duocTro.has(p.url) || sitemapUrls.has(p.url)) continue;
    out.push({
      url: p.url,
      rule: 'orphan-page',
      detail:
        'KHÔNG có liên kết nội bộ nào trỏ tới VÀ cũng không nằm trong sitemap — ' +
        'Google không có đường nào tìm ra trang này; thêm link từ trang hub liên quan, ' +
        'đưa vào sitemap, hoặc cho noindex nếu là trang phụ',
    });
  }
  return out;
}

/**
 * Node JSON-LD có khai `url`/`@id` trỏ ĐÚNG trang đang đứng không?
 *
 * VÌ SAO CẦN — đây là HẬU QUẢ THẬT của lỗi lớn nhất đợt SEO 25/07: schema của
 * trang cha đặt trong `layout.tsx` rớt xuống ~174 route con, nên mỗi trang con
 * có một node `WebPage` khai `url` là URL của trang CHA. Google đọc "trang này
 * chính là trang kia" trên 174 URL khác nhau.
 *
 * `layout-schema.guard.test.ts` bắt NGUYÊN NHÂN (schema nằm trong layout có
 * route con). Luật này bắt HẬU QUẢ — kể cả khi ai đó gõ tay sai `url` ngay
 * trong `page.tsx`, nơi guard kia không soi tới.
 *
 * Breadcrumb: mục CUỐI phải là chính trang đang đứng. Breadcrumb rò từ layout
 * xuống con luôn kết thúc ở trang cha — đo 1.113 trang thì 100% breadcrumb đều
 * kết ở chính trang đó, nên quy ước này chắc chắn, không sinh báo động sai.
 *
 * Đo 2026-07-25: 0 vi phạm. Thêm luật lúc bằng 0 nên không chặn việc của ai.
 *
 * @param {string} url URL của chính trang (đã chuẩn hoá)
 * @param {any[]} nodes các node JSON-LD đã phẳng hoá
 * @param {boolean} noindex trang noindex thì bỏ qua — không có tín hiệu nào để mất
 */
export function checkNodeUrls(url, nodes, noindex) {
  const out = [];
  if (noindex) return out;
  for (const n of nodes) {
    const t = Array.isArray(n['@type']) ? n['@type'][0] : n['@type'];
    if (t === 'WebPage' || t === 'Article' || t === 'TechArticle' || t === 'BlogPosting') {
      const claimed = normalizeUrl(n.url) ?? normalizeUrl(n['@id']);
      if (claimed && claimed !== url) {
        out.push({
          rule: 'jsonld-url-mismatch',
          detail: `node ${t} khai url "${claimed}" trong khi trang là "${url}" — Google đọc thành "trang này chính là trang kia"`,
        });
      }
    } else if (t === 'BreadcrumbList') {
      const items = n.itemListElement;
      if (Array.isArray(items) && items.length > 0) {
        const it = items[items.length - 1]?.item;
        const claimed = normalizeUrl(typeof it === 'string' ? it : it?.['@id']);
        if (claimed && claimed !== url) {
          out.push({
            rule: 'jsonld-url-mismatch',
            detail: `breadcrumb kết ở "${claimed}" chứ không phải trang hiện tại "${url}" — dấu hiệu schema của trang khác rớt vào đây`,
          });
        }
      }
    }
  }
  return out;
}

/**
 * Hai trang KHÁC nhau dùng CHUNG một `<title>` (hoặc chung một mô tả).
 *
 * VÌ SAO CẦN: `checkPage` đã canh ĐỘ DÀI title/description, nhưng chưa ai canh
 * tính DUY NHẤT. Với site sinh trang từ khuôn mẫu (145 cặp tuổi, 79 lá bài, 65
 * quẻ…), chỉ cần sửa mẫu tiêu đề mà bỏ sót phần biến là CẢ CỤM dùng chung một
 * tiêu đề — Google không phân biệt được trang nào với trang nào, các trang tự
 * cạnh tranh nhau, và Search Console báo "Duplicate title tags". Trang vẫn
 * chạy, không có lỗi nào hiện ra ở đâu.
 *
 * Đo 2026-07-26 (1.074 trang cho-index): 0 tiêu đề trùng, 0 mô tả trùng. Thêm
 * luật lúc bằng 0 nên không chặn việc của ai.
 *
 * Báo theo NHÓM chứ không theo từng trang: một mẫu hỏng sinh 145 trang trùng,
 * in 145 dòng thì không ai đọc. Mỗi nhóm một dòng, kèm số trang và vài ví dụ.
 *
 * @param {{url: string, title: string|null, description: string|null, noindex: boolean}[]} pages
 */
export function checkDuplicateMeta(pages) {
  const out = [];
  const byTitle = new Map();
  const byDesc = new Map();
  for (const p of pages) {
    if (p.noindex) continue;
    if (p.title) {
      if (!byTitle.has(p.title)) byTitle.set(p.title, []);
      byTitle.get(p.title).push(p.url);
    }
    if (p.description) {
      if (!byDesc.has(p.description)) byDesc.set(p.description, []);
      byDesc.get(p.description).push(p.url);
    }
  }
  const report = (map, rule, what) => {
    for (const [value, urls] of map) {
      if (urls.length < 2) continue;
      const sorted = [...urls].sort();
      out.push({
        url: sorted[0],
        rule,
        detail:
          `${urls.length} trang dùng chung ${what} "${value.slice(0, 60)}" — ` +
          `Google không phân biệt được các trang này, chúng tự cạnh tranh nhau. ` +
          `Ví dụ: ${sorted.slice(0, 3).join(' · ')}`,
      });
    }
  };
  report(byTitle, 'duplicate-title', 'tiêu đề');
  report(byDesc, 'duplicate-description', 'mô tả');
  return out;
}

/**
 * Ngày trong JSON-LD có hợp lệ không.
 *
 * VÌ SAO CẦN: `dateModified`/`datePublished` là tín hiệu độ mới của nội dung.
 * Sai ở đây KHÔNG làm hỏng trang, không lỗi build — chỉ trình kiểm tra dữ liệu
 * có cấu trúc của Google mới báo, mà phải có người mở nó ra kiểm.
 *
 * Ca thật đã bắt được (2026-07-26): `/methodology/tu-vi` khai `dateModified`
 * 2026-05-21 trong khi `datePublished` là 2026-05-22 — "sửa TRƯỚC khi đăng".
 * Do một hằng số tên `TODAY_ISO` bị đặt lệch 1 ngày so với ngày file thật sự
 * được tạo. Không ai phát hiện suốt 2 tháng.
 *
 * Chỉ bắt cái SAI CHẮC CHẮN, không phán xét chuyện ngày cũ: một trang nội dung
 * không đổi thì `dateModified` đứng yên là ĐÚNG, không phải lỗi.
 *
 * @param {string} url
 * @param {any[]} nodes node JSON-LD đã phẳng hoá
 * @param {Date} now mốc "hôm nay" — truyền vào để test khoá được hành vi
 */
export function checkDates(url, nodes, now = new Date()) {
  const out = [];
  const parse = (v) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(v ?? ''));
    return m ? new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00Z`) : null;
  };
  const today = new Date(`${now.toISOString().slice(0, 10)}T00:00:00Z`);
  for (const n of nodes) {
    const pub = n.datePublished;
    const mod = n.dateModified;
    if (pub === undefined && mod === undefined) continue;
    for (const [key, raw] of [['datePublished', pub], ['dateModified', mod]]) {
      if (raw === undefined) continue;
      const d = parse(raw);
      if (!d) {
        out.push({ rule: 'date-invalid', detail: `${key} "${raw}" không phải ngày ISO (YYYY-MM-DD)` });
        continue;
      }
      if (d > today) {
        out.push({
          rule: 'date-invalid',
          detail: `${key} "${raw}" nằm ở TƯƠNG LAI — Google coi là sai, nội dung chưa tồn tại mà đã khai ngày`,
        });
      }
    }
    const p = parse(pub);
    const m2 = parse(mod);
    if (p && m2 && m2 < p) {
      out.push({
        rule: 'date-invalid',
        detail: `dateModified "${mod}" SỚM HƠN datePublished "${pub}" — sửa trước khi đăng là vô lý`,
      });
    }
  }
  return out.map((v) => ({ url, ...v }));
}

/**
 * Khoá miễn trừ khớp URL không? Hỗ trợ 2 dạng:
 *   "/khai-truong"        → khớp đúng URL đó
 *   "/tarot/y-nghia/*"    → khớp mọi URL trong cụm (dùng cho route template)
 */
export function matchesPattern(pattern, url) {
  if (pattern.endsWith('/*')) return url.startsWith(pattern.slice(0, -1));
  return pattern === url;
}

/**
 * Lọc vi phạm qua danh sách miễn trừ.
 * @param {{url: string, rule: string, detail: string}[]} violations
 * @param {Record<string, {rules: string[], owner: string, note: string}>} allowlist
 */
export function applyAllowlist(violations, allowlist) {
  const blocking = [];
  const allowed = [];
  /** pattern::rule → số trang đã miễn trừ. Dùng cho cả `stale` lẫn `max`. */
  const count = new Map();

  for (const v of violations) {
    let hit = null;
    for (const [pattern, entry] of Object.entries(allowlist)) {
      if (entry.rules.includes(v.rule) && matchesPattern(pattern, v.url)) {
        hit = pattern;
        break;
      }
    }
    if (hit) {
      allowed.push(v);
      const k = `${hit}::${v.rule}`;
      count.set(k, (count.get(k) ?? 0) + 1);
    } else {
      blocking.push(v);
    }
  }

  // ── Chặn mẫu `/*` che quá rộng ──────────────────────────────────
  // Một mẫu tiền tố miễn trừ theo CỤM, nên nó cũng che luôn những trang trong
  // cụm mà lẽ ra phải bị canh. Ví dụ thật: `/tu-vi-thang/*` miễn `jsonld-missing`
  // cho 78 trang tháng ĐÃ HẾT — nhưng nó che luôn 79 trang tháng ĐANG SỐNG, nên
  // nếu cụm đó mất sạch JSON-LD thì guard vẫn im. Và `stale` cũng không cứu
  // được: mẫu vẫn "đang được dùng" bởi 78 trang kia.
  //
  // `max` là số trang mẫu này ĐƯỢC PHÉP miễn. Vượt lên = có trang mới hỏng.
  for (const [pattern, entry] of Object.entries(allowlist)) {
    if (typeof entry.max !== 'number') continue;
    for (const rule of entry.rules) {
      const n = count.get(`${pattern}::${rule}`) ?? 0;
      if (n > entry.max) {
        blocking.push({
          url: pattern,
          rule: 'allowlist-overflow',
          detail: `mẫu này chỉ được miễn ${entry.max} trang cho luật "${rule}", đang miễn ${n} — có ${n - entry.max} trang MỚI hỏng đang bị mẫu che mất`,
        });
      }
    }
  }

  // Mục miễn trừ nào không còn vi phạm nữa = đã có người sửa → phải xoá, kẻo nó
  // âm thầm tắt kiểm tra cho trang đó và lần hỏng sau không ai bắt được. Cùng
  // đúng một họ với `guard-sitemap-unreadable`: luật tắt mà CI vẫn xanh.
  //
  // Trước đây chỉ IN RA nhắc, không chặn — mà nhắc suông thì không ai xoá.
  //
  // ⚠️ CHỈ CHẶN mục khoá ĐÚNG MỘT URL. Mục theo cụm (`/*`, hoặc có `max`) giữ
  // nguyên mức nhắc, CÓ CHỦ Ý: tập trang chúng che THAY ĐỔI THEO THỜI GIAN —
  // `/tu-vi-thang/*` tự ghi trong `note` là "danh sách này đổi theo từng tháng".
  // Chặn cứng loại đó = tự cài bom hẹn giờ, sang tháng CI đỏ cho người không
  // liên quan, đúng loại lỗi repo này đã dính (mục 4o + 4q note 172). Chúng đã
  // có `max` làm chốt riêng, đó mới là cơ chế đúng cho mẫu theo cụm.
  //
  // Mục khoá một URL thì ngược lại: chỉ hết vi phạm khi CÓ NGƯỜI sửa/xoá trang
  // đó — tức luôn có người đang làm, và việc dọn là xoá đúng một dòng.
  const stale = [];
  for (const [pattern, entry] of Object.entries(allowlist)) {
    const theoCum = pattern.endsWith('/*') || typeof entry.max === 'number';
    for (const rule of entry.rules) {
      if (count.has(`${pattern}::${rule}`)) continue;
      stale.push({ url: pattern, rule, theoCum });
      if (theoCum) continue;
      blocking.push({
        url: pattern,
        rule: 'allowlist-stale',
        detail:
          `mục miễn trừ này KHÔNG còn che vi phạm nào cho luật "${rule}" — trang đã được sửa. ` +
          `Để lại thì nó âm thầm tắt luật đó cho trang này, lần hỏng sau không ai bắt được. ` +
          `Cách sửa: xoá luật "${rule}" khỏi mục "${pattern}" trong ALLOWLIST (chủ: ${entry.owner})`,
      });
    }
  }
  return { blocking, allowed, stale };
}

// ── Dữ liệu có cấu trúc (JSON-LD) ───────────────────────────────────
// Đây là thứ quyết định Google có hiện FAQ / đường dẫn phân cấp ngay trong kết
// quả tìm kiếm hay không — tức chiếm chỗ trên SERP, ảnh hưởng thẳng tới tỉ lệ
// bấm vào. Sai một chỗ là mất sạch mà KHÔNG có cảnh báo nào.
//
// Lỗi loại này đã từng xảy ra ở repo: #936 phải gộp Organization + WebSite bị
// khai trùng ở trang chủ (Google thấy hai Organization mâu thuẫn nhau).
//
// Thêm luật vào ĐÚNG LÚC số vi phạm đang bằng 0 (đo 2026-07-25: 1.113 trang,
// 0 lỗi cú pháp, 0 khối trùng, 0 FAQ hỏng, 0 breadcrumb hỏng) — nên nó không
// chặn việc của ai, chỉ giữ nguyên trạng thái tốt sẵn có.

/** Các @type chỉ được xuất hiện MỘT lần trên một trang. */
const SINGLETON_TYPES = ['WebPage', 'BreadcrumbList', 'Organization', 'WebSite', 'FAQPage', 'Article'];

/** Gom mọi node JSON-LD trong HTML. Trả về {nodes, invalid}. */
export function parseJsonLd(html) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(
    (m) => m[1],
  );
  const nodes = [];
  let invalid = 0;
  for (const b of blocks) {
    let parsed = null;
    // Nội dung trong <script type="application/ld+json"> là JSON THÔ, không phải
    // HTML đã escape → thử parse nguyên bản TRƯỚC, chỉ giải mã thực thể khi thất
    // bại (phòng framework có escape). Làm ngược lại thì một chuỗi chứa đúng chữ
    // "&amp;" trong nội dung sẽ bị đổi thành "&".
    for (const candidate of [b, decodeEntities(b)]) {
      try {
        parsed = JSON.parse(candidate);
        break;
      } catch {
        /* thử cách còn lại */
      }
    }
    if (parsed === null) {
      invalid++;
      continue;
    }
    const arr = Array.isArray(parsed) ? parsed : (parsed['@graph'] ?? [parsed]);
    for (const n of arr) if (n && n['@type']) nodes.push(n);
  }
  return { nodes, invalid, blockCount: blocks.length };
}

/**
 * Kiểm dữ liệu có cấu trúc của một trang.
 * @param {{nodes: any[], invalid: number, blockCount: number}} ld
 */
export function checkJsonLd(ld) {
  const out = [];
  if (ld.invalid > 0) {
    out.push({ rule: 'jsonld-invalid', detail: `${ld.invalid} khối JSON-LD không parse được` });
  }
  if (ld.blockCount === 0) {
    out.push({ rule: 'jsonld-missing', detail: 'trang không có khối JSON-LD nào' });
    return out;
  }

  const typeOf = (n) => (Array.isArray(n['@type']) ? n['@type'].join('+') : n['@type']);
  const counts = new Map();
  for (const n of ld.nodes) counts.set(typeOf(n), (counts.get(typeOf(n)) || 0) + 1);
  for (const t of SINGLETON_TYPES) {
    const c = counts.get(t) ?? 0;
    if (c > 1) {
      out.push({
        rule: 'jsonld-duplicate-type',
        detail: `${c} khối "${t}" trên cùng một trang — Google thấy hai thực thể mâu thuẫn`,
      });
    }
  }

  for (const n of ld.nodes) {
    const t = typeOf(n);
    if (t === 'FAQPage') {
      const me = n.mainEntity;
      if (!Array.isArray(me) || me.length === 0) {
        out.push({ rule: 'jsonld-faq-broken', detail: 'FAQPage có mainEntity rỗng' });
      } else if (me.some((q) => !q?.name || !q?.acceptedAnswer?.text)) {
        out.push({
          rule: 'jsonld-faq-broken',
          detail: 'FAQPage có câu hỏi thiếu name hoặc acceptedAnswer.text',
        });
      }
    }
    if (t === 'BreadcrumbList') {
      const items = n.itemListElement;
      if (!Array.isArray(items) || items.length === 0) {
        out.push({ rule: 'jsonld-breadcrumb-broken', detail: 'BreadcrumbList rỗng' });
      } else if (!items.every((it, i) => it?.position === i + 1)) {
        out.push({
          rule: 'jsonld-breadcrumb-broken',
          detail: `position phải chạy 1..n, đang là ${items.map((i) => i?.position).join(',')}`,
        });
      } else if (items.some((it) => !it?.name || !it?.item)) {
        out.push({ rule: 'jsonld-breadcrumb-broken', detail: 'mục breadcrumb thiếu name hoặc item' });
      }
    }
  }
  return out;
}

/** Rút <title> / meta description từ HTML. */
export function extractMeta(html) {
  const t = /<title>([^<]*)<\/title>/.exec(html);
  const d = /<meta name="description" content="([^"]*)"/.exec(html);
  const robots = /<meta name="robots" content="([^"]*)"/.exec(html);
  const canon = /<link rel="canonical" href="([^"]*)"/.exec(html);
  const h1Count = (html.match(/<h1[\s>]/g) || []).length;
  const noindex = robots !== null && robots[1].includes('noindex');
  return {
    title: t ? decodeEntities(t[1]) : null,
    description: d ? decodeEntities(d[1]) : null,
    h1Count,
    noindex,
    canonical: canon ? canon[1] : null,
  };
}

// ── Danh sách miễn trừ ──────────────────────────────────────────────
// Đây KHÔNG phải chỗ giấu lỗi — nó là HÀNG CHỜ CÓ CHỦ. Mỗi mục ghi rõ ai lo và
// vì sao chưa sửa. Sửa xong thì XOÁ mục đó đi (guard sẽ nhắc nếu quên).
// Nguồn: vault 172 §4e.
//
// ⚠️ Danh sách này ứng với trạng thái SAU KHI #940, #944, #949 gộp. Nếu guard
// vào main trước ba PR đó thì nó sẽ báo đỏ đúng những trang ba PR kia đang sửa
// — đó là hành vi đúng, không phải lỗi guard. Guard nên gộp SAU CÙNG.
export const ALLOWLIST = {
  // Cụm /learn ĐÃ XOÁ khỏi đây (không phải bỏ quên): 5 mô tả vượt ngưỡng đã rút
  // xuống ≤160 và 12 trang /learn/tu-vi/[cung] đã thay cắt-cứng bằng câu hỏi
  // riêng của từng cung. Từ giờ guard canh cụm /learn như mọi cụm khác — thêm
  // trang mới mà mô tả quá dài là CI đỏ ngay, đúng ý đồ.
  // 2026-07-26 — ĐÃ XOÁ (không phải bỏ quên) nợ cuối của cụm "Bản mệnh +
  // Phong thuỷ": `/huong-ban-lam-viec` (tiêu đề 62→53, mô tả 176→144) và
  // `/khai-truong` (tiêu đề 63→58, mô tả thôi clamp — viết ngắn thẳng 156).
  //
  // Cũng đã gỡ luật `title-too-long` khỏi 5 trang dùng TIÊU ĐỀ MẶC ĐỊNH: chuỗi
  // mặc định trong `app/layout.tsx` dài đúng 61 ký tự nên tự nó vượt ngưỡng;
  // rút xuống 60 là hết cả 5 trang cùng lúc. Các mục còn giữ ở đây chỉ vì lý do
  // KHÁC (thiếu JSON-LD ở luồng riêng tư), không phải vì tiêu đề.
  //
  // ⚠️ Câu hỏi CHƯA ai trả lời, để nguyên đây cho lần sau: /auth/callback,
  // /connect-telegram, /dashboard là luồng riêng tư — có nên cho Google lập chỉ
  // mục không? Nếu KHÔNG thì đặt noindex, và mấy mục dưới đây biến mất luôn.
  '/onboarding-wizard': {
    rules: ['jsonld-missing'],
    owner: 'agent SEO sweep (app/layout.tsx)',
    note: 'luồng riêng tư nên không cần JSON-LD',
  },

  // ── Không có JSON-LD, và ĐÚNG là không cần ────────────────────────
  // Đo 2026-07-25: 85 trang không có JSON-LD, và 0 trong số đó là trang công
  // khai có trong sitemap. Toàn bộ là hai nhóm dưới đây.
  '/tu-vi-thang/*': {
    rules: ['jsonld-missing', 'h1-missing', 'orphan-page'],
    max: 78,
    owner: 'Agent-1 (đúng thiết kế, không phải lỗi)',
    note: 'Các tháng ĐÃ HẾT chỉ được dựng để 308 về evergreen, không render nội dung nên không có JSON-LD. Danh sách này đổi theo từng tháng nên dùng tiền tố thay vì liệt kê tay. Tháng đang mở VẪN có đủ JSON-LD nên luật vẫn canh được chúng. `orphan-page`: chặng 308 thì đương nhiên không có link nội bộ và không nằm trong sitemap — đúng thiết kế. `max: 78` giữ nguyên vai trò chốt chặn: thêm tháng nào vượt số đó là có trang thật bị lọt vào đây.',
  },
  '/affiliate/leaderboard': { rules: ['jsonld-missing'], owner: 'n/a', note: 'trang riêng tư, không nằm trong sitemap' },
  '/affiliate/network': { rules: ['jsonld-missing'], owner: 'n/a', note: 'trang riêng tư, không nằm trong sitemap' },
  '/checkout/premium': { rules: ['jsonld-missing'], owner: 'n/a', note: 'luồng thanh toán, không index' },
  '/dashboard': {
    rules: ['jsonld-missing', 'h1-missing', 'orphan-page'],
    owner: 'agent SEO sweep (app/layout.tsx)',
    note: 'dùng tiêu đề mặc định; đã chặn ở robots.txt. `orphan-page`: đây là chặng 308 CỐ Ý giữ cho bookmark/link cũ (xem chú thích trong app/dashboard/page.tsx) — mọi nơi trong site đã trỏ thẳng /account, nên KHÔNG có link nội bộ là đúng thiết kế, không phải thiếu sót.',
  },
  '/reading/new': { rules: ['jsonld-missing'], owner: 'n/a', note: 'luồng nhập liệu riêng tư' },
  '/settings': { rules: ['jsonld-missing'], owner: 'n/a', note: 'trang riêng tư' },
};

// ── CLI ─────────────────────────────────────────────────────────────

function collectHtml(dir) {
  const out = [];
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name.endsWith('.html')) out.push(p);
    }
  };
  walk(dir);
  return out;
}

function main() {
  // Neo vào vị trí của chính file này, KHÔNG theo thư mục đang chạy — để
  // `pnpm --filter web seo-guard` (cwd = apps/web) và `node apps/web/scripts/
  // seo-guard.mjs` (cwd = gốc repo) đều ra cùng một đường dẫn.
  const here = dirname(fileURLToPath(import.meta.url));
  const appDir = argv[2] ?? resolve(here, '..', '.next', 'server', 'app');

  let files;
  try {
    files = collectHtml(appDir);
  } catch {
    console.error(`seo-guard: không đọc được "${appDir}".`);
    console.error('Chạy `pnpm --filter web build` trước rồi mới chạy guard.');
    console.error('LƯU Ý: `next dev` XOÁ kết quả của `next build` trong .next/.');
    exit(2);
  }

  // Chốt kiểm tra — bài học vault 172 §6: một script phân tích đọc 0 file mà
  // vẫn chạy trót lọt sẽ báo "không có vấn đề gì", y hệt như khi site thật sự
  // sạch. Thà dừng lại còn hơn báo xanh giả.
  if (files.length < MIN_PAGES) {
    console.error(
      `seo-guard: chỉ thấy ${files.length} trang HTML (cần tối thiểu ${MIN_PAGES}).`,
    );
    console.error('Build hỏng hoặc .next đã bị xoá — DỪNG, không kết luận gì.');
    exit(2);
  }

  const violations = [];
  const canonPages = [];
  const metaPages = [];
  /** Mọi URL nội bộ được ít nhất một trang trỏ tới — để tìm trang mồ côi. */
  const duocTro = new Set();
  // Sitemap: `next build` render nội dung ra `sitemap.xml.body` — còn
  // `sitemap.xml` là THƯ MỤC (chứa route.js). Đọc đúng cái tên `.xml` sẽ luôn
  // ném lỗi và luật cần sitemap bị tắt ÂM THẦM. Thử `.body` trước.
  let sitemapUrls = null;
  for (const name of ['sitemap.xml.body', 'sitemap.xml']) {
    try {
      const sm = readFileSync(join(appDir, name), 'utf8');
      sitemapUrls = new Set([...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => normalizeUrl(m[1])));
      break;
    } catch {
      // thử tên tiếp theo
    }
  }
  // Bỏ luật thì phải CHẶN, không phải nhắc suông. Trước đây chỗ này chỉ
  // `console.warn` rồi vẫn thoát 0 → guard tự vô hiệu mà CI vẫn xanh (vault 172
  // §4c: ca thật, tắt luật âm thầm nhiều ngày). Nay nó là vi phạm có tên.
  for (const v of checkSitemapReadable(sitemapUrls)) violations.push(v);

  for (const f of files) {
    const rel = relative(appDir, f).split(sep).join('/').replace(/\.html$/, '');
    const url = rel === 'index' ? '/' : `/${rel}`;
    const html = readFileSync(f, 'utf8');
    const { title, description, h1Count, noindex, canonical } = extractMeta(html);
    for (const v of checkPage({ url, title, description, h1Count, noindex })) {
      violations.push({ url, ...v });
    }
    const jsonld = parseJsonLd(html);
    for (const v of checkJsonLd(jsonld)) violations.push({ url, ...v });
    for (const v of checkNodeUrls(url, jsonld.nodes, noindex)) violations.push({ url, ...v });
    for (const v of checkDates(url, jsonld.nodes)) violations.push(v);
    canonPages.push({ url, canonical, noindex });
    metaPages.push({ url, title, description, noindex });

    // Rút href để dựng đồ thị liên kết nội bộ. PHẢI rút đầy đủ: cả nháy đơn lẫn
    // nháy kép, và CẮT `#`/`?` chứ đừng loại cả href — bỏ sót một href ở đây là
    // sinh báo động giả "trang mồ côi" (xem ghi chú dài ở `checkOrphanPages`).
    // CHỈ lấy href của thẻ <a>. Bản đầu lấy MỌI `href=` và luật hoá ra không bao
    // giờ đỏ được — vì `<link rel="canonical" href="…">` của chính trang cũng là
    // một `href`, nên mọi trang đều tự "được trỏ tới". Một chốt không thể đỏ còn
    // tệ hơn không có chốt: nó tạo cảm giác an toàn giả. Kiểm đột biến mới lộ ra.
    for (const m of html.matchAll(/<a\s[^>]*?href=(?:"([^"]*)"|'([^']*)')/g)) {
      const tho = (m[1] !== undefined ? m[1] : m[2]).trim();
      // Dùng lại `normalizeUrl` của chính file này — nó đã bỏ gốc site, cắt
      // `?`/`#` và đuôi `/`. Viết lại phép chuẩn hoá thứ hai là mở đường cho hai
      // cách hiểu URL lệch nhau ngay trong một công cụ.
      const h = normalizeUrl(tho);
      // Bỏ qua link TỰ TRỎ (breadcrumb/nav có thể trỏ về chính trang đang đứng):
      // "có link nội bộ" phải nghĩa là có trang KHÁC trỏ tới.
      if (h && h.startsWith('/') && h !== url) duocTro.add(h);
    }
  }

  // Chốt kiểm: rút được quá ít href thì mọi trang sẽ trông như mồ côi. Một phép
  // đo im lặng trả về "tất cả đều hỏng" trông y hệt một phép đo hỏng.
  if (duocTro.size < 200) {
    console.warn(
      `seo-guard: canh bao — chi rut duoc ${duocTro.size} dich lien ket, BO luat "orphan-page" (nghi phep do hong). Cac luat khac van chay.`,
    );
  } else {
    for (const v of checkOrphanPages(canonPages, duocTro, sitemapUrls)) violations.push(v);
  }

  for (const v of checkCanonicalGraph(canonPages, sitemapUrls)) violations.push(v);
  for (const v of checkDuplicateMeta(metaPages)) violations.push(v);

  const { blocking, allowed, stale } = applyAllowlist(violations, ALLOWLIST);

  console.log(`seo-guard: đã kiểm ${files.length} trang tĩnh.`);
  console.log(
    `  luật: tiêu đề ≤${TITLE_MAX} · mô tả ≤${DESCRIPTION_MAX} · clamp không được cắt · đúng 1 <h1> (trang cho-index) · canonical không trỏ vào hư không/vòng tròn/sitemap · JSON-LD hợp lệ, url khai đúng trang, không trùng loại, title/mô tả không trùng giữa các trang, ngày hợp lệ, FAQ/breadcrumb đủ trường`,
  );
  console.log(`  vi phạm mới: ${blocking.length} · miễn trừ (có chủ): ${allowed.length}`);

  // Mục khoá MỘT URL đã hết vi phạm giờ nằm trong `blocking` (luật
  // `allowlist-stale`) nên được in ở phần vi phạm bên dưới — không in lại ở đây
  // kẻo tưởng có hai chuyện khác nhau. Chỗ này chỉ còn nhắc mục THEO CỤM, loại
  // cố ý không chặn vì tập trang chúng che đổi theo thời gian.
  const staleTheoCum = stale.filter((s) => s.theoCum);
  if (staleTheoCum.length) {
    console.log('');
    console.log(`⚠️  ${staleTheoCum.length} mục miễn trừ THEO CỤM đã hết vi phạm — nên xoá khỏi ALLOWLIST:`);
    for (const s of staleTheoCum) console.log(`     ${s.url}  [${s.rule}]`);
    console.log('     (chỉ nhắc, KHÔNG chặn: tập trang mẫu này che đổi theo thời gian —');
    console.log('      chặn cứng sẽ thành bom hẹn giờ. Chốt chặn của chúng là `max`.)');
  }

  if (!blocking.length) {
    console.log('\n✅ Không có vi phạm mới.');
    exit(0);
  }

  console.log('');
  console.log(`❌ ${blocking.length} vi phạm SEO mới:\n`);
  const byUrl = new Map();
  for (const v of blocking) {
    if (!byUrl.has(v.url)) byUrl.set(v.url, []);
    byUrl.get(v.url).push(v);
  }
  for (const [url, vs] of byUrl) {
    console.log(`  ${url}`);
    for (const v of vs) console.log(`     [${v.rule}] ${v.detail}`);
  }
  console.log('');
  console.log('Cách sửa (vault 172 §2, §3):');
  console.log('  · tiêu đề dài: dùng `title: { absolute: … }` để chặn hậu tố');
  console.log('    " · hieu.asia" (12 ký tự) mà root layout tự nối vào — thường');
  console.log('    không cần cắt chữ nào.');
  console.log('  · mô tả dài / bị clamp cắt: dồn từ khoá lên ĐẦU và chọn trường');
  console.log('    NGẮN cho phần biến, đừng nhét cả đoạn bách khoa vào.');
  console.log('  · nếu trang thuộc cụm agent khác: thêm vào ALLOWLIST kèm chủ + lý do.');
  exit(1);
}

if (import.meta.url === pathToFileURL(argv[1] ?? '').href) main();
