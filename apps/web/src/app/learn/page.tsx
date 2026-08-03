import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { EOSIDIN } from '@/components/learn/EOSIDIN';
import { ContinueLearning } from '@/components/learn/hub/ContinueLearning';
import { LearnPathsSection } from '@/components/learn/hub/LearnPathsSection';
import { TopicProgressBadge } from '@/components/learn/hub/TopicProgressBadge';
import { JsonLd } from '@/components/seo/JsonLd';
import { itemList, breadcrumb } from '@/lib/seo/jsonld';

export const metadata: Metadata = {
  title: 'Học huyền học & khoa học tính cách',
  // vault 147 §a — khách hoài nghi hỏi "có cơ sở không". Đưa câu trả lời đó
  // vào ngay meta thay vì chỉ liệt kê số chủ đề.
  // Giữ ≤160 ký tự: seo-guard (vault 172) đo trên HTML build, quá ngưỡng thì
  // Google cắt giữa câu — câu chốt "không phán bừa" sẽ mất khỏi kết quả tìm.
  description:
    'Tử Vi, Bát Tự, Kinh Dịch, Tarot, thần số cùng MBTI, Big Five, DISC, Enneagram — 44 chủ đề, mỗi môn nói rõ cơ sở đến đâu và giới hạn ở đâu, không phán bừa.',
  alternates: { canonical: 'https://hieu.asia/learn' },
};

interface LearnTopic {
  href: string;
  title: string;
  subtitle: string;
  blurb: string;
}

interface LearnCluster {
  id: string;
  heading: string;
  /** Một câu định vị trung thực cho cả nhóm (huyền học ≠ tâm lý học). */
  positioning: string;
  topics: readonly LearnTopic[];
}

