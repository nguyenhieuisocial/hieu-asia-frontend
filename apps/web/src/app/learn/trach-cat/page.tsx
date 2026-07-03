import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@hieu-asia/ui';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { relatedLearnLenses } from '@/lib/learn/related';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, faqPage } from '@/lib/seo/jsonld';
import {
  TrachCatFrame,
  TrachCatDepth,
  TrachCatRecall,
  TrachCatChecklist,
  TrachCatWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Trạch Cát — Cách chọn ngày giờ tốt',
  description:
    'Trạch cát (擇吉) — cách chọn ngày giờ tốt cho việc lớn: cưới hỏi, động thổ, khai trương, xuất hành. Hiểu ngày hoàng đạo, 12 Trực, giờ tốt. Góc nhìn tham khảo.',
  alternates: { canonical: 'https://hieu.asia/learn/trach-cat' },
};

// 12 Trực — hiển thị nhóm hợp/kỵ việc lớn theo phong tục (tham khảo, không phán).
const TRUC_LIST: { name: string; type: 'hop' | 'ky' | 'trung'; note: string }[] = [
  { name: 'Kiến', type: 'trung', note: 'Ngày khởi đầu, tốt cho việc mở màn; kỵ động thổ, an táng.' },
  { name: 'Trừ', type: 'trung', note: 'Trừ bỏ cái cũ — hợp dọn dẹp, chữa bệnh, giải trừ.' },
  { name: 'Mãn', type: 'hop', note: 'Đầy đủ, viên mãn — hợp cầu tài, khai trương, nhập kho.' },
  { name: 'Bình', type: 'ky', note: 'Bằng phẳng, bình thường — nhìn chung kỵ khởi sự việc lớn.' },
  { name: 'Định', type: 'hop', note: 'Ổn định, an bài — hợp cưới hỏi, ký kết, nhập trạch.' },
  { name: 'Chấp', type: 'trung', note: 'Nắm giữ — hợp tạo lập, cất giữ; hạn chế xuất hành xa.' },
  { name: 'Phá', type: 'ky', note: 'Đổ vỡ, hao tán — kỵ hầu hết việc trọng đại.' },
  { name: 'Nguy', type: 'ky', note: 'Nguy hiểm, chông chênh — kỵ việc lớn, nên thận trọng.' },
  { name: 'Thành', type: 'hop', note: 'Thành tựu — hợp cưới hỏi, khai trương, nhập học, xuất hành.' },
  { name: 'Thu', type: 'trung', note: 'Thu nạp — hợp cầu tài, nhập kho; kỵ an táng.' },
  { name: 'Khai', type: 'hop', note: 'Mở ra — hợp khai trương, động thổ, nhập trạch, cầu học.' },
  { name: 'Bế', type: 'ky', note: 'Đóng lại, bế tắc — kỵ khởi sự, mở màn việc mới.' },
];

const TRUC_DOT: Record<'hop' | 'ky' | 'trung', string> = {
  hop: 'bg-emerald-500',
  trung: 'bg-amber-500',
  ky: 'bg-rose-500',
};

