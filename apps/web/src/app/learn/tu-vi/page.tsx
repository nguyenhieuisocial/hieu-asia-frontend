import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { InfographicTuVi } from '@/components/learn/InfographicTuVi';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { relatedLearnLenses } from '@/lib/learn/related';
import { PALACE_READINGS } from '@/lib/palace-readings';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, course, faqPage, itemList } from '@/lib/seo/jsonld';
import {
  TuViFrame,
  TuViDepth,
  TuViRecall,
  TuViChecklist,
  TuViWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Tử Vi 12 cung, Học huyền học',
  description:
    'Bách khoa Tử Vi Đẩu Số: 12 cung, 14 chính tinh, độ sáng miếu hãm, Tứ Hóa, Cục, Tuần Triệt, cách cục, đại vận lưu niên, kèm quy trình luận 6 bước và sổ tay thuật ngữ.',
  alternates: { canonical: 'https://hieu.asia/learn/tu-vi' },
};

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (native <details>) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS = [
  {
    q: 'Tử Vi đến từ đâu?',
    a: 'Tử Vi Đẩu Số khởi nguồn từ Trung Hoa thời Tống (thế kỷ 10), tương truyền do Trần Đoàn (Hi Di tiên sinh) hệ thống hóa. Nguyên lý chính: vị trí các sao quanh sao Tử Vi (Polaris) tại thời khắc sinh phản ánh cấu trúc số mệnh.',
  },
  {
    q: 'Cung là gì?',
    a: 'Cung là một trong 12 ô trên lá số, ứng với một khu vực của đời sống. Ví dụ cung Tài Bạch phản ánh dòng tiền, cung Phu Thê phản ánh hôn nhân. Sao đóng trong cung nào sẽ ảnh hưởng đến khu vực đó.',
  },
  {
    q: 'Có bao nhiêu sao?',
    a: 'Hệ thống tiêu chuẩn dùng 14 chính tinh (Tử Vi, Thiên Phủ, Vũ Khúc, Liêm Trinh...) cộng các phụ tinh, tổng cộng hơn 100 sao. hieu.asia dùng engine dựa trên Iztro (thư viện an sao mã nguồn mở), bọc trong lớp kiểm-định riêng, để tính đầy đủ chính tinh và phụ tinh.',
  },
  {
    q: 'Đọc lá số để làm gì?',
    a: 'Không phải để biết tương lai cố định. Mà để nhận diện thiên hướng, điểm mạnh, điểm dễ vấp, từ đó có quyết định phù hợp hơn. Lá số là bản đồ, không phải kịch bản.',
  },
  {
    q: 'Giới hạn của Tử Vi?',
    a: 'Tử Vi không dự đoán được trúng số, không thay thế lời khuyên y tế/pháp lý/tài chính. Đây là công cụ tự nhận thức, dùng kết hợp với suy nghĩ tỉnh táo và hành động thực tế.',
  },
  {
    q: 'Tam phương tứ chính là gì, tại sao không đọc một cung lẻ?',
    a: 'Một cung không bao giờ luận đơn lẻ. Theo truyền thống, mỗi cung phải gộp cùng ba cung liên quan: cung xung chiếu (đối diện) và hai cung tam hợp. Ví dụ, muốn xét sự nghiệp thì đọc cả bộ Mệnh, Quan Lộc, Tài Bạch và Thiên Di. Đây là xương sống của mọi phép luận, giúp tránh kết luận vội từ một sao đứng riêng.',
  },
  {
    q: 'Tứ Hóa là gì?',
    a: 'Tứ Hóa gồm Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ — bốn "biến hóa" gắn vào bốn sao tùy theo Thiên Can của năm sinh (và của đại vận/lưu niên cho Tứ Hóa lưu). Đây là phần làm hai lá số trông giống nhau trên giấy lại luận khác nhau, và làm mỗi năm có một chủ đề riêng. Có dị biệt nhỏ giữa các phái về bảng Tứ Hóa của vài Thiên Can, nên đây là tham khảo, không phải cách duy nhất đúng.',
  },
  {
    q: 'Hóa Kỵ tại cung Mệnh có phải đời mạt vận không?',
    a: 'Không. Hóa Kỵ không phải điềm gở; đời lá số nào cũng có một Hóa Kỵ. Nó chỉ đánh dấu "đề tài bạn để tâm quá mức" — nơi dễ tự làm khó mình, và cũng là động cơ trưởng thành nếu nhận biết. Luận đúng là xem Hóa Kỵ rơi vào lĩnh vực nào để có hành động chủ động, chứ không hù dọa.',
  },
  {
    q: 'Bắc Đẩu tinh, Nam Đẩu tinh là gì?',
    a: 'Đó là cách phân hệ 14 chính tinh theo tinh đẩu: Bắc Đẩu gồm Tử Vi, Tham Lang, Vũ Khúc, Cự Môn, Liêm Trinh, Phá Quân; Nam Đẩu gồm Thiên Phủ, Thiên Cơ, Thiên Tướng, Thiên Lương, Thiên Đồng, Thất Sát; riêng Thái Dương và Thái Âm thuộc Trung Thiên. Trục này độc lập với trục an sao (tinh hệ Tử Vi, tinh hệ Thiên Phủ), nên câu "tinh hệ Tử Vi là Bắc Đẩu, tinh hệ Thiên Phủ là Nam Đẩu" hay gặp trên mạng là lỗi gộp nhầm hai trục.',
  },
  {
    q: 'Cục ảnh hưởng gì trên lá số?',
    a: 'Cục (Thủy Nhị, Mộc Tam, Kim Tứ, Thổ Ngũ, Hỏa Lục) có hai công dụng kỹ thuật: cùng ngày sinh âm lịch, nó định vị trí khởi sao Tử Vi khi an lá số; và con số của Cục là tuổi bắt đầu đại vận đầu tiên (Thủy Nhị khoảng 2 tuổi, Hỏa Lục khoảng 6 tuổi). Cách tính Cục và cách phối Cục với Mệnh còn khác nhau giữa các trường phái, nên Cục chủ yếu dùng để hiểu nhịp khởi vận sớm hay muộn, không dùng để phán mệnh tốt xấu.',
  },
  {
    q: 'Tuần, Triệt là gì?',
    a: 'Tuần Không và Triệt Lộ là hai sao "không vong" án ngữ một cung: việc trong cung đó thường đến muộn hoặc phải đi đường vòng, bù lại cái xấu trong cung cũng được "trống" bớt — hợp kiểu người nở muộn. Đây là nét rất Việt: thư viện an sao gốc Hoa mà hieu.asia dùng không xuất hai sao này, engine tự tính bổ sung theo quy tắc cố định (Tuần theo can chi năm sinh, Triệt theo Can năm sinh).',
  },
];

