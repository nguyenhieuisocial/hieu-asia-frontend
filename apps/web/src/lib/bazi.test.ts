import { describe, it, expect } from 'vitest';
import { calculateBazi } from './bazi';

/**
 * Kiểm thử hồi quy — engine BÁT TỰ (Tứ Trụ), sản phẩm trả phí flagship.
 *
 * MỌI giá trị kỳ vọng được suy luận ĐỘC LẬP từ luật mệnh lý cổ điển (KHÔNG
 * lấy lại output của engine):
 *   - Trụ NGÀY: chu kỳ 60 ngày liên tục theo Julian Day Number (JDN). Công thức
 *     thiên văn chuẩn: stem=(JDN+9)%10, branch=(JDN+1)%12 (JDN tính giữa trưa).
 *     Mốc neo độc lập: 07/01/2000 = Giáp Tý, 01/01/2024 = Giáp Tý (lịch vạn niên
 *     Hồ Ngọc Đức) — cùng nguồn với gio-hoang-dao.test.ts.
 *   - Trụ NĂM: đổi tại LẬP XUÂN (~04/02, Mặt Trời 315°), KHÔNG theo Tết/01-01.
 *     can=(năm-4)%10, chi=(năm-4)%12.
 *   - Trụ THÁNG: chi theo TIẾT KHÍ (12 cung 30° từ 315°=Dần); can theo Ngũ Hổ
 *     Độn từ can năm.
 *   - Trụ GIỜ: can theo Ngũ Thử Độn từ can ngày; giờ Tý = 23:00–01:00.
 *   - Tàng can: bảng cố định, bản khí đứng đầu.
 *   - Nạp âm: 60 hoa giáp (30 mục, mỗi mục 2 trụ).
 *
 * JDN tự tính (Fliegel–Van Flandern, Gregorian) để kiểm chứng chéo trụ ngày.
 */

// ── Helpers suy luận độc lập ──────────────────────────────────────────────────

const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'] as const;
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'] as const;

/** Julian Day Number (giữa trưa) — Fliegel–Van Flandern cho lịch Gregory. */
function jdn(Y: number, M: number, D: number): number {
  const a = Math.floor((14 - M) / 12);
  const y = Y + 4800 - a;
  const m = M + 12 * a - 3;
  return (
    D + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045
  );
}
const mod = (n: number, m: number) => ((n % m) + m) % m;

/** Trụ ngày suy độc lập từ JDN. */
function dayPillarExpected(Y: number, M: number, D: number): string {
  const j = jdn(Y, M, D);
  return `${CAN[mod(j + 9, 10)]} ${CHI[mod(j + 1, 12)]}`;
}

/** Trụ năm Bát Tự cho một NĂM CAN-CHI (đã qua ranh giới Lập Xuân). */
function yearPillarOf(solarYear: number): string {
  return `${CAN[mod(solarYear - 4, 10)]} ${CHI[mod(solarYear - 4, 12)]}`;
}

// Ngũ Hổ Độn: can của tháng Dần theo can NĂM (Giáp/Kỷ→Bính, Ất/Canh→Mậu,
// Bính/Tân→Canh, Đinh/Nhâm→Nhâm, Mậu/Quý→Giáp).
const NGU_HO_DAN_STEM_IDX = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0]; // index theo can năm
/** Trụ tháng: can theo Ngũ Hổ Độn + chi (sector 0=Dần). */
function monthPillarOf(yearCanIdx: number, monthChiName: (typeof CHI)[number]): string {
  const sector = mod(CHI.indexOf(monthChiName) - 2, 12);
  const stem = mod(NGU_HO_DAN_STEM_IDX[yearCanIdx]! + sector, 10);
  return `${CAN[stem]} ${monthChiName}`;
}

// Ngũ Thử Độn: can của giờ Tý theo can NGÀY (Giáp/Kỷ→Giáp, Ất/Canh→Bính,
// Bính/Tân→Mậu, Đinh/Nhâm→Canh, Mậu/Quý→Nhâm).
const NGU_THU_TY_STEM_IDX = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8]; // index theo can ngày
function hourBranchExpected(h: number): number {
  return Math.floor(mod(h + 1, 24) / 2);
}
/** Trụ giờ: can theo Ngũ Thử Độn từ can ngày + chi giờ. */
function hourPillarOf(dayCanIdx: number, h: number): string {
  const hb = hourBranchExpected(h);
  return `${CAN[mod(NGU_THU_TY_STEM_IDX[dayCanIdx]! + hb, 10)]} ${CHI[hb]}`;
}

