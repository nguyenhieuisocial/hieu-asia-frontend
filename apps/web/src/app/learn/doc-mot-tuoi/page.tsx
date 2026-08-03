/**
 * Bài học /learn/doc-mot-tuoi — đọc kết quả của công cụ Tra cứu tuổi theo ĐỘ CHẮC.
 *
 * NGUỒN GROUNDING (đọc code, không đoán) — công cụ đích là `app/tra-cuu-tuoi/`:
 *   • app/tra-cuu-tuoi/page.tsx   — hero + khối TERMS giải nghĩa + FAQ của công cụ.
 *   • app/tra-cuu-tuoi/TraCuuTuoi.tsx — engine thật: nhận NĂM sinh + GIỚI TÍNH,
 *     rồi gọi đúng những hàm dưới đây và render 6 thẻ kết quả.
 * Các lib mà TraCuuTuoi.tsx gọi, và bài này import lại để RENDER THẲNG số liệu:
 *   • lib/sinh-con.ts         — yearProfile(năm) → canChi, zodiac, napAmName, element
 *   • lib/dat-ten-ngu-hanh.ts — ELEMENTS[...] → tên mệnh ngũ hành
 *   • lib/xem-tuoi-cuoi.ts    — CHI, canChiOfYear, checkKimLau, checkTamTai, checkXungNam
 *   • lib/xem-tuoi-lam-nha.ts — checkHoangOc
 *   • lib/sao-han.ts          — computeSaoHan(năm, giới tính, năm xét)
 *   • lib/huong-nha.ts        — computeHuongNha(năm, giới tính), groupLabel
 *   • lib/ban-menh-data.ts    — BIRTH_YEARS (phạm vi có dữ liệu màu & nghề)
 *
 * CÔNG CỤ THẬT SỰ LÀM GÌ: gom mọi lát cắt phong tục của MỘT NĂM SINH về một chỗ,
 * và hiện nguyên phép tính (tuổi mụ bao nhiêu, chia mấy, dư mấy) thay vì chỉ phán.
 * NHỮNG GÌ NÓ KHÔNG LÀM: không có ô ngày / tháng / GIỜ sinh → không lập lá số;
 * không có ô chọn năm muốn xét → khối "Năm nay với tuổi này" luôn dùng
 * `new Date().getFullYear()`; không xét cho một VIỆC cụ thể (cưới, làm nhà, khai
 * trương) mà chỉ nói chung theo năm; không xét lục hại và không xét Tương Hình.
 * Vì vậy mọi bảng nhiều năm trong bài đều được nói rõ là "chạy lại cùng phép
 * tính cho nhiều năm", KHÔNG trình bày như một tính năng của công cụ.
 *
 * PHẠM VI: cơ chế từng hạn thuộc bài riêng (Kim Lâu, Tam Tai, sao hạn, nạp âm,
 * can chi) — ở đây MỘT câu + link. Lõi riêng của bài này là PHÂN LOẠI kết quả
 * theo độ chắc: lịch–toán / phong tục / không suy được.
 *
 * Giọng: trung thực về giới hạn, không doạ, không phán số mệnh, không mỉa mai.
 */

import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@hieu-asia/ui';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { relatedLearnLenses } from '@/lib/learn/related';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, course, faqPage } from '@/lib/seo/jsonld';
import { CHI, canChiOfYear, checkKimLau, checkTamTai, checkXungNam } from '@/lib/xem-tuoi-cuoi';
import { yearProfile } from '@/lib/sinh-con';
import { ELEMENTS } from '@/lib/dat-ten-ngu-hanh';
import { checkHoangOc } from '@/lib/xem-tuoi-lam-nha';
import { computeSaoHan } from '@/lib/sao-han';
import { computeHuongNha, groupLabel } from '@/lib/huong-nha';
import { BIRTH_YEARS as BAN_MENH_YEARS } from '@/lib/ban-menh-data';
import {
  DocMotTuoiFrame, DocMotTuoiDepth, DocMotTuoiRecall, DocMotTuoiChecklist, DocMotTuoiWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Năm sinh suy ra được gì — và không được gì',
  description:
    'Từ một năm sinh, công cụ suy ra can chi, con giáp, nạp âm, mệnh — chắc như phép chia. Kim Lâu, Tam Tai, sao hạn là quy ước phong tục. Giờ sinh không suy được.',
  alternates: { canonical: 'https://hieu.asia/learn/doc-mot-tuoi' },
};

// --- Dữ kiện suy từ lib ------------------------------------------------------

/** Độ dài vòng can chi, ĐO bằng chính canChiOfYear thay vì gõ tay "60". */
const CYCLE = (() => {
  const base = canChiOfYear(1900).name;
  for (let n = 1; n <= 240; n += 1) if (canChiOfYear(1900 + n).name === base) return n;
  return 0;
})();

/** Số tên nạp âm khác nhau trong trọn một vòng can chi. */
const NAP_AM_COUNT = new Set(
  Array.from({ length: CYCLE }, (_, i) => yearProfile(1900 + i)?.napAmName).filter(Boolean),
).size;

/** Phạm vi năm mà bảng can chi của công cụ trả về kết quả (dò bằng yearProfile). */
const ENGINE_RANGE = (() => {
  let min = 0;
  let max = 0;
  for (let y = 1800; y <= 2200; y += 1) {
    if (!yearProfile(y)) continue;
    if (min === 0) min = y;
    max = y;
  }
  return { min, max };
})();

/** Phạm vi năm sinh có dữ liệu "màu & nghề hợp mệnh" — thẻ đó vắng nếu ngoài khoảng. */
const BAN_MENH_RANGE = { min: Math.min(...BAN_MENH_YEARS), max: Math.max(...BAN_MENH_YEARS) };

