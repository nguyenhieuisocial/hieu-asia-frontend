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
  CanXuongFrame,
  CanXuongDepth,
  CanXuongRecall,
  CanXuongChecklist,
  CanXuongWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Cân Xương Đoán Số — cách tính & ý nghĩa',
  description:
    'Cân Xương Đoán Số: gán trọng lượng cho 4 yếu tố năm–tháng–ngày–giờ sinh âm lịch, cộng thành tổng "cân nặng xương", tra bài thơ đoán vận. Góc nhìn tham khảo.',
  alternates: { canonical: 'https://hieu.asia/learn/can-xuong' },
};

// 4 yếu tố góp trọng lượng — dùng cho phần hiển thị (không bịa số lạng cụ thể,
// chỉ mô tả vai trò từng yếu tố và bảng tra tương ứng).
const FACTORS = [
  {
    name: 'Năm sinh',
    unit: 'theo can–chi',
    detail:
      'Tra theo 60 can–chi (vd Canh Ngọ, Tân Mùi…). Mỗi năm can–chi có một trọng lượng cố định.',
  },
  {
    name: 'Tháng sinh',
    unit: '12 tháng âm',
    detail: 'Tháng sinh âm lịch (giêng đến chạp) có bảng trọng lượng riêng cho từng tháng.',
  },
  {
    name: 'Ngày sinh',
    unit: '30 ngày âm',
    detail: 'Ngày sinh âm lịch (mùng 1 đến 30) — mỗi ngày ứng một trọng lượng trong bảng.',
  },
  {
    name: 'Giờ sinh',
    unit: '12 canh giờ',
    detail: 'Giờ sinh theo 12 canh giờ (Tý, Sửu, Dần…) — mỗi giờ có một trọng lượng riêng.',
  },
];

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS = [
  {
    q: 'Cân xương đoán số là gì?',
    a: 'Cân xương đoán số (稱骨算命 — cân xương tính lượng) là một phương pháp bói dân gian, tương truyền của Viên Thiên Cang đời Đường. Người ta gán một "trọng lượng xương" (đơn vị lạng, chỉ) cho 4 yếu tố ngày sinh âm lịch: năm (theo can–chi), tháng, ngày, giờ; cộng lại thành tổng "cân nặng xương" rồi tra sang một bài thơ đoán vận tương ứng. Đây là một nét văn hoá dân gian, mang tính tham khảo — không phải lời phán về số mệnh.',
  },
  {
    q: 'Cân xương tính theo lịch âm hay lịch dương?',
    a: 'Theo lịch âm. Cả 4 yếu tố năm–tháng–ngày–giờ đều tra theo can–chi và lịch âm, nên khi nhập ngày sinh cần dùng ngày âm lịch (hoặc để công cụ tự quy đổi từ ngày dương sang ngày âm). Dùng nhầm ngày dương sẽ ra kết quả sai.',
  },
  {
    q: 'Vì sao bạn tôi cùng "cân nặng" và cùng bài thơ với tôi?',
    a: 'Vì cân xương rất thô: nó chỉ dựa trên ngày–giờ sinh theo can chi rồi quy về một con số duy nhất (tổng cân nặng). Độ phân giải rất thấp, nên hàng triệu người sinh cùng năm–tháng–ngày–giờ can chi sẽ có cùng tổng và cùng một bài thơ. Đó là bản chất của phương pháp, không phải công cụ bị lỗi.',
  },
  {
    q: 'Cân nặng nhẹ có phải là "số khổ" không?',
    a: 'Không. "Nặng" hay "nhẹ" chỉ là quan niệm dân gian mang tính động viên: tổng nặng thường ứng bài thơ nghe "thuận" hơn, tổng nhẹ ứng bài "vất vả" hơn. Nhưng đây không phải phán quyết số mệnh — cân xương không cá nhân hoá và không thể quyết định đời ai. Nên đọc bài thơ như một lời động viên tích cực, không phải kết luận về cuộc đời.',
  },
  {
    q: 'Cân xương khác gì Bát Tự và Tử Vi?',
    a: 'Cân xương chỉ quy 4 yếu tố ngày sinh về một con số rồi tra một bài thơ soạn sẵn — rất thô và không cá nhân hoá. Bát Tự (Tứ Trụ) và Tử Vi thì dựng cả một lá số chi tiết (nhiều trụ, nhiều sao, các tương tác) nên phân biệt được nhiều người hơn và phân tích sâu hơn nhiều. Vì thế cân xương chỉ nên xem như giải trí và tham khảo nhanh.',
  },
  {
    q: 'Có nên tin tuyệt đối vào cân xương không?',
    a: 'Không nên. Cân xương là một phương pháp rất thô, hàng triệu người trùng kết quả, và bản văn phổ biến chỉ định hình ở đời sau như một di sản dân gian. Hãy xem nó như một trò đọc cho vui, mang tính động viên — hieu.asia trình bày để bạn tham khảo, không phán số mệnh và không dùng nó để hù doạ hay bán lễ.',
  },
];