// Nạp âm: bảng 30 mục (mỗi mục phủ 2 trụ liên tiếp trong vòng 60).
const NAP_AM_NAMES = [
  'Hải Trung Kim', 'Lô Trung Hỏa', 'Đại Lâm Mộc', 'Lộ Bàng Thổ', 'Kiếm Phong Kim', 'Sơn Đầu Hỏa',
  'Giản Hạ Thủy', 'Thành Đầu Thổ', 'Bạch Lạp Kim', 'Dương Liễu Mộc', 'Tuyền Trung Thủy', 'Ốc Thượng Thổ',
  'Tích Lịch Hỏa', 'Tùng Bách Mộc', 'Trường Lưu Thủy', 'Sa Trung Kim', 'Sơn Hạ Hỏa', 'Bình Địa Mộc',
  'Bích Thượng Thổ', 'Kim Bạch Kim', 'Phú Đăng Hỏa', 'Thiên Hà Thủy', 'Đại Dịch Thổ', 'Thoa Xuyến Kim',
  'Tang Đố Mộc', 'Đại Khê Thủy', 'Sa Trung Thổ', 'Thiên Thượng Hỏa', 'Thạch Lựu Mộc', 'Đại Hải Thủy',
];
function sexagenaryIndex(canIdx: number, chiIdx: number): number {
  for (let t = 0; t < 6; t++) {
    const s = canIdx + 10 * t;
    if (s % 12 === chiIdx) return s;
  }
  return -1;
}
function napAmNameOf(canName: (typeof CAN)[number], chiName: (typeof CHI)[number]): string {
  const idx = sexagenaryIndex(CAN.indexOf(canName), CHI.indexOf(chiName));
  return NAP_AM_NAMES[Math.floor(idx / 2)]!;
}

const pillarStr = (p: { can: string; chi: string }) => `${p.can} ${p.chi}`;

// ── 1. Trụ NGÀY (chu kỳ 60 ngày theo JDN) ─────────────────────────────────────

describe('Bát Tự › trụ NGÀY (chu kỳ 60 ngày, neo theo JDN)', () => {
  // Hai mốc anchor độc lập (lịch vạn niên Hồ Ngọc Đức), KHÔNG lấy từ engine:
  it('2000-01-01 = Mậu Ngọ', () => {
    expect(dayPillarExpected(2000, 1, 1)).toBe('Mậu Ngọ'); // sanity của helper
    const r = calculateBazi({ birthSolarDate: '2000-01-01', birthHour: 12 });
    expect(pillarStr(r.day)).toBe('Mậu Ngọ');
  });

  it('2024-01-01 = Giáp Tý (mốc chuẩn, KHÔNG phải Quý Mão)', () => {
    expect(dayPillarExpected(2024, 1, 1)).toBe('Giáp Tý');
    const r = calculateBazi({ birthSolarDate: '2024-01-01', birthHour: 12 });
    expect(pillarStr(r.day)).toBe('Giáp Tý');
  });

  it('1990-05-20 = Ất Dậu (ngày neo nội bộ của engine, suy độc lập từ JDN)', () => {
    expect(dayPillarExpected(1990, 5, 20)).toBe('Ất Dậu');
    const r = calculateBazi({ birthSolarDate: '1990-05-20', birthHour: 12 });
    expect(pillarStr(r.day)).toBe('Ất Dậu');
  });

  it('2000-01-07 = Giáp Tý (anchor kinh điển Hồ Ngọc Đức)', () => {
    expect(dayPillarExpected(2000, 1, 7)).toBe('Giáp Tý');
    const r = calculateBazi({ birthSolarDate: '2000-01-07', birthHour: 12 });
    expect(pillarStr(r.day)).toBe('Giáp Tý');
  });

  it('trụ ngày tiến đúng 1 bước can-chi sau mỗi ngày (60-cycle liền mạch)', () => {
    const a = calculateBazi({ birthSolarDate: '2024-01-01', birthHour: 12 }).day; // Giáp Tý
    const b = calculateBazi({ birthSolarDate: '2024-01-02', birthHour: 12 }).day; // Ất Sửu
    expect(pillarStr(a)).toBe('Giáp Tý');
    expect(pillarStr(b)).toBe('Ất Sửu');
  });
});

// ── 2. Trụ NĂM = ranh giới LẬP XUÂN (không phải Tết / 01-01) ───────────────────