/**
 * Khoảng năm mà Ô NHẬP của công cụ thật sự chấp nhận — HẸP HƠN bảng can chi.
 * Gõ tay vì `TraCuuTuoi.tsx` khai `const MIN_YEAR = 1930` / `MAX_YEAR = 2030` ở
 * phạm vi module (không export). Ngoài khoảng này ô nhập báo lỗi ngay, nên đây
 * mới là biên người dùng gặp — không phải biên 1900–2100 của bảng can chi.
 */
const TOOL_YEAR_RANGE = { min: 1930, max: 2030 };

/** Ba năm sinh làm ví dụ. ĐÂY LÀ ĐẦU VÀO — mọi cột còn lại do lib suy ra. */
const SAMPLE_ROWS = [1985, 1990, 2000].map((year) => {
  const p = yearProfile(year);
  return {
    year,
    canChi: p?.canChi ?? '—',
    zodiac: p?.zodiac.ten ?? '—',
    napAm: p?.napAmName ?? '—',
    menh: p ? ELEMENTS[p.element].name : '—',
  };
});

/** Năm sinh và năm khởi đầu dùng xuyên suốt các ví dụ. Cả hai đều là ĐẦU VÀO. */
const BIRTH = 1990;
const START_YEAR = 2026;

const BIRTH_PROFILE = yearProfile(BIRTH);
const BIRTH_CANCHI = BIRTH_PROFILE?.canChi ?? '—';
const BIRTH_ZODIAC = BIRTH_PROFILE?.zodiac.ten ?? '—';
const BIRTH_NAPAM = BIRTH_PROFILE?.napAmName ?? '—';
const BIRTH_MENH = BIRTH_PROFILE ? ELEMENTS[BIRTH_PROFILE.element].name : '—';

/** Trọn một vòng chi năm kể từ START_YEAR — mỗi chi xuất hiện đúng một lần. */
const EXAM_YEARS = Array.from({ length: CHI.length }, (_, i) => START_YEAR + i);

const YEAR_ROWS = EXAM_YEARS.map((y) => {
  const kimLau = checkKimLau(BIRTH, y);
  const tamTai = checkTamTai(BIRTH, y);
  const xung = checkXungNam(BIRTH, y);
  const hoangOc = checkHoangOc(BIRTH, y);
  return {
    year: y,
    yearCanChi: canChiOfYear(y).name,
    ageMu: kimLau.ageMu,
    kimLau: kimLau.type ? `Phạm ${kimLau.type}` : 'Không',
    // checkKimLau trả về `type?: KimLauType` — KHÔNG phạm là `undefined`, không
    // phải null. So với null thì luôn true và mọi con số đếm bên dưới sẽ sai.
    kimLauPham: !!kimLau.type,
    tamTai: tamTai.isTamTai ? 'Phạm' : 'Không',
    tamTaiPham: tamTai.isTamTai,
    xung: xung.isXung ? 'Xung năm' : xung.isNamTuoi ? 'Năm tuổi' : 'Không',
    hoangOc: hoangOc.isPham ? `Phạm ${hoangOc.cung}` : hoangOc.cung,
    hoangOcPham: hoangOc.isPham,
  };
});

const KIM_LAU_COUNT = YEAR_ROWS.filter((r) => r.kimLauPham).length;
const TAM_TAI_COUNT = YEAR_ROWS.filter((r) => r.tamTaiPham).length;
const HOANG_OC_COUNT = YEAR_ROWS.filter((r) => r.hoangOcPham).length;
/** Số năm trong dãy mà cả bốn cột hạn đều ghi "Không". */
const CLEAN_COUNT = YEAR_ROWS.filter(
  (r) => !r.kimLauPham && !r.tamTaiPham && r.xung === 'Không' && !r.hoangOcPham,
).length;

/**
 * Chạy lại đúng bốn phép ấy cho MỌI năm sinh mà ô nhập chấp nhận và đã tới, để
 * biết số năm "sạch" trong một dãy 12 năm dao động trong khoảng nào — tránh
 * suy từ một năm sinh duy nhất ra kết luận cho mọi năm sinh.
 */
const CLEAN_SPREAD = (() => {
  let min = EXAM_YEARS.length;
  let max = 0;
  for (let b = TOOL_YEAR_RANGE.min; b <= START_YEAR; b += 1) {
    const clean = EXAM_YEARS.filter((y) => {
      const x = checkXungNam(b, y);
      return !checkKimLau(b, y).type && !checkTamTai(b, y).isTamTai && !x.isXung
        && !x.isNamTuoi && !checkHoangOc(b, y).isPham;
    }).length;
    if (clean < min) min = clean;
    if (clean > max) max = clean;
  }
  return { min, max };
})();

const TAM_TAI_CHIS = checkTamTai(BIRTH, START_YEAR).tamTaiChis.join(' – ');

/** Cùng một năm sinh, chỉ đổi giới tính — hai lớp cuối trang đổi theo. */
const GENDERS = [{ key: 'nam' as const, label: 'Nam' }, { key: 'nu' as const, label: 'Nữ' }];

const GENDER_ROWS = GENDERS.map((g) => {
  const huong = computeHuongNha(BIRTH, g.key);
  return {
    label: g.label,
    canChi: BIRTH_CANCHI,
    napAm: BIRTH_NAPAM,
    menh: BIRTH_MENH,
    cungPhi: huong.cungPhi,
    group: groupLabel(huong.group),
    good: huong.good.slice(0, 3).map((d) => d.direction).join(', '),
    sao: computeSaoHan(BIRTH, g.key, START_YEAR)?.sao.name ?? '—',
  };
});

// --- Bảng phân tầng ----------------------------------------------------------

type TangKey = 'calendar' | 'mixed' | 'custom' | 'none';

const TANG_LABEL: Record<TangKey, string> = {
  calendar: 'Lịch – toán',
  mixed: 'Nửa toán, nửa quy ước',
  custom: 'Phong tục',
  none: 'Không suy được',
};

