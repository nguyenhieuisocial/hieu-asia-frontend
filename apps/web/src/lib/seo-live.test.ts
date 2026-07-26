// Lưới an toàn cho `scripts/seo-live.mjs` — cùng tinh thần với seo-guard.test.ts.
//
// Bản nháp đầu của script này có 6 lỗi "im lặng báo xanh": sitemap con trả lỗi
// mà vẫn tính là 0 URL; không có sàn số trang; sàn tổng không bắt được mất cả
// một cụm; truyền `-- <url>` khác vẫn đo production; sitemap trộn URL thường +
// `.xml` thì nhánh thường bị vứt sạch; theo chuyển hướng nên 978 URL trỏ về
// trang chủ vẫn "đạt 978".
// Cả 6 đều là loại một chốt canh KHÔNG BAO GIỜ ĐỎ — tệ hơn không có chốt.
// Test dưới đây khoá cả hai chiều: bắt đúng cái xấu, không bắt nhầm cái tốt.
//
// ⚠️ Mọi hàm được khoá ở đây PHẢI là hàm được `main()` thật sự gọi. Vòng review
// trước bắt được đúng lỗi ngược lại: 3/4 bản vá nặng nằm trong hàm không
// `export`, không test nào chạm tới, mà header file này lại khẳng định "đã
// khoá cả 4". Nay `gopSitemap`, `kiemSanSitemap`, `phanLoaiPhanHoi` đều đã
// export và đều nằm trên đường chạy thật.
import { describe, it, expect } from 'vitest';

import {
  CUM_TOI_THIEU,
  MIN_TRANG,
  NGUNG_SOM_SAU,
  NGUONG_CUM_LON,
  SONG_SONG,
  bocLoc,
  bocSitemap,
  boSvg,
  canhBaoCumMoi,
  chiaLuong,
  docMoTa,
  docTieuDe,
  doHongDongLoat,
  ghiLoiHaTang,
  giaiMa,
  gomCum,
  gopSitemap,
  kiemMotTrang,
  kiemSanSitemap,
  phanLoaiPhanHoi,
  trangThaiMoi,
  veGoc,
} from '../../scripts/seo-live.mjs';
import { TITLE_MAX, DESCRIPTION_MAX } from '../../scripts/seo-guard.mjs';

const trang = (head: string, body = '') => `<html><head>${head}</head><body>${body}</body></html>`;
const tieuDeDai = 'x'.repeat(TITLE_MAX + 1);
const moTaDai = 'y'.repeat(DESCRIPTION_MAX + 1);

describe('giaiMa', () => {
  it('giải &amp; SAU CÙNG, nếu không "&amp;lt;" ra sai', () => {
    expect(giaiMa('&amp;lt;')).toBe('&lt;');
    expect(giaiMa('a &amp; b')).toBe('a & b');
    expect(giaiMa('&quot;x&quot; &#39;y&#x27;')).toBe('"x" \'y\'');
  });

  it('không đụng tới entity lạ (đo dài hơn thực tế = lệch về phía an toàn)', () => {
    expect(giaiMa('a&nbsp;b')).toBe('a&nbsp;b');
  });
});

describe('veGoc — đổi URL sitemap về đúng gốc đang đo', () => {
  it('giữ đường dẫn + query, đổi tên miền', () => {
    expect(veGoc('https://hieu.asia/mbti', 'http://localhost:3000')).toBe(
      'http://localhost:3000/mbti',
    );
    expect(veGoc('https://hieu.asia/a?b=1', 'https://preview.vercel.app')).toBe(
      'https://preview.vercel.app/a?b=1',
    );
  });

  it('gốc có dấu / thừa vẫn không sinh URL hai gạch', () => {
    expect(veGoc('https://hieu.asia/mbti', 'http://localhost:3000/')).toBe(
      'http://localhost:3000/mbti',
    );
  });

  it('trả null cho <loc> hỏng để nơi gọi báo ĐỎ, không bỏ im', () => {
    expect(veGoc('khong-phai-url', 'https://hieu.asia')).toBeNull();
    expect(veGoc('', 'https://hieu.asia')).toBeNull();
  });
});

describe('bocLoc', () => {
  it('lấy hết <loc>, cắt khoảng trắng', () => {
    expect(bocLoc('<url><loc> https://a/x </loc></url><url><loc>https://a/y</loc></url>')).toEqual([
      'https://a/x',
      'https://a/y',
    ]);
  });

  it('XML rỗng ra mảng rỗng — nơi gọi phải chặn bằng sàn', () => {
    expect(bocLoc('<urlset></urlset>')).toEqual([]);
  });
});

