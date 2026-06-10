/**
 * Per-host-year landing data cho "Tuổi xông đất Tết 2027".
 *
 * Mỗi năm sinh gia chủ là một static SEO route /xong-dat/sinh-nam-<year>. Toàn
 * bộ nội dung (title/description/FAQ/considerations) DẪN từ engine thật của
 * đúng năm đó — can chi, mệnh, top tuổi gợi ý, nhóm nên cân nhắc đều khác nhau
 * giữa các năm (cùng chi vẫn khác can → khác mệnh) — không phải doorway nhân
 * bản. Brand voice: minh bạch để tham khảo, không phán, không doạ "xui cả năm".
 */

import { ELEMENTS } from '@/lib/dat-ten-ngu-hanh';
import { yearProfile, type YearProfile } from '@/lib/sinh-con';
import {
  cautionChis,
  topCandidates,
  DEFAULT_TARGET_YEAR,
  type XongDatResult,
} from '@/lib/xong-dat';

/** Năm Tết chính của cụm trang (cập nhật mỗi mùa). Mùng 1 = 06/02/2027. */
export const TARGET_YEAR = DEFAULT_TARGET_YEAR;

/** Các năm sinh gia chủ có trang riêng — nhóm tuổi chủ nhà phổ biến. */
export const HOST_YEARS: number[] = Array.from({ length: 30 }, (_, i) => 1970 + i); // 1970–1999

export function slugOf(year: number): string {
  return `sinh-nam-${year}`;
}

export function yearFromSlug(slug: string): number | null {
  const m = /^sinh-nam-(\d{4})$/.exec(slug);
  if (!m) return null;
  const y = Number(m[1]);
  return HOST_YEARS.includes(y) ? y : null;
}

export interface HostPageData {
  hostYear: number;
  slug: string;
  host: YearProfile;
  /** Năm đích (Đinh Mùi 2027). */
  target: YearProfile;
  /** Top 6 tuổi gợi ý (engine, đa dạng nhóm). */
  top: XongDatResult[];
  /** Nhóm con giáp nên cân nhắc (mức chi, kèm lý do). */
  caution: ReturnType<typeof cautionChis>;
  seoTitle: string;
  seoDescription: string;
  considerations: string[];
  faqs: { q: string; a: string }[];
}

function shortGuest(r: XongDatResult): string {
  return `${r.guest.year} ${r.guest.canChi} (mệnh ${ELEMENTS[r.guest.element].name})`;
}

export function buildHostPage(hostYear: number): HostPageData {
  const host = yearProfile(hostYear)!;
  const target = yearProfile(TARGET_YEAR)!;
  const top = topCandidates(hostYear, TARGET_YEAR, 6);
  const caution = cautionChis(hostYear, TARGET_YEAR);
  const menhName = ELEMENTS[host.element].name;
  const top3 = top.slice(0, 3).map((r) => `${r.guest.year} (${r.guest.canChi})`).join(', ');

  const seoTitle = `Tuổi xông đất 2027 cho gia chủ sinh năm ${hostYear} (${host.canChi}) — gợi ý & cách tính`;
  const seoDescription = `Gia chủ sinh ${hostYear} (${host.canChi}, mệnh ${menhName}) đón Tết Đinh Mùi 2027: gợi ý tuổi xông đất ${top3}… Chấm minh bạch theo tam hợp, lục hợp với chi năm/gia chủ và ngũ hành tương sinh. Tham khảo phong tục, không phán định.`;

  const considerations = [
    `Gia chủ sinh ${hostYear} thuộc năm ${host.canChi} — tuổi ${host.zodiac.ten}, mệnh ${menhName} (${host.napAmName}).`,
    `Tết ${target.canChi} ${TARGET_YEAR}: mùng 1 rơi vào 06/02/2027. Tuổi tính theo năm ÂM lịch — người sinh tháng 1–2 dương (trước Tết) thuộc năm âm liền trước.`,
    `Riêng với chi năm ${target.zodiac.ten}: tuổi Mão, Hợi thuộc nhóm tam hợp; tuổi Ngọ là cặp lục hợp; tuổi Sửu xung, tuổi Tý hại, tuổi Mùi trùng chi năm (Thái Tuế).`,
    `Top gợi ý riêng cho gia chủ ${hostYear}: ${top.map(shortGuest).join(' · ')}.`,
    'Gợi ý là tham khảo phong tục — người xông đất quý nhất vẫn là người vui vẻ, xởi lởi, thật lòng quý gia đình.',
  ];

  const faqs: { q: string; a: string }[] = [
    {
      q: `Gia chủ sinh năm ${hostYear} nên mời tuổi nào xông đất Tết 2027?`,
      a: `Theo cách chấm 3 lớp (chi × năm, chi × gia chủ, mệnh × gia chủ), các tuổi gợi ý hàng đầu: ${top.map(shortGuest).join(', ')}. Điểm cộng đến từ tam hợp/lục hợp với chi năm ${target.canChi} hoặc với tuổi ${host.zodiac.ten} của gia chủ, và mệnh tương sinh với mệnh ${menhName}. Đây là gợi ý tham khảo — sự chân thành của người xông đất mới là điều quý nhất.`,
    },
    {
      q: `Tuổi nào nên cân nhắc khi xông đất nhà gia chủ sinh năm ${hostYear}?`,
      a: caution.length
        ? `Nhóm dân gian thường dè dặt: ${caution.map((cI) => `tuổi ${cI.zodiac.ten} (${cI.reasons.join('; ')})`).join(' · ')}. Cách hiểu lành mạnh: đây là tập tục "đầu xuôi đuôi lọt" để cả nhà yên tâm — không phải lời phán. Nếu người gia đình quý mến rơi vào nhóm này, niềm vui và sự chân thành vẫn quan trọng hơn.`
        : 'Không có nhóm tuổi nào phạm xung, hại hay Thái Tuế với gia chủ và chi năm — bạn có thể thoải mái chọn người vui vẻ, hợp ý gia đình.',
    },
    {
      q: 'Cách chấm "hợp – nên cân nhắc" ở đây dựa trên quy tắc nào?',
      a: `Ba lớp quy tắc cổ điển, tính ra được và công khai thang điểm: (1) chi người xông đất so với chi năm ${target.canChi} — tam hợp/lục hợp là điểm cộng, xung/hại/trùng Thái Tuế là điểm trừ; (2) chi người xông đất so với tuổi gia chủ; (3) mệnh nạp âm hai bên theo vòng tương sinh – tương khắc. Nhập cùng dữ liệu luôn ra cùng kết quả — không "bói mù".`,
    },
    {
      q: 'Mùng 1 Tết Đinh Mùi 2027 là ngày nào dương lịch?',
      a: `Mùng 1 Tết Đinh Mùi rơi vào thứ Bảy, ngày 06/02/2027 dương lịch. Lưu ý tuổi tính theo năm âm: người sinh tháng 1 hoặc đầu tháng 2 dương (trước mùng 1 Tết năm sinh của mình) thuộc năm âm liền trước — nên xác nhận lại can chi trước khi đối chiếu.`,
    },
  ];

  return { hostYear, slug: slugOf(hostYear), host, target, top, caution, seoTitle, seoDescription, considerations, faqs };
}
