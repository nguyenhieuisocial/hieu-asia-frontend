/**
 * Bài học /learn/tiet-khi — 24 TIẾT KHÍ.
 *
 * GROUNDING — KHÔNG con số nào trên trang được gõ tay; mọi ngày, giờ, khoảng cách
 * và trụ can chi do engine trong repo tính lúc dựng trang: `julianDay()` +
 * `sunLongitude()` của lib/western-astrology.ts (Meeus, sai số Mặt Trời < 0,01°)
 * — chính engine lib/bazi.ts dùng để dò tiết khí, ở đây dò bước 15° (24 mốc) thay
 * vì 30° (12 mốc), cùng phép chia đôi như `solarTermJD()`; hàm đó không export
 * nên phải dựng lại (`solveTermJd`). Cộng thêm `monthPillarOf()`,
 * `calculateBazi()`, `CHI` (lib/bazi.ts) và `solarToLunar()` (lib/ngay-kieng-ky.ts,
 * Hồ Ngọc Đức, múi giờ +7). /tu-vi-thang và lib/tu-vi-thang-data.ts dùng ĐÚNG
 * monthPillarOf đó nên bảng ở đây không thể lệch với công cụ.
 *
 * PHÂN VAI (chống trùng — đã đối chiếu từng dòng với hai bài kề): tháng nhuận /
 * Meton / múi giờ Tết lệch / can chi ngày thuộc /learn/lich-am-duong; nhật–nguyệt
 * thực và ý nghĩa thiên văn của bốn điểm phân – chí thuộc /learn/thien-van — cả
 * hai ở đây chỉ nhắc một câu rồi trỏ link. Bài này SỞ HỮU: 24 mốc cách nhau 15°
 * hoàng kinh nên thuộc LỊCH DƯƠNG; tên gọi và nghĩa nông lịch; 12 Tiết ↔ 12 Trung
 * khí; và trụ tháng Bát Tự đổi tại tiết khí, không đổi vào mùng 1 âm lịch.
 *
 * FAQ cố ý KHÁC bộ câu hỏi của công cụ /tu-vi-thang. Giọng: dữ kiện thiên văn
 * tính được ĐỨNG RIÊNG với lớp phong tục gắn lên nó; không phán ngày tốt xấu.
 */

import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@hieu-asia/ui';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { relatedLearnLenses } from '@/lib/learn/related';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, course, faqPage } from '@/lib/seo/jsonld';
import { julianDay, sunLongitude } from '@/lib/western-astrology';
import { CHI, calculateBazi, monthPillarOf } from '@/lib/bazi';
import { solarToLunar } from '@/lib/ngay-kieng-ky';
import {
  TietKhiFrame,
  TietKhiDepth,
  TietKhiRecall,
  TietKhiChecklist,
  TietKhiWhys,
} from './_active-learning';

export const metadata: Metadata = {
  // ≤48 ký tự: root layout nối thêm " · hieu.asia" (12) và seo-guard chặn ở 60.
  title: '24 tiết khí — vì sao chúng là lịch dương',
  description:
    '24 tiết khí là 24 mốc cách nhau 15° trên đường đi của Mặt Trời, nên bám lịch dương chứ không phải lịch âm. Bảng 24 tiết, phân biệt Tiết và Trung khí.',
  alternates: { canonical: 'https://hieu.asia/learn/tiet-khi' },
};

// ── Hằng số ─────────────────────────────────────────────────────────
// Cửa sổ quét ĐẶT CỨNG (không dùng năm hiện tại) để trang cho ra cùng một bảng ở
// mọi lần dựng — số liệu trong bài không được đổi thầm giữa hai lần deploy.
const SWEEP_FROM = 2020;
const SWEEP_TO = 2035;
const SWEEP_YEARS = Array.from({ length: SWEEP_TO - SWEEP_FROM + 1 }, (_, i) => SWEEP_FROM + i);

/** Năm dương lịch dùng cho các bảng và ví dụ (nằm trong cửa sổ quét). */
const DEMO_YEAR = 2026;
/** Độ dài năm chí tuyến (ngày) — dùng để quy sai số góc ra sai số thời gian. */
const TROPICAL_YEAR_DAYS = 365.2422;
/** Sai số góc đã kiểm chứng của engine Mặt Trời — chép từ đầu western-astrology.ts. */
const SUN_ACCURACY_DEG = 0.01;

const mod = (n: number, m: number) => ((n % m) + m) % m;
const pad = (n: number) => String(n).padStart(2, '0');
const vn = (x: number, d = 2) => x.toFixed(d).replace('.', ',');

// ── Engine: dò 24 mốc tiết khí ──────────────────────────────────────

/** Chênh lệch có dấu giữa hoàng kinh Mặt Trời và mốc `lon`, quy về (−180, 180]. */
function sunDelta(jd: number, lon: number): number {
  let d = sunLongitude(jd) - lon;
  while (d > 180) d -= 360;
  while (d <= -180) d += 360;
  return d;
}

/**
 * Julian Day (UTC) của lần Mặt Trời đi qua hoàng kinh `lon` trong năm `year`:
 * quét từng ngày tìm khoảng chứa nghiệm rồi chia đôi 50 lần. Mỗi hoàng kinh được
 * cắt đúng MỘT lần mỗi năm nên vòng lặp luôn dừng.
 */
function solveTermJd(year: number, lon: number): number {
  const start = julianDay(year, 1, 1, 0);
  const end = julianDay(year + 1, 1, 1, 0);
  for (let jd = start; jd < end; jd += 1) {
    if (sunDelta(jd, lon) < 0 && sunDelta(jd + 1, lon) >= 0) {
      let lo = jd;
      let hi = jd + 1;
      for (let i = 0; i < 50; i++) {
        const mid = (lo + hi) / 2;
        if (sunDelta(lo, lon) * sunDelta(mid, lon) <= 0) hi = mid;
        else lo = mid;
      }
      return (lo + hi) / 2;
    }
  }
  return start; // không xảy ra: Mặt Trời quét trọn 360° trong một năm.
}

// Mỗi cặp (năm, hoàng kinh) chỉ dò một lần cho cả trang.
const termJdCache = new Map<string, number>();
function termJd(year: number, lon: number): number {
  const key = `${year}:${lon}`;
  const hit = termJdCache.get(key);
  if (hit !== undefined) return hit;
  const jd = solveTermJd(year, lon);
  termJdCache.set(key, jd);
  return jd;
}

