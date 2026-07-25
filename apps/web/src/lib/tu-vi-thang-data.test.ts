import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ZODIAC } from './hop-tuoi-pairs';
import { dayCanChi } from './gio-hoang-dao';
import {
  WINDOW_MONTHS,
  buildMonthOverview,
  buildMonthTable,
  buildThangConGiap,
  DESCRIPTION_MAX,
  HUB_DESCRIPTION,
  HUB_TITLE,
  LAUNCH_MONTH,
  TITLE_MAX,
  buildableMonths,
  daysInMonth,
  elementStance,
  liveMonths,
  metaTitle,
  monthPageDescription,
  monthPageTitle,
  monthSlug,
  parseMonthSlug,
  pastMonths,
  resolveServableMonth,
  spanNote,
} from './tu-vi-thang-data';

// Ngày "hôm nay" của đợt dựng cụm này — mọi khẳng định về cửa sổ tháng đều neo
// vào mốc cố định để test không đổi kết quả theo ngày chạy.
const NOW = new Date('2026-07-23T00:00:00Z');

describe('cửa sổ tháng (sinh dần theo lịch)', () => {
  it('ở mốc 23/07/2026 chỉ mở các tháng CÒN Ở TƯƠNG LAI — không có tháng 7', () => {
    const slugs = liveMonths(NOW).map(monthSlug);
    expect(slugs).toEqual(['8-2026', '9-2026', '10-2026', '11-2026', '12-2026', '1-2027']);
    expect(slugs).toHaveLength(WINDOW_MONTHS);
    expect(slugs).not.toContain('7-2026');
  });

  it('không bao giờ lùi trước tháng mở cụm', () => {
    for (const now of ['2026-02-01', '2026-05-01', '2026-07-31']) {
      expect(liveMonths(new Date(`${now}T00:00:00Z`))[0]).toEqual(LAUNCH_MONTH);
    }
    // Trước cửa sổ mở: chưa có tháng nào — thà không có trang còn hơn có trang rỗng.
    expect(liveMonths(new Date('2026-01-10T00:00:00Z'))).toEqual([]);
  });

  it('sau khi cụm chạy, tháng ĐANG diễn ra vẫn nằm trong cửa sổ tới hết tháng', () => {
    const inAugust = liveMonths(new Date('2026-08-15T00:00:00Z')).map(monthSlug);
    expect(inAugust[0]).toBe('8-2026');
    expect(inAugust).toHaveLength(WINDOW_MONTHS + 1);
    // Sang tháng 9 thì tháng 8 rời cửa sổ.
    expect(liveMonths(new Date('2026-09-01T00:00:00Z')).map(monthSlug)).not.toContain('8-2026');
  });

  it('bắc cầu qua mốc cuối năm không lệch tháng', () => {
    expect(liveMonths(new Date('2026-11-05T00:00:00Z'), 2).map(monthSlug)).toEqual([
      '11-2026',
      '12-2026',
      '1-2027',
    ]);
  });

  it('chặng 308 chỉ gồm các tháng ĐÃ HẾT, không lấn tháng đang diễn ra', () => {
    expect(pastMonths(NOW, 3).map(monthSlug)).toEqual(['6-2026', '5-2026', '4-2026']);
  });

  it('tập route dựng ra không trùng slug và phủ liền mạch khi sang tháng mới', () => {
    const slugs = buildableMonths(NOW).map(monthSlug);
    expect(new Set(slugs).size).toBe(slugs.length);
    // Tháng vừa hết phải còn route để 308 — không được rơi thẳng vào 404.
    const inSeptember = buildableMonths(new Date('2026-09-03T00:00:00Z')).map(monthSlug);
    expect(inSeptember).toContain('8-2026');
  });
});

describe('slug tháng', () => {
  it('parse ngược lại đúng', () => {
    for (const k of buildableMonths(NOW)) {
      expect(parseMonthSlug(monthSlug(k))).toEqual(k);
    }
  });

  it('từ chối slug sai định dạng hoặc ngoài khoảng', () => {
    for (const bad of ['', 'thang-8', '0-2026', '13-2026', '8-1999', '8-2101', '8/2026', 'ty']) {
      expect(parseMonthSlug(bad)).toBeNull();
    }
  });
});

