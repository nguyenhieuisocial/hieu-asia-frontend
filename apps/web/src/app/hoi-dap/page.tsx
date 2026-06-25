import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';

const TITLE = 'Hỏi đáp về hieu.asia — Tử Vi AI, Bát Tự, MBTI & các phương pháp';
const DESCRIPTION =
  'Giải đáp ngắn gọn, trung thực: hieu.asia là gì, có phải xem bói không, có chính xác không, Tử Vi / Bát Tự / MBTI / Big Five / DISC là gì và nên bắt đầu từ đâu.';

interface QA {
  q: string;
  a: string;
}

const VE_HIEU_ASIA: QA[] = [
  {
    q: 'hieu.asia là gì?',
    a: 'hieu.asia là nền tảng "hiểu mình" bằng AI, kết hợp các lăng kính phương Đông (Tử Vi, Bát Tự) và tâm lý học hiện đại (MBTI, Big Five, DISC). Mục tiêu là giúp bạn tự hiểu bản thân và ra quyết định tốt hơn — không phán định số mệnh.',
  },
  {
    q: 'hieu.asia có phải xem bói không?',
    a: 'Không. hieu.asia trình bày mọi kết quả như công cụ tham khảo và chiêm nghiệm để hiểu bản thân, không khẳng định định mệnh và không hù doạ. Định vị xuyên suốt là "credible, không bói toán, không mê tín".',
  },
  {
    q: 'Kết quả có chính xác không?',
    a: 'Phần tính toán (lập lá số, ngày giờ, ngũ hành) chính xác theo thuật toán. Phần luận giải là góc nhìn tham khảo, có đối chiếu cổ thư và cá nhân hoá bằng AI. Giá trị nằm ở sự chiêm nghiệm, không phải "tiên tri".',
  },
  {
    q: 'hieu.asia có miễn phí không?',
    a: 'Nhiều công cụ miễn phí và cho kết quả ngay: MBTI, Big Five, DISC, Lịch Vạn Niên, hợp tuổi, xem ngày tốt… Một số phần đọc chuyên sâu có gói trả phí.',
  },
  {
    q: 'Cần cung cấp thông tin gì?',
    a: 'Tử Vi và Bát Tự cần ngày và giờ sinh chính xác. Các trắc nghiệm tâm lý (MBTI, Big Five, DISC) chỉ cần bạn trả lời bộ câu hỏi.',
  },
  {
    q: 'Dữ liệu của tôi có an toàn không?',
    a: 'Thông tin bạn nhập được dùng để tạo kết quả cho chính bạn. Bạn có thể xem chi tiết tại trang Chính sách quyền riêng tư (hieu.asia/privacy).',
  },
];

const VE_PHUONG_PHAP: QA[] = [
  {
    q: 'Tử Vi (Đẩu Số) là gì?',
    a: 'Tử Vi Đẩu Số là phương pháp luận mệnh phương Đông, lập một lá số gồm 12 cung và hàng chục sao dựa trên ngày, giờ sinh để mô tả các khía cạnh cuộc đời.',
  },
  {
    q: 'Bát Tự (Tứ Trụ) là gì?',
    a: 'Bát Tự là "tám chữ" Can - Chi của bốn trụ giờ, ngày, tháng, năm sinh. Trục chính là Nhật Chủ (can ngày) — đại diện cho chính bạn; đọc tương quan ngũ hành quanh Nhật Chủ để thấy thiên hướng và thời điểm thuận cho từng việc.',
  },
  {
    q: 'MBTI là gì?',
    a: 'MBTI phân loại tính cách thành 16 nhóm dựa trên bốn cặp xu hướng (hướng nội/ngoại, giác quan/trực giác, lý trí/cảm xúc, nguyên tắc/linh hoạt). Dễ nhớ và phổ biến để bắt đầu hiểu mình.',
  },
  {
    q: 'Big Five là gì?',
    a: 'Big Five (OCEAN) đo 5 chiều tính cách theo thang liên tục: Cởi mở, Tận tâm, Hướng ngoại, Dễ chịu, Bất ổn cảm xúc. Đây là mô hình có nền nghiên cứu tâm lý vững nhất.',
  },
  {
    q: 'DISC là gì?',
    a: 'DISC mô tả 4 phong cách hành vi và giao tiếp: Quyết đoán (D), Ảnh hưởng (i), Ổn định (S), Tuân thủ (C). Rất hữu ích cho làm việc nhóm và giao tiếp.',
  },
  {
    q: '"Tử Vi AI" khác gì xem tử vi thông thường trên mạng?',
    a: 'hieu.asia tính lá số chuẩn bằng thuật toán, rồi luận giải cá nhân hoá bằng AI có đối chiếu nguồn cổ thư — thay vì những bài "văn mẫu" chung chung. Bạn cũng có thể so sánh nhiều lăng kính để có góc nhìn đa chiều.',
  },
  {
    q: 'Tôi nên bắt đầu từ đâu?',
    a: 'Tuỳ mục tiêu: muốn nhanh thì làm một trắc nghiệm tâm lý (không cần giờ sinh); muốn chiều sâu phương Đông thì xem Tử Vi hoặc Bát Tự (cần giờ sinh). Xem tất cả công cụ tại hieu.asia/cong-cu.',
  },
];

