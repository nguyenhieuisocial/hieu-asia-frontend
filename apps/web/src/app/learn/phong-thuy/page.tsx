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
  PhongThuyFrame,
  PhongThuyDepth,
  PhongThuyRecall,
  PhongThuyChecklist,
  PhongThuyWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Phong Thủy — hướng nhà, ngũ hành & chọn ngày',
  description:
    'Phong Thủy ứng dụng: hai nhánh Loan Đầu và Lý Khí; Bát Trạch (hướng nhà hợp tuổi, tính Cung Phi), Huyền Không Phi Tinh, bổ khuyết ngũ hành, chọn ngày–giờ, xem tuổi và thước Lỗ Ban. Quy tắc minh bạch để tham khảo, không phán số mệnh.',
  alternates: { canonical: 'https://hieu.asia/learn/phong-thuy' },
};

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS = [
  {
    q: 'Phong thủy là gì?',
    a: 'Phong thủy (風水, "gió – nước") là hệ thống tri thức cổ truyền về việc sắp đặt không gian sống sao cho hài hòa với môi trường và với khí (氣). Truyền thống chia làm hai nhánh lớn: Loan Đầu (quan sát hình thế thực địa — núi, nước, đường, vật cản) và Lý Khí (dùng la bàn và công thức để tính hướng, tính sao). Đây là khung tham khảo để cân nhắc, không phải bảo đảm họa phúc.',
  },
  {
    q: 'Bát Trạch (八宅) là gì?',
    a: 'Bát Trạch — "Tám Trạch / Eight Mansions" — là một trường phái thuộc nhánh Lý Khí. Từ năm sinh và giới tính, người ta suy ra Cung Phi (mệnh quái của người), rồi lập bảng 8 hướng, mỗi hướng mang một du niên tinh: 4 sao cát và 4 sao hung. Đây là phương pháp duy nhất công cụ hướng nhà trên hieu.asia sử dụng.',
  },
  {
    q: 'Đông tứ mệnh và Tây tứ mệnh khác nhau thế nào?',
    a: 'Tám quẻ chia làm hai nhóm "đồng khí". Đông tứ mệnh gồm Khảm, Ly, Chấn, Tốn — hợp 4 hướng Bắc, Nam, Đông, Đông Nam. Tây tứ mệnh gồm Càn, Khôn, Cấn, Đoài — hợp 4 hướng Tây Bắc, Tây Nam, Đông Bắc, Tây. Người thuộc nhóm nào thì 4 hướng cùng nhóm gặp toàn sao cát, 4 hướng nhóm kia thành sao hung.',
  },
  {
    q: 'Ngũ hành liên quan gì tới chọn màu và hướng?',
    a: 'Năm hành Kim, Mộc, Thủy, Hỏa, Thổ tương sinh và tương khắc lẫn nhau. Màu hợp của một người thường lấy màu của hành bản mệnh cộng màu của hành sinh ra nó (mẹ sinh con). Hướng hợp là hướng cố hữu của hành đó: Kim → Tây/Tây Bắc, Mộc → Đông/Đông Nam, Thủy → Bắc, Hỏa → Nam, Thổ → Trung tâm/Đông Bắc/Tây Nam. Đây là gợi ý môi trường để tham khảo, không phải "đeo cái này thì đổi vận".',
  },
  {
    q: 'Xem ngày tốt và giờ hoàng đạo dựa trên cái gì?',
    a: 'Một ngày được cân nhắc theo nhiều thành tố lịch pháp: ngày hoàng đạo/hắc đạo, Thập nhị trực (12 trực xoay vần, mỗi trực hợp/kỵ việc khác nhau), cùng các sao tốt – xấu rơi vào ngày. Trong ngày lại chia 12 canh giờ (mỗi canh 2 tiếng), có 6 giờ hoàng đạo và 6 giờ hắc đạo đổi theo Địa Chi của ngày. Cách dùng đúng là chọn ngày tốt trước, rồi chọn giờ hoàng đạo trong ngày đó.',
  },
  {
    q: 'Kim Lâu, Tam Tai, Hoang Ốc khi xem tuổi nghĩa là gì?',
    a: 'Đây là các tập tục dân gian tính minh bạch để tham khảo khi xem tuổi cưới hoặc làm nhà. Kim Lâu lấy tuổi mụ chia 9, phạm khi dư 1, 3, 6, 8. Hoang Ốc (chỉ dùng cho làm nhà) lấy tuổi mụ chia 6, xấu ở cung Tam Địa Sát, Ngũ Thọ Tử, Lục Hoang Ốc. Tam Tai là 3 năm hạn liên tiếp theo nhóm tam hợp con giáp. Nhãn "phạm" nghĩa là rơi vào hạn dân gian thường kiêng, để bạn biết và tự quyết — không phải định luật.',
  },
  {
    q: 'Thước Lỗ Ban dùng để làm gì?',
    a: 'Thước Lỗ Ban là cây thước phong thủy của nghề mộc cổ truyền, chia chiều dài thành các cung Tốt – Xấu xen kẽ (mỗi loại thước có bộ cung riêng — ví dụ thước 38,8cm gồm Tài, Bệnh, Ly, Nghĩa, Quan, Kiếp, Hại, Bản). Khi đo cửa, bàn thờ, giường…, thợ cố chọn kích thước rơi vào cung tốt. Đây là quy ước truyền thống của thợ, mang tính tham khảo; rơi cung xấu chỉ cần nhích sang kích thước tốt gần nhất, không cần làm lại.',
  },
  {
    q: 'Huyền Không Phi Tinh khác Bát Trạch thế nào?',
    a: 'Bát Trạch tính theo người: từ năm sinh và giới tính suy ra mệnh quái, rồi lập bảng 8 hướng cát/hung — kết quả không đổi theo thời gian. Huyền Không Phi Tinh tính theo thời gian và hướng nhà: chia thời gian thành các Vận 20 năm (hiện là Cửu Vận, 2024–2043) và dựa vào tọa – hướng của ngôi nhà để lập bàn 9 cung với ba tầng sao (vận tinh, sơn tinh, hướng tinh). Hai phương pháp trả lời hai câu hỏi khác nhau, không thay thế nhau. Công cụ Phi Tinh trên hieu.asia làm phần Hạ Quái chuẩn, không làm Thế quái (kiêm hướng) vì khẩu quyết các phái bất đồng.',
  },
  {
    q: 'Cung Phi tính theo năm dương hay năm âm?',
    a: 'Bảng Cung Phi cổ điển vốn tính theo năm âm lịch, đổi mốc quanh Tết Nguyên Đán. Công cụ trên hieu.asia chốt dùng năm dương lịch cho nhất quán toàn site, nên người sinh sát Tết (cuối tháng 12 hoặc đầu tháng 1 dương lịch) nên tự đối chiếu thêm — đây là chỗ các trường phái có thể tính khác nhau. Ngoài ra, số 5 ở trung cung Lạc Thư không có quẻ riêng; có trường phái quy về Khôn hoặc Cấn, còn bảng công cụ dùng chốt nam số 5 ra Càn, nữ số 5 ra Ly.',
  },
  {
    q: 'Công cụ này có "đổi mệnh", "giải hạn" hay trấn yểm không?',
    a: 'Không. Công cụ đưa ra con số và quy tắc minh bạch để tham khảo khi chọn hướng, chọn ngày–giờ, chọn tuổi, chọn kích thước; không phán giàu/nghèo/họa/phúc và không bán dịch vụ "hóa giải / đổi mệnh / giải hạn / trấn yểm". Khi một lựa chọn điểm thấp hoặc phạm hạn, công cụ trình bày như gợi ý dời thời điểm hoặc điều chỉnh để bạn tự cân nhắc.',
  },
];

