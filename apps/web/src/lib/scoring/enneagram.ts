// hieu.asia — Enneagram (9 nhóm tính cách) scoring + question set + nội dung.
//
// Self-contained, mirrors lib/scoring/mbti.ts in shape: a 36-item Likert quiz
// (4 per type) + a scorer that maps answers → 1 trong 9 nhóm + cánh (wing).
//
// Enneagram là mô hình PHÁT TRIỂN BẢN THÂN miền công cộng — không bản quyền.
// Framing "không bói toán": mô tả động cơ và xu hướng tâm lý trên một phổ, không
// phải nhãn cố định hay số mệnh. Phần nội dung 9 nhóm (TYPE_META) là tĩnh, xác
// định; bản đọc sâu (nếu có) sinh từ `/tools/enneagram-read`.

import type { QuizPage, QuizChoice } from '@/components/tools/PersonalityQuiz';

export type EnneagramType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export const ENNEAGRAM_TYPE_ORDER: EnneagramType[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// Hai nhóm liền kề (cánh) của mỗi nhóm, vòng tròn 1↔9. [trái, phải].
const WINGS: Record<EnneagramType, [EnneagramType, EnneagramType]> = {
  1: [9, 2],
  2: [1, 3],
  3: [2, 4],
  4: [3, 5],
  5: [4, 6],
  6: [5, 7],
  7: [6, 8],
  8: [7, 9],
  9: [8, 1],
};

// 4 câu/nhóm. Mỗi câu là một phát biểu ngôi-thứ-nhất đặc trưng cho nhóm đó; đồng
// ý cao (5) → nghiêng về nhóm đó. Không có câu đảo điểm — mỗi câu cộng cho 1 nhóm.
const STATEMENTS: Record<EnneagramType, string[]> = {
  1: [
    'Tôi luôn để ý những chỗ chưa đúng và muốn sửa cho thật chuẩn.',
    'Tôi tự đặt cho mình tiêu chuẩn cao và khó hài lòng khi làm qua loa.',
    'Có một giọng nói bên trong thường nhắc tôi lẽ ra nên làm tốt hơn.',
    'Tôi tin có cách đúng để làm mọi việc, và tôi cố sống theo nguyên tắc đó.',
  ],
  2: [
    'Tôi thường nhận ra nhu cầu của người khác trước cả nhu cầu của mình.',
    'Tôi thấy hạnh phúc khi được quan tâm và giúp đỡ mọi người.',
    'Tôi mong được người khác cần đến và quý mến.',
    'Đôi khi tôi khó nói "không" vì sợ làm người khác thất vọng.',
  ],
  3: [
    'Tôi đặt mục tiêu rõ ràng và rất khao khát đạt được thành công.',
    'Tôi để ý hình ảnh của mình trong mắt người khác và muốn được công nhận.',
    'Tôi thích nghi nhanh để trở thành phiên bản hiệu quả nhất trong từng hoàn cảnh.',
    'Tôi ngại thất bại và hay gắn giá trị bản thân với thành tích đạt được.',
  ],
  4: [
    'Tôi cảm nhận cảm xúc rất sâu và muốn sống thật với chính mình.',
    'Tôi thấy mình khác biệt, đôi khi như thiếu một điều gì đó mà người khác có.',
    'Tôi bị thu hút bởi cái đẹp, sự sâu sắc và ý nghĩa mang tính cá nhân.',
    'Tâm trạng tôi lên xuống nhiều và tôi trân trọng sự chân thật trong cảm xúc.',
  ],
  5: [
    'Tôi thích quan sát và tìm hiểu cặn kẽ trước khi nhập cuộc.',
    'Tôi cần nhiều thời gian một mình để nạp lại năng lượng và suy nghĩ.',
    'Tôi coi trọng kiến thức và muốn thật sự am hiểu lĩnh vực của mình.',
    'Tôi khá riêng tư và dè dặt khi chia sẻ năng lượng hay cảm xúc.',
  ],
  6: [
    'Tôi hay lường trước điều có thể trục trặc để chuẩn bị phương án.',
    'Tôi trung thành và đáng tin với những người, những nơi tôi gắn bó.',
    'Tôi thấy an tâm hơn khi có kế hoạch rõ ràng và người đáng tin bên cạnh.',
    'Tôi hay phân vân, cân nhắc nhiều trước khi đặt niềm tin vào điều gì.',
  ],
  7: [
    'Tôi luôn hào hứng với ý tưởng mới và nhiều dự định thú vị phía trước.',
    'Tôi thích sự tự do, đa dạng và ngại bị gò bó hay buồn chán.',
    'Khi gặp chuyện khó chịu, tôi nhanh chóng chuyển sang điều tích cực hơn.',
    'Tôi sợ bỏ lỡ trải nghiệm hay ho và muốn nếm thử thật nhiều thứ.',
  ],
  8: [
    'Tôi thẳng thắn, mạnh mẽ và sẵn sàng đứng ra khi cần quyết định.',
    'Tôi muốn tự làm chủ cuộc đời mình và không thích bị kiểm soát.',
    'Tôi bảo vệ người yếu thế và khó chịu trước sự bất công.',
    'Tôi bộc lộ ý kiến dứt khoát và không ngại va chạm để bảo vệ điều mình tin.',
  ],
  9: [
    'Tôi coi trọng sự hoà hợp và thường tránh xung đột, căng thẳng.',
    'Tôi dễ thấu hiểu nhiều phía và hay làm cầu nối để mọi người hoà thuận.',
    'Tôi đôi khi trì hoãn hoặc xuôi theo người khác để giữ yên ổn.',
    'Tôi điềm tĩnh, dễ chịu và mong mọi việc diễn ra êm đềm.',
  ],
};

interface EnneagramItem {
  name: string;
  type: EnneagramType;
  title: string;
}

// Trộn xen kẽ theo vòng (round-robin) để mỗi trang gồm các nhóm khác nhau, không
// trang nào lộ rõ một nhóm: [t1_01..t9_01, t1_02..t9_02, …].
const ITEMS: EnneagramItem[] = [];
for (let round = 0; round < 4; round += 1) {
  for (const t of ENNEAGRAM_TYPE_ORDER) {
    ITEMS.push({
      name: `enn_${t}_0${round + 1}`,
      type: t,
      title: STATEMENTS[t][round] ?? '',
    });
  }
}

const likert = (): QuizChoice[] => [
  { value: 1, text: 'Rất không đồng ý' },
  { value: 2, text: 'Không đồng ý' },
  { value: 3, text: 'Trung lập' },
  { value: 4, text: 'Đồng ý' },
  { value: 5, text: 'Rất đồng ý' },
];

// 6 trang × 6 câu = 36. Cắt thẳng từ ITEMS đã xen kẽ.
export const ENNEAGRAM_PAGES: QuizPage[] = [0, 1, 2, 3, 4, 5].map((pageIdx) => ({
  name: `enn_p${pageIdx + 1}`,
  title: `Phần ${pageIdx + 1}/6`,
  elements: ITEMS.slice(pageIdx * 6, pageIdx * 6 + 6).map((it) => ({
    name: it.name,
    title: it.title,
    choices: likert(),
  })),
}));

export interface EnneagramScoreWithMeta {
  type: EnneagramType; // nhóm chính 1–9
  wing: EnneagramType; // cánh (nhóm liền kề điểm cao hơn)
  label: string; // ví dụ "8w9"
  scores: Record<EnneagramType, number>; // điểm 0–100 mỗi nhóm
  total_items: number;
  total_answered: number;
}

const zeroScores = (): Record<EnneagramType, number> => ({
  1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0,
});

function pickPrimary(scores: Record<EnneagramType, number>): EnneagramType {
  let primary: EnneagramType = 1;
  for (const t of ENNEAGRAM_TYPE_ORDER) {
    if (scores[t] > scores[primary]) primary = t;
  }
  return primary;
}

function pickWing(scores: Record<EnneagramType, number>, primary: EnneagramType): EnneagramType {
  const [left, right] = WINGS[primary];
  return scores[right] > scores[left] ? right : left;
}

/**
 * Cộng điểm Likert 1–5 theo từng nhóm, chuẩn hoá về 0–100 (tối thiểu mọi câu = 0,
 * tối đa = 100), chọn nhóm điểm cao nhất làm nhóm chính + cánh là nhóm liền kề
 * điểm cao hơn. Bền với câu thiếu (nhóm chưa trả lời → 0).
 */
export function scoreEnneagram(answers: Record<string, number>): EnneagramScoreWithMeta {
  const raw = zeroScores();
  const count = zeroScores();
  let total_items = 0;
  let total_answered = 0;

  for (const it of ITEMS) {
    total_items += 1;
    const r = answers[it.name];
    if (typeof r !== 'number' || r < 1 || r > 5) continue;
    total_answered += 1;
    raw[it.type] += r;
    count[it.type] += 1;
  }

  const scores = zeroScores();
  for (const t of ENNEAGRAM_TYPE_ORDER) {
    const n = count[t];
    scores[t] = n > 0 ? Math.round(((raw[t] - n) / (n * 4)) * 100) : 0;
  }

  const type = pickPrimary(scores);
  const wing = pickWing(scores, type);
  return { type, wing, label: `${type}w${wing}`, scores, total_items, total_answered };
}

/** Dựng lại kết quả từ link chia sẻ "/enneagram?r=..." (9 số 0–100, đúng thứ tự 1→9). */
export function scoreFromShare(vals: number[]): EnneagramScoreWithMeta | null {
  if (vals.length !== 9 || vals.some((n) => !Number.isFinite(n) || n < 0 || n > 100)) return null;
  const scores = zeroScores();
  ENNEAGRAM_TYPE_ORDER.forEach((t, i) => {
    scores[t] = vals[i] ?? 0;
  });
  const type = pickPrimary(scores);
  const wing = pickWing(scores, type);
  return { type, wing, label: `${type}w${wing}`, scores, total_items: 36, total_answered: 36 };
}

export interface EnneagramTypeMeta {
  name: string; // "Người Thủ Lĩnh"
  nick: string; // tên gọi khác (eyebrow)
  center: string; // "Bản năng" | "Cảm xúc" | "Tư duy"
  tagline: string;
  desire: string;
  fear: string;
  strengths: string;
  growth: string;
  atBest: string;
  underStress: string;
}

// Ba trung tâm (triad): Bản năng (bụng) 8-9-1 · Cảm xúc (tim) 2-3-4 · Tư duy (đầu) 5-6-7.
export const TYPE_META: Record<EnneagramType, EnneagramTypeMeta> = {
  1: {
    name: 'Người Cải Cách',
    nick: 'Người theo chuẩn mực',
    center: 'Bản năng',
    tagline: 'Nguyên tắc, chỉn chu, luôn muốn mọi thứ tốt hơn.',
    desire: 'Sống đúng đắn, chính trực và có ích; làm mọi việc cho thật chuẩn.',
    fear: 'Sợ mình hư hỏng, sai trái hay thiếu sót về mặt đạo đức.',
    strengths: 'Có trách nhiệm, kỷ luật, công bằng và đáng tin; nhìn ra cách cải thiện mọi thứ.',
    growth: 'Học cách bao dung với lỗi lầm — của mình và người khác — và chấp nhận "đủ tốt" thay vì hoàn hảo.',
    atBest: 'Khôn ngoan, khoan dung, truyền cảm hứng sống tử tế mà không khắt khe.',
    underStress: 'Dễ phê phán, cứng nhắc và bực bội với những gì chưa hoàn hảo.',
  },
  2: {
    name: 'Người Giúp Đỡ',
    nick: 'Người tận tâm',
    center: 'Cảm xúc',
    tagline: 'Ấm áp, tận tâm, sống vì người khác.',
    desire: 'Được yêu thương và cảm thấy mình cần thiết với mọi người.',
    fear: 'Sợ không được yêu quý, bị bỏ rơi hay trở thành người thừa.',
    strengths: 'Đồng cảm, hào phóng, tinh tế với nhu cầu người khác; gắn kết mọi người.',
    growth: 'Học cách nhận ra và chăm sóc nhu cầu của chính mình, cho đi mà không mong đền đáp.',
    atBest: 'Yêu thương vô điều kiện, biết tự chăm mình nên giúp người một cách bền vững.',
    underStress: 'Hi sinh quá mức, ngầm mong được ghi nhận, dễ tủi thân khi không được đáp lại.',
  },
  3: {
    name: 'Người Thành Đạt',
    nick: 'Người tham vọng',
    center: 'Cảm xúc',
    tagline: 'Năng động, hướng mục tiêu, khao khát thành công.',
    desire: 'Thấy mình có giá trị qua thành tựu và được người khác công nhận.',
    fear: 'Sợ thất bại, sợ vô giá trị hay tầm thường trong mắt người khác.',
    strengths: 'Nghị lực, thích nghi nhanh, hiệu quả; biết truyền động lực và dẫn dắt.',
    growth: 'Học cách tách giá trị bản thân khỏi thành tích và sống thật với cảm xúc bên trong.',
    atBest: 'Tự tin, chân thành, dùng năng lực của mình để nâng đỡ người khác.',
    underStress: 'Chạy theo hình ảnh, làm việc quá sức và né tránh cảm xúc thật.',
  },
  4: {
    name: 'Người Cá Tính',
    nick: 'Người lãng mạn',
    center: 'Cảm xúc',
    tagline: 'Sâu sắc, giàu cảm xúc, khao khát chân thật.',
    desire: 'Tìm ra bản sắc riêng và sống thật với chiều sâu cảm xúc của mình.',
    fear: 'Sợ mình tầm thường, không có dấu ấn hay đánh mất bản sắc.',
    strengths: 'Nhạy cảm, sáng tạo, chân thành; thấu hiểu chiều sâu cảm xúc con người.',
    growth: 'Học cách trân trọng điều mình đang có thay vì mãi tiếc nuối điều còn thiếu.',
    atBest: 'Sáng tạo, đồng cảm, biến cảm xúc thành cái đẹp và sự kết nối.',
    underStress: 'Chìm trong tâm trạng, hay so sánh và thấy mình lạc lõng.',
  },
  5: {
    name: 'Người Quan Sát',
    nick: 'Nhà nghiên cứu',
    center: 'Tư duy',
    tagline: 'Ham hiểu biết, độc lập, điềm tĩnh quan sát.',
    desire: 'Thấu hiểu thế giới và đủ năng lực để tự chủ, không phụ thuộc.',
    fear: 'Sợ bị cạn kiệt, bất lực hay tràn ngập bởi đòi hỏi bên ngoài.',
    strengths: 'Sâu sắc, khách quan, ham học; nhìn vấn đề thấu đáo và bình tĩnh.',
    growth: 'Học cách bước vào cuộc sống và chia sẻ cảm xúc thay vì chỉ đứng ngoài quan sát.',
    atBest: 'Minh triết, sáng tạo và hào phóng chia sẻ hiểu biết của mình.',
    underStress: 'Thu mình, tích trữ thời gian và năng lượng, xa cách về cảm xúc.',
  },
  6: {
    name: 'Người Trung Thành',
    nick: 'Người tận tuỵ',
    center: 'Tư duy',
    tagline: 'Tận tâm, đáng tin, luôn lường trước rủi ro.',
    desire: 'Có được sự an toàn, chỗ dựa và niềm tin vững chắc.',
    fear: 'Sợ mất chỗ dựa, không còn gì để bấu víu hay tin tưởng.',
    strengths: 'Trung thành, trách nhiệm, cảnh giác; chuẩn bị kỹ và luôn giữ lời.',
    growth: 'Học cách tin vào bản thân và phân biệt nỗi lo tưởng tượng với rủi ro thật.',
    atBest: 'Can đảm, đáng tin, gắn kết tập thể bằng sự tận tuỵ.',
    underStress: 'Lo xa, hoài nghi, do dự hoặc phản ứng thái quá vì sợ hãi.',
  },
  7: {
    name: 'Người Nhiệt Tình',
    nick: 'Người phiêu lưu',
    center: 'Tư duy',
    tagline: 'Lạc quan, nhiều năng lượng, ưa trải nghiệm.',
    desire: 'Được tự do, tận hưởng và sống một cuộc đời phong phú, trọn vẹn.',
    fear: 'Sợ bị mắc kẹt, thiếu thốn hay chìm trong đau khổ, buồn chán.',
    strengths: 'Lạc quan, sáng tạo, linh hoạt; truyền năng lượng và mở ra khả năng mới.',
    growth: 'Học cách ở lại với hiện tại và đi tới cùng thay vì luôn chạy theo điều mới.',
    atBest: 'Biết ơn, tập trung, biến ý tưởng thành niềm vui thiết thực.',
    underStress: 'Phân tán, bốc đồng và né tránh những cảm xúc khó chịu.',
  },
  8: {
    name: 'Người Thủ Lĩnh',
    nick: 'Người bảo hộ',
    center: 'Bản năng',
    tagline: 'Mạnh mẽ, quả quyết, che chở người yếu thế.',
    desire: 'Tự làm chủ đời mình và bảo vệ những gì, những người mình trân trọng.',
    fear: 'Sợ bị kiểm soát, tổn thương hay phải phụ thuộc vào người khác.',
    strengths: 'Quyết đoán, gan dạ, thẳng thắn; dám đứng mũi chịu sào và che chở.',
    growth: 'Học cách để lộ sự mềm yếu và tin tưởng người khác mà không thấy bị đe doạ.',
    atBest: 'Rộng lượng, che chở, dùng sức mạnh của mình để nâng đỡ người khác.',
    underStress: 'Áp đặt, nóng nảy, đề phòng và muốn kiểm soát mọi thứ.',
  },
  9: {
    name: 'Người Ôn Hòa',
    nick: 'Người kiến tạo hoà bình',
    center: 'Bản năng',
    tagline: 'Điềm đạm, dễ chịu, kiến tạo hoà hợp.',
    desire: 'Giữ được sự bình yên bên trong lẫn hoà thuận với mọi người xung quanh.',
    fear: 'Sợ mất kết nối, chia rẽ hay xung đột làm xáo trộn sự yên ổn.',
    strengths: 'Bao dung, kiên nhẫn, biết lắng nghe nhiều phía; xoa dịu và gắn kết.',
    growth: 'Học cách nói lên mong muốn của mình và hành động dứt khoát thay vì xuôi theo.',
    atBest: 'Vững vàng, hoà giải, hiện diện trọn vẹn và chủ động.',
    underStress: 'Trì hoãn, lảng tránh và chiều theo người khác để né va chạm.',
  },
};