describe('Bát Tự › trụ NĂM đổi tại LẬP XUÂN (~04/02), KHÔNG theo 01-01', () => {
  it('2021-01-15 (trước Lập Xuân) → dùng năm 2020 = Canh Tý', () => {
    expect(yearPillarOf(2020)).toBe('Canh Tý');
    const r = calculateBazi({ birthSolarDate: '2021-01-15', birthHour: 12 });
    expect(r.meta.solarYearForPillar).toBe(2020);
    expect(pillarStr(r.year)).toBe('Canh Tý');
  });

  it('2021-02-02 (vẫn trước Lập Xuân) → vẫn năm 2020 = Canh Tý', () => {
    const r = calculateBazi({ birthSolarDate: '2021-02-02', birthHour: 12 });
    expect(r.meta.solarYearForPillar).toBe(2020);
    expect(pillarStr(r.year)).toBe('Canh Tý');
  });

  it('2021-02-06 (sau Lập Xuân) → năm 2021 = Tân Sửu', () => {
    expect(yearPillarOf(2021)).toBe('Tân Sửu');
    const r = calculateBazi({ birthSolarDate: '2021-02-06', birthHour: 12 });
    expect(r.meta.solarYearForPillar).toBe(2021);
    expect(pillarStr(r.year)).toBe('Tân Sửu');
  });

  it('2000-01-01 (trước Lập Xuân) → năm 1999 = Kỷ Mão, KHÔNG phải 2000 Canh Thìn', () => {
    expect(yearPillarOf(1999)).toBe('Kỷ Mão');
    const r = calculateBazi({ birthSolarDate: '2000-01-01', birthHour: 12 });
    expect(r.meta.solarYearForPillar).toBe(1999);
    expect(pillarStr(r.year)).toBe('Kỷ Mão');
  });

  it('2024-01-01 (trước Lập Xuân) → năm 2023 = Quý Mão', () => {
    expect(yearPillarOf(2023)).toBe('Quý Mão');
    const r = calculateBazi({ birthSolarDate: '2024-01-01', birthHour: 12 });
    expect(r.meta.solarYearForPillar).toBe(2023);
    expect(pillarStr(r.year)).toBe('Quý Mão');
  });
});

// ── 3. Trụ THÁNG theo TIẾT KHÍ + can theo Ngũ Hổ Độn ──────────────────────────

describe('Bát Tự › trụ THÁNG (chi theo tiết khí, can theo Ngũ Hổ Độn)', () => {
  // Ngũ Hổ Độn — can tháng Dần cho từng can năm (suy độc lập).
  it('Ngũ Hổ Độn: can tháng Dần đúng cho mọi can năm', () => {
    const expected: Record<string, string> = {
      Giáp: 'Bính Dần', Ất: 'Mậu Dần', Bính: 'Canh Dần', Đinh: 'Nhâm Dần', Mậu: 'Giáp Dần',
      Kỷ: 'Bính Dần', Canh: 'Mậu Dần', Tân: 'Canh Dần', Nhâm: 'Nhâm Dần', Quý: 'Giáp Dần',
    };
    for (const yc of CAN) {
      expect(monthPillarOf(CAN.indexOf(yc), 'Dần')).toBe(expected[yc]);
    }
  });

  // Sinh giữa tiết khí (xa ranh giới) → chi tháng xác định rõ; can suy từ can năm.
  it('1990-05-20 (Mặt Trời ~59°, tiết Tỵ) → tháng Tân Tỵ (năm Canh)', () => {
    // năm Bát Tự 1990 = Canh; tháng Tỵ. Ngũ Hổ Độn(Canh)→Mậu Dần; Tỵ là sector 3
    // → Mậu(4)+3 = Tân(7) → Tân Tỵ.
    expect(monthPillarOf(CAN.indexOf('Canh'), 'Tỵ')).toBe('Tân Tỵ');
    const r = calculateBazi({ birthSolarDate: '1990-05-20', birthHour: 12 });
    expect(pillarStr(r.month)).toBe('Tân Tỵ');
  });

  it('2020-06-15 (Mặt Trời ~84°, tiết Ngọ) → tháng Nhâm Ngọ (năm Canh)', () => {
    expect(monthPillarOf(CAN.indexOf('Canh'), 'Ngọ')).toBe('Nhâm Ngọ');
    const r = calculateBazi({ birthSolarDate: '2020-06-15', birthHour: 12 });
    expect(pillarStr(r.month)).toBe('Nhâm Ngọ');
  });

  it('1984-06-15 (tiết Ngọ) → tháng Canh Ngọ (năm Giáp)', () => {
    expect(monthPillarOf(CAN.indexOf('Giáp'), 'Ngọ')).toBe('Canh Ngọ');
    const r = calculateBazi({ birthSolarDate: '1984-06-15', birthHour: 12 });
    expect(pillarStr(r.month)).toBe('Canh Ngọ');
  });

  it('2021-02-06 (sau Lập Xuân, tiết Dần) → tháng Canh Dần (năm Tân)', () => {
    expect(monthPillarOf(CAN.indexOf('Tân'), 'Dần')).toBe('Canh Dần');
    const r = calculateBazi({ birthSolarDate: '2021-02-06', birthHour: 12 });
    expect(pillarStr(r.month)).toBe('Canh Dần');
  });

  it('2021-01-15 (tiết Sửu, năm Bát Tự Canh) → tháng Kỷ Sửu', () => {
    // năm Canh → Mậu Dần; Sửu là sector 11 → Mậu(4)+11 = Kỷ(5) → Kỷ Sửu.
    expect(monthPillarOf(CAN.indexOf('Canh'), 'Sửu')).toBe('Kỷ Sửu');
    const r = calculateBazi({ birthSolarDate: '2021-01-15', birthHour: 12 });
    expect(pillarStr(r.month)).toBe('Kỷ Sửu');
  });
});

