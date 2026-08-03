/**
 * Bài học /learn/ngay-tinh-yeu — các nền văn hoá đánh dấu tình yêu bằng ngày nào,
 * và vì sao. Trang công cụ đích: /valentine-2027.
 *
 * GROUNDING — không gõ tay ngày nào, mọi mốc đều SUY TẠI RUNTIME:
 *   • lib/ngay-kieng-ky.ts — solarToLunar(dd, mm, yy), thuật toán lịch âm Hồ Ngọc
 *     Đức, múi giờ +7. Đây đúng là engine mà chú thích đầu app/valentine-2027/page.tsx
 *     dẫn ra khi chốt "14/2/2027 = mùng 9 tháng Giêng âm lịch Đinh Mùi". Repo KHÔNG
 *     có hàm âm → dương, nên ngày dương của một ngày âm (Thất Tịch mùng 7 tháng 7,
 *     mùng 1 Tết) được tìm bằng cách quét ngược qua chính solarToLunar.
 *   • lib/xem-tuoi-cuoi.ts — canChiOfYear(y) để gọi tên năm âm (Đinh Mùi, Ất Tỵ…).
 *
 * CÔNG CỤ THẬT SỰ LÀM GÌ (đọc app/valentine-2027/page.tsx, không đoán):
 *   CÓ — nêu mốc ngày (Valentine 2027 = Chủ Nhật 14/2, mùng 9 tháng Giêng Đinh Mùi;
 *   mùng 1 Tết Đinh Mùi = 6/2/2027); giải thích ba lớp mà phép "hợp tuổi" đối chiếu
 *   (địa chi · ngũ hành nạp âm · cung mệnh Bát trạch); nói rõ vì sao không gộp thành
 *   một con số phần trăm; nói "khắc" không phải bản án; chỉ đường sang /hop-tuoi,
 *   /tarot, /la-so-tu-vi, /xem-ngay, /lich-van-nien; có ô để lại email nhận nhắc theo
 *   mùa; là trang THEO MÙA nên hết mùa tự 308 về trang thường trực.
 *   KHÔNG — không tính bất cứ thứ gì về Thất Tịch; không chấm điểm ngày lễ; không có
 *   ô nào nhận "ngày bạn đang xem" làm đầu vào. Bài vì thế KHÔNG dạy phần đó.
 *
 * ĐẦU VÀO THẬT của phép xem hợp tuổi (đọc form, không đọc lời quảng cáo):
 *   components/hop-tuoi/BirthInputPair.tsx + app/hop-tuoi/[type]/HopTuoiClient.tsx →
 *   mỗi người gồm NĂM SINH + GIỚI TÍNH (tên là tuỳ chọn, chỉ để hiển thị lại);
 *   `isValidPerson` bắt buộc cả hai. Body gửi lên API đúng bằng hai cặp đó, KHÔNG
 *   có trường ngày nào. Bài phải nói "năm sinh và giới tính", không được rút gọn
 *   thành "năm sinh" — cung mệnh Bát trạch (một trong ba lớp) cần giới tính.
 *   Ngược lại, KHÔNG được nói "không công cụ nào trên hieu.asia nhận một ngày làm
 *   đầu vào": /tu-vi-hom-nay truyền ngày hôm nay vào resolveDailySummaries(),
 *   /xem-ngay chấm điểm đúng ngày người dùng chọn. Thứ không công cụ nào nhận là
 *   "hôm nay có phải ngày lễ hay không" — đó mới là mệnh đề bài được phép khẳng định.
 *
 * KIỂM CHỨNG (chạy lại được bằng chính solarToLunar): 14/2/2027 → mùng 9 tháng 1 âm
 * năm 2027 (Đinh Mùi); 6/2/2027 → mùng 1 tháng 1. Cả hai khớp trang công cụ.
 *
 * PHẠM VI: KHÔNG lấn bài /learn/that-tich — bài ấy nay ĐÃ CÓ THẬT trong repo, nên
 * ở đây Thất Tịch chỉ là VẬT ĐỐI CHIẾU về cách neo lịch và bài phải LINK sang nó
 * (trước đó bài viết "sẽ có bài riêng" mà không có link — chỉ đường vào ngõ cụt).
 * Cách chấm hợp đôi thuộc /learn/hop-doi, bảng quan hệ 12 chi thuộc
 * /learn/hop-tuoi (đều được link). Giọng: ngày lễ là QUY ƯỚC XÃ HỘI đáng giữ, không
 * phải mốc vận mệnh; nói thẳng chỗ ghép sai, không mỉa mai người đọc, không doạ.
 */

import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@hieu-asia/ui';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { learnTopicBySlug } from '@/lib/learn/related';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, course, faqPage } from '@/lib/seo/jsonld';
import { solarToLunar } from '@/lib/ngay-kieng-ky';
import { canChiOfYear } from '@/lib/xem-tuoi-cuoi';
import {
  NgayTinhYeuFrame,
  NgayTinhYeuDepth,
  NgayTinhYeuRecall,
  NgayTinhYeuChecklist,
  NgayTinhYeuWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Ngày tình yêu: Valentine và Thất Tịch',
  description:
    'Valentine là ngày dương cố định 14/2; Thất Tịch là ngày âm mùng 7 tháng 7 nên trôi theo trăng. Cả hai là quy ước xã hội, không phải mốc vận mệnh.',
  alternates: { canonical: 'https://hieu.asia/learn/ngay-tinh-yeu' },
};

