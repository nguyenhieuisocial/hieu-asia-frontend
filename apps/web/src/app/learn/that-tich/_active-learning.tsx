/**
 * Nội dung "học chủ động" cho trang /learn/that-tich — bài CHÍNH THỨC về Thất Tịch.
 *
 * NGUỒN (grounding) — file này là NƠI KHAI BÁO DUY NHẤT của mọi dữ kiện dùng
 * chung với page.tsx, để hai file không thể lệch nhau:
 *   • lib/ngay-kieng-ky.ts — solarToLunar() (thuật toán Hồ Ngọc Đức, múi giờ +7).
 *     MỌI ngày dương ở đây đều do hàm này suy ra, không gõ tay. Đây đúng là engine
 *     mà /that-tich-2026 dẫn trong chú thích đầu file ("7/7 âm 2026 = 19/8/2026").
 *   • app/that-tich-2026/page.tsx — trang công cụ đích, đã đọc hết.
 *   • Hằng số thiên văn (toạ độ, độ sáng, khoảng cách Altair / Vega / Deneb) KHÔNG
 *     lib nào của repo suy ra được → khai báo tường minh trong khối Star bên dưới;
 *     mọi con số dẫn xuất (khoảng cách góc, khoảng cách thật, độ lệch đỉnh đầu,
 *     giờ qua kinh tuyến) đều TÍNH từ khối đó chứ không gõ tay.
 *
 * CÔNG CỤ /that-tich-2026 LÀM GÌ (đọc code, không đoán): CÓ — nêu ngày dương của
 * 7/7 âm và hai mốc lân cận; kể sự tích; nói thẳng tục ăn chè đậu đỏ là trào lưu
 * mạng chứ không phải nghi lễ cổ; dẫn sang /hop-tuoi, /tarot, /la-so-tu-vi,
 * /xem-ngay; tự chuyển hướng về trang thường niên khi hết mùa. KHÔNG — không nhận
 * ngày sinh, không tính gì theo người dùng, không có bản đồ sao, không tính vị trí
 * thiên thể, không dự đoán tình cảm. Nên phần thiên văn của bài là KIẾN THỨC NỀN,
 * và bài nói rõ công cụ không tính phần đó.
 *   ⚠️ Trang đó CÓ đúng một ô nhập: ô email của <OccasionLeadCapture> (đăng ký
 *   nhắc theo mùa). Vì vậy chỉ được viết "không có ô nhập NGÀY SINH" — viết
 *   "không có ô nhập nào" là sai, mở trang ra là thấy ngay.
 *
 * PHẠM VI: 7/7 âm trôi trên lịch dương → /learn/lich-am-duong (một câu + link);
 * bầu trời thật nói chung → /learn/thien-van (link); so sánh với các ngày lễ tình
 * nhân khác → /learn/ngay-tinh-yeu (link) — bài này không bàn.
 *
 * GIỌNG: sao là THẬT, cầu Ô Thước là TRUYỆN. Không doạ, không phán duyên số,
 * không hứa đổi vận, không mỉa mai người giữ tục lệ.
 */

import * as React from 'react';
import { LearnFrame } from '@/components/learn/active/LearnFrame';
import { DepthTabs } from '@/components/learn/active/DepthTabs';
import { FiveWhys } from '@/components/learn/active/FiveWhys';
import { ActiveRecall, type RecallQuestion } from '@/components/learn/active/ActiveRecall';
import {
  UnderstandingChecklist,
  type UnderstandingFacet,
} from '@/components/learn/active/UnderstandingChecklist';
import { solarToLunar } from '@/lib/ngay-kieng-ky';

const strong = (s: string) => <strong className="text-foreground">{s}</strong>;

/** Số thập phân HIỂN THỊ phải dùng dấu phẩy kiểu Việt (dấu chấm = phân cách nghìn). */
export const vn = (n: number, digits = 0): string => n.toFixed(digits).replace('.', ',');

// ── Ngày: suy từ engine lịch âm của repo, không gõ tay ────────────────────

const LUNAR_YEAR = 2026;
const DAY_MS = 86_400_000;
const WEEKDAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

/**
 * Ngày dương lịch của một ngày âm lịch (tháng thường, không nhuận). Quét từ đầu
 * năm dương cùng số hiệu — đủ phủ trọn một năm âm — rồi đối chiếu bằng chính
 * solarToLunar(). Ném lỗi nếu không tìm thấy: đó là bất biến của lịch, im lặng
 * trả về ngày sai còn tệ hơn dừng build.
 */
