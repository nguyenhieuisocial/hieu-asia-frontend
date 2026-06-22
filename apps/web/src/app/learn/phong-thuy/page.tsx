import type { Metadata } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@hieu-asia/ui';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { relatedLearnLenses } from '@/lib/learn/related';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, faqPage } from '@/lib/seo/jsonld';

export const metadata: Metadata = {
  title: 'Phong Thủy: hướng nhà, chọn ngày & ngũ hành | Học huyền học',
  description:
    'Phong Thủy ứng dụng: hiểu Bát Trạch để xem hướng nhà hợp tuổi, bổ khuyết ngũ hành, chọn ngày–giờ và xem tuổi. Quy tắc minh bạch để tham khảo, không phán số mệnh.',
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
    a: 'Thước Lỗ Ban là cây thước phong thủy của nghề mộc cổ truyền, chia chiều dài thành các cung Tốt – Xấu xen kẽ (Tài, Bệnh, Ly, Nghĩa, Quan, Kiếp, Hại, Bản). Khi đo cửa, bàn thờ, giường…, thợ cố chọn kích thước rơi vào cung tốt. Đây là quy ước truyền thống của thợ, mang tính tham khảo; rơi cung xấu chỉ cần nhích sang kích thước tốt gần nhất, không cần làm lại.',
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
      readMeta="8 phút đọc · Cập nhật 2026"
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
                  hieu.asia dùng <strong>Bát Trạch</strong> (tính theo năm sinh và giới tính
                  → mệnh quái → 8 hướng cát/hung). Trường phái Huyền Không Phi Tinh (tính
                  theo vận khí 20 năm và tọa hướng nhà) là một nhánh Lý Khí khác, ngoài phạm
                  vi.
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
                <li>Xem hướng nhà hợp tuổi — theo Bát Trạch.</li>
                <li>Bổ khuyết ngũ hành — màu, hướng, nghề, vật phẩm hợp mệnh.</li>
                <li>Giờ hoàng đạo — 12 canh giờ tốt/xấu trong ngày.</li>
                <li>Xem ngày tốt theo mục đích — chấm điểm ngày.</li>
                <li>Xem tuổi cưới và xem tuổi làm nhà.</li>
                <li>Thước Lỗ Ban — tra kích thước cung tốt/xấu.</li>
              </ul>
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
                  xem rơi vào cung Tốt hay Xấu theo bộ cung kinh điển (Tài, Bệnh, Ly, Nghĩa,
                  Quan, Kiếp, Hại, Bản).
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
                  Để không bịa, có vài phần công cụ web không làm: <strong>Huyền Không Phi
                  Tinh</strong> (tính sao bay theo Vận 20 năm và tọa hướng nhà),{' '}
                  <strong>Loan Đầu / hình thế</strong> (thế đất, sơn thủy — cần khảo sát hiện
                  trường), và <strong>bố cục nội thất chi tiết, trấn yểm, vật phẩm phong
                  thủy</strong>. Công cụ chỉ gợi ý hướng cùng màu/môi trường để tham khảo, và
                  không bán dịch vụ "hóa giải".
                </p>
              </div>
            </div>
          ),
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
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