// 4 cụm phân theo BẢN CHẤT bộ môn, không gộp chung nhãn. Điểm mấu chốt: nhóm
// tâm lý là mô hình khoa học hành vi, KHÔNG phải huyền học — nhãn phải nói đúng.
const CLUSTERS: readonly LearnCluster[] = [
  {
    id: 'dong-phuong',
    heading: 'Đông phương',
    positioning:
      'Các bộ môn gốc Trung Hoa, tính trên can chi, ngũ hành và âm dương. Đọc như truyền thống văn hóa và cách soi mình, không phải phép đo khoa học.',
    topics: [
      {
        href: '/learn/tu-vi',
        title: 'Tử Vi 12 cung',
        subtitle: 'Đông phương · Trung Hoa',
        blurb: 'Lá số 12 cung phản ánh các lĩnh vực đời sống: Mệnh, Tài, Phu Thê, Quan Lộc...',
      },
      {
        href: '/learn/bat-tu',
        title: 'Bát Tự Tứ Trụ',
        subtitle: 'Đông phương · Tứ Trụ',
        blurb: '4 trụ (Năm/Tháng/Ngày/Giờ) với Thiên Can + Địa Chi xác định mệnh cách.',
      },
      {
        href: '/learn/kinh-dich',
        title: 'Kinh Dịch (I Ching)',
        subtitle: 'Đông phương · 64 quẻ',
        blurb: 'Gieo quẻ soi tình huống: 64 quẻ, 384 hào, luật hào động Chu Hy.',
      },
      {
        href: '/learn/phong-thuy',
        title: 'Phong Thủy ứng dụng',
        subtitle: 'Đông phương · Tổng quan',
        blurb: 'Bức tranh chung: ngũ hành, hướng, chọn ngày giờ, thước Lỗ Ban.',
      },
      {
        href: '/learn/hop-tuoi',
        title: 'Hợp tuổi (12 con giáp)',
        subtitle: 'Đông phương · Can Chi',
        blurb: 'Tam Hợp / Lục Hợp / Xung / Hại + nạp âm; giọng dung hòa, không phán khắc.',
      },
      {
        href: '/learn/con-giap',
        title: '12 Con Giáp',
        subtitle: 'Đông phương · Địa Chi',
        blurb: 'Tính cách, sở trường, tam hợp & tứ hành xung của 12 con giáp — tham khảo, không phán.',
      },
      {
        href: '/learn/sao-han',
        title: 'Sao Hạn (Cửu Diệu)',
        subtitle: 'Đông phương · Cửu Diệu',
        blurb: '9 sao chiếu mệnh theo tuổi + giới tính; góc nhìn tham khảo, không mê tín.',
      },
      {
        href: '/learn/can-xuong',
        title: 'Cân Xương Đoán Số',
        subtitle: 'Đông phương · Viên Thiên Cang',
        blurb: 'Cân “trọng lượng” năm–tháng–ngày–giờ sinh ra bài thơ vận số; đọc như lời động viên, không phán.',
      },
      {
        href: '/learn/dat-ten-ngu-hanh',
        title: 'Đặt Tên Theo Ngũ Hành',
        subtitle: 'Đông phương · Ngũ hành',
        blurb: 'Chọn tên bổ hành còn thiếu trong Bát Tự của bé; nghĩa đẹp + âm hay là chính, không máy móc.',
      },
    ],
  },
  {
    id: 'phuong-tay',
    heading: 'Phương Tây',
    positioning:
      'Chiêm tinh dựng bản đồ thiên thể, thần số học rút từ con số, Tarot đọc qua biểu tượng. Dùng để phản tư, không phải để tiên tri.',
    topics: [
      {
        href: '/learn/cung-hoang-dao',
        title: '12 cung hoàng đạo',
        subtitle: 'Phương Tây · 12 cung',
        blurb: 'Ngày của từng cung, 4 nguyên tố, 3 tam thái — và vì sao "cung bị đổi" là hiểu nhầm.',
      },
      {
        href: '/learn/chiem-tinh',
        title: 'Chiêm tinh phương Tây',
        subtitle: 'Phương Tây · Bản đồ sao',
        blurb: 'Bản đồ sao cá nhân: hành tinh, cung Mọc, 12 nhà và các góc hợp.',
      },
      {
        href: '/learn/tarot',
        title: 'Tarot — 78 lá',
        subtitle: 'Phương Tây · 78 lá',
        blurb: '22 Ẩn Chính + 56 Ẩn Phụ; lăng kính phản tư bản thân, không phán số mệnh.',
      },
      {
        href: '/learn/than-so-hoc',
        title: 'Thần Số Học',
        subtitle: 'Phương Tây · Pythagoras',
        blurb: 'Phép tính số chủ đạo từ ngày sinh và tên — bản đồ tính cách & sứ mệnh.',
      },
    ],
  },
  {
    id: 'tam-ly-hien-dai',
    heading: 'Tâm lý hiện đại',
    positioning:
      'Đây là mô hình tâm lý học, không phải huyền học. Chúng đo thiên hướng qua bảng hỏi: Big Five có nền học thuật vững, còn MBTI và DISC bị phê bình về độ ổn định khi làm lại nhiều lần.',
    topics: [
      {
        href: '/learn/mbti',
        title: 'MBTI 16 loại tính cách',
        subtitle: 'Tâm lý · Carl Jung',
        blurb: '4 trục: I/E, N/S, T/F, J/P tạo nên 16 nhóm tính cách phân loại tâm lý.',
      },
      {
        href: '/learn/big-five',
        title: 'Big Five (OCEAN)',
        subtitle: 'Tâm lý · OCEAN',
        blurb: '5 chiều liên tục: Cởi mở, Tận tâm, Hướng ngoại, Dễ chịu, Nhạy cảm cảm xúc.',
      },
      {
        href: '/learn/disc',
        title: 'DISC — 4 nhóm hành vi',
        subtitle: 'Tâm lý · William Marston',
        blurb: '4 thiên hướng: Thống trị (D), Ảnh hưởng (I), Kiên định (S), Tuân thủ (C).',
      },
      {
        href: '/learn/enneagram',
        title: 'Enneagram — 9 nhóm',
        subtitle: 'Tâm lý · 9 nhóm',
        blurb: '9 nhóm theo động lực sâu (điều bạn sợ & khao khát), chia 3 trung tâm.',
      },
    ],
  },
  // Hai cụm dưới tách ra trong đợt 1 của chương trình "mỗi công cụ một bài Học
  // riêng". Trước đó cả 5 công cụ ngày–giờ lẫn 3 công cụ xem tuổi việc lớn đều
  // không có bài của riêng mình.
  {
    id: 'ngay-gio',
    heading: 'Ngày giờ & lịch',
    positioning:
      'Cuốn lịch là thiên văn và toán học — phần "ngày tốt xấu" gắn lên nó mới là phong tục. Hai lớp khác nhau, bài ở đây tách bạch rõ để bạn biết mình đang đọc lớp nào.',
    topics: [
      {
        href: '/learn/lich-am-duong',
        title: 'Lịch âm dương Việt Nam',
        subtitle: 'Lịch pháp · Thiên văn',
        blurb: 'Vì sao có tháng nhuận, vì sao Tết ta đôi khi lệch Tết Trung Quốc một ngày.',
      },
      {
        href: '/learn/trach-cat',
        title: 'Trạch Cát — chọn ngày',
        subtitle: 'Đông phương · 12 trực',
        blurb: 'Chọn ngày cho cưới hỏi, động thổ, khai trương: hoàng đạo, 12 trực — tham khảo.',
      },
      {
        href: '/learn/gio-hoang-dao',
        title: 'Giờ hoàng đạo',
        subtitle: 'Đông phương · 12 giờ',
        blurb: '12 giờ địa chi, 6 sao hoàng đạo – 6 sao hắc đạo, cách khởi giờ theo chi ngày.',
      },
      {
        href: '/learn/ngay-kieng-ky',
        title: 'Ngày kiêng kỵ',
        subtitle: 'Dân gian · Kiêng kỵ',
        blurb: 'Tam Nương, Nguyệt Kỵ, Dương Công Kỵ Nhật — gốc tích và cách nghĩ tỉnh táo.',
      },
      {
        href: '/learn/xuat-hanh',
        title: 'Hướng xuất hành',
        subtitle: 'Dân gian · Hỷ Thần',
        blurb: 'Hỷ Thần, Tài Thần đổi theo can của NGÀY — khác hẳn hướng nhà tính theo tuổi.',
      },
      {
        href: '/learn/thien-van',
        title: 'Lịch thiên văn',
        subtitle: 'Khoa học · Nhật nguyệt thực',
        blurb: 'Nhật thực, nguyệt thực, phân – chí: hiện tượng tính trước được hàng nghìn năm.',
      },
    ],
  },
  {
    id: 'nen-tang-can-chi',
    heading: 'Nền tảng can chi',
    positioning:
      'Bộ máy đánh số thời gian mà Bát Tự, Tử Vi, trạch cát và hợp tuổi đều đứng trên. Bản thân can chi chỉ là cách gọi tên năm tháng ngày giờ — mọi diễn giải vận mệnh là tầng gán thêm phía trên.',
    topics: [
      {
        href: '/learn/can-chi',
        title: 'Thiên can – Địa chi',
        subtitle: 'Nền tảng · Chu kỳ 60',
        blurb: '10 can, 12 chi, và vì sao ghép lại chỉ ra 60 cặp chứ không phải 120.',
      },
      {
        href: '/learn/nap-am',
        title: 'Nạp âm & mệnh ngũ hành',
        subtitle: 'Nền tảng · 30 nạp âm',
        blurb: 'Mệnh ngũ hành của bạn ra từ nạp âm, không phải từ can hay chi năm sinh.',
      },
      {
        href: '/learn/tam-hop-luc-xung',
        title: 'Tam hợp – Lục xung',
        subtitle: 'Nền tảng · Vòng 12 chi',
        blurb: 'Hình học của vòng 12 con giáp: tam hợp là tam giác đều, lục xung là đối đỉnh.',
      },
    ],
  },
  {
    id: 'lap-la-so-tu-tru',
    heading: 'Lập lá số & tứ trụ',
    positioning:
      'Mở nắp máy: từ ngày giờ sinh, kết quả được dựng lên bằng những bước nào. Đọc cụm này rồi thì bạn không còn phải tin vào một hộp đen — bạn kiểm được từng bước.',
    topics: [
      {
        href: '/learn/menh-cuc',
        title: 'Mệnh và Cục',
        subtitle: 'Tử Vi · Nền lá số',
        blurb: 'Cục là gì, con số 2–6 nghĩa gì, và vì sao thiếu Cục thì không an được sao.',
      },
      {
        href: '/learn/lap-la-so',
        title: 'Lập lá số Tử Vi',
        subtitle: 'Tử Vi · An sao',
        blurb: 'An 12 cung, tìm cung Mệnh và cung Thân, an chính tinh, độ sáng miếu – vượng – đắc – hãm.',
      },
      {
        href: '/learn/tiet-khi',
        title: '24 tiết khí',
        subtitle: 'Lịch pháp · Mặt Trời',
        blurb: 'Tiết khí thuộc lịch dương chứ không phải lịch âm — và đó là lúc trụ tháng đổi.',
      },
      {
        href: '/learn/lap-bat-tu',
        title: 'Lập tứ trụ Bát Tự',
        subtitle: 'Bát Tự · 4 trụ',
        blurb: 'Trụ năm đổi ở Lập Xuân chứ không ở Tết; trụ giờ suy từ can ngày bằng Ngũ Thử Độn.',
      },
    ],
  },
  {
    id: 'van-theo-thoi-gian',
    heading: 'Vận theo thời gian',
    positioning:
      'Các lớp thời gian chồng lên lá số. Càng chia nhỏ thời gian thì độ chắc càng giảm chứ không tăng — đọc để thấy nhịp mà chủ động, không phải để ngồi chờ vận.',
    topics: [
      {
        href: '/learn/dai-van',
        title: 'Đại vận — chặng 10 năm',
        subtitle: 'Vận trình · 10 năm',
        blurb: 'Tử Vi và Bát Tự tính đại vận khác nhau, cho hai bộ mốc khác nhau — đừng trộn.',
      },
      {
        href: '/learn/thai-tue',
        title: 'Thái Tuế & năm tuổi',
        subtitle: 'Vận trình · Theo năm',
        blurb: 'Trùng, xung, hình, hại Thái Tuế — và cái nào công cụ thật sự tính, cái nào không.',
      },
    ],
  },
  {
    id: 'phong-thuy-chuyen-sau',
    heading: 'Phong thuỷ chuyên sâu',
    positioning:
      'Bốn lớp phong thuỷ hay bị gộp làm một, ở đây tách hẳn ra: xét NGƯỜI (cung phi, du niên), xét NHÀ theo thời gian (phi tinh), và xét KÍCH THƯỚC (thước Lỗ Ban). Đều là hệ quy ước để tham khảo, chưa có bằng chứng khoa học.',
    topics: [
      {
        href: '/learn/bat-trach',
        title: 'Bát Trạch — cung phi',
        subtitle: 'Phong thuỷ · Cung phi',
        blurb: 'Tính cung phi từ năm sinh, Đông tứ mệnh – Tây tứ mệnh, 4 hướng tốt – 4 hướng tránh.',
      },
      {
        href: '/learn/du-nien',
        title: '8 du niên',
        subtitle: 'Phong thuỷ · Bát biến',
        blurb: 'Sinh Khí, Thiên Y, Diên Niên, Phục Vị và 4 hung tinh — hướng nào cho việc nào.',
      },
      {
        href: '/learn/huyen-khong-phi-tinh',
        title: 'Huyền Không Phi Tinh',
        subtitle: 'Phong thuỷ · Cửu vận',
        blurb: 'Phong thuỷ đổi theo thời gian: tam nguyên cửu vận, sơn tinh – hướng tinh, tinh bàn 9 cung.',
      },
      {
        href: '/learn/thuoc-lo-ban',
        title: 'Thước Lỗ Ban',
        subtitle: 'Phong thuỷ · Kích thước',
        blurb: 'Vì sao có nhiều loại thước, cung tốt – xấu, và cách đo cho đúng.',
      },
      {
        href: '/learn/ngu-hanh-mau-sac',
        title: 'Ngũ hành & màu sắc',
        subtitle: 'Phong thuỷ · Sinh khắc',
        blurb: 'Vòng tương sinh – tương khắc đọc bằng màu, và vì sao an toàn phải đứng trước hợp mệnh.',
      },
    ],
  },
  {
    id: 'xem-tuoi-viec-lon',
    heading: 'Xem tuổi việc lớn',
    positioning:
      'Ba hạn tuổi bị hỏi nhiều nhất khi cưới hỏi và làm nhà. Đọc để hiểu cách người xưa tính, từ đó bớt sợ — không phải để sợ thêm, và tuyệt đối không phải để mua lễ giải hạn.',
    topics: [
      {
        href: '/learn/kim-lau',
        title: 'Kim Lâu',
        subtitle: 'Cưới hỏi · Chia 9',
        blurb: 'Tuổi mụ chia 9 ra bốn loại Kim Lâu; vì sao tục cưới chủ yếu xét tuổi cô dâu.',
      },
      {
        href: '/learn/tam-tai',
        title: 'Tam Tai',
        subtitle: 'Tam hợp · 3 năm',
        blurb: '12 con giáp chia 4 nhóm tam hợp, mỗi nhóm gánh ba năm Tam Tai liên tiếp.',
      },
      {
        href: '/learn/hoang-oc',
        title: 'Hoang Ốc & mượn tuổi',
        subtitle: 'Làm nhà · 6 cung',
        blurb: 'Sáu cung Hoang Ốc tra theo tuổi mụ, và cơ chế "mượn tuổi" khi xây nhà.',
      },
      {
        href: '/learn/cuoi-hoi',
        title: 'Xem tuổi cưới',
        subtitle: 'Cưới hỏi · Gộp điều kiện',
        blurb: 'Nhiều hạn gộp lại thành một kết luận ra sao — và còn bao nhiêu phần trăm số năm "sạch".',
      },
      {
        href: '/learn/khai-truong',
        title: 'Tuổi khai trương',
        subtitle: 'Kinh doanh · Thái Tuế',
        blurb: 'Thái Tuế, xung Thái Tuế và năm tuổi — cách chọn năm, ngày, giờ mở hàng.',
      },
      {
        href: '/learn/xong-dat',
        title: 'Xông đất đầu năm',
        subtitle: 'Tục Tết · Chọn người',
        blurb: 'Chọn người bước vào nhà sáng mùng Một: tiêu chí lá số và tiêu chí con người.',
      },
    ],
  },
  {
    id: 'tuong-hoc',
    heading: 'Tướng học',
    positioning:
      'Xem chỉ tay là tập tục quan sát lâu đời, chưa có bằng chứng khoa học. Trình bày để bạn hiểu hệ hình tượng của nó và đọc như văn hóa dân gian.',
    topics: [
      {
        href: '/learn/palm',
        title: 'Xem chỉ tay',
        subtitle: 'Tướng học · Chiromancy',
        blurb: '7 đường chính: tâm đạo, trí đạo, sinh đạo, số mệnh, mặt trời, thuỷ tinh, kim tinh.',
      },
    ],
  },
];