// --- Dữ kiện suy từ engine lịch của repo --------------------------------------

/** Ngày dương cố định của Valentine, và ngày âm cố định của Thất Tịch. */
const VALENTINE_DAY = 14;
const VALENTINE_MONTH = 2;
const THAT_TICH_LUNAR_DAY = 7;
const THAT_TICH_LUNAR_MONTH = 7;

/** Năm đích của trang công cụ /valentine-2027. */
const TOOL_YEAR = 2027;

/** Cửa sổ 10 năm để nhìn thấy cả nhịp lùi lẫn cú nhảy do tháng nhuận. */
const FIRST_YEAR = TOOL_YEAR - 3;
const YEAR_COUNT = 10;
const YEARS = Array.from({ length: YEAR_COUNT }, (_, i) => FIRST_YEAR + i);

const daysInMonth = (month: number, year: number) =>
  new Date(Date.UTC(year, month, 0)).getUTCDate();

// prettier-ignore
const WEEKDAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'] as const;

/** Thứ trong tuần của một ngày dương lịch. Dùng UTC để không lệ thuộc múi giờ. */
function weekdayOf(dd: number, mm: number, yy: number): string {
  return WEEKDAYS[new Date(Date.UTC(yy, mm - 1, dd)).getUTCDay()] ?? '';
}

/** Thứ tự ngày trong năm — chỉ dùng để đo độ trôi, không hiển thị. */
const dayOfYear = (dd: number, mm: number, yy: number) =>
  Math.round((Date.UTC(yy, mm - 1, dd) - Date.UTC(yy, 0, 1)) / 86400000) + 1;

/**
 * Ngày dương ứng với một ngày âm của năm âm `lunarYear`. Repo không có hàm
 * âm → dương, nên quét các ngày dương trong khoảng tháng khả dĩ rồi hỏi ngược
 * solarToLunar — vẫn chỉ một nguồn sự thật.
 */
function solarDateOfLunar(
  lunarYear: number,
  lunarMonth: number,
  lunarDay: number,
  fromMonth: number,
  toMonth: number,
): { dd: number; mm: number } | undefined {
  for (let mm = fromMonth; mm <= toMonth; mm += 1) {
    for (let dd = 1; dd <= daysInMonth(mm, lunarYear); dd += 1) {
      const l = solarToLunar(dd, mm, lunarYear);
      if (!l.leap && l.year === lunarYear && l.month === lunarMonth && l.day === lunarDay) {
        return { dd, mm };
      }
    }
  }
  return undefined;
}

const fmt = (s?: { dd: number; mm: number }) => (s ? `${s.dd}/${s.mm}` : '—');

/** Một hàng của bảng đối chiếu: Valentine (dương cố định) ↔ Thất Tịch (âm cố định). */
const ROWS = YEARS.map((year) => {
  const lunar = solarToLunar(VALENTINE_DAY, VALENTINE_MONTH, year);
  const thatTich = solarDateOfLunar(
    year,
    THAT_TICH_LUNAR_MONTH,
    THAT_TICH_LUNAR_DAY,
    7,
    10,
  );
  return {
    year,
    valentineWeekday: weekdayOf(VALENTINE_DAY, VALENTINE_MONTH, year),
    lunar,
    lunarYearName: canChiOfYear(lunar.year).name,
    thatTich,
    thatTichWeekday: thatTich ? weekdayOf(thatTich.dd, thatTich.mm, year) : '',
    thatTichDoy: thatTich ? dayOfYear(thatTich.dd, thatTich.mm, year) : undefined,
  };
});

const TOOL_ROW = ROWS.find((r) => r.year === TOOL_YEAR);

/** Mùng 1 Tết của năm âm ấy — trang công cụ cũng nêu mốc này. */
const TET_TOOL_YEAR = solarDateOfLunar(TOOL_YEAR, 1, 1, 1, 3);
const TET_TO_VALENTINE_DAYS =
  TET_TOOL_YEAR === undefined
    ? undefined
    : dayOfYear(VALENTINE_DAY, VALENTINE_MONTH, TOOL_YEAR) -
      dayOfYear(TET_TOOL_YEAR.dd, TET_TOOL_YEAR.mm, TOOL_YEAR);

// --- Độ trôi của một ngày âm trên lịch dương, đo từ chính bảng trên -----------

const DOYS = ROWS.map((r) => r.thatTichDoy).filter((d): d is number => d !== undefined);
const SPREAD_DAYS = DOYS.length > 0 ? Math.max(...DOYS) - Math.min(...DOYS) : 0;

const EARLIEST = ROWS.filter((r) => r.thatTichDoy === Math.min(...DOYS))[0];
const LATEST = ROWS.filter((r) => r.thatTichDoy === Math.max(...DOYS))[0];

/** Chênh lệch giữa hai năm liền nhau: âm = lùi về trước, dương = nhảy về sau. */
const SHIFTS = DOYS.slice(1).map((d, i) => d - (DOYS[i] ?? d));
const BACK_SHIFTS = SHIFTS.filter((s) => s < 0).map((s) => Math.abs(s));
const JUMP_SHIFTS = SHIFTS.filter((s) => s > 0);

const BACK_MIN = BACK_SHIFTS.length > 0 ? Math.min(...BACK_SHIFTS) : 0;
const BACK_MAX = BACK_SHIFTS.length > 0 ? Math.max(...BACK_SHIFTS) : 0;
const JUMP_MIN = JUMP_SHIFTS.length > 0 ? Math.min(...JUMP_SHIFTS) : 0;
const JUMP_MAX = JUMP_SHIFTS.length > 0 ? Math.max(...JUMP_SHIFTS) : 0;

