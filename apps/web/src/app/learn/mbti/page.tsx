import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@hieu-asia/ui';
import { InfographicMBTI } from '@/components/learn/InfographicMBTI';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { relatedLearnLenses } from '@/lib/learn/related';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, course, faqPage, itemList } from '@/lib/seo/jsonld';
import { listTypes, MBTI_GROUPS, type MbtiGroupKey } from '@/lib/mbti-type-data';
import {
  MbtiFrame,
  MbtiDepth,
  MbtiRecall,
  MbtiChecklist,
  MbtiWhys,
} from './_active-learning';

const GROUP_ORDER: MbtiGroupKey[] = ['NT', 'NF', 'SJ', 'SP'];
const TYPES_BY_GROUP = GROUP_ORDER.map((g) => ({
  key: g,
  meta: MBTI_GROUPS[g],
  types: listTypes().filter((t) => t.group === g),
}));

export const metadata: Metadata = {
  title: 'MBTI 16 loại tính cách | Học huyền học',
  description:
    'MBTI dựa trên 4 trục: Hướng nội/ngoại (I/E), Trực giác/Cảm nhận (N/S), Lý trí/Cảm xúc (T/F), Nguyên tắc/Linh hoạt (J/P), tạo nên 16 nhóm tính cách.',
  alternates: { canonical: 'https://hieu.asia/learn/mbti' },
};