// ── 4. Trụ GIỜ theo Ngũ Thử Độn; giờ Tý = 23:00–01:00 ─────────────────────────

describe('Bát Tự › trụ GIỜ (Ngũ Thử Độn từ can ngày; giờ Tý 23h–01h)', () => {
  it('chi giờ: 23h và 0h đều = Tý; 1h = Sửu; 12h = Ngọ', () => {
    expect(CHI[hourBranchExpected(23)]).toBe('Tý');
    expect(CHI[hourBranchExpected(0)]).toBe('Tý');
    expect(CHI[hourBranchExpected(1)]).toBe('Sửu');
    expect(CHI[hourBranchExpected(12)]).toBe('Ngọ');
  });

  it('2024-01-01 23h (ngày Giáp Tý) → giờ Giáp Tý (Ngũ Thử Độn Giáp→Giáp Tý)', () => {
    expect(hourPillarOf(CAN.indexOf('Giáp'), 23)).toBe('Giáp Tý');
    const r = calculateBazi({ birthSolarDate: '2024-01-01', birthHour: 23 });
    // Lưu ý: engine để 23h vẫn TRONG ngày dân lịch đó (không cộng sang ngày sau).
    expect(pillarStr(r.day)).toBe('Giáp Tý');
    expect(pillarStr(r.hour)).toBe('Giáp Tý');
  });

  it('1990-05-20 00h (ngày Ất Dậu) → giờ Bính Tý (Ất→Bính Tý)', () => {
    expect(hourPillarOf(CAN.indexOf('Ất'), 0)).toBe('Bính Tý');
    const r = calculateBazi({ birthSolarDate: '1990-05-20', birthHour: 0 });
    expect(pillarStr(r.hour)).toBe('Bính Tý');
  });

  it('2000-01-01 12h (ngày Mậu Ngọ) → giờ Mậu Ngọ (Mậu→Nhâm Tý, +Ngọ)', () => {
    // ngày Mậu → giờ Tý = Nhâm(8); giờ Ngọ (branch 6) → Nhâm(8)+6 = Mậu(4) → Mậu Ngọ.
    expect(hourPillarOf(CAN.indexOf('Mậu'), 12)).toBe('Mậu Ngọ');
    const r = calculateBazi({ birthSolarDate: '2000-01-01', birthHour: 12 });
    expect(pillarStr(r.hour)).toBe('Mậu Ngọ');
  });

  it('1984-06-15 06h (ngày Canh Thìn) → giờ Kỷ Mão (Canh→Bính Tý, +Mão)', () => {
    // ngày Canh → giờ Tý = Bính(2); giờ Mão (branch 3) → Bính(2)+3 = Kỷ(5) → Kỷ Mão.
    expect(hourPillarOf(CAN.indexOf('Canh'), 6)).toBe('Kỷ Mão');
    const r = calculateBazi({ birthSolarDate: '1984-06-15', birthHour: 6 });
    expect(pillarStr(r.hour)).toBe('Kỷ Mão');
  });
});

// ── 5. Tàng can (hidden stems, bản khí đứng đầu) ───────────────────────────────