const TU_VI_BAT_TU_SAU: QA[] = [
  {
    q: 'Tứ Hóa trong Tử Vi là gì?',
    a: 'Tứ Hóa là bốn biến hoá của sao — Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ — an theo Thiên Can năm sinh. Chúng cho biết đâu là điểm được trợ lực và đâu là điểm cần lưu tâm trong lá số.',
  },
  {
    q: 'Đại vận là gì, mỗi đại vận kéo dài bao lâu?',
    a: 'Đại vận là giai đoạn lớn của cuộc đời, mỗi đại vận kéo dài 10 năm và lần lượt đi qua các cung. Nó cho biết "bối cảnh" chủ đạo của mỗi chặng — bạn xem đại vận thật của mình ở mục Đại vận hiện tại.',
  },
  {
    q: 'Lưu niên và lưu nguyệt là gì?',
    a: 'Lưu niên là lớp sao chiếu theo từng năm, lưu nguyệt là theo từng tháng. Chúng dùng để chọn thời điểm trong một giai đoạn, chứ không để phán một năm là "tốt" hay "xấu" tuyệt đối.',
  },
  {
    q: 'Thập Thần trong Bát Tự là gì?',
    a: 'Thập Thần là mười mối quan hệ giữa các Can trong lá Bát Tự với Nhật Chủ (bản thân), ví dụ Chính Quan, Thiên Tài, Thực Thần… Chúng mô tả cách bạn tương tác với sự nghiệp, tiền bạc, người thân và áp lực.',
  },
  {
    q: 'Cung Mệnh và cung Thân khác nhau thế nào?',
    a: 'Cung Mệnh thiên về bản chất, tư duy và con người bên trong; cung Thân thiên về hành động, hậu vận và phần thể hiện ra bên ngoài. Đọc cả hai cho bức tranh cân bằng hơn.',
  },
  {
    q: 'Chính tinh và phụ tinh là gì?',
    a: 'Chính tinh là 14 sao chính, đóng vai trò "nhân vật chính" định hình mỗi cung; phụ tinh là các sao bổ trợ làm rõ sắc thái. Luận giải tốt cần đặt sao trong tương quan, không đọc rời từng sao.',
  },
  {
    q: 'Không nhớ chính xác giờ sinh thì xem Tử Vi được không?',
    a: 'Giờ sinh quyết định nhiều yếu tố nên sai giờ sẽ lệch lá số. Nếu không chắc giờ, bạn vẫn xem được Bát Tự theo ngày, hoặc dùng các trắc nghiệm tâm lý (không cần giờ sinh) để bắt đầu.',
  },
];

