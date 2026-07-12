import type { Metadata } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@hieu-asia/ui';
import { InfographicPalm } from '@/components/learn/InfographicPalm';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { relatedLearnLenses } from '@/lib/learn/related';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, course, faqPage } from '@/lib/seo/jsonld';
import {
  PalmFrame,
  PalmDepth,
  PalmRecall,
  PalmChecklist,
  PalmWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Xem chỉ tay — Học huyền học',
  description:
    'Xem chỉ tay (chiromancy): bảy đường — tâm đạo, trí đạo, sinh đạo, số mệnh, mặt trời, thuỷ tinh, hôn nhân — cùng các gò (Kim Tinh, Mặt Trăng…), hai hệ hình bàn tay và quy ước tay thuận. Đọc xu hướng, không phán số mệnh.',
  alternates: { canonical: 'https://hieu.asia/learn/palm' },
};

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (Accordion) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS = [
  {
    q: 'Chiromancy đến từ đâu?',
    a: 'Xem chỉ tay (chiromancy / palmistry) xuất hiện độc lập ở nhiều nền văn hóa cổ đại — Ấn Độ (Hast Samudrika Shastra, một truyền thống lâu đời), Trung Hoa, Hy Lạp. Hệ thống hiện đại tại phương Tây phổ biến từ thế kỷ 19.',
  },
  {
    q: 'Tay nào để xem?',
    a: 'Theo trường phái phổ biến: tay không thuận phản ánh tiềm năng bẩm sinh, tay thuận phản ánh con người bạn đang trở thành. Thường xem cả hai để so sánh.',
  },
  {
    q: 'Đường dài/ngắn nghĩa là gì?',
    a: 'Độ dài không quyết định “thọ” hay “tài”. Hình dạng, độ rõ, các nhánh phụ, đứt đoạn — tất cả tổ hợp lại mới có ý nghĩa. Ví dụ đường sinh đạo ngắn không có nghĩa thọ ngắn, mà có thể là năng lượng tập trung.',
  },
  {
    q: 'Đường chỉ tay có thay đổi không?',
    a: 'Có. Đường nhỏ thay đổi theo thói quen tay, sức khỏe, stress. Đường chính ổn định hơn nhưng vẫn có thể đậm/nhạt theo thời gian. Đây là lý do bàn tay được xem là “bản đồ sống”.',
  },
  {
    q: 'Cẩn trọng khi đọc?',
    a: 'Không có đường chỉ tay nào dự đoán chính xác sự kiện cụ thể. Đây là khung tham chiếu — nên kết hợp với hoàn cảnh thực tế, sức khỏe, lựa chọn cá nhân. hieu.asia dùng AI phân tích ảnh bàn tay để hỗ trợ, không thay thế lời khuyên chuyên môn.',
  },
  {
    q: 'Đường sinh đạo ngắn có phải “sống ngắn”?',
    a: 'Không. Đây là hiểu lầm phổ biến nhất về xem chỉ tay. Đường sinh đạo nói về sức sống, năng lượng và những giai đoạn thay đổi lớn — không phải tuổi thọ. Đường ngắn hoặc ôm sát có thể chỉ năng lượng tập trung, gọn gàng, ưu tiên sự an toàn, hoàn toàn không liên quan đến chuyện thọ yểu.',
  },
  {
    q: 'Đường trí đạo dài thì thông minh hơn?',
    a: 'Không. Trí đạo nói về phong cách tư duy chứ không phải mức IQ. Đường thẳng và ngang thiên về tư duy thực tế, có cấu trúc; đường dốc xuống thiên về tưởng tượng và sáng tạo. Trí đạo ngắn nghĩa là quyết nhanh, đi thẳng vào việc — không phải “kém thông minh”.',
  },
  {
    q: 'Đếm vạch hôn nhân để biết cưới mấy lần được không?',
    a: 'Không nên. Đếm vạch ở cạnh bàn tay để phán “kết hôn mấy lần” là cách đọc bị lạm dụng và sai lệch. Những vạch này chỉ phản ánh việc bạn coi trọng các mối quan hệ gắn bó sâu sắc, không phải con số sự kiện cụ thể.',
  },
  {
    q: 'Đường “sức khoẻ” trên tay có nói được bệnh không?',
    a: 'Tuyệt đối không. Dù truyền thống gọi là đường Sức khoẻ (Thuỷ Tinh), nó chỉ nói về khuynh hướng giao tiếp và sự nhạy bén, không phải chẩn đoán y học. Mọi lo ngại về sức khoẻ nên gặp bác sĩ — xem chỉ tay không có cơ sở y học và không thay thế chuyên môn.',
  },
  {
    q: 'Không có đường số mệnh (Vận mệnh / Fate) trên tay thì có phải đời vô định không?',
    a: 'Không. Nhiều người vốn không có đường số mệnh rõ, và đó là chuyện bình thường — không phải “vô định” hay “xấu”, mà là đường đời linh hoạt, tự định hướng thay vì đi theo một con đường vạch sẵn. Đường số mệnh chủ về mức độ “đi theo một hướng nghề rõ”: đậm và thẳng gợi con đường nhất quán, đứt đoạn hay nhiều nhánh gợi nhiều ngả rẽ, đa nghề. Không có đường này chỉ là một kiểu, không phải thiếu sót.',
  },
];

