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
import { SAO_ORDER, SAO_INFO, TYPE_LABEL, type SaoType } from '@/lib/sao-han';
import {
  SaoHanFrame,
  SaoHanDepth,
  SaoHanRecall,
  SaoHanChecklist,
  SaoHanWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Sao Hạn Cửu Diệu — 9 sao chiếu mệnh theo tuổi',
  description:
    'Sao hạn Cửu Diệu: 9 sao chiếu mệnh theo tuổi và giới tính — La Hầu, Kế Đô, Thái Bạch, Thái Dương, Thái Âm… Góc nhìn tham khảo, không mê tín.',
  alternates: { canonical: 'https://hieu.asia/learn/sao-han' },
};

const TYPE_DOT: Record<SaoType, string> = {
  tot: 'bg-emerald-500',
  trung: 'bg-amber-500',
  xau: 'bg-rose-500',
};

// Bảng tra nhanh: CHÉP ĐÚNG từ NAM_BY_MOD / NU_BY_MOD trong lib/sao-han.ts
// (bảng đã đối chiếu 15 trường hợp, khoá — không tự tính lại, không sửa).
// Thứ tự hàng theo phần dư 1→8 rồi 0 (0 = tuổi mụ chia hết cho 9: 9, 18, 27…).
const QUICK_TABLE: { mod: string; nam: string; nu: string }[] = [
  { mod: '1', nam: 'La Hầu', nu: 'Kế Đô' },
  { mod: '2', nam: 'Thổ Tú', nu: 'Vân Hớn' },
  { mod: '3', nam: 'Thủy Diệu', nu: 'Mộc Đức' },
  { mod: '4', nam: 'Thái Bạch', nu: 'Thái Âm' },
  { mod: '5', nam: 'Thái Dương', nu: 'Thổ Tú' },
  { mod: '6', nam: 'Vân Hớn', nu: 'La Hầu' },
  { mod: '7', nam: 'Kế Đô', nu: 'Thái Dương' },
  { mod: '8', nam: 'Thái Âm', nu: 'Thái Bạch' },
  { mod: '0 (chia hết cho 9)', nam: 'Mộc Đức', nu: 'Thủy Diệu' },
];

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS = [
  {
    q: 'Sao hạn (Cửu Diệu) là gì?',
    a: 'Theo phong tục phương Đông, mỗi năm có một trong 9 sao Cửu Diệu "chiếu" vào mỗi người tuỳ theo tuổi âm và giới tính. 9 sao gồm 3 sao tốt (Thái Dương, Thái Âm, Mộc Đức), 3 trung tính (Thổ Tú, Thủy Diệu, Vân Hớn) và 3 sao xấu (La Hầu, Kế Đô, Thái Bạch). Đây là một nét văn hoá tín ngưỡng, mang tính tham khảo — không phải lời phán về số mệnh.',
  },
  {
    q: 'Cách tính sao hạn theo tuổi như thế nào?',
    a: 'Lấy tuổi mụ (tuổi âm ≈ năm xem trừ năm sinh cộng 1), lấy phần dư khi chia cho 9, rồi đối chiếu theo bảng riêng cho nam và nữ — vì cùng một tuổi, sao chiếu mệnh của nam và nữ khác nhau. Công cụ xem sao hạn tự tính giúp bạn khi nhập năm sinh và giới tính.',
  },
  {
    q: 'Vì sao cùng tuổi mà nam và nữ lại có sao chiếu khác nhau?',
    a: 'Vì sao hạn được tra theo hai bảng riêng cho nam và nữ. Dù tuổi mụ (và phần dư khi chia 9) giống nhau, bảng nam và bảng nữ ánh xạ phần dư đó sang các sao khác nhau. Ví dụ với nam, phần dư 1 ứng với La Hầu; với nữ, phần dư 1 lại ứng với Kế Đô.',
  },
  {
    q: 'Năm nay gặp sao xấu (La Hầu, Kế Đô, Thái Bạch) thì sao?',
    a: 'Sao xấu không có nghĩa là chắc chắn gặp xui. Theo quan niệm dân gian, đó là năm nên cẩn trọng hơn — giữ lời nói, thận trọng tiền bạc – giấy tờ, chú ý sức khoẻ. Sống cẩn thận và chủ động vẫn là điều quan trọng nhất, hơn mọi điềm báo.',
  },
  {
    q: 'La Hầu, Kế Đô có phải sao thật trên trời không?',
    a: 'Không. Trong 9 "sao" Cửu Diệu có 7 thiên thể thật (Mặt Trời, Mặt Trăng và 5 hành tinh Kim – Mộc – Thủy – Hỏa – Thổ), còn La Hầu (Rahu) và Kế Đô (Ketu) là hai giao điểm nơi quỹ đạo Mặt Trăng cắt đường hoàng đạo — đúng vùng trời xảy ra nhật thực, nguyệt thực. Người xưa thấy Mặt Trời, Mặt Trăng "bị nuốt" ở đó nên hình dung thành thần thoại, và hai "sao" này mang nghĩa che khuất, xáo trộn từ đó.',
  },
  {
    q: 'Có cần cúng sao giải hạn không?',
    a: 'Tuỳ niềm tin mỗi người. Một số gia đình làm lễ dâng sao đầu năm để cầu an — đó là nét văn hoá tín ngưỡng. hieu.asia chỉ giúp bạn tra cứu để tham khảo, không phán số mệnh và không bán lễ giải hạn. Hiểu nguồn gốc rồi sẽ thấy không cần sợ, càng không cần tốn tiền để "giải" một giao điểm hình học.',
  },
  {
    q: 'Vì sao nam và nữ lại dùng hai bảng sao khác nhau — có cơ sở thiên văn không?',
    a: 'Không có cơ sở thiên văn: vị trí thật của Mặt Trời, Mặt Trăng hay các hành tinh không phụ thuộc vào giới tính người xem. Hai bảng nam/nữ là quy ước dân gian được truyền lại qua các sách phong tục, và các tài liệu này không ghi lý do gốc vì sao chia như vậy. hieu.asia giữ đúng bảng truyền thống để bạn tra cứu phong tục, đồng thời nói rõ: đây là quy ước văn hoá, không phải quy luật tự nhiên.',
  },
  {
    q: 'Sao hạn có liên quan gì đến Tử Vi không?',
    a: 'Hai hệ khác nhau. Tử Vi Đẩu Số lập lá số theo đủ giờ – ngày – tháng – năm sinh với một hệ sao riêng, còn sao hạn Cửu Diệu là lớp phong tục dân gian riêng, chỉ cần năm sinh và giới tính. Một vài tên gọi trùng nhau (Thái Dương, Thái Âm cũng là tên sao trong Tử Vi) nhưng cách tính và vai trò khác hẳn, nên đừng trộn kết quả của hai hệ vào nhau.',
  },
];