const THEO_TUNG_VIEC: QA[] = [
  {
    q: 'Xem hợp tuổi vợ chồng có đáng tin không?',
    a: 'Hợp tuổi theo Can Chi (Tam Hợp, Lục Hợp, Tứ Hành Xung) là một tín hiệu tham khảo, không phải điều kiện quyết định hôn nhân. hieu.asia trình bày theo hướng dung hoà: "khác nhịp" không có nghĩa là không thể hạnh phúc.',
  },
  {
    q: 'Xem ngày tốt dựa trên những gì?',
    a: 'Ngày tốt được xét theo lịch can chi: trực ngày, sao tốt/xấu, giờ hoàng đạo và sự tương hợp với tuổi gia chủ cho từng việc. Đây là gợi ý truyền thống để an tâm và sắp xếp, không phải bảo đảm kết quả.',
  },
  {
    q: 'Sao hạn (Cửu Diệu) là gì? Có cần cúng giải hạn không?',
    a: 'Cửu Diệu là chín ngôi sao luân phiên chiếu mỗi năm theo tuổi, có sao thuận có sao cần thận trọng. hieu.asia nêu để bạn biết mà chủ động sống cẩn thận hơn — không bán dịch vụ cúng giải hạn và không khuyên bạn phải làm vậy.',
  },
  {
    q: 'Xem tuổi làm nhà, xông đất để làm gì?',
    a: 'Đó là tục chọn năm hoặc người hợp tuổi cho việc trọng đại (Kim Lâu, Hoang Ốc, Tam Tai…). hieu.asia tính rõ ràng và giải thích từng bước để bạn hiểu "vì sao", chứ không chỉ phán hợp hay không hợp.',
  },
  {
    q: 'Đặt tên con theo ngũ hành có cần thiết không?',
    a: 'Đặt tên theo ngũ hành là gợi ý văn hoá để chọn tên hài hoà với mệnh của bé. hieu.asia coi đây là gợi ý tham khảo dễ thương, không phán số mệnh đứa trẻ — ý nghĩa và cách gọi vẫn quan trọng hơn.',
  },
  {
    q: 'Tử Vi có dự đoán được bệnh tật, sức khoẻ không?',
    a: 'Tử Vi có cung Tật Ách gợi ý khuynh hướng cần lưu tâm, nhưng đó không phải chẩn đoán y khoa. Mọi vấn đề sức khoẻ nên hỏi bác sĩ — tử vi chỉ là lời nhắc giữ gìn, không thay khám chữa bệnh.',
  },
  {
    q: 'Có nên dựa vào Tử Vi để quyết định việc lớn (cưới hỏi, đổi việc)?',
    a: 'Nên xem như một góc tham khảo cùng lý trí và hoàn cảnh thật, không phải căn cứ duy nhất. Công cụ Quyết định của hieu.asia chính là để kết hợp lá số với bối cảnh của bạn rồi gợi ý bước đi, thay vì phán đúng/sai.',
  },
];

const VE_AI_TIN_CAY: QA[] = [
  {
    q: 'hieu.asia dùng AI nào để luận giải?',
    a: 'hieu.asia dùng các mô hình ngôn ngữ lớn hàng đầu hiện nay, định tuyến theo tác vụ — phần đọc chuyên sâu dùng mô hình mạnh nhất. Phần tính toán lá số là thuật toán cố định, không do AI "đoán".',
  },
  {
    q: 'Làm sao biết AI không "bịa" lời giải?',
    a: 'Có hai lớp kiểm soát: phần tính toán (lá số, ngũ hành, ngày giờ) chạy bằng thuật toán chính xác; phần luận giải được neo vào dữ liệu cổ thư và cấu trúc lá số thật của bạn, kèm trích nguồn ở nhiều mục. Dù vậy, hãy đọc như một góc nhìn tham khảo.',
  },
  {
    q: '"Cổ thư" mà hieu.asia đối chiếu là gì?',
    a: 'Là các sách kinh điển của từng phương pháp — ví dụ Tử Vi Đẩu Số Toàn Thư cho Tử Vi, Trích Thiên Tuỷ cho Bát Tự. Nhiều phần luận giải có dòng "Đối chiếu: …" để bạn biết nhận định dựa trên nguồn nào.',
  },
  {
    q: 'Hai phương pháp cho kết quả khác nhau thì nên tin cái nào?',
    a: 'Không có phương pháp nào "đúng tuyệt đối". Mỗi lăng kính soi một góc; chỗ chúng trùng nhau thường là tín hiệu đáng chú ý, chỗ khác nhau là lời mời bạn tự chiêm nghiệm. Trang So sánh giúp bạn nhìn đa chiều.',
  },
  {
    q: 'hieu.asia có thay được thầy tử vi hay chuyên gia tâm lý không?',
    a: 'Không. Đây là công cụ tự hiểu mình, không thay tư vấn chuyên sâu của chuyên gia, và càng không thay bác sĩ hay nhà trị liệu khi bạn cần. Hãy xem nó là điểm khởi đầu để suy nghĩ rõ ràng hơn.',
  },
  {
    q: 'Tôi có thể xoá dữ liệu của mình không?',
    a: 'Có. Bạn có thể yêu cầu xoá dữ liệu theo hướng dẫn ở trang Chính sách quyền riêng tư (hieu.asia/privacy). Thông tin bạn nhập chủ yếu dùng để tạo kết quả cho chính bạn.',
  },
];

