// hieu.asia — Tarot engine (78 lá). Client-side draw, seeded shuffle.
// Brand: KHÔNG bói toán/tiên đoán — mỗi lá là một LĂNG KÍNH để tự suy ngẫm.
// Nghĩa viết theo khung "gợi ý phản tư + cách ứng xử", không phán định mệnh.

export type CardOrientation = 'upright' | 'reversed';
export type Arcana = 'major' | 'minor';
export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles';

export interface TarotCard {
  id: number;
  name: string;
  name_vi: string;
  arcana: Arcana;
  suit?: Suit;
  up: string; // gợi ý khi xuôi
  rev: string; // gợi ý khi ngược
}

export interface DrawnCard {
  card: TarotCard;
  orientation: CardOrientation;
}

const MAJOR: Omit<TarotCard, 'id' | 'arcana'>[] = [
  { name: 'The Fool', name_vi: 'Gã Khờ', up: 'khởi đầu mới, dám bước dù chưa chắc chắn', rev: 'liều lĩnh thiếu chuẩn bị; cân nhắc trước khi nhảy' },
  { name: 'The Magician', name_vi: 'Nhà Ảo Thuật', up: 'bạn đã có đủ công cụ — vấn đề là bắt tay làm', rev: 'tài nguyên bị bỏ phí hoặc dùng sai mục đích' },
  { name: 'The High Priestess', name_vi: 'Nữ Tư Tế', up: 'lắng nghe trực giác, điều chưa nói ra', rev: 'đang phớt lờ tiếng nói bên trong' },
  { name: 'The Empress', name_vi: 'Nữ Hoàng', up: 'nuôi dưỡng, sáng tạo, để mọi thứ lớn theo nhịp', rev: 'cho đi quá mức hoặc bỏ bê chăm sóc bản thân' },
  { name: 'The Emperor', name_vi: 'Hoàng Đế', up: 'cấu trúc, kỷ luật, làm chủ tình huống', rev: 'cứng nhắc hoặc kiểm soát quá tay' },
  { name: 'The Hierophant', name_vi: 'Giáo Hoàng', up: 'học từ truyền thống, người đi trước', rev: 'phá khuôn — tự tìm con đường riêng' },
  { name: 'The Lovers', name_vi: 'Đôi Tình Nhân', up: 'một lựa chọn về giá trị và sự gắn kết', rev: 'lệch giá trị; xem lại điều mình thật sự muốn' },
  { name: 'The Chariot', name_vi: 'Cỗ Xe', up: 'tiến lên bằng ý chí và tập trung', rev: 'mất hướng hoặc kéo hai phía ngược nhau' },
  { name: 'Strength', name_vi: 'Sức Mạnh', up: 'kiên nhẫn dịu dàng mạnh hơn ép buộc', rev: 'nghi ngờ bản thân; nuôi lại sự tự tin' },
  { name: 'The Hermit', name_vi: 'Ẩn Sĩ', up: 'lùi lại, dành thời gian một mình để thấy rõ', rev: 'cô lập quá mức; cần kết nối lại' },
  { name: 'Wheel of Fortune', name_vi: 'Bánh Xe Số Phận', up: 'một chu kỳ đang chuyển — thích nghi', rev: 'cảm giác mắc kẹt; điều gì lặp lại bạn nắm được' },
  { name: 'Justice', name_vi: 'Công Lý', up: 'cân nhắc công bằng, nhận trách nhiệm hệ quả', rev: 'né tránh sự thật hoặc thiên vị' },
  { name: 'The Hanged Man', name_vi: 'Người Treo Ngược', up: 'đổi góc nhìn; tạm dừng để hiểu khác đi', rev: 'trì hoãn vô ích; đã đến lúc hành động' },
  { name: 'Death', name_vi: 'Cái Chết', up: 'kết thúc để mở chỗ cho cái mới', rev: 'níu kéo điều nên buông' },
  { name: 'Temperance', name_vi: 'Tiết Độ', up: 'cân bằng, pha trộn vừa phải, đi đường dài', rev: 'thái quá hoặc mất nhịp' },
  { name: 'The Devil', name_vi: 'Ác Quỷ', up: 'nhìn lại ràng buộc/thói quen đang giữ bạn', rev: 'bắt đầu cởi bỏ một xiềng xích' },
  { name: 'The Tower', name_vi: 'Tòa Tháp', up: 'một đổ vỡ phơi bày sự thật — xây lại vững hơn', rev: 'tránh được khủng hoảng nếu chịu thay đổi sớm' },
  { name: 'The Star', name_vi: 'Ngôi Sao', up: 'hy vọng, chữa lành, niềm tin nhẹ nhõm', rev: 'mất niềm tin tạm thời; tự cho mình nghỉ' },
  { name: 'The Moon', name_vi: 'Mặt Trăng', up: 'mơ hồ, nỗi sợ chưa rõ — đừng vội kết luận', rev: 'sương mù đang tan, sự thật dần hiện' },
  { name: 'The Sun', name_vi: 'Mặt Trời', up: 'rõ ràng, sức sống, niềm vui giản dị', rev: 'lạc quan che mắt; nhìn cả mặt khuất' },
  { name: 'Judgement', name_vi: 'Phán Xét', up: 'tự nhìn lại, một lời gọi thức tỉnh', rev: 'phán xét bản thân quá nặng' },
  { name: 'The World', name_vi: 'Thế Giới', up: 'hoàn tất một chặng, trọn vẹn', rev: 'gần xong — đừng bỏ dở phút chót' },
];