// ─────────── sàn chống sitemap teo (bản trước chỉ có 1 con số tổng) ───────────

/** Dựng một sitemap "khoẻ": đủ mọi cụm ở mức gốc + độn cho qua sàn tổng. */
function sitemapKhoe() {
  const goc: Record<string, number> = {
    '/cung-hoang-dao': 92, '/hop-tuoi': 83, '/tarot': 81, '/tu-vi-thang': 79,
    '/ban-menh': 78, '/learn': 77, '/gieo-que': 66, '/tu-vi': 61, '/huong-nha': 37,
    '/xong-dat': 31, '/khai-truong': 31, '/xem-tuoi-lam-nha': 25, '/than-so-hoc': 19,
    '/xem-tuoi-cuoi': 17, '/gio-hoang-dao': 14, '/tu-vi-hom-nay': 13, '/tu-vi-2026': 13,
    '/tu-vi-2027': 13, '/sao-han': 13, '/tam-tai': 13, '/cam-nang': 11,
  };
  const ra: string[] = [];
  for (const [cum, n] of Object.entries(goc))
    for (let i = 0; i < n; i++) ra.push(`https://hieu.asia${cum}/t${i}`);
  while (ra.length < 978) ra.push(`https://hieu.asia/le-te-${ra.length}`);
  return ra;
}

describe('kiemSanSitemap', () => {
  it('sitemap đầy đủ → không lý do nào', () => {
    expect(kiemSanSitemap(sitemapKhoe())).toEqual([]);
  });

  it('MẤT TRỌN MỘT CỤM phải ĐỎ — sàn tổng một mình KHÔNG bắt được ca này', () => {
    const thieu = sitemapKhoe().filter((u) => !u.includes('/learn/'));
    // Bằng chứng sàn tổng vô dụng ở đây: 978 − 77 = 901, vẫn ≥ MIN_TRANG.
    expect(thieu.length).toBeGreaterThanOrEqual(MIN_TRANG);
    const ly = kiemSanSitemap(thieu);
    expect(ly.join(' ')).toContain('/learn');
  });

  it('cụm co lại quá 40% cũng ĐỎ', () => {
    const nua = sitemapKhoe().filter((u) => !/\/tarot\/t[5-9]\d?$/.test(u));
    expect(kiemSanSitemap(nua).join(' ')).toContain('/tarot');
  });

  it('sitemap rỗng ĐỎ vì cả sàn tổng lẫn mọi cụm', () => {
    expect(kiemSanSitemap([]).length).toBeGreaterThan(1);
  });

  it('mọi cụm trong CUM_TOI_THIEU phải là sàn dương và thấp hơn số gốc', () => {
    const dem = gomCum(sitemapKhoe());
    for (const [cum, moc] of Object.entries(CUM_TOI_THIEU)) {
      expect(moc, cum).toBeGreaterThan(0);
      expect(dem.get(cum), `${cum} không còn trong sitemap mẫu`).toBeGreaterThanOrEqual(moc);
    }
  });
});

describe('canhBaoCumMoi — chống CUM_TOI_THIEU bị mục', () => {
  it('cụm mới đủ lớn mà chưa có sàn thì phải được nhắc', () => {
    const urls = Array.from({ length: NGUONG_CUM_LON }, (_, i) => `https://hieu.asia/cum-moi/t${i}`);
    expect(canhBaoCumMoi(urls).join(' ')).toContain('/cum-moi');
  });

  it('cụm nhỏ chưa tới ngưỡng thì không làm ồn', () => {
    const urls = Array.from({ length: NGUONG_CUM_LON - 1 }, (_, i) => `https://hieu.asia/be/t${i}`);
    expect(canhBaoCumMoi(urls)).toEqual([]);
  });

  it('cụm đã có sàn thì không nhắc lại', () => {
    const urls = Array.from({ length: 50 }, (_, i) => `https://hieu.asia/learn/t${i}`);
    expect(canhBaoCumMoi(urls)).toEqual([]);
  });
});

