import type { Metadata } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@hieu-asia/ui';
import { InfographicBatTu } from '@/components/learn/InfographicBatTu';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { relatedLearnLenses } from '@/lib/learn/related';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, faqPage } from '@/lib/seo/jsonld';
import { CAN_PLAIN } from '@/lib/bat-tu-plain';
import {
  BatTuFrame,
  BatTuDepth,
  BatTuRecall,
  BatTuChecklist,
  BatTuWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Bát Tự Tứ Trụ: Học huyền học',
  description:
    'Bát Tự (Tứ Trụ) từ nền tảng tới chuyên sâu: 10 Thiên Can, 12 Địa Chi, tàng can, Thập Thần, Dụng Thần, Vòng Trường Sinh, Thần Sát, Đại Vận – Lưu Niên. Góc nhìn để hiểu mình, không phán số mệnh.',
  alternates: { canonical: 'https://hieu.asia/learn/bat-tu' },
};

// ── Dữ liệu tra bảng (grounded từ kien-thuc-nguon/bat-tu.md, hop-tuoi.md §1–§6,
// và lib/bat-tu-plain.ts có test bao phủ). Chỉ chép, KHÔNG bịa. ───────────────

// 10 Thiên Can: hành + âm/dương từ bat-tu.md §0; hình + khí chất từ CAN_PLAIN.
const CAN_ROWS: { can: string; hanh: string; am: string }[] = [
  { can: 'Giáp', hanh: 'Mộc', am: 'Dương' },
  { can: 'Ất', hanh: 'Mộc', am: 'Âm' },
  { can: 'Bính', hanh: 'Hỏa', am: 'Dương' },
  { can: 'Đinh', hanh: 'Hỏa', am: 'Âm' },
  { can: 'Mậu', hanh: 'Thổ', am: 'Dương' },
  { can: 'Kỷ', hanh: 'Thổ', am: 'Âm' },
  { can: 'Canh', hanh: 'Kim', am: 'Dương' },
  { can: 'Tân', hanh: 'Kim', am: 'Âm' },
  { can: 'Nhâm', hanh: 'Thủy', am: 'Dương' },
  { can: 'Quý', hanh: 'Thủy', am: 'Âm' },
];

// 12 Địa Chi — bám bảng hop-tuoi.md §1.2 (slug đúng engine; lưu ý Tỵ = ti).
const CHI_ROWS: {
  chi: string;
  giap: string;
  hanh: string;
  slug: string;
  am: string;
  huong: string;
  mua: string;
}[] = [
  { chi: 'Tý', giap: 'Chuột', hanh: 'Thủy', slug: 'ty', am: 'Dương', huong: 'Bắc', mua: 'Giữa đông' },
  { chi: 'Sửu', giap: 'Trâu', hanh: 'Thổ', slug: 'suu', am: 'Âm', huong: 'Đông-Bắc', mua: 'Cuối đông' },
  { chi: 'Dần', giap: 'Hổ', hanh: 'Mộc', slug: 'dan', am: 'Dương', huong: 'Đông-Bắc', mua: 'Đầu xuân' },
  { chi: 'Mão', giap: 'Mèo', hanh: 'Mộc', slug: 'mao', am: 'Âm', huong: 'Đông', mua: 'Giữa xuân' },
  { chi: 'Thìn', giap: 'Rồng', hanh: 'Thổ', slug: 'thin', am: 'Dương', huong: 'Đông-Nam', mua: 'Cuối xuân' },
  { chi: 'Tỵ', giap: 'Rắn', hanh: 'Hỏa', slug: 'ti', am: 'Âm', huong: 'Đông-Nam', mua: 'Đầu hạ' },
  { chi: 'Ngọ', giap: 'Ngựa', hanh: 'Hỏa', slug: 'ngo', am: 'Dương', huong: 'Nam', mua: 'Giữa hạ' },
  { chi: 'Mùi', giap: 'Dê', hanh: 'Thổ', slug: 'mui', am: 'Âm', huong: 'Tây-Nam', mua: 'Cuối hạ' },
  { chi: 'Thân', giap: 'Khỉ', hanh: 'Kim', slug: 'than', am: 'Dương', huong: 'Tây-Nam', mua: 'Đầu thu' },
  { chi: 'Dậu', giap: 'Gà', hanh: 'Kim', slug: 'dau', am: 'Âm', huong: 'Tây', mua: 'Giữa thu' },
  { chi: 'Tuất', giap: 'Chó', hanh: 'Thổ', slug: 'tuat', am: 'Dương', huong: 'Tây-Bắc', mua: 'Cuối thu' },
  { chi: 'Hợi', giap: 'Lợn', hanh: 'Thủy', slug: 'hoi', am: 'Âm', huong: 'Tây-Bắc', mua: 'Đầu đông' },
];

// 10 Thập Thần — mặt mạnh + mặt cần lưu ý, chép từ bat-tu.md §3 (dòng 51–60).
const THAP_THAN_HAI_MAT: { ten: string; nhom: string; manh: string; luuy: string }[] = [
  { ten: 'Tỷ Kiên', nhom: 'Tỷ Kiếp', manh: 'Tự chủ, độc lập, kiên định', luuy: 'Dễ bảo thủ, khó nhường' },
  { ten: 'Kiếp Tài', nhom: 'Tỷ Kiếp', manh: 'Quyết liệt, dám tranh thủ', luuy: 'Dễ bốc đồng, hao tài nếu thiếu kiểm soát' },
  { ten: 'Thực Thần', nhom: 'Thực Thương', manh: 'Ôn hòa, sáng tạo bền, biết hưởng thụ lành mạnh', luuy: 'Dễ an phận' },
  { ten: 'Thương Quan', nhom: 'Thực Thương', manh: 'Tài hoa, sắc sảo, dám phá cách', luuy: 'Dễ kiêu, dễ va chạm với quyền uy (“Thương Quan kiến Quan”)' },
  { ten: 'Chính Tài', nhom: 'Tài', manh: 'Thực tế, chăm chỉ, giữ tiền chắc', luuy: 'Đôi khi quá thận trọng' },
  { ten: 'Thiên Tài', nhom: 'Tài', manh: 'Nhạy cơ hội, rộng rãi, giỏi xoay tiền', luuy: 'Dễ phiêu lưu tài chính' },
  { ten: 'Chính Quan', nhom: 'Quan Sát', manh: 'Trách nhiệm, kỷ luật, trọng danh dự', luuy: 'Dễ cứng nhắc, ngại rủi ro' },
  { ten: 'Thất Sát', nhom: 'Quan Sát', manh: 'Quyết đoán, gan dạ, hợp cạnh tranh khốc liệt', luuy: 'Dễ nóng, cực đoan nếu không có “chế” (Thực Thần chế Sát hoặc Ấn hoá Sát)' },
  { ten: 'Chính Ấn', nhom: 'Ấn', manh: 'Nhân hậu, ham học, được nâng đỡ', luuy: 'Dễ ỷ lại, thiếu thực hành' },
  { ten: 'Thiên Ấn', nhom: 'Ấn', manh: 'Tư duy khác lạ, trực giác tốt, hợp nghề chuyên sâu', luuy: 'Dễ cô độc, đa nghi' },
];