interface LayerRow { muc: string; canGi: string; tang: TangKey; kiem: string }

/** Mỗi dòng = một mục CÓ THẬT trên trang kết quả của công cụ (trừ dòng cuối). */
const LAYER_ROWS: LayerRow[] = [
  { muc: 'Can Chi', canGi: 'Năm sinh', tang: 'calendar',
    kiem: 'Đối chiếu bất kỳ bảng lịch can chi nào cũng ra cùng kết quả. Đây là tên của năm, không phải nhận định về bạn.' },
  { muc: 'Con giáp', canGi: 'Năm sinh', tang: 'calendar',
    kiem: 'Chính là phần địa chi của can chi, gọi bằng tên con vật. Không thêm thông tin nào.' },
  { muc: 'Nạp âm', canGi: 'Năm sinh', tang: 'calendar',
    kiem: `Bảng ${CYCLE} năm cố định, gồm ${NAP_AM_COUNT} tên nạp âm — mỗi tên dùng cho hai năm liền.` },
  { muc: 'Mệnh ngũ hành', canGi: 'Năm sinh (qua nạp âm)', tang: 'calendar',
    kiem: 'Suy thẳng từ nạp âm, một bước tra bảng. Việc gán ý nghĩa cho hành thì đã sang tầng dưới.' },
  { muc: 'Tuổi mụ / tuổi dương', canGi: 'Năm sinh + năm đang xét', tang: 'calendar',
    kiem: 'Một phép trừ, cộng thêm 1 theo tục tính tuổi. Đổi năm xét là đổi kết quả.' },
  { muc: 'Kim Lâu', canGi: 'Tuổi mụ (chia 9)', tang: 'custom',
    kiem: 'Kiểm được phép chia — công cụ hiện luôn số dư. Không kiểm được vì sao đúng những số dư ấy bị coi là phạm.' },
  { muc: 'Tam Tai', canGi: 'Chi tuổi + chi năm', tang: 'custom',
    kiem: 'Việc ba chi họp thành một nhóm là hình học vòng 12; việc gán cho nhóm ấy ba năm hạn là quy ước.' },
  { muc: 'Xung năm / năm tuổi', canGi: 'Chi tuổi + chi năm', tang: 'mixed',
    kiem: 'Hai chi có đối nhau hay không thì đo được trên vòng 12. Còn “đối nhau thì kém thuận” là quy ước.' },
  { muc: 'Hoang Ốc', canGi: 'Tuổi mụ (đếm vòng 6 cung)', tang: 'custom',
    kiem: 'Cùng dạng với Kim Lâu: phép đếm rõ ràng, lý do chọn cung phạm thì không.' },
  { muc: 'Sao hạn (Cửu Diệu)', canGi: 'Tuổi mụ + giới tính', tang: 'custom',
    kiem: 'Bảy trong chín tên là tên cổ của Mặt Trời, Mặt Trăng và năm hành tinh nhìn được bằng mắt thường, nhưng việc năm nay ai gặp sao nào là một bảng luân phiên theo tuổi mụ — không dùng vị trí thật của chúng.' },
  { muc: 'Cung phi & hướng nhà', canGi: 'Năm sinh + giới tính', tang: 'custom',
    kiem: 'Quy ước Bát Trạch. Đổi giới tính là đổi hẳn cung phi, dù năm sinh không đổi.' },
  { muc: 'Tam hợp / lục xung của con giáp', canGi: 'Chi tuổi', tang: 'mixed',
    kiem: 'Các cặp và bộ ba là hình học của vòng 12 chi; phần “hợp” hay “xung” nghĩa là gì thì là quy ước.' },
  { muc: 'Màu & nghề hợp mệnh', canGi: 'Mệnh ngũ hành', tang: 'custom',
    kiem: `Suy từ quan hệ tương sinh – tương khắc. Thẻ này chỉ hiện với năm sinh trong khoảng ${BAN_MENH_RANGE.min}–${BAN_MENH_RANGE.max}.` },
  { muc: 'Giờ sinh, lá số cá nhân, tính cách cụ thể', canGi: 'Công cụ không có dữ kiện này', tang: 'none',
    kiem: 'Không có ô nhập ngày, tháng hay giờ — nên những mục này không xuất hiện, và cũng không nên suy ra từ năm sinh.' },
];