const ALL_QA = [
  ...VE_HIEU_ASIA,
  ...VE_PHUONG_PHAP,
  ...TU_VI_BAT_TU_SAU,
  ...THEO_TUNG_VIEC,
  ...VE_AI_TIN_CAY,
];

function QaList({ items }: { items: QA[] }) {
  return (
    <div className="mt-4 space-y-4">
      {items.map((f) => (
        <div key={f.q} className="rounded-xl border border-border bg-card/40 p-5">
          <h3 className="font-semibold text-foreground">{f.q}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
        </div>
      ))}
    </div>
  );
}

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://hieu.asia/hoi-dap' },
  openGraph: {
    title: 'Hỏi đáp về hieu.asia',
    description: 'Tử Vi AI, Bát Tự, MBTI, Big Five, DISC — giải đáp ngắn gọn, trung thực.',
    url: 'https://hieu.asia/hoi-dap',
    type: 'website' as const,
    images: OG_DEFAULT_IMAGES,
  },
};

export default function HoiDapPage() {
  return (
    <>
      <JsonLd
        data={[
          webPage({ name: TITLE, description: DESCRIPTION, url: '/hoi-dap' }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Hỏi đáp', url: '/hoi-dap' },
          ]),
          faqPage(ALL_QA),
        ]}
      />
      <ToolPageShell
        eyebrow="Hỏi đáp"
        relatedSlug="/hoi-dap"
        icon={<span aria-hidden="true">💬</span>}
        title={
          <>
            Câu hỏi <GoldAccent>thường gặp</GoldAccent>
          </>
        }
        description={DESCRIPTION}
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Hỏi đáp' },
        ]}
      >
        <section className="mt-8" aria-label="Về hieu.asia">
          <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
            Về hieu.asia
          </h2>
          <QaList items={VE_HIEU_ASIA} />
        </section>

        <section className="mt-10" aria-label="Về các phương pháp">
          <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
            Về các phương pháp
          </h2>
          <QaList items={VE_PHUONG_PHAP} />
        </section>

        <section className="mt-10" aria-label="Tử Vi & Bát Tự chuyên sâu">
          <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
            Tử Vi &amp; Bát Tự — chuyên sâu
          </h2>
          <QaList items={TU_VI_BAT_TU_SAU} />
        </section>

        <section className="mt-10" aria-label="Theo từng việc">
          <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
            Theo từng việc cụ thể
          </h2>
          <QaList items={THEO_TUNG_VIEC} />
        </section>

        <section className="mt-10" aria-label="AI và độ tin cậy">
          <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
            AI &amp; độ tin cậy
          </h2>
          <QaList items={VE_AI_TIN_CAY} />
        </section>

        <section className="mt-10">
          <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
              Bắt đầu khám phá
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/80 sm:text-base">
              Thử một công cụ miễn phí, hoặc xem so sánh các lăng kính để chọn cái phù hợp với bạn.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/cong-cu"
                className="inline-flex items-center gap-1.5 rounded-lg bg-gold-gradient px-5 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                Tất cả công cụ
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/so-sanh"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
              >
                So sánh các lăng kính
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <p className="mt-10 text-center text-xs text-foreground/40">
          hieu.asia — Hiểu mình. Quyết định mình. Tham khảo, không bói toán.
        </p>
      </ToolPageShell>
    </>
  );
}