// Vòng Trường Sinh 12 pha — thứ tự + nghĩa từ bat-tu.md §5 (dòng 74–77).
const TRUONG_SINH_12: { pha: string; y: string }[] = [
  { pha: 'Trường Sinh', y: 'Khí mới khởi, như hạt nảy mầm — bắt đầu một chu kỳ.' },
  { pha: 'Mộc Dục', y: 'Còn non, dễ dao động, đang định hình.' },
  { pha: 'Quan Đới', y: 'Trưởng thành, “mặc áo đội mũ” bước vào đời.' },
  { pha: 'Lâm Quan', y: 'Vào việc, khí mạnh và vững, đang lên.' },
  { pha: 'Đế Vượng', y: 'Đỉnh cao, khí thịnh nhất của chu kỳ.' },
  { pha: 'Suy', y: 'Bắt đầu giảm nhiệt sau đỉnh.' },
  { pha: 'Bệnh', y: 'Khí yếu dần, cần dưỡng.' },
  { pha: 'Tử', y: 'Khí lắng xuống thấp — nói về cường độ, không phải điềm chết chóc.' },
  { pha: 'Mộ', y: 'Thu tàng, cất giữ lại (còn gọi là “kho / mộ”) — nghỉ và tích trữ.' },
  { pha: 'Tuyệt', y: 'Khí gần như tận, điểm thấp nhất của vòng.' },
  { pha: 'Thai', y: 'Khí mới hoài thai, một mầm mới đang tượng hình.' },
  { pha: 'Dưỡng', y: 'Được nuôi dưỡng, chuẩn bị cho vòng Trường Sinh kế tiếp.' },
];

// 5 Thần Sát engine tính — bat-tu.md §6 (dòng 79–88).
const THAN_SAT: { ten: string; tra: string; y: string }[] = [
  { ten: 'Thiên Ất Quý Nhân', tra: 'theo Can Ngày', y: 'Quý nhân phù trợ; gặp khó dễ có người giúp, “gặp dữ hoá lành”.' },
  { ten: 'Văn Xương', tra: 'theo Can Ngày', y: 'Thiên hướng học hành, văn chương, thi cử, chữ nghĩa.' },
  { ten: 'Đào Hoa', tra: 'theo Chi', y: 'Sức hút, duyên dáng, khiếu nghệ thuật; chuyện tình cảm cần chừng mực.' },
  { ten: 'Dịch Mã', tra: 'theo Chi', y: 'Di chuyển, thay đổi, đi xa; hợp công việc năng động, hay dịch chuyển.' },
  { ten: 'Hoa Cái', tra: 'theo Chi', y: 'Cô cao, thiên về tâm linh, chuyên môn sâu và nghệ thuật.' },
];

// Ngũ hành Nhật Chủ → khí chất + môi trường gợi ý — bat-tu.md §7 (dòng 90–95).
const NGU_HANH_KHI_CHAT: { hanh: string; khiChat: string; huong: string }[] = [
  { hanh: 'Mộc', khiChat: 'Nhân hậu, thích vươn lên, giỏi hoạch định', huong: 'Giáo dục, xuất bản, cây cối / gỗ, y dược, khởi sự' },
  { hanh: 'Hỏa', khiChat: 'Nhiệt huyết, sáng rõ, trọng lễ nghĩa', huong: 'Truyền thông, trình diễn, năng lượng, ẩm thực, công nghệ ánh sáng' },
  { hanh: 'Thổ', khiChat: 'Vững vàng, đôn hậu, đáng tin', huong: 'Bất động sản, xây dựng, nông nghiệp, quản trị, trung gian' },
  { hanh: 'Kim', khiChat: 'Quyết đoán, kỷ luật, trọng nghĩa', huong: 'Tài chính, cơ khí / kim loại, luật, y tế' },
  { hanh: 'Thủy', khiChat: 'Linh hoạt, trí tuệ, giỏi giao tiếp', huong: 'Thương mại, vận tải, du lịch, nghiên cứu, các nghề “chảy” (nước, dữ liệu)' },
];

// Tam Hợp — 4 cục, cấu trúc Sinh–Vượng–Mộ (hop-tuoi.md §2).
const TAM_HOP: { nhom: string; cuc: string; svm: string; y: string }[] = [
  { nhom: 'Thân – Tý – Thìn', cuc: 'Thủy cục', svm: 'Thân (Sinh) → Tý (Vượng) → Thìn (Mộ)', y: 'Trí tuệ, linh hoạt, dòng chảy bền — hợp tư duy, kế hoạch dài hơi.' },
  { nhom: 'Dần – Ngọ – Tuất', cuc: 'Hỏa cục', svm: 'Dần (Sinh) → Ngọ (Vượng) → Tuất (Mộ)', y: 'Nhiệt huyết, hành động, sức bật — hợp khởi sự, lan toả.' },
  { nhom: 'Tỵ – Dậu – Sửu', cuc: 'Kim cục', svm: 'Tỵ (Sinh) → Dậu (Vượng) → Sửu (Mộ)', y: 'Kỷ luật, quyết đoán, kết tinh — hợp chuyên môn, độ chính xác.' },
  { nhom: 'Hợi – Mão – Mùi', cuc: 'Mộc cục', svm: 'Hợi (Sinh) → Mão (Vượng) → Mùi (Mộ)', y: 'Sinh sôi, nhân hoà, vun đắp — hợp nuôi dưỡng, sáng tạo mềm.' },
];

// Lục Xung — 6 cặp, hai cơ chế khác nhau (hop-tuoi.md §4).
const LUC_XUNG: { cap: string; coChe: string }[] = [
  { cap: 'Tý – Ngọ', coChe: 'Đối khắc về hành: Thủy ⇄ Hỏa' },
  { cap: 'Mão – Dậu', coChe: 'Đối khắc về hành: Mộc ⇄ Kim' },
  { cap: 'Dần – Thân', coChe: 'Đối khắc về hành: Mộc ⇄ Kim' },
  { cap: 'Tỵ – Hợi', coChe: 'Đối khắc về hành: Hỏa ⇄ Thủy' },
  { cap: 'Sửu – Mùi', coChe: 'Cùng hành Thổ → xung “mộ khố” (tàng can va nhau), không phải đối khắc về hành' },
  { cap: 'Thìn – Tuất', coChe: 'Cùng hành Thổ → xung “mộ khố” (tàng can va nhau), không phải đối khắc về hành' },
];

// 4 bộ canon nền — tên từ bat-tu.md dòng 15; đóng góp nêu ở mức phổ biến, có hedge.
const CANON: { ten: string; han: string; dongGop: string }[] = [
  {
    ten: 'Uyên Hải Tử Bình',
    han: '淵海子平',
    dongGop:
      'Tương truyền là một trong những bộ sớm hệ thống hoá phương pháp Tử Bình — lấy Can Ngày (Nhật Chủ) làm gốc để luận cả lá số.',
  },
  {
    ten: 'Tam Mệnh Thông Hội',
    han: '三命通會',
    dongGop:
      'Bộ hợp tuyển đồ sộ, tổng hợp nhiều thuyết mệnh lý theo truyền thống; cũng là nguồn tra của phần lớn bảng Thần Sát.',
  },
  {
    ten: 'Tử Bình Chân Thuyên',
    han: '子平真詮',
    dongGop:
      'Theo truyền thống, bàn sâu về “cách cục” và cách chọn Dụng Thần — phần khó nhất của môn này.',
  },
  {
    ten: 'Trích Thiên Tủy',
    han: '滴天髓',
    dongGop:
      'Theo truyền thống, luận tinh tế về khí và thế của Ngũ Hành: vượng suy, hàn nóng, sinh khắc chế hoá.',
  },
];