const JSONLD = [
  article({
    headline: 'Sao Hạn (Cửu Diệu): 9 sao chiếu mệnh theo tuổi — nền tảng cho người mới',
    description:
      'Sao hạn (Cửu Diệu niên hạn): 9 sao chiếu mệnh theo tuổi và giới tính, cách suy ra sao và ý nghĩa từng sao. Góc nhìn tham khảo, không mê tín, không phán số mệnh.',
    url: '/learn/sao-han',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Sao Hạn (Cửu Diệu)', url: '/learn/sao-han' },
  ]),
  faqPage(FAQS),
];

export default function LearnSaoHanPage() {
  return (
    <LearnArticle
      eyebrow="ĐÔNG PHƯƠNG · CỬU DIỆU"
      title={
        <>
          Sao Hạn{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            (Cửu Diệu)
          </span>
        </>
      }
      standfirst={
        <>
          Sao hạn là cách người xưa gửi lời nhắc "năm nay nên lưu ý điều gì" lên bầu trời: mỗi năm có
          một trong 9 sao Cửu Diệu "chiếu" vào mỗi người theo tuổi và giới tính. Đây là một góc nhìn
          tham khảo theo phong tục — không phải lời phán về số mệnh.
        </>
      }
      readMeta="10 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Sao Hạn (Cửu Diệu)' },
      ]}
      relatedLenses={relatedLearnLenses('sao-han')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Nhập năm sinh và giới tính, hệ thống tính tuổi mụ và cho biết năm nay bạn gặp sao nào trong 9 sao Cửu Diệu, kèm ý nghĩa từng sao để tham khảo.',
        href: '/sao-han',
        label: 'Xem sao hạn của bạn',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <SaoHanFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Sao hạn là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                "Sao hạn" (còn gọi <strong>Cửu Diệu niên hạn</strong>) là phong tục phương Đông: mỗi
                năm có một trong <strong>9 sao Cửu Diệu</strong> "chiếu" vào mỗi người, tuỳ theo{' '}
                <strong>tuổi âm</strong> và <strong>giới tính</strong>. Nó là một cách người xưa nhắc
                nhau "năm nay nên lưu ý điều gì" — một di sản văn hoá tín ngưỡng.
              </p>
              <p>Cần phân biệt rõ ngay từ đầu:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Sao hạn là <strong>góc nhìn tham khảo theo phong tục</strong>, giúp bạn chủ động hơn
                  theo từng năm — không phải phán quyết may – rủi chắc chắn.
                </li>
                <li>
                  Gặp <strong>sao tốt</strong> không có nghĩa là buông lơi; gặp <strong>sao xấu</strong>{' '}
                  cũng không phải điều đáng sợ — chỉ là lời nhắc nên cẩn trọng hơn.
                </li>
              </ul>
              <p>
                Một điều quan trọng để giữ đúng tinh thần: đây không phải công cụ để hù doạ hay để bán
                lễ giải hạn. hieu.asia trình bày để bạn <strong>tham khảo</strong>, không phán số mệnh và{' '}
                <strong>không bán lễ giải hạn</strong>.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <SaoHanDepth />,
        },
        {
          id: 'chin-sao-cuu-dieu',
          tocLabel: '9 sao Cửu Diệu',
          heading: '9 sao Cửu Diệu — ba nhóm tốt · trung · xấu',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Cửu Diệu gồm 9 sao, dân gian chia thành ba nhóm theo sắc thái: <strong>cát tinh</strong>{' '}
                (tốt), <strong>trung tính</strong>, và <strong>hung tinh</strong> (cần thận trọng). Mỗi
                sao có một mô tả trung tính theo truyền thống — hãy đọc như xu hướng tham khảo, không
                phải phán định.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {SAO_ORDER.map((key) => {
                  const s = SAO_INFO[key];
                  return (
                    <div
                      key={key}
                      className="rounded-xl border border-border bg-card/40 p-4"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className={`h-2 w-2 rounded-full ${TYPE_DOT[s.type]}`}
                        />
                        <span className="font-heading text-base font-semibold text-foreground">
                          {s.name}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[13px] uppercase tracking-wide text-muted-foreground">
                        {TYPE_LABEL[s.type]}
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-foreground/60">
                        Thực chất: {s.origin}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {s.summary}
                      </p>
                      <details className="mt-3 border-t border-border pt-2">
                        <summary className="cursor-pointer text-[13px] font-medium text-gold-700 hover:underline">
                          Đọc sâu hơn về năm {s.name}
                        </summary>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {s.deepDive}
                        </p>
                      </details>
                    </div>
                  );
                })}
              </div>
            </div>
          ),
        },
        {
          id: 'cach-tinh',
          tocLabel: 'Cách suy ra sao',
          heading: 'Cách suy ra sao chiếu mệnh: tuổi mụ + giới tính',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <h3 className="text-lg font-semibold text-foreground">
                Bước 1 — Tính tuổi mụ
              </h3>
              <p>
                Sao hạn tính theo <strong>tuổi mụ</strong> (tuổi âm), không phải tuổi dương. Công thức
                truyền thống: <strong>tuổi mụ ≈ năm xem − năm sinh + 1</strong>. Ví dụ người sinh 1990
                xem hạn năm 2026 sẽ là tuổi mụ 37.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Bước 2 — Lấy phần dư khi chia 9
              </h3>
              <p>
                Vì có đúng 9 sao, người ta lấy <strong>tuổi mụ chia 9 lấy phần dư</strong> (0 đến 8).
                Phần dư này chính là "chỉ số" để tra sao — nên sao hạn lặp lại theo chu kỳ 9 năm.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Bước 3 — Đối chiếu bảng riêng nam / nữ
              </h3>
              <p>
                Cùng một phần dư, <strong>bảng cho nam và bảng cho nữ ánh xạ sang sao khác nhau</strong>
                . Vì thế hai người cùng tuổi nhưng khác giới sẽ chiếu hai sao khác nhau trong cùng một
                năm. Đây là lý do luôn cần cả năm sinh lẫn giới tính khi tra sao hạn.
              </p>
              <p className="text-sm text-foreground/70">
                Bạn không cần nhớ bảng: công cụ xem sao hạn tự tính khi bạn nhập năm sinh và giới tính.
                Phần này chỉ để bạn hiểu con số ở đâu ra, thay vì nhận một kết quả "hộp đen".
              </p>
            </div>
          ),
        },
        {
          id: 'bang-tra-nhanh',
          tocLabel: 'Bảng tra nhanh',
          heading: 'Bảng tra nhanh: phần dư → sao chiếu mệnh',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là bảng ánh xạ đầy đủ mà công cụ dùng để tra: lấy <strong>tuổi mụ chia 9, giữ
                phần dư</strong>, rồi đọc hàng tương ứng theo giới tính. Phần dư 0 nghĩa là tuổi mụ
                chia hết cho 9 (tuổi 9, 18, 27, 36…).
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[420px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Phần dư (tuổi mụ ÷ 9)
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Nam
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Nữ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {QUICK_TABLE.map((row) => (
                      <tr key={row.mod} className="border-b border-border/60 last:border-b-0">
                        <td className="px-4 py-2 text-muted-foreground">{row.mod}</td>
                        <td className="px-4 py-2 text-foreground">{row.nam}</td>
                        <td className="px-4 py-2 text-foreground">{row.nu}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <h3 className="text-lg font-semibold text-foreground">Hai ví dụ tính thử</h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Sinh 1990, xem năm 2026:</strong> tuổi mụ = 2026 − 1990 + 1 = 37. Lấy 37
                  chia 9 dư 1 → tra bảng: nam gặp <strong>La Hầu</strong>, nữ gặp{' '}
                  <strong>Kế Đô</strong>. Cùng một năm sinh nhưng hai sao khác nhau — đúng điểm dễ gây
                  bất ngờ của phong tục này.
                </li>
                <li>
                  <strong>Sinh 1993, xem năm 2026:</strong> tuổi mụ = 2026 − 1993 + 1 = 34. Lấy 34
                  chia 9 dư 7 → tra bảng: nam gặp <strong>Kế Đô</strong>, nữ gặp{' '}
                  <strong>Thái Dương</strong>.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Bảng này trùng khớp với bảng bên trong công cụ (đã đối chiếu với nguồn tra cứu công
                khai trên 15 trường hợp). Nếu kết quả bạn tra tay khác với công cụ, kiểm tra lại bước
                tính tuổi mụ trước — đó là chỗ hay nhầm nhất.
              </p>
            </div>
          ),
        },
        {
          id: 'tu-thien-van-den-phong-tuc',
          tocLabel: 'Nguồn gốc Cửu Diệu',
          heading: 'Từ thiên văn đến phong tục — Cửu Diệu là gì?',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Cửu Diệu bắt nguồn từ <strong>Navagraha</strong> — chín "thiên thể" trong thiên văn Ấn
                Độ cổ, theo dòng giao lưu văn hoá và Phật giáo truyền vào Đông Á rồi thành tục xem sao
                hạn. Trong đó có <strong>7 thiên thể thật</strong>: Mặt Trời (Thái Dương), Mặt Trăng
                (Thái Âm) và 5 hành tinh nhìn được bằng mắt thường — Kim tinh (Thái Bạch), Mộc tinh
                (Mộc Đức), Thủy tinh (Thủy Diệu), Hỏa tinh (Vân Hớn), Thổ tinh (Thổ Tú).
              </p>
              <p>
                Đối chiếu từng "sao" với từng graha trong Navagraha, mọi thứ khớp một-một:
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Sao Cửu Diệu
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Graha (Navagraha)
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Thực chất là gì
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/60">
                      <td className="px-4 py-2 text-foreground">Thái Dương</td>
                      <td className="px-4 py-2 text-muted-foreground">Surya</td>
                      <td className="px-4 py-2 text-muted-foreground">Mặt Trời</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="px-4 py-2 text-foreground">Thái Âm</td>
                      <td className="px-4 py-2 text-muted-foreground">Chandra</td>
                      <td className="px-4 py-2 text-muted-foreground">Mặt Trăng</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="px-4 py-2 text-foreground">Mộc Đức</td>
                      <td className="px-4 py-2 text-muted-foreground">Brihaspati</td>
                      <td className="px-4 py-2 text-muted-foreground">Mộc tinh (sao Mộc)</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="px-4 py-2 text-foreground">Thổ Tú</td>
                      <td className="px-4 py-2 text-muted-foreground">Shani</td>
                      <td className="px-4 py-2 text-muted-foreground">Thổ tinh (sao Thổ)</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="px-4 py-2 text-foreground">Thủy Diệu</td>
                      <td className="px-4 py-2 text-muted-foreground">Budha</td>
                      <td className="px-4 py-2 text-muted-foreground">Thủy tinh (sao Thủy)</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="px-4 py-2 text-foreground">Vân Hớn</td>
                      <td className="px-4 py-2 text-muted-foreground">Mangala</td>
                      <td className="px-4 py-2 text-muted-foreground">Hỏa tinh (sao Hỏa)</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="px-4 py-2 text-foreground">Thái Bạch</td>
                      <td className="px-4 py-2 text-muted-foreground">Shukra</td>
                      <td className="px-4 py-2 text-muted-foreground">
                        Kim tinh (sao Kim) lúc rạng sáng / chập tối
                      </td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="px-4 py-2 text-foreground">La Hầu</td>
                      <td className="px-4 py-2 text-muted-foreground">Rahu</td>
                      <td className="px-4 py-2 text-muted-foreground">
                        Không phải sao thật: giao điểm Bắc nơi quỹ đạo Mặt Trăng cắt hoàng đạo
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-foreground">Kế Đô</td>
                      <td className="px-4 py-2 text-muted-foreground">Ketu</td>
                      <td className="px-4 py-2 text-muted-foreground">
                        Không phải sao thật: giao điểm Nam, cặp đối xứng với La Hầu
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Điều thú vị nhất: <strong>La Hầu và Kế Đô không phải sao</strong>. Đó là hai giao điểm
                nơi quỹ đạo Mặt Trăng cắt đường hoàng đạo — đúng vùng trời xảy ra nhật thực, nguyệt
                thực. Người xưa thấy Mặt Trời, Mặt Trăng "bị nuốt" ở đó nên hình dung thành thần La Hầu
                nuốt nhật nguyệt; hai "sao" này mang nghĩa che khuất, xáo trộn từ đó.
              </p>
              <p>
                Hiểu nguồn gốc rồi sẽ thấy: sao hạn là cách người xưa gửi lời nhắc "năm nay nên cẩn
                trọng điều gì" lên bầu trời — một di sản văn hoá đáng trân trọng, không phải án phạt. Vì
                vậy không cần sợ, càng không cần tốn tiền để "giải" một giao điểm hình học.
              </p>
            </div>
          ),
        },
        {
          id: 'giai-han-va-gioi-han',
          tocLabel: 'Giải hạn & giới hạn',
          heading: '"Giải hạn" và giới hạn của sao hạn',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                "Cúng sao giải hạn" đầu năm là một nét văn hoá tín ngưỡng: nhiều gia đình làm lễ dâng
                sao để cầu an, gửi gắm mong muốn một năm bình yên. Tôn trọng niềm tin đó, nhưng cũng nên
                hiểu đúng: <strong>hieu.asia không bán lễ giải hạn</strong> và không cho rằng phải "giải"
                mới yên.
              </p>
              <p>
                Cách "hoá giải" lành mạnh và trong tầm tay nhất là sống theo đúng lời nhắc của từng sao:
                năm sao xấu thì giữ lời ăn tiếng nói, thận trọng tiền bạc – giấy tờ, chú ý sức khoẻ; năm
                sao tốt thì tận dụng nhưng không chủ quan. Chủ động và cẩn thận quan trọng hơn mọi nghi
                lễ.
              </p>
              <p>Giới hạn cần ghi nhớ:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Sao hạn chỉ dùng <strong>năm sinh và giới tính</strong> nên rất thô — chia mỗi giới
                  thành vỏn vẹn 9 nhóm theo tuổi. Nó là "khung nhắc nhở", không phải chẩn đoán.
                </li>
                <li>
                  Sao hạn <strong>không</strong> dự đoán chắc chắn may – rủi, không thay thế lời khuyên
                  y tế, pháp lý hay tài chính.
                </li>
                <li>
                  Gặp nhóm sao xấu chỉ nghĩa là <strong>cẩn trọng hơn một chút</strong> — tuyệt đối
                  không nên vì thế mà lo sợ hay ngưng những việc quan trọng của mình.
                </li>
              </ul>
            </div>
          ),
        },
        {
          id: 'han-tuoi-lien-quan',
          tocLabel: 'Các hạn tuổi liên quan',
          heading: 'Các hạn tuổi liên quan: Tam Tai, Kim Lâu',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Sao hạn Cửu Diệu không phải "hạn tuổi" duy nhất trong phong tục Việt. Người xưa còn
                truyền lại vài hệ tra theo tuổi khác, mỗi hệ một cách tính và một mục đích riêng —
                đừng gộp chung, vì kết quả của hệ này không suy ra hệ kia:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Tam Tai</strong>: hạn tính theo con giáp, kéo dài ba năm liên tiếp theo
                  nhóm tuổi. Cách tính và các năm cụ thể có trang riêng:{' '}
                  <Link
                    href="/tam-tai"
                    className="text-gold-700 underline-offset-4 hover:underline"
                  >
                    tra cứu Tam Tai
                  </Link>
                  .
                </li>
                <li>
                  <strong>Kim Lâu</strong>: hạn tuổi thường được xem khi tính chuyện cưới hỏi, làm
                  nhà. Cách tính khác hẳn sao hạn, xem tại:{' '}
                  <Link
                    href="/kim-lau"
                    className="text-gold-700 underline-offset-4 hover:underline"
                  >
                    tra cứu Kim Lâu
                  </Link>
                  .
                </li>
                <li>
                  <strong>Sao hạn Cửu Diệu</strong> (bài này): tra theo tuổi mụ và giới tính, chu kỳ
                  9 năm. Muốn biết năm nay bạn gặp sao nào:{' '}
                  <Link
                    href="/sao-han"
                    className="text-gold-700 underline-offset-4 hover:underline"
                  >
                    xem sao hạn của bạn
                  </Link>
                  .
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Cả ba đều là phong tục để tham khảo, không phải phán quyết. Một năm có thể "dính"
                hạn ở hệ này mà hoàn toàn bình thường ở hệ kia — thêm một lý do để đọc chúng như lời
                nhắc cẩn trọng, thay vì cộng dồn nỗi lo.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <SaoHanWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <SaoHanRecall />,
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
                Muốn tra sao chiếu mệnh của mình năm nay?{' '}
                <Link
                  href="/sao-han"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  Xem sao hạn miễn phí →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/sao-han', label: 'Xem sao hạn của bạn' },
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
          children: <SaoHanChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