// FAQ dùng chung cho FAQPage JSON-LD — chữ schema === chữ đang hiển thị trong
// phần "Giải thích chi tiết" (các AccordionItem) để chống cloaking.
const FAQS = [
  {
    q: '4 trục lưỡng cực là gì?',
    a: 'I / E: Hướng nội (Introvert) vs Hướng ngoại (Extravert). Nguồn năng lượng đến từ một mình hay từ tương tác? N / S: Trực giác (iNtuition) vs Cảm nhận (Sensing). Chú ý vào khả năng, mẫu hình, hay vào chi tiết, dữ kiện? T / F: Lý trí (Thinking) vs Cảm xúc (Feeling). Quyết định theo logic hay theo giá trị, cảm xúc? J / P: Nguyên tắc (Judging) vs Linh hoạt (Perceiving). Thích đóng kế hoạch hay để mở, ứng biến?',
  },
  {
    q: '4 nhóm lớn?',
    a: 'Analysts (NT) gồm INTJ, INTP, ENTJ, ENTP: tư duy hệ thống. Diplomats (NF) gồm INFJ, INFP, ENFJ, ENFP: lý tưởng, đồng cảm. Sentinels (SJ) gồm ISTJ, ISFJ, ESTJ, ESFJ: trật tự, trách nhiệm. Explorers (SP) gồm ISTP, ISFP, ESTP, ESFP: thực tế, linh hoạt.',
  },
  {
    q: 'Cần lưu ý gì?',
    a: 'MBTI là khung phân loại, không phải chẩn đoán. Kết quả có thể thay đổi theo giai đoạn cuộc đời. Đừng dùng MBTI để dán nhãn hay phán xét người khác, hãy dùng để hiểu cách mình vận hành tự nhiên.',
  },
  {
    q: 'MBTI có khoa học không?',
    a: 'MBTI bị nhiều nhà tâm lý học phản biện về độ tin cậy (test-retest reliability). Tuy nhiên với mục đích tự phản tỉnh và đối thoại, nó vẫn là khung hữu ích, nhất là khi kết hợp với các góc nhìn khác.',
  },
  {
    q: 'MBTI có bị đổi kết quả khi làm lại không?',
    a: 'Có thể. Đây là điểm các nhà tâm lý hay chỉ ra: làm lại bài sau một thời gian, không ít người rơi sang một nhóm lân cận, nhất là khi họ vốn nằm gần ranh giới của một trục. Lý do là tính cách trải trên một dải liên tục, còn bài test lại cắt mỗi trục thành hai nửa — ai ở giữa dễ nghiêng bên này hay bên kia tuỳ tâm trạng và hoàn cảnh lúc trả lời. Vì vậy nên xem kết quả là điểm khởi đầu để tự quan sát, không phải con dấu đóng một lần cho cả đời.',
  },
  {
    q: '8 chức năng nhận thức khác gì 4 trục?',
    a: 'Bốn trục (I/E, N/S, T/F, J/P) là lớp phân loại bề mặt, ghép lại cho ra bốn chữ cái. Tám chức năng nhận thức (Ni, Ne, Si, Se, Ti, Te, Fi, Fe) là lớp lý thuyết sâu hơn bắt nguồn từ Jung: mỗi nhóm không chỉ nghiêng về N hay S, mà dùng các chức năng theo một trật tự ưu tiên — trội, phụ trợ, cấp ba, kém. Chuỗi này lý giải vì sao hai nhóm chung nhiều chữ cái vẫn vận hành khác nhau. Bốn trục tiện để nhận diện nhanh; tám chức năng giúp hiểu cơ chế bên trong, nhưng cũng trừu tượng, khó đo và còn nhiều tranh luận hơn.',
  },
  {
    q: 'Vì sao không nên dùng MBTI để tuyển dụng?',
    a: 'Vì MBTI đo thiên hướng tự nhiên, không đo năng lực, kỹ năng hay hiệu quả công việc — và kết quả có thể đổi khi làm lại. Dùng nó để sàng lọc hay chấm ứng viên dễ dẫn tới dán nhãn và loại người oan. Vì lẽ đó, giới chuyên môn từ lâu khuyến cáo không dùng MBTI cho tuyển dụng hay đề bạt. MBTI hợp để mỗi người tự hiểu mình và để đội nhóm nói chuyện về khác biệt, không phải để quyết định ai được nhận việc.',
  },
  {
    q: 'MBTI khác Big Five thế nào?',
    a: 'Cả hai cùng mô tả tính cách nhưng khác gốc và khác cách đo. MBTI xuất phát từ thuyết Jung, xếp người vào 16 nhóm bằng bốn trục nhị phân — dễ nhớ, dễ nói. Big Five (còn gọi OCEAN: cởi mở, tận tâm, hướng ngoại, dễ chịu, bất ổn cảm xúc) được các nhà tâm trắc học dựng từ việc phân tích ngôn ngữ mô tả tính cách, và đo mỗi chiều trên một thang liên tục thay vì chia đôi. Trong giới học thuật, Big Five thường được coi là mô hình có nền tảng đo lường vững hơn; MBTI phổ biến hơn trong đời sống và doanh nghiệp nhờ dễ tiếp cận. Không ít người dùng cả hai: MBTI để bắt chuyện về bản thân, Big Five khi cần một thước đo chặt chẽ hơn.',
  },
];

const JSONLD = [
  article({
    headline: 'MBTI: 16 loại tính cách',
    description:
      'MBTI dựa trên 4 trục: Hướng nội/ngoại (I/E), Trực giác/Cảm nhận (N/S), Lý trí/Cảm xúc (T/F), Nguyên tắc/Linh hoạt (J/P), tạo nên 16 nhóm tính cách.',
    url: '/learn/mbti',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'MBTI', url: '/learn/mbti' },
  ]),
  faqPage(FAQS),
  course({
    // Course entity name = tên khoá sạch, KHÔNG gắn hậu tố chuyên mục
    // "| Học huyền học": MBTI là mô hình tâm lý học, không phải huyền học.
    // metadata.title (canonical) giữ nguyên — đổi title là quyết định của founder.
    name: 'MBTI 16 loại tính cách',
    description:
      'MBTI dựa trên 4 trục: Hướng nội/ngoại (I/E), Trực giác/Cảm nhận (N/S), Lý trí/Cảm xúc (T/F), Nguyên tắc/Linh hoạt (J/P), tạo nên 16 nhóm tính cách.',
    url: '/learn/mbti',
  }),
  itemList(
    listTypes().map((t) => ({
      name: `${t.code} — ${t.nick}`,
      url: `/learn/mbti/${t.slug}`,
    })),
  ),
];