/** Những năm Valentine rơi TRƯỚC Tết — nhận ra bằng tháng âm còn là tháng Chạp. */
const BEFORE_TET = ROWS.filter((r) => r.lunar.month === 12);

// --- Liên kết: MỘT nhãn duy nhất cho mỗi đích --------------------------------
// `cta-consistency.guard` chặn việc cùng một href mang hai nhãn khác nhau, nên mọi
// link trong bài đi qua bảng này thay vì viết tay từng chỗ.

const LINKS = {
  valentine: { href: '/valentine-2027', label: 'Xem trang Valentine 2027' },
  hopTuoiTool: { href: '/hop-tuoi', label: 'Xem hợp tuổi hai người' },
  laSo: { href: '/la-so-tu-vi', label: 'Lập lá số Tử Vi' },
  lichVanNien: { href: '/lich-van-nien', label: 'Lịch vạn niên' },
  learnHopDoi: { href: '/learn/hop-doi', label: 'Điểm hợp đôi' },
  learnHopTuoi: { href: '/learn/hop-tuoi', label: 'Hợp tuổi 12 con giáp' },
  learnLich: { href: '/learn/lich-am-duong', label: 'Lịch âm dương' },
  learnBarnum: { href: '/learn/barnum', label: 'Hiệu ứng Barnum' },
  learnKiemChung: { href: '/learn/kiem-chung', label: 'Kiểm chứng dự đoán' },
  learnThatTich: { href: '/learn/that-tich', label: 'bài riêng về Thất Tịch' },
} as const;

/**
 * Thẻ "lăng kính khác" chọn tay (KHÔNG sửa registry): slug 'ngay-tinh-yeu' chưa có
 * trong bảng NEIGHBORS của lib/learn/related, nên relatedLearnLenses() rơi về nhánh
 * "4 chủ đề đầu danh sách" — Tử Vi, Bát Tự, MBTI, Big Five — chẳng dính gì tới ngày
 * lễ hay lịch pháp. Bốn slug dưới đây đều có thật trong LEARN_TOPICS. Cùng cách xử
 * lý mà /learn/tuong-mat đang dùng.
 */
const RELATED_LENSES = ['hop-doi', 'hop-tuoi', 'lich-am-duong', 'barnum']
  .map((slug) => learnTopicBySlug(slug))
  .filter((t): t is NonNullable<typeof t> => t !== undefined)
  .map(({ eyebrow, name, href }) => ({ eyebrow, name, href }));

const A = 'text-gold-700 underline-offset-4 hover:underline';

function L({ to }: { to: keyof typeof LINKS }) {
  return (
    <Link href={LINKS[to].href} className={A}>
      {LINKS[to].label}
    </Link>
  );
}

