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
import { article, breadcrumb, course, faqPage } from '@/lib/seo/jsonld';
import {
  ThanSoHocFrame,
  ThanSoHocDepth,
  ThanSoHocRecall,
  ThanSoHocChecklist,
  ThanSoHocWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Thần Số Học Pythagoras: Học huyền học',
  description:
    'Thần Số Học (Numerology) theo trường phái Pythagoras: rút số chủ đạo từ ngày sinh và tên, mỗi số mang một năng lượng riêng.',
  alternates: { canonical: 'https://hieu.asia/learn/than-so-hoc' },
};

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS = [
  {
    q: 'Pythagoras là ai, và ông có thật sự lập ra Thần Số Học không?',
    a: 'Pythagoras (~570–495 TCN) là nhà toán học, triết gia Hy Lạp gắn với ý tưởng "vạn vật đều có thể quy về số" — số không chỉ để đếm mà còn mang một "linh hồn" phản ánh quy luật vũ trụ. Nhưng cái tên Pythagoras ở đây mang tính quy ước: không có bằng chứng lịch sử rằng chính ông lập ra bảng chữ→số ngày nay. Hệ thống hiện hành chủ yếu được định hình ở thế kỷ 20 (L. Dow Balliett, Juno Jordan, rồi Hans Decoz). hieu.asia bám biến thể Decoz.',
  },
  {
    q: 'Cách tính số chủ đạo?',
    a: 'hieu.asia dùng cách theo thành phần (Decoz): rút gọn riêng ngày, tháng, năm rồi mới cộng lại. Ví dụ 15/08/1990: ngày 15 → 1+5 = 6; tháng 08 → 8; năm 1990 → 1+9+9+0 = 19 → 1+9 = 10 → 1; cộng 6+8+1 = 15 → 6. Vậy số chủ đạo là 6. Riêng khi một tổng rơi đúng 11, 22 hoặc 33 thì giữ nguyên (gọi là số bậc thầy), không rút tiếp.',
  },
  {
    q: 'Số từ tên thì sao?',
    a: 'Mỗi chữ cái được gán một số 1–9 theo bảng Pythagoras. Cộng các số ứng với tên đầy đủ rồi rút gọn, ra số biểu hiện (expression number) và số linh hồn (soul urge number).',
  },
  {
    q: 'Dùng để làm gì?',
    a: 'Soi tính cách bẩm sinh, sứ mệnh đời, vùng dễ vấp. Là công cụ tự nhận thức nhanh, chỉ cần ngày sinh + tên là có bản phác họa. Đây là một lăng kính để hiểu mình, không phải lời phán định mệnh.',
  },
  {
    q: 'Số bậc thầy 11, 22, 33 nghĩa là gì?',
    a: 'Khi tổng rút gọn rơi đúng vào 11, 22 hoặc 33 thì giữ nguyên, không rút tiếp về 2/4/6. Đây là phiên bản cường độ cao của số gốc — tiềm năng lớn hơn nhưng cũng là bài tập khó hơn, KHÔNG phải "đẳng cấp cao hơn người". Nhiều người sống phần lớn đời ở dạng số gốc và chỉ kích hoạt cường độ master ở giai đoạn trưởng thành. Có trường phái chỉ công nhận 11 và 22, coi 33 là hiếm; cách đọc Decoz (hieu.asia dùng) công nhận cả ba.',
  },
  {
    q: 'Tên tiếng Việt có dấu thì tính thế nào?',
    a: 'Bảng Pythagoras chỉ có 26 chữ La-tinh, nên tên Việt được bỏ dấu về chữ không dấu trước khi tra (Nguyễn → NGUYEN, Phương → PHUONG, Đ → D). Cần lưu ý thật lòng: hệ này sinh ra cho tên gốc tiếng Anh, nên việc bỏ dấu là một quy ước thực dụng, không phải chân lý — hãy xem đây là một cách chơi với con số để soi mình, không phải "con số định mệnh tuyệt đối của tên bạn".',
  },
  {
    q: 'Số Nợ Nghiệp (13, 14, 16, 19) có phải điềm xấu không?',
    a: 'Không. Trong cách đọc Decoz, bốn con số 13/14/16/19 là bài học còn dang dở cần hoàn thiện ở đời này bằng nỗ lực có ý thức, không phải điềm xấu hay bản án. Mỗi số đều có "điều cần học" kèm "cách đi tới". hieu.asia không hù dọa "nghiệp nặng/kiếp trước" và không bán dịch vụ "giải nghiệp". Lưu ý: không phải trường phái nào cũng dùng bộ số này — đây là đặc trưng của Decoz.',
  },
  {
    q: 'Thần Số Học có phải là khoa học không?',
    a: 'Không. Giới khoa học xếp thần số học vào nhóm pseudoscience — không có cơ chế nhân quả được kiểm chứng. hieu.asia trung thực về điều này và định vị nó như một lăng kính biểu tượng để phản tư, KHÔNG phải dự báo. Giá trị nằm ở việc nó gợi cho bạn những câu hỏi để hiểu mình hơn, không nằm ở chỗ "đoán đúng tương lai".',
  },
  {
    q: 'Vì sao có người tính Số Đường Đời ra kết quả khác tôi?',
    a: 'Thường là do khác cách tính, không phải ai sai. hieu.asia dùng "cách theo thành phần" (rút gọn riêng ngày, tháng, năm rồi mới cộng — theo Decoz), giúp giữ lại số Master ẩn trong tháng hoặc năm. Nhiều công cụ khác cộng thẳng toàn bộ chữ số ngày sinh một lần. Đa số trường hợp hai cách cho cùng kết quả; chúng chỉ lệch ở vài ca biên có số Master ẩn. Ví dụ người sinh 01/01/1980: cách theo thành phần ra 11, còn cộng thẳng ra 2.',
  },
  {
    q: 'Đổi tên có đổi được con số và vận mệnh không?',
    a: 'Các con số từ tên được tính theo tên trên giấy khai sinh, nên đổi tên gọi không làm "đổi số gốc" của bạn. Có người chọn dùng một tên mới như một thực hành biểu tượng cá nhân, nhưng hieu.asia không quảng cáo đổi tên như cách "cải số, đổi vận". Thần Số Học là lăng kính để hiểu mình, không phải công cụ đổi mệnh — và ở đây không có dịch vụ "giải nghiệp" nào.',
  },
];