// Đoạn mô tả 3-4 câu cho từng nhóm lớn (bổ sung cho chip link ở dưới).
const GROUP_PROSE: Record<MbtiGroupKey, string> = {
  NT: 'Bốn nhóm Phân Tích (INTJ, INTP, ENTJ, ENTP) đều ghép Trực giác với Lý trí, nên bị cuốn vào nguyên lý và hệ thống hơn là quy trình quen. Họ thích hỏi tại sao, dựng mô hình và tìm giải pháp gốc rễ. Điểm chung là coi trọng năng lực và sự mạch lạc; điểm cần luyện thường là kiên nhẫn với cảm xúc và nhịp của người khác. Trong nhóm này, hướng nội (INTJ, INTP) nghiêng về đào sâu một mình, hướng ngoại (ENTJ, ENTP) nghiêng về bàn luận và thúc đẩy.',
  NF: 'Bốn nhóm Ngoại Giao (INFJ, INFP, ENFJ, ENFP) ghép Trực giác với Cảm xúc, nên hướng tới ý nghĩa, con người và những điều tốt đẹp có thể thành hiện thực. Họ nhạy với động cơ, dễ đồng cảm và thường đi tìm mục đích sâu xa hơn là lợi ích trước mắt. Điểm chung là lý tưởng và chân thành; điểm cần luyện thường là đặt ranh giới và giữ sức cho chính mình. Hướng nội (INFJ, INFP) sống với thế giới nội tâm, hướng ngoại (ENFJ, ENFP) toả cảm hứng ra ngoài.',
  SJ: 'Bốn nhóm Gìn Giữ (ISTJ, ISFJ, ESTJ, ESFJ) ghép Cảm nhận với Nguyên tắc, nên bám vào kinh nghiệm đã kiểm chứng, trách nhiệm và sự ổn định. Họ là người giữ lời, làm tới nơi tới chốn và khiến mọi thứ vận hành đáng tin. Điểm chung là kỷ luật và tận tâm; điểm cần luyện thường là cởi mở với cái mới và nói ra nhu cầu của bản thân. Nhánh Lý trí (ISTJ, ESTJ) nghiêng về nhiệm vụ và quy trình, nhánh Cảm xúc (ISFJ, ESFJ) nghiêng về chăm sóc con người.',
  SP: 'Bốn nhóm Khám Phá (ISTP, ISFP, ESTP, ESFP) ghép Cảm nhận với Linh hoạt, nên sống nhạy với hiện tại, thích hành động và ứng biến hơn kế hoạch dài. Họ học bằng cách bắt tay làm, xoay xở giỏi và trân trọng tự do. Điểm chung là thực tế và thích nghi nhanh; điểm cần luyện thường là nghĩ cho đường dài và cam kết bền bỉ. Nhánh Lý trí (ISTP, ESTP) tiếp cận qua logic và kỹ thuật, nhánh Cảm xúc (ISFP, ESFP) tiếp cận qua giá trị và cảm quan.',
};