function solarOfLunar(day: number, month: number, lunarYear: number): Date {
  const start = Date.UTC(lunarYear, 0, 1);
  for (let i = 0; i < 420; i += 1) {
    const d = new Date(start + i * DAY_MS);
    const l = solarToLunar(d.getUTCDate(), d.getUTCMonth() + 1, d.getUTCFullYear());
    if (!l.leap && l.year === lunarYear && l.month === month && l.day === day) return d;
  }
  throw new Error(`Không tìm thấy ngày ${day}/${month} âm lịch của năm ${lunarYear}`);
}

/** "Thứ Tư, 19/8/2026" */
export function fmtFull(d: Date): string {
  return `${WEEKDAYS[d.getUTCDay()] ?? ''}, ${d.getUTCDate()}/${d.getUTCMonth() + 1}/${d.getUTCFullYear()}`;
}

/** "19/8/2026" */
export function fmtShort(d: Date): string {
  return `${d.getUTCDate()}/${d.getUTCMonth() + 1}/${d.getUTCFullYear()}`;
}

export const THAT_TICH_DATE = solarOfLunar(7, 7, LUNAR_YEAR);
export const THAT_TICH_NEXT = solarOfLunar(7, 7, LUNAR_YEAR + 1);
export const THAT_TICH_YEAR = LUNAR_YEAR;

/** Ba mốc quanh tháng 7 âm — cùng bộ mốc mà trang công cụ hiển thị. */
export const MILESTONES: readonly { lunar: string; date: Date; note: string }[] = [
  { lunar: 'Mùng 1 tháng 7 âm', date: solarOfLunar(1, 7, LUNAR_YEAR), note: 'Mở đầu tháng 7 âm lịch' },
  { lunar: 'Thất Tịch — mùng 7 tháng 7 âm', date: THAT_TICH_DATE, note: 'Ngày của bài học này' },
  {
    lunar: 'Rằm tháng 7 — lễ Vu Lan',
    date: solarOfLunar(15, 7, LUNAR_YEAR),
    note: 'Một ngày khác, một tục khác — hay bị gộp nhầm',
  },
];

// ── Thiên văn: hằng số khai báo tường minh, số dẫn xuất thì TÍNH ──────────

export interface Star {
  ten: string;
  tenHan: string;
  chomSao: string;
  /** Xích kinh (RA) và xích vĩ (Dec), tính bằng độ. */
  raDeg: number;
  decDeg: number;
  /** Cấp sao biểu kiến — số CÀNG NHỎ thì nhìn CÀNG sáng. */
  capSao: number;
  /** Khoảng cách, năm ánh sáng. undefined = các phép đo chưa thống nhất. */
  ly?: number;
  viTriNganHa: string;
}

/**
 * Toạ độ và độ sáng làm tròn theo các phép đo thị sai đã công bố (Hipparcos /
 * Gaia). Đây là hằng số thiên văn — không có lib nào trong repo suy ra được,
 * nên khai báo tại đúng một chỗ này.
 */
export const ALTAIR: Star = {
  ten: 'Altair', tenHan: 'Khiên Ngưu / Hà Cổ nhị', chomSao: 'Thiên Ưng (Aquila)',
  raDeg: 297.7, decDeg: 8.9, capSao: 0.76, ly: 16.7,
  viTriNganHa: 'Rìa phía đông dải Ngân Hà',
};

export const VEGA: Star = {
  ten: 'Vega', tenHan: 'Chức Nữ', chomSao: 'Thiên Cầm (Lyra)',
  raDeg: 279.2, decDeg: 38.8, capSao: 0.03, ly: 25,
  viTriNganHa: 'Phía tây dải Ngân Hà, đối diện Altair',
};

export const DENEB: Star = {
  ten: 'Deneb', tenHan: 'Thiên Tân tứ', chomSao: 'Thiên Nga (Cygnus)',
  raDeg: 310.4, decDeg: 45.3, capSao: 1.25,
  viTriNganHa: 'Nằm ngay TRONG dải Ngân Hà',
};

export const STARS: readonly Star[] = [VEGA, ALTAIR, DENEB];