// FAQ khai báo MỘT lần, dùng cho cả accordion hiển thị lẫn FAQPage JSON-LD → chữ
// trên trang === chữ trong schema. Câu hỏi cố ý KHÁC bộ FAQ của /valentine-2027
// (ở đó hỏi "Valentine 2027 là thứ mấy", "xem hợp tuổi có phải bói không").
const FAQS = [
  {
    q: 'Vì sao Valentine năm nào cũng là 14/2 còn Thất Tịch thì năm nào cũng khác?',
    a: `Vì hai ngày neo vào hai hệ lịch khác nhau. Valentine neo vào lịch dương nên số ngày cố định là ${VALENTINE_DAY}/${VALENTINE_MONTH}, chỉ thứ trong tuần là đổi. Thất Tịch neo vào lịch âm ở mùng ${THAT_TICH_LUNAR_DAY} tháng ${THAT_TICH_LUNAR_MONTH}, mà 12 tháng âm ngắn hơn một năm dương, nên chiếu sang lịch dương thì nó lùi dần mỗi năm; tới khi lịch âm chèn một tháng nhuận thì nó nhảy vọt về sau. Trong ${YEAR_COUNT} năm được liệt kê trên trang này, Thất Tịch sớm nhất rơi ngày ${fmt(EARLIEST?.thatTich)} và muộn nhất rơi ngày ${fmt(LATEST?.thatTich)} — cách nhau ${SPREAD_DAYS} ngày.`,
  },
  {
    q: `Valentine ${TOOL_YEAR} rơi vào ngày âm nào?`,
    a: `Ngày ${VALENTINE_DAY}/${VALENTINE_MONTH}/${TOOL_YEAR} là ${TOOL_ROW?.valentineWeekday}, nhằm mùng ${TOOL_ROW?.lunar.day} tháng ${TOOL_ROW?.lunar.month} âm lịch năm ${TOOL_ROW?.lunarYearName}${TET_TO_VALENTINE_DAYS !== undefined ? `, tức đúng ${TET_TO_VALENTINE_DAYS} ngày sau mùng 1 Tết (${fmt(TET_TOOL_YEAR)})` : ''}. Con số này không phải chép tay: nó được đổi bằng chính engine lịch âm mà hieu.asia dùng cho các trang tra ngày, nên bạn tra lại ở công cụ lịch sẽ ra đúng như vậy.`,
  },
  {
    q: 'Ngày Valentine ở phương Tây bắt nguồn từ đâu?',
    a: `Ban đầu ngày ${VALENTINE_DAY}/${VALENTINE_MONTH} chỉ là một ngày lễ trong lịch nhà thờ phương Tây, dành cho một vị thánh tử đạo tên Valentinus — và danh tính vị ấy đến nay vẫn không rõ ràng, vì trong các danh sách cổ có nhiều người trùng tên với rất ít thông tin chắc chắn. Nghĩa "ngày của tình yêu" đến muộn hơn nhiều thế kỷ, qua thơ ca thời trung cổ ở châu Âu, rồi được ngành in thiệp và ngành bán lẻ khuếch đại thành một mùa mua sắm trong khoảng hai thế kỷ gần đây. Nói cách khác, nghĩa hôm nay được bồi lên qua nhiều lớp chứ không có sẵn từ đầu.`,
  },
  {
    q: 'Có đúng là Valentine bắt nguồn từ một lễ hội La Mã cổ không?',
    a: 'Đây là chuỗi kể rất phổ biến, nhưng nó là một liên hệ được dựng lại về sau chứ không dựa trên tài liệu đương thời, và phần lớn giới nghiên cứu hiện nay không nhận nó. Trang này chọn không dùng nó làm căn cứ. Nói vậy không phải để bác cho vui: khi một câu chuyện nguồn gốc nghe hay mà không có nguồn, nó thường được kể tiếp vì nó tiện, và cùng cơ chế đó cũng làm nhiều lời phán về vận mệnh được lan đi.',
  },
  {
    q: 'Valentine vào Việt Nam bằng đường nào?',
    a: 'Không qua phong tục bản địa, mà qua báo chí, phim ảnh, âm nhạc và hệ thống cửa hàng hoa – quà, trong vài chục năm gần đây. Đó là lý do nó phổ biến ở thành thị và trong giới trẻ trước, rồi lan dần. Ghi nhận điều này không phải để chê là "lai căng": mọi ngày lễ đều từng là ngày mới ở đâu đó, và một tục lệ trở thành của mình khi người ta thật sự dùng nó để đối đãi với nhau tử tế hơn.',
  },
  {
    q: 'Xem hợp đôi đúng ngày Valentine có chuẩn hơn ngày thường không?',
    a: 'Không, và chỗ này kiểm được chứ không phải chuyện tin hay không tin. Theo mô tả của chính trang công cụ, thứ bạn nhập khi xem hợp tuổi là năm sinh của hai người — không có ô nào nhận ngày bạn đang xem. Cùng đầu vào thì cùng kết quả, nên xem hôm nay hay xem đúng ngày lễ đều ra một thứ. Bạn có thể tự thử: xem một lần, lưu lại, rồi xem lại đúng ngày lễ và đối chiếu. Cái thật sự đổi vào ngày lễ là kỳ vọng của người đọc, không phải phép tính.',
  },
  {
    q: 'Nên chọn Valentine hay Thất Tịch làm ngày của mình?',
    a: 'Cả hai đều là ngày do cộng đồng chọn ra, nên không có ngày nào "đúng hơn" ngày nào — chọn ngày nào là chuyện của hai người và của gia đình. Điều đáng cân nhắc chỉ là chuyện thực tế: Valentine đứng yên trên lịch dương nên dễ hẹn trước, còn Thất Tịch trôi trên lịch dương nên năm nào cũng phải tra lại, và có năm nó rơi giữa tuần làm việc.',
  },
  {
    q: `Trang Valentine ${TOOL_YEAR} của hieu.asia làm gì, và không làm gì?`,
    a: `Trang đó nêu mốc ngày của dịp (dương lịch và âm lịch), giải thích ba lớp mà phép xem hợp tuổi đối chiếu là địa chi, ngũ hành nạp âm và cung mệnh, nói rõ vì sao nó từ chối gộp tất cả thành một con số phần trăm, và chỉ đường sang các công cụ tương ứng. Nó không tính bất cứ thứ gì về Thất Tịch, không chấm điểm ngày lễ, và không có chỗ nào nhận "ngày bạn đang xem" làm đầu vào — vì vậy bài học này cũng không dạy những phần đó. Đây còn là một trang theo mùa: hết mùa ${TOOL_YEAR} nó tự chuyển hướng sang trang thường trực, nên đừng ngạc nhiên nếu về sau đường dẫn đưa bạn tới chỗ khác.`,
  },
];

const JSONLD = [
  article({
    headline: 'Ngày tình yêu: Valentine và Thất Tịch được đánh dấu bằng gì',
    description:
      'Valentine neo vào lịch dương nên cố định 14/2; Thất Tịch neo vào lịch âm nên trôi mỗi năm. Bài giải thích nguồn gốc, đường du nhập, và vì sao ngày lễ không phải mốc vận mệnh.',
    url: '/learn/ngay-tinh-yeu',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Ngày tình yêu', url: '/learn/ngay-tinh-yeu' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Ngày tình yêu — Valentine, Thất Tịch và cách đọc một ngày lễ cho đúng',
    description:
      'Hai cách đánh dấu tình yêu: một ngày dương cố định và một ngày âm trôi theo trăng. Nguồn gốc, đường du nhập, và ranh giới giữa quy ước xã hội với vận mệnh.',
    url: '/learn/ngay-tinh-yeu',
  }),
];

const TD = 'px-4 py-2 text-muted-foreground';