// Tám chức năng nhận thức — prose 2-3 câu, mở rộng từ khung Jung. Ghép thành
// từng cặp hướng nội / hướng ngoại của cùng một loại chức năng.
const COGNITIVE_FUNCTIONS: { code: string; name: string; body: string }[] = [
  {
    code: 'Ni',
    name: 'Trực giác hướng nội',
    body: 'Lặng lẽ gom nhiều dữ kiện rời rạc thành một mẫu hình ngầm và một viễn cảnh dài hạn. Người mạnh Ni thường "thấy trước" nơi mọi thứ đang hướng tới mà khó giải thích rành mạch vì sao. Là chức năng trội của INTJ và INFJ.',
  },
  {
    code: 'Ne',
    name: 'Trực giác hướng ngoại',
    body: 'Bật ra nhiều khả năng và liên tưởng từ một điểm khởi đầu, luôn hỏi "còn cách nào khác". Người mạnh Ne hào hứng với ý tưởng mới và dễ chán sự lặp lại. Là chức năng trội của ENTP và ENFP.',
  },
  {
    code: 'Si',
    name: 'Cảm nhận hướng nội',
    body: 'Lưu giữ chi tiết, kinh nghiệm và cảm giác quen thuộc, đối chiếu hiện tại với những gì đã từng. Người mạnh Si tin vào cái đã được kiểm chứng và trân trọng sự ổn định. Là chức năng trội của ISTJ và ISFJ.',
  },
  {
    code: 'Se',
    name: 'Cảm nhận hướng ngoại',
    body: 'Thu trọn dữ kiện của khoảnh khắc qua giác quan và phản ứng tức thì với thực tại trước mắt. Người mạnh Se sống động, thực tế và giỏi ứng biến tại chỗ. Là chức năng trội của ESTP và ESFP.',
  },
  {
    code: 'Ti',
    name: 'Tư duy hướng nội',
    body: 'Mổ xẻ vấn đề để tìm sự mạch lạc bên trong, dựng một khung logic riêng mà mọi thứ phải khớp vào. Người mạnh Ti coi trọng tính nhất quán hơn sự đồng thuận. Là chức năng trội của INTP và ISTP.',
  },
  {
    code: 'Te',
    name: 'Tư duy hướng ngoại',
    body: 'Tổ chức con người và nguồn lực theo hiệu quả đo được, đặt mục tiêu, quy trình và thời hạn. Người mạnh Te muốn thấy kết quả cụ thể và ít kiên nhẫn với lý thuyết suông. Là chức năng trội của ENTJ và ESTJ.',
  },
  {
    code: 'Fi',
    name: 'Cảm xúc hướng nội',
    body: 'La bàn giá trị riêng, đo mọi việc bằng câu hỏi "điều này có đúng với con người mình không". Người mạnh Fi kiên định với điều họ tin dù ít nói ra. Là chức năng trội của INFP và ISFP.',
  },
  {
    code: 'Fe',
    name: 'Cảm xúc hướng ngoại',
    body: 'Đọc và điều hoà cảm xúc của tập thể, chăm cho không khí chung được hài hoà. Người mạnh Fe nhạy với nhu cầu người khác và giỏi gắn kết. Là chức năng trội của ENFJ và ESFJ.',
  },
];