/**
 * Khoảng cách tới Deneb CHƯA chốt: các phép đo cho ra khoảng 1400 – 2600 năm
 * ánh sáng, chênh nhau gần gấp đôi.
 *
 * TRƯỚC ĐÂY file này lấy một ước lượng giữa (1500) rồi bài in ra "xa hơn Altair
 * khoảng 90 lần" — một con số ĐƠN TRỊ suy từ MỘT đầu của dải, đặt ngay cạnh câu
 * thừa nhận dải rộng gần gấp đôi. Đọc thẳng bảng ra tỉ lệ 84–156 lần, tức bảng
 * phản chứng chính câu kết luận dưới nó. Nay cả dải năm ánh sáng lẫn dải tỉ lệ
 * đều suy từ đúng hai số dưới đây nên không thể chỏi nhau nữa.
 */
const DENEB_LY_MIN = 1400;
const DENEB_LY_MAX = 2600;

/** 1400 → "1.400": trong tiếng Việt dấu CHẤM là phân cách NGHÌN. */
const vnThousand = (n: number): string => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const DENEB_LY_RANGE = `${vnThousand(DENEB_LY_MIN)} – ${vnThousand(DENEB_LY_MAX)}`;

/** Deneb xa hơn Altair bao nhiêu lần — suy từ HAI đầu của dải trên, không lấy giữa. */
export const DENEB_FARTHER_RANGE = `${Math.round(DENEB_LY_MIN / (ALTAIR.ly ?? 1))} – ${Math.round(
  DENEB_LY_MAX / (ALTAIR.ly ?? 1),
)}`;

const rad = (deg: number) => (deg * Math.PI) / 180;

/** Khoảng cách góc giữa hai sao trên bầu trời, độ. */
function angularSepDeg(a: Star, b: Star): number {
  const cos =
    Math.sin(rad(a.decDeg)) * Math.sin(rad(b.decDeg)) +
    Math.cos(rad(a.decDeg)) * Math.cos(rad(b.decDeg)) * Math.cos(rad(a.raDeg - b.raDeg));
  return (Math.acos(Math.min(1, Math.max(-1, cos))) * 180) / Math.PI;
}

/** Khoảng cách THẬT giữa hai sao trong không gian (định lý cosin), năm ánh sáng. */
function realSepLy(a: Star, b: Star): number | undefined {
  if (a.ly === undefined || b.ly === undefined) return undefined;
  const sep = angularSepDeg(a, b);
  return Math.sqrt(a.ly ** 2 + b.ly ** 2 - 2 * a.ly * b.ly * Math.cos(rad(sep)));
}

export const SEP_DEG = angularSepDeg(ALTAIR, VEGA);
export const REAL_SEP_LY = realSepLy(ALTAIR, VEGA) ?? 0;

/** Vĩ độ hai đầu đất nước, dùng để tính độ cao lúc sao qua kinh tuyến. */
export const HANOI_LAT = 21.0;
export const CA_MAU_LAT = 8.6;

/** Sao lên cao nhất thì còn cách đỉnh đầu bao nhiêu độ, nhìn từ vĩ độ `lat`. */
export const zenithGapDeg = (lat: number, decDeg: number) => Math.abs(lat - decDeg);

/**
 * Xích kinh của Mặt Trời quanh ngày 19/8 hằng năm, tính bằng giờ (≈ 9h52m).
 * Dùng để ước lượng giờ mà một sao lên cao nhất: giờ ≈ 12 + RA(sao) − RA(Mặt Trời).
 * Đây là phép ước lượng thô (bỏ qua phương trình thời gian và lệch kinh độ vài
 * phút) — bài luôn viết kèm chữ "khoảng".
 */
const SUN_RA_HOURS_AT_THAT_TICH = 9.87;

/**
 * Bài khẳng định "CỤM BA SAO lên cao nhất vào khoảng 22 giờ", nên con số phải
 * suy từ cả ba ngôi chứ không riêng Altair: ba ngôi qua kinh tuyến cách nhau
 * tới hai tiếng (Vega sớm nhất, Deneb muộn nhất). Lấy xích kinh trung bình thì
 * phép tính đúng bằng phạm vi câu chữ. (Kết quả vẫn là 22 giờ.)
 */
const MEAN_RA_DEG = STARS.reduce((sum, s) => sum + s.raDeg, 0) / STARS.length;

export const CULMINATION_HOUR = Math.round(
  ((12 + MEAN_RA_DEG / 15 - SUN_RA_HOURS_AT_THAT_TICH) % 24 + 24) % 24,
);