interface VnMoment {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

/** Julian Day (UTC) → thời khắc dân sự giờ Việt Nam (UTC+7), làm tròn tới phút. */
function toVn(jd: number): VnMoment {
  const d = new Date(Math.round(((jd - 2440587.5) * 1440 + 420) * 60_000));
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
  };
}

const fmtDate = (v: VnMoment) => `${pad(v.day)}/${pad(v.month)}/${v.year}`;
const fmtTime = (v: VnMoment) => `${pad(v.hour)}:${pad(v.minute)}`;
const dayKey = (v: VnMoment) => (v.month - 1) * 31 + v.day;

/** Khoảng ngày–tháng mà một tập thời khắc rơi vào, vd "3–4/2". */
function dayRangeOf(ms: VnMoment[]): string {
  const lo = ms.reduce((a, b) => (dayKey(b) < dayKey(a) ? b : a));
  const hi = ms.reduce((a, b) => (dayKey(b) > dayKey(a) ? b : a));
  if (lo.month !== hi.month) return `${lo.day}/${lo.month} – ${hi.day}/${hi.month}`;
  return lo.day === hi.day ? `${lo.day}/${lo.month}` : `${lo.day}–${hi.day}/${lo.month}`;
}

/** Bề rộng (ngày) của khoảng trên — để so "mốc đứng yên" với "mốc trôi". */
const spanDaysOf = (ms: VnMoment[]) =>
  Math.max(...ms.map(dayKey)) - Math.min(...ms.map(dayKey));

// ── 24 tên gọi + hoàng kinh định nghĩa ──────────────────────────────
// ĐÂY là phần duy nhất viết tay, và nó là ĐỊNH NGHĨA chứ không phải kết quả: mỗi
// tiết khí ĐƯỢC ĐỊNH NGHĨA bằng một giá trị hoàng kinh, ngày tháng bên dưới suy
// ra từ đó. Xếp từ Lập Xuân (315°) cho khớp `sector 0 = tháng Dần` của bazi.ts.
interface TermDef {
  /** Hoàng kinh (kinh độ hoàng đạo) của Mặt Trời tại mốc này, độ. */
  lon: number;
  name: string;
  han: string;
  /** Nghĩa nông lịch gốc — mô tả khí hậu lưu vực Hoàng Hà, không phải Việt Nam. */
  meaning: string;
}

const TERM_DEFS: TermDef[] = [
  { lon: 315, name: 'Lập Xuân', han: '立春', meaning: 'Mở đầu mùa xuân theo lịch nhà nông.' },
  { lon: 330, name: 'Vũ Thủy', han: '雨水', meaning: 'Mưa thay dần cho tuyết, đất ẩm lại.' },
  { lon: 345, name: 'Kinh Trập', han: '惊蛰', meaning: 'Sấm đầu mùa, sâu bọ hết ngủ đông.' },
  { lon: 0, name: 'Xuân Phân', han: '春分', meaning: 'Ngày và đêm dài gần bằng nhau.' },
  { lon: 15, name: 'Thanh Minh', han: '清明', meaning: 'Trời trong, khí mát; gắn với tục tảo mộ.' },
  { lon: 30, name: 'Cốc Vũ', han: '谷雨', meaning: 'Mưa rào tưới cho hạt giống mới gieo.' },
  { lon: 45, name: 'Lập Hạ', han: '立夏', meaning: 'Mở đầu mùa hè theo lịch nhà nông.' },
  { lon: 60, name: 'Tiểu Mãn', han: '小满', meaning: 'Hạt ngũ cốc bắt đầu chắc nhưng chưa đầy.' },
  { lon: 75, name: 'Mang Chủng', han: '芒种', meaning: 'Lúa trổ bông có râu; vào vụ gặt và cấy.' },
  { lon: 90, name: 'Hạ Chí', han: '夏至', meaning: 'Ngày dài nhất năm ở bắc bán cầu.' },
  { lon: 105, name: 'Tiểu Thử', han: '小暑', meaning: 'Nắng nóng bắt đầu, chưa tới đỉnh.' },
  { lon: 120, name: 'Đại Thử', han: '大暑', meaning: 'Đỉnh nóng của năm.' },
  { lon: 135, name: 'Lập Thu', han: '立秋', meaning: 'Mở đầu mùa thu theo lịch nhà nông.' },
  { lon: 150, name: 'Xử Thử', han: '处暑', meaning: 'Cái nóng lui dần ("xử" là dừng lại).' },
  { lon: 165, name: 'Bạch Lộ', han: '白露', meaning: 'Sương trắng đọng sớm mai khi đêm đã mát.' },
  { lon: 180, name: 'Thu Phân', han: '秋分', meaning: 'Ngày và đêm lại dài gần bằng nhau.' },
  { lon: 195, name: 'Hàn Lộ', han: '寒露', meaning: 'Sương lạnh, nhiệt độ hạ rõ.' },
  { lon: 210, name: 'Sương Giáng', han: '霜降', meaning: 'Bắt đầu có sương giá ở vùng lạnh.' },
  { lon: 225, name: 'Lập Đông', han: '立冬', meaning: 'Mở đầu mùa đông theo lịch nhà nông.' },
  { lon: 240, name: 'Tiểu Tuyết', han: '小雪', meaning: 'Tuyết nhẹ ở vùng ôn đới phương Bắc.' },
  { lon: 255, name: 'Đại Tuyết', han: '大雪', meaning: 'Tuyết dày, rét vào sâu.' },
  { lon: 270, name: 'Đông Chí', han: '冬至', meaning: 'Đêm dài nhất năm ở bắc bán cầu.' },
  { lon: 285, name: 'Tiểu Hàn', han: '小寒', meaning: 'Rét bắt đầu.' },
  { lon: 300, name: 'Đại Hàn', han: '大寒', meaning: 'Rét đậm nhất trong năm.' },
];

/**
 * Là "Tiết" (mốc mở một tháng Bát Tự) hay "Trung khí"? SUY từ đúng quy tắc của
 * lib/bazi.ts: cung tháng bắt đầu ở 315° + 30°k. Không tra bảng viết tay.
 */
const isTiet = (lon: number) => mod(lon - 315, 30) === 0;

/** Địa chi của tháng Bát Tự mà một Tiết mở ra — đúng công thức monthPillarOf(). */
const chiOpenedBy = (lon: number) => CHI[mod(mod(lon - 315, 360) / 30 + 2, 12)]!;