// Sổ tay thuật ngữ — mỗi mục một dòng giải nghĩa ngắn.
const GLOSSARY: { term: string; def: string }[] = [
  {
    term: 'Trục lưỡng cực (dichotomy)',
    def: 'Một trong bốn cặp đối lập của MBTI: I/E, N/S, T/F, J/P. Mỗi người được xếp nghiêng về một cực của từng trục.',
  },
  {
    term: 'Thiên hướng (preference)',
    def: 'Bên mà một người thấy tự nhiên và đỡ tốn sức hơn — như chuyện thuận tay. Không phải năng lực, cũng không loại trừ việc dùng được bên còn lại.',
  },
  {
    term: 'Chức năng nhận thức (cognitive function)',
    def: 'Cách tâm trí thu nhận thông tin hoặc ra quyết định, theo lý thuyết Jung. Có tám chức năng: Ni, Ne, Si, Se, Ti, Te, Fi, Fe.',
  },
  {
    term: 'Chuỗi chức năng (function stack)',
    def: 'Trật tự ưu tiên của bốn chức năng trong một nhóm, xếp từ dùng nhiều nhất đến ít ý thức nhất: trội, phụ trợ, cấp ba, kém.',
  },
  {
    term: 'Chức năng trội (dominant)',
    def: 'Chức năng dùng tự nhiên và mạnh nhất, định hình phong cách chủ đạo của nhóm. Ví dụ INTJ trội Ni.',
  },
  {
    term: 'Chức năng phụ trợ (auxiliary)',
    def: 'Chức năng thứ hai, cân bằng cho chức năng trội và là điểm tựa chính khi trưởng thành. Ví dụ INTJ phụ trợ Te.',
  },
  {
    term: 'Chức năng cấp ba (tertiary)',
    def: 'Chức năng thứ ba, thường phát triển muộn hơn và là hướng để mở rộng bản thân.',
  },
  {
    term: 'Chức năng kém / ẩn (inferior)',
    def: 'Chức năng thứ tư, ít ý thức nhất. Dưới áp lực kéo dài, nó dễ trồi lên một cách vụng về — gọi là rơi vào chức năng kém.',
  },
  {
    term: 'Hiệu ứng Barnum (Forer)',
    def: 'Xu hướng thấy đúng với những mô tả chung chung, mơ hồ, ai đọc cũng gật. Là lý do nhiều mô tả tính cách nghe "chuẩn không cần chỉnh".',
  },
  {
    term: 'Độ tin cậy đo lại (test-retest)',
    def: 'Mức độ một bài trắc nghiệm cho ra cùng kết quả khi làm lại sau một thời gian. MBTI bị phê bình vì độ tin cậy này chưa cao, nhất là với người ở gần ranh giới trục.',
  },
  {
    term: 'Nhị phân vs dải liên tục',
    def: 'MBTI cắt mỗi trục thành hai nửa (nhị phân), trong khi nhiều nhà tâm lý cho rằng tính cách trải liền trên một dải (liên tục). Đây là một trong những điểm tranh luận chính.',
  },
  {
    term: 'Big Five (OCEAN)',
    def: 'Mô hình năm chiều tính cách (cởi mở, tận tâm, hướng ngoại, dễ chịu, bất ổn cảm xúc) được giới học thuật xem là có nền tảng đo lường vững, đo trên thang liên tục thay vì chia nhóm.',
  },
];