// Sổ tay thuật ngữ — hiển thị ở mục "Sổ tay thuật ngữ", mỗi mục 1-2 câu.
const GLOSSARY: { term: string; def: string }[] = [
  {
    term: 'Chính tinh',
    def: '14 sao chính quyết định "khuôn" của mỗi cung, ví dụ Tử Vi, Thiên Phủ, Thất Sát. Luôn xét trước, phụ tinh xét sau.',
  },
  {
    term: 'Phụ tinh',
    def: 'Các sao bổ trợ tô màu cho chính tinh: cát tinh nâng đỡ (Tả Phụ, Hữu Bật, Văn Xương, Văn Khúc, Thiên Khôi, Thiên Việt), sát tinh tạo áp lực.',
  },
  {
    term: 'Sát tinh',
    def: 'Nhóm sao áp lực như Kình Dương, Đà La, Hỏa Tinh, Linh Tinh, Địa Không, Địa Kiếp. Là tín hiệu cần chú ý, không phải điềm gở.',
  },
  {
    term: 'Tam phương tứ chính',
    def: 'Bộ bốn cung luôn đọc cùng nhau: chính cung, cung xung chiếu và hai cung tam hợp. Xương sống của mọi phép luận.',
  },
  {
    term: 'Xung chiếu',
    def: 'Cung đối diện trên lá số, luôn "chiếu" sang cung chính; sao tốt xấu bên đó đều ảnh hưởng cung đang xét.',
  },
  {
    term: 'Vô chính diệu',
    def: 'Cung không có chính tinh nào đóng. Không phải điềm xấu; luận bằng cách mượn sao cung đối diện rồi xét thêm phụ tinh.',
  },
  {
    term: 'Miếu',
    def: 'Bậc sáng nhất trong bảy bậc độ sáng: sao phát huy đầy đủ, mặt tốt nổi rõ.',
  },
  {
    term: 'Hãm',
    def: 'Bậc tối nhất trong bảy bậc (chữ Hán 陷, một số sách Việt ghi "Hạn"): sao yếu, mặt khó dễ trồi lên. Không phải án xấu; gặp cát tinh phụ trợ vẫn dùng được.',
  },
  {
    term: 'Tứ Hóa',
    def: 'Bốn biến hóa Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ, gắn vào bốn sao tùy Thiên Can của năm sinh; đại vận và lưu niên có bộ Tứ Hóa lưu riêng.',
  },
  {
    term: 'Hóa Kỵ',
    def: 'Một trong Tứ Hóa: nút thắt, đề tài dễ để tâm quá mức. Lá số nào cũng có một Hóa Kỵ, nên nó không phải dấu hiệu mạt vận.',
  },
  {
    term: 'Cục',
    def: 'Ngũ hành cục của lá số: Thủy Nhị (2), Mộc Tam (3), Kim Tứ (4), Thổ Ngũ (5), Hỏa Lục (6). Số của Cục là tuổi khởi đại vận đầu tiên.',
  },
  {
    term: 'Cung Thân',
    def: 'Không phải cung thứ 13; nó ghép chồng lên một trong sáu cung. Mệnh là khí chất bẩm sinh, Thân là hậu vận, nơi đời sống kéo ta dồn sức.',
  },
  {
    term: 'Đại vận',
    def: 'Chu kỳ 10 năm đi lần lượt qua các cung; mỗi đại vận có Can-Chi riêng nên có bộ Tứ Hóa riêng áp lên lá số gốc.',
  },
  {
    term: 'Lưu niên',
    def: 'Vận của một năm cụ thể: Can-Chi của năm đặt lên cung trùng chi của năm, kéo theo Tứ Hóa lưu niên và các sao lưu.',
  },
  {
    term: 'Tiểu hạn',
    def: 'Vận theo từng năm tuổi, an theo quy tắc riêng dựa trên chi năm sinh và giới tính. Các trường phái coi trọng tiểu hạn ở mức khác nhau.',
  },
  {
    term: 'Tuần (Tuần Không)',
    def: 'Sao "không vong" an theo can chi năm sinh, án ngữ cung: việc đến muộn, đi đường vòng, bù lại cái xấu trong cung cũng nhẹ bớt.',
  },
  {
    term: 'Triệt (Triệt Lộ)',
    def: 'Sao "không vong" tính theo Can năm sinh, án ngữ tương tự Tuần. Cùng với Tuần, đây là nét đặc trưng của dòng Tử Vi Việt.',
  },
  {
    term: 'Cách cục',
    def: 'Tổ hợp sao đặc trưng được cổ thư đặt tên, như Quân Thần Khánh Hội hay Hỏa Tham; cho biết "thế cờ" nổi bật của lá số.',
  },
  {
    term: 'Bắc Đẩu · Nam Đẩu · Trung Thiên',
    def: 'Cách phân hệ 14 chính tinh theo tinh đẩu. Trục này độc lập với trục an sao, đừng gộp hai trục làm một.',
  },
  {
    term: 'Tinh hệ Tử Vi / Thiên Phủ',
    def: 'Hai chuỗi an sao của 14 chính tinh: chuỗi Tử Vi an theo Cục và ngày sinh âm lịch, chuỗi Thiên Phủ an đối xứng theo chuỗi Tử Vi.',
  },
];

const JSONLD = [
  article({
    headline: 'Tử Vi 12 cung: nền tảng cho người mới',
    description:
      'Bách khoa Tử Vi Đẩu Số: 12 cung, 14 chính tinh, độ sáng, Tứ Hóa, Cục, Tuần Triệt, cách cục và quy trình luận 6 bước.',
    url: '/learn/tu-vi',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Tử Vi 12 cung', url: '/learn/tu-vi' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Tử Vi 12 cung, Học huyền học',
    description:
      'Bách khoa Tử Vi Đẩu Số: 12 cung, 14 chính tinh, độ sáng miếu hãm, Tứ Hóa, Cục, Tuần Triệt, cách cục, đại vận lưu niên, kèm quy trình luận 6 bước và sổ tay thuật ngữ.',
    url: '/learn/tu-vi',
  }),
  itemList(
    PALACE_READINGS.map((p) => ({ name: 'Cung ' + p.name, url: '/learn/tu-vi/' + p.slug })),
  ),
];

