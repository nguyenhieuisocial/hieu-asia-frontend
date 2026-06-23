/**
 * Dữ liệu cho cụm SEO "Tam Tai" — hub /tam-tai + 12 trang /tam-tai/[tuoi].
 *
 * THUẦN TÍNH TOÁN — không React, không AI, không backend. Grounded 100% trên
 * engine đã kiểm chứng:
 *   - TAM_TAI_YEARS, canChiOfYear, ANIMAL_BY_CHI, CHI  (lib/xem-tuoi-cuoi)
 *   - ZODIAC, findZodiac                               (lib/hop-tuoi-pairs)
 * ZODIAC là NGUỒN SLUG DUY NHẤT (ty…hoi, Tỵ = "ti") — khớp ZODIAC_LIST sitemap.
 *
 * Tam Tai (phong tục dân gian): 12 con giáp chia 4 nhóm Tam Hợp; mỗi nhóm gặp
 * "Tam Tai" vào 3 năm liền nhau cố định (theo địa chi của năm). Tập tục xem đây
 * là giai đoạn NÊN THẬN TRỌNG hơn với việc trọng đại — KHÔNG phải điềm gở cố định.
 *
 * GIỌNG ON-BRAND: minh bạch cách tính để THAM KHẢO, không phán số mệnh, không hù
 * doạ, không bán lễ "giải hạn".
 */
import { ZODIAC, findZodiac, type Zodiac } from './hop-tuoi-pairs';
import { canChiOfYear, TAM_TAI_YEARS, ANIMAL_BY_CHI, CHI, type Chi } from './xem-tuoi-cuoi';

/** Slug 12 con giáp — khớp ZODIAC_LIST trong sitemap (lưu ý Tỵ = "ti"). */
export const TAM_TAI_SLUGS: string[] = ZODIAC.map((z) => z.slug);

/**
 * Cửa sổ lịch Tam Tai TĨNH (không phụ thuộc "hôm nay") để trang SSG không bao
 * giờ stale. Câu hỏi "năm nay tôi có phạm không" do TamTaiFinder tính ở client.
 */
export const CALENDAR_FROM = 2024;
export const CALENDAR_TO = 2044;

export interface ChiRef {
  /** Slug con giáp (khớp /tam-tai/[tuoi]). */
  slug: string;
  /** Tên địa chi (Tý, Sửu, …). */
  ten: string;
  /** Con vật (Chuột, Trâu, …). */
  animal: string;
}

export interface TamTaiDetail {
  z: Zodiac;
  animal: string;
  /** 3 con giáp cùng nhóm Tam Hợp (gồm chính nó), theo thứ tự địa chi. */
  groupMembers: ChiRef[];
  /** 3 địa chi NĂM bị Tam Tai của nhóm này. */
  tamTaiChis: Chi[];
  /** Các năm dương lịch Tam Tai trong [CALENDAR_FROM, CALENDAR_TO]. */
  calendarYears: number[];
  seoTitle: string;
  seoDescription: string;
  faqs: { q: string; a: string }[];
}

function chiToRef(chi: Chi): ChiRef {
  // Mọi địa chi đều có trong ZODIAC (cùng tập 12) → tìm thấy chắc chắn.
  const z = ZODIAC.find((x) => x.ten === chi)!;
  return { slug: z.slug, ten: z.ten, animal: ANIMAL_BY_CHI[chi] };
}

function membersOf(tamTaiChis: Chi[]): ChiRef[] {
  const key = tamTaiChis.join();
  return (Object.keys(TAM_TAI_YEARS) as Chi[])
    .filter((c) => TAM_TAI_YEARS[c].join() === key)
    .sort((a, b) => CHI.indexOf(a) - CHI.indexOf(b))
    .map(chiToRef);
}

/** Các năm dương lịch Tam Tai cho một địa chi trong khoảng cho trước. */
export function tamTaiCalendarYears(
  chi: Chi,
  from: number = CALENDAR_FROM,
  to: number = CALENDAR_TO,
): number[] {
  const chis = TAM_TAI_YEARS[chi];
  const out: number[] = [];
  for (let y = from; y <= to; y += 1) {
    if (chis.includes(canChiOfYear(y).chi)) out.push(y);
  }
  return out;
}