// Sổ tay thuật ngữ (≥15 mục).
const GLOSSARY: { term: string; def: string }[] = [
  { term: 'Bát Tự / Tứ Trụ (八字 / 四柱)', def: '“Tám chữ” của bốn trụ Năm – Tháng – Ngày – Giờ; mỗi trụ 1 Thiên Can + 1 Địa Chi.' },
  { term: 'Thiên Can (天干)', def: '10 can: Giáp, Ất, Bính, Đinh, Mậu, Kỷ, Canh, Tân, Nhâm, Quý — mỗi can một hành, một âm/dương.' },
  { term: 'Địa Chi (地支)', def: '12 chi (12 con giáp): Tý, Sửu, Dần… mỗi chi một hành chính và ẩn chứa tàng can.' },
  { term: 'Nhật Chủ (日主)', def: 'Thiên Can của trụ Ngày — đại diện cho “tôi”, điểm neo để đọc cả lá số.' },
  { term: 'Tàng Can (藏干)', def: 'Các Thiên Can “ẩn” bên trong một Địa Chi; lý do một chi có thể mang theo nhiều hành.' },
  { term: 'Thập Thần (十神)', def: '10 tên gọi cho quan hệ Ngũ Hành giữa mỗi chữ với Nhật Chủ, gom thành 5 nhóm.' },
  { term: 'Tỷ Kiếp · Thực Thương · Tài · Quan Sát · Ấn', def: '5 nhóm Thập Thần: đồng hành, tôi sinh, tôi khắc, khắc tôi, sinh tôi.' },
  { term: 'Vượng / Nhược', def: 'Nhật Chủ mạnh (vượng) hay yếu (nhược); phải biết trước khi luận tốt/xấu.' },
  { term: 'Đắc lệnh / đắc địa / đắc thế', def: 'Ba căn cứ đánh giá vượng/nhược: được mùa, có gốc rễ, và đông vây cánh.' },
  { term: 'Vượng – Tướng – Hưu – Tù – Tử', def: 'Năm trạng thái của một hành theo mùa, dùng để xét “đắc lệnh”.' },
  { term: 'Dụng Thần (用神)', def: 'Hành làm lá số cân bằng và vận hành tốt nhất — ví như “vị thuốc”.' },
  { term: 'Hỷ Dụng / Kỵ Thần', def: 'Hành có lợi (Hỷ Dụng) và hành bất lợi (Kỵ) cho lá số.' },
  { term: 'Phù–ức / điều hậu / thông quan', def: 'Ba lối chọn Dụng Thần: nâng–ép, điều hoà nóng–lạnh, bắc cầu giữa hai hành khắc nhau.' },
  { term: 'Vòng Trường Sinh (十二長生)', def: '12 pha khí của Nhật Chủ trên mỗi chi, từ Trường Sinh tới Dưỡng — vòng lên xuống như đời cây.' },
  { term: 'Thần Sát (神煞)', def: 'Các “sao” tượng trưng tra theo bảng cố định; lớp phụ tô màu, không thay phần lõi.' },
  { term: 'Đại Vận (大運)', def: 'Từng giai đoạn khoảng 10 năm của cuộc đời, đi qua các trụ Can–Chi.' },
  { term: 'Lưu Niên (流年)', def: 'Can–Chi của từng năm, tương tác với lá số gốc và đại vận.' },
  { term: 'Tam Hợp / Lục Hợp / Lục Xung / Lục Hại', def: 'Các quan hệ hợp và xung giữa các Địa Chi trong lá số.' },
  { term: 'Lục Thập Hoa Giáp (六十花甲)', def: '60 tổ hợp Can–Chi quay vòng, lặp lại sau 60 năm.' },
];

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS = [
  {
    q: 'Bát Tự là gì?',
    a: 'Bát Tự (八字) nghĩa là 8 chữ. Mỗi trụ trong 4 trụ có 1 Thiên Can (天干, gồm 10 can: Giáp, Ất, Bính, Đinh, Mậu, Kỷ, Canh, Tân, Nhâm, Quý) và 1 Địa Chi (地支, gồm 12 chi: Tý, Sửu, Dần, Mão...). Tổng cộng 8 ký tự.',
  },
  {
    q: 'Ngũ Hành là gì?',
    a: '5 yếu tố cơ bản: Kim (kim loại), Mộc (cây), Thủy (nước), Hỏa (lửa), Thổ (đất). Chúng tương sinh, tương khắc lẫn nhau. Mỗi Can/Chi mang một hành. Sự cân bằng giữa các hành trong lá Bát Tự cho biết thiên hướng, điểm thừa, điểm thiếu.',
  },
  {
    q: 'Ý nghĩa từng trụ?',
    a: 'Trụ Năm: Tổ tiên, vận thiếu thời, môi trường xuất thân. Trụ Tháng: Cha mẹ, anh chị em, vận thanh niên. Trụ Ngày: Bản thân (Can ngày = Nhật Chủ), vợ/chồng, trung niên. Trụ Giờ: Con cái, vận về già, di sản để lại.',
  },
  {
    q: 'Khác gì Tử Vi?',
    a: 'Tử Vi đọc qua hệ thống sao trên 12 cung. Bát Tự đọc qua cân bằng Ngũ Hành trong 4 trụ. Hai hệ có thể bổ sung cho nhau: Tử Vi mạnh ở chi tiết lĩnh vực, Bát Tự mạnh ở năng lượng tổng thể.',
  },
  {
    q: 'Nhật Chủ là gì và vì sao quan trọng nhất?',
    a: 'Nhật Chủ (日主) là Thiên Can của trụ Ngày — đại diện cho "tôi". Trường phái Tử Bình lấy Nhật Chủ làm gốc, rồi xét 7 chữ còn lại quan hệ ngũ hành thế nào với nó. Trước khi luận tốt/xấu phải biết Nhật Chủ mạnh (vượng) hay yếu (nhược), vì cùng một mối quan hệ nhưng với thân vượng và thân nhược lại luận khác nhau, thậm chí ngược nhau.',
  },
  {
    q: 'Thân vượng, thân nhược nghĩa là gì?',
    a: 'Là độ mạnh-yếu của Nhật Chủ. Căn cứ chính: mùa sinh (Chi Tháng) có nâng đỡ hành Nhật Chủ không, có "gốc rễ" trong tàng can các chi không, và số lượng phe sinh-trợ so với phe khắc-tiết-hao. Đếm số chữ mỗi hành chỉ là gợi ý thô; đánh giá đúng phải xét cả mùa, gốc rễ và tổ hợp. Đây là cách hiểu tham khảo, không phải phán định.',
  },
  {
    q: 'Dụng Thần là gì?',
    a: 'Dụng Thần (用神) là hành làm lá số cân bằng và vận hành tốt nhất — ví như "vị thuốc" cho lá số. Nguyên tắc phổ biến (phù-ức): thân nhược thì dùng hành sinh/trợ Nhật Chủ; thân vượng thì dùng hành tiết/khắc/hao bớt. Đây là phần khó và dễ sai nhất, các trường phái có thể chọn khác nhau, nên chỉ nên xem là một cách luận có cơ sở, không tuyệt đối.',
  },
  {
    q: 'Tàng can là gì?',
    a: 'Tàng can (藏干) là các Thiên Can "ẩn" bên trong một Địa Chi. Đó là lý do một chi tuy có một hành chính nhưng vẫn "chứa" thêm vài hành khác. Ví dụ Sửu có hành chính là Thổ nhưng tàng Quý (Thủy), Tân (Kim) và Kỷ (Thổ). Nhờ tàng can mà người luận biết Nhật Chủ có "gốc rễ" trong các chi hay không (đắc địa) — một căn cứ quan trọng khi xét vượng/nhược.',
  },
  {
    q: 'Vòng Trường Sinh là gì?',
    a: 'Vòng Trường Sinh (十二長生) mô tả 12 pha khí của Nhật Chủ khi đặt trên mỗi Địa Chi, theo thứ tự: Trường Sinh, Mộc Dục, Quan Đới, Lâm Quan, Đế Vượng, Suy, Bệnh, Tử, Mộ, Tuyệt, Thai, Dưỡng. Đây là vòng lên rồi xuống của "khí", giống bốn mùa của một đời cây, dùng để cảm nhận Nhật Chủ ở trụ đó đang mạnh hay yếu. Lưu ý: pha "Tử" hay "Mộ" chỉ nói về cường độ khí đang thu lại, hoàn toàn không phải điềm chết chóc.',
  },
  {
    q: 'Thần Sát (Đào Hoa, Quý Nhân...) có quyết định số mệnh không?',
    a: 'Không. Thần Sát là lớp phụ "tô màu" cho lá số, tra theo bảng cố định (theo Can Ngày hoặc theo Chi), không thay phần lõi là Thập Thần và Dụng Thần. Ví dụ Thiên Ất Quý Nhân chỉ ý quý nhân phù trợ, Đào Hoa nói về sức hút và duyên. Chỉ nên dùng để tham khảo thêm, không dùng riêng để hù dọa hay quyết định điều gì.',
  },
  {
    q: 'Bát Tự có cần đúng giờ sinh không?',
    a: 'Có, và khá quan trọng. Trụ Giờ là một trong bốn trụ, tức khoảng một phần tư thông tin của lá số (ứng với con cái, vận về già và phần "đầu ra" của đời người). Sai giờ thì sai cả trụ Giờ; và vì giờ đổi theo mỗi canh giờ (khoảng 2 tiếng), lệch giờ có thể kéo theo lệch cả cách luận Thập Thần, vượng/nhược và Dụng Thần. Nếu không chắc giờ sinh, nên xem phần luận theo giờ là tương đối và cố gắng tra lại giấy tờ khai sinh.',
  },
];