const JSONLD = [
  article({
    headline: 'Thần Số Học Pythagoras: nền tảng cho người mới',
    description:
      'Thần Số Học (Numerology) theo trường phái Pythagoras: rút số chủ đạo từ ngày sinh và tên, mỗi số mang một năng lượng riêng.',
    url: '/learn/than-so-hoc',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Thần Số Học', url: '/learn/than-so-hoc' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Thần Số Học Pythagoras: Học huyền học',
    description:
      'Thần Số Học (Numerology) theo trường phái Pythagoras: rút số chủ đạo từ ngày sinh và tên, mỗi số mang một năng lượng riêng.',
    url: '/learn/than-so-hoc',
  }),
];

interface NumberCard {
  num: number;
  slug: string;
  name: string;
  body: string;
}

// Nguyên mẫu + năng lượng lõi + mặt bóng tối + môi trường hợp cho từng số 1–9.
// Bám bảng tra §3.1 tài liệu nguồn than-so-hoc.md; tên nguyên mẫu khớp dữ liệu
// SO_CHU_DAO (than-so-hoc-numbers.ts) để đồng bộ với trang tra cứu /than-so-hoc/y-nghia.
const NUMBERS: readonly NumberCard[] = [
  {
    num: 1,
    slug: 'so-1',
    name: 'Người tiên phong',
    body: 'Năng lượng số 1 là khởi xướng: độc lập, dẫn đầu, thích tự mở đường thay vì đi theo lối có sẵn. Đây là người dám đứng mũi chịu sào. Mặt cần rèn là cái tôi lớn khiến khó hợp tác, hay ôm hết việc vì nghĩ "tự làm nhanh hơn". Hợp môi trường cho phép chủ động và chịu trách nhiệm về kết quả — khởi nghiệp, dẫn dắt một dự án mới từ con số không.',
  },
  {
    num: 2,
    slug: 'so-2',
    name: 'Người hòa giải',
    body: 'Số 2 sống bằng kết nối: thấu cảm, kiên nhẫn, giỏi đọc không khí và làm dịu căng thẳng giữa người với người. Đây là chất keo của một nhóm. Mặt cần rèn là dễ tự xóa mình, ngại nói "không", hay dò ý người khác rồi sống thay cho mong muốn của họ. Hợp những vai cần sự tinh tế trong quan hệ — nhân sự, ngoại giao, điều phối, tư vấn.',
  },
  {
    num: 3,
    slug: 'so-3',
    name: 'Người biểu đạt',
    body: 'Số 3 là năng lượng sáng tạo và giao tiếp: lạc quan, có duyên ngôn ngữ, biết làm không khí nhẹ đi. Đây là người kể chuyện. Mặt cần rèn là dễ tản mạn, bắt đầu nhiều thứ rồi bỏ dở, đôi khi nghiện được vỗ tay và né những nỗi buồn thật. Hợp nơi cần biểu đạt và ý tưởng — nội dung, truyền thông, giảng dạy, nghệ thuật.',
  },
  {
    num: 4,
    slug: 'so-4',
    name: 'Người xây nền',
    body: 'Số 4 xây bằng kỷ luật: có hệ thống, đáng tin, làm tới nơi tới chốn, là người bạn giao việc khó mà yên tâm. Mặt cần rèn là dễ cứng nhắc kiểu "xưa nay vẫn thế", cầu toàn quá mức và ngại thay đổi. Hợp những việc cần độ chính xác và bền bỉ — vận hành, tài chính, kỹ thuật, kiểm thử chất lượng.',
  },
  {
    num: 5,
    slug: 'so-5',
    name: 'Người tự do',
    body: 'Số 5 cần không gian để xoay: thích nghi nhanh, ưa phiêu lưu, đa năng, chán lối mòn. Đây là người mang gió mới vào phòng. Mặt cần rèn là dễ phóng túng, sợ cam kết, và đôi khi nhầm tự do với chạy trốn khỏi điều khó. Hợp môi trường biến động và nhiều tiếp xúc — kinh doanh, marketing, du lịch, các nghề tự do.',
  },
  {
    num: 6,
    slug: 'so-6',
    name: 'Người chăm sóc',
    body: 'Số 6 sống vì trách nhiệm: vun vén, che chở, có mặt cho người thuộc về mình, thường là chỗ dựa của gia đình. Mặt cần rèn là hay quên chăm chính mình, thương mà hóa kiểm soát, và âm thầm "ghi sổ hy sinh" rồi trách móc. Hợp những nghề nuôi dưỡng con người — giáo dục, y tế, nhân sự, dịch vụ.',
  },
  {
    num: 7,
    slug: 'so-7',
    name: 'Người tìm chân lý',
    body: 'Số 7 đi tìm chiều sâu: trực giác mạnh, thích nghiên cứu, cần thời gian một mình để tiêu hóa mọi thứ. Đây là người đặt câu hỏi "thật ra là gì". Mặt cần rèn là dễ cô lập như pháo đài, hoài nghi cả những điều ấm áp có thật. Hợp việc cho phép đào sâu và tĩnh lặng — nghiên cứu, phân tích, kỹ thuật chuyên sâu, học thuật.',
  },
  {
    num: 8,
    slug: 'so-8',
    name: 'Người kiến tạo quyền lực',
    body: 'Số 8 hướng tới tầm vóc: tham vọng, nhạy với tiền bạc và quyền lực, giỏi điều hành và biến nguồn lực thành kết quả. Mặt cần rèn là dễ đánh đồng tiền với giá trị con người và không biết điểm "đủ". Hợp nơi cần cầm trịch và chịu áp lực lớn — kinh doanh, tài chính, quản lý cấp cao, bất động sản.',
  },
  {
    num: 9,
    slug: 'so-9',
    name: 'Người nhân đạo',
    body: 'Số 9 mang trắc ẩn rộng: lý tưởng, muốn cống hiến cho điều lớn hơn bản thân, dễ đồng cảm với nỗi đau của cả người xa lạ. Mặt cần rèn là khó buông cái đã hết vai, cho mãi mà quên nhận lại, và hay lý tưởng hóa người khác. Hợp những việc phụng sự cộng đồng — giáo dục, y tế cộng đồng, phi lợi nhuận, nghệ thuật.',
  },
];

