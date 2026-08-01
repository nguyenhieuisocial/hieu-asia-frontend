/**
 * Định danh gửi kèm cho quota Mentor theo NGÀY ở worker api-gateway
 * (backend `middleware/mentorQuota.ts` — FREE 5 câu/ngày · thuê bao 30 câu/ngày,
 * reset 00:00 giờ VN).
 *
 * Worker nhận diện theo thứ tự X-User-Id → X-Session-Id → IP. Proxy chọn
 * X-User-Id theo: user đăng nhập đã verify (GoTrue) → chủ reading đã resolve
 * (có thể là anon_<uuid>) → x-anon-id của chính khách (shape-guarded). Luôn kèm
 * X-Client-Ip (header do Vercel đặt, client không đặt được) để nhánh IP cuối
 * cùng là IP thật của khách — cf-connecting-ip mà worker thấy chỉ là egress IP
 * của Vercel, thiếu nó mọi khách ẩn danh gộp chung một pool 5 câu/ngày.
 *
 * User đăng nhập đứng TRƯỚC chủ reading: gói trả tiền nằm trên auth user id —
 * đảo lại thì subscriber chat trên reading ẩn danh (đã claim) bị đếm như free.
 */

import { getSessionFromRequest, isValidAnonId } from '@/lib/reasoning/session-auth';

export async function mentorQuotaIdentityHeaders(
  req: Request,
  readingOwnerId?: string,
): Promise<Record<string, string>> {
  const headers: Record<string, string> = {};

  let quotaUserId: string | undefined;
  try {
    // Không tốn round-trip khi thiếu Authorization — getSessionFromRequest
    // trả null ngay trước khi gọi GoTrue.
    const session = await getSessionFromRequest(req);
    if (session) quotaUserId = session.userId;
  } catch {
    // GoTrue không với tới — rơi xuống chủ reading / anon id / IP.
  }
  if (!quotaUserId) quotaUserId = readingOwnerId;
  if (!quotaUserId) {
    const anon = req.headers.get('x-anon-id')?.trim();
    if (anon && isValidAnonId(anon)) quotaUserId = anon;
  }
  if (quotaUserId) headers['X-User-Id'] = quotaUserId;

  const ip =
    req.headers.get('x-real-ip')?.trim() ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (ip) headers['X-Client-Ip'] = ip;

  return headers;
}