const CALENDAR_COUNT = LAYER_ROWS.filter((r) => r.tang === 'calendar').length;
const CUSTOM_COUNT = LAYER_ROWS.filter((r) => r.tang === 'custom').length;
const MIXED_COUNT = LAYER_ROWS.filter((r) => r.tang === 'mixed').length;

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn accordion hiển thị → chữ schema ===
// chữ trên trang. Câu hỏi cố ý KHÁC bộ FAQ của chính trang /tra-cuu-tuoi (ở đó
// hỏi "công cụ này là gì", "có lưu dữ liệu không") và KHÁC các bài hạn riêng lẻ.
const FAQS = [
  { q: 'Một năm sinh thật sự suy ra được những gì?',
    a: `Suy chắc chắn được bốn thứ: can chi, con giáp, nạp âm và mệnh ngũ hành. Cả bốn đều là phép tra bảng trên vòng ${CYCLE} năm — sinh năm ${BIRTH} thì ra ${BIRTH_CANCHI}, con ${BIRTH_ZODIAC}, nạp âm ${BIRTH_NAPAM}, mệnh ${BIRTH_MENH}, và ai tính cũng ra đúng như vậy. Nhưng cần thấy rõ chúng đúng theo nghĩa nào: đây là cách gọi tên của năm, không phải một nhận định về người sinh ra trong năm đó.` },
  { q: 'Vậy Kim Lâu, Tam Tai, Hoang Ốc, sao hạn thì sao — chúng có sai không?',
    a: 'Không phải chuyện đúng hay sai, mà là chúng thuộc loại khác. Các lớp này đều có công thức rõ ràng và công cụ hiển thị nguyên phép tính, nên bạn kiểm được nó có tính đúng theo quy ước hay không. Cái không kiểm được là bản thân quy ước: vì sao tuổi mụ chia 9 dư một số nhất định lại bị coi là phạm thì các bản truyền lại không ghi lý do gốc, và phạm vi áp dụng cũng có biến thể vùng miền — chẳng hạn Kim Lâu theo tục xét tuổi cô dâu, nhưng có nơi xét cả tuổi chú rể. Nên cách đọc đúng là xem chúng như tục lệ để tham khảo.' },
  { q: 'Cùng một năm sinh mà kết quả vẫn khác nhau được à?',
    a: `Được, ở hai chỗ. Thứ nhất là giới tính: cùng sinh năm ${BIRTH}, nam ra cung phi ${GENDER_ROWS[0]?.cungPhi ?? '—'} còn nữ ra ${GENDER_ROWS[1]?.cungPhi ?? '—'}, kéo theo hướng nhà và sao hạn khác nhau — trong khi can chi và nạp âm thì giống hệt. Thứ hai là năm đang xét: các lớp hạn là quan hệ giữa năm sinh và năm hiện tại, nên chúng đổi mỗi năm. Điều đó cho thấy chúng không phải đặc điểm cố định của một người.` },
  { q: 'Công cụ Tra cứu tuổi cần những gì, và nó KHÔNG làm được gì?',
    a: 'Nó cần đúng hai dữ kiện: năm sinh dương lịch và giới tính. Vì không có ô ngày, ô tháng hay ô giờ nên nó không lập được lá số cá nhân và không chọn được ngày tốt. Nó cũng không có ô chọn năm muốn xem — phần các hạn luôn tính theo năm hiện tại — và không xét riêng cho một việc cụ thể như cưới hỏi hay làm nhà, mà chỉ nói chung theo năm.' },
  { q: 'Nhập thêm ngày giờ sinh vào các công cụ khác thì kết quả có đúng hơn không?',
    a: 'Chi tiết hơn thì có, đúng hơn thì không tự động. Thêm dữ kiện chỉ chia bạn vào một nhóm nhỏ hơn; nó không tạo ra bằng chứng cho các quy ước đang được áp lên nhóm đó. Một lá số đầy đủ vẫn là một hệ quy ước, chỉ là hệ quy ước tinh vi hơn. Điều thật sự đổi khi có thêm giờ sinh là bạn không còn dùng chung kết quả với hàng triệu người nữa — và chỉ vậy thôi.' },
  { q: 'Đọc mô tả con giáp thấy đúng với mình quá thì sao?',
    a: `Đó là dấu hiệu đáng chú ý, nhưng theo hướng ngược lại. Một năm sinh đặt bạn vào 1 trong ${CYCLE} nhóm, tính cả giới tính là ${CYCLE * 2} nhóm — mọi mô tả ở đó buộc phải viết đủ rộng để phần lớn nhóm thấy hợp. Khi một mô tả rộng như vậy mà bạn thấy trúng, phần lớn công đến từ cách bạn tự đối chiếu, không phải từ năm sinh. Phép thử rất nhanh: đọc mô tả của một con giáp khác và xem có thấy trúng không.` },
  { q: 'Năm nay tôi bị báo phạm mấy lớp cùng lúc, có phải năm hạn nặng không?',
    a: `Không nên đọc theo kiểu cộng dồn, và lý do mạnh hơn bạn tưởng: các lớp này không độc lập với nhau. Kim Lâu và sao hạn Cửu Diệu dùng đúng cùng một phép trên đúng cùng một con số — tuổi mụ chia 9 — nên mỗi số dư luôn kéo theo đúng một cặp “loại Kim Lâu – tên sao”, không năm nào lệch. Hoang Ốc cũng đếm trên chính tuổi mụ ấy, chỉ đổi vòng 6 thay vì 9; Tam Tai và xung năm thì cùng đọc chi năm sinh. Thấy nhiều nhãn cùng sáng lên không có nghĩa nhiều nguồn cùng xác nhận một điều — đó là một hai con số được viết lại theo mấy cách. Và các nhãn vốn dày: chạy đúng phép tính của công cụ cho ${EXAM_YEARS.length} năm liên tiếp, quét mọi năm sinh mà ô nhập chấp nhận, số năm hoàn toàn trống chỉ dao động từ ${CLEAN_SPREAD.min} đến ${CLEAN_SPREAD.max}.` },
  { q: 'Vậy dùng trang tra cứu thế nào cho có ích?',
    a: 'Dùng nó như một cuốn từ điển về tuổi của mình: biết can chi, biết nạp âm, hiểu các thuật ngữ mà họ hàng hay nhắc, và hiểu vì sao một tục lệ lại tính ra như vậy. Đó là phần giá trị thật và cũng là lý do công cụ hiện rõ từng phép tính thay vì chỉ phán. Phần còn lại thì giữ ở mức tham khảo: đừng dời lịch khám bệnh, đừng đổi quyết định tiền bạc, và đừng trả tiền cho ai để “hoá giải” một con số chia dư.' },
];

const JSONLD = [
  article({
    headline: 'Một năm sinh suy ra được gì — và không suy ra được gì',
    description:
      'Phân loại kết quả tra cứu theo năm sinh thành ba tầng độ chắc: lịch – toán (can chi, con giáp, nạp âm), phong tục (Kim Lâu, Tam Tai, sao hạn) và phần một năm sinh không chứa.',
    url: '/learn/doc-mot-tuoi',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Đọc một tuổi', url: '/learn/doc-mot-tuoi' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Đọc một tuổi: một năm sinh nói được gì và không nói được gì',
    description:
      'Học cách đọc trang tra cứu theo năm sinh: tách phần lịch – toán chắc chắn khỏi phần phong tục quy ước, và nhận ra phần mà một năm sinh không thể chứa.',
    url: '/learn/doc-mot-tuoi',
  }),
];