const JSONLD = [
  article({
    headline: 'Phong Thủy ứng dụng: hướng nhà, ngũ hành, chọn ngày cho người mới',
    description:
      'Phong Thủy ứng dụng: hiểu Bát Trạch để xem hướng nhà hợp tuổi, bổ khuyết ngũ hành, chọn ngày–giờ và xem tuổi. Quy tắc minh bạch để tham khảo, không phán số mệnh.',
    url: '/learn/phong-thuy',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Phong Thủy', url: '/learn/phong-thuy' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Phong Thủy — hướng nhà, ngũ hành & chọn ngày',
    description:
      'Phong Thủy ứng dụng: hai nhánh Loan Đầu và Lý Khí; Bát Trạch (hướng nhà hợp tuổi, tính Cung Phi), Huyền Không Phi Tinh, bổ khuyết ngũ hành, chọn ngày–giờ, xem tuổi và thước Lỗ Ban. Quy tắc minh bạch để tham khảo, không phán số mệnh.',
    url: '/learn/phong-thuy',
  }),
];

export default function LearnPhongThuyPage() {
  return (
    <LearnArticle
      eyebrow="PHONG THỦY · ỨNG DỤNG"
      title={
        <>
          <span className="bg-gold-gradient bg-clip-text text-transparent">Phong Thủy</span>
        </>
      }
      standfirst={
        <>
          "Phong thủy" = gió và nước — nghệ thuật sắp đặt không gian sống hài hòa với môi
          trường và với khí. Trang này giải thích các khái niệm cốt lõi để bạn dùng những
          quy tắc minh bạch ấy như gợi ý tham khảo, không phải lời phán số mệnh.
        </>
      }
      readMeta="15 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Phong Thủy' },
      ]}
      relatedLenses={relatedLearnLenses('phong-thuy')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Nhập năm sinh và giới tính, hệ thống suy ra Cung Phi của bạn và lập bảng 8 hướng theo Bát Trạch để bạn thấy đâu là hướng cát, đâu là hướng cần tránh.',
        href: '/huong-nha',
        label: 'Xem hướng hợp tuổi',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <PhongThuyFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Phong thủy ứng dụng là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                <strong>Phong thủy</strong> (風水, "gió – nước") là hệ thống tri thức cổ
                truyền về việc sắp đặt không gian sống sao cho hài hòa với môi trường và với{' '}
                <strong>khí</strong> (氣). Truyền thống chia làm hai nhánh lớn:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>Loan Đầu</strong> (巒頭) — quan sát <strong>hình thế</strong> thực
                  địa: thế núi, dòng nước, đường đi, vật cản. Nhánh này cần khảo sát hiện
                  trường nên nằm ngoài phạm vi công cụ web.
                </li>
                <li>
                  <strong>Lý Khí</strong> (理氣) — dùng <strong>la bàn và công thức</strong>{' '}
                  để tính hướng và sao. Trong Lý Khí có nhiều trường phái; công cụ trên
                  hieu.asia dùng cả hai trường phái Lý Khí chính:{' '}
                  <strong>Bát Trạch</strong> (tính theo năm sinh và giới tính → mệnh quái → 8
                  hướng cát/hung) và{' '}
                  <strong>
                    <Link href="/phi-tinh" className="underline hover:text-primary">
                      Huyền Không Phi Tinh
                    </Link>
                  </strong>{' '}
                  (lập bàn 9 cung theo vận khí 20 năm và tọa hướng nhà — vận tinh, sơn tinh,
                  hướng tinh).
                </li>
              </ul>
              <p>
                <strong>Định vị rõ ràng:</strong> công cụ đưa ra <strong>con số và quy tắc
                minh bạch để tham khảo</strong> khi chọn hướng, chọn ngày–giờ, chọn tuổi,
                chọn kích thước. Nó <strong>không</strong> phán giàu/nghèo/họa/phúc và{' '}
                <strong>không</strong> bán "hóa giải / đổi mệnh / giải hạn". Phần lớn các quy
                tắc xem tuổi (Tam Tai, Kim Lâu, Hoang Ốc, thước Lỗ Ban) được nêu thẳng là{' '}
                <strong>tập tục dân gian</strong> để bạn biết và tự cân nhắc.
              </p>
              <p>Các công cụ phong thủy hiện có trên hieu.asia:</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  <Link href="/huong-nha" className="underline hover:text-primary">
                    Xem hướng nhà hợp tuổi
                  </Link>{' '}
                  — theo Bát Trạch.
                </li>
                <li>
                  <Link href="/tinh-menh-cuc" className="underline hover:text-primary">
                    Bổ khuyết ngũ hành
                  </Link>{' '}
                  — màu, hướng, nghề, vật phẩm hợp mệnh (kèm trong công cụ Tính Mệnh Cục).
                </li>
                <li>
                  <Link href="/gio-hoang-dao" className="underline hover:text-primary">
                    Giờ hoàng đạo
                  </Link>{' '}
                  — 12 canh giờ tốt/xấu trong ngày.
                </li>
                <li>
                  <Link href="/xem-ngay" className="underline hover:text-primary">
                    Xem ngày tốt theo mục đích
                  </Link>{' '}
                  — chấm điểm ngày.
                </li>
                <li>
                  <Link href="/xem-tuoi-cuoi" className="underline hover:text-primary">
                    Xem tuổi cưới
                  </Link>{' '}
                  và{' '}
                  <Link href="/xem-tuoi-lam-nha" className="underline hover:text-primary">
                    xem tuổi làm nhà
                  </Link>
                  .
                </li>
                <li>
                  <Link href="/thuoc-lo-ban" className="underline hover:text-primary">
                    Thước Lỗ Ban
                  </Link>{' '}
                  — tra kích thước cung tốt/xấu.
                </li>
                <li>
                  <Link href="/phi-tinh" className="underline hover:text-primary">
                    Huyền Không Phi Tinh
                  </Link>{' '}
                  — lập bàn 9 cung theo vận và tọa hướng nhà.
                </li>
              </ul>
            </div>
          ),
        },
        {
          id: 'khi-nguon-goc',
          tocLabel: 'Khí & nguồn gốc',
          heading: 'Khí và nguồn gốc của phong thủy',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Khái niệm nền của cả bộ môn là <strong>khí</strong> (氣) — theo quan niệm cổ,
                đây là dòng sinh khí, thứ "năng lượng sống" luân chuyển trong một nơi chốn.
                Cái tên <strong>phong thủy</strong> (風水, gió và nước) phản ánh hai yếu tố tự
                nhiên mà người xưa xem là định hình chất lượng một chỗ ở. Toàn bộ bộ môn xoay
                quanh việc sắp đặt không gian sao cho khí lưu thông thuận — không tù đọng, cũng
                không tán loạn.
              </p>
              <p>
                Về nguồn gốc, phong thủy lớn lên từ tập quán rất đời thường: quan sát địa hình
                để chọn đất an cư. Người xưa nhìn thế núi, dòng nước, hướng gió mà định chỗ dựng
                làng, dựng nhà, đặt mộ. Đó chính là gốc của nhánh Loan Đầu (nói ở phần sau). Về
                sau, kinh nghiệm ấy được hệ thống hóa thành các sách chỉ dẫn.
              </p>
              <p>
                Các sách cổ điển làm nền cho phần hướng nhà và dương trạch (nhà ở) thường được
                nhắc tới gồm <em>Hoàng Đế Trạch Kinh</em> (黃帝宅經), <em>Dương Trạch Tam Yếu</em>{' '}
                (陽宅三要) và <em>Bát Trạch Minh Kính</em> (八宅明鏡). Phần ngũ hành làm gốc lý
                thuyết thì dựa trên các trước tác cổ như <em>Hoàng Đế Nội Kinh</em> (黃帝內經) và{' '}
                <em>Xuân Thu Phồn Lộ</em> (春秋繁露). Trang này chỉ mượn khung ý của các nguồn đã
                lưu truyền lâu đời, không khẳng định chi tiết tác giả hay niên đại còn tranh luận.
              </p>
            </div>
          ),
        },
        {
          id: 'hai-nhanh',
          tocLabel: 'Loan Đầu & Lý Khí',
          heading: 'Hai nhánh lớn: Loan Đầu và Lý Khí',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Phong thủy truyền thống chia làm hai nhánh bổ trợ nhau. Hiểu rõ ranh giới này
                giúp bạn biết công cụ web làm được phần nào, phần nào vẫn phải ra thực địa.
              </p>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Loan Đầu — đọc thế đất bằng mắt
                </h3>
                <p>
                  <strong>Loan Đầu</strong> (巒頭) đọc địa thế bằng quan sát trực tiếp: dáng núi
                  che chở phía sau, dòng nước và đường đi phía trước, tầm nhìn thoáng hay bị vật
                  cản chắn. Nguyên tắc gọn của Loan Đầu là tìm thế đất có chỗ dựa vững phía sau và
                  khoảng thoáng (nước, sân, không gian) phía trước. Vì phải đứng tại chỗ mà nhìn
                  địa hình thật, phần này cần khảo sát hiện trường; một công cụ web không thay được
                  đôi mắt tại thực địa, nên Loan Đầu nằm ngoài phạm vi.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Lý Khí — tính theo hướng và thời gian
                </h3>
                <p>
                  <strong>Lý Khí</strong> (理氣) đi theo hướng ngược lại: dùng la bàn và công thức
                  để tính, không phụ thuộc cảnh quan trước mắt. Trong Lý Khí có nhiều trường phái;
                  công cụ trên hieu.asia làm hai nhánh chính. <strong>Bát Trạch</strong> tính theo{' '}
                  <em>người</em> (năm sinh, giới tính → mệnh quái → 8 hướng). <strong>Huyền Không
                  Phi Tinh</strong> tính theo <em>thời gian</em> (Vận — chu kỳ 20 năm) cùng tọa
                  hướng của ngôi nhà.
                </p>
              </div>
              <p>
                Nói thẳng giới hạn: phần Lý Khí — con số và quy tắc theo hướng, theo thời gian —
                là thứ công cụ tính được và trình bày minh bạch. Phần Loan Đầu — thế đất, dòng
                chảy, vật cản — vẫn phải quan sát thực địa. Một buổi xem phong thủy đầy đủ cần cả
                hai; trang này và các công cụ chỉ lo được phần Lý Khí.
              </p>
            </div>
          ),
        },
        {
          id: 'khai-niem-cot-loi',
          tocLabel: 'Khái niệm cốt lõi',
          heading: 'Các khái niệm cốt lõi',
          children: (
            <div className="space-y-6 text-foreground/85 leading-relaxed">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Ngũ hành và hai vòng quan hệ
                </h3>
                <p>
                  Năm hành <strong>Kim · Mộc · Thủy · Hỏa · Thổ</strong> liên hệ với nhau qua
                  hai vòng:
                </p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>
                    <strong>Tương sinh</strong> (nuôi dưỡng): Mộc → Hỏa → Thổ → Kim → Thủy →
                    Mộc.
                  </li>
                  <li>
                    <strong>Tương khắc</strong> (chế ngự): Mộc khắc Thổ, Thổ khắc Thủy, Thủy
                    khắc Hỏa, Hỏa khắc Kim, Kim khắc Mộc.
                  </li>
                </ul>
                <p>
                  Hai vòng này là gốc để suy ra màu hợp, hướng hợp, và cả luật cát–hung của
                  tám du niên tinh trong Bát Trạch.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Bát quái hậu thiên — 8 quẻ ứng 8 hướng
                </h3>
                <p>
                  Theo Hậu Thiên Bát Quái, mỗi quẻ ứng một hướng và một hành, đồng thời thuộc
                  về Đông tứ hoặc Tây tứ:
                </p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>Khảm (Thủy) — Bắc — Đông tứ</li>
                  <li>Cấn (Thổ) — Đông Bắc — Tây tứ</li>
                  <li>Chấn (Mộc) — Đông — Đông tứ</li>
                  <li>Tốn (Mộc) — Đông Nam — Đông tứ</li>
                  <li>Ly (Hỏa) — Nam — Đông tứ</li>
                  <li>Khôn (Thổ) — Tây Nam — Tây tứ</li>
                  <li>Đoài (Kim) — Tây — Tây tứ</li>
                  <li>Càn (Kim) — Tây Bắc — Tây tứ</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Cung Phi và hai nhóm mệnh
                </h3>
                <p>
                  <strong>Cung Phi</strong> (命卦, mệnh quái) là quẻ đại diện cho một người,
                  tính theo năm sinh dương lịch và giới tính. Tám quẻ chia làm hai nhóm
                  "đồng khí":
                </p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>
                    <strong>Đông tứ mệnh:</strong> Khảm, Ly, Chấn, Tốn — hợp 4 hướng Bắc,
                    Nam, Đông, Đông Nam.
                  </li>
                  <li>
                    <strong>Tây tứ mệnh:</strong> Càn, Khôn, Cấn, Đoài — hợp 4 hướng Tây Bắc,
                    Tây Nam, Đông Bắc, Tây.
                  </li>
                </ul>
                <p>
                  Người thuộc nhóm nào thì 4 hướng cùng nhóm gặp toàn sao cát, còn 4 hướng
                  nhóm kia thành sao hung. Vì vậy, bước đầu tiên khi xem hướng là xác định
                  bạn thuộc Đông tứ hay Tây tứ. (Có một lưu ý: bảng Cung Phi cổ điển vốn tính
                  theo năm âm lịch, nên người sinh sát Tết nên tự đối chiếu thêm — đây là chỗ
                  các trường phái có thể khác nhau.)
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Tám du niên tinh — 4 cát, 4 hung
                </h3>
                <p>
                  "Du niên" là các sao xoay vần theo hướng; mỗi hướng so với mệnh quái mang
                  một sao.
                </p>
                <p>
                  <strong>Bốn sao cát</strong> (tốt giảm dần): <strong>Sinh Khí</strong>{' '}
                  (công danh, tài lộc, sức sống), <strong>Thiên Y</strong> (sức khỏe, quý
                  nhân), <strong>Diên Niên</strong> (hòa hợp, hôn nhân bền lâu),{' '}
                  <strong>Phục Vị</strong> (ổn định, tĩnh tâm — chính là hướng tọa của quẻ
                  mệnh).
                </p>
                <p>
                  <strong>Bốn sao hung</strong> (nặng giảm dần): <strong>Tuyệt Mệnh</strong>{' '}
                  (hung nặng nhất), <strong>Ngũ Quỷ</strong> (thị phi, hao tài),{' '}
                  <strong>Lục Sát</strong> (trục trặc, tiểu nhân), <strong>Họa Hại</strong>{' '}
                  (hao hụt nhẹ, miệng tiếng).
                </p>
                <p>
                  Điểm dễ hiểu sai: trong Bát Trạch, "tốt/xấu" gắn với{' '}
                  <strong>việc gì đặt ở đâu</strong>, không phải dán nhãn số phận. Ví dụ quy
                  tắc bếp truyền thống là "tọa hung – hướng cát" (đặt bếp ở vùng xấu nhưng
                  miệng bếp quay về hướng tốt). Tất cả là gợi ý bố trí để tham khảo, không
                  phải bảo đảm kết quả.
                </p>
              </div>
            </div>
          ),
        },
        {
          id: 'tinh-cung-phi',
          tocLabel: 'Tính Cung Phi',
          heading: 'Tính Cung Phi của bạn',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Cung Phi tính bằng hai bước. Bước một: cộng dồn các chữ số của năm sinh dương
                lịch, nếu ra số hai chữ số thì cộng tiếp cho tới khi còn một số từ 1 đến 9. Bước
                hai: tra bảng dưới đây theo giới tính.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-foreground">
                      <th className="py-2 pr-4 font-semibold">Số rút gọn</th>
                      <th className="py-2 pr-4 font-semibold">Nam → Cung Phi</th>
                      <th className="py-2 font-semibold">Nữ → Cung Phi</th>
                    </tr>
                  </thead>
                  <tbody className="align-top">
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">1</td>
                      <td className="py-2 pr-4">Khảm (Đông tứ)</td>
                      <td className="py-2">Cấn (Tây tứ)</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">2</td>
                      <td className="py-2 pr-4">Ly (Đông tứ)</td>
                      <td className="py-2">Càn (Tây tứ)</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">3</td>
                      <td className="py-2 pr-4">Cấn (Tây tứ)</td>
                      <td className="py-2">Đoài (Tây tứ)</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">4</td>
                      <td className="py-2 pr-4">Đoài (Tây tứ)</td>
                      <td className="py-2">Cấn (Tây tứ)</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">5</td>
                      <td className="py-2 pr-4">Càn (Tây tứ)</td>
                      <td className="py-2">Ly (Đông tứ)</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">6</td>
                      <td className="py-2 pr-4">Khôn (Tây tứ)</td>
                      <td className="py-2">Khảm (Đông tứ)</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">7</td>
                      <td className="py-2 pr-4">Tốn (Đông tứ)</td>
                      <td className="py-2">Khôn (Tây tứ)</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">8</td>
                      <td className="py-2 pr-4">Chấn (Đông tứ)</td>
                      <td className="py-2">Chấn (Đông tứ)</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-foreground">9</td>
                      <td className="py-2 pr-4">Khôn (Tây tứ)</td>
                      <td className="py-2">Tốn (Đông tứ)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="rounded border border-border bg-card/40 p-4 space-y-2">
                <p className="font-semibold text-foreground">
                  Ví dụ: người sinh năm 1990
                </p>
                <p>
                  Cộng dồn: 1 + 9 + 9 + 0 = 19. Còn hai chữ số nên cộng tiếp: 1 + 9 = 10, rồi 1 +
                  0 = 1. Vậy số rút gọn là <strong>1</strong>. Tra bảng: nam ra{' '}
                  <strong>Khảm</strong> (thuộc Đông tứ mệnh), nữ ra <strong>Cấn</strong> (thuộc Tây
                  tứ mệnh).
                </p>
                <p className="text-sm text-foreground/70">
                  Cộng lại lần nữa để chắc: 1 + 9 + 9 + 0 = 19 → 1 + 9 = 10 → 1 + 0 = 1. Đúng là 1.
                </p>
              </div>
              <p className="text-sm text-foreground/70">
                Lưu ý 1 — năm âm hay năm dương: bảng Cung Phi cổ điển vốn tính theo{' '}
                <strong>năm âm lịch</strong> (đổi mốc quanh Tết Nguyên Đán), nên người sinh sát Tết
                (cuối tháng 12 hoặc đầu tháng 1 dương lịch) có thể lệch một năm. Công cụ chốt dùng
                năm dương lịch cho nhất quán; ai sinh sát Tết nên tự đối chiếu thêm. Đây là chỗ các
                trường phái có thể tính khác.
              </p>
              <p className="text-sm text-foreground/70">
                Lưu ý 2 — số 5 không có quẻ riêng: trong Lạc Thư, số 5 ở trung cung không ứng quẻ
                nào. Có trường phái quy nam số 5 về Khôn (hoặc Cấn), nữ về Cấn (hoặc Khôn). Bảng tra
                trực tiếp mà công cụ dùng chốt nam số 5 ra <strong>Càn</strong>, nữ số 5 ra{' '}
                <strong>Ly</strong> — cứ bám theo kết quả công cụ.
              </p>
            </div>
          ),
        },
        {
          id: 'du-nien-tinh',
          tocLabel: 'Tám du niên tinh',
          heading: 'Tám du niên tinh: 4 cát, 4 hung và cách bố trí',
          children: (
            <div className="space-y-5 text-foreground/85 leading-relaxed">
              <p>
                Mỗi hướng, so với mệnh quái của bạn, mang một sao gọi là{' '}
                <strong>du niên tinh</strong>. Có tám sao: bốn cát và bốn hung. Bảng dưới nêu tên,
                chữ Hán, hành, ý nghĩa và gợi ý nên đặt gì về hướng mang sao đó.
              </p>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Bốn sao cát (tốt giảm dần)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-foreground">
                        <th className="py-2 pr-4 font-semibold">Sao</th>
                        <th className="py-2 pr-4 font-semibold">Hán</th>
                        <th className="py-2 pr-4 font-semibold">Hành</th>
                        <th className="py-2 pr-4 font-semibold">Chủ về</th>
                        <th className="py-2 font-semibold">Nên đặt về hướng này</th>
                      </tr>
                    </thead>
                    <tbody className="align-top">
                      <tr className="border-b border-border/60">
                        <td className="py-2 pr-4 font-medium text-foreground">Sinh Khí</td>
                        <td className="py-2 pr-4">生氣</td>
                        <td className="py-2 pr-4">Mộc</td>
                        <td className="py-2 pr-4">Cát tinh số 1: công danh, tài lộc, sức sống, thăng tiến</td>
                        <td className="py-2">Cửa chính, bàn làm việc; miệng bếp quay về</td>
                      </tr>
                      <tr className="border-b border-border/60">
                        <td className="py-2 pr-4 font-medium text-foreground">Thiên Y</td>
                        <td className="py-2 pr-4">天醫</td>
                        <td className="py-2 pr-4">Thổ</td>
                        <td className="py-2 pr-4">Sức khỏe và quý nhân: bình an, hồi phục, được nâng đỡ</td>
                        <td className="py-2">Hướng giường ngủ, bàn ăn, bếp</td>
                      </tr>
                      <tr className="border-b border-border/60">
                        <td className="py-2 pr-4 font-medium text-foreground">Diên Niên</td>
                        <td className="py-2 pr-4">延年</td>
                        <td className="py-2 pr-4">Kim</td>
                        <td className="py-2 pr-4">Hòa hợp: hôn nhân, tình cảm, quan hệ bền lâu</td>
                        <td className="py-2">Phòng ngủ vợ chồng, phòng khách, bàn tiếp khách</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium text-foreground">Phục Vị</td>
                        <td className="py-2 pr-4">伏位</td>
                        <td className="py-2 pr-4">Mộc</td>
                        <td className="py-2 pr-4">Ổn định: yên định, củng cố, tĩnh tâm (hướng tọa của quẻ mệnh)</td>
                        <td className="py-2">Bàn thờ, phòng học, nơi cần an tĩnh</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Bốn sao hung (nặng giảm dần)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-foreground">
                        <th className="py-2 pr-4 font-semibold">Sao</th>
                        <th className="py-2 pr-4 font-semibold">Hán</th>
                        <th className="py-2 pr-4 font-semibold">Hành</th>
                        <th className="py-2 pr-4 font-semibold">Chủ về</th>
                        <th className="py-2 font-semibold">Lời khuyên</th>
                      </tr>
                    </thead>
                    <tbody className="align-top">
                      <tr className="border-b border-border/60">
                        <td className="py-2 pr-4 font-medium text-foreground">Tuyệt Mệnh</td>
                        <td className="py-2 pr-4">絕命</td>
                        <td className="py-2 pr-4">Kim</td>
                        <td className="py-2 pr-4">Hung nặng nhất: hao tổn sức khỏe, tinh thần</td>
                        <td className="py-2">Tránh đặt cửa chính, giường, bếp về hướng này</td>
                      </tr>
                      <tr className="border-b border-border/60">
                        <td className="py-2 pr-4 font-medium text-foreground">Ngũ Quỷ</td>
                        <td className="py-2 pr-4">五鬼</td>
                        <td className="py-2 pr-4">Hỏa</td>
                        <td className="py-2 pr-4">Thị phi, hao tài, xáo trộn</td>
                        <td className="py-2">Tránh cửa/bếp/giường; có thể dùng cho kho, nhà vệ sinh</td>
                      </tr>
                      <tr className="border-b border-border/60">
                        <td className="py-2 pr-4 font-medium text-foreground">Lục Sát</td>
                        <td className="py-2 pr-4">六煞</td>
                        <td className="py-2 pr-4">Thủy</td>
                        <td className="py-2 pr-4">Trục trặc, vướng mắc, tiểu nhân, mâu thuẫn</td>
                        <td className="py-2">Tránh hướng cửa, giường, bếp</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium text-foreground">Họa Hại</td>
                        <td className="py-2 pr-4">禍害</td>
                        <td className="py-2 pr-4">Thổ</td>
                        <td className="py-2 pr-4">Hao hụt nhẹ, lục đục, miệng tiếng</td>
                        <td className="py-2">Nên tránh nếu còn lựa chọn tốt hơn</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                Vì sao bếp lại đặt ở hướng hung? Trong Bát Trạch, tốt hay xấu gắn với{' '}
                <strong>việc gì đặt ở đâu</strong>, không phải nhãn số phận. Quy tắc bếp truyền
                thống là <strong>"tọa hung – hướng cát"</strong>: đặt bếp ở vùng mang sao hung (ý
                niệm là ngọn lửa "đè" được vùng khí xấu), nhưng miệng bếp quay về hướng có sao cát
                (để nguồn khí đi vào lấy từ chỗ tốt). Đây là điểm dễ nói nhầm — và luôn nhớ đó là
                gợi ý bố trí để tham khảo, không phải bảo đảm kết quả.
              </p>
            </div>
          ),
        },
        {
          id: 'phi-tinh-lop-thoi-gian',
          tocLabel: 'Huyền Không Phi Tinh',
          heading: 'Huyền Không Phi Tinh — lớp thời gian của Lý Khí',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Bát Trạch trả lời "hướng nào hợp với người này". Huyền Không Phi Tinh thêm một câu
                hỏi khác: "ngôi nhà này, trong thời kỳ này, khí vận ra sao". Nó là một trường phái
                Lý Khí khác, thêm vào <strong>lớp thời gian</strong> mà Bát Trạch không xét.
              </p>
              <p>
                <strong>Cửu tinh</strong> là chín sao đánh số theo Lạc Thư, từ 1 đến 9, mỗi số mang
                một tính chất; chúng "bay" (phi) qua chín cung của ngôi nhà. Thời gian được chia
                thành các <strong>Vận</strong>, mỗi Vận 20 năm. Hiện nay là <strong>Cửu Vận</strong>{' '}
                (vận 9), kéo dài 2024–2043; ngay trước đó là Bát Vận (2004–2023). Sao đương vận thay
                đổi theo từng thời kỳ, nên đánh giá phong thủy của cùng một ngôi nhà cũng đổi theo.
              </p>
              <p>
                Với mỗi nhà, người ta lập ba tầng sao: <strong>vận tinh</strong> (bàn vận),{' '}
                <strong>sơn tinh</strong> (山盤, thiên về người và nhân đinh) và{' '}
                <strong>hướng tinh</strong> (向盤, thiên về tài lộc), bằng cách cho sao nhập trung
                cung rồi bay thuận hoặc nghịch theo tọa – hướng của nhà (một trong 24 sơn, mỗi sơn
                15 độ). Khi ba bàn xếp xong sẽ hiện ra các "cách cục", ví dụ{' '}
                <strong>Vượng sơn Vượng hướng</strong> (旺山旺向 — cả người lẫn của đều được thời).
              </p>
              <p>
                Khác biệt cốt lõi: <strong>Bát Trạch tĩnh</strong> — gắn với người (mệnh quái),
                không đổi theo thời gian, chỉ cần năm sinh và giới tính. <strong>Phi Tinh động</strong>{' '}
                — gắn với thời gian (Vận) cùng hướng nhà (tọa – hướng), không dùng năm sinh chủ nhà.
                Hai phương pháp trả lời hai câu hỏi khác nhau, không thay thế nhau.
              </p>
              <p>
                Công cụ{' '}
                <Link href="/phi-tinh" className="underline hover:text-primary">
                  Huyền Không Phi Tinh
                </Link>{' '}
                trên hieu.asia lập bàn 9 cung theo phương pháp <strong>Hạ Quái</strong> (下卦) tiêu
                chuẩn — đã kiểm chứng tái lập đúng các cục kinh điển. Để minh bạch, engine{' '}
                <strong>không</strong> làm phần <strong>Thế quái</strong> (替卦, kiêm hướng) vì khẩu
                quyết các phái bất đồng; ca kiêm hướng chỉ được gắn cờ tham khảo. Bài này dừng ở mức
                khái niệm, không đi vào an sao chi tiết.
              </p>
            </div>
          ),
        },
        {
          id: 'bo-khuyet-ngu-hanh',
          tocLabel: 'Bổ khuyết ngũ hành',
          heading: 'Bổ khuyết ngũ hành: màu, hướng, nghề theo hành',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Từ hành chủ đạo của một người, có thể gợi ý môi trường "hợp gu" hành đó. Cách chọn:
                màu hợp lấy màu của hành bản mệnh cộng màu của hành sinh ra nó (mẹ sinh con); hướng
                hợp là hướng cố hữu của hành trong phong thủy.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-foreground">
                      <th className="py-2 pr-4 font-semibold">Hành</th>
                      <th className="py-2 pr-4 font-semibold">Màu hợp</th>
                      <th className="py-2 pr-4 font-semibold">Hướng tốt</th>
                      <th className="py-2 pr-4 font-semibold">Khí chất (xu hướng)</th>
                      <th className="py-2 font-semibold">Nhóm nghề gợi ý</th>
                    </tr>
                  </thead>
                  <tbody className="align-top">
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Kim</td>
                      <td className="py-2 pr-4">Trắng, bạc, vàng kim, vàng nhạt</td>
                      <td className="py-2 pr-4">Tây, Tây Bắc</td>
                      <td className="py-2 pr-4">Quyết đoán, kỷ luật, trọng nghĩa; lưu ý dễ cứng nhắc</td>
                      <td className="py-2">Tài chính, kỹ thuật/cơ khí, luật/hành chính, y tế</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Mộc</td>
                      <td className="py-2 pr-4">Xanh lá, xanh lục, xanh ngọc, xanh non</td>
                      <td className="py-2 pr-4">Đông, Đông Nam</td>
                      <td className="py-2 pr-4">Vươn lên, học hỏi, hoạch định; lưu ý dễ dàn trải</td>
                      <td className="py-2">Giáo dục/tư vấn, nông–lâm–môi trường, viết/xuất bản, y học cổ truyền</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Thủy</td>
                      <td className="py-2 pr-4">Đen, xanh đen, xanh đậm, bạc lạnh</td>
                      <td className="py-2 pr-4">Bắc</td>
                      <td className="py-2 pr-4">Linh hoạt, trí tuệ, giao tiếp; lưu ý dễ thiếu quyết đoán</td>
                      <td className="py-2">Nghiên cứu/phân tích, vận tải/logistics, triết–tâm lý, truyền thông</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Hỏa</td>
                      <td className="py-2 pr-4">Đỏ, cam, hồng đậm, hồng</td>
                      <td className="py-2 pr-4">Nam</td>
                      <td className="py-2 pr-4">Nhiệt huyết, truyền cảm hứng; lưu ý dễ "bùng rồi tắt"</td>
                      <td className="py-2">Truyền thông/marketing, giải trí, lãnh đạo/khởi nghiệp, thể thao</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-foreground">Thổ</td>
                      <td className="py-2 pr-4">Vàng, nâu đất, cam đất, be/kem</td>
                      <td className="py-2 pr-4">Trung tâm, Đông Bắc, Tây Nam</td>
                      <td className="py-2 pr-4">Ổn định, đáng tin; lưu ý dễ trì trệ, bảo thủ</td>
                      <td className="py-2">Bất động sản/xây dựng, nông nghiệp/thực phẩm, kế toán/bảo hiểm, chăm sóc sức khỏe</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-foreground/70">
                Về vật phẩm và môi trường: Kim hợp đồ kim loại, đá trắng, không gian ngăn nắp trung
                tính; Mộc hợp cây xanh, đồ gỗ/tre, nhiều cửa sổ; Thủy hợp bể cá hoặc đài phun nhỏ,
                màu navy, đồ thủy tinh; Hỏa hợp nến/đèn ấm, sắc đỏ – cam điểm xuyết; Thổ hợp gốm
                sứ/đá/gạch nung, màu nâu ấm, cây mọng nước.
              </p>
              <p className="text-sm text-foreground/70">
                Lưu ý nguồn "hành chủ đạo": công cụ lấy hành từ <strong>Cục</strong> trong lá số Tử
                Vi (ví dụ Thủy Nhị Cục, Kim Tứ Cục). Trong Bát Tự (Tứ Trụ), khái niệm tương đương
                lại là <strong>Nhật Chủ</strong> cộng <strong>Dụng Thần</strong> — hai hệ có thể ra
                hành khác nhau, đó là do phương pháp tính khác, không phải lỗi. Và hãy hiểu đây là
                cách <strong>điều chỉnh môi trường để dễ chịu, hợp gu</strong> — không phải bùa may,
                càng không phải "đeo cái này thì đổi vận".
              </p>
            </div>
          ),
        },
        {
          id: 'thuoc-lo-ban',
          tocLabel: 'Thước Lỗ Ban',
          heading: 'Thước Lỗ Ban: bốn loại thước và 8 cung',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Thước Lỗ Ban là cây thước phong thủy của nghề mộc cổ truyền (gắn với tên Lỗ Ban —
                ông tổ nghề mộc). Thước chia chiều dài thành các cung Tốt – Xấu xen kẽ; khi đo cửa,
                bàn thờ, giường…, thợ cố chọn kích thước rơi vào cung tốt. Đây là quy ước truyền
                thống của thợ, mang tính tham khảo. Có bốn loại thước, mỗi loại một chu kỳ và một
                mục đích:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-foreground">
                      <th className="py-2 pr-4 font-semibold">Loại thước</th>
                      <th className="py-2 pr-4 font-semibold">Chu kỳ</th>
                      <th className="py-2 font-semibold">Dùng cho</th>
                    </tr>
                  </thead>
                  <tbody className="align-top">
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Lỗ Ban 42.9 cm</td>
                      <td className="py-2 pr-4">42.9 cm</td>
                      <td className="py-2">Thông thủy — cửa, cổng, bàn thờ (khoảng trống lọt lòng)</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Lỗ Ban 38.8 cm</td>
                      <td className="py-2 pr-4">38.8 cm</td>
                      <td className="py-2">Dương trạch — đồ vật, giường, tủ</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Thước Đinh Lan 38.4 cm</td>
                      <td className="py-2 pr-4">38.4 cm</td>
                      <td className="py-2">Quan tài, mộ phần — đồ thờ gia tiên</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-foreground">Thước Ban 52.2 cm</td>
                      <td className="py-2 pr-4">52.2 cm</td>
                      <td className="py-2">Âm trạch — mộ phần (khối xây)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Bộ cung kinh điển của thước Lỗ Ban gồm 8 cung xen kẽ tốt – xấu, mỗi cung mang một
                chữ Hán nói lên ý nghĩa:
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li><strong>Tài</strong> (財) — tiền tài, của cải: cung tốt.</li>
                <li><strong>Bệnh</strong> (病) — bệnh tật, ốm đau: cung xấu.</li>
                <li><strong>Ly</strong> (離) — chia lìa, xa cách: cung xấu.</li>
                <li><strong>Nghĩa</strong> (義) — việc nghĩa, hợp đạo lý: cung tốt.</li>
                <li><strong>Quan</strong> (官) — công danh, quan lộc: cung tốt.</li>
                <li><strong>Kiếp</strong> (劫) — tai kiếp, mất mát: cung xấu.</li>
                <li><strong>Hại</strong> (害) — tổn hại, trắc trở: cung xấu.</li>
                <li><strong>Bản</strong> (本, còn đọc Bổn) — gốc, nền tảng, bản thân: cung tốt.</li>
              </ul>
              <p>
                Bốn cung tốt là Tài, Nghĩa, Quan, Bản; bốn cung xấu là Bệnh, Ly, Kiếp, Hại. Mỗi
                cung lớn còn chia thành các ô con mang ý nghĩa cụ thể hơn. Vì kích thước thật thường
                vượt một chu kỳ (ví dụ cửa cao 210 cm), công cụ{' '}
                <Link href="/thuoc-lo-ban" className="underline hover:text-primary">
                  Thước Lỗ Ban
                </Link>{' '}
                lấy phần dư trong chu kỳ để xác định cung, rồi trả về tốt/xấu kèm gợi ý kích thước
                tốt gần nhất (nhỏ hơn hoặc lớn hơn).
              </p>
              <p className="text-sm text-foreground/70">
                Rơi cung xấu không có nghĩa xui xẻo chắc chắn — chỉ cần nhích sang kích thước tốt
                gần nhất, không cần đập đi làm lại. Các xưởng và sách ghi chiều dài chu kỳ, cách
                phân ô con hơi khác nhau (ví dụ 42.9 so với 43.0 cm); công cụ chốt theo bộ số đã cấu
                hình, nên bạn cứ theo kết quả công cụ, tránh tranh luận con số lẻ.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <PhongThuyDepth />,
        },
        {
          id: 'ung-dung-luu-y',
          tocLabel: 'Ứng dụng & lưu ý',
          heading: 'Cách ứng dụng và những lưu ý',
          children: (
            <div className="space-y-6 text-foreground/85 leading-relaxed">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Bổ khuyết ngũ hành: màu, hướng, nghề
                </h3>
                <p>
                  Từ hành chủ đạo của một người, có thể gợi ý môi trường hỗ trợ hành đó.{' '}
                  <strong>Màu hợp</strong> lấy màu của hành bản mệnh cộng màu của hành sinh ra
                  nó. <strong>Hướng hợp</strong> là hướng cố hữu của hành: Kim → Tây/Tây Bắc,
                  Mộc → Đông/Đông Nam, Thủy → Bắc, Hỏa → Nam, Thổ → Trung tâm/Đông Bắc/Tây
                  Nam. Đây là gợi ý trang trí và định hướng để tham khảo, không cần cứng nhắc
                  và càng không phải "đeo cái này thì đổi vận".
                </p>
                <p className="text-sm text-foreground/70">
                  Lưu ý: hành chủ đạo có thể được tính khác nhau giữa các hệ (ví dụ qua Cục
                  trong Tử Vi, hay qua Nhật Chủ và Dụng Thần trong Bát Tự) — nếu hai nơi cho
                  ra hành khác nhau thì đó là do phương pháp tính khác nhau, không phải lỗi.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Chọn ngày và giờ
                </h3>
                <p>
                  Một ngày được cân nhắc theo nhiều thành tố lịch pháp: ngày{' '}
                  <strong>hoàng đạo/hắc đạo</strong>, <strong>Thập nhị trực</strong> (12 trực
                  xoay vần — Kiến, Trừ, Mãn, Bình, Định, Chấp, Phá, Nguy, Thành, Thâu, Khai,
                  Bế — mỗi trực hợp/kỵ việc khác nhau), cùng các <strong>sao tốt – xấu</strong>{' '}
                  rơi vào ngày (ví dụ Thiên Đức, Nguyệt Đức, Thiên Hỷ là tốt; Cô Thần, Quả
                  Tú, Đại Hao, Tiểu Hao là cần tránh). Trong ngày lại chia 12 canh giờ; mỗi
                  ngày có 6 giờ hoàng đạo và 6 giờ hắc đạo, đổi theo Địa Chi của ngày.
                </p>
                <p>
                  Cách dùng đúng là <strong>chọn ngày tốt trước</strong>, rồi mới chọn giờ
                  hoàng đạo trong ngày đó để khởi sự. "Giờ xấu" trong phong tục là lời nhắc
                  thận trọng hơn, không phải điềm tai họa chắc chắn. Một số ngày dân gian
                  thường kiêng việc trọng như Tam Nương (mùng 3, 7, 13, 18, 22, 27 âm lịch)
                  và Nguyệt Kỵ (mùng 5, 14, 23 âm lịch) — đây là tập tục để cân nhắc.
                </p>
                <p className="text-sm text-foreground/70">
                  Định vị quan trọng: xem ngày là tập tục theo lịch pháp truyền thống để tham
                  khảo và tạo tâm thế khởi sự tốt — không bảo đảm thành công và không thay thế
                  thẩm định pháp lý hay an toàn. Xem ngày ký hợp đồng không thay luật sư; ngày
                  mua xe đẹp không bảo đảm lái xe an toàn.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Xem tuổi và thước Lỗ Ban
                </h3>
                <p>
                  Khi xem tuổi cưới hoặc làm nhà, một số quy tắc tập tục được tính minh bạch:{' '}
                  <strong>Kim Lâu</strong> (tuổi mụ chia 9, phạm khi dư 1, 3, 6, 8),{' '}
                  <strong>Hoang Ốc</strong> (tuổi mụ chia 6, xấu ở cung Tam Địa Sát, Ngũ Thọ
                  Tử, Lục Hoang Ốc — chỉ dùng cho làm nhà), <strong>Tam Tai</strong> (3 năm
                  hạn liên tiếp theo nhóm tam hợp con giáp) và <strong>Lục Xung</strong> (chi
                  năm xem xung chi năm sinh). <strong>Thước Lỗ Ban</strong> tra một kích thước
                  xem rơi vào cung Tốt hay Xấu; công cụ có nhiều loại thước với bộ tên cung khác
                  nhau (ví dụ thước 38,8cm gồm Tài, Bệnh, Ly, Nghĩa, Quan, Kiếp, Hại, Bản).
                </p>
                <p className="text-sm text-foreground/70">
                  Tất cả đều là tập tục để bạn biết và tự quyết, không phải định luật. Nhãn
                  "phạm" nghĩa là rơi vào hạn dân gian thường kiêng; rơi cung xấu trên thước
                  chỉ cần nhích sang kích thước tốt gần nhất, không cần làm lại. Có trường
                  phái tính Kim Lâu theo tuổi chú rể hoặc xét cả hai — đây là chỗ các nơi
                  tính khác nhau.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Những gì ngoài phạm vi công cụ
                </h3>
                <p>
                  Để không bịa, có vài phần công cụ web không làm: <strong>Loan Đầu / hình
                  thế</strong> (thế đất, sơn thủy — cần khảo sát hiện trường), <strong>bố cục
                  nội thất chi tiết, trấn yểm, vật phẩm phong thủy</strong>, và phần{' '}
                  <strong>Thế quái (kiêm hướng)</strong> của Phi Tinh (khẩu quyết các phái bất
                  đồng — công cụ chỉ làm Hạ Quái chuẩn). Công cụ chỉ gợi ý hướng cùng màu/môi
                  trường để tham khảo, và không bán dịch vụ "hóa giải".
                </p>
              </div>
            </div>
          ),
        },
        {
          id: 'so-tay-thuat-ngu',
          tocLabel: 'Sổ tay thuật ngữ',
          heading: 'Sổ tay thuật ngữ',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>Những từ hay gặp khi đọc về phong thủy ứng dụng, giải nghĩa gọn:</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-foreground">
                      <th className="py-2 pr-4 font-semibold">Thuật ngữ</th>
                      <th className="py-2 font-semibold">Nghĩa ngắn</th>
                    </tr>
                  </thead>
                  <tbody className="align-top">
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Khí (氣)</td>
                      <td className="py-2">Dòng sinh khí theo quan niệm cổ; thứ phong thủy muốn cho lưu thông thuận.</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Loan Đầu (巒頭)</td>
                      <td className="py-2">Nhánh đọc thế đất bằng quan sát thực địa: núi, nước, đường, vật cản.</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Lý Khí (理氣)</td>
                      <td className="py-2">Nhánh dùng la bàn và công thức để tính hướng, tính sao.</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Ngũ hành (五行)</td>
                      <td className="py-2">Năm hành Kim, Mộc, Thủy, Hỏa, Thổ, liên hệ qua tương sinh và tương khắc.</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Bát quái hậu thiên (後天八卦)</td>
                      <td className="py-2">Tám quẻ ứng tám hướng; nền để tính Cung Phi và du niên tinh.</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Bát Trạch (八宅)</td>
                      <td className="py-2">Trường phái Lý Khí tính hướng theo mệnh quái của người.</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Cung Phi (命卦)</td>
                      <td className="py-2">Quẻ bản mệnh của một người, tính từ năm sinh và giới tính.</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Đông tứ / Tây tứ mệnh</td>
                      <td className="py-2">Hai nhóm quẻ; mỗi nhóm hợp một bộ bốn hướng riêng.</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Du niên tinh (遊年星)</td>
                      <td className="py-2">Tám sao gán cho tám hướng so với mệnh quái: bốn cát, bốn hung.</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Tọa – hướng</td>
                      <td className="py-2">"Tọa" là lưng nhà dựa vào, "hướng" là mặt nhà nhìn ra; hai bên ngược nhau 180 độ.</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Huyền Không Phi Tinh (玄空飛星)</td>
                      <td className="py-2">Trường phái Lý Khí tính sao theo Vận và tọa hướng nhà.</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Vận (運)</td>
                      <td className="py-2">Chu kỳ 20 năm của thời gian; hiện là Cửu Vận (2024–2043).</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Cửu tinh</td>
                      <td className="py-2">Chín sao đánh số 1–9 theo Lạc Thư, "bay" qua chín cung nhà.</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Vượng sơn Vượng hướng (旺山旺向)</td>
                      <td className="py-2">Một cách cục Phi Tinh tốt cả về người lẫn về của.</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Tuổi mụ</td>
                      <td className="py-2">Tuổi âm, bằng năm xem trừ năm sinh cộng 1; nền để tính Kim Lâu, Hoang Ốc.</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-foreground">Thước Lỗ Ban (魯班尺)</td>
                      <td className="py-2">Thước phong thủy của nghề mộc, chia kích thước thành cung tốt – xấu.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <PhongThuyWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <PhongThuyRecall />,
        },
        {
          id: 'cau-hoi',
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
          children: <PhongThuyChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
