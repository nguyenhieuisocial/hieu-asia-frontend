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
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, it, expect } from 'vitest';

import {
  CUM_TOI_THIEU,
  MIN_TRANG,
  NGUNG_SOM_SAU,
  NGUONG_CUM_LON,
  NGUONG_HA_TANG,
  SONG_SONG,
  bocLoc,
  bocSitemap,
  boSvg,
  canhBaoCumMoi,
  chiaLuong,
  docChiuLoi,
  docMoTa,
  docTieuDe,
  doHongDongLoat,
  ghiLoiHaTang,
  giaiMa,
  gomCum,
  gopSitemap,
  kiemBoQua,
  kiemMotTrang,
  kiemSanSitemap,
  kiemThamSo,
  mauKhongKhop,
  phanLoaiPhanHoi,
  tachBoQua,
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

describe('tachBoQua — bỏ tải một số cụm khi đo trên bản dựng CI', () => {
  const urls = [
    'https://hieu.asia/',
    'https://hieu.asia/cam-nang',
    'https://hieu.asia/cam-nang/tu-vi',
    'https://hieu.asia/tu-vi-hom-nay/ty',
    'https://hieu.asia/timeline',
  ];

  it('KHÔNG có `/*` thì chỉ bỏ ĐÚNG một đường dẫn, không ăn cả nhánh', () => {
    // Ca thật đã sập: viết `/hop-tuoi` định loại 3 trang động thì nó ăn 83 URL,
    // kéo 80 trang TĨNH đang đo tốt ra khỏi lưới mà không ai báo.
    const r = tachBoQua(urls, ['/cam-nang']);
    expect(r.boQua).toEqual(['https://hieu.asia/cam-nang']);
    expect(r.do).toHaveLength(urls.length - 1);
  });

  it('có `/*` thì ăn cả nhánh, gồm cả trang gốc', () => {
    const r = tachBoQua(urls, ['/cam-nang/*', '/tu-vi-hom-nay/*']);
    expect(r.boQua).toHaveLength(3);
    expect(r.do).toEqual(['https://hieu.asia/', 'https://hieu.asia/timeline']);
  });

  it('KHÔNG bỏ nhầm cụm có tên bắt đầu giống', () => {
    // `/cam-nang-khac` phải ở lại với cả hai kiểu mẫu.
    const kh = ['https://hieu.asia/cam-nang-khac'];
    expect(tachBoQua(kh, ['/cam-nang']).boQua).toEqual([]);
    expect(tachBoQua(kh, ['/cam-nang/*']).boQua).toEqual([]);
  });

  it('không truyền gì thì KHÔNG bỏ gì — mặc định phải là đo hết', () => {
    expect(tachBoQua(urls, []).do).toHaveLength(urls.length);
    expect(tachBoQua(urls, undefined).do).toHaveLength(urls.length);
  });

  it('danh sách bỏ qua phình quá ngưỡng phải ĐỎ, không âm thầm thu hẹp phạm vi', () => {
    expect(kiemBoQua(96, 978)).toContain('96/978');
    expect(kiemBoQua(16, 978)).toBeNull();
    expect(kiemBoQua(0, 0)).toBeNull();
  });
});

describe('kiemThamSo — lỗi gõ phải nói ra, không được chẩn đoán ngược', () => {
  it('quên URL, để cờ ở vị trí đầu → báo rõ thay vì "site không phản hồi"', () => {
    expect(kiemThamSo('--bo-qua=/cam-nang', [])).toContain('không phải URL hợp lệ');
  });

  it('dùng dấu cách thay `=` → báo rõ thay vì lặng lẽ bỏ qua 0 URL', () => {
    expect(kiemThamSo('https://hieu.asia', ['--bo-qua', '/cam-nang'])).toContain('không nhận ra');
  });

  it('tham số hợp lệ thì không kêu', () => {
    expect(kiemThamSo('https://hieu.asia', ['--bo-qua=/x', '--chiu-loi=2'])).toBeNull();
    expect(kiemThamSo('http://127.0.0.1:3000', [])).toBeNull();
    expect(kiemThamSo('https://hieu.asia', ['--chiu-loi=2.5'])).toBeNull();
  });

  it('giá trị --chiu-loi sai định dạng phải BÁO, không âm thầm về 0', () => {
    // `--chiu-loi=2%` khớp tiền tố nên bản trước cho qua rồi `docChiuLoi` trả 0.
    // Mức chịu 0 ở seo-guard.yml nghĩa là MỘT URL rớt lẻ cũng ra mã 2 ⇒ cảnh
    // báo ⇒ toàn bộ phép đo live thành advisory. Một dấu `%` thừa tháo cả cổng.
    for (const xau of ['--chiu-loi=2%', '--chiu-loi=abc', '--chiu-loi=', '--chiu-loi=-1'])
      expect(kiemThamSo('https://hieu.asia', [xau]), xau).toContain('sai định dạng');
  });

  it('--bo-qua= rỗng phải báo thay vì lặng lẽ không bỏ qua gì', () => {
    expect(kiemThamSo('https://hieu.asia', ['--bo-qua='])).toContain('rỗng');
  });

  it('mẫu bỏ qua không khớp URL nào phải bị nêu tên', () => {
    const urls = ['https://hieu.asia/a', 'https://hieu.asia/cam-nang/x'];
    expect(mauKhongKhop(urls, ['/cam-nang/*', '/khong-ton-tai'])).toEqual(['/khong-ton-tai']);
    expect(mauKhongKhop(urls, ['/cam-nang/*'])).toEqual([]);
  });
});

describe('docChiuLoi — nghiêm mặc định, chỉ nơi gọi tự khai mới được nới', () => {
  it('không truyền gì ⇒ 0: một URL hỏng cũng phải báo', () => {
    // Lượt chạy theo lịch dựa vào điều này: ở đó mã 2 bắn Telegram nên nghiêm
    // là đúng. Nới toàn cục sẽ làm 19 URL production chết mà không ai được báo.
    expect(docChiuLoi(undefined)).toBe(0);
    expect(docChiuLoi('')).toBe(0);
    expect(docChiuLoi('--chiu-loi=')).toBe(0);
  });

  it('nới được nhưng bị chặn trần bởi NGUONG_HA_TANG', () => {
    expect(docChiuLoi('--chiu-loi=2')).toBeCloseTo(0.02);
    expect(docChiuLoi('--chiu-loi=1')).toBeCloseTo(0.01);
    expect(docChiuLoi('--chiu-loi=90')).toBe(NGUONG_HA_TANG);
  });
});

describe('ngưỡng lỗi hạ tầng', () => {
  it('NGUONG_HA_TANG phải dương và nhỏ — 0 là bẫy tự-tắt-lớp-bảo-vệ', () => {
    // Bản trước dùng `if (loiHaTang.length) exit(2)`, tức ngưỡng 0: CHỈ MỘT
    // request rớt trong 978 là cả lượt quét thành "không kết luận được", mà ở
    // CI mã 2 chỉ cảnh báo ⇒ lớp bảo vệ tắt lặng, check vẫn xanh.
    expect(NGUONG_HA_TANG).toBeGreaterThan(0);
    expect(NGUONG_HA_TANG).toBeLessThan(0.1);
  });

  it('ngưỡng đủ rộng cho vài lỗi lẻ, đủ chặt để không bỏ qua site hỏng', () => {
    const tong = 978;
    expect(Math.floor(tong * NGUONG_HA_TANG)).toBeGreaterThanOrEqual(5);
    expect(Math.floor(tong * NGUONG_HA_TANG)).toBeLessThanOrEqual(50);
  });
});

describe('workflow gọi seo-live phải khai đúng thứ nó cần', () => {
  const docWorkflow = (ten: string) =>
    readFileSync(join(process.cwd(), '..', '..', '.github', 'workflows', ten), 'utf8');

  it('seo-guard.yml phải coi seo-live.mjs là file ẢNH HƯỞNG', () => {
    // Thiếu dòng này thì một PR chỉ sửa `seo-live.mjs` — nới ngưỡng, thêm mẫu
    // bỏ qua, đổi `tachBoQua` — sẽ KHÔNG chạy bước đo nào và xanh trong vài
    // giây. Chính workflow gọi nó mà không canh nó.
    expect(docWorkflow('seo-guard.yml')).toContain('apps/web/scripts/seo-live.mjs');
  });

  it('seo-guard.yml phải CHẶN mã 3 (lỗi của PR), chỉ tha mã 2 (hạ tầng)', () => {
    const y = docWorkflow('seo-guard.yml');
    // Chỉ mã 2 được map sang exit 0. Nếu ai thêm mã 3 vào đó thì "sitemap teo"
    // và "bỏ qua quá rộng" lại thành advisory — đúng lỗ vừa vá.
    expect(y).toMatch(/if \[ "\$MA" = "2" \]/);
    expect(y).not.toMatch(/\$MA" = "3"/);
  });

  it('job có timeout riêng vì nó khởi động server', () => {
    expect(docWorkflow('seo-guard.yml')).toMatch(/timeout-minutes:\s*\d+/);
  });

  it('mọi mẫu bỏ qua trong workflow phải khớp CHÍNH XÁC ý định, không phình', () => {
    // Ghim để danh sách không trôi âm thầm: `kiemBoQua` chỉ kêu khi vượt 5%
    // (48/978), tức còn dư địa lớn để phình mà không gì đỏ.
    const m = docWorkflow('seo-guard.yml').match(/--bo-qua=([^'\s\\]+)/);
    expect(m, 'không tìm thấy cờ --bo-qua trong seo-guard.yml').not.toBeNull();
    const mau = m![1]!.split(',');
    expect(mau).toEqual([
      '/cam-nang/*',
      '/tu-vi-hom-nay/*',
      '/hop-tuoi/business',
      '/hop-tuoi/birth-child',
      '/hop-tuoi/xong-dat',
    ]);
    // Và chúng phải là loại "gọi mạng lúc render" — 3 mẫu con của /hop-tuoi là
    // đường dẫn CHÍNH XÁC, không có `/*`, để 80 trang tĩnh cùng cụm vẫn được đo.
    const hopTuoi = mau.filter((x: string) => x.startsWith('/hop-tuoi'));
    expect(hopTuoi.every((x: string) => !x.endsWith('/*'))).toBe(true);
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