describe('doHongDongLoat — hỏng đồng loạt là HẠ TẦNG, không phải nội dung', () => {
  const nhieu = (luat: string, n: number) =>
    Array.from({ length: n }, (_, i) => ({ duong: `/t${i}`, luat, chiTiet: '' }));

  it('bật chế độ bảo trì: mọi URL 307 → phải xếp là hạ tầng', () => {
    // Ca thật: middleware chuyển 307 về /maintenance. Bản trước ra exit 1 kèm
    // tin nhắn "Meta trên site thật đang sai" — chẩn đoán ngược hoàn toàn.
    expect(doHongDongLoat(nhieu('chuyển hướng 307', 978), 978)).toContain('978/978');
  });

  it('preview có Deployment Protection: mọi URL 401 → hạ tầng', () => {
    expect(doHongDongLoat(nhieu('HTTP 401', 900), 978)).toContain('HTTP 401');
  });

  it('lỗi SEO thật thì lẻ tẻ ⇒ KHÔNG được xếp thành hạ tầng', () => {
    // Đúng hình dạng đợt này: 6 vi phạm / 978 trang, nhiều loại khác nhau.
    const that = [
      ...nhieu('mô tả 267>160', 1),
      ...nhieu('mô tả 176>160', 1),
      ...nhieu('tiêu đề 69>60', 2),
      ...nhieu('mô tả 245>160', 2),
    ];
    expect(doHongDongLoat(that, 978)).toBeNull();
  });

  it('dưới ngưỡng tỷ lệ thì vẫn là lỗi nội dung', () => {
    expect(doHongDongLoat(nhieu('HTTP 404', 400), 978)).toBeNull();
    expect(doHongDongLoat(nhieu('HTTP 404', 489), 978)).toContain('HTTP 404');
  });

  it('không chia cho 0', () => {
    expect(doHongDongLoat([], 0)).toBeNull();
  });
});

describe('ghiLoiHaTang — ngưng sớm phải đếm LIÊN TIẾP', () => {
  it('lỗi rải rác có xen thành công thì KHÔNG ngưng', () => {
    // 2,6% lỗi rải rác (CDN rớt lẻ) là bình thường với ~1000 request. Bản trước
    // đếm tích luỹ nên ngắt ở URL ~300 và không bao giờ quét hết site nữa.
    const so = trangThaiMoi();
    for (let i = 0; i < NGUNG_SOM_SAU * 3; i++) {
      ghiLoiHaTang(so, { duong: `/t${i}`, luat: 'không tải được', chiTiet: '' });
      so.loiLienTiep = 0; // mô phỏng một request thành công xen vào
    }
    expect(so.dungSom).toBe(false);
    expect(so.loiHaTang.length).toBe(NGUNG_SOM_SAU * 3);
  });

  it('site chết: lỗi liên tiếp đủ ngưỡng thì ngưng', () => {
    const so = trangThaiMoi();
    for (let i = 0; i < NGUNG_SOM_SAU; i++)
      ghiLoiHaTang(so, { duong: `/t${i}`, luat: 'không tải được', chiTiet: '' });
    expect(so.dungSom).toBe(true);
  });

  it('chưa đủ ngưỡng thì chưa ngưng', () => {
    const so = trangThaiMoi();
    for (let i = 0; i < NGUNG_SOM_SAU - 1; i++)
      ghiLoiHaTang(so, { duong: `/t${i}`, luat: 'không tải được', chiTiet: '' });
    expect(so.dungSom).toBe(false);
  });
});

describe('phanLoaiPhanHoi', () => {
  it('200 → không sao', () => {
    expect(phanLoaiPhanHoi('/x', 200, null)).toBeNull();
  });

  it('CHUYỂN HƯỚNG phải ĐỎ — nếu theo redirect thì 978 URL trỏ về / vẫn "đạt 978"', () => {
    const v = phanLoaiPhanHoi('/x', 308, 'https://hieu.asia/');
    expect(v?.luat).toBe('chuyển hướng 308');
    expect(v?.duong).toBe('/x');
    expect(v?.chiTiet).toBe('https://hieu.asia/');
    expect(phanLoaiPhanHoi('/y', 301, '/z')?.luat).toBe('chuyển hướng 301');
  });

  it('4xx → trang chết trong sitemap', () => {
    expect(phanLoaiPhanHoi('/x', 404, null)?.luat).toBe('HTTP 404');
  });
});