const JSONLD = [
  article({
    headline: 'Bát Tự Tứ Trụ: nền tảng cho người mới',
    description:
      'Bát Tự (Tứ Trụ) từ nền tảng tới chuyên sâu: 10 Thiên Can, 12 Địa Chi, tàng can, Thập Thần, Dụng Thần, Vòng Trường Sinh, Thần Sát, Đại Vận – Lưu Niên. Góc nhìn để hiểu mình, không phán số mệnh.',
    url: '/learn/bat-tu',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Bát Tự Tứ Trụ', url: '/learn/bat-tu' },
  ]),
  faqPage(FAQS),
];

export default function LearnBatTuPage() {
  return (
    <LearnArticle
      eyebrow="Đông phương · Trung Hoa"
      title={
        <>
          Bát Tự <span className="bg-gold-gradient bg-clip-text text-transparent">Tứ Trụ</span>
          {/* Wave 52-C — consistent BETA badge: nav dropdown labels "Bát Tự (beta)"
              and methodology table marks the row beta, so this page should match. */}
          <span
            className="ml-3 inline-flex translate-y-[-4px] items-center rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 align-middle font-mono text-[12px] uppercase tracking-[0.12em] text-amber-300"
            aria-label="Tính năng đang trong giai đoạn beta"
          >
            beta
          </span>
        </>
      }
      standfirst={
        <>
          "Bát Tự" = 8 chữ. Đây là 4 cặp Thiên Can + Địa Chi tương ứng với Năm, Tháng, Ngày,
          Giờ sinh, tạo nên 4 trụ soi thiên hướng năng lượng Ngũ Hành lúc bạn sinh ra.
        </>
      }
      readMeta="18 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Bát Tự Tứ Trụ' },
      ]}
      relatedLenses={relatedLearnLenses('bat-tu')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Nhập ngày giờ sinh, hệ thống lập 4 trụ Năm, Tháng, Ngày, Giờ và phân tích cân bằng Ngũ Hành. Bạn xem Bát Tự đầy đủ trước khi đọc luận giải chi tiết.',
        href: '/reading/new?method=bat-tu',
        label: 'Xem Bát Tự của bạn',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <BatTuFrame />,
        },
        {
          id: 'coi-nguon',
          tocLabel: 'Cội nguồn sách vở',
          heading: 'Bát Tự đến từ đâu',
          children: (
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Bát Tự không do một người nghĩ ra trong một đêm. Nó lớn dần qua nhiều đời, được ghi
                chép và bàn cãi trong một số bộ sách nền mà tới nay người học vẫn quay về. Bốn bộ hay
                được nhắc nhất:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-foreground">
                      <th className="py-2 pr-4 font-semibold">Bộ sách</th>
                      <th className="py-2 font-semibold">Đóng góp (theo truyền thống)</th>
                    </tr>
                  </thead>
                  <tbody className="align-top">
                    {CANON.map((c, i) => (
                      <tr key={c.ten} className={i < CANON.length - 1 ? 'border-b border-border/60' : ''}>
                        <td className="py-2 pr-4">
                          <span className="font-medium text-foreground">{c.ten}</span>{' '}
                          <span className="text-muted-foreground">({c.han})</span>
                        </td>
                        <td className="py-2">{c.dongGop}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="rounded-lg border border-border bg-card/40 p-4 text-sm">
                Vì là sách cổ, truyền qua nhiều bản, chi tiết tác giả và niên đại nhiều chỗ vẫn còn
                tranh cãi. Ở đây chỉ nêu đóng góp ở mức phổ biến, theo truyền thống — không khẳng
                định một chiều.
              </p>
            </div>
          ),
        },
        {
          id: 'so-do-tu-tru',
          tocLabel: 'Sơ đồ Tứ Trụ',
          heading: 'Sơ đồ 4 trụ',
          children: (
            <div className="rounded-xl border border-border bg-card/40 p-6 sm:p-8">
              <InfographicBatTu />
            </div>
          ),
        },
        {
          id: 'bang-chu-cai',
          tocLabel: '10 Can · 12 Chi',
          heading: 'Bảng chữ cái của hệ thống: 10 Can và 12 Chi',
          children: (
            <div className="space-y-6 leading-relaxed text-muted-foreground">
              <p>
                Tám chữ của một lá số được viết bằng đúng hai bảng chữ cái:{' '}
                <strong className="text-foreground">10 Thiên Can</strong> và{' '}
                <strong className="text-foreground">12 Địa Chi</strong>. Nắm hai bảng này là nắm nửa
                phần gốc của môn học.
              </p>

              <div className="space-y-2">
                <p className="font-heading text-base text-foreground">10 Thiên Can</p>
                <p className="text-sm">
                  Mỗi can mang một hành và một tính âm/dương. Quy ước: can đứng lẻ là Dương, can đứng
                  chẵn là Âm.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-foreground">
                        <th className="py-2 pr-4 font-semibold">Can</th>
                        <th className="py-2 pr-4 font-semibold">Hành</th>
                        <th className="py-2 pr-4 font-semibold">Âm/Dương</th>
                        <th className="py-2 pr-4 font-semibold">Hình tượng</th>
                        <th className="py-2 font-semibold">Khí chất (xu hướng)</th>
                      </tr>
                    </thead>
                    <tbody className="align-top">
                      {CAN_ROWS.map((r, i) => (
                        <tr key={r.can} className={i < CAN_ROWS.length - 1 ? 'border-b border-border/60' : ''}>
                          <td className="py-2 pr-4 font-medium text-foreground">{r.can}</td>
                          <td className="py-2 pr-4">{r.hanh}</td>
                          <td className="py-2 pr-4">{r.am}</td>
                          <td className="py-2 pr-4">{CAN_PLAIN[r.can]?.hinh}</td>
                          <td className="py-2">{CAN_PLAIN[r.can]?.blurb}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-heading text-base text-foreground">12 Địa Chi (12 con giáp)</p>
                <p className="text-sm">
                  Mỗi chi gắn một con vật, một hành chính, một phương vị và một quãng mùa trong năm.
                  Cột "mã" là slug engine dùng để tra cứu.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-foreground">
                        <th className="py-2 pr-4 font-semibold">Chi</th>
                        <th className="py-2 pr-4 font-semibold">Con giáp</th>
                        <th className="py-2 pr-4 font-semibold">Hành</th>
                        <th className="py-2 pr-4 font-semibold">Âm/Dương</th>
                        <th className="py-2 pr-4 font-semibold">Phương vị</th>
                        <th className="py-2 pr-4 font-semibold">Mùa/khí</th>
                        <th className="py-2 font-semibold">Mã</th>
                      </tr>
                    </thead>
                    <tbody className="align-top">
                      {CHI_ROWS.map((r, i) => (
                        <tr key={r.chi} className={i < CHI_ROWS.length - 1 ? 'border-b border-border/60' : ''}>
                          <td className="py-2 pr-4 font-medium text-foreground">{r.chi}</td>
                          <td className="py-2 pr-4">{r.giap}</td>
                          <td className="py-2 pr-4">{r.hanh}</td>
                          <td className="py-2 pr-4">{r.am}</td>
                          <td className="py-2 pr-4">{r.huong}</td>
                          <td className="py-2 pr-4">{r.mua}</td>
                          <td className="py-2 font-mono text-xs text-muted-foreground">{r.slug}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-2 rounded-lg border border-border bg-card/40 p-4 text-sm">
                <p>
                  <strong className="text-foreground">Giờ Tý bắt đầu từ 23h.</strong> Theo quy ước
                  lịch Việt mà công cụ này dùng, 23h đã bước sang ngày mới (và trụ Ngày mới). Đây là
                  quy ước có chủ đích, không phải lỗi; một số sách và vùng miền chọn mốc khác.
                </p>
                <p>
                  <strong className="text-foreground">Mèo hay Thỏ?</strong> Chi thứ tư ở Việt Nam là
                  con Mèo; ở Trung Hoa và phần lớn Á Đông là con Thỏ. Đây là khác biệt văn hoá, không
                  phải đúng/sai.
                </p>
                <p>
                  <strong className="text-foreground">Dễ nhầm mã:</strong> Tý viết là{' '}
                  <span className="font-mono text-xs">ty</span>, còn Tỵ (con Rắn) viết là{' '}
                  <span className="font-mono text-xs">ti</span>.
                </p>
              </div>
            </div>
          ),
        },
        {
          id: 'tang-can',
          tocLabel: 'Tàng can',
          heading: 'Tàng can — vì sao một Chi chứa nhiều hành',
          children: (
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Một Địa Chi không chỉ mang đúng một hành. Bên trong mỗi chi còn "cất" một hoặc vài
                Thiên Can, gọi là <strong className="text-foreground">tàng can (藏干)</strong> — can
                ẩn. Vì thế một chi tuy có một hành chính vẫn "chứa" thêm vài hành khác từ các can nằm
                bên trong nó.
              </p>
              <p>
                Điều này không phải chi tiết vụn vặt. Nhờ tàng can mà Nhật Chủ mới có{' '}
                <strong className="text-foreground">"gốc rễ"</strong> trong các chi (gọi là đắc địa,
                thông căn) — một trong ba căn cứ chính để xét thân vượng hay nhược.
              </p>
              <p>
                Ví dụ rõ nhất là bốn chi Thổ — Sửu, Mùi, Thìn, Tuất — thường được ví như những{' '}
                <strong className="text-foreground">"kho" (mộ khố)</strong>, mỗi kho cất mấy can:
              </p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Sửu (hành chính Thổ) tàng Quý (Thủy), Tân (Kim), Kỷ (Thổ).</li>
                <li>Mùi (hành chính Thổ) tàng Đinh (Hỏa), Ất (Mộc), Kỷ (Thổ).</li>
                <li>Thìn (hành chính Thổ) tàng Ất (Mộc), Quý (Thủy), Mậu (Thổ).</li>
                <li>Tuất (hành chính Thổ) tàng Tân (Kim), Đinh (Hỏa), Mậu (Thổ).</li>
              </ul>
              <p className="rounded-lg border border-border bg-card/40 p-4 text-sm">
                Các chi còn lại cũng có tàng can riêng theo bảng cổ; bài này chỉ nêu khái niệm và bốn
                "kho" Thổ làm ví dụ, không liệt kê bảng đầy đủ để tránh sa vào chi tiết dễ sai. Khi
                hai kho đối nhau (Sửu–Mùi, Thìn–Tuất) thì chính các can ẩn bên trong va nhau — đó là
                "xung mộ khố" ở phần Hợp–Xung bên dưới.
              </p>
            </div>
          ),
        },
        {
          id: 'nhat-chu-vuong-nhuoc',
          tocLabel: 'Nhật Chủ & vượng nhược',
          heading: 'Nhật Chủ — và chuyện vượng hay nhược',
          children: (
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Trường phái <strong className="text-foreground">Tử Bình</strong> lấy{' '}
                <strong className="text-foreground">Thiên Can của trụ Ngày</strong> làm{' '}
                <strong className="text-foreground">Nhật Chủ (日主)</strong> — tức "tôi". Sau đó
                người luận xét quan hệ Ngũ Hành của 7 chữ còn lại trong lá số với Nhật Chủ. Nói cách
                khác, cả lá Bát Tự được đọc qua lăng kính "tôi đứng giữa, mọi thứ quanh tôi đang nâng
                đỡ hay đang khắc chế tôi".
              </p>
              <p>
                Trước khi nói tốt hay xấu, bước quan trọng nhất là biết Nhật Chủ{' '}
                <strong className="text-foreground">mạnh (vượng)</strong> hay{' '}
                <strong className="text-foreground">yếu (nhược)</strong>. Lý do: cùng một mối quan hệ
                ngũ hành, nhưng với thân vượng và thân nhược lại luận theo hướng khác nhau, đôi khi
                ngược hẳn. Có ba căn cứ chính, xếp theo mức ảnh hưởng:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong className="text-foreground">Đắc lệnh (mùa sinh):</strong> yếu tố mạnh nhất —
                  Chi Tháng có mang mùa nâng đỡ hành của Nhật Chủ không (các trạng thái theo mùa:
                  Vượng, Tướng, Hưu, Tù, Tử).
                </li>
                <li>
                  <strong className="text-foreground">Đắc địa (gốc rễ):</strong> Nhật Chủ có "rễ"
                  trong tàng can (can ẩn) của các chi không — cùng hành hoặc hành sinh ra nó.
                </li>
                <li>
                  <strong className="text-foreground">Đắc thế (vây cánh):</strong> số lượng phe
                  sinh-trợ (Tỷ Kiếp, Ấn) so với phe khắc-tiết-hao (Quan Sát, Tài, Thực Thương).
                </li>
              </ul>
              <p className="rounded-lg border border-border bg-card/40 p-4 text-sm">
                Lưu ý: chỉ "đếm số chữ mỗi hành" rồi kết luận là cách làm thô và dễ sai. Đánh giá
                đúng phải xét cả mùa, gốc rễ và tổ hợp. Đây là cách hiểu mang tính tham khảo để hiểu
                mình rõ hơn, không phải lời phán về số mệnh.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <BatTuDepth />,
        },
        {
          id: 'thap-than-dung-than',
          tocLabel: 'Thập Thần & Dụng Thần',
          heading: 'Thập Thần và Dụng Thần — bộ khung luận giải',
          children: (
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Từ quan hệ Ngũ Hành giữa mỗi chữ với Nhật Chủ, người ta quy về{' '}
                <strong className="text-foreground">Thập Thần (十神)</strong> — 10 mối quan hệ, gom
                thành 5 nhóm, mỗi nhóm một cặp âm–dương. Mỗi nhóm gắn với một mảng đời sống (đây là{' '}
                <em>xu hướng tham khảo</em>, không phải định mệnh):
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-foreground">
                      <th className="py-2 pr-4 font-semibold">Nhóm</th>
                      <th className="py-2 pr-4 font-semibold">Quan hệ với Nhật Chủ</th>
                      <th className="py-2 font-semibold">Mảng đời sống (xu hướng)</th>
                    </tr>
                  </thead>
                  <tbody className="align-top">
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Tỷ Kiếp</td>
                      <td className="py-2 pr-4">Đồng hành với Nhật Chủ</td>
                      <td className="py-2">Bản thân, anh em, bạn bè, cạnh tranh, hợp tác</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Thực Thương</td>
                      <td className="py-2 pr-4">Nhật Chủ sinh ra nó</td>
                      <td className="py-2">Tài năng, sáng tạo, diễn đạt, "đầu ra"</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Tài</td>
                      <td className="py-2 pr-4">Nhật Chủ khắc nó</td>
                      <td className="py-2">Tiền bạc, của cải, hưởng thụ, quản trị nguồn lực</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Quan Sát</td>
                      <td className="py-2 pr-4">Nó khắc Nhật Chủ</td>
                      <td className="py-2">Sự nghiệp, địa vị, kỷ luật, áp lực</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-foreground">Ấn</td>
                      <td className="py-2 pr-4">Nó sinh Nhật Chủ</td>
                      <td className="py-2">Học vấn, che chở, tri thức, sự nâng đỡ</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Nhưng Thập Thần không có "tốt" hay "xấu" cố định. Luận chuẩn là{' '}
                <strong className="text-foreground">
                  Thập Thần × (thân vượng hay nhược) × Dụng Thần
                </strong>
                . Đây là lúc <strong className="text-foreground">Dụng Thần (用神)</strong> bước vào:
                đó là hành giúp lá số cân bằng và vận hành tốt nhất, ví như "vị thuốc". Nguyên tắc phổ
                biến nhất (phù-ức): thân nhược thì dùng hành sinh/trợ Nhật Chủ; thân vượng thì dùng
                hành tiết bớt, khắc hoặc hao. Ngoài ra còn các cách điều hậu (quá lạnh cần Hỏa, quá
                nóng cần Thủy), thông quan, bệnh-dược.
              </p>
              <p className="rounded-lg border border-border bg-card/40 p-4 text-sm">
                Chọn Dụng Thần là phần khó và dễ sai nhất; có trường phái chọn khác nhau cho cùng một
                lá số. Vì vậy một bài đọc tử tế sẽ trình bày có cơ sở (vượng/nhược + mùa) và nói rõ
                đây là một cách luận phổ biến, không tuyệt đối — chứ không bán chuyện "đổi mệnh, giải
                hạn".
              </p>
            </div>
          ),
        },
        {
          id: 'thap-than-hai-mat',
          tocLabel: '10 Thập Thần · hai mặt',
          heading: 'Mười Thập Thần — mặt mạnh và mặt cần giữ',
          children: (
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Không thần nào toàn tốt hay toàn xấu. Mỗi thần vừa có một sức mạnh, vừa có một mặt cần
                giữ khi nó quá đà. Đọc bảng này như đọc tính cách con người: điểm mạnh và điểm dễ vấp
                nằm cạnh nhau. (Thất Sát còn gọi là Thiên Quan; Thiên Ấn còn gọi là Kiêu Thần.)
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-foreground">
                      <th className="py-2 pr-4 font-semibold">Thập Thần</th>
                      <th className="py-2 pr-4 font-semibold">Nhóm</th>
                      <th className="py-2 pr-4 font-semibold">Mặt mạnh</th>
                      <th className="py-2 font-semibold">Mặt cần lưu ý</th>
                    </tr>
                  </thead>
                  <tbody className="align-top">
                    {THAP_THAN_HAI_MAT.map((t, i) => (
                      <tr
                        key={t.ten}
                        className={i < THAP_THAN_HAI_MAT.length - 1 ? 'border-b border-border/60' : ''}
                      >
                        <td className="py-2 pr-4 font-medium text-foreground">{t.ten}</td>
                        <td className="py-2 pr-4">{t.nhom}</td>
                        <td className="py-2 pr-4">{t.manh}</td>
                        <td className="py-2">{t.luuy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="rounded-lg border border-border bg-card/40 p-4 text-sm">
                Mặt nào "trồi lên" còn tuỳ lá số: cùng một Thất Sát, thân vượng có thể biến nó thành
                bản lĩnh, thân nhược lại thấy nó như áp lực. Vậy nên đọc từng thần luôn phải soi cùng
                vượng/nhược và Dụng Thần, đừng gán tốt/xấu tuyệt đối.
              </p>
            </div>
          ),
        },
        {
          id: 'vong-truong-sinh',
          tocLabel: 'Vòng Trường Sinh',
          heading: 'Vòng Trường Sinh — 12 pha của khí',
          children: (
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Vòng Trường Sinh (十二長生) đặt Nhật Chủ lên mỗi Địa Chi rồi hỏi: ở đây "khí" của tôi
                đang ở pha nào — vừa nhú, đang lên, đỉnh, hay đang lắng? Mười hai pha nối thành một
                vòng giống một đời cây, từ nảy mầm đến thu tàng rồi lại hoài thai:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-foreground">
                      <th className="py-2 pr-4 font-semibold">#</th>
                      <th className="py-2 pr-4 font-semibold">Pha</th>
                      <th className="py-2 font-semibold">Ý nghĩa (cường độ khí)</th>
                    </tr>
                  </thead>
                  <tbody className="align-top">
                    {TRUONG_SINH_12.map((p, i) => (
                      <tr key={p.pha} className={i < TRUONG_SINH_12.length - 1 ? 'border-b border-border/60' : ''}>
                        <td className="py-2 pr-4 font-mono text-xs text-gold-700">{i + 1}</td>
                        <td className="py-2 pr-4 font-medium text-foreground">{p.pha}</td>
                        <td className="py-2">{p.y}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="rounded-lg border border-border bg-card/40 p-4 text-sm">
                Đọc kỹ chỗ này: "Tử" và "Mộ" nói về cường độ khí đang thu lại,{' '}
                <strong className="text-foreground">không phải điềm chết chóc</strong> hay tuổi thọ.
                Cũng như mùa đông không phải "cái chết" của cây, chỉ là lúc thu mình để bật lại. Pha
                này góp phần cảm nhận Nhật Chủ mạnh hay yếu, chứ không phán chuyện sống chết.
              </p>
            </div>
          ),
        },
        {
          id: 'than-sat',
          tocLabel: 'Thần Sát',
          heading: 'Thần Sát — đọc thế nào cho tỉnh',
          children: (
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Thần Sát (神煞) là những "sao" tượng trưng, tra theo bảng cố định (theo Can Ngày hoặc
                theo Chi). Đây là lớp phụ tô màu cho lá số,{' '}
                <strong className="text-foreground">không thay phần lõi</strong> là Thập Thần và Dụng
                Thần. Công cụ Bát Tự ở đây tính sẵn năm sao hay gặp:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-foreground">
                      <th className="py-2 pr-4 font-semibold">Thần Sát</th>
                      <th className="py-2 pr-4 font-semibold">Tra theo</th>
                      <th className="py-2 font-semibold">Ý nghĩa (tham khảo)</th>
                    </tr>
                  </thead>
                  <tbody className="align-top">
                    {THAN_SAT.map((s, i) => (
                      <tr key={s.ten} className={i < THAN_SAT.length - 1 ? 'border-b border-border/60' : ''}>
                        <td className="py-2 pr-4 font-medium text-foreground">{s.ten}</td>
                        <td className="py-2 pr-4">{s.tra}</td>
                        <td className="py-2">{s.y}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="rounded-lg border border-border bg-card/40 p-4 text-sm">
                Truyền thống còn nhiều sao khác — ví dụ Kình Dương (Dương Nhận): cương mãnh, sắc bén,
                dễ cực đoan. Nhưng công cụ này{' '}
                <strong className="text-foreground">hiện chưa tính Kình Dương</strong>, nên bài đọc
                không dùng nó để luận. Nói chung, Thần Sát chỉ để tham khảo thêm; tuyệt đối không dùng
                riêng một sao để hù doạ hay chốt một chuyện gì.
              </p>
            </div>
          ),
        },
        {
          id: 'ngu-hanh-nhat-chu',
          tocLabel: 'Ngũ hành Nhật Chủ',
          heading: 'Ngũ hành Nhật Chủ — khí chất và môi trường hợp',
          children: (
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Hành của Nhật Chủ (Mộc, Hỏa, Thổ, Kim, Thủy) gợi một "chất nền" về khí chất, và những
                môi trường mà chất đó dễ nở ra. Đọc bảng dưới như một{' '}
                <strong className="text-foreground">gợi ý để tự quan sát mình</strong>, không phải
                lời chỉ định "phải làm nghề này":
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-foreground">
                      <th className="py-2 pr-4 font-semibold">Hành Nhật Chủ</th>
                      <th className="py-2 pr-4 font-semibold">Khí chất (xu hướng)</th>
                      <th className="py-2 font-semibold">Môi trường / hướng dễ hợp (gợi ý)</th>
                    </tr>
                  </thead>
                  <tbody className="align-top">
                    {NGU_HANH_KHI_CHAT.map((h, i) => (
                      <tr key={h.hanh} className={i < NGU_HANH_KHI_CHAT.length - 1 ? 'border-b border-border/60' : ''}>
                        <td className="py-2 pr-4 font-medium text-foreground">{h.hanh}</td>
                        <td className="py-2 pr-4">{h.khiChat}</td>
                        <td className="py-2">{h.huong}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="rounded-lg border border-border bg-card/40 p-4 text-sm">
                Nếu một hành trong lá số hơi thiếu, cách hiểu lành mạnh là{' '}
                <strong className="text-foreground">gợi ý cân bằng môi trường và thói quen</strong>{' '}
                (chọn màu sắc, không gian, nếp sinh hoạt nghiêng về hành đó) — chứ không phải "bổ
                khuyết để đổi vận, cải mệnh". Bát Tự soi thiên hướng để bạn tự điều chỉnh, không hứa
                đổi số.
              </p>
            </div>
          ),
        },
        {
          id: 'dai-van-luu-nien',
          tocLabel: 'Đại Vận · Lưu Niên',
          heading: 'Đại Vận và Lưu Niên — lá số động theo thời gian',
          children: (
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Bốn trụ là bản đồ bạn sinh ra cùng, và nó không đổi. Nhưng đời người thì chạy theo
                thời gian, và Tử Bình đọc chuyển động đó qua hai lớp: Đại Vận và Lưu Niên.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong className="text-foreground">Đại Vận (大運):</strong> từng chặng khoảng 10
                  năm. Nó khởi đi thuận hay nghịch tuỳ giới tính và tính âm/dương của năm sinh, rồi
                  lần lượt đi qua các cặp Can–Chi. Với mỗi chặng, người luận hỏi: Can–Chi của đại vận
                  này là Hỷ Dụng (hợp) hay Kỵ (nghịch) với lá số gốc?
                </li>
                <li>
                  <strong className="text-foreground">Lưu Niên (流年):</strong> từng năm một. Can–Chi
                  của năm gặp lá số gốc và đại vận đang đi, tạo nên "chủ đề" nổi lên của năm đó.
                </li>
              </ul>
              <p className="rounded-lg border border-border bg-card/40 p-4 text-sm">
                Vận là bối cảnh, không phải định mệnh. Cùng một đại vận "đẹp", người chuẩn bị tốt và
                người buông xuôi vẫn đi tới hai chỗ khác nhau. Đây là chỗ Bát Tự mở ra một cái nhìn
                theo thời gian, để bạn liệu cơm gắp mắm — không phải để ngồi chờ số.
              </p>
            </div>
          ),
        },
        {
          id: 'hop-xung-chi',
          tocLabel: 'Hợp · Xung các Chi',
          heading: 'Hợp và Xung giữa các Chi trong lá số',
          children: (
            <div className="space-y-5 leading-relaxed text-muted-foreground">
              <p>
                Bốn Địa Chi trong một lá số không đứng riêng — chúng hút hoặc đẩy nhau theo đúng luật
                hợp–xung của Can Chi. Khi hai (hoặc ba) chi hợp lại, chúng có thể tụ thành một hành
                mạnh lên, làm lệch cán cân vượng/nhược và đổi cả lựa chọn Dụng Thần. Khi hai chi xung
                nhau, mảng đời sống của hai trụ đó (ví dụ trụ Ngày và trụ Giờ) dễ có độ căng cần điều
                tiết.
              </p>

              <div className="space-y-2">
                <p className="font-heading text-base text-foreground">Tam Hợp — ba chi tụ thành một "cục"</p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-foreground">
                        <th className="py-2 pr-4 font-semibold">Nhóm</th>
                        <th className="py-2 pr-4 font-semibold">Cục</th>
                        <th className="py-2 pr-4 font-semibold">Sinh → Vượng → Mộ</th>
                        <th className="py-2 font-semibold">Ý (xu hướng)</th>
                      </tr>
                    </thead>
                    <tbody className="align-top">
                      {TAM_HOP.map((g, i) => (
                        <tr key={g.cuc} className={i < TAM_HOP.length - 1 ? 'border-b border-border/60' : ''}>
                          <td className="py-2 pr-4 font-medium text-foreground">{g.nhom}</td>
                          <td className="py-2 pr-4">{g.cuc}</td>
                          <td className="py-2 pr-4">{g.svm}</td>
                          <td className="py-2">{g.y}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm">
                  Mỗi nhóm có cấu trúc Sinh → Vượng → Mộ của hành cục. Chỉ cần hai trong ba (bán hợp)
                  đã có lực; đủ ba thì mạnh nhất.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-heading text-base text-foreground">Lục Hợp — sáu cặp bổ trợ</p>
                <p className="text-sm">
                  Sáu cặp chi hợp đôi: Tý–Sửu, Dần–Hợi, Mão–Tuất, Thìn–Dậu, Tỵ–Thân, Ngọ–Mùi. Theo
                  một cách luận phổ biến, mỗi cặp "hoá" về một hành (Tý–Sửu hoá Thổ, Dần–Hợi hoá Mộc,
                  Mão–Tuất hoá Hỏa, Thìn–Dậu hoá Kim, Tỵ–Thân hoá Thủy, Ngọ–Mùi hoá Hỏa). Nhưng
                  chuyện hoá thành hành gì là chỗ các trường phái{' '}
                  <strong className="text-foreground">không nhất trí</strong>, nên chỉ nên xem là
                  tham khảo. Riêng Tỵ–Thân vừa hợp vừa có mặt "hình" — một cặp ân oán đan xen, cần
                  điều tiết.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-heading text-base text-foreground">Lục Xung — sáu cặp đối nhịp</p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-foreground">
                        <th className="py-2 pr-4 font-semibold">Cặp</th>
                        <th className="py-2 font-semibold">Cơ chế xung</th>
                      </tr>
                    </thead>
                    <tbody className="align-top">
                      {LUC_XUNG.map((x, i) => (
                        <tr key={x.cap} className={i < LUC_XUNG.length - 1 ? 'border-b border-border/60' : ''}>
                          <td className="py-2 pr-4 font-medium text-foreground">{x.cap}</td>
                          <td className="py-2">{x.coChe}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm">
                  "Xung" ở đây nói về hai nhịp khác nhau dễ cọ, không phải "khắc" định mệnh. Trong lá
                  số nó chỉ là điểm cần chú ý, hoàn toàn có thể hoá thành sự bù trừ.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-heading text-base text-foreground">Lục Hại — sáu cặp dễ lệch kênh</p>
                <p className="text-sm">
                  Sáu cặp: Tý–Mùi, Sửu–Ngọ, Dần–Tỵ, Mão–Thìn, Thân–Hợi, Dậu–Tuất. Nhẹ hơn xung, kiểu
                  khó chịu âm ỉ (dễ hiểu lầm) hơn là va chạm bùng nổ; hướng lành mạnh là nói rõ kỳ
                  vọng, kiên nhẫn với nhau.
                </p>
              </div>

              <p className="rounded-lg border border-border bg-card/40 p-4 text-sm">
                Canon còn hai lớp nữa: <strong className="text-foreground">Tương Hình</strong> (刑 —
                các chi tự "cọ" nhau, như Dần–Tỵ–Thân, Sửu–Tuất–Mùi) và{' '}
                <strong className="text-foreground">Thiên Can ngũ hợp</strong> (5 cặp Can hoá hành,
                như Giáp–Kỷ hoá Thổ). Cả hai là kiến thức nền; công cụ Hợp tuổi miễn phí trên
                hieu.asia hiện chưa tính hai lớp này, nên bài chỉ nêu để trọn vẹn, không dùng để luận.
              </p>
            </div>
          ),
        },
        {
          id: 'vi-du-doc',
          tocLabel: 'Ví dụ đọc lá số',
          heading: 'Ví dụ đọc khung 4 trụ (mức khái niệm)',
          children: (
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Gộp mọi thứ lại, đây là cách một lá số được đọc — ở mức khung, không dựng ngày giờ cụ
                thể (tính can chi bằng tay rất dễ sai). Giả sử Nhật Chủ là{' '}
                <strong className="text-foreground">Giáp Mộc</strong> (dương Mộc, hình cây đại thụ),
                sinh vào giữa mùa thu.
              </p>
              <ol className="list-decimal space-y-2.5 pl-5">
                <li>
                  <strong className="text-foreground">Được mùa không (đắc lệnh)?</strong> Mùa thu là
                  mùa Kim vượng, mà Kim khắc Mộc, nên Mộc "thất lệnh" — nghiêng về nhược. Đây là yếu
                  tố nặng ký nhất.
                </li>
                <li>
                  <strong className="text-foreground">Có gốc rễ không (đắc địa)?</strong> Xem trong
                  tàng can của các chi còn lại có Mộc (hoặc Thủy sinh Mộc) làm "rễ" không. Giả sử rễ
                  mỏng, càng nghiêng nhược.
                </li>
                <li>
                  <strong className="text-foreground">Đông vây cánh không (đắc thế)?</strong> Đếm phe
                  trợ (Tỷ Kiếp là Mộc, Ấn là Thủy) so với phe hao (Kim khắc, Hỏa tiết, Thổ hao). Giả
                  sử Kim nhiều, tạm kết luận thân nhược.
                </li>
                <li>
                  <strong className="text-foreground">Quy ra Thập Thần và chọn Dụng Thần.</strong> Với
                  Giáp Mộc, cái Kim đang vượng chính là Quan Sát (Kim khắc Mộc; Canh dương = Thất Sát,
                  Tân âm = Chính Quan). Thân nhược mà Quan Sát mạnh thì đó là áp lực đè, không "gánh"
                  nổi. Cách hoá phổ biến: dùng Thủy làm Dụng Thần — vừa là Ấn sinh Mộc, vừa "hoá Sát"
                  (Kim sinh Thủy, Thủy sinh Mộc), một mũi tên trúng hai đích; hoặc dùng Mộc (Tỷ Kiếp)
                  để đỡ thân.
                </li>
              </ol>
              <p>
                Rồi soi theo thời gian: nếu Đại Vận đi vào phương Thủy/Mộc (Hỷ Dụng) thì Nhật Chủ được
                tiếp sức, thường thuận hơn; vào Kim/Thổ (Kỵ) thì nhiều thử thách, cần chủ động hơn.
              </p>
              <p className="rounded-lg border border-border bg-card/40 p-4 text-sm">
                Nhấn lại: mọi con số ở trên là giả định để minh hoạ mạch luận, không phải một lá số
                thật. Và "thân nhược" không có nghĩa "xấu" — nó chỉ nói lá số cần được trợ, giống một
                cái cây cần thêm nước và nắng. Đây là bước luận dựa trên dữ kiện, không phải máy tự
                chốt; các trường phái có thể luận khác nhau.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <BatTuWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <BatTuRecall />,
        },
        {
          id: 'so-tay-thuat-ngu',
          tocLabel: 'Sổ tay thuật ngữ',
          heading: 'Sổ tay thuật ngữ',
          children: (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Những từ Hán–Việt hay gặp, gom lại một chỗ để tra nhanh.
              </p>
              <dl className="space-y-2.5">
                {GLOSSARY.map((g) => (
                  <div key={g.term} className="rounded-lg border border-border bg-card/40 p-3">
                    <dt className="text-sm font-medium text-foreground">{g.term}</dt>
                    <dd className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{g.def}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ),
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
          children: <BatTuChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