// ── Các khối học chủ động ─────────────────────────────────────────────────

export function ThatTichFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Mỗi năm tới {strong('mùng 7 tháng 7 âm lịch')}, mạng xã hội lại rủ nhau ăn chè đậu đỏ và
          kể chuyện Ngưu Lang – Chức Nữ mỗi năm gặp nhau một lần trên cầu Ô Thước. Rất ít chỗ nói
          cho bạn biết phần nào trong câu chuyện đó là bầu trời có thật, và phần nào là người kể
          thêm vào.
        </>
      }
      why={
        <>
          Vì đây là {strong('ví dụ đẹp nhất')} của một chuyện thường gặp trong huyền học phương
          Đông: một quan sát thiên văn có thật bị bọc trong một câu chuyện, rồi đời sau đọc cả gói
          như nhau. Tách được hai tầng ở đây thì bạn tách được ở mọi chỗ khác.
        </>
      }
      what={
        <>
          Thất Tịch là ngày {strong('mùng 7 tháng 7 âm lịch')} — năm {THAT_TICH_YEAR} rơi vào{' '}
          {fmtFull(THAT_TICH_DATE)}. Hai nhân vật của truyện tương ứng với hai ngôi sao thật:{' '}
          {strong('Ngưu Lang là Altair')} và {strong('Chức Nữ là Vega')}, nằm hai bên dải Ngân Hà.
        </>
      }
      how={
        <>
          Nhìn lên trời vào những tối cuối mùa hè. Hai sao ấy cùng với {strong('Deneb')} tạo thành{' '}
          {strong('Tam giác Mùa hè')}, lên gần đỉnh đầu ở Việt Nam đúng vào mùa này — nên người xưa
          kể chuyện của họ vào đúng mùa nhìn rõ họ nhất.
        </>
      }
      soWhat={
        <>
          Để bạn giữ được cả hai: {strong('câu chuyện thì đẹp')} và đáng kể lại, còn{' '}
          {strong('bầu trời thì kiểm được')} bằng chính mắt mình. Chỉ cần không nhầm cái này thành
          cái kia — hai ngôi sao ấy không hề xích lại gần nhau trong đêm Thất Tịch.
        </>
      }
    />
  );
}