interface GlossaryItem {
  term: string;
  en?: string;
  def: string;
}

// Sổ tay thuật ngữ — mọi định nghĩa bám tài liệu nguồn than-so-hoc.md (§0–§10).
const GLOSSARY: readonly GlossaryItem[] = [
  {
    term: 'Số Đường Đời',
    en: 'Life Path / Số Chủ Đạo',
    def: 'Con số trung tâm, rút từ ngày–tháng–năm sinh; mô tả con đường lớn, chủ đề và những bài học lặp lại của đời.',
  },
  {
    term: 'Số Vận Mệnh / Biểu Đạt',
    en: 'Expression / Destiny',
    def: 'Rút từ tất cả chữ cái trong tên đầy đủ khi sinh; năng khiếu trời cho và cách bạn cống hiến ra ngoài.',
  },
  {
    term: 'Số Linh Hồn',
    en: 'Soul Urge / Heart’s Desire',
    def: 'Rút từ các nguyên âm trong tên; khao khát sâu kín, động lực thầm lặng phía sau mọi lựa chọn.',
  },
  {
    term: 'Số Nhân Cách',
    en: 'Personality',
    def: 'Rút từ các phụ âm trong tên; lớp vỏ ngoài, ấn tượng đầu mà người khác cảm nhận trước.',
  },
  {
    term: 'Số Ngày Sinh',
    en: 'Birthday',
    def: 'Lấy riêng ngày trong tháng (1–31); một tài năng bẩm sinh cụ thể tô điểm cho Đường Đời.',
  },
  {
    term: 'Số Master / Số Bậc Thầy',
    en: 'Master Number',
    def: '11, 22, 33 — phiên bản cường độ cao của 2/4/6; giữ nguyên không rút gọn; tiềm năng lớn hơn kèm bài tập khó hơn, không phải "đẳng cấp cao hơn".',
  },
  {
    term: 'Rút gọn',
    en: 'Reduce',
    def: 'Cộng dồn các chữ số của một số cho tới khi còn một chữ số, trừ khi rơi đúng 11/22/33 thì giữ nguyên.',
  },
  {
    term: 'Số Nợ Nghiệp',
    en: 'Karmic Debt',
    def: '13, 14, 16, 19 — bài học còn dang dở cần hoàn thiện bằng nỗ lực có ý thức; theo cách đọc Decoz, không phải điềm xấu.',
  },
  {
    term: 'Bài Học Nghiệp',
    en: 'Karmic Lessons',
    def: 'Các chữ số 1–9 vắng mặt trong tên; phẩm chất bạn chưa quen dùng, cần ý thức rèn.',
  },
  {
    term: 'Số Trưởng Thành',
    en: 'Maturity',
    def: 'Rút gọn của (Đường Đời + Vận Mệnh); con người bạn hội tụ về ở nửa sau cuộc đời.',
  },
  {
    term: 'Năm / Tháng cá nhân',
    en: 'Personal Year / Month',
    def: 'Chu kỳ lặp mô tả "mùa" hiện tại của đời; dùng để định hướng giai đoạn, không phải tiên tri.',
  },
  {
    term: 'Đỉnh Cao',
    en: 'Pinnacle',
    def: 'Bốn giai đoạn lớn của đời, mỗi giai đoạn một con số chủ đề; mốc giai đoạn đầu kết thúc ở tuổi 36 trừ Số Đường Đời.',
  },
  {
    term: 'Thử Thách',
    en: 'Challenge',
    def: 'Bốn "bài kiểm tra" tính bằng hiệu tuyệt đối giữa các thành phần ngày sinh; có thể ra 0, không bao giờ là số Master.',
  },
  {
    term: 'Pythagorean',
    def: 'Hệ phương Tây phổ biến nhất, 26 chữ cái quy về 1–9, có số Master; hieu.asia dùng hệ này.',
  },
  {
    term: 'Chaldean',
    def: 'Hệ cổ gốc Babylon, gán chữ cái 1–8 (số 9 thiêng), bảng số khác hẳn Pythagoras, tính theo tên thường dùng/phát âm; đừng trộn với Pythagorean.',
  },
];

