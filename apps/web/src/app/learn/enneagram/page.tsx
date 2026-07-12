import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@hieu-asia/ui';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { relatedLearnLenses } from '@/lib/learn/related';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, course, faqPage, itemList } from '@/lib/seo/jsonld';
import { listTypes } from '@/lib/enneagram-type-data';
import {
  EnneagramFrame,
  EnneagramDepth,
  EnneagramRecall,
  EnneagramChecklist,
  EnneagramWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Enneagram — 9 nhóm tính cách & 3 trung tâm',
  description:
    'Enneagram: 9 nhóm tính cách theo động lực sâu (điều bạn sợ & khao khát), chia 3 trung tâm: Bản năng, Tình cảm, Lý trí. Bản đồ hiểu mình, không nhãn.',
  alternates: { canonical: 'https://hieu.asia/learn/enneagram' },
};

// 9 nhóm Enneagram — mô tả theo ĐỘNG LỰC bên trong (sợ gì / muốn gì), không
// phải hành vi bề mặt. Không nhóm nào "tốt/xấu" hơn.
const TYPES: { n: number; vi: string; en: string; core: string }[] = [
  {
    n: 1,
    vi: 'Người cải cách',
    en: 'Reformer',
    core:
      'Khao khát sống đúng đắn, tử tế và có ích; sợ nhất là mình sai hay khiếm khuyết về mặt đạo đức. Vì thế nhóm 1 kỷ luật, có nguyên tắc, luôn để ý chỗ chưa chuẩn để sửa. Bẫy đặc trưng: một giọng phê phán bên trong hiếm khi tắt, dễ khắt khe với mình và soi lỗi người khác khi mệt.',
  },
  {
    n: 2,
    vi: 'Người tương trợ',
    en: 'Helper',
    core:
      'Khao khát được yêu thương và cảm thấy mình cần thiết; sợ trở thành người thừa, không ai cần đến. Nhóm 2 ấm áp, tinh tế, thường nhận ra nhu cầu người khác trước cả nhu cầu của mình. Bẫy đặc trưng: cho đi để được giữ lại, khó nói "không", rồi tủi thân khi không được đáp lại.',
  },
  {
    n: 3,
    vi: 'Người tham vọng',
    en: 'Achiever',
    core:
      'Khao khát thấy mình có giá trị qua thành tựu và được công nhận; sợ thất bại, sợ tầm thường trong mắt người khác. Nhóm 3 năng động, hiệu quả, thích nghi nhanh để đạt mục tiêu. Bẫy đặc trưng: gắn chặt giá trị bản thân vào thành tích, dễ chạy theo hình ảnh và gạt cảm xúc thật sang bên.',
  },
  {
    n: 4,
    vi: 'Người cá tính',
    en: 'Individualist',
    core:
      'Khao khát một bản sắc riêng và sống thật với chiều sâu cảm xúc; sợ mình tầm thường, không có dấu ấn. Nhóm 4 nhạy cảm, sáng tạo, bị hút bởi cái đẹp và những điều mang tính cá nhân. Bẫy đặc trưng: mãi thấy thiếu một mảnh mà người khác dường như đang có, hay so sánh rồi chìm vào tâm trạng.',
  },
  {
    n: 5,
    vi: 'Người quan sát',
    en: 'Investigator',
    core:
      'Khao khát hiểu thấu thế giới và đủ năng lực để tự chủ; sợ bị vắt cạn, bất lực trước đòi hỏi bên ngoài. Nhóm 5 độc lập, điềm tĩnh, quan sát kỹ trước khi nhập cuộc. Bẫy đặc trưng: rút về giữ khoảng cách, tích trữ thời gian và năng lượng, xa cách về cảm xúc.',
  },
  {
    n: 6,
    vi: 'Người trung thành',
    en: 'Loyalist',
    core:
      'Khao khát an toàn và một chỗ dựa đáng tin; sợ mất điểm tựa, không còn gì để bấu víu. Nhóm 6 trung thành, trách nhiệm, luôn lường trước rủi ro để chuẩn bị. Bẫy đặc trưng: lo những chuyện chưa xảy ra, hoài nghi, do dự và hay đi hỏi xin trấn an.',
  },
  {
    n: 7,
    vi: 'Người nhiệt huyết',
    en: 'Enthusiast',
    core:
      'Khao khát một cuộc đời phong phú, tự do; sợ bị mắc kẹt, thiếu thốn hay chìm trong đau khổ, buồn chán. Nhóm 7 lạc quan, nhiều năng lượng, luôn hào hứng với ý tưởng mới. Bẫy đặc trưng: bỏ dở, nhảy sang việc mới khi vừa thấy chán, và né ngồi lại với cảm xúc khó chịu.',
  },
  {
    n: 8,
    vi: 'Người thủ lĩnh',
    en: 'Challenger',
    core:
      'Khao khát tự làm chủ đời mình và che chở điều mình trân trọng; sợ bị kiểm soát, bị tổn thương hay phải phụ thuộc. Nhóm 8 thẳng thắn, quả quyết, sẵn sàng đứng ra bảo vệ người yếu thế. Bẫy đặc trưng: che phần mềm yếu bằng lớp vỏ cứng, dễ áp đặt và muốn nắm mọi thứ khi căng thẳng.',
  },
  {
    n: 9,
    vi: 'Người ôn hoà',
    en: 'Peacemaker',
    core:
      'Khao khát bình yên bên trong và hoà thuận với mọi người; sợ xung đột, chia rẽ làm xáo trộn sự yên ổn. Nhóm 9 điềm đạm, bao dung, biết lắng nghe nhiều phía. Bẫy đặc trưng: gạt mong muốn của mình xuống, trì hoãn, xuôi theo người khác để né va chạm, rồi mờ nhạt ngay trong đời mình.',
  },
];

