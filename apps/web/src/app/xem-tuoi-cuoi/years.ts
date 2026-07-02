/**
 * Per-birth-year landing data for "Xem tuổi cưới".
 *
 * Each year becomes a static SEO route /xem-tuoi-cuoi/sinh-nam-<year>. Toàn bộ
 * nội dung (title/description/FAQ) được DẪN từ kết quả engine thật của đúng năm
 * sinh đó — mỗi trang mang số liệu riêng (can chi, tuổi mụ, Kim Lâu, Tam Tai,
 * năm đẹp gần nhất), không phải trang doorway nhân bản. Brand voice: tính minh
 * bạch để tham khảo, không phán, không bán "giải hạn".
 */

import {
  checkWeddingYear,
  goodYearsFrom,
  scanYears,
  TAM_TAI_YEARS,
  canChiOfYear,
  type WeddingYearResult,
} from '@/lib/xem-tuoi-cuoi';

/** Năm cưới chính của cụm trang (cập nhật mỗi mùa cưới). */
export const TARGET_YEAR = 2026;

/** Các năm sinh có trang riêng — nhóm tuổi cưới phổ biến. */
export const BIRTH_YEARS: number[] = Array.from({ length: 16 }, (_, i) => 1990 + i); // 1990–2005

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
  /** Kết quả cho cô dâu cưới TARGET_YEAR. */
  main: WeddingYearResult;
  /** Kết quả năm kế tiếp để so sánh. */
  next: WeddingYearResult;
  /** Quét 6 năm từ TARGET_YEAR cho bảng so sánh. */
  scan: WeddingYearResult[];
  /** Các năm "thuận" gần nhất. */
  goodYears: number[];
  seoTitle: string;
  seoDescription: string;
  verdictShort: string;
  faqs: { q: string; a: string }[];
}

function verdictShortOf(r: WeddingYearResult): string {
  if (r.kimLau.type && r.tamTai.isTamTai) return `phạm ${r.kimLau.type} và Tam Tai`;
  if (r.kimLau.type) return `phạm ${r.kimLau.type}`;
  if (r.tamTai.isTamTai) return `phạm Tam Tai`;
  if (r.xung.isXung) return `chi năm xung tuổi — cần cân nhắc`;
  return `không phạm Kim Lâu, Tam Tai`;
}

export function buildYearPage(birthYear: number): YearPageData {
  const main = checkWeddingYear(birthYear, TARGET_YEAR);
  const next = checkWeddingYear(birthYear, TARGET_YEAR + 1);
  const scan = scanYears(birthYear, TARGET_YEAR, 6);
  const goodYears = goodYearsFrom(birthYear, TARGET_YEAR);
  const verdictShort = verdictShortOf(main);

  const seoTitle = `Sinh ${birthYear} cưới ${TARGET_YEAR} được không? Kim Lâu, Tam Tai`;
  const seoDescription = `Cô dâu sinh ${birthYear} (${main.birthCanChi.name}) cưới năm ${TARGET_YEAR}: ${verdictShort}. Tuổi mụ ${main.kimLau.ageMu}, tính Kim Lâu, Tam Tai minh bạch. Tham khảo — không phán số mệnh.`;

  const tamTaiYears = tamTaiSolarYears(birthYear, TARGET_YEAR, 12);
  const faqs: { q: string; a: string }[] = [
    {
      q: `Cô dâu sinh năm ${birthYear} cưới năm ${TARGET_YEAR} có phạm Kim Lâu không?`,
      a: main.kimLau.type
        ? `Có, theo cách tính phổ biến: tuổi mụ năm ${TARGET_YEAR} là ${main.kimLau.ageMu} (${TARGET_YEAR} − ${birthYear} + 1), chia 9 dư ${main.kimLau.remainder} → phạm ${main.kimLau.type}. Đây là tập tục dân gian để tham khảo; nhiều gia đình vẫn cưới sau khi cân nhắc kỹ.`
        : `Không. Tuổi mụ năm ${TARGET_YEAR} là ${main.kimLau.ageMu} (${TARGET_YEAR} − ${birthYear} + 1), chia 9 dư ${main.kimLau.remainder} — không rơi vào 1, 3, 6, 8 nên không phạm Kim Lâu.`,
    },
    {
      q: `Tuổi ${main.birthCanChi.chi} (sinh ${birthYear}) gặp Tam Tai vào những năm nào?`,
      a: `Tuổi ${main.birthCanChi.chi} thuộc nhóm gặp Tam Tai vào các năm ${TAM_TAI_YEARS[main.birthCanChi.chi].join(', ')}. Trong giai đoạn ${TARGET_YEAR}–${TARGET_YEAR + 11}, đó là các năm ${tamTaiYears.join(', ')}. Năm ${TARGET_YEAR} (${main.targetCanChi.name}) ${main.tamTai.isTamTai ? 'NẰM TRONG' : 'không nằm trong'} nhóm này.`,
    },
    {
      q: `Chú rể sinh năm ${birthYear} thì tính thế nào?`,
      a: `Theo tục phổ biến, Kim Lâu xét chủ yếu tuổi cô dâu. Với chú rể, các nhà thường xem Tam Tai và năm xung tuổi: sinh ${birthYear} (tuổi ${main.birthCanChi.chi}) năm ${TARGET_YEAR} ${main.tamTai.isTamTai ? `phạm Tam Tai` : `không phạm Tam Tai`}${main.xung.isXung ? ` và chi năm xung với chi tuổi` : ''}. Bạn có thể nhập năm sinh cả hai vào công cụ trên trang để xem cùng lúc.`,
    },
    {
      q: `Nếu phạm hạn thì năm ${TARGET_YEAR} có cưới được không?`,
      a: `Quyết định là của hai bạn và gia đình. Kim Lâu hay Tam Tai là quan niệm dân gian, không phải quy luật khoa học — chúng tôi tính minh bạch để bạn biết rõ mình "phạm" điều gì và vì sao, thay vì nghe phán mơ hồ. ${goodYears.length ? `Nếu gia đình kiêng, các năm gần nhất không phạm hạn thường xét của cô dâu ${birthYear} là ${goodYears.join(', ')}.` : ''} Chúng tôi không bán "lễ giải hạn".`,
    },
  ];

  return { birthYear, slug: slugOf(birthYear), main, next, scan, goodYears, seoTitle, seoDescription, verdictShort, faqs };
}