export default function LearnThanSoHocPage() {
  return (
    <LearnArticle
      eyebrow="Tây phương · Pythagoras"
      title={
        <>
          Thần <span className="bg-gold-gradient bg-clip-text text-transparent">Số Học</span>
        </>
      }
      standfirst={
        <>
          Pythagoras tin rằng mọi thứ đều có thể quy về số. Thần Số Học hiện đại rút số chủ
          đạo từ ngày sinh và tên. Mỗi số từ 1 đến 9 mang một nguồn năng lượng riêng.
        </>
      }
      readMeta="6 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Thần Số Học' },
      ]}
      relatedLenses={relatedLearnLenses('than-so-hoc')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Chỉ cần ngày sinh và tên đầy đủ, hệ thống tính ra số chủ đạo, số biểu hiện và số linh hồn, kèm diễn giải năng lượng từng số.',
        href: '/than-so-hoc',
        label: 'Khám phá Thần Số Học',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <ThanSoHocFrame />,
        },
        {
          id: 'su-that-lich-su',
          tocLabel: 'Sự thật lịch sử',
          heading: 'Pythagoras chỉ là cái tên — sự thật lịch sử',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Thần Số Học (numerology) là hệ thống gán ý nghĩa biểu tượng cho các con số rút ra từ
                hai nguồn: <strong>ngày sinh</strong> và <strong>tên đầy đủ khi sinh</strong>. Từ đó nó
                đọc ra khuynh hướng tính cách, động lực và những bài học lặp lại. Hai nguồn này là hai
                trục: trục ngày sinh (cố định, không đổi) cho Số Đường Đời, Số Ngày Sinh, các Đỉnh Cao,
                Thử Thách, Năm và Tháng cá nhân; trục tên (phụ thuộc tên trên giấy khai sinh) cho Số
                Vận Mệnh, Số Linh Hồn, Số Nhân Cách và Bài Học Nghiệp.
              </p>
              <p>
                Cái tên "Pythagoras" ở đây mang tính quy ước, gần như huyền thoại.{' '}
                <strong>Không có bằng chứng lịch sử</strong> nào cho thấy nhà toán học Pythagoras
                (khoảng 570–495 TCN) lập ra bảng chữ cái quy đổi thành số mà ta dùng hôm nay. Hệ thống
                tính toán hiện hành chủ yếu được định hình ở thế kỷ 20, bởi các tác giả như{' '}
                <strong>L. Dow Balliett</strong> (người tiên phong định hình thần số học Pythagoras hiện
                đại ở Mỹ, đầu thế kỷ 20) và <strong>Juno Jordan</strong> (gắn với trường phái
                California), rồi <strong>Hans Decoz</strong> hệ thống hóa lại. hieu.asia bám biến
                thể Decoz: Đường Đời rút gọn theo từng thành phần, bộ Nợ Nghiệp 13/14/16/19, và Bài Học
                Nghiệp là chữ số thiếu trong tên.
              </p>
              <p>
                Đừng nhầm hệ này với <strong>Chaldean numerology</strong> — một hệ cổ hơn, gốc
                Babylon/Trung Đông. Chaldean gán các chữ cái giá trị 1–8 (số 9 được coi là thiêng nên
                hiếm khi gán trực tiếp), bảng số khác hẳn Pythagoras, và thường tính theo tên thường
                dùng hoặc cách phát âm thay vì tên khai sinh. Hai hệ cho ra những con số khác nhau, nên
                không trộn bảng của hệ này với hệ kia.
              </p>
              <p>
                Cũng cần tách bạch: Thần Số Học là hệ <strong>phương Tây hiện đại</strong>, độc lập với
                Bát Tự, Tử Vi hay Kinh Dịch (vốn dựa trên Can–Chi và ngũ hành). Khi hieu.asia đặt nhiều
                bộ môn cạnh nhau, con số thần số không quy đổi qua lại với ngũ hành — chúng là những
                lăng kính riêng.
              </p>
              <p className="text-sm text-muted-foreground">
                Và trung thực một lần nữa: giới khoa học xếp thần số học vào nhóm pseudoscience — không
                có cơ chế nhân quả nào được kiểm chứng. Trang này giữ nó như một lăng kính biểu tượng để
                phản tư, không phải một dự báo.
              </p>
            </div>
          ),
        },
        {
          id: 'chin-so-chu-dao',
          tocLabel: '9 số chủ đạo',
          heading: '9 số chủ đạo',
          children: (
            <>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                Mỗi số từ 1 đến 9 là một dải năng lượng có hai cực: một cực sáng (điểm mạnh) và một cực
                tối (bài học cần rèn). Đọc cả hai, và nhớ bóng tối là việc cần luyện chứ không phải bản
                án. Bấm vào từng số để đọc sâu hơn về khuynh hướng, tình cảm, công việc và câu hỏi tự
                soi.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {NUMBERS.map((n) => (
                  <div
                    key={n.num}
                    className="flex flex-col rounded-lg border border-border bg-card/40 p-4 transition-colors hover:border-gold/40"
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="font-heading text-3xl font-bold text-gold-700">{n.num}</span>
                      <span className="text-sm font-semibold text-foreground">{n.name}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{n.body}</p>
                    <Link
                      href={`/than-so-hoc/y-nghia/${n.slug}`}
                      className="mt-3 inline-block text-xs font-medium text-gold hover:underline"
                    >
                      Đọc sâu số {n.num} →
                    </Link>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Ngoài 1–9 còn có ba số "bậc thầy" giữ nguyên không rút gọn về một chữ số:{' '}
                <Link href="/than-so-hoc/y-nghia/so-11" className="text-gold hover:underline">
                  11
                </Link>
                ,{' '}
                <Link href="/than-so-hoc/y-nghia/so-22" className="text-gold hover:underline">
                  22
                </Link>{' '}
                và{' '}
                <Link href="/than-so-hoc/y-nghia/so-33" className="text-gold hover:underline">
                  33
                </Link>
                . Xem chi tiết ở phần "Số bậc thầy" bên dưới.
              </p>
            </>
          ),
        },
        {
          id: 'hai-cach-tinh',
          tocLabel: 'Hai cách tính Đường Đời',
          heading: 'Hai cách tính Đường Đời — và vì sao chọn cách A',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Số Đường Đời rút từ ngày–tháng–năm sinh và là con số{' '}
                <strong>trung tâm</strong> của một lá số: nếu chỉ đọc một số, hãy đọc số này. Nhưng có
                hai cách tính khác nhau, và hieu.asia chọn có chủ đích.
              </p>

              <div className="rounded-lg border border-border bg-card/40 p-4">
                <h3 className="font-semibold text-foreground">Cách A — theo từng thành phần (hieu.asia dùng)</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Rút gọn <strong>riêng</strong> ngày, tháng, năm (giữ số Master ở mỗi phần nếu có),
                  rồi cộng ba kết quả, rồi rút gọn lần cuối. Ví dụ 14/02/1992: ngày 14 → 1+4 = 5; tháng
                  02 → 2; năm 1992 → 1+9+9+2 = 21 → 3; tổng 5+2+3 = 10 → <strong>1</strong>. Đường Đời là
                  1. Đây là cách của Hans Decoz.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card/40 p-4">
                <h3 className="font-semibold text-foreground">Cách B — cộng thẳng cả chuỗi</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Cộng tất cả chữ số của cả ngày sinh một lần rồi rút gọn. Với đa số ngày sinh, Cách A
                  và Cách B cho <strong>cùng một kết quả</strong>. Chúng chỉ lệch ở vài ca biên — khi có
                  một <strong>số Master ẩn</strong> trong tháng hoặc năm mà cách theo thành phần giữ
                  được còn cộng thẳng làm rơi mất.
                </p>
              </div>

              <div className="rounded-lg border border-gold/25 bg-gold/5 p-4">
                <h3 className="font-semibold text-foreground">Khi nào hai cách cho số khác nhau</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Lấy người sinh <strong>01/01/1980</strong>. Cách A: ngày 1, tháng 1, năm 1980 → 1+9+8+0
                  = 18 → 9; tổng 1+1+9 = 11 → giữ nguyên <strong>số Master 11</strong>. Cách B: cộng
                  thẳng 0+1+0+1+1+9+8+0 = 20 → <strong>2</strong>. Cùng một người, cách A ra 11, cách B
                  ra 2 — số Master chỉ lộ ra ở cách theo thành phần.
                </p>
              </div>

              <p className="text-sm text-muted-foreground">
                hieu.asia chốt <strong>Cách A</strong> vì nó bảo toàn số Master ẩn; nhiều nguồn cũng coi
                đây là cách chuẩn. Nếu bạn tự tính bằng công cụ khác ra số khác, nhiều khả năng đó là
                khác trường phái (Cách B), không phải ai sai.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <ThanSoHocDepth />,
        },
        {
          id: 'giai-thich',
          tocLabel: 'Bốn điểm hay hỏi',
          heading: 'Bốn điểm hay gây bối rối',
          children: (
            <Accordion type="single" collapsible className="space-y-2">
              <AccordionItem value="vowel-y" className="rounded border border-border px-4">
                <AccordionTrigger>Chữ Y là nguyên âm hay phụ âm?</AccordionTrigger>
                <AccordionContent>
                  Nguyên âm cứng là A, E, I, O, U; còn lại là phụ âm. Riêng chữ Y (và đôi khi W) nằm ở
                  ranh giới: trong canon, Y được tính là nguyên âm khi đóng vai âm nguyên âm (như trong
                  "Lynn", "Yvonne") và là phụ âm khi phát âm như phụ âm (như "Yes"); quy tắc kinh điển
                  là Y làm nguyên âm khi nằm giữa hai phụ âm hoặc khi âm tiết không có nguyên âm nào
                  khác. Vì Số Linh Hồn lấy nguyên âm còn Số Nhân Cách lấy phụ âm, cách xếp Y ảnh hưởng
                  trực tiếp tới cả hai. hieu.asia đơn giản hóa: luôn xếp Y là nguyên âm và không xử lý
                  riêng W. Đây là một quy ước, nên trang không nói mình "tính theo phát âm chuẩn" — chỉ
                  nói "theo quy ước Y là nguyên âm".
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="master-why" className="rounded border border-border px-4">
                <AccordionTrigger>Vì sao 11, 22, 33 không rút gọn?</AccordionTrigger>
                <AccordionContent>
                  Khi tổng rút gọn rơi đúng vào 11, 22 hoặc 33 thì giữ nguyên, không rút tiếp về 2, 4,
                  6. Lý do: các con số này được xem là phiên bản cường độ cao của số gốc (11 của 2, 22
                  của 4, 33 của 6) — tiềm năng lớn hơn nhưng cũng là bài tập khó hơn, không phải "đẳng
                  cấp cao hơn". Có trường phái chỉ công nhận 11 và 22, coi 33 là hiếm và đòi điều kiện
                  chặt; cách đọc Decoz mà hieu.asia dùng công nhận cả ba. Một số tác giả còn mở rộng tới
                  44, 55 — đây là biến thể hiếm, hieu.asia không dùng.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="zero" className="rounded border border-border px-4">
                <AccordionTrigger>Số 0 trong ngày sinh có ý nghĩa gì?</AccordionTrigger>
                <AccordionContent>
                  Bảng Pythagoras chỉ chạy từ 1 đến 9, không có số 0. Khi cộng các chữ số của ngày sinh,
                  số 0 không thêm gì vào tổng (ví dụ 15/08/1990 = 1+5+0+8+1+9+9+0, các số 0 không làm
                  đổi kết quả). Vì vậy không có "Số Đường Đời 0": mọi con số cuối cùng đều rơi vào 1–9
                  hoặc số Master 11/22/33. Số 0 chỉ là một chữ số trong ngày, không phải một con số chủ
                  đạo riêng.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="birth-name" className="rounded border border-border px-4">
                <AccordionTrigger>Dùng tên khai sinh hay tên thường gọi?</AccordionTrigger>
                <AccordionContent>
                  Các con số từ tên (Vận Mệnh, Linh Hồn, Nhân Cách, Bài Học Nghiệp) phải tính theo tên
                  đầy đủ trên giấy khai sinh, không phải nghệ danh hay tên gọi thường — đây là điểm hay
                  bị làm sai. Với người đã đổi tên hoặc dùng tên khác, một số trường phái tính thêm một
                  "Số Biểu Đạt phụ" từ tên thường dùng; hieu.asia hiện chỉ tính theo tên bạn nhập vào,
                  nên hãy nhập đúng tên khai sinh. Có người chọn một tên mới như một thực hành biểu
                  tượng cá nhân, nhưng đó không phải cách "đổi số mệnh".
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ),
        },
        {
          id: 'bon-loai-so',
          tocLabel: 'Bốn con số lõi',
          heading: 'Bốn con số lõi vẽ nên chân dung con người',
          children: (
            <div className="space-y-6 text-foreground/85 leading-relaxed">
              <p>
                Ngoài Số Đường Đời (Số Chủ Đạo rút từ ngày sinh), một lá số thần số còn có{' '}
                <strong>bốn con số cốt lõi</strong> rút từ tên đầy đủ và ngày sinh. Cách dùng hay
                nhất là <strong>đọc cộng hưởng</strong>: khi các số cùng hướng thì năng lượng nhất
                quán; khi lệch nhau thì có một "sức kéo nội tâm" rất đáng để soi.
              </p>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Số Vận Mệnh / Biểu Đạt (Expression)
                </h3>
                <p>
                  Tính từ <strong>tất cả</strong> chữ cái trong tên đầy đủ khi sinh. Đây là{' '}
                  <strong>bộ công cụ trời cho</strong> của bạn — tài năng, thiên hướng nghề, cách
                  bạn cống hiến ra ngoài. Nếu Đường Đời là "con đường đi" thì Vận Mệnh là "hành lý
                  mang theo". Cần dùng đúng <strong>tên trên giấy khai sinh</strong>, không phải
                  nghệ danh hay tên gọi thường — đây là điểm hay bị làm sai.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Số Linh Hồn (Soul Urge / Heart's Desire)
                </h3>
                <p>
                  Chỉ lấy <strong>nguyên âm</strong> trong tên đầy đủ. Đây là con số{' '}
                  <strong>bí mật nhất</strong> — điều bạn thật sự khao khát, thứ khiến bạn thấy
                  trọn vẹn hay trống rỗng dù bề ngoài đủ đầy. Nguyên âm được ví như "âm thanh bên
                  trong" của tên, tượng trưng cho nội tâm.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Số Nhân Cách (Personality)
                </h3>
                <p>
                  Chỉ lấy <strong>phụ âm</strong> trong tên. Đây là "lớp vỏ ngoài" bạn trình ra
                  với thế giới — ấn tượng đầu tiên, năng lượng người khác cảm nhận trước. Khoảng
                  cách giữa <strong>Nhân Cách (phụ âm)</strong> và{' '}
                  <strong>Linh Hồn (nguyên âm)</strong> chính là khoảng cách giữa "người ta thấy
                  bạn thế nào" và "bạn thật sự là gì" — một góc soi rất đắt giá. (Mẹo hiểu: nguyên âm
                  cộng phụ âm chính là toàn bộ chữ — nên TRƯỚC khi rút gọn, tổng của Linh Hồn và
                  Nhân Cách bằng đúng tổng của Vận Mệnh. Còn ba con số hiển thị đã được rút gọn
                  riêng về một chữ số, nên cộng trực tiếp thường không bằng nhau.)
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Số Ngày Sinh (Birthday)
                </h3>
                <p>
                  Lấy riêng <strong>ngày trong tháng</strong> (1–31). Đây là một{' '}
                  <strong>món quà/tài năng cụ thể</strong> tô điểm thêm cho Đường Đời — con số
                  "phụ" nhưng cụ thể, dễ nhận ra trong đời thường.
                </p>
              </div>

              <p className="text-sm text-muted-foreground">
                Một điểm cần minh bạch: chữ <strong>Y</strong> nằm ở ranh giới nguyên âm/phụ âm và
                là điểm có trường phái khác nhau. hieu.asia theo quy ước xếp Y là nguyên âm; nếu
                bạn tính bằng công cụ khác (xử lý Y theo phát âm) có thể ra số hơi khác — đó là
                khác trường phái, không phải sai.
              </p>
            </div>
          ),
        },
        {
          id: 'master-no-nghiep',
          tocLabel: 'Số bậc thầy & Nợ Nghiệp',
          heading: 'Số bậc thầy & Số Nợ Nghiệp',
          children: (
            <div className="space-y-6 text-foreground/85 leading-relaxed">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Số bậc thầy 11 · 22 · 33
                </h3>
                <p>
                  Khi một tổng rút gọn rơi đúng vào 11, 22 hoặc 33, ta{' '}
                  <strong>giữ nguyên</strong>, không rút tiếp về 2/4/6. Mỗi master là{' '}
                  <strong>phiên bản cường độ cao</strong> của số gốc:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <strong>11 (gốc 2) — Người truyền cảm hứng:</strong> trực giác phi thường,
                    nhạy cảm cao. Áp lực: dễ lo âu, quá tải cảm xúc, sống trong tầm nhìn mà quên
                    xây từng bậc thang → cần "nối đất" (ngủ đủ, vận động, thói quen đều đặn).
                  </li>
                  <li>
                    <strong>22 (gốc 4) — Người kiến tạo bậc thầy:</strong> biến mơ lớn thành công
                    trình thực, có cả tầm nhìn lẫn đôi tay thực thi. Áp lực: tê liệt vì "phải làm
                    điều lớn" → chia giấc mơ thành từng viên gạch hôm nay.
                  </li>
                  <li>
                    <strong>33 (gốc 6) — Người thầy phụng sự:</strong> chữa lành, nâng đỡ, dạy
                    bằng cách sống. Áp lực: kiệt sức vì người khác, dễ rơi vào cứu-thế chủ nghĩa →
                    học nói không, học nhận lại.
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  Cần giữ đúng tinh thần: master = <strong>tiềm năng cao + bài tập khó</strong>,
                  KHÔNG phải nhãn "bạn đặc biệt hơn người". Người mang master thường dao động giữa
                  dạng gốc (2/4/6) và dạng master, và chỉ kích hoạt cường độ master ở giai đoạn
                  trưởng thành. Có trường phái chỉ công nhận 11 và 22 và đòi điều kiện chặt cho 33;
                  hieu.asia theo cách đọc Decoz nên công nhận cả ba.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Số Nợ Nghiệp 13 · 14 · 16 · 19
                </h3>
                <p>
                  Theo cách đọc Decoz, bốn con số này là{' '}
                  <strong>bài học còn dang dở cần hoàn thiện ở đời này</strong> bằng nỗ lực có ý
                  thức — <strong>không phải điềm xấu hay bản án</strong>. Chúng xuất hiện khi một
                  con số lõi đi qua đúng 13/14/16/19 ở tổng trung gian trước khi rút gọn về một
                  chữ số.
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <strong>13 → 4 (Lao động):</strong> từng tìm đường tắt, né việc khó. Hướng
                    trưởng thành: kỷ luật, bền bỉ, chia mục tiêu thành bước nhỏ và làm tới nơi.
                  </li>
                  <li>
                    <strong>14 → 5 (Điều độ):</strong> từng lạm dụng tự do, sa đà giác quan, thiếu
                    cam kết. Hướng trưởng thành: tự do đi cùng trách nhiệm, giữ kỷ luật giữa biến
                    động.
                  </li>
                  <li>
                    <strong>16 → 7 (Khiêm nhường):</strong> từng đặt cái tôi lên trên tình yêu
                    thật; đời có những lần "sụp đổ" cái tôi. Hướng trưởng thành: dựng lại trên nền
                    khiêm nhường và chiều sâu.
                  </li>
                  <li>
                    <strong>19 → 1 (Tự lực không vị kỷ):</strong> từng lạm dụng quyền lực/độc lập,
                    hoặc ngược lại quá phụ thuộc. Hướng trưởng thành: đứng vững một mình nhưng rộng
                    mở giúp người và để người giúp lại.
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  Khái niệm "kiếp trước" ở đây là một <strong>ẩn dụ biểu tượng</strong> trong hệ
                  Decoz, không phải khẳng định siêu hình. Không phải trường phái nào cũng dùng bộ
                  Nợ Nghiệp này — một số hệ bỏ qua hoàn toàn. hieu.asia trình bày theo cách đọc
                  Decoz, luôn đóng khung là "việc cần rèn" kèm lối đi tới, và không bao giờ hù dọa
                  hay bán dịch vụ "giải nghiệp". Còn <strong>Bài Học Nghiệp</strong> — đến từ chữ số
                  thiếu trong tên, khác hẳn Nợ Nghiệp — được nói riêng ở phần ngay dưới đây.
                </p>
              </div>
            </div>
          ),
        },
        {
          id: 'bai-hoc-nghiep',
          tocLabel: 'Bài Học Nghiệp',
          heading: 'Bài Học Nghiệp — chữ số thiếu trong tên',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Quy đổi cả tên đầy đủ sang số theo bảng Pythagoras, rồi nhìn xem chữ số nào từ 1 đến 9{' '}
                <strong>không xuất hiện lần nào</strong>. Những chữ số vắng mặt đó là{' '}
                <strong>Bài Học Nghiệp</strong>. Khác với Nợ Nghiệp (đến từ một con số có mặt), đây đến
                từ con số <strong>vắng mặt</strong> — mỗi số thiếu là một phẩm chất bạn chưa quen vận
                dụng, cần ý thức rèn. Đây là một cơ hội phát triển, không phải khiếm khuyết cố định.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="py-2 pr-3 font-semibold">Thiếu số</th>
                      <th className="py-2 font-semibold">Phẩm chất cần rèn</th>
                    </tr>
                  </thead>
                  <tbody className="text-foreground/85">
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-3 font-heading font-bold text-gold-700">1</td>
                      <td className="py-2">Tự khẳng định, độc lập, dám quyết và khởi xướng.</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-3 font-heading font-bold text-gold-700">2</td>
                      <td className="py-2">Hợp tác, kiên nhẫn, tế nhị, lắng nghe, đi chậm để cùng nhau.</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-3 font-heading font-bold text-gold-700">3</td>
                      <td className="py-2">Biểu đạt, tự tin sáng tạo, nói ra cảm xúc, cho phép mình vui.</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-3 font-heading font-bold text-gold-700">4</td>
                      <td className="py-2">Kỷ luật, trật tự, làm đều đặn tới cùng, xây nền móng.</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-3 font-heading font-bold text-gold-700">5</td>
                      <td className="py-2">Thích nghi, đón thay đổi, tự do có trách nhiệm.</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-3 font-heading font-bold text-gold-700">6</td>
                      <td className="py-2">Nhận trách nhiệm, chăm sóc, cam kết với người thuộc về mình.</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-3 font-heading font-bold text-gold-700">7</td>
                      <td className="py-2">Đi vào chiều sâu, tĩnh lặng, tin tưởng nội tâm.</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-3 font-heading font-bold text-gold-700">8</td>
                      <td className="py-2">Quản lý vật chất/quyền lực, tự tin tài chính, nhận vai lãnh đạo.</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 font-heading font-bold text-gold-700">9</td>
                      <td className="py-2">Buông bỏ, từ bi, nhìn toàn cảnh vượt lợi ích cá nhân.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-muted-foreground">
                Một lưu ý văn hóa Việt: vì tên Việt bỏ dấu về chữ La-tinh và thường ngắn (3–4 âm tiết),
                nhiều chữ số dễ vắng mặt, nên có thể ra nhiều Bài Học Nghiệp hơn tên phương Tây dài. Hãy
                đọc nhẹ nhàng như "vùng cần để ý", đừng để thấy mình "thiếu nhiều thứ". Đây cũng là một
                giới hạn của việc áp bảng La-tinh lên tên Việt.
              </p>
            </div>
          ),
        },
        {
          id: 'chu-ky-thoi-gian',
          tocLabel: 'Chu kỳ thời gian',
          heading: 'Các chu kỳ thời gian trong một lá số',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Ngoài phần lõi (Đường Đời và bốn con số lõi), thần số học còn có mấy lớp mô tả{' '}
                <strong>thời gian và giai đoạn</strong>. Đây là lớp làm sâu, không phải lõi — nêu ở mức
                khái niệm để bạn biết chúng là gì.
              </p>

              <div className="space-y-3">
                <div className="rounded-lg border border-border bg-card/40 p-4">
                  <h3 className="font-semibold text-foreground">Năm cá nhân / Tháng cá nhân</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Chu kỳ lặp lại mô tả "mùa" hiện tại của đời. Năm cá nhân tính gần đúng bằng rút gọn
                    của (ngày + tháng sinh + năm hiện tại); Tháng cá nhân bằng rút gọn của (năm cá nhân +
                    tháng hiện tại). Dùng để gợi ý năm nay hợp khởi đầu, thu hoạch hay buông bỏ — không
                    biến thành lời tiên tri về năm.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card/40 p-4">
                  <h3 className="font-semibold text-foreground">4 Đỉnh Cao (Pinnacles)</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Bốn giai đoạn lớn của đời, mỗi giai đoạn mang một con số chủ đề. Mốc kết thúc giai
                    đoạn đầu tiên rơi vào tuổi 36 trừ đi Số Đường Đời, các giai đoạn sau nối tiếp theo
                    từng quãng.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card/40 p-4">
                  <h3 className="font-semibold text-foreground">4 Thử Thách (Challenges)</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Tính bằng hiệu tuyệt đối giữa các thành phần ngày sinh, nên có thể ra số 0 (điều
                    bình thường, mang nghĩa riêng) và không bao giờ có số Master. Là những "bài kiểm tra"
                    lặp lại mà ta gặp đi gặp lại.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card/40 p-4">
                  <h3 className="font-semibold text-foreground">Số Trưởng Thành (Maturity)</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Rút gọn của (Đường Đời + Vận Mệnh), giữ số Master. Chủ đề "con người bạn hội tụ về" ở
                    nửa sau cuộc đời, thường nói tới sau tuổi 30–35.
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Công cụ Thần Số Học trên hieu.asia có tính và hiển thị cả bốn lớp này cùng bản đọc,
                nhưng nguyên tắc là <strong>luôn bám lõi trước</strong> — Đường Đời và bốn con số lõi —
                rồi mới dùng lớp thời gian để tô màu giai đoạn, không để nó thành "lời tiên tri năm nay".
              </p>
            </div>
          ),
        },
        {
          id: 'thu-tu-luan',
          tocLabel: 'Thứ tự luận 7 bước',
          heading: 'Thứ tự luận một lá số — để không rơi vào Barnum',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Một lá số thần số dễ rơi vào bẫy Barnum — những câu đúng với gần như mọi người ("bạn vừa
                mạnh mẽ vừa nhạy cảm"). Cách chống là đọc <strong>có thứ tự</strong> và luôn buộc mỗi
                nhận định vào một con số cụ thể đã tính.
              </p>
              <ol className="list-decimal space-y-2 pl-6">
                <li>
                  <strong>Số Đường Đời</strong> — khung chủ đề lớn, đọc trước để đặt bối cảnh.
                </li>
                <li>
                  <strong>Số Vận Mệnh</strong> — tài năng mang theo; đối chiếu cùng hay khác hướng với
                  Đường Đời để thấy "sức cộng hưởng" hoặc "sức kéo".
                </li>
                <li>
                  <strong>Linh Hồn so với Nhân Cách</strong> — nội tâm so với vẻ ngoài; khoảng cách giữa
                  hai số là chất liệu luận đắt giá nhất (người ta thấy bạn thế nào khác với bạn thật sự
                  muốn gì).
                </li>
                <li>
                  <strong>Số Ngày Sinh</strong> — một tài năng cụ thể tô điểm thêm.
                </li>
                <li>
                  <strong>Số Master (nếu có)</strong> — nêu tiềm năng kèm áp lực, không tâng bốc.
                </li>
                <li>
                  <strong>Nợ Nghiệp / Bài Học Nghiệp (nếu có)</strong> — đóng khung là việc cần rèn,
                  luôn kèm cách đi tới.
                </li>
                <li>
                  <strong>Lớp thời gian (Năm cá nhân, Đỉnh Cao)</strong> — chỉ thêm khi muốn chiều sâu
                  giai đoạn.
                </li>
              </ol>
              <p className="text-sm text-muted-foreground">
                Quy tắc chống bịa: mọi câu phải dẫn về một con số thật ("vì Đường Đời của bạn là 4
                nên…"), không phán câu đúng với mọi người. Khi hai con số mâu thuẫn, hãy mô tả chính sự
                căng thẳng đó như điều đáng soi, đừng ép nó thành một kết luận trơn tru.
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
                <div key={g.term} className="rounded-lg border border-border bg-card/40 p-3">
                  <dt className="text-sm font-semibold text-foreground">
                    {g.term}
                    {g.en ? <span className="font-normal text-muted-foreground"> · {g.en}</span> : null}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{g.def}</dd>
                </div>
              ))}
            </dl>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <ThanSoHocWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <ThanSoHocRecall />,
        },
        {
          id: 'faq',
          tocLabel: 'Câu hỏi thường gặp',
          heading: 'Câu hỏi thường gặp',
          children: (
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
          ),
        },
        {
          id: 'ban-da-hieu-chua',
          tocLabel: 'Bạn đã hiểu chưa?',
          heading: 'Bạn đã thật sự hiểu chưa?',
          children: <ThanSoHocChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