const CENTERS: { name: string; types: string; theme: string }[] = [
  {
    name: 'Trung tâm Bản năng (Bụng)',
    types: 'Nhóm 8 · 9 · 1',
    theme:
      'Xoay quanh quyền kiểm soát và ranh giới của bản thân, phản ứng nhanh theo trực giác "đúng/sai". Theo cách trình bày phổ biến, cảm xúc lõi của cụm này là cơn giận: nhóm 8 hướng nó ra ngoài, nhóm 1 nén lại và kỷ luật hoá, nhóm 9 lảng khỏi nó để giữ yên.',
  },
  {
    name: 'Trung tâm Tình cảm (Tim)',
    types: 'Nhóm 2 · 3 · 4',
    theme:
      'Xoay quanh hình ảnh bản thân và giá trị của mình, bận tâm mình được nhìn nhận thế nào. Theo cách trình bày phổ biến, cảm xúc lõi của cụm này là nỗi xấu hổ về việc mình có đủ đáng giá không: nhóm 2 tìm giá trị qua việc được cần đến, nhóm 3 qua thành tích, nhóm 4 qua bản sắc riêng.',
  },
  {
    name: 'Trung tâm Lý trí (Đầu)',
    types: 'Nhóm 5 · 6 · 7',
    theme:
      'Xoay quanh sự an toàn và những điều chưa chắc chắn, xử lý bằng suy nghĩ, phân tích, lên kế hoạch. Theo cách trình bày phổ biến, cảm xúc lõi của cụm này là nỗi sợ: nhóm 5 đối phó bằng cách hiểu và tích trữ năng lực, nhóm 6 bằng chuẩn bị và chỗ dựa, nhóm 7 bằng cách chạy tới trải nghiệm tích cực.',
  },
];

