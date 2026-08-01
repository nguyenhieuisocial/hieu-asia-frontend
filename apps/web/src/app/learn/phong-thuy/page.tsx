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
  // ≤160 ký tự (seo-guard vault 172) — dài hơn thì Google cắt mất câu chốt.
  description:
    'Phong Thủy ứng dụng: Loan Đầu và Lý Khí, Bát Trạch (hướng nhà hợp tuổi, Cung Phi), Huyền Không Phi Tinh, chọn ngày giờ và thước Lỗ Ban. Không phán số mệnh.',
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
      readMeta="12 phút đọc · Cập nhật 2026"
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
          tocLabel: 'Cung Phi',
          heading: 'Cung Phi — cửa vào của Bát Trạch',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Bát Trạch không xem nhà trước, mà xem <strong>người</strong> trước: từ năm sinh và
                giới tính, nó suy ra <strong>Cung Phi</strong> — quẻ bản mệnh xếp bạn vào Đông tứ
                hay Tây tứ mệnh. Có con số đó rồi mới có bảng 8 hướng cát/hung của riêng bạn; thiếu
                nó thì mọi lời khuyên "hướng này đẹp" đều là nói chung chung.
              </p>
              <p>
                Phép tính, bảng tra theo giới tính và hai chỗ các trường phái tính khác nhau (mốc
                năm âm hay năm dương với người sinh sát Tết; số 5 ở trung cung Lạc Thư) là chuyện
                của bài chuyên sâu — trang này chỉ đặt Cung Phi vào đúng vị trí trong bức tranh
                chung.
              </p>
              <div className="rounded border border-border bg-card/40 p-4">
                <Link
                  href="/learn/bat-trach"
                  className="font-semibold text-foreground underline hover:text-primary"
                >
                  Đọc bài chuyên sâu: Bát Trạch — cung phi và hướng nhà hợp tuổi →
                </Link>
                <p className="mt-1 text-sm text-foreground/70">
                  Cách tính cung phi từng bước, phân Đông tứ – Tây tứ mệnh, đọc bảng 8 hướng và áp
                  cho cửa chính, bếp, giường.
                </p>
              </div>
            </div>
          ),
        },
        {
          id: 'du-nien-tinh',
          tocLabel: 'Tám du niên tinh',
          heading: 'Tám du niên tinh — lớp biến hướng thành lời khuyên',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Bảng 8 hướng chỉ có ích khi bạn biết mỗi sao nên dùng vào việc gì: ngồi làm việc
                quay về đâu, kê giường về đâu, còn vùng nào thì để dành cho kho hay nhà vệ sinh.
                Tám du niên tinh chính là lớp dịch đó — từ một quẻ mệnh trừu tượng ra quyết định
                kê đồ rất cụ thể.
              </p>
              <p>
                Phần khái niệm ở trên đã nêu tên và ý nghĩa gọn của bốn sao cát cùng bốn sao hung.
                Thứ tự nặng – nhẹ giữa các sao, đặc tính riêng của từng sao và cách chọn hướng theo
                mục tiêu là nội dung của một bài riêng.
              </p>
              <div className="rounded border border-border bg-card/40 p-4">
                <Link
                  href="/learn/du-nien"
                  className="font-semibold text-foreground underline hover:text-primary"
                >
                  Đọc bài chuyên sâu: Du niên — 8 sao Bát Trạch và hướng ngồi làm việc →
                </Link>
                <p className="mt-1 text-sm text-foreground/70">
                  Bốn cát tinh, bốn hung tinh và cách chọn hướng ngồi theo mục tiêu của bạn.
                </p>
              </div>
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
                Bát Trạch trả lời "hướng nào hợp với người này" và không đổi theo thời gian. Huyền
                Không Phi Tinh hỏi câu khác: "ngôi nhà này, trong thời kỳ này, khí vận ra sao" — nó
                thêm <strong>lớp thời gian</strong> bằng cách chia thành các <strong>Vận</strong> 20
                năm (hiện là Cửu Vận, 2024–2043), rồi lập bàn 9 cung theo tọa – hướng của chính ngôi
                nhà thay vì theo năm sinh chủ nhà.
              </p>
              <p>
                Hai phương pháp trả lời hai câu hỏi khác nhau, không thay thế nhau: hỏi "nhà này hợp
                với tôi không" thì dùng Bát Trạch, hỏi "căn nhà này thời kỳ này ra sao" mới cần tới
                Phi Tinh. Cách lập tinh bàn từng bước và cách đọc các cách cục là nội dung của một
                bài riêng.
              </p>
              <div className="rounded border border-border bg-card/40 p-4">
                <Link
                  href="/learn/huyen-khong-phi-tinh"
                  className="font-semibold text-foreground underline hover:text-primary"
                >
                  Đọc bài chuyên sâu: Huyền Không Phi Tinh — cửu vận và tinh bàn →
                </Link>
                <p className="mt-1 text-sm text-foreground/70">
                  Tam nguyên cửu vận, cách lập tinh bàn từ vận và 24 sơn, bốn cách cục chính.
                </p>
              </div>
            </div>
          ),
        },
        {
          id: 'bo-khuyet-ngu-hanh',
          tocLabel: 'Ngũ hành & màu sắc',
          heading: 'Bổ khuyết ngũ hành: hành nào hợp màu nào',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là nhánh ứng dụng đời thường nhất của ngũ hành: từ hành chủ đạo của một người,
                vòng tương sinh gợi ra nhóm màu "hợp gu" và nhóm màu nên bớt — dùng khi chọn màu xe,
                màu phòng, màu đồ mặc thường ngày.
              </p>
              <p>
                Cũng là chỗ trên mạng chép sai nhiều nhất: mỗi nơi liệt kê một danh sách màu khác
                nhau nên cùng một mệnh lại ra kết quả vênh nhau. Bảng 5 hành ↔ nhóm màu mà công cụ
                trên hieu.asia thật sự dùng, kèm lý do vì sao mỗi hành ứng nhóm màu đó, nằm ở bài
                chuyên sâu.
              </p>
              <div className="rounded border border-border bg-card/40 p-4">
                <Link
                  href="/learn/ngu-hanh-mau-sac"
                  className="font-semibold text-foreground underline hover:text-primary"
                >
                  Đọc bài chuyên sâu: Ngũ hành và màu sắc — hành nào hợp màu nào →
                </Link>
                <p className="mt-1 text-sm text-foreground/70">
                  Hai vòng tương sinh – tương khắc, bảng 5 hành ↔ nhóm màu, và cách chọn màu theo
                  năm sinh.
                </p>
              </div>
            </div>
          ),
        },
        {
          id: 'thuoc-lo-ban',
          tocLabel: 'Thước Lỗ Ban',
          heading: 'Thước Lỗ Ban — chọn kích thước theo cung tốt',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Thước Lỗ Ban là cây thước phong thủy của nghề mộc cổ truyền: nó chia chiều dài thành
                các cung Tốt – Xấu xen kẽ, để khi đo cửa, bàn thờ hay giường, thợ chọn được kích
                thước rơi vào cung tốt. Đây là quy ước truyền thống của thợ, mang tính tham khảo —
                rơi cung xấu chỉ cần nhích sang kích thước tốt gần nhất, không cần đập đi làm lại.
              </p>
              <p>
                Một điểm hay bị nói gọn quá đà: có <strong>bốn loại thước</strong> cho bốn mục đích
                khác nhau, và <strong>mỗi loại mang một bộ cung riêng</strong> — không phải chỉ một
                bộ tên dùng chung cho tất cả. Bốn cây thước ấy, bộ cung của từng cây và cách đo
                thông thủy cho đúng nằm ở bài chuyên sâu.
              </p>
              <div className="rounded border border-border bg-card/40 p-4">
                <Link
                  href="/learn/thuoc-lo-ban"
                  className="font-semibold text-foreground underline hover:text-primary"
                >
                  Đọc bài chuyên sâu: Thước Lỗ Ban — 4 loại thước và các cung tốt xấu →
                </Link>
                <p className="mt-1 text-sm text-foreground/70">
                  Bốn chiều dài thước, bộ cung riêng của từng cây, cách đo đúng và cách đọc kết quả.
                </p>
              </div>
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
                  Bổ khuyết ngũ hành: màu và hướng
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