// Sổ tay thuật ngữ (≥10 mục) — grounded từ chính bài + tài liệu nguồn nhan-tuong.md (PHẦN B).
const GLOSSARY: { term: string; def: string }[] = [
  {
    term: 'Tâm đạo (Heart line)',
    def: 'Đường trên cùng, chạy ngang dưới gốc các ngón. Chủ về đời sống tình cảm, cách yêu và cách kết nối cảm xúc.',
  },
  {
    term: 'Trí đạo (Head line)',
    def: 'Đường giữa, chạy ngang lòng bàn tay. Chủ về phong cách tư duy (logic hay sáng tạo) — không phải mức IQ.',
  },
  {
    term: 'Sinh đạo (Life line)',
    def: 'Đường vòng quanh gốc ngón cái. Chủ về sức sống, năng lượng và các bước ngoặt lớn — không phải tuổi thọ.',
  },
  {
    term: 'Đường số mệnh (Vận mệnh / Fate line)',
    def: 'Chạy dọc giữa lòng bàn tay lên ngón giữa. Chủ về định hướng nghề nghiệp; nhiều người không có đường này, và đó là chuyện bình thường.',
  },
  {
    term: 'Đường Mặt Trời (Sun / Apollo line)',
    def: 'Song song đường số mệnh, hướng về ngón áp út. Chủ về niềm vui sáng tạo, sự được công nhận và sức hút cá nhân — không phán nổi tiếng hay giàu.',
  },
  {
    term: 'Đường Thuỷ Tinh / “Sức khoẻ” (Mercury line)',
    def: 'Chủ về giao tiếp, sự nhạy bén và đầu óc kinh doanh. Dù có tên “sức khoẻ”, không đọc thành chẩn đoán bệnh.',
  },
  {
    term: 'Đường Hôn nhân (Affection line)',
    def: 'Những vạch ngắn ở cạnh bàn tay dưới ngón út. Chủ về quan hệ gắn bó sâu sắc — không đếm vạch để đoán số lần kết hôn.',
  },
  {
    term: 'Gò (Mount)',
    def: 'Vùng thịt nổi dưới mỗi ngón và quanh lòng tay, đặt tên theo hành tinh. Đọc theo độ đầy – lép, không đọc có – không.',
  },
  {
    term: 'Gò Kim Tinh (Venus mount)',
    def: 'Phần thịt nổi quanh gốc ngón cái. Gắn với sức sống, nhiệt tình và sự ấm áp.',
  },
  {
    term: 'Gò Mặt Trăng (Luna / Thái Âm)',
    def: 'Vùng cạnh dưới ngoài lòng tay. Gắn với trí tưởng tượng, trực giác và cảm xúc.',
  },
  {
    term: 'Tay thuận / tay không thuận',
    def: 'Quy ước phổ biến: tay không thuận phản ánh tiềm năng bẩm sinh, tay thuận phản ánh con người đang trở thành. Đây là quy ước, không phải luật cứng.',
  },
  {
    term: 'Bốn yếu tố (Đất – Khí – Lửa – Nước)',
    def: 'Hệ phương Tây hiện đại phân bàn tay thành bốn loại hình theo bốn yếu tố.',
  },
  {
    term: 'Ngũ hành thủ',
    def: 'Hệ Đông Á phân bàn tay thành năm loại (Kim – Mộc – Thuỷ – Hoả – Thổ thủ). Là hệ KHÁC, không tương ứng 1-1 với bốn yếu tố phương Tây.',
  },
  {
    term: 'Chiromancy / Palmistry',
    def: 'Tên tiếng Anh của xem chỉ tay — đọc đường nét, gò và hình dáng bàn tay.',
  },
  {
    term: 'Hiệu ứng Forer / Barnum',
    def: 'Xu hướng thấy một mô tả mơ hồ là “đúng với mình”. Là lý do cần đọc chỉ tay một cách tỉnh táo, xem như tự ngẫm chứ không phải “đoán đúng”.',
  },
];