export default function LearnTuViPage() {
  return (
    <LearnArticle
      eyebrow="Đông phương · Trung Hoa"
      title={
        <>
          Tử Vi <span className="bg-gold-gradient bg-clip-text text-transparent">12 cung</span>
        </>
      }
      standfirst={
        <>
          Lá số Tử Vi chia đời người thành 12 lĩnh vực (gọi là "cung"), mỗi cung chứa các sao
          ảnh hưởng đến một mặt cụ thể của cuộc sống, từ sức khỏe, tài chính, tình cảm đến
          sự nghiệp.{' '}
          <Link
            href="/tu-vi"
            className="text-gold-700 underline-offset-4 hover:underline"
          >
            lập lá số Tử Vi miễn phí
          </Link>{' '}
          hoặc{' '}
          <Link
            href="/methodology/tu-vi"
            className="text-gold-700 underline-offset-4 hover:underline"
          >
            xem phương pháp luận →
          </Link>
        </>
      }
      readMeta="15 phút đọc · Cập nhật 2026 · Đối chiếu cổ thư"
      /* vault 144 §c — khối định hướng "Trang này cho bạn". Trang lăng kính
         này là cửa SEO nhưng thiên về dạy; 4 dòng giá trị + CTA cho người đọc
         một lối chuyển sang lập lá số thật. */
      afterHeader={
        <aside
          aria-labelledby="trang-nay-cho-ban"
          className="rounded-xl border border-border bg-card/50 p-5"
        >
          <h2
            id="trang-nay-cho-ban"
            className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold-700"
          >
            Trang này cho bạn
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
            <li>· Hiểu 12 cung trên lá số soi những lĩnh vực nào của đời bạn</li>
            <li>· Đọc lá số riêng của bạn, không phải câu chung chung ai đọc cũng đúng</li>
            <li>· Thấy mỗi kết luận dẫn từ cung và sao nào, không phán bừa</li>
            <li>· Lập lá số miễn phí trong 30 giây, không cần thẻ</li>
          </ul>
          <Link
            href="/tu-vi"
            className="mt-4 inline-flex items-center rounded-lg border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-medium text-gold-700 transition hover:border-gold/60 hover:bg-gold/15"
          >
            Lập lá số Tử Vi miễn phí →
          </Link>
        </aside>
      }
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Tử Vi 12 cung' },
      ]}
      relatedLenses={relatedLearnLenses('tu-vi')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Nhập ngày giờ sinh, hệ thống dựng lá số Tử Vi 12 cung trong khoảng 30 giây. Bạn xem lá số đầy đủ trước khi quyết định mở khóa luận giải sâu.',
        href: '/reading/new?method=tu-vi',
        label: 'Lập lá số Tử Vi của bạn',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <TuViFrame />,
        },
        {
          id: 'nguon-goc-cach-van-hanh',
          tocLabel: 'Nguồn gốc & vận hành',
          heading: 'Nguồn gốc và cách hệ thống vận hành',
          children: (
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Tử Vi Đẩu Số, nghĩa đen là "đếm sao theo sao Tử Vi", theo truyền thống khởi
                từ Trung Hoa khoảng thế kỷ 10, thời Tống. Tương truyền người hệ thống hóa là{' '}
                <strong className="text-foreground">Trần Đoàn</strong>, đạo hiệu Hi Di tiên
                sinh. Hai bộ sách gốc thường được nhắc tới là <em>Tử Vi Đẩu Số Toàn Thư</em>{' '}
                và <em>Tử Vi Đẩu Số Toàn Tập</em>, đều gán cho Trần Đoàn theo truyền thống,
                dù chuyện tác giả vẫn dừng ở mức "tương truyền" hơn là sử liệu chắc chắn. Ở
                Việt Nam, môn này có dòng truyền riêng qua các soạn giả như Thiên Lương hay
                Vân Đằng Thái Thứ Lang (<em>Tử Vi Đẩu Số Tân Biên</em>), nên thuật ngữ tiếng
                Việt đôi chỗ khác sách gốc Hán.
              </p>
              <p>
                Cách vận hành: từ giờ, ngày, tháng, năm sinh âm lịch, hệ thống an một{' '}
                <strong className="text-foreground">lá số 12 cung</strong> xếp quanh 12 Địa
                Chi (Tý đến Hợi), rồi gắn các sao vào từng cung. Ý nghĩa một cung là tổ hợp
                các sao trong đó, cộng cách chúng tương tác với các cung liên quan. Điểm khác
                với Bát Tự: Bát Tự lấy ngũ hành can chi làm gốc, còn Tử Vi lấy sao và cung
                làm ngôn ngữ chính; hai môn bổ trợ nhau chứ không thay nhau.
              </p>
              <p>
                Trên hieu.asia, phần an sao chạy bằng engine dựa trên{' '}
                <strong className="text-foreground">iztro</strong>, thư viện an sao mã nguồn
                mở, xuất khoảng 114 sao mỗi lá số kèm độ sáng, Tứ Hóa, Cục và đại vận. Riêng
                Tuần Không và Triệt Lộ, hai sao rất quen thuộc với người xem Tử Vi Việt mà
                thư viện gốc Hoa không có, engine tự tính bổ sung theo quy tắc cố định: cùng
                một ngày giờ sinh luôn ra cùng một kết quả.
              </p>
              <p>
                Một điểm rất dễ gộp nhầm: 14 chính tinh có{' '}
                <strong className="text-foreground">hai trục phân loại độc lập</strong>, đừng
                gộp làm một.
              </p>
              <ul className="ml-5 list-disc space-y-1.5">
                <li>
                  <strong className="text-foreground">Trục an sao</strong>: tinh hệ Tử Vi
                  (Tử Vi, Thiên Cơ, Thái Dương, Vũ Khúc, Thiên Đồng, Liêm Trinh) an theo Cục
                  cộng ngày sinh âm lịch; tinh hệ Thiên Phủ (Thiên Phủ, Thái Âm, Tham Lang,
                  Cự Môn, Thiên Tướng, Thiên Lương, Thất Sát, Phá Quân) an đối xứng với
                  chuỗi Tử Vi.
                </li>
                <li>
                  <strong className="text-foreground">Trục tinh đẩu</strong>: Bắc Đẩu tinh
                  (Tử Vi, Tham Lang, Vũ Khúc, Cự Môn, Liêm Trinh, Phá Quân), Nam Đẩu tinh
                  (Thiên Phủ, Thiên Cơ, Thiên Tướng, Thiên Lương, Thiên Đồng, Thất Sát), và
                  Trung Thiên (Thái Dương, Thái Âm).
                </li>
              </ul>
              <p>
                Hai trục này không trùng nhau: Thiên Cơ và Thiên Đồng thuộc tinh hệ Tử Vi
                nhưng là sao Nam Đẩu; Tham Lang, Cự Môn, Phá Quân thuộc tinh hệ Thiên Phủ
                nhưng là sao Bắc Đẩu. Câu "tinh hệ Tử Vi là Bắc Đẩu, tinh hệ Thiên Phủ là
                Nam Đẩu" là lỗi gộp nhầm hai trục.
              </p>
            </div>
          ),
        },
        {
          id: 'so-do-12-cung',
          tocLabel: '12 cung trên lá số',
          heading: '12 cung trên lá số',
          children: (
            <div className="rounded-xl border border-border bg-card/40 p-6 sm:p-8">
              <InfographicTuVi />
            </div>
          ),
        },
        {
          id: 'tung-cung',
          tocLabel: 'Bấm vào cung bạn quan tâm',
          heading: '12 cung, bấm vào cung bạn quan tâm',
          children: (
            <>
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                Mỗi cung là một trang riêng: bạn sẽ thấy cung đó quản lĩnh vực nào, các sao đáng để
                ý, cách một buổi luận đi từ sao sang quyết định, và những câu hỏi đời thực mà cung
                này thực sự trả lời được. Ba lằn ranh áp dụng cho mọi cung: Tật Ách không chẩn đoán
                bệnh, Tài Bạch không tư vấn khoản đầu tư cụ thể, Phu Thê không phán chia tay.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {PALACE_READINGS.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/learn/tu-vi/${p.slug}`}
                    className="group rounded-lg border border-border bg-card/40 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40 hover:bg-card/60"
                  >
                    <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-gold-700">
                      {p.domain}
                    </p>
                    <p className="mt-1.5 font-heading text-base font-semibold text-foreground group-hover:text-gold">
                      Cung {p.name}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {p.governs.split('.')[0]}.
                    </p>
                  </Link>
                ))}
              </div>
            </>
          ),
        },
        {
          id: 'doc-mot-cung',
          tocLabel: 'Cách luận một cung',
          heading: 'Cách luận một cung: không bao giờ đọc lẻ',
          children: (
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Sai lầm phổ biến nhất khi mới học là nhìn một cung, thấy một sao "xấu" rồi
                hoảng. Theo truyền thống, một cung không bao giờ luận đơn lẻ. Mỗi cung phải
                đọc cùng <strong className="text-foreground">tam phương tứ chính</strong>:
                chính cung, cộng cung xung chiếu (cung đối diện), cộng hai cung tam hợp. Bốn
                cung này chiếu vào nhau và cùng tạo nên bức tranh.
              </p>
              <p>
                Ví dụ kinh điển: muốn xét sự nghiệp, bạn không chỉ đọc cung Quan Lộc mà đọc
                cả bộ <strong className="text-foreground">Mệnh · Quan Lộc · Tài Bạch · Thiên
                Di</strong>. Một cung Mệnh hơi yếu nhưng cung Thiên Di đối diện tốt thường
                được luận là "đi xa thì khá hơn ở nhà".
              </p>
              <p>
                Khoảng 30% lá số có cung Mệnh{' '}
                <strong className="text-foreground">vô chính diệu</strong> — không có chính
                tinh nào đóng. Đây không phải dấu hiệu xấu; cách luận là mượn sao của cung
                đối diện rồi xét thêm phụ tinh. Thường đó là người bản sắc đa dạng, phản ứng
                linh hoạt theo hoàn cảnh.
              </p>
              <p>
                Trình tự luận có cơ sở thường đi theo các lớp: trước hết định sao thủ Mệnh
                cùng độ sáng và Cục (nhịp đại vận); kế đến đọc Mệnh trong tam phương tứ
                chính; rồi phủ thêm độ sáng và Tứ Hóa gốc để thấy đâu là thế mạnh, đâu là
                nút thắt; sau đó mới dùng phụ tinh tô màu; cuối cùng áp lớp thời gian (đại
                vận, lưu niên) để biết "giai đoạn này chủ đề gì". Trật tự này giúp tránh kiểu
                nói chung chung đúng-với-ai-cũng-được. Phiên bản đầy đủ sáu bước — tính cả
                cung Thân và bước luận từng cung theo câu hỏi — nằm ở mục "Quy trình luận"
                phía dưới.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <TuViDepth />,
        },
        {
          id: 'chinh-tinh-phu-tinh',
          tocLabel: 'Chính tinh & phụ tinh',
          heading: 'Chính tinh, độ sáng và phụ tinh: các lớp tạo nên một sao',
          children: (
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                <strong className="text-foreground">14 chính tinh</strong> là "nhân vật
                chính", quyết định khuôn của mỗi cung — từ Tử Vi (đế tinh, lãnh đạo), Thiên
                Cơ (trí tinh, linh hoạt), Vũ Khúc (tài tinh, kỷ luật), đến Thất Sát và Phá
                Quân (quyết liệt, đột phá). Mỗi sao có mặt sáng và mặt cần lưu ý; không sao
                nào "toàn tốt" hay "toàn xấu".
              </p>
              <p>
                Các chính tinh hay đi thành ba "bộ tính cách lớn", giúp nhận ra giọng của
                một người:
              </p>
              <ul className="ml-5 list-disc space-y-1.5">
                <li>
                  <strong className="text-foreground">Sát · Phá · Tham</strong> (Thất Sát,
                  Phá Quân, Tham Lang) — bộ "động" nhất: biến động, đột phá, thăng trầm
                  mạnh; hợp người dám thay đổi, khởi nghiệp.
                </li>
                <li>
                  <strong className="text-foreground">Cơ · Nguyệt · Đồng · Lương</strong>{' '}
                  (Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương) — bộ "tĩnh": ổn định, chuyên
                  môn, đời sống nội tâm; hợp làm công, chuyên gia, nghề chăm sóc.
                </li>
                <li>
                  <strong className="text-foreground">Tử · Phủ · Vũ · Tướng</strong> (Tử Vi,
                  Thiên Phủ, Vũ Khúc, Thiên Tướng) — bộ "lãnh đạo, quản trị, tài chính": trật
                  tự, địa vị, quản lý nguồn lực.
                </li>
              </ul>
              <p>
                Cùng một sao đặt ở vị trí khác nhau sẽ{' '}
                <strong className="text-foreground">sáng hay tối</strong> khác nhau (đủ bảy
                bậc, từ miếu sáng nhất đến hãm tối nhất; chi tiết ở mục riêng bên dưới), tức
                cường độ biểu hiện mạnh hay yếu. Nhưng
                "hãm" không đồng nghĩa với xấu, "miếu" không đồng nghĩa với tốt: sao hãm gặp
                cát tinh phụ trợ vẫn dùng được, sao miếu gặp sát tinh nặng vẫn trục trặc.
              </p>
              <p>
                <strong className="text-foreground">Phụ tinh</strong> là lớp tô màu: nhóm cát
                tinh nâng đỡ (Tả Phụ – Hữu Bật, Văn Xương – Văn Khúc, Thiên Khôi – Thiên
                Việt) và nhóm sát tinh tạo áp lực (Kình Dương – Đà La, Hỏa Tinh – Linh Tinh,
                Địa Không – Địa Kiếp). Sát tinh không phải điềm gở — nhiều khi chính là động
                lực trong khủng hoảng, hợp nghề cạnh tranh. Có trường phái nhấn mạnh sao này,
                phái khác nhấn sao kia; điểm chung là luận đúng theo thứ tự: chính tinh trước,
                rồi độ sáng, rồi Tứ Hóa, sau cùng mới tới phụ tinh — tất cả trong tam phương
                tứ chính.
              </p>
            </div>
          ),
        },
        {
          id: 'muoi-bon-chinh-tinh',
          tocLabel: '14 chính tinh',
          heading: '14 chính tinh: nhân vật chính của lá số',
          children: (
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Toàn bộ hệ Tử Vi xoay quanh{' '}
                <strong className="text-foreground">14 chính tinh</strong> — nhóm sao quyết
                định khuôn của mỗi cung. Mỗi sao dưới đây có ba phần: nguyên mẫu (hình dung
                nhanh sao này thuộc "kiểu người" nào), mặt sáng, và mặt cần lưu ý. Đây vẫn là
                bước nhận diện, không phải luận giải: một sao còn tuỳ vị trí, độ sáng và Tứ
                Hóa mới ra nghĩa.
              </p>
              <div>
                <p className="mb-1.5">
                  <strong className="text-foreground">Bộ Sát · Phá · Tham</strong> — bộ
                  "động" nhất: chủ biến động, đột phá, thăng trầm mạnh. Hợp người dám thay
                  đổi, khởi nghiệp, nghề cạnh tranh; cần kỷ luật để biến động thành cơ hội
                  thay vì hao tổn.
                </p>
                <ul className="ml-5 list-disc space-y-1.5">
                  <li>
                    <strong className="text-foreground">Thất Sát</strong> (Tướng tinh: quyết
                    liệt, đột phá). Mặt sáng: ra quyết định nhanh, vượt khủng hoảng tốt. Lưu
                    ý: dễ va đập, cần nhẫn nại với việc lâu dài.
                  </li>
                  <li>
                    <strong className="text-foreground">Phá Quân</strong> (Hao tinh: phá
                    cách, làm lại từ đầu). Mặt sáng: khởi tạo cái mới giỏi, không ngại bỏ
                    cái cũ. Lưu ý: dễ "phá rồi không xây", cần học hoàn thiện.
                  </li>
                  <li>
                    <strong className="text-foreground">Tham Lang</strong> (đào hoa, tham
                    vọng, thay đổi). Mặt sáng: năng lượng cao, có sức hút, học nhanh, đa
                    năng. Lưu ý: dễ phân tán; đào hoa quá vượng thì quan hệ phức tạp.
                  </li>
                </ul>
              </div>
              <div>
                <p className="mb-1.5">
                  <strong className="text-foreground">Bộ Cơ · Nguyệt · Đồng · Lương</strong>{' '}
                  — bộ "tĩnh": chủ ổn định, chuyên môn, đời sống nội tâm. Hợp làm công ăn
                  lương, chuyên gia, nghề chăm sóc; ít hợp mạo hiểm lớn.
                </p>
                <ul className="ml-5 list-disc space-y-1.5">
                  <li>
                    <strong className="text-foreground">Thiên Cơ</strong> (Trí tinh: trí
                    tuệ, linh hoạt, thay đổi). Mặt sáng: thông minh, học nhanh, hợp môi
                    trường biến động. Lưu ý: hay đổi, nghĩ nhiều, dễ căng thẳng.
                  </li>
                  <li>
                    <strong className="text-foreground">Thái Âm</strong> (Âm tinh: nội tâm,
                    gia đạo, tế nhị). Mặt sáng: nhạy cảm, tinh tế, hợp việc cần sự dịu. Lưu
                    ý: dễ buồn rầu, nghĩ nhiều, cần học bộc lộ.
                  </li>
                  <li>
                    <strong className="text-foreground">Thiên Đồng</strong> (Phúc tinh: hoà
                    hảo, hưởng thụ, dễ chịu). Mặt sáng: ôn hoà, dễ kết bạn, biết tận hưởng.
                    Lưu ý: dễ dãi với bản thân, thiếu động lực nếu thiếu cát tinh đi kèm.
                  </li>
                  <li>
                    <strong className="text-foreground">Thiên Lương</strong> (Ấm tinh:
                    trưởng thượng, đạo đức, che chở). Mặt sáng: đạo đức cao, hợp nghề y,
                    giáo dục, pháp lý; hay gặp quý nhân. Lưu ý: lo việc thiên hạ quên việc
                    nhà, cần học nói không.
                  </li>
                </ul>
              </div>
              <div>
                <p className="mb-1.5">
                  <strong className="text-foreground">Bộ Tử · Phủ · Vũ · Tướng</strong> — bộ
                  lãnh đạo, quản trị, tài chính: chủ trật tự, địa vị, quản lý nguồn lực. Hợp
                  vai trò quản lý, tài chính, việc có trách nhiệm và cấu trúc.
                </p>
                <ul className="ml-5 list-disc space-y-1.5">
                  <li>
                    <strong className="text-foreground">Tử Vi</strong> (Đế tinh: lãnh đạo,
                    ổn định, danh dự). Mặt sáng: có uy, quyết định có chiều sâu, giữ chữ
                    tín. Lưu ý: dễ cô đơn hoặc cứng nhắc nếu thiếu Tả Phụ, Hữu Bật, Khôi
                    Việt phụ trợ.
                  </li>
                  <li>
                    <strong className="text-foreground">Thiên Phủ</strong> (Khố tinh: tích
                    luỹ, ổn định, "thủ quỹ"). Mặt sáng: giữ của giỏi, cẩn trọng, ít rủi ro.
                    Lưu ý: quá thủ thân, dễ bỏ lỡ cơ hội, ngại thay đổi.
                  </li>
                  <li>
                    <strong className="text-foreground">Vũ Khúc</strong> (Tài tinh: kỷ
                    luật, quyết liệt, thuộc "kim"). Mặt sáng: kỷ luật tài chính tốt, quyết
                    đoán trong kinh doanh. Lưu ý: cứng nhắc; gặp sát tinh dễ căng thẳng vì
                    tiền.
                  </li>
                  <li>
                    <strong className="text-foreground">Thiên Tướng</strong> (Ấn tinh: phụ
                    tá, trung thành, tham mưu). Mặt sáng: trách nhiệm, giỏi điều phối, dung
                    hoà. Lưu ý: thiếu tự chủ, cần học ra quyết định độc lập.
                  </li>
                </ul>
              </div>
              <div>
                <p className="mb-1.5">
                  <strong className="text-foreground">Ba chính tinh còn lại</strong> — không
                  nằm trọn trong ba bộ trên:
                </p>
                <ul className="ml-5 list-disc space-y-1.5">
                  <li>
                    <strong className="text-foreground">Thái Dương</strong> (Dương tinh:
                    năng lượng, danh tiếng, hiện diện). Mặt sáng: nhiệt huyết, có sức ảnh
                    hưởng, hợp vai trò công khai. Lưu ý: dễ kiệt sức; khi hãm (sinh ban
                    đêm, mùa đông) cần học nghỉ ngơi.
                  </li>
                  <li>
                    <strong className="text-foreground">Cự Môn</strong> (Ám tinh: lời nói,
                    phân tích, tranh luận). Mặt sáng: phân tích sắc bén, hợp nghề dùng lời
                    như luật, dạy học, viết. Lưu ý: nói nhiều, dễ "khẩu thiệt", nhất là khi
                    gặp Hóa Kỵ.
                  </li>
                  <li>
                    <strong className="text-foreground">Liêm Trinh</strong> (sao "hai mặt":
                    kỷ luật và đam mê). Mặt sáng: kỷ luật cao, theo đuổi mục tiêu lâu dài.
                    Lưu ý: áp lực nội tâm; gặp Tham Lang hoặc Hóa Kỵ dễ cực đoan.
                  </li>
                </ul>
              </div>
              <p>
                Ba bộ trên cũng là ba "giọng" lớn khi luận: người thuộc bộ Sát Phá Tham cần
                nghe phương án động, người thuộc Cơ Nguyệt Đồng Lương cần phương án tĩnh,
                người thuộc Tử Phủ Vũ Tướng cần phương án quản trị. Không sao nào "toàn tốt"
                hay "toàn xấu"; cùng một chính tinh, đặt ở cung khác nhau và gặp Tứ Hóa khác
                nhau sẽ luận rất khác.
              </p>
            </div>
          ),
        },
        {
          id: 'do-sang-mieu-ham',
          tocLabel: 'Độ sáng: miếu → hãm',
          heading: 'Độ sáng của sao: từ miếu đến hãm',
          children: (
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Cùng một sao, đặt ở 12 vị trí khác nhau sẽ "sáng" hay "tối" khác nhau. Độ
                sáng nói về <strong className="text-foreground">cường độ biểu hiện</strong>{' '}
                của sao tại vị trí đó, không phải điểm tốt xấu. Thang chuẩn có bảy bậc:
              </p>
              <ul className="ml-5 list-disc space-y-1.5">
                <li>
                  <strong className="text-foreground">Miếu</strong> (廟) — sáng nhất: sao
                  phát huy đầy đủ, mặt tốt nổi rõ.
                </li>
                <li>
                  <strong className="text-foreground">Vượng</strong> (旺) — rất mạnh, gần
                  như miếu.
                </li>
                <li>
                  <strong className="text-foreground">Đắc</strong> (得) — khá: hoạt động
                  tốt, ổn.
                </li>
                <li>
                  <strong className="text-foreground">Lợi</strong> (利) — trên trung tính,
                  phát huy khá.
                </li>
                <li>
                  <strong className="text-foreground">Bình</strong> (平) — trung tính, phát
                  huy vừa phải.
                </li>
                <li>
                  <strong className="text-foreground">Bất</strong> (不) — dưới trung tính:
                  sao hơi yếu, phát huy chưa trọn.
                </li>
                <li>
                  <strong className="text-foreground">Hãm</strong> (陷, một số sách Việt ghi
                  "Hạn") — tối nhất: sao yếu, mặt khó dễ trồi lên hơn.
                </li>
              </ul>
              <p>
                Điều cần khắc ghi:{' '}
                <strong className="text-foreground">sao hãm không phải án xấu</strong>, và
                sao miếu cũng không phải giấy bảo hành. Sao hãm gặp cát tinh phụ trợ vẫn
                dùng được; sao miếu gặp sát tinh nặng vẫn trục trặc. Ví dụ kinh điển là Thái
                Dương hãm ở người sinh ban đêm hoặc mùa đông: vẫn là người giỏi, nhưng dễ
                kiệt sức và công lao khó được nhìn thấy. Bài đọc tử tế sẽ nhắc người đó học
                cách nghỉ và chọn môi trường biết ghi nhận, thay vì phán "số khổ".
              </p>
              <p>
                Độ sáng chỉ là một lớp tinh chỉnh. Nó luôn được xét cùng tam phương tứ
                chính, Tứ Hóa và phụ tinh, không bao giờ đứng một mình để kết luận.
              </p>
            </div>
          ),
        },
        {
          id: 'cuc-va-cung-than',
          tocLabel: 'Cục & cung Thân',
          heading: 'Cục, nhịp khởi đại vận, và cung Thân',
          children: (
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Sau khi định cung Mệnh, lá số được gán một{' '}
                <strong className="text-foreground">Cục</strong>: một trong năm hành, kèm
                một con số. Có năm loại: Thủy Nhị Cục (2), Mộc Tam Cục (3), Kim Tứ Cục (4),
                Thổ Ngũ Cục (5) và Hỏa Lục Cục (6).
              </p>
              <p>
                Cục có đúng hai công dụng kỹ thuật. Thứ nhất, nó cùng ngày sinh âm lịch
                quyết định vị trí khởi sao Tử Vi; mà sao Tử Vi đứng đâu thì toàn bộ các sao
                khác an theo đó. Thứ hai, con số của Cục là{' '}
                <strong className="text-foreground">tuổi bắt đầu đại vận đầu tiên</strong>:
                người Thủy Nhị Cục khởi vận khoảng 2 tuổi, người Hỏa Lục Cục khoảng 6 tuổi.
                Từ mốc đó, mỗi đại vận kéo dài 10 năm.
              </p>
              <p>
                Cách tính Cục và cách phối Cục với Mệnh là phần các trường phái còn tranh
                luận. Vì vậy nên dùng Cục chủ yếu để hiểu nhịp khởi vận sớm hay muộn, không
                nên phán "mệnh tốt, mệnh xấu" từ Cục.
              </p>
              <p>
                Cùng lớp nền tảng này còn có{' '}
                <strong className="text-foreground">cung Thân</strong>. Nó không phải cung
                thứ 13: cung Thân ghép chồng lên một trong sáu cung Mệnh, Phúc Đức, Quan
                Lộc, Thiên Di, Tài Bạch hoặc Phu Thê. Nếu Mệnh là khí chất bẩm sinh, "tôi là
                ai khi chưa kịp suy nghĩ", thì Thân nói về hậu vận, nơi đời sống thực tế kéo
                ta dồn sức. Mệnh và Thân đồng cung: con người nhất quán, nghĩ sao làm vậy.
                Khác cung: có khoảng cách giữa nội tâm và hành động, cần dung hoà thay vì tự
                trách.
              </p>
            </div>
          ),
        },
        {
          id: 'cach-cuc',
          tocLabel: 'Cách cục',
          heading: 'Cách cục: những "thế cờ" có tên riêng',
          children: (
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Cách cục là tổ hợp sao đặc trưng tạo nên một "thế cờ" nổi bật, được cổ thư
                đặt tên riêng. Đây là lớp luận nâng cao: nó cho biết lá số có điểm nhấn gì.
                Sáu cách hay gặp, mô tả xu hướng chứ không phán tuyệt đối:
              </p>
              <ul className="ml-5 list-disc space-y-1.5">
                <li>
                  <strong className="text-foreground">Quân Thần Khánh Hội</strong> — Tử Vi
                  có đủ Tả Phụ, Hữu Bật, Văn Xương, Văn Khúc, Khôi Việt vây quanh. "Vua có
                  bề tôi giỏi": hợp vai trò lãnh đạo có ê-kíp mạnh.
                </li>
                <li>
                  <strong className="text-foreground">Phủ Tướng Triều Viên</strong> — Thiên
                  Phủ và Thiên Tướng cùng chiếu về cung Mệnh: nền ổn định, quản trị nguồn
                  lực tốt, đời sống có trật tự.
                </li>
                <li>
                  <strong className="text-foreground">Cơ Nguyệt Đồng Lương</strong> — bốn
                  sao Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương hội đủ: cách của người hợp
                  chuyên môn ổn định, làm công, nghề chăm sóc hoặc trí thức.
                </li>
                <li>
                  <strong className="text-foreground">Sát Phá Lang</strong> (Sát Phá Tham)
                  — cách của người biến động, đột phá, dám làm lại; thăng trầm rõ, hợp môi
                  trường cạnh tranh, khởi nghiệp.
                </li>
                <li>
                  <strong className="text-foreground">Thạch Trung Ẩn Ngọc</strong> — Cự Môn
                  thủ Mệnh tại Tý hoặc Ngọ, có cát hóa. "Ngọc trong đá": tài năng cần thời
                  gian mài mới lộ, nở muộn nhưng giá trị. Có trường phái xem vị trí Tý
                  thuận hơn Ngọ; và đây là cách của Cự Môn, không phải của Thái Dương.
                </li>
                <li>
                  <strong className="text-foreground">Hỏa Tham / Linh Tham</strong> — Tham
                  Lang gặp Hỏa Tinh hoặc Linh Tinh: bộc phát nhanh, hợp cơ hội đến bất ngờ;
                  cần kỷ luật để giữ thành quả.
                </li>
              </ul>
              <p>
                Hai điều giữ cho phần này khỏi thành trò hù dọa hay nịnh hót. Một: danh sách
                cách cục rất dài, các phái đặt điều kiện khác nhau, cùng một tên có thể luận
                lệch nhau. Hai: trên hieu.asia, cách cục do engine phát hiện từ lá số thật,
                mỗi cách kèm nhãn cát, hung, trung tính hoặc tùy ngữ cảnh; bài đọc chỉ nói
                về cách cục thật sự có trên lá số của bạn, không gán thêm.
              </p>
            </div>
          ),
        },
        {
          id: 'tuan-triet',
          tocLabel: 'Tuần – Triệt',
          heading: 'Tuần – Triệt: nét rất Việt của lá số',
          children: (
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Người xem Tử Vi ở Việt Nam gần như ai cũng từng nghe câu "cung này bị
                Triệt". <strong className="text-foreground">Tuần Không</strong> và{' '}
                <strong className="text-foreground">Triệt Lộ</strong> là hai sao "không
                vong": chúng án ngữ một cung, làm mọi việc trong cung đó đến muộn hơn hoặc
                phải đi đường vòng.
              </p>
              <p>
                Nhưng không vong có mặt kia ít ai nói: cung bị án ngữ cũng được "trống" bớt
                cái xấu. Sao khó chịu trong cung ấy giảm lực y như sao tốt. Vì vậy Tuần
                Triệt hợp với kiểu người nở muộn: chậm mà không mất, chỉ cần kiên nhẫn hơn
                người khác một nhịp.
              </p>
              <p>
                Đây là nét rất Việt. Hai sao này quen thuộc với người xem Tử Vi Việt tới mức
                dễ quên rằng thư viện an sao gốc Hoa (iztro) không xuất chúng. Engine của
                hieu.asia tự tính bổ sung: Tuần an theo can chi năm sinh, Triệt theo Can năm
                sinh, quy tắc cố định nên cùng một người luôn ra cùng kết quả. Khi luận,
                Tuần Triệt xếp ở lớp phụ tinh: xét sau chính tinh, độ sáng và Tứ Hóa.
              </p>
            </div>
          ),
        },
        {
          id: 'lop-thoi-gian',
          tocLabel: 'Đại vận & lưu niên',
          heading: 'Lớp thời gian: đại vận, lưu niên',
          children: (
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Lá số gốc mô tả thiên hướng cả đời. Nhưng đời người có{' '}
                <strong className="text-foreground">nhịp</strong>: giai đoạn này thuận về
                sự nghiệp, giai đoạn kia nặng về gia đạo. Tử Vi mô tả nhịp đó bằng một lớp
                riêng — <strong className="text-foreground">lớp thời gian</strong> — được áp
                sau cùng khi luận.
              </p>
              <p>
                <strong className="text-foreground">Đại vận</strong> là các chu kỳ vận lớn,
                mỗi vận kéo dài{' '}
                <strong className="text-foreground">khoảng 10 năm</strong> và lần lượt đi
                qua từng cung. Đại vận rơi vào cung nào thì mười năm ấy chủ đề đời sống
                nghiêng về lĩnh vực của cung đó. Tuổi khởi vận đầu tiên là con số của Cục;
                chiều đi theo quy tắc truyền thống: dương nam, âm nữ đi thuận; âm nam, dương
                nữ đi nghịch. Mỗi đại vận còn mang Can-Chi riêng, tức có bộ Tứ Hóa riêng áp
                lên lá số gốc — vì thế cùng một lá số mà mỗi chặng mười năm mang chủ đề
                khác.
              </p>
              <p>
                Giữa đại vận và lưu niên còn một lớp ít người mới để ý:{' '}
                <strong className="text-foreground">tiểu hạn</strong> — vận theo từng năm
                tuổi, an theo quy tắc riêng dựa trên chi năm sinh và giới tính, mỗi năm chạy
                một cung. Các trường phái coi trọng tiểu hạn ở mức khác nhau: có phái luận
                song song với lưu niên, có phái chỉ xem là lớp phụ. Bài này nêu khái niệm để
                bạn đọc sách khỏi lạ, không bắt buộc dùng.
              </p>
              <p>
                <strong className="text-foreground">Lưu niên</strong> là lớp từng năm: mỗi
                năm cụ thể tương ứng một cung "lưu", cho biết bầu không khí và trọng tâm của
                riêng năm đó, lồng bên trong đại vận đang diễn ra. Cách xác định: lấy Can-Chi
                của năm đặt lên cung tương ứng — cung lưu niên Mệnh là cung trùng chi của
                năm (năm Ngọ thì ở cung Ngọ). Theo năm còn có các sao lưu đi kèm như Lưu
                Xương, Lưu Lộc và vòng Thái Tuế.
              </p>
              <p>
                Điểm làm mỗi năm có "màu" riêng là{' '}
                <strong className="text-foreground">Tứ Hóa lưu niên</strong>: theo Thiên Can
                của năm, bốn sao được gắn Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ và rơi vào
                các cung khác nhau, tạo cho từng năm một chủ đề — nơi có cơ hội, nơi nên cẩn
                trọng.
              </p>
              <p>
                Đây là lớp áp <strong className="text-foreground">cuối cùng</strong> trong
                trình tự luận: sau khi đã đọc Mệnh trong tam phương tứ chính và Tứ Hóa gốc,
                mới phủ đại vận rồi lưu niên để trả lời "giai đoạn này nên tập trung vào
                đâu". Cách đọc cụ thể: Hóa Lộc, Quyền, Khoa của vận rơi vào cung nào thì đó
                là vùng thuận; Hóa Kỵ của vận rơi vào cung trọng yếu thì đó là đề tài cần xử
                lý của giai đoạn, không phải điềm tai họa. Và như mọi phần khác của Tử Vi,
                đây là{' '}
                <strong className="text-foreground">thiên hướng theo thời gian, không phải
                số phận đóng khung</strong> — một vận thuận vẫn cần hành động, một vận khó
                vẫn có khoảng xoay xở.
              </p>
            </div>
          ),
        },
        {
          id: 'quy-trinh-luan',
          tocLabel: 'Quy trình luận 6 bước',
          heading: 'Quy trình luận một lá số: 6 bước, đúng thứ tự',
          children: (
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Gom các lớp ở trên lại, một buổi luận có cơ sở đi theo sáu bước. Thứ tự
                quan trọng: nó giữ cho người luận khỏi nhảy thẳng vào một sao lẻ rồi phán.
              </p>
              <ol className="ml-5 list-decimal space-y-1.5">
                <li>
                  <strong className="text-foreground">Định Mệnh, Thân, Cục</strong>: sao thủ
                  Mệnh là gì, miếu hay hãm; Thân ghép vào cung nào; Cục gì, tức nhịp khởi
                  đại vận. Mệnh vô chính diệu thì mượn sao cung Thiên Di.
                </li>
                <li>
                  <strong className="text-foreground">Đọc Mệnh trong tam phương tứ
                  chính</strong>: gộp Mệnh, Quan Lộc, Tài Bạch, Thiên Di; nhận diện lá số
                  nghiêng về bộ Sát Phá Tham, Cơ Nguyệt Đồng Lương hay Tử Phủ Vũ Tướng.
                </li>
                <li>
                  <strong className="text-foreground">Phủ độ sáng và Tứ Hóa gốc</strong>:
                  sao chính sáng hay hãm; Hóa Lộc, Quyền, Khoa, Kỵ gốc rơi cung nào — đâu là
                  thế mạnh, đâu là nút thắt.
                </li>
                <li>
                  <strong className="text-foreground">Tô màu bằng phụ tinh</strong>: Tả Hữu,
                  Xương Khúc, Khôi Việt nâng đỡ; Kình Đà, Hỏa Linh, Không Kiếp tạo áp lực;
                  Tuần Triệt làm chậm.
                </li>
                <li>
                  <strong className="text-foreground">Luận cung cụ thể theo câu hỏi
                  thật</strong> của người xem, luôn kéo cung xung chiếu và hai cung tam hợp.
                </li>
                <li>
                  <strong className="text-foreground">Áp lớp thời gian</strong>: đại vận
                  hiện tại, lưu niên, Tứ Hóa lưu — giai đoạn này chủ đề gì.
                </li>
              </ol>
              <p>
                Để thấy sáu bước chạy thế nào, thử theo một buổi luận quanh câu hỏi quen
                thuộc: "công việc của tôi sắp tới ra sao?". Người luận không mở ngay cung
                Quan Lộc. Họ bắt đầu từ Mệnh: sao thủ Mệnh cho biết khí chất gốc, và bộ sao
                của Mệnh định giọng cả buổi — người mang bộ Sát Phá Tham cần nghe phương án
                đột phá, người mang Cơ Nguyệt Đồng Lương cần phương án tích lũy.
              </p>
              <p>
                Đến lượt cung Quan Lộc, nó không đứng một mình. Tam phương tứ chính của Quan
                Lộc gồm chính nó, hai cung tam hợp là Mệnh và Tài Bạch, cộng cung xung chiếu
                là Phu Thê. Nghĩa là chuyện nghề luôn được đọc cùng con người bạn, dòng tiền
                của bạn, và cả sao tốt xấu bên cung hôn nhân chiếu sang.
              </p>
              <p>
                Trong cung, người luận tìm sao tín hiệu. Tử Vi ở Quan Lộc gợi vai trò lãnh
                đạo; Vũ Khúc gợi nghề tài chính, kỹ thuật; Thất Sát gợi môi trường cạnh
                tranh, khởi nghiệp. Rồi tới Tứ Hóa: Hóa Quyền đóng đây thường là được giao
                việc lớn kèm áp lực; Hóa Kỵ đóng đây là dễ bị hiểu lầm nơi công việc — lời
                khuyên thực tế là văn bản hóa thỏa thuận cho rõ.
              </p>
              <p>
                Cuối cùng, chú ý câu hỏi mà cung này thật sự trả lời: Quan Lộc nói "bạn là
                ai trong mắt nghề", còn kiếm được bao nhiêu là chuyện của Tài Bạch. Và nhắc
                lại ba lằn ranh giữ cho buổi luận sạch: Tật Ách không chẩn đoán bệnh (có
                triệu chứng thì đi bác sĩ), Tài Bạch không tư vấn mua bán khoản đầu tư cụ
                thể, Phu Thê không phán "chắc chắn chia tay". Lá số dẫn tới câu hỏi đúng;
                quyết định vẫn là của bạn.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <TuViWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <TuViRecall />,
        },
        {
          id: 'so-tay-thuat-ngu',
          tocLabel: 'Sổ tay thuật ngữ',
          heading: 'Sổ tay thuật ngữ: tra nhanh khi đọc lá số',
          children: (
            <>
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                Gặp một từ lạ khi đọc lá số hay đọc sách Tử Vi, tra ở đây trước. Mỗi mục chỉ
                gói trong một hai câu; chi tiết nằm ở các mục tương ứng phía trên.
              </p>
              <dl className="grid gap-3 sm:grid-cols-2">
                {GLOSSARY.map((g) => (
                  <div
                    key={g.term}
                    className="rounded-lg border border-border bg-card/40 p-3.5"
                  >
                    <dt className="text-sm font-medium text-foreground">{g.term}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {g.def}
                    </dd>
                  </div>
                ))}
              </dl>
            </>
          ),
        },
        {
          id: 'giai-thich',
          tocLabel: 'Giải thích chi tiết',
          heading: 'Giải thích chi tiết',
          children: (
            <dl className="space-y-2">
              {FAQS.map((f, i) => (
                <details
                  key={i}
                  open={i === 0}
                  className="group rounded border border-border px-4 py-3"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium text-foreground [&::-webkit-details-marker]:hidden">
                    <span>{f.q}</span>
                    <ChevronDown
                      aria-hidden
                      className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                    />
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </dl>
          ),
        },
        {
          id: 'ban-da-hieu-chua',
          tocLabel: 'Bạn đã hiểu chưa?',
          heading: 'Bạn đã thật sự hiểu chưa?',
          children: <TuViChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
