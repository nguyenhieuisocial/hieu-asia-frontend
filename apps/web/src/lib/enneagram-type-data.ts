// hieu.asia — Dữ liệu trang chi tiết cho 9 nhóm Enneagram (/learn/enneagram/[type]).
//
// KHÔNG bịa: toàn bộ nội dung tâm lý lấy TỪ engine `lib/scoring/enneagram.ts`
// (TYPE_META + WINGS + INTEGRATION/DISINTEGRATION — vốn đã grounded theo
// Riso–Hudson) và chỉ gói lại + sinh FAQ deterministic. Phần `workStyle` là mô
// tả XU HƯỚNG nghề (lời mình, theo khung Enneagram-at-work phổ biến, miền công
// cộng) — luôn đóng khung "xu hướng, không phán", kèm hướng phát triển.

import {
  TYPE_META,
  WINGS,
  INTEGRATION,
  DISINTEGRATION,
  ENNEAGRAM_TYPE_ORDER,
  type EnneagramType,
  type EnneagramTypeMeta,
} from '@/lib/scoring/enneagram';

export const ENNEAGRAM_SLUGS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

// Ba trung tâm (triad) — dùng để liệt kê "cùng trung tâm".
const CENTER_GROUPS: EnneagramType[][] = [
  [8, 9, 1], // Bản năng (bụng)
  [2, 3, 4], // Cảm xúc (tim)
  [5, 6, 7], // Tư duy (đầu)
];

// Xu hướng nghề nghiệp — mô tả tendency theo khung Enneagram-at-work, KHÔNG phán.
const WORK_STYLE: Record<EnneagramType, string> = {
  1: 'Toả sáng ở nơi đề cao chất lượng, chuẩn mực và sự chính trực — kiểm soát chất lượng, quy trình, pháp lý, kế toán, giáo dục. Hợp môi trường có tiêu chí đúng–sai rõ ràng; điều nên luyện là buông tiêu chuẩn "hoàn hảo" để khỏi tự bào mòn.',
  2: 'Mạnh ở những vai trò chăm sóc và kết nối con người — nhân sự, chăm sóc khách hàng, y tế, giáo dục, công tác xã hội. Hợp nơi được giúp đỡ người khác; điều nên luyện là đặt ranh giới để không gánh hết phần người khác mà quên nhu cầu của mình.',
  3: 'Bứt phá trong môi trường có mục tiêu, đo lường và cơ hội thể hiện — kinh doanh, marketing, lãnh đạo, bán hàng, thể thao. Hợp nơi ghi nhận kết quả; điều nên nhớ là giá trị bản thân không chỉ nằm ở thành tích.',
  4: 'Phát huy ở công việc sáng tạo, mang dấu ấn cá nhân — nghệ thuật, thiết kế, viết lách, âm nhạc, trị liệu tâm lý. Hợp nơi cho phép chiều sâu cảm xúc; điều nên luyện là kỷ luật để biến cảm hứng thành sản phẩm hoàn chỉnh.',
  5: 'Sâu sắc ở công việc cần phân tích, chuyên môn và tính độc lập — nghiên cứu, công nghệ, kỹ thuật, học thuật, phân tích dữ liệu. Hợp không gian yên tĩnh, tự chủ; điều nên luyện là bước ra cộng tác và chia sẻ kết quả thay vì giữ riêng.',
  6: 'Đáng tin ở vai trò cần cẩn trọng, lường rủi ro và bền bỉ — vận hành, quản trị rủi ro, an ninh, kiểm toán, hỗ trợ kỹ thuật. Hợp đội ngũ rõ vai trò; điều nên luyện là tin vào phán đoán của chính mình thay vì hỏi xin trấn an.',
  7: 'Bùng nổ trong môi trường đa dạng, nhiều ý tưởng — khởi nghiệp, truyền thông, tổ chức sự kiện, sáng tạo nội dung, du lịch. Hợp công việc mới mẻ liên tục; điều nên luyện là kỷ luật đi tới cùng thay vì nhảy sang việc mới khi vừa thấy chán.',
  8: 'Mạnh ở vị trí cần quyết đoán, chịu trách nhiệm và dẫn dắt — quản lý, khởi nghiệp, đàm phán, vận hành, các vai trò bảo vệ. Hợp nơi được tự chủ; điều nên luyện là lắng nghe và tin tưởng để không lấn át đội ngũ.',
  9: 'Vững vàng ở vai trò cần điều phối, hoà giải và kiên nhẫn — điều phối dự án, tư vấn, nhân sự, dịch vụ, chăm sóc cộng đồng. Hợp môi trường hợp tác ít xung đột; điều nên luyện là chủ động nêu ý kiến và ưu tiên việc của chính mình.',
};