const JSONLD = [
  article({
    headline: 'Xem chỉ tay — bảy đường, các gò và hình bàn tay',
    description:
      'Xem chỉ tay (chiromancy): bảy đường — tâm đạo, trí đạo, sinh đạo, số mệnh, mặt trời, thuỷ tinh, hôn nhân — cùng các gò, hai hệ hình bàn tay và quy ước tay thuận. Đọc xu hướng, không phán số mệnh.',
    url: '/learn/palm',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Xem chỉ tay', url: '/learn/palm' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Xem chỉ tay — Học huyền học',
    description:
      'Xem chỉ tay (chiromancy): bảy đường — tâm đạo, trí đạo, sinh đạo, số mệnh, mặt trời, thuỷ tinh, hôn nhân — cùng các gò, hai hệ hình bàn tay và quy ước tay thuận. Đọc xu hướng, không phán số mệnh.',
    url: '/learn/palm',
  }),
];

export default function LearnPalmPage() {
  return (
    <LearnArticle
      eyebrow="Phổ quát · Đông & Tây"
      title={
        <>
          Xem <span className="bg-gold-gradient bg-clip-text text-transparent">chỉ tay</span>
        </>
      }
      standfirst={
        <>
          Bàn tay con người có hàng trăm đường nét nhỏ, nhưng có 7 đường lớn được nhiều
          truyền thống — từ Ấn Độ, Trung Hoa đến châu Âu — coi là quan trọng nhất.
        </>
      }
      readMeta="6 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Xem chỉ tay' },
      ]}
      relatedLenses={relatedLearnLenses('palm')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Chụp ảnh lòng bàn tay theo hướng dẫn, AI đọc các đường chính (sinh đạo, trí đạo, tâm đạo) cùng gò và dáng bàn tay để gợi ý xu hướng tính cách. Không cần giờ sinh.',
        href: '/xem-tuong',
        label: 'Xem chỉ tay bằng AI',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <PalmFrame />,
        },
        {
          id: 'so-do-7-duong',
          tocLabel: '7 đường chính',
          heading: 'Sơ đồ 7 đường chính',
          children: (
            <div className="rounded-xl border border-border bg-card/40 p-6 sm:p-8">
              <InfographicPalm />
            </div>
          ),
        },
        {
          id: 'tay-thuan',
          tocLabel: 'Tay thuận / không thuận',
          heading: 'Tay thuận – tay không thuận: đọc gì trước khi luận',
          children: (
            <div className="prose-invert max-w-none space-y-5 text-muted-foreground">
              <p>
                Trước khi luận đường, cần định một quy ước: xem tay nào? Theo trường phái phổ
                biến, tay <strong>không thuận</strong> (tay ít dùng) phản ánh tiềm năng bẩm
                sinh — con người khi mới sinh ra; tay <strong>thuận</strong> (tay hay dùng)
                phản ánh con người đang trở thành, đã chịu tác động của lựa chọn và môi trường.
                Lý tưởng là xem cả hai để so sánh, vì chính khoảng chênh giữa hai tay mới là
                chỗ đáng chú ý.
              </p>
              <p>
                Một điểm phải nói thẳng: đây là <strong>quy ước phổ biến, không phải luật cứng</strong>.
                Có trường phái căn tay theo quy ước riêng, và các phái không hoàn toàn thống nhất
                tay nào mang “trọng số” nào. Vì thế khi đọc, nên nêu rõ đây là quy ước, không
                khẳng định một chiều.
              </p>
              <p>
                Vì sao chia “bẩm sinh” và “đang trở thành” lại hợp lý: đường nhỏ trên tay đổi
                theo thói quen, sức khoẻ, căng thẳng; đường chính ổn định hơn nhưng vẫn đậm –
                nhạt theo thời gian. Bàn tay là một bản đồ sống, không phải bản án — và tay thuận
                chính là phần “đang sống” ấy.
              </p>
            </div>
          ),
        },
        {
          id: 'bay-duong',
          tocLabel: 'Bảy đường',
          heading: 'Bảy đường trên bàn tay — đọc xu hướng, không phán số mệnh',
          children: (
            <div className="prose-invert max-w-none space-y-5 text-muted-foreground">
              <p>
                Bàn tay thường được đọc theo bảy đường: <strong>ba đường trục</strong> gần như
                ai cũng có, và <strong>bốn đường phụ</strong> cần dè dặt hơn. Sơ đồ phía trên
                minh hoạ sáu trong số đó cùng Vòng Kim Tinh — vốn là một <em>gò</em>, sẽ nói ở
                mục Các gò bên dưới. Điều quan trọng nhất vẫn giữ nguyên: đọc <strong>tổ hợp</strong>{' '}
                hình dạng, độ rõ, nhánh phụ và chỗ bắt đầu — không đọc độ dài đơn lẻ.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Ba đường trục</h3>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Tâm đạo — đường tình cảm</h4>
                <p>
                  Đường trên cùng, chạy ngang dưới gốc các ngón. Chủ về cách yêu và cách
                  kết nối cảm xúc. Bắt đầu dưới ngón trỏ thường gắn với khuynh hướng chọn
                  lọc, biết mình muốn gì; bắt đầu dưới ngón giữa thiên về nhu cầu của bản
                  thân trong quan hệ. Đường cong lên cho thấy cảm xúc cởi mở, chủ động; đường
                  thẳng-ngang thì giữ cảm xúc kín hơn, thiên lý trí.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Trí đạo — đường lý trí</h4>
                <p>
                  Đường giữa, chạy ngang lòng bàn tay. Nói về <em>phong cách</em> tư duy chứ
                  không phải mức IQ. Thẳng và ngang thiên về tư duy thực tế, có cấu trúc; dốc
                  xuống phía gò Mặt Trăng thì giàu tưởng tượng, sáng tạo. Trí đạo dính liền
                  điểm đầu với sinh đạo gợi khởi đầu thận trọng, gắn với gia đình; tách rời
                  gợi sự độc lập, tự quyết sớm.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Sinh đạo — đường sức sống</h4>
                <p>
                  Đường vòng quanh gốc ngón cái. Chủ về sức sống, năng lượng và những bước
                  ngoặt lớn trong đời — <strong>không phải tuổi thọ</strong>. Cần nói rõ:
                  đường sinh đạo ngắn không có nghĩa “sống ngắn”, mà có thể chỉ năng lượng
                  tập trung. Vòng rộng gợi nhiệt huyết, ưa vận động; vòng ôm sát gợi kiểu
                  “chậm mà chắc”. Đoạn đứt hay nhánh được truyền thống đọc là giai đoạn
                  chuyển biến (đổi nghề, dọn nhà), không phải tai hoạ.
                </p>
              </div>

              <h3 className="text-lg font-semibold text-foreground">Bốn đường phụ</h3>
              <p>
                Bốn đường sau không phải ai cũng có, và <strong>không có không phải là thiếu
                sót</strong> — chỉ là một kiểu bàn tay khác.
              </p>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Đường số mệnh (Vận mệnh)</h4>
                <p>
                  Chạy dọc giữa lòng bàn tay lên phía ngón giữa. Chủ về định hướng nghề nghiệp,
                  mức độ “đi theo một con đường rõ”. Đậm và thẳng gợi con đường nhất quán; đứt
                  đoạn hay nhiều nhánh gợi nhiều ngả rẽ, đa nghề. Nhiều người không có đường này
                  — nghĩa là đường đời linh hoạt, tự định, <strong>không phải “vô định” hay “xấu”</strong>.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Đường Mặt Trời</h4>
                <p>
                  Song song đường số mệnh, hướng về ngón áp út. Chủ về niềm vui sáng tạo, sự
                  được công nhận và sức hút cá nhân. Đây là khuynh hướng, <strong>không phải lời
                  hứa “nổi tiếng” hay “giàu”</strong>.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Đường Thuỷ Tinh (đường “Sức khoẻ”)</h4>
                <p>
                  Chủ về giao tiếp, sự nhạy bén và đầu óc kinh doanh. Dù tên gọi có chữ “sức
                  khoẻ”, <strong>tuyệt đối không đọc thành chẩn đoán bệnh</strong> — bàn tay
                  không có cơ sở y học; mọi lo ngại sức khoẻ nên gặp bác sĩ.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Đường Hôn nhân</h4>
                <p>
                  Những vạch ngắn ở cạnh bàn tay dưới ngón út. Chủ về các mối quan hệ gắn bó
                  sâu sắc. <strong>Không đếm vạch để phán “kết hôn mấy lần”</strong> — đó là
                  cách đọc bị lạm dụng; những vạch này chỉ nói bạn coi trọng quan hệ gắn bó.
                </p>
              </div>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <PalmDepth />,
        },
        {
          id: 'cac-go',
          tocLabel: 'Các gò',
          heading: 'Các gò: tám vùng thịt nổi trên lòng bàn tay',
          children: (
            <div className="prose-invert max-w-none space-y-5 text-muted-foreground">
              <p>
                Gò là vùng thịt nổi dưới mỗi ngón và quanh lòng tay, đặt tên theo hành tinh
                trong hệ phương Tây. Đọc theo <strong>độ đầy đặn</strong>: gò nổi đầy gợi năng
                lượng vùng đó trội, gò lép gợi khuynh hướng nhẹ hơn — không phải “thiếu”. Hệ
                phương Tây kể tám vùng:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Gò Kim Tinh (Venus)</strong> — quanh gốc ngón cái. Sức sống, nhiệt
                  tình, tình cảm, sự ấm áp.
                </li>
                <li>
                  <strong>Gò Mộc Tinh (Jupiter)</strong> — dưới ngón trỏ. Tham vọng, lãnh đạo,
                  tự tin.
                </li>
                <li>
                  <strong>Gò Thổ Tinh (Saturn)</strong> — dưới ngón giữa. Kỷ luật, trách nhiệm,
                  chiều sâu, ưa suy ngẫm.
                </li>
                <li>
                  <strong>Gò Thái Dương (Apollo)</strong> — dưới ngón áp út. Sáng tạo, thẩm mỹ,
                  sức hút.
                </li>
                <li>
                  <strong>Gò Thuỷ Tinh (Mercury)</strong> — dưới ngón út. Giao tiếp, nhạy bén,
                  đầu óc kinh doanh.
                </li>
                <li>
                  <strong>Gò Mặt Trăng (Luna / Thái Âm)</strong> — cạnh dưới ngoài lòng tay.
                  Trí tưởng tượng, trực giác, cảm xúc.
                </li>
                <li>
                  <strong>Hai gò Hoả Tinh (Mars)</strong> — hai vùng ở giữa lòng tay. Lòng can
                  đảm, sức bền, khả năng đối mặt.
                </li>
              </ul>
              <p className="text-sm">
                Vì gò khó thấy chính xác qua ảnh phẳng — phụ thuộc góc chụp và ánh sáng — chỉ
                nên nhận xét khi một gò rõ ràng nổi hẳn hoặc lép hẳn; còn lại thì bỏ qua, đừng
                đoán mò.
              </p>
            </div>
          ),
        },
        {
          id: 'hinh-ban-tay',
          tocLabel: 'Hình bàn tay',
          heading: 'Hình dáng bàn tay: hai hệ phân loại khác nhau',
          children: (
            <div className="prose-invert max-w-none space-y-5 text-muted-foreground">
              <p>
                Phân loại tổng thể bàn tay giúp định “khung” trước khi đọc đường. Có hai hệ
                phổ biến, và chúng <strong>không tương ứng 1-1</strong> — đừng coi là đồng nghĩa.
              </p>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Hệ phương Tây — bốn yếu tố
                </h3>
                <p>
                  Chia bàn tay thành bốn loại theo Đất – Khí – Lửa – Nước:
                </p>
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>
                    <strong>Tay Đất</strong> (lòng vuông, ngón ngắn, da chắc) — thực tế, vững
                    vàng, đáng tin, ưa cụ thể.
                  </li>
                  <li>
                    <strong>Tay Khí</strong> (lòng vuông, ngón dài, đốt rõ) — lý trí, giao tiếp,
                    tò mò trí tuệ.
                  </li>
                  <li>
                    <strong>Tay Lửa</strong> (lòng dài, ngón ngắn) — năng động, nhiệt huyết,
                    hành động nhanh.
                  </li>
                  <li>
                    <strong>Tay Nước</strong> (lòng dài, ngón dài-mảnh, da mềm) — nhạy cảm, giàu
                    cảm xúc, trực giác, sáng tạo.
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Hệ Đông Á — Ngũ hành thủ
                </h3>
                <p>
                  Truyền thống Đông Á phân bàn tay theo Ngũ hành: Kim – Mộc – Thuỷ – Hoả – Thổ
                  thủ. Đây là một hệ <strong>khác</strong>, gồm <strong>năm loại</strong>, không
                  tương ứng 1-1 với bốn yếu tố phương Tây (4 khác 5; cách quan sát và tên gọi
                  cũng khác). Nếu dùng hệ này, nên nói rõ “có trường phái phân theo Ngũ hành
                  thủ” để không trộn lẫn hai hệ.
                </p>
              </div>
            </div>
          ),
        },
        {
          id: 'ngon-va-van',
          tocLabel: 'Ngón & vân tay',
          heading: 'Ngón tay và vân tay — cùng một lưu ý về nghiên cứu tỉ lệ ngón',
          children: (
            <div className="prose-invert max-w-none space-y-5 text-muted-foreground">
              <p>
                Ngoài đường và gò, bàn tay còn được đọc sơ qua ở ngón và vân — nhưng phần này
                dễ over-read nhất nên cần dè dặt.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Ngón cái:</strong> truyền thống coi là chỉ dấu ý chí và logic (đốt 1)
                  cùng lý trí (đốt 2); ngón cái khoẻ, thẳng gợi ý chí mạnh.
                </li>
                <li>
                  <strong>Độ dài tương đối các ngón:</strong> ngón trỏ dài (so với ngón áp út)
                  gợi thiên lãnh đạo, cái tôi; ngón áp út dài gợi thiên sáng tạo, mạo hiểm.
                </li>
                <li>
                  <strong>Vân tay (loa / sóng / móc):</strong> thường khó đọc chính xác nếu ảnh
                  không đủ nét, nên bỏ qua khi không chắc.
                </li>
              </ul>
              <p className="text-sm">
                Một lưu ý về khoa học: có một số nghiên cứu về tỉ lệ chiều dài ngón trỏ so với
                ngón áp út (gọi là 2D:4D), nhưng kết quả <strong>còn tranh cãi và chưa thống
                nhất</strong>. Phần diễn giải tướng số ở đây hoàn toàn là tham khảo, KHÔNG dựa
                trên các nghiên cứu đó — đừng gộp hai thứ làm một.
              </p>
              <p className="text-sm">
                Và nhắc lại điểm nền của cả môn: nhân tướng học là quan sát kinh nghiệm dân
                gian, chưa được khoa học kiểm chứng. Tinh thần “tướng tự tâm sinh” nhắc rằng nét
                tay phản ánh nếp sống hiện tại và thay đổi theo thời gian — không một bức ảnh nào
                định đoạt cả cuộc đời. Nếu một mô tả nghe “câu nào cũng đúng”, đó có thể là hiệu
                ứng Forer/Barnum; giá trị của xem chỉ tay là để tự ngẫm, không phải để “đoán đúng”.
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
                  <dt className="font-heading text-sm text-foreground sm:w-64 sm:shrink-0">
                    {g.term}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-foreground/85 sm:mt-0">
                    {g.def}
                  </dd>
                </div>
              ))}
            </dl>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <PalmWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <PalmRecall />,
        },
        {
          id: 'giai-thich',
          tocLabel: 'Giải thích chi tiết',
          heading: 'Giải thích chi tiết',
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
          children: <PalmChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