const JSONLD = [
  article({
    headline: 'Cân Xương Đoán Số: cách tính "cân nặng xương" và ý nghĩa — nền tảng cho người mới',
    description:
      'Cân xương đoán số (稱骨算命): gán trọng lượng cho 4 yếu tố năm–tháng–ngày–giờ sinh âm lịch, cộng thành tổng "cân nặng xương" rồi tra bài thơ đoán vận. Góc nhìn tham khảo, không mê tín, không phán số mệnh.',
    url: '/learn/can-xuong',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Cân Xương Đoán Số', url: '/learn/can-xuong' },
  ]),
  faqPage(FAQS),
];

export default function LearnCanXuongPage() {
  return (
    <LearnArticle
      eyebrow="ĐÔNG PHƯƠNG · CÂN XƯƠNG"
      title={
        <>
          Cân Xương{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            Đoán Số
          </span>
        </>
      }
      standfirst={
        <>
          Cân xương đoán số là cách bói dân gian quy ngày giờ sinh thành một con số dễ nhớ: gán "trọng
          lượng xương" cho năm, tháng, ngày, giờ sinh âm lịch, cộng lại thành tổng "cân nặng xương" rồi
          đọc bài thơ tương ứng. Đây là một góc nhìn tham khảo theo phong tục — đọc như lời động viên,
          không phải lời phán về số mệnh.
        </>
      }
      readMeta="7 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Cân Xương Đoán Số' },
      ]}
      relatedLenses={relatedLearnLenses('can-xuong')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Nhập ngày giờ sinh âm lịch, hệ thống tự tra trọng lượng từng yếu tố, cộng thành tổng "cân nặng xương" và cho bạn bài thơ đoán vận tương ứng để tham khảo.',
        href: '/can-xuong',
        label: 'Cân xương của bạn',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <CanXuongFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Cân xương đoán số là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                "Cân xương đoán số" (稱骨算命 — <strong>cân xương tính lượng</strong>) là một phương pháp
                bói dân gian, <strong>tương truyền của Viên Thiên Cang</strong> đời Đường. Ý tưởng cốt
                lõi rất mộc mạc: quy ngày giờ sinh của một người thành một con số dễ nhớ — gọi vui là
                "cân nặng xương" — rồi đọc bài thơ đoán vận ứng với con số đó.
              </p>
              <p>Cần phân biệt rõ ngay từ đầu:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Cân xương là <strong>góc nhìn tham khảo theo phong tục</strong>, cho một cái nhìn
                  nhanh và một bài thơ động viên — không phải phán quyết về số phận.
                </li>
                <li>
                  Tổng "nặng" hay "nhẹ" chỉ là <strong>quan niệm dân gian</strong>: nặng thường ứng bài
                  thơ nghe thuận hơn, nhẹ ứng bài vất vả hơn — nhưng đọc như lời động viên, không phải
                  điều đáng lo.
                </li>
              </ul>
              <p>
                Một điều quan trọng để giữ đúng tinh thần: đây không phải công cụ để hù doạ hay để phán
                đời ai. hieu.asia trình bày để bạn <strong>tham khảo cho vui</strong>, trung thực rằng
                phương pháp <strong>rất thô</strong> và không phán số mệnh.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <CanXuongDepth />,
        },
        {
          id: 'bon-trong-luong',
          tocLabel: '4 trọng lượng',
          heading: '4 trọng lượng: năm – tháng – ngày – giờ',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Cân xương gán một <strong>"trọng lượng xương"</strong> (đơn vị <strong>lạng</strong>,{' '}
                <strong>chỉ</strong>) cho đúng 4 yếu tố của ngày sinh — tất cả theo <strong>lịch âm</strong>.
                Mỗi yếu tố được tra theo một bảng cố định; bạn không cần nhớ bảng, công cụ tự tra khi bạn
                nhập ngày giờ sinh.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {FACTORS.map((f) => (
                  <div
                    key={f.name}
                    className="rounded-xl border border-border bg-card/40 p-4"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-heading text-base font-semibold text-foreground">
                        {f.name}
                      </span>
                      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                        {f.unit}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {f.detail}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-foreground/70">
                Con số cụ thể của từng ô (bao nhiêu lạng, bao nhiêu chỉ) nằm trong các bảng truyền
                thống — phần này chỉ để bạn hiểu <strong>bốn yếu tố nào</strong> góp vào tổng, thay vì
                nhận một kết quả "hộp đen".
              </p>
            </div>
          ),
        },
        {
          id: 'cach-cong-doc-tho',
          tocLabel: 'Cách cộng & đọc thơ',
          heading: 'Cách cộng & đọc bài thơ',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <h3 className="text-lg font-semibold text-foreground">
                Bước 1 — Tra 4 trọng lượng
              </h3>
              <p>
                Từ ngày giờ sinh <strong>âm lịch</strong>, tra trọng lượng của bốn yếu tố: năm (theo
                can–chi), tháng, ngày, giờ. Mỗi yếu tố cho một giá trị tính bằng lạng / chỉ.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Bước 2 — Cộng thành tổng "cân nặng xương"
              </h3>
              <p>
                Cộng cả bốn trọng lượng lại được <strong>tổng "cân nặng xương"</strong>, thường rơi vào
                khoảng <strong>2 lạng 1 đến chừng 7 lạng 1</strong>. Chính con số tổng này — chứ không
                phải từng yếu tố riêng lẻ — mới là thứ dùng để tra bài thơ.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Bước 3 — Đối chiếu tổng với bài thơ
              </h3>
              <p>
                Mỗi mức tổng ứng với đúng <strong>một bài thơ</strong> đoán vận đã được soạn sẵn. Theo
                quan niệm dân gian, tổng nặng thường ứng bài thơ nghe "sang, thuận" hơn, tổng nhẹ ứng
                bài "vất vả" hơn — nhưng đây chỉ là <strong>lời động viên</strong>, không phải phán quyết.
              </p>
              <p className="text-sm text-foreground/70">
                Bạn không cần tự tra bảng: công cụ cân xương tự tính khi bạn nhập ngày giờ sinh âm lịch,
                rồi hiện luôn bài thơ tương ứng để bạn đọc tham khảo.
              </p>
            </div>
          ),
        },
        {
          id: 'vi-sao-trung-ket-qua',
          tocLabel: 'Vì sao nhiều người trùng',
          heading: 'Vì sao nhiều người trùng kết quả',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là điểm mấu chốt cần hiểu để đọc cân xương cho đúng tinh thần. Cân xương{' '}
                <strong>chỉ phụ thuộc ngày–giờ sinh theo can chi</strong> rồi quy tất cả về{' '}
                <strong>một con số duy nhất</strong> (tổng cân nặng). Độ phân giải của nó rất thấp: cả
                một khoảng rộng ngày giờ sinh dồn về cùng một mức tổng.
              </p>
              <p>
                Hệ quả trực tiếp: <strong>hàng triệu người cùng "cân nặng"</strong> và cùng đọc một bài
                thơ. Một bài thơ dùng chung cho vô số người thì <strong>không thể</strong> là lời phán
                riêng cho bất kỳ ai — nó chỉ là một khuôn chung mang tính động viên.
              </p>
              <p>
                Vì thế, khi thấy bạn bè cùng "cân nặng" và cùng bài thơ với mình, đó{' '}
                <strong>không phải công cụ bị lỗi</strong> — mà đúng là bản chất thô của phương pháp. Và
                cũng chính vì thô như vậy, cân xương nên được xem như <strong>giải trí và tham khảo</strong>,
                không phải chẩn đoán số mệnh.
              </p>
            </div>
          ),
        },
        {
          id: 'nguon-goc-vien-thien-cang',
          tocLabel: 'Nguồn gốc',
          heading: 'Nguồn gốc: Viên Thiên Cang',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Cân xương đoán số thường được gắn với tên <strong>Viên Thiên Cang</strong> (Yuan
                Tiangang) — một nhà thiên văn, tướng số nổi tiếng đời Đường. Việc gắn tên một danh nhân
                đời Đường giúp phương pháp có "gốc gác" và sức thuyết phục trong dân gian.
              </p>
              <p>
                Tuy nhiên, cần trung thực: <strong>bản văn phổ biến</strong> của cân xương (các bảng
                trọng lượng và bộ bài thơ như ta thấy ngày nay) <strong>định hình ở đời sau</strong>,
                chứ không hẳn nguyên vẹn từ thời Viên Thiên Cang. Nói cách khác, đây là một{' '}
                <strong>di sản văn hoá dân gian</strong> được bồi đắp qua nhiều đời, hơn là một "công
                thức khoa học" của một tác giả duy nhất.
              </p>
              <p>
                Hiểu nguồn gốc rồi sẽ thấy: cân xương là một nét đẹp văn hoá đáng trân trọng vì sự mộc
                mạc và tinh thần động viên của nó — không phải vì nó "chính xác". Trân trọng di sản,
                nhưng đọc kết quả với tâm thế <strong>nhẹ nhàng, tham khảo</strong>.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han-cach-doc-lanh-manh',
          tocLabel: 'Giới hạn & cách đọc',
          heading: 'Giới hạn & cách đọc lành mạnh',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Cách "đọc" cân xương lành mạnh nhất là xem bài thơ như một <strong>lời động viên</strong>:
                nếu bài thơ nghe thuận, hãy để nó tiếp thêm chút lạc quan; nếu nghe vất vả, cũng đừng để
                nó làm bạn buồn lo — vì nó không quyết định gì cả. Chủ động và cố gắng của bạn quan trọng
                hơn mọi bài thơ.
              </p>
              <p>Giới hạn cần ghi nhớ:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Cân xương <strong>rất thô</strong>: chỉ dùng ngày–giờ sinh theo can chi, quy về một
                  con số nên <strong>hàng triệu người trùng kết quả</strong>. Nó không cá nhân hoá.
                </li>
                <li>
                  Vì thế cân xương <strong>không</strong> chi tiết như Bát Tự hay Tử Vi (vốn dựng cả lá
                  số riêng), và <strong>không</strong> dự đoán chắc chắn được điều gì.
                </li>
                <li>
                  Tổng "nhẹ" <strong>không</strong> có nghĩa là "số khổ"; tổng "nặng" cũng không bảo đảm
                  điều gì. Đây là quan niệm dân gian mang tính động viên, <strong>không phải phán quyết</strong>.
                </li>
              </ul>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <CanXuongWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <CanXuongRecall />,
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
                Muốn thử cân xương của mình?{' '}
                <Link
                  href="/can-xuong"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  Cân xương miễn phí →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/bat-tu', label: 'Xem Bát Tự' },
                    { href: '/tu-vi', label: 'Xem Tử Vi' },
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
          children: <CanXuongChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
