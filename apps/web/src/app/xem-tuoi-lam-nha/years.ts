/**
 * Per-birth-year landing data for "Xem tuổi làm nhà".
 *
 * Mỗi năm sinh thành một route tĩnh /xem-tuoi-lam-nha/sinh-nam-<year>. Toàn bộ
 * nội dung (title/description/FAQ) được DẪN từ kết quả engine thật của đúng
 * năm sinh đó — mỗi trang mang số liệu riêng (can chi, tuổi mụ, Kim Lâu,
 * Hoang Ốc, Tam Tai, năm được tuổi gần nhất), không phải trang doorway nhân
 * bản. Brand voice: tính minh bạch để tham khảo, không phán, không bán
 * "giải hạn".
 */

import {
  checkBuildYear,
  goodBuildYearsFrom,
  scanBuildYears,
  canChiOfYear,
  TAM_TAI_YEARS,
  type BuildYearResult,
} from '@/lib/xem-tuoi-lam-nha';

/** Năm khởi công chính của cụm trang (cập nhật mỗi mùa xây dựng). */
export const TARGET_YEAR = 2026;

/** Các năm sinh có trang riêng — nhóm tuổi xây/sửa nhà phổ biến. */
export const BIRTH_YEARS: number[] = Array.from({ length: 24 }, (_, i) => 1975 + i); // 1975–1998

export function slugOf(year: number): string {
  return `sinh-nam-${year}`;
}

export function yearFromSlug(slug: string): number | null {
  const m = /^sinh-nam-(\d{4})$/.exec(slug);
  if (!m) return null;
  const y = Number(m[1]);
  return BIRTH_YEARS.includes(y) ? y : null;
}

/** Các năm dương lịch rơi vào Tam Tai của tuổi này trong một dải năm. */
export function tamTaiSolarYears(birthYear: number, fromYear: number, count: number): number[] {
  const chis = TAM_TAI_YEARS[canChiOfYear(birthYear).chi];
  return Array.from({ length: count }, (_, i) => fromYear + i).filter((y) =>
    chis.includes(canChiOfYear(y).chi),
  );
}

export interface YearPageData {
  birthYear: number;
  slug: string;
  /** Kết quả cho gia chủ làm nhà TARGET_YEAR. */
  main: BuildYearResult;
  /** Kết quả năm kế tiếp để so sánh. */
  next: BuildYearResult;
  /** Quét 6 năm từ TARGET_YEAR cho bảng so sánh. */
  scan: BuildYearResult[];
  /** Các năm "được tuổi" gần nhất. */
  goodYears: number[];
  seoTitle: string;
  seoDescription: string;
  verdictShort: string;
  faqs: { q: string; a: string }[];
}

function verdictShortOf(r: BuildYearResult): string {
  const hits: string[] = [];
  if (r.kimLau.type) hits.push(`phạm ${r.kimLau.type}`);
  if (r.hoangOc.isPham) hits.push(`phạm Hoang Ốc (${r.hoangOc.cung})`);
  if (r.tamTai.isTamTai) hits.push('phạm Tam Tai');
  if (hits.length > 0) return hits.join(', ');
  if (r.xung.isXung) return 'chi năm xung tuổi — cần cân nhắc';
  return 'không phạm Kim Lâu, Hoang Ốc, Tam Tai';
}