describe('trụ tháng theo tiết khí', () => {
  it('tháng 8/2026 mang trụ Bính Thân (năm Bính Ngọ, Ngũ Hổ Độn)', () => {
    const m = buildMonthOverview({ year: 2026, month: 8 });
    expect(m.main.label).toBe('Bính Thân');
    expect(m.main.chi).toBe('Thân');
    expect(m.main.canElement).toBe('Hỏa');
    expect(m.main.chiElement).toBe('Kim');
  });

  it('tháng 1/2027 vẫn thuộc năm Bính Ngọ 2026 vì trụ năm đổi tại Lập Xuân', () => {
    const m = buildMonthOverview({ year: 2027, month: 1 });
    expect(m.yearNumber).toBe(2026);
    expect(m.yearCanChi.name).toBe('Bính Ngọ');
  });

  it('các đoạn tiết khí phủ kín tháng dương, không hở không chồng', () => {
    for (const k of liveMonths(NOW)) {
      const m = buildMonthOverview(k);
      expect(m.spans.length).toBeGreaterThanOrEqual(1);
      expect(m.spans[0]!.fromDay).toBe(1);
      expect(m.spans[m.spans.length - 1]!.toDay).toBe(daysInMonth(k.year, k.month));
      for (let i = 1; i < m.spans.length; i++) {
        expect(m.spans[i]!.fromDay).toBe(m.spans[i - 1]!.toDay + 1);
      }
      // Trụ đại diện phải là đoạn dài nhất và chiếm quá nửa tháng.
      expect(m.mainDays * 2).toBeGreaterThan(m.daysCount);
      expect(spanNote(m)).toContain(m.main.label);
    }
  });
});

describe('ngũ hành', () => {
  it('phân loại đúng 5 thế', () => {
    expect(elementStance('Hỏa', 'Hỏa')).toBe('dong-hanh');
    expect(elementStance('Mộc', 'Hỏa')).toBe('ta-sinh');
    expect(elementStance('Thổ', 'Hỏa')).toBe('duoc-sinh');
    expect(elementStance('Thủy', 'Hỏa')).toBe('ta-khac');
    expect(elementStance('Kim', 'Hỏa')).toBe('bi-khac');
  });
});