const SUITS: { key: Suit; vi: string; theme: string }[] = [
  { key: 'wands', vi: 'Gậy', theme: 'hành động · đam mê · năng lượng' },
  { key: 'cups', vi: 'Cốc', theme: 'cảm xúc · quan hệ · trực giác' },
  { key: 'swords', vi: 'Kiếm', theme: 'tư duy · lời nói · xung đột' },
  { key: 'pentacles', vi: 'Tiền', theme: 'công việc · vật chất · sức khỏe' },
];
const RANKS: { vi: string; up: string; rev: string }[] = [
  { vi: 'Át', up: 'một tia khởi đầu mới', rev: 'khởi đầu bị trì hoãn hoặc bỏ lỡ' },
  { vi: 'Hai', up: 'một lựa chọn hoặc cân bằng đôi bên', rev: 'do dự, mất thăng bằng' },
  { vi: 'Ba', up: 'cùng người khác tạo ra điều gì đó', rev: 'lệch nhịp trong hợp tác' },
  { vi: 'Bốn', up: 'ổn định, nghỉ ngơi, củng cố', rev: 'trì trệ hoặc giữ khư khư' },
  { vi: 'Năm', up: 'một thử thách hoặc mất mát nhỏ', rev: 'đang hồi phục sau khó khăn' },
  { vi: 'Sáu', up: 'hài hòa, cho-nhận, tiến triển nhẹ nhàng', rev: 'mất cân bằng cho-nhận' },
  { vi: 'Bảy', up: 'kiên trì, đánh giá lại chiến lược', rev: 'nản hoặc dàn trải quá mỏng' },
  { vi: 'Tám', up: 'chuyển động nhanh, tập trung kỹ năng', rev: 'chậm lại hoặc đi sai hướng' },
  { vi: 'Chín', up: 'gần tới, bền bỉ giữ vững', rev: 'kiệt sức hoặc lo lắng dư thừa' },
  { vi: 'Mười', up: 'một chu kỳ trọn vẹn, đỉnh điểm', rev: 'gánh nặng cuối chặng; cần san sẻ' },
  { vi: 'Thị Đồng', up: 'tò mò, học hỏi, tin mới', rev: 'thiếu chín chắn hoặc phân tâm' },
  { vi: 'Hiệp Sĩ', up: 'lao tới mục tiêu đầy nhiệt', rev: 'vội vàng hoặc thiếu kiên định' },
  { vi: 'Hoàng Hậu', up: 'làm chủ bằng sự thấu cảm', rev: 'để cảm xúc lấn át phán đoán' },
  { vi: 'Vua', up: 'làm chủ trưởng thành, vững vàng', rev: 'độc đoán hoặc xa cách' },
];

function buildMinor(): Omit<TarotCard, 'id' | 'arcana'>[] {
  const out: Omit<TarotCard, 'id' | 'arcana'>[] = [];
  for (const s of SUITS) {
    for (const r of RANKS) {
      out.push({
        name: `${r.vi} of ${s.key}`,
        name_vi: `${r.vi} ${s.vi}`,
        suit: s.key,
        up: `${r.up} — về ${s.theme.split(' · ')[0]}`,
        rev: `${r.rev} (${s.vi})`,
      });
    }
  }
  return out;
}

/** Bộ bài đầy đủ 78 lá. */
export const DECK: TarotCard[] = [
  ...MAJOR.map((c, i) => ({ ...c, id: i, arcana: 'major' as const })),
  ...buildMinor().map((c, i) => ({ ...c, id: 22 + i, arcana: 'minor' as const })),
];

// Seeded RNG (mulberry32) cho draw tái lập (vd lá của ngày). Không seed → Math.random.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Rút n lá từ bộ 78. Fisher-Yates shuffle + orientation xuôi/ngược.
 * @param n số lá (1–10)
 * @param seed tùy chọn — cùng seed cho cùng kết quả (vd seed theo ngày)
 */
export function drawCards(n: number, seed?: number): DrawnCard[] {
  const count = Math.max(1, Math.min(10, Math.floor(n)));
  const rand = seed === undefined ? Math.random : mulberry32(seed);
  const deck = DECK.slice();
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = deck[i]!;
    deck[i] = deck[j]!;
    deck[j] = tmp;
  }
  return deck.slice(0, count).map((card) => ({
    card,
    orientation: rand() < 0.5 ? 'reversed' : 'upright',
  }));
}

/**
 * Lá của ngày — seed theo NGÀY (giờ VN, UTC+7) → một lá cố định suốt cả ngày,
 * CHUNG cho mọi người. KHÔNG phải tiên đoán về ngày của bạn — chỉ là một lá để
 * dừng lại và ngẫm; ý nghĩa nằm ở điều chính bạn soi thấy.
 * Thuần hàm (server-safe): cùng ngày ⇒ cùng lá + cùng chiều.
 */
export function cardOfTheDay(now: Date = new Date()): { drawn: DrawnCard; dateLabel: string } {
  const vn = new Date(now.getTime() + 7 * 3600_000); // UTC+7
  const y = vn.getUTCFullYear();
  const m = vn.getUTCMonth() + 1;
  const d = vn.getUTCDate();
  const drawn = drawCards(1, y * 10000 + m * 100 + d)[0]!;
  const dateLabel = `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
  return { drawn, dateLabel };
}