describe('bocSitemap', () => {
  it('phản hồi hỏng phải NÉM — không được trả mảng rỗng rồi báo sạch', () => {
    expect(() => bocSitemap('https://hieu.asia/s1.xml', false, 404, '')).toThrow('HTTP 404');
    expect(() => bocSitemap('https://hieu.asia/s1.xml', false, 500, '')).toThrow('HTTP 500');
  });

  it('phản hồi tốt → bóc <loc>', () => {
    expect(bocSitemap('u', true, 200, '<loc>https://hieu.asia/a</loc>')).toEqual([
      'https://hieu.asia/a',
    ]);
  });
});

describe('gopSitemap', () => {
  const goc = 'https://hieu.asia';

  it('sitemap phẳng → đổi gốc + khử trùng lặp', async () => {
    const tai = async () => ['https://hieu.asia/a', 'https://hieu.asia/a', 'https://hieu.asia/b'];
    expect(await gopSitemap(goc, tai)).toEqual([`${goc}/a`, `${goc}/b`]);
  });

  it('sitemap con hỏng phải NÉM, không được lặng lẽ trả tập thiếu', async () => {
    const tai = async (u: string) => {
      if (u.endsWith('/sitemap.xml')) return ['https://hieu.asia/s1.xml'];
      throw new Error('HTTP 500');
    };
    await expect(gopSitemap(goc, tai)).rejects.toThrow('HTTP 500');
  });

  it('sitemap TRỘN: URL thường KHÔNG được bị vứt cùng nhánh .xml', async () => {
    const tai = async (u: string) =>
      u.endsWith('/sitemap.xml')
        ? ['https://hieu.asia/thuong', 'https://hieu.asia/s1.xml']
        : ['https://hieu.asia/trong-con'];
    expect(await gopSitemap(goc, tai)).toEqual([`${goc}/thuong`, `${goc}/trong-con`]);
  });

  it('<loc> rác phải NÉM chứ không bỏ im', async () => {
    const tai = async () => ['https://hieu.asia/a', 'khong-phai-url'];
    await expect(gopSitemap(goc, tai)).rejects.toThrow('không phải URL hợp lệ');
  });

  it('đổi đúng gốc khi đo môi trường khác', async () => {
    const tai = async () => ['https://hieu.asia/a?x=1'];
    expect(await gopSitemap('http://localhost:3000', tai)).toEqual(['http://localhost:3000/a?x=1']);
  });
});

describe('boSvg', () => {
  it('bỏ khối SVG, giữ nguyên phần còn lại', () => {
    expect(boSvg('<p>a</p><svg><title>logo</title></svg><p>b</p>')).toBe('<p>a</p><p>b</p>');
  });

  it('bỏ được nhiều khối SVG trong một trang', () => {
    expect(boSvg('<svg><title>x</title></svg>A<svg><title>y</title></svg>B')).toBe('AB');
  });

  it('chỉ ăn phần trong cặp thẻ svg, không nuốt lan ra ngoài', () => {
    expect(boSvg('A<svg>x</svg>B<title>Thật</title>')).toBe('AB<title>Thật</title>');
  });
});

describe('đọc thẻ trên trang render động', () => {
  it('KHÔNG cắt theo <head>: Next đặt <title> trong <body> ở trang động', () => {
    // Ca thật đo được trên site: /mbti có </head> ở byte ~242k còn <title> mãi
    // ~351k. Cắt theo <head> làm 26 trang động báo oan "thiếu tiêu đề" — tôi đã
    // thử hướng đó và phải bỏ.
    const dong =
      '<html><head><meta charset="utf-8"/></head><body><div>x</div>' +
      '<title>Thật</title><meta name="description" content="mô tả thật"/></body></html>';
    expect(docTieuDe(dong)).toBe('Thật');
    expect(docMoTa(dong)).toBe('mô tả thật');
  });
});

describe('docTieuDe / docMoTa', () => {
  it('đọc đúng và giải entity', () => {
    const h = trang('<title>Tử Vi &amp; Bát Tự</title><meta name="description" content="a &amp; b"/>');
    expect(docTieuDe(h)).toBe('Tử Vi & Bát Tự');
    expect(docMoTa(h)).toBe('a & b');
  });

  it('KHÔNG vớ phải <title> của SVG trong body — ca này từng làm luật "thiếu tiêu đề" chết hẳn', () => {
    const h = trang(
      '<meta name="description" content="x"/>',
      '<svg><title>hieu.asia</title></svg>',
    );
    expect(docTieuDe(h)).toBe('');
  });
});