const TRUC_LABEL: Record<'hop' | 'ky' | 'trung', string> = {
  hop: 'Hợp việc lớn',
  trung: 'Tuỳ việc',
  ky: 'Kỵ việc lớn',
};

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS = [
  {
    q: 'Trạch cát là gì?',
    a: 'Trạch cát (擇吉, nghĩa là "chọn điều lành") là việc chọn ngày và giờ tốt cho các việc trọng đại như cưới hỏi, động thổ, nhập trạch, khai trương, xuất hành, ký kết hay an táng. Nền tảng của nó là lịch can–chi (âm lịch), ngũ hành sinh–khắc và hệ "thần sát" (sao tốt / sao xấu của từng ngày). Đây là một nét văn hoá phương Đông, mang tính tham khảo — không phải lời phán về số mệnh.',
  },
  {
    q: 'Ngày hoàng đạo là gì?',
    a: 'Theo lịch pháp, mỗi ngày ứng với một trong 12 vị thần trực nhật. Sáu vị thiện được gọi là ngày hoàng đạo (Thanh Long, Minh Đường, Kim Quỹ, Thiên Đức/Bảo Quang, Ngọc Đường, Tư Mệnh) — được xem là ngày tốt để làm việc lớn. Sáu vị còn lại là ngày hắc đạo, thường kiêng khởi sự. Đây là khái niệm thần sát trong lịch pháp, không phải một hiện tượng thiên văn.',
  },
  {
    q: 'Ngày Tam Nương, Nguyệt Kỵ có cần kiêng thật không?',
    a: 'Tam Nương (mùng 3, 7, 13, 18, 22, 27) và Nguyệt Kỵ (mùng 5, 14, 23) là những ngày dân gian thường tránh khởi sự việc lớn. Đây là quy ước theo phong tục, mang ý nghĩa nhắc nhở thận trọng chứ không phải quy luật tất định. Nhiều gia đình tránh cho yên tâm và để hợp ý người thân; nhưng nếu buộc phải làm vào ngày đó, điều quan trọng nhất vẫn là sự chuẩn bị chu đáo, không phải bản thân con số ngày.',
  },
  {
    q: 'Giờ hoàng đạo tính thế nào?',
    a: 'Một ngày âm lịch chia thành 12 giờ (canh), mỗi giờ mang một địa chi. Từ địa chi của chính ngày đó, người ta suy ra 6 giờ là hoàng đạo (giờ tốt) và 6 giờ hắc đạo trong 12 canh. Vì thế "giờ tốt" thay đổi theo từng ngày. Bạn không cần nhớ quy tắc: công cụ giờ hoàng đạo tự tính khi bạn nhập ngày.',
  },
  {
    q: 'Có nhất thiết phải xem ngày mới làm việc lớn không?',
    a: 'Không bắt buộc. Trạch cát là một lựa chọn văn hoá, không phải nghĩa vụ. Xem ngày giúp bạn khởi sự chỉn chu, tránh trùng ngày kiêng theo phong tục, và an tâm hơn — nhất là khi việc liên quan tới nhiều người thân. Nhưng nếu điều kiện thực tế (lịch nghỉ, thời tiết, sức khoẻ) quan trọng hơn, thì chọn ngày thuận tiện và chuẩn bị tốt vẫn là điều hợp lý.',
  },
  {
    q: 'Xem ngày có bảo đảm may mắn không?',
    a: 'Không. Trạch cát giúp bạn an tâm và tránh trùng ngày kiêng theo phong tục, thể hiện sự chuẩn bị và tôn trọng — nhưng không bảo đảm thành công. Sự chuẩn bị, con người và năng lực mới là điều quyết định. Đây không phải bùa phép; hieu.asia trình bày để bạn tham khảo, không phán số mệnh và không bán lễ.',
  },
];

const JSONLD = [
  article({
    headline: 'Trạch Cát (擇吉): cách chọn ngày giờ tốt cho việc lớn — nền tảng cho người mới',
    description:
      'Trạch cát — chọn ngày & giờ tốt cho cưới hỏi, động thổ, khai trương, xuất hành: quy trình 3 lớp, ngày hoàng đạo, 12 Trực, ngày kiêng, giờ hoàng đạo. Góc nhìn tham khảo, không mê tín.',
    url: '/learn/trach-cat',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Trạch Cát', url: '/learn/trach-cat' },
  ]),
  faqPage(FAQS),
];