export function buildYearPage(birthYear: number): YearPageData {
  const main = checkBuildYear(birthYear, TARGET_YEAR);
  const next = checkBuildYear(birthYear, TARGET_YEAR + 1);
  const scan = scanBuildYears(birthYear, TARGET_YEAR, 6);
  const goodYears = goodBuildYearsFrom(birthYear, TARGET_YEAR);
  const verdictShort = verdictShortOf(main);

  const seoTitle = `Sinh năm ${birthYear} làm nhà năm ${TARGET_YEAR} được không? Tính Kim Lâu, Hoang Ốc, Tam Tai`;
  const seoDescription = `Gia chủ sinh ${birthYear} (${main.birthCanChi.name}) làm nhà năm ${TARGET_YEAR}: ${verdictShort}. Tuổi mụ ${main.kimLau.ageMu}, cách tính minh bạch từng bước${goodYears.length ? `; năm được tuổi gần nhất: ${goodYears.join(', ')}` : ''}. Tham khảo — không phán số mệnh.`;

  const tamTaiYears = tamTaiSolarYears(birthYear, TARGET_YEAR, 12);
  const faqs: { q: string; a: string }[] = [
    {
      q: `Sinh năm ${birthYear} xây nhà năm ${TARGET_YEAR} có phạm Kim Lâu không?`,
      a: main.kimLau.type
        ? `Có, theo cách tính phổ biến: tuổi mụ năm ${TARGET_YEAR} là ${main.kimLau.ageMu} (${TARGET_YEAR} − ${birthYear} + 1), chia 9 dư ${main.kimLau.remainder} → phạm ${main.kimLau.type}. Đây là tập tục dân gian để tham khảo; nhiều gia đình chọn cách mượn tuổi hoặc vẫn làm sau khi cân nhắc kỹ.`
        : `Không. Tuổi mụ năm ${TARGET_YEAR} là ${main.kimLau.ageMu} (${TARGET_YEAR} − ${birthYear} + 1), chia 9 dư ${main.kimLau.remainder} — không rơi vào 1, 3, 6, 8 nên không phạm Kim Lâu.`,
    },
    {
      q: `Hoang Ốc của tuổi ${birthYear} năm ${TARGET_YEAR} rơi cung nào?`,
      a: `Tuổi mụ ${main.hoangOc.ageMu} đếm vòng Hoang Ốc (chia 6, dư 0 tính là 6) rơi bước ${main.hoangOc.step} → cung ${main.hoangOc.cung}, ${main.hoangOc.note}. ${main.hoangOc.isPham ? 'Ba cung dân gian kiêng là Tam Địa Sát, Ngũ Thọ Tử và Lục Hoang Ốc — tuổi này rơi đúng một trong số đó.' : 'Ba cung được coi là tốt để khởi công là Nhất Cát, Nhì Nghi và Tứ Tấn Tài.'}`,
    },
    {
      q: `Tuổi ${main.birthCanChi.chi} (sinh ${birthYear}) gặp Tam Tai vào những năm nào?`,
      a: `Tuổi ${main.birthCanChi.chi} thuộc nhóm gặp Tam Tai vào các năm ${TAM_TAI_YEARS[main.birthCanChi.chi].join(', ')}. Trong giai đoạn ${TARGET_YEAR}–${TARGET_YEAR + 11}, đó là các năm ${tamTaiYears.join(', ')}. Năm ${TARGET_YEAR} (${main.targetCanChi.name}) ${main.tamTai.isTamTai ? 'NẰM TRONG' : 'không nằm trong'} nhóm này.`,
    },
    {
      q: `Nếu phạm hạn mà vẫn cần xây năm ${TARGET_YEAR} thì sao?`,
      a: `Dân gian có tục "mượn tuổi": nhờ một người thân/quen (thường là nam giới lớn tuổi hơn, không phạm Kim Lâu, Hoang Ốc, Tam Tai năm đó) đứng ra khởi công thay, làm giấy bán nhà tượng trưng rồi chuộc lại khi xong. Chúng tôi giải thích tục này minh bạch để bạn hiểu — còn quyết định vẫn nên dựa trên tài chính, giấy phép và mùa thi công. ${goodYears.length ? `Nếu gia đình kiêng và không gấp, các năm gần nhất gia chủ ${birthYear} không phạm hạn thường xét là ${goodYears.join(', ')}.` : ''} Chúng tôi không bán "lễ giải hạn".`,
    },
  ];

  return { birthYear, slug: slugOf(birthYear), main, next, scan, goodYears, seoTitle, seoDescription, verdictShort, faqs };
}