export function ThatTichDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="that-tich"
        concept="Thất Tịch là ngày gì"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Có một ngày trong năm, người lớn kể chuyện về hai người yêu nhau ở hai bên một con
                sông trên trời. Ngày đó là {strong('ngày mùng 7 của tháng 7')} theo lịch mặt trăng.
                Năm nay là {fmtShort(THAT_TICH_DATE)}.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Thất Tịch nghĩa đen là {strong('“đêm mùng bảy”')}. Ngày này cố định trên{' '}
                  {strong('lịch âm')} (7/7) nhưng trôi trên lịch dương: năm {THAT_TICH_YEAR} là{' '}
                  {fmtShort(THAT_TICH_DATE)}, năm {THAT_TICH_YEAR + 1} lại là{' '}
                  {fmtShort(THAT_TICH_NEXT)}.
                </p>
                <p>
                  Nội dung của ngày là một câu chuyện: chàng chăn trâu và cô gái dệt vải bị chia hai
                  bên sông Ngân, mỗi năm chỉ gặp nhau một lần. Ở Trung Hoa xưa, đêm này còn là{' '}
                  {strong('lễ Khất Xảo')} — con gái cầu cho khéo tay, chứ không phải cầu người yêu.
                </p>
              </>
            ),
          },
          {
            id: 'expert',
            label: 'Chuyên gia',
            content: (
              <>
                <p>
                  Ngày 7/7 là một {strong('quy ước lịch pháp')}: lịch âm dương đặt mùng 1 vào ngày
                  sóc, nên mùng 7 luôn rơi vào lúc trăng vừa lên bán nguyệt. Trăng bán nguyệt lên
                  cao ngay lúc chập tối rồi {strong('lặn quanh nửa đêm')} — nên đầu đêm trời còn
                  sáng trăng, và khoảng tối thật sự để thấy dải Ngân Hà là{' '}
                  {strong('nửa sau của đêm')}, sau khi trăng lặn. Khác hẳn đêm rằm, khi trăng sáng
                  suốt từ tối tới sáng. Còn con số 7 lặp lại (tháng 7, ngày 7) là{' '}
                  {strong('thẩm mỹ số học')}, không phải phép đo.
                </p>
                <p>
                  Trong repo này, ngày dương của 7/7 âm được suy bằng đúng hàm lịch mà các công cụ
                  ngày–giờ đang dùng, chứ không tra bảng: {strong('solarToLunar()')} theo thuật
                  toán Hồ Ngọc Đức, múi giờ +7. {strong('Lịch vạn niên')} của site chạy một bản cài
                  đặt riêng ở phía máy chủ, nhưng cùng thuật toán và cùng múi giờ ấy — nên hai nơi
                  cho ra cùng một ngày.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="that-tich"
        concept="Hai ngôi sao trong truyện"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Hai người trong chuyện là {strong('hai ngôi sao thật')} trên trời. Bạn ra sân buổi
                tối mùa hè là nhìn thấy được: một ngôi rất sáng ở gần đỉnh đầu, một ngôi sáng nữa ở
                phía bên kia vệt sáng mờ vắt ngang trời.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Chức Nữ là sao {strong(VEGA.ten)} trong chòm {VEGA.chomSao}; Ngưu Lang là sao{' '}
                  {strong(ALTAIR.ten)} trong chòm {ALTAIR.chomSao}. Người Trung Hoa xưa gọi thẳng
                  hai sao ấy là {VEGA.tenHan} và {ALTAIR.tenHan} — tên nhân vật chính là tên sao.
                </p>
                <p>
                  Giữa hai sao là {strong('dải Ngân Hà')}, vệt sáng mờ do hàng trăm tỉ ngôi sao của
                  thiên hà chúng ta chồng lên nhau tạo thành. Đó chính là “sông Ngân” trong truyện —
                  và nó có thật, chỉ là nó không phải nước.
                </p>
              </>
            ),
          },
          {
            id: 'expert',
            label: 'Chuyên gia',
            content: (
              <>
                <p>
                  Trên bầu trời, hai sao cách nhau khoảng {strong(vn(SEP_DEG) + ' độ')} — con số này
                  suy từ toạ độ xích kinh và xích vĩ của chúng, không phải ước chừng bằng mắt.
                  Nhưng khoảng cách góc chỉ là hình chiếu: trong không gian thật, tính cả chênh lệch
                  khoảng cách tới Trái Đất, hai sao cách nhau{' '}
                  {strong('khoảng ' + vn(REAL_SEP_LY) + ' năm ánh sáng')}.
                </p>
                <p>
                  Nghĩa là nếu Chức Nữ bật một ngọn đèn, Ngưu Lang phải chờ{' '}
                  {strong('khoảng ' + vn(REAL_SEP_LY) + ' năm')} mới thấy. Không có phép gặp nào mỗi
                  năm một lần: khoảng cách ấy gần như không đổi trong suốt đời một con người.
                </p>
              </>
            ),
          },
        ]}
      />

    </div>
  );
}

