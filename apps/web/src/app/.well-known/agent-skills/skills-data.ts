/**
 * Agent Skills Discovery — shared data for the public, read-only free tools.
 *
 * SINGLE SOURCE OF TRUTH for both:
 *   - the index handler (.well-known/agent-skills/index.json/route.ts), which
 *     hashes each SKILL.md `body` with node:crypto to emit its sha256, and
 *   - each per-tool SKILL.md handler, which returns the same `body` verbatim
 *     so the served bytes match the digest in the index.
 *
 * SAFETY: every entry here describes a PUBLIC, read-only tool. There is NO
 * auth, payment, admin, or PII-write surface exposed. The only action an agent
 * is ever told to take is "send the user to <public URL>".
 *
 * IMPORTANT: the `body` strings are served byte-for-byte. The sha256 in the
 * index is computed over the exact UTF-8 bytes of these strings. Do not
 * transform (trim/normalize/CRLF) the body anywhere in the serving path or the
 * digest will stop matching.
 */

export const SITE_ORIGIN = 'https://hieu.asia';

export interface AgentSkill {
  /** URL-safe slug; also the existing public tool route segment. */
  slug: string;
  /** Human name (matches the public tool). */
  name: string;
  /** One-line honest description for the index. */
  description: string;
  /** The public tool page the agent should send the user to. */
  toolUrl: string;
  /** Exact SKILL.md markdown served at this slug (hashed for the index). */
  body: string;
}

// --- SKILL.md bodies -------------------------------------------------------
// Each is a short, honest guide for an AI agent: what the tool does, what input
// to collect from the user, and the public URL to send them to. Vietnamese
// body with YAML-ish frontmatter (name, description).

const luoSoTuViBody = `---
name: Xem lá số Tử Vi
description: Lập & xem lá số Tử Vi Đẩu Số từ ngày giờ sinh — 12 cung, 121 sao, độ sáng, cách cục, tam phương tứ chính. Công cụ tính toán xác định.
---

# Xem lá số Tử Vi

Công cụ MIỄN PHÍ trên hieu.asia giúp người dùng lập lá số Tử Vi Đẩu Số từ ngày giờ sinh. Đây là công cụ tính toán xác định (deterministic): an 12 cung, 121 sao, độ sáng, cách cục và tam phương tứ chính. Con số là thật, không phải AI đoán.

## Nên dùng khi nào
Người dùng muốn xem lá số Tử Vi của họ, hỏi "lập lá số giúp tôi", hoặc cần biết các sao toạ thủ trong từng cung.

## Cần thu thập từ người dùng
- Ngày sinh dương lịch (ngày/tháng/năm)
- Giờ sinh (càng chính xác càng tốt)
- Giới tính

## Cách giúp người dùng
Hướng dẫn người dùng mở công cụ và nhập thông tin sinh. Gửi họ đến:

https://hieu.asia/la-so-tu-vi

Công cụ chạy ngay trên trình duyệt, không cần đăng nhập, không thu phí, không lưu dữ liệu cá nhân ra ngoài.

## Lưu ý trung thực
Lá số là phần tính toán có cơ sở; phần luận giải sâu là một sản phẩm riêng. Không hứa hẹn vận mệnh chắc chắn — đây là công cụ tham khảo văn hoá.
`;

const luoSoBatTuBody = `---
name: Xem lá số Bát Tự (Tứ Trụ)
description: Lập & xem lá số Bát Tự miễn phí — đủ 4 trụ năm/tháng/ngày/giờ (8 chữ), ngũ hành, Nhật Chủ, Thập Thần, cân bằng ngũ hành. Tính theo tiết khí.
---

# Xem lá số Bát Tự (Tứ Trụ)

Công cụ MIỄN PHÍ trên hieu.asia giúp người dùng lập lá số Bát Tự (Tứ Trụ). Trả về đủ 4 trụ năm/tháng/ngày/giờ (8 chữ), ngũ hành, Nhật Chủ, Thập Thần và cân bằng ngũ hành. Tính theo tiết khí nên chuẩn xác. Con số là thật, để người dùng tự soi.

## Nên dùng khi nào
Người dùng muốn xem Bát Tự / Tứ Trụ / "8 chữ" của họ, hỏi Nhật Chủ là gì, hoặc muốn biết ngũ hành thừa/thiếu.

## Cần thu thập từ người dùng
- Ngày sinh dương lịch (ngày/tháng/năm)
- Giờ sinh
- Giới tính

## Cách giúp người dùng
Hướng dẫn người dùng mở công cụ và nhập thông tin sinh. Gửi họ đến:

https://hieu.asia/la-so-bat-tu

Công cụ chạy ngay trên trình duyệt, không cần đăng nhập, miễn phí.

## Lưu ý trung thực
Đây là phần tính toán theo tiết khí, không phải luận giải vận hạn. Là công cụ tham khảo văn hoá, không phải lời tiên đoán chắc chắn.
`;

