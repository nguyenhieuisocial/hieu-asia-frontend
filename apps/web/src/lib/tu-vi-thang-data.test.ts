import { describe, it, expect } from 'vitest';
import { ZODIAC } from './hop-tuoi-pairs';
import { dayCanChi } from './gio-hoang-dao';
import {
  WINDOW_MONTHS,
  buildMonthOverview,
  buildMonthTable,
  buildThangConGiap,
  LAUNCH_MONTH,
  buildableMonths,
  daysInMonth,
  elementStance,
  liveMonths,
  monthSlug,
  parseMonthSlug,
  pastMonths,
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
    for (const bad of ['', 'thang-8', '0-2026', '13-2026', '8-1999', '8-2099', '8/2026', 'ty']) {
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