export default function LearnTrachCatPage() {
  return (
    <LearnArticle
      eyebrow="ĐÔNG PHƯƠNG · TRẠCH CÁT"
      title={
        <>
          Trạch Cát{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            (擇吉)
          </span>
        </>
      }
      standfirst={
        <>
          Trạch cát là cách người xưa hệ thống hoá việc chọn thời điểm cho những việc trọng đại — cưới
          hỏi, động thổ, khai trương, xuất hành. Chọn một ngày giờ “thuận” để khởi đầu chỉn chu và trong
          lòng an tâm. Đây là một góc nhìn tham khảo theo phong tục — không phải lời hứa may mắn.
        </>
      }
      readMeta="8 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Trạch Cát' },
      ]}
      relatedLenses={relatedLearnLenses('trach-cat')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Cho biết việc bạn định làm (cưới hỏi, động thổ, khai trương, xuất hành…) và khoảng thời gian mong muốn, hệ thống gợi ý những ngày tốt kèm giờ hoàng đạo để bạn tham khảo.',
        href: '/xem-ngay',
        label: 'Xem ngày tốt cho việc của bạn',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <TrachCatFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Trạch cát là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                <strong>Trạch cát</strong> (擇吉, nghĩa là “chọn điều lành”) là việc chọn{' '}
                <strong>ngày và giờ tốt</strong> cho các việc trọng đại: cưới hỏi, động thổ / nhập
                trạch, khai trương, xuất hành, ký kết, an táng. Nền tảng của nó là{' '}
                <strong>lịch can–chi</strong> (âm lịch), <strong>ngũ hành sinh–khắc</strong> và hệ{' '}
                <strong>thần sát</strong> — các sao tốt / xấu ứng với từng ngày.
              </p>
              <p>Cần phân biệt rõ ngay từ đầu:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Trạch cát là <strong>góc nhìn tham khảo theo phong tục</strong>, giúp bạn khởi sự chỉn
                  chu và an tâm hơn — không phải lời hứa thành công hay may mắn chắc chắn.
                </li>
                <li>
                  Chọn được ngày đẹp <strong>không</strong> thay cho sự chuẩn bị; ngày “xấu” cũng không
                  phải điều đáng sợ — con người và năng lực mới quyết định kết quả.
                </li>
              </ul>
              <p>
                Một điều quan trọng để giữ đúng tinh thần: đây không phải bùa phép, cũng không phải công
                cụ để hù doạ hay bán lễ. hieu.asia trình bày để bạn <strong>tham khảo</strong>, không
                phán số mệnh và <strong>không bán lễ</strong>.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <TrachCatDepth />,
        },
        {
          id: 'ba-lop-chon-ngay',
          tocLabel: '3 lớp chọn ngày',
          heading: '3 lớp chọn ngày: hợp tuổi → hợp việc → giờ đẹp',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Trạch cát nghe phức tạp, nhưng cách làm thực dụng có thể gói trong <strong>3 lớp</strong>{' '}
                theo thứ tự — đi từ người làm việc, tới loại việc, rồi mới tới giờ trong ngày.
              </p>
              <h3 className="text-lg font-semibold text-foreground">Lớp 1 — Hợp tuổi</h3>
              <p>
                Trước hết xét <strong>người chủ sự</strong>: tránh những năm xung / hình / hại với con
                giáp của mình. Với việc cưới hỏi hay làm nhà, phong tục còn tránh các năm{' '}
                <strong>Kim Lâu, Hoang Ốc, Tam Tai</strong>. Đây là lớp “lọc thô” theo tuổi trước khi đi
                vào chi tiết ngày.
              </p>
              <h3 className="text-lg font-semibold text-foreground">Lớp 2 — Hợp việc</h3>
              <p>
                Trong khoảng thời gian đã hợp tuổi, chọn <strong>ngày phù hợp với loại việc</strong>:
                đối chiếu ngày hoàng đạo, <strong>12 Trực</strong> và các sao (nhị thập bát tú) xem ngày
                đó hợp cưới hỏi, khai trương, động thổ hay xuất hành; đồng thời <strong>tránh các ngày
                kiêng</strong> phổ biến (Tam Nương, Nguyệt Kỵ…).
              </p>
              <h3 className="text-lg font-semibold text-foreground">Lớp 3 — Giờ đẹp</h3>
              <p>
                Cuối cùng, trong chính ngày đã chọn, chọn một <strong>giờ hoàng đạo</strong> (giờ tốt)
                để tiến hành nghi thức chính. Ba lớp lồng nhau như vậy giúp bạn có một mốc thời gian đã
                cân nhắc nhiều mặt.
              </p>
              <p className="text-sm text-foreground/70">
                Bạn không cần thuộc lòng các bảng: công cụ xem ngày tự đối chiếu khi bạn nhập loại việc,
                tuổi và khoảng thời gian mong muốn. Phần này chỉ để bạn hiểu vì sao một ngày được coi là
                “đẹp”, thay vì nhận một kết quả “hộp đen”.
              </p>
            </div>
          ),
        },
        {
          id: 'ngay-hoang-dao-12-truc',
          tocLabel: 'Hoàng đạo & 12 Trực',
          heading: 'Ngày Hoàng đạo & 12 Trực',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Có hai hệ quy chiếu hay dùng nhất khi xét một ngày. Thứ nhất là{' '}
                <strong>ngày hoàng đạo / hắc đạo</strong>: mỗi ngày ứng với một trong 12 vị thần trực
                nhật; 6 vị thiện tạo thành <strong>6 ngày hoàng đạo</strong> (Thanh Long, Minh Đường,
                Kim Quỹ, Thiên Đức/Bảo Quang, Ngọc Đường, Tư Mệnh) — ngày tốt; 6 vị còn lại là ngày{' '}
                <strong>hắc đạo</strong>, thường kiêng việc lớn.
              </p>
              <p>
                Thứ hai là <strong>Thập nhị Trực</strong> (12 Trực) — 12 “trực” xoay vòng theo ngày, mỗi
                trực hợp hoặc kỵ một số loại việc. Đây là cách đọc nhanh xem một ngày nghiêng về khởi sự
                hay nên kiêng:
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {TRUC_LIST.map((t) => (
                  <div
                    key={t.name}
                    className="rounded-xl border border-border bg-card/40 p-4"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className={`h-2 w-2 rounded-full ${TRUC_DOT[t.type]}`}
                      />
                      <span className="font-heading text-base font-semibold text-foreground">
                        {t.name}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                      {TRUC_LABEL[t.type]}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.note}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-foreground/70">
                Đây là mô tả truyền thống, hãy đọc như xu hướng tham khảo. Ngoài ra còn hệ{' '}
                <strong>nhị thập bát tú</strong> (28 sao, có tú cát – tú hung) cũng góp phần đánh giá
                ngày. Các hệ này chồng lên nhau để chọn ra ngày “sạch” nhiều mặt.
              </p>
            </div>
          ),
        },
        {
          id: 'ngay-kieng-pho-bien',
          tocLabel: 'Ngày kiêng phổ biến',
          heading: 'Những ngày kiêng phổ biến',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Song song với việc chọn ngày tốt, phong tục còn có một số ngày{' '}
                <strong>thường tránh khởi sự việc lớn</strong>. Biết chúng để chủ động né, nhưng cũng nên
                nhớ đây là quy ước văn hoá mang ý nhắc nhở thận trọng — không phải quy luật tất định.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Tam Nương</strong> — mùng 3, 7, 13, 18, 22, 27 (âm lịch). Dân gian thường tránh
                  cưới hỏi, khởi công, xuất hành xa vào các ngày này.
                </li>
                <li>
                  <strong>Nguyệt Kỵ</strong> — mùng 5, 14, 23 (âm lịch). “Mùng năm, mười bốn, hăm ba” —
                  ngày được cho là dễ trục trặc, nên tránh việc trọng đại.
                </li>
                <li>
                  <strong>Sát Chủ</strong> — ngày kỵ theo từng tháng, quan niệm bất lợi cho người chủ sự;
                  thường tránh động thổ, xây cất, cưới hỏi.
                </li>
                <li>
                  <strong>Thọ Tử</strong> — ngày xấu theo tháng, dân gian tránh khởi sự và các việc quan
                  trọng.
                </li>
              </ul>
              <p>
                Giữ đúng tinh thần: nếu điều kiện thực tế buộc bạn làm vào một ngày “kiêng”, đừng quá lo.
                Sự chuẩn bị chu đáo quan trọng hơn nhiều so với bản thân con số ngày. Trạch cát là để{' '}
                <strong>an tâm và tôn trọng phong tục</strong>, không phải để sợ hãi.
              </p>
            </div>
          ),
        },
        {
          id: 'chon-gio-hoang-dao',
          tocLabel: 'Chọn giờ hoàng đạo',
          heading: 'Chọn giờ hoàng đạo',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Chọn được ngày rồi, lớp cuối là chọn <strong>giờ</strong>. Một ngày âm lịch chia thành{' '}
                <strong>12 giờ (canh)</strong>, mỗi giờ kéo dài hai tiếng đồng hồ và mang một địa chi
                (Tý, Sửu, Dần… Hợi). Từ <strong>địa chi của chính ngày đó</strong>, người ta suy ra{' '}
                <strong>6 giờ là hoàng đạo</strong> (giờ tốt) và 6 giờ hắc đạo trong 12 canh.
              </p>
              <p>
                Nghĩa là “giờ tốt” không cố định — nó <strong>đổi theo từng ngày</strong>. Việc chính
                (đón dâu, cắt băng khai trương, đặt viên gạch đầu tiên…) nên rơi vào một trong các giờ
                hoàng đạo của ngày.
              </p>
              <p className="text-sm text-foreground/70">
                Bạn không cần nhớ quy tắc suy giờ: công cụ giờ hoàng đạo tự tính khi bạn nhập ngày, và
                thường liệt kê sẵn các khung giờ tốt để bạn chọn khung thuận tiện nhất.
              </p>
            </div>
          ),
        },
        {
          id: 'giai-han-va-gioi-han',
          tocLabel: 'Trạch cát giúp gì',
          heading: 'Giới hạn — trạch cát giúp gì, không giúp gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Xem ngày là một nét văn hoá đẹp: chọn một mốc thời gian tử tế cho việc lớn thể hiện{' '}
                <strong>sự chuẩn bị và tôn trọng</strong> — với việc, với gia đình, với những người cùng
                tham gia. Nhiều gia đình xem ngày để mọi người cùng an tâm và thu xếp lịch quanh một mốc
                chung. Tôn trọng điều đó, nhưng cũng nên hiểu đúng:{' '}
                <strong>hieu.asia không bán lễ</strong> và không cho rằng phải “giải” gì mới yên.
              </p>
              <p>Trạch cát <strong>giúp</strong> bạn:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Đồng bộ nhịp sinh hoạt</strong>: có một mốc thời gian rõ ràng để mọi người
                  cùng chuẩn bị và sắp lịch quanh nó.
                </li>
                <li>
                  <strong>An tâm về mặt tâm lý</strong>: khởi sự với cảm giác đã chuẩn bị chu đáo, đúng
                  phong tục, đỡ lăn tăn về sau.
                </li>
                <li>
                  <strong>Tránh trùng ngày kiêng</strong> theo phong tục, để không phải áy náy với người
                  thân lớn tuổi.
                </li>
              </ul>
              <p>Nhưng trạch cát <strong>không</strong>:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Không bảo đảm thành công hay may mắn.</strong> Sự chuẩn bị, con người và năng
                  lực mới quyết định kết quả — ngày đẹp không làm thay việc đó.
                </li>
                <li>
                  Không phải bùa phép, không đo được nhân quả theo nghĩa khoa học; nó là{' '}
                  <strong>khung nhắc nhở văn hoá</strong>, không phải chẩn đoán.
                </li>
                <li>
                  Không nên trở thành lý do <strong>trì hoãn hay lo sợ</strong>: gặp ngày “xấu” chỉ nghĩa
                  là cân nhắc thêm, tuyệt đối không phải điều đáng sợ.
                </li>
              </ul>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <TrachCatWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <TrachCatRecall />,
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
                Muốn tìm ngày tốt cho việc sắp làm?{' '}
                <Link
                  href="/xem-ngay"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  Xem ngày tốt miễn phí →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/xem-ngay', label: 'Xem ngày tốt cho việc của bạn' },
                    { href: '/gio-hoang-dao', label: 'Giờ hoàng đạo' },
                    { href: '/ngay-kieng-ky', label: 'Ngày kiêng kỵ' },
                    { href: '/lich-van-nien', label: 'Lịch Vạn Niên' },
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
          children: <TrachCatChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