export interface TypeRef {
  n: EnneagramType;
  slug: string;
  name: string;
}

export interface EnneagramTypeData {
  n: EnneagramType;
  meta: EnneagramTypeMeta;
  wingLeft: TypeRef;
  wingRight: TypeRef;
  growthArrow: TypeRef; // integration (an toàn / trưởng thành)
  stressArrow: TypeRef; // disintegration (căng thẳng)
  centerMates: TypeRef[]; // 2 nhóm còn lại cùng trung tâm
  others: TypeRef[]; // 8 nhóm còn lại
  workStyle: string;
  seoTitle: string;
  seoDescription: string;
  faqs: { q: string; a: string }[];
}

const refOf = (n: EnneagramType): TypeRef => ({ n, slug: String(n), name: TYPE_META[n].name });

export const listTypes = (): TypeRef[] => ENNEAGRAM_TYPE_ORDER.map(refOf);

function toType(slug: string): EnneagramType | null {
  const n = Number(slug);
  return Number.isInteger(n) && ENNEAGRAM_TYPE_ORDER.includes(n as EnneagramType)
    ? (n as EnneagramType)
    : null;
}

export function buildType(slug: string): EnneagramTypeData | null {
  const n = toType(slug);
  if (!n) return null;

  const meta = TYPE_META[n];
  const [l, r] = WINGS[n];
  const integ = INTEGRATION[n];
  const disint = DISINTEGRATION[n];
  const group = CENTER_GROUPS.find((g) => g.includes(n)) ?? [];
  const centerMates = group.filter((t) => t !== n).map(refOf);
  const others = ENNEAGRAM_TYPE_ORDER.filter((t) => t !== n).map(refOf);
  const workStyle = WORK_STYLE[n];

  const seoTitle = `Enneagram Nhóm ${n} — ${meta.name}`;
  const seoDescription = `Nhóm ${n} Enneagram (${meta.name}): khao khát, nỗi sợ cốt lõi, điểm mạnh, hướng phát triển, cánh và mũi tên phát triển. Mô tả xu hướng, không phán số mệnh.`;

  const faqs: { q: string; a: string }[] = [
    {
      q: `Enneagram nhóm ${n} — "${meta.name}" — là người thế nào?`,
      a: `Nhóm ${n} thuộc trung tâm ${meta.center}. ${meta.tagline} Động lực sâu nhất: ${meta.desire} Nỗi sợ nền tảng: ${meta.fear}`,
    },
    {
      q: `Điểm mạnh và điều nhóm ${n} cần lưu ý là gì?`,
      a: `Điểm mạnh nổi bật: ${meta.strengths} Hướng phát triển: ${meta.growth}`,
    },
    {
      q: `Cánh ${n}w${l} và ${n}w${r} khác nhau ra sao?`,
      a: `Mỗi người nhóm ${n} thường nghiêng về một trong hai nhóm liền kề trên vòng tròn. Cánh ${n}w${l} pha thêm nét của ${TYPE_META[l].name} (nhóm ${l}); cánh ${n}w${r} pha thêm nét của ${TYPE_META[r].name} (nhóm ${r}). Cùng là nhóm ${n} nhưng hai cánh tạo nên sắc thái khá khác nhau.`,
    },
    {
      q: `Khi căng thẳng hay khi phát triển, nhóm ${n} thay đổi thế nào?`,
      a: `Theo các "mũi tên" của Riso–Hudson: khi an toàn và trưởng thành, nhóm ${n} hấp thụ nét tốt của ${TYPE_META[integ].name} (nhóm ${integ}); khi căng thẳng, dễ ngả sang mặt kém của ${TYPE_META[disint].name} (nhóm ${disint}). Chính vì có hướng đi này mà Enneagram thiên về phát triển, không phải dán nhãn cố định.`,
    },
    {
      q: `Nhóm ${n} hợp với công việc nào?`,
      a: `${workStyle} Đây là xu hướng tham khảo theo khung Enneagram, không phải giới hạn — người nhóm ${n} vẫn thành công ở rất nhiều lĩnh vực.`,
    },
    {
      q: `Enneagram nhóm ${n} có chính xác không?`,
      a: `Enneagram là mô hình phát triển bản thân, không phải phép đo khoa học như xét nghiệm. Kết quả phản ánh xu hướng động lực để bạn tự soi, không phải lời phán số mệnh. Hãy xem nhóm ${n} như một góc nhìn — bạn vẫn là người quyết định mình trở thành ai.`,
    },
  ];

  return {
    n,
    meta,
    wingLeft: refOf(l),
    wingRight: refOf(r),
    growthArrow: refOf(integ),
    stressArrow: refOf(disint),
    centerMates,
    others,
    workStyle,
    seoTitle,
    seoDescription,
    faqs,
  };
}