describe('kiemMotTrang', () => {
  const dat = trang('<title>ngắn gọn</title><meta name="description" content="vừa đủ"/>');

  it('trang đạt → không vi phạm', () => {
    expect(kiemMotTrang('/x', dat)).toEqual([]);
  });

  it('bắt tiêu đề dài', () => {
    const h = trang(`<title>${tieuDeDai}</title><meta name="description" content="ok"/>`);
    expect(kiemMotTrang('/x', h).map((v) => v.luat)).toEqual([`tiêu đề ${TITLE_MAX + 1}>${TITLE_MAX}`]);
  });

  it('bắt mô tả dài', () => {
    const h = trang(`<title>ok</title><meta name="description" content="${moTaDai}"/>`);
    expect(kiemMotTrang('/x', h).map((v) => v.luat)).toEqual([
      `mô tả ${DESCRIPTION_MAX + 1}>${DESCRIPTION_MAX}`,
    ]);
  });

  it('bắt thiếu tiêu đề và thiếu mô tả', () => {
    expect(kiemMotTrang('/x', trang('')).map((v) => v.luat)).toEqual([
      'thiếu tiêu đề',
      'thiếu mô tả',
    ]);
  });

  it('mọi vi phạm phải mang đúng đường dẫn — nếu không, báo cáo vô dụng', () => {
    // Trước đây mọi khẳng định đều `.map(v => v.luat)`, nên field `duong` hỏng
    // mà 21/21 test vẫn xanh: báo đúng lỗi nhưng chỉ sai trang.
    const h = trang(`<title>${tieuDeDai}</title><meta name="description" content="${moTaDai}"/>`);
    const v = kiemMotTrang('/duong-dan-cu-the', h);
    expect(v).toHaveLength(2);
    expect(v.every((x: { duong: string }) => x.duong === '/duong-dan-cu-the')).toBe(true);
  });

  it('thân trả về không phải HTML phải ĐỎ, không lặng lẽ coi là đạt', () => {
    expect(kiemMotTrang('/x', '{"loi":"khong tim thay"}').map((v) => v.luat)).toEqual([
      'không phải trang HTML',
    ]);
  });

  it('trang HTML mất tiêu đề thật vẫn ĐỎ dù logo SVG có <title> riêng', () => {
    const h = trang(
      '<meta name="description" content="x"/>',
      '<svg><title>hieu.asia</title></svg>',
    );
    expect(kiemMotTrang('/x', h).map((v) => v.luat)).toEqual(['thiếu tiêu đề']);
  });

  it('đúng ngưỡng thì KHÔNG bắt nhầm', () => {
    const h = trang(
      `<title>${'x'.repeat(TITLE_MAX)}</title>` +
        `<meta name="description" content="${'y'.repeat(DESCRIPTION_MAX)}"/>`,
    );
    expect(kiemMotTrang('/x', h)).toEqual([]);
  });
});

describe('chiaLuong', () => {
  it('THỰC SỰ tạo đủ n luồng — không chỉ giữ đủ phần tử', () => {
    // Khẳng định này là bắt buộc: chỉ kiểm `flat()` thì một bản `d => [d]`
    // (chạy tuần tự, 1 luồng) vẫn pass, mà 978 request tuần tự sẽ vượt
    // `timeout-minutes` của job.
    const luong = chiaLuong(Array.from({ length: 25 }, (_, i) => i), 12);
    expect(luong).toHaveLength(12);
    expect(Math.max(...luong.map((l: number[]) => l.length))).toBeLessThanOrEqual(3);
  });

  it('phân hoạch đầy đủ và rời nhau', () => {
    const danh = Array.from({ length: 25 }, (_, i) => i);
    const luong = chiaLuong(danh, 12);
    expect(luong.flat().sort((a: number, b: number) => a - b)).toEqual(danh);
    expect(new Set(luong.flat()).size).toBe(danh.length);
  });

  it('ít phần tử hơn số luồng chỉ tạo luồng rỗng vô hại', () => {
    const luong = chiaLuong([1, 2], 12);
    expect(luong).toHaveLength(12);
    expect(luong.flat()).toEqual([1, 2]);
  });

  it('số luồng dùng thật là một số dương hợp lý', () => {
    expect(SONG_SONG).toBeGreaterThan(1);
    expect(chiaLuong([1, 2, 3], SONG_SONG)).toHaveLength(SONG_SONG);
  });
});