function TableHead({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr className="border-b border-border bg-card/60">
        {cols.map((c) => (
          <th key={c} scope="col" className="px-4 py-2.5 font-semibold text-foreground">
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function Scroller({ minWidth, children }: { minWidth: string; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className={`w-full ${minWidth} text-left text-sm`}>{children}</table>
    </div>
  );
}

export default function LearnNgayTinhYeuPage() {
  return (
    <LearnArticle
      eyebrow="NGÀY LỄ · QUY ƯỚC"
      title={
        <>
          Ngày tình yêu{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            (Valentine và Thất Tịch)
          </span>
        </>
      }
      standfirst={
        <>
          Một ngày thì năm nào cũng đứng yên ở {VALENTINE_DAY}/{VALENTINE_MONTH}, ngày kia thì năm
          nào cũng nhảy đi chỗ khác. Bài này giải thích vì sao hai nền văn hoá lại chọn hai cách neo
          lịch khác nhau để đánh dấu chuyện tình cảm — và vì sao “xem tình duyên đúng ngày lễ” là
          ghép hai thứ vốn không liên quan.
        </>
      }
      readMeta="13 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Ngày tình yêu' },
      ]}
      relatedLenses={RELATED_LENSES}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb: `Trang Valentine ${TOOL_YEAR} nêu mốc ngày của dịp theo cả lịch dương lẫn lịch âm, giải thích ba lớp mà phép xem hợp tuổi đối chiếu, và chỉ đường sang đúng công cụ cho từng việc.`,
        href: LINKS.valentine.href,
        label: LINKS.valentine.label,
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <NgayTinhYeuFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Ngày tình yêu là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Một “ngày tình yêu” là <strong>ngày đánh dấu</strong>: cả cộng đồng ngầm đồng ý rằng
                hôm nay là dịp để nghĩ và nói về chuyện tình cảm. Nó thuộc cùng họ với ngày của mẹ,
                ngày nhà giáo, ngày giỗ tổ — những mốc do <strong>con người chọn ra</strong> rồi lặp
                lại đủ lâu để thành quen.
              </p>
              <p>
                Hai ngày được bài này đặt cạnh nhau khác nhau ở đúng một chỗ:{' '}
                <strong>chúng neo vào hệ lịch nào</strong>.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>
                    Valentine neo vào lịch dương: {VALENTINE_DAY}/{VALENTINE_MONTH}, không đổi.
                  </strong>{' '}
                  Chỉ thứ trong tuần là đổi — năm {TOOL_YEAR} nó rơi vào {TOOL_ROW?.valentineWeekday}
                  .
                </li>
                <li>
                  <strong>
                    Thất Tịch neo vào lịch âm: mùng {THAT_TICH_LUNAR_DAY} tháng{' '}
                    {THAT_TICH_LUNAR_MONTH}, cũng không đổi.
                  </strong>{' '}
                  Nhưng chiếu sang lịch dương thì nó trôi: trong {YEAR_COUNT} năm ở bảng bên dưới, nó
                  chạy qua một khoảng rộng {SPREAD_DAYS} ngày.
                </li>
              </ul>
              <p>Và ba điều cần chốt ngay về những ngày này:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Nghĩa của ngày không có sẵn trong tự nhiên.</strong> Không có hiện tượng
                  nào của Trái Đất hay bầu trời đánh dấu ngày {VALENTINE_DAY}/{VALENTINE_MONTH} là
                  ngày của tình yêu. Thất Tịch thì khác một nửa: ngày của nó có gắn với một cảnh
                  trời thật (phần dưới nói kỹ) — nhưng cảnh trời ấy chỉ là cảnh trời, còn việc coi
                  nó là chuyện đôi lứa vẫn là do người gán. Cái có thật ở cả hai ngày là{' '}
                  <em>thoả thuận</em> giữa người với người.
                </li>
                <li>
                  <strong>Không phải một biến trong phép xem hợp đôi.</strong> Phép đối chiếu tuổi
                  nhận năm sinh và giới tính của hai người — không có ô nào nhận “hôm nay là ngày lễ
                  gì”. (hieu.asia có những công cụ nhận một <em>ngày</em> làm đầu vào — xem ngày tốt,
                  lịch vạn niên, tử vi hôm nay — nhưng thứ chúng đọc là can chi của ngày đó, không
                  phải việc ngày đó có được ai đặt tên là ngày lễ hay không.) Mục{' '}
                  <Link href="#ngay-le-va-tinh-duyen" className={A}>ghép sai phạm trù</Link> nói kỹ
                  chỗ này.
                </li>
                <li>
                  <strong>Không phải thứ đáng bỏ đi vì “chỉ là quy ước”.</strong> Một cái hẹn chung
                  là thứ có ích thật: nó cho người ta cái cớ để nói điều bình thường ngại nói.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Hai phạm vi bài này cố ý không lấn: cách chấm mức hợp giữa hai người thuộc bài{' '}
                <L to="learnHopDoi" />, còn bảng quan hệ giữa 12 con giáp thuộc bài{' '}
                <L to="learnHopTuoi" />. Riêng Thất Tịch đã có <L to="learnThatTich" /> (sự tích,
                hai ngôi sao thật, tục ăn chè đậu đỏ); ở đây nó chỉ xuất hiện với tư cách{' '}
                <strong>vật đối chiếu về cách neo lịch</strong>.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <NgayTinhYeuDepth />,
        },
        {
          id: 'valentine-tu-dau',
          tocLabel: 'Valentine từ đâu ra',
          heading: 'Ngày Valentine đến từ đâu — và tới Việt Nam bằng đường nào',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Câu chuyện nguồn gốc của ngày này thường được kể rất gọn và rất chắc chắn. Sự thật thì
                lỏng hơn, và biết chỗ lỏng ấy lại là phần hữu ích nhất.
              </p>
              <p>
                Điểm khởi đầu chắc chắn nhất: ngày {VALENTINE_DAY}/{VALENTINE_MONTH} vốn là một{' '}
                <strong>ngày lễ trong lịch nhà thờ phương Tây</strong>, dành cho một vị thánh tử đạo
                tên Valentinus. Bản thân danh tính vị ấy đã không rõ — trong các danh sách cổ có nhiều
                người trùng tên, với rất ít thông tin chắc chắn kèm theo. Những giai thoại quen thuộc
                (lén làm lễ cưới cho lính, để lại lá thư ký tên trước khi bị hành hình) xuất hiện{' '}
                <strong>muộn hơn nhiều thế kỷ</strong> so với thời điểm được cho là của nhân vật.
              </p>
              <p>
                Nghĩa “ngày của tình yêu” cũng đến muộn. Nó xuất hiện rõ trong{' '}
                <strong>thơ ca thời trung cổ ở châu Âu</strong>, nơi ngày này được gắn với hình ảnh
                mùa chim ghép đôi vào cuối mùa đông. Từ một hình ảnh văn chương, nó thành tục viết thư
                tình, rồi thành thiệp in hàng loạt khi ngành in rẻ đi, rồi thành một{' '}
                <strong>mùa bán hàng</strong> với hoa, sô-cô-la và quà tặng. Mỗi lớp đều để lại dấu,
                và lớp gần nhất — lớp thương mại — là lớp dày nhất trong hình dung của chúng ta hôm
                nay.
              </p>
              <p>
                Có một chi tiết đáng nói thẳng: chuỗi kể “Valentine là biến thể của một lễ hội La Mã
                cổ” rất phổ biến, nhưng đó là một <strong>liên hệ được dựng lại về sau</strong>, không
                có tài liệu đương thời chống lưng, và phần lớn giới nghiên cứu hiện nay không nhận nó.
                Bài này không dùng nó làm căn cứ. Nêu ra vì cơ chế của nó rất đáng học: một câu chuyện
                nguồn gốc nghe hay thì được kể tiếp mãi, kể cả khi không ai kiểm lại — đúng cơ chế
                khiến nhiều lời phán về vận mệnh sống dai.
              </p>
              <p>
                <strong>Đường vào Việt Nam</strong> thì gần và dễ lần hơn nhiều. Valentine không đi
                vào bằng phong tục bản địa, mà bằng <strong>truyền thông và thị trường</strong>: báo
                chí, phim ảnh, nhạc, rồi hệ thống cửa hàng hoa – quà và các chiến dịch khuyến mãi.
                Điều đó giải thích vì sao nó phổ biến ở thành thị và trong giới trẻ trước, rồi mới lan
                rộng; và vì sao ở đây nó gần như không kèm nghi lễ nào, chỉ còn phần tặng quà và hẹn
                hò.
              </p>
              <p className="text-sm text-foreground/70">
                Ghi nhận chuyện “du nhập” không phải để chê ai lai căng. Mọi ngày lễ đều từng là ngày
                mới ở đâu đó — và một tục lệ thành của mình khi người ta thật sự dùng nó để đối đãi
                với nhau tử tế hơn, chứ không phải khi nó đủ cổ.
              </p>
            </div>
          ),
        },
        {
          id: 'that-tich-doi-chieu',
          tocLabel: 'Đối chiếu Thất Tịch',
          heading: 'Thất Tịch: một ngày âm, một tích truyện, và hai ngôi sao',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Phương Đông cũng có ngày của mình, và nó ra đời{' '}
                <strong>hoàn toàn độc lập</strong> với ngày phương Tây. Thất Tịch rơi vào{' '}
                <strong>
                  mùng {THAT_TICH_LUNAR_DAY} tháng {THAT_TICH_LUNAR_MONTH} âm lịch
                </strong>{' '}
                — chính cái tên đã là “đêm mùng bảy”.
              </p>
              <p>
                Ngày này đứng trên hai chân. Chân thứ nhất là một <strong>tích truyện</strong>: chàng
                chăn trâu và nàng dệt vải yêu nhau, bị chia cắt bởi một dòng sông trên trời, mỗi năm
                chỉ được gặp nhau một đêm. Chân thứ hai là một{' '}
                <strong>hiện tượng nhìn được trên trời</strong>: hai ngôi sao sáng nằm hai bên dải
                Ngân Hà — trong tiếng Việt gọi theo tích là sao Ngưu Lang và sao Chức Nữ — và vào
                quãng tháng {THAT_TICH_LUNAR_MONTH} âm lịch, chúng lên cao giữa bầu trời đêm, dễ thấy
                nhất trong năm. Câu chuyện được kể để giải thích cái người ta nhìn thấy, chứ không
                phải ngược lại.
              </p>
              <p>
                Ở Việt Nam, tích ấy được bản địa hoá thành chuyện ông Ngâu bà Ngâu, và những cơn mưa
                rả rích quãng thời gian đó được gọi là mưa ngâu. Đây là một ví dụ đẹp cho cùng cái cơ
                chế đã nói ở phần trên: <strong>một ngày lễ luôn được kể lại bằng chất liệu của nơi
                nó tới</strong>.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Đứng yên hay trôi: nhìn {YEAR_COUNT} năm là thấy
              </h3>
              <p>
                Bảng dưới đặt hai ngày cạnh nhau. Cột giữa là Valentine — số ngày đứng yên, chỉ thứ
                trong tuần và ngày âm tương ứng là đổi. Hai cột cuối là Thất Tịch — ngày âm đứng yên,
                còn ngày dương thì chạy. Không ô nào trong bảng được gõ tay: tất cả do trang này đổi
                bằng đúng engine lịch âm mà các trang tra ngày của hieu.asia dùng.
              </p>
              <Scroller minWidth="min-w-[820px]">
                <TableHead
                  cols={[
                    'Năm',
                    `Valentine ${VALENTINE_DAY}/${VALENTINE_MONTH} — thứ`,
                    'Valentine nhằm ngày âm',
                    `Thất Tịch (mùng ${THAT_TICH_LUNAR_DAY} tháng ${THAT_TICH_LUNAR_MONTH}) — ngày dương`,
                    'Thất Tịch — thứ',
                  ]}
                />
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.year} className="border-b border-border/60 last:border-b-0">
                      <th
                        scope="row"
                        className="px-4 py-2 text-left font-medium tabular-nums text-foreground"
                      >
                        {r.year}
                      </th>
                      <td className={TD}>{r.valentineWeekday}</td>
                      <td className={TD}>
                        {r.lunar.day}/{r.lunar.month}{' '}
                        <span className="text-foreground/50">({r.lunarYearName})</span>
                      </td>
                      <td className="px-4 py-2 tabular-nums text-foreground">
                        {fmt(r.thatTich)}
                      </td>
                      <td className={TD}>{r.thatTichWeekday}</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <p>
                Đọc bảng theo hai chiều thì thấy hai chuyện đối xứng nhau:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Ngày âm nhìn từ lịch dương thì trôi.</strong> Thất Tịch lùi về trước{' '}
                  {BACK_MIN}–{BACK_MAX} ngày mỗi năm, rồi ở {JUMP_SHIFTS.length} năm trong{' '}
                  {SHIFTS.length} lần chuyển của bảng, nó nhảy vọt về sau {JUMP_MIN}–{JUMP_MAX} ngày.
                  Cú nhảy chính là dấu hiệu lịch âm vừa chèn một tháng nhuận để kéo mình về đúng mùa.
                  Sớm nhất trong bảng là ngày {fmt(EARLIEST?.thatTich)} năm {EARLIEST?.year}, muộn
                  nhất là ngày {fmt(LATEST?.thatTich)} năm {LATEST?.year}.
                </li>
                <li>
                  <strong>Ngày dương nhìn từ lịch âm cũng trôi y như vậy.</strong> Cột “nhằm ngày âm”
                  chạy loạn xạ qua các năm, và trong {YEAR_COUNT} năm ở bảng có{' '}
                  {BEFORE_TET.length === 0 ? 'không năm nào' : `${BEFORE_TET.length} năm`} Valentine
                  rơi <em>trước</em> Tết, tức vẫn còn trong tháng Chạp
                  {BEFORE_TET.length > 0
                    ? ` (${BEFORE_TET.map((r) => r.year).join(', ')})`
                    : ''}
                  . Còn năm {TOOL_YEAR} thì ngược lại: Valentine rơi sau Tết
                  {TET_TO_VALENTINE_DAYS !== undefined
                    ? ` đúng ${TET_TO_VALENTINE_DAYS} ngày`
                    : ''}
                  , nên dịp này chồng lên tuần Tết.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Không hệ lịch nào ở đây “chuẩn hơn” hệ kia — chúng đếm hai thứ khác nhau, một bên
                theo Mặt Trời, một bên theo tuần trăng có hiệu chỉnh. Cấu tạo của hai hệ và cách tháng
                nhuận được chèn vào thuộc bài <L to="learnLich" />. Bản thân Thất Tịch — sự tích, hai
                ngôi sao thật phía sau, và những gì người ta làm trong ngày ấy — có <L to="learnThatTich" />
                . Cần tra một ngày cụ thể quanh dịp nào đó thì dùng <L to="lichVanNien" />.
              </p>
            </div>
          ),
        },
        {
          id: 'ngay-le-va-tinh-duyen',
          tocLabel: 'Ghép sai phạm trù',
          heading: '“Xem tình duyên đúng ngày lễ”: ghép hai thứ vốn không liên quan',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Cứ tới mùa lễ là xuất hiện lời mời quen thuộc: xem đúng ngày thì kết quả “chuẩn hơn”,
                “thiêng hơn”. Đây là chỗ bài này nói thẳng nhất, và may là chỗ này{' '}
                <strong>kiểm được</strong> chứ không phải chuyện tin hay không tin.
              </p>
              <p>
                Một ngày lễ là <strong>quy ước xã hội</strong>: nó tồn tại vì đủ nhiều người đồng ý
                rằng nó tồn tại. Một phép đối chiếu tuổi là <strong>hàm của năm sinh</strong>: đưa vào
                hai năm sinh thì ra một kết quả. Hai thứ này{' '}
                <strong>không có biến nào chung</strong>. Không phải là chúng “chưa được chứng minh
                liên quan” — mà là chúng không thể liên quan, giống như hỏi một cái cân xem hôm nay
                thứ mấy.
              </p>
              <p>
                Bằng chứng nằm ngay trong mô tả của công cụ: thứ bạn nhập khi xem hợp tuổi là{' '}
                <strong>năm sinh của hai người</strong>, và không có ô nào để nhập ngày bạn đang xem.
                Cùng đầu vào thì cùng đầu ra. Bạn tự thử được trong hai phút: xem một lần hôm nay, lưu
                lại màn hình, rồi xem lại đúng ngày lễ và đối chiếu hai kết quả.
              </p>
              <p>
                Vậy cái gì đổi thật vào ngày lễ? <strong>Người đọc đổi.</strong> Hôm đó bạn đang mong
                chờ nhiều hơn, đang để tâm tới chuyện tình cảm hơn, nên một mô tả chung chung sẽ thấy
                đúng hơn hẳn ngày thường. Hiện tượng này có tên và đã được đo — bài{' '}
                <L to="learnBarnum" /> nói riêng về nó, còn bài <L to="learnKiemChung" /> chỉ cách tự
                dựng phép thử cho một lời phán bất kỳ.
              </p>
              <p>
                Nói cho công bằng với chính công cụ: trang đích của bài{' '}
                <strong>không hứa điều đó</strong>. Nó nêu mốc ngày, giải thích ba lớp mà phép xem hợp
                tuổi đối chiếu — địa chi, ngũ hành nạp âm và cung mệnh — và nói thẳng vì sao nó từ
                chối gộp cả ba thành một con số kiểu “hợp 87%”: con số gộp nghe cho sướng nhưng không
                kiểm chứng được. Nó cũng nói rõ chữ “khắc” chỉ mô tả hai kiểu năng lượng dễ va nhau,
                không phải một bản án cho mối quan hệ.
              </p>
              <p className="text-sm text-foreground/70">
                Muốn thử thì vào <L to="hopTuoiTool" /> để xem từng lớp đối chiếu ra kết quả gì, hoặc{' '}
                <L to="laSo" /> nếu bạn muốn xem cung Phu Thê của riêng mình thay vì đọc chung cho cả
                con giáp. Cả hai đều không hỏi hôm nay là ngày mấy — và đó chính là điều bài này muốn
                bạn để ý.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: ngày lễ nói về chúng ta, không nói về tương lai',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Phần này nói rõ những gì bài học <em>không</em> cho bạn, để bạn không mang kỳ vọng sai
                ra khỏi trang.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Ngày lễ không dự báo gì cả.</strong> Việc {VALENTINE_DAY}/{VALENTINE_MONTH}{' '}
                  năm nay rơi vào cuối tuần hay giữa tuần chỉ ảnh hưởng tới lịch của bạn, không ảnh
                  hưởng tới chuyện tình cảm của bạn. Không có phép đo nào nối hai thứ đó.
                </li>
                <li>
                  <strong>Không có “ngày đẹp để tỏ tình” tính được ở đây.</strong> hieu.asia có công
                  cụ chọn ngày theo việc — chẳng hạn chốt ngày cưới — nhưng phần đó dựa trên can chi
                  và tuổi của hai người trong cuộc, không dựa trên ngày lễ. Trang Valentine{' '}
                  {TOOL_YEAR} không chấm điểm ngày lễ, nên bài này cũng không dạy phần đó.
                </li>
                <li>
                  <strong>Phần lịch sử ở đây là kể lại, không phải khảo cứu gốc.</strong> Những gì bài
                  viết chắc thì nói chắc; chỗ nào giới nghiên cứu còn chưa ngã ngũ — như liên hệ giữa
                  Valentine và các lễ hội cổ hơn — thì bài nói rõ là chưa ngã ngũ, thay vì kể cho
                  trơn.
                </li>
                <li>
                  <strong>Và một điều không thuộc về lịch chút nào:</strong> chất lượng của một mối
                  quan hệ đến từ cách hai người đối xử với nhau trong những ngày{' '}
                  <em>không</em> phải ngày lễ. Không tờ lịch nào, không bảng tra nào thay được phần
                  đó.
                </li>
              </ul>
              <p>
                Cách dùng lành mạnh thì rất đơn giản: xem ngày lễ như một{' '}
                <strong>lời nhắc đã hẹn trước</strong> — một dịp để làm điều bạn vẫn định làm mà cứ
                lần lữa. Giữ nó vì nó đẹp và vì nó có ích cho việc nói ra điều khó nói. Chỉ nên cảnh
                giác khi có ai đó dùng ngày lễ để làm cho một lời phán nghe đáng tin hơn mức nó xứng
                đáng.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <NgayTinhYeuWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <NgayTinhYeuRecall />,
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
                Bài này dừng ở chỗ ngày lễ được đánh dấu ra sao. Muốn đi tiếp về phía phép tính: bài{' '}
                <L to="learnHopDoi" /> nói cách chấm mức hợp giữa hai người và giới hạn của nó, còn
                bài <L to="learnHopTuoi" /> nói vì sao 12 con giáp lại chia thành các nhóm hợp và các
                cặp xung. Muốn đi tiếp về phía lịch thì đọc bài <L to="learnLich" />.
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: LINKS.valentine.href, label: LINKS.valentine.label },
                    { href: LINKS.hopTuoiTool.href, label: LINKS.hopTuoiTool.label },
                    { href: LINKS.laSo.href, label: LINKS.laSo.label },
                    { href: LINKS.lichVanNien.href, label: LINKS.lichVanNien.label },
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
          children: <NgayTinhYeuChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