interface TermRow extends TermDef {
  kind: 'tiet' | 'trung';
  /** Khoảng ngày dương lịch mốc này rơi vào, quét SWEEP_FROM–SWEEP_TO. */
  dayRange: string;
  spanDays: number;
}

const TERMS: TermRow[] = TERM_DEFS.map((def) => {
  const ms = SWEEP_YEARS.map((y) => toVn(termJd(y, def.lon)));
  return {
    ...def,
    kind: isTiet(def.lon) ? 'tiet' : 'trung',
    dayRange: dayRangeOf(ms),
    spanDays: spanDaysOf(ms),
  };
});

const TIET_ROWS = TERMS.filter((t) => t.kind === 'tiet');
const TRUNG_ROWS = TERMS.filter((t) => t.kind === 'trung');
const LAP_XUAN = TERMS.find((t) => t.name === 'Lập Xuân')!;

// ── Khoảng cách giữa hai tiết khí liên tiếp ─────────────────────────
// Chia đều theo GÓC không có nghĩa là chia đều theo NGÀY. Đo thẳng bằng engine.
const GAPS = (() => {
  const seq = SWEEP_YEARS.flatMap((y) =>
    TERM_DEFS.map((d) => ({ name: d.name, jd: termJd(y, d.lon) })),
  ).sort((a, b) => a.jd - b.jd);
  return seq
    .slice(1)
    .map((cur, i) => ({ from: seq[i]!.name, to: cur.name, days: cur.jd - seq[i]!.jd }));
})();

const GAP_MIN = GAPS.reduce((a, b) => (b.days < a.days ? b : a));
const GAP_MAX = GAPS.reduce((a, b) => (b.days > a.days ? b : a));
const GAP_MEAN = GAPS.reduce((s, g) => s + g.days, 0) / GAPS.length;
/** Một "tháng tiết khí" = hai chặng liên tiếp. */
const SOLAR_MONTH_DAYS = GAP_MEAN * 2;
/** Sai số góc của engine quy ra phút (Mặt Trời đi 360° trong một năm chí tuyến). */
const TOLERANCE_MIN = Math.round((SUN_ACCURACY_DEG / (360 / TROPICAL_YEAR_DAYS)) * 1440);

// ── Đối chứng: Lập Xuân bám lịch dương, Tết thì không ────────────────

/** Ngày dương lịch của mùng 1 Tết (mùng 1 tháng Giêng, không nhuận) trong năm. */
function tetOf(year: number): VnMoment {
  for (let m = 1; m <= 2; m++) {
    const last = new Date(Date.UTC(year, m, 0)).getUTCDate();
    for (let d = 1; d <= last; d++) {
      const l = solarToLunar(d, m, year);
      if (l.day === 1 && l.month === 1 && !l.leap) {
        return { year, month: m, day: d, hour: 0, minute: 0 };
      }
    }
  }
  return { year, month: 1, day: 1, hour: 0, minute: 0 }; // không xảy ra trong 2020–2035.
}

const TET_MOMENTS = SWEEP_YEARS.map(tetOf);
const TET_RANGE = dayRangeOf(TET_MOMENTS);
const TET_SPAN_DAYS = spanDaysOf(TET_MOMENTS);
const DEMO_TET = tetOf(DEMO_YEAR);

// ── Mùng 1 âm lịch vs ngày đổi trụ tháng (DEMO_YEAR) ─────────────────
const MONTH_SWITCH = Array.from({ length: 12 }, (_, i) => {
  const month = i + 1;
  const last = new Date(Date.UTC(DEMO_YEAR, month, 0)).getUTCDate();
  const days = Array.from({ length: last }, (_, k) => k + 1);
  const lunarFirst = days.find((d) => solarToLunar(d, month, DEMO_YEAR).day === 1);
  const labels = days.map((d) => monthPillarOf(DEMO_YEAR, month, d).label);
  const at = labels.findIndex((l, k) => k > 0 && l !== labels[k - 1]);
  return {
    month,
    lunarFirst,
    lunarMonthNo: lunarFirst ? solarToLunar(lunarFirst, month, DEMO_YEAR).month : null,
    switchDay: at > 0 ? at + 1 : null,
    pillars: at > 0 ? `${labels[at - 1]} → ${labels[at]}` : labels[0]!,
  };
});

const nums = (xs: (number | undefined | null)[]) => xs.filter((d): d is number => !!d);
const SWITCH_DAYS = nums(MONTH_SWITCH.map((r) => r.switchDay));
const LUNAR_DAYS = nums(MONTH_SWITCH.map((r) => r.lunarFirst));
const SWITCH_MIN = Math.min(...SWITCH_DAYS);
const SWITCH_MAX = Math.max(...SWITCH_DAYS);

// CỬA SỔ RỦI RO cho lời khuyên "sinh vào khoảng ngày nào thì giờ sinh mới quan
// trọng" phải suy từ chính NGÀY CHỨA MỐC TIẾT, không suy từ SWITCH_MIN/MAX ở trên.
// Lý do: switchDay đo bằng monthPillarOf(), mà hàm đó chốt lúc 12h trưa VN — nó trả
// lời "ngày đầu tiên mà đến trưa trụ đã đổi", lệch một bậc so với "ngày mốc rơi vào".
// Ví dụ phản chứng thật: Lập Xuân 2025 rơi 03/02 lúc 21:08, sinh 11h ngày 3 ra năm
// Giáp Thìn/tháng Đinh Sửu còn sinh 23h cùng ngày ra Ất Tỵ/Mậu Dần — ngày 3 nằm
// NGOÀI khoảng switch (4–9) mà vẫn đổi cả trụ tháng lẫn trụ năm.
const TERM_DAYS = SWEEP_YEARS.flatMap((y) => TIET_ROWS.map((t) => toVn(termJd(y, t.lon)).day));
const RISK_MIN = Math.min(...TERM_DAYS);
const RISK_MAX = Math.max(...TERM_DAYS);
const LUNAR_MIN = Math.min(...LUNAR_DAYS);
const LUNAR_MAX = Math.max(...LUNAR_DAYS);