export function buildTamTai(slug: string): TamTaiDetail | null {
  const z = findZodiac(slug);
  if (!z) return null;
  const chi = z.ten as Chi;
  const tamTaiChis = TAM_TAI_YEARS[chi];
  const groupMembers = membersOf(tamTaiChis);
  const animal = ANIMAL_BY_CHI[chi];
  const calendarYears = tamTaiCalendarYears(chi);
  const memberNames = groupMembers.map((m) => m.ten).join(', ');
  const chiYears = tamTaiChis.join(', ');

  const seoTitle = `Tuổi ${z.ten} phạm Tam Tai năm nào? Cách tính & các năm cần lưu ý`;
  const seoDescription = `Tuổi ${z.ten} (con ${animal}) thuộc nhóm Tam Hợp ${memberNames}, gặp Tam Tai vào các năm ${chiYears}. Xem danh sách năm dương lịch Tam Tai ${CALENDAR_FROM}–${CALENDAR_TO} và cách hiểu đúng — phong tục để tham khảo, không hù dọa.`;

  const faqs = [
    {
      q: `Tuổi ${z.ten} phạm Tam Tai vào những năm nào?`,
      a: `Theo cách tính dân gian, tuổi ${z.ten} thuộc nhóm Tam Hợp ${memberNames} nên gặp Tam Tai vào 3 năm có địa chi ${chiYears}. Quy ra dương lịch trong khoảng ${CALENDAR_FROM}–${CALENDAR_TO}, đó là các năm: ${calendarYears.join(', ')}.`,
    },
    {
      q: 'Tam Tai có phải điềm xấu, có cần cúng giải hạn không?',
      a: 'Không. Tam Tai là một cách tính theo phong tục để THAM KHẢO, không phải lời phán số mệnh — và hieu.asia không bán lễ "giải hạn". Ý nghĩa thực dụng là: trong các năm này nên cẩn trọng hơn với việc trọng đại (cưới hỏi, làm nhà, khai trương, đầu tư lớn) — xem xét cho kỹ rồi hãy quyết.',
    },
    {
      q: `Vì sao 3 con giáp ${memberNames} lại cùng phạm Tam Tai một lúc?`,
      a: `Vì cả ba thuộc cùng một nhóm Tam Hợp — ba con giáp cách nhau 4 năm theo Can Chi. Theo quan niệm, cả nhóm cùng bước vào 3 năm Tam Tai giống nhau, đó là các năm ${chiYears}.`,
    },
    {
      q: 'Phạm Tam Tai thì có cưới hỏi, làm nhà được không?',
      a: 'Được — Tam Tai chỉ là một trong nhiều yếu tố tham khảo, không phải lệnh cấm. Nhiều người vẫn tiến hành việc lớn trong năm Tam Tai sau khi cân nhắc kỹ và chuẩn bị chu đáo. Bạn có thể tra cụ thể ở công cụ Xem tuổi cưới hoặc Xem tuổi làm nhà của hieu.asia.',
    },
  ];

  return { z, animal, groupMembers, tamTaiChis, calendarYears, seoTitle, seoDescription, faqs };
}

export interface TamTaiListItem {
  slug: string;
  ten: string;
  animal: string;
  emoji: string;
}

/** 12 con giáp cho lưới điều hướng ở hub / chân trang chi tiết. */
export function listTamTai(): TamTaiListItem[] {
  return ZODIAC.map((z) => ({
    slug: z.slug,
    ten: z.ten,
    animal: ANIMAL_BY_CHI[z.ten as Chi],
    emoji: z.emoji,
  }));
}

export interface TamHopGroupInfo {
  /** 3 con giáp cùng nhóm Tam Hợp. */
  members: ChiRef[];
  /** 3 địa chi năm Tam Tai của nhóm. */
  tamTaiChis: Chi[];
  /** Các năm dương lịch Tam Tai của nhóm trong cửa sổ tĩnh. */
  calendarYears: number[];
}

/** 4 nhóm Tam Hợp (dùng ở bảng tổng quan của hub). */
export function listTamHopGroups(): TamHopGroupInfo[] {
  const seen = new Set<string>();
  const groups: TamHopGroupInfo[] = [];
  for (const chi of CHI) {
    const tamTaiChis = TAM_TAI_YEARS[chi];
    const key = tamTaiChis.join();
    if (seen.has(key)) continue;
    seen.add(key);
    groups.push({
      members: membersOf(tamTaiChis),
      tamTaiChis,
      calendarYears: tamTaiCalendarYears(chi),
    });
  }
  return groups;
}