// Nguồn gốc — kể cho đúng (đính chính ngộ nhận "cổ thư ngàn năm"). Chỉ dùng dữ
// kiện lịch sử đã thành chuẩn mực công khai, mức định tính, có hedge niên đại.
const ORIGIN_MILESTONES: { era: string; text: string }[] = [
  {
    era: 'Đầu thế kỷ 20',
    text: 'George Gurdjieff đưa biểu tượng cửu giác (chín đỉnh trong một vòng tròn) vào giảng dạy ở phương Tây. Nhưng ông dùng nó như một biểu đồ về tiến trình, không gắn với chín kiểu tính cách.',
  },
  {
    era: 'Khoảng thập niên 1960–1970',
    text: 'Óscar Ichazo sắp xếp chín khuôn tâm lý quanh vòng tròn; Claudio Naranjo mang mô hình này vào giới tâm lý và mở rộng phần mô tả từng kiểu. Đây là lúc "chín kiểu tính cách" như ta biết bắt đầu thành hình.',
  },
  {
    era: 'Cuối thế kỷ 20',
    text: 'Don Riso và Russ Hudson phổ biến rộng rãi phiên bản có thêm cánh, mũi tên và ý tưởng "mức phát triển" — cũng chính là khung mà trang này dùng.',
  },
];

// Ba bản năng (instinctual subtypes) — mức khái niệm. Trắc nghiệm của site KHÔNG
// đo bản năng; note bên dưới nói thẳng điều đó (claim-delivery).
const INSTINCTS: { code: string; name: string; text: string }[] = [
  {
    code: 'sp',
    name: 'Tự tồn (self-preservation)',
    text: 'Dồn chú ý vào an toàn thân thể, sức khoẻ, tiền bạc và sự ấm êm của tổ ấm. Người nghiêng bản năng này lo cho nền tảng vật chất trước, giữ thói quen và nguồn dự trữ.',
  },
  {
    code: 'so',
    name: 'Xã hội (social)',
    text: 'Dồn chú ý vào vị trí trong nhóm, sự thuộc về, vai trò và danh tiếng giữa cộng đồng. Người nghiêng bản năng này đọc "bầu không khí" tập thể và để tâm mình đứng ở đâu giữa mọi người.',
  },
  {
    code: 'sx',
    name: 'Thân mật (một-đối-một)',
    text: 'Dồn chú ý vào sức hút và sự gắn kết mãnh liệt một-đối-một, vào cường độ trong quan hệ. Người nghiêng bản năng này tìm kết nối sâu, dễ bị cuốn vào điều hay người khiến họ thấy "sống động".',
  },
];

// Ba vùng của "chín mức phát triển" (Riso–Hudson) — chỉ khái niệm ba vùng, KHÔNG
// liệt kê đủ 9 mức để tránh phóng đại độ chính xác.
const LEVEL_BANDS: { name: string; text: string }[] = [
  {
    name: 'Vùng lành mạnh',
    text: 'Động lực cốt lõi được dùng theo hướng cởi mở, tự do; điểm mạnh của nhóm toả sáng và cơ chế phòng vệ nhẹ đi.',
  },
  {
    name: 'Vùng trung bình',
    text: 'Nơi phần lớn chúng ta sống hằng ngày. Cơ chế phòng vệ của nhóm bắt đầu lộ rõ, nhưng người ta vẫn xoay xở và vận hành được.',
  },
  {
    name: 'Vùng kém lành mạnh',
    text: 'Nỗi sợ cốt lõi lấn át, hành vi trở nên cứng nhắc, tự hại hoặc làm khổ người xung quanh.',
  },
];