// ── Ví dụ sinh sát ranh giới tiết khí ───────────────────────────────
// Ba ca chạy qua calculateBazi() — cùng engine của /la-so-bat-tu. Hai giờ sinh ôm
// hai bên thời khắc tiết khí đã tính ở trên, nên ví dụ CHẮC CHẮN minh hoạ được
// điều đang nói (kết quả do engine trả về, không chép tay).
function boundaryCase(termName: string, date: string, h1: number, h2: number) {
  const [y] = date.split('-').map(Number) as [number, number, number];
  const def = TERM_DEFS.find((t) => t.name === termName)!;
  const side = (hour: number) => {
    const c = calculateBazi({ birthSolarDate: date, birthHour: hour, birthMinute: 0 });
    return { hour, year: `${c.year.can} ${c.year.chi}`, month: `${c.month.can} ${c.month.chi}` };
  };
  const at = toVn(termJd(y, def.lon));
  return { termName, termAt: at, dateLabel: fmtDate(at), sides: [side(h1), side(h2)] };
}

const BOUNDARY_CASES = [
  boundaryCase('Lập Thu', '2026-08-07', 17, 20),
  boundaryCase('Tiểu Hàn', '2027-01-05', 20, 22),
  boundaryCase('Lập Xuân', '2026-02-04', 1, 5),
];
const LAP_THU_CASE = BOUNDARY_CASES[0]!;
const LAP_XUAN_CASE = BOUNDARY_CASES[2]!;

// ── FAQ ─────────────────────────────────────────────────────────────
// Dùng CHUNG cho FAQPage JSON-LD và phần hiển thị → chữ schema === chữ trên
// trang. Câu hỏi cố ý khác bộ FAQ của /tu-vi-thang. Mọi số đều nội suy từ engine,
// vì chuỗi này đi thẳng vào JSON-LD và không ai review lại được bằng mắt.
const FAQS = [
  {
    q: '24 tiết khí là gì, và chúng thuộc lịch âm hay lịch dương?',
    a: 'Tiết khí là 24 cột mốc chia đường đi biểu kiến của Mặt Trời quanh bầu trời thành 24 chặng bằng nhau, mỗi chặng 15 độ hoàng kinh. Vì mốc được xác định hoàn toàn bằng vị trí Mặt Trời, tiết khí thuộc về phần dương của lịch, không phải phần âm. Đây là chỗ nhầm phổ biến nhất: nhiều người nghe tên Hán Việt nên tưởng tiết khí là mốc của lịch âm, trong khi Mặt Trăng không hề tham gia vào định nghĩa của chúng. Lịch âm dương Việt Nam có mượn tiết khí làm khung, nhưng mượn không có nghĩa là sinh ra từ đó.',
  },
  {
    q: 'Vì sao ngày của một tiết khí gần như cố định trên lịch dương?',
    a: `Vì cả hai đều đo cùng một thứ. Tiết khí được định nghĩa bằng vị trí Mặt Trời, còn lịch Gregory được thiết kế để bám năm chí tuyến, nên hai hệ trôi cùng nhịp. Hệ quả kiểm chứng được: quét ${SWEEP_YEARS.length} năm liên tiếp từ ${SWEEP_FROM} tới ${SWEEP_TO}, Lập Xuân luôn rơi vào ngày ${LAP_XUAN.dayRange} dương lịch, tức chỉ xê dịch ${LAP_XUAN.spanDays} ngày. Trong cùng khoảng ấy, mùng 1 Tết là mốc của lịch âm dương thì chạy từ ${TET_RANGE}, xê dịch tới ${TET_SPAN_DAYS} ngày. Một mốc gần như đứng yên, mốc kia trôi gần trọn một tháng.`,
  },
  {
    q: 'Tiết và Trung khí khác nhau thế nào?',
    a: `24 mốc xen kẽ nhau thành hai nhóm, mỗi nhóm 12. Nhóm thứ nhất gọi là Tiết, gồm ${TIET_ROWS.map((t) => t.name).join(', ')} — đây là các mốc mở 12 tháng trong Bát Tự, tức ranh giới của trụ tháng. Nhóm thứ hai gọi là Trung khí, gồm ${TRUNG_ROWS.map((t) => t.name).join(', ')} — chúng nằm giữa tháng và được lịch âm dương dùng làm điểm neo để đặt tháng nhuận. Trong mỗi nhóm các mốc cách nhau 30 độ, còn giữa hai nhóm lệch nhau 15 độ, nên chúng đan xen đều đặn.`,
  },
  {
    q: 'Sinh sát ranh giới tiết khí thì trụ tháng Bát Tự tính ra sao?',
    a: `Tính theo thời khắc tiết khí, chứ không theo ngày trên lịch. Trụ tháng đổi đúng lúc Mặt Trời chạm mốc Tiết, mà mốc đó có giờ và phút cụ thể. Ví dụ Lập Thu năm ${DEMO_YEAR} rơi vào ${fmtTime(LAP_THU_CASE.termAt)} ngày ${LAP_THU_CASE.dateLabel} giờ Việt Nam: người sinh lúc ${pad(LAP_THU_CASE.sides[0]!.hour)} giờ hôm đó có trụ tháng ${LAP_THU_CASE.sides[0]!.month}, còn người sinh lúc ${pad(LAP_THU_CASE.sides[1]!.hour)} giờ cùng ngày đã sang trụ tháng ${LAP_THU_CASE.sides[1]!.month}. Cùng ngày sinh, cùng trụ ngày, nhưng khác trụ tháng. Vì vậy khi lập lá số cho người sinh sát ranh giới, giờ sinh chính xác là bắt buộc.`,
  },
  {
    q: 'Khoảng cách giữa hai tiết khí có đúng 15 ngày không?',
    a: `Không. 24 tiết khí chia đều theo góc chứ không đều theo thời gian. Quỹ đạo Trái Đất là hình elip nên tốc độ đi trên quỹ đạo thay đổi trong năm: nhanh nhất khi Trái Đất ở gần Mặt Trời nhất, vào khoảng đầu tháng 1, và chậm nhất khi ở xa nhất, vào khoảng đầu tháng 7. Đo bằng engine trên ${SWEEP_YEARS.length} năm, chặng ngắn nhất là ${vn(GAP_MIN.days)} ngày, đúng đoạn ${GAP_MIN.from} sang ${GAP_MIN.to}; chặng dài nhất là ${vn(GAP_MAX.days)} ngày, đúng đoạn ${GAP_MAX.from} sang ${GAP_MAX.to}. Trung bình là ${vn(GAP_MEAN)} ngày, nên nói 15 ngày chỉ là nói tròn.`,
  },
  {
    q: 'Lập Xuân có phải là Tết không?',
    a: `Không, và hai mốc này thường lệch nhau. Lập Xuân là một tiết khí, xác định bằng vị trí Mặt Trời nên luôn rơi vào ngày ${LAP_XUAN.dayRange} dương lịch. Mùng 1 Tết là mốc của lịch âm dương, xác định bằng ngày sóc nên trôi trong khoảng ${TET_RANGE}. Trong Bát Tự trụ năm đổi tại Lập Xuân, còn trong lịch âm năm âm đổi tại Tết. Ví dụ năm ${DEMO_YEAR}, Lập Xuân rơi ngày ${LAP_XUAN_CASE.dateLabel} còn mùng 1 Tết mãi tới ${pad(DEMO_TET.day)}/${pad(DEMO_TET.month)}, nên người sinh giữa hai mốc sẽ thấy tuổi âm và trụ năm Bát Tự không cùng một con giáp. Đó không phải lỗi tính toán mà là hai quy ước khác nhau.`,
  },
  {
    q: 'Tên 24 tiết khí có mô tả đúng thời tiết Việt Nam không?',
    a: 'Không hoàn toàn. Hệ tiết khí hình thành từ quan sát khí hậu vùng lưu vực Hoàng Hà ở Trung Quốc, nên các tên như Tiểu Tuyết, Đại Tuyết, Sương Giáng mô tả một mùa đông có tuyết mà phần lớn Việt Nam không có. Phần thiên văn của tiết khí đúng ở mọi nơi vì nó chỉ nói về vị trí Mặt Trời; phần mô tả thời tiết thì gắn với một vùng địa lý cụ thể. Đọc bảng 24 tiết khí nên tách hai lớp đó ra.',
  },
  {
    q: 'Ngày tiết khí có phải là ngày tốt để làm việc lớn không?',
    a: 'Bản thân tiết khí không nói gì về tốt xấu. Nó chỉ là một thời khắc thiên văn tính trước được, giống như thời điểm mặt trời mọc. Những lời khuyên kiểu tháng này nên làm gì, ngày này nên kiêng gì là lớp phong tục và kinh nghiệm nông lịch được gắn thêm lên các mốc ấy về sau, và lớp đó có nhiều dị bản khác nhau giữa các vùng. hieu.asia trình bày tách bạch hai lớp để bạn biết mình đang dựa vào cái gì.',
  },
];