const TD = 'px-4 py-2 text-muted-foreground';
const A = 'text-gold-700 underline-offset-4 hover:underline';

function TableHead({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr className="border-b border-border bg-card/60">
        {cols.map((c) => (
          <th key={c} scope="col" className="px-4 py-2.5 font-semibold text-foreground">{c}</th>
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

export default function LearnDocMotTuoiPage() {
  return (
    <LearnArticle
      eyebrow="ĐỌC KẾT QUẢ · ĐỘ CHẮC"
      title={
        <>
          Một năm sinh{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">nói được tới đâu</span>
        </>
      }
      standfirst={
        <>
          Nhập một năm sinh, màn hình trả về cả một trang: can chi, nạp âm, mệnh, Kim Lâu, Tam Tai,
          sao hạn, hướng nhà, màu hợp. Tất cả cùng một khuôn, nên trông chắc như nhau. Bài này tách
          chúng ra làm ba tầng theo độ chắc — và nói thẳng phần mà một năm sinh không thể chứa.
        </>
      }
      readMeta="12 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Đọc một tuổi' },
      ]}
      relatedLenses={relatedLearnLenses('doc-mot-tuoi')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Công cụ Tra cứu tuổi nhận năm sinh và giới tính, rồi hiện nguyên phép tính của từng lớp — tuổi mụ bao nhiêu, chia mấy, dư mấy — để bạn tự xếp chúng vào đúng tầng.',
        href: '/tra-cuu-tuoi',
        label: 'Mở công cụ Tra cứu tuổi',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <DocMotTuoiFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Một năm sinh là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Một năm sinh, với các công cụ trên hieu.asia, là{' '}
                <strong>một ô trong bảng lịch can chi</strong>. Bảng ấy có {CYCLE} ô và lặp lại mãi,
                nên nói “sinh năm {BIRTH}” tương đương nói “thuộc ô {BIRTH_CANCHI}”. Từ ô đó tra
                được ngay con {BIRTH_ZODIAC}, nạp âm {BIRTH_NAPAM}, mệnh {BIRTH_MENH} — và chỉ vậy
                là hết phần chắc chắn.
              </p>
              <p>
                Công cụ <Link href="/tra-cuu-tuoi" className={A}>Tra cứu tuổi</Link> nhận đúng{' '}
                <strong>hai dữ kiện</strong>: năm sinh dương lịch và giới tính. Từ hai dữ
                kiện đó nó dựng ra một trang dài, nhưng độ dài của trang không phản ánh lượng thông
                tin bạn đưa vào. Đây là điều cần chốt trước khi đọc bất cứ dòng nào.
              </p>
              <p>Bốn điều một năm sinh KHÔNG phải:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Không phải mô tả về bạn.</strong> Nó đặt bạn vào 1 trong {CYCLE} nhóm —
                  tính cả giới tính là {CYCLE * 2} nhóm. Mọi câu rút ra từ đó là mô tả nhóm, dùng
                  chung cho hàng triệu người có cùng năm sinh.
                </li>
                <li>
                  <strong>Không đủ để lập lá số.</strong> Lá số cần ngày và giờ sinh; công cụ này
                  không có ô nào để nhập chúng, nên nó không lập lá số và cũng không nên được đọc
                  như lá số.
                </li>
                <li>
                  <strong>Không phải một dự báo.</strong> Các lớp hạn không nói việc gì sẽ xảy ra —
                  phép tính đứng sau chúng không biết bạn làm nghề gì, đang chuẩn bị việc gì, sức
                  khoẻ ra sao.
                </li>
                <li>
                  <strong>Không phải một khối đồng nhất.</strong> Trang kết quả trộn ít nhất ba loại
                  thông tin rất khác nhau về độ chắc. Phần lớn hiểu lầm bắt đầu từ chỗ này, và đó là
                  nội dung chính của bài.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Bài này không dạy lại cơ chế từng lớp — mỗi lớp đã có bài riêng:{' '}
                <Link href="/learn/kim-lau" className={A}>Kim Lâu</Link>,{' '}
                <Link href="/learn/tam-tai" className={A}>Tam Tai</Link>,{' '}
                <Link href="/learn/sao-han" className={A}>Sao hạn</Link>,{' '}
                <Link href="/learn/nap-am" className={A}>Nạp âm</Link> và{' '}
                <Link href="/learn/can-chi" className={A}>Thiên can – Địa chi</Link>. Ở đây chỉ làm
                một việc: xếp chúng vào đúng tầng.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <DocMotTuoiDepth />,
        },
        {
          id: 'ba-tang-do-chac',
          tocLabel: 'Ba tầng độ chắc',
          heading: 'Xếp từng dòng kết quả vào đúng tầng',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Bảng dưới liệt kê {LAYER_ROWS.length} mục: {LAYER_ROWS.length - 1} mục có thật trên
                trang kết quả, cộng một dòng cuối cho phần công cụ không có dữ kiện để tính. Cột
                giữa là chỗ đáng nhìn nhất — <strong>mục đó cần dữ kiện gì</strong> — vì nó quyết
                định luôn giới hạn của mục.
              </p>
              <Scroller minWidth="min-w-[860px]">
                <TableHead cols={['Mục trong kết quả', 'Cần dữ kiện gì', 'Tầng', 'Kiểm được tới đâu']} />
                <tbody>
                  {LAYER_ROWS.map((r) => (
                    <tr key={r.muc} className="border-b border-border/60 last:border-b-0">
                      <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">{r.muc}</th>
                      <td className={TD}>{r.canGi}</td>
                      <td className="px-4 py-2 text-foreground">{TANG_LABEL[r.tang]}</td>
                      <td className={TD}>{r.kiem}</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <p>
                Đếm theo cột Tầng: <strong>{CALENDAR_COUNT} mục</strong> thuần lịch – toán,{' '}
                <strong>{CUSTOM_COUNT} mục</strong> thuần phong tục, <strong>{MIXED_COUNT} mục</strong>{' '}
                nằm giữa, và <strong>1 mục</strong> không suy được từ dữ kiện công cụ có. Hai mục ở
                giữa đáng chú ý riêng: hình học của vòng 12 chi thì đo được — hai chi có đối đỉnh
                nhau hay không là chuyện hình học — nhưng việc gọi thế đối đỉnh ấy là “xung” và coi
                nó kém thuận thì đã là quy ước.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Tầng lịch – toán: cùng một năm sinh, ai tra cũng ra một kết quả
              </h3>
              <p>
                Chỉ cột <strong>năm sinh</strong> là dữ kiện đầu vào; ba cột còn lại do trang này
                suy lại bằng đúng hàm mà công cụ đang gọi. Không có chỗ nào để hai người tra ra hai
                đáp án khác nhau.
              </p>
              <Scroller minWidth="min-w-[620px]">
                <TableHead cols={['Năm sinh', 'Can Chi', 'Con giáp', 'Nạp âm', 'Mệnh ngũ hành']} />
                <tbody>
                  {SAMPLE_ROWS.map((r) => (
                    <tr key={r.year} className="border-b border-border/60 last:border-b-0">
                      <td className="px-4 py-2 tabular-nums font-medium text-foreground">{r.year}</td>
                      <td className={TD}>{r.canChi}</td>
                      <td className={TD}>{r.zodiac}</td>
                      <td className={TD}>{r.napAm}</td>
                      <td className="px-4 py-2 text-foreground">{r.menh}</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <p className="text-sm text-foreground/70">
                Bốn cột này chắc theo nghĩa yếu nhất có thể, và cần nói rõ nghĩa ấy:{' '}
                <strong>chúng đúng theo định nghĩa</strong>. Bảng lịch quy định năm {BIRTH} tên là{' '}
                {BIRTH_CANCHI}, nên câu “sinh năm {BIRTH} thì tuổi {BIRTH_ZODIAC}” không thể sai —
                cũng như “tháng sau tháng 5 là tháng 6” không thể sai. Nó không phát biểu điều gì về
                đời bạn, nên cũng không có gì để kiểm.
              </p>
              <p className="text-sm text-foreground/70">
                Hai biên cần phân biệt: bảng can chi bên dưới phủ từ năm {ENGINE_RANGE.min} đến{' '}
                {ENGINE_RANGE.max}, nhưng ô nhập của công cụ chỉ chấp nhận năm sinh từ{' '}
                {TOOL_YEAR_RANGE.min} đến {TOOL_YEAR_RANGE.max} — gõ ra ngoài khoảng hẹp hơn này là
                nó báo lỗi ngay thay vì đoán. Vì sao vòng lại dài đúng {CYCLE} năm và nạp
                âm chỉ có {NAP_AM_COUNT} tên là nội dung của hai bài{' '}
                <Link href="/learn/can-chi" className={A}>Thiên can – Địa chi</Link> và{' '}
                <Link href="/learn/nap-am" className={A}>Nạp âm</Link>.
              </p>
            </div>
          ),
        },
        {
          id: 'cung-nam-sinh-van-khac',
          tocLabel: 'Cùng năm sinh vẫn khác',
          heading: 'Cùng một năm sinh, kết quả vẫn khác — và đó là chỉ dấu quan trọng',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Nếu mọi thứ trên trang đều suy từ năm sinh, thì hai người cùng năm sinh phải nhận
                kết quả giống hệt. Thực tế không phải vậy, và chỗ khác nhau chỉ ra ngay{' '}
                <strong>mỗi dòng ăn theo một bộ dữ kiện riêng</strong>.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Đổi giới tính: ba dòng đầu đứng yên, hai dòng cuối đổi hẳn
              </h3>
              <Scroller minWidth="min-w-[820px]">
                <TableHead
                  cols={['Giới tính', 'Can Chi', 'Nạp âm', 'Mệnh', 'Cung phi', 'Nhóm',
                    'Ba hướng tốt đầu', `Sao hạn năm ${START_YEAR}`]}
                />
                <tbody>
                  {GENDER_ROWS.map((r) => (
                    <tr key={r.label} className="border-b border-border/60 last:border-b-0">
                      <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">{r.label}</th>
                      <td className={TD}>{r.canChi}</td>
                      <td className={TD}>{r.napAm}</td>
                      <td className={TD}>{r.menh}</td>
                      <td className="px-4 py-2 text-foreground">{r.cungPhi}</td>
                      <td className={TD}>{r.group}</td>
                      <td className={TD}>{r.good}</td>
                      <td className="px-4 py-2 text-foreground">{r.sao}</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <p className="text-sm text-foreground/70">
                Cả hai hàng đều là người sinh năm {BIRTH}. Ba cột đầu giống hệt vì chúng chỉ cần năm
                sinh; cung phi, hướng và sao hạn khác nhau vì chúng cần thêm giới tính. Chi tiết vì
                sao cung phi lại chia Đông – Tây tứ mệnh thuộc bài{' '}
                <Link href="/learn/bat-trach" className={A}>Bát Trạch</Link>; cơ chế luân phiên của
                Cửu Diệu thuộc bài <Link href="/learn/sao-han" className={A}>Sao hạn</Link>.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Đổi năm đang xét: các lớp hạn bật tắt liên tục
              </h3>
              <p>
                Công cụ <strong>không có ô chọn năm</strong> — khối “năm nay với tuổi này” luôn tính
                theo năm hiện tại. Bảng dưới đây không phải một tính năng của công cụ; nó là{' '}
                <strong>cùng những phép tính ấy chạy lại</strong> cho {EXAM_YEARS.length} năm liên
                tiếp với một năm sinh cố định, để thấy các lớp hạn phụ thuộc năm xét tới mức nào.
              </p>
              <Scroller minWidth="min-w-[860px]">
                <TableHead
                  cols={['Năm xét', 'Can Chi năm', 'Tuổi mụ', 'Kim Lâu', 'Tam Tai',
                    'Xung / năm tuổi', 'Hoang Ốc']}
                />
                <tbody>
                  {YEAR_ROWS.map((r) => (
                    <tr key={r.year} className="border-b border-border/60 last:border-b-0">
                      <td className="px-4 py-2 tabular-nums font-medium text-foreground">{r.year}</td>
                      <td className={TD}>{r.yearCanChi}</td>
                      <td className="px-4 py-2 tabular-nums text-muted-foreground">{r.ageMu}</td>
                      <td className={TD}>{r.kimLau}</td>
                      <td className={TD}>{r.tamTai}</td>
                      <td className={TD}>{r.xung}</td>
                      <td className={TD}>{r.hoangOc}</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <p>
                Đọc theo cột thì thấy ngay: trong {EXAM_YEARS.length} năm ấy, người sinh {BIRTH} phạm
                Kim Lâu <strong>{KIM_LAU_COUNT} năm</strong>, nằm trong Tam Tai{' '}
                <strong>{TAM_TAI_COUNT} năm</strong> (nhóm chi {TAM_TAI_CHIS}), phạm Hoang Ốc{' '}
                <strong>{HOANG_OC_COUNT} năm</strong>; còn số năm mà cả bốn cột đều ghi “Không” là{' '}
                <strong>{CLEAN_COUNT}</strong>. Chạy đúng bốn phép ấy cho mọi năm sinh mà ô nhập
                chấp nhận, con số “trống hẳn” dao động từ <strong>{CLEAN_SPREAD.min}</strong> đến{' '}
                <strong>{CLEAN_SPREAD.max}</strong> năm trong mỗi {EXAM_YEARS.length} năm — tức{' '}
                {EXAM_YEARS.length - CLEAN_SPREAD.max}–{EXAM_YEARS.length - CLEAN_SPREAD.min} năm
                dính ít nhất một nhãn. Nếu coi mỗi nhãn là một lý do hoãn việc thì{' '}
                <strong>phần lớn các năm đều có sẵn một lý do</strong>.
              </p>
              <p className="text-sm text-foreground/70">
                Nhưng đừng cộng dồn các nhãn lại thành “năm hạn nặng”, và lý do không phải vì chúng
                trùng nhau ngẫu nhiên — ngược lại, chúng <strong>dính chặt vào nhau</strong>. Kim
                Lâu và sao hạn Cửu Diệu dùng đúng cùng một phép trên đúng cùng một con số: tuổi mụ
                chia 9. Nên với mỗi số dư, cặp “loại Kim Lâu – tên sao” luôn đi kèm nhau, không năm
                nào lệch. Hoang Ốc cũng đếm trên chính tuổi mụ ấy, chỉ đổi vòng 6 thay vì 9; Tam Tai
                và xung năm thì cùng đọc một thứ là chi năm sinh. Bốn, năm nhãn cùng sáng lên không
                phải là bốn, năm nguồn độc lập cùng xác nhận một điều — đó là một hai con số được
                viết lại theo mấy cách khác nhau.
              </p>
            </div>
          ),
        },
        {
          id: 'mot-trong-sau-muoi',
          tocLabel: 'Mô tả nhóm',
          heading: `Một năm sinh chia dân số thành ${CYCLE} nhóm — nên mọi kết luận là mô tả nhóm`,
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là giới hạn cứng, không cách nào lách. Vòng can chi có {CYCLE} ô, nên một năm
                sinh chọn <strong>1 trong {CYCLE}</strong>. Thêm giới tính — dữ kiện thứ hai và cũng
                là dữ kiện cuối cùng mà công cụ nhận — thì thành{' '}
                <strong>1 trong {CYCLE * 2}</strong>. Toàn bộ trang kết quả, dù dài đến đâu, cũng
                chỉ là một hàng trong bảng {CYCLE * 2} hàng đã tính sẵn.
              </p>
              <p>Ba hệ quả đi thẳng từ con số đó:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Mọi mô tả tính cách ở đó buộc phải viết rộng.</strong> Một câu phải hợp
                  với hàng triệu người thì chỉ có thể nói những điều gần như ai cũng thấy đúng về
                  mình. Cảm giác “trúng quá” khi đọc phần lớn đến từ cách bạn tự đối chiếu — bài{' '}
                  <Link href="/learn/barnum" className={A}>Hiệu ứng Barnum</Link> nói riêng cơ chế
                  này.
                </li>
                <li>
                  <strong>Không thể có lời khuyên riêng cho bạn.</strong> Gợi ý nghề, gợi ý màu,
                  gợi ý hướng đều suy từ mệnh của năm sinh, tức từ một dữ kiện dùng chung cho cả
                  nhóm. Công cụ ghi rõ đây là mục để tham khảo, và nên đọc đúng như vậy.
                </li>
                <li>
                  <strong>Thêm dữ kiện làm chi tiết hơn, không làm đúng hơn.</strong> Nhập cả ngày
                  và giờ sinh vào <Link href="/la-so-bat-tu" className={A}>lá số Bát Tự</Link> thì
                  nhóm nhỏ đi rất nhiều, nhưng các quy ước được áp lên nhóm ấy vẫn là quy ước —
                  không có bằng chứng nào mới xuất hiện chỉ vì bảng chi tiết hơn.
                </li>
              </ul>
              <p>
                Có một phép thử rất nhanh mà bạn tự làm được trong hai phút: đọc phần mô tả của con
                giáp mình, rồi đọc phần mô tả của một con giáp khác. Nếu cả hai đều thấy hợp thì vấn
                đề không nằm ở con giáp nào đúng, mà ở chỗ{' '}
                <strong>mô tả nhóm được viết để hầu như ai cũng thấy hợp</strong>. Bài{' '}
                <Link href="/learn/kiem-chung" className={A}>Cách kiểm chứng một lời phán</Link> đưa
                thêm vài phép thử cùng kiểu.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: công cụ làm gì, và cố ý không làm gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Phần này nói thẳng để bạn không kỳ vọng nhầm. Việc mà công cụ{' '}
                <Link href="/tra-cuu-tuoi" className={A}>Tra cứu tuổi</Link> thật sự làm rất gọn:
                gom các lát cắt phong tục quanh một năm sinh về một chỗ, và{' '}
                <strong>hiện nguyên phép tính</strong> — tuổi mụ bao nhiêu, chia mấy, dư mấy, rơi
                cung nào — thay vì chỉ đưa ra kết luận. Đó là điểm mạnh thật, vì nó cho bạn kiểm
                được từng bước.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Không nhận ngày, tháng, giờ sinh.</strong> Chỉ có ô năm và ô giới tính.
                  Nên nó không lập lá số, không chọn ngày tốt, và không nói được gì ở mức cá nhân.
                </li>
                <li>
                  <strong>Không chọn được năm muốn xét.</strong> Các lớp hạn luôn tính cho năm hiện
                  tại. Muốn xét một năm khác cho một việc cụ thể thì phải sang trang chuyên sâu của
                  việc đó.
                </li>
                <li>
                  <strong>Không xét riêng cho một việc.</strong> Kết quả nói chung theo năm, không
                  phân biệt cưới hỏi, làm nhà hay mở hàng — dù mỗi tục lệ vốn được dùng cho một việc
                  khác nhau.
                </li>
                <li>
                  <strong>Không phải mọi lớp đều có dữ liệu cho mọi năm sinh.</strong> Ô nhập chỉ
                  nhận năm sinh {TOOL_YEAR_RANGE.min}–{TOOL_YEAR_RANGE.max} (ngoài khoảng là báo lỗi
                  chứ không đoán), dù bảng can chi bên dưới phủ rộng hơn — {ENGINE_RANGE.min} đến{' '}
                  {ENGINE_RANGE.max}. Trong khoảng nhập được thì thẻ màu và nghề hợp mệnh vẫn chỉ
                  hiện với năm sinh {BAN_MENH_RANGE.min}–{BAN_MENH_RANGE.max}; ngoài ra thẻ đó vắng
                  hẳn, không có dòng nào báo là vì sao.
                </li>
                <li>
                  <strong>Không tính một số lớp mà sách vở có nhắc.</strong> Phần con giáp chỉ hiện
                  tam hợp và lục xung. Lục hại và Tương Hình không được đưa vào phép tính nào, và
                  trang cũng không nhắc tới chúng ở bất kỳ đâu — nên đừng đọc sự vắng mặt ấy thành
                  “không phạm”: đơn giản là công cụ không xét.
                </li>
              </ul>
              <p>
                Về phía người đọc, ranh giới cũng cần rõ. Đây là <strong>tri thức phong tục</strong>{' '}
                được tính minh bạch để tham khảo. Nó không thay được lời khuyên y tế, pháp lý hay
                tài chính: không dời lịch khám bệnh, không đổi quyết định tiền bạc vì một số dư. Và
                nếu ai đó dùng một dòng “phạm” để bán cho bạn dịch vụ hoá giải, hãy nhớ rằng thứ
                được gọi là phạm ở đây là kết quả của một phép chia — không có phép đo nào đứng sau
                nó, nên cũng không có gì để hoá giải.
              </p>
              <p className="text-sm text-foreground/70">
                Điều đó không có nghĩa là bỏ hết tục lệ. Nếu việc chọn một năm cho vừa lòng ông bà
                khiến cả nhà yên tâm và vui vẻ, đó là giá trị văn hoá và hoàn toàn đáng giữ. Chỉ nên
                cẩn thận khi cái giá phải trả là thật — một năm chờ đợi, một khoản tiền, hay một cơ
                hội đã đi qua.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <DocMotTuoiWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <DocMotTuoiRecall />,
        },
        {
          id: 'faq',
          tocLabel: 'Câu hỏi thường gặp',
          heading: 'Câu hỏi thường gặp',
          children: (
            <>
              <Accordion type="single" collapsible className="space-y-2">
                {FAQS.map((f, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="rounded border border-border px-4">
                    <AccordionTrigger>{f.q}</AccordionTrigger>
                    <AccordionContent>{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                Bài này chỉ xếp tầng chứ không dạy cơ chế. Muốn hiểu vì sao vòng can chi dài {CYCLE}{' '}
                năm, đọc <Link href="/learn/can-chi" className={A}>Thiên can – Địa chi</Link>; muốn
                hiểu cách một năm sinh ra “mệnh”, đọc{' '}
                <Link href="/learn/nap-am" className={A}>Nạp âm</Link>; còn cơ chế từng hạn nằm ở{' '}
                <Link href="/learn/kim-lau" className={A}>Kim Lâu</Link>,{' '}
                <Link href="/learn/tam-tai" className={A}>Tam Tai</Link>,{' '}
                <Link href="/learn/hoang-oc" className={A}>Hoang Ốc</Link> và{' '}
                <Link href="/learn/sao-han" className={A}>Sao hạn</Link>. Riêng chữ “xung Thái Tuế”
                hay gặp trong kết quả được nói kỹ ở bài{' '}
                <Link href="/learn/thai-tue" className={A}>Thái Tuế</Link>.
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/kim-lau', label: 'Tra Kim Lâu theo tuổi' },
                    { href: '/tam-tai', label: 'Tra Tam Tai theo con giáp' },
                    { href: '/sao-han', label: 'Tra sao hạn Cửu Diệu' },
                    { href: '/huong-nha', label: 'Xem hướng nhà theo cung phi' },
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
          children: <DocMotTuoiChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
