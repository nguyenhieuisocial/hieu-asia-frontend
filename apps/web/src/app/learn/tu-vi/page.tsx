import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { InfographicTuVi } from '@/components/learn/InfographicTuVi';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { relatedLearnLenses } from '@/lib/learn/related';
import { PALACE_READINGS } from '@/lib/palace-readings';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, faqPage, itemList } from '@/lib/seo/jsonld';
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
    'Tìm hiểu 12 cung Tử Vi: Mệnh, Tài Bạch, Phu Thê, Quan Lộc, Điền Trạch... Mỗi cung phản ánh một lĩnh vực đời sống cụ thể trên lá số của bạn.',
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
];

const JSONLD = [
  article({
    headline: 'Tử Vi 12 cung: nền tảng cho người mới',
    description:
      'Tìm hiểu 12 cung Tử Vi: Mệnh, Tài Bạch, Phu Thê, Quan Lộc... Mỗi cung phản ánh một lĩnh vực đời sống cụ thể.',
    url: '/learn/tu-vi',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Tử Vi 12 cung', url: '/learn/tu-vi' },
  ]),
  faqPage(FAQS),
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
      readMeta="8 phút đọc · Cập nhật 2026 · Đối chiếu cổ thư"
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
                này thực sự trả lời được.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {PALACE_READINGS.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/learn/tu-vi/${p.slug}`}
                    className="group rounded-lg border border-border bg-card/40 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40 hover:bg-card/60"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-gold-700">
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
                nói chung chung đúng-với-ai-cũng-được.
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
                <strong className="text-foreground">sáng hay tối</strong> khác nhau (miếu,
                vượng, đắc địa, bình hòa, hãm), tức cường độ biểu hiện mạnh hay yếu. Nhưng
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
                định khuôn của mỗi cung. Chúng thường được nhớ theo ba bộ kinh điển hay đi
                cùng nhau, cộng vài sao còn lại. Đây là giới thiệu ngắn để nhận mặt, không
                phải luận giải: một sao còn tuỳ vị trí, độ sáng và Tứ Hóa mới ra nghĩa.
              </p>
              <div>
                <p className="mb-1.5">
                  <strong className="text-foreground">Bộ Sát · Phá · Tham</strong> — nhóm
                  biến động, đột phá:
                </p>
                <ul className="ml-5 list-disc space-y-1.5">
                  <li>
                    <strong className="text-foreground">Thất Sát</strong> — quyết đoán,
                    mạnh mẽ, thích tự chủ.
                  </li>
                  <li>
                    <strong className="text-foreground">Phá Quân</strong> — phá cách, đổi
                    mới, dám mạo hiểm.
                  </li>
                  <li>
                    <strong className="text-foreground">Tham Lang</strong> — nhiều ham muốn,
                    đa tài, giỏi giao tế.
                  </li>
                </ul>
              </div>
              <div>
                <p className="mb-1.5">
                  <strong className="text-foreground">Bộ Cơ · Nguyệt · Đồng · Lương</strong>{' '}
                  — nhóm ôn hoà, chuyên môn, nội tâm:
                </p>
                <ul className="ml-5 list-disc space-y-1.5">
                  <li>
                    <strong className="text-foreground">Thiên Cơ</strong> — trí tuệ, linh
                    hoạt, giỏi tính toán.
                  </li>
                  <li>
                    <strong className="text-foreground">Thái Âm</strong> — nội tâm, gia đạo,
                    thiên về tài âm.
                  </li>
                  <li>
                    <strong className="text-foreground">Thiên Đồng</strong> — hoà hảo, dễ
                    chịu, ưa an ổn.
                  </li>
                  <li>
                    <strong className="text-foreground">Thiên Lương</strong> — che chở, đạo
                    đức, có phong thái trưởng thượng.
                  </li>
                </ul>
              </div>
              <div>
                <p className="mb-1.5">
                  <strong className="text-foreground">Bộ Tử · Phủ · Vũ · Tướng</strong> —
                  nhóm quản trị, trật tự, nguồn lực:
                </p>
                <ul className="ml-5 list-disc space-y-1.5">
                  <li>
                    <strong className="text-foreground">Tử Vi</strong> — đế tinh, thiên
                    hướng lãnh đạo, cần vai trò điều phối.
                  </li>
                  <li>
                    <strong className="text-foreground">Thiên Phủ</strong> — khố tinh, tích
                    luỹ, ổn định, thận trọng.
                  </li>
                  <li>
                    <strong className="text-foreground">Vũ Khúc</strong> — tài tinh, kỷ
                    luật, quyết liệt với tiền bạc.
                  </li>
                  <li>
                    <strong className="text-foreground">Thiên Tướng</strong> — phụ tá, tham
                    mưu, trung thành.
                  </li>
                </ul>
              </div>
              <div>
                <p className="mb-1.5">
                  <strong className="text-foreground">Ba chính tinh còn lại</strong> — nhật,
                  khẩu thiệt và nguyên tắc:
                </p>
                <ul className="ml-5 list-disc space-y-1.5">
                  <li>
                    <strong className="text-foreground">Thái Dương</strong> — dương khí,
                    năng lượng, thiên về danh tiếng.
                  </li>
                  <li>
                    <strong className="text-foreground">Cự Môn</strong> — phân tích, tranh
                    luận, mạnh về lời nói.
                  </li>
                  <li>
                    <strong className="text-foreground">Liêm Trinh</strong> — nguyên tắc, kỷ
                    luật, nhiều sắc thái (chính trực hoặc đào hoa tuỳ cách cục).
                  </li>
                </ul>
              </div>
              <p>
                Không sao nào "toàn tốt" hay "toàn xấu". Cùng một chính tinh, đặt ở cung
                khác nhau và gặp Tứ Hóa khác nhau sẽ luận rất khác — nên đây chỉ là bước
                nhận diện đầu tiên.
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
                nghiêng về lĩnh vực của cung đó; điểm khởi và chiều đi của đại vận phụ thuộc
                vào Cục và giới tính, âm dương của năm sinh.
              </p>
              <p>
                <strong className="text-foreground">Lưu niên</strong> là lớp từng năm: mỗi
                năm dương lịch tương ứng một cung "lưu", cho biết bầu không khí và trọng tâm
                của riêng năm đó, lồng bên trong đại vận đang diễn ra.
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
                đâu". Và như mọi phần khác của Tử Vi, đây là{' '}
                <strong className="text-foreground">thiên hướng theo thời gian, không phải
                số phận đóng khung</strong> — một vận thuận vẫn cần hành động, một vận khó
                vẫn có khoảng xoay xở.
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