const JSONLD = [
  article({
    headline: '24 tiết khí: 24 mốc của Mặt Trời, không phải của Mặt Trăng',
    description:
      '24 tiết khí là 24 mốc cách nhau 15° hoàng kinh trên đường đi biểu kiến của Mặt Trời, nên bám lịch dương. Bảng 24 tiết, phân biệt 12 Tiết với 12 Trung khí, và vì sao trụ tháng Bát Tự đổi tại tiết khí chứ không đổi vào mùng 1 âm lịch.',
    url: '/learn/tiet-khi',
    type: 'TechArticle',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: '24 tiết khí', url: '/learn/tiet-khi' },
  ]),
  faqPage(FAQS),
  course({
    name: '24 tiết khí — vì sao chúng thuộc lịch dương',
    description:
      '24 tiết khí là gì, tên và ý nghĩa từng tiết, phân biệt 12 Tiết với 12 Trung khí, và ứng dụng quan trọng nhất: trụ tháng trong Bát Tự đổi tại tiết khí.',
    url: '/learn/tiet-khi',
  }),
];

// ── Trình bày ───────────────────────────────────────────────────────
// Bốn bảng của trang chỉ khác nhau ở dữ liệu nên gom một component, đúng cách
// /learn/lich-am-duong đang làm.
function DataTable({
  head,
  rows,
  caption,
  minWidth = 520,
}: {
  head: string[];
  rows: React.ReactNode[][];
  caption: string;
  minWidth?: number;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left text-sm" style={{ minWidth }}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-border bg-card/60">
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {rows.map((cells, i) => (
            <tr key={i} className="border-b border-border/60 last:border-b-0">
              {cells.map((c, j) => (
                <td
                  key={j}
                  className={`px-4 py-2 ${j === 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="text-gold-700 underline-offset-4 hover:underline">
    {children}
  </Link>
);

export default function LearnTietKhiPage() {
  return (
    <LearnArticle
      eyebrow="LỊCH PHÁP · MẶT TRỜI"
      title={
        <>
          24 tiết khí{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            (lịch của Mặt Trời)
          </span>
        </>
      }
      standfirst={
        <>
          Lập Xuân, Thanh Minh, Đông Chí — những cái tên Hán Việt khiến hầu hết mọi người xếp tiết
          khí vào lịch âm. Thật ra chúng là 24 vạch chia đều đường đi của Mặt Trời, nên chúng thuộc
          về lịch dương. Bài này chỉ ra vì sao, và vì sao điều đó quyết định luôn cách tính trụ tháng
          trong Bát Tự.
        </>
      }
      readMeta="10 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: '24 tiết khí' },
      ]}
      relatedLenses={relatedLearnLenses('tiet-khi')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Công cụ Tử vi tháng lấy trụ tháng theo đúng mốc tiết khí nói trong bài, rồi đối chiếu với chi tuổi của bạn và liệt kê những ngày hợp, ngày xung trong tháng.',
        href: '/tu-vi-thang',
        label: 'Mở Tử vi tháng theo can chi',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <TietKhiFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Tiết khí là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                <strong>Tiết khí</strong> là 24 cột mốc chia{' '}
                <strong>đường đi biểu kiến của Mặt Trời</strong> quanh bầu trời thành 24 chặng bằng
                nhau. Vòng tròn ấy có 360°, chia cho 24 là <strong>15°</strong> mỗi chặng — mỗi lần
                Mặt Trời đi qua một vạch, ta có một tiết khí. Từ đó suy ra điều quan trọng nhất của
                cả bài: <strong>tiết khí được xác định hoàn toàn bằng vị trí Mặt Trời</strong>. Mặt
                Trăng không có mặt trong định nghĩa, nên tiết khí{' '}
                <strong>thuộc về phần dương của lịch</strong> — cùng loại với ngày trên tờ lịch tây,
                chứ không cùng loại với mùng 1 hay ngày rằm.
              </p>
              <p>
                Cách kiểm chứng gọn nhất là đặt hai mốc cạnh nhau. Quét {SWEEP_YEARS.length} năm liên
                tiếp ({SWEEP_FROM}–{SWEEP_TO}) bằng engine thiên văn của hieu.asia:
              </p>
              <DataTable
                caption="So sánh độ xê dịch của Lập Xuân (tiết khí) với mùng 1 Tết (lịch âm dương)"
                minWidth={460}
                head={['Mốc', 'Thuộc hệ', 'Rơi vào ngày dương lịch', 'Xê dịch']}
                rows={[
                  ['Lập Xuân', 'Tiết khí (Mặt Trời)', LAP_XUAN.dayRange, `${LAP_XUAN.spanDays} ngày`],
                  ['Mùng 1 Tết', 'Lịch âm dương (ngày sóc)', TET_RANGE, `${TET_SPAN_DAYS} ngày`],
                ]}
              />
              <p>
                Một mốc gần như đứng yên, mốc kia trôi gần trọn một tháng. Đó không phải trùng hợp:
                Lập Xuân và lịch Gregory cùng đo một thứ là vị trí Mặt Trời nên trôi cùng nhịp.
              </p>
              <p>
                Cần phân biệt rõ ngay từ đầu ba thứ tiết khí <strong>KHÔNG</strong> phải. Nó{' '}
                <strong>không phải mốc của lịch âm</strong> — lịch âm dương Việt Nam có <em>mượn</em>{' '}
                tiết khí làm khung để đặt tháng nhuận, nhưng mượn không có nghĩa là sinh ra từ đó. Nó{' '}
                <strong>không phải ngày tốt hay ngày xấu</strong> — bản thân một tiết khí chỉ là một
                thời khắc thiên văn, giống thời điểm mặt trời mọc. Và nó{' '}
                <strong>không phải dự báo thời tiết cho Việt Nam</strong> — tên gọi 24 tiết khí mô tả
                khí hậu lưu vực Hoàng Hà, nơi hệ này ra đời.
              </p>
              <p className="text-sm text-foreground/70">
                Hai bài kề đã nhận phần việc của mình nên ở đây không giảng lại: cơ chế{' '}
                <A href="/learn/lich-am-duong">tháng nhuận và chu kỳ Meton</A>, và ý nghĩa thiên văn
                của <A href="/learn/thien-van">bốn điểm phân – chí</A>.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <TietKhiDepth />,
        },
        {
          id: 'hai-muoi-bon-tiet',
          tocLabel: 'Bảng 24 tiết khí',
          heading: 'Bảng 24 tiết khí: tên, ngày dương lịch, ý nghĩa',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Bảng xếp từ <strong>Lập Xuân</strong> vì đó là mốc mở đầu vòng tiết khí — cũng chính
                là gốc 0° của vòng tháng trong engine Bát Tự. Cột <em>hoàng kinh</em> là{' '}
                <strong>định nghĩa</strong> của mỗi mốc; cột <em>ngày dương lịch</em> là{' '}
                <strong>kết quả</strong> — engine dò thời điểm Mặt Trời chạm đúng góc đó trong từng
                năm {SWEEP_FROM}–{SWEEP_TO} rồi lấy khoảng.
              </p>
              <DataTable
                caption="24 tiết khí: hoàng kinh, phân loại Tiết hay Trung khí, khoảng ngày dương lịch và ý nghĩa nông lịch"
                minWidth={720}
                head={['Hoàng kinh', 'Tên gọi', 'Loại', 'Ngày dương lịch', 'Ý nghĩa nông lịch gốc']}
                rows={TERMS.map((t) => [
                  `${t.lon}°`,
                  <span key="n" className="font-medium text-foreground">
                    {t.name} <span className="text-xs text-muted-foreground">{t.han}</span>
                  </span>,
                  t.kind === 'tiet' ? `Tiết → mở tháng ${chiOpenedBy(t.lon)}` : 'Trung khí',
                  t.dayRange,
                  t.meaning,
                ])}
              />
              <p className="text-sm text-foreground/70">
                Đọc cột <em>ngày dương lịch</em> theo chiều dọc: mọi mốc đều gói gọn trong một hoặc
                hai ngày cố định, không mốc nào trôi — dấu hiệu rõ nhất cho thấy đây là một hệ{' '}
                <strong>lịch dương</strong>.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Chia đều theo góc, không đều theo ngày
              </h3>
              <p>
                Nếu 24 chặng bằng nhau về thời gian thì chặng nào cũng phải dài đúng {vn(GAP_MEAN)}{' '}
                ngày. Thực tế thì không: chặng <strong>ngắn nhất</strong> là {GAP_MIN.from} →{' '}
                {GAP_MIN.to} với <strong>{vn(GAP_MIN.days)} ngày</strong>, chặng{' '}
                <strong>dài nhất</strong> là {GAP_MAX.from} → {GAP_MAX.to} với{' '}
                <strong>{vn(GAP_MAX.days)} ngày</strong>. Vị trí hai chặng ấy trong năm không hề ngẫu
                nhiên: quỹ đạo Trái Đất là hình elip, nên khi ở gần Mặt Trời nhất (khoảng đầu tháng
                1) Trái Đất đi nhanh nhất và vượt 15° trong ít ngày nhất, còn khi ở xa nhất (khoảng
                đầu tháng 7) nó đi chậm nhất.{' '}
                <strong>Bằng nhau về góc không kéo theo bằng nhau về thời gian.</strong>
              </p>
              <p className="text-sm text-foreground/70">
                Một “tháng tiết khí” gồm hai chặng liên tiếp nên dài trung bình{' '}
                <strong>{vn(SOLAR_MONTH_DAYS)} ngày</strong> — dài hơn một tuần trăng. Chính khe hở
                đó sinh ra tháng nhuận, và cơ chế ấy thuộc bài{' '}
                <A href="/learn/lich-am-duong">Lịch âm dương</A>.
              </p>
            </div>
          ),
        },
        {
          id: 'tiet-va-trung-khi',
          tocLabel: 'Tiết & Trung khí',
          heading: 'Tiết và Trung khí: một hệ, hai nhiệm vụ',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Chính cái tên đã nói ra cấu trúc: <strong>“tiết khí”</strong> là ghép của hai chữ. 24
                mốc xen kẽ nhau thành hai nhóm, mỗi nhóm {TIET_ROWS.length}, và{' '}
                <strong>hai nhóm làm hai việc hoàn toàn khác nhau</strong>.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>{TIET_ROWS.length} Tiết</strong> — bắt đầu từ Lập Xuân, cách nhau 30°. Mỗi
                  Tiết <strong>MỞ một tháng</strong> trong Bát Tự, tức đây là ranh giới trụ tháng.
                  Trong code, đó đúng là phép chia hoàng kinh cho 30° để ra chỉ số cung tháng.{' '}
                  <span className="text-muted-foreground">
                    {TIET_ROWS.map((t) => t.name).join(' · ')}
                  </span>
                </li>
                <li>
                  <strong>{TRUNG_ROWS.length} Trung khí</strong> — nằm <strong>giữa</strong> mỗi
                  tháng, cũng cách nhau 30° nhưng lệch pha 15°. Lịch âm dương dùng nhóm này làm điểm
                  neo: tháng trăng nào không “ôm” được Trung khí nào thì thành tháng nhuận (cơ chế
                  đầy đủ ở bài <A href="/learn/lich-am-duong">Lịch âm dương</A>).{' '}
                  <span className="text-muted-foreground">
                    {TRUNG_ROWS.map((t) => t.name).join(' · ')}
                  </span>
                </li>
              </ul>
              <p>
                Vì sao lại chia đôi đúng như vậy? Vì{' '}
                <strong>một chặng 30° cần cả điểm mở lẫn điểm giữa</strong>. Đặt mốc ở mỗi 15° thì cứ
                một mốc rơi vào đầu chặng 30° lại có một mốc rơi vào chính giữa chặng đó. Hai vai trò
                ấy nảy ra từ hình học, rồi hai hệ lịch mỗi bên lấy một nhóm dùng cho việc của mình —
                Bát Tự cần biết tháng <em>bắt đầu</em> ở đâu, lịch âm dương cần một điểm neo{' '}
                <em>ở giữa</em> để kiểm tra.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                12 Tiết mở 12 tháng nào của Bát Tự
              </h3>
              <p>
                Bảng dưới suy thẳng từ công thức trong engine: chỉ số cung tháng bằng khoảng cách từ
                315° chia cho 30, rồi cộng 2 để ra địa chi (vì cung đầu tiên là tháng Dần).
              </p>
              <DataTable
                caption="12 Tiết, hoàng kinh, tháng địa chi mà mỗi Tiết mở ra, và Trung khí nằm giữa tháng đó"
                head={['Tiết (mốc mở tháng)', 'Hoàng kinh', 'Mở tháng', 'Trung khí của tháng đó']}
                rows={TIET_ROWS.map((t, i) => [
                  t.name,
                  `${t.lon}°`,
                  `tháng ${chiOpenedBy(t.lon)}`,
                  TRUNG_ROWS[i]!.name,
                ])}
              />
              <p className="text-sm text-foreground/70">
                Bốn điểm phân – chí quen thuộc (Xuân Phân, Hạ Chí, Thu Phân, Đông Chí) đều nằm ở cột
                phải — tức cả bốn đều là <strong>Trung khí</strong>, không phải Tiết, nên không mốc
                nào trong bốn mốc ấy đổi trụ tháng. Ý nghĩa thiên văn của chúng nằm ở bài{' '}
                <A href="/learn/thien-van">Lịch thiên văn</A>.
              </p>
            </div>
          ),
        },
        {
          id: 'tru-thang-doi-o-tiet-khi',
          tocLabel: 'Trụ tháng đổi ở tiết khí',
          heading: 'Ứng dụng lớn nhất: trụ tháng đổi tại tiết khí',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là chỗ tiết khí đi thẳng vào lá số của bạn. Trong Bát Tự,{' '}
                <strong>trụ tháng đổi đúng vào thời khắc Mặt Trời chạm một mốc Tiết</strong> — không
                đổi vào ngày 1 dương lịch, và <strong>không đổi vào mùng 1 âm lịch</strong>. Đối
                chiếu một năm cụ thể là thấy ngay: mỗi dòng dưới đây là một tháng dương lịch của năm{' '}
                {DEMO_YEAR}.
              </p>
              <DataTable
                caption={`So sánh ngày mùng 1 âm lịch với ngày đổi trụ tháng Bát Tự trong năm ${DEMO_YEAR}`}
                minWidth={560}
                head={[
                  'Tháng dương',
                  'Mùng 1 âm lịch rơi ngày',
                  'Đổi trụ tháng từ ngày',
                  'Trụ tháng',
                ]}
                rows={MONTH_SWITCH.map((r) => [
                  `${pad(r.month)}/${DEMO_YEAR}`,
                  r.lunarFirst ? `${pad(r.lunarFirst)} (tháng ${r.lunarMonthNo} âm)` : '—',
                  r.switchDay ? pad(r.switchDay) : '—',
                  r.pillars,
                ])}
              />
              <p>
                Hai cột giữa kể hai câu chuyện khác nhau. Mùng 1 âm lịch{' '}
                <strong>
                  chạy từ ngày {LUNAR_MIN} tới ngày {LUNAR_MAX}
                </strong>{' '}
                và lùi dần suốt năm, vì tháng trăng ngắn hơn tháng dương. Còn ngày đổi trụ tháng{' '}
                <strong>
                  chỉ quanh quẩn trong khoảng ngày {SWITCH_MIN}–{SWITCH_MAX}
                </strong>
                , vì nó bám mốc Mặt Trời. Hai nhịp khác hẳn nhau —{' '}
                <strong>dùng mùng 1 âm lịch làm ranh giới trụ tháng là sai từ gốc</strong>.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Ví dụ: sinh sát ranh giới, chênh vài giờ là đổi trụ tháng
              </h3>
              <p>
                Mốc Tiết có <strong>giờ và phút</strong> cụ thể, nên ranh giới trụ tháng cắt ngang
                giữa một ngày. Ba ca dưới đây chạy bằng chính engine Bát Tự của{' '}
                <A href="/la-so-bat-tu">công cụ lập lá số</A>:
              </p>
              <div className="space-y-4">
                {BOUNDARY_CASES.map((c) => (
                  <div key={c.dateLabel} className="rounded-xl border border-border bg-card/40 p-4">
                    <p className="font-mono text-eyebrow uppercase text-gold-700">
                      {c.termName} · {fmtDate(c.termAt)} lúc {fmtTime(c.termAt)} (giờ VN)
                    </p>
                    <ul className="mt-2.5 space-y-1.5 text-sm">
                      {c.sides.map((s) => (
                        <li key={s.hour}>
                          Sinh <strong>{c.dateLabel}</strong> lúc <strong>{pad(s.hour)}:00</strong> →
                          trụ tháng <strong className="text-foreground">{s.month}</strong>, trụ năm{' '}
                          {s.year}.
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p>
                Ca thứ ba đáng chú ý nhất: Lập Xuân là mốc{' '}
                <strong>đổi cả trụ năm lẫn trụ tháng</strong>, nên hai đứa trẻ sinh cùng ngày{' '}
                {LAP_XUAN_CASE.dateLabel}, cách nhau vài giờ, mang hai trụ năm khác nhau (
                {LAP_XUAN_CASE.sides[0]!.year} và {LAP_XUAN_CASE.sides[1]!.year}). Ngày đó vẫn còn
                cách Tết {DEMO_YEAR} — mùng 1 Tết mãi tới {pad(DEMO_TET.day)}/{pad(DEMO_TET.month)} —
                nên theo lịch âm cả hai vẫn thuộc năm cũ.{' '}
                <strong>
                  Bát Tự và lịch âm dùng hai mốc đổi năm khác nhau; đó là hai quy ước, không phải lỗi
                  tính toán.
                </strong>
              </p>
              <p className="text-sm text-foreground/70">
                Kết luận thực hành: sinh vào khoảng ngày {RISK_MIN}–{RISK_MAX} của một tháng
                dương lịch bất kỳ thì <strong>giờ sinh chính xác là bắt buộc</strong> để lập lá số
                đúng; ngoài khoảng đó, lệch vài giờ hầu như không đổi trụ tháng. Khoảng này suy từ
                chính ngày rơi của {TIET_ROWS.length} mốc Tiết trong {SWEEP_YEARS.length} năm được
                quét, nên nó không phụ thuộc vào quy ước chốt giờ nào cả.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Ranh giới hai lớp',
          heading: 'Ranh giới: đâu là thiên văn, đâu là nông lịch và phong tục',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Bài này trộn hai thứ rất khác nhau, và bạn nên tách chúng ra để biết mình đang dựa
                vào cái gì.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Lớp đo được:</strong> thời khắc Mặt Trời chạm mỗi mốc 15° (tính trước được
                  hàng thế kỷ), ngày dương lịch của từng tiết khí, khoảng cách giữa hai tiết khí,
                  ranh giới trụ tháng và trụ năm trong Bát Tự. Dấu hiệu nhận ra:{' '}
                  <strong>không có dị bản</strong> — hai người tính đúng thì ra cùng một con số.
                </li>
                <li>
                  <strong>Lớp quy ước và kinh nghiệm:</strong> ý nghĩa nông lịch của mỗi tiết, tục lệ
                  gắn với một tiết cụ thể (như tảo mộ dịp Thanh Minh), lời khuyên “tháng này nên làm
                  gì, nên kiêng gì”. Dấu hiệu nhận ra: <strong>có nhiều dị bản</strong> theo vùng và
                  theo sách.
                </li>
              </ul>
              <p>
                Điểm quan trọng nhất khi đọc bảng 24 tiết khí:{' '}
                <strong>tên gọi mô tả khí hậu của một vùng cụ thể</strong> — lưu vực Hoàng Hà ở Trung
                Quốc, nơi hệ này hình thành. Tiểu Tuyết, Đại Tuyết và Sương Giáng nói về một mùa đông
                có tuyết mà phần lớn Việt Nam không có; “Lập Xuân” đầu tháng 2 cũng không khớp cảm
                nhận mùa của miền Nam. Phần thiên văn đúng ở mọi nơi vì nó chỉ nói về vị trí Mặt
                Trời; phần thời tiết thì <strong>gắn với một toạ độ</strong>.
              </p>
              <p>Ba giới hạn kỹ thuật nên biết:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Sai số thời điểm.</strong> Engine dùng thuật toán Meeus, đã kiểm chứng chéo
                  với thư viện thiên văn chuẩn: sai số vị trí Mặt Trời dưới {vn(SUN_ACCURACY_DEG)}°,
                  quy ra thời gian là khoảng <strong>{TOLERANCE_MIN} phút</strong>. Sinh sát ranh
                  giới hơn thế thì đừng tin bảng nào tới từng phút — kể cả bảng này.
                </li>
                <li>
                  <strong>Múi giờ.</strong> Mọi thời khắc trong bài quy về{' '}
                  <strong>giờ Việt Nam</strong> (UTC+7); cùng khoảnh khắc đó đọc ở múi giờ khác có
                  thể rơi sang ngày liền kề — lý do một số trang nước ngoài ghi lệch một ngày.
                </li>
                <li>
                  <strong>Định khí và bình khí.</strong> Bảng này chia đều theo GÓC (định khí). Các
                  bộ lịch cổ hơn từng chia đều theo THỜI GIAN (bình khí), tức lấy độ dài năm chia cho
                  24; vì Trái Đất đi không đều, hai cách cho ra ngày lệch nhau, nên ngày tiết khí
                  trong sách cũ có thể không khớp bảng này.
                </li>
              </ul>
              <p>
                Nói gọn: <strong>tiết khí là mốc có thật và tính trước được</strong>, nhưng phần
                “tháng này nên làm gì” gắn lên nó là nông lịch và phong tục —{' '}
                <strong>hai lớp khác nhau, đừng gộp làm một</strong>.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <TietKhiWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <TietKhiRecall />,
        },
        {
          id: 'faq',
          tocLabel: 'Câu hỏi thường gặp',
          heading: 'Câu hỏi thường gặp',
          children: (
            <>
              <Accordion type="single" collapsible className="space-y-2">
                {FAQS.map((f, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="rounded border border-border px-4"
                  >
                    <AccordionTrigger>{f.q}</AccordionTrigger>
                    <AccordionContent>{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                Tiết khí là khung thời gian, không phải lời khuyên. Muốn biết một tháng cụ thể có
                nghĩa gì với tuổi của bạn theo can chi, dùng <A href="/tu-vi-thang">Tử vi tháng</A>;
                muốn xem trọn bốn trụ của riêng mình thì lập <A href="/la-so-bat-tu">lá số Bát Tự</A>
                . Nền tảng can chi nằm ở bài <A href="/learn/can-chi">Thiên can – Địa chi</A>.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Muốn biết tháng này mang trụ can chi gì và ngày nào hợp tuổi bạn?{' '}
                <A href="/tu-vi-thang">Mở Tử vi tháng miễn phí →</A>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/tu-vi-thang', label: 'Tử vi tháng theo can chi' },
                    { href: '/la-so-bat-tu', label: 'Lập lá số Bát Tự' },
                    { href: '/lich-van-nien', label: 'Lịch vạn niên' },
                    { href: '/thien-van', label: 'Lịch thiên văn' },
                  ]}
                />
              </div>
            </>
          ),
        },
        {
          id: 'ban-da-hieu-chua',
          tocLabel: 'Bạn đã hiểu chưa?',
          heading: 'Bạn đã thật sự hiểu chưa?',
          children: <TietKhiChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