describe('Bát Tự › tàng can mỗi địa chi (bản khí đứng đầu)', () => {
  // Bảng tàng can chuẩn, suy độc lập.
  const expectedHidden: Record<string, string[]> = {
    Tý: ['Quý'],
    Sửu: ['Kỷ', 'Quý', 'Tân'],
    Dần: ['Giáp', 'Bính', 'Mậu'],
    Mão: ['Ất'],
    Thìn: ['Mậu', 'Ất', 'Quý'],
    Tỵ: ['Bính', 'Mậu', 'Canh'],
    Ngọ: ['Đinh', 'Kỷ'],
    Mùi: ['Kỷ', 'Đinh', 'Ất'],
    Thân: ['Canh', 'Nhâm', 'Mậu'],
    Dậu: ['Tân'],
    Tuất: ['Mậu', 'Tân', 'Đinh'],
    Hợi: ['Nhâm', 'Giáp'],
  };

  // 2024-01-01 23h = Quý Mão / Giáp Tý / Giáp Tý / Giáp Tý
  // → trụ tháng/ngày/giờ chi Tý; trụ năm chi Mão.
  it('chi Tý → tàng can [Quý]; chi Mão → [Ất] (2024-01-01 23h)', () => {
    const r = calculateBazi({ birthSolarDate: '2024-01-01', birthHour: 23 });
    for (const p of [r.month, r.day, r.hour]) {
      expect(p.chi).toBe('Tý');
      expect(p.hiddenStems.map((h) => h.can)).toEqual(expectedHidden.Tý);
    }
    expect(r.year.chi).toBe('Mão');
    expect(r.year.hiddenStems.map((h) => h.can)).toEqual(expectedHidden.Mão);
  });

  // 2021-02-06 = Tân Sửu / Canh Dần / Ất Dậu / (12h Ngọ) → chi Sửu, Dần, Dậu, Ngọ.
  it('chi Sửu/Dần/Dậu/Ngọ → tàng can đúng (2021-02-06 12h)', () => {
    const r = calculateBazi({ birthSolarDate: '2021-02-06', birthHour: 12 });
    expect(r.year.chi).toBe('Sửu');
    expect(r.year.hiddenStems.map((h) => h.can)).toEqual(expectedHidden.Sửu);
    expect(r.month.chi).toBe('Dần');
    expect(r.month.hiddenStems.map((h) => h.can)).toEqual(expectedHidden.Dần);
    expect(r.day.chi).toBe('Dậu');
    expect(r.day.hiddenStems.map((h) => h.can)).toEqual(expectedHidden.Dậu);
    expect(r.hour.chi).toBe('Ngọ');
    expect(r.hour.hiddenStems.map((h) => h.can)).toEqual(expectedHidden.Ngọ);
  });

  // 1990-05-20 12h = Canh Ngọ / Tân Tỵ / Ất Dậu / Nhâm Ngọ → chi Ngọ, Tỵ, Dậu, Ngọ.
  it('chi Tỵ → tàng can [Bính, Mậu, Canh] (1990-05-20 12h, trụ tháng Tỵ)', () => {
    const r = calculateBazi({ birthSolarDate: '1990-05-20', birthHour: 12 });
    expect(r.month.chi).toBe('Tỵ');
    expect(r.month.hiddenStems.map((h) => h.can)).toEqual(expectedHidden.Tỵ);
  });
});

// ── 6. Nạp âm (60 hoa giáp) cho trụ NĂM ───────────────────────────────────────

