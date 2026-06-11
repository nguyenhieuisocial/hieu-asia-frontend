/**
 * Per-birth-year landing data cho "Xem tuổi khai trương / mở hàng".
 *
 * Mỗi năm sinh thành route tĩnh /khai-truong/sinh-nam-<year>. Nội dung
 * (title/description/FAQ) DẪN từ engine thật của đúng năm sinh đó — số liệu
 * riêng (can chi, Tam Tai, xung, các năm hợp gần nhất), không phải doorway
 * nhân bản. Brand voice: tính minh bạch để tham khảo, không phán, không bán
 * "giải hạn / chọn ngày đẹp thu phí".
 */

import {
  checkOpeningYear,
  goodOpeningYearsFrom,
  scanOpeningYears,
  canChiOfYear,
  TAM_TAI_YEARS,
  type OpeningYearResult,
} from '@/lib/khai-truong';

/** Năm khai trương chính của cụm trang (mùa đầu năm). */
export const TARGET_YEAR = 2026;

/** Các năm sinh có trang riêng — nhóm tuổi chủ kinh doanh phổ biến (1970–1999). */
export const BIRTH_YEARS: number[] = Array.from({ length: 30 }, (_, i) => 1970 + i);

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
  /** Kết quả cho chủ khai trương năm TARGET_YEAR. */
  main: OpeningYearResult;
  /** Năm kế tiếp để so sánh. */
  next: OpeningYearResult;
  /** Quét 6 năm từ TARGET_YEAR cho bảng so sánh. */
  scan: OpeningYearResult[];
  /** Các năm "hợp tuổi" gần nhất. */
  goodYears: number[];
  seoTitle: string;
  seoDescription: string;
  verdictShort: string;
  faqs: { q: string; a: string }[];
}

function verdictShortOf(r: OpeningYearResult): string {
  if (r.tamTai.isTamTai) return 'vướng Tam Tai — dân gian kiêng khởi sự';
  if (r.xung.isXung) return 'chi năm xung tuổi — cần cân nhắc';
  if (r.xung.isNamTuoi) return 'năm tuổi (Thái Tuế) — hợp, chỉ lưu ý nhẹ';
  return 'hợp tuổi — không vướng Tam Tai hay xung';
}

export function buildYearPage(birthYear: number): YearPageData {
  const main = checkOpeningYear(birthYear, TARGET_YEAR);
  const next = checkOpeningYear(birthYear, TARGET_YEAR + 1);
  const scan = scanOpeningYears(birthYear, TARGET_YEAR, 6);
  const goodYears = goodOpeningYearsFrom(birthYear, TARGET_YEAR, 4);
  const verdictShort = verdictShortOf(main);

  const seoTitle = `Tuổi ${birthYear} khai trương năm ${TARGET_YEAR} được không? Tính Tam Tai, xung Thái Tuế`;
  const seoDescription = `Chủ sinh ${birthYear} (${main.birthCanChi.name}) khai trương/mở hàng năm ${TARGET_YEAR}: ${verdictShort}. Cách tính minh bạch theo Tam Tai và xung tuổi${goodYears.length ? `; năm hợp gần nhất: ${goodYears.join(', ')}` : ''}. Tham khảo — không phán số mệnh.`;

  const tamTaiYears = tamTaiSolarYears(birthYear, TARGET_YEAR, 12);
  const faqs: { q: string; a: string }[] = [
    {
      q: `Tuổi ${birthYear} khai trương năm ${TARGET_YEAR} có tốt không?`,
      a: `Theo tục dân gian, năm ${TARGET_YEAR} (${main.targetCanChi.name}) với chủ sinh ${birthYear} (${main.birthCanChi.name}): ${verdictShort}. ${
        main.tamTai.isTamTai
          ? 'Tam Tai là 3 năm liên tiếp dân gian kiêng khởi sự, mở mang — nhiều người dời lịch hoặc nhờ người hợp tuổi đứng tên khai trương.'
          : main.xung.isXung
            ? 'Chi năm xung chi tuổi nên nhiều người tránh; nếu vẫn mở, thường chọn ngày giờ hoàng đạo kỹ hơn.'
            : 'Không vướng hạn thường xét nên có thể tiến hành; phần còn lại là chọn NGÀY GIỜ khai trương cho hợp.'
      }`,
    },
    {
      q: `Tuổi ${main.birthCanChi.chi} (sinh ${birthYear}) gặp Tam Tai vào những năm nào?`,
      a: `Tuổi ${main.birthCanChi.chi} thuộc nhóm gặp Tam Tai vào các năm ${TAM_TAI_YEARS[main.birthCanChi.chi].join(', ')}. Trong giai đoạn ${TARGET_YEAR}–${TARGET_YEAR + 11}, đó là các năm ${tamTaiYears.join(', ')}. Năm ${TARGET_YEAR} ${main.tamTai.isTamTai ? 'NẰM TRONG' : 'không nằm trong'} nhóm này.`,
    },
    {
      q: `Vì sao xem tuổi khai trương không tính Kim Lâu hay Hoang Ốc?`,
      a: `Kim Lâu và Hoang Ốc là hai hạn dành cho việc XÂY NHÀ và CƯỚI HỎI (Kim Lâu Thê – Tử – Lục Súc – Bản Mệnh; Hoang Ốc là vòng tốt/xấu của dựng nhà). Khai trương — mở hàng kinh doanh — theo tục chủ yếu xét Tam Tai (kiêng khởi sự) và xung Thái Tuế. Chúng tôi cố ý không gộp hai hạn kia vào để khỏi doạ sai.`,
    },
    {
      q: `Năm ${TARGET_YEAR} chủ ${birthYear} nên chọn ngày khai trương thế nào?`,
      a: `Sau khi xem tuổi theo năm, bước tiếp là chọn NGÀY GIỜ: ưu tiên ngày hoàng đạo, hợp mệnh, tránh ngày Tam Nương / Nguyệt Kỵ / sát chủ. ${goodYears.length ? `Nếu năm nay vướng hạn và không gấp, các năm hợp gần nhất của chủ ${birthYear} là ${goodYears.join(', ')}. ` : ''}Bạn có thể dùng công cụ Xem ngày tốt của hieu.asia để chọn ngày khai trương — chúng tôi không bán "lễ giải hạn".`,
    },
  ];

  return { birthYear, slug: slugOf(birthYear), main, next, scan, goodYears, seoTitle, seoDescription, verdictShort, faqs };
}