describe('bảng ngày trong tháng', () => {
  const k = { year: 2026, month: 8 };

  it('mỗi ngày rơi vào tối đa một nhóm và đúng với can chi ngày', () => {
    for (const z of ZODIAC) {
      const d = buildThangConGiap(k, z.slug)!;
      const all = [
        ...d.days.tamHop,
        ...d.days.lucHop,
        ...d.days.lucXung,
        ...d.days.lucHai,
        ...d.days.trungChi,
      ];
      expect(new Set(all.map((x) => x.day)).size).toBe(all.length);
      for (const day of all) {
        expect(dayCanChi(day.day, k.month, k.year).label).toBe(day.canChi);
      }
      // Trùng chi tuổi: chi ngày phải bằng đúng chi con giáp.
      for (const day of d.days.trungChi) expect(day.chi).toBe(z.ten);
      // Tháng 30–31 ngày luôn có ít nhất 2 ngày trùng chi (chu kỳ 12 ngày).
      expect(d.days.trungChi.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('nội dung 72 trang thực sự khác nhau', () => {
  const months = liveMonths(NOW);
  const pages = months.flatMap((k) => ZODIAC.map((z) => buildThangConGiap(k, z.slug)!));

  it('dựng đủ 72 trang chi tiết (6 tháng × 12 con giáp)', () => {
    expect(months).toHaveLength(6);
    expect(pages).toHaveLength(72);
    expect(pages.every(Boolean)).toBe(true);
  });

  it('mỗi trang có tiêu đề, mô tả và câu chốt riêng', () => {
    for (const field of ['seoTitle', 'seoDescription', 'verdictShort'] as const) {
      const values = pages.map((p) => p[field]);
      expect(new Set(values).size).toBe(pages.length);
    }
  });

  it('bảng ngày hiển thị của mỗi trang là duy nhất', () => {
    // Fingerprint lấy ĐÚNG những gì trang in ra: ngày + thứ + can chi ngày.
    // (Chỉ so số ngày là chưa đủ: chi ngày quay vòng 12 ngày nên hai tháng cùng
    // 31 ngày và lệch nhau bội số 12 sẽ trùng SỐ ngày — nhưng can ngày quay vòng
    // 60 và thứ quay vòng 7 nên bảng in ra vẫn khác nhau.)
    const render = (p: (typeof pages)[number]) =>
      (
        [
          p.days.tamHop,
          p.days.lucHop,
          p.days.lucXung,
          p.days.lucHai,
          p.days.trungChi,
        ] as const
      )
        .map((bucket) => bucket.map((d) => `${d.day}/${d.weekday}/${d.canChi}`).join('.'))
        .join('|');
    expect(new Set(pages.map(render)).size).toBe(pages.length);
  });

  it('phần thân (quan hệ + ngũ hành + bối cảnh năm) không rải cùng một đoạn cho mọi trang', () => {
    const bodies = pages.map(
      (p) => `${p.relationLine}${p.chiElementLine}${p.canElementLine}${p.yearContextLine}`,
    );
    expect(new Set(bodies).size).toBe(pages.length);
  });

  it('FAQ của mỗi trang khác nhau và luôn đủ 5 câu', () => {
    const faqs = pages.map((p) => p.faqs.map((f) => `${f.q}${f.a}`).join('~'));
    expect(new Set(faqs).size).toBe(pages.length);
    for (const p of pages) expect(p.faqs).toHaveLength(5);
  });

});

describe('ngưỡng SERP của cả 3 route', () => {
  // Ngưỡng Google cắt: ~60 ký tự tiêu đề, ~160 ký tự mô tả. Mọi mẫu chuỗi ghép
  // từ dữ liệu (tên trụ tháng, số ngày hợp/xung) nên độ dài đổi theo tháng.
  //
  // CỐ Ý KHÔNG dùng `NOW`/`liveMonths` ở đây. Cụm sinh trang cuốn chiếu vô hạn
  // về phía trước, nên nếu chỉ kiểm cửa sổ đang mở thì một tháng chật hơn (chỉ
  // vào cửa sổ sau này) sẽ lọt lưới — trang tháng 10/2027 là ví dụ thật: tiêu đề
  // 59/60, chật hơn mọi tháng trong cửa sổ hiện tại.
  //
  // Trụ tháng lặp lại theo chu kỳ 5 năm (can tháng suy từ can năm theo Ngũ Hổ
  // Độn), nên quét 10 năm là phủ HẾT mọi tổ hợp (tháng × trụ tháng) có thể có.
  const YEARS = Array.from({ length: 10 }, (_, i) => 2026 + i);
  const months = YEARS.flatMap((year) =>
    Array.from({ length: 12 }, (_, i) => ({ year, month: i + 1 })),
  );

  const check = (label: string, title: string, description: string) => {
    // Route ghép hậu tố thương hiệu vào tiêu đề trần — cái vượt ngưỡng là chuỗi
    // SAU khi ghép, nên phải đo `metaTitle()` chứ không đo bản trần.
    expect(metaTitle(title).length, `title: ${label}`).toBeLessThanOrEqual(TITLE_MAX);
    expect(description.length, `desc: ${label}`).toBeLessThanOrEqual(DESCRIPTION_MAX);
    // clampDescription là chốt chặn; nếu nó phải cắt thì mẫu chữ đã quá dài —
    // sửa mẫu chứ đừng để người đọc thấy câu cụt.
    expect(description, `desc bị cắt: ${label}`).not.toContain('…');
  };

  it('hub /tu-vi-thang', () => {
    check('hub', HUB_TITLE, HUB_DESCRIPTION);
  });

  it(`trang tháng /tu-vi-thang/[ky] — ${months.length} tháng (2026–2035)`, () => {
    for (const k of months) {
      const m = buildMonthOverview(k);
      check(monthSlug(k), monthPageTitle(m), monthPageDescription(m));
    }
  });

  it(`trang con giáp /tu-vi-thang/[ky]/[congiap] — ${months.length * 12} trang`, () => {
    for (const k of months) {
      for (const z of ZODIAC) {
        const d = buildThangConGiap(k, z.slug)!;
        check(`${monthSlug(k)}/${z.slug}`, d.seoTitle, d.seoDescription);
      }
    }
  });
});

describe('giọng thương hiệu', () => {
  const pages = liveMonths(NOW).flatMap((k) =>
    ZODIAC.map((z) => buildThangConGiap(k, z.slug)!),
  );
  // Các từ hứa quá / hù doạ / phán số mệnh mà cụm này KHÔNG được dùng.
  const BANNED = ['định mệnh', 'bói', 'chắc chắn giàu', 'đại hạn', 'giải hạn ngay', 'tai ương'];

  it('không dùng từ hù doạ hay phán số mệnh', () => {
    for (const p of pages) {
      const text = [
        p.seoTitle,
        p.seoDescription,
        p.verdictShort,
        p.relationLine,
        p.chiElementLine,
        p.canElementLine,
        p.yearContextLine,
        ...p.faqs.map((f) => `${f.q} ${f.a}`),
      ]
        .join(' ')
        .toLowerCase();
      for (const w of BANNED) expect(text).not.toContain(w);
    }
  });

  it('luôn nói rõ đây là tham khảo, không phán', () => {
    for (const p of pages) {
      expect(p.verdictShort.toLowerCase()).toContain('tham khảo');
    }
  });
});

describe('bảng tổng quan tháng', () => {
  it('liệt kê đủ 12 con giáp, số ngày khớp với trang chi tiết', () => {
    const k = { year: 2026, month: 9 };
    const rows = buildMonthTable(k);
    expect(rows).toHaveLength(12);
    for (const r of rows) {
      const d = buildThangConGiap(k, r.z.slug)!;
      expect(r.thuanDays).toBe(d.days.tamHop.length + d.days.lucHop.length);
      expect(r.xungDays).toBe(d.days.lucXung.length);
    }
  });
});

describe('slug con giáp lạ', () => {
  it('trả về null để route gọi notFound()', () => {
    expect(buildThangConGiap({ year: 2026, month: 8 }, 'khong-co')).toBeNull();
  });
});

// Lỗi thật, suýt lộ ra ngày 01/08/2026 và không test nào bắt được:
// `app/sitemap.ts` tính `liveMonths()` lúc CHẠY (ISR 1 giờ) nên nó cuốn theo
// lịch, còn `generateStaticParams()` chốt tập slug tại lúc BUILD. Qua mốc đầu
// tháng mà chưa deploy lại thì sitemap khai URL chưa dựng ⇒ 404.
//
// Ba bài dưới khoá cả hai vế: (1) nguy cơ có thật, đo được; (2) tập trang phục
// vụ luôn phủ được sitemap khi cùng một mốc thời gian; (3) cấu hình route giữ
// đúng thứ làm (2) thành sự thật lúc chạy.
describe('sitemap và trang phải cuốn theo lịch CÙNG NHỊP', () => {
  const ROUTE_FILES = [
    'src/app/tu-vi-thang/[ky]/page.tsx',
    'src/app/tu-vi-thang/[ky]/[congiap]/page.tsx',
  ];
  // Trang tổng không có `[param]` nên không cần `dynamicParams`, nhưng nó là chỗ
  // duy nhất liên kết nội bộ tới trang tháng → đóng băng thì tháng mới thành
  // trang mồ côi. Chỉ đòi `revalidate`.
  const HUB_FILE = 'src/app/tu-vi-thang/page.tsx';

  it('tập slug chốt tại BUILD KHÔNG phủ nổi sitemap của tháng sau — nguy cơ là thật', () => {
    const buildDay = new Date('2026-07-25T00:00:00Z');
    const built = new Set(buildableMonths(buildDay).map(monthSlug));
    const missing = liveMonths(new Date('2026-08-01T00:00:00Z'))
      .map(monthSlug)
      .filter((s) => !built.has(s));
    // Mỗi tháng thiếu = 1 trang tháng + 12 trang con giáp = 13 URL chết.
    expect(missing.length, 'nếu bài này xanh nghĩa là nguy cơ đã biến mất — đọc lại ghi chú trước khi xoá cấu hình route').toBeGreaterThan(0);
  });

  it('cùng một mốc thời gian: MỌI URL sitemap của cụm đều phục vụ được', () => {
    const dates = [
      '2026-07-25', // hôm dựng cụm
      '2026-08-01', // mốc vỡ đầu tiên
      '2026-09-01',
      '2026-12-31', // bắc cầu qua năm
      '2027-01-01',
      '2030-06-15',
      // Vách đá cũ: bản trước chặn năm ở 2035, nên từ 7/2035 cửa sổ tháng sinh
      // ra "1-2036" mà `parseMonthSlug` từ chối. Hai mốc này khoá lại chỗ đó.
      '2035-07-01',
      '2035-12-01',
    ];
    for (const d of dates) {
      const now = new Date(`${d}T00:00:00Z`);
      const months = liveMonths(now);
      expect(months.length, `sitemap rỗng tại ${d} — phép đo hỏng chứ không phải site sạch`).toBeGreaterThan(0);
      for (const k of months) {
        expect(resolveServableMonth(monthSlug(k), now), `${monthSlug(k)} nằm trong sitemap tại ${d} nhưng route không phục vụ`).toEqual(k);
      }
    }
  });

  it('cấu hình 2 route giữ đúng thứ làm điều trên thành sự thật lúc chạy', () => {
    for (const f of ROUTE_FILES) {
      const src = readFileSync(join(process.cwd(), f), 'utf8');
      expect(src, `${f}: đóng dynamicParams lại thì tháng mới trong sitemap sẽ 404`).toMatch(
        /export const dynamicParams = true/,
      );
      expect(src, `${f}: thiếu revalidate thì lệnh 308 của tháng đã hết bị nướng cứng vào HTML lúc build`).toMatch(
        /export const revalidate = \d+/,
      );
    }
    const hub = readFileSync(join(process.cwd(), HUB_FILE), 'utf8');
    expect(hub, `${HUB_FILE}: thiếu revalidate thì tháng mới không có link nội bộ nào trỏ tới`).toMatch(
      /export const revalidate = \d+/,
    );
  });
});

// Ngưỡng thứ ba của PR #940 — `og:title` phải khớp `<title>` — là ngưỡng DUY
// NHẤT chưa có chốt nào canh: `seo-guard` không có luật nào về `og:` (đo trên
// HTML render thì 955 trang toàn site "lệch og:title", mà phần lớn KHÔNG phải
// lỗi — xem §4 note 172 — nên một luật toàn site sẽ chỉ đẻ báo động giả).
// Cách đúng là canh HẸP, ngay trong cụm: bắt cả 3 route dùng CÙNG một định
// danh cho `<title>`, `og:title` và `twitter:title`.
describe('og:title phải khớp <title> — canh trong phạm vi cụm', () => {
  const ROUTES = [
    'src/app/tu-vi-thang/page.tsx',
    'src/app/tu-vi-thang/[ky]/page.tsx',
    'src/app/tu-vi-thang/[ky]/[congiap]/page.tsx',
  ];

  it('cả 3 route dùng chung một định danh tiêu đề cho thẻ trang, og và twitter', () => {
    for (const f of ROUTES) {
      const src = readFileSync(join(process.cwd(), f), 'utf8');
      const canonical = /\btitle:\s*\{\s*absolute:\s*([A-Za-z_$][\w$]*)\s*\}/.exec(src);
      expect(canonical, `${f}: không thấy title: { absolute: … } — root layout sẽ cộng thêm hậu tố lần nữa`).not.toBeNull();

      const id = canonical![1]!;
      // Mọi chỗ khai tiêu đề KHÁC (og, twitter) phải trỏ về đúng định danh đó.
      // Lưu ý: regex này KHÔNG khớp `title: { absolute: … }` (sau dấu hai chấm
      // là `{`, không phải định danh) — nên `others` đúng là "những chỗ còn lại".
      const others = [...src.matchAll(/\btitle:\s*([A-Za-z_$][\w$]*)/g)].map((m) => m[1]!);
      const shorthand = id === 'title' ? (src.match(/\btitle,/g) ?? []).length : 0;

      const wrong = others.filter((x) => x !== id);
      expect(wrong, `${f}: og/twitter dùng tiêu đề KHÁC <title> (${wrong.join(', ')}) — đúng lỗi gốc của PR #940`).toEqual([]);
      expect(others.length + shorthand, `${f}: phải khai đủ cả og:title lẫn twitter:title bằng cùng định danh "${id}"`).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('resolveServableMonth — chốt phạm vi khi dynamicParams đã mở', () => {
  const NOW_R = new Date('2026-07-25T00:00:00Z');

  it('nhận tháng đang sống và tháng trong chặng 308', () => {
    expect(resolveServableMonth('8-2026', NOW_R)).toEqual({ year: 2026, month: 8 });
    expect(resolveServableMonth('6-2026', NOW_R)).toEqual({ year: 2026, month: 6 });
  });

  it('từ chối tháng ngoài cửa sổ, dù `parseMonthSlug` chấp nhận định dạng', () => {
    expect(parseMonthSlug('1-2030')).not.toBeNull();
    expect(resolveServableMonth('1-2030', NOW_R)).toBeNull();
  });

  it('chỉ phục vụ dạng slug CHUẨN — chặn hai URL cùng nội dung', () => {
    expect(parseMonthSlug('08-2026')).toEqual({ year: 2026, month: 8 });
    expect(resolveServableMonth('08-2026', NOW_R)).toBeNull();
  });

  it('từ chối rác', () => {
    for (const s of ['', 'abc', '13-2026', '8-2019', '8-2036', '8/2026']) {
      expect(resolveServableMonth(s, NOW_R), s).toBeNull();
    }
  });
});