// Sổ tay thuật ngữ (≥10 mục).
const GLOSSARY: { term: string; def: string }[] = [
  { term: 'Nhóm chính (core type)', def: 'Kiểu nền của bạn, xác định bởi động cơ sâu nhất; khá ổn định theo thời gian.' },
  { term: 'Động lực cốt lõi', def: 'Cặp "khao khát + nỗi sợ" chạy phía sau hành vi — thứ Enneagram phân loại, không phải hành vi bề mặt.' },
  { term: 'Khao khát cốt lõi (basic desire)', def: 'Điều mỗi nhóm luôn hướng tới; ví dụ nhóm 1: được sống đúng đắn.' },
  { term: 'Nỗi sợ cốt lõi (basic fear)', def: 'Điều mỗi nhóm luôn né tránh; ví dụ nhóm 1: sợ mình sai hay khiếm khuyết.' },
  { term: 'Trung tâm / triad (center)', def: 'Ba cụm theo nguồn phản ứng: Bản năng (bụng), Tình cảm (tim), Lý trí (đầu).' },
  { term: 'Cánh (wing)', def: 'Ảnh hưởng từ một trong hai nhóm liền kề, pha thêm sắc thái; viết dạng "9w1", "9w8".' },
  { term: 'Mũi tên (arrow / line)', def: 'Đường nối tới hai nhóm khác, mô tả hướng dịch chuyển khi lành mạnh và khi căng thẳng.' },
  { term: 'Hướng phát triển (integration)', def: 'Khi an toàn, trưởng thành thì hấp thụ nét tốt của một nhóm khác.' },
  { term: 'Hướng áp lực (disintegration)', def: 'Khi căng thẳng thì ngả sang mặt kém của một nhóm khác.' },
  { term: 'Bản năng (instinct)', def: 'Ba dạng chú ý sinh tồn: tự tồn (sp), xã hội (so), thân mật (sx).' },
  { term: 'Biến thể / subtype', def: 'Ghép nhóm với bản năng trội; hai mươi bảy tổ hợp, thuộc lớp nâng cao.' },
  { term: 'Mức phát triển (level)', def: 'Vị trí trên dải lành mạnh – trung bình – kém trong cùng một nhóm.' },
];

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (Accordion) → chữ
// schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS: { value: string; q: string; a: string }[] = [
  {
    value: 'wing',
    q: '"Cánh" (wing) là gì?',
    a: 'Mỗi nhóm chịu ảnh hưởng từ một trong hai nhóm liền kề trên vòng tròn — gọi là cánh. Ví dụ nhóm 9 có thể nghiêng cánh 1 (kỷ luật hơn) hoặc cánh 8 (quyết liệt hơn). Cánh giải thích vì sao hai người cùng nhóm vẫn có sắc thái riêng.',
  },
  {
    value: 'arrows',
    q: 'Khi căng thẳng / khi phát triển thì sao?',
    a: 'Enneagram có các "mũi tên" nối các nhóm: lúc căng thẳng bạn có xu hướng mượn nét (thường là mặt kém) của một nhóm khác; lúc thoải mái, trưởng thành bạn hấp thụ nét tốt của một nhóm khác. Đây là điểm khiến Enneagram thiên về phát triển hơn là dán nhãn.',
  },
  {
    value: 'vs-mbti',
    q: 'Khác MBTI ở chỗ nào?',
    a: 'MBTI mô tả cách bạn tư duy và tiếp nhận thông tin; Enneagram đào vào động lực và nỗi sợ cốt lõi đứng sau hành vi. Nhiều người thấy Enneagram chạm sâu hơn về "vì sao tôi như vậy", còn MBTI tiện để mô tả phong cách làm việc. Hai góc nhìn bổ sung nhau.',
  },
  {
    value: 'caution',
    q: 'Cần lưu ý gì?',
    a: 'Enneagram là bản đồ để soi mình, không phải lời tiên tri. Đừng dùng số nhóm để bào chữa ("tôi nhóm 8 nên mới gắt") hay đóng khung người khác. hieu.asia mô tả động lực như một góc nhìn để bạn hiểu và tự quyết — kết hợp với các lăng kính khác.',
  },
  {
    value: 'origin',
    q: 'Enneagram có phải bộ môn cổ đại ngàn năm không?',
    a: 'Không hẳn. Biểu tượng cửu giác được truyền bá ở phương Tây khoảng đầu thế kỷ 20 (qua Gurdjieff), nhưng hệ chín kiểu tính cách như ta biết hôm nay mới hình thành khoảng giữa thế kỷ 20 qua Óscar Ichazo rồi Claudio Naranjo, sau đó Don Riso và Russ Hudson hệ thống hóa và phổ biến phiên bản có cánh, mũi tên, cùng ý tưởng "mức phát triển". Nói thẳng: đây là một truyền thống hiện đại nhiều lớp, không phải cổ thư ngàn năm.',
  },
  {
    value: 'subtype',
    q: 'Bản năng (sp/sx/so) và subtype là gì — trắc nghiệm ở đây có đo không?',
    a: 'Ba bản năng là ba dạng chú ý sinh tồn: tự tồn (sp), xã hội (so), thân mật (sx). Ghép chúng với chín nhóm cho ra hai mươi bảy biến thể (subtype), là lớp nâng cao. Trắc nghiệm Enneagram trên hieu.asia chỉ tìm nhóm chính và cánh, không đo bản năng trội — phần bản năng chỉ được giới thiệu ở mức khái niệm để bạn hình dung.',
  },
  {
    value: 'levels',
    q: '"Mức phát triển" nghĩa là gì?',
    a: 'Là ý tưởng của Riso–Hudson rằng trong cùng một nhóm, người ta dao động trên một dải từ lành mạnh, qua trung bình, tới kém lành mạnh. Nhóm cho biết bạn thường bắt đầu từ đâu; mức độ cho biết bạn đang dùng động lực ấy theo hướng cởi mở hay cứng nhắc. Đây là khung để hiểu, không phải một điểm số đo được bằng bài trắc nghiệm ngắn.',
  },
  {
    value: 'science',
    q: 'Enneagram có cơ sở khoa học không?',
    a: 'Enneagram phát triển bên ngoài dòng tâm lý học hàn lâm. Các nhà tâm trắc học chỉ ra rằng nó chưa có nền kiểm định chặt chẽ như các thang đo nhân cách chuẩn (chẳng hạn nhóm đặc điểm Big Five), và ranh giới giữa chín kiểu không sắc như mô hình gợi ý. Vì thế hãy dùng Enneagram như một khung tự phản tỉnh và đối thoại, không như một chẩn đoán hay phép đo chính xác.',
  },
];