describe('Bát Tự › nạp âm trụ năm (60 hoa giáp)', () => {
  it('Giáp Tý → Hải Trung Kim (1984-06-15, năm Giáp Tý)', () => {
    expect(napAmNameOf('Giáp', 'Tý')).toBe('Hải Trung Kim');
    const r = calculateBazi({ birthSolarDate: '1984-06-15', birthHour: 12 });
    expect(pillarStr(r.year)).toBe('Giáp Tý');
    expect(r.year.napAm.name).toBe('Hải Trung Kim');
    expect(r.year.napAm.element).toBe('Kim');
  });

  it('Canh Tý → Bích Thượng Thổ (2020-06-15, năm Canh Tý)', () => {
    expect(napAmNameOf('Canh', 'Tý')).toBe('Bích Thượng Thổ');
    const r = calculateBazi({ birthSolarDate: '2020-06-15', birthHour: 12 });
    expect(pillarStr(r.year)).toBe('Canh Tý');
    expect(r.year.napAm.name).toBe('Bích Thượng Thổ');
    expect(r.year.napAm.element).toBe('Thổ');
  });

  it('Canh Ngọ → Lộ Bàng Thổ (1990-05-20, năm Canh Ngọ)', () => {
    expect(napAmNameOf('Canh', 'Ngọ')).toBe('Lộ Bàng Thổ');
    const r = calculateBazi({ birthSolarDate: '1990-05-20', birthHour: 12 });
    expect(pillarStr(r.year)).toBe('Canh Ngọ');
    expect(r.year.napAm.name).toBe('Lộ Bàng Thổ');
  });

  it('Tân Sửu → Bích Thượng Thổ (2021-02-06, năm Tân Sửu)', () => {
    expect(napAmNameOf('Tân', 'Sửu')).toBe('Bích Thượng Thổ');
    const r = calculateBazi({ birthSolarDate: '2021-02-06', birthHour: 12 });
    expect(pillarStr(r.year)).toBe('Tân Sửu');
    expect(r.year.napAm.name).toBe('Bích Thượng Thổ');
  });
});

// ── 7. Tích hợp end-to-end: trọn 4 trụ một lá số ──────────────────────────────

describe('Bát Tự › tích hợp 4 trụ (lá số đầy đủ)', () => {
  it('1990-05-20 12:00 → Canh Ngọ · Tân Tỵ · Ất Dậu · Nhâm Ngọ', () => {
    // Năm: Canh Ngọ (1990, sau Lập Xuân). Tháng: tiết Tỵ, Ngũ Hổ Độn(Canh)→Tân Tỵ.
    // Ngày: Ất Dậu (JDN). Giờ: 12h=Ngọ, ngày Ất→Bính Tý, +Ngọ → Nhâm Ngọ.
    const r = calculateBazi({ birthSolarDate: '1990-05-20', birthHour: 12 });
    expect(pillarStr(r.year)).toBe('Canh Ngọ');
    expect(pillarStr(r.month)).toBe('Tân Tỵ');
    expect(pillarStr(r.day)).toBe('Ất Dậu');
    expect(pillarStr(r.hour)).toBe('Nhâm Ngọ');
    expect(r.dayMaster.can).toBe('Ất');
    expect(r.dayMaster.element).toBe('Mộc');
    expect(r.dayMaster.yang).toBe(false); // Ất = âm Mộc
    expect(r.day.tenGod).toBe('Nhật Chủ');
  });

  it('2024-01-01 23:00 → Quý Mão · Giáp Tý · Giáp Tý · Giáp Tý', () => {
    // Năm: 2023 (trước Lập Xuân) = Quý Mão. Tháng: tiết Tý, Ngũ Hổ Độn(Quý)→Giáp Dần,
    // Tý sector 10 → Giáp(0)+10=Giáp(0) → Giáp Tý. Ngày: Giáp Tý. Giờ 23h Tý, ngày
    // Giáp → Giáp Tý.
    const r = calculateBazi({ birthSolarDate: '2024-01-01', birthHour: 23 });
    expect(pillarStr(r.year)).toBe('Quý Mão');
    expect(pillarStr(r.month)).toBe('Giáp Tý');
    expect(pillarStr(r.day)).toBe('Giáp Tý');
    expect(pillarStr(r.hour)).toBe('Giáp Tý');
    expect(r.dayMaster.can).toBe('Giáp');
    expect(r.dayMaster.yang).toBe(true); // Giáp = dương Mộc
  });

  it('elementCount đếm đúng 8 chữ (1990-05-20 12h)', () => {
    // Canh(Kim) Ngọ(Hỏa) · Tân(Kim) Tỵ(Hỏa) · Ất(Mộc) Dậu(Kim) · Nhâm(Thủy) Ngọ(Hỏa)
    // → Kim 3, Hỏa 3, Mộc 1, Thủy 1, Thổ 0. Tổng = 8.
    const r = calculateBazi({ birthSolarDate: '1990-05-20', birthHour: 12 });
    const total = Object.values(r.elementCount).reduce((a, b) => a + b, 0);
    expect(total).toBe(8);
    expect(r.elementCount.Kim).toBe(3);
    expect(r.elementCount.Hỏa).toBe(3);
    expect(r.elementCount.Mộc).toBe(1);
    expect(r.elementCount.Thủy).toBe(1);
    expect(r.elementCount.Thổ).toBe(0);
    expect(r.missing).toEqual(['Thổ']);
  });
});