const RECALL_QUESTIONS: RecallQuestion[] = [
  {
    id: 'q1',
    type: 'open',
    prompt: 'Thất Tịch là ngày nào, và vì sao ngày dương lịch của nó năm nào cũng khác?',
    answer: (
      <>
        Là {strong('mùng 7 tháng 7 âm lịch')}. Năm {THAT_TICH_YEAR} rơi vào{' '}
        {fmtFull(THAT_TICH_DATE)}, năm {THAT_TICH_YEAR + 1} lại là {fmtShort(THAT_TICH_NEXT)}. Ngày
        dương đổi vì tháng âm đếm theo tuần trăng, còn năm dương đếm theo vòng quanh Mặt Trời — hai
        thước đo khác nhau nên mốc trôi qua lại mỗi năm.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Ngưu Lang và Chức Nữ trong truyện tương ứng với những ngôi sao nào?',
    choices: [
      {
        text: `Ngưu Lang là ${ALTAIR.ten} (chòm ${ALTAIR.chomSao}), Chức Nữ là ${VEGA.ten} (chòm ${VEGA.chomSao})`,
        correct: true,
        note: 'Đúng — và đây không phải gán ghép đời sau: người Trung Hoa xưa gọi thẳng hai sao ấy bằng tên hai nhân vật.',
      },
      {
        text: `Cả hai đều nằm trong chòm ${DENEB.chomSao}`,
        note: `Không — ${DENEB.chomSao} là chòm của ${DENEB.ten}, ngôi sao thứ ba của Tam giác Mùa hè và không phải nhân vật trong truyện.`,
      },
      {
        text: 'Không sao nào cả, đây thuần tuý là nhân vật tưởng tượng',
        note: 'Không — phần nhân vật là tưởng tượng, nhưng hai ngôi sao mang tên họ thì có thật và bạn nhìn thấy được bằng mắt thường.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Trong đêm Thất Tịch, hai ngôi sao đó có thật sự lại gần nhau không?',
    choices: [
      {
        text: `Không. Chúng cách nhau khoảng ${vn(SEP_DEG)} độ trên trời quanh năm, và khoảng ${vn(REAL_SEP_LY)} năm ánh sáng trong không gian thật`,
        correct: true,
        note: 'Đúng. Cái thay đổi theo mùa là chỗ đứng của Trái Đất, khiến chúng lên cao vào đầu đêm mùa hè và khuất vào mùa đông.',
      },
      {
        text: 'Có, mỗi năm đúng đêm 7/7 âm chúng chạm nhau rồi tách ra',
        note: 'Không có quan sát nào như vậy. Khoảng cách góc giữa hai sao gần như không đổi trong suốt đời người.',
      },
      {
        text: 'Có, nhưng chỉ nhìn thấy được bằng kính thiên văn',
        note: 'Không — kính mạnh tới đâu cũng không tạo ra chuyển động không tồn tại. Kính chỉ cho thấy rõ hơn thứ vốn đã ở đó.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'open',
    prompt: 'Tam giác Mùa hè gồm ba sao nào, và vì sao nó dễ tìm ở Việt Nam vào mùa Thất Tịch?',
    answer: (
      <>
        Gồm {strong(VEGA.ten + ', ' + ALTAIR.ten + ' và ' + DENEB.ten)} — ba ngôi sáng nhất của ba
        chòm khác nhau, nối lại thành một tam giác lớn. Mùa này chúng lên cao nhất vào khoảng{' '}
        {CULMINATION_HOUR} giờ. Riêng {ALTAIR.ten} có xích vĩ {vn(ALTAIR.decDeg, 1)} độ, xấp xỉ
        vĩ độ cực nam nước ta, nên ở Cà Mau nó gần như qua đỉnh đầu, còn ở Hà Nội chỉ lệch khoảng{' '}
        {vn(zenithGapDeg(HANOI_LAT, ALTAIR.decDeg))} độ.
      </>
    ),
  },
  {
    id: 'q5',
    type: 'mcq',
    prompt: 'Cầu Ô Thước tương ứng với thứ gì trên bầu trời thật?',
    choices: [
      {
        text: 'Không tương ứng với thứ gì cả — đó là phần truyện, không phải phần trời',
        correct: true,
        note: 'Đúng. Dải Ngân Hà là thật, hai ngôi sao là thật, nhưng cây cầu do đàn quạ bắc thì thuộc về câu chuyện.',
      },
      {
        text: 'Là một vệt sao nối liền hai ngôi sao, chỉ hiện ra đêm 7/7',
        note: 'Không có vệt sao nào như vậy. Vùng trời giữa hai sao chính là dải Ngân Hà, và nó ở đó quanh năm.',
      },
      {
        text: 'Là chòm Thiên Nga, vì đó cũng là một con chim',
        note: `Chòm ${DENEB.chomSao} nằm trong dải Ngân Hà thật, nhưng đó là tên gọi của thiên văn phương Tây, không phải cây cầu trong truyện phương Đông.`,
      },
    ],
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt: `Trang Thất Tịch ${THAT_TICH_YEAR} của hieu.asia làm được những gì?`,
    choices: [
      {
        text: 'Nêu ngày dương của 7/7 âm cùng vài mốc lân cận, kể sự tích, nói rõ tục ăn chè đậu đỏ là trào lưu mạng, rồi dẫn sang các công cụ khác',
        correct: true,
        note: 'Đúng — đó là một trang thông tin theo mùa. Nó không nhận ngày sinh và không tính gì riêng cho bạn.',
      },
      {
        text: 'Nhận ngày sinh rồi chấm điểm đường tình duyên trong năm',
        note: 'Không. Trang đó không có ô nhập ngày sinh — ô duy nhất trên trang là ô email để đăng ký nhận nhắc theo mùa, và nó không tính gì cho bạn cả.',
      },
      {
        text: 'Vẽ bản đồ sao chỉ chỗ Altair và Vega theo vị trí của bạn',
        note: 'Không — trang không tính vị trí thiên thể. Phần thiên văn bạn vừa học là kiến thức nền, công cụ không tính phần này.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'open',
    prompt:
      'Vận dụng: bạn nói với bạn mình rằng “mưa ngâu tháng 7 là nước mắt Ngưu Lang – Chức Nữ”. Cách nói nào vừa giữ được cái đẹp vừa không sai?',
    answer: (
      <>
        Nói rõ hai tầng. {strong('Tầng đo được')}: tháng 7 âm rơi vào cuối mùa mưa ở miền Bắc, mưa
        kéo dài nhiều ngày là chuyện khí hậu, năm nào cũng vậy, không cần ai khóc.{' '}
        {strong('Tầng truyện')}: người xưa đặt tên cho kiểu mưa ấy là mưa ngâu và gắn nó vào câu
        chuyện — một cái tên hay, không phải một lời giải thích. Giữ cả hai thì bạn vừa kể được
        chuyện, vừa không dạy sai cho ai.
      </>
    ),
  },
];

export function ThatTichRecall() {
  return <ActiveRecall topicId="that-tich" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  { id: 'ngay', facet: 'Ngày và lịch',
    can: `Nói được Thất Tịch là mùng 7 tháng 7 âm lịch, tra được ngày dương tương ứng (năm ${THAT_TICH_YEAR} là ${fmtShort(THAT_TICH_DATE)}), và giải thích vì sao ngày dương đổi mỗi năm.` },
  { id: 'truyen', facet: 'Câu chuyện',
    can: 'Kể lại được cốt truyện Ngưu Lang – Chức Nữ, và biết rằng đêm này ở Trung Hoa xưa còn là lễ Khất Xảo — cầu khéo tay, không phải cầu người yêu.' },
  { id: 'hai-sao', facet: 'Hai ngôi sao',
    can: `Chỉ đúng Ngưu Lang là ${ALTAIR.ten} và Chức Nữ là ${VEGA.ten}, biết chúng nằm hai bên dải Ngân Hà, và biết tên Hán của chúng chính là tên hai nhân vật.` },
  { id: 'khoang-cach', facet: 'Khoảng cách',
    can: `Phân biệt khoảng cách GÓC trên bầu trời (khoảng ${vn(SEP_DEG)} độ) với khoảng cách THẬT trong không gian (khoảng ${vn(REAL_SEP_LY)} năm ánh sáng), và hiểu vì sao hai con số ấy khác nhau.` },
  { id: 'tam-giac', facet: 'Tam giác Mùa hè',
    can: `Kể tên ba sao ${VEGA.ten} – ${ALTAIR.ten} – ${DENEB.ten}, biết đó là một hình vẽ nối sao chứ không phải một chòm sao chính thức, và biết nhìn nó ở đâu trên trời Việt Nam.` },
  { id: 'mua-vu', facet: 'Vì sao đúng mùa này',
    can: 'Giải thích được rằng các ngôi sao không đi đâu cả — cái đổi theo mùa là chỗ đứng của Trái Đất, và đó là lý do truyện được kể vào cuối hè chứ không phải mùa khác.' },
  { id: 'hai-tang', facet: 'Tách hai tầng',
    can: 'Chỉ ra chính xác đâu là phần đo được (hai ngôi sao, dải Ngân Hà, mùa nhìn rõ) và đâu là phần truyện (cầu Ô Thước, cuộc gặp mỗi năm một lần, mưa ngâu là nước mắt).' },
  { id: 'cong-cu', facet: 'Công cụ làm gì',
    can: `Nói đúng trang Thất Tịch ${THAT_TICH_YEAR} của hieu.asia làm gì — nêu ngày, kể sự tích, dẫn sang công cụ khác — và nói đúng cả phần nó KHÔNG làm: không nhận ngày sinh, không có bản đồ sao, không đoán chuyện tình cảm.` },
  { id: 'ranh-gioi', facet: 'Ranh giới',
    can: 'Nói được vì sao một ngày trong lịch không quyết định chuyện tình cảm của ai, và vì sao không nên để nỗi lo "bỏ lỡ ngày cầu duyên" biến thành thứ bị đem ra bán.' },
  { id: 'day-lai', facet: 'Dạy lại',
    can: 'Trong một phút, chỉ cho người bên cạnh thấy hai ngôi sao thật trên trời, kể câu chuyện đi kèm, và nói rõ chỗ nào là trời chỗ nào là truyện — mà không làm hỏng câu chuyện.' },
];

export function ThatTichChecklist() {
  return <UnderstandingChecklist topicId="that-tich" facets={FACETS} />;
}

export function ThatTichWhys() {
  return (
    <FiveWhys
      topicId="that-tich"
      start={
        <>
          Một người đọc được rằng “đêm Thất Tịch, sao Ngưu Lang và sao Chức Nữ gặp nhau trên bầu
          trời”, và tin rằng đó là một hiện tượng thiên văn xảy ra mỗi năm một lần.
        </>
      }
      chain={[
        {
          question: 'Vì sao câu chuyện lại gắn được với hai ngôi sao có thật?',
          because: (
            <>
              Vì người xưa đặt tên cho bầu trời trước khi có kính thiên văn. Hai ngôi sáng nhất nằm
              hai bên dải Ngân Hà được gọi thẳng là {strong(VEGA.tenHan)} và{' '}
              {strong(ALTAIR.tenHan)} — {VEGA.ten} và {ALTAIR.ten} theo tên gọi ngày nay. Tên nhân
              vật chính là tên sao, nên truyện và trời dính vào nhau ngay từ đầu.
            </>
          ),
        },
        {
          question: 'Vì sao lại chọn đúng hai ngôi ấy chứ không phải ngôi khác?',
          because: (
            <>
              Vì chúng {strong('sáng và dễ thấy')} — cấp sao {vn(VEGA.capSao, 2)} và{' '}
              {vn(ALTAIR.capSao, 2)}, thuộc nhóm sáng nhất bầu trời đêm — lại nằm{' '}
              {strong('đối nhau qua dải Ngân Hà')}. Một vệt sáng mờ chia đôi bầu trời, hai ngôi sáng
              nhất đứng hai bên: hình ảnh “bị con sông chia cắt” gần như tự kể ra.
            </>
          ),
        },
        {
          question: 'Vì sao ngày kể chuyện lại là mùng 7 tháng 7?',
          because: (
            <>
              Vì đó là lúc {strong('cụm sao lên cao nhất vào đầu đêm')} — khoảng{' '}
              {CULMINATION_HOUR} giờ, lúc người ta còn ngồi ngoài sân. Cộng thêm một lý do thuần
              lịch: mùng 7 thì trăng mới bán nguyệt, {strong('lặn quanh nửa đêm')} chứ không sáng
              suốt đêm như hôm rằm — nên đêm ấy vẫn còn một khoảng trời đủ tối để thấy dải Ngân Hà,
              chỉ là phải đợi trăng lặn. Còn việc số 7 lặp hai lần chỉ là{' '}
              {strong('thẩm mỹ số học')}, không phải phép đo.
            </>
          ),
        },
        {
          question: 'Vì sao “mỗi năm gặp một lần” lại nghe rất hợp lý?',
          because: (
            <>
              Vì nhìn từ mặt đất thì đúng là mỗi năm chúng hiện ra một mùa rồi biến mất. Nhưng thứ
              chuyển động là {strong('Trái Đất trên quỹ đạo của nó')}, không phải hai ngôi sao. Sao
              đứng yên; ta mới là người đi vòng quanh và mỗi mùa nhìn về một hướng khác.
            </>
          ),
        },
        {
          question: 'Vậy vì sao vẫn nên tách rạch ròi hai tầng?',
          because: (
            <>
              Vì gộp lại thì {strong('mất cả hai')}. Câu chuyện bị đem ra làm bằng chứng nên hoá dở;
              phép đo bị bọc trong truyện nên không ai kiểm được nữa. Tách ra thì bạn giữ được cả
              cái đẹp lẫn cái đúng — và có thứ để chỉ cho người bên cạnh xem bằng chính mắt họ.
            </>
          ),
        },
      ]}
      root={
        <>
          {strong('Sao là thật, cầu Ô Thước là truyện.')} Dải Ngân Hà có thật, hai ngôi sao có thật,
          mùa nhìn rõ chúng có thật — ba thứ đó kiểm được bằng mắt thường trong một buổi tối. Cuộc
          gặp mỗi năm một lần thì thuộc về người kể chuyện, và nó vẫn đáng kể lại, miễn là ta biết
          mình đang kể chuyện.
        </>
      }
    />
  );
}