const JSONLD = [
  article({
    headline: 'Enneagram — 9 nhóm tính cách & 3 trung tâm',
    description:
      'Enneagram mô tả 9 nhóm tính cách theo động lực sâu bên trong (điều bạn sợ và điều bạn khao khát), chia theo 3 trung tâm: Bản năng, Tình cảm, Lý trí.',
    url: '/learn/enneagram',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Enneagram', url: '/learn/enneagram' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Enneagram — 9 nhóm tính cách & 3 trung tâm',
    description:
      'Enneagram: 9 nhóm tính cách theo động lực sâu (điều bạn sợ & khao khát), chia 3 trung tâm: Bản năng, Tình cảm, Lý trí. Bản đồ hiểu mình, không nhãn.',
    url: '/learn/enneagram',
  }),
  itemList(
    listTypes().map((t) => ({
      name: `Nhóm ${t.slug} — ${t.name}`,
      url: `/learn/enneagram/${t.slug}`,
    })),
  ),
];

export default function LearnEnneagramPage() {
  return (
    <LearnArticle
      eyebrow="Tâm lý · Bản đồ 9 nhóm"
      title={
        <>
          Enneagram — <span className="bg-gold-gradient bg-clip-text text-transparent">9 nhóm tính cách</span>
        </>
      }
      standfirst={
        <>
          Enneagram xếp con người thành chín nhóm dựa trên <em>động lực sâu bên trong</em> — điều bạn
          khao khát và điều bạn sợ — chứ không phải hành vi bề mặt. Đó là lý do hai người trông rất
          khác nhau vẫn có thể cùng một nhóm. Hãy xem nó như <em>bản đồ để hiểu mình</em>, không phải
          chiếc hộp để nhốt.
        </>
      }
      readMeta="6 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Enneagram' },
      ]}
      relatedLenses={relatedLearnLenses('enneagram')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Trả lời bộ câu hỏi Enneagram để tìm nhóm chính của bạn, kèm luận giải cá nhân hoá về động lực, điểm mạnh và điều cần để ý — mô tả xu hướng, không phán định mệnh.',
        href: '/enneagram',
        label: 'Làm trắc nghiệm Enneagram',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <EnneagramFrame />,
        },
        {
          id: 'nguon-goc',
          tocLabel: 'Nguồn gốc',
          heading: 'Nguồn gốc: kể cho đúng',
          children: (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-foreground/85">
                Có một ngộ nhận phổ biến rằng Enneagram là minh triết cổ đại ngàn năm. Sự thật gọn hơn
                và trung thực hơn: đây là một truyền thống nhiều lớp, ghép từ một biểu tượng cũ và phần
                tâm lý mới được bồi đắp trong khoảng nửa thế kỷ gần đây.
              </p>
              <ol className="space-y-3">
                {ORIGIN_MILESTONES.map((m) => (
                  <li
                    key={m.era}
                    className="border-t border-border/60 pt-3 first:border-0 first:pt-0"
                  >
                    <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold-700">
                      {m.era}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/85">{m.text}</p>
                  </li>
                ))}
              </ol>
              <p className="rounded-lg border border-gold/25 bg-gold/5 p-4 text-sm leading-relaxed text-foreground/85">
                Nói thẳng: phần “chín kiểu tính cách” là công trình hiện đại, không phải cổ thư. Biết
                đúng nguồn gốc không làm Enneagram kém giá trị — nó chỉ giúp bạn dùng công cụ này tỉnh
                táo, không thần thánh hoá.
              </p>
            </div>
          ),
        },
        {
          id: 'chin-nhom',
          tocLabel: 'Chín nhóm',
          heading: 'Chín nhóm tính cách',
          children: (
            <ul className="space-y-1">
              {TYPES.map((t) => (
                <li key={t.n} className="border-t border-border/60 first:border-0">
                  <Link
                    href={`/learn/enneagram/${t.n}`}
                    className="group flex gap-3 rounded-lg py-3 transition hover:bg-card/40"
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/40 font-heading text-sm text-gold-700 group-hover:border-gold">
                      {t.n}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-heading text-base text-foreground group-hover:text-gold">
                          {t.vi}
                        </span>
                        <span className="font-mono text-[13px] uppercase tracking-[0.14em] text-muted-foreground">
                          {t.en}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/85">{t.core}</p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-sm text-muted-foreground group-hover:text-gold"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <EnneagramDepth />,
        },
        {
          id: 'ba-trung-tam',
          tocLabel: 'Ba trung tâm',
          heading: 'Ba trung tâm',
          children: (
            <ul className="space-y-4">
              {CENTERS.map((c) => (
                <li key={c.name} className="border-t border-border/60 pt-4 first:border-0 first:pt-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading text-base text-foreground">{c.name}</span>
                    <span className="font-mono text-[13px] uppercase tracking-[0.14em] text-muted-foreground">
                      {c.types}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/85">{c.theme}</p>
                </li>
              ))}
            </ul>
          ),
        },
        {
          id: 'ba-ban-nang',
          tocLabel: 'Ba bản năng',
          heading: 'Ba bản năng (subtypes)',
          children: (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-foreground/85">
                Bên cạnh chín nhóm, mỗi người còn có một trong ba “bản năng” chi phối nơi họ dồn chú ý
                nhiều nhất. Đây là một lớp khác của mô hình, đặt cạnh nhóm chính chứ không thay nó.
              </p>
              <ul className="space-y-4">
                {INSTINCTS.map((it) => (
                  <li
                    key={it.code}
                    className="border-t border-border/60 pt-4 first:border-0 first:pt-0"
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading text-base text-foreground">{it.name}</span>
                      <span className="font-mono text-[13px] uppercase tracking-[0.14em] text-muted-foreground">
                        {it.code}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/85">{it.text}</p>
                  </li>
                ))}
              </ul>
              <p className="rounded-lg border border-border bg-card/40 p-4 text-sm leading-relaxed text-muted-foreground">
                Mỗi người có cả ba bản năng nhưng thường có một cái trội. Ghép chín kiểu với ba bản
                năng cho ra hai mươi bảy biến thể (subtype) — đây là lớp nâng cao, ở đây chỉ giới thiệu
                ở mức khái niệm. Trắc nghiệm Enneagram trên hieu.asia chỉ tìm nhóm chính và cánh,{' '}
                <strong className="text-foreground">không đo bản năng trội</strong>; muốn xác định
                subtype cần quan sát sâu hơn nhiều.
              </p>
            </div>
          ),
        },
        {
          id: 'chin-muc',
          tocLabel: 'Chín mức phát triển',
          heading: 'Chín mức phát triển — ý tưởng lõi của Riso–Hudson',
          children: (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-foreground/85">
                Một ý tưởng lõi của Don Riso và Russ Hudson: trong cùng một nhóm, người ta không đứng
                yên ở một điểm mà dao động trên một dải “mức độ lành mạnh”. Họ chia dải này thành chín
                mức, gộp lại thành ba vùng.
              </p>
              <ul className="space-y-4">
                {LEVEL_BANDS.map((b) => (
                  <li
                    key={b.name}
                    className="border-t border-border/60 pt-4 first:border-0 first:pt-0"
                  >
                    <span className="font-heading text-base text-foreground">{b.name}</span>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/85">{b.text}</p>
                  </li>
                ))}
              </ul>
              <p className="text-sm leading-relaxed text-foreground/85">
                Điều hữu ích: hai người cùng nhóm 8 có thể rất khác nhau — một người ở vùng lành mạnh
                (che chở, rộng lượng), một người ở vùng kém (áp đặt, kiểm soát). Nhóm cho biết bạn
                thường bắt đầu từ đâu; mức độ cho biết bạn đang dùng động lực ấy theo hướng nào.
              </p>
              <p className="rounded-lg border border-gold/25 bg-gold/5 p-4 text-sm leading-relaxed text-foreground/85">
                Một lời thành thật: đây là ý tưởng khung, không phải thang đo chính xác. Không có “điểm
                mức” nào chấm được bằng một bài trắc nghiệm ngắn — kể cả bài của hieu.asia. Hãy xem nó
                như lời nhắc: cùng một nhóm vẫn có nhiều phiên bản, và bạn di chuyển được.
              </p>
            </div>
          ),
        },
        {
          id: 'so-tay-thuat-ngu',
          tocLabel: 'Sổ tay thuật ngữ',
          heading: 'Sổ tay thuật ngữ',
          children: (
            <dl className="space-y-3">
              {GLOSSARY.map((g) => (
                <div
                  key={g.term}
                  className="border-t border-border/60 pt-3 first:border-0 first:pt-0 sm:flex sm:gap-4"
                >
                  <dt className="font-heading text-sm text-foreground sm:w-56 sm:shrink-0">
                    {g.term}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-foreground/85 sm:mt-0">{g.def}</dd>
                </div>
              ))}
            </dl>
          ),
        },
        {
          id: 'giai-thich',
          tocLabel: 'Giải thích chi tiết',
          heading: 'Giải thích chi tiết',
          children: (
            <Accordion type="single" collapsible className="space-y-2">
              {FAQS.map((f) => (
                <AccordionItem key={f.value} value={f.value} className="rounded border border-border px-4">
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <EnneagramWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <EnneagramRecall />,
        },
        {
          id: 'ban-da-hieu-chua',
          tocLabel: 'Bạn đã hiểu chưa?',
          heading: 'Bạn đã thật sự hiểu chưa?',
          children: <EnneagramChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