// Phẳng hoá TOÀN BỘ chủ đề cho itemList JSON-LD (để AI/Google đọc được
// cả danh mục, không rụng chủ đề nào khi chia nhóm hiển thị).
const ALL_TOPICS: readonly LearnTopic[] = CLUSTERS.flatMap((c) => c.topics);

export default function LearnLandingPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <JsonLd
        data={[
          itemList(ALL_TOPICS.map((t) => ({ name: t.title, url: t.href }))),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Học huyền học', url: '/learn' },
          ]),
        ]}
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-gold">Trang chủ</Link>
        <span className="mx-1.5">/</span>
        <span className="text-muted-foreground">Học huyền học</span>
      </nav>

      <section className="text-center">
        <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold-700">
          Học huyền học & khoa học tính cách
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
          Hiểu cội nguồn trước khi{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            hiểu chính mình
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Mỗi báo cáo tại hieu.asia không phải là phán quyết định mệnh. Đó là một góc nhìn —
          và bạn xứng đáng biết góc nhìn đó được dựng nên từ đâu. Các khái niệm dưới đây là nền
          tảng tối thiểu để bạn đọc báo cáo của mình một cách có ý thức.
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Cách dùng khu Học: đọc bài, chỉnh độ sâu theo ba tầng (dễ hiểu đến chuyên sâu),
          rồi tự kiểm tra lại bằng phần hỏi đáp và câu hỏi ôn ở cuối mỗi bài.
        </p>
        {/* Chip "Học tiếp" — khung cao cố định render sẵn (không CLS), nội dung
            client điền sau hydration từ localStorage. */}
        <ContinueLearning />
      </section>

      <LearnPathsSection />

      <section className="mt-12 space-y-12">
        {CLUSTERS.map((cluster) => (
          <div key={cluster.id}>
            <div className="mb-5">
              <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
                {cluster.heading}
              </h2>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {cluster.positioning}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cluster.topics.map((t) => (
                <Link key={t.href} href={t.href} className="group">
                  <Card className="h-full border-border bg-card/40 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-gold/40 group-hover:shadow-[0_0_40px_-12px_rgba(184,146,61,0.4)] group-focus-within:-translate-y-1 group-focus-within:border-gold/40">
                    <CardHeader>
                      <CardTitle className="font-heading text-lg text-gold-700 group-hover:text-gold group-focus-within:text-gold">
                        {t.title}
                      </CardTitle>
                      <CardDescription className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted-foreground">
                        {t.subtitle}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-muted-foreground">{t.blurb}</p>
                      {/* Tiến độ checklist của chủ đề — khung h-4 đặt sẵn (không CLS). */}
                      <TopicProgressBadge slug={t.href.split('/').pop() ?? ''} />
                      <span className="mt-4 inline-block whitespace-nowrap text-xs font-semibold text-gold-700 group-hover:text-gold group-focus-within:text-gold">
                        Đọc giải thích →
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="mt-16">
        <div className="mb-6 text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Phương pháp EOSIDIN
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            7 bước hieu.asia dùng để chuyển dữ liệu thô thành góc nhìn bạn có thể hành động.
          </p>
        </div>
        <EOSIDIN />
      </section>

      {/* Đóng vòng học → làm: hiểu cội nguồn rồi thì áp lên chính mình.
          CTA lập lá số + link sang các công cụ thật (chống trang chỉ-đọc). */}
      <section className="mt-16 rounded-2xl border border-gold/25 bg-card/40 px-6 py-10 text-center">
        <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Hiểu rồi — giờ soi vào{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">chính bạn</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Lập lá số miễn phí trong 30 giây và đọc báo cáo của mình với đúng những khái niệm
          bạn vừa tìm hiểu — không cần tài khoản.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/onboarding"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-gold-gradient px-8 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
          >
            Lập lá số miễn phí
          </Link>
          <Link
            href="/cong-cu"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-gold/30 px-8 py-3 text-sm font-semibold text-gold-700 transition-colors hover:border-gold/60 hover:text-gold"
          >
            Xem tất cả công cụ
          </Link>
        </div>
        <nav aria-label="Công cụ liên quan" className="mt-6 text-sm text-muted-foreground">
          Thử ngay:{' '}
          <Link href="/la-so-tu-vi" className="text-gold-700 hover:text-gold hover:underline">
            Lá số Tử Vi
          </Link>
          {' · '}
          <Link href="/mbti" className="text-gold-700 hover:text-gold hover:underline">
            Trắc nghiệm MBTI
          </Link>
          {' · '}
          <Link href="/xem-tuong" className="text-gold-700 hover:text-gold hover:underline">
            Xem chỉ tay
          </Link>
        </nav>
      </section>
    </main>
  );
}