export default function LearnMBTIPage() {
  return (
    <LearnArticle
      eyebrow="Tây phương · Carl Jung"
      title={
        <>
          MBTI: <span className="bg-gold-gradient bg-clip-text text-transparent">16 loại tính cách</span>
        </>
      }
      standfirst={
        <>
          Myers-Briggs Type Indicator phát triển từ thuyết tâm lý của Carl Jung. 4 trục lưỡng
          cực tạo nên 16 nhóm tính cách, không phải "ô đóng" mà là thiên hướng tự nhiên.
        </>
      }
      readMeta="10 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'MBTI' },
      ]}
      relatedLenses={relatedLearnLenses('mbti')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Trả lời bộ câu hỏi MBTI khoảng 5 phút để xem 1 trong 16 nhóm tính cách phù hợp với thiên hướng tự nhiên của bạn.',
        href: '/mbti',
        label: 'Làm trắc nghiệm MBTI',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <MbtiFrame />,
        },
        {
          id: 'tu-jung-den-bang-phan-loai',
          tocLabel: 'Từ Jung đến bảng',
          heading: 'Từ Jung đến bảng phân loại',
          children: (
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                Gốc của MBTI là công trình của nhà tâm lý học Thuỵ Sĩ Carl Jung. Trong cuốn{' '}
                <em>Psychological Types</em> (Các kiểu tâm lý) xuất bản năm 1921, Jung mô tả con
                người khác nhau ở cách hướng năng lượng ra ngoài hay vào trong, và ở cách họ thu
                nhận thông tin cùng ra quyết định. Ông chưa lập bảng câu hỏi; đó là một lý thuyết
                về các kiểu tâm lý.
              </p>
              <p>
                Từ khoảng thập niên 1940 trở đi, hai mẹ con người Mỹ là Katharine Cook Briggs và
                con gái bà, Isabel Briggs Myers, đã hệ thống ý tưởng của Jung thành một bộ câu hỏi
                thực dùng, thêm trục Nguyên tắc / Linh hoạt (J/P) và ghép bốn trục thành 16 nhóm.
                Bảng phân loại này lan rộng dần, và từ nửa sau thế kỷ 20 trở nên phổ biến trong đào
                tạo, hướng nghiệp và các tổ chức, doanh nghiệp.
              </p>
              <p>
                Vị trí hôm nay của MBTI khá đặc biệt: có lẽ là công cụ tự nhận thức được nhiều người
                dùng nhất thế giới, nhưng lại <strong className="text-foreground">không</strong> được
                giới tâm lý học coi là một chuẩn đo lường học thuật. Nó mô tả tính cách ở mức định
                tính — một tấm bản đồ để bắt đầu hiểu mình, không phải một phép đo chính xác.
              </p>
            </div>
          ),
        },
        {
          id: 'so-do-4-truc',
          tocLabel: '4 trục & 16 nhóm',
          heading: 'Sơ đồ 4 trục',
          children: (
            <div className="rounded-xl border border-border bg-card/40 p-6 sm:p-8">
              <InfographicMBTI />
            </div>
          ),
        },
        {
          id: 'muoi-sau-nhom',
          tocLabel: '16 nhóm',
          heading: '16 nhóm tính cách',
          children: (
            <div className="space-y-6">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Bấm vào từng nhóm để đọc sâu: tổng quan, điểm mạnh, hướng phát triển, chuỗi chức
                năng nhận thức, công việc và các mối quan hệ.
              </p>
              {TYPES_BY_GROUP.map((grp) => (
                <div key={grp.key}>
                  <div className="mb-2 flex items-baseline gap-2">
                    <span className="font-heading text-base text-foreground">{grp.meta.name}</span>
                    <span className="font-mono text-[13px] uppercase tracking-[0.14em] text-muted-foreground">
                      {grp.meta.en}
                    </span>
                  </div>
                  <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                    {GROUP_PROSE[grp.key]}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {grp.types.map((t) => (
                      <Link
                        key={t.slug}
                        href={`/learn/mbti/${t.slug}`}
                        className="group flex items-center gap-3 rounded-lg border border-border bg-card/40 px-3 py-2 transition hover:border-gold/40"
                      >
                        <span className="font-mono text-sm font-semibold tracking-wide text-gold-700 group-hover:text-gold">
                          {t.code}
                        </span>
                        <span className="text-sm text-foreground/85">{t.nick}</span>
                        <span
                          aria-hidden="true"
                          className="ml-auto text-sm text-muted-foreground group-hover:text-gold"
                        >
                          →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ),
        },
        {
          id: 'tam-chuc-nang-nhan-thuc',
          tocLabel: '8 chức năng nhận thức',
          heading: 'Tám chức năng nhận thức',
          children: (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                Bốn chữ cái mới là lớp ngoài. Bên dưới, lý thuyết Jung cho rằng mỗi nhóm dùng tám
                chức năng nhận thức theo một trật tự riêng. Chức năng là cách tâm trí{' '}
                <strong className="text-foreground">thu nhận thông tin</strong> (Trực giác N và Cảm
                nhận S) hoặc <strong className="text-foreground">ra quyết định</strong> (Tư duy T và
                Cảm xúc F), mỗi loại lại có hướng vào trong (i) hay ra ngoài (e) — thành tám.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {COGNITIVE_FUNCTIONS.map((f) => (
                  <div key={f.code} className="rounded-lg border border-border bg-card/40 px-4 py-3">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-base font-semibold text-gold-700">
                        {f.code}
                      </span>
                      <span className="text-sm text-foreground/85">{f.name}</span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-gold/20 bg-card/40 px-4 py-3">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <strong className="text-foreground">Chuỗi trội → phụ trợ → cấp ba → kém.</strong>{' '}
                  Mỗi nhóm không dùng cả tám mà xoay quanh bốn chức năng, xếp từ dùng nhiều nhất tới
                  ít ý thức nhất. Ví dụ INTJ đọc từ chuỗi{' '}
                  <span className="font-mono text-foreground">Ni · Te · Fi · Se</span>: trội là Ni
                  (gom dữ kiện thành viễn cảnh dài hạn), phụ trợ Te (bày viễn cảnh đó thành kế hoạch
                  đo được), cấp ba Fi (la bàn giá trị riêng, phát triển muộn hơn), và kém là Se (kết
                  nối với hiện tại — chỗ INTJ hay lóng ngóng, dễ trồi lên khi căng thẳng). Chính
                  chuỗi này giải thích vì sao hai nhóm chung nhiều chữ cái vẫn vận hành khác nhau.
                </p>
              </div>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <MbtiDepth />,
        },
        {
          id: 'vi-tri-khoa-hoc',
          tocLabel: 'Vị trí khoa học',
          heading: 'Vị trí khoa học: đọc cho sòng phẳng',
          children: (
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                Phần thương hiệu của trang này là nói thẳng cả chỗ hay lẫn chỗ yếu. MBTI hữu ích,
                nhưng nó không phải một phép đo học thuật, và bốn phê bình dưới đây là những điểm
                giới tâm lý học nêu ra nhiều nhất.
              </p>
              <ul className="space-y-3">
                <li className="rounded-lg border border-border bg-card/40 px-4 py-3">
                  <strong className="text-foreground">Làm lại có thể ra kết quả khác.</strong> Nhiều
                  nhà tâm lý chỉ ra rằng đo lại sau một thời gian, không ít người rơi sang nhóm lân
                  cận. Kết quả vì thế nên đọc như một điểm khởi đầu, không phải phán quyết cố định.
                </li>
                <li className="rounded-lg border border-border bg-card/40 px-4 py-3">
                  <strong className="text-foreground">Cắt đôi một dải liên tục.</strong> Tính cách
                  trải liền trên một phổ, nhưng MBTI chia mỗi trục thành hai nửa. Người nằm gần
                  giữa bị đẩy hẳn về một bên, dù họ chỉ nhỉnh hơn chút xíu.
                </li>
                <li className="rounded-lg border border-border bg-card/40 px-4 py-3">
                  <strong className="text-foreground">Dễ dính hiệu ứng Barnum.</strong> Mô tả nhóm
                  thường đủ chung chung để hầu như ai đọc cũng thấy đúng. Cảm giác "chuẩn không cần
                  chỉnh" đôi khi đến từ đây, chứ không hẳn vì bài đo trúng.
                </li>
                <li className="rounded-lg border border-border bg-card/40 px-4 py-3">
                  <strong className="text-foreground">Không phải thước đo năng lực.</strong> MBTI đo
                  thiên hướng, không đo giỏi dở hay hiệu quả. Vì vậy không nên dùng nó để tuyển
                  dụng, đề bạt hay đánh giá một con người.
                </li>
              </ul>
              <p>
                Vậy vì sao vẫn đáng học? Vì MBTI cho ta một{' '}
                <strong className="text-foreground">ngôn ngữ chung</strong> để nói về khác biệt tính
                cách mà không phán ai đúng ai sai, và một cửa vào để tự quan sát: hoá ra mình nạp
                năng lượng, chú ý và quyết định theo kiểu này, còn người kia theo kiểu khác. Dùng
                đúng chỗ, nó mở ra cảm thông và hợp tác. Dùng sai chỗ, nó thành cái nhãn để đóng
                khung người khác. Một mô hình như Big Five có nền tảng đo lường chặt hơn nếu bạn cần
                sự chính xác; còn MBTI mạnh ở chỗ dễ tiếp cận và dễ bắt chuyện về bản thân.
              </p>
            </div>
          ),
        },
        {
          id: 'so-tay-thuat-ngu',
          tocLabel: 'Sổ tay thuật ngữ',
          heading: 'Sổ tay thuật ngữ',
          children: (
            <dl className="space-y-2">
              {GLOSSARY.map((g) => (
                <div
                  key={g.term}
                  className="rounded-lg border border-border bg-card/40 px-4 py-3"
                >
                  <dt className="font-heading text-sm text-foreground">{g.term}</dt>
                  <dd className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{g.def}</dd>
                </div>
              ))}
            </dl>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <MbtiWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <MbtiRecall />,
        },
        {
          id: 'giai-thich',
          tocLabel: 'Giải thích chi tiết',
          heading: 'Giải thích chi tiết',
          children: (
            <Accordion type="single" collapsible className="space-y-2">
              <AccordionItem value="axes" className="rounded border border-border px-4">
                <AccordionTrigger>4 trục lưỡng cực là gì?</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-inside list-disc space-y-1">
                    <li>
                      <strong>I / E</strong>: Hướng nội (Introvert) vs Hướng ngoại (Extravert).
                      Nguồn năng lượng đến từ một mình hay từ tương tác?
                    </li>
                    <li>
                      <strong>N / S</strong>: Trực giác (iNtuition) vs Cảm nhận (Sensing). Chú ý
                      vào khả năng, mẫu hình, hay vào chi tiết, dữ kiện?
                    </li>
                    <li>
                      <strong>T / F</strong>: Lý trí (Thinking) vs Cảm xúc (Feeling). Quyết định
                      theo logic hay theo giá trị, cảm xúc?
                    </li>
                    <li>
                      <strong>J / P</strong>: Nguyên tắc (Judging) vs Linh hoạt (Perceiving).
                      Thích đóng kế hoạch hay để mở, ứng biến?
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="quadrant" className="rounded border border-border px-4">
                <AccordionTrigger>4 nhóm lớn?</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-inside list-disc space-y-1">
                    <li>
                      <strong>Analysts (NT)</strong> gồm INTJ, INTP, ENTJ, ENTP: tư duy hệ thống.
                    </li>
                    <li>
                      <strong>Diplomats (NF)</strong> gồm INFJ, INFP, ENFJ, ENFP: lý tưởng, đồng cảm.
                    </li>
                    <li>
                      <strong>Sentinels (SJ)</strong> gồm ISTJ, ISFJ, ESTJ, ESFJ: trật tự, trách nhiệm.
                    </li>
                    <li>
                      <strong>Explorers (SP)</strong> gồm ISTP, ISFP, ESTP, ESFP: thực tế, linh hoạt.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="caution" className="rounded border border-border px-4">
                <AccordionTrigger>Cần lưu ý gì?</AccordionTrigger>
                <AccordionContent>
                  MBTI là khung phân loại, không phải chẩn đoán. Kết quả có thể thay đổi theo
                  giai đoạn cuộc đời. Đừng dùng MBTI để dán nhãn hay phán xét người khác, hãy dùng
                  để hiểu cách mình vận hành tự nhiên.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="science" className="rounded border border-border px-4">
                <AccordionTrigger>MBTI có khoa học không?</AccordionTrigger>
                <AccordionContent>
                  MBTI bị nhiều nhà tâm lý học phản biện về độ tin cậy (test-retest reliability).
                  Tuy nhiên với mục đích tự phản tỉnh và đối thoại, nó vẫn là khung hữu ích, nhất
                  là khi kết hợp với các góc nhìn khác.
                </AccordionContent>
              </AccordionItem>
              {/* 4 câu bổ sung: chữ hiển thị lấy thẳng từ mảng FAQS để đúng bằng
                  chữ trong FAQPage JSON-LD (chống cloaking). */}
              {FAQS.slice(4).map((f, i) => (
                <AccordionItem
                  key={f.q}
                  value={`faq-extra-${i}`}
                  className="rounded border border-border px-4"
                >
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ),
        },
        {
          id: 'ban-da-hieu-chua',
          tocLabel: 'Bạn đã hiểu chưa?',
          heading: 'Bạn đã thật sự hiểu chưa?',
          children: <MbtiChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