const tuViHomNayBody = `---
name: Tử Vi 12 con giáp hôm nay
description: Tử Vi hàng ngày cho 12 con giáp — tổng quan, sự nghiệp, tình duyên, tài lộc, sức khoẻ. Dự báo chung theo tuổi, không phải lá số cá nhân.
---

# Tử Vi 12 con giáp hôm nay

Trang MIỄN PHÍ trên hieu.asia cho biết tử vi hàng ngày của 12 con giáp: tổng quan, sự nghiệp, tình duyên, tài lộc và sức khoẻ. Đây là dự báo CHUNG theo tuổi con giáp, KHÔNG phải lá số cá nhân.

## Nên dùng khi nào
Người dùng hỏi "tử vi hôm nay của tuổi ... thế nào", muốn xem nhanh theo con giáp.

## Cần thu thập từ người dùng
- Tuổi con giáp của người dùng (Tý, Sửu, Dần, ... hoặc năm sinh để suy ra con giáp)

## Cách giúp người dùng
Gửi người dùng đến trang và để họ chọn con giáp:

https://hieu.asia/tu-vi-hom-nay

Không cần đăng nhập, miễn phí.

## Lưu ý trung thực
Đây là dự báo chung theo con giáp (12 nhóm), không cá nhân hoá theo giờ sinh. Nếu người dùng muốn thông tin riêng cho họ, hãy hướng họ tới công cụ lập lá số cá nhân.
`;

const xemNgayBody = `---
name: Xem ngày tốt theo mục đích
description: Chọn mục đích (cưới hỏi, khai trương, động thổ, nhập trạch...) để xem ngày đẹp — chấm điểm 0–100 theo Hoàng/Hắc đạo, trực ngày, sao tốt xấu, cảnh báo Tam Tai/Kim Lâu/Hoang Ốc.
---

# Xem ngày tốt theo mục đích

Công cụ MIỄN PHÍ trên hieu.asia giúp người dùng chọn ngày đẹp cho một mục đích cụ thể (cưới hỏi, khai trương, động thổ, nhập trạch, v.v.). Mỗi ngày được chấm điểm 0–100 theo Hoàng/Hắc đạo, trực ngày, sao tốt xấu, kèm cảnh báo Tam Tai, Kim Lâu, Hoang Ốc. Tham khảo lịch pháp truyền thống.

## Nên dùng khi nào
Người dùng hỏi "ngày nào tốt để cưới / khai trương / động thổ", muốn chọn ngày lành.

## Cần thu thập từ người dùng
- Mục đích (cưới hỏi, khai trương, động thổ, nhập trạch, v.v.)
- Năm sinh (tuỳ chọn — để cảnh báo Tam Tai / Kim Lâu / Hoang Ốc theo tuổi)

## Cách giúp người dùng
Gửi người dùng đến công cụ, chọn mục đích và (tuỳ chọn) nhập năm sinh:

https://hieu.asia/xem-ngay

Không cần đăng nhập, miễn phí.

## Lưu ý trung thực
Điểm số dựa trên lịch pháp truyền thống và mang tính tham khảo. Đây không phải bảo đảm kết quả; người dùng nên cân nhắc cùng điều kiện thực tế của mình.
`;

export const AGENT_SKILLS: AgentSkill[] = [
  {
    slug: 'la-so-tu-vi',
    name: 'Xem lá số Tử Vi',
    description:
      'Lập & xem lá số Tử Vi Đẩu Số từ ngày giờ sinh — 12 cung, 121 sao, độ sáng, cách cục và tam phương tứ chính. Công cụ tính toán xác định, không phân tích.',
    toolUrl: `${SITE_ORIGIN}/la-so-tu-vi`,
    body: luoSoTuViBody,
  },
  {
    slug: 'la-so-bat-tu',
    name: 'Xem lá số Bát Tự (Tứ Trụ)',
    description:
      'Lập & xem lá số Bát Tự miễn phí — đủ 4 trụ năm/tháng/ngày/giờ (8 chữ), ngũ hành, Nhật Chủ, Thập Thần, cân bằng ngũ hành. Tính theo tiết khí (chuẩn xác). Con số là thật, để bạn tự soi.',
    toolUrl: `${SITE_ORIGIN}/la-so-bat-tu`,
    body: luoSoBatTuBody,
  },
  {
    slug: 'tu-vi-hom-nay',
    name: 'Tử Vi 12 con giáp hôm nay',
    description:
      'Tử Vi hàng ngày cho 12 con giáp — tổng quan, sự nghiệp, tình duyên, tài lộc, sức khoẻ. Dự báo chung theo tuổi (không phải lá số cá nhân).',
    toolUrl: `${SITE_ORIGIN}/tu-vi-hom-nay`,
    body: tuViHomNayBody,
  },
  {
    slug: 'xem-ngay',
    name: 'Xem ngày tốt theo mục đích',
    description:
      'Chọn mục đích (cưới hỏi, khai trương, động thổ, nhập trạch, v.v.) để xem ngày đẹp — chấm điểm 0–100 theo Hoàng/Hắc đạo, trực ngày, sao tốt xấu, cảnh báo Tam Tai, Kim Lâu, Hoang Ốc. Tham khảo lịch pháp truyền thống.',
    toolUrl: `${SITE_ORIGIN}/xem-ngay`,
    body: xemNgayBody,
  },
];

export function skillMdUrl(slug: string): string {
  return `${SITE_ORIGIN}/.well-known/agent-skills/${slug}/SKILL.md`;
}
